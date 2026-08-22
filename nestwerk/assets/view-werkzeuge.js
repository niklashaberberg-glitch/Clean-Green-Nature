/* =====================================================================
   Nestwerk – Werkzeuge
   Rechner und Prüfhilfen, die man beim Suchen, Einziehen und Wohnen
   braucht. Alle im freien Tarif: Sie schützen vor Fehlern und Geldverlust,
   und dafür Geld zu verlangen wäre der falsche Ort.

   Alle Formulare zeichnen bei einer Eingabe nur den Ergebnisbereich neu.
   Sonst verliert jedes Feld den Fokus und jeder Regler springt zurück.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, S = NW.store, W = NW.werkzeuge, A = NW.analyse, P = NW.plan;
  const h = U.html, raw = U.raw, ico = U.svg;

  /* Ergebnisbereich einer Seite austauschen, Formular unangetastet lassen. */
  function malen(id, markup) {
    const el = U.$('#' + id);
    if (el) el.innerHTML = String(markup);
  }

  /* Beschriftung eines Reglers nachziehen, ohne ihn neu zu bauen. */
  function reglerText(el, text) {
    const label = el.closest('label');
    const b = label && label.querySelector('b');
    if (b) b.textContent = text;
  }

  /* ================================================================
     Übersicht
     ================================================================ */

  const KATALOG = [
    { route: 'leistbarkeit', icon: 'euro', name: 'Was kann ich mir leisten?',
      text: 'Zwei Grenzen, die ständig verwechselt werden: was dein Haushalt trägt und was Vermieter sehen wollen. Dazu, wie groß die Wohnung in jeder Stadt sein dürfte.',
      wann: 'vor der ersten Suche' },
    { route: 'wbs', icon: 'blatt', name: 'Wohnberechtigungsschein',
      text: 'Rechnet dein maßgebliches Jahreseinkommen mit allen Pauschalen aus und stellt es der Einkommensgrenze gegenüber – die du selbst setzen kannst, weil jedes Land eine andere hat.',
      wann: 'wenn geförderte Wohnungen in Frage kommen' },
    { route: 'wohngeld', icon: 'euro', name: 'Wohngeld prüfen',
      text: 'Klärt zuerst, ob Wohngeld überhaupt in Betracht kommt – die Ausschlussgründe schließen die meisten Anträge schon vorher aus.',
      wann: 'wenn die Miete zu viel vom Einkommen frisst' },
    { route: 'rechner', icon: 'rechner', name: 'Mieten oder kaufen',
      text: 'Vermögensvergleich über frei wählbare Jahre. Der Mietende legt sein Eigenkapital an und investiert die monatliche Differenz – anders ist der Vergleich unehrlich.',
      wann: 'wenn Kaufen im Raum steht' },
    { route: 'markt', icon: 'trend', name: 'Marktdaten und Preisverlauf',
      text: 'Wie sich die Mieten je Viertel über drei Jahre entwickelt haben, und welche Viertel gerade am schnellsten teurer werden.',
      wann: 'beim Eingrenzen der Suche', plus: true },
    { route: 'umzug', icon: 'umzug', name: 'Umzugsplan',
      text: 'Neunzehn Aufgaben mit Fristen, die sich aus deinem Einzugstermin ergeben – von der Kündigung bis zur Kaution zurück.',
      wann: 'sobald der Termin steht' },
    { route: 'uebergabe', icon: 'schluessel', name: 'Übergabeprotokoll',
      text: 'Zählerstände, Schlüssel und Mängel Raum für Raum. Am Ende ein Text zum Ausdrucken. Was hier nicht drinsteht, zahlst du später.',
      wann: 'am Tag der Übergabe' },
    { route: 'nebenkosten', icon: 'lupe', name: 'Nebenkosten prüfen',
      text: 'Welche Posten überhaupt umgelegt werden dürfen, ob die Abrechnung rechtzeitig kam und ob die Heizkosten richtig verteilt wurden.',
      wann: 'wenn die Abrechnung im Briefkasten liegt' }
  ];

  function uebersicht() {
    return {
      titel: 'Werkzeuge',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('werkzeug')}Werkzeuge</h1>
          <p class="seite__unter">Rechnen, prüfen, protokollieren. Das meiste davon braucht man genau einmal –
            und genau dann ist es viel wert. Deshalb ist bis auf die Marktdaten alles im freien Tarif enthalten.</p>
        </header>
        <div class="werkzeuge">
          ${KATALOG.map((k) => h`<a class="werkzeugkachel" href="#/${k.route}">
            <span class="werkzeugkachel__zeichen">${ico(k.icon)}</span>
            <b>${k.name}${k.plus ? ui.badge('Plus', 'info') : ''}</b>
            <p>${k.text}</p>
            <i>${k.wann}</i>
          </a>`)}
        </div>
        ${!P.istPlus() ? ui.anzeige('werkzeuge', 'breit') : ''}
      </div>`
    };
  }

  /* ================================================================
     Was kann ich mir leisten?
     ================================================================ */

  const L_VORGABE = { netto: 2600, haushalt: 1, rateSonstige: 0, eigenkapital: 40000, zins: 3.7, tilgung: 2 };

  function leistbarkeitErgebnis() {
    const w = S.werkzeugWerte('leistbarkeit', L_VORGABE);
    const e = W.leistbarkeit(w);
    if (!e.netto) return h`<p class="info-meldung">${ico('info')}Trag dein Nettoeinkommen ein, dann rechnet Nestwerk.</p>`;

    return h`<div class="kennzahlen">
        <div><b>${U.eur(e.warmBequem)}</b><span>Warmmiete, die bequem passt (30 % vom Verfügbaren)</span></div>
        <div><b>${U.eur(e.warmGrenze)}</b><span>noch machbar, aber ohne Puffer (35 %)</span></div>
        <div><b>${U.eur(e.kaltVermieter)}</b><span>Kaltmiete, die Vermieter erwarten (Netto ÷ 3)</span></div>
        <div><b>${U.eur(e.kaltMoeglich)}</b><span>Kaltmiete, mit der du realistisch suchst</span></div>
      </div>

      <div class="ampel ampel--${e.engpass === 'vermieter' ? 'warn' : 'gut'}">
        <div class="ampel__zahl">${e.engpass === 'vermieter' ? ico('warnung') : ico('pruefen')}</div>
        <div>
          <b>${e.engpass === 'vermieter' ? 'Die Vermieterregel bremst dich, nicht dein Budget'
        : 'Dein Budget ist die engere Grenze'}</b>
          <p>${e.engpass === 'vermieter'
        ? 'Du könntest ' + U.eur(e.kaltAusBudget) + ' Kaltmiete tragen, aber viele Vermieter verlangen das Dreifache der Kaltmiete als Netto – das deckelt dich bei ' + U.eur(e.kaltVermieter) + '. Eine Bürgschaft oder ein zweites Einkommen im Vertrag hebt diese Grenze.'
        : 'Bei ' + U.eur(e.kaltVermieter) + ' wäre die Vermieterregel noch nicht erreicht; enger ist dein eigenes Budget mit ' + U.eur(e.kaltAusBudget) + '.'}</p>
        </div>
      </div>

      <h3>Wie groß darf die Wohnung sein?</h3>
      <p class="fein">Bei ${U.eur(e.kaltMoeglich)} Kaltmiete – das sind ${U.eur(e.warmBequem)} warm abzüglich
        rund 26 % für Neben- und Heizkosten – und dem mittleren Preis je Viertel der Stadt.</p>
      <div class="staedteliste">
        ${e.staedte.map((st) => h`<div class="staedteliste__zeile ${st.reicht ? '' : 'is-eng'}">
          <span>${st.stadt}</span>
          <span class="balken"><i style="width:${U.clamp(st.flaeche / 1.4, 2, 100)}%"></i></span>
          <b>${st.flaeche} m²</b>
          <a class="link" href="#/suche?stadt=${encodeURIComponent(st.stadt)}">suchen</a>
        </div>`)}
      </div>
      <p class="fein">Grau hinterlegt, wo es für ${e.haushalt} ${U.plural(e.haushalt, 'Person', 'Personen')} eng wird.</p>

      <h3>Und wenn du kaufen willst?</h3>
      <div class="kennzahlen">
        <div><b>${U.eur(e.kauf.kaufpreis)}</b><span>Kaufpreis, den die Rate trägt</span></div>
        <div><b>${U.eur(e.kauf.rate)}</b><span>Monatsrate (35 % vom Verfügbaren)</span></div>
        <div><b>${U.eur(e.kauf.darlehen)}</b><span>Darlehen bei ${U.dec(e.kauf.zins)} % Zins und ${U.dec(e.kauf.tilgung)} % Tilgung</span></div>
        <div><b>${U.eur(e.kauf.nebenkosten)}</b><span>Kaufnebenkosten – die müssen aus dem Eigenkapital kommen</span></div>
      </div>
      <p class="fein">Reicht dein Eigenkapital nicht für die Nebenkosten, finanziert kaum eine Bank.
        <a href="#/rechner">Genauer rechnen unter „Mieten oder kaufen“</a>.</p>`;
  }

  function leistbarkeit() {
    const w = S.werkzeugWerte('leistbarkeit', L_VORGABE);
    return {
      titel: 'Was kann ich mir leisten?',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('euro')}Was kann ich mir leisten?</h1>
          <p class="seite__unter">Die meisten scheitern nicht am eigenen Budget, sondern an einer Regel, die
            Vermieter anwenden: das Dreifache der Kaltmiete als Nettoeinkommen. Beide Grenzen stehen hier nebeneinander.</p>
        </header>

        <form class="block" data-tu-submit="nichts">
          <h2>Deine Zahlen</h2>
          <div class="formraster">
            <label class="feld"><span>Nettoeinkommen des Haushalts im Monat</span>
              <input type="number" min="0" step="50" value="${w.netto}" data-tu-input="leistbarkeit" data-feld="netto"></label>
            <label class="feld"><span>Personen im Haushalt</span>
              <input type="number" min="1" max="8" value="${w.haushalt}" data-tu-input="leistbarkeit" data-feld="haushalt"></label>
            <label class="feld"><span>Andere feste Raten im Monat</span>
              <input type="number" min="0" step="25" value="${w.rateSonstige}" data-tu-input="leistbarkeit" data-feld="rateSonstige"
                placeholder="Kredit, Leasing, Unterhalt"></label>
            <label class="feld"><span>Eigenkapital für einen Kauf</span>
              <input type="number" min="0" step="5000" value="${w.eigenkapital}" data-tu-input="leistbarkeit" data-feld="eigenkapital"></label>
          </div>
        </form>

        <section class="block" id="leistbarkeit-ergebnis">${leistbarkeitErgebnis()}</section>

        <div class="hinweisbox">${ico('info')}
          <div><b>Die 30-Prozent-Regel ist eine Faustregel, keine Grenze</b>
          <p>Wer wenig verdient, gibt fast zwangsläufig mehr als 30 % fürs Wohnen aus – in vielen Städten sind
            40 % und mehr Alltag. Die Zahl taugt nicht als Vorwurf, sondern als Warnsignal: Über 40 % bleibt für
            unerwartete Ausgaben nichts übrig. Dann lohnt der Blick auf Wohngeld und den Wohnberechtigungsschein.</p></div>
        </div>
        <p class="werkzeug__weiter">
          <a class="knopf knopf--still" href="#/wohngeld">${ico('euro')}Wohngeld prüfen</a>
          <a class="knopf knopf--still" href="#/wbs">${ico('blatt')}Wohnberechtigungsschein prüfen</a>
        </p>
      </div>`
    };
  }

  /* ================================================================
     Wohnberechtigungsschein
     ================================================================ */

  const WBS_VORGABE = { brutto: 26000, personen: 1, kinder: 0, erwerbstaetige: 1,
    steuern: true, kranken: true, rente: true, schwerbehindert: false, grenze: 0 };

  function wbsErgebnis() {
    const w = S.werkzeugWerte('wbs', WBS_VORGABE);
    const e = W.wbsPruefung(w);
    const ton = e.ergebnis === 'wahrscheinlich' ? 'gut' : e.ergebnis === 'knapp' ? 'warn' : 'schlecht';
    return h`<div class="ampel ampel--${ton}">
        <div class="ampel__zahl">${Math.round(e.quote * 100)} %</div>
        <div>
          <b>${e.ergebnis === 'wahrscheinlich' ? 'Anspruch wahrscheinlich'
        : e.ergebnis === 'knapp' ? 'Knapp an der Grenze' : 'Anspruch unwahrscheinlich'}</b>
          <p>${e.satz}</p>
        </div>
      </div>

      <h3>So kommt die Zahl zustande</h3>
      <ul class="kosten__liste">
        <li><span>Bruttojahreseinkommen</span><b>${U.eur(e.brutto)}</b></li>
        ${e.abzuege.map((a) => h`<li><span>abzüglich ${a.label}</span><b>− ${U.eur(a.betrag)}</b></li>`)}
      </ul>
      <p class="kosten__summe"><span>maßgebliches Jahreseinkommen</span><b>${U.eur(e.massgeblich)}</b></p>
      <p class="kosten__summe"><span>eingestellte Einkommensgrenze</span><b>${U.eur(e.grenze)}</b></p>
      <p class="${e.abstand >= 0 ? 'gut-meldung' : 'warn-meldung'}">
        ${ico(e.abstand >= 0 ? 'pruefen' : 'warnung')}
        ${e.abstand >= 0
        ? 'Du liegst ' + U.eur(e.abstand) + ' unter der Grenze.'
        : 'Du liegst ' + U.eur(-e.abstand) + ' über der Grenze.'}
      </p>`;
  }

  function wbs() {
    const w = S.werkzeugWerte('wbs', WBS_VORGABE);
    const bundGrenze = W.wbsPruefung(Object.assign({}, w, { grenze: 0 })).grenzeBund;
    return {
      titel: 'Wohnberechtigungsschein',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('blatt')}Wohnberechtigungsschein</h1>
          <p class="seite__unter">Geförderte Wohnungen sind oft deutlich günstiger und ihre Mieten steigen langsamer.
            Der Schein ist der Schlüssel dazu – und die Hürde ist niedriger, als viele denken.</p>
        </header>

        <div class="hinweisbox">${ico('warnung')}
          <div><b>Die Einkommensgrenze setzt dein Bundesland</b>
          <p>Sie unterscheidet sich erheblich – manche Länder liegen deutlich über dem Bundesrahmen, viele kennen
            zusätzliche Stufen für höhere Einkommen. Nestwerk rechnet deshalb nicht heimlich mit einer Zahl:
            Voreingestellt ist der Bundesrahmen aus § 9 WoFG (${U.eur(bundGrenze)} für deine Haushaltsgröße),
            und du kannst ihn durch die Grenze deiner Stadt ersetzen. Sie steht auf der Seite deines Wohnungsamts.</p></div>
        </div>

        <form class="block" data-tu-submit="nichts">
          <h2>Deine Angaben</h2>
          <div class="formraster">
            <label class="feld"><span>Bruttojahreseinkommen des Haushalts</span>
              <input type="number" min="0" step="500" value="${w.brutto}" data-tu-input="wbs" data-feld="brutto"></label>
            <label class="feld"><span>Personen im Haushalt</span>
              <input type="number" min="1" max="10" value="${w.personen}" data-tu-input="wbs" data-feld="personen"></label>
            <label class="feld"><span>davon Kinder</span>
              <input type="number" min="0" max="10" value="${w.kinder}" data-tu-input="wbs" data-feld="kinder"></label>
            <label class="feld"><span>davon erwerbstätig</span>
              <input type="number" min="0" max="10" value="${w.erwerbstaetige}" data-tu-input="wbs" data-feld="erwerbstaetige"></label>
            <label class="feld"><span>Einkommensgrenze deines Landes</span>
              <input type="number" min="0" step="500" value="${w.grenze || ''}" data-tu-input="wbs" data-feld="grenze"
                placeholder="leer = Bundesrahmen ${U.num(bundGrenze)} €"></label>
          </div>
          <fieldset class="filter__gruppe"><legend>Abzüge und Freibeträge</legend>
            <label class="schalter"><input type="checkbox" ${w.steuern ? 'checked' : ''} data-tu-change="wbs-schalter" data-feld="steuern">
              <span>Einkommensteuer wird gezahlt<i>10 % Pauschale</i></span></label>
            <label class="schalter"><input type="checkbox" ${w.kranken ? 'checked' : ''} data-tu-change="wbs-schalter" data-feld="kranken">
              <span>Pflichtbeiträge zur Kranken- und Pflegeversicherung<i>10 % Pauschale</i></span></label>
            <label class="schalter"><input type="checkbox" ${w.rente ? 'checked' : ''} data-tu-change="wbs-schalter" data-feld="rente">
              <span>Pflichtbeiträge zur Rentenversicherung<i>10 % Pauschale</i></span></label>
            <label class="schalter"><input type="checkbox" ${w.schwerbehindert ? 'checked' : ''} data-tu-change="wbs-schalter" data-feld="schwerbehindert">
              <span>Schwerbehinderung im Haushalt<i>zusätzlicher Freibetrag</i></span></label>
          </fieldset>
        </form>

        <section class="block" id="wbs-ergebnis">${wbsErgebnis()}</section>

        <section class="block">
          <h2>${ico('info')}Wenn es passt: so geht es weiter</h2>
          <ol class="ablauf">
            <li><b>Antrag beim Wohnungsamt</b><span>Formular der Stadt, meist auch online. Kostet je nach Kommune nichts bis rund 25 €.</span></li>
            <li><b>Nachweise beilegen</b><span>Einkommensnachweise der letzten zwölf Monate, Ausweis, Meldebescheinigung.</span></li>
            <li><b>Bearbeitung abwarten</b><span>Zwei bis acht Wochen. Beantrage früh – ohne Schein kannst du dich auf geförderte Wohnungen nicht bewerben.</span></li>
            <li><b>Gültigkeit beachten</b><span>Der Schein gilt in der Regel ein Jahr. Läuft er ab, während du suchst, verlängere rechtzeitig.</span></li>
          </ol>
          <p><a class="knopf knopf--still" href="#/suche?q=Wohnberechtigungsschein">${ico('suche')}Inserate mit WBS-Bedarf ansehen</a></p>
        </section>
      </div>`
    };
  }

  /* ================================================================
     Wohngeld
     ================================================================ */

  const WG_VORGABE = { personen: 1, brutto: 1800, miete: 700 };

  function wohngeldErgebnis() {
    const w = S.werkzeugWerte('wohngeld', WG_VORGABE);
    const e = W.wohngeldPruefung(w);
    const ton = { wahrscheinlich: 'gut', moeglich: 'warn', unwahrscheinlich: 'schlecht',
      ausgeschlossen: 'schlecht', unklar: 'neutral' }[e.ergebnis];
    return h`<div class="ampel ampel--${ton}">
        <div class="ampel__zahl">${e.ergebnis === 'ausgeschlossen' ? ico('x')
        : e.ergebnis === 'wahrscheinlich' ? ico('pruefen') : ico('info')}</div>
        <div>
          <b>${{ wahrscheinlich: 'Antrag lohnt sich', moeglich: 'Grenzfall – Antrag trotzdem sinnvoll',
        unwahrscheinlich: 'Eher kein Anspruch', ausgeschlossen: 'Kein Wohngeld', unklar: 'Angaben fehlen' }[e.ergebnis]}</b>
          <p>${e.satz}</p>
        </div>
      </div>

      ${e.gruende.length ? h`<ul class="pruef">
        ${e.gruende.map((g) => h`<li>${ico('info')}<span><b>${g.label}:</b> ${g.text}</span></li>`)}
      </ul>` : ''}

      ${e.belastung ? h`<p>Deine Warmmiete frisst <b>${e.belastung} %</b> deines Bruttoeinkommens.
        ${e.belastung >= 30 ? 'Das ist eine hohe Belastung – genau dafür ist Wohngeld gedacht.'
        : 'Unterhalb von etwa 25 % wird Wohngeld selten bewilligt.'}</p>` : ''}

      <div class="hinweisbox">${ico('warnung')}
        <div><b>Warum hier kein Eurobetrag steht</b>
        <p>Die Höhe folgt einer Formel mit Beiwerten, die je nach Haushaltsgröße verschieden sind, und hängt
          zusätzlich an der Mietstufe deiner Gemeinde. Beides ändert sich regelmäßig. Eine ausgedachte Zahl wäre
          schlimmer als keine – sie würde dich vom Antrag abhalten oder falsche Hoffnung machen.
          Den Betrag berechnet die Wohngeldstelle; die amtlichen Rechner der Länder liefern ihn verlässlich.</p></div>
      </div>

      <ul class="pruef">
        ${e.hinweise.map((x) => h`<li>${ico('info')}<span>${x}</span></li>`)}
      </ul>`;
  }

  function wohngeld() {
    const w = S.werkzeugWerte('wohngeld', WG_VORGABE);
    return {
      titel: 'Wohngeld prüfen',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('euro')}Wohngeld prüfen</h1>
          <p class="seite__unter">Wohngeld bleibt millionenfach unbeantragt, weil viele annehmen, es stehe ihnen
            nicht zu. Diese Vorprüfung klärt in einer Minute, ob sich der Antrag lohnt.</p>
        </header>

        <form class="block" data-tu-submit="nichts">
          <h2>Deine Situation</h2>
          <div class="formraster">
            <label class="feld"><span>Personen im Haushalt</span>
              <input type="number" min="1" max="12" value="${w.personen}" data-tu-input="wohngeld" data-feld="personen"></label>
            <label class="feld"><span>Bruttoeinkommen des Haushalts im Monat</span>
              <input type="number" min="0" step="50" value="${w.brutto}" data-tu-input="wohngeld" data-feld="brutto"></label>
            <label class="feld"><span>Warmmiete im Monat</span>
              <input type="number" min="0" step="25" value="${w.miete}" data-tu-input="wohngeld" data-feld="miete"></label>
          </div>
          <fieldset class="filter__gruppe"><legend>Trifft eines davon auf dich zu?</legend>
            ${W.WOHNGELD_AUSSCHLUSS.map((a) => h`<label class="schalter">
              <input type="checkbox" ${w[a.id] ? 'checked' : ''} data-tu-change="wohngeld-schalter" data-feld="${a.id}">
              <span>${a.label}</span></label>`)}
          </fieldset>
        </form>

        <section class="block" id="wohngeld-ergebnis">${wohngeldErgebnis()}</section>
      </div>`
    };
  }

  /* ================================================================
     Aktionen
     ================================================================ */

  const A_ = ui.aktionRegistrieren;

  A_('nichts', () => { });

  A_('leistbarkeit', U.debounce((el) => {
    const patch = {}; patch[el.dataset.feld] = Number(el.value) || 0;
    S.werkzeugSetzen('leistbarkeit', patch);
    malen('leistbarkeit-ergebnis', leistbarkeitErgebnis());
  }, 220));

  A_('wbs', U.debounce((el) => {
    const patch = {}; patch[el.dataset.feld] = Number(el.value) || 0;
    S.werkzeugSetzen('wbs', patch);
    malen('wbs-ergebnis', wbsErgebnis());
  }, 220));

  A_('wbs-schalter', (el) => {
    const patch = {}; patch[el.dataset.feld] = el.checked;
    S.werkzeugSetzen('wbs', patch);
    malen('wbs-ergebnis', wbsErgebnis());
  });

  A_('wohngeld', U.debounce((el) => {
    const patch = {}; patch[el.dataset.feld] = Number(el.value) || 0;
    S.werkzeugSetzen('wohngeld', patch);
    malen('wohngeld-ergebnis', wohngeldErgebnis());
  }, 220));

  A_('wohngeld-schalter', (el) => {
    const patch = {}; patch[el.dataset.feld] = el.checked;
    S.werkzeugSetzen('wohngeld', patch);
    malen('wohngeld-ergebnis', wohngeldErgebnis());
  });

  ui.ansichten.werkzeuge = uebersicht;
  ui.ansichten.leistbarkeit = leistbarkeit;
  ui.ansichten.wbs = wbs;
  ui.ansichten.wohngeld = wohngeld;

  NW.viewWerkzeuge = { malen, reglerText, KATALOG };
})(window.NW = window.NW || {});
