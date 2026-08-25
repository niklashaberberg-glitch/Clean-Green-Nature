/* =====================================================================
   Nestwerk – Rechenkerne der Werkzeuge
   Chancen, Doppel-Inserate, Preisverlauf, Leistbarkeit, WBS-Vorprüfung,
   Wohngeld-Vorprüfung und der Katalog für die Nebenkostenprüfung.

   Grundsatz für alles Rechtliche hier: Wo Bund und Länder verschiedene
   Zahlen setzen, rechnet Nestwerk nicht heimlich mit einer davon,
   sondern legt die Zahl offen und lässt sie ändern.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;
  const G = NW.geo;
  const A = NW.analyse;

  /* ================================================================
     1. Chancen – wie wahrscheinlich ist eine Zusage
     ================================================================ */

  function chancen(l, profil) {
    const p = profil || {};
    const faktoren = [];
    const tipps = [];

    /* Ohne Angaben weiß Nestwerk nichts – und tut dann besser so, als
       wüsste es nichts, statt eine schwache Bewerbung zu unterstellen.
       Wer gerade erst angekommen ist, hat nicht schlechte Chancen,
       sondern noch kein Profil. */
    const unterlagenDa = Object.keys(p.unterlagen || {}).filter((k) => p.unterlagen[k]).length;
    const kenntNichts = !p.nettoEinkommen && !unterlagenDa;

    /* Ausgangspunkt: Wer hat sich sonst noch beworben? */
    const mitbewerber = Math.max(0, l.stats.bewerber);
    let chance = 1 / (mitbewerber + 1);
    let vielfach = 1;

    const wiegen = (mal, label, text, gut) => {
      vielfach *= mal;
      faktoren.push({ label, text, gut, wirkung: mal >= 1.12 ? 'plus' : mal <= 0.88 ? 'minus' : 'neutral' });
    };

    /* Die Regel, an der die meisten Bewerbungen scheitern: viele
       Vermieter verlangen das Dreifache der Kaltmiete als Nettoeinkommen. */
    if (l.kind !== 'kauf' && p.nettoEinkommen) {
      const verhaeltnis = p.nettoEinkommen / Math.max(1, l.kalt);
      if (verhaeltnis >= 3.5) wiegen(1.55, 'Einkommen', 'Dein Netto ist das ' + U.dec(verhaeltnis) + '-fache der Kaltmiete – klar über der üblichen Grenze.', true);
      else if (verhaeltnis >= 3) wiegen(1.25, 'Einkommen', 'Dein Netto liegt beim ' + U.dec(verhaeltnis) + '-fachen der Kaltmiete – genau im erwarteten Bereich.', true);
      else if (verhaeltnis >= 2.5) wiegen(0.6, 'Einkommen', 'Dein Netto ist nur das ' + U.dec(verhaeltnis) + '-fache der Kaltmiete. Viele Vermieter setzen bei 3 an.', false);
      else wiegen(0.25, 'Einkommen', 'Mit dem ' + U.dec(verhaeltnis) + '-fachen der Kaltmiete liegst du deutlich unter der üblichen Grenze.', false);

      if (verhaeltnis < 3) {
        tipps.push('Eine Bürgschaft von Angehörigen oder eine Mietkautionsbürgschaft gleicht ein knappes Einkommen oft aus – biete sie von dir aus an.');
        tipps.push('Rechne dein Haushaltsnetto zusammen, wenn ihr zu zweit einzieht. Beide Einkommen zählen.');
      }
    } else if (l.kind !== 'kauf') {
      tipps.push('Trag dein Nettoeinkommen im Profil ein – ohne diese Zahl kann Nestwerk deine Chancen nicht einschätzen.');
    }

    /* Vollständige Unterlagen entscheiden bei gleich starken Bewerbungen. */
    const noetig = ['selbstauskunft', 'gehaltsnachweise', 'schufa', 'mietschuldenfrei'];
    const da = noetig.filter((k) => p.unterlagen && p.unterlagen[k]).length;
    if (da === noetig.length) wiegen(1.4, 'Unterlagen', 'Deine Mappe ist vollständig – du kannst am selben Tag zusagen.', true);
    else if (da >= 2) wiegen(1.05, 'Unterlagen', da + ' von ' + noetig.length + ' Unterlagen liegen bereit.', true);
    else {
      wiegen(0.7, 'Unterlagen', 'Nur ' + da + ' von ' + noetig.length + ' Unterlagen liegen bereit.', false);
      tipps.push('Die Schufa-Auskunft dauert einige Tage. Beantrage sie jetzt, nicht wenn die Wohnung schon weg ist.');
    }

    /* Wer früh dran ist, wird gelesen. */
    const tage = U.daysSince(l.stats.online);
    if (tage <= 1) wiegen(1.5, 'Zeitpunkt', 'Das Inserat ist frisch – deine Nachricht steht weit oben im Postfach.', true);
    else if (tage <= 4) wiegen(1.15, 'Zeitpunkt', U.t('Seit {0} Tagen online, noch früh genug.').replace('{0}', tage), true);
    else if (tage <= 14) wiegen(0.85, 'Zeitpunkt', U.t('Seit {0} Tagen online – die ersten Besichtigungen laufen wahrscheinlich schon.').replace('{0}', tage), false);
    else wiegen(0.55, 'Zeitpunkt', U.t('Seit {0} Tagen online. Entweder ist es schwer vermietbar, oder die Vergabe stockt.').replace('{0}', tage), false);

    /* Belegung: zu viele Menschen auf zu wenig Zimmern ist ein häufiger Ablehnungsgrund. */
    if (l.kind !== 'kauf' && p.haushalt) {
      const proPerson = l.flaeche / p.haushalt;
      if (proPerson < 12) wiegen(0.5, 'Belegung', p.haushalt + ' Personen auf ' + l.flaeche + ' m² – das gilt vielen Vermietern als zu eng.', false);
      else if (proPerson > 45 && p.haushalt === 1) wiegen(0.9, 'Belegung', 'Für eine Person recht groß; manche Vermieter bevorzugen Paare.', false);
      else wiegen(1.05, 'Belegung', U.num(proPerson) + ' m² je Person – unauffällig.', true);
    }

    /* Ein Wohnberechtigungsschein ist entweder da oder nicht. */
    if (/Wohnberechtigungsschein/i.test(l.beschreibung)) {
      if (p.unterlagen && p.unterlagen.wbs) wiegen(2.2, 'Wohnberechtigungsschein', 'Du hast einen WBS – das schließt die meisten Mitbewerber aus.', true);
      else {
        wiegen(0.08, 'Wohnberechtigungsschein', 'Für diese Wohnung ist ein WBS nötig, den du nicht hast.', false);
        tipps.push('Prüf im Werkzeug „Wohnberechtigungsschein“, ob du Anspruch hättest. Die Bearbeitung dauert oft mehrere Wochen.');
      }
    }

    /* Ein Anbieter, der nicht antwortet, macht jede Bewerbung wertlos. */
    if (l.anbieter.quote < 45) {
      wiegen(0.7, 'Anbieter', U.t('Der Anbieter antwortet nur in {0} % der Fälle.').replace('{0}', l.anbieter.quote), false);
      tipps.push('Halte parallel zwei Alternativen warm – bei dieser Antwortquote ist Schweigen wahrscheinlich.');
    } else if (l.anbieter.quote > 85) {
      wiegen(1.12, 'Anbieter', l.anbieter.quote + ' % Antwortquote – hier bekommst du zumindest eine Rückmeldung.', true);
    }

    /* Haustiere sind bei ausdrücklichem Verbot ein hartes Kriterium. */
    if (p.haustiere && p.haustiere !== 'keine' && p.haustiere !== 'klein'
      && !l.ausstattung.includes('Haustiere erlaubt')) {
      wiegen(0.65, 'Haustiere', 'Haustiere sind im Inserat nicht ausdrücklich erlaubt.', false);
      tipps.push('Frag vor der Besichtigung nach dem Haustier – lieber eine Absage am Telefon als eine verschwendete Anfahrt.');
    }

    const risiko = A.risikoCheck(l);
    if (risiko.stufe === 'warnung') {
      tipps.unshift('Dieses Inserat zeigt deutliche Betrugsmerkmale. Bevor du Zeit investierst: lies den Prüfhinweis oben.');
    }

    chance = U.clamp(chance * vielfach, 0.005, 0.85);
    const prozent = Math.round(chance * 100);

    if (kenntNichts) {
      return {
        prozent, mitbewerber, faktoren: faktoren.filter((f) => f.label === 'Zeitpunkt' || f.label === 'Anbieter'),
        tipps: ['Trag Einkommen und vorhandene Unterlagen im Profil ein – danach kann Nestwerk deine Chancen wirklich einschätzen.']
          .concat(l.besichtigungen.length ? ['Nimm einen der hinterlegten Termine sofort – gebuchte Termine kommen vor formlosen Anfragen.'] : []),
        staerke: 'unbekannt', andrang: mitbewerber === 0 ? 'keiner' : mitbewerber < 8 ? 'gering'
          : mitbewerber < 30 ? 'spürbar' : mitbewerber < 80 ? 'hoch' : 'sehr hoch',
        stufe: 'unbekannt',
        satz: U.t('Über deine Bewerbung weiß Nestwerk noch nichts – ohne Einkommen und Unterlagen im Profil '
          + 'lässt sich nichts einschätzen. Was feststeht:') + ' '
          + (mitbewerber === 0 ? U.t('Bisher hat sich niemand sonst gemeldet.')
            : mitbewerber === 1 ? U.t('Bisher hat sich eine weitere Person gemeldet.')
              : U.t('Es haben sich bereits {0} andere gemeldet.').replace('{0}', mitbewerber))
      };
    }

    /* Zwei Dinge, die nichts miteinander zu tun haben, und die deshalb
       getrennt gehören: Wie gut deine Bewerbung ist – das kannst du
       ändern. Und wie viele sich sonst noch bewerben – das nicht.
       Eine einzige Prozentzahl vermischt beides und entmutigt nur. */
    const staerke = vielfach >= 1.6 ? 'stark' : vielfach >= 1.05 ? 'solide'
      : vielfach >= 0.6 ? 'durchschnittlich' : 'schwach';
    const andrang = mitbewerber === 0 ? 'keiner' : mitbewerber < 8 ? 'gering'
      : mitbewerber < 30 ? 'spürbar' : mitbewerber < 80 ? 'hoch' : 'sehr hoch';

    const staerkeSatz = {
      stark: 'Deine Bewerbung ist stärker als die der meisten Mitbewerber.',
      solide: 'Deine Bewerbung ist solide – nichts spricht gegen dich.',
      durchschnittlich: 'Deine Bewerbung fällt weder positiv noch negativ auf.',
      schwach: 'An deiner Bewerbung gibt es Punkte, die dich hier aussortieren könnten.'
    }[staerke];

    const andrangSatz = mitbewerber === 0
      ? 'Und du bist bisher die einzige Person, die sich meldet – besser wird der Zeitpunkt nicht.'
      : mitbewerber === 1
        ? 'Bisher meldet sich außer dir nur eine weitere Person.'
        : 'Es haben sich aber schon ' + mitbewerber + ' andere gemeldet, sodass rechnerisch etwa '
          + prozent + ' von 100 Bewerbungen wie deiner zum Zug kämen. '
          + (staerke === 'stark' || staerke === 'solide'
            ? 'Das liegt am Andrang, nicht an dir.'
            : 'Bei dieser Konkurrenz zählt jeder Punkt, den du verbessern kannst.');

    if (mitbewerber > 80) {
      tipps.push('Bei ' + mitbewerber + ' Interessenten entscheidet am Ende oft der Zufall. Bewirb dich, aber halte parallel andere Optionen offen.');
    }
    if (l.besichtigungen.length) {
      tipps.push('Nimm einen der hinterlegten Termine sofort – gebuchte Termine kommen vor formlosen Anfragen.');
    }
    if (staerke === 'stark' && mitbewerber > 30) {
      tipps.push('Deine Mappe ist gut. Nutz sie: Bewirb dich auf mehr Objekte statt auf das eine – bei diesem Andrang ist Menge wichtiger als Auswahl.');
    }

    return {
      prozent, mitbewerber, faktoren, tipps: U.uniq(tipps).slice(0, 4),
      staerke, andrang,
      /* Die Ampel folgt der Stärke, nicht der Prozentzahl: Sie zeigt,
         was in deiner Hand liegt. */
      stufe: staerke === 'stark' ? 'gut' : staerke === 'solide' ? 'gut'
        : staerke === 'durchschnittlich' ? 'mittel' : 'schwach',
      satz: staerkeSatz + ' ' + andrangSatz
    };
  }

  /* ================================================================
     2. Doppelt eingestellte Wohnungen
     ================================================================ */

  /* Dieselbe Wohnung taucht auf Portalen regelmäßig mehrfach auf –
     von zwei Maklern, oder vom Eigentümer und vom Makler zugleich.
     Wer das nicht merkt, bewirbt sich zweimal auf dasselbe Objekt. */
  function duplikate(l, alle) {
    const kandidaten = (alle || NW.data.listings).filter((x) => {
      if (x.id === l.id) return false;
      if (x.kind !== l.kind) return false;
      if (x.viertelKey !== l.viertelKey) return false;
      if (Math.abs(x.flaeche - l.flaeche) > 2) return false;
      if (Math.abs(x.zimmer - l.zimmer) > 0.5) return false;
      if (Math.abs(x.baujahr - l.baujahr) > 3) return false;
      const preisA = l.kind === 'kauf' ? l.kaufpreis : l.kalt;
      const preisB = x.kind === 'kauf' ? x.kaufpreis : x.kalt;
      if (Math.abs(preisA - preisB) / Math.max(1, preisA) > 0.06) return false;
      return true;
    });

    return kandidaten.map((x) => {
      const merkmale = [];
      if (x.flaeche === l.flaeche) merkmale.push('gleiche Fläche');
      if (x.zimmer === l.zimmer) merkmale.push('gleiche Zimmerzahl');
      if (x.baujahr === l.baujahr) merkmale.push('gleiches Baujahr');
      if (x.etage === l.etage) merkmale.push('gleiche Etage');
      if (U.distKm(x, l) < 0.4) merkmale.push('nahezu gleiche Lage');
      const gleicherAnbieter = x.anbieter.name === l.anbieter.name;
      return {
        listing: x, merkmale,
        gleicherAnbieter,
        sicherheit: Math.min(95, 45 + merkmale.length * 12),
        deutung: gleicherAnbieter
          ? 'Derselbe Anbieter hat zwei sehr ähnliche Wohnungen eingestellt – vermutlich zwei Einheiten im selben Haus.'
          : 'Zwei verschiedene Anbieter, nahezu identische Angaben. Häufig dieselbe Wohnung über zwei Wege.'
      };
    }).sort((a, b) => b.sicherheit - a.sicherheit).slice(0, 3);
  }

  /* ================================================================
     3. Preisverlauf je Viertel
     ================================================================ */

  /* Erzeugt aus der Kennung des Viertels eine stabile Zeitreihe:
     Grundtrend, jahreszeitliche Schwankung, etwas Rauschen. */
  function preisreihe(viertelKey, monate) {
    const d = G.districtByKey[viertelKey];
    if (!d) return null;
    const n = monate || 36;
    const r = U.rng(U.hash(viertelKey));
    const jahrestrend = 0.018 + r() * 0.055;          /* 1,8 % bis 7,3 % im Jahr */
    const heute = NW.now();
    const punkte = [];
    let rauschen = 0;
    for (let i = n - 1; i >= 0; i--) {
      const datum = new Date(heute.getFullYear(), heute.getMonth() - i, 1);
      const jahre = -i / 12;
      const trend = Math.pow(1 + jahrestrend, jahre);
      const saison = 1 + Math.sin((datum.getMonth() + 1) / 12 * Math.PI * 2) * 0.012;
      rauschen = rauschen * 0.6 + (r() - 0.5) * 0.02;
      punkte.push({
        datum: U.isoDate(datum),
        monat: datum.getMonth(),
        jahr: datum.getFullYear(),
        wert: Math.round(d.mietBasis * trend * saison * (1 + rauschen) * 100) / 100
      });
    }
    const erst = punkte[0].wert, letzt = punkte[punkte.length - 1].wert;
    return {
      viertel: d,
      punkte,
      jetzt: letzt,
      vorJahr: punkte[Math.max(0, punkte.length - 13)].wert,
      start: erst,
      veraenderungJahr: Math.round((letzt / punkte[Math.max(0, punkte.length - 13)].wert - 1) * 1000) / 10,
      veraenderungGesamt: Math.round((letzt / erst - 1) * 1000) / 10,
      jahrestrend: Math.round(jahrestrend * 1000) / 10
    };
  }

  /* Mehrere Viertel für den Vergleich, absteigend nach heutigem Preis. */
  function preisvergleich(stadt) {
    const c = G.cityByName[stadt];
    if (!c) return [];
    return c.districtList.map((d) => preisreihe(d.key)).filter(Boolean)
      .sort((a, b) => b.jetzt - a.jetzt);
  }

  /* ================================================================
     4. Leistbarkeit
     ================================================================ */

  function leistbarkeit(angaben) {
    const netto = Math.max(0, Number(angaben.netto) || 0);
    const haushalt = U.clamp(Number(angaben.haushalt) || 1, 1, 8);
    const schulden = Math.max(0, Number(angaben.rateSonstige) || 0);
    const verfuegbar = Math.max(0, netto - schulden);

    /* Zwei verschiedene Grenzen, die oft verwechselt werden:
       Was du dir leisten kannst – und was Vermieter sehen wollen. */
    const warmBequem = Math.round(verfuegbar * 0.30);
    const warmGrenze = Math.round(verfuegbar * 0.35);
    const warmKritisch = Math.round(verfuegbar * 0.40);
    const kaltVermieter = Math.round(netto / 3);

    /* Was vom Warmbudget nach Abzug der Nebenkosten als Kaltmiete bleibt. */
    const nkAnteil = 0.26;
    const kaltAusBudget = Math.round(warmBequem * (1 - nkAnteil));
    const kaltMoeglich = Math.min(kaltAusBudget, kaltVermieter);
    const engpass = kaltVermieter < kaltAusBudget ? 'vermieter' : 'budget';

    /* Wie groß darf die Wohnung sein – je Stadt verschieden. */
    const staedte = G.CITIES.map((c) => {
      const basis = c.mietBasis;
      return {
        stadt: c.name,
        proQm: basis,
        flaeche: Math.floor(kaltMoeglich / basis),
        reicht: Math.floor(kaltMoeglich / basis) >= (haushalt === 1 ? 30 : haushalt * 22)
      };
    }).sort((a, b) => b.flaeche - a.flaeche);

    /* Kauf: Was trägt die Rate, die dem Warmbudget entspricht? */
    const eigenkapital = Math.max(0, Number(angaben.eigenkapital) || 0);
    const zins = Number(angaben.zins) || 3.7;
    const tilgung = Number(angaben.tilgung) || 2;
    const rate = warmGrenze;
    const darlehen = rate * 12 / ((zins + tilgung) / 100);
    /* Nebenkosten im Schnitt rund 10 % – sie müssen aus dem Eigenkapital kommen. */
    const nebenkostenAnteil = 0.10;
    const kaufpreis = Math.max(0, (darlehen + eigenkapital) / (1 + nebenkostenAnteil));

    return {
      netto, haushalt, verfuegbar,
      warmBequem, warmGrenze, warmKritisch,
      kaltVermieter, kaltAusBudget, kaltMoeglich, engpass,
      staedte,
      kauf: {
        rate: Math.round(rate),
        darlehen: Math.round(darlehen),
        kaufpreis: Math.round(kaufpreis / 1000) * 1000,
        eigenkapital, zins, tilgung,
        nebenkosten: Math.round(kaufpreis * nebenkostenAnteil)
      }
    };
  }

  /* ================================================================
     5. Wohnberechtigungsschein – Vorprüfung
     ================================================================ */

  /* Die Einkommensgrenzen setzen die Länder selbst und weichen teils
     erheblich voneinander ab. Nestwerk rechnet deshalb nicht heimlich
     mit einer Zahl, sondern legt sie offen und macht sie änderbar.
     Voreingestellt ist der Rahmen des Bundes aus § 9 WoFG. */
  const WBS_BUND = { eine: 12000, zwei: 18000, jeWeitere: 4100, jeKind: 500 };

  const WBS_ABZUEGE = [
    { id: 'werbung', label: 'Werbungskostenpauschale', betrag: 1230, hinweis: 'Pauschbetrag je erwerbstätiger Person, sofern keine höheren Kosten nachgewiesen werden.' },
    { id: 'steuern', label: 'Pauschale für Steuern', anteil: 10, hinweis: '10 % des Bruttoeinkommens, wenn Einkommensteuer gezahlt wird.' },
    { id: 'kranken', label: 'Pauschale für Kranken- und Pflegeversicherung', anteil: 10, hinweis: '10 %, wenn Pflichtbeiträge geleistet werden.' },
    { id: 'rente', label: 'Pauschale für Rentenversicherung', anteil: 10, hinweis: '10 %, wenn Pflichtbeiträge geleistet werden.' }
  ];

  function wbsPruefung(angaben) {
    const brutto = Math.max(0, Number(angaben.brutto) || 0);
    const personen = U.clamp(Number(angaben.personen) || 1, 1, 10);
    const kinder = U.clamp(Number(angaben.kinder) || 0, 0, 10);
    const erwerbstaetige = U.clamp(Number(angaben.erwerbstaetige) || 1, 0, 10);

    const abzuege = [];
    let summe = 0;
    if (angaben.werbungskosten !== false && erwerbstaetige > 0) {
      const b = 1230 * erwerbstaetige;
      abzuege.push({ label: 'Werbungskosten (' + erwerbstaetige + ' × 1.230 €)', betrag: b });
      summe += b;
    }
    ['steuern', 'kranken', 'rente'].forEach((k) => {
      if (!angaben[k]) return;
      const eintrag = WBS_ABZUEGE.find((x) => x.id === k);
      const b = Math.round(brutto * eintrag.anteil / 100);
      abzuege.push({ label: eintrag.label + ' (' + eintrag.anteil + ' %)', betrag: b });
      summe += b;
    });
    /* Freibeträge, die es in allen Ländern in ähnlicher Form gibt. */
    if (angaben.schwerbehindert) { abzuege.push({ label: 'Freibetrag Schwerbehinderung', betrag: 2100 }); summe += 2100; }
    if (kinder > 0) {
      const b = kinder * 600;
      abzuege.push({ label: 'Freibetrag für ' + kinder + ' ' + U.plural(kinder, 'Kind', 'Kinder'), betrag: b });
      summe += b;
    }

    const massgeblich = Math.max(0, brutto - summe);

    const grenzeVorgabe = Number(angaben.grenze) || 0;
    const grenzeBund = (personen === 1 ? WBS_BUND.eine
      : personen === 2 ? WBS_BUND.zwei
        : WBS_BUND.zwei + (personen - 2) * WBS_BUND.jeWeitere) + kinder * WBS_BUND.jeKind;
    const grenze = grenzeVorgabe > 0 ? grenzeVorgabe : grenzeBund;

    const abstand = grenze - massgeblich;
    const quote = grenze > 0 ? massgeblich / grenze : 0;

    return {
      brutto, personen, kinder, abzuege, summeAbzuege: summe,
      massgeblich, grenze, grenzeBund, eigeneGrenze: grenzeVorgabe > 0,
      abstand, quote,
      ergebnis: quote <= 0.85 ? 'wahrscheinlich' : quote <= 1 ? 'knapp' : 'unwahrscheinlich',
      satz: quote <= 0.85
        ? 'Dein maßgebliches Einkommen liegt deutlich unter der eingestellten Grenze – ein Antrag lohnt sich.'
        : quote <= 1
          ? 'Du liegst knapp unter der Grenze. Kleine Abweichungen bei den Abzügen entscheiden hier.'
          : 'Du liegst über der eingestellten Grenze. Prüfe, ob dein Land höhere Grenzen oder weitere Stufen kennt.'
    };
  }

  /* ================================================================
     6. Wohngeld – Vorprüfung ohne erfundenen Betrag
     ================================================================ */

  /* Die Höhe folgt einer Formel mit Beiwerten, die sich je nach
     Haushaltsgröße unterscheiden und regelmäßig geändert werden. Eine
     Zahl daraus zu erfinden wäre schlimmer als keine. Nestwerk prüft
     deshalb die Voraussetzungen und sagt, wo der Betrag herkommt. */
  const WOHNGELD_AUSSCHLUSS = [
    { id: 'buergergeld', label: 'Ich beziehe Bürgergeld', text: 'Beim Bürgergeld sind die Wohnkosten bereits enthalten. Wohngeld gibt es dann nicht zusätzlich.' },
    { id: 'grundsicherung', label: 'Ich beziehe Grundsicherung oder Sozialhilfe', text: 'Auch hier sind die Unterkunftskosten Teil der Leistung.' },
    { id: 'bafoegVoll', label: 'Ich bekomme BAföG oder Berufsausbildungsbeihilfe', text: 'Wer dem Grunde nach förderfähig ist, ist vom Wohngeld in der Regel ausgeschlossen. Ausnahmen gibt es, wenn weitere Haushaltsmitglieder ohne Förderung mitwohnen.' },
    { id: 'eigentum', label: 'Ich wohne im eigenen Wohneigentum', text: 'Dann heißt die Leistung Lastenzuschuss und wird anders berechnet – der Antrag läuft über dieselbe Stelle.' }
  ];

  function wohngeldPruefung(angaben) {
    const gruende = WOHNGELD_AUSSCHLUSS.filter((a) => angaben[a.id]);
    const personen = U.clamp(Number(angaben.personen) || 1, 1, 12);
    const brutto = Math.max(0, Number(angaben.brutto) || 0);
    const miete = Math.max(0, Number(angaben.miete) || 0);

    /* Grobe Orientierung: Oberhalb dieser Einkommen läuft Wohngeld in
       der Praxis aus. Bewusst als Spanne und ausdrücklich als Faustwert. */
    const faustwert = 1300 + (personen - 1) * 500;
    const belastung = brutto > 0 ? miete / brutto : 0;

    let ergebnis, satz;
    if (gruende.length) {
      ergebnis = 'ausgeschlossen';
      satz = 'Für deine Situation kommt Wohngeld nach den angegebenen Punkten nicht in Betracht.';
    } else if (brutto === 0 || miete === 0) {
      ergebnis = 'unklar';
      satz = 'Trag Bruttoeinkommen und Warmmiete ein, dann ordnet Nestwerk das ein.';
    } else if (brutto <= faustwert && belastung >= 0.25) {
      ergebnis = 'wahrscheinlich';
      satz = 'Einkommen und Mietbelastung liegen in dem Bereich, in dem Wohngeld regelmäßig bewilligt wird. Ein Antrag lohnt sich.';
    } else if (brutto <= faustwert * 1.4) {
      ergebnis = 'moeglich';
      satz = 'Es liegt im Grenzbereich. Weil Mietstufe und Abzüge stark hineinspielen, entscheidet erst die genaue Berechnung.';
    } else {
      ergebnis = 'unwahrscheinlich';
      satz = 'Bei diesem Einkommen wird Wohngeld selten bewilligt – ausgeschlossen ist es aber nicht, etwa bei hoher Mietstufe oder vielen Haushaltsmitgliedern.';
    }

    return {
      gruende, personen, brutto, miete, faustwert,
      belastung: Math.round(belastung * 100),
      ergebnis, satz,
      hinweise: [
        'Wohngeld wird ab Antragsmonat gezahlt, nicht rückwirkend. Ein Antrag am Monatsende kostet einen vollen Monat.',
        'Zuständig ist die Wohngeldstelle der Stadt oder des Kreises. Den Betrag berechnet sie nach § 19 WoGG.',
        'Auch wer nur wenige Euro bekommt, erhält damit oft Anspruch auf weitere Vergünstigungen.'
      ]
    };
  }

  /* ================================================================
     7. Nebenkostenabrechnung prüfen
     ================================================================ */

  /* Umlagefähig ist nur, was die Betriebskostenverordnung aufzählt.
     Alles andere trägt die Vermieterseite – auch wenn es im Vertrag steht. */
  const BETRIEBSKOSTEN = [
    { id: 'grundsteuer', label: 'Grundsteuer', ok: true, hinweis: 'Laufende öffentliche Lasten des Grundstücks.' },
    { id: 'wasser', label: 'Wasserversorgung', ok: true, hinweis: 'Verbrauch, Grundgebühr, Zählermiete, Eichung.' },
    { id: 'abwasser', label: 'Entwässerung', ok: true },
    { id: 'heizung', label: 'Heizung und Warmwasser', ok: true, hinweis: 'Mindestens 50 % müssen nach Verbrauch verteilt werden – sonst darfst du 15 % kürzen.' },
    { id: 'aufzug', label: 'Aufzug', ok: true, hinweis: 'Auch Erdgeschossmieter zahlen mit, sofern der Vertrag es vorsieht.' },
    { id: 'strasse', label: 'Straßenreinigung und Müllabfuhr', ok: true },
    { id: 'gebaeude', label: 'Gebäudereinigung und Ungezieferbekämpfung', ok: true },
    { id: 'garten', label: 'Gartenpflege', ok: true, hinweis: 'Nur Pflege. Eine Neuanlage ist Instandsetzung und nicht umlagefähig.' },
    { id: 'beleuchtung', label: 'Beleuchtung der Gemeinschaftsflächen', ok: true },
    { id: 'schornstein', label: 'Schornsteinreinigung', ok: true },
    { id: 'versicherung', label: 'Sach- und Haftpflichtversicherung', ok: true, hinweis: 'Gebäude, Glas, Haftpflicht – nicht die Rechtsschutzversicherung.' },
    { id: 'hauswart', label: 'Hauswart', ok: true, hinweis: 'Nur die Hausmeistertätigkeit. Reparaturen und Verwaltung müssen herausgerechnet werden.' },
    { id: 'antenne', label: 'Gemeinschaftsantenne oder Kabelanschluss', ok: true, hinweis: 'Seit Juli 2024 nur noch, wenn du dem Vertrag zustimmen konntest.' },
    { id: 'waschraum', label: 'Gemeinschaftliche Waschküche', ok: true },
    { id: 'sonstige', label: 'Sonstige Betriebskosten', ok: true, hinweis: 'Nur wenn sie im Mietvertrag einzeln benannt sind – eine Sammelklausel reicht nicht.' },

    { id: 'verwaltung', label: 'Verwaltungskosten', ok: false, hinweis: 'Hausverwaltung, Kontoführung, Porto, Steuerberatung: trägt die Vermieterseite.' },
    { id: 'instand', label: 'Instandhaltung und Reparaturen', ok: false, hinweis: 'Auch dann nicht umlagefähig, wenn sie klein sind.' },
    { id: 'ruecklage', label: 'Instandhaltungsrücklage', ok: false, hinweis: 'Bei Eigentumswohnungen häufig fälschlich mit abgerechnet.' },
    { id: 'leerstand', label: 'Kosten leerstehender Wohnungen', ok: false, hinweis: 'Der Leerstandsanteil bleibt bei der Vermieterseite.' },
    { id: 'bank', label: 'Bank- und Mahngebühren', ok: false },
    { id: 'wartungReparatur', label: 'Reparaturanteil in Wartungsverträgen', ok: false, hinweis: 'Wartung ja, die enthaltene Reparaturpauschale nein.' },
    { id: 'neuanschaffung', label: 'Neuanschaffungen und Modernisierung', ok: false, hinweis: 'Modernisierung läuft über eine Mieterhöhung, nicht über die Nebenkosten.' },
    { id: 'rechtsschutz', label: 'Rechtsschutz- und Mietausfallversicherung', ok: false }
  ];

  function nebenkostenPruefung(angaben) {
    const positionen = angaben.positionen || {};
    const gefunden = [];
    let summeOk = 0, summeNicht = 0;
    BETRIEBSKOSTEN.forEach((b) => {
      const betrag = Number(positionen[b.id]) || 0;
      if (!betrag) return;
      gefunden.push({ eintrag: b, betrag });
      if (b.ok) summeOk += betrag; else summeNicht += betrag;
    });

    const befunde = [];
    if (summeNicht > 0) {
      befunde.push({
        art: 'kritisch',
        titel: U.eur(summeNicht) + ' vermutlich zu Unrecht umgelegt',
        text: 'Diese Posten zählt die Betriebskostenverordnung nicht auf. Widersprich schriftlich und verlange eine berichtigte Abrechnung.'
      });
    }

    /* Fristen sind hier das schärfste Schwert – und werden am häufigsten verpasst. */
    if (angaben.endeZeitraum) {
      const ende = new Date(angaben.endeZeitraum + 'T12:00:00');
      const frist = U.addDays(ende, 365);
      const zugang = angaben.zugang ? new Date(angaben.zugang + 'T12:00:00') : null;
      if (zugang && zugang > frist) {
        befunde.push({
          art: 'kritisch',
          titel: 'Abrechnung zu spät zugegangen',
          text: 'Die Abrechnung musste bis zum ' + U.dateDE(U.isoDate(frist)) + ' bei dir sein. Danach kann keine Nachzahlung mehr verlangt werden – ein Guthaben musst du trotzdem bekommen.'
        });
      } else if (zugang) {
        const einwendung = U.addDays(zugang, 365);
        befunde.push({
          art: 'info',
          titel: 'Deine Einwendungsfrist läuft bis ' + U.dateDE(U.isoDate(einwendung)),
          text: 'Bis dahin kannst du Einwendungen erheben. Verlange vorher Einsicht in die Belege – das steht dir zu.'
        });
      }
    }

    if (angaben.heizungNachFlaeche) {
      befunde.push({
        art: 'kritisch',
        titel: 'Heizkosten nicht nach Verbrauch verteilt',
        text: 'Mindestens die Hälfte der Heizkosten muss nach erfasstem Verbrauch abgerechnet werden. Fehlt das, darfst du deinen Anteil um 15 % kürzen.'
      });
    }
    if (angaben.keineEinsicht) {
      befunde.push({
        art: 'achtung',
        titel: 'Belegeinsicht verweigert',
        text: 'Die Einsicht in die Originalbelege ist dein Recht. Bis sie gewährt wird, kannst du die Nachzahlung zurückhalten.'
      });
    }
    if (angaben.vorauszahlung && angaben.gesamt) {
      const diff = Number(angaben.gesamt) - Number(angaben.vorauszahlung);
      befunde.push({
        art: diff > 0 ? 'info' : 'gut',
        titel: diff > 0 ? 'Nachzahlung ' + U.eur(diff) : 'Guthaben ' + U.eur(-diff),
        text: diff > 0
          ? 'Nachzahlungen sind erst fällig, wenn die Abrechnung formell richtig ist. Prüf sie in Ruhe – du hast dafür 30 Tage.'
          : 'Das Guthaben ist mit der nächsten Miete zu verrechnen oder auszuzahlen.'
      });
    }

    return { gefunden, summeOk, summeNicht, befunde, katalog: BETRIEBSKOSTEN };
  }

  /* ================================================================
     8. Besichtigungen zu einer Route ordnen
     ================================================================ */

  /* Kurzer Weg zuerst: Von jedem Punkt aus wird der nächstgelegene
     noch offene Termin gewählt. Bei einer Handvoll Terminen genügt das
     und ist nachvollziehbarer als ein exaktes Verfahren. */
  function tagesplan(termine, start) {
    if (!termine.length) return { reihenfolge: [], gesamtMinuten: 0 };
    const offen = termine.slice();
    const reihenfolge = [];
    let hier = start || offen[0].listing;
    let fahrt = 0;

    while (offen.length) {
      let bestI = 0, bestMin = Infinity;
      offen.forEach((t, i) => {
        const min = U.travelMin(hier, t.listing, 'oepnv');
        if (min < bestMin) { bestMin = min; bestI = i; }
      });
      const naechster = offen.splice(bestI, 1)[0];
      reihenfolge.push({ termin: naechster, fahrtMinuten: reihenfolge.length ? bestMin : 0 });
      fahrt += reihenfolge.length > 1 ? bestMin : 0;
      hier = naechster.listing;
    }

    /* Konflikte melden: zwei Termine, zwischen die die Fahrt nicht passt. */
    const konflikte = [];
    reihenfolge.forEach((r, i) => {
      if (!i) return;
      const vorher = reihenfolge[i - 1].termin;
      if (vorher.datum !== r.termin.datum) return;
      const minuten = (z) => Number(z.split(':')[0]) * 60 + Number(z.split(':')[1]);
      const luecke = minuten(r.termin.zeit) - minuten(vorher.zeit) - 30;
      if (luecke < r.fahrtMinuten) {
        konflikte.push({
          a: vorher, b: r.termin,
          fehlt: Math.round(r.fahrtMinuten - luecke)
        });
      }
    });

    return { reihenfolge, gesamtMinuten: Math.round(fahrt), konflikte };
  }

  /* Ein Anschreiben, das Unterlagen zusagt, die es nicht gibt, fliegt
     spätestens bei der Besichtigung auf. Der Satz richtet sich deshalb
     nach der tatsächlichen Mappe. Schufa und Ausweis bleiben bewusst
     draußen: Die gehören erst dazu, wenn die Wohnung ernsthaft in
     Betracht kommt. */
  const UNTERLAGEN_NAMEN = {
    selbstauskunft: 'die Selbstauskunft',
    gehaltsnachweise: 'die letzten drei Einkommensnachweise',
    mietschuldenfrei: 'die Mietschuldenfreiheitsbescheinigung',
    buergschaft: 'eine Bürgschaft',
    wbs: 'den Wohnberechtigungsschein'
  };

  function unterlagenSatz(profil) {
    const u = (profil && profil.unterlagen) || {};
    const da = Object.keys(UNTERLAGEN_NAMEN).filter((k) => u[k]).map((k) => UNTERLAGEN_NAMEN[k]);
    if (!da.length) {
      return 'Meine Unterlagen stelle ich zusammen, sobald ein Termin steht.';
    }
    const liste = da.length === 1 ? da[0]
      : da.slice(0, -1).join(', ') + ' und ' + da[da.length - 1];
    const satz = liste.charAt(0).toUpperCase() + liste.slice(1) + ' bringe ich zur Besichtigung mit.';
    const fehlt = Object.keys(UNTERLAGEN_NAMEN).filter((k) => !u[k] && k !== 'buergschaft' && k !== 'wbs');
    return fehlt.length ? satz + ' Was darüber hinaus nötig ist, reiche ich kurzfristig nach.' : satz;
  }

  NW.werkzeuge = {
    unterlagenSatz,
    chancen, duplikate, preisreihe, preisvergleich,
    leistbarkeit, wbsPruefung, WBS_BUND, WBS_ABZUEGE,
    wohngeldPruefung, WOHNGELD_AUSSCHLUSS,
    nebenkostenPruefung, BETRIEBSKOSTEN,
    tagesplan
  };
})(window.NW = window.NW || {});
