/* =====================================================================
   Der vollständige Datensatz für netcup

   Hier liegen zwei Websites, und sie gehören auf zwei verschiedene
   Domains:

     www.trimmotrade.de        die Anwendung (PHP, Datenbank, Konten)
     www.cleangreennature.de   die Seite zur Graffitientfernung (statisch)

   Beide in denselben Ordner zu laden geht schief: TrimmoTrade bringt
   eine eigene index.html mit, und die letzte gewinnt. Deshalb erzeugt
   dieses Skript ein Verzeichnis, in dem für jede Domain ein Unterordner
   steht, dessen Inhalt genau in deren Dokumentenstamm gehört – nicht der
   Ordner selbst, sondern das, was darin liegt.

   Die TrimmoTrade-Seite wird nicht hier zusammengesucht: Das tut
   trimmotrade/scripts/paket-bauen.js, und zwei Listen derselben Dateien
   liefen nach dem ersten Feilen auseinander.

   Aufruf:  node scripts/netcup-paket.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const WURZEL = path.resolve(__dirname, '..');
const TT = path.join(WURZEL, 'trimmotrade');
const ZIEL = path.join(WURZEL, 'netcup');

const TT_DOMAIN = 'www.trimmotrade.de';
const CGN_DOMAIN = 'www.cleangreennature.de';

/* Was zur Seite über die Graffitientfernung gehört. Eine Aufnahmeliste,
   damit nicht eines Tages der Ordner trimmotrade/ mitfährt, weil er
   zufällig danebenliegt. */
const CGN_DATEIEN = ['index.html', '.htaccess', 'robots.txt', 'sitemap.xml'];
const CGN_ORDNER = ['images'];

/* ------------------------------------------------------------------ */

let n = 0;
let bytes = 0;

function kopiereDatei(vonWurzel, rel, nachWurzel) {
  const von = path.join(vonWurzel, rel);
  const nach = path.join(nachWurzel, rel);
  fs.mkdirSync(path.dirname(nach), { recursive: true });
  fs.copyFileSync(von, nach);
  n++;
  bytes += fs.statSync(von).size;
}

/* Notizen für den Entwickler gehören nicht auf einen Webserver: Dort
   wären sie unter ihrer Adresse öffentlich lesbar. */
const istNotiz = (name) => /^README(\.[a-z]+)?$/i.test(name);

function kopiereOrdner(vonWurzel, rel, nachWurzel) {
  for (const e of fs.readdirSync(path.join(vonWurzel, rel), { withFileTypes: true })) {
    const kind = rel + '/' + e.name;
    if (e.isDirectory()) kopiereOrdner(vonWurzel, kind, nachWurzel);
    else if (e.isFile() && !istNotiz(e.name)) kopiereDatei(vonWurzel, kind, nachWurzel);
  }
}

/* ------------------------------------------------------------------ */

console.log('TrimmoTrade bauen …');
execFileSync(process.execPath, [path.join(TT, 'scripts', 'logo-bauen.js')], { stdio: 'ignore' });
execFileSync(process.execPath, [path.join(TT, 'build.js')], { stdio: 'ignore' });
execFileSync(process.execPath, [path.join(TT, 'scripts', 'paket-bauen.js')], { stdio: 'ignore' });

fs.rmSync(ZIEL, { recursive: true, force: true });
fs.mkdirSync(ZIEL, { recursive: true });

/* --- TrimmoTrade ---------------------------------------------------- */
const ttPaket = path.join(TT, 'paket');
if (!fs.existsSync(ttPaket)) {
  console.error('trimmotrade/paket/ fehlt – paket-bauen.js ist nicht durchgelaufen.');
  process.exit(1);
}
kopiereOrdner(ttPaket, '.', path.join(ZIEL, TT_DOMAIN));

/* --- Clean Green Nature --------------------------------------------- */
const fehlend = [];
for (const d of CGN_DATEIEN) {
  if (fs.existsSync(path.join(WURZEL, d))) kopiereDatei(WURZEL, d, path.join(ZIEL, CGN_DOMAIN));
  else fehlend.push(d);
}
for (const o of CGN_ORDNER) {
  if (fs.existsSync(path.join(WURZEL, o))) kopiereOrdner(WURZEL, o, path.join(ZIEL, CGN_DOMAIN));
}

/* Die drei Bilder, die index.html erwartet. Fehlen sie, bleibt die Seite
   benutzbar – es stehen nur leere Flächen darin. Das gehört in die
   Anleitung und nicht in eine stille Fußnote. */
