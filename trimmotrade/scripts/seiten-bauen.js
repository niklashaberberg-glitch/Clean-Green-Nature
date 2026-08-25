/* =====================================================================
   TrimmoTrade – Ratgeberseiten bauen

   Warum es diese Seiten gibt: Die Anwendung ist ein Hash-Router. Für eine
   Suchmaschine besteht sie damit aus genau einer Seite – alles hinter dem
   Rautezeichen sieht ein Crawler nicht. Ohne echte HTML-Dateien mit
   eigenem Inhalt gibt es also nichts, wofür TrimmoTrade gefunden werden
   könnte, außer dem Namen selbst.

   Was hier nicht steht: Türseiten. Sätze wie „Mietwohnung Köln günstig“
   ohne eigenen Inhalt sind seit Jahren ein Abwertungsgrund, kein
   Ranggewinn. Jede Seite hier beantwortet eine Frage, die Menschen
   tatsächlich stellen, und führt danach in das Werkzeug, das dazu passt.

   Kopf, Fuß und Auszeichnung stehen einmal; die Inhalte sind Daten.
   ===================================================================== */
const fs = require('fs');
const path = require('path');

const WURZEL = path.join(__dirname, '..');
const BASIS = 'https://www.trimmotrade.de';

/* ------------------------- Bausteine ------------------------- */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function kopf(seite) {
  const url = BASIS + '/' + seite.datei;
  const faq = seite.fragen && seite.fragen.length ? {
    '@type': 'FAQPage',
    mainEntity: seite.fragen.map((f) => ({
      '@type': 'Question',
      name: f.frage,
      acceptedAnswer: { '@type': 'Answer', text: f.antwortText || f.antwort.replace(/<[^>]+>/g, '') }
    }))
  } : null;

  const daten = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: seite.titel,
        description: seite.beschreibung,
        inLanguage: 'de-DE',
        url,
        mainEntityOfPage: url,
        datePublished: seite.stand,
        dateModified: seite.stand,
        author: { '@type': 'Organization', name: 'TrimmoTrade', url: BASIS + '/' },
        publisher: {
          '@type': 'Organization', name: 'TrimmoTrade',
          logo: { '@type': 'ImageObject', url: BASIS + '/icon-512.png' }
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'TrimmoTrade', item: BASIS + '/' },
          { '@type': 'ListItem', position: 2, name: seite.kurz, item: url }
        ]
      }
    ].concat(faq ? [faq] : [])
  };

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(seite.titel)}</title>
<meta name="description" content="${esc(seite.beschreibung)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="author" content="TrimmoTrade – Niklas Haberberg">
<meta name="theme-color" content="#1a5c37" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f120f" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="TrimmoTrade">
<meta property="og:title" content="${esc(seite.titel)}">
<meta property="og:description" content="${esc(seite.beschreibung)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASIS}/vorschau.png">
<meta property="og:locale" content="de_DE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(seite.titel)}">
<meta name="twitter:description" content="${esc(seite.beschreibung)}">
<meta name="twitter:image" content="${BASIS}/vorschau.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/assets/app.css">
<script type="application/ld+json">${JSON.stringify(daten)}</script>
</head>
<body class="ist-angemeldet">
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>

<header class="kopf">
  <div class="kopf__innen">
    <a class="marke" href="/" aria-label="TrimmoTrade, zur Startseite">
      <span class="marke__zeichen" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none"><path d="M4 16L16 5l12 11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 14v12h17V14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="20" r="3.2" stroke="currentColor" stroke-width="2.4"/></svg>
      </span>
      <span class="marke__text">TrimmoTrade</span>
    </a>
    <nav class="kopf__nav" aria-label="Hauptbereiche">
      <a href="/#/suche"><span>Suchen</span></a>
      <a href="/#/tausch"><span>Ringtausch</span></a>
      <a href="/#/werkzeuge"><span>Werkzeuge</span></a>
    </nav>
    <div class="kopf__tun">
      <a class="knopf knopf--klein" href="/#/suche">Zur Suche</a>
    </div>
  </div>
</header>

