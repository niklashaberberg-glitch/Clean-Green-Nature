/* =====================================================================
   Nestwerk – Ansicht: Rechtliches

   Ein Bereich, mehrere Dokumente: #/recht zeigt die Übersicht,
   #/recht/impressum, /datenschutz, /agb, /widerruf, /melden,
   /barrierefreiheit, /kuendigen und /angaben die einzelnen Seiten.

   Die Texte stehen ausformuliert im Quelltext und nicht in einer
   Datenstruktur. Rechtstexte werden gelesen, nicht ausgewertet – und wer
   sie ändern muss, findet sie so an der Stelle, an der sie auch stehen.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, R = NW.recht, P = NW.plan, S = NW.store;
  const h = U.html, raw = U.raw, ico = U.svg;

  const SEITEN = [
    { id: 'impressum', name: 'Impressum', icon: 'info',
      unter: 'Wer die Seite betreibt und wie er erreichbar ist – Pflichtangaben nach § 5 DDG.' },
    { id: 'datenschutz', name: 'Datenschutzerklärung', icon: 'schloss',
      unter: 'Welche Daten verarbeitet werden, auf welcher Grundlage und welche Rechte du hast.' },
    { id: 'agb', name: 'Allgemeine Geschäftsbedingungen', icon: 'blatt',
      unter: 'Was Nestwerk leistet, was es kostet und was gilt, wenn etwas schiefgeht.' },
    { id: 'widerruf', name: 'Widerrufsbelehrung', icon: 'zurueck',
      unter: 'Vierzehn Tage Widerrufsrecht bei bezahlten Verträgen, mit Musterformular.' },
    { id: 'melden', name: 'Rechtswidrige Inhalte melden', icon: 'warnung',
      unter: 'Meldeweg nach Art. 16 der Verordnung über digitale Dienste.' },
    { id: 'barrierefreiheit', name: 'Barrierefreiheit', icon: 'person',
      unter: 'Was umgesetzt ist, was fehlt und wo Rückmeldung ankommt.' },
    { id: 'kuendigen', name: 'Verträge hier kündigen', icon: 'x',
      unter: 'Die Schaltfläche, die § 312k BGB verlangt – ohne Umweg über den Kundendienst.' }
  ];

  /* ================================================================
     Bausteine
     ================================================================ */

  const rw = (feld, beschreibung) => R.wert(feld, beschreibung);

  function kopf(titel, unter) {
    return h`<header class="seite__kopf">
      <p class="rechtspfad"><a href="#/recht">${ico('zurueck')}Rechtliches</a></p>
      <h1>${titel}</h1>
      ${unter ? h`<p class="seite__unter">${unter}</p>` : ''}
      <p class="fein">Fassung vom ${R.stand()}</p>
    </header>`;
  }

  function luecken() {
    const f = R.fehlendeAngaben();
    if (!f.length) return '';
    return h`<div class="block block--warn">
      <h2>${ico('warnung')}${f.length} ${U.plural(f.length, 'Pflichtangabe fehlt', 'Pflichtangaben fehlen')} noch</h2>
      <p>Solange sie fehlen, ist dieses Dokument nicht vollständig. Im Text stehen die Lücken markiert.</p>
      <ul class="pruef">
        ${f.map((x) => h`<li>${ico('warnung')}<span><b>${x.label}</b> – ${x.grund}</span></li>`)}
      </ul>
      <p class="werkzeug__weiter"><a class="knopf knopf--klein" href="#/recht/angaben">${ico('stift')}Angaben ergänzen</a></p>
    </div>`;
  }

  /* ================================================================
     Übersicht
     ================================================================ */

  function uebersicht() {
    const f = R.fehlendeAngaben();
    return {
      titel: 'Rechtliches',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('blatt')}Rechtliches</h1>
          <p class="seite__unter">Anbieter, Datenschutz, Geschäftsbedingungen und Widerruf – die Angaben, die
            eine Seite in Deutschland führen muss, und die, die man führen sollte.</p>
        </header>

        <div class="hinweisbox">${ico('warnung')}
          <div><b>Diese Texte sind ein Entwurf, keine Rechtsberatung</b>
          <p>Sie sind nach den geltenden Vorschriften geschrieben – Digitale-Dienste-Gesetz, DSGVO, BGB,
            Verordnung über digitale Dienste – und decken ab, was ein Kleingewerbe mit einer solchen Seite
            braucht. Aber sie ersetzen nicht den Blick von jemandem mit Zulassung. Vor dem ersten echten
            Nutzer gehören vor allem die Geschäftsbedingungen, die Haftung und die Frage nach einer Erlaubnis
            gemäß § 34c GewO geprüft.</p></div>
        </div>

        ${f.length ? h`<div class="block block--warn">
          <h2>${ico('warnung')}Noch ${f.length} ${U.plural(f.length, 'Angabe fehlt', 'Angaben fehlen')}</h2>
          <p>Ein Impressum ohne ladungsfähige Anschrift oder ohne schnelle Kontaktmöglichkeit erfüllt die
            Pflicht aus § 5 DDG nicht – und das ist abmahnbar. Die Lücken sind in allen Dokumenten sichtbar
            markiert, damit sie nicht untergehen.</p>
          <ul class="pruef">
            ${f.map((x) => h`<li>${ico('warnung')}<span><b>${x.label}</b><br>${x.grund}</span></li>`)}
          </ul>
          <p class="werkzeug__weiter">
            <a class="knopf" href="#/recht/angaben">${ico('stift')}Jetzt eintragen</a></p>
        </div>` : h`<p class="gut-meldung">${ico('pruefen')}Alle Pflichtangaben sind eingetragen.
          <a href="#/recht/angaben">Ändern</a></p>`}

        <div class="werkzeuge">
          ${SEITEN.map((s) => h`<a class="werkzeugkachel" href="#/recht/${s.id}">
            <span class="werkzeugkachel__zeichen">${ico(s.icon)}</span>
            <b>${s.name}</b>
            <p>${s.unter}</p>
          </a>`)}
          <a class="werkzeugkachel" href="#/recht/angaben">
            <span class="werkzeugkachel__zeichen">${ico('stift')}</span>
            <b>Angaben zum Anbieter</b>
            <p>Name, Anschrift, Kontakt und Steuerstatus – von hier speisen sich alle Dokumente.</p>
          </a>
        </div>

        <section class="block">
          <h2>${ico('liste')}Was vor dem Start noch zu klären ist</h2>
          <p class="block__unter">Punkte, die kein Textbaustein löst, sondern eine Entscheidung.</p>
          ${R.OFFEN.map((o) => h`<details class="rechtsfrage">
            <summary>${o.titel}</summary>
            <p>${o.text}</p>
          </details>`)}
        </section>
      </div>`
    };
  }

  /* ================================================================
     Impressum
     ================================================================ */

  function impressum() {
    const a = R.angaben();
    return {
      titel: 'Impressum',
      html: h`<div class="seite seite--schmal">
        ${kopf('Impressum', 'Angaben gemäß § 5 des Digitale-Dienste-Gesetzes (DDG).')}
        ${luecken()}
        <div class="block rechtstext">
          <h2>Anbieter</h2>
          <p class="rechtstext__adresse">${R.anschrift()}</p>
          <p class="fein">Rechtsform: ${a.rechtsform}.
            ${a.handelsregister ? 'Registereintrag: ' + a.handelsregister + '.'
        : 'Ein Eintrag im Handelsregister besteht nicht; als Kleingewerbe besteht dazu keine Pflicht.'}</p>

          <h2>Kontakt</h2>
          <dl class="rechtsliste">
            <dt>E-Mail</dt><dd>${rw('email', 'E-Mail-Adresse')}</dd>
            <dt>Telefon</dt><dd>${rw('telefon', 'Telefonnummer')}</dd>
          </dl>
          <p class="fein">§ 5 Abs. 1 Nr. 2 DDG verlangt Angaben, die eine schnelle elektronische Kontaktaufnahme
            und unmittelbare Kommunikation ermöglichen. Die E-Mail-Adresse ist dafür Pflicht; die Nummer ist
            der übliche zweite Weg.</p>

          <h2>Umsatzsteuer</h2>
          ${a.ustId
        ? h`<p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: <b>${a.ustId}</b></p>`
        : h`<p>Es besteht keine Umsatzsteuer-Identifikationsnummer. ${R.preisHinweis()}</p>`}
          <p class="fein">Die Steuernummer ist keine Pflichtangabe im Impressum und wird hier bewusst nicht
            veröffentlicht.</p>

          <h2>Verantwortlich für redaktionelle Inhalte</h2>
          <p>Gemäß § 18 Abs. 2 des Medienstaatsvertrags:
            ${a.verantwortlichMStV ? h`${a.verantwortlichMStV}` : h`${rw('name', 'Name')}, Anschrift wie oben`}</p>

          <h2>Verbraucherstreitbeilegung</h2>
          <p>Der Anbieter ist weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen (§ 36 Verbraucherstreitbeilegungsgesetz).</p>
          <p class="fein">Ein Hinweis auf die Online-Streitbeilegungsplattform der Europäischen Kommission
            entfällt: Die Plattform wurde zum 20. Juli 2025 eingestellt. Verweise darauf sind seitdem
            gegenstandslos und sollten von Websites entfernt werden.</p>

          <h2>Erlaubnispflicht</h2>
          <p>Nestwerk führt Angebote Dritter zusammen und stellt Werkzeuge zur Prüfung und Bewertung bereit.
            Der Anbieter vermittelt keine Miet- oder Kaufverträge und erhält von Vermietenden oder
            Verkaufenden im Erfolgsfall keine Provision. Eine Erlaubnis nach § 34c Gewerbeordnung ist danach
            nicht erforderlich.</p>

          <h2>Haftung für Inhalte und Verweise</h2>
          <p>Für eigene Inhalte ist der Anbieter nach den allgemeinen Gesetzen verantwortlich. Für Angebote,
            die Nutzende einstellen, gelten die Vorschriften der Verordnung (EU) 2022/2065 über digitale
            Dienste: Der Anbieter ist nicht verpflichtet, sie allgemein zu überwachen, entfernt sie aber
            unverzüglich, sobald er von einer Rechtsverletzung Kenntnis erlangt.
            <a href="#/recht/melden">Hier lässt sich ein Inhalt melden.</a></p>
          <p>Für Inhalte verlinkter Seiten ist deren Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung
            waren keine Rechtsverstöße erkennbar.</p>

          <h2>Urheberrecht</h2>
          <p>Aufbau, Texte, Grafiken und Quelltext dieser Anwendung sind urheberrechtlich geschützt.
            Vervielfältigung, Bearbeitung und Verbreitung bedürfen der Zustimmung des Anbieters, soweit das
            Urheberrechtsgesetz nichts anderes erlaubt.</p>
        </div>
      </div>`
    };
  }

  /* ================================================================
     Datenschutzerklärung
     ================================================================ */

  function datenschutz() {
    const a = R.angaben();
    return {
      titel: 'Datenschutzerklärung',
      html: h`<div class="seite seite--schmal">
        ${kopf('Datenschutzerklärung', 'Informationen nach Artikel 13 und 14 der Datenschutz-Grundverordnung.')}
        ${luecken()}

        <div class="block block--betont">
          <h2>${ico('schloss')}Das Wichtigste zuerst</h2>
          <p>Nestwerk rechnet vollständig im Browser. Suche, Bewertung, Karte, Ringtausch, Merkliste und
            Profil entstehen auf deinem Gerät und bleiben dort. Es gibt kein Nutzerkonto, keine Übertragung
            deiner Eingaben an den Anbieter und keine Weitergabe an Dritte.</p>
          <p>Es werden keine Werkzeuge zur Reichweitenmessung eingesetzt, keine Profile über dein Verhalten
            gebildet und keine Werbung nach deinen Interessen ausgespielt. Deshalb erscheint auch kein Fenster,
            das um Einwilligung bittet: Es gibt nichts, wozu eine Einwilligung nötig wäre.</p>
        </div>

        <div class="block rechtstext">
          <h2>1. Verantwortlicher</h2>
          <p>Verantwortlich im Sinne von Art. 4 Nr. 7 DSGVO ist:</p>
          <p class="rechtstext__adresse">${R.anschrift()}</p>
          <p>E-Mail: ${rw('email', 'E-Mail-Adresse')} · Telefon: ${rw('telefon', 'Telefonnummer')}</p>

          <h2>2. Datenschutzbeauftragter</h2>
          <p>Ein Datenschutzbeauftragter ist nicht bestellt. Nach § 38 Abs. 1 BDSG besteht dazu keine Pflicht,
            weil in der Regel weniger als zwanzig Personen ständig mit der automatisierten Verarbeitung
            personenbezogener Daten beschäftigt sind und keine Verarbeitung stattfindet, die eine
            Datenschutz-Folgenabschätzung erfordert.</p>

          <h2>3. Aufruf der Seite (Server-Protokolle)</h2>
          <p>Beim Aufruf überträgt dein Browser technisch notwendige Daten an den Server, auf dem die Seite
            liegt: IP-Adresse, Datum und Uhrzeit, aufgerufene Datei, übertragene Datenmenge, Browsertyp und
            Betriebssystem sowie die zuvor besuchte Seite.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Auslieferung der Seite, Betriebssicherheit, Abwehr von Angriffen</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an einem
              störungsfreien und sicheren Betrieb</dd>
            <dt>Speicherdauer</dt><dd>in der Regel sieben Tage, danach automatische Löschung</dd>
            <dt>Empfänger</dt><dd>der Hostinganbieter als Auftragsverarbeiter nach Art. 28 DSGVO</dd>
          </dl>

          <h2>4. Speicher deines Browsers</h2>
          <p>Nestwerk legt deine Eingaben im lokalen Speicher deines Browsers ab – Profil, Merkliste,
            Suchaufträge, Nachrichten, eigene Inserate und die Einstellungen zur Darstellung. Diese Daten
            verlassen dein Gerät nicht. Der Anbieter hat keinen Zugriff darauf.</p>
          <p>Für den Zugriff auf diesen Speicher ist keine Einwilligung erforderlich: Er ist unbedingt
            erforderlich, damit der von dir ausdrücklich gewünschte Dienst überhaupt funktioniert
            (§ 25 Abs. 2 Nr. 2 des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes). Cookies zu
            Werbe- oder Analysezwecken werden nicht gesetzt.</p>
          <p>Du kannst diese Daten jederzeit im Fußbereich unter „Meine Daten“ als Datei sichern oder
            vollständig löschen. Sie verschwinden ebenfalls, wenn du die Browserdaten löschst.</p>

          <h2>5. Dokumententresor</h2>
          <p>Legst du Unterlagen im Dokumententresor ab, werden sie <b>vor dem Speichern</b> in deinem Browser
            verschlüsselt – mit AES-GCM und 256 Bit. Der Schlüssel entsteht aus deinem Kennwort und wird
            nirgends gespeichert. Verschlüsselt werden auch die Dateinamen.</p>
          <p>Gibst du Unterlagen frei, wird kein Anhang verschickt, sondern ein Verweis. Der Schlüssel dazu
            steht im Fragmentteil dieses Verweises – dem Teil hinter dem Rautezeichen, den Browser
            grundsätzlich nicht an Server übertragen. Der Anbieter kann die abgelegten Dateien deshalb auch
            dann nicht lesen, wenn er Zugriff auf den Speicher hätte.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Erfüllung des Vertrags über die Nutzung von Nestwerk</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO; für die Verschlüsselung zugleich
              Art. 32 DSGVO – Sicherheit der Verarbeitung</dd>
            <dt>Speicherdauer</dt><dd>bis du das Dokument löschst oder den Tresor leerst</dd>
          </dl>
          <p class="fein">In dieser Vorführfassung liegen auch die verschlüsselten Dateien ausschließlich in
            deinem Browser. Im Betrieb läge dort das Chiffrat und sonst nichts.</p>

          <h2>6. Werbung im freien Tarif</h2>
          <p>Der freie Tarif wird über Anzeigen finanziert. Diese Anzeigen sind fest hinterlegt und werden
            nach der Stelle ausgewählt, an der sie erscheinen – nicht nach deiner Person, deinem Verhalten
            oder deinen Eingaben. Es findet kein Abgleich mit Werbenetzwerken statt, es werden keine Kennungen
            gesetzt und es gehen keine Daten an Werbetreibende. Deshalb ist auch dafür keine Einwilligung
            erforderlich.</p>
          <p>Anzeigen sind stets als solche gekennzeichnet (§ 5a Abs. 4 des Gesetzes gegen den unlauteren
            Wettbewerb) und werden nie im Erscheinungsbild eines Inserats dargestellt.</p>

          <h2>7. Kontaktaufnahme</h2>
          <p>Schreibst du per E-Mail, verarbeitet der Anbieter die Angaben aus deiner Nachricht, um sie zu
            beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogenen Anfragen, sonst
            Art. 6 Abs. 1 lit. f DSGVO. Die Nachrichten werden gelöscht, sobald die Anfrage abschließend
            bearbeitet ist und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.</p>

          <h2>8. Bezahlung von Nestwerk Plus</h2>
          <p>Für bezahlte Verträge werden die zur Abwicklung nötigen Daten verarbeitet: Name, E-Mail-Adresse,
            Zahlungsdaten sowie Beginn und Laufzeit. Die Zahlung selbst wickelt ein Zahlungsdienstleister ab,
            an den die dafür erforderlichen Daten übermittelt werden.</p>
          <dl class="rechtsliste">
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Vertrags; für
              Rechnungsdaten zusätzlich Art. 6 Abs. 1 lit. c DSGVO</dd>
            <dt>Speicherdauer</dt><dd>Rechnungsunterlagen zehn Jahre nach § 147 der Abgabenordnung und
              § 257 des Handelsgesetzbuchs</dd>
          </dl>
          <p class="fein">Solange Plus nur über einen Gründerplatz vergeben wird, fallen weder Zahlungsdaten
            noch Rechnungen an.</p>

          <h2>9. Keine automatisierte Entscheidung über Personen</h2>
          <p>Nestwerk bewertet Angebote, nicht Menschen. Die Passung, die Chancenschätzung und der Prüfhinweis
            beziehen sich auf Wohnungen und Inseratstexte und dienen deiner eigenen Einordnung. Eine
            automatisierte Entscheidung mit rechtlicher Wirkung gegenüber Personen im Sinne von Art. 22 DSGVO
            findet nicht statt.</p>

          <h2>10. Übermittlung in Drittländer</h2>
          <p>Eine Übermittlung personenbezogener Daten in Länder außerhalb der Europäischen Union und des
            Europäischen Wirtschaftsraums findet nicht statt.</p>

          <h2>11. Deine Rechte</h2>
          <ul class="pruef">
            <li>${ico('pruefen')}<span><b>Auskunft</b> darüber, welche Daten verarbeitet werden (Art. 15 DSGVO)</span></li>
            <li>${ico('pruefen')}<span><b>Berichtigung</b> unrichtiger Daten (Art. 16 DSGVO)</span></li>
            <li>${ico('pruefen')}<span><b>Löschung</b> (Art. 17 DSGVO)</span></li>
            <li>${ico('pruefen')}<span><b>Einschränkung der Verarbeitung</b> (Art. 18 DSGVO)</span></li>
            <li>${ico('pruefen')}<span><b>Datenübertragbarkeit</b> in einem gängigen Format (Art. 20 DSGVO)</span></li>
            <li>${ico('pruefen')}<span><b>Widerspruch</b> gegen Verarbeitungen auf Grundlage berechtigter
              Interessen (Art. 21 DSGVO)</span></li>
            <li>${ico('pruefen')}<span><b>Widerruf</b> einer erteilten Einwilligung mit Wirkung für die Zukunft
              (Art. 7 Abs. 3 DSGVO)</span></li>
          </ul>
          <p>Für die Ausübung genügt eine formlose Nachricht an ${rw('email', 'E-Mail-Adresse')}.</p>
          <p class="fein">Weil deine Eingaben ausschließlich in deinem Browser liegen, kannst du Auskunft,
            Übertragbarkeit und Löschung dort unmittelbar selbst ausüben: im Fußbereich unter „Meine Daten“.</p>

          <h2>12. Beschwerderecht</h2>
          <p>Du kannst dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere in
            dem Mitgliedstaat deines Aufenthaltsorts, deines Arbeitsplatzes oder des Orts des mutmaßlichen
            Verstoßes. Für den Anbieter zuständig ist ${rw('aufsichtsbehoerde', 'zuständige Aufsichtsbehörde')}.</p>

          <h2>13. Pflicht zur Bereitstellung</h2>
          <p>Du bist nicht verpflichtet, personenbezogene Daten bereitzustellen. Ohne die Angaben im Profil
            fallen allerdings die Funktionen weg, die darauf aufbauen – etwa die Passung oder die
            Chancenschätzung.</p>

          <h2>14. Änderungen</h2>
          <p>Diese Erklärung gilt in der Fassung vom ${R.stand()}. Ändert sich die Anwendung, wird sie
            angepasst.</p>
        </div>
      </div>`
    };
  }

  /* ================================================================
     AGB
     ================================================================ */

  function agb() {
    const t = P.TARIFE.plus;
    const g = P.GRUENDER;
    return {
      titel: 'Allgemeine Geschäftsbedingungen',
      html: h`<div class="seite seite--schmal">
        ${kopf('Allgemeine Geschäftsbedingungen', 'Für die Nutzung von Nestwerk durch Verbraucherinnen, Verbraucher und Unternehmen.')}
        ${luecken()}
        <div class="block rechtstext">

          <h2>§ 1 Anbieter, Geltungsbereich</h2>
          <p>(1) Anbieter von Nestwerk ist ${rw('name', 'Name')}, ${R.anschriftZeile() || ''}
            (nachfolgend „Anbieter“). Die vollständigen Angaben stehen im <a href="#/recht/impressum">Impressum</a>.</p>
          <p>(2) Diese Bedingungen gelten für alle Verträge über die Nutzung von Nestwerk in der jeweils bei
            Vertragsschluss geltenden Fassung.</p>
          <p>(3) Verbraucher ist, wer ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder der
            gewerblichen noch der selbständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB).
            Unternehmer ist, wer dabei in Ausübung einer solchen Tätigkeit handelt (§ 14 BGB).</p>
          <p>(4) Abweichende Bedingungen der Nutzenden werden nicht Vertragsbestandteil, es sei denn, der
            Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>

          <h2>§ 2 Gegenstand der Leistung</h2>
          <p>(1) Nestwerk ist eine Oberfläche, die Wohnungsangebote verschiedener Art – Miete, Kauf,
            WG-Zimmer und Wohnungstausch – zusammenführt und Werkzeuge zu ihrer Prüfung und Einordnung
            bereitstellt.</p>
          <p>(2) Der Anbieter <b>vermittelt keine Miet- oder Kaufverträge</b> und wird nicht Partei der
            Verträge, die zwischen Nutzenden und Anbietenden von Wohnraum zustande kommen. Er erhält von
            Vermietenden oder Verkaufenden keine erfolgsabhängige Vergütung.</p>
          <p>(3) Bewertungen, Vergleichsmieten, Chancenschätzungen, Prüfhinweise und Vertragshinweise sind
            <b>Rechenergebnisse und allgemeine Hinweise</b>. Sie beruhen auf den verfügbaren Angaben und
            allgemein zugänglichen Rechenwerten. Sie sind weder eine Rechts- noch eine Steuer- oder
            Anlageberatung und ersetzen eine solche nicht.</p>
          <p>(4) Für Richtigkeit, Vollständigkeit und Aktualität von Angeboten, die Dritte einstellen, steht
            der Anbieter nicht ein.</p>

          <h2>§ 3 Zustandekommen des Vertrags</h2>
          <p>(1) Die Nutzung des freien Tarifs kommt mit dem Aufruf der Anwendung zustande und erfordert keine
            Anmeldung.</p>
          <p>(2) Ein Vertrag über Nestwerk Plus kommt zustande, wenn der Anbieter die Bestellung annimmt oder
            die Leistung freischaltet. Vor der Bestellung werden die wesentlichen Merkmale, der Gesamtpreis,
            die Laufzeit und die Kündigungsbedingungen angezeigt. Die Schaltfläche, mit der die Bestellung
            abgeschlossen wird, ist mit „zahlungspflichtig bestellen“ beschriftet (§ 312j Abs. 3 BGB).</p>
          <p>(3) Der Vertragstext wird nach Abschluss auf einem dauerhaften Datenträger bestätigt
            (§ 312f BGB). Vertragssprache ist Deutsch.</p>

          <h2>§ 4 Freier Tarif und Werbung</h2>
          <p>(1) Der freie Tarif ist dauerhaft ohne Entgelt nutzbar und über Anzeigen finanziert.</p>
          <p>(2) Anzeigen sind stets als solche gekennzeichnet und vom übrigen Inhalt deutlich abgesetzt. Sie
            werden nicht nach dem Verhalten oder den Eingaben der Nutzenden ausgewählt.</p>
          <p>(3) Der Anbieter behält sich vor, Umfang und Platzierung von Anzeigen zu ändern. Die Funktionen
            des freien Tarifs bleiben davon unberührt.</p>

          <h2>§ 5 Nestwerk Plus</h2>
          <p>(1) Nestwerk Plus umfasst die auf der <a href="#/plus">Tarifseite</a> beschriebenen Leistungen.
            Plus verändert <b>nicht die Bewertung oder die Trefferreihenfolge</b> für andere Nutzende und
            verschafft <b>keinen früheren Zugang</b> zu neuen Angeboten. Zur vorrangigen Anzeige von Anfragen
            bei der anbietenden Seite siehe § 6.</p>
          <p>(2) Der Preis beträgt ${U.eur2(t.preisMonat)} im Monat oder ${U.eur2(t.preisJahr)} im Jahr.
            ${R.preisHinweis()}</p>
          <p>(3) Die Laufzeit beträgt je nach Wahl einen Monat oder ein Jahr und verlängert sich jeweils um
            denselben Zeitraum, wenn nicht bis zum Ablauf gekündigt wird. Die Kündigung ist jederzeit zum
            Ende der laufenden Laufzeit möglich, für Verbraucherinnen und Verbraucher nach Ablauf der
            Erstlaufzeit jederzeit mit einer Frist von einem Monat (§ 309 Nr. 9 BGB).</p>
          <p>(4) Die Kündigung ist ohne Anmeldung und ohne Umweg über den Kundendienst möglich, über die
            Schaltfläche <a href="#/recht/kuendigen">„Verträge hier kündigen“</a> (§ 312k BGB). Eine formlose
            Nachricht an ${rw('email', 'E-Mail-Adresse')} genügt ebenfalls.</p>
          <p>(5) Erhöht der Anbieter den Preis, teilt er dies mindestens sechs Wochen vor Wirksamwerden in
            Textform mit. Die Nutzenden können den Vertrag bis zum Wirksamwerden zum Zeitpunkt der Erhöhung
            kündigen; darauf wird in der Mitteilung hingewiesen.</p>

          <h2>§ 6 Bezahlte Sichtbarkeit</h2>
          <p>(1) Der Anbieter stellt zwei Formen bezahlter Sichtbarkeit bereit:</p>
          <ul class="pruef">
            <li>${ico('pruefen')}<span><b>Vorrang von Anfragen.</b> Anfragen von Nutzenden mit Nestwerk Plus
              werden im Posteingang der anbietenden Seite vorrangig angezeigt und dort als solche
              gekennzeichnet.</span></li>
            <li>${ico('pruefen')}<span><b>Hervorhebung von Inseraten.</b> Einzeln buchbar zu den auf der
              <a href="#/plus">Tarifseite</a> genannten Preisen.</span></li>
          </ul>
          <p>(2) Bezahlte Platzierungen werden stets als solche gekennzeichnet und getrennt von den
            organischen Ergebnissen dargestellt (§ 5b Abs. 1 Nr. 6 und Abs. 2 UWG). Die Reihenfolge der
            übrigen Treffer bleibt davon unberührt; sie entsteht allein aus den Angaben des suchenden
            Nutzers.</p>
          <p>(3) Bezahlte Sichtbarkeit verändert nicht die inhaltliche Bewertung eines Angebots. Prüfhinweis,
            Vergleichsmiete, Chancenschätzung und Kostenrechnung sind davon unabhängig und bleiben im freien
            Tarif vollständig verfügbar.</p>
          <p>(4) Es besteht kein Anspruch auf eine bestimmte Anzahl von Aufrufen, Anfragen oder auf einen
            Vermietungs- oder Verkaufserfolg. Die Zahl gleichzeitig angezeigter bezahlter Plätze ist begrenzt;
            sind alle belegt, wird die Buchung erst zum nächstmöglichen Zeitpunkt wirksam.</p>
          <p>(5) Hervorhebungen sind digitale Dienstleistungen. Für Verbraucherinnen und Verbraucher gilt das
            <a href="#/recht/widerruf">Widerrufsrecht</a>; beginnt die Leistung auf ausdrücklichen Wunsch
            sofort, erlischt es nach § 356 Abs. 5 BGB.</p>

          <h2>§ 7 Gründerplätze</h2>
          <p>(1) Der Anbieter vergibt die ersten <b>${U.num(g.plaetze)} Plätze</b> mit den Leistungen von
            Nestwerk Plus für <b>${g.monate} Monate ohne Entgelt</b> (Gründerplatz).</p>
          <p>(2) Der Gründerplatz ist <b>kein Abonnement</b>. Er verlängert sich nicht, geht nicht in einen
            bezahlten Vertrag über und erfordert keine Zahlungsdaten. Nach Ablauf der ${g.monate} Monate
            stehen die Leistungen des freien Tarifs zur Verfügung; wer Plus danach weiter nutzen möchte,
            entscheidet sich neu.</p>
          <p>(3) Es besteht kein Anspruch auf einen Gründerplatz. Die Vergabe erfolgt in der Reihenfolge des
            Eingangs und endet, sobald das Kontingent erschöpft ist. Ein Gründerplatz wird je Person einmal
            vergeben und ist nicht übertragbar.</p>
          <p>(4) Der Anbieter kann einen Gründerplatz entziehen, wenn er durch falsche Angaben oder mehrfache
            Anmeldung derselben Person erlangt wurde.</p>
          <p>(5) Der Gründerplatz kann jederzeit ohne Angabe von Gründen beendet werden. Da er unentgeltlich
            ist, entsteht dabei keine Zahlungspflicht und es besteht kein Anspruch auf Erstattung.</p>

          <h2>§ 8 Pflichten der Nutzenden</h2>
          <p>(1) Angaben, die Nutzende einstellen, müssen zutreffend sein. Insbesondere dürfen keine
            Wohnungen angeboten werden, über die keine Verfügungsbefugnis besteht.</p>
          <p>(2) Untersagt sind insbesondere:</p>
          <ul class="pruef">
            <li>${ico('x')}<span>Angebote, die es nicht gibt, sowie Zahlungsaufforderungen vor einer
              Besichtigung</span></li>
            <li>${ico('x')}<span>Formulierungen, die nach Herkunft, Religion, Geschlecht, Behinderung, Alter
              oder sexueller Identität aussortieren (§§ 19, 21 Allgemeines Gleichbehandlungsgesetz)</span></li>
            <li>${ico('x')}<span>Fragen nach Familienplanung, Religion, Parteizugehörigkeit oder Vorstrafen
              gegenüber Bewerbenden</span></li>
            <li>${ico('x')}<span>das automatisierte Auslesen der Anwendung sowie Versuche, ihre technischen
              Schutzvorkehrungen zu umgehen</span></li>
            <li>${ico('x')}<span>Inhalte, die Rechte Dritter verletzen</span></li>
          </ul>
          <p>(3) Nutzende halten den Anbieter von Ansprüchen Dritter frei, die auf einer schuldhaften
            Verletzung dieser Pflichten beruhen, einschließlich angemessener Kosten der Rechtsverteidigung.</p>

          <h2>§ 9 Inhalte der Nutzenden</h2>
          <p>(1) Rechte an eingestellten Inhalten verbleiben bei den Nutzenden.</p>
          <p>(2) Für die Dauer der Einstellung räumen Nutzende dem Anbieter das einfache, räumlich unbegrenzte
            Recht ein, diese Inhalte im Rahmen der Anwendung anzuzeigen, technisch zu vervielfältigen und in
            Formate umzuwandeln, die zur Darstellung nötig sind. Weitergehende Rechte werden nicht
            eingeräumt.</p>
          <p>(3) Mit der Löschung eines Inhalts endet das Nutzungsrecht, soweit keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.</p>

          <h2>§ 10 Entfernen von Inhalten, Sperrung, Beschwerde</h2>
          <p>(1) Der Anbieter kann Inhalte entfernen oder den Zugang einschränken, wenn sie rechtswidrig sind
            oder gegen § 8 verstoßen.</p>
          <p>(2) Betroffene erhalten dazu eine <b>Begründung</b> mit Angabe des Grundes, der Tatsachengrundlage
            und der Möglichkeiten, dagegen vorzugehen (Art. 17 der Verordnung (EU) 2022/2065).</p>
          <p>(3) Gegen eine Entscheidung kann innerhalb von sechs Monaten formlos Beschwerde an
            ${rw('email', 'E-Mail-Adresse')} erhoben werden. Der Anbieter entscheidet darüber unverzüglich,
            begründet und nicht ausschließlich automatisiert.</p>
          <p>(4) Rechtswidrige Inhalte lassen sich <a href="#/recht/melden">hier melden</a>. Meldungen werden
            zeitnah, sorgfältig und nicht willkürlich bearbeitet (Art. 16 der Verordnung (EU) 2022/2065).</p>

          <h2>§ 11 Verfügbarkeit</h2>
          <p>(1) Der Anbieter bemüht sich um eine möglichst unterbrechungsfreie Verfügbarkeit, schuldet sie
            aber nicht ununterbrochen. Wartungsarbeiten, Störungen der Netze Dritter und Ereignisse höherer
            Gewalt können zu Unterbrechungen führen.</p>
          <p>(2) Geplante Wartungsarbeiten werden nach Möglichkeit angekündigt und in nutzungsschwache Zeiten
            gelegt.</p>
          <p>(3) Fällt eine bezahlte Leistung länger als 48 zusammenhängende Stunden aus, verlängert sich die
            Laufzeit auf Verlangen entsprechend.</p>

          <h2>§ 12 Mängel und Haftung</h2>
          <p>(1) Für die Bereitstellung digitaler Produkte gegen Entgelt gelten die §§ 327 ff. BGB. Der
            Anbieter schuldet die vereinbarte und die objektiv erforderliche Beschaffenheit einschließlich
            der Aktualisierungen, die zum Erhalt der Vertragsmäßigkeit nötig sind.</p>
          <p>(2) Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei der Verletzung
            von Leben, Körper oder Gesundheit, nach dem Produkthaftungsgesetz sowie im Umfang einer
            übernommenen Garantie.</p>
          <p>(3) Bei einfacher Fahrlässigkeit haftet der Anbieter nur für die Verletzung wesentlicher
            Vertragspflichten – solcher Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des
            Vertrags überhaupt erst ermöglicht und auf deren Einhaltung regelmäßig vertraut werden darf – und
            begrenzt auf den vertragstypischen, vorhersehbaren Schaden.</p>
          <p>(4) Im Übrigen ist die Haftung ausgeschlossen. Eine Änderung der Beweislast zum Nachteil der
            Nutzenden ist damit nicht verbunden.</p>
          <p>(5) Der Anbieter haftet nicht für Entscheidungen, die auf Grundlage der Rechenergebnisse und
            Hinweise nach § 2 Abs. 3 getroffen werden, und nicht für das Verhalten anderer Nutzender.</p>

          <h2>§ 13 Kündigung durch den Anbieter</h2>
          <p>(1) Unentgeltliche Nutzungsverhältnisse kann der Anbieter mit einer Frist von vier Wochen
            kündigen.</p>
          <p>(2) Das Recht zur Kündigung aus wichtigem Grund bleibt beiderseits unberührt. Ein wichtiger Grund
            liegt für den Anbieter insbesondere bei erheblichen oder wiederholten Verstößen gegen § 8 vor.</p>

          <h2>§ 14 Änderung dieser Bedingungen</h2>
          <p>(1) Der Anbieter kann diese Bedingungen ändern, wenn dies zur Anpassung an geänderte
            Rechtslage, Rechtsprechung oder an Änderungen der Anwendung erforderlich ist und die Nutzenden
            dadurch nicht unangemessen benachteiligt werden.</p>
          <p>(2) Änderungen werden mindestens sechs Wochen vor Wirksamwerden in Textform mitgeteilt.
            Widersprechen Nutzende nicht bis zum Wirksamwerden, gelten die Änderungen als angenommen; auf
            diese Folge und auf das Widerspruchsrecht wird in der Mitteilung gesondert hingewiesen. Im Fall
            des Widerspruchs kann jede Seite den Vertrag zum Zeitpunkt des Wirksamwerdens kündigen.</p>

          <h2>§ 15 Schlussbestimmungen</h2>
          <p>(1) Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Verbraucherinnen und
            Verbrauchern bleiben die zwingenden Schutzvorschriften des Staates erhalten, in dem sie ihren
            gewöhnlichen Aufenthalt haben (Art. 6 Abs. 2 der Verordnung (EG) Nr. 593/2008).</p>
          <p>(2) Ist die nutzende Person Kaufmann, juristische Person des öffentlichen Rechts oder
            öffentlich-rechtliches Sondervermögen, ist Gerichtsstand der Sitz des Anbieters.</p>
          <p>(3) Der Anbieter nimmt nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teil (§ 36 VSBG).</p>
          <p>(4) Sollte eine Bestimmung unwirksam sein, bleibt der Vertrag im Übrigen wirksam.</p>

          <p class="fein">Fassung vom ${R.stand()}.</p>
        </div>
      </div>`
    };
  }

  /* ================================================================
     Widerrufsbelehrung
     ================================================================ */

  function widerruf() {
    return {
      titel: 'Widerrufsbelehrung',
      html: h`<div class="seite seite--schmal">
        ${kopf('Widerrufsbelehrung', 'Für Verbraucherinnen und Verbraucher bei entgeltlichen Verträgen.')}
        ${luecken()}

        <div class="block block--betont">
          <h2>${ico('info')}Gilt der Widerruf für dich?</h2>
          <p>Das Widerrufsrecht besteht bei Verträgen, die <b>gegen Entgelt</b> im Fernabsatz geschlossen
            werden – also bei Nestwerk Plus. Für den freien Tarif und für einen
            <b>Gründerplatz besteht kein Widerrufsrecht</b>, weil dabei keine Zahlungspflicht entsteht. Beides
            lässt sich jederzeit und ohne Grund beenden.</p>
        </div>

        <div class="block rechtstext">
          <h2>Widerrufsrecht</h2>
          <p>Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
            Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
          <p>Um dein Widerrufsrecht auszuüben, musst du uns
            (${rw('name', 'Name')}, ${R.anschriftZeile() || ''}, ${rw('email', 'E-Mail-Adresse')},
            ${rw('telefon', 'Telefonnummer')}) mittels einer eindeutigen Erklärung – zum Beispiel per Post
            versandter Brief oder E-Mail – über deinen Entschluss, diesen Vertrag zu widerrufen, informieren.
            Du kannst dafür das beigefügte Muster verwenden, das aber nicht vorgeschrieben ist.</p>
          <p>Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des
            Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.</p>

          <h2>Folgen des Widerrufs</h2>
          <p>Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben,
            unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung
            über deinen Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir
            dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast, es sei denn,
            mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden dir wegen dieser
            Rückzahlung Entgelte berechnet.</p>
          <p>Hast du verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so hast du
            uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zum Zeitpunkt deiner Mitteilung
            bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen
            Dienstleistungen entspricht (§ 357 Abs. 8 BGB).</p>

          <h2>Vorzeitiges Erlöschen</h2>
          <p>Das Widerrufsrecht erlischt bei einem Vertrag über die Bereitstellung digitaler Inhalte oder
            Dienstleistungen vorzeitig, wenn wir mit der Ausführung begonnen haben, nachdem du</p>
          <ul class="pruef">
            <li>${ico('pruefen')}<span>ausdrücklich zugestimmt hast, dass wir vor Ablauf der Widerrufsfrist
              beginnen,</span></li>
            <li>${ico('pruefen')}<span>bestätigt hast, dass du dadurch dein Widerrufsrecht verlierst, und</span></li>
            <li>${ico('pruefen')}<span>wir dir diese Bestätigung auf einem dauerhaften Datenträger zur
              Verfügung gestellt haben (§ 356 Abs. 5 BGB, § 312f Abs. 3 BGB).</span></li>
          </ul>
          <p class="fein">Nestwerk holt diese Zustimmung in der Bestellstrecke ausdrücklich ein – als eigenes
            Kästchen, nicht vorausgewählt. Wer nicht zustimmt, wird nach Ablauf der vierzehn Tage
            freigeschaltet und behält sein Widerrufsrecht ungeschmälert.</p>

          <h2>Muster-Widerrufsformular</h2>
          <p class="fein">Wenn du den Vertrag widerrufen willst, füll dieses Formular aus und schick es
            zurück. Vorgeschrieben ist es nicht.</p>
          <pre class="rechtstext__muster" id="widerruf-muster">An ${R.angaben().name || '[Name]'}
