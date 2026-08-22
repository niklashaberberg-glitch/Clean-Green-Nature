# Kurzvorstellung (zweiseitiges PDF)

Die Kurzvorstellung für Facility Management, Einkauf und die öffentliche Hand.

```
kurzvorstellung.html                      Quelle – hier wird geändert
Kurzvorstellung-Clean-Green-Nature.pdf    das fertige PDF
```

Das ursprüngliche PDF stammte selbst aus Chromium; die Quelle wurde daraus
nachgebaut, damit Text, Farben, Links und Logo wieder änderbar sind. Schrift ist
**Carlito** (metrisch wie Calibri) – dieselbe wie im Original.

## PDF neu erzeugen

Im Browser: `kurzvorstellung.html` öffnen, drucken, Ziel „Als PDF speichern“,
Papierformat **A4**, Ränder **keine**, **Hintergrundgrafiken** einschalten.

Automatisch mit Chromium und Playwright:

```js
await page.goto('file:///…/kurzvorstellung/kurzvorstellung.html');
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: 'Kurzvorstellung-Clean-Green-Nature.pdf', format: 'A4',
                 printBackground: true, preferCSSPageSize: true,
                 margin: { top: 0, right: 0, bottom: 0, left: 0 } });
```

## Beim Ändern beachten

Jede Seite ist ein `<section class="page">` mit fester Höhe von 297 mm und
`overflow: hidden`. **Zu viel Inhalt wird still abgeschnitten** – nach jeder
Textänderung also beide Seiten im PDF ansehen. Aktuell ist auf Seite 1 rund
12 mm Luft, auf Seite 2 rund 6 mm.

## Farben

Die Tokens oben in der Datei entsprechen den Marken-Tokens aus `../index.html`
(`--brand: #0d7c72`, `--brand-500: #14b8a6`, `--brand-soft: #e7f8f5`,
`--dark: #0b1220`). Wer dort etwas ändert, sollte es hier mitziehen.

## Logo

```
cgn-emblem.png   das runde Emblem, außen freigestellt (256 × 256)
cgn-logo.png     das vollständige Logo mit Schriftzug, freigestellt
```

Beides ist aus der Logodatei herausgelöst. Im Dokument steht das **Emblem** in
den Kopfzeilen beider Seiten – auf Seite 1 mit 12 mm auf weißer Scheibe, auf
Seite 2 mit 10 mm. Eingebettet ist es als Data-URI in der Regel `.mark` im
Stylesheet, also nur einmal in der Datei; die vier Marken verweisen darauf.

In den Fußzeilen steht bewusst **kein** Emblem: Bei rund 6 mm ist die Zeichnung
im Kreis zu detailreich und wird zum Fleck. Dort trägt der Schriftzug allein.

Emblem austauschen: neue Datei als `cgn-emblem.png` ablegen und die Data-URI in
`.mark` neu erzeugen –
`base64 -w0 cgn-emblem.png` und den Inhalt zwischen `base64,` und `")` ersetzen.

## Preise

Tarife und Kontingente im Abschnitt „GraffitiCare Portfolio“ müssen zu
`../index.html` und zu `../GESCHAEFTSMODELL-GRAFFITICARE.md` passen. Stand hier:
35 / 69 / 129 € netto je Objekt und Monat, 8 / 16 / 32 m² je Objekt und Jahr,
Rückmeldung in 5 Werktagen / 48 Stunden / 24 Stunden.

## Domain

Das Dokument verlinkt auf `www.cleangreennature.de` – so stand die Adresse schon
im Original. In `../index.html` ist als kanonische Adresse dagegen
`clean-green-nature.de` eingetragen. Sobald feststeht, welche Adresse gilt, an
beiden Stellen angleichen.
