/* =====================================================================
   Aus der Marke werden Symbole

   Vorlage sind zwei freigestellte Dateien in bilder/: das Zeichen allein
   und die ganze Marke mit Schriftzug. Alles Übrige – Browsersymbol,
   Startbildschirm, Vorschaubild für geteilte Verweise – entsteht hier
   daraus. Von Hand geschnitten wäre jedes davon eine eigene Datei, die
   beim nächsten Feilen am Logo vergessen wird.

   Ohne ImageMagick und ohne Pillow: Ein Browser liegt für die Prüfläufe
   ohnehin bereit, und der kann Pixel lesen und schreiben.

   Aufruf:  node scripts/logo-bauen.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const WURZEL = path.resolve(__dirname, '..');

/* Zwei Orte, und der Unterschied ist keine Ordnungsliebe:

   bilder/        die Vorlagen in voller Größe. Archiv – wer das Logo
                  neu setzt, braucht sie; die Website nie.
   assets/bilder/ was die Anwendung wirklich lädt. Ein Stil verweist
                  relativ zu sich selbst, nicht zur Seite; läge das Bild
                  woanders, ginge der Verweis ins Leere. */
const BILDER = path.join(WURZEL, 'bilder');

/* Der Grund, auf dem ein Symbol steht. Dieselbe Farbe wie --papier in
   app.css: Ein Symbol, das auf dem Startbildschirm heller leuchtet als
   die Anwendung, die es öffnet, wirkt wie aus einem anderen Haus. */
const GRUND = '#f6f5f2';

/* Was aus dem vollständigen Zeichen entsteht. `anteil` ist der Platz,
   den es im Quadrat einnimmt – bei `maskable` weniger, weil Android
   runde, quadratische und tropfenförmige Masken darüberlegt und alles
   außerhalb von 80 % abschneiden darf.

   Nicht dabei: das Symbol für den Browsertab. Dort sind 16 bis 32 Pixel
   üblich, und darin ist das Zeichen mit Ringen, Balken und Verläufen ein
   grüner Fleck – ausprobiert und nachgesehen. Für diesen Fall gibt es
   favicon.svg, die flache kleine Fassung; die PNG-Rückfälle unten
   entstehen aus ihr und nicht aus dem Foto, damit im Tab beide dasselbe
   zeigen. */
const SYMBOLE = [
  { datei: 'apple-touch-icon.png', gr: 180, anteil: 0.78 },
  { datei: 'icon-192.png', gr: 192, anteil: 0.80 },
  { datei: 'icon-512.png', gr: 512, anteil: 0.80 },
  { datei: 'icon-maskable.png', gr: 512, anteil: 0.58 },
];

/* Rückfall für Browser ohne SVG-Symbol – heute vor allem ältere Safari. */
const KLEIN = [
  { datei: 'favicon-32.png', gr: 32 },
  { datei: 'favicon-64.png', gr: 64 },
];

/* Was die Anwendung selbst einbindet. Die Vorlage in bilder/ ist eine
   Archivgröße – ein halbes Megabyte für ein Zeichen von 32 Pixeln wäre
   Unfug, und in der Einzeldatei stünde es als base64 mitten im Stil.

   Deshalb eine kleine Fassung, groß genug für dreifache Pixeldichte, und
   als WebP: Bei diesem Bild – weiche Verläufe mit Transparenz – ist es
   bei gleicher Größe rund ein Drittel eines PNG. Nachgemessen, nicht
   geraten (300 px: PNG 148 kB, WebP 47 kB als base64). Fällt WebP einmal
   aus, fehlt die Bildmarke in der Kopfzeile; alles Übrige läuft weiter. */
const IM_STIL = [
  { datei: 'assets/bilder/logo-zeichen-web.webp', quelle: 'zeichen', breite: 300, guete: 0.92 },
];