${R.anschriftZeile() || '[Anschrift]'}
${R.angaben().email || '[E-Mail-Adresse]'}

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
über die Erbringung der folgenden Dienstleistung:

  Nestwerk Plus

Bestellt am (*) / erhalten am (*): ______________________

Name des/der Verbraucher(s): ____________________________

Anschrift des/der Verbraucher(s): _______________________

________________________________________________________

Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)

Datum: __________________

(*) Unzutreffendes streichen.</pre>
          <p class="werkzeug__weiter">
            <button type="button" class="knopf knopf--still" data-tu="kopieren" data-quelle="#widerruf-muster">
              ${ico('kopieren')}Formular kopieren</button>
            <button type="button" class="knopf knopf--still" data-tu="widerruf-sichern">
              ${ico('speichern')}Als Textdatei sichern</button>
          </p>

          <p class="fein">Fassung vom ${R.stand()}.</p>
        </div>
      </div>`
    };
  }

  /* ================================================================
     Inhalte melden (Art. 16 DSA)
     ================================================================ */

  function melden() {
    return {
      titel: 'Rechtswidrige Inhalte melden',
      html: h`<div class="seite seite--schmal">
        ${kopf('Rechtswidrige Inhalte melden',
        'Meldeweg nach Artikel 16 der Verordnung (EU) 2022/2065 über digitale Dienste.')}
        <div class="block rechtstext">
          <h2>Wofür dieser Weg gedacht ist</h2>
          <p>Für Inhalte in Nestwerk, die gegen Recht verstoßen: erfundene Inserate, Zahlungsaufforderungen
            vor der Besichtigung, Angebote ohne Verfügungsbefugnis, benachteiligende Formulierungen im Sinne
            des Allgemeinen Gleichbehandlungsgesetzes oder Verletzungen von Rechten Dritter.</p>

          <h2>Was eine Meldung enthalten sollte</h2>
          <ul class="pruef">
            <li>${ico('pruefen')}<span>eine <b>hinreichend begründete Erläuterung</b>, warum der Inhalt
              rechtswidrig ist</span></li>
            <li>${ico('pruefen')}<span>die <b>genaue Angabe des Ortes</b> – am einfachsten der Verweis auf
              das Inserat</span></li>
            <li>${ico('pruefen')}<span><b>Name und E-Mail-Adresse</b> der meldenden Person; das entfällt bei
              Meldungen zu bestimmten Straftaten gegen die sexuelle Selbstbestimmung</span></li>
            <li>${ico('pruefen')}<span>eine <b>Bestätigung</b>, dass die Angaben nach bestem Wissen richtig
              und vollständig sind</span></li>
          </ul>

          <h2>Wie es weitergeht</h2>
          <p>Der Eingang wird unverzüglich bestätigt. Die Meldung wird zeitnah, sorgfältig, frei von Willkür
            und objektiv bearbeitet. Über die Entscheidung und die Möglichkeiten, dagegen vorzugehen, ergeht
            eine begründete Mitteilung. Wird eine Entscheidung nicht ausschließlich von Hand getroffen, wird
            auf den Einsatz automatisierter Mittel hingewiesen.</p>

          <h2>Kontaktstelle</h2>
          <p>Meldungen und alle Anliegen nach den Artikeln 11 und 12 der Verordnung gehen an:
            ${rw('email', 'E-Mail-Adresse')}. Die Kommunikation ist in <b>deutscher</b> Sprache möglich.</p>
          <p class="fein">Der Anbieter ist ein Kleinstunternehmen im Sinne der Empfehlung 2003/361/EG und
            damit von den zusätzlichen Pflichten für Online-Plattformen nach Abschnitt 3 des Kapitels III der
            Verordnung befreit (Art. 19). Die Pflichten aus den Artikeln 11 bis 18 gelten gleichwohl und
            werden erfüllt.</p>

          <h2>Missbräuchliche Meldungen</h2>
          <p>Wer wiederholt offensichtlich unbegründet meldet, kann nach vorheriger Verwarnung für eine
            angemessene Zeit von der Bearbeitung ausgeschlossen werden (Art. 23 Abs. 2 der Verordnung).</p>
        </div>
      </div>`
    };
  }

  /* ================================================================
     Barrierefreiheit
     ================================================================ */

  function barrierefreiheit() {
    return {
      titel: 'Barrierefreiheit',
      html: h`<div class="seite seite--schmal">
        ${kopf('Erklärung zur Barrierefreiheit', 'Was umgesetzt ist, was fehlt, und wo Rückmeldung ankommt.')}
        <div class="block rechtstext">
          <h2>Stand</h2>
          <p>Nestwerk ist so gebaut, dass es sich vollständig mit der Tastatur bedienen lässt und mit
            Vorleseprogrammen zurechtkommt. Geprüft wurde gegen die Web Content Accessibility Guidelines in
            der Fassung 2.2, Stufe AA.</p>
          <ul class="pruef">
            <li>${ico('pruefen')}<span>alle Bedienelemente mit Tastatur erreichbar, sichtbarer Fokus,
              Sprungmarke zum Inhalt</span></li>
            <li>${ico('pruefen')}<span>Kontraste durchgerechnet statt geschätzt: Fließtext mindestens 4,5 zu 1,
              große Schrift und Bedienelemente mindestens 3 zu 1 – in hell und dunkel</span></li>
            <li>${ico('pruefen')}<span>Farbe nie als einziges Unterscheidungsmerkmal; Diagrammfarben zusätzlich
              auf Unterscheidbarkeit bei Farbfehlsichtigkeit geprüft</span></li>
            <li>${ico('pruefen')}<span>Beschriftungen an jedem Eingabefeld, sinnvolle Überschriftenordnung,
              genau eine Hauptüberschrift je Ansicht</span></li>
            <li>${ico('pruefen')}<span>Bewegung nur, wenn das Betriebssystem sie nicht abbestellt hat
              (<code>prefers-reduced-motion</code>)</span></li>
            <li>${ico('pruefen')}<span>kein waagerechter Überlauf von 320 bis 1920 Pixel Breite</span></li>
          </ul>

          <h2>Was noch nicht barrierefrei ist</h2>
          <ul class="pruef">
            <li>${ico('warnung')}<span>Die <b>Karte</b> lässt sich mit der Tastatur verschieben und zoomen,
              ersetzt aber räumliche Information nicht vollständig durch Text. Alle Angaben stehen zusätzlich
              in der Trefferliste.</span></li>
            <li>${ico('warnung')}<span>Die <b>Preisverläufe</b> im Marktbereich sind Diagramme. Die Zahlen
              dahinter stehen als Tabelle darunter, die Beschreibung der Kurve ist knapp.</span></li>
            <li>${ico('warnung')}<span>Bilder der Angebote sind schematische Zeichnungen. Ihre Beschreibung
              nennt Gebäudeart und Lage, nicht den tatsächlichen Zustand.</span></li>
          </ul>

          <h2>Rückmeldung</h2>
          <p>Fällt etwas auf, das sich nicht bedienen lässt: ${rw('email', 'E-Mail-Adresse')}. Rückmeldungen zur
            Barrierefreiheit werden vorrangig behandelt.</p>

          <h2>Rechtlicher Rahmen</h2>
          <p>Das Barrierefreiheitsstärkungsgesetz gilt seit dem 28. Juni 2025 unter anderem für
            Dienstleistungen im elektronischen Geschäftsverkehr gegenüber Verbraucherinnen und Verbrauchern.
            Kleinstunternehmen, die Dienstleistungen erbringen – weniger als zehn Beschäftigte und höchstens
            zwei Millionen Euro Jahresumsatz –, sind davon ausgenommen (§ 3 Abs. 3 BFSG). Der Anbieter fällt
            derzeit unter diese Ausnahme und hält die Anforderungen dennoch freiwillig ein.</p>
        </div>
      </div>`
    };
  }

  /* ================================================================
     Kündigen (§ 312k BGB)
     ================================================================ */

  function kuendigen() {
    const quelle = P.plusQuelle();
    return {
      titel: 'Verträge kündigen',
      html: h`<div class="seite seite--schmal">
        ${kopf('Verträge hier kündigen',
        'Die Schaltfläche, die § 312k BGB verlangt: ohne Anmeldung, ohne Rückfrage, ohne Umweg.')}

        ${quelle === 'bezahlt' ? h`<div class="block block--betont">
          <h2>${ico('plus5')}Nestwerk Plus, bezahlt</h2>
          <p>Läuft seit ${S.get().tarifSeit ? U.dateDE(S.get().tarifSeit) : 'kurzem'},
            Abrechnung ${S.get().tarifIntervall === 'jahr' ? 'jährlich' : 'monatlich'}.</p>
          <p>Die Kündigung wirkt zum Ende der laufenden Laufzeit. Bis dahin stehen alle Leistungen zur
            Verfügung. Eine Bestätigung geht in Textform zu.</p>
          <p class="werkzeug__weiter">
            <button type="button" class="knopf knopf--gefahr" data-tu="kuendigen-plus">
              ${ico('x')}Vertrag jetzt kündigen</button></p>
        </div>`
        : quelle === 'gruender' ? h`<div class="block block--betont">
          <h2>${ico('stern')}Gründerplatz Nummer ${U.num(P.gruender().nummer)}</h2>
          <p>Läuft noch ${P.gruenderTageRest()} ${U.plural(P.gruenderTageRest(), 'Tag', 'Tage')}, bis zum
            ${U.dateDE(P.gruender().bis)}. Danach endet er von selbst.</p>
          <p>Ein Gründerplatz ist kein Abonnement: Er kostet nichts, verlängert sich nicht und geht nicht in
            einen bezahlten Vertrag über. Es gibt deshalb nichts zu kündigen. Wer ihn trotzdem vorher
            zurückgeben will, kann das hier tun – der Platz geht dann an die nächste Person.</p>
          <p class="werkzeug__weiter">
            <button type="button" class="knopf knopf--still" data-tu="gruender-zurueck">
              ${ico('zurueck')}Gründerplatz zurückgeben</button></p>
        </div>`
        : h`<p class="info-meldung">${ico('info')}Auf diesem Gerät läuft kein entgeltlicher Vertrag. Der freie
          Tarif erfordert keine Kündigung – schließ die Seite einfach.</p>`}

        <div class="block rechtstext">
          <h2>Kündigung auf anderem Weg</h2>
          <p>Eine formlose Erklärung genügt jederzeit, ohne Begründung:</p>
          <dl class="rechtsliste">
            <dt>E-Mail</dt><dd>${rw('email', 'E-Mail-Adresse')}</dd>
            <dt>Post</dt><dd>${R.anschriftZeile() || rw('strasse', 'Anschrift')}</dd>
          </dl>
          <p>Gib an, welcher Vertrag gekündigt werden soll, und wann die Kündigung wirken soll – zum
            nächstmöglichen Zeitpunkt oder zu einem bestimmten Datum. Der Eingang wird in Textform bestätigt,
            und zwar mit Angabe des Zeitpunkts, zu dem die Kündigung wirkt (§ 312k Abs. 4 BGB).</p>

          <h2>Widerruf statt Kündigung</h2>
          <p>Innerhalb der ersten vierzehn Tage nach Vertragsschluss ist ein Widerruf möglich, der den Vertrag
            von Anfang an rückabwickelt. Das ist für dich meist günstiger als eine Kündigung.
            <a href="#/recht/widerruf">Zur Widerrufsbelehrung.</a></p>
        </div>
      </div>`
    };
  }

  /* ================================================================
     Angaben zum Anbieter
     ================================================================ */

  const FELDER = [
    ['name', 'Name des Anbieters', 'Vor- und Nachname oder Firma', 'text'],
    ['zusatz', 'Geschäftsbezeichnung (freiwillig)', 'etwa „Nestwerk“', 'text'],
    ['strasse', 'Straße und Hausnummer', 'kein Postfach – die Anschrift muss ladungsfähig sein', 'text'],
    ['plz', 'Postleitzahl', '', 'text'],
    ['ort', 'Ort', '', 'text'],
    ['land', 'Land', '', 'text'],
    ['email', 'E-Mail-Adresse', 'Pflichtangabe nach § 5 DDG', 'email'],
    ['telefon', 'Telefonnummer', 'der übliche zweite Kontaktweg', 'tel'],
    ['ustId', 'Umsatzsteuer-Identifikationsnummer', 'nur falls vorhanden – Kleinunternehmer haben meist keine', 'text'],
    ['gewerbeamt', 'Stelle der Gewerbeanmeldung', 'etwa „Gewerbeamt der Stadt …“', 'text'],
    ['aufsichtsbehoerde', 'Datenschutz-Aufsichtsbehörde', 'die Behörde des Bundeslandes, in dem du sitzt', 'text'],
    ['verantwortlichMStV', 'Verantwortlich nach § 18 Abs. 2 MStV', 'leer lassen, wenn es dieselbe Person und Anschrift ist', 'text']
  ];

  function angabenSeite() {
    const a = R.angaben();
    return {
      titel: 'Angaben zum Anbieter',
      html: h`<div class="seite seite--schmal">
        ${kopf('Angaben zum Anbieter',
        'Von hier speisen sich Impressum, Datenschutzerklärung, AGB und Widerrufsbelehrung – jede Angabe steht nur einmal.')}

        <div class="hinweisbox">${ico('info')}
          <div><b>Diese Angaben bleiben auf diesem Gerät</b>
          <p>Sie liegen im Speicher dieses Browsers, wie alles andere auch. Für den echten Betrieb gehören sie
            fest in den Quelltext – in <code>assets/recht.js</code> unter <code>VORGABE</code>. Dann stehen sie
            für alle Aufrufe bereit und nicht nur für deinen.</p></div>
        </div>

        <form class="block" data-tu-submit="betreiber-speichern">
          <h2>${ico('stift')}Angaben</h2>
          <div class="formraster">
            ${FELDER.map(([feld, label, hilfe, typ]) => h`<label class="feld">
              <span>${label}${R.PFLICHT.some((p) => p.feld === feld && !p.freiwillig)
        ? h` <b class="pflicht">Pflicht</b>` : ''}</span>
              <input type="${typ}" data-betreiber="${feld}" value="${a[feld] || ''}">
              ${hilfe ? h`<i class="feld__hilfe">${hilfe}</i>` : ''}
            </label>`)}
          </div>
          <label class="schalter">
            <input type="checkbox" data-betreiber-an="kleinunternehmer" ${a.kleinunternehmer ? 'checked' : ''}>
            <span><b>Kleinunternehmerregelung nach § 19 UStG</b>
              <i>Dann wird keine Umsatzsteuer ausgewiesen, und die Preisangaben sagen das dazu.</i></span></label>
          <p class="werkzeug__weiter">
            <button type="submit" class="knopf">${ico('speichern')}Angaben übernehmen</button>
            <button type="button" class="knopf knopf--still" data-tu="betreiber-zuruecksetzen">Zurücksetzen</button>
          </p>
        </form>

        <div class="block">
          <h2>${ico('blatt')}So sehen sie im Impressum aus</h2>
          <p class="rechtstext__adresse">${R.anschrift()}</p>
          <dl class="rechtsliste">
            <dt>E-Mail</dt><dd>${rw('email', 'E-Mail-Adresse')}</dd>
            <dt>Telefon</dt><dd>${rw('telefon', 'Telefonnummer')}</dd>
            <dt>Umsatzsteuer</dt><dd>${a.ustId || (a.kleinunternehmer
        ? 'keine – Kleinunternehmerregelung nach § 19 UStG' : 'noch einzutragen')}</dd>
          </dl>
          <p class="werkzeug__weiter"><a class="knopf knopf--still" href="#/recht/impressum">Impressum ansehen</a></p>
        </div>
      </div>`
    };
  }

  /* ================================================================
     Router innerhalb des Bereichs
     ================================================================ */

  const UNTER = {
    impressum, datenschutz, agb, widerruf, melden, barrierefreiheit,
    kuendigen, angaben: angabenSeite
  };

  ui.ansichten.recht = function (route) {
    const fn = UNTER[route.arg];
    return fn ? fn() : uebersicht();
  };

  /* ================================================================
     Aktionen
     ================================================================ */

  const A_ = ui.aktionRegistrieren;

  A_('betreiber-speichern', () => {
    const neu = {};
    U.$$('[data-betreiber]').forEach((el) => { neu[el.dataset.betreiber] = el.value.trim(); });
    U.$$('[data-betreiber-an]').forEach((el) => { neu[el.dataset.betreiberAn] = el.checked; });
    S.set({ betreiber: Object.assign({}, S.get().betreiber, neu) }, 'betreiber');
    const f = R.fehlendeAngaben();
    ui.neuZeichnen();
    ui.toast(f.length
      ? 'Gespeichert. Es ' + U.plural(f.length, 'fehlt noch eine Pflichtangabe', 'fehlen noch ' + f.length + ' Pflichtangaben') + '.'
      : 'Gespeichert. Alle Pflichtangaben sind vollständig.', f.length ? 'schlecht' : 'gut');
  });

  A_('betreiber-zuruecksetzen', () => {
    if (!confirm('Alle eingetragenen Angaben verwerfen und zu den Voreinstellungen zurückkehren?')) return;
    S.set({ betreiber: {} }, 'betreiber');
    ui.neuZeichnen();
    ui.toast('Zurückgesetzt.');
  });

  A_('widerruf-sichern', () => {
    const el = U.$('#widerruf-muster');
    ui.dateiSichern('widerruf-nestwerk.txt', el ? el.textContent : '', 'text/plain');
  });

  A_('kuendigen-plus', () => {
    if (!confirm('Nestwerk Plus zum Ende der laufenden Laufzeit kündigen?')) return;
    P.wechseln('frei');
    ui.neuZeichnen();
    ui.toast('Gekündigt. Die Bestätigung würde im Betrieb in Textform zugehen.', 'gut');
  });

  A_('gruender-zurueck', () => {
    if (!confirm('Gründerplatz zurückgeben? Der Platz geht an die nächste Person, und Plus endet sofort.')) return;
    P.gruenderAufgeben();
    ui.neuZeichnen();
    ui.toast('Gründerplatz zurückgegeben.');
  });

  NW.viewRecht = { SEITEN };
})(window.NW = window.NW || {});
