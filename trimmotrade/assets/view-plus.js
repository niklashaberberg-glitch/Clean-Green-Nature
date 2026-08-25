/* =====================================================================
   TrimmoTrade – Ansicht: Tarife
   Die Preisseite muss zwei Dinge leisten: klar sagen, was Plus bringt –
   und ebenso klar, was es ausdrücklich nicht bringt.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util, ui = TT.ui, S = TT.store, P = TT.plan;
  const h = U.html, raw = U.raw, ico = U.svg;

  let intervall = 'monat';

  function preisZeile(tarif) {
    if (tarif.preisMonat === 0) return h`<b>0 €</b> <span>dauerhaft</span>`;
    if (intervall === 'jahr') {
      return h`<b>${U.eur2(tarif.preisJahr / 12)}</b> <span>im Monat, ${U.eur(tarif.preisJahr)} im Jahr</span>`;
    }
    return h`<b>${U.eur2(tarif.preisMonat)}</b> <span>im Monat, monatlich kündbar</span>`;
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
        ? h`<span class="tarif__laeuft">${ico('pruefen')}aktiv${id === 'plus' && P.plusQuelle() === 'gruender'
          ? ' über deinen Gründerplatz, noch ' + P.gruenderTageRest() + ' ' + U.plural(P.gruenderTageRest(), 'Tag', 'Tage')
          : S.get().tarifSeit && id === 'plus' ? ' seit ' + U.dateDE(S.get().tarifSeit) : ''}</span>`
        : id === 'plus'
          ? h`<button type="button" class="knopf knopf--voll" data-tu="plus-buchen">${ico('plus5')}Plus aktivieren</button>`
          : P.plusQuelle() === 'gruender'
            /* Ein Gründerplatz lässt sich nicht „beenden“ wie ein Abo –
               es gibt nichts zu kündigen. Ihn zurückzugeben ist eine
               eigene Entscheidung und gehört nicht hinter diesen Knopf. */
            ? h`<a class="knopf knopf--still knopf--voll" href="#/recht/kuendigen">Gründerplatz zurückgeben</a>`
            : h`<button type="button" class="knopf knopf--still knopf--voll" data-tu="plus-beenden">Zum freien Tarif zurück</button>`}
      </div>
    </article>`;
  }

  function vergleichsTabelle() {
    const gruppen = {};
    P.LEISTUNGEN.forEach((l) => { (gruppen[l.gruppe] = gruppen[l.gruppe] || []).push(l); });
    const reihenfolge = ['Suchen', 'Schutz', 'Rechnen', 'Täglich', 'Sichtbarkeit'];
    const erklaerung = {
      Suchen: 'Der Kern der Anwendung. Vollständig im freien Tarif.',
      Schutz: 'Alles, was dich vor Schaden bewahrt. Bleibt frei – dafür Geld zu nehmen wäre falsch.',
      Rechnen: 'Werkzeuge, die man ein paarmal im Leben braucht. Bleiben frei.',
      'Täglich': 'Was jemand anfasst, der wirklich sucht. Hier liegt der Unterschied.',
      Sichtbarkeit: 'Bezahlte Sichtbarkeit – die einzige Stelle, an der Geld eine Reihenfolge ändert. '
        + 'Sie wird deshalb überall gekennzeichnet, wo sie wirkt.'
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
            ${(gruppen[g] || []).map((l) => h`<tr class="${l.gleich ? 'is-gleich' : ''}">
              <th scope="row">${l.name}${l.warum ? h`<i>${l.warum}</i>` : ''}</th>
              <td>${l.frei === 'nein' ? raw('<span class="fehlt">–</span>') : l.frei}</td>
              <td class="is-plus">${l.plus === 'ja' ? ui.ico('check') : l.plus}</td>
            </tr>`)}
          `)}
        </tbody>
      </table>
    </div>`;
  }

  /* ------------------------- Gründerplätze -------------------------

     Der Block steht ganz oben, weil ein Jahr geschenktes Plus die einzige
     Zahl auf dieser Seite ist, die jemanden zum Handeln bringt. Er sagt
     zugleich, was er nicht ist: kein Abo, keine Karte, keine stille
     Verlängerung. Wer das verschweigt, verkauft ein Abo im Gewand eines
     Geschenks – und genau das will TrimmoTrade nicht sein. */

  function gruenderBlock() {
    const g = P.GRUENDER;
    const meiner = P.gruender();
    const frei = P.gruenderFrei();
    const anteil = Math.min(100, Math.round(P.gruenderVergeben() / g.plaetze * 100));

    if (meiner.nummer) {
      const tage = P.gruenderTageRest();
      const laeuft = P.gruenderAktiv();
      return h`<section class="gruender ${laeuft ? 'is-aktiv' : 'is-abgelaufen'}">
        <div class="gruender__marke">${ico('stern')}Gründerplatz ${U.num(meiner.nummer)} von ${U.num(g.plaetze)}</div>
        <h2>${laeuft ? 'Plus läuft für dich – noch ' + tage + ' ' + U.plural(tage, 'Tag', 'Tage')
        : 'Dein Gründerjahr ist abgelaufen'}</h2>
        <p>${laeuft
        ? 'Kostenlos bis zum ' + U.dateDE(meiner.bis) + '. Danach endet der Platz von selbst: keine Verlängerung, '
        + 'keine Abbuchung, keine Kündigung nötig. Du entscheidest dann neu.'
        : 'Am ' + U.dateDE(meiner.bis) + ' ist dein Jahr zu Ende gegangen. Merkliste, Profil, Notizen und '
        + 'Suchaufträge sind vollständig erhalten – nur die Plus-Funktionen ruhen.'}</p>
        ${laeuft ? h`<p class="gruender__balken" role="img"
          aria-label="Noch ${tage} von ${g.monate} Monaten">
          <span style="width:${Math.max(2, Math.round(tage / (g.monate * 30.4) * 100))}%"></span></p>` : ''}
        <p class="werkzeug__weiter">
          ${laeuft
        ? h`<a class="knopf knopf--still" href="#/recht/kuendigen">${ico('info')}Platz zurückgeben</a>`
        : h`<button type="button" class="knopf" data-tu="plus-buchen">${ico('plus5')}Plus weiterführen</button>`}
        </p>
      </section>`;
    }

    if (!frei) {
      return h`<section class="gruender is-leer">
        <div class="gruender__marke">${ico('stern')}Gründerplätze</div>
        <h2>Alle ${U.num(g.plaetze)} Plätze sind vergeben</h2>
        <p>Das Kontingent ist erschöpft. Der freie Tarif bleibt vollständig nutzbar – alles, was schützt und
          gerechnet werden muss, war nie hinter der Bezahlschranke.</p>
      </section>`;
    }

    return h`<section class="gruender">
      <div class="gruender__marke">${ico('stern')}Gründerplätze</div>
      <h2>Die ersten ${U.num(g.plaetze)} bekommen Plus ein Jahr geschenkt</h2>
      <p>Ein volles Jahr mit allen Plus-Funktionen, ohne Bezahlung. <b>Kein Abo:</b> keine Zahlungsdaten, keine
        stille Verlängerung, keine Kündigung nötig. Nach ${g.monate} Monaten endet der Platz von selbst, und du
        entscheidest neu.</p>
      <p class="gruender__balken" role="img"
        aria-label="${U.num(P.gruenderVergeben())} von ${U.num(g.plaetze)} Plätzen vergeben">
        <span style="width:${Math.max(2, anteil)}%"></span></p>
      <p class="gruender__zahl"><b>${U.num(frei)}</b> ${U.plural(frei, 'Platz', 'Plätze')} noch frei
        <i>· ${U.num(P.gruenderVergeben())} vergeben</i></p>
      <p class="werkzeug__weiter">
        <button type="button" class="knopf knopf--gross" data-tu="gruender-sichern">
          ${ico('stern')}Platz sichern – ${g.monate} Monate Plus, 0 €</button>
      </p>
      <p class="fein">Mit dem Sichern gelten die <a href="#/recht/agb">Geschäftsbedingungen</a>, insbesondere § 6.
        Ein Widerrufsrecht besteht nicht, weil keine Zahlungspflicht entsteht – beenden lässt sich der Platz
        trotzdem jederzeit.</p>
      <p class="fein gruender__demo">${ico('info')}Die Plätze werden hier nicht zentral gezählt: Der Zähler
        oben ist eine Hochrechnung aus der Zeit seit dem Start, keine Messung. Sobald die Vergabe wirklich
        läuft, bekommt jede Nummer genau einen Platz.</p>
    </section>`;
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
            <b>Plus bezahlt Zeitersparnis und Sichtbarkeit – nie, was du über eine Wohnung erfährst.</b>
            Prüfhinweis, Vergleichsmiete, Chancen und alle Rechner bleiben kostenlos. Und wo Bezahlung eine
            Reihenfolge ändert, steht es dabei.</p>
        </header>

        ${gruenderBlock()}

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
          <p class="block__unter">Die meisten Wohnungsportale verkaufen genau das. TrimmoTrade nicht – und das ist keine
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
          <h2>${ico('blitz')}Eigenes Inserat hervorheben</h2>
          <p class="block__unter">Für die anbietende Seite, unabhängig vom Tarif einzeln buchbar. Mit Plus
            ${Math.round(P.PLUS_RABATT * 100)} % günstiger.</p>
          <ul class="hervorliste hervorliste--preise">
            ${P.HERVORHEBUNG.map((x) => h`<li>
              <span class="hervorliste__zeichen">${ico(x.icon)}</span>
              <div><b>${x.name}</b><i>${x.kurz}</i><span>${x.wirkung}</span></div>
              <span class="hervorliste__preis"><b>${U.eur2(x.preis)}</b></span>
            </li>`)}
          </ul>
          <div class="hinweisbox">${ico('info')}
            <div><b>Bezahlte Plätze stehen getrennt</b>
            <p>Hervorgehobene Inserate erscheinen in einem eigenen Block über den Treffern, beschriftet als
              Top-Anzeigen, höchstens ${P.TOP_MAX} auf einmal. Sie werden nicht zwischen die Ergebnisse
              gemischt und verschieben in der Liste darunter nichts. Wer sucht, sieht damit weiterhin eine
              Reihenfolge, die sich aus seinem Profil erklärt – und erkennt auf den ersten Blick, was bezahlt
              ist. Untergemischte Werbeplätze wären nach § 5b UWG ohnehin kennzeichnungspflichtig.</p></div>
          </div>
          <p class="fein">${TT.recht ? TT.recht.preisHinweis() : ''} Buchen lässt sich das unter
            <a href="#/inserieren">Inserieren</a> bei deinen eigenen Inseraten.</p>
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
                nicht anhand deines Profils, deiner Suche oder deines Verhaltens. Es gibt kein Werbenetzwerk,
                keine Kennung und nichts, was übertragen würde.</p>
            </details>
            <details>
              <summary>Bringt Plus mir eine Wohnung schneller?</summary>
              <p>Es spart vor allem Handarbeit: mehrere Suchaufträge statt einem, Serienbewerbung statt jede
                Anfrage einzeln, Besichtigungen als Route statt als Zettelwirtschaft.</p>
              <p>Dazu kommt eines, das offen ausgesprochen gehört: <b>Deine Anfrage steht im Postfach der
                anbietenden Seite oben</b> und ist dort mit „Plus“ gekennzeichnet. Ob das hilft, entscheidet
                die anbietende Seite – TrimmoTrade sagt ihr ausdrücklich dazu, dass die Reihenfolge bezahlt ist
                und nichts über die Eignung aussagt. Keine Anfrage wird verborgen, gekürzt oder gelöscht,
                weil jemand nicht zahlt.</p>
            </details>
            <details>
              <summary>Ist es fair, dass zahlende Anfragen oben stehen?</summary>
              <p>Eine ehrliche Antwort: Es ist ein Vorteil, und er kostet Geld. TrimmoTrade hält ihn deshalb so
                klein und so sichtbar wie möglich – die anbietende Seite sieht die Kennzeichnung, sieht alle
                Anfragen vollständig und kann die Reihenfolge ignorieren. Was Plus nicht kann: den Inhalt
                einer Anfrage verändern, eine Bewertung verbessern oder andere Anfragen verdrängen.</p>
              <p>Alles, was mit der <b>Wohnung selbst</b> zu tun hat – Prüfhinweis gegen Betrug,
                Vergleichsmiete, Chancen, echte Kosten –, bleibt im freien Tarif vollständig. Diese Grenze
                verschiebt sich nicht.</p>
            </details>
            <details>
              <summary>Kann ich mein eigenes Inserat nach oben kaufen?</summary>
              <p>Ja, und zwar unabhängig vom Tarif: Es gibt drei Hervorhebungen ab ${U.eur2(P.HERVORHEBUNG[0].preis)}.
                Sie erscheinen in einem eigenen, als bezahlt beschrifteten Block über den Treffern – nie
                zwischen ihnen. Was du dabei nicht kaufst: eine bessere Bewertung deines Inserats oder einen
                anderen Platz in der Reihenfolge darunter.</p>
            </details>
            <details>
              <summary>Was passiert nach dem Gründerjahr?</summary>
              <p>Es endet. Ohne Rechnung, ohne Abbuchung, ohne dass du kündigen müsstest – ein Gründerplatz ist
                kein Abo, das sich stillschweigend in ein bezahltes verwandelt. Vier Wochen vorher weist
                TrimmoTrade darauf hin. Wer dann weitermachen will, entscheidet sich aktiv dafür; wer nichts tut,
                nutzt den freien Tarif weiter.</p>
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

  A_('gruender-sichern', () => {
    const nummer = P.gruenderSichern();
    if (!nummer) { ui.toast('Es ist kein Platz mehr frei.', 'schlecht'); ui.neuZeichnen(); return; }
    ui.neuZeichnen();
    ui.dialog({
      titel: 'Gründerplatz ' + U.num(nummer),
      inhalt: h`<p><b>Plus läuft ab sofort für ${P.GRUENDER.monate} Monate</b>, bis zum
          ${U.dateDE(P.gruender().bis)}.</p>
        <ul class="pruef">
          <li>${ico('pruefen')}<span>Keine Zahlungsdaten hinterlegt und keine nötig.</span></li>
          <li>${ico('pruefen')}<span>Keine automatische Verlängerung. Der Platz endet von selbst.</span></li>
          <li>${ico('pruefen')}<span>Vier Wochen vor Ablauf erinnert dich TrimmoTrade – rechtzeitig genug, um in
            Ruhe zu entscheiden.</span></li>
          <li>${ico('pruefen')}<span>Jederzeit zurückgebbar, ohne Begründung.</span></li>
        </ul>
        <p class="fein">Es gilt § 6 der <a href="#/recht/agb">Geschäftsbedingungen</a>.</p>`,
      fuss: h`<a class="knopf knopf--still" href="#/werkzeuge" data-tu="dialog-zu">Werkzeuge ansehen</a>
        <button type="button" class="knopf" data-tu="dialog-zu">Los geht's</button>`
    });
  });

  A_('plus-buchen', () => {
    P.wechseln('plus', intervall);
    ui.toast('Plus ist aktiv. In der Vorführung kostenlos und jederzeit umschaltbar.', 'gut');
    ui.neuZeichnen();
  });

  ui.ansichten.plus = ansicht;
})(window.TT = window.TT || {});
