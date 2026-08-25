/* =====================================================================
   TrimmoTrade – Zustand
   Ein einziger Zustand, ein einziger Speicherplatz, ein Ereignis für
   alle Ansichten. Bleibt im Browser; nichts verlässt das Gerät.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util;

  const PIPELINE = [
    { id: 'gemerkt', label: 'Gemerkt', farbe: 'neutral' },
    { id: 'kontakt', label: 'Angeschrieben', farbe: 'info' },
    { id: 'termin', label: 'Termin', farbe: 'warn' },
    { id: 'unterlagen', label: 'Unterlagen raus', farbe: 'info' },
    { id: 'zusage', label: 'Zusage', farbe: 'gut' },
    { id: 'absage', label: 'Absage', farbe: 'schlecht' }
  ];

  const UMZUG_VORLAGE = [
    { id: 'kuend', label: 'Alte Wohnung kündigen', wann: -90, gruppe: 'Vertrag', hinweis: 'Drei Monate Frist zum Monatsende, spätestens am dritten Werktag.' },
    { id: 'vertrag', label: 'Neuen Mietvertrag prüfen und unterschreiben', wann: -75, gruppe: 'Vertrag' },
    { id: 'kaution', label: 'Kaution überweisen oder Bürgschaft beantragen', wann: -45, gruppe: 'Vertrag', hinweis: 'Ratenzahlung in drei Monatsraten ist zulässig.' },
    { id: 'urlaub', label: 'Urlaub für den Umzugstag einreichen', wann: -60, gruppe: 'Organisation' },
    { id: 'firma', label: 'Umzugsunternehmen oder Transporter buchen', wann: -45, gruppe: 'Organisation' },
    { id: 'kartons', label: 'Kartons besorgen und mit dem Packen anfangen', wann: -30, gruppe: 'Organisation' },
    { id: 'halteverbot', label: 'Halteverbotszone beantragen', wann: -21, gruppe: 'Organisation', hinweis: 'Beim Straßenverkehrsamt, je nach Stadt 2 bis 4 Wochen Vorlauf.' },
    { id: 'strom', label: 'Strom- und Gasanbieter ummelden', wann: -21, gruppe: 'Verträge' },
    { id: 'internet', label: 'Internetanschluss umziehen lassen', wann: -30, gruppe: 'Verträge', hinweis: 'Der Anbieter darf den Vertrag am neuen Ort fortsetzen; sonst Sonderkündigungsrecht.' },
    { id: 'nachsende', label: 'Nachsendeauftrag einrichten', wann: -14, gruppe: 'Verträge' },
    { id: 'versich', label: 'Hausrat- und Haftpflichtversicherung anpassen', wann: -14, gruppe: 'Verträge' },
    { id: 'renovieren', label: 'Alte Wohnung besenrein herrichten', wann: -7, gruppe: 'Übergabe' },
    { id: 'zaehler', label: 'Zählerstände in beiden Wohnungen ablesen', wann: 0, gruppe: 'Übergabe', hinweis: 'Mit Foto und Unterschrift beider Seiten festhalten.' },
    { id: 'protokoll', label: 'Übergabeprotokoll ausfüllen', wann: 0, gruppe: 'Übergabe', hinweis: 'Jeden Mangel eintragen – später zählt nur, was im Protokoll steht.' },
    { id: 'ummeld', label: 'Beim Einwohnermeldeamt ummelden', wann: 7, gruppe: 'Behörden', hinweis: 'Innerhalb von zwei Wochen; die Wohnungsgeberbestätigung nicht vergessen.' },
    { id: 'rundfunk', label: 'Rundfunkbeitrag ummelden', wann: 10, gruppe: 'Behörden' },
    { id: 'kfz', label: 'Fahrzeug ummelden', wann: 14, gruppe: 'Behörden' },
    { id: 'bank', label: 'Bank, Arbeitgeber und Abos informieren', wann: 14, gruppe: 'Behörden' },
    { id: 'kautionalt', label: 'Kaution der alten Wohnung zurückfordern', wann: 30, gruppe: 'Nachlauf', hinweis: 'Bis zu sechs Monate Prüffrist sind üblich; danach nachhaken.' }
  ];

  const BESICHTIGUNG_FRAGEN = [
    { id: 'schimmel', gruppe: 'Substanz', text: 'Dunkle Flecken oder Stockflecken in Ecken, hinter Möbeln, an Fensterlaibungen?' },
    { id: 'fenster', gruppe: 'Substanz', text: 'Fenster: doppelt oder dreifach verglast, dicht, lassen sie sich kippen?' },
    { id: 'wasser', gruppe: 'Substanz', text: 'Wasserdruck und Warmwasser an allen Hähnen ausprobiert?' },
    { id: 'strom', gruppe: 'Substanz', text: 'Genug Steckdosen, moderner Sicherungskasten, FI-Schalter vorhanden?' },
    { id: 'laerm', gruppe: 'Umfeld', text: 'Wie laut ist es bei geöffnetem Fenster – Straße, Kneipe, Bahn?' },
    { id: 'licht', gruppe: 'Umfeld', text: 'Zu welcher Tageszeit kommt Sonne in welchen Raum?' },
    { id: 'nachbarn', gruppe: 'Umfeld', text: 'Wer wohnt darüber, darunter, nebenan?' },
    { id: 'heizung', gruppe: 'Kosten', text: 'Welche Heizung, wie alt, und wie hoch war die letzte Nachzahlung?' },
    { id: 'nk', gruppe: 'Kosten', text: 'Letzte Nebenkostenabrechnung einsehen dürfen?' },
    { id: 'modern', gruppe: 'Kosten', text: 'Stehen Modernisierungen an, die später auf die Miete umgelegt werden?' },
    { id: 'vormieter', gruppe: 'Vertrag', text: 'Warum zieht die Vormieterschaft aus und wie lange hat sie hier gewohnt?' },
    { id: 'zustand', gruppe: 'Vertrag', text: 'Wird renoviert übergeben, und was steht zu Schönheitsreparaturen im Vertrag?' },
    { id: 'kueche', gruppe: 'Vertrag', text: 'Bleibt die Küche, und wird dafür etwas verlangt?' },
    { id: 'internet', gruppe: 'Alltag', text: 'Welche Anschlussart liegt an, welche Geschwindigkeit ist buchbar?' },
    { id: 'keller', gruppe: 'Alltag', text: 'Keller, Fahrradraum, Waschmaschine, Trockenplatz – alles gesehen?' },
    { id: 'muell', gruppe: 'Alltag', text: 'Wo stehen die Tonnen, wer räumt Schnee, gibt es einen Hausdienst?' }
  ];

  const leer = () => ({
    version: 1,
    profil: JSON.parse(JSON.stringify(TT.data.profilVorlage)),
    profilAngelegt: false,
    filter: TT.analyse.leerFilter(),
    filterBeruehrt: false,   /* solange false, folgt die Suche dem Profil */
    merkliste: U.karte(),   /* id -> { status, notiz, hinzu, termin, checkliste } */
    vergleich: [],
    agenten: [],
    threads: TT.data.startThreads(),
    meinTausch: null,
    eigeneInserate: [],
    gesehen: [],
    einzugsdatum: '',
    umzug: U.karte(),
    protokoll: U.karte(),   /* Übergabeprotokoll: Räume, Zähler, Mängel */
    werkzeuge: U.karte(),   /* zuletzt eingegebene Werte der Rechner */
    tarif: 'frei',
    tarifIntervall: 'monat',
    tarifSeit: '',
    /* Gründerplatz: nummer 0 heißt „nicht vergeben“. */
    gruender: { nummer: 0, seit: '', bis: '' },
    betreiber: {},          /* Angaben für Impressum, Datenschutz und AGB */
    theme: 'auto',
    ansicht: 'liste',
    hinweiseGelesen: U.karte(),
    zuletzt: U.isoDate(TT.now())
  });

  let state = null;
  const hoerer = [];

  /* Welche Art ein Wert hat – Arrays sind in JavaScript auch Objekte, und
     genau diese Verwechslung war der Fehler. */
  const artVon = (v) => (v === null ? 'null' : Array.isArray(v) ? 'liste' : typeof v);

  function laden() {
    const gespeichert = U.loadStore();
    state = leer();
    if (gespeichert && gespeichert.version === 1) {
      /* Nur bekannte Felder übernehmen – und nur, wenn die Art stimmt.
         Der Feldname allein reicht nicht: Stand irgendwo ein Objekt, wo
         eine Liste erwartet wird, warf der erste Zugriff darauf, und die
         Anwendung blieb weiß. Ein verworfenes Feld ist unangenehm, ein
         weißer Bildschirm ist das Ende. */
      Object.keys(state).forEach((k) => {
        if (k === 'version' || gespeichert[k] === undefined) return;
        if (artVon(gespeichert[k]) !== artVon(state[k])) return;
        state[k] = gespeichert[k];
      });
      /* Profil und Filter gegen die aktuelle Vorlage auffüllen. */
      const objekt = (v, vorlage) => (v && artVon(v) === 'object' ? v : vorlage);
      state.profil = Object.assign({}, TT.data.profilVorlage, objekt(state.profil, {}));
      state.profil.gewichtung = Object.assign({}, TT.data.profilVorlage.gewichtung, objekt(state.profil.gewichtung, {}));
      state.profil.lifestyle = Object.assign({}, TT.data.profilVorlage.lifestyle, objekt(state.profil.lifestyle, {}));
      state.profil.unterlagen = Object.assign({}, TT.data.profilVorlage.unterlagen, objekt(state.profil.unterlagen, {}));
      state.filter = Object.assign(TT.analyse.leerFilter(), objekt(state.filter, {}));
      state.gruender = Object.assign({ nummer: 0, seit: '', bis: '' }, objekt(state.gruender, {}));
      state.betreiber = objekt(state.betreiber, {});
      /* Listen dürfen nur enthalten, was auch ein Objekt ist. */
      ['agenten', 'threads', 'eigeneInserate', 'vergleich', 'gesehen'].forEach((k) => {
        if (!Array.isArray(state[k])) state[k] = [];
      });
      /* Aus JSON.parse kommen gewöhnliche Objekte zurück – die Karten
         müssen ihren Prototyp wieder verlieren, sonst liefert ein Zugriff
         mit „constructor“ als Kennung eine Funktion statt undefined. */
      ['merkliste', 'umzug', 'protokoll', 'werkzeuge', 'hinweiseGelesen'].forEach((k) => {
        state[k] = U.karte(artVon(state[k]) === 'object' ? state[k] : null);
      });
    }
    /* Eigene Inserate müssen im Nachschlagewerk stehen, sonst zeigt die
       Merkliste auf Einträge, die es scheinbar nicht gibt. */
    state.eigeneInserate.forEach((e) => { if (e && e.id) TT.data.byId[e.id] = e; });
    return state;
  }

  const get = () => state || laden();

  function speichern() { U.saveStore(state); }

  function melden(grund) {
    hoerer.forEach((fn) => fn(state, grund));
  }

  function set(patch, grund) {
    Object.assign(state, patch);
    speichern();
    melden(grund || 'set');
  }

  /* Änderung an einem Teilbaum, ohne den Rest anzufassen. */
  function update(fn, grund) {
    fn(state);
    speichern();
    melden(grund || 'update');
  }

  const on = (fn) => { hoerer.push(fn); return () => hoerer.splice(hoerer.indexOf(fn), 1); };

  /* ------------------------- Merkliste ------------------------- */

  function gemerkt(id) { return !!get().merkliste[id]; }

  function merken(id, status) {
    update((s) => {
      if (s.merkliste[id] && !status) {
        delete s.merkliste[id];
      } else {
        s.merkliste[id] = Object.assign(
          { status: 'gemerkt', notiz: '', hinzu: U.isoDate(TT.now()), checkliste: {}, termin: null },
          s.merkliste[id] || {},
          status ? { status } : {}
        );
      }
    }, 'merkliste');
    return gemerkt(id);
  }

  function setStatus(id, status) {
    update((s) => {
      if (!s.merkliste[id]) s.merkliste[id] = { status, notiz: '', hinzu: U.isoDate(TT.now()), checkliste: {}, termin: null };
      else s.merkliste[id].status = status;
    }, 'merkliste');
  }

  function setNotiz(id, text) {
    update((s) => {
      if (!s.merkliste[id]) s.merkliste[id] = { status: 'gemerkt', notiz: text, hinzu: U.isoDate(TT.now()), checkliste: {}, termin: null };
      else s.merkliste[id].notiz = text;
    }, 'notiz');
  }

  /* ------------------------- Vergleich ------------------------- */

  const maxVergleich = () => (TT.plan ? TT.plan.grenze('vergleich') : 4);

  function imVergleich(id) { return get().vergleich.indexOf(id) >= 0; }

  function vergleichen(id) {
    const s = get();
    const i = s.vergleich.indexOf(id);
    let meldung = '';
    update((st) => {
      const grenze = maxVergleich();
      if (i >= 0) { st.vergleich.splice(i, 1); meldung = 'Aus dem Vergleich entfernt.'; }
      else if (st.vergleich.length >= grenze) {
        meldung = 'gesperrt:vergleich';
      } else { st.vergleich.push(id); meldung = 'Zum Vergleich hinzugefügt.'; }
    }, 'vergleich');
    return meldung;
  }

  /* ------------------------- Suchagenten ------------------------- */

  function agentAnlegen(name, filter) {
    if (TT.plan && get().agenten.length >= TT.plan.grenze('suchauftraege')) return null;
    const id = 'ag-' + Date.now().toString(36);
    update((s) => {
      s.agenten.push({
        id, name,
        filter: JSON.parse(JSON.stringify(filter)),
        angelegt: U.isoDate(TT.now()),
        zuletztGeprueft: U.isoDate(TT.now()),
        aktiv: true,
        gesehen: []
      });
    }, 'agenten');
    return id;
  }

  function agentLoeschen(id) {
    update((s) => { s.agenten = s.agenten.filter((a) => a.id !== id); }, 'agenten');
  }

  /* Treffer eines Agenten und davon die noch ungesehenen. */
  function agentTreffer(agent) {
    const alle = TT.analyse.filtern(TT.data.listings, agent.filter, get().profil);
    const neu = alle.filter((l) => agent.gesehen.indexOf(l.id) < 0 && U.daysSince(l.stats.online) <= 14);
    return { alle, neu };
  }

  function agentGelesen(id) {
    update((s) => {
      const a = s.agenten.find((x) => x.id === id);
      if (!a) return;
      const t = TT.analyse.filtern(TT.data.listings, a.filter, s.profil);
      a.gesehen = U.uniq(a.gesehen.concat(t.map((l) => l.id)));
      a.zuletztGeprueft = U.isoDate(TT.now());
    }, 'agenten');
  }

  /* ------------------------- Nachrichten ------------------------- */

  function threadFuer(listingId) {
    return get().threads.find((t) => t.listingId === listingId);
  }

  function anschreiben(listingId, text) {
    const l = TT.data.byId[listingId];
    update((s) => {
      let t = s.threads.find((x) => x.listingId === listingId);
      if (!t) {
        t = { id: 'th-' + Date.now().toString(36), listingId, partner: l.anbieter.name, ungelesen: 0, nachrichten: [] };
        s.threads.unshift(t);
      }
      t.nachrichten.push({ von: 'ich', zeit: new Date().toISOString(), text });
      /* Antwort mit realistischer Verzögerung ankündigen, nicht erfinden. */
      t.wartetSeit = new Date().toISOString();
      if (!s.merkliste[listingId]) s.merkliste[listingId] = { status: 'kontakt', notiz: '', hinzu: U.isoDate(TT.now()), checkliste: {}, termin: null };
      else if (s.merkliste[listingId].status === 'gemerkt') s.merkliste[listingId].status = 'kontakt';
    }, 'nachrichten');
  }

  function threadGelesen(id) {
    update((s) => {
      const t = s.threads.find((x) => x.id === id);
      if (t) t.ungelesen = 0;
    }, 'nachrichten');
  }

  /* ------------------------- Besichtigungen ------------------------- */

  function terminBuchen(listingId, terminId) {
    const l = TT.data.byId[listingId];
    const t = l.besichtigungen.find((x) => x.id === terminId);
    if (!t) return null;
    update((s) => {
      if (!s.merkliste[listingId]) s.merkliste[listingId] = { status: 'termin', notiz: '', hinzu: U.isoDate(TT.now()), checkliste: {} };
      s.merkliste[listingId].termin = { id: t.id, datum: t.datum, zeit: t.zeit, art: t.art };
      s.merkliste[listingId].status = 'termin';
    }, 'termin');
    return t;
  }

  function terminAbsagen(listingId) {
    update((s) => {
      if (s.merkliste[listingId]) {
        s.merkliste[listingId].termin = null;
        if (s.merkliste[listingId].status === 'termin') s.merkliste[listingId].status = 'kontakt';
      }
    }, 'termin');
  }

  function checkSetzen(listingId, frageId, wert) {
    update((s) => {
      if (!s.merkliste[listingId]) s.merkliste[listingId] = { status: 'termin', notiz: '', hinzu: U.isoDate(TT.now()), checkliste: {} };
      if (!s.merkliste[listingId].checkliste) s.merkliste[listingId].checkliste = {};
      s.merkliste[listingId].checkliste[frageId] = wert;
    }, 'checkliste');
  }

  /* ------------------------- Eigene Inserate ------------------------- */

  function inseratAnlegen(daten) {
    const id = 'mein-' + Date.now().toString(36);
    const eintrag = Object.assign({ id, eigen: true, erstellt: U.isoDate(TT.now()) }, daten);
    update((s) => { s.eigeneInserate.push(eintrag); if (eintrag.kind === 'tausch') s.meinTausch = eintrag; }, 'inserate');
    /* Bilder können den Speicher des Browsers sprengen. Passiert das,
       wird das Inserat wieder zurückgenommen statt halb angelegt zu
       bleiben – ein Eintrag, den ein Neuladen verschluckt, wäre schlimmer
       als eine ehrliche Fehlermeldung. */
    if (!U.saveStore(state)) {
      state.eigeneInserate = state.eigeneInserate.filter((x) => x.id !== id);
      if (state.meinTausch && state.meinTausch.id === id) state.meinTausch = null;
      U.saveStore(state);
      melden('inserate');
      throw new Error('Der Speicher reicht nicht.');
    }
    TT.data.byId[id] = eintrag;
    return id;
  }

  /* Hervorhebung eines eigenen Inserats setzen oder beenden. */
  function inseratHervorheben(id, art) {
    const p = TT.plan.hervorhebung(art);
    update((s) => {
      const e = s.eigeneInserate.find((x) => x.id === id);
      if (!e) return;
      if (!art) { delete e.boost; }
      else {
        e.boost = {
          art,
          seit: U.isoDate(TT.now()),
          bis: p && p.tage ? U.isoDate(U.addDays(TT.now(), p.tage)) : '',
          bezahlt: p ? TT.plan.hervorhebungPreis(art) : 0
        };
        /* „Nach oben schieben“ heißt: Das Inserat gilt wieder als frisch. */
        if (art === 'schub') e.stats = Object.assign({}, e.stats, { online: U.isoDate(TT.now()) });
      }
      if (s.meinTausch && s.meinTausch.id === id) s.meinTausch = e;
      TT.data.byId[id] = e;
    }, 'inserate');
  }

  /* Ersetzt ein eigenes Inserat, behält aber Kennung, Erstelldatum,
     Hervorhebung und Statistik – sonst verlöre ein „Ändern“ die Merkungen
     anderer und stellte die Uhr auf null. */
  function inseratErsetzen(id, daten) {
    const alt = state.eigeneInserate.find((x) => x.id === id);
    if (!alt) return inseratAnlegen(daten);
    const neu = Object.assign({}, daten, {
      id, eigen: true, erstellt: alt.erstellt,
      boost: alt.boost, stats: alt.stats,
      geaendert: U.isoDate(TT.now())
    });
    const vorher = JSON.parse(JSON.stringify(state.eigeneInserate));
    update((s) => {
      s.eigeneInserate = s.eigeneInserate.map((x) => (x.id === id ? neu : x));
      if (neu.kind === 'tausch') s.meinTausch = neu;
      else if (s.meinTausch && s.meinTausch.id === id) s.meinTausch = null;
    }, 'inserate');
    if (!U.saveStore(state)) {
      state.eigeneInserate = vorher;
      U.saveStore(state);
      melden('inserate');
      throw new Error('Der Speicher reicht nicht.');
    }
    TT.data.byId[id] = neu;
    return id;
  }

  function inseratLoeschen(id) {
    update((s) => {
      s.eigeneInserate = s.eigeneInserate.filter((x) => x.id !== id);
      if (s.meinTausch && s.meinTausch.id === id) s.meinTausch = null;
    }, 'inserate');
    delete TT.data.byId[id];
  }

  /* ------------------------- Verlauf ------------------------- */

  function gesehenMerken(id) {
    update((s) => {
      s.gesehen = [id].concat(s.gesehen.filter((x) => x !== id)).slice(0, 40);
    }, 'gesehen');
  }

  /* ------------------------- Umzug ------------------------- */

  /* Das Einzugsdatum steht schon im Profil – danach noch einmal zu
     fragen wäre reine Doppelarbeit. */
  function einzugsdatum() {
    const s = get();
    return s.einzugsdatum || s.profil.einzugAb || '';
  }

  function umzugsPlan() {
    const s = get();
    const roh = einzugsdatum();
    const datum = roh ? new Date(roh + 'T12:00:00') : null;
    return UMZUG_VORLAGE.map((a) => ({
      id: a.id, label: a.label, gruppe: a.gruppe, hinweis: a.hinweis, wann: a.wann,
      faellig: datum ? U.isoDate(U.addDays(datum, a.wann)) : null,
      erledigt: !!s.umzug[a.id]
    }));
  }

  function umzugSetzen(id, wert) {
    update((s) => { s.umzug[id] = wert; }, 'umzug');
  }

  /* ------------------------- Nachfassen ------------------------- */

  /* Angeschrieben, keine Antwort, und es liegt lange genug zurück:
     genau der Moment, in dem die meisten Bewerbungen im Sand verlaufen. */
  const NACHFASS_TAGE = 4;

  function nachfassFaellig() {
    const s = get();
    return Object.keys(s.merkliste).map((id) => {
      const e = s.merkliste[id];
      if (e.status !== 'kontakt') return null;
      const thread = s.threads.find((t) => t.listingId === id);
      if (!thread || !thread.nachrichten.length) return null;
      const letzte = thread.nachrichten[thread.nachrichten.length - 1];
      if (letzte.von !== 'ich') return null;
      const tage = U.daysSince(letzte.zeit);
      if (tage < NACHFASS_TAGE) return null;
      if (e.nachgefasst) return null;
      return { id, listing: TT.data.byId[id], tage, thread };
    }).filter(Boolean).sort((a, b) => b.tage - a.tage);
  }

  function nachgefasst(id) {
    update((s) => { if (s.merkliste[id]) s.merkliste[id].nachgefasst = U.isoDate(TT.now()); }, 'merkliste');
  }

  /* ------------------------- Übergabeprotokoll ------------------------- */

  function protokollSetzen(feld, wert) {
    update((s) => { s.protokoll[feld] = wert; }, 'protokoll');
  }

  /* ------------------------- Werte der Rechner ------------------------- */

  function werkzeugSetzen(name, werte) {
    update((s) => { s.werkzeuge[name] = Object.assign({}, s.werkzeuge[name], werte); }, 'werkzeuge');
  }

  /* Was das Profil sicher weiß, muss in keinem Rechner erneut eingetippt
     werden. Angaben, die das Profil nicht kennt, bleiben bei der Vorgabe. */
  function ausProfil(name) {
    const p = get().profil;
    if (name === 'leistbarkeit') {
      const o = {};
      if (p.nettoEinkommen) o.netto = p.nettoEinkommen;
      if (p.haushalt) o.haushalt = p.haushalt;
      if (p.eigenkapital) o.eigenkapital = p.eigenkapital;
      return o;
    }
    if (name === 'wohngeld') {
      const o = {};
      if (p.haushalt) o.personen = p.haushalt;
      if (p.budgetWarm) o.miete = p.budgetWarm;
      return o;
    }
    if (name === 'wbs') {
      const o = {};
      if (p.haushalt) o.personen = p.haushalt;
      return o;
    }
    return {};
  }

  const werkzeugWerte = (name, vorgabe) =>
    Object.assign({}, vorgabe, ausProfil(name), get().werkzeuge[name] || {});

  /* ------------------------- Zurücksetzen ------------------------- */

  function zuruecksetzen() {
    U.clearStore();
    state = leer();
    speichern();
    melden('reset');
  }

  TT.store = {
    PIPELINE, UMZUG_VORLAGE, BESICHTIGUNG_FRAGEN, maxVergleich, NACHFASS_TAGE,
    get, set, update, on, laden, speichern,
    gemerkt, merken, setStatus, setNotiz,
    imVergleich, vergleichen,
    agentAnlegen, agentLoeschen, agentTreffer, agentGelesen,
    inseratHervorheben,
    threadFuer, anschreiben, threadGelesen,
    terminBuchen, terminAbsagen, checkSetzen,
    inseratAnlegen, inseratErsetzen, inseratLoeschen, gesehenMerken,
    umzugsPlan, umzugSetzen, einzugsdatum, zuruecksetzen,
    nachfassFaellig, nachgefasst, protokollSetzen, werkzeugSetzen, werkzeugWerte
  };
})(window.TT = window.TT || {});