const CGN_BILDER = ['cgc-logo-icon.png', 'clean-green-cologne-logo.png', 'niklas-haberberg.jpg'];
const bilderFehlen = CGN_BILDER.filter((b) => !fs.existsSync(path.join(WURZEL, 'images', b)));

/* Den Ordner gibt es auch dann, wenn noch kein Bild darin liegt. Sonst
   müsste ihn jemand auf dem Server von Hand anlegen, um die drei Dateien
   nachzureichen – und wer ihn falsch benennt, sucht lange. */
fs.mkdirSync(path.join(ZIEL, CGN_DOMAIN, 'images'), { recursive: true });
fs.writeFileSync(path.join(ZIEL, CGN_DOMAIN, 'images', 'HIERHIN.txt'),
  'Hier gehören genau drei Dateien hinein, unter genau diesen Namen:\n\n'
  + CGN_BILDER.map((b) => '  ' + b).join('\n') + '\n\n'
  + '  cgc-logo-icon.png             Logo in Kopf- und Fußzeile, quadratisch,\n'
  + '                                mindestens 256 x 256, transparent\n'
  + '  clean-green-cologne-logo.png  Markenbild oben und in der Vorschau,\n'
  + '                                quadratisch, mindestens 1200 x 1200\n'
  + '  niklas-haberberg.jpg          Porträt, quadratisch, mindestens\n'
  + '                                400 x 400, Gesicht mittig\n\n'
  + 'Fehlen sie, läuft die Seite weiter und zeigt an diesen Stellen leere\n'
  + 'Flächen. Diese Datei kann danach gelöscht werden.\n');

const stand = new Date().toISOString().slice(0, 10);

const liesmich =
`Netcup – was wohin gehört
Stand: ${stand}

Hier stehen ZWEI Websites. Sie gehören auf zwei verschiedene Domains und
dürfen nicht in denselben Ordner – beide bringen eine index.html mit, und
die zweite überschriebe die erste.

Bei netcup hat jede Domain ihren eigenen Dokumentenstamm. Im Dateimanager
sieht das so aus:

  Basisverzeichnis/
    trimmotrade.de/
      httpdocs/          <-- hierhin der Inhalt von ${TT_DOMAIN}/
    cleangreennature.de/
      httpdocs/          <-- hierhin der Inhalt von ${CGN_DOMAIN}/

Am schnellsten geht es mit den beiden Archiven:

  netcup-trimmotrade-<datum>.zip        in trimmotrade.de/httpdocs
                                         hochladen und dort entpacken
  netcup-cleangreennature-<datum>.zip   in cleangreennature.de/httpdocs
                                         hochladen und dort entpacken

In den Archiven liegen die Dateien auf oberster Ebene. Nach dem Entpacken
steht die index.html also direkt in httpdocs und nicht in einem
Unterordner. Das Archiv selbst danach löschen.

Entpacken hat einen zweiten Vorteil gegenüber FTP: Die versteckten
Dateien (.htaccess, .user.ini, .well-known/) kommen automatisch mit.
Über FTP werden sie von vielen Programmen ausgeblendet und fehlen dann.

WICHTIG: Nichts davon ins Basisverzeichnis legen. Was dort liegt, ist
nicht über das Web erreichbar – die Seite bliebe leer.

Diese Datei, DEPLOY.md und START.md gehören NICHT auf den Server. Sie
wären dort öffentlich lesbar und sind nur für dich.

---------------------------------------------------------------------
0 · Vorher aufräumen
---------------------------------------------------------------------

Liegt in trimmotrade.de/httpdocs noch etwas aus einem früheren Versuch,
gehört es weg, BEVOR das neue Paket entpackt wird:

  trimmotrade.html   die alte Einzeldatei-Fassung. Sie bliebe unter
                     ihrer eigenen Adresse erreichbar – mit den alten
                     Rechtstexten, die inzwischen nicht mehr stimmen.
                     Eine öffentlich abrufbare, veraltete Daten-
                     schutzerklärung ist genau das, was man nicht
                     haben will.
  favicon.ico        wird durch favicon.svg und die PNG ersetzt.

Alles andere, was dort liegt und nicht in PAKET.txt steht, ebenfalls.

---------------------------------------------------------------------
1 · ${TT_DOMAIN} – die Anwendung
---------------------------------------------------------------------

Braucht PHP 8.1 oder neuer und eine MariaDB-Datenbank. Nach dem
Hochladen auf dem Server:

  1. api/config.example.php nach api/config.php kopieren und ausfüllen
     (Datenbank, Postfach, Anschrift – die Datei erklärt jedes Feld)
  2. api/daten/ beschreibbar machen (CHMOD 770)
  3. https://${TT_DOMAIN}/api/status aufrufen –
     dort muss "eingerichtet":true stehen
  4. php api/index.php pruefen  – sagt, was noch fehlt
  5. drei Cron-Aufträge einrichten (melden, erinnern, aufraeumen)

Die vollständige Anleitung steht in DEPLOY.md, die Reihenfolge für die
ersten Wochen in START.md. Beide liegen nicht im Paket, weil sie auf
dem Server nichts verloren haben – sie kommen getrennt.

Die Dateiliste zum Gegenprüfen steht in ${TT_DOMAIN}/PAKET.txt.

---------------------------------------------------------------------
2 · ${CGN_DOMAIN} – die Seite zur Graffitientfernung
---------------------------------------------------------------------

Eine einzige HTML-Datei, kein PHP, keine Datenbank. Hochladen genügt.
${bilderFehlen.length ? `
ACHTUNG – ${bilderFehlen.length === 1 ? 'eine Bilddatei fehlt' : bilderFehlen.length + ' Bilddateien fehlen'} noch:
${bilderFehlen.map((b) => '  images/' + b).join('\n')}

