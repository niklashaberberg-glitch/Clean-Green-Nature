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
    beschreibung: 'Der direkte Wohnungstausch scheitert am doppelten Zufall. Ein Ringtausch über drei oder vier Haushalte funktioniert – so läuft er ab, das sagt das Mietrecht.',
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
    titel: 'Nebenkostenabrechnung prüfen: Fristen und Posten – TrimmoTrade',
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
    titel: 'Wohnung verkaufen: Unterlagen und Wertsteigerung – TrimmoTrade',
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
  },

  /* -------------------------------------------------------------------
     Die anbietende Seite

     Ein Wohnungsportal hat ein Henne-Ei-Problem, und es ist nicht
     symmetrisch: Suchende kommen von allein, sobald es Wohnungen gibt.
     Wohnungen kommen nicht von allein. Wer vermietet, geht dahin, wo
     schon Suchende sind – und das ist am Anfang nirgends hier.

     Der einzige Ausweg, der ohne Werbebudget funktioniert, ist eine
     Seite, die jemand findet, der gerade wirklich vermieten will, und
     die ihm dabei so weit hilft, dass das Inserieren am Ende nur noch
     der letzte Schritt ist. Deshalb steht auf dieser Seite alles, was
     ein privater Vermieter falsch machen kann – und erst am Schluss
     der Verweis auf das Formular.
     ------------------------------------------------------------------- */
  {
    datei: 'wohnung-vermieten.html',
    rang: '0.9',
    kurz: 'Wohnung vermieten',
    titel: 'Wohnung vermieten: kostenlos inserieren – TrimmoTrade',
    h1: 'Wohnung vermieten',
    beschreibung: 'Pflichtangaben im Inserat, zulässige Fragen an Bewerber, Kaution, Mietpreisbremse und Übergabe – und ein kostenloses Inserat bei TrimmoTrade.',
    vorspann: 'Vermieten ist einfacher, als es aussieht – bis auf fünf Stellen, an denen es teuer wird. Die stehen hier, in der Reihenfolge, in der sie auf Sie zukommen.',
    stand: STAND,
    inhalt: `
  <section class="block">
    <h2>1. Was ins Inserat gehört – und zwar von Gesetzes wegen</h2>
    <p>§ 87 des Gebäudeenergiegesetzes verlangt in <b>jeder</b> Immobilienanzeige fünf Angaben,
      sobald ein Energieausweis vorliegt:</p>
    <ul class="pruef">
      <li><span><b>Art des Energieausweises</b> – Bedarfs- oder Verbrauchsausweis.</span></li>
      <li><span><b>Der Energiekennwert</b> in Kilowattstunden je Quadratmeter und Jahr.</span></li>
      <li><span><b>Der wesentliche Energieträger</b> der Heizung – Gas, Fernwärme, Wärmepumpe.</span></li>
      <li><span><b>Das Baujahr</b> des Gebäudes.</span></li>
      <li><span><b>Die Energieeffizienzklasse</b> von A+ bis H.</span></li>
    </ul>
    <p>Wer sie weglässt, begeht eine Ordnungswidrigkeit; der Bußgeldrahmen reicht bis 10.000 Euro
      (§ 108 GEG). In der Praxis wird das selten verfolgt – abgemahnt wird dafür regelmäßig,
      und zwar von Mitbewerbern und Verbänden nach dem Gesetz gegen den unlauteren Wettbewerb.</p>
    <p>Beim Formular von TrimmoTrade sind diese Felder Teil des normalen Ablaufs. Die
      Effizienzklasse wird aus dem Kennwert nach Anlage 10 GEG berechnet, damit sie nicht
      geschätzt wird.</p>
  </section>

  <section class="block">
    <h2>2. Die Mietpreisbremse betrifft auch Sie</h2>
    <p>In Gebieten mit angespanntem Wohnungsmarkt darf die neue Miete höchstens zehn Prozent über
      der ortsüblichen Vergleichsmiete liegen (§ 556d BGB). Es gibt Ausnahmen – Neubauten ab
      Oktober 2014, umfassend modernisierte Wohnungen, und die Vormiete, wenn sie schon höher
      war (§§ 556e, 556f BGB).</p>
    <p>Entscheidend ist eine Pflicht, die viele übersehen: Wer sich auf eine dieser Ausnahmen
      berufen will, <b>muss unaufgefordert und vor Abgabe der Vertragserklärung</b> darüber
      Auskunft geben (§ 556g Abs. 1a BGB). Wer das versäumt, kann sich auf die Ausnahme später
      nicht mehr berufen – und muss die zu viel gezahlte Miete zurückzahlen.</p>
    <p class="werkzeug__weiter"><a class="knopf knopf--still" href="/mietpreisbremse-pruefen.html">Wie die Vergleichsmiete ermittelt wird</a></p>
  </section>

  <section class="block">
    <h2>3. Was Sie Bewerbern nicht fragen dürfen</h2>
    <p>Eine Mieterselbstauskunft ist zulässig – aber nicht in jedem Punkt. Unzulässige Fragen
      dürfen falsch beantwortet werden, ohne dass daraus je ein Kündigungsgrund wird. Zulässig
      sind Angaben, die für die Vertragsabwicklung zählen; unzulässig ist alles, was in die
      persönliche Lebensführung greift.</p>
    <div class="spalten2">
      <div>
        <h3>Zulässig</h3>
        <ul class="pruef">
          <li><span>Name, Anschrift, Zahl der einziehenden Personen</span></li>
          <li><span>Beruf und Arbeitgeber</span></li>
          <li><span>Einkommen der Höhe nach</span></li>
          <li><span>Bestehende Mietschulden</span></li>
          <li><span>Haustiere, soweit zustimmungsbedürftig</span></li>
          <li><span>Bonitätsauskunft – sinnvollerweise erst in der engeren Auswahl</span></li>
        </ul>
      </div>
      <div>
        <h3>Unzulässig</h3>
        <ul class="pruef">
          <li><span>Schwangerschaft und Kinderwunsch</span></li>
          <li><span>Religion, Weltanschauung, Parteizugehörigkeit</span></li>
          <li><span>Herkunft und Staatsangehörigkeit</span></li>
          <li><span>Gesundheit, Behinderung, sexuelle Orientierung</span></li>
          <li><span>Vorstrafen ohne Bezug zum Mietverhältnis</span></li>
          <li><span>Heiratsabsichten und Familienplanung</span></li>
        </ul>
      </div>
    </div>
    <p>Der Hintergrund ist nicht nur Höflichkeit: Nach § 19 des Allgemeinen
      Gleichbehandlungsgesetzes ist eine Benachteiligung wegen Herkunft, Geschlecht, Religion,
      Behinderung, Alter oder sexueller Identität bei der Vermietung unzulässig, sobald es sich
      um Massengeschäfte handelt. Wer mehr als 50 Wohnungen vermietet, ist immer erfasst; darunter
      kommt es auf den Einzelfall an. Schadensersatzansprüche daraus sind kein theoretisches
      Risiko.</p>
    <p>TrimmoTrade fragt in einer Anfrage deshalb nur nach Haushaltsgröße, Einzugstermin,
      Beschäftigung und Einkommensspanne – und schickt nichts davon ohne ausdrückliche Freigabe
      der anfragenden Person mit.</p>
  </section>

  <section class="block">
    <h2>4. Kaution, Provision, Nebenkosten</h2>
    <ul class="pruef">
      <li><span><b>Kaution: höchstens drei Nettokaltmieten</b> (§ 551 Abs. 1 BGB). Die Mieterseite
        darf in drei gleichen Monatsraten zahlen; die erste ist zu Mietbeginn fällig. Eine Klausel,
        die alles vorab verlangt, ist unwirksam.</span></li>
      <li><span><b>Getrennt anlegen.</b> Die Kaution ist insolvenzfest vom eigenen Vermögen getrennt
        anzulegen und zu verzinsen (§ 551 Abs. 3 BGB).</span></li>
      <li><span><b>Maklerprovision zahlt, wer bestellt.</b> Seit dem Bestellerprinzip
        (§ 2 Abs. 1a Wohnungsvermittlungsgesetz) darf die Mieterseite nur zahlen, wenn sie den
        Makler selbst beauftragt hat. Bei TrimmoTrade fällt keine Provision an.</span></li>
      <li><span><b>Nebenkosten müssen vereinbart sein.</b> Ohne ausdrückliche Vereinbarung im
        Vertrag ist die Miete eine Inklusivmiete – umlegen lässt sich dann nichts (§ 556 BGB).</span></li>
    </ul>
  </section>

  <section class="block">
    <h2>5. Übergabe und Steuer</h2>
    <p>Bei der Übergabe entscheidet sich, wer später die Renovierung zahlt. Ein Protokoll mit
      Zählerständen, Schlüsselzahl und jedem Mangel – von beiden Seiten unterschrieben – ist das
      einzige Beweismittel, das im Streitfall zählt. Wichtig ist auch die Ausgangslage: Wer eine
      unrenovierte Wohnung übergibt, kann die Renovierung beim Auszug nicht verlangen; eine
      Klausel, die das doch tut, ist nach ständiger Rechtsprechung unwirksam.</p>
    <p>Steuerlich sind Mieteinnahmen Einkünfte aus Vermietung und Verpachtung (§ 21 EStG) und
      gehören in die Anlage V. Absetzbar sind unter anderem Abschreibung, Zinsen, Verwaltung,
      Instandhaltung und Fahrtkosten. Die Umsatzsteuer bleibt außen vor: Die Vermietung zu
      Wohnzwecken ist nach § 4 Nr. 12 UStG steuerfrei.</p>
    <p class="werkzeug__weiter"><a class="knopf knopf--still" href="/#/uebergabe">Übergabeprotokoll ausfüllen</a></p>
  </section>

  <section class="block">
    <h2>Warum bei TrimmoTrade inserieren?</h2>
    <ul class="pruef">
      <li><span><b>Kostenlos, ohne Laufzeit.</b> Ein Inserat kostet nichts. Bezahlt wird nur, wer
        zusätzlich hervorgehoben werden will – und das steht dann sichtbar dran.</span></li>
      <li><span><b>Anfragen mit Eckdaten.</b> Haushaltsgröße, Einzugstermin, Beschäftigung und
        Einkommensspanne stehen in der Anfrage. Das spart die erste Rückfragerunde.</span></li>
      <li><span><b>Ihre Adresse bleibt bei Ihnen.</b> Weder Ihre E-Mail-Adresse noch Ihre
        Telefonnummer stehen im Inserat oder in einer Mail an Suchende.</span></li>
      <li><span><b>Kein Karteileichen-Problem.</b> Nach 60 Tagen fragen wir nach, ob das Angebot
        noch steht. Was niemand bestätigt, verschwindet – auch Ihres.</span></li>
      <li><span><b>Betrugsprüfung.</b> Jedes Inserat wird auf die üblichen Muster geprüft. Das
        schützt auch Sie: Betrugsanzeigen mit gestohlenen Fotos laufen häufig auf Ihre Wohnung.</span></li>
    </ul>
  </section>
`,
    fragen: [
      { frage: 'Was kostet es, eine Wohnung bei TrimmoTrade zu inserieren?',
        antwort: 'Nichts. Ein Inserat ist kostenlos und ohne Laufzeit. Kostenpflichtig ist nur die freiwillige Hervorhebung, die als bezahlte Platzierung gekennzeichnet wird und die Reihenfolge der übrigen Treffer nicht verändert.' },
      { frage: 'Brauche ich einen Energieausweis, um zu inserieren?',
        antwort: 'Für die Vermietung ja: Nach § 80 GEG ist er spätestens bei der Besichtigung unaufgefordert vorzulegen. Liegt er vor, müssen die Kennwerte schon in der Anzeige stehen (§ 87 GEG). Ausgenommen sind unter anderem kleine Gebäude unter 50 Quadratmetern und Baudenkmäler.' },
      { frage: 'Darf ich Bewerber nach der Schufa fragen?',
        antwort: 'Ja, aber sinnvollerweise erst in der engeren Auswahl. Eine Bonitätsauskunft von allen Interessenten gleich zu Beginn einzusammeln ist datenschutzrechtlich kaum zu rechtfertigen – gebraucht wird sie nur für die Person, mit der Sie tatsächlich abschließen wollen.' },
      { frage: 'Wie viel Kaution darf ich verlangen?',
        antwort: 'Höchstens drei Nettokaltmieten, also ohne Nebenkosten (§ 551 Abs. 1 BGB). Die Mieterseite darf in drei Monatsraten zahlen. Angelegt werden muss die Kaution getrennt vom eigenen Vermögen und verzinst.' },
      { frage: 'Muss ich Interessenten sagen, warum die Miete über der Vergleichsmiete liegt?',
        antwort: 'Ja, wenn Sie sich auf eine Ausnahme von der Mietpreisbremse berufen wollen. Die Auskunft muss unaufgefordert und vor Abgabe der Vertragserklärung erfolgen (§ 556g Abs. 1a BGB). Wird sie nachgeholt, gilt sie erst zwei Jahre später.' }
    ],
    tun: { text: 'Wohnung kostenlos inserieren', ziel: '/#/inserieren' }
  },

  /* -------------------------------------------------------------------
     Nachmieter

     Die wertvollste Seite dieses Portals, und zwar aus einem Grund, der
     mit Suchmaschinen nichts zu tun hat: Wer einen Nachmieter sucht, ist
     beide Seiten des Marktes zugleich. Er hat eine Wohnung abzugeben und
     braucht eine neue. Ein Nutzer, ein Inserat, eine Suche – genau das,
     woran ein Marktplatz am Anfang scheitert.
     ------------------------------------------------------------------- */
  {
    datei: 'nachmieter-finden.html',
    rang: '0.9',
    kurz: 'Nachmieter finden',
    titel: 'Nachmieter finden: Rechte, Fristen, Ablöse – TrimmoTrade',
    h1: 'Nachmieter finden',
    beschreibung: 'Wann Sie mit einem Nachmieter früher aus dem Vertrag kommen, was eine Ablöse kosten darf und wie Sie gleichzeitig etwas Neues finden.',
    vorspann: 'Der häufigste Irrtum zuerst: Einen Nachmieter zu stellen, verkürzt die Kündigungsfrist nicht automatisch. Es gibt aber drei Fälle, in denen es funktioniert.',
    stand: STAND,
    inhalt: `
  <section class="block">
    <h2>Der Grundsatz: kein Anspruch</h2>
    <p>Ein Mietverhältnis endet mit der Kündigungsfrist, nicht mit dem Fund eines Nachfolgers.
      Die ordentliche Kündigung durch die Mieterseite beträgt drei Monate und muss spätestens am
      dritten Werktag eines Monats zugehen, damit dieser Monat mitzählt (§ 573c Abs. 1 BGB).
      Einen allgemeinen Anspruch darauf, jemanden zu stellen und früher zu gehen, kennt das
      Gesetz nicht.</p>
    <p>Wer trotzdem früher aus dem Vertrag will, hat drei Ansatzpunkte:</p>
  </section>

  <section class="block">
    <h2>Fall 1: Der Vertrag erlaubt es</h2>
    <p>Manche Mietverträge enthalten eine <b>Nachmieterklausel</b>: Wer einen zumutbaren
      Nachfolger stellt, kommt vorzeitig heraus. Ein Blick in den eigenen Vertrag lohnt sich –
      besonders bei Genossenschaften und kommunalen Wohnungsgesellschaften ist die Klausel
      verbreitet. Steht sie drin, gilt sie; die Vermieterseite darf einen Vorschlag dann nur aus
      sachlichen Gründen ablehnen, etwa wegen erkennbar fehlender Zahlungsfähigkeit.</p>
  </section>

  <section class="block">
    <h2>Fall 2: Sie kommen sonst gar nicht heraus</h2>
    <p>Bei einem befristeten Mietvertrag (§ 575 BGB) oder einem wirksam vereinbarten
      Kündigungsverzicht ist die ordentliche Kündigung ausgeschlossen. Genau dann kann sich aus
      Treu und Glauben (§ 242 BGB) ein Anspruch auf Entlassung ergeben – wenn ein
      <b>berechtigtes Interesse</b> vorliegt und ein zumutbarer Nachmieter bereitsteht.</p>
    <p>Als berechtigtes Interesse anerkannt sind unter anderem ein berufsbedingter Umzug in eine
      andere Stadt, eine schwere Erkrankung, Pflegebedürftigkeit, deutlich veränderte
      Familienverhältnisse oder der Einzug in ein Pflegeheim. Nicht ausreichend ist der Wunsch
      nach einer schöneren Wohnung am selben Ort.</p>
    <p>„Zumutbar“ heißt: solvent, bereit, in den bestehenden Vertrag zu denselben Bedingungen
      einzutreten, und ohne Anhaltspunkte gegen die Person. Üblich ist, gleich mehrere Vorschläge
      zu machen – die häufig genannte Zahl von drei steht in keinem Gesetz, hat sich aber als
      Maßstab dafür durchgesetzt, dass es ernst gemeint ist.</p>
  </section>

  <section class="block">
    <h2>Fall 3: Alle sind einverstanden</h2>
    <p>Der einfachste und mit Abstand häufigste Weg: ein <b>Aufhebungsvertrag</b>. Vermieterseite,
      bisherige und künftige Mietseite einigen sich schriftlich auf einen Übergabetermin. Das
      braucht keinen Rechtsgrund, nur drei Unterschriften – und es ist für die Vermieterseite oft
      attraktiv, weil sie sich Leerstand und Inserat spart.</p>
    <p>Wichtig: Der neue Vertrag ist ein <b>neuer</b> Vertrag. Ihre alte, womöglich günstige Miete
      geht nicht auf den Nachfolger über, und Ihre Kaution kommt nicht von ihm, sondern von der
      Vermieterseite zurück – nach Abrechnung, üblicherweise innerhalb von drei bis sechs Monaten.</p>
  </section>

  <section class="block">
    <h2>Was eine Ablöse kosten darf</h2>
    <p>Einbauküche, Einbauschränke, Markise: Was Sie hinterlassen, dürfen Sie dem Nachfolger
      verkaufen. Zwei Grenzen gelten dabei.</p>
    <ul class="pruef">
      <li><span><b>Kein Kopplungsgeschäft.</b> Der Mietvertrag darf nicht davon abhängen, dass die
        Ablöse gezahlt wird. Eine solche Abrede ist nach § 4a Abs. 1 des
        Wohnungsvermittlungsgesetzes unwirksam.</span></li>
      <li><span><b>Kein Missverhältnis.</b> Übersteigt die Ablöse den Zeitwert der Sache
        auffällig – die Rechtsprechung zieht die Linie bei etwa 50 Prozent darüber –, kann der
        übersteigende Teil zurückverlangt werden (§ 4a Abs. 2 WoVermRG).</span></li>
    </ul>
    <p>Rechnen Sie den Zeitwert ehrlich: Eine Küche verliert je nach Qualität rund zehn Prozent
      pro Jahr. Eine acht Jahre alte Küche für 8.000 Euro ist heute etwa 3.000 Euro wert, nicht
      6.000.</p>
  </section>

  <section class="block">
    <h2>Der Teil, den fast alle vergessen</h2>
    <p>Wer einen Nachmieter sucht, sucht in aller Regel selbst eine Wohnung. Das ist die
      unangenehmste Konstellation der Wohnungssuche: Zwei Termine müssen zusammenpassen, und
      wer zuerst zusagt, trägt das Risiko doppelter Miete.</p>
    <p>Bei TrimmoTrade lässt sich beides in einem Konto führen: Ihr Inserat für die abzugebende
      Wohnung und Ihre eigene Suche, samt Suchauftrag per Mail. Wenn Sie ohnehin gehen wollen,
      lohnt zusätzlich ein Blick auf den <a href="/wohnungstausch.html">Ringtausch</a> – dort
      finden sich Ketten aus mehreren Haushalten, in denen die Termine gemeinsam gelegt werden.</p>
  </section>
`,
    fragen: [
      { frage: 'Muss der Vermieter meinen Nachmieter akzeptieren?',
        antwort: 'Nur wenn der Mietvertrag es vorsieht oder ein berechtigtes Interesse an vorzeitiger Entlassung vorliegt und der Vorschlag zumutbar ist. Ohne diese Voraussetzungen gilt die ordentliche Kündigungsfrist von drei Monaten nach § 573c Abs. 1 BGB.' },
      { frage: 'Wie viele Nachmieter muss ich vorschlagen?',
        antwort: 'Eine gesetzliche Zahl gibt es nicht. In der Praxis hat sich eingebürgert, drei zumutbare Interessenten zu benennen – das gilt als Beleg dafür, dass der Vorschlag ernsthaft ist und die Vermieterseite die Wahl hat.' },
      { frage: 'Was ist eine zumutbare Nachmieterin?',
        antwort: 'Jemand, der zahlungsfähig ist, den bestehenden Vertrag zu unveränderten Bedingungen übernimmt und gegen den keine sachlichen Bedenken sprechen. Ablehnen darf die Vermieterseite aus sachlichen Gründen, nicht aus Willkür und nicht aus Gründen, die das AGG untersagt.' },
      { frage: 'Darf ich für die Einbauküche Geld verlangen?',
        antwort: 'Ja, aber die Zahlung darf nicht Bedingung für den Mietvertrag sein, und der Preis darf den Zeitwert nicht auffällig übersteigen. Als Richtwert gilt eine Grenze von rund 50 Prozent über dem Zeitwert (§ 4a Wohnungsvermittlungsgesetz).' },
      { frage: 'Wann bekomme ich meine Kaution zurück?',
        antwort: 'Von der Vermieterseite, nicht vom Nachmieter. Sie darf die Abrechnung abwarten – bei laufenden Nebenkosten in der Regel drei bis sechs Monate. Ein Einbehalt darüber hinaus ist nur für konkret bezifferte Ansprüche zulässig.' }
    ],
    tun: { text: 'Wohnung inserieren und gleichzeitig suchen', ziel: '/#/inserieren' }
  },

  /* -------------------------------------------------------------------
     WG gründen

     Der Suchbegriff, hinter dem eine Not steht, für die es kein Angebot
     gibt: Wer allein die Miete nicht aufbringt, findet Portale voller
     Zimmer in bestehenden WGs – aber nichts, das ihm hilft, mit zwei
     Fremden zusammen eine ganze Wohnung zu nehmen.

     Diese Seite beantwortet zuerst die Rechtsfragen, die dabei über sehr
     viel Geld entscheiden, und führt danach dorthin, wo es geht.
     ------------------------------------------------------------------- */
  {
    datei: 'wg-gruenden.html',
    rang: '0.9',
    kurz: 'WG gründen',
    titel: 'WG gründen: zu mehreren eine Wohnung mieten – TrimmoTrade',
    h1: 'Eine WG gründen',
    beschreibung: 'Gemeinsamer Vertrag oder Einzelverträge, Haftung, Kaution und Auszug – und wie sich drei Fremde finden, die zusammen eine Wohnung nehmen.',
    vorspann: 'Eine Vier-Zimmer-Wohnung für 1.600 Euro warm ist für eine Person zu groß und für viele Familien zu teuer. Für drei Leute sind es 533 Euro. Das Problem ist nicht das Geld, sondern das Finden.',
    stand: STAND,
    inhalt: `
  <section class="block">
    <h2>Warum das fast nie passiert – obwohl es allen helfen würde</h2>
    <p>Wer allein sucht, braucht gleichzeitig zwei Dinge, die voneinander abhängen: die Wohnung und
      die Mitbewohner. Ohne Mitbewohner kann er nicht zusagen; ohne Zusage gibt es nichts, worauf
      sich Mitbewohner einigen könnten. Solange beides voneinander abhängt, passiert nichts – und
      die Wohnung steht weiter leer.</p>
    <p>Das ist derselbe doppelte Zufall, an dem auch der <a href="/wohnungstausch.html">direkte
      Wohnungstausch</a> scheitert. Und er löst sich auf dieselbe Weise: indem sichtbar wird, wer
      sucht. Eine Person eröffnet eine Gruppe zu einer konkreten Wohnung, andere sehen sie und
      stellen sich vor, und wenn die Gruppe vollzählig ist, bewirbt sie sich gemeinsam.</p>
    <p>Für die Vermieterseite ist das der entscheidende Unterschied: <b>Drei einzelne Anfragen sind
      drei Leute, die die Wohnung allein nicht bezahlen können. Eine gemeinsame Bewerbung ist ein
      vollständiger Haushalt.</b></p>
  </section>

  <section class="block">
    <h2>Ein Vertrag oder mehrere? Die wichtigste Entscheidung</h2>
    <div class="spalten2">
      <div>
        <h3>Ein gemeinsamer Vertrag</h3>
        <p>Alle stehen zusammen im Vertrag. Die übliche Form, und die, die Vermietende fast immer
          bevorzugen.</p>
        <ul class="pruef">
          <li><span><b>Ihr haftet als Gesamtschuldner</b> (§ 421 BGB). Zahlt eine Person nicht, kann
            die Vermieterseite die volle Miete von jeder Einzelnen verlangen. Untereinander gibt es
            einen Ausgleichsanspruch (§ 426 BGB) – das ist aber ein Prozess gegen die eigene
            Mitbewohnerin.</span></li>
          <li><span><b>Ein Auszug allein ist keine Kündigung.</b> Gekündigt wird nur gemeinsam. Wer
            einzeln gehen will, braucht eine Vertragsänderung und damit das Ja aller Mitmietenden
            <em>und</em> der Vermieterseite. Das überrascht fast alle.</span></li>
        </ul>
      </div>
      <div>
        <h3>Ein Vertrag je Zimmer</h3>
        <p>Jede Person hat einen eigenen Vertrag über ihr Zimmer und ein Mitbenutzungsrecht an
          Küche und Bad.</p>
        <ul class="pruef">
          <li><span><b>Keine Haftung für die anderen.</b> Wer nicht zahlt, ist allein das Problem der
            Vermieterseite.</span></li>
          <li><span><b>Jede Person kündigt für sich</b>, ohne die anderen zu fragen.</span></li>
          <li><span><b>Deutlich seltener.</b> Für die Vermieterseite bedeutet es mehr Verwaltung, und
            wer nachrückt, sucht sie sich dann selbst aus.</span></li>
        </ul>
      </div>
    </div>
    <p>Eine dritte Form ist die <b>Untermiete</b>: Eine Person ist Hauptmieterin, die anderen sind
      ihre Untermieter. Dann trägt sie das ganze Risiko allein – und sie braucht die Erlaubnis der
      Vermieterseite. Auf die hat sie einen Anspruch, wenn ihr berechtigtes Interesse erst nach
      Vertragsschluss entstanden ist (§ 553 Abs. 1 BGB); wer von vornherein untervermieten will,
      klärt das besser vorher.</p>
  </section>

  <section class="block">
    <h2>Vier Dinge, die fast alle falsch machen</h2>
    <ul class="pruef">
      <li><span><b>Die Kaution gilt für die Wohnung, nicht je Person.</b> Höchstens drei
        Nettokaltmieten insgesamt (§ 551 Abs. 1 BGB). Wer von jedem Mitglied drei Monatsmieten
        verlangt, verlangt das Doppelte oder Dreifache des Erlaubten. Gezahlt werden darf außerdem in
        drei gleichen Raten – die erste zu Mietbeginn.</span></li>
      <li><span><b>Jede Person muss sich anmelden</b>, innerhalb von zwei Wochen nach dem Einzug. Die
        Vermieterseite ist verpflichtet, dafür eine Wohnungsgeberbestätigung auszustellen
        (§ 19 BMG) – auch für Untermieter.</span></li>
      <li><span><b>Der Rundfunkbeitrag fällt einmal je Wohnung an</b>, nicht je Person. Eine WG zahlt
        zusammen einen Beitrag. Klärt beim Einzug, wer ihn anmeldet und wie ihr teilt – sonst zahlen
        drei Leute drei Beiträge, und zurückholen ist mühsam.</span></li>
      <li><span><b>Die Miete darf die Mietpreisbremse nicht überschreiten</b>, nur weil ihr zu dritt
        seid. Maßstab ist die Wohnung, nicht der Haushalt. Wie sich das prüfen lässt, steht unter
        <a href="/mietpreisbremse-pruefen.html">Mietpreisbremse prüfen</a>.</span></li>
    </ul>
  </section>

  <section class="block">
    <h2>Bevor ihr unterschreibt</h2>
    <ol class="schritte">
      <li><b>Trefft euch.</b> Ein gemeinsamer Mietvertrag über zwei Jahre ist eine größere
        Verpflichtung als die meisten Verträge, die man sonst unterschreibt. Ein Abend reicht, um zu
        merken, ob es passt.</li>
      <li><b>Redet über Geld, bevor es welches gibt.</b> Wer zahlt was, wenn jemand auszieht? Wie
        wird die Kaution geteilt? Wer meldet den Rundfunkbeitrag an?</li>
      <li><b>Redet über den Alltag.</b> Ordnung, Lautstärke, Besuch, gemeinsames Kochen,
        Tagesrhythmus. Das sind die sechs Fragen, an denen WGs auseinandergehen – nicht der Preis.</li>
      <li><b>Schreibt eine WG-Vereinbarung.</b> Sie ist kein Mietvertrag und braucht keine Form:
        Zimmerverteilung, Kostenaufteilung, Regeln beim Auszug. Im Streitfall ist sie das Einzige,
        worauf man sich berufen kann.</li>
      <li><b>Bei einem gemeinsamen Vertrag über mehrere Jahre lohnt der Blick eines Mietervereins</b>,
        bevor unterschrieben wird. Das kostet einen Jahresbeitrag und spart im Zweifel ein
        Vielfaches.</li>
    </ol>
  </section>

  <section class="block">
    <h2>Wie es bei TrimmoTrade läuft</h2>
    <ol class="schritte">
      <li><b>Wohnungen finden, die dafür freigegeben sind.</b> Vermietende haken es beim Inserieren
        an; in der Suche gibt es dafür einen eigenen Filter.</li>
      <li><b>Gruppe eröffnen oder beitreten.</b> Du sagst, zu wie vielt und was für eine WG es werden
        soll. Der Anteil je Person wird ausgerechnet und steht dabei.</li>
      <li><b>Kennenlernen.</b> Jede Person stellt sich vor; aus sechs Fragen zum Alltag rechnet sich
        eine Passung. E-Mail-Adressen werden erst sichtbar, wenn beide Seiten einander angenommen
        haben – vorher steht dort nur der Rufname.</li>
      <li><b>Gemeinsam bewerben.</b> Ist die Gruppe voll, geht <b>eine</b> Bewerbung hinaus, mit
        Haushaltsgröße und Berufen. Nicht drei einzelne.</li>
    </ol>
    <p>Kostenlos, und der Betreiber wird dabei nicht Partei: TrimmoTrade prüft niemanden, stellt
      keine Identität fest und steht für niemanden ein. Wer mit wem zusammenzieht, entscheidet ihr.</p>
  </section>
`,
    fragen: [
      { frage: 'Kann man als Gruppe von Fremden eine Wohnung mieten?',
        antwort: 'Ja. Üblich ist ein gemeinsamer Mietvertrag, in dem alle stehen; möglich sind auch Einzelverträge je Zimmer oder eine Hauptmieterin mit Untermietern. Voraussetzung ist, dass die Vermieterseite mitmacht – deshalb ist die Freigabe bei TrimmoTrade eine Angabe der anbietenden Seite.' },
      { frage: 'Was bedeutet gesamtschuldnerische Haftung in einer WG?',
        antwort: 'Bei einem gemeinsamen Mietvertrag schulden alle die ganze Miete (§ 421 BGB). Zahlt eine Person nicht, kann die Vermieterseite den vollen Betrag von jeder Einzelnen verlangen. Untereinander besteht ein Ausgleichsanspruch nach § 426 BGB – den muss man aber gegen die eigene Mitbewohnerin durchsetzen.' },
      { frage: 'Wie viel Kaution darf eine WG zahlen?',
        antwort: 'Höchstens drei Nettokaltmieten für die gesamte Wohnung (§ 551 Abs. 1 BGB), nicht je Person. Eine Forderung von drei Monatsmieten pro Mitglied ist unzulässig. Gezahlt werden darf in drei gleichen Raten.' },
      { frage: 'Kann ich aus einer WG ausziehen, ohne dass die anderen mitgehen?',
        antwort: 'Bei einem gemeinsamen Vertrag nicht ohne Weiteres: Der Austausch einer Person ist eine Vertragsänderung und braucht die Zustimmung aller Mitmietenden und der Vermieterseite. Bei Einzelverträgen je Zimmer kann jede Person allein kündigen.' },
      { frage: 'Zahlt jede Person in einer WG den Rundfunkbeitrag?',
        antwort: 'Nein. Der Beitrag fällt einmal je Wohnung an. Eine WG zahlt zusammen einen Beitrag; wer ihn anmeldet und wie er geteilt wird, sollte beim Einzug geklärt werden.' }
    ],
    tun: { text: 'Wohnungen für eine WG-Gründung', ziel: '/#/suche?wg=1' }
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