async function bauen() {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const browser = await chromium.launch();
  const seite = await browser.newPage();

  const alsUrl = (datei) =>
    'data:image/png;base64,' + fs.readFileSync(path.join(BILDER, datei)).toString('base64');

  const ergebnis = await seite.evaluate(async (eingabe) => {
    const { zeichenUrl, markeUrl, kleinUrl, symbole, kleinBilder, imStil, grund } = eingabe;

    const laden = (url) => new Promise((ok, weg) => {
      const b = new Image();
      b.onload = () => ok(b);
      b.onerror = weg;
      b.src = url;
    });
    const zeichen = await laden(zeichenUrl);
    const marke = await laden(markeUrl);
    const klein = await laden(kleinUrl);

    /* Ein Bild mittig in ein Quadrat setzen, ohne es zu verzerren. */
    const insQuadrat = (bild, gr, anteil, hintergrund) => {
      const c = document.createElement('canvas');
      c.width = gr; c.height = gr;
      const g = c.getContext('2d');
      g.imageSmoothingQuality = 'high';
      if (hintergrund) { g.fillStyle = hintergrund; g.fillRect(0, 0, gr, gr); }
      const platz = gr * anteil;
      const f = Math.min(platz / bild.width, platz / bild.height);
      const w = bild.width * f, h = bild.height * f;
      g.drawImage(bild, (gr - w) / 2, (gr - h) / 2, w, h);
      return c.toDataURL('image/png');
    };

    const raus = symbole.map((s) => ({
      datei: s.datei,
      png: insQuadrat(zeichen, s.gr, s.anteil, grund),
    }));

    /* Die kleine Fassung bringt ihre eigene Kachel mit, deshalb ohne
       Hintergrund und randlos. */
    for (const k of kleinBilder) {
      raus.push({ datei: k.datei, png: insQuadrat(klein, k.gr, 1, null) });
    }

    /* Verkleinern unter Beibehaltung der Freistellung. */
    for (const w of imStil) {
      const b = w.quelle === 'marke' ? marke : zeichen;
      const c = document.createElement('canvas');
      c.width = w.breite;
      c.height = Math.round(b.height * (w.breite / b.width));
      const g2 = c.getContext('2d');
      g2.imageSmoothingQuality = 'high';
      g2.drawImage(b, 0, 0, c.width, c.height);
      const art = w.datei.endsWith('.webp') ? 'image/webp' : 'image/png';
      raus.push({ datei: w.datei, png: c.toDataURL(art, w.guete) });
    }

    /* Das Vorschaubild für geteilte Verweise. 1200 × 630 ist das Maß,
       das Facebook, LinkedIn, WhatsApp und Mastodon gleichermaßen
       erwarten; wer davon abweicht, wird beschnitten. Links die Marke,
       rechts ein Satz – mehr trägt so eine Kachel nicht. */
    const v = document.createElement('canvas');
    v.width = 1200; v.height = 630;
    const g = v.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.fillStyle = grund;
    g.fillRect(0, 0, 1200, 630);
    /* Ein Streifen in Akzentgrün an der Unterkante – er macht die Kachel
       in einer Zeitleiste erkennbar, ohne mit der Marke zu streiten. */
    g.fillStyle = '#1a5c37';
    g.fillRect(0, 618, 1200, 12);

    /* Nach der Höhe rechnen, nicht nach der Breite: Die Kachel ist
       flach, die Marke ist hoch, und wer hier die Breite vorgibt,
       schiebt den Schriftzug unten aus dem Bild. */
    const mh = 336;
    const mw = marke.width * (mh / marke.height);
    g.drawImage(marke, (1200 - mw) / 2, 96, mw, mh);

    g.fillStyle = '#4c5044';
    g.font = '500 30px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    g.fillText('Mieten · Kaufen · WG-Zimmer · Wohnungstausch', 600, 528);

    raus.push({ datei: 'vorschau.png', png: v.toDataURL('image/png') });
    return raus;
  }, {
    zeichenUrl: alsUrl('logo-zeichen.png'),
    markeUrl: alsUrl('logo.png'),
    kleinUrl: 'data:image/svg+xml;base64,'
      + fs.readFileSync(path.join(WURZEL, 'favicon.svg')).toString('base64'),
    symbole: SYMBOLE,
    kleinBilder: KLEIN,
    imStil: IM_STIL,
    grund: GRUND,
  });

  for (const e of ergebnis) {
    const ziel = path.join(WURZEL, e.datei);
    fs.mkdirSync(path.dirname(ziel), { recursive: true });
    fs.writeFileSync(ziel, Buffer.from(e.png.split(',')[1], 'base64'));
    console.log(e.datei.padEnd(24) + (fs.statSync(ziel).size / 1024).toFixed(0) + ' kB');
  }

  await browser.close();
}

bauen().catch((e) => {
  console.error('Logo-Bau fehlgeschlagen: ' + e.message);
  process.exit(1);
});
