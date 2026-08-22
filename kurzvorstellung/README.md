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

Als kleine Marke steht das Blatt-Symbol der Website in Kopf- und Fußzeile.
Sobald `cgc-logo-icon.png` vorliegt: Datei in diesen Ordner legen und die drei
`<span class="mark">…</span>`-Blöcke ersetzen durch

```html
<img class="mark" src="cgc-logo-icon.png" alt="Clean Green Nature">
```

Bei der hellen Variante zusätzlich `mark--light` behalten, damit Größe und Radius
stimmen.

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
