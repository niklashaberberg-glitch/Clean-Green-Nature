/* =====================================================================
   Nestwerk – Ansicht: Tarife
   Die Preisseite muss zwei Dinge leisten: klar sagen, was Plus bringt –
   und ebenso klar, was es ausdrücklich nicht bringt.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, S = NW.store, P = NW.plan;
  const h = U.html, raw = U.raw, ico = U.svg;

  let intervall = 'monat';

  function preisZeile(tarif) {
    if (tarif.preisMonat === 0) return h`<b>0 €</b><span>dauerhaft</span>`;
    if (intervall === 'jahr') {
      return h`<b>${U.eur2(tarif.preisJahr / 12)}</b><span>im Monat, ${U.eur(tarif.preisJahr)} im Jahr</span>`;
    }
    return h`<b>${U.eur2(tarif.preisMonat)}</b><span>im Monat, monatlich kündbar</span>`;
  }

  function ersparnis() {
    const t = P.TARIFE.plus;
    return Math.round((1 - t.preisJahr / (t.preisMonat * 12)) * 100);
  }

  function tarifKarte(id) {
    const t = P.TARIFE[id];
    const aktiv = P.aktuell() === id;
    const g = P.GRENZEN[id];
    const punkte = id === 'frei'
      ? ['Alle Inserate aus allen vier Angebotsarten',
        'Karte, Passung, Vergleichsmiete, Prüfhinweis',
        'Alle Rechner: Leistbarkeit, Wohngeld, WBS, Nebenkosten, Übergabe',
        '1 Suchauftrag mit sofortiger Meldung',
        '2 Objekte im Vergleich',
        'Vertragslupe: erster Fund',
        'Ringtausch: direkte Tausche',
        'mit Anzeigen']
      : ['Alles aus dem freien Tarif',
        'Keine Anzeigen',
        'Unbegrenzt viele Suchaufträge',
        '6 Objekte im Vergleich',
        'Vertragslupe vollständig, mit Erläuterung zu jedem Fund',
        'Ringtausch über drei und vier Haushalte, mit Stellschrauben',
        'Unbegrenzt viele Ankerpunkte für Fahrzeiten',
        'Serienbewerbung aus der Merkliste',
        'Erinnerung ans Nachfassen',
        'Besichtigungen zu einer Route ordnen',
        'Preisverlauf und Marktdaten je Viertel',
        'Exposé und Merkliste als Datei'];

    return h`<article class="tarif ${id === 'plus' ? 'tarif--plus' : ''} ${aktiv ? 'is-aktiv' : ''}">
      ${aktiv ? h`<span class="tarif__marke">dein Tarif</span>` : ''}
      <h2>${t.name}</h2>
      <p class="tarif__preis">${preisZeile(t)}</p>
      <p class="tarif__zeile">${t.zeile}</p>
      <ul class="tarif__punkte">
        ${punkte.map((x) => h`<li>${ico('check')}${x}</li>`)}
      </ul>
      <div class="tarif__tun">
        ${aktiv
        ? h`<span class="tarif__laeuft">${ico('pruefen')}aktiv${S.get().tarifSeit && id === 'plus' ? ' seit ' + U.dateDE(S.get().tarifSeit) : ''}</span>`
        : id === 'plus'
          ? h`<button type="button" class="knopf knopf--voll" data-tu="plus-buchen">${ico('plus5')}Plus aktivieren</button>`
          : h`<button type="button" class="knopf knopf--still knopf--voll" data-tu="plus-beenden">Zum freien Tarif zurück</button>`}
      </div>
    </article>`;
  }

  function vergleichsTabelle() {
    const gruppen = {};
    P.LEISTUNGEN.forEach((l) => { (gruppen[l.gruppe] = gruppen[l.gruppe] || []).push(l); });
    const reihenfolge = ['Suchen', 'Schutz', 'Rechnen', 'Täglich'];
    const erklaerung = {
      Suchen: 'Der Kern der Anwendung. Vollständig im freien Tarif.',
      Schutz: 'Alles, was dich vor Schaden bewahrt. Bleibt frei – dafür Geld zu nehmen wäre falsch.',
      Rechnen: 'Werkzeuge, die man ein paarmal im Leben braucht. Bleiben frei.',
      'Täglich': 'Was jemand anfasst, der wirklich sucht. Hier liegt der Unterschied.'
    };
    return h`<div class="tarifvergleich__rolle">
      <table class="tarifvergleich">
        <thead>
          <tr>
            <th scope="col">Leistung</th>
            <th scope="col">frei</th>
            <th scope="col" class="is-plus">Plus</th>
          </tr>
        </thead>
        <tbody>
          ${reihenfolge.map((g) => h`
            <tr class="tarifvergleich__gruppe">
              <th scope="row" colspan="3"><b>${g}</b><i>${erklaerung[g]}</i></th>
            </tr>
            ${gruppen[g].map((l) => h`<tr class="${l.gleich ? 'is-gleich' : ''}">
              <th scope="row">${l.name}${l.warum ? h`<i>${l.warum}</i>` : ''}</th>
              <td>${l.frei === 'nein' ? raw('<span class="fehlt">–</span>') : l.frei}</td>
              <td class="is-plus">${l.plus === 'ja' ? ui.ico('check') : l.plus}</td>
            </tr>`)}
          `)}
        </tbody>
      </table>
    </div>`;
  }

  function ansicht() {
    const s = S.get();
    const spar = ersparnis();
    return {
      titel: 'Tarife',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('plus5')}Tarife</h1>
          <p class="seite__unter">Ein Satz erklärt das ganze Modell:
            <b>Plus bezahlt Zeitersparnis bei häufiger Nutzung – nie einen Vorteil gegenüber anderen Bewerbern.</b>
            Was dich schützt und was gerechnet werden muss, bleibt kostenlos.</p>
        </header>

        <div class="tarifschalter" role="group" aria-label="Zahlungsweise">
          <button type="button" class="${intervall === 'monat' ? 'is-an' : ''}" data-tu="tarif-intervall" data-wert="monat">monatlich</button>
          <button type="button" class="${intervall === 'jahr' ? 'is-an' : ''}" data-tu="tarif-intervall" data-wert="jahr">
            jährlich <em>${spar} % günstiger</em></button>
        </div>

        <div class="tarife">
          ${tarifKarte('frei')}
          ${tarifKarte('plus')}
        </div>

        <section class="block block--betont">
          <h2>${ico('warnung')}Was Plus ausdrücklich nicht kauft</h2>
          <p class="block__unter">Die meisten Wohnungsportale verkaufen genau das. Nestwerk nicht – und das ist keine
            Marketingzeile, sondern der Grund, warum die Reihenfolge deiner Treffer nachvollziehbar bleibt.</p>
          <ul class="nichtkaeuflich">
            ${P.NICHT_KAEUFLICH.map((x) => h`<li>${ico('x')}${x}</li>`)}
          </ul>
        </section>

        <section class="block">
          <h2>${ico('waage')}Alles im Vergleich</h2>
          ${vergleichsTabelle()}
        </section>

        <section class="block">
          <h2>${ico('info')}Häufige Fragen</h2>
          <div class="fragen">
            <details>
              <summary>Wie kündige ich?</summary>
              <p>Im Monatstarif zum Ende des laufenden Monats, mit einem Klick in diesem Bereich. Es gibt keine
                Mindestlaufzeit, keine Kündigungsfrist und keine Rückfrage, warum du gehst. Im Jahrestarif läuft
                das Abo zum Ende des bezahlten Jahres aus und verlängert sich nur, wenn du zustimmst.</p>
            </details>
            <details>
              <summary>Was passiert mit meinen Daten, wenn ich kündige?</summary>
              <p>Nichts. Merkliste, Profil, Notizen und Suchaufträge bleiben vollständig erhalten – nur die
                Plus-Funktionen sind dann nicht mehr verfügbar. Über den vierten Suchauftrag hinaus wird nichts
                gelöscht, er wird nur nicht mehr geprüft, bis du wieder Platz schaffst.</p>
            </details>
            <details>
              <summary>Warum gibt es überhaupt Anzeigen?</summary>
              <p>Weil die Suche sonst nicht vollständig kostenlos bleiben könnte. Wer eine Wohnung sucht, hat oft
                gerade wenig Geld – ausgerechnet dann eine Bezahlschranke vor die Suche zu stellen, wäre verkehrt.
                Anzeigen sind deshalb der Preis des freien Tarifs, und sie sind immer als Anzeige gekennzeichnet.</p>
            </details>
            <details>
              <summary>Bekommen Werbetreibende meine Daten?</summary>
              <p>Nein. Welche Anzeige erscheint, entscheidet sich im Browser anhand der Stelle auf der Seite –
                nicht anhand deines Profils, deiner Suche oder deines Verhaltens. Es gibt keinen Server, an den
                etwas gehen könnte.</p>
            </details>
            <details>
              <summary>Bringt Plus mir eine Wohnung schneller?</summary>
              <p>Nur insofern, als du weniger Zeit mit Handarbeit verlierst: mehrere Suchaufträge statt einem,
                Serienbewerbung statt jede Anfrage einzeln, Besichtigungen als Route statt als Zettelwirtschaft.
                Bei der Vergabe selbst hat Plus keinerlei Gewicht. Vermieter sehen nicht, welchen Tarif du hast.</p>
            </details>
            <details>
              <summary>Kann ich Plus erst ausprobieren?</summary>
              <p>In dieser Vorführung ist Plus mit einem Klick an- und abschaltbar, damit du beide Welten
                vergleichen kannst. Im Betrieb wären die ersten vierzehn Tage kostenlos und ohne Zahlungsdaten.</p>
            </details>
          </div>
        </section>

        <div class="hinweisbox">${ico('info')}
          <div><b>Vorführung</b>
          <p>Hier wird nichts abgebucht und nichts abgeschlossen. Der Schalter oben ändert nur, welche Funktionen
            diese Anwendung dir freigibt – damit du siehst, worin der Unterschied besteht.</p></div>
        </div>
      </div>`
    };
  }

  const A_ = ui.aktionRegistrieren;

  A_('tarif-intervall', (el) => { intervall = el.dataset.wert; ui.neuZeichnen(); });

  A_('plus-buchen', () => {
    P.wechseln('plus', intervall);
    ui.toast('Plus ist aktiv. In der Vorführung kostenlos und jederzeit umschaltbar.', 'gut');
    ui.neuZeichnen();
  });

  ui.ansichten.plus = ansicht;
})(window.NW = window.NW || {});
