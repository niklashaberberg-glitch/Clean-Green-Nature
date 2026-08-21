/* =====================================================================
   Nestwerk – Zusammenbringen
   Zwei Verfahren: die WG-Passung zwischen Mensch und Wohngemeinschaft
   und der Ringtausch, der Ketten findet, wo der direkte Tausch scheitert.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;

  /* ================================================================
     WG-Passung
     ================================================================ */

  const DIMENSIONEN = [
    { key: 'sauber', label: 'Ordnung', links: 'entspannt', rechts: 'sehr ordentlich', gewicht: 3 },
    { key: 'ruhe', label: 'Lautstärke', links: 'ruhig', rechts: 'lebhaft', gewicht: 2.5 },
    { key: 'gaeste', label: 'Besuch', links: 'selten', rechts: 'ständig offen', gewicht: 2 },
    { key: 'gemeinsam', label: 'Nähe', links: 'Zweck-WG', links2: 'jeder für sich', rechts: 'echte Wohngemeinschaft', gewicht: 3 },
    { key: 'chrono', label: 'Rhythmus', links: 'Frühaufsteher', rechts: 'Nachtmensch', gewicht: 1.5 },
    { key: 'kochen', label: 'Küche', links: 'jeder für sich', rechts: 'oft zusammen', gewicht: 2 }
  ];

  function wgPassung(listing, profil) {
    if (!listing.wg || !profil) return null;
    const meins = profil.lifestyle;
    if (!meins) return null;
    const wg = listing.wg;

    /* Weiche Übereinstimmung über die sechs Dimensionen */
    let summe = 0, gewichte = 0;
    const details = DIMENSIONEN.map((d) => {
      const a = U.clamp(Number(meins[d.key]), 0, 10);
      const b = U.clamp(Number(wg.lifestyle[d.key]), 0, 10);
      const abw = Math.abs(a - b);
      const wert = 1 - abw / 10;
      summe += wert * d.gewicht;
      gewichte += d.gewicht;
      return { key: d.key, label: d.label, links: d.links, rechts: d.rechts, du: a, wg: b, abweichung: abw, wert };
    });
    let score = summe / gewichte * 100;

    /* Harte Punkte: Wo die WG eine klare Grenze zieht. */
    const ausschluss = [], hinweise = [];

    if (profil.alter) {
      if (profil.alter < wg.sucht.alterVon || profil.alter > wg.sucht.alterBis) {
        ausschluss.push('Gesucht wird ' + wg.sucht.alterVon + ' bis ' + wg.sucht.alterBis + ' Jahre – du bist ' + profil.alter + '.');
      }
    }
    if (wg.sucht.geschlecht !== 'egal' && profil.geschlecht && profil.geschlecht !== 'egal' && wg.sucht.geschlecht !== profil.geschlecht) {
      const label = { w: 'eine Mitbewohnerin', m: 'einen Mitbewohner', d: 'eine nichtbinäre Person' };
      ausschluss.push('Die WG sucht ausdrücklich ' + (label[wg.sucht.geschlecht] || 'jemand Bestimmtes') + '.');
    }
    if (profil.raucher && wg.rauchen === 'nicht erwünscht') {
      ausschluss.push('In der Wohnung wird nicht geraucht.');
    } else if (profil.raucher && wg.rauchen === 'auf dem Balkon') {
      hinweise.push('Rauchen ist nur auf dem Balkon möglich.');
    }
    if (profil.haustiere && profil.haustiere !== 'keine') {
      if (wg.haustiere === 'nicht erlaubt') ausschluss.push('Haustiere sind nicht erlaubt.');
      else if (wg.haustiere === 'vorhanden') hinweise.push('In der WG leben bereits Tiere.');
    }
    if (profil.budgetWarm && listing.warm > profil.budgetWarm) {
      hinweise.push('Das Zimmer liegt ' + U.eur(listing.warm - profil.budgetWarm) + ' über deinem Budget.');
    }

    if (ausschluss.length) score = Math.min(score, 34);

    /* Gemeinsame Sprachen und Altersnähe geben einen kleinen Schub. */
    const altersnaehe = profil.alter ? 1 - U.clamp(Math.abs(profil.alter - wg.durchschnittsalter) / 20, 0, 1) : 0.5;
    score = score * 0.88 + altersnaehe * 12;

    score = Math.round(U.clamp(score, 0, 100));
    const groesste = details.slice().sort((a, b) => b.abweichung * 1 - a.abweichung * 1)[0];
    const beste = details.slice().sort((a, b) => a.abweichung - b.abweichung)[0];

    return {
      score, details, ausschluss, hinweise,
      staerke: beste, schwaeche: groesste,
      kurz: ausschluss.length ? 'Ausschlusskriterium' :
        score >= 80 ? 'passt sehr gut' : score >= 65 ? 'passt gut' : score >= 50 ? 'teils passend' : 'passt eher nicht'
    };
  }

  /* ================================================================
     Tausch: Kante zwischen zwei Angeboten
     A → B heißt: Bs Wohnung erfüllt As Suche.
     ================================================================ */

  function kante(a, b) {
    if (!a.tausch || !b.tausch || a.id === b.id) return null;
    const s = a.tausch.suche;
    const maengel = [];
    let wert = 1;

    /* Stadt ist die harte Bedingung – wer nach Hamburg will, zieht nicht
       nach Dresden. */
    if (s.staedte && s.staedte.length && s.staedte.indexOf(b.stadt) < 0) return null;

    if (s.zimmerMin && b.zimmer < s.zimmerMin) {
      const fehl = s.zimmerMin - b.zimmer;
      if (fehl > 1) return null;
      wert -= fehl * 0.28;
      maengel.push(U.dec(fehl) + ' Zimmer weniger als gewünscht');
    }
    if (s.flaecheMin && b.flaeche < s.flaecheMin) {
      const fehl = (s.flaecheMin - b.flaeche) / s.flaecheMin;
      if (fehl > 0.2) return null;
      wert -= fehl * 1.4;
      maengel.push(Math.round(s.flaecheMin - b.flaeche) + ' m² weniger als gewünscht');
    }
    if (s.warmMax && b.warm > s.warmMax) {
      const ueber = (b.warm - s.warmMax) / s.warmMax;
      if (ueber > 0.15) return null;
      wert -= ueber * 2;
      maengel.push(U.eur(b.warm - s.warmMax) + ' über der Preisgrenze');
    }
    (s.wunschAusstattung || []).forEach((f) => {
      if (b.ausstattung.indexOf(f) < 0) { wert -= 0.08; maengel.push('ohne ' + f); }
    });

    /* Zeitliche Nähe des Wunschtermins */
    const tageDiff = Math.abs(U.daysSince(a.freiAb) - U.daysSince(b.freiAb));
    if (tageDiff > 90) { wert -= 0.1; maengel.push('Termine liegen ' + Math.round(tageDiff / 30) + ' Monate auseinander'); }

    wert = U.clamp(wert, 0, 1);
    return { wert, maengel };
  }

  /* ================================================================
     Ringe finden
     Tiefensuche mit Längenbegrenzung; jeder Ring wird an seinem
     kleinsten Knoten verankert, damit Rotationen nicht doppelt zählen.
     ================================================================ */

  function ringe(angebote, optionen) {
    const opt = optionen || {};
    const maxLen = opt.maxLen || 4;
    const minWert = opt.minWert != null ? opt.minWert : 0.55;
    const nodes = angebote.filter((a) => a.tausch);
    const index = {};
    nodes.forEach((n, i) => { index[n.id] = i; });

    /* Nachbarschaftsliste vorab bauen – das spart bei jeder Tiefensuche. */
    const adj = nodes.map(() => []);
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (i === j) return;
        const k = kante(a, b);
        if (k && k.wert >= minWert) adj[i].push({ j, k });
      });
    });

    const gefunden = [];
    const gesehen = new Set();

    function dfs(start, aktuell, pfad, kanten) {
      if (pfad.length > maxLen) return;
      adj[aktuell].forEach((e) => {
        if (e.j === start) {
          const laenge = pfad.length;
          if (laenge < 2) return;
          if (laenge > 2 && !pfad.every((p) => nodes[p].tausch.dreiecktauschOk)) return;
          const schluessel = pfad.slice().join('-');
          if (gesehen.has(schluessel)) return;
          gesehen.add(schluessel);
          const alleKanten = kanten.concat([e.k]);
          const werte = alleKanten.map((k) => k.wert);
          gefunden.push({
            laenge,
            knoten: pfad.map((p) => nodes[p]),
            kanten: alleKanten,
            wert: U.sum(werte) / werte.length,
            schwaechste: Math.min.apply(null, werte),
            maengel: alleKanten.reduce((acc, k) => acc.concat(k.maengel), [])
          });
          return;
        }
        if (e.j < start) return;              /* Anker: nur aufsteigend */
        if (pfad.indexOf(e.j) >= 0) return;
        dfs(start, e.j, pfad.concat([e.j]), kanten.concat([e.k]));
      });
    }

    nodes.forEach((n, i) => dfs(i, i, [i], []));

    gefunden.sort((a, b) => (b.wert - a.wert) || (a.laenge - b.laenge));
    return gefunden;
  }

  /* Alle Ringe, die ein bestimmtes Angebot enthalten. */
  function ringeFuer(angebote, id, optionen) {
    return ringe(angebote, optionen).filter((r) => r.knoten.some((k) => k.id === id));
  }

  /* Wer würde meine Wohnung nehmen, ohne dass ich seine will?
     Nützlich, um die eigene Suche gezielt zu erweitern. */
  function einseitig(angebote, mein) {
    const wollenMich = [], ichWill = [];
    angebote.forEach((a) => {
      if (a.id === mein.id) return;
      if (kante(a, mein)) wollenMich.push(a);
      if (kante(mein, a)) ichWill.push(a);
    });
    return { wollenMich, ichWill };
  }

  /* Was müsste ich lockern, damit mehr Ringe entstehen? */
  function stellschrauben(angebote, mein) {
    if (!mein || !mein.tausch) return [];
    const basis = ringeFuer(angebote.concat([mein]), mein.id).length;
    const proben = [
      { label: 'Wunschstadt offen lassen', aendern: (m) => { m.tausch.suche.staedte = []; } },
      { label: 'ein halbes Zimmer weniger akzeptieren', aendern: (m) => { m.tausch.suche.zimmerMin = Math.max(1, m.tausch.suche.zimmerMin - 0.5); } },
      { label: '10 m² weniger akzeptieren', aendern: (m) => { m.tausch.suche.flaecheMin = Math.max(20, m.tausch.suche.flaecheMin - 10); } },
      { label: '100 € mehr Warmmiete zulassen', aendern: (m) => { m.tausch.suche.warmMax += 100; } },
      { label: 'auf Wunschausstattung verzichten', aendern: (m) => { m.tausch.suche.wunschAusstattung = []; } }
    ];
    return proben.map((p) => {
      const kopie = JSON.parse(JSON.stringify(mein));
      p.aendern(kopie);
      const neu = ringeFuer(angebote.concat([kopie]), kopie.id).length;
      return { label: p.label, vorher: basis, nachher: neu, gewinn: neu - basis };
    }).filter((p) => p.gewinn > 0).sort((a, b) => b.gewinn - a.gewinn);
  }

  NW.match = { DIMENSIONEN, wgPassung, kante, ringe, ringeFuer, einseitig, stellschrauben };
})(window.NW = window.NW || {});
