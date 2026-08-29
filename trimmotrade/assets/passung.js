/* =====================================================================
   TrimmoTrade – Passung: wer passt zu wem, und wer passt zu dieser Wohnung

   Zwei Fragen, die ein Wohnungsportal beantworten könnte und fast nie
   beantwortet:

     1. **Wer passt zu wem?** Menschen, die zusammenziehen wollen, ohne
        sich zu kennen, entscheiden das heute nach einem Foto und drei
        Sätzen. Über Ordnung, Lärm, Besuch und Tagesrhythmus redet man
        erst, wenn es zu spät ist.

     2. **Wer passt zu dieser Wohnung?** Eine anbietende Seite bekommt
        achtzig Anfragen und liest die ersten zehn. Welche zehn das sind,
        entscheidet die Uhrzeit des Eingangs – nicht die Eignung.

   Beide Fragen beantwortet diese Datei. Sie rechnet nur; sie entscheidet
   nichts. Drei Regeln, von denen keine verhandelbar ist:

   **Nachvollziehbar.** Jede Zahl bringt ihre Begründung mit. Eine
   Reihenfolge ohne Grund ist eine Behauptung, und wer sie nicht prüfen
   kann, kann ihr auch nicht widersprechen.

   **Vollständig.** Es wird sortiert, nie ausgeblendet. Wer eine
   Bewerbung nicht sieht, weil ein Programm sie hinten einsortiert hat,
   hat sich nicht entschieden – es wurde für ihn entschieden.

   **Nur nach dem, wonach man fragen darf.** Herkunft, Religion,
   Gesundheit, Familienplanung, sexuelle Orientierung kommen in keiner
   Formel vor – besondere Kategorien nach Art. 9 DSGVO, bei der
   Vermietung zusätzlich von § 19 AGG erfasst. Sie stehen nicht im
   Profil, gehen nicht über die Schnittstelle und lassen sich hier
   folglich auch nicht gewichten.

   Eine Ausnahme, die keine ist: Alter und Geschlechtermischung. Eine
   Wohngemeinschaft darf danach auswählen – § 19 Abs. 5 AGG nimmt das
   gemeinsame Bewohnen einer Wohnung ausdrücklich aus. Deshalb fragt
   TrimmoTrade beide Seiten, was sie sich wünschen, und prüft es nur
   gegeneinander. Für die Vermietung selbst gilt das nicht: Im
   Bewerberteil kommt weder Alter noch Geschlecht vor.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util;
  const klemm = (x, a, b) => Math.max(a, Math.min(b, x));

  /* Sätze, in denen Zahlen stecken, werden als Muster übersetzt und erst
     danach gefüllt. Aus Stücken zusammengesetzt wäre jeder Satz an die
     deutsche Wortstellung genagelt – „30 % of net income“ und „30 %
     des Nettoeinkommens“ stellen dasselbe verschieden. */
  const satz = (muster, ...werte) => {
    let t = U.t(muster);
    werte.forEach((w, i) => { t = t.replace('{' + i + '}', w); });
    return t;
  };

  /* ==================================================================
     Die Regler

     Sechs davon gibt es seit jeher (match.js kennt sie, und der
     Beispielbestand trägt sie). Vier kamen dazu. Verglichen wird immer
     nur, was beide Seiten angegeben haben – eine fehlende Angabe zieht
     niemanden herunter, sie zählt einfach nicht mit.
     ================================================================== */

  const MEHR = [
    { key: 'homeoffice', label: 'Zu Hause', links: 'kaum da', rechts: 'fast immer da', gewicht: 2,
      warum: 'Wer den ganzen Tag in der Wohnung arbeitet, teilt sie anders als jemand, der nur '
        + 'zum Schlafen kommt. Das ist der häufigste unausgesprochene Konflikt.' },
    { key: 'ordnung', label: 'Gemeinschaftsräume', links: 'gelassen', rechts: 'sofort aufgeräumt', gewicht: 3,
      warum: 'Nicht das eigene Zimmer entscheidet, sondern die Küche. Zwei Menschen mit derselben '
        + 'Vorstellung davon streiten fast nie.' },
    { key: 'party', label: 'Feiern', links: 'nie in der Wohnung', rechts: 'gern und oft', gewicht: 2 },
    { key: 'teilen', label: 'Haushalt', links: 'jeder für sich', rechts: 'Haushaltskasse und gemeinsam einkaufen',
      gewicht: 1.5 }
  ];

  /* Alle zehn Regler zusammen. match.DIMENSIONEN bleibt unangetastet:
     Der erzeugte Bestand kennt nur die sechs, und ein Vergleich gegen
     eine WG, die es gar nicht gibt, soll sich nicht ändern. */
  const ALLE = () => TT.match.DIMENSIONEN.concat(MEHR);

  /* ==================================================================
     Harte Kriterien

     Sie entscheiden nicht über Sympathie, sondern darüber, ob ein
     Zusammenleben überhaupt geht. Eine Katzenhaarallergie ist kein
     Abzug von zwölf Prozent – sie ist ein Nein.
     ================================================================== */

  const RAUCH_WORT = { nein: 'raucht nicht', balkon: 'raucht auf dem Balkon', drinnen: 'raucht in der Wohnung' };
  const TIER_WORT = { keine: 'keine Tiere', katze: 'Katze', hund: 'Hund', klein: 'Kleintier' };

  /** Prüft die Kriterien einer Seite gegen die Merkmale der anderen.
      @return {Array<{grund:string,text:string}>} */
  function ausschluesse(wer, gegen) {
    const raus = [];
    const a = wer || {}, b = gegen || {};

    /* Rauchen. „drinnen“ gegen „nicht“ ist der eindeutige Fall; „balkon“
       gegen „nicht“ ebenfalls, denn wer gar keinen Rauch will, meint es
       so. */
    if (a.rauchenAndere === 'nicht' && (b.rauchen === 'drinnen' || b.rauchen === 'balkon')) {
      raus.push({ grund: 'rauchen', text: 'Du möchtest ohne Rauch wohnen, die andere Seite raucht.' });
    } else if (a.rauchenAndere === 'balkon' && b.rauchen === 'drinnen') {
      raus.push({ grund: 'rauchen', text: 'In der Wohnung soll nicht geraucht werden.' });
    }

    /* Tiere. Die Allergie ist der harte Fall – „keine“ ist ein Wunsch,
       „allergie“ ist ein medizinischer Grund und wird deshalb strenger
       behandelt. Was für eine Allergie, geht dabei niemanden etwas an
       und wird auch nicht gefragt. */
    const hatTier = b.haustiere && b.haustiere !== 'keine';
    if (a.haustiereAndere === 'allergie' && hatTier) {
      raus.push({ grund: 'tiere', text: 'Eine Allergie schließt ein Tier in der Wohnung aus.' });
    } else if (a.haustiereAndere === 'keine' && hatTier) {
      raus.push({ grund: 'tiere',
        text: satz('Du möchtest ohne Tiere wohnen ({0}).', U.t(TIER_WORT[b.haustiere] || 'Tier')) });
    }

    /* Alter. Nur, wenn eine Spanne wirklich gesetzt ist. */
    const alter = Number(b.__alter);
    if (Number.isFinite(alter) && alter > 0) {
      if (Number.isFinite(Number(a.alterVon)) && a.alterVon && alter < a.alterVon) {
        raus.push({ grund: 'alter', text: 'Außerhalb der Altersspanne, die du dir wünschst.' });
      } else if (Number.isFinite(Number(a.alterBis)) && a.alterBis && alter > a.alterBis) {
        raus.push({ grund: 'alter', text: 'Außerhalb der Altersspanne, die du dir wünschst.' });
      }
    }

    /* Geschlechtermischung. Erlaubt nach § 19 Abs. 5 AGG, aber nur als
       Wunsch der Menschen – und nur, wenn die andere Seite ihr
       Geschlecht überhaupt angegeben hat. */
    /* Die Kürzel sind die des Profils: w, m, d – dieselben, mit denen
       match.js und der Bestand rechnen. */
    const g = b.__geschlecht;
    if (g && g !== 'egal') {
      if (a.geschlechterWunsch === 'frauen' && g !== 'w') {
        raus.push({ grund: 'geschlecht', text: 'Du möchtest in einer reinen Frauen-WG wohnen.' });
      } else if (a.geschlechterWunsch === 'maenner' && g !== 'm') {
        raus.push({ grund: 'geschlecht', text: 'Du möchtest in einer reinen Männer-WG wohnen.' });
      }
    }
    return raus;
  }

  /* ==================================================================
     Zwei Menschen
     ================================================================== */

  /** Baut aus einem Profil die Form, mit der hier gerechnet wird.
      Sowohl das eigene Profil als auch die Eckdaten eines
      Gruppenmitglieds laufen durch diese Funktion – damit rechnet beides
      nach denselben Regeln. */
  function ausProfil(p) {
    const wg = (p && p.wg) || {};
    return Object.assign({}, wg, {
      regler: Object.assign({}, (p && p.lifestyle) || {}, wg.mehr || {}),
      __alter: p && p.alter,
      __geschlecht: p && p.geschlecht,
      beschaeftigungsart: wg.beschaeftigungsart || '',
      sprachen: wg.sprachen || []
    });
  }

  /** Und dasselbe aus den Eckdaten, die ein Gruppenmitglied hinterlassen
      hat. Sie enthalten weniger – gerechnet wird trotzdem gleich. */
  function ausEckdaten(e) {
    const d = e || {};
    return Object.assign({}, d.wg || {}, {
      regler: Object.assign({}, d.lifestyle || {}, (d.wg && d.wg.mehr) || {}),
      __alter: Number(d.alter) || null,
      __geschlecht: d.geschlecht || '',
      beschaeftigungsart: (d.wg && d.wg.beschaeftigungsart) || '',
      sprachen: (d.wg && d.wg.sprachen) || []
    });
  }

  const BESCHAEFTIGUNG_WORT = {
    vollzeit: 'Vollzeit', teilzeit: 'Teilzeit', studium: 'Studium', ausbildung: 'Ausbildung',
    schicht: 'Schichtdienst', selbststaendig: 'selbstständig', rente: 'Rente', suchend: 'auf Suche'
  };

  /**
   * Die Passung zwischen zwei Menschen.
   *
   * Der Wert entsteht aus den Reglern, die beide beantwortet haben, plus
   * ein paar Zuschlägen und Abschlägen für Dinge, die sich nicht auf
   * einer Skala abbilden lassen. Harte Kriterien stehen daneben, nicht
   * darin: Ein Ausschlussgrund lässt sich nicht wegrechnen.
   *
   * @return {{score:number, dimensionen:Array, harte:Array, hinweise:Array, gemessen:number}}
   */
  function zwischen(einer, anderer) {
    const a = einer, b = anderer;
    const dimensionen = [];
    let summe = 0, gewichte = 0;

    ALLE().forEach((d) => {
      const x = Number(a.regler[d.key]);
      const y = Number(b.regler[d.key]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;   // eine Seite schweigt
      const abw = Math.abs(klemm(x, 0, 10) - klemm(y, 0, 10));
      /* Bis zwei Punkte Unterschied ist es dasselbe, ab sechs ist es
         etwas anderes. Dazwischen linear. */
      const wert = klemm(1 - Math.max(0, abw - 2) / 6, 0, 1);
      summe += wert * d.gewicht;
      gewichte += d.gewicht;
      dimensionen.push({
        key: d.key, label: d.label, links: d.links, rechts: d.rechts,
        du: x, andere: y, abweichung: abw, wert, gewicht: d.gewicht, warum: d.warum || ''
      });
    });

    const hinweise = [];
    let zuschlag = 0, zuschlagGewicht = 0;
    const wiegen = (wert, gewicht, text, gut) => {
      zuschlag += wert * gewicht;
      zuschlagGewicht += gewicht;
      if (text) hinweise.push({ text, gut });
    };

    /* Der Rhythmus, den der Beruf vorgibt. Schichtdienst neben
       Homeoffice ist der Klassiker: Beide sind zu Hause, aber nie
       gleichzeitig wach. */
    if (a.beschaeftigungsart && b.beschaeftigungsart) {
      if (a.beschaeftigungsart === b.beschaeftigungsart) {
        wiegen(1, 1.5, satz('Ähnlicher Alltag: {0}', U.t(BESCHAEFTIGUNG_WORT[a.beschaeftigungsart] || '')), true);
      } else if (a.beschaeftigungsart === 'schicht' || b.beschaeftigungsart === 'schicht') {
        wiegen(0.35, 1.5, 'Schichtdienst trifft auf einen anderen Rhythmus – das lässt sich regeln, '
          + 'aber es gehört besprochen.', false);
      } else {
        wiegen(0.7, 1.5, '', true);
      }
    }

    /* Küche. Wer fleischfrei kocht und wer nicht, teilt einen Kühlschrank
       und eine Pfanne. Das ist kein Weltanschauungsstreit, sondern eine
       Absprache – aber eine, die vorher stattfinden sollte. */
    const streng = (x) => x.kueche === 'kein_fleisch';
    const isst = (x) => x.ernaehrung === 'egal';
    if (streng(a) && isst(b)) {
      wiegen(0.3, 1.5, 'In der Küche soll kein Fleisch zubereitet werden – die andere Seite isst welches.', false);
    } else if (streng(b) && isst(a)) {
      wiegen(0.3, 1.5, 'Die andere Seite möchte eine fleischfreie Küche.', false);
    } else if (a.ernaehrung && a.ernaehrung === b.ernaehrung && a.ernaehrung !== 'egal') {
      wiegen(1, 1, 'Gleiche Ernährung – das macht die Küche einfacher.', true);
    }

    /* Sprachen. Eine gemeinsame genügt; keine gemeinsame ist im Alltag
       schwierig und wird deshalb genannt, nicht verschwiegen. */
    if ((a.sprachen || []).length && (b.sprachen || []).length) {
      const gemeinsam = a.sprachen.filter((s) => b.sprachen.indexOf(s) >= 0);
      if (gemeinsam.length) {
        wiegen(1, 1, gemeinsam.length === 1 ? satz('Gemeinsame Sprache: {0}', gemeinsam[0]) : '', true);
      } else {
        wiegen(0.4, 1, 'Keine gemeinsame Sprache angegeben.', false);
      }
    }

    /* Wie lange jemand bleiben will. Zwei Menschen, von denen einer in
       drei Monaten wieder auszieht, gründen keine WG – sie teilen eine
       Übergangslösung. Das darf man wollen, es sollte nur beiden klar
       sein. */
    const dauerA = Number(a.mindestdauer), dauerB = Number(b.mindestdauer);
    if (dauerA > 0 && dauerB > 0) {
      const unterschied = Math.abs(dauerA - dauerB);
      if (unterschied <= 6) wiegen(1, 1, '', true);
      else if (unterschied <= 18) wiegen(0.7, 1, '', true);
      else {
        wiegen(0.35, 1, satz('Sehr unterschiedliche Vorstellungen davon, wie lange das halten soll '
          + '({0} gegen {1} Jahre).', Math.round(dauerA / 12 * 10) / 10, Math.round(dauerB / 12 * 10) / 10), false);
      }
    }

    /* Der schwerste Reibungspunkt zählt doppelt.

       Ein Durchschnitt verzeiht zu viel. Neun Übereinstimmungen decken
       einen tiefen Riss zu, und heraus kommt eine Zahl, die „passt gut
       zusammen“ sagt – über eine Ordnungsfrage, die sechs von zehn
       Punkten auseinanderliegt und die WG in einem halben Jahr
       auseinanderbringt. Genau das soll hier vorher sichtbar werden,
       nicht hinterher.

       Deshalb geht der schlechteste der schwer wiegenden Regler noch
       einmal eigenständig in das Ergebnis ein – dieselbe Regel, nach
       der weiter unten das schwächste Mitglied einer Gruppe zählt.
       Nur Regler ab Gewicht 2: Ob jemand früh aufsteht oder ob man
       gemeinsam einkauft, lässt sich regeln. Ordnung, Lärm, Nähe,
       Besuch und Feiern sind das, woran Wohngemeinschaften scheitern. */
    let anteil = 0;
    let reibung = null;
    if (gewichte > 0) {
      const mittel = summe / gewichte;
      const schwer = dimensionen.filter((d) => d.gewicht >= 2);
      if (schwer.length) {
        reibung = schwer.reduce((a, b) => (b.wert < a.wert ? b : a));
        anteil = (mittel * 2 + reibung.wert) / 3;
      } else {
        anteil = mittel;
      }
      if (reibung && reibung.abweichung < 3) reibung = null;   // kein Reibungspunkt, nur der schwächste
    }

    const gesamtGewicht = gewichte + zuschlagGewicht;
    const score = gesamtGewicht > 0
      ? Math.round((anteil * gewichte + zuschlag) / gesamtGewicht * 100)
      : null;

    /* Harte Kriterien in beide Richtungen: Was der eine nicht will, und
       was der andere nicht will. Eine WG scheitert an beidem. */
    const harte = ausschluesse(a, b).concat(
      ausschluesse(b, a).map((x) => Object.assign({}, x, { andersherum: true }))
    );

    return {
      score, dimensionen, harte, hinweise,
      /* Der Regler, der am weitesten auseinanderliegt und dabei zählt.
         Er ist der Grund für den Abzug, also gehört er sichtbar
         daneben – eine Zahl ohne ihren Grund ist eine Behauptung. */
      reibung,
      /* Wie viele Angaben überhaupt verglichen werden konnten. Ohne
         diese Zahl sähe eine Passung aus 2 Reglern genauso aus wie eine
         aus 14 – und wäre doch viel weniger wert. */
      gemessen: dimensionen.length + hinweise.length,
      kurz: kurzText(score, harte.length, dimensionen.length)
    };
  }

  function kurzText(score, harteAnzahl, gemessen) {
    if (harteAnzahl) return 'Ein Ausschlusskriterium steht dagegen';
    if (score === null) return 'Zu wenig Angaben für eine Einschätzung';
    if (gemessen < 4) return 'Erste Einschätzung – dafür fehlen noch Angaben';
    if (score >= 85) return 'Sehr ähnliche Vorstellungen vom Alltag';
    if (score >= 70) return 'Passt gut zusammen';
    if (score >= 55) return 'Geht, mit ein paar Absprachen';
    if (score >= 40) return 'Deutliche Unterschiede – vorher reden';
    return 'Sehr unterschiedliche Vorstellungen';
  }

  /* ==================================================================
     Ein Mensch und eine Gruppe

     Nicht der Durchschnitt entscheidet, sondern das schwächste Glied:
     Wer mit zwei von drei Menschen wunderbar auskommt und mit dem
     dritten gar nicht, zieht nicht ein. Deshalb geht der schlechteste
     Einzelwert doppelt in das Ergebnis ein.
     ================================================================== */

  function inGruppe(gruppe, profil) {
    const ich = ausProfil(profil);
    const andere = (gruppe.mitglieder || [])
      .filter((m) => !m.ich && m.eckdaten)
      .map((m) => ({ name: m.name || 'jemand', person: ausEckdaten(m.eckdaten) }));
    if (!andere.length) return null;

    const einzeln = andere.map((x) => Object.assign({ name: x.name }, zwischen(ich, x.person)));
    const mitWert = einzeln.filter((e) => e.score !== null);
    if (!mitWert.length) {
      return { score: null, einzeln, harte: einzeln.reduce((a, e) => a.concat(e.harte), []),
        kurz: kurzText(null, 0, 0) };
    }

    const werte = mitWert.map((e) => e.score);
    const schnitt = werte.reduce((a, b) => a + b, 0) / werte.length;
    const schlechtester = Math.min.apply(null, werte);
    const score = Math.round((schnitt + schlechtester * 2) / 3);

    const harte = einzeln.reduce((a, e) => a.concat(
      e.harte.map((h) => Object.assign({}, h, { wer: e.name }))
    ), []);

    return {
      score, einzeln, harte,
      schwaechste: mitWert.find((e) => e.score === schlechtester),
      kurz: kurzText(score, harte.length, Math.min.apply(null, mitWert.map((e) => e.dimensionen.length)))
    };
  }

  /* ==================================================================
     Ein Mensch und eine Wohnung – die Vorauswahl für die anbietende Seite

     Was hier eingeht, ist genau das, wonach eine Vermieterseite fragen
     darf: Zahlungsfähigkeit, Beschäftigung, Unterlagen, Haushaltsgröße,
     Haustiere, Rauchen, Wohnberechtigungsschein, gewünschte Mietdauer
     und der Einzugstermin.

     Was nicht eingeht: Alter, Geschlecht, Herkunft, Religion, Gesundheit,
     Familienplanung. Nicht, weil es schwer zu rechnen wäre, sondern weil
     eine Benachteiligung danach bei der Vermietung unzulässig ist
     (§ 19 AGG) – und weil ein Programm, das so etwas gewichtet, die
     Benachteiligung nur schwerer nachweisbar macht, nicht seltener.
     ================================================================== */

  const EINKOMMEN_WERT = {
    unbefristet: [1, 'unbefristetes Arbeitsverhältnis'],
    rente: [0.95, 'Rente – planbar und dauerhaft'],
    selbststaendig: [0.75, 'selbstständig – üblich sind die letzten zwei Steuerbescheide'],
    befristet: [0.7, 'befristetes Arbeitsverhältnis'],
    ausbildung: [0.6, 'Ausbildung'],
    probezeit: [0.55, 'noch in der Probezeit'],
    studium: [0.5, 'Studium'],
    sonst: [0.6, '']
  };

  /**
   * @return {{score:number, gruende:Array, harte:Array, quote:number|null}}
   */
  function bewerber(inserat, profil) {
    const l = inserat || {};
    const p = profil || {};
    const bw = p.bewerbung || {};
    const wg = p.wg || {};
    const gruende = [];
    const harte = [];
    let summe = 0, gewichte = 0;

    const wiegen = (wert, gewicht, label, text) => {
      summe += klemm(wert, 0, 1) * gewicht;
      gewichte += gewicht;
      if (label) {
        gruende.push({ label, text, wirkung: wert >= 0.75 ? 'plus' : wert <= 0.45 ? 'minus' : 'neutral' });
      }
    };

    /* 1. Die Mietbelastungsquote. Die eine Zahl, auf die es ankommt –
       und die einzige, die fast jede Vermieterseite selbst ausrechnet.
       Üblich ist die Grenze bei einem Drittel des Nettoeinkommens. */
    const warm = Number(l.warm) || 0;
    const netto = Number(p.nettoEinkommen) || 0;
    let quote = null;
    if (warm > 0 && netto > 0) {
      quote = warm / netto;
      const proz = Math.round(quote * 100);
      if (quote <= 0.25) wiegen(1, 4, 'Mietbelastung',
        satz('Die Warmmiete ist {0} % des Nettoeinkommens – sehr komfortabel.', proz));
      else if (quote <= 0.33) wiegen(0.9, 4, 'Mietbelastung',
        satz('{0} % des Nettoeinkommens – im üblichen Rahmen.', proz));
      else if (quote <= 0.40) wiegen(0.55, 4, 'Mietbelastung',
        satz('{0} % des Nettoeinkommens – für viele Vermietende die Obergrenze.', proz));
      else wiegen(0.15, 4, 'Mietbelastung',
        satz('{0} % des Nettoeinkommens – darüber wird selten zugesagt.', proz));
    }

    /* 2. Woher das Einkommen kommt. */
    if (bw.einkommenArt && EINKOMMEN_WERT[bw.einkommenArt]) {
      const [wert, wort] = EINKOMMEN_WERT[bw.einkommenArt];
      wiegen(wert, 2.5, 'Einkommensart', wort);
    }

    /* 3. Eine Bürgschaft hebt fast jedes Einkommensproblem auf – das ist
       der Grund, warum Studierende überhaupt Wohnungen bekommen. */
    if (bw.buergschaft && bw.buergschaft !== 'keine') {
      wiegen(1, 2, 'Bürgschaft', bw.buergschaft === 'eltern'
        ? 'Elternbürgschaft vorhanden' : 'Bürgschaft vorhanden');
    } else if (quote !== null && quote > 0.33) {
      gruende.push({ label: 'Bürgschaft', text: 'Bei dieser Mietbelastung wäre eine Bürgschaft das '
        + 'wirksamste Mittel.', wirkung: 'minus' });
    }

    /* 4. Unterlagen. Wer sie hat, kann sofort; wer sie nicht hat,
       verliert die Wohnung an den, der schneller ist. */
    const u = p.unterlagen || {};
    const noetig = ['schufa', 'gehaltsnachweise', 'ausweis', 'mietschuldenfrei', 'selbstauskunft'];
    const da = noetig.filter((k) => u[k]).length;
    wiegen(da / noetig.length, 2, 'Unterlagen', da === noetig.length
      ? U.t('Die Mappe ist vollständig.')
      : satz('{0} von {1} Unterlagen liegen bereit.', da, noetig.length));

    /* 5. Wie lange jemand bleiben will. Eine Neuvermietung kostet die
       anbietende Seite Zeit, Leerstand und Nerven – Dauer ist deshalb
       ein echter Vorteil und keine Höflichkeit. */
    const dauer = Number(bw.mietdauer) || Number(wg.mindestdauer) || 0;
    if (dauer > 0) {
      if (dauer >= 36) wiegen(1, 1.5, 'Mietdauer', satz('Mindestens {0} Jahre geplant.', Math.round(dauer / 12)));
      else if (dauer >= 24) wiegen(0.85, 1.5, 'Mietdauer', U.t('Rund zwei Jahre geplant.'));
      else if (dauer >= 12) wiegen(0.6, 1.5, 'Mietdauer', U.t('Etwa ein Jahr geplant.'));
      else wiegen(0.3, 1.5, 'Mietdauer', U.t('Unter einem Jahr – für viele Vermietende zu kurz.'));
    }

    /* 6. Der Einzugstermin. Leerstand kostet Geld; wer genau zum
       richtigen Zeitpunkt kann, ist im Vorteil. */
    if (l.freiAb && p.einzugAb) {
      const tage = Math.abs(U.daysUntil(l.freiAb) - U.daysUntil(p.einzugAb));
      if (tage <= 14) wiegen(1, 1.5, 'Einzugstermin', U.t('Passt fast auf den Tag.'));
      else if (tage <= 45) wiegen(0.75, 1.5, 'Einzugstermin', U.t('Liegt um ein paar Wochen daneben.'));
      else wiegen(0.4, 1.5, 'Einzugstermin', satz('Liegt rund {0} Monate daneben.', Math.round(tage / 30)));
    } else if (bw.einzugFlexibel === 'flexibel') {
      wiegen(0.9, 1, 'Einzugstermin', U.t('Flexibel.'));
    }

    /* 7. Haushaltsgröße gegen Zimmerzahl. Die Faustregel der
       Wohnungsaufsicht: etwa eine Person je Zimmer, Kinder unter sechs
       zählen nicht voll. Deutlich mehr Personen als Zimmer ist ein
       harter Grund, kein weicher. */
    const personen = Number(p.haushalt) || 0;
    const zimmer = Number(l.zimmer) || 0;
    if (personen > 0 && zimmer > 0) {
      if (personen <= zimmer) wiegen(1, 1.5, 'Haushalt', personen === 1
        ? satz('Eine Person auf {0} Zimmer.', U.dec(zimmer))
        : satz('{0} Personen auf {1} Zimmer.', personen, U.dec(zimmer)));
      else if (personen <= zimmer + 1) wiegen(0.6, 1.5, 'Haushalt',
        satz('{0} Personen auf {1} Zimmer – eng, aber üblich.', personen, U.dec(zimmer)));
      else harte.push({ grund: 'haushalt',
        text: satz('{0} Personen auf {1} Zimmer. Das überschreitet, was in vielen Bundesländern '
          + 'als Überbelegung gilt.', personen, U.dec(zimmer)) });
    }

    /* 8. Wohnberechtigungsschein, wenn die Wohnung einen verlangt. */
    if (l.wbsPflicht && !u.wbs) {
      harte.push({ grund: 'wbs', text: 'Diese Wohnung ist an einen Wohnberechtigungsschein gebunden. '
        + 'Ohne ihn ist eine Vermietung nicht zulässig.' });
    } else if (l.wbsPflicht && u.wbs) {
      wiegen(1, 2, 'Wohnberechtigungsschein', 'Liegt vor.');
    }

    /* 9. Haustiere und Rauchen – nur, wenn das Inserat dazu etwas sagt. */
    const hatTier = wg.haustiere && wg.haustiere !== 'keine';
    if (hatTier) {
      const erlaubt = (l.ausstattung || []).indexOf('Haustiere erlaubt') >= 0;
      if (erlaubt) wiegen(1, 1, 'Haustiere', 'Im Inserat ausdrücklich erlaubt.');
      else gruende.push({ label: 'Haustiere', text: 'Das Inserat sagt nichts dazu – frag früh, '
        + 'bevor beide Seiten Zeit investieren.', wirkung: 'neutral' });
    }

    const score = gewichte > 0 ? Math.round(summe / gewichte * 100) : null;
    return {
      score, gruende, harte, quote,
      /* Wie belastbar die Zahl ist. Aus zwei Angaben lässt sich keine
         Rangfolge bauen, und so steht es dann auch da. */
      belastbar: gewichte >= 6,
      kurz: harte.length ? 'Ein Ausschlusskriterium steht dagegen'
        : score === null ? 'Zu wenig Angaben'
          : score >= 80 ? 'Sehr gut geeignet'
            : score >= 65 ? 'Gut geeignet'
              : score >= 50 ? 'Kommt in Frage'
                : 'Eher schwierig'
    };
  }

  /* Eine Liste von Bewerbungen sortieren. Sortiert, nie gefiltert –
     wer hinten steht, steht trotzdem da. */
  function reihen(inserat, bewerbungen) {
    return bewerbungen
      .map((b) => Object.assign({}, b, { bewertung: bewerber(inserat, b.profil || {}) }))
      .sort((x, y) => {
        const hx = x.bewertung.harte.length, hy = y.bewertung.harte.length;
        if (hx !== hy) return hx - hy;               // Ausschlussgründe nach hinten
        return (y.bewertung.score || 0) - (x.bewertung.score || 0);
      });
  }

  /* Wie vollständig ist mein Profil? Grundlage für den Hinweis im
     Profil und für die Frage, ob eine Passung überhaupt etwas taugt. */
  function vollstaendigkeit(p) {
    const wg = (p && p.wg) || {};
    const bw = (p && p.bewerbung) || {};
    const felder = [
      ['Alter', !!p.alter],
      ['Beruf', !!p.beruf],
      ['Nettoeinkommen', !!p.nettoEinkommen],
      ['Haushaltsgröße', !!p.haushalt],
      ['Einzugstermin', !!p.einzugAb],
      ['Die sechs Alltagsfragen', !!(p.lifestyle && Object.keys(p.lifestyle).length >= 6)],
      ['Die vier weiteren Regler', !!(wg.mehr && Object.keys(wg.mehr).some((k) => wg.mehr[k] !== null))],
      ['Rauchen', !!wg.rauchen],
      ['Haustiere', !!wg.haustiere],
      ['Beschäftigungsart', !!wg.beschaeftigungsart],
      ['Sprachen', !!(wg.sprachen && wg.sprachen.length)],
      ['Gewünschte Mietdauer', !!(bw.mietdauer || wg.mindestdauer)],
      ['Einkommensart', !!bw.einkommenArt],
      ['Unterlagen', !!(p.unterlagen && Object.keys(p.unterlagen).some((k) => p.unterlagen[k]))],
      ['Über mich', !!(wg.ueberMich && wg.ueberMich.length > 40)]
    ];
    const da = felder.filter((f) => f[1]).length;
    return { da, gesamt: felder.length, anteil: Math.round(da / felder.length * 100),
      fehlt: felder.filter((f) => !f[1]).map((f) => f[0]) };
  }

  TT.passung = {
    MEHR, ALLE, zwischen, inGruppe, bewerber, reihen, vollstaendigkeit,
    ausProfil, ausEckdaten, ausschluesse,
    BESCHAEFTIGUNG_WORT, RAUCH_WORT, TIER_WORT
  };
})(window.TT = window.TT || {});