<main id="inhalt">
<div class="seite seite--schmal">
  <nav class="brotkrumen" aria-label="Pfad"><a href="/">Start</a> › <span>${esc(seite.kurz)}</span></nav>
  <header class="seite__kopf">
    <h1>${esc(seite.h1)}</h1>
    <p class="seite__unter">${seite.vorspann}</p>
  </header>
`;
}

function fuss(seite) {
  const andere = SEITEN.filter((s) => s.datei !== seite.datei);
  return `
  <section class="block">
    <h2>Weiterlesen</h2>
    <ul class="anker">
      ${andere.map((s) => `<li><div><b><a href="/${s.datei}">${esc(s.kurz)}</a></b><span>${esc(s.beschreibung.slice(0, 96))}…</span></div></li>`).join('\n      ')}
    </ul>
  </section>

  <p class="fein">Stand: ${seite.stand}. Allgemeine Hinweise zur Einordnung, keine Rechtsberatung.</p>
</div>
</main>

<footer class="fuss">
  <p><b>TrimmoTrade</b> führt Mietmarkt, WG-Suche und Wohnungstausch in einer Oberfläche zusammen.</p>
  <p class="fuss__links fuss__links--recht">
    <a href="/#/recht/impressum">Impressum</a>
    <a href="/#/recht/datenschutz">Datenschutz</a>
    <a href="/#/recht/agb">AGB</a>
    <a href="/#/recht/widerruf">Widerruf</a>
    <a href="/#/recht/barrierefreiheit">Barrierefreiheit</a>
  </p>
  <p class="fuss__links">
    <a href="/#/suche">Zur Suche</a>
    <a href="/#/werkzeuge">Werkzeuge</a>
    <a href="/#/hilfe">Hilfe</a>
  </p>
</footer>
</body>
</html>
`;
}

/* ------------------------- Inhalte ------------------------- */

const STAND = '2026-08-25';

const SEITEN = [
  {
    datei: 'wohnungstausch.html',
    rang: '0.9',
    kurz: 'Wohnungstausch',
    titel: 'Wohnungstausch: Wie ein Ringtausch funktioniert – TrimmoTrade',
    h1: 'Wohnungstausch und Ringtausch',
    beschreibung: 'Der direkte Wohnungstausch scheitert fast immer am doppelten Zufall. Ein Ringtausch über drei oder vier Haushalte funktioniert – so läuft er ab, und das sagt das Mietrecht dazu.',
    vorspann: 'Zwei Menschen, die exakt das Gegenteil voneinander wollen – das passiert fast nie. In einer Kette reicht es, wenn jeder die Wohnung des Nächsten möchte.',
    stand: STAND,
    inhalt: `
  <section class="block">
    <h2>Warum der direkte Tausch fast nie klappt</h2>
    <p>Ein direkter Tausch verlangt einen doppelten Zufall: Zwei Haushalte müssen jeweils genau
      das wollen, was die andere Seite hat, und jeweils genau das anbieten, was die andere sucht.
      Wer aus einer Zweizimmerwohnung in Köln nach Hamburg will, findet sehr selten jemanden, der
      aus einer Hamburger Zweizimmerwohnung nach Köln will – und dann auch noch zur passenden Zeit,
      im passenden Preisrahmen und mit passendem Zuschnitt.</p>
    <p>Der Ringtausch löst genau das auf. Es genügt, dass jeder die Wohnung des Nächsten in der
      Kette möchte: Anna zieht zu Ben, Ben zu Carla, Carla in Annas Wohnung. Niemand muss das
      Gegenteil des anderen wollen, und mit jedem zusätzlichen Haushalt steigt die Zahl möglicher
      Ketten stark an.</p>
  </section>

  <section class="block">
    <h2>Wie ein Tausch praktisch abläuft</h2>
    <ol class="schritte">
      <li><b>Kette bestätigen.</b> Alle Beteiligten sagen zu. Ein Wackelkandidat reißt die ganze Kette.</li>
      <li><b>Vermieter fragen.</b> Jede Vermieterseite muss zustimmen. Genossenschaften und kommunale
        Gesellschaften sind das gewohnt, private Eigentümer meist nicht.</li>
      <li><b>Termine abstimmen.</b> Alle Umzüge sollten in dieselbe Woche fallen – sonst zahlt jemand
        doppelt Miete.</li>
      <li><b>Verträge schließen.</b> Rechtlich ist es kein Tausch, sondern für jede Wohnung ein neuer
        Mietvertrag.</li>
      <li><b>Übergaben protokollieren.</b> Zählerstände, Mängel, Schlüsselanzahl – jede Wohnung einzeln.</li>
    </ol>
  </section>

  <section class="block">
    <h2>Was das Mietrecht dazu sagt</h2>
    <p>Ein Wohnungstausch ist juristisch <b>kein Übergang des Mietvertrags</b>. Er besteht aus zwei
      Kündigungen und zwei Neuabschlüssen. Das hat drei Folgen, die viele überraschen:</p>
    <ul class="pruef">
      <li><span><b>Alte Konditionen laufen nicht mit.</b> Wer eine günstige Bestandsmiete aufgibt,
        bekommt sie nicht am neuen Ort. Der neue Vertrag wird zu heutigen Bedingungen geschlossen.</span></li>
      <li><span><b>Es gibt keinen Anspruch auf Zustimmung.</b> Die Vermieterseite kann ablehnen, ohne
        das begründen zu müssen. Fragen lohnt sich trotzdem – gerade bei Genossenschaften.</span></li>
      <li><span><b>Die üblichen Unterlagen werden verlangt.</b> Selbstauskunft, Einkommensnachweise,
        Mietschuldenfreiheit: genau wie bei jeder Neuvermietung.</span></li>
    </ul>
    <p>Praktisch heißt das: Frag früh nach der Zustimmung, nicht erst, wenn die Kette steht. Eine
      Kette, die an einer einzigen Absage zerbricht, kostet alle Beteiligten Wochen.</p>
  </section>
