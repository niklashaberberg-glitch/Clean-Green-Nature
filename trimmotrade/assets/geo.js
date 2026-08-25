/* =====================================================================
   TrimmoTrade – Städte, Viertel, Mietspiegel
   Koordinaten sind auf drei Nachkommastellen gerundete Näherungen; sie
   dienen der Karte, den Entfernungen und den Pendelzeiten.
   Die Miet- und Kaufwerte sind Orientierungswerte je Quadratmeter.
   ===================================================================== */
(function (TT) {
  'use strict';

  /* d: [Name, lat, lng, Lagefaktor, Kurzcharakter, ÖPNV 0-5, Grün 0-5, Ruhe 0-5, Einkauf 0-5, Ausgehen 0-5] */
  const CITIES = [
    {
      name: 'Köln', state: 'NRW', lat: 50.938, lng: 6.960, einwohner: 1087000,
      mietBasis: 14.0, kaufBasis: 4700,
      districts: [
        ['Altstadt-Nord', 50.941, 6.959, 1.18, 'Zentral, laut, alles zu Fuß', 5, 2, 1, 5, 5],
        ['Ehrenfeld', 50.951, 6.917, 1.10, 'Kreativ, gastronomisch dicht', 5, 3, 2, 4, 5],
        ['Nippes', 50.967, 6.949, 1.00, 'Bodenständig, viele Familien', 4, 3, 3, 4, 3],
        ['Sülz', 50.917, 6.926, 1.12, 'Ruhig, Uni-nah, gepflegt', 4, 4, 4, 4, 3],
        ['Lindenthal', 50.929, 6.905, 1.15, 'Grün, teuer, Stadtwald', 3, 5, 4, 4, 2],
        ['Deutz', 50.937, 6.976, 1.02, 'Rheinseite, gut angebunden', 5, 3, 2, 3, 3],
        ['Kalk', 50.940, 7.010, 0.86, 'Günstig, im Wandel', 4, 2, 2, 4, 3],
        ['Mülheim', 50.964, 7.007, 0.88, 'Rau, ehrlich, günstiger', 4, 3, 3, 4, 3],
        ['Rodenkirchen', 50.888, 6.982, 1.08, 'Rheinnah, familiär, ruhig', 3, 5, 5, 3, 2],
        ['Sülz-Klettenberg', 50.911, 6.921, 1.10, 'Altbau, Bäume, Cafés', 4, 4, 4, 3, 3]
      ]
    },
    {
      name: 'Berlin', state: 'Berlin', lat: 52.520, lng: 13.405, einwohner: 3880000,
      mietBasis: 14.5, kaufBasis: 5200,
      districts: [
        ['Mitte', 52.520, 13.405, 1.20, 'Zentral, touristisch, teuer', 5, 2, 1, 5, 5],
        ['Prenzlauer Berg', 52.540, 13.424, 1.16, 'Altbau, Spielplätze, Cafés', 5, 4, 3, 4, 4],
        ['Kreuzberg', 52.499, 13.403, 1.12, 'Dicht, laut, lebendig', 5, 3, 1, 4, 5],
        ['Friedrichshain', 52.515, 13.454, 1.08, 'Jung, Nachtleben, Plattenbau-Mix', 5, 3, 2, 4, 5],
        ['Neukölln', 52.481, 13.435, 0.98, 'Vielfältig, im Umbruch', 4, 3, 2, 4, 5],
        ['Charlottenburg', 52.505, 13.303, 1.10, 'Bürgerlich, breite Straßen', 5, 4, 3, 5, 3],
        ['Schöneberg', 52.483, 13.355, 1.06, 'Gemischt, queer, gewachsen', 5, 3, 3, 4, 4],
        ['Wedding', 52.550, 13.365, 0.90, 'Günstig, unaufgeregt', 4, 3, 3, 4, 3],
        ['Lichtenberg', 52.515, 13.498, 0.84, 'Preiswert, viel Bestand', 4, 3, 3, 3, 2],
        ['Pankow', 52.569, 13.402, 0.94, 'Ruhig, familiengeeignet', 4, 4, 4, 4, 2]
      ]
    },
    {
      name: 'Hamburg', state: 'Hamburg', lat: 53.551, lng: 9.993, einwohner: 1900000,
      mietBasis: 15.0, kaufBasis: 6000,
      districts: [
        ['St. Pauli', 53.556, 9.964, 1.10, 'Laut, nah am Hafen', 5, 2, 1, 4, 5],
        ['Altona-Altstadt', 53.550, 9.935, 1.08, 'Elbnah, dicht, urban', 5, 3, 2, 4, 4],
        ['Ottensen', 53.553, 9.925, 1.14, 'Beliebt, Cafés, Familien', 5, 3, 3, 5, 4],
        ['Eimsbüttel', 53.575, 9.955, 1.12, 'Altbau, Grünanlagen', 5, 4, 3, 4, 4],
        ['Winterhude', 53.594, 10.010, 1.16, 'Alster, gepflegt, teuer', 4, 5, 4, 4, 3],
        ['Barmbek-Süd', 53.586, 10.041, 0.98, 'Solide, gut angebunden', 5, 3, 3, 4, 3],
        ['Wandsbek', 53.581, 10.086, 0.90, 'Bezahlbar, außen', 4, 4, 4, 4, 2],
        ['HafenCity', 53.541, 9.999, 1.22, 'Neubau, Wasser, Nachverdichtung', 4, 2, 3, 3, 3],
        ['Harburg', 53.460, 9.983, 0.80, 'Weit draußen, günstig', 3, 4, 4, 3, 2]
      ]
    },
    {
      name: 'München', state: 'Bayern', lat: 48.137, lng: 11.575, einwohner: 1512000,
      mietBasis: 21.5, kaufBasis: 9500,
      districts: [
        ['Maxvorstadt', 48.150, 11.565, 1.16, 'Uni, Museen, zentral', 5, 3, 2, 4, 4],
        ['Schwabing-West', 48.166, 11.586, 1.14, 'Altbau, Englischer Garten', 5, 5, 3, 4, 4],
        ['Haidhausen', 48.132, 11.594, 1.15, 'Franzosenviertel, gefragt', 5, 4, 3, 4, 4],
        ['Neuhausen', 48.155, 11.535, 1.10, 'Gewachsen, familiär', 4, 4, 4, 4, 3],
        ['Sendling', 48.116, 11.545, 1.02, 'Bodenständig, Isar-nah', 4, 4, 3, 4, 3],
        ['Giesing', 48.108, 11.586, 0.96, 'Im Wandel, noch bezahlbar', 4, 3, 3, 3, 3],
        ['Bogenhausen', 48.150, 11.616, 1.18, 'Villen, ruhig, teuer', 4, 5, 5, 3, 2],
        ['Laim', 48.138, 11.505, 0.98, 'Ruhig, gute S-Bahn', 4, 4, 4, 4, 2],
        ['Moosach', 48.180, 11.508, 0.92, 'Außen, preiswerter', 4, 3, 4, 4, 2]
      ]
    },
    {
      name: 'Frankfurt', state: 'Hessen', lat: 50.110, lng: 8.682, einwohner: 773000,
      mietBasis: 16.5, kaufBasis: 6200,
      districts: [
        ['Nordend', 50.126, 8.686, 1.16, 'Altbau, ruhig, beliebt', 5, 4, 3, 4, 4],
        ['Bockenheim', 50.122, 8.645, 1.02, 'Uni, gemischt, lebendig', 5, 3, 2, 4, 4],
        ['Sachsenhausen', 50.098, 8.683, 1.12, 'Main-Süd, Apfelwein', 4, 4, 3, 4, 5],
        ['Bornheim', 50.128, 8.708, 1.06, 'Dorf in der Stadt', 5, 4, 3, 5, 4],
        ['Ostend', 50.114, 8.707, 1.04, 'EZB, Neubau, im Wandel', 5, 3, 3, 3, 3],
        ['Westend-Süd', 50.119, 8.664, 1.20, 'Gründerzeit, teuer', 5, 4, 3, 4, 3],
        ['Gallus', 50.104, 8.639, 0.92, 'Preiswert, Nachverdichtung', 4, 2, 2, 4, 3],
        ['Höchst', 50.101, 8.548, 0.80, 'Außen, günstig, Altstadt', 3, 3, 3, 3, 2]
      ]
    },
    {
      name: 'Stuttgart', state: 'BW', lat: 48.775, lng: 9.182, einwohner: 632000,
      mietBasis: 15.5, kaufBasis: 5300,
      districts: [
        ['Mitte', 48.775, 9.180, 1.14, 'Kessel, alles nah', 5, 2, 1, 5, 4],
        ['West', 48.775, 9.157, 1.12, 'Dichter Altbau, beliebt', 5, 3, 2, 4, 4],
        ['Süd', 48.760, 9.171, 1.06, 'Hanglage, Aussicht', 4, 4, 3, 4, 4],
        ['Ost', 48.786, 9.208, 1.00, 'Gemischt, gute Lagen', 4, 3, 3, 4, 3],
        ['Bad Cannstatt', 48.804, 9.219, 0.92, 'Eigener Kern, Neckar', 5, 3, 3, 4, 3],
        ['Vaihingen', 48.729, 9.111, 0.94, 'Uni, S-Bahn, ruhig', 4, 4, 4, 4, 2],
        ['Feuerbach', 48.809, 9.161, 0.90, 'Arbeiterviertel, preiswert', 4, 3, 3, 4, 2],
        ['Degerloch', 48.746, 9.170, 1.08, 'Oben, ruhig, familiär', 4, 5, 5, 3, 2]
      ]
    },
    {
      name: 'Düsseldorf', state: 'NRW', lat: 51.227, lng: 6.773, einwohner: 631000,
      mietBasis: 13.5, kaufBasis: 4600,
      districts: [
        ['Altstadt', 51.227, 6.773, 1.16, 'Rheinnah, laut, zentral', 5, 3, 1, 4, 5],
        ['Flingern-Nord', 51.229, 6.807, 1.08, 'Szene, Cafés, gefragt', 5, 3, 2, 4, 5],
        ['Pempelfort', 51.239, 6.784, 1.12, 'Altbau, Hofgarten', 5, 4, 3, 4, 4],
        ['Bilk', 51.209, 6.780, 1.04, 'Uni, jung, gemischt', 5, 3, 3, 4, 4],
        ['Unterbilk', 51.213, 6.766, 1.10, 'Medienhafen, gepflegt', 4, 3, 3, 4, 4],
        ['Oberkassel', 51.231, 6.752, 1.20, 'Linksrheinisch, teuer', 4, 4, 4, 4, 3],
        ['Friedrichstadt', 51.213, 6.788, 1.02, 'Zentral, Bahnhof-nah', 5, 2, 2, 4, 3],
        ['Gerresheim', 51.231, 6.868, 0.88, 'Außen, ruhig, günstiger', 3, 4, 4, 3, 2]
      ]
    },
    {
      name: 'Leipzig', state: 'Sachsen', lat: 51.340, lng: 12.375, einwohner: 628000,
      mietBasis: 9.5, kaufBasis: 3000,
      districts: [
        ['Zentrum-Süd', 51.331, 12.375, 1.12, 'Zentral, Altbau', 5, 3, 2, 4, 4],
        ['Südvorstadt', 51.320, 12.371, 1.14, 'Karli, jung, lebendig', 5, 4, 2, 4, 5],
        ['Plagwitz', 51.328, 12.335, 1.08, 'Industriekultur, Kanal', 4, 4, 3, 4, 4],
        ['Connewitz', 51.303, 12.376, 1.04, 'Alternativ, grün', 4, 4, 3, 3, 4],
        ['Schleußig', 51.320, 12.348, 1.10, 'Auwald, Familien', 4, 5, 4, 3, 3],
        ['Gohlis', 51.362, 12.365, 1.02, 'Gründerzeit, ruhig', 4, 4, 4, 4, 2],
        ['Reudnitz', 51.339, 12.417, 0.90, 'Preiswert, Nachverdichtung', 4, 3, 3, 4, 3],
        ['Grünau', 51.315, 12.290, 0.72, 'Platte, sehr günstig', 4, 4, 4, 3, 1]
      ]
    },
    {
      name: 'Dresden', state: 'Sachsen', lat: 51.050, lng: 13.738, einwohner: 566000,
      mietBasis: 9.3, kaufBasis: 2900,
      districts: [
        ['Äußere Neustadt', 51.064, 13.746, 1.14, 'Szeneviertel, dicht', 5, 3, 2, 4, 5],
        ['Innere Altstadt', 51.049, 13.738, 1.12, 'Repräsentativ, zentral', 5, 3, 2, 4, 4],
        ['Striesen', 51.041, 13.788, 1.06, 'Villen, Bäume, ruhig', 4, 5, 4, 4, 2],
        ['Löbtau', 51.043, 13.702, 0.96, 'Preiswert, gewachsen', 4, 3, 3, 4, 3],
        ['Pieschen', 51.077, 13.723, 0.94, 'Elbe-nah, im Aufwind', 4, 4, 3, 4, 3],
        ['Blasewitz', 51.052, 13.801, 1.10, 'Elbhang, gehoben', 4, 5, 4, 3, 2],
        ['Gorbitz', 51.037, 13.673, 0.70, 'Platte, sehr günstig', 4, 4, 4, 3, 1]
      ]
    },
    {
      name: 'Münster', state: 'NRW', lat: 51.962, lng: 7.626, einwohner: 320000,
      mietBasis: 12.5, kaufBasis: 4400,
      districts: [
        ['Zentrum', 51.962, 7.626, 1.14, 'Alles mit dem Rad', 4, 3, 2, 5, 4],
        ['Kreuzviertel', 51.968, 7.618, 1.16, 'Studentisch, beliebt', 4, 4, 3, 4, 4],
        ['Hansaviertel', 51.953, 7.637, 1.06, 'Jung, günstiger, laut', 4, 3, 2, 4, 4],
        ['Geist', 51.947, 7.620, 1.04, 'Ruhig, Aasee-nah', 3, 5, 4, 3, 2],
        ['Mauritz', 51.963, 7.648, 1.02, 'Gewachsen, gemischt', 4, 4, 4, 4, 2],
        ['Gievenbeck', 51.968, 7.577, 0.92, 'Uni-Klinik, Neubau', 3, 4, 4, 4, 2]
      ]
    }
  ];

  /* Flache Liste aller Viertel, mit Rückverweis auf die Stadt. */
  const DISTRICTS = [];
  CITIES.forEach((c) => {
    c.districtList = c.districts.map((d) => {
      const obj = {
        name: d[0], city: c.name, lat: d[1], lng: d[2], lagefaktor: d[3], charakter: d[4],
        oepnv: d[5], gruen: d[6], ruhe: d[7], einkauf: d[8], ausgehen: d[9],
        mietBasis: Math.round(c.mietBasis * d[3] * 10) / 10,
        kaufBasis: Math.round(c.kaufBasis * d[3] / 10) * 10,
        key: c.name + '|' + d[0]
      };
      DISTRICTS.push(obj);
      return obj;
    });
    delete c.districts;
  });

  const cityByName = {};
  CITIES.forEach((c) => { cityByName[c.name] = c; });

  const districtByKey = {};
  DISTRICTS.forEach((d) => { districtByKey[d.key] = d; });

  /* Vergleichsmiete je m² – Baujahr und Größe verändern den Wert spürbar.
     Kleine Wohnungen kosten je m² mehr, alte Bausubstanz ohne Sanierung
     weniger, Neubau deutlich mehr. */
  function vergleichsmiete(district, area, year, saniert) {
    const d = typeof district === 'string' ? districtByKey[district] : district;
    if (!d) return 0;
    let v = d.mietBasis;
    if (year >= 2020) v *= 1.28;
    else if (year >= 2010) v *= 1.16;
    else if (year >= 1995) v *= 1.06;
    else if (year >= 1978) v *= 0.96;
    else if (year >= 1949) v *= saniert ? 1.00 : 0.88;
    else v *= saniert ? 1.10 : 0.94;
    if (area < 35) v *= 1.22;
    else if (area < 50) v *= 1.10;
    else if (area < 70) v *= 1.02;
    else if (area > 110) v *= 0.94;
    else if (area > 140) v *= 0.90;
    return Math.round(v * 100) / 100;
  }

  function vergleichskaufpreis(district, area, year) {
    const d = typeof district === 'string' ? districtByKey[district] : district;
    if (!d) return 0;
    let v = d.kaufBasis;
    if (year >= 2020) v *= 1.30;
    else if (year >= 2010) v *= 1.15;
    else if (year >= 1995) v *= 1.04;
    else if (year >= 1949) v *= 0.90;
    else v *= 1.02;
    if (area < 45) v *= 1.10;
    else if (area > 120) v *= 0.95;
    return Math.round(v);
  }

  TT.geo = { CITIES, DISTRICTS, cityByName, districtByKey, vergleichsmiete, vergleichskaufpreis };
})(window.TT = window.TT || {});
