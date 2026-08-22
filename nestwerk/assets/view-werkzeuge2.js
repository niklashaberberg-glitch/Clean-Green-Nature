/* =====================================================================
   Nestwerk – Werkzeuge, zweiter Teil
   Nebenkostenprüfung und Übergabeprotokoll. Zwei Dinge, an denen sehr
   viel Geld hängt und die trotzdem fast überall auf Zetteln passieren.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, S = NW.store, W = NW.werkzeuge;
  const h = U.html, raw = U.raw, ico = U.svg;
  const malen = NW.viewWerkzeuge.malen;

  /* ================================================================
     Nebenkostenabrechnung prüfen
     ================================================================ */

  const NK_VORGABE = {
    endeZeitraum: '', zugang: '', vorauszahlung: 0, gesamt: 0,
    heizungNachFlaeche: false, keineEinsicht: false, positionen: {}
  };

  function nkWerte() { return S.werkzeugWerte('nebenkosten', NK_VORGABE); }

  function nkErgebnis() {
    const w = nkWerte();
    const e = W.nebenkostenPruefung(w);
    const hatZahlen = e.gefunden.length > 0;

    if (!hatZahlen && !e.befunde.length) {
      return h`<p class="info-meldung">${ico('info')}Trag die Posten aus deiner Abrechnung ein.
        Du musst nicht alle erfassen – die auffälligen genügen.</p>`;
    }

    const ton = { kritisch: 'schlecht', achtung: 'warn', info: 'info', gut: 'gut' };
    return h`${hatZahlen ? h`<div class="kennzahlen">
        <div><b>${U.eur(e.summeOk)}</b><span>umlagefähig nach Betriebskostenverordnung</span></div>
        <div><b class="${e.summeNicht ? 'ton--schlecht' : ''}">${U.eur(e.summeNicht)}</b><span>vermutlich nicht umlagefähig</span></div>
        <div><b>${e.gefunden.length}</b><span>erfasste Posten</span></div>
      </div>` : ''}

      ${e.befunde.length ? h`<ul class="lupe">
        ${e.befunde.map((b) => h`<li class="lupe__fund lupe__fund--${ton[b.art]}">
          <details open><summary>${ui.badge(
        b.art === 'kritisch' ? 'prüfen' : b.art === 'achtung' ? 'genau lesen' : b.art === 'gut' ? 'in Ordnung' : 'zur Kenntnis',
        ton[b.art])}<b>${b.titel}</b></summary>
            <p>${b.text}</p></details>
        </li>`)}
      </ul>` : ''}

      ${e.summeNicht > 0 ? h`<h3>Diese Posten gehören nicht in die Abrechnung</h3>
        <ul class="kosten__liste">
          ${e.gefunden.filter((g) => !g.eintrag.ok).map((g) => h`<li>
            <span>${g.eintrag.label}${g.eintrag.hinweis ? h`<i>${g.eintrag.hinweis}</i>` : ''}</span>
            <b class="ton--schlecht">${U.eur(g.betrag)}</b></li>`)}
        </ul>` : ''}

      ${(e.summeNicht > 0 || e.befunde.some((b) => b.art === 'kritisch'))
        ? h`<p><button type="button" class="knopf" data-tu="nk-schreiben">${ico('blatt')}Widerspruch vorformulieren</button></p>` : ''}`;
  }

  function nebenkosten() {
    const w = nkWerte();
    const umlagefaehig = W.BETRIEBSKOSTEN.filter((b) => b.ok);
    const nicht = W.BETRIEBSKOSTEN.filter((b) => !b.ok);

    const feldFuer = (b) => h`<label class="nkzeile ${b.ok ? '' : 'is-nicht'}">
      <span class="nkzeile__label">${b.label}
        ${b.hinweis ? h`<i>${b.hinweis}</i>` : ''}</span>
      <span class="nkzeile__eingabe">
        <input type="number" min="0" step="1" value="${(w.positionen || {})[b.id] || ''}"
          data-tu-input="nk-position" data-feld="${b.id}" placeholder="0" aria-label="Betrag für ${b.label}">
        <i>€</i>
      </span>
    </label>`;

    return {
      titel: 'Nebenkosten prüfen',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('lupe')}Nebenkostenabrechnung prüfen</h1>
          <p class="seite__unter">Schätzungen zufolge ist etwa jede zweite Betriebskostenabrechnung fehlerhaft.
            Am häufigsten stehen Posten darin, die gar nicht umgelegt werden dürfen – oder die Abrechnung kommt
            zu spät und die Nachzahlung ist damit hinfällig.</p>
        </header>

        <form class="block" data-tu-submit="nichts">
          <h2>Rahmendaten</h2>
          <div class="formraster">
            <label class="feld"><span>Ende des Abrechnungszeitraums</span>
              <input type="date" value="${w.endeZeitraum}" data-tu-change="nk-wert" data-feld="endeZeitraum"></label>
            <label class="feld"><span>Abrechnung bei dir eingegangen am</span>
              <input type="date" value="${w.zugang}" data-tu-change="nk-wert" data-feld="zugang"></label>
            <label class="feld"><span>Geleistete Vorauszahlungen</span>
              <input type="number" min="0" step="10" value="${w.vorauszahlung || ''}" data-tu-input="nk-zahl" data-feld="vorauszahlung"></label>
            <label class="feld"><span>Auf dich entfallende Gesamtkosten</span>
              <input type="number" min="0" step="10" value="${w.gesamt || ''}" data-tu-input="nk-zahl" data-feld="gesamt"></label>
          </div>
          <fieldset class="filter__gruppe"><legend>Auffälligkeiten</legend>
            <label class="schalter"><input type="checkbox" ${w.heizungNachFlaeche ? 'checked' : ''}
              data-tu-change="nk-schalter" data-feld="heizungNachFlaeche">
              <span>Heizkosten wurden allein nach Wohnfläche verteilt<i>ohne Verbrauchserfassung</i></span></label>
            <label class="schalter"><input type="checkbox" ${w.keineEinsicht ? 'checked' : ''}
              data-tu-change="nk-schalter" data-feld="keineEinsicht">
              <span>Einsicht in die Belege wurde mir verweigert</span></label>
          </fieldset>
        </form>

        <section class="block" id="nk-ergebnis">${nkErgebnis()}</section>

        <section class="block">
          <h2>${ico('check')}Diese Posten dürfen umgelegt werden</h2>
          <p class="block__unter">Der Katalog der Betriebskostenverordnung ist abschließend. Trag ein, was in
            deiner Abrechnung steht – die Summen erscheinen oben.</p>
          <div class="nkraster">${umlagefaehig.map(feldFuer)}</div>
        </section>

        <section class="block block--warn">
          <h2>${ico('warnung')}Diese Posten dürfen nicht umgelegt werden</h2>
          <p class="block__unter">Auch dann nicht, wenn im Mietvertrag etwas anderes steht – solche Klauseln
            sind unwirksam.</p>
          <div class="nkraster">${nicht.map(feldFuer)}</div>
        </section>

        <div class="hinweisbox">${ico('info')}
          <div><b>Die wichtigste Frist</b>
          <p>Die Abrechnung muss dir binnen zwölf Monaten nach Ende des Abrechnungszeitraums zugehen. Danach ist
            eine Nachforderung ausgeschlossen – ein Guthaben bekommst du trotzdem. Umgekehrt hast du selbst zwölf
            Monate ab Zugang Zeit, Einwendungen zu erheben.</p></div>
        </div>
        <p class="fein">Allgemeine Hinweise zur Einordnung, keine Rechtsberatung. Bei größeren Beträgen prüft ein
          Mieterverein die Abrechnung meist für einen kleinen Beitrag vollständig.</p>
      </div>`
    };
  }

  /* ================================================================
     Übergabeprotokoll
     ================================================================ */

  const RAEUME_VORGABE = ['Flur', 'Wohnzimmer', 'Schlafzimmer', 'Küche', 'Bad', 'Keller'];
  const ZAEHLER_VORGABE = [
    { id: 'strom', label: 'Strom' }, { id: 'gas', label: 'Gas' },
    { id: 'wasserkalt', label: 'Wasser kalt' }, { id: 'wasserwarm', label: 'Wasser warm' },
    { id: 'heizung', label: 'Heizung / Wärmemenge' }
  ];
  const SCHLUESSEL_VORGABE = [
    { id: 'haus', label: 'Haustür' }, { id: 'wohnung', label: 'Wohnungstür' },
    { id: 'keller', label: 'Keller' }, { id: 'briefkasten', label: 'Briefkasten' },
    { id: 'garage', label: 'Garage / Stellplatz' }
  ];

  function protokoll() { return S.get().protokoll || {}; }

  function raeume() {
    const p = protokoll();
    if (!p.raeume) return RAEUME_VORGABE.map((n) => ({ name: n, zustand: '', maengel: '' }));
    return p.raeume;
  }

  function protokollText() {
    const p = protokoll();
    const z = [];
    z.push('ÜBERGABEPROTOKOLL – ' + (p.art === 'auszug' ? 'Auszug' : 'Einzug'));
    z.push('');
    z.push('Objekt:        ' + (p.adresse || '—'));
    z.push('Datum:         ' + (p.datum ? U.dateDE(p.datum) : '—') + (p.uhrzeit ? ', ' + p.uhrzeit + ' Uhr' : ''));
    z.push('Übergebend:    ' + (p.uebergeber || '—'));
    z.push('Übernehmend:   ' + (p.uebernehmer || '—'));
    if (p.zeugen) z.push('Anwesend:      ' + p.zeugen);
    z.push('');
    z.push('ZÄHLERSTÄNDE');
    ZAEHLER_VORGABE.forEach((zl) => {
      const nr = p['z_' + zl.id + '_nr'] || '';
      const stand = p['z_' + zl.id + '_stand'] || '';
      if (!nr && !stand) return;
      z.push('  ' + zl.label.padEnd(22) + 'Nr. ' + (nr || '—').padEnd(16) + 'Stand: ' + (stand || '—'));
    });
    z.push('');
    z.push('SCHLÜSSEL');
    SCHLUESSEL_VORGABE.forEach((sl) => {
      const anzahl = p['s_' + sl.id];
      if (!anzahl) return;
      z.push('  ' + sl.label.padEnd(22) + anzahl + ' Stück');
    });
    z.push('');
    z.push('RÄUME UND ZUSTAND');
    raeume().forEach((r) => {
      z.push('  ' + r.name);
      z.push('    Zustand: ' + (r.zustand || 'ohne Beanstandung'));
      if (r.maengel) z.push('    Mängel:  ' + r.maengel);
    });
    z.push('');
    if (p.bemerkung) { z.push('BEMERKUNGEN'); z.push('  ' + p.bemerkung); z.push(''); }
    z.push('Beide Seiten bestätigen die Richtigkeit der vorstehenden Angaben.');
    z.push('Nicht aufgeführte Mängel gelten als bei Übergabe nicht vorhanden.');
    z.push('');
    z.push('');
    z.push('____________________________        ____________________________');
    z.push('Übergebende Person                  Übernehmende Person');
    return z.join('\n');
  }

  function uebergabe() {
    const p = protokoll();
    const rs = raeume();
    return {
      titel: 'Übergabeprotokoll',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('schluessel')}Übergabeprotokoll</h1>
          <p class="seite__unter">Der wichtigste Zettel des ganzen Umzugs. Was hier nicht steht, gilt später als
            nicht vorhanden – und wird beim Auszug von deiner Kaution abgezogen.</p>
        </header>

        <div class="hinweisbox">${ico('warnung')}
          <div><b>Drei Regeln für die Übergabe</b>
          <p>Fotografiere jeden Mangel mit Datum, bevor du unterschreibst. Trag auch Kleinigkeiten ein –
            der Kratzer im Parkett kostet später mehr als die Minute jetzt. Und unterschreibe nichts, worin
            eine Formulierung wie „in einwandfreiem Zustand übernommen“ steht, solange du nicht jeden Raum
            gesehen hast.</p></div>
        </div>

        <form class="block" data-tu-submit="nichts">
          <h2>Rahmen</h2>
          <div class="formraster">
            <label class="feld"><span>Anlass</span>
              <select data-tu-change="prot" data-feld="art">
                <option value="einzug" ${p.art !== 'auszug' ? 'selected' : ''}>Einzug – Übernahme</option>
                <option value="auszug" ${p.art === 'auszug' ? 'selected' : ''}>Auszug – Rückgabe</option>
              </select></label>
            <label class="feld"><span>Anschrift der Wohnung</span>
              <input type="text" value="${p.adresse || ''}" data-tu-change="prot" data-feld="adresse"
                placeholder="Straße, Nr., PLZ, Ort, Lage im Haus"></label>
            <label class="feld"><span>Datum</span>
              <input type="date" value="${p.datum || U.isoDate(NW.now())}" data-tu-change="prot" data-feld="datum"></label>
            <label class="feld"><span>Uhrzeit</span>
              <input type="time" value="${p.uhrzeit || ''}" data-tu-change="prot" data-feld="uhrzeit"></label>
            <label class="feld"><span>Übergebende Person</span>
              <input type="text" value="${p.uebergeber || ''}" data-tu-change="prot" data-feld="uebergeber"></label>
            <label class="feld"><span>Übernehmende Person</span>
              <input type="text" value="${p.uebernehmer || ''}" data-tu-change="prot" data-feld="uebernehmer"></label>
            <label class="feld"><span>Weitere Anwesende</span>
              <input type="text" value="${p.zeugen || ''}" data-tu-change="prot" data-feld="zeugen"
                placeholder="Zeugen sind bei Streit Gold wert"></label>
          </div>
        </form>

        <section class="block">
          <h2>${ico('blitz')}Zählerstände</h2>
          <p class="block__unter">Mit Foto festhalten. Ohne abgelesenen Stand zahlst du unter Umständen den
            Verbrauch der Vormieter mit.</p>
          <div class="zaehler">
            ${ZAEHLER_VORGABE.map((z) => h`<div class="zaehler__zeile">
              <span>${z.label}</span>
              <label class="feld"><span class="nur-sr">Zählernummer ${z.label}</span>
                <input type="text" value="${p['z_' + z.id + '_nr'] || ''}" placeholder="Zählernummer"
                  data-tu-change="prot" data-feld="z_${z.id}_nr"></label>
              <label class="feld"><span class="nur-sr">Zählerstand ${z.label}</span>
                <input type="text" value="${p['z_' + z.id + '_stand'] || ''}" placeholder="Stand"
                  data-tu-change="prot" data-feld="z_${z.id}_stand"></label>
            </div>`)}
          </div>
        </section>

        <section class="block">
          <h2>${ico('schluessel')}Schlüssel</h2>
          <p class="block__unter">Jeder fehlende Schlüssel kann beim Auszug eine ganze Schließanlage kosten.
            Zähl sie jetzt.</p>
          <div class="formraster">
            ${SCHLUESSEL_VORGABE.map((sl) => h`<label class="feld"><span>${sl.label}</span>
              <input type="number" min="0" max="20" value="${p['s_' + sl.id] || ''}" placeholder="Anzahl"
                data-tu-change="prot" data-feld="s_${sl.id}"></label>`)}
          </div>
        </section>

        <section class="block">
          <h2>${ico('haus')}Räume</h2>
          <div class="raeume">
            ${rs.map((r, i) => h`<div class="raum">
              <div class="raum__kopf">
                <label class="feld"><span class="nur-sr">Raum</span>
                  <input type="text" value="${r.name}" data-tu-change="raum" data-i="${i}" data-feld="name"></label>
                <button type="button" class="ikon-btn" data-tu="raum-weg" data-i="${i}" aria-label="Raum entfernen">${ico('muell')}</button>
              </div>
              <label class="feld"><span>Zustand</span>
                <input type="text" value="${r.zustand}" data-tu-change="raum" data-i="${i}" data-feld="zustand"
                  placeholder="Wände, Boden, Fenster, Türen"></label>
              <label class="feld"><span>Mängel</span>
                <input type="text" value="${r.maengel}" data-tu-change="raum" data-i="${i}" data-feld="maengel"
                  placeholder="Was ist beschädigt oder fehlt?"></label>
            </div>`)}
          </div>
          <p><button type="button" class="knopf knopf--still" data-tu="raum-neu">${ico('plus')}Raum hinzufügen</button></p>
        </section>

        <section class="block">
          <h2>Bemerkungen</h2>
          <label class="feld"><span class="nur-sr">Bemerkungen</span>
            <textarea rows="3" data-tu-change="prot" data-feld="bemerkung"
              placeholder="Vereinbarungen, offene Punkte, Termine für Nacharbeiten">${p.bemerkung || ''}</textarea></label>
        </section>

        <section class="block block--betont">
          <h2>${ico('blatt')}Fertiges Protokoll</h2>
          <pre class="protokoll" id="protokoll-text">${protokollText()}</pre>
          <p class="werkzeug__weiter">
            <button type="button" class="knopf" data-tu="kopieren" data-quelle="#protokoll-text">${ico('kopieren')}Text kopieren</button>
            <button type="button" class="knopf knopf--still" data-tu="protokoll-drucken">${ico('blatt')}Drucken</button>
          </p>
          <p class="fein">Zweimal ausdrucken, beide Seiten unterschreiben, jede Seite behält ein Exemplar.
            Fotos gehören dazu – am besten als Anlage benannt und mit dem Datum im Dateinamen.</p>
        </section>
      </div>`
    };
  }

  /* ================================================================
     Aktionen
     ================================================================ */

  const A_ = ui.aktionRegistrieren;

  A_('nk-wert', (el) => {
    const patch = {}; patch[el.dataset.feld] = el.value;
    S.werkzeugSetzen('nebenkosten', patch);
    malen('nk-ergebnis', nkErgebnis());
  });

  A_('nk-zahl', U.debounce((el) => {
    const patch = {}; patch[el.dataset.feld] = Number(el.value) || 0;
    S.werkzeugSetzen('nebenkosten', patch);
    malen('nk-ergebnis', nkErgebnis());
  }, 220));

  A_('nk-schalter', (el) => {
    const patch = {}; patch[el.dataset.feld] = el.checked;
    S.werkzeugSetzen('nebenkosten', patch);
    malen('nk-ergebnis', nkErgebnis());
  });

  A_('nk-position', U.debounce((el) => {
    const w = nkWerte();
    const positionen = Object.assign({}, w.positionen);
    const betrag = Number(el.value) || 0;
    if (betrag) positionen[el.dataset.feld] = betrag; else delete positionen[el.dataset.feld];
    S.werkzeugSetzen('nebenkosten', { positionen });
    malen('nk-ergebnis', nkErgebnis());
  }, 260));

  A_('nk-schreiben', () => {
    const w = nkWerte();
    const e = W.nebenkostenPruefung(w);
    const zeilen = [];
    zeilen.push('Betreff: Einwendungen gegen die Betriebskostenabrechnung' +
      (w.endeZeitraum ? ' für den Zeitraum bis ' + U.dateDE(w.endeZeitraum) : ''));
    zeilen.push('');
    zeilen.push('Sehr geehrte Damen und Herren,');
    zeilen.push('');
    zeilen.push('gegen die mir' + (w.zugang ? ' am ' + U.dateDE(w.zugang) : '') +
      ' zugegangene Betriebskostenabrechnung erhebe ich fristgerecht folgende Einwendungen:');
    zeilen.push('');
    let n = 1;
    e.gefunden.filter((g) => !g.eintrag.ok).forEach((g) => {
      zeilen.push(n + '. ' + g.eintrag.label + ' in Höhe von ' + U.eur(g.betrag) +
        '. Diese Position ist in der Betriebskostenverordnung nicht aufgeführt und damit nicht umlagefähig.' +
        (g.eintrag.hinweis ? ' ' + g.eintrag.hinweis : ''));
      n++;
    });
    e.befunde.filter((b) => b.art === 'kritisch').forEach((b) => {
      zeilen.push(n + '. ' + b.titel + '. ' + b.text);
      n++;
    });
    zeilen.push('');
    zeilen.push('Ich bitte um eine berichtigte Abrechnung sowie um Einsicht in die zugrunde liegenden Belege.');
    zeilen.push('Bis dahin behalte ich eine etwaige Nachzahlung zurück.');
    zeilen.push('');
    zeilen.push('Mit freundlichen Grüßen');
    zeilen.push('');
    zeilen.push(S.get().profil.name || '');

    ui.dialog({
      titel: 'Widerspruch vorformuliert',
      breit: true,
      inhalt: h`<p>Prüf den Text und passe ihn an. Schick ihn nachweisbar – per Einschreiben oder mit
          Lesebestätigung. Die Frist für Einwendungen beträgt zwölf Monate ab Zugang der Abrechnung.</p>
        <label class="feld"><span class="nur-sr">Schreiben</span>
          <textarea rows="16" id="nk-brief">${zeilen.join('\n')}</textarea></label>
        <p class="fein">Vorlage zur Orientierung, keine Rechtsberatung. Bei hohen Beträgen lohnt der Gang zum Mieterverein.</p>`,
      fuss: h`<button type="button" class="knopf" data-tu="kopieren" data-quelle="#nk-brief">${ico('kopieren')}Kopieren</button>
        <button type="button" class="knopf knopf--still" data-tu="dialog-zu">Schließen</button>`
    });
  });

  A_('prot', (el) => {
    S.protokollSetzen(el.dataset.feld, el.value);
    malen('protokoll-text', U.esc(protokollText()));
  });

  A_('raum', (el) => {
    const i = Number(el.dataset.i);
    const liste = raeume().slice();
    liste[i] = Object.assign({}, liste[i]);
    liste[i][el.dataset.feld] = el.value;
    S.protokollSetzen('raeume', liste);
    malen('protokoll-text', U.esc(protokollText()));
  });

  A_('raum-neu', () => {
    S.protokollSetzen('raeume', raeume().concat([{ name: 'Weiterer Raum', zustand: '', maengel: '' }]));
    ui.neuZeichnen();
  });

  A_('raum-weg', (el) => {
    const liste = raeume().slice();
    liste.splice(Number(el.dataset.i), 1);
    S.protokollSetzen('raeume', liste);
    ui.neuZeichnen();
  });

  A_('protokoll-drucken', () => {
    window.print();
  });

  ui.ansichten.nebenkosten = nebenkosten;
  ui.ansichten.uebergabe = uebergabe;
})(window.NW = window.NW || {});
