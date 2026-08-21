/* =====================================================================
   Nestwerk – Prüfen und Rechnen
   Alles, was ein Inserat über sich selbst verrät: Vergleichsmiete,
   Betrugsverdacht, auffällige Vertragsklauseln, echte Monatskosten,
   Finanzierung und die persönliche Passung.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;
  const G = NW.geo;

  const ENERGIE_RANG = { 'A+': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8 };

  /* Grunderwerbsteuer je Bundesland, Stand als Orientierungswert. */
  const GRUNDERWERB = { 'NRW': 6.5, 'Berlin': 6.0, 'Hamburg': 5.5, 'Bayern': 3.5, 'Hessen': 6.0, 'BW': 5.0, 'Sachsen': 5.5 };

  /* Verbrauchswerte für den Haushaltsstrom, ohne Heizung. */
  const STROM_KWH = { 1: 1500, 2: 2200, 3: 3000, 4: 3800, 5: 4500, 6: 5200 };
  const STROMPREIS = 0.35;
  const RUNDFUNK = 18.36;
  const INTERNET = 35;
  const HAUSRAT = 8;

  /* ================================================================
     1. Vergleichsmiete
     ================================================================ */

  function mietCheck(l) {
    if (l.kind === 'kauf') return null;
    const bezug = l.kind === 'wg' ? l.flaeche : l.flaeche;
    const proQm = l.kalt / bezug;
    const vergleich = l.vergleichsmiete ||
      G.vergleichsmiete(l.viertelKey, l.kind === 'wg' ? l.wohnflaeche : l.flaeche, l.baujahr, l.saniert);
    /* WG-Zimmer sind je m² grundsätzlich teurer – der Aufschlag ist
       marktüblich und darf den Vergleich nicht verzerren. */
    const referenz = l.kind === 'wg' ? vergleich * 1.35 : vergleich;
    const diff = referenz > 0 ? (proQm - referenz) / referenz * 100 : 0;
    let urteil, ton;
    if (diff < -35) { urteil = 'auffällig günstig'; ton = 'warn'; }
    else if (diff < -12) { urteil = 'unter Vergleichsmiete'; ton = 'gut'; }
    else if (diff <= 10) { urteil = 'marktüblich'; ton = 'neutral'; }
    else if (diff <= 25) { urteil = 'über Vergleichsmiete'; ton = 'mittel'; }
    else { urteil = 'deutlich über Vergleichsmiete'; ton = 'schlecht'; }
    return {
      proQm: Math.round(proQm * 100) / 100,
      referenz: Math.round(referenz * 100) / 100,
      diff: Math.round(diff),
      urteil, ton,
      mietpreisbremse: diff > 10 && l.kind !== 'kauf',
      /* Was bei gedeckelter Miete zulässig wäre: Vergleich + 10 %. */
      zulaessig: Math.round(referenz * 1.1 * bezug)
    };
  }

  function kaufCheck(l) {
    if (l.kind !== 'kauf') return null;
    const proQm = l.kaufpreis / l.flaeche;
    const referenz = G.vergleichskaufpreis(l.viertelKey, l.flaeche, l.baujahr);
    const diff = referenz > 0 ? (proQm - referenz) / referenz * 100 : 0;
    /* Kaufpreisfaktor: Wie viele Jahresnettokaltmieten kostet das Objekt?
       Unter 25 gilt als günstig, über 35 als ambitioniert. */
    const jahresmiete = G.vergleichsmiete(l.viertelKey, l.flaeche, l.baujahr, l.saniert) * l.flaeche * 12;
    const faktor = jahresmiete > 0 ? l.kaufpreis / jahresmiete : 0;
    let urteil, ton;
    if (diff < -12) { urteil = 'unter Marktniveau'; ton = 'gut'; }
    else if (diff <= 10) { urteil = 'marktüblich'; ton = 'neutral'; }
    else if (diff <= 25) { urteil = 'über Marktniveau'; ton = 'mittel'; }
    else { urteil = 'deutlich über Marktniveau'; ton = 'schlecht'; }
    return {
      proQm: Math.round(proQm), referenz, diff: Math.round(diff), urteil, ton,
      faktor: Math.round(faktor * 10) / 10,
      mietrendite: l.kaufpreis > 0 ? Math.round(jahresmiete / l.kaufpreis * 1000) / 10 : 0
    };
  }

  /* ================================================================
     2. Betrugsverdacht
     ================================================================ */

  const BETRUG_MUSTER = [
    { re: /vorab|vorkasse|überwie[sß]en? wurde|erste Miete und die Kaution überwiesen|per Kurier|Schlüssel.{0,20}(Post|Kurier)/i, punkte: 40, grund: 'Der Text kündigt Zahlung vor Schlüsselübergabe an. Seriöse Vermietung verlangt nie Geld vor dem unterschriebenen Vertrag.' },
    { re: /keine? (Vorab)?besichtigung|Besichtigung ist leider nicht möglich|nach Aktenlage/i, punkte: 30, grund: 'Eine Besichtigung wird ausgeschlossen. Ohne eigenen Eindruck sollte kein Vertrag zustande kommen.' },
    { re: /beruflich im Ausland|befinde mich derzeit im Ausland|Auslandsaufenthalt/i, punkte: 25, grund: 'Der Anbieter gibt an, im Ausland zu sein – ein wiederkehrendes Muster bei erfundenen Inseraten.' },
    { re: /Treuhand|Western Union|Kryptowährung|Bitcoin|Gutschein/i, punkte: 45, grund: 'Ungewöhnlicher Zahlungsweg genannt.' }
  ];

  function risikoCheck(l) {
    const gruende = [];
    let punkte = 0;
    const push = (p, grund, art) => { punkte += p; gruende.push({ punkte: p, grund, art: art || 'hinweis' }); };

    const mc = mietCheck(l);
    if (mc && mc.diff < -35) {
      push(30, 'Die Miete liegt ' + Math.abs(mc.diff) + ' % unter der Vergleichsmiete für ' + l.viertel +
        '. Ungewöhnlich niedrige Preise sind der häufigste Köder.', 'preis');
    }

    BETRUG_MUSTER.forEach((m) => {
      if (m.re.test(l.beschreibung)) push(m.punkte, m.grund, 'text');
    });

    const kontoTage = U.daysSince(l.anbieter.seit);
    if (!l.anbieter.verifiziert && kontoTage < 30) {
      push(20, 'Das Anbieterkonto ist erst ' + kontoTage + ' Tage alt und nicht geprüft.', 'konto');
    } else if (!l.anbieter.verifiziert) {
      push(6, 'Der Anbieter hat seine Identität nicht bestätigt.', 'konto');
    }

    if (l.kaution > 3 && l.kind !== 'kauf') {
      push(10, 'Die geforderte Kaution übersteigt drei Nettokaltmieten.', 'vertrag');
    }
    if (l.provision > 0 && l.kind === 'miete') {
      push(10, 'Für eine Mietwohnung wird eine Courtage vom Mieter verlangt.', 'vertrag');
    }
    if (!l.besichtigungen.length && l.kind !== 'kauf' && kontoTage < 120) {
      push(5, 'Es sind keine Besichtigungstermine hinterlegt.', 'ablauf');
    }

    punkte = Math.min(100, punkte);
    const stufe = punkte >= 45 ? 'warnung' : punkte >= 18 ? 'achtung' : 'ok';
    return { punkte, stufe, gruende };
  }

  /* ================================================================
     3. Vertragslupe – auffällige Klauseln im Inseratstext
     ================================================================ */

  const KLAUSELN = [
    {
      id: 'kaution', re: /Kaution beträgt vier|vier (Netto)?kaltmieten|4 Nettokaltmieten/i,
      titel: 'Kaution über drei Monatsmieten', bewertung: 'kritisch',
      erklaerung: 'Die Mietsicherheit ist bei Wohnraum auf drei Nettokaltmieten begrenzt. Der übersteigende Teil ist nicht geschuldet, und die Kaution darf in drei gleichen Monatsraten gezahlt werden.',
      quelle: '§ 551 BGB'
    },
    {
      id: 'provision', re: /Courtage|Provision|Maklergebühr/i, nurKind: 'miete',
      titel: 'Courtage für eine Mietwohnung', bewertung: 'kritisch',
      erklaerung: 'Bei der Vermietung von Wohnraum zahlt derjenige den Makler, der ihn beauftragt hat – in aller Regel die vermietende Seite. Eine Courtage vom Mieter ist nur in engen Ausnahmen zulässig.',
      quelle: 'Bestellerprinzip, § 2 WoVermRG'
    },
    {
      id: 'vorkasse', re: /Kaution überwiesen|per Kurier|Vorkasse|vor Schlüsselübergabe vollständig/i,
      titel: 'Zahlung vor Schlüsselübergabe', bewertung: 'kritisch',
      erklaerung: 'Geld fließt erst nach unterschriebenem Vertrag und Übergabe. Wer vorab Miete oder Kaution verlangt, will in der Regel nicht vermieten.',
      quelle: 'Grundregel bei Wohnungsbetrug'
    },
    {
      id: 'schoenheit', re: /Schönheitsreparaturen/i,
      titel: 'Schönheitsreparaturen zulasten des Mieters', bewertung: 'achtung',
      erklaerung: 'Die Übertragung ist möglich, aber häufig unwirksam: bei starren Fristen, bei unrenoviert übergebener Wohnung ohne Ausgleich oder bei Vorgaben zur Farbwahl. Dann trägt die Vermieterseite die Kosten.',
      quelle: 'BGH VIII ZR 185/14 u. a.'
    },
    {
      id: 'abstand', re: /Abstandszahlung|Ablöse/i,
      titel: 'Abstandszahlung für Einrichtung', bewertung: 'achtung',
      erklaerung: 'Eine Ablöse für Küche oder Möbel ist zulässig, darf den Zeitwert aber nicht wesentlich übersteigen. Liegt sie mehr als 50 % darüber, ist die Vereinbarung insoweit nichtig und der Mehrbetrag rückforderbar.',
      quelle: '§ 4a WoVermRG'
    },
    {
      id: 'staffel', re: /Staffelmiete/i,
      titel: 'Staffelmiete vereinbart', bewertung: 'info',
      erklaerung: 'Zulässig, wenn jede Stufe als Betrag oder Erhöhung ausgewiesen ist und mindestens ein Jahr unverändert bleibt. Solange die Staffel läuft, sind andere Mieterhöhungen ausgeschlossen.',
      quelle: '§ 557a BGB'
    },
    {
      id: 'index', re: /Indexmiete|Verbraucherpreisindex/i,
      titel: 'Indexmiete vereinbart', bewertung: 'info',
      erklaerung: 'Die Miete folgt dem Verbraucherpreisindex. In Jahren mit hoher Teuerung steigt sie spürbar, dafür sind Erhöhungen wegen Modernisierung weitgehend ausgeschlossen.',
      quelle: '§ 557b BGB'
    },
    {
      id: 'moebel', re: /Möblierungszuschlag|Zuschlag von .* für die Möblierung|monatlicher Zuschlag/i,
      titel: 'Möblierungszuschlag', bewertung: 'info',
      erklaerung: 'Ein Zuschlag ist erlaubt, muss sich aber am Zeitwert der Einrichtung orientieren. Er ist gesondert auszuweisen und zählt nicht dauerhaft zur Grundmiete.',
      quelle: 'Rechtsprechung zum Möblierungszuschlag'
    },
    {
      id: 'tiere', re: /Haustiere jeder Art ist ausnahmslos untersagt|Haustiere.{0,30}untersagt/i,
      titel: 'Pauschales Haustierverbot', bewertung: 'achtung',
      erklaerung: 'Ein ausnahmsloses Verbot ist unwirksam. Kleintiere sind ohnehin erlaubt; bei Hund und Katze ist im Einzelfall abzuwägen.',
      quelle: 'BGH VIII ZR 168/12'
    },
    {
      id: 'eigenbedarf', re: /Eigenbedarf/i,
      titel: 'Eigenbedarf angekündigt', bewertung: 'achtung',
      erklaerung: 'Eine angekündigte Eigennutzung ist ein ernstzunehmender Hinweis auf eine kurze Mietdauer. Bei geplanter Eigennutzung kann statt eines unbefristeten Vertrags ein Zeitmietvertrag sinnvoller sein – dann steht das Ende von Anfang an fest.',
      quelle: '§§ 573, 575 BGB'
    },
    {
      id: 'wbs', re: /Wohnberechtigungsschein/i,
      titel: 'Wohnberechtigungsschein nötig', bewertung: 'info',
      erklaerung: 'Die Wohnung ist gefördert. Der Schein wird beim Wohnungsamt beantragt und hängt von Haushaltsgröße und Einkommen ab. Die Bearbeitung dauert oft mehrere Wochen – frühzeitig kümmern.',
      quelle: '§ 5 WoBindG'
    },
    {
      id: 'keinebesichtigung', re: /Besichtigung ist leider nicht möglich|nach Aktenlage/i,
      titel: 'Vergabe ohne Besichtigung', bewertung: 'kritisch',
      erklaerung: 'Ohne Besichtigung lässt sich weder der Zustand noch die Existenz der Wohnung prüfen. Das ist das deutlichste Warnzeichen überhaupt.',
      quelle: 'Grundregel bei Wohnungsbetrug'
    }
  ];

  function klauselCheck(l) {
    const text = l.beschreibung || '';
    const funde = [];
    KLAUSELN.forEach((k) => {
      if (k.nurKind && l.kind !== k.nurKind) return;
      const m = text.match(k.re);
      if (!m) return;
      /* Fundstelle als Satz zeigen, damit der Bezug klar ist. */
      const idx = text.indexOf(m[0]);
      const start = Math.max(0, text.lastIndexOf('.', idx) + 1);
      let end = text.indexOf('.', idx + m[0].length);
      if (end < 0) end = text.length;
      funde.push({
        id: k.id, titel: k.titel, bewertung: k.bewertung,
        erklaerung: k.erklaerung, quelle: k.quelle,
        fundstelle: text.slice(start, end + 1).trim()
      });
    });
    const rang = { kritisch: 0, achtung: 1, info: 2 };
    funde.sort((a, b) => rang[a.bewertung] - rang[b.bewertung]);
    return funde;
  }

  /* ================================================================
     4. Was es wirklich kostet
     ================================================================ */

  function kosten(l, profil) {
    const p = profil || {};
    const personen = U.clamp(p.haushalt || 1, 1, 6);
    const strom = Math.round(STROM_KWH[personen] * STROMPREIS / 12);
    const monatlich = [];
    const einmalig = [];

    if (l.kind === 'kauf') {
      const state = (G.cityByName[l.stadt] || {}).state || 'NRW';
      const grest = GRUNDERWERB[state] || 6.0;
      monatlich.push({ label: 'Hausgeld / Rücklage', betrag: l.hausgeld || Math.round(l.flaeche * 3.4), hinweis: l.type === 'haus' ? 'geschätzte Instandhaltungsrücklage' : 'Wohngeld laut Angebot' });
      monatlich.push({ label: 'Strom (' + personen + ' ' + U.plural(personen, 'Person', '{n} Personen') + ')', betrag: strom });
      monatlich.push({ label: 'Internet', betrag: INTERNET });
      monatlich.push({ label: 'Rundfunkbeitrag', betrag: RUNDFUNK });
      monatlich.push({ label: 'Wohngebäude-/Hausratversicherung', betrag: l.type === 'haus' ? 42 : 14 });
      einmalig.push({ label: 'Grunderwerbsteuer (' + U.dec(grest) + ' % in ' + state + ')', betrag: Math.round(l.kaufpreis * grest / 100) });
      einmalig.push({ label: 'Notar und Grundbuch (rund 2 %)', betrag: Math.round(l.kaufpreis * 0.02) });
      if (l.provision > 0) einmalig.push({ label: 'Maklercourtage (' + U.dec(l.provision) + ' %)', betrag: Math.round(l.kaufpreis * l.provision / 100) });
      einmalig.push({ label: 'Umzug', betrag: 1400 });
    } else {
      monatlich.push({ label: 'Kaltmiete', betrag: l.kalt });
      monatlich.push({ label: 'Nebenkosten', betrag: l.nebenkosten });
      monatlich.push({ label: 'Heizkosten', betrag: l.heizkosten });
      monatlich.push({ label: 'Strom (' + personen + ' ' + U.plural(personen, 'Person', '{n} Personen') + ')', betrag: strom });
      if (l.kind !== 'wg') {
        monatlich.push({ label: 'Internet', betrag: INTERNET });
        monatlich.push({ label: 'Rundfunkbeitrag', betrag: RUNDFUNK });
        monatlich.push({ label: 'Hausratversicherung', betrag: HAUSRAT });
      } else {
        monatlich.push({ label: 'Anteil Internet und Rundfunk', betrag: Math.round((INTERNET + RUNDFUNK) / (l.wg ? l.wg.groesse : 3)) });
      }
      if (l.quirks && l.quirks.indexOf('moebel') >= 0) monatlich.push({ label: 'Möblierungszuschlag', betrag: 180 });
      einmalig.push({ label: 'Kaution (' + l.kaution + ' ' + U.plural(l.kaution, 'Kaltmiete', '{n} Kaltmieten') + ')', betrag: l.kalt * l.kaution, rueck: true });
      if (l.provision > 0) einmalig.push({ label: 'Courtage (' + U.dec(l.provision) + ' Kaltmieten)', betrag: Math.round(l.kalt * l.provision * 1.19) });
      if (l.quirks && l.quirks.indexOf('abstand') >= 0) einmalig.push({ label: 'Abstandszahlung Küche', betrag: 4500 });
      if (!l.ausstattung.includes('Einbauküche') && l.kind !== 'wg') einmalig.push({ label: 'Küche anschaffen', betrag: 2600 });
      einmalig.push({ label: 'Umzug', betrag: l.kind === 'wg' ? 450 : 1200 });
      einmalig.push({ label: 'Ummeldung, Nachsendung, Kleinkram', betrag: 120 });
    }

    const monatSumme = U.sum(monatlich.map((m) => m.betrag));
    const einmalSumme = U.sum(einmalig.map((m) => m.betrag));
    const rueckzahlbar = U.sum(einmalig.filter((m) => m.rueck).map((m) => m.betrag));
    const netto = p.nettoEinkommen || 0;
    const quote = netto > 0 ? Math.round(monatSumme / netto * 100) : 0;

    return {
      monatlich, einmalig,
      monatSumme, einmalSumme, rueckzahlbar,
      erstesJahr: monatSumme * 12 + einmalSumme,
      quote,
      ampel: quote === 0 ? 'unbekannt' : quote <= 30 ? 'gut' : quote <= 40 ? 'mittel' : 'schlecht'
    };
  }

  /* Annuitätendarlehen: monatliche Rate und Restschuld nach Zinsbindung. */
  function finanzierung(kaufpreis, nebenkostenSumme, eigenkapital, zins, tilgung, jahre) {
    const gesamt = kaufpreis + nebenkostenSumme;
    const darlehen = Math.max(0, gesamt - eigenkapital);
    const rate = darlehen * (zins + tilgung) / 100 / 12;
    let rest = darlehen;
    const monatsZins = zins / 100 / 12;
    for (let m = 0; m < jahre * 12 && rest > 0; m++) {
      const z = rest * monatsZins;
      rest = Math.max(0, rest - (rate - z));
    }
    /* Volltilgungsdauer grob über die Restschuldformel abschätzen. */
    let laufzeit = 0, r2 = darlehen;
    while (r2 > 0 && laufzeit < 600) { r2 = r2 - (rate - r2 * monatsZins); laufzeit++; }
    return {
      gesamt, darlehen,
      rate: Math.round(rate),
      restschuld: Math.round(rest),
      eigenkapitalQuote: gesamt > 0 ? Math.round(eigenkapital / gesamt * 100) : 0,
      laufzeitJahre: Math.round(laufzeit / 12 * 10) / 10
    };
  }

  /* ================================================================
     5. Passung – warum steht dieses Inserat wo es steht
     ================================================================ */

  function pendelZeit(l, profil) {
    if (!profil || !profil.anker || !profil.anker.length) return null;
    let best = null;
    profil.anker.forEach((a) => {
      const min = U.travelMin(l, a, a.mittel || profil.verkehrsmittel || 'oepnv');
      if (!best || min < best.min) best = { min, anker: a };
    });
    return best;
  }

  function bewerten(l, profil) {
    const p = profil || {};
    const gw = p.gewichtung || { preis: 3, lage: 3, groesse: 3, ausstattung: 2, energie: 2, pendeln: 3, fairness: 3 };
    const teile = [];
    const add = (schluessel, label, anteil, gewicht, text) => {
      teile.push({ schluessel, label, anteil: U.clamp(anteil, 0, 1), gewicht, text });
    };

    /* Preis gegen Budget */
    const preis = l.kind === 'kauf' ? l.kaufpreis : l.warm;
    if (l.kind === 'kauf') {
      const budget = (p.budgetKauf || 0);
      if (budget > 0) {
        const v = preis <= budget * 0.85 ? 1 : preis <= budget ? 0.8 : preis <= budget * 1.1 ? 0.35 : 0;
        add('preis', 'Kaufpreis', v, gw.preis, U.eur(preis) + ' bei ' + U.eur(budget) + ' Budget');
      }
    } else if (p.budgetWarm > 0) {
      const b = p.budgetWarm;
      const v = preis <= b * 0.8 ? 1 : preis <= b ? 0.85 : preis <= b * 1.08 ? 0.4 : 0;
      add('preis', 'Warmmiete', v, gw.preis, U.eur(preis) + ' bei ' + U.eur(b) + ' Budget');
    }

    /* Größe */
    if (p.zimmerMin || p.flaecheMin) {
      const zOk = !p.zimmerMin || l.zimmer >= p.zimmerMin;
      const fOk = !p.flaecheMin || l.flaeche >= p.flaecheMin;
      const ueber = p.flaecheMin ? U.clamp((l.flaeche - p.flaecheMin) / Math.max(10, p.flaecheMin * 0.5), 0, 1) : 0.5;
      const v = zOk && fOk ? 0.7 + 0.3 * ueber : zOk || fOk ? 0.35 : 0;
      add('groesse', 'Zuschnitt', v, gw.groesse, U.dec(l.zimmer) + ' Zi. auf ' + l.flaeche + ' m²');
    }

    /* Lage: Wunschviertel schlägt Wunschstadt */
    if ((p.viertel && p.viertel.length) || (p.staedte && p.staedte.length)) {
      const vTreffer = p.viertel && p.viertel.indexOf(l.viertelKey) >= 0;
      const sTreffer = p.staedte && p.staedte.indexOf(l.stadt) >= 0;
      const v = vTreffer ? 1 : sTreffer ? (p.viertel && p.viertel.length ? 0.55 : 1) : 0.15;
      add('lage', 'Lage', v, gw.lage, l.viertel + ', ' + l.stadt);
    }

    /* Ausstattung */
    const muss = p.mussHaben || [], schoen = p.schoenWaere || [];
    if (muss.length || schoen.length) {
      const mussOk = muss.filter((a) => l.ausstattung.indexOf(a) >= 0).length;
      const schoenOk = schoen.filter((a) => l.ausstattung.indexOf(a) >= 0).length;
      const vm = muss.length ? mussOk / muss.length : 1;
      const vs = schoen.length ? schoenOk / schoen.length : 1;
      const v = vm * 0.7 + vs * 0.3;
      add('ausstattung', 'Ausstattung', v, gw.ausstattung,
        (muss.length ? mussOk + ' von ' + muss.length + ' Pflicht' : '') +
        (schoen.length ? (muss.length ? ', ' : '') + schoenOk + ' von ' + schoen.length + ' Wunsch' : ''));
    }

    /* Energie */
    const rang = ENERGIE_RANG[l.energie.klasse];
    add('energie', 'Energie', U.clamp(1 - rang / 8, 0, 1), gw.energie,
      'Klasse ' + l.energie.klasse + ' · ' + l.energie.kwh + ' kWh/(m²·a)');

    /* Pendeln */
    const pz = pendelZeit(l, p);
    if (pz) {
      const grenze = p.maxPendel || 45;
      const v = pz.min <= grenze * 0.5 ? 1 : pz.min <= grenze ? 0.75 : pz.min <= grenze * 1.5 ? 0.35 : 0.05;
      add('pendeln', 'Weg zur Arbeit', v, gw.pendeln, U.minutesLabel(pz.min) + ' nach ' + pz.anker.name);
    }

    /* Preisfairness */
    const mc = mietCheck(l), kc = kaufCheck(l);
    if (mc) {
      const v = mc.diff <= -12 ? 1 : mc.diff <= 5 ? 0.85 : mc.diff <= 15 ? 0.5 : mc.diff <= 25 ? 0.25 : 0.05;
      add('fairness', 'Preis-Leistung', v, gw.fairness,
        (mc.diff >= 0 ? '+' : '') + mc.diff + ' % zur Vergleichsmiete');
    } else if (kc) {
      const v = kc.diff <= -10 ? 1 : kc.diff <= 6 ? 0.85 : kc.diff <= 18 ? 0.5 : 0.2;
      add('fairness', 'Preis-Leistung', v, gw.fairness, 'Faktor ' + U.dec(kc.faktor) + ' Jahresmieten');
    }

    /* WG-Zusammenpassen fließt bei WGs zusätzlich ein */
    let wgTeil = null;
    if (l.kind === 'wg' && NW.match) {
      const m = NW.match.wgPassung(l, p);
      if (m) {
        wgTeil = m;
        add('wg', 'WG-Passung', m.score / 100, 4, m.kurz);
      }
    }

    /* Chancen: viele Bewerber senken die Aussicht spürbar */
    const bewerber = l.stats.bewerber;
    const chance = bewerber < 5 ? 1 : bewerber < 20 ? 0.8 : bewerber < 60 ? 0.55 : bewerber < 120 ? 0.3 : 0.15;
    add('chance', 'Aussicht', chance, 1, bewerber + ' ' + U.plural(bewerber, 'Interessent', '{n} Interessenten'));

    /* Anbieterqualität */
    const anb = (l.anbieter.quote / 100) * 0.7 + (l.anbieter.verifiziert ? 0.3 : 0);
    add('anbieter', 'Anbieter', anb, 1,
      l.anbieter.quote + ' % Antwortquote' + (l.anbieter.verifiziert ? ', geprüft' : ', ungeprüft'));

    const gesamtGewicht = U.sum(teile.map((t) => t.gewicht)) || 1;
    let score = U.sum(teile.map((t) => t.anteil * t.gewicht)) / gesamtGewicht * 100;

    /* Ausschlusskriterien und Warnungen ziehen kräftig ab. */
    const risiko = risikoCheck(l);
    if (risiko.stufe === 'warnung') score *= 0.45;
    else if (risiko.stufe === 'achtung') score *= 0.82;

    const fehlendePflicht = muss.filter((a) => l.ausstattung.indexOf(a) < 0);
    if (fehlendePflicht.length) score *= Math.pow(0.72, fehlendePflicht.length);

    return {
      score: Math.round(U.clamp(score, 0, 100)),
      teile: teile.sort((a, b) => b.gewicht * b.anteil - a.gewicht * a.anteil),
      risiko, mietCheck: mc, kaufCheck: kc, wg: wgTeil,
      pendel: pz,
      fehlendePflicht
    };
  }

  /* ================================================================
     6. Filtern und Sortieren
     ================================================================ */

  function leerFilter() {
    return {
      arten: ['miete', 'wg'],
      q: '',
      staedte: [], viertel: [],
      umkreis: null,
      preisMin: null, preisMax: null,
      zimmerMin: null, zimmerMax: null,
      flaecheMin: null, flaecheMax: null,
      baujahrMin: null,
      energieMax: null,
      ausstattung: [],
      freiBis: null,
      anbieterArt: [],
      provisionsfrei: false,
      nurVerifiziert: false,
      ohneVerdacht: true,
      wgArt: [], wgRauchen: null, wgHaustiere: null, wgGroesse: null, wgAlter: null,
      maxPendel: null,
      sort: 'passung'
    };
  }

  function passtText(l, q) {
    if (!q) return true;
    const worte = U.norm(q).split(' ').filter(Boolean);
    const heu = U.norm([l.titel, l.stadt, l.viertel, l.strasse, l.beschreibung, l.ausstattung.join(' '), l.anbieter.name].join(' '));
    return worte.every((w) => heu.indexOf(w) >= 0);
  }

  function filtern(listings, f, profil) {
    const p = profil || {};
    return listings.filter((l) => {
      if (f.arten.length && f.arten.indexOf(l.kind) < 0) return false;
      if (!passtText(l, f.q)) return false;
      if (f.staedte.length && f.staedte.indexOf(l.stadt) < 0) return false;
      if (f.viertel.length && f.viertel.indexOf(l.viertelKey) < 0) return false;
      if (f.umkreis && U.distKm(l, f.umkreis) > f.umkreis.km) return false;

      const preis = l.kind === 'kauf' ? l.kaufpreis : l.warm;
      if (f.preisMin != null && preis < f.preisMin) return false;
      if (f.preisMax != null && preis > f.preisMax) return false;

      if (f.zimmerMin != null && l.zimmer < f.zimmerMin) return false;
      if (f.zimmerMax != null && l.zimmer > f.zimmerMax) return false;
      if (f.flaecheMin != null && l.flaeche < f.flaecheMin) return false;
      if (f.flaecheMax != null && l.flaeche > f.flaecheMax) return false;
      if (f.baujahrMin != null && l.baujahr < f.baujahrMin) return false;
      if (f.energieMax && ENERGIE_RANG[l.energie.klasse] > ENERGIE_RANG[f.energieMax]) return false;

      if (f.ausstattung.length && !f.ausstattung.every((a) => l.ausstattung.indexOf(a) >= 0)) return false;
      if (f.freiBis && l.freiAb > f.freiBis) return false;
      if (f.anbieterArt.length && f.anbieterArt.indexOf(l.anbieter.art) < 0) return false;
      if (f.provisionsfrei && l.provision > 0) return false;
      if (f.nurVerifiziert && !l.anbieter.verifiziert) return false;
      if (f.ohneVerdacht && risikoCheck(l).stufe === 'warnung') return false;

      if (l.kind === 'wg' && l.wg) {
        if (f.wgArt.length && !f.wgArt.some((a) => l.wg.art.indexOf(a) >= 0)) return false;
        if (f.wgRauchen === 'rauchfrei' && l.wg.rauchen === 'überall erlaubt') return false;
        if (f.wgHaustiere === 'erlaubt' && l.wg.haustiere === 'nicht erlaubt') return false;
        if (f.wgGroesse && (l.wg.groesse < f.wgGroesse[0] || l.wg.groesse > f.wgGroesse[1])) return false;
        if (f.wgAlter && (l.wg.durchschnittsalter < f.wgAlter[0] || l.wg.durchschnittsalter > f.wgAlter[1])) return false;
      }

      if (f.maxPendel) {
        const pz = pendelZeit(l, p);
        if (pz && pz.min > f.maxPendel) return false;
      }
      return true;
    });
  }

  function sortieren(treffer, sort, profil) {
    const mitScore = treffer.map((l) => ({ l, b: bewerten(l, profil) }));
    const cmp = {
      passung: (a, b) => b.b.score - a.b.score,
      preis: (a, b) => (a.l.kind === 'kauf' ? a.l.kaufpreis : a.l.warm) - (b.l.kind === 'kauf' ? b.l.kaufpreis : b.l.warm),
      preisAb: (a, b) => (b.l.kind === 'kauf' ? b.l.kaufpreis : b.l.warm) - (a.l.kind === 'kauf' ? a.l.kaufpreis : a.l.warm),
      preisqm: (a, b) => (a.l.kind === 'kauf' ? a.l.kaufpreis : a.l.kalt) / a.l.flaeche - (b.l.kind === 'kauf' ? b.l.kaufpreis : b.l.kalt) / b.l.flaeche,
      neu: (a, b) => b.l.stats.online.localeCompare(a.l.stats.online),
      flaeche: (a, b) => b.l.flaeche - a.l.flaeche,
      zimmer: (a, b) => b.l.zimmer - a.l.zimmer,
      fairness: (a, b) => {
        const fa = a.b.mietCheck ? a.b.mietCheck.diff : a.b.kaufCheck ? a.b.kaufCheck.diff : 0;
        const fb = b.b.mietCheck ? b.b.mietCheck.diff : b.b.kaufCheck ? b.b.kaufCheck.diff : 0;
        return fa - fb;
      },
      chance: (a, b) => a.l.stats.bewerber - b.l.stats.bewerber,
      energie: (a, b) => ENERGIE_RANG[a.l.energie.klasse] - ENERGIE_RANG[b.l.energie.klasse],
      pendeln: (a, b) => {
        const pa = a.b.pendel ? a.b.pendel.min : 9999, pb = b.b.pendel ? b.b.pendel.min : 9999;
        return pa - pb;
      }
    };
    mitScore.sort(cmp[sort] || cmp.passung);
    return mitScore;
  }

  /* Marktüberblick zur aktuellen Trefferliste. */
  function marktLage(treffer) {
    if (!treffer.length) return null;
    const mieten = treffer.filter((l) => l.kind !== 'kauf');
    const werte = mieten.map((l) => l.kalt / l.flaeche).sort((a, b) => a - b);
    const warm = mieten.map((l) => l.warm).sort((a, b) => a - b);
    const med = (arr) => arr.length ? arr[Math.floor(arr.length / 2)] : 0;
    return {
      anzahl: treffer.length,
      medianQm: Math.round(med(werte) * 100) / 100,
      medianWarm: Math.round(med(warm)),
      neu7: treffer.filter((l) => U.daysSince(l.stats.online) <= 7).length,
      provisionsfrei: treffer.filter((l) => l.provision === 0).length,
      medianBewerber: med(treffer.map((l) => l.stats.bewerber).sort((a, b) => a - b))
    };
  }

  NW.analyse = {
    ENERGIE_RANG, GRUNDERWERB,
    mietCheck, kaufCheck, risikoCheck, klauselCheck, KLAUSELN,
    kosten, finanzierung, bewerten, pendelZeit,
    leerFilter, filtern, sortieren, marktLage, passtText
  };
})(window.NW = window.NW || {});
