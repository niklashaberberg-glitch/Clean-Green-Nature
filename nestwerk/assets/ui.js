/* =====================================================================
   Nestwerk – Oberfläche, Kern
   Schale, Router, geteilte Bausteine. Ansichten registrieren sich unter
   NW.ui.ansichten und liefern fertiges Markup; alles Interaktive läuft
   über data-tu und einen einzigen Zuhörer.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;
  const h = U.html, raw = U.raw, ico = U.svg;

  const ui = { ansichten: {}, aktuell: null, params: {} };
  NW.ui = ui;

  /* ================================================================
     Symbole
     ================================================================ */

  const ICONS = {
    suche: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    herz: '<path d="M12 20s-7-4.4-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.6-7 9-7 9z"/>',
    karte: '<path d="M9 4L3 7v13l6-3 6 3 6-3V4l-6 3-6-3z"/><path d="M9 4v13M15 7v13"/>',
    liste: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z"/>',
    tausch: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    wg: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016-4.6"/>',
    haus: '<path d="M4 11l8-6 8 6v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z"/>',
    schluessel: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>',
    nachricht: '<path d="M4 5h16v11H9l-5 4z"/>',
    glocke: '<path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    waage: '<path d="M12 4v16M5 8h14M5 8l-3 6h6zM19 8l3 6h-6zM8 20h8"/>',
    kalender: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    warnung: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    pruefen: '<path d="M20 7L10 18l-6-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    pfeilUnten: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    zurueck: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    sonne: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
    mond: '<path d="M20 14A8 8 0 019.5 4 8.5 8.5 0 1020 14z"/>',
    euro: '<path d="M17 6a7 7 0 100 12M4 10h9M4 14h9"/>',
    zug: '<rect x="5" y="4" width="14" height="12" rx="3"/><path d="M5 11h14M8 20l-2 2M16 20l2 2M9 16h.01M15 16h.01"/>',
    rechner: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    blatt: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/>',
    umzug: '<path d="M3 16V7h10v9M13 10h4l4 3v3h-8"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    stift: '<path d="M4 20h4L20 8l-4-4L4 16z"/>',
    muell: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    teilen: '<circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8"/>',
    kopieren: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h8"/>',
    stern: '<path d="M12 4l2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8z"/>',
    blitz: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
    ziel: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    lupe: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8v6M8 11h6"/>',
    ring: '<path d="M12 3a9 9 0 109 9"/><path d="M18 3l3 3-3 3"/>',
    dach: '<path d="M3 12l9-8 9 8"/><path d="M6 11v9h12v-9"/><path d="M10 20v-5h4v5"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    verlauf: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    speichern: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7M8 20v-6h8v6"/>'
  };

  function sprite() {
    return '<svg class="sprite" aria-hidden="true" focusable="false"><defs>' +
      Object.keys(ICONS).map((k) =>
        '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
        'stroke-linecap="round" stroke-linejoin="round">' + ICONS[k] + '</symbol>').join('') +
      '</defs></svg>';
  }

  /* ================================================================
     Kleine Bausteine
     ================================================================ */

  const ART_LABEL = { miete: 'Miete', kauf: 'Kauf', wg: 'WG-Zimmer', tausch: 'Tausch' };
  const ART_ICON = { miete: 'schluessel', kauf: 'haus', wg: 'wg', tausch: 'tausch' };

  function badge(text, art, symbol) {
    return h`<span class="badge badge--${art || 'neutral'}">${symbol ? ico(symbol) : ''}${text}</span>`;
  }

  function ampelFarbe(ton) {
    return { gut: 'gut', neutral: 'neutral', mittel: 'warn', schlecht: 'schlecht', warn: 'warn' }[ton] || 'neutral';
  }

  /* Ringförmige Prozentanzeige für die Passung. */
  function passungsRing(score, groesse) {
    const g = groesse || 44, r = g / 2 - 4, umfang = 2 * Math.PI * r;
    const stufe = score >= 80 ? 'gut' : score >= 60 ? 'ok' : score >= 40 ? 'mittel' : 'schwach';
    return raw('<span class="ring ring--' + stufe + '" style="--g:' + g + 'px" role="img" aria-label="Passung ' + score + ' Prozent">' +
      '<svg viewBox="0 0 ' + g + ' ' + g + '" aria-hidden="true">' +
      '<circle class="ring__spur" cx="' + g / 2 + '" cy="' + g / 2 + '" r="' + r + '"/>' +
      '<circle class="ring__wert" cx="' + g / 2 + '" cy="' + g / 2 + '" r="' + r + '" ' +
      'stroke-dasharray="' + umfang.toFixed(1) + '" stroke-dashoffset="' + (umfang * (1 - score / 100)).toFixed(1) + '"/>' +
      '</svg><b>' + score + '</b></span>');
  }

  function energieBalken(klasse) {
    const stufen = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const i = stufen.indexOf(klasse);
    return raw('<span class="energie" title="Energieklasse ' + klasse + '">' +
      stufen.map((s, n) => '<i class="' + (n === i ? 'is-aktiv' : '') + '" style="--n:' + n + '"></i>').join('') +
      '<b>' + klasse + '</b></span>');
  }

  /* ================================================================
     Inseratskarte
     ================================================================ */

  function preisZeile(l) {
    if (l.kind === 'kauf') {
      return h`<b>${U.eur(l.kaufpreis)}</b><span>${U.eur(Math.round(l.kaufpreis / l.flaeche))}/m²</span>`;
    }
    return h`<b>${U.eur(l.warm)}</b><span>warm · ${U.eur(l.kalt)} kalt</span>`;
  }

  function kartenMarken(l, b) {
    const marken = [];
    const tage = U.daysSince(l.stats.online);
    if (tage <= 2) marken.push(badge('neu', 'gut'));
    if (l.kind === 'miete' && l.provision === 0) marken.push(badge('provisionsfrei', 'info'));
    if (l.anbieter.verifiziert) marken.push(badge('geprüft', 'neutral', 'pruefen'));
    if (b && b.risiko.stufe === 'warnung') marken.push(badge('Prüfhinweis', 'schlecht', 'warnung'));
    else if (b && b.risiko.stufe === 'achtung') marken.push(badge('genau lesen', 'warn', 'warnung'));
    if (b && b.mietCheck && b.mietCheck.diff <= -12) marken.push(badge(b.mietCheck.diff + ' % zum Spiegel', 'gut'));
    if (b && b.mietCheck && b.mietCheck.diff > 25) marken.push(badge('+' + b.mietCheck.diff + ' % zum Spiegel', 'schlecht'));
    if (l.befristetBis) marken.push(badge('befristet', 'warn'));
    if (l.kind === 'wg' && b && b.wg && b.wg.ausschluss.length) marken.push(badge('Ausschlusskriterium', 'schlecht'));
    return marken;
  }

  function inseratsKarte(l, b, optionen) {
    const opt = optionen || {};
    const gemerkt = NW.store.gemerkt(l.id);
    const imVergleich = NW.store.imVergleich(l.id);
    const eck = [];
    eck.push(U.dec(l.zimmer) + ' Zi.');
    eck.push(l.flaeche + ' m²');
    if (l.kind === 'wg') eck.push('WG mit ' + l.wg.groesse);
    else eck.push(l.etage === 0 ? 'EG' : l.etage >= l.etagen ? 'DG' : l.etage + '. OG');
    eck.push('ab ' + U.dateDE(l.freiAb));

    return h`<article class="karte-inserat ${opt.kompakt ? 'is-kompakt' : ''}" data-id="${l.id}">
      <a class="karte-inserat__bild" href="#/objekt/${l.id}" aria-label="${l.titel} ansehen">
        ${raw(NW.img.make(l, 0))}
        <span class="karte-inserat__art">${ico(ART_ICON[l.kind])}${ART_LABEL[l.kind]}</span>
        ${b ? h`<span class="karte-inserat__ring">${passungsRing(b.score)}</span>` : ''}
      </a>
      <div class="karte-inserat__text">
        <div class="karte-inserat__marken">${kartenMarken(l, b)}</div>
        <h3><a href="#/objekt/${l.id}">${l.titel}</a></h3>
        <p class="karte-inserat__ort">${ico('karte')}${l.viertel}, ${l.stadt} · ${l.strasse}</p>
        <p class="karte-inserat__preis">${raw(preisZeile(l))}</p>
        <ul class="karte-inserat__eck">${eck.map((e) => h`<li>${e}</li>`)}</ul>
        ${b && b.pendel ? h`<p class="karte-inserat__pendel">${ico('zug')}${U.minutesLabel(b.pendel.min)} nach ${b.pendel.anker.name}</p>` : ''}
        ${l.kind === 'wg' && b && b.wg && !b.wg.ausschluss.length
        ? h`<p class="karte-inserat__wg">${ico('wg')}WG-Passung ${b.wg.score} % – ${b.wg.kurz}</p>` : ''}
        ${l.kind === 'tausch' ? h`<p class="karte-inserat__wg">${ico('tausch')}sucht ${l.tausch.suche.staedte.join(', ')}</p>` : ''}
        <div class="karte-inserat__fuss">
          <span class="karte-inserat__meta">${U.since(l.stats.online)} · ${l.stats.bewerber} ${U.plural(l.stats.bewerber, 'Interessent', 'Interessenten')}</span>
          <div class="karte-inserat__tun">
            <button type="button" class="ikon-btn ${gemerkt ? 'is-an' : ''}" data-tu="merken" data-id="${l.id}"
              aria-pressed="${gemerkt ? 'true' : 'false'}" title="Merken">${ico('herz')}</button>
            <button type="button" class="ikon-btn ${imVergleich ? 'is-an' : ''}" data-tu="vergleich" data-id="${l.id}"
              aria-pressed="${imVergleich ? 'true' : 'false'}" title="Vergleichen">${ico('waage')}</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  /* ================================================================
     Meldungen und Dialoge
     ================================================================ */

  let toastTimer = null;
  function toast(text, art) {
    const box = U.$('#toasts');
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'toast toast--' + (art || 'info');
    el.setAttribute('role', 'status');
    el.innerHTML = h`${ico(art === 'schlecht' ? 'warnung' : art === 'gut' ? 'pruefen' : 'info')}<span>${text}</span>`;
    box.appendChild(el);
    clearTimeout(toastTimer);
    setTimeout(() => {
      el.classList.add('is-weg');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 800);
    }, 3600);
  }

  /* Notweg, wenn kein Speichern möglich ist: Inhalt zum Herauskopieren. */
  function alsText(daten) {
    dialog({
      titel: 'Daten sichern',
      breit: true,
      inhalt: h`<p>In dieser Umgebung darf die Seite keine Datei ablegen. Der vollständige Stand steht
        hier zum Kopieren – speichere ihn als <code>nestwerk-daten.json</code>.</p>
        <label class="feld"><span class="nur-sr">Daten</span><textarea rows="12" id="daten-text" readonly>${daten}</textarea></label>`,
      fuss: h`<button type="button" class="knopf" data-tu="kopieren" data-quelle="#daten-text">${ico('kopieren')}Kopieren</button>`
    });
  }

  let dialogSchliessen = null;
  function dialog(optionen) {
    const opt = optionen || {};
    const wrap = U.$('#dialog');
    const vorher = document.activeElement;
    wrap.innerHTML = h`<div class="dialog__flaeche" data-tu="dialog-zu"></div>
      <div class="dialog__box ${opt.breit ? 'is-breit' : ''}" role="dialog" aria-modal="true" aria-labelledby="dialog-titel">
        <header class="dialog__kopf">
          <h2 id="dialog-titel">${opt.titel}</h2>
          <button type="button" class="ikon-btn" data-tu="dialog-zu" aria-label="Schließen">${ico('x')}</button>
        </header>
        <div class="dialog__inhalt">${raw(opt.inhalt || '')}</div>
        ${opt.fuss ? h`<footer class="dialog__fuss">${raw(opt.fuss)}</footer>` : ''}
      </div>`;
    wrap.hidden = false;
    document.body.classList.add('hat-dialog');
    const box = wrap.querySelector('.dialog__box');
    const fokusierbar = () => U.$$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', box);
    setTimeout(() => { const f = fokusierbar(); (f[0] || box).focus(); }, 20);

    function taste(e) {
      if (e.key === 'Escape') { e.preventDefault(); zu(); return; }
      if (e.key !== 'Tab') return;
      const f = fokusierbar();
      if (!f.length) return;
      const erst = f[0], letzt = f[f.length - 1];
      if (e.shiftKey && document.activeElement === erst) { e.preventDefault(); letzt.focus(); }
      else if (!e.shiftKey && document.activeElement === letzt) { e.preventDefault(); erst.focus(); }
    }
    document.addEventListener('keydown', taste);

    function zu() {
      document.removeEventListener('keydown', taste);
      wrap.hidden = true;
      wrap.innerHTML = '';
      document.body.classList.remove('hat-dialog');
      dialogSchliessen = null;
      if (vorher && vorher.focus) vorher.focus();
      if (opt.beimSchliessen) opt.beimSchliessen();
    }
    dialogSchliessen = zu;
    return zu;
  }

  function dialogZu() { if (dialogSchliessen) dialogSchliessen(); }

  /* ================================================================
     Router
     ================================================================ */

  function routeLesen() {
    const roh = location.hash.replace(/^#\/?/, '') || 'start';
    const [pfad, query] = roh.split('?');
    const teile = pfad.split('/').filter(Boolean);
    const params = {};
    if (query) query.split('&').forEach((p) => {
      const [k, v] = p.split('=');
      params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return { name: teile[0] || 'start', arg: teile[1] ? decodeURIComponent(teile[1]) : null, params };
  }

  function gehe(ziel) {
    if (location.hash === '#/' + ziel) zeichnen();
    else location.hash = '#/' + ziel;
  }

  let letzteRoute = '';
  function zeichnen(erzwingen) {
    const r = routeLesen();
    const schluessel = r.name + '/' + r.arg + '/' + JSON.stringify(r.params);
    if (!erzwingen && schluessel === letzteRoute) return;
    const wechsel = letzteRoute.split('/')[0] !== r.name;
    letzteRoute = schluessel;

    const ansicht = ui.ansichten[r.name] || ui.ansichten.start;
    ui.aktuell = r.name;
    ui.params = r;

    const haupt = U.$('#haupt');
    const ergebnis = ansicht(r) || {};
    document.title = (ergebnis.titel ? ergebnis.titel + ' – ' : '') + 'Nestwerk';
    haupt.innerHTML = ergebnis.html || '';
    haupt.dataset.ansicht = r.name;

    U.$$('[data-route]').forEach((a) => {
      a.classList.toggle('is-aktiv', a.dataset.route === r.name);
      if (a.dataset.route === r.name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    if (ergebnis.danach) ergebnis.danach(haupt);
    if (wechsel) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    aktualisiereZaehler();
  }

  /* Wiederaufbau der aktuellen Ansicht nach Zustandsänderung. */
  function neuZeichnen() { zeichnen(true); }

  /* ================================================================
     Kopf und Navigation
     ================================================================ */

  const NAV = [
    { route: 'start', label: 'Start', icon: 'dach' },
    { route: 'suche', label: 'Suchen', icon: 'suche' },
    { route: 'tausch', label: 'Ringtausch', icon: 'ring' },
    { route: 'merkliste', label: 'Merkliste', icon: 'herz' },
    { route: 'nachrichten', label: 'Nachrichten', icon: 'nachricht' },
    { route: 'profil', label: 'Profil', icon: 'person' }
  ];

  function schale() {
    return h`${raw(sprite())}
    <a class="sprung" href="#haupt">Zum Inhalt springen</a>
    <header class="kopf">
      <div class="kopf__innen">
        <a class="marke" href="#/start" aria-label="Nestwerk, zur Startseite">
          <span class="marke__zeichen" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none"><path d="M4 16L16 5l12 11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 14v12h17V14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="20" r="3.2" stroke="currentColor" stroke-width="2.4"/></svg>
          </span>
          <span class="marke__text">Nestwerk</span>
        </a>
        <nav class="kopf__nav" aria-label="Hauptbereiche">
          ${NAV.map((n) => h`<a href="#/${n.route}" data-route="${n.route}">${ico(n.icon)}<span>${n.label}</span>
            ${n.route === 'merkliste' ? raw('<b class="zaehler" data-zaehler="merkliste" hidden></b>') : ''}
            ${n.route === 'nachrichten' ? raw('<b class="zaehler" data-zaehler="nachrichten" hidden></b>') : ''}</a>`)}
        </nav>
        <div class="kopf__tun">
          <button type="button" class="ikon-btn" data-tu="palette" title="Schnellsuche (Strg + K)" aria-label="Schnellsuche">${ico('lupe')}</button>
          <a class="ikon-btn" href="#/agenten" title="Suchaufträge" aria-label="Suchaufträge">${ico('glocke')}<b class="zaehler" data-zaehler="agenten" hidden></b></a>
          <a class="ikon-btn" href="#/vergleich" title="Vergleich" aria-label="Vergleich">${ico('waage')}<b class="zaehler" data-zaehler="vergleich" hidden></b></a>
          <button type="button" class="ikon-btn" data-tu="theme" title="Hell oder dunkel" aria-label="Darstellung wechseln">
            ${ico('sonne', 'nur-hell')}${ico('mond', 'nur-dunkel')}</button>
          <a class="knopf knopf--klein" href="#/inserieren">${ico('plus')}<span>Inserieren</span></a>
        </div>
      </div>
    </header>
    <main id="haupt" tabindex="-1"></main>
    <nav class="unten" aria-label="Hauptbereiche">
      ${NAV.map((n) => h`<a href="#/${n.route}" data-route="${n.route}">${ico(n.icon)}<span>${n.label}</span></a>`)}
    </nav>
    <footer class="fuss">
      <p><b>Nestwerk</b> führt Mietmarkt, WG-Suche und Wohnungstausch in einer Oberfläche zusammen.</p>
      <p class="fuss__hinweis">Vorführfassung mit erzeugtem Beispielbestand. Alle Angaben, Anbieter und Adressen sind erfunden.
      Rechtliche Erläuterungen sind allgemeine Hinweise und ersetzen keine Beratung.
      Deine Eingaben bleiben im Browser dieses Geräts.</p>
      <p class="fuss__links">
        <button type="button" class="link" data-tu="hilfe">Tastaturbefehle</button>
        <button type="button" class="link" data-tu="daten">Meine Daten</button>
      </p>
    </footer>
    <div id="dialog" class="dialog" hidden></div>
    <div id="toasts" class="toasts" aria-live="polite"></div>
    <div id="palette" class="palette" hidden></div>`;
  }

  function aktualisiereZaehler() {
    const s = NW.store.get();
    const setze = (name, wert) => {
      U.$$('[data-zaehler="' + name + '"]').forEach((el) => {
        el.textContent = wert > 99 ? '99+' : wert;
        el.hidden = !wert;
      });
    };
    setze('merkliste', Object.keys(s.merkliste).length);
    setze('vergleich', s.vergleich.length);
    setze('nachrichten', U.sum(s.threads.map((t) => t.ungelesen)));
    let neu = 0;
    s.agenten.forEach((a) => { if (a.aktiv) neu += NW.store.agentTreffer(a).neu.length; });
    setze('agenten', neu);
  }

  /* ================================================================
     Darstellung hell/dunkel
     ================================================================ */

  function themeSetzen(wert) {
    const wurzel = document.documentElement;
    if (wert === 'auto') {
      wurzel.removeAttribute('data-theme');
    } else {
      wurzel.setAttribute('data-theme', wert);
    }
    NW.store.set({ theme: wert }, 'theme');
  }

  function themeWechseln() {
    const jetzt = NW.store.get().theme;
    const dunkelSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const reihenfolge = ['auto', dunkelSystem ? 'light' : 'dark', dunkelSystem ? 'dark' : 'light'];
    const i = reihenfolge.indexOf(jetzt);
    const neu = reihenfolge[(i + 1) % reihenfolge.length];
    themeSetzen(neu);
    toast(neu === 'auto' ? 'Darstellung folgt dem System.' : neu === 'dark' ? 'Dunkle Darstellung.' : 'Helle Darstellung.');
  }

  /* ================================================================
     Schnellsuche
     ================================================================ */

  function paletteOeffnen(vorgabe) {
    const box = U.$('#palette');
    box.hidden = false;
    box.innerHTML = h`<div class="palette__flaeche" data-tu="palette-zu"></div>
      <div class="palette__box" role="dialog" aria-modal="true" aria-label="Schnellsuche">
        <div class="palette__feld">
          ${ico('lupe')}
          <input type="search" id="palette-eingabe" placeholder="Stadt, Viertel, Stichwort oder Bereich…" autocomplete="off" value="${vorgabe || ''}">
          <kbd>Esc</kbd>
        </div>
        <div class="palette__liste" id="palette-liste" role="listbox"></div>
      </div>`;
    const eingabe = U.$('#palette-eingabe');
    const liste = U.$('#palette-liste');
    let treffer = [], markiert = 0;

    function vorschlaege(q) {
      const n = U.norm(q);
      const out = [];
      NAV.concat([
        { route: 'vergleich', label: 'Vergleich', icon: 'waage' },
        { route: 'agenten', label: 'Suchaufträge', icon: 'glocke' },
        { route: 'umzug', label: 'Umzugsplan', icon: 'umzug' },
        { route: 'inserieren', label: 'Inserat aufgeben', icon: 'plus' },
        { route: 'rechner', label: 'Kostenrechner', icon: 'rechner' }
      ]).forEach((nav) => {
        if (!n || U.norm(nav.label).indexOf(n) >= 0) out.push({ art: 'bereich', label: nav.label, icon: nav.icon, ziel: nav.route });
      });
      if (n.length >= 2) {
        NW.geo.CITIES.forEach((c) => {
          if (U.norm(c.name).indexOf(n) >= 0) out.push({ art: 'stadt', label: c.name, unter: 'Stadt', icon: 'karte', ziel: 'suche?stadt=' + encodeURIComponent(c.name) });
        });
        NW.geo.DISTRICTS.forEach((d) => {
          if (U.norm(d.name).indexOf(n) >= 0) out.push({ art: 'viertel', label: d.name, unter: d.city + ' · ' + d.charakter, icon: 'karte', ziel: 'suche?viertel=' + encodeURIComponent(d.key) });
        });
        const objekte = NW.data.listings.filter((l) => NW.analyse.passtText(l, q)).slice(0, 6);
        objekte.forEach((l) => out.push({
          art: 'objekt', label: l.titel, unter: l.stadt + ' · ' + (l.kind === 'kauf' ? U.eur(l.kaufpreis) : U.eur(l.warm) + ' warm'),
          icon: ART_ICON[l.kind], ziel: 'objekt/' + l.id
        }));
        if (q.trim()) out.push({ art: 'suche', label: 'Alles zu „' + q.trim() + '“ durchsuchen', icon: 'suche', ziel: 'suche?q=' + encodeURIComponent(q.trim()) });
      }
      return out.slice(0, 12);
    }

    function malen() {
      liste.innerHTML = treffer.length
        ? treffer.map((t, i) => h`<button type="button" class="palette__eintrag ${i === markiert ? 'is-markiert' : ''}"
            role="option" aria-selected="${i === markiert ? 'true' : 'false'}" data-ziel="${t.ziel}">
            ${ico(t.icon)}<span><b>${t.label}</b>${t.unter ? h`<i>${t.unter}</i>` : ''}</span></button>`).join('')
        : '<p class="palette__leer">Nichts gefunden. Versuch es mit einer Stadt, einem Viertel oder einem Stichwort.</p>';
    }

    function aktualisieren() { treffer = vorschlaege(eingabe.value); markiert = 0; malen(); }

    eingabe.addEventListener('input', aktualisieren);
    eingabe.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); markiert = Math.min(treffer.length - 1, markiert + 1); malen(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); markiert = Math.max(0, markiert - 1); malen(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (treffer[markiert]) { paletteZu(); gehe(treffer[markiert].ziel); } }
      else if (e.key === 'Escape') { e.preventDefault(); paletteZu(); }
    });
    box.addEventListener('click', (e) => {
      const eintrag = e.target.closest('[data-ziel]');
      if (eintrag) { paletteZu(); gehe(eintrag.dataset.ziel); }
    });
    aktualisieren();
    setTimeout(() => eingabe.focus(), 20);
  }

  function paletteZu() {
    const box = U.$('#palette');
    box.hidden = true;
    box.innerHTML = '';
  }

  /* ================================================================
     Globale Aktionen
     ================================================================ */

  const AKTIONEN = {
    merken(el) {
      const id = el.dataset.id;
      const jetzt = NW.store.merken(id);
      toast(jetzt ? 'Gemerkt. Du findest es unter Merkliste.' : 'Aus der Merkliste entfernt.', jetzt ? 'gut' : 'info');
      neuZeichnen();
    },
    vergleich(el) {
      const meldung = NW.store.vergleichen(el.dataset.id);
      toast(meldung, meldung.indexOf('höchstens') >= 0 ? 'schlecht' : 'info');
      neuZeichnen();
    },
    theme() { themeWechseln(); },
    palette() { paletteOeffnen(); },
    'palette-zu'() { paletteZu(); },
    'dialog-zu'() { dialogZu(); },
    hilfe() {
      dialog({
        titel: 'Tastatur und Bedienung',
        inhalt: h`<dl class="tastatur">
          <dt><kbd>Strg</kbd>+<kbd>K</kbd></dt><dd>Schnellsuche über Bereiche, Städte, Viertel und Inserate</dd>
          <dt><kbd>/</kbd></dt><dd>Schnellsuche, wenn kein Eingabefeld aktiv ist</dd>
          <dt><kbd>Esc</kbd></dt><dd>Fenster und Schnellsuche schließen</dd>
          <dt><kbd>1</kbd>…<kbd>6</kbd></dt><dd>Direkt in einen Hauptbereich springen</dd>
          <dt><kbd>M</kbd></dt><dd>Auf einer Objektseite: merken</dd>
          <dt><kbd>V</kbd></dt><dd>Auf einer Objektseite: zum Vergleich</dd>
          <dt>Karte</dt><dd>Ziehen zum Verschieben, Mausrad oder <kbd>+</kbd>/<kbd>−</kbd> zum Zoomen, Pfeiltasten bei Fokus</dd>
        </dl>`
      });
    },
    daten() {
      const s = NW.store.get();
      const groesse = new Blob([JSON.stringify(s)]).size;
      dialog({
        titel: 'Meine Daten',
        inhalt: h`<p>Nestwerk speichert alles ausschließlich im Speicher dieses Browsers. Es gibt keinen Server,
          kein Konto und keine Übertragung an Dritte.</p>
        <ul class="liste-schlicht">
          <li>${Object.keys(s.merkliste).length} Merkungen</li>
          <li>${s.agenten.length} Suchaufträge</li>
          <li>${s.threads.length} Nachrichtenverläufe</li>
          <li>${s.eigeneInserate.length} eigene Inserate</li>
          <li>Belegter Speicher: rund ${U.num(Math.ceil(groesse / 1024))} kB</li>
        </ul>
        <p>Beim Leeren der Browserdaten verschwindet auch dieser Stand.</p>`,
        fuss: h`<button type="button" class="knopf knopf--still" data-tu="daten-export">${ico('speichern')}Als Datei sichern</button>
          <button type="button" class="knopf knopf--gefahr" data-tu="daten-loeschen">${ico('muell')}Alles zurücksetzen</button>`
      });
    },
    'daten-export'() {
      const daten = JSON.stringify(NW.store.get(), null, 2);

      /* Eingebettet in einer Seitenhülle, die Downloads unterbindet, führt
         ein gewöhnlicher Link ins Leere. Dort übernimmt die Speicher-
         Schnittstelle der Umgebung, sonst der klassische Weg – und wenn
         beides ausfällt, gibt es den Inhalt wenigstens zum Kopieren. */
      const umgebung = window.claude;
      if (umgebung && typeof umgebung.use === 'function') {
        umgebung.use('downloads').then((downloads) => {
          if (!downloads) { alsText(daten); return; }
          return downloads.save({ filename: 'nestwerk-daten.json', data: daten })
            .then(() => toast('Datei gesichert.', 'gut'),
              (fehler) => {
                if (fehler && fehler.code === 'declined') toast('Sicherung abgebrochen.');
                else alsText(daten);
              });
        }, () => alsText(daten));
        return;
      }

      const blob = new Blob([daten], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'nestwerk-daten.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      toast('Datei gesichert.', 'gut');
    },
    'daten-loeschen'() {
      if (!confirm('Merkliste, Profil, Suchaufträge und Nachrichten werden gelöscht. Fortfahren?')) return;
      NW.store.zuruecksetzen();
      dialogZu();
      toast('Alles zurückgesetzt.', 'info');
      neuZeichnen();
    },
    kopieren(el) {
      const quelle = el.dataset.quelle ? U.$(el.dataset.quelle) : null;
      const text = el.dataset.text || (quelle ? (quelle.value !== undefined ? quelle.value : quelle.textContent) : '');
      const fertig = () => toast('In die Zwischenablage kopiert.', 'gut');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(fertig, () => toast('Kopieren nicht möglich.', 'schlecht'));
      } else {
        const t = document.createElement('textarea');
        t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); fertig(); } catch (e) { toast('Kopieren nicht möglich.', 'schlecht'); }
        t.remove();
      }
    }
  };

  function aktionRegistrieren(name, fn) { AKTIONEN[name] = fn; }

  /* ================================================================
     Start
     ================================================================ */

  function start() {
    NW.store.laden();

    /* Die App bekommt einen eigenen Wurzelknoten und rührt den Rest des
       Dokuments nicht an. In der Einzeldatei stehen Stil und Skript im
       body – ein Überschreiben von body.innerHTML würde beides mitreißen. */
    let wurzel = document.getElementById('nestwerk');
    if (!wurzel) {
      wurzel = document.createElement('div');
      wurzel.id = 'nestwerk';
      document.body.appendChild(wurzel);
    }
    wurzel.innerHTML = schale();

    const s = NW.store.get();
    if (s.theme && s.theme !== 'auto') document.documentElement.setAttribute('data-theme', s.theme);

    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-tu]');
      if (!el) return;
      const fn = AKTIONEN[el.dataset.tu];
      if (!fn) return;
      e.preventDefault();
      fn(el, e);
    });

    document.addEventListener('change', (e) => {
      const el = e.target.closest('[data-tu-change]');
      if (!el) return;
      const fn = AKTIONEN[el.dataset.tuChange];
      if (fn) fn(el, e);
    });

    document.addEventListener('input', (e) => {
      const el = e.target.closest('[data-tu-input]');
      if (!el) return;
      const fn = AKTIONEN[el.dataset.tuInput];
      if (fn) fn(el, e);
    });

    document.addEventListener('submit', (e) => {
      const el = e.target.closest('[data-tu-submit]');
      if (!el) return;
      e.preventDefault();
      const fn = AKTIONEN[el.dataset.tuSubmit];
      if (fn) fn(el, e);
    });

    document.addEventListener('keydown', (e) => {
      const inFeld = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) ||
        document.activeElement.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); paletteOeffnen(); return; }
      if (inFeld) return;
      if (e.key === '/') { e.preventDefault(); paletteOeffnen(); return; }
      if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const n = NAV[Number(e.key) - 1];
        if (n) { e.preventDefault(); gehe(n.route); }
      }
    });

    window.addEventListener('hashchange', () => zeichnen());
    if (!location.hash) location.hash = '#/start';
    zeichnen(true);
  }

  Object.assign(ui, {
    start, gehe, zeichnen, neuZeichnen, toast, dialog, dialogZu,
    badge, passungsRing, energieBalken, inseratsKarte, ampelFarbe,
    ART_LABEL, ART_ICON, ico, aktionRegistrieren, AKTIONEN,
    aktualisiereZaehler, themeSetzen, paletteOeffnen, kartenMarken, preisZeile
  });
})(window.NW = window.NW || {});
