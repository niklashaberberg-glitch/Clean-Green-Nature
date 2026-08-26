#!/usr/bin/env node
/* =====================================================================
   TrimmoTrade – Einzeldatei bauen
   Fasst Stil und alle Skripte zu einer einzigen HTML-Datei zusammen.
   Ohne Abhängigkeiten: node build.js
   Ergebnis:
     dist/trimmotrade.html   vollständige Seite, per Doppelklick zu öffnen
     dist/artifact.html   nur der Seiteninhalt, ohne html/head/body
     dist/artifact-web.html  dieselbe Datei noch einmal – sie ist es, die
                             als Artefakt veröffentlicht wird
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const wurzel = __dirname;
const assets = path.join(wurzel, 'assets');
const dist = path.join(wurzel, 'dist');

const SKRIPTE = [
  'i18n.js', 'sprache-en.js',
  'util.js', 'geo.js', 'images.js', 'ring-bild.js', 'data.js',
  'analyse.js', 'match.js', 'werkzeuge.js', 'store.js', 'plan.js', 'tresor.js', 'recht.js', 'hilfe.js', 'api.js', 'konto.js',
  'hilfe-en.js', 'markt.js', 'karte.js', 'ui.js',
  'view-start.js', 'view-suche.js', 'view-objekt.js',
  'view-tausch.js', 'view-tools.js', 'view-profil.js',
  'view-werkzeuge.js', 'view-werkzeuge2.js', 'view-markt.js', 'view-plus.js',
  'view-tresor.js', 'view-recht.js', 'view-hilfe.js', 'view-anmeldung.js',
  'app.js'
];

/* Ein </script> im Quelltext würde den umschließenden Block beenden. */
const sicher = (s) => s.replace(/<\/script/gi, '<\\/script');

function lies(datei) {
  return fs.readFileSync(path.join(assets, datei), 'utf8');
}

/* Die Ortsliste für die Serverseite entsteht aus assets/geo.js. Sie hier
   mitzubauen kostet nichts und verhindert den einen Fehler, der sonst
   sicher kommt: ein neues Viertel in der Anwendung, das der Server nicht
   kennt und deshalb bei jedem Inserat ablehnt. */
try {
  require('./scripts/orte-bauen.js');
} catch (e) {
  console.error('Ortsliste konnte nicht erzeugt werden: ' + e.message);
  process.exit(1);
}

const css = fs.readFileSync(path.join(assets, 'app.css'), 'utf8');
const js = SKRIPTE.map((d) => '/* ===== ' + d + ' ===== */\n' + sicher(lies(d))).join('\n');

const noscript =
  '<noscript>\n' +
  '  <div style="max-width:640px;margin:12vh auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.6">\n' +
  '    <h1>TrimmoTrade braucht JavaScript</h1>\n' +
  '    <p>Die Anwendung rechnet vollständig im Browser: Suche, Bewertung, Kartendarstellung und Ringtausch\n' +
  '      entstehen erst beim Aufruf. Ohne JavaScript lässt sich davon nichts anzeigen.</p>\n' +
  '    <p>Deine Eingaben bleiben dabei im Browser. Zum Server geht nur die Anmeldung.</p>\n' +
  '  </div>\n' +
  '</noscript>';

const kopfExtra =
  '<title>TrimmoTrade</title>\n' +
  '<meta name="description" content="TrimmoTrade führt Mietmarkt, Kaufangebote, WG-Zimmer und Wohnungstausch zusammen: mit Vergleichsmiete, Vertragslupe, Betrugserkennung, echten Monatskosten und Ringtausch über mehrere Haushalte.">';

const inhalt = '<style>\n' + css + '\n</style>\n' + noscript + '\n<script>\n' + js + '\n</script>';

const vollseite =
  '<!DOCTYPE html>\n<html lang="de">\n<head>\n' +
  '<meta charset="UTF-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
  kopfExtra + '\n' +
  '<meta name="robots" content="noindex">\n' +
  '<meta name="theme-color" content="#1a5c37" media="(prefers-color-scheme: light)">\n' +
  '<meta name="theme-color" content="#0f120f" media="(prefers-color-scheme: dark)">\n' +
  '<meta name="color-scheme" content="light dark">\n' +
  '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'%3E%3Crect width=\'32\' height=\'32\' rx=\'7\' fill=\'%231a5c37\'/%3E%3Cpath d=\'M5 16L16 6l11 10\' stroke=\'%23fff\' stroke-width=\'2.6\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3Cpath d=\'M8 14.5V26h16V14.5\' stroke=\'%23fff\' stroke-width=\'2.6\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3Ccircle cx=\'16\' cy=\'20\' r=\'3.2\' stroke=\'%23fff\' stroke-width=\'2.6\' fill=\'none\'/%3E%3C/svg%3E">\n' +
  '</head>\n<body>\n' + inhalt + '\n</body>\n</html>\n';

/* Für die Artifact-Veröffentlichung: nur Seiteninhalt, aber mit <title>,
   weil daraus der Name in der Übersicht entsteht. */
const nurInhalt = '<title>TrimmoTrade</title>\n' + inhalt + '\n';

fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'trimmotrade.html'), vollseite);
fs.writeFileSync(path.join(dist, 'artifact.html'), nurInhalt);
/* Zweite, gleichlautende Ausgabe. Sie ist die Datei, die als Artefakt
   veröffentlicht wird – unter eigenem Namen, damit sich die Adresse des
   Artefakts nicht ändert, wenn sich an der Ausgabe etwas verschiebt. */
fs.writeFileSync(path.join(dist, 'artifact-web.html'), nurInhalt);

const kb = (s) => Math.round(Buffer.byteLength(s, 'utf8') / 1024) + ' kB';
console.log('dist/trimmotrade.html  ' + kb(vollseite));
console.log('dist/artifact.html  ' + kb(nurInhalt));
console.log('Skripte: ' + SKRIPTE.length + ', Stil: ' + kb(css));