`,
    fragen: [
      { frage: 'Was ist ein Ringtausch bei Wohnungen?',
        antwort: 'Ein Ringtausch ist ein Wohnungstausch über mehrere Haushalte. Statt dass zwei Parteien exakt das Gegenteil voneinander wollen, reicht es, dass jede Partei die Wohnung der nächsten möchte – die letzte zieht in die Wohnung der ersten.' },
      { frage: 'Muss der Vermieter einem Wohnungstausch zustimmen?',
        antwort: 'Ja. Ein Tausch ist rechtlich kein Übergang des Mietvertrags, sondern für jede Wohnung ein neuer Vertrag. Beide Vermieterseiten müssen zustimmen; einen Anspruch darauf gibt es nicht.' },
      { frage: 'Behalte ich beim Wohnungstausch meine alte Miete?',
        antwort: 'Nein. Für jede Wohnung wird ein neuer Mietvertrag zu heutigen Bedingungen geschlossen. Eine günstige Bestandsmiete lässt sich nicht mitnehmen.' }
    ],
    tun: { text: 'Offene Tauschketten ansehen', ziel: '/#/tausch' }
  },

  {
    datei: 'mietpreisbremse-pruefen.html',
    kurz: 'Mietpreisbremse',
    titel: 'Mietpreisbremse prüfen: Ist die Miete zulässig? – TrimmoTrade',
    h1: 'Mietpreisbremse und Vergleichsmiete',
    beschreibung: 'Wann greift die Mietpreisbremse, wie viel wäre zulässig, und welche Ausnahmen gibt es? Mit der ortsüblichen Vergleichsmiete als Maßstab und dem Weg zur Rüge.',
    vorspann: 'In Gebieten mit angespanntem Wohnungsmarkt darf die Miete bei Neuvermietung höchstens 10 % über der ortsüblichen Vergleichsmiete liegen. Die Ausnahmen entscheiden über den Einzelfall.',
    stand: STAND,
    inhalt: `
  <section class="block">
    <h2>Die Regel in einem Satz</h2>
    <p>Liegt eine Wohnung in einem Gebiet mit angespanntem Wohnungsmarkt, darf die Miete bei
      Neuvermietung die ortsübliche Vergleichsmiete um <b>höchstens 10 %</b> übersteigen
      (§§ 556d ff. BGB). Welche Gebiete das sind, legen die Bundesländer per Verordnung fest –
      die Liste steht auf der Seite des jeweiligen Landesministeriums.</p>
  </section>

  <section class="block">
    <h2>Die vier Ausnahmen</h2>
    <p>Sie sind der Grund, warum die Bremse seltener greift, als viele annehmen:</p>
    <ul class="pruef">
      <li><span><b>Neubau ab Oktober 2014.</b> Wohnungen, die nach dem 1. Oktober 2014 erstmals
        genutzt und vermietet wurden, sind ausgenommen.</span></li>
      <li><span><b>Umfassende Modernisierung.</b> Wenn die Kosten etwa ein Drittel eines
        vergleichbaren Neubaus erreichen.</span></li>
      <li><span><b>Höhere Vormiete.</b> Lag die Miete des Vormieters schon über der Grenze, darf sie
        in dieser Höhe weitervereinbart werden.</span></li>
      <li><span><b>Modernisierung in den letzten drei Jahren.</b> Dann darf die zulässige Miete um
        den Modernisierungszuschlag steigen.</span></li>
    </ul>
    <p>Wichtig: Auf eine Ausnahme kann sich die Vermieterseite nur berufen, wenn sie <b>vor
      Vertragsschluss</b> unaufgefordert und in Textform darüber informiert hat. Fehlt diese
      Auskunft, gilt die Ausnahme nicht.</p>
  </section>

  <section class="block">
    <h2>Was zu viel gezahlt wurde, kann zurückverlangt werden</h2>
    <p>Wer zu viel zahlt, kann die Miete für die Zukunft auf das zulässige Maß senken und zu viel
      Gezahltes zurückfordern – rückwirkend ab dem Zeitpunkt der Rüge. Die Rüge ist formlos, sollte
      aber nachweisbar zugehen. Ein Mieterverein prüft das meist für einen kleinen Beitrag
      vollständig; das ist erfahrungsgemäß der schnellste Weg.</p>
  </section>
