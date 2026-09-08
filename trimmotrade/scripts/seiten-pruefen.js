/* =====================================================================
   Prüft die statischen Seiten – die Startseite, die acht Ratgeber und
   die Fehlerseite.

   Diese Seiten sind der einzige Teil von TrimmoTrade, den eine
   Suchmaschine überhaupt lesen kann: Die Anwendung selbst lebt hinter
   dem Rautezeichen und ist für einen Indexierer eine leere Seite. Was
   hier falsch steht, kostet deshalb nicht Schönheit, sondern Besucher –
   und zwar still. Ein canonical auf die falsche Datei führt dazu, dass
   Google die Seite gar nicht führt; ein toter interner Verweis kostet
   den Rang der Zielseite mit.

   Geprüft wird, was sich ohne Netz prüfen lässt:

     · jeder interne Verweis zeigt auf eine Datei, die es gibt
     · canonical und og:url zeigen auf die eigene Datei
     · Titel und Beschreibung sind da, in brauchbarer Länge und
       über alle Seiten hinweg verschieden
     · das strukturierte Datenblatt (JSON-LD) ist gültiges JSON und
       nennt dieselbe Adresse wie das canonical
     · genau eine <h1>, und keine Überschrift überspringt eine Stufe
     · jedes eingebundene Bild und jede Datei aus dem Kopf liegt da
     · kein „undefined“, „null“ oder „[object Object]“ im Text –
       die Spur einer Vorlage, in die nichts eingesetzt wurde

     node scripts/seiten-pruefen.js
   ===================================================================== */
const fs = require('fs');
const path = require('path');

const wurzel = path.join(__dirname, '..');
const BASIS = 'https://www.trimmotrade.de';

let fehler = 0;
const melden = (datei, text) => { console.log('  ✗ [' + datei + '] ' + text); fehler++; };

const seiten = fs.readdirSync(wurzel).filter((f) => f.endsWith('.html')).sort();
const titel = new Map();
const beschreibungen = new Map();

/* Alle Klassennamen, für die es im Stil eine Regel gibt. Kommentare
   fliegen vorher raus – in ihnen stehen Beispiele. */
