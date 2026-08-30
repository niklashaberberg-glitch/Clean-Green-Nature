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

   Wo das Chiffrat liegt, hängt daran, ob ein Server antwortet. Tut er es,
   liegt es dort – und dort liegt genau das und sonst nichts: kein
   Schlüssel, keine Datei im Klartext, nichts, was ein Einbruch verwertbar
   machen würde. Das ist keine Bequemlichkeit, sondern die Bedingung dafür,
   dass eine Freigabe überhaupt etwas taugt: Ein Verweis auf ein Chiffrat
   im eigenen Browser geht bei niemand anderem auf, und einen Abrufzähler,
   den der Empfänger selbst führt, gibt es nicht. Ohne Server – als Datei
   geöffnet – fällt alles auf IndexedDB zurück und bleibt auf dem Gerät.
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

  /* ------------------------------------------------------------------
     Wo das Chiffrat liegt

     Bis hierher: in diesem Browser. Die Verschlüsselung lief echt, nur
     lag das Ergebnis auf dem Gerät – und damit ging ein Freigabeverweis
     ausschließlich auf demselben Gerät auf. Die Vermieterseite, für die
     er gedacht war, sah nichts. Der Tresor war als Vorführung richtig
     und als Werkzeug wertlos: Man verschickt einen Verweis, damit ihn
     jemand anderes öffnet.

     Jetzt liegt das Chiffrat auf dem Server, sobald ein Server da ist
     und jemand angemeldet ist. Was sich dadurch NICHT ändert: wer lesen
     kann. Der Schlüssel entsteht aus dem Kennwort, bleibt im
     Arbeitsspeicher und wandert beim Freigeben in den Fragmentteil des
     Verweises – den Teil hinter dem Rautezeichen, den Browser
     grundsätzlich nicht an Server senden. Der Server sieht Chiffrat und
     sonst nichts.

     Ohne Server – die Einzeldatei, eine Kopie auf dem Stick – bleibt
     alles beim Alten, und die Oberfläche sagt, dass der Verweis dann
     nur hier aufgeht. */
  const amServer = () => !!(TT.api && TT.api.da && TT.konto && TT.konto.angemeldet());

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

  /* ------------------------------------------------------------------
     Ein Satz, zwei Orte

     Ein Dokument besteht aus vier Teilen: dem verschlüsselten Inhalt,
     dem verschlüsselten Dateinamen, dem umschlossenen Dokumentschlüssel
     und drei Zufallswerten (iv). Im Browser liegen sie als Rohbytes; für
     den Server werden sie zu Base64.

     Der Server bekommt zwei Spalten: `chiffrat` für den Inhalt – das
     Große – und `huelle` für den Rest, der klein ist. Der Dateityp geht
     bewusst NICHT als eigene Spalte mit: Er steckt schon im
     verschlüsselten Kopf, und „application/pdf“ neben „Schufa“ verrät
     mehr, als nötig ist.
     ------------------------------------------------------------------ */

  function zumServer(satz) {
    return {
      art: satz.art,
      groesse: satz.groesse,
      huelle: zuBase64(enc.encode(JSON.stringify({
        inhaltIv: satz.inhaltIv,
        kopfIv: satz.kopfIv, kopf: zuBase64(satz.kopf),
        huelleIv: satz.huelleIv, huelle: zuBase64(satz.huelle)
      }))),
      chiffrat: zuBase64(satz.inhalt)
    };
  }

  function vomServer(d) {
    let h;
    try { h = JSON.parse(dec.decode(ausBase64(d.huelle))); } catch (e) { return null; }
    return {
      id: d.id, art: d.art, groesse: d.groesse,
      hinzu: new Date((d.hinzu || 0) * 1000).toISOString(),
      inhaltIv: h.inhaltIv,
      inhalt: d.chiffrat ? ausBase64(d.chiffrat).buffer : null,
      kopfIv: h.kopfIv, kopf: ausBase64(h.kopf).buffer,
      huelleIv: h.huelleIv, huelle: ausBase64(h.huelle).buffer
    };
  }

  /* Alle Sätze – ohne den Inhalt, denn die Liste braucht ihn nicht und
     er ist der große Teil. */
  function alleSaetze() {
    if (!amServer()) {
      return tun('readonly', (s) => s.getAll())
        .then((a) => a.slice().sort((x, y) => String(x.hinzu).localeCompare(String(y.hinzu))));
    }
    return TT.api.ruf('tresor/liste').then((d) => {
      if (d && d.freigaben) freigabenVomServer = d.freigaben;
      return (d.dokumente || []).map(vomServer).filter(Boolean)
        .sort((x, y) => String(x.hinzu).localeCompare(String(y.hinzu)));
    });
  }

  /* Ein Satz samt Inhalt. */
  function einSatz(id) {
    if (!amServer()) return tun('readonly', (s) => s.get(id));
    return TT.api.ruf('tresor/holen', { id }).then((d) => vomServer(d.dokument));
  }

  function satzAblegen(satz) {
    if (!amServer()) return tun('readwrite', (s) => s.put(satz)).then(() => satz.id);
    return TT.api.ruf('tresor/neu', zumServer(satz)).then((d) => d.id);
  }

  function satzLoeschen(id) {
    if (!amServer()) return tun('readwrite', (s) => s.delete(id));
    return TT.api.ruf('tresor/loeschen', { id });
  }

  /* Die Freigaben. Ohne Server stehen sie im Kopf des Tresors; mit
     Server kommen sie mit der Liste und werden hier gehalten, damit
     `freigaben()` sie ohne Warten ausgeben kann. */
  let freigabenVomServer = null;

  /* Der Kopf des Tresors: Salz, Rundenzahl und die Probe, an der sich
     erkennen lässt, ob das Kennwort stimmt. Nichts davon ist geheim –
     das Salz ist bei PBKDF2 öffentlich, die Probe ist Chiffrat. Auf dem
     Server liegt er trotzdem, denn ohne ihn ließe sich der Tresor auf
     einem zweiten Gerät gar nicht erst öffnen.

     Der Zwischenspeicher hier ist nötig, weil `eingerichtet()` und
     `freigabeStatus()` aus der Zeichnung heraus aufgerufen werden und
     dort nicht auf den Server warten können. */
  let metaZwischen = null;

  function meta() {
    if (metaZwischen) return metaZwischen;
    try { return JSON.parse(localStorage.getItem(META) || 'null'); } catch (e) { return null; }
  }

  function metaSetzen(m) {
    metaZwischen = m;
    /* Auch ohne Server behalten: Wer sich abmeldet, soll den Tresor auf
       diesem Gerät weiter öffnen können. */
    try { localStorage.setItem(META, JSON.stringify(m)); } catch (e) { /* Speicher voll */ }
    if (amServer()) {
      TT.api.ruf('ablage/setzen', { felder: { tresorMeta: m } }).catch(() => { });
    }
  }

  /* Beim Start einmal vom Server holen – sonst steht auf einem neuen
     Gerät „noch kein Tresor eingerichtet“, obwohl einer da ist. */
  function metaHolen() {
    if (!amServer()) return Promise.resolve(meta());
    return TT.api.ruf('ablage').then((d) => {
      const m = d && d.ablage && d.ablage.tresorMeta;
      if (m && m.salz) {
        metaZwischen = m;
        try { localStorage.setItem(META, JSON.stringify(m)); } catch (e) { /* egal */ }
      }
      return meta();
    }, () => meta());
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
                .then((umschlossen) => satzAblegen({
                  id, art: art || 'sonstiges',
                  groesse: datei.size,
                  hinzu: new Date().toISOString(),
                  inhaltIv: inhalt.iv, inhalt: inhalt.chiffrat,
                  kopfIv: kopf.iv, kopf: kopf.chiffrat,
                  huelleIv: umschlossen.iv, huelle: umschlossen.chiffrat
                }))));
        }));
  }

  /* Holt den Dokumentschlüssel aus der Hülle. */
  function dokSchluessel(satz) {
    return entschluesseln(tresorSchluessel, satz.huelleIv, satz.huelle)
      .then((roh) => crypto.subtle.importKey('raw', roh, 'AES-GCM', true, ['encrypt', 'decrypt']));
  }

  function liste() {
    return alleSaetze().then((saetze) => {
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
    return satzLoeschen(id).then(() => {
      /* Mit Server räumt der Server die Freigaben mit auf – er kennt
         sie und weiß, welche dadurch leer werden. */
      if (amServer()) { freigabenVomServer = null; return; }
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
    return einSatz(id).then((satz) => {
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
    if (amServer()) {
      /* Der Server rechnet Ablauf und Zähler selbst und schickt sie
         mit; hier wird nur noch umbenannt, was die Oberfläche erwartet. */
      return (freigabenVomServer || []).map((f) => ({
        id: f.id,
        dokumente: f.dokumente || [],
        empfaenger: f.empfaenger || '',
        objektId: f.objekt || null,
        erstellt: new Date((f.erstellt || 0) * 1000).toISOString(),
        ablauf: new Date((f.ablauf || 0) * 1000).toISOString(),
        maxAbrufe: f.maxAbrufe,
        abrufe: (f.abrufe || []).map((a) => ({ zeit: new Date((a.zeit || 0) * 1000).toISOString() })),
        widerrufen: f.widerrufen ? new Date((f.erstellt || 0) * 1000).toISOString() : null
      }));
    }
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

    return alleSaetze().then((alle) => {
      const gewaehlt = alle.filter((x) => ids.indexOf(x.id) >= 0);
      return Promise.all(gewaehlt.map((satz) => dokSchluessel(satz)
        .then((k) => crypto.subtle.exportKey('raw', k))
        .then((roh) => ({ id: satz.id, k: zuBase64(roh) }))));
    }).then((schluessel) => {
      const geheim = zuBase64(enc.encode(JSON.stringify(schluessel)));

      /* Mit Server vergibt der Server die Kennung und setzt Ablauf,
         Zähler und Widerruf durch. Das ist der Unterschied, der den
         Verweis überhaupt brauchbar macht: Vorher hätte der Empfänger
         nur den Zähler in seinem eigenen Browser hochgezählt – also
         gar keinen. */
      if (amServer()) {
        return TT.api.ruf('freigabe/neu', {
          dokumente: ids,
          empfaenger: (optionen.empfaenger || '').slice(0, 120),
          objektId: optionen.objektId || '',
          tage, maxAbrufe
        }).then((d) => {
          freigabenVomServer = null;
          const id = d.freigabe.id;
          return { id, geheim, link: linkFuer(id, geheim), tage: d.freigabe.tage, maxAbrufe: d.freigabe.maxAbrufe };
        });
      }

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
      return { id, geheim, link: linkFuer(id, geheim), tage, maxAbrufe };
    });
  }

  function linkFuer(id, geheim) {
    const basis = location.href.split('#')[0];
    return basis + '#/freigabe/' + id + '~' + geheim;
  }

  function widerrufen(id) {
    if (amServer()) {
      return TT.api.ruf('freigabe/widerrufen', { id })
        .then((d) => { freigabenVomServer = d.freigaben || null; });
    }
    const m = meta();
    if (!m) return Promise.resolve();
    (m.freigaben || []).forEach((f) => { if (f.id === id) f.widerrufen = new Date().toISOString(); });
    metaSetzen(m);
    return Promise.resolve();
  }

  function freigabeLoeschen(id) {
    if (amServer()) {
      return TT.api.ruf('freigabe/loeschen', { id })
        .then((d) => { freigabenVomServer = d.freigaben || null; });
    }
    const m = meta();
    if (!m) return Promise.resolve();
    m.freigaben = (m.freigaben || []).filter((f) => f.id !== id);
    metaSetzen(m);
    return Promise.resolve();
  }

  /* Abruf durch die empfangende Seite. Braucht keinen Tresorschlüssel –
     die Dokumentschlüssel stehen im Verweis. */
  /* Abruf durch die empfangende Seite. Braucht keinen Tresorschlüssel
     und kein Konto – die Dokumentschlüssel stehen im Verweis, hinter dem
     Rautezeichen. Genau das ist der Punkt: Der Server gibt Chiffrat
     heraus und kann es selbst nicht lesen.

     Die Sätze zu entschlüsseln ist beide Male dieselbe Arbeit; woher sie
     kommen, ist der Unterschied. */
  function freigabeAbrufen(id, geheim, protokollieren) {
    let schluessel;
    try { schluessel = JSON.parse(dec.decode(ausBase64(geheim))); }
    catch (e) { return Promise.reject(new Error('Der Verweis ist unvollständig.')); }

    const entpacken = (saetze, stand) => Promise.all(schluessel.map((eintrag) => {
      const satz = saetze.find((x) => x.id === eintrag.id);
      if (!satz || !satz.inhalt) return null;
      return crypto.subtle.importKey('raw', ausBase64(eintrag.k), 'AES-GCM', false, ['decrypt'])
        .then((k) => Promise.all([
          entschluesseln(k, satz.inhaltIv, satz.inhalt),
          entschluesseln(k, satz.kopfIv, satz.kopf)
        ]))
        .then(([inhalt, kopf]) => {
          const kk = JSON.parse(dec.decode(kopf));
          return { id: satz.id, art: satz.art, name: kk.name, typ: kk.typ, bytes: inhalt, groesse: satz.groesse };
        })
        .catch(() => null);
    })).then((dokumente) => {
      const gueltige = dokumente.filter(Boolean);
      if (!gueltige.length) throw new Error('Die Unterlagen lassen sich mit diesem Verweis nicht entschlüsseln.');
      return { freigabe: stand, dokumente: gueltige };
    });

    /* Mit Server: Ablauf, Zähler und Widerruf setzt der Server durch,
       nicht dieser Browser. Ein Empfänger, der den Zähler in seinem
       eigenen Speicher hochzählt, zählt gar nichts. */
    if (TT.api && TT.api.da) {
      return TT.api.ruf('freigabe/abruf', { id }).then((d) => {
        const saetze = (d.dokumente || []).map(vomServer).filter(Boolean);
        const f = d.freigabe || {};
        return entpacken(saetze, {
          id: f.id,
          dokumente: f.dokumente || [],
          erstellt: new Date((f.erstellt || 0) * 1000).toISOString(),
          ablauf: new Date((f.ablauf || 0) * 1000).toISOString(),
          maxAbrufe: f.maxAbrufe,
          abrufe: (f.abrufe || []).map((a) => ({ zeit: new Date((a.zeit || 0) * 1000).toISOString() })),
          widerrufen: null
        });
      });
    }

    /* Ohne Server: alles wie bisher, auf diesem Gerät. */
    const m = meta();
    const f = (m && m.freigaben || []).find((x) => x.id === id);
    if (!f) return Promise.reject(new Error('Diesen Verweis gibt es nicht mehr.'));
    const status = freigabeStatus(f);
    if (!status.gueltig) return Promise.reject(new Error('Der Verweis ist ' + status.text + '.'));

    return tun('readonly', (s) => s.getAll()).then((alle) => {
      let stand = f;
      if (protokollieren !== false) {
        const m2 = meta();
        const f2 = (m2.freigaben || []).find((x) => x.id === id);
        if (f2) { f2.abrufe.push({ zeit: new Date().toISOString() }); metaSetzen(m2); stand = f2; }
      }
      return entpacken(alle, stand);
    });
  }

  /* ------------------------- Aufräumen ------------------------- */

  function allesLoeschen() {
    tresorSchluessel = null;
    metaZwischen = null;
    freigabenVomServer = null;
    try { localStorage.removeItem(META); } catch (e) { /* egal */ }
    const hier = tun('readwrite', (s) => s.clear()).catch(() => { });
    if (!amServer()) return hier;
    return hier
      .then(() => TT.api.ruf('tresor/leeren', {}))
      .then(() => TT.api.ruf('ablage/setzen', { felder: { tresorMeta: null } }))
      .catch(() => { });
  }

  TT.tresor = {
    ARTEN, HEIKEL, MAX_BYTES, OK_TYPEN, RUNDEN,
    verfuegbar, amServer, eingerichtet, istOffen, einrichten, entsperren, sperren, metaHolen,
    hinzufuegen, liste, loeschen, oeffnen,
    freigaben, freigabeStatus, freigabeErstellen, freigabeAbrufen,
    widerrufen, freigabeLoeschen, linkFuer, allesLoeschen
  };
})(window.TT = window.TT || {});
