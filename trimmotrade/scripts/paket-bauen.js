/* =====================================================================
   Das Paket für den Server

   „Alles hochladen“ ist ein schlechter Rat. Im Verzeichnis liegen auch
   der Erzeuger (build.js), die Prüfskripte, die Anleitungen und ein
   Ordner dist/, der nur für die Einzeldatei-Fassung da ist. Auf dem
   Server haben sie nichts verloren: Sie schaden nicht, aber jede Datei,
   die dort liegt und niemand braucht, ist eine Datei, die jemand eines
   Tages öffnet.

   Dieses Skript legt deshalb ein Verzeichnis `paket/` an, in dem genau
   das steht, was hochgehört – versteckte Dateien eingeschlossen, denn
   ohne `.htaccess` und `.user.ini` fehlen die Riegel und der Bildupload
   bricht ab. Dazu ein `PAKET.txt` mit der Liste, damit sich nach dem
   Hochladen prüfen lässt, ob wirklich alles ankam.

   Aufruf:  node scripts/paket-bauen.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const WURZEL = path.resolve(__dirname, '..');
const ZIEL = path.join(WURZEL, 'paket');

/* Was mitkommt. Verzeichnisse werden vollständig übernommen, einzelne
   Dateien einzeln benannt – eine Aufnahmeliste statt einer Ausschluss-
   liste, weil eine vergessene Ausnahme sonst still mitfährt. */
const ORDNER = ['assets', 'api', '.well-known'];

const DATEIEN = [
  'index.html',
  '.htaccess',
  '.user.ini',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  '404.html',
  'favicon.svg',
  'favicon-32.png',
  'favicon-64.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable.png',
  'apple-touch-icon.png',
  'vorschau.png',
  /* Die Ratgeberseiten. Sie sind eigene HTML-Dateien, weil eine
     Suchmaschine eine Adresse braucht, die sie indizieren kann – eine
     Ansicht hinter einem Rautezeichen ist keine. */
  'wg-gruenden.html',
  'wohnungstausch.html',
  'wohnung-vermieten.html',
  'mietpreisbremse-pruefen.html',
  'nebenkostenabrechnung-pruefen.html',
  'wohnberechtigungsschein.html',
  'wohnung-verkaufen-vorbereiten.html',
  'nachmieter-finden.html',
];

/* Was aus den Ordnern trotzdem draußen bleibt. `config.php` ist die
   wichtigste Zeile hier: Sie enthält das Datenbankkennwort und wird auf
   dem Server angelegt, nicht mitgeschickt. `daten/` ist der Ordner, in
   den der Server schreibt – seinen Inhalt hochzuladen hieße, die
   Datenbank der Entwicklung mitzuliefern. */
const NICHT = [
  'api/config.php',
  'api/daten',
  'api/schema-ausgeben.php',
];

/* bilder/ steht nicht in ORDNER, und das ist Absicht: Dort liegen die
   Vorlagen der Marke in voller Größe – ein knappes Megabyte, das der
   Server nie ausliefert. Was die Anwendung wirklich lädt, liegt unter
   assets/bilder/ und kommt mit assets/ ohnehin mit. */

const istAusgeschlossen = (rel) =>
  NICHT.some((n) => rel === n || rel.startsWith(n + '/'));

let dateien = 0;
let bytes = 0;
const liste = [];

function kopiereDatei(rel) {
  const von = path.join(WURZEL, rel);
  const nach = path.join(ZIEL, rel);
  fs.mkdirSync(path.dirname(nach), { recursive: true });
  fs.copyFileSync(von, nach);
  const n = fs.statSync(von).size;
  dateien++;
  bytes += n;
  liste.push([rel, n]);
}

function kopiereOrdner(rel) {
  for (const eintrag of fs.readdirSync(path.join(WURZEL, rel), { withFileTypes: true })) {
    const kind = rel + '/' + eintrag.name;
    if (istAusgeschlossen(kind)) continue;
    if (eintrag.isDirectory()) {
      kopiereOrdner(kind);
    } else if (eintrag.isFile()) {
      kopiereDatei(kind);
    }
  }
}