const cssRoh = fs.readFileSync(path.join(wurzel, 'assets', 'app.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, ' ');
const cssKlassen = new Set([...cssRoh.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]));
const benutzteKlassen = new Set();

/* Anführungszeichen im Attribut sind hier immer gerade – die Seiten
   entstehen aus scripts/seiten-bauen.js und nicht von Hand. */
const attr = (html, re) => { const m = html.match(re); return m ? m[1].trim() : ''; };

for (const datei of seiten) {
  const html = fs.readFileSync(path.join(wurzel, datei), 'utf8');
  const istFehlerseite = datei === '404.html';

  /* ---------- Titel und Beschreibung ---------- */
  const t = attr(html, /<title>([^<]*)<\/title>/i);
  const b = attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i);

  if (!t) melden(datei, 'kein <title>');
  else {
    if (t.length > 65) melden(datei, 'Titel ist ' + t.length + ' Zeichen lang – über 65 wird abgeschnitten');
    if (titel.has(t)) melden(datei, 'Titel gleicht dem von ' + titel.get(t) + ' – doppelte Titel konkurrieren miteinander');
    else titel.set(t, datei);
  }
  if (!b) melden(datei, 'keine description');
  else if (!istFehlerseite) {
    /* Die Längen gelten für Seiten, die in einer Trefferliste stehen
       sollen. Die Fehlerseite steht dort nie – ihre Beschreibung darf
       kurz sein, und sie künstlich zu strecken wäre Zierrat. */
    if (b.length < 70) melden(datei, 'description ist mit ' + b.length + ' Zeichen zu knapp');
    if (b.length > 165) melden(datei, 'description ist ' + b.length + ' Zeichen lang – über 165 wird abgeschnitten');
    if (beschreibungen.has(b)) melden(datei, 'description gleicht der von ' + beschreibungen.get(b));
    else beschreibungen.set(b, datei);
  }

  /* ---------- canonical und og:url ---------- */
  const soll = BASIS + (datei === 'index.html' ? '/' : '/' + datei);
  const can = attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const og = attr(html, /<meta\s+property="og:url"\s+content="([^"]*)"/i);
  if (istFehlerseite) {
    /* Eine Seite auf noindex, die sich zugleich als indexierbarer
       Artikel ausgibt, sendet zwei einander widersprechende Signale.
       Welches gewinnt, entscheidet dann die Suchmaschine. */
    if (can) melden(datei, 'die Fehlerseite hat ein canonical – sie gehört nicht in den Index');
    if (!/noindex/i.test(html)) melden(datei, 'die Fehlerseite steht nicht auf noindex');
    if (/property="og:/i.test(html)) melden(datei, 'die Fehlerseite trägt og:-Angaben');
    if (/application\/ld\+json/i.test(html)) melden(datei, 'die Fehlerseite trägt ein strukturiertes Datenblatt');
  } else {
    if (can !== soll) melden(datei, 'canonical ist „' + can + '“, richtig wäre „' + soll + '“');
    if (og && og !== soll) melden(datei, 'og:url ist „' + og + '“, richtig wäre „' + soll + '“');
  }

  /* ---------- strukturierte Daten ---------- */
  const bloecke = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, roh] of bloecke) {
    let daten;
    try { daten = JSON.parse(roh); } catch (e) {
      melden(datei, 'strukturierte Daten sind kein gültiges JSON: ' + e.message);
      continue;
    }
    const alsText = JSON.stringify(daten);
    for (const wort of ['undefined', '[object Object]']) {
      if (alsText.indexOf(wort) >= 0) melden(datei, '„' + wort + '“ steht in den strukturierten Daten');
    }
    if (!istFehlerseite && alsText.indexOf(soll) < 0) {
      melden(datei, 'die strukturierten Daten nennen die eigene Adresse ' + soll + ' nicht');
    }
    /* Jede Frage einer FAQ braucht eine Antwort mit Text – eine leere
       Antwort führt in der Suchvorschau zu einer leeren Zeile. */
    const fragen = (function sammle(k) {
      if (Array.isArray(k)) return k.flatMap(sammle);
      if (k && typeof k === 'object') {
        return (k['@type'] === 'Question' ? [k] : []).concat(Object.values(k).flatMap(sammle));
      }
      return [];
    })(daten);
    for (const f of fragen) {
      const a = f.acceptedAnswer && f.acceptedAnswer.text;
      if (!f.name) melden(datei, 'eine FAQ-Frage ohne Text');
      if (!a || String(a).trim().length < 20) melden(datei, 'FAQ „' + (f.name || '?') + '“ ohne brauchbare Antwort');
    }
  }

  /* ---------- Überschriften ---------- */
  const ueber = [...html.matchAll(/<h([1-6])[^>]*>/gi)].map((m) => Number(m[1]));
  const einsen = ueber.filter((n) => n === 1).length;
  if (einsen !== 1) melden(datei, einsen + ' Hauptüberschriften – genau eine gehört auf eine Seite');
  for (let i = 1; i < ueber.length; i++) {
    if (ueber[i] - ueber[i - 1] > 1) {
      melden(datei, 'Überschrift springt von h' + ueber[i - 1] + ' auf h' + ueber[i]);
      break;
    }
  }

  /* ---------- Verweise und Dateien ---------- */
  const wege = new Set();
  for (const [, w] of html.matchAll(/(?:href|src)="([^"]+)"/gi)) wege.add(w);
  for (const weg of wege) {
    if (/^(https?:|mailto:|tel:|data:|#)/i.test(weg)) continue;
    /* Ein Verweis in die Anwendung: /#/suche – die Datei ist index.html. */
    const ohneFragment = weg.split('#')[0];
    if (!ohneFragment) continue;
    const rel = ohneFragment.replace(/^\//, '');
    if (!fs.existsSync(path.join(wurzel, rel))) {
      melden(datei, 'toter Verweis auf „' + weg + '“ – die Datei gibt es nicht');
    }
  }

  /* Jedes Bild braucht einen Alternativtext; ein leerer ist erlaubt und
     heißt „schmückend“, ein fehlender ist ein Versäumnis. */
  for (const [ganz] of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=/.test(ganz)) melden(datei, 'ein <img> ohne alt: ' + ganz.slice(0, 70));
  }

  /* ---------- Spuren einer nicht gefüllten Vorlage ---------- */
  const koerper = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ');
  for (const wort of ['undefined', '[object Object]', 'NaN €', '{0}', '{1}']) {
    if (koerper.indexOf(wort) >= 0) melden(datei, '„' + wort + '“ steht im sichtbaren Text');
  }

  /* ---------- Sprache ---------- */
  if (!/<html[^>]+lang="de"/i.test(html)) melden(datei, 'kein lang="de" am <html>');

  /* ---------- Klassen ohne Regel ----------
     Diese Seiten binden denselben Stil ein wie die Anwendung, benutzen
     davon aber nur einen Ausschnitt. Verschwindet beim Umbauen der
     Anwendung eine Regel, die nur hier gebraucht wird, fällt es nirgends
     auf: Die Seite bleibt lesbar, sie sieht nur falsch aus – und
     niemand sieht sie sich täglich an. Genau so ist .fuss__links einmal
     verlorengegangen.

     Geprüft werden nur eigene Klassen. Zustandsklassen (is-…) werden
     vom Skript gesetzt und stehen manchmal nur dort. */
  for (const [, liste] of html.matchAll(/\bclass="([^"]+)"/gi)) {
    for (const k of liste.split(/\s+/)) {
      if (!k || k.startsWith('is-') || benutzteKlassen.has(k)) continue;
      benutzteKlassen.add(k);
      if (!cssKlassen.has(k)) melden(datei, 'Klasse „' + k + '“ hat keine Regel in assets/app.css');
    }
  }
}

