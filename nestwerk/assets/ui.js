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
    speichern: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7M8 20v-6h8v6"/>',
    werkzeug: '<path d="M14.7 6.3a4 4 0 015.3 5L21 12l-9 9-4-4 9-9z"/><path d="M6.5 10.5l-3 3 4 4 3-3"/>',
    schloss: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
    plus5: '<path d="M12 3l2.6 6.2 6.4.5-4.9 4.2 1.5 6.1L12 16.8 6.4 20l1.5-6.1L3 9.7l6.4-.5z"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v5h-5"/>',
    route: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5"/>'
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

  /* Die Art allein reicht als Beschriftung nicht mehr: „Kauf“ steht über
     einer Wohnung, einem Haus und einem Grundstück gleichermaßen, und das
     sind drei sehr verschiedene Dinge. */
  function artLabel(l) {
    if (l.kind === 'kauf') {
      return l.type === 'grundstueck' ? 'Grundstück' : l.type === 'haus' ? 'Haus' : 'Eigentumswohnung';
    }
    if (l.kind === 'miete' && l.type === 'haus') return 'Haus zur Miete';
    return ART_LABEL[l.kind];
  }

  const artIcon = (l) =>
    l.type === 'grundstueck' ? 'karte' : l.type === 'haus' ? 'dach' : ART_ICON[l.kind];

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
    /* Die Vertrauensstufe der anbietenden Seite gehört auf die Karte, nicht
       nur auf die Objektseite: Wer sie erst nach dem Klick sieht, hat schon
       Zeit verloren. Unter Stufe 2 wird gewarnt statt geschwiegen. */
    const st = NW.konto ? (l.anbieter.stufe === undefined ? (l.anbieter.verifiziert ? 3 : 1) : l.anbieter.stufe) : null;
    if (st !== null && st <= 1) marken.push(badge('Anbieter ungeprüft', 'warn', 'warnung'));
    else if (st !== null && st >= 4) marken.push(badge('Ausweis geprüft', 'gut', 'pruefen'));
    else if (l.anbieter.verifiziert) marken.push(badge('geprüft', 'neutral', 'pruefen'));
    if (b && b.risiko.stufe === 'warnung') marken.push(badge('Prüfhinweis', 'schlecht', 'warnung'));
    else if (b && b.risiko.stufe === 'achtung') marken.push(badge('genau lesen', 'warn', 'warnung'));
    if (b && b.mietCheck && b.mietCheck.diff <= -12) marken.push(badge(b.mietCheck.diff + ' % zum Spiegel', 'gut'));
    if (b && b.mietCheck && b.mietCheck.diff > 25) marken.push(badge('+' + b.mietCheck.diff + ' % zum Spiegel', 'schlecht'));
    if (l.befristetBis) marken.push(badge('befristet', 'warn'));
    if (l.kind === 'wg' && b && b.wg && b.wg.ausschluss.length) marken.push(badge('Ausschlusskriterium', 'schlecht'));
    /* Bezahlte Sichtbarkeit steht als Erstes und heißt beim Namen. */
    if (NW.plan.istTop(l)) marken.unshift(badge('Top-Anzeige', 'info', 'blitz'));
    else if (NW.plan.istHervorgehoben(l)) marken.unshift(badge('hervorgehoben', 'info', 'stern'));
    return marken;
  }

  function inseratsKarte(l, b, optionen) {
    const opt = optionen || {};
    const gemerkt = NW.store.gemerkt(l.id);
    const imVergleich = NW.store.imVergleich(l.id);
    const eck = [];
    if (l.type === 'grundstueck') {
      eck.push(U.num(l.grundstueck || l.flaeche) + ' m² Grund');
      eck.push(String((l.grund || {}).baulandArt || 'Bauland').split(',')[0]);
      eck.push('GRZ ' + U.dec((l.grund || {}).grz || 0));
    } else {
      eck.push(U.dec(l.zimmer) + ' Zi.');
      eck.push(l.flaeche + ' m²');
      if (l.kind === 'wg') eck.push('WG mit ' + l.wg.groesse);
      else if (l.type === 'haus') eck.push(l.grundstueck ? U.num(l.grundstueck) + ' m² Grund' : 'Haus');
      else eck.push(l.etage === 0 ? 'EG' : l.etage >= l.etagen ? 'DG' : l.etage + '. OG');
    }
    eck.push('ab ' + U.dateDE(l.freiAb));

    const hervor = NW.plan.istHervorgehoben(l);
    return h`<article class="karte-inserat ${opt.kompakt ? 'is-kompakt' : ''} ${hervor ? 'is-hervor' : ''}" data-id="${l.id}">
      <a class="karte-inserat__bild" href="#/objekt/${l.id}" aria-label="${l.titel} ansehen">
        ${raw(NW.img.make(l, 0))}
        <span class="karte-inserat__art">${ico(artIcon(l))}${artLabel(l)}</span>
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
     Tarifsperren und Anzeigen
     ================================================================ */

  /* Eine Sperre zeigt immer, was dahinterliegt – nie nur ein Schloss.
     Wer nicht sieht, was ihm fehlt, kann nicht entscheiden. */
  function sperrHinweis(leistungId, text) {
    const l = NW.plan.leistung(leistungId) || {};
    return h`<div class="sperre">
      <span class="sperre__zeichen">${ico('schloss')}</span>
      <div class="sperre__text">
        <b>${l.name || 'Mit Plus verfügbar'}</b>
        <p>${text || (l.frei + ' im freien Tarif, ' + l.plus + ' mit Plus.')}</p>
      </div>
      <button type="button" class="knopf knopf--klein" data-tu="sperre" data-leistung="${leistungId}">Ansehen</button>
    </div>`;
  }

  /* Anzeigen sind immer gekennzeichnet und sehen nie aus wie ein Inserat. */
  function anzeige(schluessel, variante) {
    const a = NW.plan.anzeige(schluessel);
    if (!a) return '';
    return h`<aside class="anzeige anzeige--${variante || 'breit'}" aria-label="Anzeige">
      <p class="anzeige__kopf">
        <span class="anzeige__marke">Anzeige</span>
        <span class="anzeige__art">${a.art}</span>
        <button type="button" class="anzeige__warum" data-tu="warum-werbung"
          title="Warum sehe ich das?" aria-label="Warum sehe ich das?">?</button>
      </p>
      <button type="button" class="anzeige__inhalt" data-tu="anzeige-klick">
        <span class="anzeige__zeichen">${ico(a.icon)}</span>
        <span class="anzeige__wort">
          <b>${a.titel}</b>
          <i>${a.text}</i>
          <em>${a.absender} · ${a.ruf}${ico('chevron')}</em>
        </span>
      </button>
      <a class="anzeige__ohne" href="#/plus">ohne Anzeigen lesen</a>
    </aside>`;
  }

  /* ================================================================
     Meldungen und Dialoge
     ================================================================ */

  const TOAST_MAX = 3;

  /* Meldungen dürfen sich nicht stapeln. Wer ein Formular ausfüllt,
     löst schnell ein Dutzend gleicher Hinweise aus – und sieht dann eine
     Wand aus Meldungen statt der Seite. Deshalb: gleiche Meldung wird
     aufgefrischt statt verdoppelt, und mehr als drei gleichzeitig gibt
     es nie. */
  function toast(text, art) {
    const box = U.$('#toasts');
    if (!box) return;

    const vorhanden = U.$$('.toast', box).find((t) => t.dataset.text === String(text));
    if (vorhanden) {
      vorhanden.classList.remove('is-weg');
      vorhanden.classList.add('is-frisch');
      setTimeout(() => vorhanden.classList.remove('is-frisch'), 200);
      planeAbgang(vorhanden);
      return;
    }

    const el = document.createElement('div');
    el.className = 'toast toast--' + (art || 'info');
    el.dataset.text = String(text);
    el.setAttribute('role', 'status');
    el.innerHTML = h`${ico(art === 'schlecht' ? 'warnung' : art === 'gut' ? 'pruefen' : 'info')}<span>${text}</span>`;
    box.appendChild(el);

    const alle = U.$$('.toast', box);
    if (alle.length > TOAST_MAX) alle.slice(0, alle.length - TOAST_MAX).forEach((x) => x.remove());
    planeAbgang(el);
  }

  function planeAbgang(el) {
    clearTimeout(Number(el.dataset.timer));
    el.dataset.timer = String(setTimeout(() => {
      el.classList.add('is-weg');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 800);
    }, 3600));
  }

  /* Notweg, wenn kein Speichern möglich ist: Inhalt zum Herauskopieren. */
  function alsText(daten, dateiname) {
    dialog({
      titel: 'Datei sichern',
      breit: true,
      inhalt: h`<p>In dieser Umgebung darf die Seite keine Datei ablegen. Der vollständige Inhalt steht
        hier zum Kopieren – speichere ihn als <code>${dateiname || 'nestwerk-daten.json'}</code>.</p>
        <label class="feld"><span class="nur-sr">Inhalt</span><textarea rows="12" id="daten-text" readonly>${daten}</textarea></label>`,
      fuss: h`<button type="button" class="knopf" data-tu="kopieren" data-quelle="#daten-text">${ico('kopieren')}Kopieren</button>`
    });
  }

  /* Drei Wege, eine Datei loszuwerden: die Speicher-Schnittstelle der
     Umgebung, der klassische Link, und zur Not der Text zum Kopieren.
     Eingebettet in einer Hülle läuft ein Download-Link sonst ins Leere. */
  function dateiSichern(dateiname, inhalt, mime) {
    const umgebung = window.claude;
    if (umgebung && typeof umgebung.use === 'function') {
      umgebung.use('downloads').then((downloads) => {
        if (!downloads) { alsText(inhalt, dateiname); return; }
        return downloads.save({ filename: dateiname, data: inhalt })
          .then(() => toast('Datei gesichert.', 'gut'),
            (fehler) => {
              if (fehler && fehler.code === 'declined') toast('Sicherung abgebrochen.');
              else alsText(inhalt, dateiname);
            });
      }, () => alsText(inhalt, dateiname));
      return;
    }
    const blob = new Blob([inhalt], { type: mime || 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = dateiname;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast('Datei gesichert.', 'gut');
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

    /* Ein Verweis im Dialog hat die Seite darunter gewechselt, während der
       Dialog stehen blieb. Bei einem echten Routenwechsel schließt er. */
    if (!erzwingen) dialogZu();

    /* Die Anmeldesperre. Was ohne Anmeldung erreichbar bleiben muss:
       Impressum, Datenschutzerklärung und AGB, weil § 5 DDG „ständig
       verfügbar“ verlangt und hinter einer Anmeldung nichts ständig
       verfügbar ist – dazu Widerruf, Meldeweg und die Hilfe. Wer nicht
       hereinkommt, braucht die Hilfe am dringendsten. */
    const OHNE_ANMELDUNG = ['anmelden', 'recht', 'hilfe', 'freigabe'];
    const gesperrt = NW.konto && !NW.konto.angemeldet() && OHNE_ANMELDUNG.indexOf(r.name) < 0;
    const name = gesperrt ? 'anmelden' : r.name;

    const ansicht = ui.ansichten[name] || ui.ansichten.start;
    ui.aktuell = name;
    ui.params = r;
    document.body.classList.toggle('ist-angemeldet', !(NW.konto && !NW.konto.angemeldet()));

    const haupt = U.$('#haupt');
    const ergebnis = ansicht(r) || {};
    document.title = (ergebnis.titel ? ergebnis.titel + ' – ' : '') + 'Nestwerk';
    haupt.innerHTML = ergebnis.html || '';
    haupt.dataset.ansicht = name;

    U.$$('[data-route]').forEach((a) => {
      a.classList.toggle('is-aktiv', a.dataset.route === name);
      if (a.dataset.route === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    if (ergebnis.danach) ergebnis.danach(haupt);
    bandZeichnen();
    if (NW.viewHilfe) NW.viewHilfe.zeichnen(false);
    /* Nur bei einem echten Ansichtswechsel nach oben – nicht bei jedem
       Neuaufbau derselben Seite. */
    if (wechsel && !erzwingen) scrolleSofort(0);
    aktualisiereZaehler();
  }

  /* Wiederaufbau der aktuellen Ansicht nach einer Zustandsänderung.

     Die Ansicht wird komplett neu gebaut – deshalb muss hier bewahrt
     werden, was sonst verlorenginge: die Stelle, an der jemand gerade
     liest, und der Tastaturfokus. Ohne das springt die Seite bei jedem
     Klick aufs Herz, und wer mit der Tastatur bedient, landet wieder
     ganz am Anfang. */
  function merkmalDesFokus() {
    const el = document.activeElement;
    if (!el || el === document.body || !document.getElementById('haupt')) return null;
    if (!document.getElementById('haupt').contains(el)) return null;
    const d = el.dataset || {};
    return {
      id: el.id || null,
      tu: d.tu || d.tuChange || d.tuInput || null,
      datenId: d.id || null,
      feld: d.feld || null,
      wert: d.wert || null,
      auswahl: el.selectionStart != null ? [el.selectionStart, el.selectionEnd] : null
    };
  }

  function fokusWiederherstellen(m) {
    if (!m) return;
    let ziel = null;
    if (m.id) ziel = document.getElementById(m.id);
    if (!ziel && m.tu) {
      const kandidaten = U.$$('[data-tu="' + m.tu + '"],[data-tu-change="' + m.tu + '"],[data-tu-input="' + m.tu + '"]');
      ziel = kandidaten.find((el) => {
        const d = el.dataset;
        return (!m.datenId || d.id === m.datenId) && (!m.feld || d.feld === m.feld) && (!m.wert || d.wert === m.wert);
      }) || null;
    }
    if (!ziel) return;
    try {
      ziel.focus({ preventScroll: true });
      if (m.auswahl && ziel.setSelectionRange) ziel.setSelectionRange(m.auswahl[0], m.auswahl[1]);
    } catch (e) { /* manche Elemente lassen sich nicht fokussieren */ }
  }

  /* Sprungfrei scrollen: Für Sprungmarken ist weiches Scrollen richtig,
     beim Wiederherstellen nach einem Neuaufbau wäre es eine sichtbare
     Rutschpartie. Deshalb hier ausdrücklich ohne Animation. */
  function scrolleSofort(y) {
    try {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
    } catch (e) {
      const wurzel = document.documentElement;
      const alt = wurzel.style.scrollBehavior;
      wurzel.style.scrollBehavior = 'auto';
      window.scrollTo(0, y);
      wurzel.style.scrollBehavior = alt;
    }
  }

  function neuZeichnen() {
    const y = window.scrollY;
    const fokus = merkmalDesFokus();
    zeichnen(true);
    scrolleSofort(y);
    fokusWiederherstellen(fokus);
  }

  /* ================================================================
     Kopf und Navigation
     ================================================================ */

  const NAV = [
    { route: 'start', label: 'Start', icon: 'dach', unten: true },
    { route: 'suche', label: 'Suchen', icon: 'suche', unten: true },
    { route: 'tausch', label: 'Ringtausch', icon: 'ring', unten: true },
    { route: 'werkzeuge', label: 'Werkzeuge', icon: 'werkzeug', unten: true },
    { route: 'merkliste', label: 'Merkliste', icon: 'herz', unten: true },
    { route: 'nachrichten', label: 'Nachrichten', icon: 'nachricht', unten: true },
    { route: 'profil', label: 'Profil', icon: 'person', unten: false }
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
          <a class="tarifknopf ${NW.plan.istPlus() ? 'is-plus' : ''}" href="#/plus"
            title="${NW.plan.istPlus() ? 'Nestwerk Plus aktiv' : 'Tarife ansehen'}">
            ${NW.plan.istPlus() ? raw(ico('plus5').__raw + '<span>Plus</span>') : raw('<span>Plus entdecken</span>')}</a>
          <a class="knopf knopf--klein nur-breit" href="#/inserieren">${ico('plus')}<span>Inserieren</span></a>
          <a class="ikon-btn nur-angemeldet" href="#/konto" title="Konto" aria-label="Konto">${ico('person')}</a>
        </div>
      </div>
    </header>
    <div id="band"></div>
    <main id="haupt" tabindex="-1"></main>
    <nav class="unten" aria-label="Hauptbereiche">
      ${NAV.filter((n) => n.unten).map((n) => h`<a href="#/${n.route}" data-route="${n.route}">
        ${ico(n.icon)}<span>${n.label}</span>
        ${n.route === 'merkliste' ? raw('<b class="zaehler zaehler--eck" data-zaehler="merkliste" hidden></b>') : ''}
        ${n.route === 'nachrichten' ? raw('<b class="zaehler zaehler--eck" data-zaehler="nachrichten" hidden></b>') : ''}</a>`)}
    </nav>
    <footer class="fuss">
      <p><b>Nestwerk</b> führt Mietmarkt, WG-Suche und Wohnungstausch in einer Oberfläche zusammen.</p>
      <p class="fuss__hinweis">Vorführfassung mit erzeugtem Beispielbestand. Alle Angaben, Anbieter und Adressen sind erfunden.
      Rechtliche Erläuterungen sind allgemeine Hinweise und ersetzen keine Beratung.
      Deine Eingaben bleiben im Browser dieses Geräts.</p>
      <p class="fuss__links fuss__links--recht">
        <a href="#/recht/impressum">Impressum</a>
        <a href="#/recht/datenschutz">Datenschutz</a>
        <a href="#/recht/agb">AGB</a>
        <a href="#/recht/widerruf">Widerruf</a>
        <a href="#/recht/kuendigen">Verträge kündigen</a>
        <a href="#/recht/melden">Inhalt melden</a>
        <a href="#/recht/barrierefreiheit">Barrierefreiheit</a>
      </p>
      <p class="fuss__links">
        <button type="button" class="link" data-tu="hilfe-oeffnen">Hilfe</button>
        <a href="#/konto">Konto</a>
        <a href="#/plus">Tarife</a>
        <a href="#/werkzeuge">Werkzeuge</a>
        <a href="#/tresor">Dokumententresor</a>
        <button type="button" class="link" data-tu="hilfe">Tastaturbefehle</button>
        <button type="button" class="link" data-tu="daten">Meine Daten</button>
      </p>
    </footer>
    <div id="hilfe" class="hilfe"></div>
    <div id="dialog" class="dialog" hidden></div>
    <div id="toasts" class="toasts" aria-live="polite"></div>
    <div id="palette" class="palette" hidden></div>`;
  }

  /* Ein schmales Band unter der Kopfzeile für Dinge, die ihre Zeit haben:
     derzeit nur der Hinweis, dass ein Gründerjahr zu Ende geht. Wer vier
     Wochen vorher Bescheid weiß, wird von nichts überrascht – und genau
     das ist der Unterschied zu einem Abo, das sich still verlängert. */
  function bandZeichnen() {
    const el = U.$('#band');
    if (!el) return;
    const P = NW.plan;
    const s = NW.store.get();
    const g = P.gruender();
    let inhalt = '';

    if (g.nummer && P.gruenderAktiv() && P.gruenderTageRest() <= 28) {
      const tage = P.gruenderTageRest();
      const weg = s.hinweiseGelesen['gruenderEnde'];
      /* „in 12 Tagen“, nicht „in 12 Tage“ – die Zeitangabe steht im Dativ. */
      const wann = tage <= 1 ? 'morgen' : 'in ' + tage + ' Tagen';
      if (!weg || U.daysSince(weg) >= 7) {
        inhalt = h`<div class="band band--hinweis">
          ${ico('verlauf')}
          <p><b>Dein Gründerjahr endet ${wann}</b>, am ${U.dateDE(g.bis)}.
            Danach läuft nichts weiter und es wird nichts abgebucht – der freie Tarif steht dir offen, Plus nur,
            wenn du dich aktiv dafür entscheidest.</p>
          <a class="knopf knopf--klein" href="#/plus">Tarife ansehen</a>
          <button type="button" class="ikon-btn" data-tu="band-zu" data-was="gruenderEnde"
            aria-label="Hinweis ausblenden">${ico('x')}</button>
        </div>`;
      }
    } else if (g.nummer && !P.gruenderAktiv() && !s.hinweiseGelesen['gruenderVorbei']) {
      inhalt = h`<div class="band">
        ${ico('info')}
        <p><b>Dein Gründerjahr ist abgelaufen.</b> Merkliste, Profil und Notizen sind vollständig erhalten;
          nur die Plus-Funktionen ruhen.</p>
        <a class="knopf knopf--klein" href="#/plus">Weitermachen</a>
        <button type="button" class="ikon-btn" data-tu="band-zu" data-was="gruenderVorbei"
          aria-label="Hinweis ausblenden">${ico('x')}</button>
      </div>`;
    }
    el.innerHTML = String(inhalt);
  }

  function aktualisiereZaehler() {
    const s = NW.store.get();

    /* Der Kopf entsteht nur einmal beim Start; der Tarifknopf darin muss
       einem Wechsel trotzdem folgen. */
    const tarifknopf = U.$('.tarifknopf');
    if (tarifknopf) {
      const plus = NW.plan.istPlus();
      tarifknopf.classList.toggle('is-plus', plus);
      tarifknopf.title = plus ? 'Nestwerk Plus aktiv' : 'Tarife ansehen';
      tarifknopf.innerHTML = plus
        ? ico('plus5').__raw + '<span>Plus</span>'
        : '<span>Plus entdecken</span>';
    }

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
        { route: 'rechner', label: 'Mieten oder kaufen', icon: 'rechner' },
        { route: 'leistbarkeit', label: 'Was kann ich mir leisten?', icon: 'euro' },
        { route: 'wbs', label: 'Wohnberechtigungsschein', icon: 'blatt' },
        { route: 'wohngeld', label: 'Wohngeld prüfen', icon: 'euro' },
        { route: 'nebenkosten', label: 'Nebenkosten prüfen', icon: 'lupe' },
        { route: 'uebergabe', label: 'Übergabeprotokoll', icon: 'schluessel' },
        { route: 'tresor', label: 'Dokumententresor', icon: 'schloss' },
        { route: 'markt', label: 'Marktdaten und Preisverlauf', icon: 'trend' },
        { route: 'plus', label: 'Tarife', icon: 'plus5' },
        { route: 'recht', label: 'Rechtliches', icon: 'blatt' },
        { route: 'recht/impressum', label: 'Impressum', icon: 'info' },
        { route: 'recht/datenschutz', label: 'Datenschutz', icon: 'schloss' },
        { route: 'recht/agb', label: 'AGB', icon: 'blatt' },
        { route: 'recht/widerruf', label: 'Widerruf', icon: 'zurueck' },
        { route: 'recht/kuendigen', label: 'Verträge kündigen', icon: 'x' },
        { route: 'hilfe', label: 'Hilfe und häufige Fragen', icon: 'nachricht' },
        { route: 'konto', label: 'Konto und Vertrauensstufe', icon: 'person' }
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
      if (meldung === 'gesperrt:vergleich') {
        AKTIONEN.sperre({ dataset: { leistung: 'vergleich' } });
        return;
      }
      toast(meldung, 'info');
      neuZeichnen();
    },
    theme() { themeWechseln(); },

    sperre(el) {
      const id = el.dataset.leistung;
      const l = NW.plan.leistung(id) || { name: 'Diese Funktion' };
      const t = NW.plan.TARIFE.plus;
      dialog({
        titel: l.name,
        inhalt: h`<p class="sperre__gross">${ico('schloss')}</p>
          <p><b>Im freien Tarif:</b> ${l.frei}<br><b>Mit Plus:</b> ${l.plus}</p>
          ${l.warum ? h`<p class="fein">${l.warum}</p>` : ''}
          <p>${t.zeile}</p>
          <p class="sperre__preis"><b>${U.eur2(t.preisMonat)}</b> im Monat, monatlich kündbar –
            oder ${U.eur(t.preisJahr)} im Jahr.</p>
          <div class="hinweisbox">${ico('info')}
            <div><b>Was Plus nicht kauft</b>
            <p>Keine bessere Platzierung, keinen Vorrang bei Vermietern und keinen Frühzugang zu Inseraten.
              Alle sehen jedes Inserat in derselben Sekunde.</p></div>
          </div>`,
        fuss: h`<a class="knopf knopf--still" href="#/plus" data-tu="dialog-zu">Alle Unterschiede ansehen</a>
          <button type="button" class="knopf" data-tu="plus-testen">${ico('plus5')}Plus in dieser Vorführung aktivieren</button>`
      });
    },

    'plus-testen'() {
      NW.plan.wechseln('plus', 'monat');
      dialogZu();
      toast('Plus ist aktiv. In der Vorführung kostenlos und jederzeit umschaltbar.', 'gut');
      neuZeichnen();
    },

    'plus-beenden'() {
      NW.plan.wechseln('frei');
      if (NW.plan.plusQuelle() === 'gruender') {
        /* Ein bezahltes Abo lässt sich beenden, ein Gründerplatz nicht
           nebenbei – er ist keine Zahlung, sondern eine Zusage. */
        toast('Der bezahlte Vertrag ist beendet. Plus läuft über deinen Gründerplatz weiter.', 'gut');
      } else {
        toast('Zurück im freien Tarif.');
      }
      neuZeichnen();
    },

    'band-zu'(el) {
      NW.store.update((s) => { s.hinweiseGelesen[el.dataset.was] = U.isoDate(NW.now()); }, 'hinweis');
      bandZeichnen();
    },

    'warum-top'() {
      dialog({
        titel: 'Warum steht das oben?',
        inhalt: h`<p>Diese Inserate stehen dort, weil die anbietende Seite für den Platz bezahlt hat. Nestwerk
            zeigt bezahlte Plätze <b>getrennt und beschriftet</b> – nie zwischen den Treffern.</p>
          <p><b>Was das nicht bedeutet:</b></p>
          <ul class="liste-schlicht">
            <li>Die Reihenfolge deiner Treffer darunter ändert sich dadurch nicht. Sie folgt weiter deinem Profil.</li>
            <li>Ein bezahlter Platz sagt nichts über die Wohnung. Prüfhinweis, Vergleichsmiete und Chancen
              rechnet Nestwerk hier genauso wie überall.</li>
            <li>Kein Inserat verschwindet, weil ein anderes bezahlt hat. Die Liste bleibt vollständig.</li>
          </ul>
          <p class="fein">Höchstens ${NW.plan.TOP_MAX} bezahlte Plätze über einer Trefferliste. Mehr, und der
            eigentliche Inhalt begänne unterhalb des Bildschirmrands.</p>`,
        fuss: h`<a class="knopf knopf--still" href="#/inserieren" data-tu="dialog-zu">Eigenes Inserat hervorheben</a>
          <button type="button" class="knopf" data-tu="dialog-zu">Verstanden</button>`
      });
    },

    'warum-werbung'() {
      dialog({
        titel: 'Warum sehe ich Anzeigen?',
        inhalt: h`<p>Nestwerk ist im freien Tarif vollständig nutzbar – die Suche, die Karte, der Prüfhinweis,
            die Vergleichsmiete und alle Rechner. Bezahlt wird das über Anzeigen.</p>
          <p><b>Was wir dabei nicht tun:</b></p>
          <ul class="liste-schlicht">
            <li>Anzeigen sehen nie aus wie ein Inserat und stehen nie in der Trefferreihenfolge.</li>
            <li>Kein Werbetreibender bekommt Einfluss darauf, welche Wohnungen dir angezeigt werden.</li>
            <li>Es werden keine Daten über dich an Werbetreibende gegeben – die Auswahl entsteht im Browser.</li>
          </ul>
          <p class="fein">In dieser Vorführung sind alle Anzeigen erfunden und führen nirgendwohin.</p>`,
        fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Verstanden</button>
          <a class="knopf" href="#/plus" data-tu="dialog-zu">Ohne Anzeigen lesen</a>`
      });
    },

    'anzeige-klick'() {
      toast('Beispielanzeige – sie führt in dieser Vorführung nirgendwohin.');
    },
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
          <dt><kbd>1</kbd>…<kbd>7</kbd></dt><dd>Direkt in einen Hauptbereich springen</dd>
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
        <p>Beim Leeren der Browserdaten verschwindet auch dieser Stand.</p>
        ${NW.tresor && NW.tresor.eingerichtet() ? h`<div class="hinweisbox">${ico('schloss')}
          <div><b>Der Dokumententresor liegt getrennt davon</b>
          <p>Er wird hier weder gesichert noch gelöscht: Verschlüsselte Unterlagen in eine Klartextdatei zu
            exportieren wäre das Gegenteil dessen, wofür er da ist. Leeren lässt er sich im
            <a href="#/tresor">Tresor</a> selbst.</p></div>
        </div>` : ''}`,
        fuss: h`<button type="button" class="knopf knopf--still" data-tu="daten-export">${ico('speichern')}Als Datei sichern</button>
          <button type="button" class="knopf knopf--gefahr" data-tu="daten-loeschen">${ico('muell')}Alles zurücksetzen</button>`
      });
    },
    'daten-export'() {
      dateiSichern('nestwerk-daten.json', JSON.stringify(NW.store.get(), null, 2), 'application/json');
    },

    'daten-loeschen'() {
      if (!confirm('Merkliste, Profil, Suchaufträge und Nachrichten werden gelöscht. '
        + 'Der Dokumententresor bleibt bestehen – ihn leerst du dort. Fortfahren?')) return;
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
    if (NW.konto) NW.konto.laden();

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
      if (e.key >= '1' && e.key <= '7' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const n = NAV[Number(e.key) - 1];
        if (n) { e.preventDefault(); gehe(n.route); }
      }
    });

    window.addEventListener('hashchange', () => zeichnen());

    /* Endet die Sitzung – hier, oder in einem zweiten Fenster desselben
       Browsers –, muss die Oberfläche sofort zusperren. Eine Anwendung,
       die nach dem Abmelden noch offensteht, hat nicht abgemeldet. */
    if (NW.konto) {
      NW.konto.on((k, grund) => {
        if (grund === 'abmeldung' || grund === 'anmeldung') neuZeichnen();
      });
      window.addEventListener('storage', (e) => {
        if (e.key !== 'nestwerk.konto.v1') return;
        NW.konto.laden();
        neuZeichnen();
      });
    }
    if (!location.hash) location.hash = '#/start';
    zeichnen(true);
  }

  Object.assign(ui, {
    start, gehe, zeichnen, neuZeichnen, toast, dialog, dialogZu,
    badge, passungsRing, energieBalken, inseratsKarte, ampelFarbe,
    ART_LABEL, ART_ICON, artLabel, artIcon, ico, aktionRegistrieren, AKTIONEN,
    sperrHinweis, anzeige, NAV, dateiSichern,
    aktualisiereZaehler, themeSetzen, paletteOeffnen, kartenMarken, preisZeile
  });
})(window.NW = window.NW || {});
