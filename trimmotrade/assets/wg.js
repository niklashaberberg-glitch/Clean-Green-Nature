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
    return e;
  }

  const ECK_WORT = {
    alter: 'Alter', beruf: 'Beruf', einkommen: 'Einkommen',
    raucher: 'Rauchen', haustiere: 'Haustiere', einzug: 'Einzug ab'
  };

  /* Wie viel jede Person zahlen würde. Steht überall, wo eine Gruppe
     auftaucht – es ist die Zahl, nach der als Erstes gefragt wird. */
  function anteil(gruppe) {
    if (!gruppe.inserat || !gruppe.inserat.warm || !gruppe.ziel) return null;
    return Math.round(gruppe.inserat.warm / gruppe.ziel);
  }

  TT.wg = {
    meineHolen, fuerInserat, offeneHolen, vergessen,
    passung, alsWg, eckdatenAus, anteil, ECK_WORT,
    get meine() { return meine || []; },
    amServer, angemeldet
  };
})(window.TT = window.TT || {});