/* ------------------------------------------------------------------ */

fs.rmSync(ZIEL, { recursive: true, force: true });
fs.mkdirSync(ZIEL, { recursive: true });

for (const d of DATEIEN) {
  if (!fs.existsSync(path.join(WURZEL, d))) {
    console.error('FEHLT: ' + d);
    process.exitCode = 1;
    continue;
  }
  kopiereDatei(d);
}
for (const o of ORDNER) {
  kopiereOrdner(o);
}

/* Der leere Datenordner muss mit – sonst legt ihn PHP zwar an, aber nur
   wenn die Rechte des übergeordneten Verzeichnisses das hergeben, und
   bei Webhosting ist das oft nicht der Fall. Ein `.htaccess` darin ist
   der Riegel vor Datenbank und Bildern. */
fs.mkdirSync(path.join(ZIEL, 'api/daten/bilder'), { recursive: true });
for (const rel of ['api/daten/.htaccess']) {
  if (fs.existsSync(path.join(WURZEL, rel))) kopiereDatei(rel);
}

/* config.example.php heißt im Paket weiterhin so. Sie umzubenennen wäre
   bequem und falsch: Wer sie als config.php vorfindet, lädt sie beim
   nächsten Aktualisieren versehentlich über seine eigene. */

const stand = new Date().toISOString().slice(0, 10);
const kopf =
  'TrimmoTrade – Dateien für den Server\n' +
  'Stand: ' + stand + '\n' +
  'Dateien: ' + dateien + ' · ' + (bytes / 1024 / 1024).toFixed(1) + ' MB\n' +
  '\n' +
  'Alles aus diesem Verzeichnis in den Dokumentenstamm der Domain laden.\n' +
  'Die Ordnerstruktur bleibt erhalten. Auf dem Server danach:\n' +
  '\n' +
  '  1. api/config.example.php nach api/config.php kopieren und ausfüllen\n' +
  '  2. api/daten/ beschreibbar machen (CHMOD 770)\n' +
  '  3. https://DEINE-DOMAIN/api/status aufrufen – dort muss\n' +
  '     "eingerichtet":true stehen\n' +
  '  4. php api/index.php pruefen – sagt, was noch fehlt\n' +
  '\n' +
  'Versteckte Dateien (.htaccess, .user.ini, .well-known/) müssen mit.\n' +
  'Viele FTP-Programme blenden sie aus.\n' +
  '\n' +
  'Nicht enthalten und mit Absicht:\n' +
  '  api/config.php   – enthält Kennwörter, wird auf dem Server angelegt\n' +
  '  api/daten/*      – der Server schreibt dort selbst\n' +
  '  dist/, scripts/, build.js, *.md – Werkzeuge und Anleitungen\n' +
  '\n' +
  '--- Inhalt ---------------------------------------------------------\n\n';

liste.sort((a, b) => a[0].localeCompare(b[0]));
const zeilen = liste.map(([rel, n]) => rel.padEnd(58) + String(n).padStart(9) + ' B');
fs.writeFileSync(path.join(ZIEL, 'PAKET.txt'), kopf + zeilen.join('\n') + '\n');

/* Ein Archiv dazu, weil manche Hoster einen Datei-Manager haben, der
   entpacken kann – das ist um Größenordnungen schneller als tausend
   Einzelübertragungen per FTP. */
let archiv = '';
try {
  const name = 'trimmotrade-' + stand + '.zip';
  execFileSync('zip', ['-qr', path.join(WURZEL, name), '.'], { cwd: ZIEL });
  archiv = name + ' (' + (fs.statSync(path.join(WURZEL, name)).size / 1024 / 1024).toFixed(1) + ' MB)';
} catch (e) {
  archiv = '– kein zip vorhanden, das Verzeichnis paket/ reicht auch';
}

console.log('paket/  ' + dateien + ' Dateien · ' + (bytes / 1024 / 1024).toFixed(1) + ' MB');
console.log('Archiv: ' + archiv);
console.log('Liste:  paket/PAKET.txt');
