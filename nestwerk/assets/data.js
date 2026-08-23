/* =====================================================================
   Nestwerk – Bestand
   Erzeugt einen vollständigen, in sich stimmigen Beispielbestand:
   Miet- und Kaufobjekte, WG-Zimmer und Tauschangebote, dazu Anbieter,
   Nachbarn und Nachrichten. Alles deterministisch aus einer festen Saat –
   die App zeigt bei jedem Laden exakt denselben Markt.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;
  const G = NW.geo;
  const SEED = 20260821;

  /* ------------------------- Wortvorräte ------------------------- */

  const VORNAMEN_W = ['Anna', 'Lea', 'Mia', 'Sophie', 'Emma', 'Marie', 'Lena', 'Hannah', 'Clara', 'Julia', 'Nele', 'Pia', 'Ida', 'Frieda', 'Merle', 'Jana', 'Ronja', 'Alina', 'Sarah', 'Yasmin', 'Tuana', 'Mai', 'Katrin', 'Bettina', 'Silke'];
  const VORNAMEN_M = ['Jonas', 'Luca', 'Paul', 'Felix', 'Max', 'Elias', 'Noah', 'Tim', 'Jan', 'Ben', 'Moritz', 'Til', 'Simon', 'David', 'Erik', 'Kaan', 'Ali', 'Milan', 'Hendrik', 'Bastian', 'Thomas', 'Michael', 'Andreas', 'Jörg', 'Ralf'];
  const VORNAMEN_D = ['Kim', 'Alex', 'Robin', 'Toni', 'Charlie', 'Sam', 'Mika', 'Luca'];
  const NACHNAMEN = ['Berger', 'Weber', 'Schneider', 'Hoffmann', 'Krüger', 'Lindner', 'Baumann', 'Vogel', 'Fischer', 'Wagner', 'Roth', 'Sommer', 'Winter', 'Klein', 'Gross', 'Yilmaz', 'Nguyen', 'Kowalski', 'Petrov', 'Rossi', 'Brandt', 'Hartmann', 'Kaiser', 'Lorenz', 'Seibert'];

  /* Berufe in drei Formen, damit die Anrede zum Profil passt. */
  const BERUFE = [
    ['Biologie-Studentin', 'Biologie-Student', 'im Biologiestudium'],
    ['Informatik-Studentin', 'Informatik-Student', 'im Informatikstudium'],
    ['Krankenpflegerin', 'Krankenpfleger', 'in der Pflege'],
    ['Softwareentwicklerin', 'Softwareentwickler', 'in der Softwareentwicklung'],
    ['Grafikdesignerin', 'Grafikdesigner', 'im Grafikdesign'],
    ['Lehrerin', 'Lehrer', 'im Schuldienst'],
    ['Doktorandin', 'Doktorand', 'in der Promotion'],
    ['Physiotherapeutin', 'Physiotherapeut', 'in der Physiotherapie'],
    ['Sozialarbeiterin', 'Sozialarbeiter', 'in der Sozialarbeit'],
    ['Architektin', 'Architekt', 'im Architekturbüro'],
    ['Buchhalterin', 'Buchhalter', 'in der Buchhaltung'],
    ['Köchin', 'Koch', 'in der Gastronomie'],
    ['Musikerin', 'Musiker', 'in der Musik'],
    ['Ingenieurin', 'Ingenieur', 'im Ingenieurwesen'],
    ['Erzieherin', 'Erzieher', 'in der Kita'],
    ['Journalistin', 'Journalist', 'im Journalismus'],
    ['Ärztin im PJ', 'Arzt im PJ', 'im Praktischen Jahr'],
    ['Handwerkerin', 'Handwerker', 'im Handwerk'],
    ['Referendarin', 'Referendar', 'im Referendariat'],
    ['Barista', 'Barista', 'im Café'],
    ['Projektmanagerin', 'Projektmanager', 'im Projektmanagement'],
    ['Tischlerin', 'Tischler', 'in der Tischlerei'],
    ['Übersetzerin', 'Übersetzer', 'im Übersetzen'],
    ['Bühnenbildnerin', 'Bühnenbildner', 'am Theater'],
    ['Pflegefachkraft', 'Pflegefachkraft', 'in der Pflege']
  ];
  const berufFor = (r, g) => { const b = U.pick(r, BERUFE); return g === 'w' ? b[0] : g === 'm' ? b[1] : b[2]; };

  const MAKLER = ['Rheinblick Immobilien GmbH', 'Kontor Wohnen & Leben', 'Stadthaus Immobilien', 'Nord Süd Makler AG', 'Domizil Partner', 'Vier Wände Immobilien', 'Habitat Kontor', 'Erste Adresse Immobilien', 'Quartier Makler', 'Grundstein Immobilien'];
  const VERWALTUNG = ['Hausverwaltung Meinhardt', 'WohnService Mitte GmbH', 'Objektbetreuung Lehmann', 'Immobilienservice Ostwall', 'Verwaltung am Park'];
  const GENOSSENSCHAFT = ['Wohnungsgenossenschaft Eintracht eG', 'Baugenossenschaft Freies Wohnen eG', 'Gemeinnützige Wohnbau eG', 'Siedlungswerk Nord eG'];

  const STRASSEN = ['Lindenstraße', 'Gartenweg', 'Am Wasserturm', 'Blücherstraße', 'Feldstraße', 'Rosenweg', 'Hafenallee', 'Kirchgasse', 'Alte Post', 'Am Sportplatz', 'Mühlenweg', 'Buchenallee', 'Weberstraße', 'Am Grüngürtel', 'Kastanienstraße', 'Uhlandstraße', 'Bergstraße', 'Marktplatz', 'Fasanenweg', 'Schillerstraße', 'Kanalufer', 'Zollhof', 'Sonnenallee', 'Bahnhofstraße'];

  const HEIZUNG = ['Gas-Zentralheizung', 'Fernwärme', 'Wärmepumpe', 'Öl-Zentralheizung', 'Pelletheizung', 'Gasetagenheizung', 'Nachtspeicheröfen'];
  const HEIZ_KWH = { 'Gas-Zentralheizung': 118, 'Fernwärme': 96, 'Wärmepumpe': 46, 'Öl-Zentralheizung': 152, 'Pelletheizung': 88, 'Gasetagenheizung': 138, 'Nachtspeicheröfen': 178 };

  const AUSSTATTUNG = ['Balkon', 'Loggia', 'Terrasse', 'Garten', 'Dachterrasse', 'Einbauküche', 'Aufzug', 'Barrierefrei', 'Stellplatz', 'Garage', 'Keller', 'Fahrradkeller', 'Waschmaschinenanschluss', 'Badewanne', 'Gäste-WC', 'Parkett', 'Dielenboden', 'Fußbodenheizung', 'Möbliert', 'Teilmöbliert', 'Haustiere erlaubt', 'Glasfaser', 'Abstellraum', 'Kamin', 'Denkmalschutz', 'Concierge', 'Gemeinschaftsgarten', 'Paketstation'];

  const WG_ART = ['Studenten-WG', 'Berufstätigen-WG', 'Zweck-WG', 'keine Zweck-WG', 'Männer-WG', 'Frauen-WG', 'gemischte WG', 'LGBTQIA+ freundlich', 'Wohnprojekt', 'Alleinerziehenden-WG', 'Mehrgenerationen-WG', 'Vegetarisch/Vegan'];

  const SPRACHEN = ['Deutsch', 'Englisch', 'Türkisch', 'Spanisch', 'Französisch', 'Polnisch', 'Arabisch', 'Italienisch', 'Ukrainisch', 'Vietnamesisch'];

  /* ------------------------- Textbausteine ------------------------- */

  const T_EROEFFNUNG = {
    altbau: [
      'Charmante Altbauwohnung mit hohen Decken, Stuck und großen Fenstern.',
      'Gewachsener Altbau, ruhig gelegen, mit Blick ins begrünte Hinterhaus.',
      'Klassische Gründerzeitwohnung mit Flügeltüren und Dielenboden.'
    ],
    nachkrieg: [
      'Solide geschnittene Wohnung im gepflegten Mehrfamilienhaus.',
      'Zweckmäßige Wohnung mit gutem Schnitt und praktischer Raumaufteilung.',
      'Helle Wohnung in ruhiger Wohnanlage mit gepflegter Außenanlage.'
    ],
    modern: [
      'Moderne Wohnung mit bodentiefen Fenstern und hochwertiger Ausstattung.',
      'Frisch fertiggestellte Wohnung mit durchdachtem Grundriss.',
      'Energieeffiziente Wohnung im nachhaltigen Neubauquartier.'
    ],
    haus: [
      'Freistehendes Einfamilienhaus mit eigenem Grundstück und Garten.',
      'Gepflegtes Reihenmittelhaus in familienfreundlicher Nachbarschaft.',
      'Doppelhaushälfte mit Süd-Garten und ausgebautem Dachgeschoss.'
    ],
    zimmer: [
      'Helles Zimmer in entspannter WG.',
      'Freies Zimmer in gewachsener Wohngemeinschaft.',
      'Schönes, ruhiges Zimmer mit eigenem Balkonzugang.'
    ]
  };

  const T_ZUSTAND = [
    'Die Wohnung wurde zuletzt vollständig renoviert und ist bezugsfertig.',
    'Bad und Küche wurden vor wenigen Jahren erneuert.',
    'Der Zustand ist gepflegt; kleinere Gebrauchsspuren sind vorhanden.',
    'Vor Einzug werden Wände frisch gestrichen und die Böden aufgearbeitet.',
    'Das Objekt ist unrenoviert und wird im Ist-Zustand übergeben.'
  ];

  const T_LAGE = [
    'Einkaufsmöglichkeiten, Bäckerei und Apotheke sind fußläufig erreichbar.',
    'Die nächste Haltestelle liegt rund fünf Gehminuten entfernt.',
    'Kitas, Grundschule und Spielplatz befinden sich im direkten Umfeld.',
    'Der nächste Park ist in wenigen Minuten zu Fuß erreicht.',
    'Die Straße ist verkehrsberuhigt, abends wird es hier sehr still.',
    'Cafés, kleine Läden und Wochenmarkt prägen das Viertel.'
  ];

  const T_FORMAL = [
    'Bitte bringen Sie zur Besichtigung eine Selbstauskunft und die letzten drei Gehaltsnachweise mit.',
    'Eine Mietschuldenfreiheitsbescheinigung des Vorvermieters wird benötigt.',
    'Die Besichtigung erfolgt in Einzelterminen, nicht als Sammelbesichtigung.',
    'Wir melden uns in der Regel innerhalb von zwei Werktagen zurück.',
    'Ein Wohnberechtigungsschein ist erforderlich.'
  ];

  /* Auffälligkeiten – bewusst eingebaut, damit die Klausel- und
     Risikoprüfung im Betrieb auch tatsächlich etwas zu prüfen hat. */
  const QUIRKS = {
    staffel: 'Vereinbart ist eine Staffelmiete mit jährlicher Erhöhung um 3,5 % ab dem zweiten Mietjahr.',
    index: 'Die Miete ist als Indexmiete an den Verbraucherpreisindex gekoppelt.',
    schoenheit: 'Die Schönheitsreparaturen werden auf den Mieter übertragen und sind bei Auszug fachgerecht auszuführen.',
    abstand: 'Für die vorhandene Einbauküche wird eine Abstandszahlung von 4.500 € an den Vormieter fällig.',
    kaution4: 'Die Kaution beträgt vier Nettokaltmieten und ist vor Schlüsselübergabe vollständig zu hinterlegen.',
    provision: 'Es fällt eine Courtage von 2,38 Nettokaltmieten inkl. MwSt. an, zahlbar durch den Mieter.',
    moebel: 'Für die Möblierung wird ein monatlicher Zuschlag von 180 € zusätzlich zur Kaltmiete erhoben.',
    vorkasse: 'Da ich beruflich im Ausland bin, erfolgt die Schlüsselübergabe per Kurier, nachdem die erste Miete und die Kaution überwiesen wurden.',
    keineBesichtigung: 'Eine Vorabbesichtigung ist leider nicht möglich; die Vergabe erfolgt nach Aktenlage.',
    tierverbot: 'Das Halten von Haustieren jeder Art ist ausnahmslos untersagt.',
    eigenbedarf: 'Der Vermieter behält sich vor, die Wohnung nach zwei Jahren wegen Eigenbedarf zu kündigen.'
  };

  /* ------------------------- Hilfen ------------------------- */

  let idCounter = 0;
  const nextId = (prefix) => prefix + '-' + (++idCounter).toString(36).padStart(3, '0');

  function personName(r, gender) {
    const pool = gender === 'w' ? VORNAMEN_W : gender === 'm' ? VORNAMEN_M : VORNAMEN_D;
    return U.pick(r, pool) + ' ' + U.pick(r, NACHNAMEN);
  }

  function energieKlasse(kwh) {
    if (kwh <= 30) return 'A+';
    if (kwh <= 50) return 'A';
    if (kwh <= 75) return 'B';
    if (kwh <= 100) return 'C';
    if (kwh <= 130) return 'D';
    if (kwh <= 160) return 'E';
    if (kwh <= 200) return 'F';
    if (kwh <= 250) return 'G';
    return 'H';
  }

  function dateOffset(days) {
    return U.isoDate(U.addDays(NW.now(), days));
  }

  /* ------------------------- Anbieter ------------------------- */

  function makeAnbieter(r, art, city) {
    let name, quote, std, verifiziert, seitTage, inserate;
    if (art === 'makler') {
      name = U.pick(r, MAKLER);
      quote = U.intBetween(r, 55, 96);
      std = U.intBetween(r, 4, 60);
      verifiziert = r() < 0.85;
      seitTage = U.intBetween(r, 400, 3200);
      inserate = U.intBetween(r, 6, 48);
    } else if (art === 'verwaltung') {
      name = U.pick(r, VERWALTUNG);
      quote = U.intBetween(r, 45, 88);
      std = U.intBetween(r, 12, 96);
      verifiziert = r() < 0.9;
      seitTage = U.intBetween(r, 600, 3600);
      inserate = U.intBetween(r, 3, 22);
    } else if (art === 'genossenschaft') {
      name = U.pick(r, GENOSSENSCHAFT);
      quote = U.intBetween(r, 78, 99);
      std = U.intBetween(r, 8, 48);
      verifiziert = true;
      seitTage = U.intBetween(r, 1200, 5000);
      inserate = U.intBetween(r, 2, 14);
    } else {
      name = personName(r, U.pick(r, ['w', 'm', 'm', 'w', 'd']));
      quote = U.intBetween(r, 30, 95);
      std = U.intBetween(r, 2, 120);
      verifiziert = r() < 0.55;
      seitTage = U.intBetween(r, 5, 2000);
      inserate = U.intBetween(r, 1, 3);
    }
    return {
      name, art, stadt: city,
      quote, antwortStd: std, verifiziert,
      seit: dateOffset(-seitTage), inserate,
      bewertung: Math.round((3.1 + r() * 1.9) * 10) / 10,
      bewertungen: U.intBetween(r, 0, 140)
    };
  }

  /* ------------------------- Ein Inserat ------------------------- */

  function makeListing(r, city, district, kind) {
    const id = nextId(kind);
    const isHaus = kind === 'kauf' ? r() < 0.34 : kind === 'miete' ? r() < 0.07 : false;
    const isZimmer = kind === 'wg';

    /* Baujahr mit realistischer Verteilung */
    const jahrWurf = r();
    let year;
    if (jahrWurf < 0.24) year = U.intBetween(r, 1890, 1939);
    else if (jahrWurf < 0.52) year = U.intBetween(r, 1949, 1977);
    else if (jahrWurf < 0.74) year = U.intBetween(r, 1978, 2004);
    else if (jahrWurf < 0.90) year = U.intBetween(r, 2005, 2019);
    else year = U.intBetween(r, 2020, 2026);
    const saniert = year < 1990 && r() < 0.55;

    /* Größe und Zimmer */
    let rooms, area;
    if (isZimmer) {
      rooms = 1;
      area = U.intBetween(r, 9, 26);
    } else if (isHaus) {
      rooms = U.intBetween(r, 4, 7);
      area = U.intBetween(r, 105, 210);
    } else {
      const w = r();
      rooms = w < 0.16 ? 1 : w < 0.42 ? 2 : w < 0.72 ? 3 : w < 0.9 ? 4 : 5;
      const proZimmer = U.between(r, 20, 30);
      area = Math.round(rooms * proZimmer + U.between(r, -6, 12));
      area = U.clamp(area, 22, 190);
      if (rooms >= 2 && r() < 0.3) rooms += 0.5;
    }

    const wohnflaeche = isZimmer ? U.intBetween(r, 58, 140) : area;
    const floors = isHaus ? U.intBetween(r, 2, 3) : U.intBetween(r, 3, 7);
    const floor = isHaus ? 0 : U.intBetween(r, 0, floors);

    /* Ausstattung */
    const feats = [];
    const add = (name, p) => { if (r() < p) feats.push(name); };
    add('Balkon', isHaus ? 0.4 : year >= 1960 ? 0.66 : 0.38);
    if (!feats.includes('Balkon')) add('Loggia', 0.16);
    add('Terrasse', isHaus ? 0.85 : floor === 0 ? 0.35 : 0.05);
    add('Garten', isHaus ? 0.92 : floor === 0 ? 0.22 : 0.02);
    add('Dachterrasse', floor === floors ? 0.18 : 0.01);
    add('Einbauküche', isZimmer ? 0.95 : 0.55);
    add('Aufzug', floors >= 5 ? 0.72 : year >= 2005 ? 0.5 : 0.12);
    add('Barrierefrei', year >= 2010 ? 0.42 : 0.05);
    add('Stellplatz', 0.32);
    add('Garage', isHaus ? 0.6 : 0.1);
    add('Keller', 0.72);
    add('Fahrradkeller', 0.42);
    add('Waschmaschinenanschluss', 0.78);
    add('Badewanne', 0.46);
    add('Gäste-WC', isHaus ? 0.7 : rooms >= 3 ? 0.24 : 0.03);
    add(year < 1940 ? 'Dielenboden' : 'Parkett', 0.5);
    add('Fußbodenheizung', year >= 2005 ? 0.6 : 0.07);
    add('Glasfaser', year >= 2015 ? 0.55 : 0.2);
    add('Abstellraum', 0.36);
    add('Kamin', isHaus ? 0.24 : 0.05);
    if (year < 1940) add('Denkmalschutz', 0.16);
    add('Gemeinschaftsgarten', 0.18);
    add('Paketstation', 0.12);
    if (isZimmer) {
      if (r() < 0.5) feats.push('Möbliert'); else if (r() < 0.6) feats.push('Teilmöbliert');
    } else if (r() < 0.09) feats.push('Teilmöbliert');
    const haustiere = r() < 0.42;
    if (haustiere) feats.push('Haustiere erlaubt');

    /* Energie */
    /* Wärmepumpe und Pellets stecken selten in unsaniertem Altbestand. */
    const heizung = year >= 2020 ? U.pick(r, ['Wärmepumpe', 'Fernwärme', 'Wärmepumpe'])
      : year >= 2000 ? U.pick(r, ['Gas-Zentralheizung', 'Fernwärme', 'Wärmepumpe'])
        : U.pick(r, saniert
          ? ['Gas-Zentralheizung', 'Fernwärme', 'Gasetagenheizung', 'Pelletheizung', 'Wärmepumpe', 'Gas-Zentralheizung']
          : ['Gas-Zentralheizung', 'Gas-Zentralheizung', 'Fernwärme', 'Öl-Zentralheizung', 'Gasetagenheizung', 'Nachtspeicheröfen']);
    let kwh = HEIZ_KWH[heizung] * (year >= 2020 ? 0.55 : year >= 2005 ? 0.78 : year >= 1978 ? 1.0 : saniert ? 0.92 : 1.35);
    kwh = Math.round(kwh * U.between(r, 0.85, 1.15));
    const energie = {
      klasse: energieKlasse(kwh), kwh, art: r() < 0.6 ? 'Verbrauchsausweis' : 'Bedarfsausweis',
      heizung, ausweisBis: dateOffset(U.intBetween(r, -200, 2400))
    };

    /* Preise */
    const nutzflaeche = isZimmer ? area : area;
    const vergleich = G.vergleichsmiete(district, isZimmer ? wohnflaeche : area, year, saniert);
    let kalt, nebenkosten, heizkosten, kaufpreis = 0, hausgeld = 0, provision = 0, kaution = 3;

    if (kind === 'kauf') {
      const vk = G.vergleichskaufpreis(district, area, year);
      kaufpreis = Math.round(vk * area * U.between(r, 0.88, 1.16) / 1000) * 1000;
      hausgeld = isHaus ? 0 : Math.round(area * U.between(r, 3.2, 5.4));
      provision = U.pick(r, [0, 0, 2.38, 3.57, 3.57]);
      kalt = 0; nebenkosten = 0; heizkosten = 0;
    } else {
      let faktor = U.between(r, 0.88, 1.16);
      if (kind === 'wg') faktor *= U.between(r, 0.95, 1.35);
      kalt = Math.round(vergleich * (isZimmer ? area : area) * faktor);
      if (isZimmer) kalt = Math.round(kalt * U.between(r, 1.15, 1.75));
      /* Kalte Betriebskosten je m²; Heizkosten aus Kennwert × Fläche ×
         Arbeitspreis, auf zwölf Monate verteilt. */
      nebenkosten = Math.round(area * U.between(r, 1.5, 2.8));
      const arbeitspreis = heizung === 'Wärmepumpe' ? 0.28 : heizung === 'Nachtspeicheröfen' ? 0.30
        : heizung === 'Fernwärme' ? 0.135 : heizung === 'Pelletheizung' ? 0.085
          : heizung === 'Öl-Zentralheizung' ? 0.105 : 0.115;
      const wirkungsgrad = heizung === 'Wärmepumpe' ? 3.4 : 1;
      heizkosten = Math.round(area * kwh / wirkungsgrad * arbeitspreis / 12 * U.between(r, 0.9, 1.15));
      kaution = U.pick(r, [2, 3, 3, 3, 1, 0]);
      provision = kind === 'miete' && r() < 0.06 ? 2.38 : 0;
    }
    const warm = kalt + nebenkosten + heizkosten;

    /* Auffälligkeiten */
    const quirks = [];
    if (kind !== 'kauf') {
      if (r() < 0.14) quirks.push('staffel');
      if (r() < 0.07) quirks.push('index');
      if (r() < 0.22) quirks.push('schoenheit');
      if (r() < 0.09) quirks.push('abstand');
      if (kaution >= 4 || r() < 0.05) { quirks.push('kaution4'); kaution = 4; }
      if (provision > 0) quirks.push('provision');
      if (feats.includes('Möbliert') && r() < 0.4) quirks.push('moebel');
      if (r() < 0.1) quirks.push('tierverbot');
      if (r() < 0.05) quirks.push('eigenbedarf');
    }

    /* Anbieterart */
    let anbieterArt;
    if (kind === 'wg') anbieterArt = 'privat';
    else if (kind === 'tausch') anbieterArt = 'privat';
    else if (kind === 'kauf') anbieterArt = r() < 0.72 ? 'makler' : 'privat';
    else anbieterArt = r() < 0.34 ? 'makler' : r() < 0.6 ? 'verwaltung' : r() < 0.72 ? 'genossenschaft' : 'privat';
    const anbieter = makeAnbieter(r, anbieterArt, city.name);

    /* Betrugsverdacht bewusst streuen: sehr günstig, frisches Konto,
       Vorkasse, keine Besichtigung. */
    let fake = false;
    if (kind !== 'kauf' && r() < 0.045) {
      fake = true;
      kalt = Math.round(kalt * U.between(r, 0.38, 0.55));
      anbieter.verifiziert = false;
      anbieter.art = 'privat';
      anbieter.seit = dateOffset(-U.intBetween(r, 1, 12));
      anbieter.inserate = U.intBetween(r, 1, 2);
      anbieter.quote = U.intBetween(r, 95, 100);
      quirks.push('vorkasse');
      quirks.push('keineBesichtigung');
    }

    /* Text */
    const stil = isZimmer ? 'zimmer' : isHaus ? 'haus' : year < 1949 ? 'altbau' : year < 2000 ? 'nachkrieg' : 'modern';
    const teile = [U.pick(r, T_EROEFFNUNG[stil])];
    teile.push('Die ' + (isZimmer ? 'Wohnung' : isHaus ? 'Immobilie' : 'Wohnung') + ' liegt in ' + district.name +
      ' und umfasst ' + (isZimmer ? area + ' m² Zimmerfläche in einer ' + wohnflaeche + ' m² großen Wohnung'
        : U.dec(rooms) + ' Zimmer auf ' + area + ' m²') +
      (isHaus ? '' : floor === 0 ? ' im Erdgeschoss' : floor >= floors ? ' im Dachgeschoss' : ' im ' + floor + '. Obergeschoss') + '.');
    teile.push(U.pick(r, T_ZUSTAND));
    if (feats.length) {
      teile.push('Zur Ausstattung gehören ' + feats.slice(0, 4).join(', ').replace(/, ([^,]*)$/, ' und $1') + '.');
    }
    teile.push(U.pick(r, T_LAGE));
    quirks.forEach((q) => teile.push(QUIRKS[q]));
    if (!fake) teile.push(U.pick(r, T_FORMAL));
    const desc = teile.join(' ');

    /* Streuung der Koordinaten innerhalb des Viertels */
    const jitter = 0.012;
    const lat = Math.round((district.lat + (r() - 0.5) * jitter) * 100000) / 100000;
    const lng = Math.round((district.lng + (r() - 0.5) * jitter * 1.6) * 100000) / 100000;

    const onlineTage = U.intBetween(r, 0, 46);
    const freiTage = U.pick(r, [0, 0, 14, 30, 45, 60, 90, 120, -20]);

    const titelTeil = isZimmer
      ? area + ' m² Zimmer in ' + U.intBetween(r, 2, 4) + 'er-WG'
      : (isHaus ? 'Haus' : U.dec(rooms) + '-Zimmer-Wohnung') +
        (feats.includes('Balkon') ? ' mit Balkon' : feats.includes('Garten') ? ' mit Garten' : feats.includes('Terrasse') ? ' mit Terrasse' : '');

    const listing = {
      id, kind,
      type: isZimmer ? 'zimmer' : isHaus ? 'haus' : 'wohnung',
      titel: titelTeil + ' – ' + district.name,
      stadt: city.name, viertel: district.name, viertelKey: district.key,
      strasse: 'Nähe ' + U.pick(r, STRASSEN),
      lat, lng,
      zimmer: rooms, flaeche: area, wohnflaeche,
      etage: floor, etagen: floors, baujahr: year, saniert,
      kalt, nebenkosten, heizkosten, warm,
      kaufpreis, hausgeld, provision, kaution,
      energie, ausstattung: feats,
      freiAb: dateOffset(freiTage),
      befristetBis: null,
      beschreibung: desc,
      quirks,
      anbieter,
      stats: {
        /* Aufrufe und Bewerbungen wachsen mit der Zeit online – ein
           frisches Inserat hat noch keine 200 Interessenten. */
        aufrufe: Math.round((12 + onlineTage * U.between(r, 6, 55)) * (kind === 'kauf' ? 0.5 : 1)),
        bewerber: Math.round((onlineTage + 1) * U.between(r, 0.2, kind === 'kauf' ? 0.6 : 4.5)),
        online: dateOffset(-onlineTage)
      },
      vergleichsmiete: vergleich,
      besichtigungen: [],
      verdacht: fake
    };

    /* Besichtigungstermine – echte Slots statt Massenandrang */
    if (kind !== 'kauf' && r() < 0.62) {
      const anzahl = U.intBetween(r, 2, 5);
      for (let i = 0; i < anzahl; i++) {
        const tag = U.intBetween(r, 2, 18);
        const stunde = U.intBetween(r, 9, 18);
        listing.besichtigungen.push({
          id: id + '-t' + i,
          datum: dateOffset(tag),
          zeit: String(stunde).padStart(2, '0') + ':' + U.pick(r, ['00', '15', '30', '45']),
          plaetze: U.intBetween(r, 1, 3),
          belegt: 0,
          art: r() < 0.8 ? 'Einzeltermin' : 'Kleingruppe'
        });
      }
      listing.besichtigungen.sort((a, b) => a.datum.localeCompare(b.datum));
    }

    /* Zwischenmiete */
    if (kind === 'wg' && r() < 0.28) {
      listing.befristetBis = dateOffset(freiTage + U.intBetween(r, 60, 400));
    }

    return listing;
  }

  /* ------------------------- WG-Aufsatz ------------------------- */

  const LIFESTYLE_KEYS = ['sauber', 'ruhe', 'gaeste', 'gemeinsam', 'chrono', 'kochen'];

  function makeWG(r, listing) {
    const groesse = U.intBetween(r, 2, 5);
    const bewohner = [];
    for (let i = 0; i < groesse - 1; i++) {
      const g = U.pick(r, ['w', 'w', 'm', 'm', 'd']);
      bewohner.push({
        name: (g === 'w' ? U.pick(r, VORNAMEN_W) : g === 'm' ? U.pick(r, VORNAMEN_M) : U.pick(r, VORNAMEN_D)),
        alter: U.intBetween(r, 19, 44),
        geschlecht: g,
        beruf: berufFor(r, g)
      });
    }
    const durchschnitt = bewohner.length ? Math.round(U.sum(bewohner.map((b) => b.alter)) / bewohner.length) : 26;

    const lifestyle = {};
    LIFESTYLE_KEYS.forEach((k) => { lifestyle[k] = U.intBetween(r, 0, 10); });

    const gesuchtGeschlecht = U.pick(r, ['egal', 'egal', 'egal', 'w', 'm', 'd']);
    const artAnzahl = U.intBetween(r, 1, 3);

    listing.wg = {
      groesse,
      bewohner,
      durchschnittsalter: durchschnitt,
      sucht: {
        geschlecht: gesuchtGeschlecht,
        alterVon: Math.max(18, durchschnitt - U.intBetween(r, 3, 9)),
        alterBis: durchschnitt + U.intBetween(r, 4, 14)
      },
      art: U.pickN(r, WG_ART, artAnzahl),
      rauchen: U.pick(r, ['nicht erwünscht', 'nicht erwünscht', 'auf dem Balkon', 'überall erlaubt']),
      haustiere: listing.ausstattung.includes('Haustiere erlaubt')
        ? U.pick(r, ['erlaubt', 'vorhanden'])
        : 'nicht erlaubt',
      sprachen: U.pickN(r, SPRACHEN, U.intBetween(r, 1, 3)),
      lifestyle,
      putzplan: r() < 0.55,
      gemeinsamesEssen: r() < 0.4,
      badGeteilt: r() < 0.7 ? 'geteilt' : 'eigenes Bad'
    };

    if (!listing.wg.sprachen.includes('Deutsch')) listing.wg.sprachen.unshift('Deutsch');

    const beschreibungWG = 'Wir sind eine ' + listing.wg.groesse + 'er-WG (' +
      bewohner.map((b) => b.name + ', ' + b.alter).join('; ') + '). ' +
      'Wir verstehen uns als ' + listing.wg.art.join(' und ') + '. ' +
      (listing.wg.putzplan ? 'Es gibt einen Putzplan, an den sich alle halten. ' : 'Geputzt wird ohne festen Plan, aber es klappt. ') +
      (listing.wg.gemeinsamesEssen ? 'Ein- bis zweimal die Woche kochen wir zusammen. ' : 'Jeder kocht für sich, gemeinsam essen ist möglich, aber kein Muss. ') +
      'Rauchen: ' + listing.wg.rauchen + '. Haustiere: ' + listing.wg.haustiere + '.';
    listing.beschreibung = beschreibungWG + ' ' + listing.beschreibung;
    listing.titel = listing.flaeche + ' m² Zimmer in ' + groesse + 'er-WG – ' + listing.viertel;
    listing.anbieter.name = bewohner.length ? bewohner[0].name + ' & WG' : listing.anbieter.name;
    return listing;
  }

  /* ------------------------- Tausch-Aufsatz ------------------------- */

  function makeTausch(r, listing, alleStaedte) {
    const wunschStaedte = U.pickN(r, alleStaedte.filter((s) => s !== listing.stadt), U.intBetween(r, 1, 3));
    listing.tausch = {
      grund: U.pick(r, [
        'Neuer Job in einer anderen Stadt.',
        'Wir bekommen Nachwuchs und brauchen ein Zimmer mehr.',
        'Die Kinder sind aus dem Haus – die Wohnung ist zu groß geworden.',
        'Studienortwechsel zum kommenden Semester.',
        'Wir wollen näher zur Familie ziehen.',
        'Die Treppen werden beschwerlich, gesucht wird etwas Barrierefreies.',
        'Pendeln frisst zu viel Zeit, ich möchte näher an die Arbeit.',
        'Beziehung beendet – die Wohnung allein ist zu teuer.'
      ]),
      suche: {
        staedte: wunschStaedte,
        zimmerMin: Math.max(1, listing.zimmer + U.pick(r, [-1, 0, 0, 1, 1])),
        flaecheMin: Math.max(20, Math.round(listing.flaeche * U.between(r, 0.7, 1.1))),
        warmMax: Math.round(listing.warm * U.between(r, 1.0, 1.5) / 10) * 10,
        wunschAusstattung: U.pickN(r, ['Balkon', 'Aufzug', 'Barrierefrei', 'Garten', 'Haustiere erlaubt', 'Stellplatz', 'Einbauküche'], U.intBetween(r, 0, 2))
      },
      flexibelAb: listing.freiAb,
      dreiecktauschOk: r() < 0.78,
      vermieterZustimmung: U.pick(r, ['liegt vor', 'in Klärung', 'in Klärung', 'noch offen'])
    };
    listing.titel = U.dec(listing.zimmer) + '-Zimmer-Wohnung zum Tausch – ' + listing.viertel;
    listing.beschreibung = 'Tauschangebot: ' + listing.tausch.grund + ' ' + listing.beschreibung +
      ' Gesucht wird eine Wohnung in ' + wunschStaedte.join(' oder ') + ' mit mindestens ' +
      U.dec(listing.tausch.suche.zimmerMin) + ' Zimmern und ' + listing.tausch.suche.flaecheMin +
      ' m², warm bis ' + U.eur(listing.tausch.suche.warmMax) + '.' +
      ' Zustimmung des Vermieters: ' + listing.tausch.vermieterZustimmung + '.';
    return listing;
  }

  /* ------------------------- Bestand erzeugen ------------------------- */

  function build() {
    const r = U.rng(SEED);
    const listings = [];
    const staedte = G.CITIES.map((c) => c.name);

    G.CITIES.forEach((city) => {
      /* Menge grob nach Einwohnerzahl, aber überall genug zum Suchen. */
      const menge = U.clamp(Math.round(city.einwohner / 42000) + 8, 12, 34);
      for (let i = 0; i < menge; i++) {
        const district = U.pick(r, city.districtList);
        const w = r();
        const kind = w < 0.44 ? 'miete' : w < 0.60 ? 'kauf' : w < 0.86 ? 'wg' : 'tausch';
        const l = makeListing(r, city, district, kind);
        if (kind === 'wg') makeWG(r, l);
        if (kind === 'tausch') makeTausch(r, l, staedte);
        listings.push(l);
      }
    });

    /* Ringe pflanzen: ohne passende Ketten wäre der Ringtausch leer.
       Ein Dreier- und ein Viererring, dazu ein paar direkte Tausche. */
    const tausche = listings.filter((l) => l.kind === 'tausch');
    function verketten(kette) {
      for (let i = 0; i < kette.length; i++) {
        const ich = kette[i], ziel = kette[(i + 1) % kette.length];
        ich.tausch.suche.staedte = U.uniq([ziel.stadt].concat(ich.tausch.suche.staedte)).slice(0, 3);
        ich.tausch.suche.zimmerMin = Math.min(ich.tausch.suche.zimmerMin, ziel.zimmer);
        ich.tausch.suche.flaecheMin = Math.min(ich.tausch.suche.flaecheMin, ziel.flaeche);
        ich.tausch.suche.warmMax = Math.max(ich.tausch.suche.warmMax, ziel.warm);
        ich.tausch.dreiecktauschOk = true;
        ich.tausch.suche.wunschAusstattung = ich.tausch.suche.wunschAusstattung.filter((a) => ziel.ausstattung.includes(a));
        ich.beschreibung = ich.beschreibung.replace(/Gesucht wird eine Wohnung in [^.]*\./,
          'Gesucht wird eine Wohnung in ' + ich.tausch.suche.staedte.join(' oder ') + ' mit mindestens ' +
          U.dec(ich.tausch.suche.zimmerMin) + ' Zimmern und ' + ich.tausch.suche.flaecheMin + ' m², warm bis ' +
          U.eur(ich.tausch.suche.warmMax) + '.');
      }
    }
    if (tausche.length >= 9) {
      const gemischt = tausche.slice().sort((a, b) => U.hash(a.id) - U.hash(b.id));
      verketten(gemischt.slice(0, 3));
      verketten(gemischt.slice(3, 7));
      verketten(gemischt.slice(7, 9));
    }

    /* Doppelte Inserate: Auf echten Portalen steht dieselbe Wohnung
       regelmäßig zweimal – vom Eigentümer und vom beauftragten Makler,
       oder von zwei Maklern zugleich. Wer das nicht merkt, bewirbt sich
       zweimal auf dasselbe Objekt und wirkt unentschlossen. Damit die
       Erkennung etwas zu erkennen hat, kommen ein paar Paare hinein. */
    const doppelbar = listings.filter((l) => (l.kind === 'miete' || l.kind === 'kauf') && !l.verdacht);
    U.pickN(r, doppelbar, Math.min(7, doppelbar.length)).forEach((original) => {
      const zwilling = JSON.parse(JSON.stringify(original));
      zwilling.id = 'dup-' + (++idCounter).toString(36).padStart(3, '0');
      /* Wer als Zweiter inseriert, ist meist der Makler – und rundet den
         Preis leicht anders. */
      const aufschlag = U.between(r, -0.03, 0.04);
      if (zwilling.kind === 'kauf') {
        zwilling.kaufpreis = Math.round(zwilling.kaufpreis * (1 + aufschlag) / 1000) * 1000;
      } else {
        zwilling.kalt = Math.round(zwilling.kalt * (1 + aufschlag));
        zwilling.warm = zwilling.kalt + zwilling.nebenkosten + zwilling.heizkosten;
      }
      zwilling.flaeche = original.flaeche + U.pick(r, [0, 0, 1, -1]);
      zwilling.wohnflaeche = zwilling.flaeche;
      zwilling.anbieter = makeAnbieter(r, original.anbieter.art === 'makler' ? 'privat' : 'makler', zwilling.stadt);
      zwilling.strasse = 'Nähe ' + U.pick(r, STRASSEN);
      zwilling.stats = {
        aufrufe: Math.round(original.stats.aufrufe * U.between(r, 0.3, 1.4)),
        bewerber: Math.round(original.stats.bewerber * U.between(r, 0.3, 1.3)),
        online: dateOffset(-U.intBetween(r, 0, 30))
      };
      zwilling.besichtigungen = [];
      /* Anderer Text, gleiche Wohnung – so sieht es in der Praxis aus. */
      zwilling.beschreibung = U.pick(r, T_EROEFFNUNG[zwilling.baujahr < 1949 ? 'altbau' : zwilling.baujahr < 2000 ? 'nachkrieg' : 'modern']) +
        ' ' + U.dec(zwilling.zimmer) + ' Zimmer auf ' + zwilling.flaeche + ' m² in ' + zwilling.viertel + '. ' +
        U.pick(r, T_ZUSTAND) + ' ' + U.pick(r, T_LAGE) + ' ' + U.pick(r, T_FORMAL);
      zwilling.quirks = [];
      listings.push(zwilling);
    });

    listings.forEach((l, i) => { l.nr = i + 1; });
    return listings;
  }

  const listings = build();
  const byId = {};
  listings.forEach((l) => { byId[l.id] = l; });

  /* ------------------------- Eigenes Profil ------------------------- */

  /* Das Profil startet leer. Erfundene Vorgaben wären bequem, aber sie
     lenken die Suche, ohne dass jemand sie gewählt hätte – ein
     vorbelegtes Pflichtmerkmal blendet stillschweigend Wohnungen aus,
     und ein erfundenes Einkommen verfälscht die Chancenrechnung.
     Was hier steht, hat der Mensch selbst eingetragen. */
  const profilVorlage = {
    name: '',
    alter: null,
    geschlecht: 'egal',
    beruf: '',
    haushalt: 1,
    nettoEinkommen: 0,
    raucher: false,
    haustiere: 'keine',
    /* Suchauftrag */
    staedte: [],
    viertel: [],
    arten: ['miete', 'wg'],
    budgetWarm: 0,
    zimmerMin: null,
    flaecheMin: null,
    mussHaben: [],
    schoenWaere: [],
    einzugAb: '',
    /* Anker für Pendelzeiten */
    anker: [],
    verkehrsmittel: 'oepnv',
    /* WG-Selbstbild */
    lifestyle: { sauber: 7, ruhe: 6, gaeste: 5, gemeinsam: 6, chrono: 6, kochen: 5 },
    /* Unterlagen für die Bewerbermappe */
    unterlagen: {
      schufa: false, gehaltsnachweise: false, ausweis: false,
      mietschuldenfrei: false, buergschaft: false, selbstauskunft: false, wbs: false
    },
    vorstellung: '',
    gewichtung: { preis: 3, lage: 3, groesse: 3, ausstattung: 2, energie: 2, pendeln: 3, fairness: 3 }
  };

  /* ------------------------- Erste Nachrichten ------------------------- */

  /* Ein frisch geöffnetes Konto hat keine Nachrichten. Vorbelegte
     Verläufe würden behaupten, jemand warte auf eine Antwort, obwohl
     noch nie jemand angeschrieben wurde. */
  function startThreads() {
    return [];
  }

  /* ------------------------- Anfragen zu eigenen Inseraten -------------------------

     Wer selbst inseriert, muss sehen können, wie die Anfragen bei ihm
     ankommen – sonst bleibt „Plus-Anfragen stehen oben“ eine Behauptung
     auf der Preisseite. In dieser Vorführung schreibt niemand wirklich,
     also entstehen die Anfragen aus der Kennung des Inserats: immer
     dieselben, sobald dasselbe Inserat da ist, und ausdrücklich als
     Beispiel gekennzeichnet. Erfundene Dringlichkeit im eigenen Postfach
     wäre unlauter; erfundene Anfragen im eigenen Schaufenster, damit man
     die Sortierung sieht, sind etwas anderes – solange es dabeisteht. */

  const ANFRAGE_TEXTE = [
    'Guten Tag, die Wohnung passt genau zu dem, was wir suchen. Wären zwei Termine kommende Woche möglich?',
    'Hallo, ich arbeite seit vier Jahren fest in der Nähe und würde allein einziehen. Unterlagen liegen bereit.',
    'Guten Tag, wir sind zu zweit, beide berufstätig, ohne Haustiere. Ist die Küche im Preis enthalten?',
    'Hallo, ich suche zum Quartalsende und bin beim Termin flexibel. Gibt es einen Stellplatz?',
    'Guten Tag, wie hoch war die letzte Nebenkostenabrechnung, und wann wurde die Heizung erneuert?',
    'Hallo, ich hätte Interesse an einer Besichtigung. Nachweise kann ich sofort digital bereitstellen.'
  ];

  function anfragenFuer(listing) {
    if (!listing) return [];
    const r = U.rng(U.hash('anfragen:' + listing.id));
    const anzahl = U.intBetween(r, 3, 6);
    const namen = [];
    for (let i = 0; i < anzahl; i++) {
      const v = U.pick(r, VORNAMEN_W.concat(VORNAMEN_M, VORNAMEN_D)), n = U.pick(r, NACHNAMEN);
      namen.push(v + ' ' + n);
    }
    /* Wer Plus hat, wird nicht gewürfelt, sondern gesetzt: Sonst zeigt ein
       Beispiel je nach Zufall gar keine Plus-Anfrage – und dann sieht man
       die Sortierung nicht, um die es hier geht. */
    const mitPlus = Math.max(1, Math.round(anzahl * 0.4));
    const plusIndex = [];
    while (plusIndex.length < mitPlus) {
      const k = U.intBetween(r, 0, anzahl - 1);
      if (plusIndex.indexOf(k) < 0) plusIndex.push(k);
    }
    return namen.map((name, i) => ({
      id: listing.id + '-anf-' + i,
      name,
      plus: plusIndex.indexOf(i) >= 0,
      /* Ältere Anfrage zuerst in der Zeit, damit die Reihenfolge nach
         Eingang überhaupt eine Aussage hat. */
      zeit: U.isoDate(U.addDays(NW.now(), -(anzahl - i) * 2 - U.intBetween(r, 0, 2))),
      text: ANFRAGE_TEXTE[U.intBetween(r, 0, ANFRAGE_TEXTE.length - 1)],
      unterlagen: r() < 0.55,
      beispiel: true
    }));
  }

  NW.data = {
    listings, byId, profilVorlage,
    startThreads, anfragenFuer,
    LIFESTYLE_KEYS, WG_ART, AUSSTATTUNG, SPRACHEN, QUIRKS, BERUFE,
    staedte: G.CITIES.map((c) => c.name)
  };
})(window.NW = window.NW || {});