Die Seite läuft auch ohne sie, zeigt an diesen Stellen aber leere
Flächen. Welche Maße sinnvoll sind, steht in images/README.md.
` : ''}
---------------------------------------------------------------------
3 · Beide Domains
---------------------------------------------------------------------

Für jede Domain im netcup-Kundenbereich ein Let's-Encrypt-Zertifikat
ausstellen, und zwar für BEIDE Schreibweisen – mit und ohne www. Die
.htaccess leitet auf www um, und eine Umleitung auf eine Adresse ohne
gültiges Zertifikat ist eine Fehlermeldung.

Versteckte Dateien müssen mit hochgeladen werden: .htaccess, .user.ini
und der Ordner .well-known/. Viele FTP-Programme blenden sie aus –
bei FileZilla: Server → Versteckte Dateien anzeigen.
`;

fs.writeFileSync(path.join(ZIEL, 'LIESMICH.txt'), liesmich);

/* Die beiden Anleitungen kommen mit, aber neben die Paketordner und
   nicht hinein: Auf dem Server wären sie öffentlich lesbar. */
for (const d of ['DEPLOY.md', 'START.md']) {
  const von = path.join(TT, d);
  if (fs.existsSync(von)) fs.copyFileSync(von, path.join(ZIEL, d));
}

/* Je Domain ein eigenes Archiv, und darin die Dateien auf oberster
   Ebene – nicht in einem Unterordner.

   Der Grund steht im Dateimanager von netcup: Dort gibt es je Domain ein
   httpdocs, und ein Archiv wird an Ort und Stelle entpackt. Läge darin
   ein Ordner „www.trimmotrade.de“, müsste hinterher jede Datei von Hand
   eine Ebene hochgeschoben werden – bei knapp hundert Dateien ist das
   die Stelle, an der etwas liegen bleibt. Liegen sie oben, ist Entpacken
   der letzte Schritt.

   Ein gemeinsames Archiv gibt es deshalb nicht mehr: Es hätte genau
   dieses Verschieben erzwungen. */
const archive = [];
function packen(name, aus) {
  try {
    const datei = path.join(WURZEL, name);
    fs.rmSync(datei, { force: true });
    execFileSync('zip', ['-qr', datei, '.'], { cwd: aus });
    archive.push(name + '  ' + (fs.statSync(datei).size / 1024 / 1024).toFixed(1) + ' MB');
  } catch (e) {
    archive.push(name + '  – kein zip vorhanden, der Ordner reicht auch');
  }
}
packen('netcup-trimmotrade-' + stand + '.zip', path.join(ZIEL, TT_DOMAIN));
packen('netcup-cleangreennature-' + stand + '.zip', path.join(ZIEL, CGN_DOMAIN));

console.log('netcup/  ' + n + ' Dateien · ' + (bytes / 1024 / 1024).toFixed(1) + ' MB');
console.log('  ' + TT_DOMAIN + '/');
console.log('  ' + CGN_DOMAIN + '/');
if (fehlend.length) console.log('  FEHLT: ' + fehlend.join(', '));
if (bilderFehlen.length) {
  console.log('  Hinweis: ' + bilderFehlen.length + ' Bilddateien der Graffiti-Seite fehlen');
}
for (const a of archive) console.log('Archiv: ' + a);
