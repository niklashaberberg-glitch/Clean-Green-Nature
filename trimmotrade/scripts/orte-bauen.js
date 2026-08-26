/* =====================================================================
   Orte für die Serverseite erzeugen

   Die Städte und Viertel stehen in assets/geo.js – einmal, für die
   ganze Anwendung. Der Server muss sie trotzdem kennen: Er darf einem
   Inserat nicht glauben, wenn es behauptet, in „Musterhausen|Kernland“
   zu liegen, und er muss Breite und Länge selbst setzen statt sie
   entgegenzunehmen. Sonst könnte ein Inserat auf der Karte überall
   stehen, nur nicht dort, wo die Wohnung ist.

   Zwei Listen von Hand zu pflegen, die auseinanderlaufen, wäre die
   schlechteste aller Lösungen. Deshalb entsteht die PHP-Liste hier aus
   der JavaScript-Liste:

       node scripts/orte-bauen.js

   Läuft mit im Build (build.js ruft es auf), damit niemand es vergisst.
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const wurzel = path.join(__dirname, '..');
const TT = {};
global.window = { TT };
const quelle = fs.readFileSync(path.join(wurzel, 'assets/geo.js'), 'utf8');
// eslint-disable-next-line no-new-func
new Function('window', quelle)(global.window);

const orte = (TT.geo && TT.geo.DISTRICTS) || [];
if (!orte.length) {
  console.error('Keine Viertel gefunden – hat sich der Aufbau von geo.js geändert?');
  process.exit(1);
}

const zeilen = orte.map((d) => {
  const key = String(d.key).replace(/'/g, "\\'");
  const stadt = String(d.city).replace(/'/g, "\\'");
  const name = String(d.name).replace(/'/g, "\\'");
  return `    '${key}' => ['${stadt}', '${name}', ${d.lat}, ${d.lng}],`;
}).join('\n');

const staedte = [...new Set(orte.map((d) => d.city))]
  .map((s) => `    '${String(s).replace(/'/g, "\\'")}',`).join('\n');

const php = `<?php
/* =====================================================================
   Städte und Viertel – erzeugt, nicht von Hand geschrieben

   Diese Datei entsteht aus assets/geo.js:

       node scripts/orte-bauen.js

   Änderungen hier gehen beim nächsten Lauf verloren. Der Server braucht
   die Liste aus einem einzigen Grund: Ein Inserat nennt einen Schlüssel,
   und erst diese Liste macht daraus eine Stadt, ein Viertel und eine
   Stelle auf der Karte. Was nicht in ihr steht, gibt es nicht.
   ===================================================================== */

final class Orte
{
    /** Schlüssel => [Stadt, Viertel, Breite, Länge] */
    public const VIERTEL = [
${zeilen}
    ];

    public const STAEDTE = [
${staedte}
    ];

    public static function gibt(string $key): bool
    {
        return isset(self::VIERTEL[$key]);
    }

    /** @return array{0:string,1:string,2:float,3:float}|null */
    public static function hole(string $key): ?array
    {
        return self::VIERTEL[$key] ?? null;
    }
}
`;

const ziel = path.join(wurzel, 'api/lib/orte.php');
fs.writeFileSync(ziel, php, 'utf8');
console.log('api/lib/orte.php: ' + orte.length + ' Viertel in ' + new Set(orte.map((d) => d.city)).size + ' Städten');
