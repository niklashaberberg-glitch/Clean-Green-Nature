/* =====================================================================
   Prüft die Gestaltung auf zwei Fehler, die still danebengehen.

   ERSTENS: `var(--etwas)` auf ein Token, das es nicht gibt. CSS meldet das
   nicht – es fällt einfach auf den geerbten Wert zurück. Sichtbar wird es
   nur daran, dass eine Nebenzeile plötzlich so dunkel ist wie der Fließtext.
   Genau so waren `--text2` (vierzehn Stellen) und `--r-mittel` monatelang
   wirkungslos.

   ZWEITENS: eine Regel, die versehentlich innerhalb einer anderen steht.
   Seit CSS-Verschachtelung erlaubt ist, ist das kein Syntaxfehler mehr,
   sondern ändert die Bedeutung: `.hinweisbox--tipp` innerhalb von
   `.hinweisbox { … }` trifft ein Kind mit dieser Klasse, nicht die
   Abwandlung selbst. Der Kasten blieb deshalb grau, und nichts hat sich
   beschwert.

   Diese Datei kennt keine Ausnahmeliste für Fehler – nur eine für Token,
   die von außen gesetzt werden (aus dem Skript, per style-Attribut).

     node scripts/token-pruefen.js [assets/app.css]
   ===================================================================== */
const fs = require('fs');
const path = require('path');

const wurzel = path.join(__dirname, '..');
const cssPfad = process.argv[2] || path.join(wurzel, 'assets', 'app.css');
const css = fs.readFileSync(cssPfad, 'utf8');

/* Token, die nicht im Stil stehen, sondern beim Zeichnen gesetzt werden.
   `--g` ist der Durchmesser des Passungsrings, `--n` die Position einer
   Stufe im Energiebalken; beide kommen als style-Attribut aus ui.js. */
const VON_AUSSEN = new Set(['--g', '--n']);

/* Kommentare weg – in ihnen stehen Beispiele, die sonst mitgezählt würden. */
const ohneKommentar = css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

const zeileVon = (index) => ohneKommentar.slice(0, index).split('\n').length;

let fehler = 0;
const melden = (text) => { console.log('  ' + text); fehler++; };

/* ------------------------------------------------------------------
   1. Token: definiert und benutzt
   ------------------------------------------------------------------ */

/* Eine Definition ist eine Deklaration – also ein `--name:` innerhalb
   einer Regel. `.knopf--gefahr:hover` sieht ähnlich aus und ist keine:
   davor steht kein Semikolon, keine geschweifte Klammer und kein
   Zeilenanfang, sondern ein Wortzeichen. */
const definiert = new Set();
ohneKommentar.replace(/(^|[{;])\s*(--[a-z0-9-]+)\s*:/gim, (_, __, name) => {
  definiert.add(name);
  return '';
});

console.log('===== Token in ' + path.relative(wurzel, cssPfad) + ' =====');
console.log('  ' + definiert.size + ' definiert');

const benutzt = new Map();   // Name -> erste Zeile
let m;
const reVar = /var\(\s*(--[a-z0-9-]+)/gi;
while ((m = reVar.exec(ohneKommentar)) !== null) {
  if (!benutzt.has(m[1])) benutzt.set(m[1], zeileVon(m.index));
}
console.log('  ' + benutzt.size + ' benutzt');

for (const [name, zeile] of benutzt) {
  if (definiert.has(name) || VON_AUSSEN.has(name)) continue;
  melden('UNBEKANNTES TOKEN ' + name + ' – Zeile ' + zeile
    + ' (var() fällt still auf den geerbten Wert zurück)');
}

/* Auch die Skripte greifen auf Token zu – die Kartenfarben und die
   Reihenfarben des Verlaufsdiagramms stehen als Zeichenkette im Code. */
const jsOrdner = path.join(wurzel, 'assets');
for (const datei of fs.readdirSync(jsOrdner).filter((f) => f.endsWith('.js'))) {
  const inhalt = fs.readFileSync(path.join(jsOrdner, datei), 'utf8');
  /* Zwei Formen kommen vor. Ein fertiger Name endet auf `)`. Ein
     zusammengesetzter bricht ab – `var(--serie-' + (i + 1) + ')` oder
     `var(--serie-${i + 1})`; dort lässt sich nur prüfen, ob es zu diesem
     Stamm überhaupt Token gibt. */
  const re = /var\(\s*(--[a-z0-9-]+)\s*(.)/gi;
  let t;
  while ((t = re.exec(inhalt)) !== null) {
    const name = t[1];
    const zusammengesetzt = t[2] !== ')';
    if (!zusammengesetzt) {
      if (definiert.has(name) || VON_AUSSEN.has(name)) continue;
      melden('UNBEKANNTES TOKEN ' + name + ' in assets/' + datei);
      continue;
    }
    const treffer = [...definiert].filter((d) => d.indexOf(name) === 0 && d !== name);
    if (!treffer.length) melden('KEIN TOKEN mit dem Stamm ' + name + ' in assets/' + datei);
  }
}

/* ------------------------------------------------------------------
   2. Keine Regel innerhalb einer Regel

   Diese Gestaltung ist bewusst flach geschrieben. Steht ein Selektor
   trotzdem in einem Block, ist das kein Stilmittel, sondern ein
   verrutschter Zeilenblock – und seit CSS-Verschachtelung bedeutet er
   etwas anderes als gemeint.
   ------------------------------------------------------------------ */

let tiefe = 0;
let atTiefe = [];         // Verschachtelungstiefen, die zu @media & Co. gehören
let letzterSelektor = '';
let sammler = '';

for (let i = 0; i < ohneKommentar.length; i++) {
  const z = ohneKommentar[i];
  if (z === '{') {
    const roh = sammler.trim();
    const istAt = roh.charAt(0) === '@';
    /* Innerhalb eines @media & Co. ist Tiefe 1 normal – dort stehen die
       Regeln. Gezählt wird die Tiefe ohne die At-Regeln. */
    const echteTiefe = tiefe - atTiefe.length;
    if (echteTiefe > 0 && !istAt) {
      melden('REGEL IN REGEL: „' + roh.replace(/\s+/g, ' ').slice(0, 60)
        + '“ steht in „' + letzterSelektor.replace(/\s+/g, ' ').slice(0, 40)
        + '“ – Zeile ' + zeileVon(i)
        + ' (trifft als verschachtelte Regel ein Kind, nicht die Abwandlung)');
    }
    if (istAt) atTiefe.push(tiefe);
    else if (echteTiefe === 0) letzterSelektor = roh;
    tiefe++;
    sammler = '';
    continue;
  }
  if (z === '}') {
    tiefe = Math.max(0, tiefe - 1);
    if (atTiefe.length && atTiefe[atTiefe.length - 1] === tiefe) atTiefe.pop();
    sammler = '';
    continue;
  }
  if (z === ';') { sammler = ''; continue; }
  sammler += z;
}

console.log('\n===== ' + fehler + ' Beanstandungen =====');
process.exit(fehler ? 1 : 0);
