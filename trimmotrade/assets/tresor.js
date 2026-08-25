/* =====================================================================
   TrimmoTrade – Dokumententresor

   Das Problem: Wer sich auf zwanzig Wohnungen bewirbt, verschickt zwanzig
   Mal Gehaltsnachweise, Ausweiskopie und Schufa – an Fremde, per E-Mail,
   ohne Ablaufdatum. Die Unterlagen liegen danach in zwanzig Postfächern
   und bleiben dort für immer.

   Die Antwort hier: Die Dokumente werden einmal im Browser verschlüsselt
   abgelegt. Verschickt wird nie die Datei, sondern ein Verweis, der nach
   einer gesetzten Frist und einer gesetzten Zahl von Abrufen erlischt und
   sich jederzeit widerrufen lässt.

   Was daran echt ist: die Verschlüsselung. AES-GCM mit 256 Bit, Schlüssel
   aus dem Kennwort über PBKDF2 mit 310.000 Runden. Jedes Dokument hat
   einen eigenen Schlüssel, der mit dem Tresorschlüssel umschlossen wird –
   nur so lässt sich ein einzelnes Dokument freigeben, ohne den Tresor zu
   öffnen. Der Freigabeschlüssel steht im Fragment des Verweises, dem Teil
   hinter dem Rautezeichen, den Browser niemals an einen Server senden.

   Was hier fehlt: der Server. In dieser Vorführung liegt das Chiffrat im
   Browser, der Verweis funktioniert deshalb nur auf diesem Gerät. Im
   Betrieb läge dort das Chiffrat und sonst nichts – kein Schlüssel, keine
   Datei im Klartext, nichts, was ein Einbruch verwertbar machen würde.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util;

  const DB_NAME = 'trimmotrade-tresor';
  const DB_VERSION = 1;
  const SPEICHER = 'dokumente';
  const META = 'trimmotrade.tresor.v1';

  const RUNDEN = 310000;
  const MAX_BYTES = 8 * 1024 * 1024;   /* je Datei */
  const OK_TYPEN = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic'];

  const ARTEN = [
    { id: 'selbstauskunft', name: 'Selbstauskunft', hinweis: 'Standardformular mit Angaben zu Person und Einkommen.' },
    { id: 'gehaltsnachweise', name: 'Gehaltsnachweise', hinweis: 'Die letzten drei Abrechnungen.' },
    { id: 'schufa', name: 'Schufa-Bonitätsauskunft', hinweis: 'Erst nach der Besichtigung herausgeben – nie mit der ersten Anfrage.' },
    { id: 'mietschuldenfrei', name: 'Mietschuldenfreiheit', hinweis: 'Bescheinigung der bisherigen Vermieterseite.' },
    { id: 'ausweis', name: 'Ausweiskopie', hinweis: 'Nummer schwärzen. Erst bei ernsthaftem Interesse.' },
    { id: 'buergschaft', name: 'Bürgschaft', hinweis: 'Falls Einkommen oder Bonität allein nicht reichen.' },
    { id: 'wbs', name: 'Wohnberechtigungsschein', hinweis: 'Nur für geförderte Wohnungen nötig.' },
    { id: 'sonstiges', name: 'Sonstiges', hinweis: 'Arbeitsvertrag, Bürgschaftserklärung, was sonst verlangt wird.' }
  ];

  /* Unterlagen, die man niemals mit der ersten Anfrage verschickt. */
  const HEIKEL = ['schufa', 'ausweis'];

  const verfuegbar = () => !!(window.crypto && window.crypto.subtle && window.indexedDB && window.TextEncoder);

  /* ------------------------- Kleinkram ------------------------- */

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  function zuBase64(puffer) {
    const bytes = new Uint8Array(puffer);
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function ausBase64(text) {
    const s = atob(String(text).replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    return bytes;
  }

  const zufall = (n) => crypto.getRandomValues(new Uint8Array(n));

  /* ------------------------- Speicher ------------------------- */

  let dbVersprechen = null;

  function db() {
    if (dbVersprechen) return dbVersprechen;
    dbVersprechen = new Promise((gut, schlecht) => {
      const anfrage = indexedDB.open(DB_NAME, DB_VERSION);
      anfrage.onupgradeneeded = () => {
        const d = anfrage.result;
        if (!d.objectStoreNames.contains(SPEICHER)) d.createObjectStore(SPEICHER, { keyPath: 'id' });
      };
      anfrage.onsuccess = () => gut(anfrage.result);
      anfrage.onerror = () => schlecht(anfrage.error);
    });
    return dbVersprechen;
  }

  function tun(modus, fn) {
    return db().then((d) => new Promise((gut, schlecht) => {
      const t = d.transaction(SPEICHER, modus);
      const s = t.objectStore(SPEICHER);
      let ergebnis;
      try { ergebnis = fn(s); } catch (e) { schlecht(e); return; }
      t.oncomplete = () => gut(ergebnis && ergebnis.result !== undefined ? ergebnis.result : ergebnis);
      t.onerror = () => schlecht(t.error);
    }));
  }

  function meta() {
    try { return JSON.parse(localStorage.getItem(META) || 'null'); } catch (e) { return null; }
  }

  function metaSetzen(m) {
    try { localStorage.setItem(META, JSON.stringify(m)); } catch (e) { /* Speicher voll */ }
  }

  /* ------------------------- Schlüssel ------------------------- */

  let tresorSchluessel = null;    /* nur im Arbeitsspeicher, nie gespeichert */

  function schluesselAusKennwort(kennwort, salz) {
    return crypto.subtle.importKey('raw', enc.encode(kennwort), 'PBKDF2', false, ['deriveKey'])
      .then((roh) => crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: salz, iterations: RUNDEN, hash: 'SHA-256' },
        roh, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
      ));
  }

  function verschluesseln(schluessel, daten) {
    const iv = zufall(12);
    return crypto.subtle.encrypt({ name: 'AES-GCM', iv }, schluessel, daten)
      .then((chiffrat) => ({ iv: zuBase64(iv), chiffrat }));
  }

  function entschluesseln(schluessel, ivText, chiffrat) {
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: ausBase64(ivText) }, schluessel, chiffrat);
  }

  /* ------------------------- Einrichten und Öffnen ------------------------- */

  const eingerichtet = () => !!(meta() && meta().salz);
  const istOffen = () => !!tresorSchluessel;

  function einrichten(kennwort) {
    if (!verfuegbar()) return Promise.reject(new Error('Dieser Browser kann keine Verschlüsselung.'));
    if (!kennwort || kennwort.length < 8) return Promise.reject(new Error('Das Kennwort braucht mindestens acht Zeichen.'));
    const salz = zufall(16);
    return schluesselAusKennwort(kennwort, salz).then((k) => {
      return verschluesseln(k, enc.encode('trimmotrade-tresor')).then((probe) => {
        metaSetzen({
          salz: zuBase64(salz), runden: RUNDEN,
          probeIv: probe.iv, probe: zuBase64(probe.chiffrat),
          angelegt: U.isoDate(TT.now()), freigaben: []
        });
        tresorSchluessel = k;
        return true;
      });
    });
  }

  function entsperren(kennwort) {
    const m = meta();
    if (!m) return Promise.reject(new Error('Es ist noch kein Tresor eingerichtet.'));
    return schluesselAusKennwort(kennwort, ausBase64(m.salz))
      .then((k) => entschluesseln(k, m.probeIv, ausBase64(m.probe).buffer)
        .then((klar) => {
          if (dec.decode(klar) !== 'trimmotrade-tresor') throw new Error('falsch');
          tresorSchluessel = k;
          return true;
        }))
      .catch(() => { throw new Error('Das Kennwort stimmt nicht.'); });
  }

  function sperren() { tresorSchluessel = null; }

  /* ------------------------- Dokumente ------------------------- */

  function hinzufuegen(datei, art) {
    if (!istOffen()) return Promise.reject(new Error('Der Tresor ist gesperrt.'));
    if (datei.size > MAX_BYTES) return Promise.reject(new Error('Die Datei ist größer als 8 MB.'));
    if (datei.type && OK_TYPEN.indexOf(datei.type) < 0) {
      return Promise.reject(new Error('Erlaubt sind PDF, JPG, PNG, WEBP und HEIC.'));
    }
    const id = 'dok-' + zuBase64(zufall(9));

    /* Jedes Dokument bekommt einen eigenen Schlüssel. Nur so lässt sich
       ein einzelnes freigeben, ohne den Tresor preiszugeben. */
    return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
      .then((dokSchluessel) => datei.arrayBuffer()
        .then((bytes) => verschluesseln(dokSchluessel, bytes))
        .then((inhalt) => {
          /* Auch der Dateiname wird verschlüsselt – er verrät sonst mehr,
             als vielen bewusst ist. */
          return verschluesseln(dokSchluessel, enc.encode(JSON.stringify({ name: datei.name, typ: datei.type })))
            .then((kopf) => crypto.subtle.exportKey('raw', dokSchluessel)
              .then((rohSchluessel) => verschluesseln(tresorSchluessel, rohSchluessel)
                .then((umschlossen) => tun('readwrite', (s) => s.put({
                  id, art: art || 'sonstiges',
                  groesse: datei.size,
                  hinzu: new Date().toISOString(),
                  inhaltIv: inhalt.iv, inhalt: inhalt.chiffrat,
                  kopfIv: kopf.iv, kopf: kopf.chiffrat,
                  huelleIv: umschlossen.iv, huelle: umschlossen.chiffrat
                })).then(() => id))));
        }));
  }

  /* Holt den Dokumentschlüssel aus der Hülle. */
  function dokSchluessel(satz) {
    return entschluesseln(tresorSchluessel, satz.huelleIv, satz.huelle)
      .then((roh) => crypto.subtle.importKey('raw', roh, 'AES-GCM', true, ['encrypt', 'decrypt']));
  }

  function liste() {
    return tun('readonly', (s) => s.getAll()).then((saetze) => {
      saetze.sort((a, b) => a.hinzu.localeCompare(b.hinzu));
      if (!istOffen()) {
        /* Gesperrt: Nur was ohnehin unverschlüsselt liegt – Art, Größe,
           Datum. Der Dateiname bleibt verborgen. */
        return saetze.map((s) => ({ id: s.id, art: s.art, groesse: s.groesse, hinzu: s.hinzu, gesperrt: true }));
      }
      return Promise.all(saetze.map((satz) => dokSchluessel(satz)
        .then((k) => entschluesseln(k, satz.kopfIv, satz.kopf))
        .then((klar) => {
          const kopf = JSON.parse(dec.decode(klar));
          return { id: satz.id, art: satz.art, groesse: satz.groesse, hinzu: satz.hinzu, name: kopf.name, typ: kopf.typ };
        })
        .catch(() => ({ id: satz.id, art: satz.art, groesse: satz.groesse, hinzu: satz.hinzu, gesperrt: true }))));
    });
  }

  function loeschen(id) {
    return tun('readwrite', (s) => s.delete(id)).then(() => {
      /* Aus allen Freigaben entfernen; eine leere Freigabe wird widerrufen. */
      const m = meta();
      if (!m) return;
      m.freigaben = (m.freigaben || []).map((f) => {
        f.dokumente = f.dokumente.filter((d) => d !== id);
        if (!f.dokumente.length) f.widerrufen = new Date().toISOString();
        return f;
      });
      metaSetzen(m);
    });
  }

  /* Entschlüsselt ein Dokument für die eigene Ansicht. */
  function oeffnen(id) {
    if (!istOffen()) return Promise.reject(new Error('Der Tresor ist gesperrt.'));
    return tun('readonly', (s) => s.get(id)).then((satz) => {
      if (!satz) throw new Error('Dokument nicht gefunden.');
      return dokSchluessel(satz).then((k) => Promise.all([
        entschluesseln(k, satz.inhaltIv, satz.inhalt),
        entschluesseln(k, satz.kopfIv, satz.kopf)
      ]).then(([inhalt, kopf]) => {
        const meta2 = JSON.parse(dec.decode(kopf));
        return { name: meta2.name, typ: meta2.typ, bytes: inhalt };
      }));
    });
  }

  /* ------------------------- Freigaben ------------------------- */

  function freigaben() {
    const m = meta();
    return (m && m.freigaben) ? m.freigaben.slice().reverse() : [];
  }

  function freigabeStatus(f) {
    if (f.widerrufen) return { gueltig: false, grund: 'widerrufen', text: 'widerrufen am ' + U.dateDE(f.widerrufen.slice(0, 10)) };
    const abgelaufen = new Date(f.ablauf) < TT.now();
    if (abgelaufen) return { gueltig: false, grund: 'abgelaufen', text: 'abgelaufen am ' + U.dateDE(f.ablauf.slice(0, 10)) };
    if (f.abrufe.length >= f.maxAbrufe) return { gueltig: false, grund: 'aufgebraucht', text: 'alle ' + f.maxAbrufe + ' Abrufe verbraucht' };
    const tage = Math.ceil((new Date(f.ablauf) - TT.now()) / 86400000);
    return { gueltig: true, grund: 'offen', text: 'gültig noch ' + tage + ' ' + U.plural(tage, 'Tag', 'Tage')
      + ', ' + (f.maxAbrufe - f.abrufe.length) + ' von ' + f.maxAbrufe + ' Abrufen offen' };
  }

  /* Erzeugt eine Freigabe: Die Dokumentschlüssel wandern in den Verweis,
     nicht in den Speicher. Wer den Verweis nicht hat, kann nichts lesen –
     auch nicht, wer Zugriff auf die abgelegten Daten bekommt. */
  function freigabeErstellen(optionen) {
    if (!istOffen()) return Promise.reject(new Error('Der Tresor ist gesperrt.'));
    const ids = optionen.dokumente || [];
    if (!ids.length) return Promise.reject(new Error('Wähle mindestens ein Dokument.'));
    const tage = U.clamp(Number(optionen.tage) || 7, 1, 90);
    const maxAbrufe = U.clamp(Number(optionen.maxAbrufe) || 3, 1, 20);

    return tun('readonly', (s) => s.getAll()).then((alle) => {
      const gewaehlt = alle.filter((s) => ids.indexOf(s.id) >= 0);
      return Promise.all(gewaehlt.map((satz) => dokSchluessel(satz)
        .then((k) => crypto.subtle.exportKey('raw', k))
        .then((roh) => ({ id: satz.id, k: zuBase64(roh) }))));
    }).then((schluessel) => {
      const id = 'fg-' + zuBase64(zufall(9));
      const m = meta();
      m.freigaben = m.freigaben || [];
      m.freigaben.push({
        id, dokumente: ids,
        empfaenger: (optionen.empfaenger || '').slice(0, 120),
        objektId: optionen.objektId || null,
        erstellt: new Date().toISOString(),
        ablauf: new Date(TT.now().getTime() + tage * 86400000).toISOString(),
        maxAbrufe, abrufe: [], widerrufen: null
      });
      metaSetzen(m);
      const geheim = zuBase64(enc.encode(JSON.stringify(schluessel)));
      return { id, geheim, link: linkFuer(id, geheim), tage, maxAbrufe };
    });
  }

  function linkFuer(id, geheim) {
    const basis = location.href.split('#')[0];
    return basis + '#/freigabe/' + id + '~' + geheim;
  }

  function widerrufen(id) {
    const m = meta();
    if (!m) return;
    (m.freigaben || []).forEach((f) => { if (f.id === id) f.widerrufen = new Date().toISOString(); });
    metaSetzen(m);
  }

  function freigabeLoeschen(id) {
    const m = meta();
    if (!m) return;
    m.freigaben = (m.freigaben || []).filter((f) => f.id !== id);
    metaSetzen(m);
  }

  /* Abruf durch die empfangende Seite. Braucht keinen Tresorschlüssel –
     die Dokumentschlüssel stehen im Verweis. */
  function freigabeAbrufen(id, geheim, protokollieren) {
    const m = meta();
    const f = (m && m.freigaben || []).find((x) => x.id === id);
    if (!f) return Promise.reject(new Error('Diesen Verweis gibt es nicht mehr.'));
    const status = freigabeStatus(f);
    if (!status.gueltig) return Promise.reject(new Error('Der Verweis ist ' + status.text + '.'));

    let schluessel;
    try { schluessel = JSON.parse(dec.decode(ausBase64(geheim))); }
    catch (e) { return Promise.reject(new Error('Der Verweis ist unvollständig.')); }

    return tun('readonly', (s) => s.getAll()).then((alle) => {
      return Promise.all(schluessel.map((eintrag) => {
        const satz = alle.find((s) => s.id === eintrag.id);
        if (!satz) return null;
        return crypto.subtle.importKey('raw', ausBase64(eintrag.k), 'AES-GCM', false, ['decrypt'])
          .then((k) => Promise.all([
            entschluesseln(k, satz.inhaltIv, satz.inhalt),
            entschluesseln(k, satz.kopfIv, satz.kopf)
          ]))
          .then(([inhalt, kopf]) => {
            const meta2 = JSON.parse(dec.decode(kopf));
            return { id: satz.id, art: satz.art, name: meta2.name, typ: meta2.typ, bytes: inhalt, groesse: satz.groesse };
          })
          .catch(() => null);
      }));
    }).then((dokumente) => {
      const gueltige = dokumente.filter(Boolean);
      if (!gueltige.length) throw new Error('Die Unterlagen lassen sich mit diesem Verweis nicht entschlüsseln.');
      let stand = f;
      if (protokollieren !== false) {
        const m2 = meta();
        const f2 = (m2.freigaben || []).find((x) => x.id === id);
        if (f2) { f2.abrufe.push({ zeit: new Date().toISOString() }); metaSetzen(m2); stand = f2; }
      }
      /* Der eigene Abruf zählt mit: Wer die Unterlagen gerade geöffnet hat,
         soll „1 von 3“ sehen und nicht „0 von 3“. */
      return { freigabe: stand, dokumente: gueltige };
    });
  }

  /* ------------------------- Aufräumen ------------------------- */

  function allesLoeschen() {
    tresorSchluessel = null;
    try { localStorage.removeItem(META); } catch (e) { /* egal */ }
    return tun('readwrite', (s) => s.clear()).catch(() => { });
  }

  TT.tresor = {
    ARTEN, HEIKEL, MAX_BYTES, OK_TYPEN, RUNDEN,
    verfuegbar, eingerichtet, istOffen, einrichten, entsperren, sperren,
    hinzufuegen, liste, loeschen, oeffnen,
    freigaben, freigabeStatus, freigabeErstellen, freigabeAbrufen,
    widerrufen, freigabeLoeschen, linkFuer, allesLoeschen
  };
})(window.TT = window.TT || {});
