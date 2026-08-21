/* =====================================================================
   Nestwerk – Zustand
   Ein einziger Zustand, ein einziger Speicherplatz, ein Ereignis für
   alle Ansichten. Bleibt im Browser; nichts verlässt das Gerät.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;

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
    profil: JSON.parse(JSON.stringify(NW.data.profilVorlage)),
    profilAngelegt: false,
    filter: NW.analyse.leerFilter(),
    merkliste: {},          /* id -> { status, notiz, hinzu, termin, checkliste } */
    vergleich: [],
    agenten: [],
    threads: NW.data.startThreads(),
    meinTausch: null,
    eigeneInserate: [],
    gesehen: [],
    einzugsdatum: '',
    umzug: {},
    theme: 'auto',
    ansicht: 'liste',
    hinweiseGelesen: {},
    zuletzt: U.isoDate(NW.now())
  });

  let state = null;
  const hoerer = [];

  function laden() {
    const gespeichert = U.loadStore();
    state = leer();
    if (gespeichert && gespeichert.version === 1) {
      /* Nur bekannte Felder übernehmen, damit alte Stände nichts kaputt machen. */
      Object.keys(state).forEach((k) => {
        if (gespeichert[k] !== undefined && k !== 'version') state[k] = gespeichert[k];
      });
      /* Profil und Filter gegen die aktuelle Vorlage auffüllen. */
      state.profil = Object.assign({}, NW.data.profilVorlage, state.profil);
      state.profil.gewichtung = Object.assign({}, NW.data.profilVorlage.gewichtung, state.profil.gewichtung);
      state.profil.lifestyle = Object.assign({}, NW.data.profilVorlage.lifestyle, state.profil.lifestyle);
      state.profil.unterlagen = Object.assign({}, NW.data.profilVorlage.unterlagen, state.profil.unterlagen);
      state.filter = Object.assign(NW.analyse.leerFilter(), state.filter);
    }
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
          { status: 'gemerkt', notiz: '', hinzu: U.isoDate(NW.now()), checkliste: {}, termin: null },
          s.merkliste[id] || {},
          status ? { status } : {}
        );
      }
    }, 'merkliste');
    return gemerkt(id);
  }

  function setStatus(id, status) {
    update((s) => {
      if (!s.merkliste[id]) s.merkliste[id] = { status, notiz: '', hinzu: U.isoDate(NW.now()), checkliste: {}, termin: null };
      else s.merkliste[id].status = status;
    }, 'merkliste');
  }

  function setNotiz(id, text) {
    update((s) => {
      if (!s.merkliste[id]) s.merkliste[id] = { status: 'gemerkt', notiz: text, hinzu: U.isoDate(NW.now()), checkliste: {}, termin: null };
      else s.merkliste[id].notiz = text;
    }, 'notiz');
  }

  /* ------------------------- Vergleich ------------------------- */

  const MAX_VERGLEICH = 4;

  function imVergleich(id) { return get().vergleich.indexOf(id) >= 0; }

  function vergleichen(id) {
    const s = get();
    const i = s.vergleich.indexOf(id);
    let meldung = '';
    update((st) => {
      if (i >= 0) { st.vergleich.splice(i, 1); meldung = 'Aus dem Vergleich entfernt.'; }
      else if (st.vergleich.length >= MAX_VERGLEICH) { meldung = 'Es lassen sich höchstens ' + MAX_VERGLEICH + ' Objekte vergleichen.'; }
      else { st.vergleich.push(id); meldung = 'Zum Vergleich hinzugefügt.'; }
    }, 'vergleich');
    return meldung;
  }

  /* ------------------------- Suchagenten ------------------------- */

  function agentAnlegen(name, filter) {
    const id = 'ag-' + Date.now().toString(36);
    update((s) => {
      s.agenten.push({
        id, name,
        filter: JSON.parse(JSON.stringify(filter)),
        angelegt: U.isoDate(NW.now()),
        zuletztGeprueft: U.isoDate(NW.now()),
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
    const alle = NW.analyse.filtern(NW.data.listings, agent.filter, get().profil);
    const neu = alle.filter((l) => agent.gesehen.indexOf(l.id) < 0 && U.daysSince(l.stats.online) <= 14);
    return { alle, neu };
  }

  function agentGelesen(id) {
    update((s) => {
      const a = s.agenten.find((x) => x.id === id);
      if (!a) return;
      const t = NW.analyse.filtern(NW.data.listings, a.filter, s.profil);
      a.gesehen = U.uniq(a.gesehen.concat(t.map((l) => l.id)));
      a.zuletztGeprueft = U.isoDate(NW.now());
    }, 'agenten');
  }

  /* ------------------------- Nachrichten ------------------------- */

  function threadFuer(listingId) {
    return get().threads.find((t) => t.listingId === listingId);
  }

  function anschreiben(listingId, text) {
    const l = NW.data.byId[listingId];
    update((s) => {
      let t = s.threads.find((x) => x.listingId === listingId);
      if (!t) {
        t = { id: 'th-' + Date.now().toString(36), listingId, partner: l.anbieter.name, ungelesen: 0, nachrichten: [] };
        s.threads.unshift(t);
      }
      t.nachrichten.push({ von: 'ich', zeit: new Date().toISOString(), text });
      /* Antwort mit realistischer Verzögerung ankündigen, nicht erfinden. */
      t.wartetSeit = new Date().toISOString();
      if (!s.merkliste[listingId]) s.merkliste[listingId] = { status: 'kontakt', notiz: '', hinzu: U.isoDate(NW.now()), checkliste: {}, termin: null };
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
    const l = NW.data.byId[listingId];
    const t = l.besichtigungen.find((x) => x.id === terminId);
    if (!t) return null;
    update((s) => {
      if (!s.merkliste[listingId]) s.merkliste[listingId] = { status: 'termin', notiz: '', hinzu: U.isoDate(NW.now()), checkliste: {} };
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
      if (!s.merkliste[listingId]) s.merkliste[listingId] = { status: 'termin', notiz: '', hinzu: U.isoDate(NW.now()), checkliste: {} };
      if (!s.merkliste[listingId].checkliste) s.merkliste[listingId].checkliste = {};
      s.merkliste[listingId].checkliste[frageId] = wert;
    }, 'checkliste');
  }

  /* ------------------------- Eigene Inserate ------------------------- */

  function inseratAnlegen(daten) {
    const id = 'mein-' + Date.now().toString(36);
    const eintrag = Object.assign({ id, eigen: true, erstellt: U.isoDate(NW.now()) }, daten);
    update((s) => { s.eigeneInserate.push(eintrag); if (eintrag.kind === 'tausch') s.meinTausch = eintrag; }, 'inserate');
    NW.data.byId[id] = eintrag;
    return id;
  }

  function inseratLoeschen(id) {
    update((s) => {
      s.eigeneInserate = s.eigeneInserate.filter((x) => x.id !== id);
      if (s.meinTausch && s.meinTausch.id === id) s.meinTausch = null;
    }, 'inserate');
    delete NW.data.byId[id];
  }

  /* ------------------------- Verlauf ------------------------- */

  function gesehenMerken(id) {
    update((s) => {
      s.gesehen = [id].concat(s.gesehen.filter((x) => x !== id)).slice(0, 40);
    }, 'gesehen');
  }

  /* ------------------------- Umzug ------------------------- */

  function umzugsPlan() {
    const s = get();
    const datum = s.einzugsdatum ? new Date(s.einzugsdatum + 'T12:00:00') : null;
    return UMZUG_VORLAGE.map((a) => ({
      id: a.id, label: a.label, gruppe: a.gruppe, hinweis: a.hinweis, wann: a.wann,
      faellig: datum ? U.isoDate(U.addDays(datum, a.wann)) : null,
      erledigt: !!s.umzug[a.id]
    }));
  }

  function umzugSetzen(id, wert) {
    update((s) => { s.umzug[id] = wert; }, 'umzug');
  }

  /* ------------------------- Zurücksetzen ------------------------- */

  function zuruecksetzen() {
    U.clearStore();
    state = leer();
    speichern();
    melden('reset');
  }

  NW.store = {
    PIPELINE, UMZUG_VORLAGE, BESICHTIGUNG_FRAGEN, MAX_VERGLEICH,
    get, set, update, on, laden, speichern,
    gemerkt, merken, setStatus, setNotiz,
    imVergleich, vergleichen,
    agentAnlegen, agentLoeschen, agentTreffer, agentGelesen,
    threadFuer, anschreiben, threadGelesen,
    terminBuchen, terminAbsagen, checkSetzen,
    inseratAnlegen, inseratLoeschen, gesehenMerken,
    umzugsPlan, umzugSetzen, zuruecksetzen
  };
})(window.NW = window.NW || {});
