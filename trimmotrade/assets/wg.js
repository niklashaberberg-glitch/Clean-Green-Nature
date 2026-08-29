/* =====================================================================
   TrimmoTrade – WG-Gründung

   Der Unterschied zu allem, was Portale sonst können, in einem Satz:
   Hier wird keine Person in eine bestehende WG vermittelt, hier
   entsteht eine WG, die es noch nicht gibt.

   Praktisch heißt das: Eine Wohnung, die für eine Person zu groß und
   für eine Familie zu teuer ist, wird vermietbar, sobald sich drei
   Fremde finden. Und die finden sich nicht von selbst – jeder von ihnen
   bräuchte gleichzeitig die Wohnung und zwei passende Mitbewohner, und
   solange beides voneinander abhängt, passiert nichts.

   Dieses Stück Programm macht die Suche sichtbar. Alles Weitere –
   Vertrauen, Sympathie, die Entscheidung – gehört den Menschen. Was
   TrimmoTrade dabei nicht tut und nicht behauptet: Niemand wird geprüft.
   Ein Portal, das das verspricht, verspricht etwas, das es nicht halten
   kann.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util;

  /* ------------------------------------------------------------------
     Zustand
     ------------------------------------------------------------------ */

  let meine = null;            // Gruppen, an denen ich beteiligt bin
  const zuInserat = {};        // Kennung des Inserats -> Gruppen

  const amServer = () => !!(TT.api && TT.api.da);
  const angemeldet = () => !!(TT.konto && TT.konto.angemeldet());

  function meineHolen(neu) {
    if (!amServer() || !angemeldet()) return Promise.resolve([]);
    if (meine && !neu) return Promise.resolve(meine);
    return TT.api.ruf('gruppe/meine').then((d) => {
      meine = d.gruppen || [];
      return meine;
    }, () => { meine = []; return meine; });
  }

  function fuerInserat(id, neu) {
    if (!amServer()) return Promise.resolve([]);
    if (zuInserat[id] && !neu) return Promise.resolve(zuInserat[id]);
    return TT.api.ruf('gruppen?inserat=' + encodeURIComponent(id)).then((d) => {
      zuInserat[id] = d.gruppen || [];
      return zuInserat[id];
    }, () => { zuInserat[id] = []; return zuInserat[id]; });
  }

  function offeneHolen() {
    if (!amServer()) return Promise.resolve([]);
    return TT.api.ruf('gruppen?wieviele=40').then((d) => d.gruppen || [], () => []);
  }

  const vergessen = (id) => { if (id) delete zuInserat[id]; meine = null; };

  /* ------------------------------------------------------------------
     Passung zu einer Gruppe

     Gerechnet wird mit demselben Verfahren wie bei einer bestehenden WG
     – sechs Dimensionen, gewichtet, aus match.js. Statt es ein zweites
     Mal zu schreiben, wird aus der Gruppe eine WG gebaut und die
     vorhandene, geprüfte Rechnung darauf angewandt.

     Was dabei bewusst NICHT entsteht: ein Ausschluss nach Alter oder
     Geschlecht. Eine WG darf danach auswählen (§ 19 Abs. 5 AGG nimmt
     das gemeinsame Wohnen aus), aber eine Gruppe, die es noch gar nicht
     gibt, hat darüber nichts entschieden – und TrimmoTrade entscheidet
     es nicht für sie.
     ------------------------------------------------------------------ */

  function alsWg(gruppe) {
    const mit = (gruppe.mitglieder || []).filter((m) => m.eckdaten && m.eckdaten.lifestyle);
    if (!mit.length) return null;

    const lifestyle = {};
    TT.match.DIMENSIONEN.forEach((d) => {
      const werte = mit.map((m) => Number(m.eckdaten.lifestyle[d.key]))
        .filter((v) => Number.isFinite(v));
      lifestyle[d.key] = werte.length ? werte.reduce((a, b) => a + b, 0) / werte.length : 5;
    });

    const alter = (gruppe.mitglieder || []).map((m) => Number(m.eckdaten && m.eckdaten.alter))
      .filter((v) => Number.isFinite(v) && v > 0);
    const raucher = (gruppe.mitglieder || []).map((m) => (m.eckdaten || {}).raucher || '');
    const tiere = (gruppe.mitglieder || []).map((m) => (m.eckdaten || {}).haustiere || '');

    return {
      wg: {
        groesse: gruppe.ziel,
        lifestyle,
        durchschnittsalter: alter.length ? Math.round(alter.reduce((a, b) => a + b, 0) / alter.length) : 30,
        /* Keine Vorauswahl: Die Gruppe hat noch nichts beschlossen. */
        sucht: { geschlecht: 'egal', alterVon: 16, alterBis: 99 },
        rauchen: raucher.length && raucher.every((r) => /nein|nicht/i.test(r))
          ? 'nicht erwünscht' : 'egal',
        haustiere: tiere.some((t) => t && !/kein/i.test(t)) ? 'vorhanden' : 'erlaubt'
      }
    };
  }

  function passung(gruppe, profil) {
    const nachbau = alsWg(gruppe);
    if (!nachbau || !profil || !profil.lifestyle) return null;
    return TT.match.wgPassung(nachbau, profil);
  }

  /* Was aus dem eigenen Profil in eine Vorstellung übergeht. Wie bei der
     Anfrage gilt: eine feste Liste, und sie steht sichtbar im Formular,
     bevor jemand absendet. */
  function eckdatenAus(p) {
    const e = {};
    if (p.alter) e.alter = String(p.alter);
    if (p.beruf) e.beruf = p.beruf;
    if (p.nettoEinkommen > 0) {
      const unten = Math.floor(p.nettoEinkommen / 200) * 200;
      e.einkommen = U.eur(unten) + ' ' + U.t('bis') + ' ' + U.eur(unten + 200);
    }
    e.raucher = p.raucher ? U.t('ja') : U.t('nein');
    if (p.haustiere) e.haustiere = p.haustiere;
    if (p.einzugAb) e.einzug = U.dateDE(p.einzugAb);
    if (p.lifestyle) e.lifestyle = Object.assign({}, p.lifestyle);

    /* Was die Passung braucht, um mehr als eine Ahnung zu sein.

       Das Geschlecht geht nur mit, weil eine WG danach auswählen darf
       (§ 19 Abs. 5 AGG) und weil sonst der Wunsch der anderen Seite ins
       Leere liefe – wer eine reine Frauen-WG sucht, bekäme sonst
       Vorschläge, die er ohnehin ablehnt. In der Bewerbung um eine
       Wohnung taucht es an keiner Stelle auf, auch nicht hier: Diese
       Funktion füllt Gruppen, nicht Anfragen. */
    const w = p.wg || {};
    const wg = {};
    const mehr = {};
    Object.keys(w.mehr || {}).forEach((k) => {
      if (Number.isFinite(Number(w.mehr[k])) && w.mehr[k] !== null) mehr[k] = Number(w.mehr[k]);
    });
    if (Object.keys(mehr).length) wg.mehr = mehr;
    ['rauchen', 'rauchenAndere', 'haustiere', 'haustiereAndere', 'ernaehrung', 'kueche',
      'beschaeftigungsart', 'geschlechterWunsch'].forEach((k) => { if (w[k]) wg[k] = w[k]; });
    if ((w.sprachen || []).length) wg.sprachen = w.sprachen.slice(0, 8);
    if ((w.art || []).length) wg.art = w.art.slice(0, 6);
    if (w.alterVon) wg.alterVon = Number(w.alterVon);
    if (w.alterBis) wg.alterBis = Number(w.alterBis);
    if (w.mindestdauer) wg.mindestdauer = Number(w.mindestdauer);
    if (w.ueberMich) wg.ueberMich = w.ueberMich;
    if (Object.keys(wg).length) e.wg = wg;
    if (p.geschlecht && p.geschlecht !== 'egal') e.geschlecht = p.geschlecht;
    return e;
  }

  const ECK_WORT = {
    alter: 'Alter', beruf: 'Beruf', einkommen: 'Einkommen',
    raucher: 'Rauchen', haustiere: 'Haustiere', einzug: 'Einzug ab',
    geschlecht: 'Geschlecht'
  };

  /* Was aus dem WG-Teil in Worten dasteht, bevor jemand absendet. Eine
     Angabe, die mitgeht, aber niemand liest, ist keine Einwilligung –
     sie ist ein Versehen. */
  const GESCHLECHT_WORT = { w: 'weiblich', m: 'männlich', d: 'nichtbinär', egal: 'keine Angabe' };
  const WG_WORT = {
    rauchen: 'Rauchen', rauchenAndere: 'Rauch der anderen', haustiere: 'Eigene Tiere',
    haustiereAndere: 'Tiere der anderen', ernaehrung: 'Ernährung', kueche: 'Gemeinsame Küche',
    beschaeftigungsart: 'Beschäftigung', sprachen: 'Sprachen', art: 'Art der WG',
    alterVon: 'Alter ab', alterBis: 'Alter bis', geschlechterWunsch: 'Zusammensetzung',
    mindestdauer: 'Bleiben möchte ich', ueberMich: 'Über mich', mehr: 'Vier weitere Regler'
  };

  /* Aus den Eckdaten wieder lesbare Zeilen. Dieselbe Tabelle für die
     eigene Vorschau und für das, was andere sehen – sonst weicht das
     eine vom anderen ab, sobald ein Feld dazukommt. */
  function eckdatenZeilen(e) {
    const raus = [];
    Object.keys(ECK_WORT).forEach((k) => {
      if (!e[k]) return;
      raus.push([ECK_WORT[k], k === 'geschlecht' ? (GESCHLECHT_WORT[e[k]] || e[k]) : e[k]]);
    });
    const w = e.wg || {};
    Object.keys(WG_WORT).forEach((k) => {
      const v = w[k];
      if (v === undefined || v === null || v === '' || v === 'egal') return;
      if (k === 'mehr') {
        const n = Object.keys(v).length;
        if (n) raus.push([WG_WORT[k], n + ' ' + U.t(U.plural(n, 'Antwort', 'Antworten'))]);
        return;
      }
      if (Array.isArray(v)) { if (v.length) raus.push([WG_WORT[k], v.join(', ')]); return; }
      if (k === 'ueberMich') { raus.push([WG_WORT[k], U.truncate(String(v), 60)]); return; }
      if (k === 'mindestdauer') { raus.push([WG_WORT[k], Math.round(v / 12 * 10) / 10 + ' ' + U.t('Jahre')]); return; }
      raus.push([WG_WORT[k], String(v)]);
    });
    return raus;
  }

  /* Wie viel jede Person zahlen würde. Steht überall, wo eine Gruppe
     auftaucht – es ist die Zahl, nach der als Erstes gefragt wird. */
  function anteil(gruppe) {
    if (!gruppe.inserat || !gruppe.inserat.warm || !gruppe.ziel) return null;
    return Math.round(gruppe.inserat.warm / gruppe.ziel);
  }

  TT.wg = {
    meineHolen, fuerInserat, offeneHolen, vergessen,
    passung, alsWg, eckdatenAus, eckdatenZeilen, anteil, ECK_WORT, WG_WORT, GESCHLECHT_WORT,
    get meine() { return meine || []; },
    amServer, angemeldet
  };
})(window.TT = window.TT || {});