/* ---------- Sitemap gegen das Verzeichnis ---------- */
const sitemap = fs.readFileSync(path.join(wurzel, 'sitemap.xml'), 'utf8');
const drin = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const datei of seiten) {
  if (datei === '404.html') {
    if (drin.some((u) => u.endsWith('/404.html'))) melden('sitemap.xml', 'die Fehlerseite steht in der Sitemap');
    continue;
  }
  const soll = BASIS + (datei === 'index.html' ? '/' : '/' + datei);
  if (drin.indexOf(soll) < 0) melden('sitemap.xml', datei + ' fehlt in der Sitemap');
}
for (const u of drin) {
  const rel = u.replace(BASIS + '/', '') || 'index.html';
  if (!fs.existsSync(path.join(wurzel, rel))) melden('sitemap.xml', 'führt auf ' + u + ' – die Datei gibt es nicht');
}
if (sitemap.indexOf(BASIS) < 0) melden('sitemap.xml', 'nennt eine andere Adresse als ' + BASIS);

/* ---------- robots.txt ---------- */
const robots = fs.readFileSync(path.join(wurzel, 'robots.txt'), 'utf8');
if (robots.indexOf('Sitemap: ' + BASIS + '/sitemap.xml') < 0) {
  melden('robots.txt', 'verweist nicht auf ' + BASIS + '/sitemap.xml');
}
if (!/Disallow:\s*\/api\//.test(robots)) melden('robots.txt', 'sperrt /api/ nicht');

console.log('\n===== ' + seiten.length + ' Seiten geprüft · ' + fehler + ' Beanstandungen =====');
process.exit(fehler ? 1 : 0);