`,
    fragen: [
      { frage: 'Wie hoch darf die Miete bei Neuvermietung sein?',
        antwort: 'In Gebieten mit angespanntem Wohnungsmarkt höchstens 10 % über der ortsüblichen Vergleichsmiete (§§ 556d ff. BGB). Außerhalb solcher Gebiete gilt die Grenze nicht.' },
      { frage: 'Wann gilt die Mietpreisbremse nicht?',
        antwort: 'Bei Neubauten ab Oktober 2014, nach umfassender Modernisierung, bei bereits höherer Vormiete und nach Modernisierung in den letzten drei Jahren. Die Vermieterseite muss darüber vor Vertragsschluss in Textform informieren.' },
      { frage: 'Bekomme ich zu viel gezahlte Miete zurück?',
        antwort: 'Ja, ab dem Zeitpunkt der Rüge. Die Rüge ist formlos, sollte aber nachweisbar zugehen.' }
    ],
    tun: { text: 'Vergleichsmiete für ein Inserat ansehen', ziel: '/#/suche' }
  },

  {
    datei: 'nebenkostenabrechnung-pruefen.html',
    kurz: 'Nebenkosten',
    titel: 'Nebenkostenabrechnung prüfen: Fristen und unzulässige Posten – TrimmoTrade',
    h1: 'Nebenkostenabrechnung prüfen',
    beschreibung: 'Etwa jede zweite Betriebskostenabrechnung ist fehlerhaft. Welche Posten umgelegt werden dürfen, welche nie, und welche Frist über die Nachzahlung entscheidet.',
    vorspann: 'Zwei Fristen und ein abschließender Katalog – mehr braucht es meist nicht, um eine Nachforderung zu kippen.',
    stand: STAND,
    inhalt: `
  <section class="block">
    <h2>Die Frist, die alles entscheidet</h2>
    <p>Die Abrechnung muss dir <b>binnen zwölf Monaten</b> nach Ende des Abrechnungszeitraums
      zugehen (§ 556 Abs. 3 BGB). Danach ist eine Nachforderung ausgeschlossen – ein Guthaben
      bekommst du trotzdem. Maßgeblich ist der Zugang bei dir, nicht das Datum auf dem Schreiben.</p>
    <p>Umgekehrt hast du selbst zwölf Monate ab Zugang Zeit, Einwendungen zu erheben. Wer diese
      Frist verstreichen lässt, kann die Abrechnung später nicht mehr angreifen.</p>
  </section>

  <section class="block">
    <h2>Was nie umgelegt werden darf</h2>
    <p>Der Katalog der Betriebskostenverordnung ist abschließend. Nicht umlagefähig sind
      insbesondere:</p>
    <ul class="pruef">
      <li><span><b>Verwaltungskosten</b> – Hausverwaltung, Buchhaltung, Kontoführung</span></li>
      <li><span><b>Instandhaltung und Reparaturen</b> – auch Kleinreparaturen am Gebäude</span></li>
      <li><span><b>Leerstandskosten</b> – Anteile nicht vermieteter Wohnungen</span></li>
      <li><span><b>Rücklagen</b> und einmalige Anschaffungen</span></li>
    </ul>
    <p>Solche Posten sind auch dann nicht umlagefähig, wenn im Mietvertrag etwas anderes steht –
      entsprechende Klauseln sind unwirksam.</p>
  </section>

  <section class="block">
    <h2>Heizkosten: die 50-Prozent-Regel</h2>
    <p>Heizkosten müssen zu mindestens 50 % und höchstens 70 % nach Verbrauch abgerechnet werden
      (§ 7 Heizkostenverordnung). Wurde ausschließlich nach Wohnfläche verteilt, darfst du den
      Anteil um 15 % kürzen. Das ist einer der häufigsten Fehler überhaupt.</p>
  </section>
