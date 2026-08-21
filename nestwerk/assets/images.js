/* =====================================================================
   Nestwerk – Bilder ohne Bilder
   Statt Fotos von fremden Servern zeichnet die App jede Ansicht selbst:
   deterministische SVG-Illustrationen aus der Inserats-Kennung. Gleiches
   Inserat, gleiches Bild – auch offline, ohne Ladezeit, ohne Platzhalter.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;

  const PALETTES = [
    { sky: ['#dbeafe', '#eff6ff'], wall: '#cbd5e1', wall2: '#94a3b8', warm: '#f8fafc', accent: '#0f766e', dark: '#334155', green: '#65a30d' },
    { sky: ['#fee2e2', '#fff7ed'], wall: '#e7d3c4', wall2: '#c9ab95', warm: '#fffaf5', accent: '#b45309', dark: '#44403c', green: '#4d7c0f' },
    { sky: ['#dcfce7', '#f0fdf4'], wall: '#d5ded0', wall2: '#a8b8a0', warm: '#fbfdf9', accent: '#15803d', dark: '#3f4a3c', green: '#166534' },
    { sky: ['#ede9fe', '#f5f3ff'], wall: '#d8d5e4', wall2: '#a9a3c0', warm: '#faf9ff', accent: '#6d28d9', dark: '#3b3552', green: '#7c3aed' },
    { sky: ['#cffafe', '#ecfeff'], wall: '#cddfe3', wall2: '#93b4bd', warm: '#f7fdfe', accent: '#0e7490', dark: '#2f4550', green: '#0891b2' },
    { sky: ['#fef9c3', '#fefce8'], wall: '#e6dfc4', wall2: '#bcb08a', warm: '#fffdf2', accent: '#a16207', dark: '#453f2e', green: '#65a30d' }
  ];

  function paletteFor(seed) { return PALETTES[seed % PALETTES.length]; }

  function frame(inner, id) {
    return '<svg viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }

  /* ---------------------------- Fassade ---------------------------- */
  function fassade(seed, p) {
    const r = U.rng(seed);
    const gid = '__ID__f';
    let s = '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + p.sky[0] + '"/><stop offset="1" stop-color="' + p.sky[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#' + gid + ')"/>';

    /* Nachbarhäuser hinten */
    let x = -10;
    while (x < 400) {
      const w = U.intBetween(r, 40, 80), h = U.intBetween(r, 90, 150);
      s += '<rect x="' + x + '" y="' + (250 - h) + '" width="' + w + '" height="' + h + '" fill="' + p.wall2 + '" opacity=".35"/>';
      x += w + 4;
    }

    /* Hauptgebäude */
    const bw = U.intBetween(r, 210, 260), bx = Math.round((400 - bw) / 2), by = U.intBetween(r, 55, 80);
    s += '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + (250 - by) + '" fill="' + p.wall + '"/>';
    s += '<rect x="' + (bx - 6) + '" y="' + (by - 10) + '" width="' + (bw + 12) + '" height="12" fill="' + p.wall2 + '"/>';

    /* Fensterraster */
    const cols = U.intBetween(r, 3, 5), rows = U.intBetween(r, 3, 4);
    const gapX = bw / cols, gapY = (250 - by - 34) / rows;
    const fw = Math.min(30, gapX * 0.46), fh = Math.min(38, gapY * 0.56);
    for (let c = 0; c < cols; c++) {
      for (let ro = 0; ro < rows; ro++) {
        const fx = bx + gapX * c + (gapX - fw) / 2;
        const fy = by + 16 + gapY * ro + (gapY - fh) / 2;
        const lit = r() < 0.28;
        s += '<rect x="' + fx.toFixed(1) + '" y="' + fy.toFixed(1) + '" width="' + fw.toFixed(1) + '" height="' + fh.toFixed(1) +
          '" rx="1.5" fill="' + (lit ? '#fde68a' : p.dark) + '" opacity="' + (lit ? '.95' : '.72') + '"/>';
        s += '<line x1="' + (fx + fw / 2).toFixed(1) + '" y1="' + fy.toFixed(1) + '" x2="' + (fx + fw / 2).toFixed(1) + '" y2="' + (fy + fh).toFixed(1) + '" stroke="' + p.wall + '" stroke-width="1.4"/>';
        /* gelegentlich ein Balkon */
        if (r() < 0.22) {
          s += '<rect x="' + (fx - 5).toFixed(1) + '" y="' + (fy + fh - 2).toFixed(1) + '" width="' + (fw + 10).toFixed(1) + '" height="7" rx="1" fill="' + p.wall2 + '"/>';
        }
      }
    }

    /* Eingang */
    const dx = bx + bw / 2 - 15;
    s += '<rect x="' + dx + '" y="214" width="30" height="36" rx="2" fill="' + p.accent + '" opacity=".9"/>';
    s += '<circle cx="' + (dx + 23) + '" cy="234" r="1.8" fill="' + p.warm + '"/>';

    /* Bäume und Boden */
    s += '<rect x="0" y="250" width="400" height="50" fill="' + p.wall2 + '" opacity=".45"/>';
    for (let i = 0; i < 3; i++) {
      const tx = U.intBetween(r, 12, 388), th = U.intBetween(r, 26, 44);
      s += '<rect x="' + (tx - 2) + '" y="' + (250 - th * 0.35) + '" width="4" height="' + (th * 0.35) + '" fill="' + p.dark + '" opacity=".5"/>';
      s += '<circle cx="' + tx + '" cy="' + (250 - th * 0.55) + '" r="' + (th * 0.5).toFixed(1) + '" fill="' + p.green + '" opacity=".55"/>';
    }
    return s;
  }

  /* ----------------------------- Raum ----------------------------- */
  function raum(seed, p) {
    const r = U.rng(seed + 7);
    let s = '<rect width="400" height="300" fill="' + p.warm + '"/>';
    s += '<rect x="0" y="0" width="400" height="228" fill="' + p.wall + '" opacity=".55"/>';
    s += '<rect x="0" y="228" width="400" height="72" fill="' + p.wall2 + '" opacity=".55"/>';
    s += '<rect x="0" y="224" width="400" height="6" fill="' + p.dark + '" opacity=".25"/>';

    /* Fensterfront mit Licht */
    const wx = U.intBetween(r, 190, 250);
    s += '<rect x="' + wx + '" y="46" width="126" height="150" rx="3" fill="#e0f2fe"/>';
    s += '<rect x="' + wx + '" y="46" width="126" height="150" rx="3" fill="none" stroke="' + p.dark + '" stroke-width="4" opacity=".7"/>';
    s += '<line x1="' + (wx + 63) + '" y1="46" x2="' + (wx + 63) + '" y2="196" stroke="' + p.dark + '" stroke-width="3" opacity=".7"/>';
    s += '<line x1="' + wx + '" y1="121" x2="' + (wx + 126) + '" y2="121" stroke="' + p.dark + '" stroke-width="3" opacity=".7"/>';
    s += '<polygon points="' + wx + ',196 ' + (wx + 126) + ',196 ' + (wx + 170) + ',300 ' + (wx - 60) + ',300" fill="#fef9c3" opacity=".35"/>';

    /* Sofa oder Bett */
    if (r() < 0.5) {
      s += '<rect x="34" y="160" width="150" height="52" rx="8" fill="' + p.accent + '" opacity=".82"/>';
      s += '<rect x="34" y="140" width="150" height="30" rx="8" fill="' + p.accent + '" opacity=".62"/>';
      s += '<rect x="46" y="146" width="40" height="26" rx="5" fill="' + p.warm + '" opacity=".7"/>';
      s += '<rect x="96" y="146" width="40" height="26" rx="5" fill="' + p.warm + '" opacity=".5"/>';
    } else {
      s += '<rect x="26" y="150" width="164" height="62" rx="6" fill="' + p.accent + '" opacity=".75"/>';
      s += '<rect x="26" y="150" width="164" height="20" rx="6" fill="' + p.warm + '" opacity=".85"/>';
      s += '<rect x="40" y="132" width="46" height="24" rx="6" fill="' + p.warm + '"/>';
      s += '<rect x="96" y="132" width="46" height="24" rx="6" fill="' + p.warm + '" opacity=".8"/>';
    }

    /* Teppich */
    s += '<ellipse cx="150" cy="252" rx="110" ry="26" fill="' + p.green + '" opacity=".22"/>';

    /* Pflanze */
    const px = U.intBetween(r, 300, 360);
    s += '<path d="M' + px + ' 236 q-16 -34 -4 -58 q10 24 4 58Z" fill="' + p.green + '" opacity=".8"/>';
    s += '<path d="M' + px + ' 236 q16 -28 34 -36 q-14 22 -34 36Z" fill="' + p.green + '" opacity=".62"/>';
    s += '<path d="M' + (px - 12) + ' 236 h24 l-4 24 h-16Z" fill="' + p.dark + '" opacity=".6"/>';

    /* Lampe */
    s += '<line x1="120" y1="0" x2="120" y2="42" stroke="' + p.dark + '" stroke-width="2" opacity=".6"/>';
    s += '<path d="M100 42 h40 l-8 20 h-24Z" fill="' + p.dark + '" opacity=".65"/>';

    /* Bilderrahmen */
    if (r() < 0.7) {
      s += '<rect x="52" y="52" width="52" height="66" rx="2" fill="none" stroke="' + p.dark + '" stroke-width="3" opacity=".5"/>';
      s += '<rect x="118" y="66" width="40" height="40" rx="2" fill="none" stroke="' + p.dark + '" stroke-width="3" opacity=".35"/>';
    }
    return s;
  }

  /* --------------------------- Grundriss --------------------------- */
  function grundriss(seed, p, meta) {
    const r = U.rng(seed + 21);
    const roomsCount = U.clamp(Math.round((meta && meta.rooms) || 3), 1, 5);
    let s = '<rect width="400" height="300" fill="' + p.warm + '"/>';
    s += '<rect x="26" y="26" width="348" height="248" fill="none" stroke="' + p.dark + '" stroke-width="7" opacity=".8"/>';

    /* Aufteilung: links großer Wohnraum, rechts gestapelte Räume */
    const splitX = roomsCount <= 2 ? 250 : U.intBetween(r, 190, 230);
    s += '<line x1="' + splitX + '" y1="26" x2="' + splitX + '" y2="274" stroke="' + p.dark + '" stroke-width="5" opacity=".8"/>';

    const right = Math.max(1, roomsCount - 1);
    const step = 248 / right;
    for (let i = 1; i < right; i++) {
      const y = 26 + step * i;
      s += '<line x1="' + splitX + '" y1="' + y + '" x2="374" y2="' + y + '" stroke="' + p.dark + '" stroke-width="5" opacity=".8"/>';
    }

    const labels = ['Wohnen', 'Schlafen', 'Küche', 'Bad', 'Zimmer'];
    s += '<text x="' + ((26 + splitX) / 2) + '" y="150" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" fill="' + p.dark + '" opacity=".75">' + labels[0] + '</text>';
    s += '<text x="' + ((26 + splitX) / 2) + '" y="170" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="' + p.dark + '" opacity=".5">' + Math.round(((meta && meta.area) || 70) * 0.4) + ' m²</text>';
    for (let i = 0; i < right; i++) {
      const cy = 26 + step * i + step / 2;
      s += '<text x="' + ((splitX + 374) / 2) + '" y="' + cy + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="' + p.dark + '" opacity=".7">' + labels[(i + 1) % labels.length] + '</text>';
    }

    /* Türbögen und Fenster */
    s += '<path d="M' + splitX + ' 96 a26 26 0 0 1 -26 26" fill="none" stroke="' + p.accent + '" stroke-width="2.5"/>';
    s += '<rect x="60" y="22" width="70" height="8" fill="' + p.sky[0] + '"/>';
    s += '<rect x="150" y="22" width="46" height="8" fill="' + p.sky[0] + '"/>';
    s += '<rect x="370" y="80" width="8" height="60" fill="' + p.sky[0] + '"/>';

    /* Nordpfeil */
    s += '<g opacity=".55"><circle cx="352" cy="252" r="14" fill="none" stroke="' + p.dark + '" stroke-width="1.5"/>' +
      '<path d="M352 242 l5 12 h-10Z" fill="' + p.accent + '"/>' +
      '<text x="352" y="268" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="' + p.dark + '">N</text></g>';
    return s;
  }

  /* ---------------------------- Küche ---------------------------- */
  function kueche(seed, p) {
    const r = U.rng(seed + 33);
    let s = '<rect width="400" height="300" fill="' + p.warm + '"/>';
    s += '<rect x="0" y="0" width="400" height="216" fill="' + p.wall + '" opacity=".5"/>';
    s += '<rect x="0" y="216" width="400" height="84" fill="' + p.wall2 + '" opacity=".5"/>';
    /* Fliesenspiegel */
    for (let x = 40; x < 330; x += 26) {
      for (let y = 108; y < 160; y += 26) {
        s += '<rect x="' + x + '" y="' + y + '" width="24" height="24" rx="2" fill="' + p.sky[1] + '" opacity=".8"/>';
      }
    }
    /* Unterschränke */
    s += '<rect x="34" y="162" width="300" height="70" rx="4" fill="' + p.accent + '" opacity=".8"/>';
    s += '<rect x="30" y="156" width="308" height="12" rx="3" fill="' + p.dark + '" opacity=".65"/>';
    for (let x = 52; x < 330; x += 62) {
      s += '<rect x="' + x + '" y="182" width="42" height="4" rx="2" fill="' + p.warm + '" opacity=".8"/>';
    }
    /* Oberschränke */
    s += '<rect x="34" y="46" width="130" height="54" rx="4" fill="' + p.wall2 + '"/>';
    s += '<rect x="240" y="46" width="94" height="54" rx="4" fill="' + p.wall2 + '"/>';
    /* Dunstabzug */
    s += '<path d="M176 46 h58 l-10 30 h-38Z" fill="' + p.dark + '" opacity=".6"/>';
    /* Kochfeld und Spüle */
    s += '<circle cx="200" cy="168" r="9" fill="' + p.dark + '" opacity=".55"/>';
    s += '<circle cx="222" cy="168" r="7" fill="' + p.dark + '" opacity=".45"/>';
    s += '<rect x="270" y="160" width="46" height="14" rx="3" fill="' + p.dark + '" opacity=".35"/>';
    /* Kleinkram */
    if (r() < 0.8) s += '<rect x="72" y="132" width="14" height="26" rx="2" fill="' + p.green + '" opacity=".75"/>';
    s += '<circle cx="120" cy="146" r="10" fill="' + p.green + '" opacity=".5"/>';
    return s;
  }

  /* ----------------------------- Bad ----------------------------- */
  function bad(seed, p) {
    let s = '<rect width="400" height="300" fill="' + p.warm + '"/>';
    for (let x = 0; x < 400; x += 34) {
      for (let y = 0; y < 300; y += 34) {
        s += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="30" height="30" rx="3" fill="' + p.sky[1] + '" opacity=".75"/>';
      }
    }
    /* Wanne */
    s += '<rect x="40" y="168" width="180" height="76" rx="26" fill="#ffffff" opacity=".92"/>';
    s += '<rect x="52" y="180" width="156" height="52" rx="20" fill="' + p.sky[0] + '" opacity=".8"/>';
    /* Waschbecken */
    s += '<rect x="256" y="150" width="96" height="16" rx="6" fill="#ffffff"/>';
    s += '<path d="M270 166 h68 l-10 32 h-48Z" fill="#ffffff" opacity=".9"/>';
    s += '<rect x="300" y="128" width="4" height="22" fill="' + p.dark + '" opacity=".6"/>';
    /* Spiegel */
    s += '<rect x="272" y="52" width="64" height="60" rx="6" fill="' + p.wall + '" stroke="' + p.dark + '" stroke-width="3" opacity=".85"/>';
    /* Handtücher */
    s += '<rect x="232" y="196" width="14" height="52" rx="4" fill="' + p.accent + '" opacity=".8"/>';
    s += '<rect x="250" y="204" width="12" height="44" rx="4" fill="' + p.green + '" opacity=".6"/>';
    return s;
  }

  /* ---------------------------- Umgebung ---------------------------- */
  function umgebung(seed, p) {
    const r = U.rng(seed + 55);
    const gid = '__ID__u';
    let s = '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + p.sky[0] + '"/><stop offset="1" stop-color="' + p.sky[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#' + gid + ')"/>';
    s += '<rect x="0" y="196" width="400" height="104" fill="' + p.green + '" opacity=".3"/>';
    /* Weg */
    s += '<path d="M0 268 q120 -34 200 -30 q120 6 200 -26 v88 H0Z" fill="' + p.wall2 + '" opacity=".55"/>';
    /* Häuserzeile */
    let x = 6;
    while (x < 400) {
      const w = U.intBetween(r, 44, 70), h = U.intBetween(r, 60, 118);
      s += '<rect x="' + x + '" y="' + (196 - h) + '" width="' + w + '" height="' + h + '" fill="' + p.wall + '" opacity=".9"/>';
      s += '<polygon points="' + (x - 4) + ',' + (196 - h) + ' ' + (x + w / 2) + ',' + (196 - h - 18) + ' ' + (x + w + 4) + ',' + (196 - h) + '" fill="' + p.wall2 + '"/>';
      for (let i = 0; i < 2; i++) {
        s += '<rect x="' + (x + 10 + i * 22) + '" y="' + (196 - h + 20) + '" width="14" height="18" rx="1" fill="' + p.dark + '" opacity=".55"/>';
      }
      x += w + 8;
    }
    /* Bäume */
    for (let i = 0; i < 5; i++) {
      const tx = 20 + i * 80 + U.intBetween(r, -14, 14), th = U.intBetween(r, 34, 56);
      s += '<rect x="' + (tx - 3) + '" y="' + (230 - th * 0.4) + '" width="6" height="' + (th * 0.4) + '" fill="' + p.dark + '" opacity=".55"/>';
      s += '<circle cx="' + tx + '" cy="' + (230 - th * 0.62) + '" r="' + (th * 0.55).toFixed(1) + '" fill="' + p.green + '" opacity=".7"/>';
    }
    return s;
  }

  const RENDERERS = { fassade, raum, grundriss, kueche, bad, umgebung };

  /* Welche Bildfolge zu welchem Inseratstyp passt. */
  function sequenceFor(listing) {
    if (listing.kind === 'wg') return ['raum', 'kueche', 'bad', 'fassade', 'umgebung'];
    if (listing.type === 'haus') return ['fassade', 'raum', 'kueche', 'grundriss', 'umgebung', 'bad'];
    return ['raum', 'fassade', 'kueche', 'bad', 'grundriss', 'umgebung'];
  }

  const CAPTIONS = {
    fassade: 'Außenansicht', raum: 'Wohnbereich', grundriss: 'Grundriss (schematisch)',
    kueche: 'Küche', bad: 'Badezimmer', umgebung: 'Umgebung'
  };

  const cache = new Map();
  let laufendeNummer = 0;

  /* Ein Bild als fertiges SVG-Markup. Das Aussehen hängt allein an der
     Kennung des Inserats, die internen Verweise dagegen bekommen bei
     jedem Aufruf eine eigene Nummer – sonst kollidieren zwei Ausgaben
     desselben Bildes auf einer Seite. */
  function make(listing, index) {
    const seq = sequenceFor(listing);
    const name = seq[index % seq.length];
    const key = listing.id + ':' + name;
    let vorlage = cache.get(key);
    if (vorlage === undefined) {
      const seed = U.hash(listing.id + name);
      vorlage = frame(RENDERERS[name](seed, paletteFor(seed), listing));
      cache.set(key, vorlage);
    }
    if (vorlage.indexOf('__ID__') < 0) return vorlage;
    return vorlage.split('__ID__').join('nw' + (++laufendeNummer) + '-');
  }

  function count(listing) { return sequenceFor(listing).length; }
  function caption(listing, index) { return CAPTIONS[sequenceFor(listing)[index % sequenceFor(listing).length]]; }

  /* Rundes Profilbild aus Initialen. */
  function avatar(name, size) {
    const seed = U.hash(String(name));
    const p = paletteFor(seed);
    const initials = String(name).trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
    const s = size || 40;
    return '<svg viewBox="0 0 40 40" width="' + s + '" height="' + s + '" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="40" height="40" rx="20" fill="' + p.accent + '"/>' +
      '<text x="20" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" font-weight="600" fill="#fff">' +
      U.esc(initials) + '</text></svg>';
  }

  NW.img = { make, count, caption, avatar, paletteFor };
})(window.NW = window.NW || {});
