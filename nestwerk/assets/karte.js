/* =====================================================================
   Nestwerk – Karte
   Eine selbst gezeichnete Karte: keine Kacheln, kein fremder Dienst,
   keine Nachverfolgung. Sie zeigt Lage, Preisniveau je Viertel,
   Bündelungen bei geringem Zoom und einen frei setzbaren Umkreis.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;
  const G = NW.geo;

  const W = 1000, H = 700;
  const FARBEN = { miete: '#0f766e', kauf: '#4338ca', wg: '#7c3aed', tausch: '#b45309' };

  function projizieren(lat, lng, lat0) {
    return { x: lng * Math.cos(lat0 * Math.PI / 180) * 111.32, y: -lat * 110.57 };
  }

  function Karte(container, optionen) {
    const self = this;
    this.el = container;
    this.opt = optionen || {};
    this.listings = [];
    this.aktivId = null;
    this.umkreis = null;
    this.heat = true;
    this.view = { cx: 0, cy: 0, scale: 1 };
    this.lat0 = 51;
    this._raf = null;

    container.classList.add('karte');
    container.innerHTML =
      '<svg class="karte__svg" viewBox="0 0 ' + W + ' ' + H + '" role="application" aria-label="Karte der Suchergebnisse" tabindex="0">' +
      '<defs>' +
      '<pattern id="k-raster" width="40" height="40" patternUnits="userSpaceOnUse">' +
      '<path d="M40 0H0V40" fill="none" stroke="currentColor" stroke-width="1" opacity=".12"/></pattern>' +
      '<radialGradient id="k-heat"><stop offset="0" stop-color="currentColor" stop-opacity=".38"/>' +
      '<stop offset="1" stop-color="currentColor" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<rect class="karte__bg" width="' + W + '" height="' + H + '" fill="url(#k-raster)"/>' +
      '<g class="karte__heat"></g>' +
      '<g class="karte__umkreis"></g>' +
      '<g class="karte__pins"></g>' +
      '<g class="karte__labels"></g>' +
      '</svg>' +
      '<div class="karte__hud">' +
      '<div class="karte__zoom" role="group" aria-label="Zoom">' +
      '<button type="button" class="karte__btn" data-k="in" aria-label="Vergrößern">+</button>' +
      '<button type="button" class="karte__btn" data-k="out" aria-label="Verkleinern">−</button>' +
      '<button type="button" class="karte__btn" data-k="fit" aria-label="Alles zeigen" title="Alles zeigen">⤢</button>' +
      '</div>' +
      '<label class="karte__schalter"><input type="checkbox" data-k="heat" checked> Preisniveau</label>' +
      '</div>' +
      '<div class="karte__legende" aria-hidden="true">' +
      '<span><i style="background:' + FARBEN.miete + '"></i>Miete</span>' +
      '<span><i style="background:' + FARBEN.kauf + '"></i>Kauf</span>' +
      '<span><i style="background:' + FARBEN.wg + '"></i>WG</span>' +
      '<span><i style="background:' + FARBEN.tausch + '"></i>Tausch</span>' +
      '</div>' +
      '<div class="karte__tip" hidden></div>';

    this.svg = container.querySelector('.karte__svg');
    this.gHeat = container.querySelector('.karte__heat');
    this.gUmkreis = container.querySelector('.karte__umkreis');
    this.gLabels = container.querySelector('.karte__labels');
    this.gPins = container.querySelector('.karte__pins');
    this.tip = container.querySelector('.karte__tip');

    /* --------------------- Bedienung --------------------- */

    let ziehen = null;
    this.svg.addEventListener('pointerdown', (e) => {
      if (self.opt.umkreisModus) return;
      ziehen = { x: e.clientX, y: e.clientY, cx: self.view.cx, cy: self.view.cy };
      self.svg.setPointerCapture(e.pointerId);
      self.svg.classList.add('is-ziehen');
    });
    this.svg.addEventListener('pointermove', (e) => {
      if (!ziehen) return;
      const rect = self.svg.getBoundingClientRect();
      const f = W / rect.width / self.view.scale;
      self.view.cx = ziehen.cx - (e.clientX - ziehen.x) * f;
      self.view.cy = ziehen.cy - (e.clientY - ziehen.y) * f;
      self.zeichnen();
    });
    const stop = (e) => {
      if (!ziehen) return;
      ziehen = null;
      self.svg.classList.remove('is-ziehen');
      try { self.svg.releasePointerCapture(e.pointerId); } catch (err) { /* egal */ }
    };
    this.svg.addEventListener('pointerup', stop);
    this.svg.addEventListener('pointercancel', stop);

    this.svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      self.zoom(e.deltaY < 0 ? 1.18 : 1 / 1.18, e);
    }, { passive: false });

    this.svg.addEventListener('keydown', (e) => {
      const schritt = 60 / self.view.scale;
      const taste = { ArrowLeft: [-schritt, 0], ArrowRight: [schritt, 0], ArrowUp: [0, -schritt], ArrowDown: [0, schritt] }[e.key];
      if (taste) { e.preventDefault(); self.view.cx += taste[0]; self.view.cy += taste[1]; self.zeichnen(); }
      if (e.key === '+') { e.preventDefault(); self.zoom(1.25); }
      if (e.key === '-') { e.preventDefault(); self.zoom(1 / 1.25); }
    });

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-k]');
      if (btn && btn.dataset.k === 'in') return self.zoom(1.3);
      if (btn && btn.dataset.k === 'out') return self.zoom(1 / 1.3);
      if (btn && btn.dataset.k === 'fit') return self.einpassen();
      if (btn && btn.dataset.k === 'heat') { self.heat = btn.checked; return self.zeichnen(); }

      const pin = e.target.closest('[data-pin]');
      if (pin) {
        const ids = pin.dataset.pin.split(',');
        if (ids.length > 1) { self.zoomAuf(ids); return; }
        if (self.opt.onSelect) self.opt.onSelect(ids[0]);
        return;
      }
      if (self.opt.umkreisModus && e.target.closest('.karte__svg')) {
        const p = self.zuWelt(e);
        if (p && self.opt.onUmkreis) self.opt.onUmkreis(p);
      }
    });

    container.addEventListener('pointermove', (e) => {
      const pin = e.target.closest('[data-pin]');
      if (!pin) { self.tip.hidden = true; return; }
      const ids = pin.dataset.pin.split(',');
      self.tip.hidden = false;
      self.tip.innerHTML = pin.dataset.tip || '';
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      self.tip.style.left = U.clamp(x, 90, rect.width - 90) + 'px';
      self.tip.style.top = Math.max(8, y - 14) + 'px';
    });
    container.addEventListener('pointerleave', () => { self.tip.hidden = true; });
  }

  Karte.prototype.zuWelt = function (e) {
    const rect = this.svg.getBoundingClientRect();
    const sx = (e.clientX - rect.left) / rect.width * W;
    const sy = (e.clientY - rect.top) / rect.height * H;
    const px = (sx - W / 2) / this.view.scale + this.view.cx;
    const py = (sy - H / 2) / this.view.scale + this.view.cy;
    const lat = -py / 110.57;
    const lng = px / (Math.cos(this.lat0 * Math.PI / 180) * 111.32);
    return { lat: Math.round(lat * 100000) / 100000, lng: Math.round(lng * 100000) / 100000 };
  };

  Karte.prototype.zoom = function (faktor, e) {
    const alt = this.view.scale;
    this.view.scale = U.clamp(alt * faktor, 0.35, 900);
    if (e) {
      /* Unter dem Zeiger halten, nicht in der Mitte. */
      const rect = this.svg.getBoundingClientRect();
      const sx = (e.clientX - rect.left) / rect.width * W - W / 2;
      const sy = (e.clientY - rect.top) / rect.height * H - H / 2;
      this.view.cx += sx / alt - sx / this.view.scale;
      this.view.cy += sy / alt - sy / this.view.scale;
    }
    this.zeichnen();
  };

  Karte.prototype.setzen = function (listings, aktivId, umkreis) {
    const neu = listings.map((l) => l.id).join(',');
    const wechsel = neu !== this._letzte;
    this._letzte = neu;
    this.listings = listings;
    this.aktivId = aktivId || null;
    this.umkreis = umkreis || null;
    if (wechsel) this.einpassen(); else this.zeichnen();
  };

  Karte.prototype.einpassen = function () {
    if (!this.listings.length) { this.view = { cx: 0, cy: 0, scale: 1 }; return this.zeichnen(); }
    this.lat0 = U.sum(this.listings.map((l) => l.lat)) / this.listings.length;
    const pts = this.listings.map((l) => projizieren(l.lat, l.lng, this.lat0));
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    const minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
    const minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    const breite = Math.max(0.8, maxX - minX), hoehe = Math.max(0.8, maxY - minY);
    this.view.cx = (minX + maxX) / 2;
    this.view.cy = (minY + maxY) / 2;
    this.view.scale = Math.min((W - 140) / breite, (H - 140) / hoehe);
    this.zeichnen();
  };

  Karte.prototype.zoomAuf = function (ids) {
    const teil = this.listings.filter((l) => ids.indexOf(l.id) >= 0);
    if (!teil.length) return;
    const pts = teil.map((l) => projizieren(l.lat, l.lng, this.lat0));
    this.view.cx = U.sum(pts.map((p) => p.x)) / pts.length;
    this.view.cy = U.sum(pts.map((p) => p.y)) / pts.length;
    this.view.scale = U.clamp(this.view.scale * 3.2, 0.35, 900);
    this.zeichnen();
  };

  Karte.prototype.zumBild = function (lat, lng) {
    const p = projizieren(lat, lng, this.lat0);
    return { x: (p.x - this.view.cx) * this.view.scale + W / 2, y: (p.y - this.view.cy) * this.view.scale + H / 2 };
  };

  Karte.prototype.zeichnen = function () {
    if (this._raf) return;
    const self = this;
    this._raf = requestAnimationFrame(() => { self._raf = null; self._zeichnen(); });
  };

  Karte.prototype._zeichnen = function () {
    const self = this;
    const sichtbar = [];
    this.listings.forEach((l) => {
      const p = this.zumBild(l.lat, l.lng);
      if (p.x > -60 && p.x < W + 60 && p.y > -60 && p.y < H + 60) sichtbar.push({ l, p });
    });

    /* --- Preisniveau je Viertel --- */
    let heat = '';
    if (this.heat && this.view.scale < 400) {
      const proViertel = {};
      this.listings.forEach((l) => {
        if (l.kind === 'kauf') return;
        (proViertel[l.viertelKey] = proViertel[l.viertelKey] || []).push(l.kalt / l.flaeche);
      });
      const werte = Object.keys(proViertel).map((k) => U.sum(proViertel[k]) / proViertel[k].length);
      const min = Math.min.apply(null, werte.concat([99])), max = Math.max.apply(null, werte.concat([0]));
      Object.keys(proViertel).forEach((key) => {
        const d = G.districtByKey[key];
        if (!d) return;
        const p = this.zumBild(d.lat, d.lng);
        if (p.x < -180 || p.x > W + 180 || p.y < -180 || p.y > H + 180) return;
        const schnitt = U.sum(proViertel[key]) / proViertel[key].length;
        const t = max > min ? (schnitt - min) / (max - min) : 0.5;
        const farbe = t < 0.34 ? '#15803d' : t < 0.67 ? '#ca8a04' : '#dc2626';
        const rad = U.clamp(this.view.scale * 1.1, 34, 190);
        heat += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + rad.toFixed(0) +
          '" fill="url(#k-heat)" color="' + farbe + '"/>';
      });
    }
    this.gHeat.innerHTML = heat;

    /* --- Beschriftung der Viertel --- */
    let labels = '';
    if (this.view.scale > 22) {
      const gezeigt = {};
      this.listings.forEach((l) => {
        if (gezeigt[l.viertelKey]) return;
        gezeigt[l.viertelKey] = 1;
        const d = G.districtByKey[l.viertelKey];
        if (!d) return;
        const p = this.zumBild(d.lat, d.lng);
        if (p.x < 20 || p.x > W - 20 || p.y < 20 || p.y > H - 20) return;
        labels += '<text class="karte__viertel" x="' + p.x.toFixed(0) + '" y="' + (p.y - 26).toFixed(0) + '">' +
          U.esc(d.name) + '</text>';
      });
    } else {
      const gezeigt = {};
      this.listings.forEach((l) => {
        if (gezeigt[l.stadt]) return;
        gezeigt[l.stadt] = 1;
        const c = G.cityByName[l.stadt];
        if (!c) return;
        const p = this.zumBild(c.lat, c.lng);
        if (p.x < 10 || p.x > W - 10 || p.y < 10 || p.y > H - 10) return;
        labels += '<text class="karte__stadt" x="' + p.x.toFixed(0) + '" y="' + (p.y - 30).toFixed(0) + '">' + U.esc(c.name) + '</text>';
      });
    }
    this.gLabels.innerHTML = labels;

    /* --- Umkreis --- */
    if (this.umkreis) {
      const p = this.zumBild(this.umkreis.lat, this.umkreis.lng);
      const rad = this.umkreis.km * this.view.scale;
      this.gUmkreis.innerHTML =
        '<circle class="karte__radius" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + rad.toFixed(1) + '"/>' +
        '<circle class="karte__mitte" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="5"/>' +
        '<text class="karte__radiustext" x="' + p.x.toFixed(1) + '" y="' + (p.y - rad - 8).toFixed(1) + '">' +
        U.esc(U.dec(this.umkreis.km)) + ' km</text>';
    } else {
      this.gUmkreis.innerHTML = '';
    }

    /* --- Pins, bei Bedarf gebündelt --- */
    const zellgroesse = 34;
    const zellen = {};
    sichtbar.forEach((s) => {
      const key = Math.round(s.p.x / zellgroesse) + '_' + Math.round(s.p.y / zellgroesse);
      (zellen[key] = zellen[key] || []).push(s);
    });

    let pins = '';
    Object.keys(zellen).forEach((key) => {
      const gruppe = zellen[key];
      const x = U.sum(gruppe.map((g) => g.p.x)) / gruppe.length;
      const y = U.sum(gruppe.map((g) => g.p.y)) / gruppe.length;
      const ids = gruppe.map((g) => g.l.id);

      if (gruppe.length > 1) {
        const r = U.clamp(11 + Math.log(gruppe.length) * 5, 12, 26);
        const preise = gruppe.map((g) => g.l.kind === 'kauf' ? g.l.kaufpreis : g.l.warm);
        pins += '<g class="karte__cluster" data-pin="' + ids.join(',') + '" data-tip="' +
          U.esc('<b>' + gruppe.length + ' Objekte</b><br>ab ' + U.eur(Math.min.apply(null, preise)) + ' · Klick zum Aufteilen') + '" tabindex="0">' +
          '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '"/>' +
          '<text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '">' + gruppe.length + '</text></g>';
      } else {
        const l = gruppe[0].l;
        const aktiv = l.id === this.aktivId;
        const preis = l.kind === 'kauf' ? U.eur(l.kaufpreis) : U.eur(l.warm);
        const tip = '<b>' + U.esc(l.titel) + '</b><br>' + U.esc(preis + (l.kind === 'kauf' ? '' : ' warm') +
          ' · ' + U.dec(l.zimmer) + ' Zi. · ' + l.flaeche + ' m²');
        if (this.view.scale > 90) {
          const breite = preis.length * 7.4 + 16;
          pins += '<g class="karte__preis' + (aktiv ? ' is-aktiv' : '') + '" data-pin="' + l.id + '" data-tip="' + U.esc(tip) + '" tabindex="0">' +
            '<rect x="' + (x - breite / 2).toFixed(1) + '" y="' + (y - 12).toFixed(1) + '" width="' + breite.toFixed(1) + '" height="24" rx="12" style="fill:' + FARBEN[l.kind] + '"/>' +
            '<text x="' + x.toFixed(1) + '" y="' + (y + 5).toFixed(1) + '">' + U.esc(preis) + '</text></g>';
        } else {
          pins += '<circle class="karte__pin' + (aktiv ? ' is-aktiv' : '') + '" data-pin="' + l.id + '" data-tip="' + U.esc(tip) +
            '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (aktiv ? 9 : 6) + '" style="fill:' + FARBEN[l.kind] + '" tabindex="0"/>';
        }
      }
    });
    this.gPins.innerHTML = pins;
  };

  NW.karte = {
    erzeugen: (el, opt) => new Karte(el, opt),
    FARBEN
  };
})(window.NW = window.NW || {});