`,
    fragen: [
      { frage: 'Wie lange hat der Vermieter Zeit für die Nebenkostenabrechnung?',
        antwort: 'Zwölf Monate nach Ende des Abrechnungszeitraums. Geht die Abrechnung später zu, ist eine Nachforderung ausgeschlossen; ein Guthaben muss trotzdem ausgezahlt werden.' },
      { frage: 'Welche Nebenkosten sind nicht umlagefähig?',
        antwort: 'Verwaltungskosten, Instandhaltung und Reparaturen, Leerstandskosten und Rücklagen. Abweichende Klauseln im Mietvertrag sind unwirksam.' },
      { frage: 'Darf nach Wohnfläche statt nach Verbrauch geheizt abgerechnet werden?',
        antwort: 'Nein. Mindestens 50 % der Heizkosten müssen nach Verbrauch abgerechnet werden. Wurde nur nach Fläche verteilt, darf der Anteil um 15 % gekürzt werden.' }
    ],
    tun: { text: 'Abrechnung mit dem Rechner prüfen', ziel: '/#/nebenkosten' }
  },

  {
    datei: 'wohnberechtigungsschein.html',
    rang: '0.7',
    kurz: 'Wohnberechtigungsschein',
    titel: 'Wohnberechtigungsschein: Einkommensgrenzen und Antrag – TrimmoTrade',
    h1: 'Wohnberechtigungsschein (WBS)',
    beschreibung: 'Geförderte Wohnungen sind oft deutlich günstiger. Wer bekommt einen WBS, wie wird das maßgebliche Einkommen gerechnet, und wie läuft der Antrag?',
    vorspann: 'Die Hürde ist niedriger, als viele denken – und das maßgebliche Einkommen ist nicht dasselbe wie das, was auf der Gehaltsabrechnung steht.',
    stand: STAND,
    inhalt: `
  <section class="block">
    <h2>Wofür der Schein gebraucht wird</h2>
    <p>Geförderte Wohnungen dürfen nur an Haushalte mit Wohnberechtigungsschein vermietet werden.
      Ihre Mieten liegen oft deutlich unter dem freien Markt und steigen langsamer. Ohne Schein
      kann man sich auf solche Wohnungen nicht einmal bewerben.</p>
  </section>

  <section class="block">
    <h2>Das maßgebliche Einkommen ist niedriger als das Brutto</h2>
    <p>Gerechnet wird nicht mit dem Bruttoeinkommen, sondern mit dem <b>maßgeblichen
      Jahreseinkommen</b>. Davon gehen ab:</p>
    <ul class="pruef">
      <li><span>je 10 % für gezahlte Einkommensteuer, Kranken- und Pflegeversicherung sowie
        Rentenversicherung – wer alle drei zahlt, kommt auf 30 %</span></li>
      <li><span>Freibeträge für Kinder, Erwerbstätige und Menschen mit Schwerbehinderung</span></li>
      <li><span>Werbungskosten, mindestens die Pauschale</span></li>
    </ul>
    <p>Wer knapp über einer Grenze liegt, sollte deshalb nachrechnen statt zu schätzen. Die
      Einkommensgrenzen selbst setzt <b>das jeweilige Bundesland</b>; viele Länder liegen deutlich
      über dem Bundesrahmen aus § 9 WoFG und kennen zusätzliche Stufen.</p>
  </section>

  <section class="block">
    <h2>So läuft der Antrag</h2>
    <ol class="schritte">
      <li><b>Antrag beim Wohnungsamt</b> der Wohnsitzgemeinde, meist auch online. Kostet je nach
        Kommune nichts bis rund 25 €.</li>
      <li><b>Nachweise beilegen:</b> Einkommensnachweise der letzten zwölf Monate, Ausweis,
        Meldebescheinigung.</li>
      <li><b>Bearbeitung abwarten:</b> zwei bis acht Wochen. Früh beantragen.</li>
      <li><b>Gültigkeit beachten:</b> in der Regel ein Jahr. Läuft er während der Suche ab,
        rechtzeitig verlängern.</li>
    </ol>
  </section>
