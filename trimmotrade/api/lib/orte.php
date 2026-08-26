<?php
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
    'Köln|Altstadt-Nord' => ['Köln', 'Altstadt-Nord', 50.941, 6.959],
    'Köln|Ehrenfeld' => ['Köln', 'Ehrenfeld', 50.951, 6.917],
    'Köln|Nippes' => ['Köln', 'Nippes', 50.967, 6.949],
    'Köln|Sülz' => ['Köln', 'Sülz', 50.917, 6.926],
    'Köln|Lindenthal' => ['Köln', 'Lindenthal', 50.929, 6.905],
    'Köln|Deutz' => ['Köln', 'Deutz', 50.937, 6.976],
    'Köln|Kalk' => ['Köln', 'Kalk', 50.94, 7.01],
    'Köln|Mülheim' => ['Köln', 'Mülheim', 50.964, 7.007],
    'Köln|Rodenkirchen' => ['Köln', 'Rodenkirchen', 50.888, 6.982],
    'Köln|Sülz-Klettenberg' => ['Köln', 'Sülz-Klettenberg', 50.911, 6.921],
    'Berlin|Mitte' => ['Berlin', 'Mitte', 52.52, 13.405],
    'Berlin|Prenzlauer Berg' => ['Berlin', 'Prenzlauer Berg', 52.54, 13.424],
    'Berlin|Kreuzberg' => ['Berlin', 'Kreuzberg', 52.499, 13.403],
    'Berlin|Friedrichshain' => ['Berlin', 'Friedrichshain', 52.515, 13.454],
    'Berlin|Neukölln' => ['Berlin', 'Neukölln', 52.481, 13.435],
    'Berlin|Charlottenburg' => ['Berlin', 'Charlottenburg', 52.505, 13.303],
    'Berlin|Schöneberg' => ['Berlin', 'Schöneberg', 52.483, 13.355],
    'Berlin|Wedding' => ['Berlin', 'Wedding', 52.55, 13.365],
    'Berlin|Lichtenberg' => ['Berlin', 'Lichtenberg', 52.515, 13.498],
    'Berlin|Pankow' => ['Berlin', 'Pankow', 52.569, 13.402],
    'Hamburg|St. Pauli' => ['Hamburg', 'St. Pauli', 53.556, 9.964],
    'Hamburg|Altona-Altstadt' => ['Hamburg', 'Altona-Altstadt', 53.55, 9.935],
    'Hamburg|Ottensen' => ['Hamburg', 'Ottensen', 53.553, 9.925],
    'Hamburg|Eimsbüttel' => ['Hamburg', 'Eimsbüttel', 53.575, 9.955],
    'Hamburg|Winterhude' => ['Hamburg', 'Winterhude', 53.594, 10.01],
    'Hamburg|Barmbek-Süd' => ['Hamburg', 'Barmbek-Süd', 53.586, 10.041],
    'Hamburg|Wandsbek' => ['Hamburg', 'Wandsbek', 53.581, 10.086],
    'Hamburg|HafenCity' => ['Hamburg', 'HafenCity', 53.541, 9.999],
    'Hamburg|Harburg' => ['Hamburg', 'Harburg', 53.46, 9.983],
    'München|Maxvorstadt' => ['München', 'Maxvorstadt', 48.15, 11.565],
    'München|Schwabing-West' => ['München', 'Schwabing-West', 48.166, 11.586],
    'München|Haidhausen' => ['München', 'Haidhausen', 48.132, 11.594],
    'München|Neuhausen' => ['München', 'Neuhausen', 48.155, 11.535],
    'München|Sendling' => ['München', 'Sendling', 48.116, 11.545],
    'München|Giesing' => ['München', 'Giesing', 48.108, 11.586],
    'München|Bogenhausen' => ['München', 'Bogenhausen', 48.15, 11.616],
    'München|Laim' => ['München', 'Laim', 48.138, 11.505],
    'München|Moosach' => ['München', 'Moosach', 48.18, 11.508],
    'Frankfurt|Nordend' => ['Frankfurt', 'Nordend', 50.126, 8.686],
    'Frankfurt|Bockenheim' => ['Frankfurt', 'Bockenheim', 50.122, 8.645],
    'Frankfurt|Sachsenhausen' => ['Frankfurt', 'Sachsenhausen', 50.098, 8.683],
    'Frankfurt|Bornheim' => ['Frankfurt', 'Bornheim', 50.128, 8.708],
    'Frankfurt|Ostend' => ['Frankfurt', 'Ostend', 50.114, 8.707],
    'Frankfurt|Westend-Süd' => ['Frankfurt', 'Westend-Süd', 50.119, 8.664],
    'Frankfurt|Gallus' => ['Frankfurt', 'Gallus', 50.104, 8.639],
    'Frankfurt|Höchst' => ['Frankfurt', 'Höchst', 50.101, 8.548],
    'Stuttgart|Mitte' => ['Stuttgart', 'Mitte', 48.775, 9.18],
    'Stuttgart|West' => ['Stuttgart', 'West', 48.775, 9.157],
    'Stuttgart|Süd' => ['Stuttgart', 'Süd', 48.76, 9.171],
    'Stuttgart|Ost' => ['Stuttgart', 'Ost', 48.786, 9.208],
    'Stuttgart|Bad Cannstatt' => ['Stuttgart', 'Bad Cannstatt', 48.804, 9.219],
    'Stuttgart|Vaihingen' => ['Stuttgart', 'Vaihingen', 48.729, 9.111],
    'Stuttgart|Feuerbach' => ['Stuttgart', 'Feuerbach', 48.809, 9.161],
    'Stuttgart|Degerloch' => ['Stuttgart', 'Degerloch', 48.746, 9.17],
    'Düsseldorf|Altstadt' => ['Düsseldorf', 'Altstadt', 51.227, 6.773],
    'Düsseldorf|Flingern-Nord' => ['Düsseldorf', 'Flingern-Nord', 51.229, 6.807],
    'Düsseldorf|Pempelfort' => ['Düsseldorf', 'Pempelfort', 51.239, 6.784],
    'Düsseldorf|Bilk' => ['Düsseldorf', 'Bilk', 51.209, 6.78],
    'Düsseldorf|Unterbilk' => ['Düsseldorf', 'Unterbilk', 51.213, 6.766],
    'Düsseldorf|Oberkassel' => ['Düsseldorf', 'Oberkassel', 51.231, 6.752],
    'Düsseldorf|Friedrichstadt' => ['Düsseldorf', 'Friedrichstadt', 51.213, 6.788],
    'Düsseldorf|Gerresheim' => ['Düsseldorf', 'Gerresheim', 51.231, 6.868],
    'Leipzig|Zentrum-Süd' => ['Leipzig', 'Zentrum-Süd', 51.331, 12.375],
    'Leipzig|Südvorstadt' => ['Leipzig', 'Südvorstadt', 51.32, 12.371],
    'Leipzig|Plagwitz' => ['Leipzig', 'Plagwitz', 51.328, 12.335],
    'Leipzig|Connewitz' => ['Leipzig', 'Connewitz', 51.303, 12.376],
    'Leipzig|Schleußig' => ['Leipzig', 'Schleußig', 51.32, 12.348],
    'Leipzig|Gohlis' => ['Leipzig', 'Gohlis', 51.362, 12.365],
    'Leipzig|Reudnitz' => ['Leipzig', 'Reudnitz', 51.339, 12.417],
    'Leipzig|Grünau' => ['Leipzig', 'Grünau', 51.315, 12.29],
    'Dresden|Äußere Neustadt' => ['Dresden', 'Äußere Neustadt', 51.064, 13.746],
    'Dresden|Innere Altstadt' => ['Dresden', 'Innere Altstadt', 51.049, 13.738],
    'Dresden|Striesen' => ['Dresden', 'Striesen', 51.041, 13.788],
    'Dresden|Löbtau' => ['Dresden', 'Löbtau', 51.043, 13.702],
    'Dresden|Pieschen' => ['Dresden', 'Pieschen', 51.077, 13.723],
    'Dresden|Blasewitz' => ['Dresden', 'Blasewitz', 51.052, 13.801],
    'Dresden|Gorbitz' => ['Dresden', 'Gorbitz', 51.037, 13.673],
    'Münster|Zentrum' => ['Münster', 'Zentrum', 51.962, 7.626],
    'Münster|Kreuzviertel' => ['Münster', 'Kreuzviertel', 51.968, 7.618],
    'Münster|Hansaviertel' => ['Münster', 'Hansaviertel', 51.953, 7.637],
    'Münster|Geist' => ['Münster', 'Geist', 51.947, 7.62],
    'Münster|Mauritz' => ['Münster', 'Mauritz', 51.963, 7.648],
    'Münster|Gievenbeck' => ['Münster', 'Gievenbeck', 51.968, 7.577],
    ];

    public const STAEDTE = [
    'Köln',
    'Berlin',
    'Hamburg',
    'München',
    'Frankfurt',
    'Stuttgart',
    'Düsseldorf',
    'Leipzig',
    'Dresden',
    'Münster',
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
