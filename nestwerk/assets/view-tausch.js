/* =====================================================================
   Nestwerk – Ansicht: Ringtausch
   Der direkte Tausch scheitert fast immer daran, dass genau zwei Leute
   genau das Gegenteil wollen. Über Ketten geht es: A zieht zu B, B zu C,
   C in die Wohnung von A. Nestwerk sucht diese Ketten automatisch.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, A = NW.analyse, S = NW.store, M = NW.match, P = NW.plan;
  const h = U.html, raw = U.raw, ico = U.svg;

  let sicht = { nurMeine: false, maxLaenge: 4, minGuete: 60 };

  /* ------------------------- Ringgrafik ------------------------- */

  /* Jede Grafik bringt ihre eigene Pfeilspitze mit – mehrere Ringe auf
     einer Seite dürfen sich nicht dieselbe Kennung teilen. */
  let grafikNummer = 0;

  function ringGrafik(r) {
    const spitze = 'pfeilspitze-' + (++grafikNummer);
    const n = r.knoten.length;
    const g = 260, mitte = g / 2, radius = g / 2 - 52;
    const punkte = r.knoten.map((k, i) => {
      const w = -Math.PI / 2 + i * 2 * Math.PI / n;
      return { x: mitte + Math.cos(w) * radius, y: mitte + Math.sin(w) * radius, k };
    });
    let pfeile = '';
    punkte.forEach((p, i) => {
      const q = punkte[(i + 1) % n];
      /* Etwas eingezogen, damit die Spitze nicht im Knoten steckt. */
      const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1;
      const ax = p.x + dx / len * 26, ay = p.y + dy / len * 26;
      const bx = q.x - dx / len * 30, by = q.y - dy / len * 30;
      const kr = 1 - (r.kanten[i] ? r.kanten[i].wert : 1);
      const farbe = kr < 0.12 ? 'var(--gut)' : kr < 0.3 ? 'var(--warn)' : 'var(--schlecht)';
      pfeile += '<path d="M' + ax.toFixed(1) + ' ' + ay.toFixed(1) + 'L' + bx.toFixed(1) + ' ' + by.toFixed(1) +
        '" stroke="' + farbe + '" stroke-width="2.4" marker-end="url(#' + spitze + ')"/>';
    });
    let knoten = '';
    punkte.forEach((p, i) => {
      knoten += '<g class="ringgrafik__knoten" transform="translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')">' +
        '<circle r="21" class="' + (p.k.eigen ? 'is-ich' : '') + '"/>' +
        '<text y="5">' + (p.k.eigen ? 'Du' : String.fromCharCode(65 + i)) + '</text></g>';
    });
    return raw('<svg class="ringgrafik" viewBox="0 0 ' + g + ' ' + g + '" role="img" aria-label="Tauschkette mit ' + n + ' Beteiligten">' +
      '<defs><marker id="' + spitze + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>' +
      pfeile + knoten + '</svg>');
  }

  function ringKarte(r, index) {
    const buchstabe = (i) => r.knoten[i].eigen ? 'Du' : String.fromCharCode(65 + i);
    return h`<article class="ringkarte">
      <header class="ringkarte__kopf">
        <div>
          <h3>${r.laenge === 2 ? 'Direkter Tausch' : r.laenge + 'er-Ring'}
            ${r.knoten.some((k) => k.eigen) ? ui.badge('mit dir', 'gut') : ''}</h3>
          <p>${r.laenge === 2 ? r.knoten[0].stadt + ' ↔ ' + r.knoten[1].stadt
        : r.knoten.map((k) => k.stadt).join(' → ') + ' → ' + r.knoten[0].stadt}</p>
        </div>
        <div class="ringkarte__guete">
          <b>${Math.round(r.wert * 100)} %</b><span>Güte</span>
        </div>
      </header>
      <div class="ringkarte__koerper">
        ${ringGrafik(r)}
        <ol class="ringkarte__schritte">
          ${r.knoten.map((k, i) => {
      const ziel = r.knoten[(i + 1) % r.laenge];
      return h`<li>
              <span class="ringkarte__marke">${buchstabe(i)}</span>
              <div>
                <b><a href="#/objekt/${k.id}">${U.dec(k.zimmer)} Zi., ${k.flaeche} m², ${U.eur(k.warm)} warm</a></b>
                <span>${k.viertel}, ${k.stadt} → zieht nach ${ziel.viertel}, ${ziel.stadt}</span>
                ${r.kanten[i] && r.kanten[i].maengel.length
          ? h`<i class="ringkarte__mangel">${ico('warnung')}${r.kanten[i].maengel.join(' · ')}</i>` : ''}
              </div>
            </li>`;
    })}
        </ol>
      </div>
      <footer class="ringkarte__fuss">
        <span>schwächstes Glied: ${Math.round(r.schwaechste * 100)} %</span>
        <span>${r.knoten.filter((k) => k.tausch.vermieterZustimmung === 'liegt vor').length} von ${r.laenge} Vermieterzustimmungen liegen vor</span>
        <button type="button" class="knopf knopf--klein" data-tu="ring-anstossen" data-i="${index}">${ico('nachricht')}Kette anstoßen</button>
      </footer>
    </article>`;
  }

  /* ------------------------- Eigenes Angebot ------------------------- */

  function meinAngebot() {
    const s = S.get();
    const m = s.meinTausch;
    if (!m) {
      return h`<section class="block block--betont">
        <h2>${ico('tausch')}Dein Tauschangebot fehlt noch</h2>
        <p>Ohne eigene Wohnung im Topf kann Nestwerk dich in keine Kette einbauen. Das Anlegen dauert zwei Minuten.</p>
        <p><button type="button" class="knopf" data-tu="tausch-anlegen">${ico('plus')}Angebot anlegen</button></p>
      </section>`;
    }
    const alle = NW.data.listings.filter((x) => x.kind === 'tausch').concat([m]);
    const einseitig = M.einseitig(alle, m);
    const schrauben = M.stellschrauben(NW.data.listings.filter((x) => x.kind === 'tausch'), m);
    return h`<section class="block block--betont">
      <h2>${ico('tausch')}Dein Angebot</h2>
      <div class="meintausch">
        <div>
          <b>${U.dec(m.zimmer)} Zi. · ${m.flaeche} m² · ${U.eur(m.warm)} warm</b>
          <span>${m.viertel}, ${m.stadt}</span>
        </div>
        <div>
          <b>gesucht: ${m.tausch.suche.staedte.join(', ')}</b>
          <span>ab ${U.dec(m.tausch.suche.zimmerMin)} Zi., ${m.tausch.suche.flaecheMin} m², bis ${U.eur(m.tausch.suche.warmMax)}</span>
        </div>
        <div class="meintausch__tun">
          <button type="button" class="knopf knopf--klein knopf--still" data-tu="tausch-anlegen">${ico('stift')}Ändern</button>
          <button type="button" class="knopf knopf--klein knopf--still" data-tu="tausch-weg">${ico('muell')}Entfernen</button>
        </div>
      </div>
      <div class="kennzahlen kennzahlen--vier">
        <div><b>${einseitig.wollenMich.length}</b><span>würden deine Wohnung nehmen</span></div>
        <div><b>${einseitig.ichWill.length}</b><span>Wohnungen passen dir</span></div>
        <div><b>${M.ringeFuer(alle, m.id, { maxLen: 2 }).length}</b><span>direkte Tausche</span></div>
        <div><b>${M.ringeFuer(alle, m.id).length}</b><span>Ketten insgesamt</span></div>
      </div>
      ${schrauben.length ? h`<h3>Was mehr Ketten bringen würde</h3>
        ${P.darf('stellschrauben')
        ? h`<ul class="schrauben">
            ${schrauben.slice(0, 4).map((s2) => h`<li>
              <span>${s2.label}</span>
              <b>+${s2.gewinn} ${U.plural(s2.gewinn, 'Kette', 'Ketten')}</b>
            </li>`)}
          </ul>
          <p class="fein">Nestwerk hat jede Lockerung einzeln durchgerechnet – das sind keine Schätzungen.</p>`
        : h`<ul class="schrauben schrauben--verdeckt">
            ${schrauben.slice(0, 4).map((s2) => h`<li><span>${s2.label}</span><b>+? Ketten</b></li>`)}
          </ul>
          ${ui.sperrHinweis('stellschrauben', 'Nestwerk hat jede dieser Lockerungen einzeln durchgerechnet. '
          + 'Mit Plus siehst du, wie viele zusätzliche Ketten jede einzelne öffnet.')}`}` : ''}
    </section>`;
  }

  /* ------------------------- Ansicht ------------------------- */

  function ansicht() {
    const s = S.get();
    const angebote = NW.data.listings.filter((x) => x.kind === 'tausch').concat(s.meinTausch ? [s.meinTausch] : []);
    const erlaubt = P.grenze('ringLaenge');
    if (sicht.maxLaenge > erlaubt) sicht.maxLaenge = erlaubt;
    /* Auch im freien Tarif wird alles gerechnet – nur nicht alles gezeigt.
       Wer nicht weiß, was ihm entgeht, kann nicht entscheiden. */
    const gesamt = M.ringe(angebote, { maxLen: 4, minWert: 0.5 });
    const laengere = gesamt.filter((r) => r.laenge > erlaubt);
    let alle = M.ringe(angebote, { maxLen: sicht.maxLaenge, minWert: 0.5 });
    alle = alle.filter((r) => r.wert * 100 >= sicht.minGuete);
    if (sicht.nurMeine) alle = alle.filter((r) => r.knoten.some((k) => k.eigen));
    NW.viewTausch.letzte = alle;

    const zahlen = { 2: 0, 3: 0, 4: 0 };
    alle.forEach((r) => { zahlen[r.laenge] = (zahlen[r.laenge] || 0) + 1; });

    return {
      titel: 'Ringtausch',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('ring')}Ringtausch</h1>
          <p class="seite__unter">Beim direkten Tausch müssen zwei Menschen exakt das Gegenteil voneinander wollen –
            das passiert fast nie. In einer Kette reicht es, wenn jeder die Wohnung des Nächsten möchte.
            Nestwerk durchsucht alle Angebote nach solchen geschlossenen Ketten.</p>
          <p class="werkzeug__weiter">
            <button type="button" class="knopf knopf--still" data-tu="ring-erklaeren">
              ${ico('ring')}In vier Bildern erklärt</button></p>
        </header>

        ${meinAngebot()}

        <section class="block">
          <div class="block__kopfzeile">
            <h2>${alle.length} ${U.plural(alle.length, 'Kette', 'Ketten')} gefunden</h2>
            <p class="fein">${zahlen[2] || 0} direkt · ${zahlen[3] || 0} Dreier · ${zahlen[4] || 0} Vierer</p>
          </div>
          <div class="tauschfilter">
            <label class="schalter"><input type="checkbox" data-tu-change="ring-meine" ${sicht.nurMeine ? 'checked' : ''}>
              <span>nur Ketten mit meinem Angebot</span></label>
            <label class="feld feld--flach"><span>höchstens</span>
              <select data-tu-change="ring-laenge">
                ${[2, 3, 4].map((n) => h`<option value="${n}" ${sicht.maxLaenge === n ? 'selected' : ''}
                  ${n > erlaubt ? 'disabled' : ''}>${n} Beteiligte${n > erlaubt ? ' – Plus' : ''}</option>`)}
              </select></label>
            <label class="feld feld--regler"><span>Güte ab ${sicht.minGuete} %</span>
              <input type="range" min="50" max="100" step="5" value="${sicht.minGuete}" data-tu-input="ring-guete"></label>
          </div>

          ${alle.length ? h`<div class="ringliste-gross">${alle.slice(0, 12).map((r, i) => ringKarte(r, i))}</div>`
        : h`<div class="leer">${ico('ring')}<h3>Keine Kette in dieser Einstellung</h3>
            <p>Senk die Mindestgüte, erlaub längere Ketten oder lockere dein eigenes Angebot.</p></div>`}

          ${laengere.length ? h`<div class="ringsperre">
            <h3>${ico('schloss')}${laengere.length} weitere ${U.plural(laengere.length, 'Kette', 'Ketten')} über drei und vier Haushalte</h3>
            <p>Der direkte Tausch scheitert fast immer daran, dass zwei Menschen exakt das Gegenteil voneinander
              wollen. Genau deshalb sind die längeren Ketten der eigentliche Nutzen – gerade sind
              ${laengere.filter((r) => r.laenge === 3).length} Dreier- und
              ${laengere.filter((r) => r.laenge === 4).length} Viererketten offen.</p>
            <ul class="ringsperre__liste">
              ${laengere.slice(0, 3).map((r) => h`<li>
                <b>${r.laenge}er-Ring</b>
                <span>${r.knoten.map(() => '•').join(' → ')} → •</span>
                <em>${Math.round(r.wert * 100)} % Güte</em></li>`)}
            </ul>
            ${ui.sperrHinweis('ring')}
          </div>` : ''}
        </section>

        <section class="block">
          <h2>${ico('info')}Wie ein Tausch praktisch abläuft</h2>
          <ol class="ablauf">
            <li><b>Kette bestätigen</b><span>Alle Beteiligten sagen zu. Ein Wackelkandidat reißt die ganze Kette.</span></li>
            <li><b>Vermieter fragen</b><span>Jede Vermieterseite muss zustimmen. Genossenschaften und kommunale
              Gesellschaften sind das gewohnt, private Eigentümer meist nicht.</span></li>
            <li><b>Termine abstimmen</b><span>Alle Umzüge sollten in dieselbe Woche fallen – sonst zahlt jemand doppelt Miete.</span></li>
            <li><b>Verträge schließen</b><span>Rechtlich ist es kein Tausch, sondern für jede Wohnung ein neuer
              Mietvertrag. Alte Konditionen laufen nicht mit.</span></li>
            <li><b>Übergaben protokollieren</b><span>Zählerstände, Mängel, Schlüsselanzahl – jede Wohnung einzeln.</span></li>
          </ol>
          <p class="fein">Ein Anspruch auf Zustimmung besteht nicht. Manche Vermieter verlangen dieselben
            Unterlagen wie bei jeder Neuvermietung – die Bewerbermappe im Profil hilft auch hier.</p>
          <p class="werkzeug__weiter">
            <button type="button" class="knopf knopf--klein knopf--still" data-tu="ring-erklaeren">
              ${ico('ring')}Das Ganze als Bild</button></p>
        </section>

        <section class="block">
          <h2>${ico('liste')}Alle Tauschangebote</h2>
          <div class="ergebnisse__liste ergebnisse__liste--drei">
            ${NW.data.listings.filter((x) => x.kind === 'tausch').slice(0, 9)
          .map((x) => ui.inseratsKarte(x, A.bewerten(x, s.profil), { kompakt: true }))}
          </div>
          <p><a class="knopf knopf--still" href="#/suche?art=tausch">Alle in der Suche ansehen</a></p>
        </section>
      </div>`
    };
  }

  /* ------------------------- Aktionen ------------------------- */

  const A_ = ui.aktionRegistrieren;

  A_('ring-meine', (el) => { sicht.nurMeine = el.checked; ui.neuZeichnen(); });
  A_('ring-laenge', (el) => { sicht.maxLaenge = Number(el.value); ui.neuZeichnen(); });
  A_('ring-guete', U.debounce((el) => { sicht.minGuete = Number(el.value); ui.neuZeichnen(); }, 200));

  A_('ring-anstossen', (el) => {
    const r = NW.viewTausch.letzte[Number(el.dataset.i)];
    if (!r) return;
    const zeilen = ['Vorschlag für einen ' + (r.laenge === 2 ? 'direkten Tausch' : r.laenge + 'er-Ringtausch') + ':', ''];
    r.knoten.forEach((k, i) => {
      const ziel = r.knoten[(i + 1) % r.laenge];
      zeilen.push((i + 1) + '. ' + (k.eigen ? 'Ich' : k.anbieter.name) + ' – ' + U.dec(k.zimmer) + ' Zi., ' +
        k.flaeche + ' m², ' + U.eur(k.warm) + ' warm, ' + k.viertel + ' (' + k.stadt + ') → zieht nach ' +
        ziel.viertel + ' (' + ziel.stadt + ')');
    });
    zeilen.push('', 'Güte der Kette: ' + Math.round(r.wert * 100) + ' %. Schwächstes Glied: ' + Math.round(r.schwaechste * 100) + ' %.');
    if (r.maengel.length) zeilen.push('Abstriche: ' + U.uniq(r.maengel).join('; '));
    zeilen.push('', 'Nächster Schritt: Alle bestätigen, dann fragt jede und jeder die eigene Vermieterseite.');
    ui.dialog({
      titel: 'Kette anstoßen',
      breit: true,
      inhalt: h`<p>Nestwerk hat eine Nachricht vorbereitet, die an alle Beteiligten geht.
        In dieser Vorführung wird nichts wirklich verschickt – kopier den Text und nutze ihn, wie du magst.</p>
        <label class="feld"><span>Nachricht</span><textarea rows="12" id="ring-text">${zeilen.join('\n')}</textarea></label>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="kopieren" data-quelle="#ring-text">${ico('kopieren')}Kopieren</button>
        <button type="button" class="knopf" data-tu="dialog-zu">Schließen</button>`
    });
  });

  /* ------------------------- Ringtausch erklärt -------------------------
     Ein Dialog, vier Bilder. Der Inhalt wird an Ort und Stelle getauscht
     statt einen neuen Dialog zu öffnen – sonst springt der Fokus bei
     jedem Schritt zurück an den Anfang. */

  let schritt = 0;

  function erklaerungInhalt() {
    const s = NW.ringBild.SCHRITTE[schritt];
    return h`<div class="ringerklaerung">
      <ol class="ringerklaerung__punkte">
        ${NW.ringBild.SCHRITTE.map((x, i) => h`<li class="${i === schritt ? 'is-an' : i < schritt ? 'is-durch' : ''}">
          <button type="button" data-tu="ring-schritt" data-n="${i}"
            aria-current="${i === schritt ? 'step' : 'false'}"><span class="nur-sr">Schritt ${i + 1}: ${x.titel}</span></button>
        </li>`)}
      </ol>
      <figure class="ringerklaerung__bild">
        ${raw(s.bild())}
        <figcaption><b>${s.titel}</b> ${s.text}</figcaption>
      </figure>
    </div>`;
  }

  function erklaerungZeichnen() {
    const ziel = U.$('#ring-erklaerung');
    if (ziel) ziel.innerHTML = String(erklaerungInhalt());
    const fuss = U.$('#ring-erklaerung-fuss');
    if (fuss) fuss.innerHTML = String(erklaerungFuss());
  }

  function erklaerungFuss() {
    const letzter = schritt >= NW.ringBild.SCHRITTE.length - 1;
    return h`<button type="button" class="knopf knopf--still" data-tu="ring-schritt" data-n="${schritt - 1}"
        ${schritt === 0 ? 'disabled' : ''}>${ico('zurueck')}Zurück</button>
      <span class="fein">Schritt ${schritt + 1} von ${NW.ringBild.SCHRITTE.length}</span>
      ${letzter
        ? h`<button type="button" class="knopf" data-tu="dialog-zu">Verstanden</button>`
        : h`<button type="button" class="knopf" data-tu="ring-schritt" data-n="${schritt + 1}">Weiter${ico('chevron')}</button>`}`;
  }

  A_('ring-erklaeren', () => {
    schritt = 0;
    ui.dialog({
      titel: 'Wie ein Ringtausch funktioniert',
      breit: true,
      inhalt: h`<div id="ring-erklaerung">${erklaerungInhalt()}</div>`,
      fuss: h`<div class="ringerklaerung__fuss" id="ring-erklaerung-fuss">${erklaerungFuss()}</div>`
    });
  });

  A_('ring-schritt', (el) => {
    const n = Number(el.dataset.n);
    if (n < 0 || n >= NW.ringBild.SCHRITTE.length) return;
    schritt = n;
    erklaerungZeichnen();
  });

  A_('tausch-weg', () => {
    const m = S.get().meinTausch;
    if (!m) return;
    if (!confirm('Dein Tauschangebot wird entfernt. Fortfahren?')) return;
    S.inseratLoeschen(m.id);
    ui.toast('Angebot entfernt.');
    ui.neuZeichnen();
  });

  NW.viewTausch = { letzte: [] };
  ui.ansichten.tausch = ansicht;
})(window.NW = window.NW || {});