`,
    fragen: [
      { frage: 'Wer bekommt einen Wohnberechtigungsschein?',
        antwort: 'Haushalte, deren maßgebliches Jahreseinkommen unter der Grenze des jeweiligen Bundeslandes liegt. Gerechnet wird nicht mit dem Brutto, sondern nach Abzug von Pauschalen und Freibeträgen.' },
      { frage: 'Was kostet ein Wohnberechtigungsschein?',
        antwort: 'Je nach Kommune nichts bis etwa 25 Euro. Beantragt wird er beim Wohnungsamt der Wohnsitzgemeinde.' },
      { frage: 'Wie lange gilt ein WBS?',
        antwort: 'In der Regel ein Jahr ab Ausstellung.' }
    ],
    tun: { text: 'Eigenen Anspruch durchrechnen', ziel: '/#/wbs' }
  },

  {
    datei: 'wohnung-verkaufen-vorbereiten.html',
    kurz: 'Verkauf vorbereiten',
    titel: 'Wohnung oder Haus verkaufen: Vorbereitung, Unterlagen, Wertsteigerung – TrimmoTrade',
    h1: 'Verkauf vorbereiten',
    beschreibung: 'Welche Unterlagen vor dem Verkauf beschafft sein müssen, welche Nebenkosten anfallen, und welche Arbeiten am Gebäude sich im Preis wirklich niederschlagen.',
    vorspann: 'Der Preis entsteht nicht beim Notar, sondern in den Wochen davor. Zwei Dinge entscheiden: vollständige Unterlagen und der erste Eindruck von außen.',
    stand: STAND,
    inhalt: `
  <section class="block">
    <h2>Unterlagen, die vollständig vorliegen müssen</h2>
    <p>Fehlende Unterlagen sind der häufigste Grund, warum sich ein Verkauf um Monate verzögert.
      Vor dem ersten Inserat sollten beschafft sein:</p>
    <ul class="pruef">
      <li><span><b>Energieausweis.</b> Pflicht schon im Inserat: Art des Ausweises, Energiekennwert,
        Energieträger, Baujahr und Effizienzklasse müssen genannt werden (§ 87 GEG). Wer das
        weglässt, riskiert ein Bußgeld.</span></li>
      <li><span><b>Grundbuchauszug</b>, nicht älter als drei Monate</span></li>
      <li><span><b>Flurkarte und Baupläne</b>, bei Eigentumswohnungen zusätzlich Teilungserklärung,
        Protokolle der Eigentümerversammlungen der letzten drei Jahre und die aktuelle
        Hausgeldabrechnung</span></li>
      <li><span><b>Nachweise über Modernisierungen</b> – sie rechtfertigen den Preis</span></li>
    </ul>
  </section>

  <section class="block">
    <h2>Was der erste Eindruck wert ist</h2>
    <p>Kaufinteressenten entscheiden früher, als ihnen bewusst ist. Der Weg vom Auto zur Haustür
      prägt die Erwartung an alles, was danach kommt – ein gepflegter Eingang lässt eine ältere
      Küche verzeihlich wirken, eine verschmierte Fassade macht aus einer sanierten Wohnung ein
      „Problemobjekt“. Das schlägt sich messbar im Angebotspreis nieder und noch stärker in der
      Verhandlungsposition.</p>

    <div class="block block--info">
      <h3>Graffiti an der Fassade vor dem Verkauf entfernen</h3>
      <p>Eine besprühte Fassade kostet doppelt: Sie drückt den Preis, und sie signalisiert
        Vernachlässigung, die Käufer auf das ganze Objekt übertragen. Entfernen lohnt sich deshalb
        fast immer vor dem ersten Besichtigungstermin – und vor den Fotos für das Inserat.</p>
      <p>Wichtig ist das Verfahren: Sandstrahlen und aggressive Chemie greifen Putz, Klinker und
        Naturstein an und hinterlassen oft einen sichtbaren Schatten, der schlimmer aussieht als das
        Graffito. <b>Laserreinigung</b> arbeitet chemiefrei und materialschonend und ist auch bei
        denkmalgeschützten Fassaden zulässig.</p>
      <p class="werkzeug__weiter">
        <a class="knopf" href="https://www.cleangreennature.de" target="_blank" rel="noopener">
          Laser-Graffitientfernung bei Clean Green Nature</a></p>
      <p class="fein">Clean Green Nature ist ein eigenständiges Unternehmen desselben Inhabers.
        Für TrimmoTrade entsteht daraus kein Vermittlungsentgelt.</p>
    </div>
  </section>

  <section class="block">
    <h2>Nebenkosten und Provision beim Verkauf</h2>
    <p>Seit dem 23. Dezember 2020 gilt bei Wohnungen und Einfamilienhäusern an Verbraucher: Die
      Maklerprovision wird geteilt, und die Käuferseite zahlt höchstens so viel wie die
      Verkäuferseite (§§ 656c, 656d BGB). Für Grundstücke und Mehrfamilienhäuser gilt das nicht.</p>
    <p>Auf der Käuferseite kommen zum Kaufpreis die Grunderwerbsteuer des jeweiligen Bundeslandes
      (3,5 bis 6,5 %), Notar und Grundbuch (zusammen etwa 1,5 bis 2 %) sowie die Provision hinzu.
      Wer das im Inserat transparent macht, spart sich Rückfragen und Absprünge.</p>
    <p>Und die Spekulationsfrist nicht vergessen: Wer eine vermietete Immobilie innerhalb von zehn
      Jahren nach dem Kauf wieder verkauft, versteuert den Gewinn. Bei selbst bewohnten Objekten
      entfällt das unter bestimmten Voraussetzungen.</p>
  </section>
