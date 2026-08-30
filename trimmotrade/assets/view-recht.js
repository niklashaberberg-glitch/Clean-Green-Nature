/* =====================================================================
   TrimmoTrade – Ansicht: Rechtliches

   Ein Bereich, mehrere Dokumente: #/recht zeigt die Übersicht,
   #/recht/impressum, /datenschutz, /agb, /widerruf, /melden,
   /barrierefreiheit, /kuendigen und /angaben die einzelnen Seiten.

   Die Texte stehen ausformuliert im Quelltext und nicht in einer
   Datenstruktur. Rechtstexte werden gelesen, nicht ausgewertet – und wer
   sie ändern muss, findet sie so an der Stelle, an der sie auch stehen.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util, ui = TT.ui, R = TT.recht, P = TT.plan, S = TT.store;
  const h = U.html, raw = U.raw, ico = U.svg;

  const SEITEN = [
    { id: 'impressum', name: 'Impressum', icon: 'info',
      unter: 'Wer die Seite betreibt und wie er erreichbar ist – Pflichtangaben nach § 5 DDG.' },
    { id: 'datenschutz', name: 'Datenschutzerklärung', icon: 'schloss',
      unter: 'Welche Daten verarbeitet werden, auf welcher Grundlage und welche Rechte du hast.' },
    { id: 'agb', name: 'Allgemeine Geschäftsbedingungen', icon: 'blatt',
      unter: 'Was TrimmoTrade leistet, was es kostet und was gilt, wenn etwas schiefgeht.' },
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

  /* Rechtstexte sind keine gewöhnlichen Seiten: Impressum, Erklärung und
     Geschäftsbedingungen wirken nach deutschem Recht, und eine
     Übersetzung ist eine Lesehilfe, kein zweiter Vertrag. Wer das nicht
     dazuschreibt, hat im Streitfall zwei Fassungen und keine, die gilt.
     Der Hinweis erscheint deshalb nur in der Übersetzung. */
  function massgeblich() {
    if (TT.i18n.sprache() === 'de') return '';
    return h`<p class="rechtshinweis">${ico('info')}<span><b>The German version governs.</b>
      This translation is provided for convenience. TrimmoTrade operates under German law; in case of
      any discrepancy, the German text of this document is the legally binding one.
      <a href="#/recht">Zur deutschen Fassung</a></span></p>`;
  }

  function kopf(titel, unter) {
    return h`<header class="seite__kopf">
      <p class="rechtspfad"><a href="#/recht">${ico('zurueck')}Rechtliches</a></p>
      <h1>${titel}</h1>
      ${unter ? h`<p class="seite__unter">${unter}</p>` : ''}
      <p class="fein">Fassung vom ${R.stand()}</p>
      ${massgeblich()}
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
          <h2>${ico('warnung')}${U.t(U.plural(f.length, 'Noch {0} Angabe fehlt', 'Noch {0} Angaben fehlen'))
            .replace('{0}', f.length)}</h2>
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
          <p>TrimmoTrade führt Angebote Dritter zusammen und stellt Werkzeuge zur Prüfung und Bewertung bereit.
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
          <p>TrimmoTrade rechnet im Browser. Suche, Bewertung, Karte, Ringtausch, Passung und jede
            Schätzung entstehen auf deinem Gerät. <b>Ohne Anmeldung verlässt davon nichts deinen Browser</b> –
            Suche und Inserate lassen sich ansehen, ohne dass ein Konto entsteht und ohne dass etwas über
            dich gespeichert wird.</p>
          <p>Mit einem Konto kommt eines hinzu: Dein Arbeitsstand liegt zusätzlich auf dem Server, damit du
            ihn auf jedem deiner Geräte wiederfindest und nicht verlierst, wenn du die Browserdaten löschst.
            Der Server verwahrt ihn und wertet ihn nicht aus – keine Suche über Profile, keine Auswertung,
            keine Statistik (Abschnitt 11).</p>
          <p>Zum Server geht damit: die <b>Anmeldung</b> (Abschnitt 4), die <b>Inserate</b>, die du
            veröffentlichst (Abschnitt 5), die <b>Anfragen</b> und <b>Besichtigungstermine</b>
            (Abschnitt 6), deine <b>Suchaufträge</b>, damit die Mail auch dann herausgeht, wenn du gerade
            nicht hier bist (Abschnitt 7), was du einer <b>WG-Gruppe</b> über dich erzählst (Abschnitt 8),
            dein <b>Arbeitsstand</b> für den Gerätewechsel (Abschnitt 11) und der <b>Dokumententresor</b> –
            der allerdings verschlüsselt wird, bevor er den Browser verlässt, und für den Anbieter nicht
            lesbar ist (Abschnitt 12).</p>
          <p>Die Trennlinie verläuft nicht willkürlich: Was andere erreichen muss, gehört auf den Server.
            Was nur dich angeht, liegt dort so, dass der Anbieter nichts damit anfängt – und die Unterlagen,
            bei denen das nicht genügt, liegen verschlüsselt.</p>
          <p>Es werden keine Werkzeuge zur Reichweitenmessung eingesetzt, keine Profile über dein Verhalten
            gebildet und keine Werbung ausgespielt – es gibt hier keine. Gezählt wird nur, wie oft eine
            Ansicht an einem Tag insgesamt geöffnet wurde – ohne Kennung, ohne Adresse, ohne Verlauf
            (Abschnitt 10). Deshalb erscheint auch kein Fenster, das um Einwilligung bittet: Es gibt nichts,
            wozu eine Einwilligung nötig wäre.</p>
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

          <h2>4. Anmeldung und Konto</h2>
          <p>Suche und Inserate lassen sich ohne Anmeldung ansehen; dabei entsteht kein Konto und wird
            nichts über dich gespeichert. Wer ein Konto anlegt, wird auf der Serverseite geführt – und die
            gibt es für nichts anderes. Gespeichert wird dort genau Folgendes:</p>
          <ul class="pruef">
            <li>${ico('pruefen')}<span>eine zufällige Kontonummer, die nichts über dich verrät</span></li>
            <li>${ico('pruefen')}<span>deine E-Mail-Adresse, sofern du eine angegeben hast, und ob sie
              bestätigt ist</span></li>
            <li>${ico('pruefen')}<span>ein Name, wenn du einen angibst – freiwillig</span></li>
            <li>${ico('pruefen')}<span>das gewählte Anmeldeverfahren und die Vertrauensstufe</span></li>
            <li>${ico('pruefen')}<span>der öffentliche Teil deiner Passkeys nebst Gerätebezeichnung</span></li>
            <li>${ico('pruefen')}<span>bei Anmeldung über Google oder Microsoft deren unveränderliche
              Kontokennung</span></li>
            <li>${ico('pruefen')}<span>deine offenen Sitzungen: Zeitpunkt, IP-Adresse und Browserangabe des
              Geräts, damit du sie beenden kannst</span></li>
          </ul>
          <p><b>Nicht im Konto stehen:</b> das Farbschema, die gewählte Ansichtsart und jede Berechnung
            der Rechner – die entsteht bei jedem Aufruf neu auf deinem Gerät. Was du an Profil, Merkliste,
            Vergleich, Bewerbungstafel und Suchaufträgen anlegst, wird dagegen deinem Konto zugeordnet
            gespeichert, damit es auf jedem deiner Geräte da ist; Abschnitt 11 beschreibt das im Einzelnen,
            Abschnitt 12 den Dokumententresor.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Bereitstellung des Zugangs, Zuordnung von Inseraten und Anfragen, Schutz vor
              missbräuchlicher Mehrfachanlage</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Nutzungsvertrags; für die
              Missbrauchsabwehr zusätzlich Art. 6 Abs. 1 lit. f DSGVO</dd>
            <dt>Speicherdauer</dt><dd>bis zur Löschung des Kontos; sie ist jederzeit ohne Angabe von Gründen
              möglich und wirkt sofort. Sitzungen enden spätestens nach dreißig Tagen ohne Nutzung,
              Anmeldecodes nach ${TT.konto ? TT.konto.CODE_GUELTIG_MIN : 10} Minuten.</dd>
            <dt>Empfänger</dt><dd>der Hostinganbieter als Auftragsverarbeiter nach Art. 28 DSGVO</dd>
          </dl>

          <h3>Cookies der Anmeldung</h3>
          <p>Für die Anmeldung werden zwei Cookies gesetzt. Das eine hält die Sitzung offen und ist für
            Skripte nicht lesbar; das andere schützt vor Anfragen, die dir eine fremde Seite unterschiebt.
            Beide sind für den von dir gewünschten Dienst unbedingt erforderlich, weshalb dafür keine
            Einwilligung nötig ist (§ 25 Abs. 2 Nr. 2 TDDDG). Cookies zu Werbe- oder Analysezwecken werden
            nicht gesetzt – es gibt keine.</p>

          <h3>Anmeldung über Google oder Microsoft</h3>
          <p>Wählst du einen dieser Wege, erfährt der jeweilige Anbieter, dass du dich bei TrimmoTrade anmeldest.
            An TrimmoTrade übermittelt werden Name, E-Mail-Adresse und die Angabe, ob sie bestätigt ist – nicht
            dein dortiges Passwort und keine weiteren Inhalte deines Kontos. Es besteht kein Zugriff auf
            Kontakte, Kalender, Dateien oder Postfach.</p>
          <p>Verantwortlich für die Verarbeitung auf ihrer Seite sind die Anbieter selbst:
            Google Ireland Limited und Microsoft Ireland Operations Limited, beide mit Sitz in Irland. Soweit
            dabei Daten in die Vereinigten Staaten übermittelt werden, stützt sich das auf den
            Angemessenheitsbeschluss der Europäischen Kommission zum EU-US Data Privacy Framework; beide
            Anbieter sind darunter zertifiziert.</p>

          <h3>Passkey</h3>
          <p>Beim Passkey entsteht das Schlüsselpaar im Sicherheitsbaustein deines Geräts. Der private
            Schlüssel verlässt das Gerät nicht und ist für TrimmoTrade nicht lesbar; auf dem Server liegt nur
            der öffentliche Teil, mit dem sich Signaturen prüfen, aber keine erzeugen lassen. Biometrische
            Merkmale – Gesicht, Fingerabdruck – werden weder übertragen noch verarbeitet: Sie entsperren
            ausschließlich lokal das Gerät (Art. 9 DSGVO ist damit nicht berührt).</p>

          <h3>Bestätigung der Adresse</h3>
          <p>Der Einmalcode dient allein der Bestätigung, dass du die angegebene Adresse abrufen kannst. Er
            gilt ${TT.konto ? TT.konto.CODE_GUELTIG_MIN : 10} Minuten, wird nur als Hashwert gespeichert und
            nach Ablauf, nach ${TT.konto ? TT.konto.CODE_VERSUCHE : 5} Fehlversuchen oder nach erfolgreicher
            Anmeldung gelöscht. Die Zustellung erfolgt über das Postfach des Anbieters bei seinem
            Hostinganbieter; ein weiterer Versanddienst ist nicht beteiligt.</p>

          <h3>Abwehr von Angriffen auf die Anmeldung</h3>
          <p>Um das Durchprobieren von Codes zu verhindern, wird für kurze Zeit festgehalten, wie viele
            Anmeldeversuche von einer IP-Adresse und zu einer Adresse ausgingen. Diese Zähler werden nach
            spätestens 24 Stunden gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO – ohne diese
            Maßnahme wäre ein sechsstelliger Code in kurzer Zeit zu erraten.</p>

          <h2>5. Inserate, die du veröffentlichst</h2>
          <p>Ein Inserat ist eine Veröffentlichung. Es ist für jeden sichtbar, auch ohne Konto, und es lässt
            sich verweisen und teilen. Gespeichert werden die Angaben, die du im Formular machst – Art,
            Lage, Größe, Preis, Ausstattung, Beschreibung, Energieausweis und Bilder –, dazu die Verbindung
            zu deinem Konto, der Zeitpunkt und die Zahl der Aufrufe und Anfragen.</p>
          <p>Als Name der anbietenden Seite erscheint der Name aus deinem Konto. <b>Deine E-Mail-Adresse und
            deine Telefonnummer stehen nicht im Inserat</b> und werden auch nicht an Suchende übermittelt.</p>
          <p>Hochgeladene Bilder werden beim Empfang neu berechnet. Dabei werden Aufnahmedaten aus der Datei
            entfernt – insbesondere Ortsangaben, die viele Kameras und Telefone einbetten. Diese Angaben
            würden sonst die genaue Adresse verraten, obwohl im Inserat nur das Viertel steht.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Veröffentlichung deines Angebots, Auffindbarkeit in der Suche, Schutz anderer
              Nutzender vor betrügerischen Angeboten</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Nutzungsvertrags; für die
              Prüfung auf Betrugsmuster zusätzlich Art. 6 Abs. 1 lit. f DSGVO</dd>
            <dt>Speicherdauer</dt><dd>bis du das Inserat löschst, längstens 60 Tage nach der letzten
              Bestätigung. Danach verfällt es und wird entfernt. Mit dem Inserat verschwinden die Bilder.</dd>
            <dt>Empfänger</dt><dd>die Öffentlichkeit, soweit das Inserat veröffentlicht ist; im Übrigen der
              Hostinganbieter als Auftragsverarbeiter nach Art. 28 DSGVO</dd>
          </dl>
          <p class="fein">Jedes Inserat wird beim Anlegen auf typische Betrugsmuster geprüft – etwa Vorkasse,
            Schlüsselversand per Post oder einen Preis weit unter der ortsüblichen Vergleichsmiete. Gefunden
            wird nicht gelöscht, sondern gekennzeichnet. Eine automatisierte Entscheidung mit rechtlicher
            Wirkung im Sinne des Art. 22 DSGVO ist damit nicht verbunden.</p>

          <h2>6. Anfragen</h2>
          <p>Wenn du auf ein Inserat antwortest, wird deine Nachricht auf dem Server gespeichert und der
            anbietenden Seite in deren Postfach angezeigt. Gespeichert werden dein Text, dein Name, deine
            E-Mail-Adresse und – falls angegeben – deine Telefonnummer sowie die Eckdaten, die du im Dialog
            <b>ausdrücklich freigegeben</b> hast.</p>
          <p>Welche Eckdaten das sind, steht vor dem Absenden im Dialog, Feld für Feld. Möglich sind
            Haushaltsgröße, Einzugstermin, Beschäftigung, eine Einkommens<b>spanne</b>, Haustiere, Rauchen,
            Wohnberechtigungsschein und Bürgschaft. Der Betrag deines Einkommens wird bewusst nur als Spanne
            übermittelt. Angaben zu Herkunft, Religion, Gesundheit, Familienplanung oder sexueller
            Orientierung – besondere Kategorien nach Art. 9 DSGVO – werden nicht übermittelt, auch dann
            nicht, wenn sie im Text stehen sollten; danach zu fragen wäre zudem nach § 19 AGG unzulässig.</p>
          <p><b>Die E-Mail an die anbietende Seite enthält weder deine Adresse noch deine Telefonnummer.</b>
            Sie enthält nur den Hinweis, dass eine Anfrage vorliegt, und einen Verweis in das Postfach.
            Umgekehrt bekommst du die Adresse der anbietenden Seite nicht – erst wer antwortet, gibt seine
            eigene frei.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Herstellung des Kontakts zwischen suchender und anbietender Seite</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO – vorvertragliche Maßnahme auf deine
              Anfrage hin</dd>
            <dt>Speicherdauer</dt><dd>bis zur Löschung deines Kontos. Eine Anfrage bleibt bestehen, auch wenn
              das Inserat gelöscht wird: Sie gehört beiden Seiten, und ein Verlauf, der verschwindet, weil
              die Gegenseite aufräumt, ist keiner.</dd>
            <dt>Empfänger</dt><dd>die anbietende Seite des jeweiligen Inserats</dd>
          </dl>

          <h3>Besichtigungstermine</h3>
          <p>Wer inseriert, kann Termine zur Besichtigung eintragen. Buchst du einen davon, wird
            gespeichert, welches Konto welchen Termin belegt – mehr nicht. Die anbietende Seite erfährt,
            dass ein Platz genommen wurde, und sieht, wie viele Plätze belegt sind; deinen Namen bekommt sie
            an dieser Stelle nicht. Auch die übrigen Teilnehmer siehst du nicht, und sie sehen dich nicht:
            Wer zu einer Besichtigung geht, hat nicht eingewilligt, den Mitbewerbern namentlich bekannt zu
            werden.</p>
          <p>Eine Mail geht an dich, wenn die anbietende Seite den Termin absagt. Sagst du selbst ab,
            verschwindet deine Buchung sofort und der Platz wird wieder frei.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Vereinbarung und Verwaltung von Besichtigungsterminen</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO – vorvertragliche Maßnahme auf deine
              Buchung hin</dd>
            <dt>Speicherdauer</dt><dd>bis du absagst; im Übrigen 90 Tage nach dem Termin, mit dem Inserat
              oder mit deinem Konto auch früher</dd>
            <dt>Empfänger</dt><dd>die anbietende Seite des jeweiligen Inserats</dd>
          </dl>

          <h2>7. Suchaufträge und Erinnerungen</h2>
          <p>Ein Suchauftrag speichert deine Filter und deine E-Mail-Adresse auf dem Server. Kommt ein
            passendes Inserat dazu, geht eine Mail an dich hinaus. Ohne Speicherung auf dem Server ginge das
            nicht: Der Browser kann nichts schicken, während er geschlossen ist.</p>
          <p>Wer inseriert, bekommt außerdem eine Erinnerung, bevor ein Inserat nach 60 Tagen verfällt.</p>
          <p><b>Jede dieser Mails enthält einen Abmeldeverweis, der ohne Anmeldung wirkt.</b> Ein Klick
            genügt, und es kommt nichts mehr.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Benachrichtigung über neue Angebote, Aktualität des Bestands</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des von dir angelegten
              Suchauftrags</dd>
            <dt>Speicherdauer</dt><dd>bis du den Suchauftrag löschst oder dein Konto beendest</dd>
            <dt>Widerspruch</dt><dd>jederzeit über den Verweis in der Mail oder in der Anwendung
              (Art. 21 DSGVO)</dd>
          </dl>

          <h2>8. Gruppen zur WG-Gründung</h2>
          <p>Wer eine Gruppe eröffnet oder ihr beitritt, gibt anderen Menschen etwas über sich preis –
            das ist der Zweck der Sache und nicht ihr Nebeneffekt. Deshalb steht hier genau, wer was
            zu sehen bekommt.</p>
          <p>Gespeichert werden dein Vorstellungstext und die Eckdaten, die du im Formular
            <b>ausdrücklich freigibst</b>: Alter, Beruf, eine Einkommens<b>spanne</b>, Rauchen,
            Haustiere, gewünschter Einzugstermin und deine sechs Antworten zum Alltag, aus denen sich
            die Passung rechnet. Diese Angaben werden als Kopie gespeichert und ändern sich nicht mehr,
            wenn du später dein Profil bearbeitest.</p>
          <dl class="rechtsliste">
            <dt>Ohne Konto sichtbar</dt><dd>nur Zahlen und der Text der Gruppe – keine Person</dd>
            <dt>Angemeldet sichtbar</dt><dd>Rufname und erster Buchstabe des Nachnamens („Cem Y.“),
              Alter, Beruf, Einzugstermin, Vorstellungstext, Lebensrhythmus</dd>
            <dt>Für Mitglieder sichtbar</dt><dd>zusätzlich die E-Mail-Adressen – erst dann, wenn beide
              Seiten einander angenommen haben</dd>
            <dt>Für die gründende Person</dt><dd>zusätzlich die offenen Beitrittsanfragen</dd>
          </dl>
          <p>Die anbietende Seite der Wohnung ist von Gruppen zu ihrem eigenen Inserat ausgeschlossen –
            weder gründen noch beitreten. Was Bewerbende einander erzählen, erzählen sie einander.
            Was die Vermieterseite erfährt, steht in der gemeinsamen Bewerbung, und das sind
            Haushaltsgröße und Berufe, nicht die einzelnen Vorstellungstexte.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Zusammenfinden von Menschen, die gemeinsam eine Wohnung mieten wollen</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Nutzungsvertrags und
              vorvertragliche Maßnahme auf deine eigene Anfrage hin</dd>
            <dt>Speicherdauer</dt><dd>bis die Gruppe aufgelöst wird oder abläuft, spätestens mit der
              Löschung deines Kontos. Eine Gruppe läuft 45 Tage nach der letzten Änderung ab.</dd>
            <dt>Empfänger</dt><dd>die übrigen Mitglieder der Gruppe im oben beschriebenen Umfang</dd>
          </dl>
          <p class="fein">Nicht übermittelt werden Angaben zu Herkunft, Religion, Gesundheit,
            Familienplanung oder sexueller Orientierung (Art. 9 DSGVO) – sie kommen im Formular gar
            nicht erst vor. Eine Auswahl nach Alter oder Geschlecht nimmt TrimmoTrade nicht vor; dass
            eine WG das für sich tun darf (§ 19 Abs. 5 AGG nimmt das gemeinsame Wohnen aus), ist eine
            Entscheidung der Menschen, nicht dieser Anwendung.</p>
          <p class="fein"><b>Was ausdrücklich nicht stattfindet:</b> eine Prüfung von Personen.
            TrimmoTrade stellt niemanden fest, bewertet niemanden und steht für niemanden ein. Wer
            sich hier zusammentut, entscheidet selbst – alles andere zu behaupten wäre ein
            Versprechen, das niemand halten kann.</p>

          <h2>9. Meldungen zu Inseraten</h2>
          <p>Ein Inserat lässt sich melden, ohne dass ein Konto nötig ist – so verlangt es Art. 16 Abs. 1 der
            Verordnung (EU) 2022/2065 über digitale Dienste. Gespeichert werden der Grund, dein Text und,
            falls du sie angibst, deine E-Mail-Adresse. Die Adresse ist freiwillig; ohne sie lässt sich die
            Entscheidung nicht mitteilen.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Prüfung des gemeldeten Inhalts, Empfangsbestätigung und Mitteilung der
              Entscheidung</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit Art. 16 der Verordnung
              (EU) 2022/2065 – rechtliche Verpflichtung</dd>
            <dt>Speicherdauer</dt><dd>so lange, wie die Nachvollziehbarkeit der Entscheidung es erfordert;
              danach Löschung</dd>
          </dl>

          <h2>10. Reichweitenmessung ohne Personenbezug</h2>
          <p>Um zu erkennen, welche Teile der Anwendung benutzt werden, wird eine einzige Tabelle geführt.
            Sie hat drei Spalten: <b>Tag</b>, <b>Name der Ansicht</b> und <b>Anzahl</b>. Aus „am 3. März
            412 Suchen“ lässt sich niemand herauslesen.</p>
          <p>Nicht gespeichert werden: Kennung, IP-Adresse, Sitzung, Reihenfolge der Aufrufe, Gerät,
            Herkunftsseite. Auf deinem Gerät wird dafür nichts abgelegt, weshalb sich die Frage nach
            § 25 TDDDG nicht stellt. Ein Personenbezug im Sinne des Art. 4 Nr. 1 DSGVO entsteht nicht;
            damit ist die DSGVO auf diese Zählung nicht anwendbar.</p>
          <p class="fein">Warum das hier trotzdem steht: Wer wissen will, was mit ihm passiert, soll nicht
            erst herausfinden müssen, was <em>nicht</em> in der Erklärung steht.</p>

          <h2>11. Dein Arbeitsstand: Browser und Gerätewechsel</h2>
          <p>TrimmoTrade legt deine Eingaben zuerst im lokalen Speicher deines Browsers ab – Profil,
            Merkliste, Vergleich, Bewerbungstafel, Notizen, gespeicherte Filter und die Einstellungen zur
            Darstellung. <b>Ohne Konto bleibt es dabei:</b> Diese Daten verlassen dein Gerät nicht, und der
            Anbieter hat keinen Zugriff darauf.</p>
          <p>Bist du angemeldet, wird derselbe Stand zusätzlich zu deinem Konto auf dem Server abgelegt.
            Das ist der Grund, warum du die Suche am Rechner beginnen und unterwegs auf dem Telefon
            fortsetzen kannst – und warum gelöschte Browserdaten nicht mehr alles mitnehmen.</p>
          <ul class="pruef">
            <li>${ico('pruefen')}<span><b>Was mitgeht:</b> Profil, Merkliste samt deiner Notizen, Vergleich,
              Bewerbungstafel, Suchaufträge, zuletzt gesehene Inserate, gespeicherte Filter, Umzugsplan,
              Übergabeprotokoll, die zuletzt eingegebenen Werte der Rechner und welche Hinweise du
              weggeklickt hast</span></li>
            <li>${ico('pruefen')}<span><b>Was nicht mitgeht:</b> Farbschema und Ansichtsart – die gehören
              zum Gerät und nicht zu dir</span></li>
            <li>${ico('pruefen')}<span><b>Was der Server damit tut:</b> nichts. Er nimmt die Angaben als
              Text entgegen, gibt sie unverändert zurück und liest sie nicht aus. Es findet keine Suche über
              Profile statt, keine Auswertung, keine Statistik, keine Weitergabe.</span></li>
          </ul>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Fortsetzen der Nutzung auf einem anderen Gerät und Schutz deiner Eingaben vor
              Verlust</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Nutzungsvertrags über
              ein Konto, dessen Zweck genau das ist</dd>
            <dt>Speicherdauer</dt><dd>bis du die Angaben in der Anwendung löschst, längstens bis zur
              Löschung deines Kontos</dd>
            <dt>Empfänger</dt><dd>der Hostinganbieter als Auftragsverarbeiter nach Art. 28 DSGVO. An Dritte
              geht nichts.</dd>
          </dl>
          <p class="fein">Der Browser bleibt die Wahrheit für den laufenden Besuch, der Server ist die
            Kopie, die den Gerätewechsel überlebt. Fällt der Server aus, arbeitet die Anwendung weiter –
            nur eben ohne Abgleich.</p>
          <p>Für den Zugriff auf den Speicher deines Browsers ist keine Einwilligung erforderlich: Er ist
            unbedingt erforderlich, damit der von dir ausdrücklich gewünschte Dienst überhaupt funktioniert
            (§ 25 Abs. 2 Nr. 2 des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes).</p>
          <p>Du kannst diese Daten jederzeit im Fußbereich unter „Meine Daten“ als Datei sichern oder
            vollständig löschen. Löschst du sie dort, während du angemeldet bist, verschwinden sie auch auf
            dem Server.</p>

          <h2>12. Dokumententresor</h2>
          <p>Legst du Unterlagen im Dokumententresor ab, werden sie <b>in deinem Browser verschlüsselt,
            bevor sie ihn verlassen</b> – mit AES-GCM und 256 Bit. Der Schlüssel entsteht aus deinem
            Kennwort und wird nirgends gespeichert; verschlüsselt wird auch der Dateiname.</p>
          <p>Erst danach geht das Chiffrat zum Server. Es liegt dort, damit du deine Unterlagen auf einem
            zweiten Gerät wiederfindest und damit ein Verweis, den du verschickst, auch dann aufgeht, wenn
            dein Browser geschlossen ist. Ohne das wäre eine Freigabe wertlos.</p>
          <p><b>Der Anbieter kann diese Dateien nicht lesen.</b> Er hat weder dein Kennwort noch den
            Schlüssel; im Speicher liegt für ihn Rauschen. Unverschlüsselt liegen genau drei Angaben, ohne
            die sich der Tresor nicht bedienen ließe: die Art der Unterlage, die du beim Ablegen gewählt
            hast (etwa „Gehaltsnachweis“), die Größe in Byte und der Zeitpunkt des Ablegens.</p>
          <p>Gibst du Unterlagen frei, wird kein Anhang verschickt, sondern ein Verweis. Der Schlüssel dazu
            steht im Fragmentteil dieses Verweises – dem Teil hinter dem Rautezeichen, den Browser
            grundsätzlich nicht an Server übertragen. Zur Freigabe selbst wird gespeichert, welche Dokumente
            sie umfasst, für wen du sie gedacht hast, wann sie abläuft, wie oft sie noch abgerufen werden
            darf und der Zeitpunkt jedes Abrufs – damit du siehst, ob deine Unterlagen angesehen wurden.
            Wer abgerufen hat, wird nicht festgehalten.</p>
          <dl class="rechtsliste">
            <dt>Zweck</dt><dd>Erfüllung des Vertrags über die Nutzung von TrimmoTrade; bei einer Freigabe
              die Übermittlung an die Stelle, der du sie zugedacht hast</dd>
            <dt>Rechtsgrundlage</dt><dd>Art. 6 Abs. 1 lit. b DSGVO; für die Verschlüsselung zugleich
              Art. 32 DSGVO – Sicherheit der Verarbeitung</dd>
            <dt>Speicherdauer</dt><dd>bis du das Dokument löschst, den Tresor leerst oder dein Konto
              beendest. Eine Freigabe verliert ihre Wirkung mit dem Ablauf, den du gesetzt hast – längstens
              nach 30 Tagen; widerrufen kannst du sie jederzeit vorher, und der Verweis führt danach sofort
              ins Leere. Der Eintrag selbst bleibt noch 14 Tage stehen, damit du nachsehen kannst, was du
              wann freigegeben hast, und wird dann gelöscht.</dd>
            <dt>Empfänger</dt><dd>der Hostinganbieter als Auftragsverarbeiter nach Art. 28 DSGVO; darüber
              hinaus nur, wem du selbst einen Verweis gibst</dd>
          </dl>
          <p class="fein">Warum das hier so ausführlich steht: „Ende-zu-Ende-verschlüsselt“ schreiben viele.
            Prüfbar wird es erst, wenn danebensteht, was <em>nicht</em> verschlüsselt ist.</p>

          <h2>13. Keine Werbung</h2>
          <p>Auf TrimmoTrade erscheint keine Werbung – weder eigene noch fremde. Es ist kein Werbenetzwerk
            eingebunden, es werden keine Werbekennungen gesetzt, und es gehen keine Daten an
            Werbetreibende. Es gibt auch nichts, was sich zuschalten ließe: Die Anwendung enthält keinen
            Programmteil, der Anzeigen ausspielen könnte.</p>
          <p>Getragen wird der freie Tarif von den entgeltlichen Leistungen – TrimmoTrade Plus und die
            Hervorhebung eigener Inserate. Beide sind dort, wo sie wirken, als bezahlt gekennzeichnet
            (§ 5b Abs. 1 Nr. 6 des Gesetzes gegen den unlauteren Wettbewerb).</p>

          <h2>14. Kontaktaufnahme und Hilfe</h2>
          <p>Schreibst du per E-Mail, verarbeitet der Anbieter die Angaben aus deiner Nachricht, um sie zu
            beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogenen Anfragen, sonst
            Art. 6 Abs. 1 lit. f DSGVO. Die Nachrichten werden gelöscht, sobald die Anfrage abschließend
            bearbeitet ist und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.</p>
          <p>Die Hilfe in der Anwendung beantwortet Fragen <b>im Browser</b>; dabei wird nichts übertragen.
            Führt sie nicht weiter, kannst du die Zusammenfassung an ${rw('service', 'Service-Postfach')}
            weitergeben. Das geschieht nur auf deinen ausdrücklichen Klick, über dein eigenes E-Mail-Programm –
            und <b>der vollständige Text wird dir vorher angezeigt</b>. Übertragen wird ausschließlich, was
            dort steht: deine Fragen, die Themen der gegebenen Antworten, dein Freitext und die Kontaktangaben,
            die du selbst einträgst. Profil, Merkliste und die Inhalte des Dokumententresors sind nicht
            enthalten und werden auch nicht angehängt.</p>

          <h2>15. Bezahlung von TrimmoTrade Plus</h2>
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

          <h2>16. Keine automatisierte Entscheidung über Personen</h2>
          <p>TrimmoTrade bewertet Angebote, nicht Menschen. Die Passung, die Chancenschätzung und der Prüfhinweis
            beziehen sich auf Wohnungen und Inseratstexte und dienen deiner eigenen Einordnung. Eine
            automatisierte Entscheidung mit rechtlicher Wirkung gegenüber Personen im Sinne von Art. 22 DSGVO
            findet nicht statt.</p>

          <h2>17. Übermittlung in Drittländer</h2>
          <p>Über die in Abschnitt 4 beschriebene Anmeldung bei Google oder Microsoft hinaus findet
            keine Übermittlung personenbezogener Daten in Länder außerhalb der Europäischen Union und des
            Europäischen Wirtschaftsraums statt. Wer das vermeiden möchte, meldet sich mit Passkey oder mit
            E-Mail-Adresse an – beide Wege kommen ohne fremden Anbieter aus.</p>

          <h2>18. Deine Rechte</h2>
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
          <p class="fein">Auskunft, Übertragbarkeit und Löschung kannst du unmittelbar selbst ausüben, ohne
            jemanden zu fragen: im Fußbereich unter „Meine Daten“. Was dort als Datei herauskommt, ist
            derselbe Stand, der zu deinem Konto abgelegt ist; was du dort löschst, verschwindet auch auf dem
            Server. Für das Konto selbst genügt ein Klick in den Einstellungen – die Löschung wirkt sofort
            und nimmt Inserate, Ablage und Tresor mit.</p>

          <h2>19. Beschwerderecht</h2>
          <p>Du kannst dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere in
            dem Mitgliedstaat deines Aufenthaltsorts, deines Arbeitsplatzes oder des Orts des mutmaßlichen
            Verstoßes. Für den Anbieter zuständig ist ${rw('aufsichtsbehoerde', 'zuständige Aufsichtsbehörde')}.</p>

          <h2>20. Pflicht zur Bereitstellung</h2>
          <p>Du bist nicht verpflichtet, personenbezogene Daten bereitzustellen. Ohne die Angaben im Profil
            fallen allerdings die Funktionen weg, die darauf aufbauen – etwa die Passung oder die
            Chancenschätzung.</p>

          <h2>21. Änderungen</h2>
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
        ${kopf('Allgemeine Geschäftsbedingungen', 'Für die Nutzung von TrimmoTrade durch Verbraucherinnen, Verbraucher und Unternehmen.')}
        ${luecken()}
        <div class="block rechtstext">

          <h2>§ 1 Anbieter, Geltungsbereich</h2>
          <p>(1) Anbieter von TrimmoTrade ist ${rw('name', 'Name')}, ${R.anschriftZeile() || ''}
            (nachfolgend „Anbieter“). Die vollständigen Angaben stehen im <a href="#/recht/impressum">Impressum</a>.</p>
          <p>(2) Diese Bedingungen gelten für alle Verträge über die Nutzung von TrimmoTrade in der jeweils bei
            Vertragsschluss geltenden Fassung.</p>
          <p>(3) Verbraucher ist, wer ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder der
            gewerblichen noch der selbständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB).
            Unternehmer ist, wer dabei in Ausübung einer solchen Tätigkeit handelt (§ 14 BGB).</p>
          <p>(4) Abweichende Bedingungen der Nutzenden werden nicht Vertragsbestandteil, es sei denn, der
            Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>

          <h2>§ 2 Gegenstand der Leistung</h2>
          <p>(1) TrimmoTrade ist eine Oberfläche, die Wohnungsangebote verschiedener Art – Miete, Kauf,
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
          <p>(5) Ein eingestelltes Inserat ist eine <b>Veröffentlichung</b>: Es ist für jedermann sichtbar,
            auch ohne Konto, und über einen dauerhaften Verweis erreichbar. Es <b>läuft 60 Tage nach der
            letzten Bestätigung ab</b> und wird danach entfernt. Der Anbieter erinnert vorher per E-Mail;
            eine Bestätigung verlängert die Laufzeit um weitere 60 Tage. Diese Befristung dient der
            Aktualität des Bestands und gilt für alle gleichermaßen.</p>
          <p>(6) Anfragen zwischen Nutzenden werden über den Dienst zugestellt. Der Anbieter gibt dabei
            <b>weder die E-Mail-Adresse noch die Telefonnummer</b> einer Seite an die andere weiter; die
            benachrichtigende E-Mail enthält lediglich den Hinweis auf eine vorliegende Anfrage. Welche
            Angaben eine Anfrage begleiten, entscheidet die anfragende Person vor dem Absenden.</p>
          <p>(7) Der Dienst ermöglicht es Nutzenden, sich zu Gruppen zusammenzuschließen, um eine
            Wohnung gemeinsam zu mieten. Der Anbieter <b>prüft die Beteiligten nicht</b>, stellt ihre
            Identität nicht fest und steht für sie nicht ein. Er wird weder Partei eines Mietvertrags
            noch einer Vereinbarung zwischen den Mitgliedern einer Gruppe. Die Entscheidung, mit wem
            jemand zusammenzieht, treffen ausschließlich die Beteiligten.</p>

          <h2>§ 3 Anmeldung und Zustandekommen des Vertrags</h2>
          <p>(1) Suche und Inserate lassen sich ohne Anmeldung ansehen. Ein Konto braucht, wer Inserate
            merken oder vergleichen, Anbieter anschreiben, Suchaufträge anlegen, Unterlagen ablegen oder
            selbst inserieren will. Die Anmeldung ist möglich mit einem Passkey, über ein Konto bei Google
            oder Microsoft oder mit einer E-Mail-Adresse und einem Einmalcode. Mit der Anmeldung kommt ein
            unentgeltlicher Nutzungsvertrag über den freien Tarif zustande; ohne Anmeldung entsteht kein
            Vertragsverhältnis.</p>
          <p>(2) Die Anmeldung setzt die Zustimmung zu diesen Bedingungen und die Kenntnisnahme der
            Datenschutzerklärung voraus. Beide sind vor der Anmeldung ohne Anmeldung abrufbar.</p>
          <p>(3) Es besteht kein Anspruch auf Anmeldung. Der Anbieter kann sie ablehnen, insbesondere bei
            begründetem Verdacht auf missbräuchliche Mehrfachanlage.</p>
          <p>(4) Je Person ist ein Konto zulässig. Zugangsmittel dürfen nicht weitergegeben werden. Wer den
            Verdacht hat, dass ein anderer Zugang zu seinem Konto hat, teilt das unverzüglich mit.</p>
          <p>(5) Bestimmte Handlungen setzen eine Vertrauensstufe voraus – insbesondere das Einstellen von
            Angeboten. Die Stufen und ihre Voraussetzungen sind in der Anwendung beschrieben.</p>
          <p>(6) Das Konto kann jederzeit, ohne Angabe von Gründen und ohne Frist gelöscht werden. Damit endet
            der unentgeltliche Nutzungsvertrag.</p>
          <p>(7) Ein Vertrag über TrimmoTrade Plus kommt zustande, wenn der Anbieter die Bestellung annimmt oder
            die Leistung freischaltet. Vor der Bestellung werden die wesentlichen Merkmale, der Gesamtpreis,
            die Laufzeit und die Kündigungsbedingungen angezeigt. Die Schaltfläche, mit der die Bestellung
            abgeschlossen wird, ist mit „zahlungspflichtig bestellen“ beschriftet (§ 312j Abs. 3 BGB).</p>
          <p>(8) Der Vertragstext wird nach Abschluss auf einem dauerhaften Datenträger bestätigt
            (§ 312f BGB). Vertragssprache ist Deutsch.</p>

          <h2>§ 4 Freier Tarif</h2>
          <p>(1) Der freie Tarif ist dauerhaft ohne Entgelt nutzbar. Er umfasst die vollständige Suche, die
            Karte, die Bewertung nach dem eigenen Profil, den Prüfhinweis auf Betrugsmerkmale, den Abgleich
            mit der ortsüblichen Vergleichsmiete und sämtliche Rechner.</p>
          <p>(2) <b>Werbung wird nicht ausgespielt.</b> Der freie Tarif wird durch die entgeltlichen
            Leistungen nach den §§ 5 und 6 getragen.</p>
          <p>(3) Der Anbieter behält sich vor, den Umfang des freien Tarifs zu ändern. Leistungen, die dem
            Schutz der Nutzenden dienen – insbesondere Prüfhinweis, Vergleichsmiete und Meldeweg –, bleiben
            entgeltfrei.</p>

          <h2>§ 5 TrimmoTrade Plus</h2>
          <p>(1) TrimmoTrade Plus umfasst die auf der <a href="#/plus">Tarifseite</a> beschriebenen Leistungen.
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
          <p>(6) Ein entgeltlicher Vertrag kommt erst zustande, wenn in der Anwendung ein Zahlungsweg
            angeboten wird. Solange das nicht der Fall ist, gibt es keine Schaltfläche, mit der sich Plus
            kaufen ließe, es werden keine Zahlungsdaten erhoben und es entsteht keine Zahlungspflicht;
            die Absätze 1 bis 5 beschreiben dann die Bedingungen, zu denen ein Vertrag geschlossen würde.
            Zugänglich sind die Leistungen von Plus in dieser Zeit über einen Gründerplatz nach § 7.</p>

          <h2>§ 6 Bezahlte Sichtbarkeit</h2>
          <p>(1) Der Anbieter stellt zwei Formen bezahlter Sichtbarkeit bereit:</p>
          <ul class="pruef">
            <li>${ico('pruefen')}<span><b>Vorrang von Anfragen.</b> Anfragen von Nutzenden mit TrimmoTrade Plus
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
          <p>(6) § 5 Abs. 6 gilt entsprechend: Ohne angebotenen Zahlungsweg lässt sich bezahlte Sichtbarkeit
            nicht buchen. Die Reihenfolge der Treffer entsteht dann ausschließlich aus den Angaben der
            suchenden Person.</p>

          <h2>§ 7 Gründerplätze</h2>
          <p>(1) Der Anbieter vergibt die ersten <b>${U.num(g.plaetze)} Plätze</b> mit den Leistungen von
            TrimmoTrade Plus für <b>${g.monate} Monate ohne Entgelt</b> (Gründerplatz).</p>
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
            werden – also bei TrimmoTrade Plus. Für den freien Tarif und für einen
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
          <p class="fein">TrimmoTrade holt diese Zustimmung in der Bestellstrecke ausdrücklich ein – als eigenes
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

  TrimmoTrade Plus

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
          <p>Für Inhalte in TrimmoTrade, die gegen Recht verstoßen: erfundene Inserate, Zahlungsaufforderungen
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
          <p>TrimmoTrade ist so gebaut, dass es sich vollständig mit der Tastatur bedienen lässt und mit
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
          <h2>${ico('plus5')}TrimmoTrade Plus, bezahlt</h2>
          <p>${U.t('Läuft seit {0},').replace('{0}', S.get().tarifSeit ? U.dateDE(S.get().tarifSeit) : U.t('kurzem'))}
            ${U.t('Abrechnung {0}.').replace('{0}',
              U.t(S.get().tarifIntervall === 'jahr' ? 'jährlich' : 'monatlich'))}</p>
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
    ['zusatz', 'Geschäftsbezeichnung (freiwillig)', 'etwa „TrimmoTrade“', 'text'],
    ['strasse', 'Straße und Hausnummer', 'kein Postfach – die Anschrift muss ladungsfähig sein', 'text'],
    ['plz', 'Postleitzahl', '', 'text'],
    ['ort', 'Ort', '', 'text'],
    ['land', 'Land', '', 'text'],
    ['email', 'E-Mail-Adresse', 'Pflichtangabe nach § 5 DDG', 'email'],
    ['telefon', 'Telefonnummer', 'der übliche zweite Kontaktweg', 'tel'],
    ['service', 'Postfach des Service-Teams', 'wohin die Hilfe Anfragen weiterleitet', 'email'],
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

        ${R.vomServer() ? h`<div class="gut-meldung">${ico('pruefen')}<span><b>Diese Angaben kommen vom
          Server</b> – aus <code>api/config.php</code>, Abschnitt <code>betreiber</code>. Damit sehen sie
          alle Besucher, und genau so muss es sein. Ändern lassen sie sich nur dort; was du unten einträgst,
          wirkt nur in diesem Browser und wird von den Serverangaben überschrieben.</span></div>`
        : h`<div class="warn-meldung">${ico('warnung')}<span><b>Diese Angaben liegen nur in diesem
          Browser.</b> Auf einer Website reicht das nicht: Jeder andere Besucher sähe an ihrer Stelle eine
          Lücke, und die Impressumspflicht nach § 5 DDG wäre nicht erfüllt. Auf dem Server gehören sie in
          <code>api/config.php</code> unter <code>betreiber</code>. <code>php api/index.php pruefen</code>
          sagt, was dort noch fehlt.</span></div>`}

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

  const UNTER = U.karte({
    impressum, datenschutz, agb, widerruf, melden, barrierefreiheit,
    kuendigen, angaben: angabenSeite
  });

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
    ui.dateiSichern('widerruf-trimmotrade.txt', el ? el.textContent : '', 'text/plain');
  });

  A_('kuendigen-plus', () => {
    if (!confirm('TrimmoTrade Plus zum Ende der laufenden Laufzeit kündigen?')) return;
    P.wechseln('frei');
    ui.neuZeichnen();
    ui.toast('Gekündigt. Die Bestätigung würde im Betrieb in Textform zugehen.', 'gut');
  });

  A_('gruender-zurueck', (el) => {
    if (!confirm(U.t('Gründerplatz zurückgeben? Der Platz geht an die nächste Person, und Plus endet sofort.'))) return;
    ui.knopfArbeit(el, Promise.resolve(P.gruenderAufgeben()).then(() => {
      ui.neuZeichnen();
      ui.toast('Gründerplatz zurückgegeben.');
    }, (e) => ui.toast((e && e.text) || 'Das ging nicht.', 'schlecht')));
  });

  TT.viewRecht = { SEITEN };
})(window.TT = window.TT || {});