`,
    fragen: [
      { frage: 'Welche Unterlagen brauche ich für den Verkauf einer Wohnung?',
        antwort: 'Energieausweis, Grundbuchauszug, Flurkarte und Baupläne, bei Eigentumswohnungen zusätzlich Teilungserklärung, Protokolle der Eigentümerversammlungen der letzten drei Jahre und die aktuelle Hausgeldabrechnung sowie Nachweise über Modernisierungen.' },
      { frage: 'Lohnt es sich, Graffiti vor dem Verkauf zu entfernen?',
        antwort: 'In der Regel ja. Eine besprühte Fassade drückt den Angebotspreis und signalisiert Vernachlässigung, die Kaufinteressenten auf das ganze Objekt übertragen. Materialschonend geht das mit Laserreinigung, die auch bei denkmalgeschützten Fassaden zulässig ist.' },
      { frage: 'Wer zahlt die Maklerprovision beim Immobilienverkauf?',
        antwort: 'Bei Wohnungen und Einfamilienhäusern an Verbraucher wird die Provision seit dem 23. Dezember 2020 geteilt; die Käuferseite zahlt höchstens so viel wie die Verkäuferseite (§§ 656c, 656d BGB). Für Grundstücke und Mehrfamilienhäuser gilt das nicht.' }
    ],
    tun: { text: 'Objekt bei TrimmoTrade inserieren', ziel: '/#/inserieren?art=kauf-wohnung' }
  }
];

/* ------------------------- Bauen ------------------------- */

let gebaut = 0;
SEITEN.forEach((seite) => {
  const tun = seite.tun ? `
  <p class="werkzeug__weiter"><a class="knopf" href="${seite.tun.ziel}">${esc(seite.tun.text)}</a></p>
` : '';

  const fragen = seite.fragen && seite.fragen.length ? `
  <section class="block">
    <h2>Häufige Fragen</h2>
    ${seite.fragen.map((f) => `<details class="anfragen__warum">
      <summary><b>${esc(f.frage)}</b></summary>
      <p>${f.antwort}</p>
    </details>`).join('\n    ')}
  </section>
` : '';

  const html = kopf(seite) + seite.inhalt + tun + fragen + fuss(seite);
  fs.writeFileSync(path.join(WURZEL, seite.datei), html);
  gebaut++;
  console.log(seite.datei.padEnd(40) + Math.round(html.length / 1024) + ' kB');
});

/* 404 im selben Gewand – eine nackte Apache-Fehlerseite wirkt wie ein
   abgeschalteter Dienst. */
const vierNullVier = kopf({
  datei: '404.html', kurz: 'Nicht gefunden', stand: STAND,
  titel: 'Seite nicht gefunden – TrimmoTrade',
  h1: 'Diese Seite gibt es nicht',
  beschreibung: 'Die angeforderte Seite wurde nicht gefunden.',
  vorspann: 'Vielleicht ist der Verweis alt, oder es hat sich ein Tippfehler eingeschlichen.'
}).replace('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">',
  '<meta name="robots" content="noindex, follow">')
  + `
  <section class="block">
    <h2>Weiter geht es hier</h2>
    <p class="werkzeug__weiter">
      <a class="knopf" href="/#/suche">Zur Wohnungssuche</a>
      <a class="knopf knopf--still" href="/">Zur Startseite</a></p>
  </section>
` + fuss({ datei: '404.html', stand: STAND });
fs.writeFileSync(path.join(WURZEL, '404.html'), vierNullVier);
console.log('404.html'.padEnd(40) + Math.round(vierNullVier.length / 1024) + ' kB');

console.log('\n' + gebaut + ' Ratgeberseiten und eine Fehlerseite gebaut.');

/* ---------------------------------------------------------------------
   sitemap.xml

   Sie entsteht hier mit, damit sie nicht von der Seitenliste abweichen
   kann. Eine Sitemap, die eine gelöschte Seite nennt oder eine neue
   auslässt, ist schlimmer als keine: Suchmaschinen halten sie für die
   Auskunft des Betreibers und richten sich danach.
   --------------------------------------------------------------------- */

const eintraege = [
  { loc: BASIS + '/', wechsel: 'daily', rang: '1.0', stand: STAND },
  ...SEITEN.map((s) => ({
    loc: BASIS + '/' + s.datei,
    wechsel: 'monthly',
    rang: s.rang || '0.8',
    stand: s.stand || STAND
  }))
];

const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + eintraege.map((e) => '  <url>\n'
      + '    <loc>' + e.loc + '</loc>\n'
      + '    <lastmod>' + e.stand + '</lastmod>\n'
      + '    <changefreq>' + e.wechsel + '</changefreq>\n'
      + '    <priority>' + e.rang + '</priority>\n'
      + '  </url>').join('\n')
  + '\n</urlset>\n';

fs.writeFileSync(path.join(WURZEL, 'sitemap.xml'), sitemap);
console.log('sitemap.xml'.padEnd(40) + eintraege.length + ' Adressen');
