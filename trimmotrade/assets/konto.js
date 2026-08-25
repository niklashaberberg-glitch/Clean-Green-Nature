/* =====================================================================
   TrimmoTrade – Anmeldung und Konto

   Diese Datei bedient zwei Lagen mit derselben Oberfläche.

   MIT SERVER (www.trimmotrade.de). Alles echt: Der Einmalcode geht per
   Mail hinaus und wird serverseitig geprüft, die Signatur des Passkeys
   wird gegen den bei der Registrierung hinterlegten öffentlichen
   Schlüssel gerechnet, Google und Microsoft antworten wirklich. Die
   Sitzung hängt an einem Cookie, das kein Skript lesen kann.

   OHNE SERVER (die Einzeldatei, eine Kopie auf dem Stick, file://).
   Nachgebildet, und an jeder Stelle als nachgebildet gekennzeichnet. Der
   Passkey läuft auch hier wirklich – `navigator.credentials` spricht mit
   dem Betriebssystem, und der Schlüssel entsteht im Sicherheitschip. Was
   ohne Gegenseite fehlt, ist die Prüfung der Signatur; für die
   Vorführung genügt, dass das Gerät sie überhaupt erzeugt hat.

   Und eine Einordnung, die zur Sache gehört: Eine Anmeldepflicht hält
   keinen Betrüger auf. Ein Google-Konto ist in zwei Minuten angelegt.
   Was wirklich wirkt, ist die Stufe darüber – Gerätebindung, bestätigte
   Telefonnummer, geprüfter Ausweis – und dass man sieht, welche Stufe
   das Gegenüber hat. Deshalb gibt es hier STUFEN, und deshalb hängen die
   Kennzeichen an Inseraten daran.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util;
  const API = TT.api;

  const SPEICHER = 'trimmotrade.konto.v1';
  const CODE_GUELTIG_MIN = 10;
  const CODE_VERSUCHE = 5;
  const SPERRE_MIN = 15;

  const echt = () => API && API.da;

  /* ------------------------- Anbieter -------------------------

     Was im Betrieb je Anbieter zu hinterlegen ist, steht hier – nicht in
     einer Anleitung, die niemand findet. `einrichtung` erscheint in der
     Anwendung an der Stelle, an der jemand den Knopf drückt.

     Welche Knöpfe tatsächlich erscheinen, sagt der Server: Ein Verfahren
     ohne hinterlegte Zugangsdaten führt nur in eine Fehlermeldung und
     gehört gar nicht erst angezeigt. */

  const ANBIETER = [
    {
      id: 'passkey',
      name: 'Mit Passkey',
      unter: 'Face ID, Windows Hello oder Fingerabdruck',
      icon: 'schluessel',
      echt: true,
      empfohlen: true,
      farbe: '#1a5c37',
      stufe: 2,
      erklaerung: 'Der Schlüssel entsteht im Sicherheitschip deines Geräts und verlässt ihn nie. Er ist an '
        + 'trimmotrade.de gebunden: Eine nachgebaute Seite bekommt nichts, selbst wenn du darauf hereinfällst. '
        + 'Kein Passwort, nichts zum Abfischen, nichts zum Vergessen.',
      einrichtung: 'Läuft ohne fremden Dienst. Der Server prüft die Signatur gegen den bei der Registrierung '
        + 'hinterlegten öffentlichen Schlüssel (WebAuthn, Relying Party = die eigene Domain).'
    },
    {
      id: 'google',
      name: 'Weiter mit Google',
      unter: 'Google-Konto',
      icon: 'person',
      farbe: '#1a73e8',
      stufe: 2,
      erklaerung: 'TrimmoTrade erfährt von Google deinen Namen, deine E-Mail-Adresse und dass sie bestätigt ist. '
        + 'Kein Zugriff auf Kontakte, Kalender oder Dateien, und dein Google-Passwort bekommt TrimmoTrade nie zu '
        + 'sehen.',
      einrichtung: 'Google Cloud Console: OAuth-2.0-Client-ID (Typ „Web“), autorisierte Weiterleitungs-URI, '
        + 'Bereiche openid/email/profile. Der Server tauscht den Code gegen ein ID-Token und prüft Signatur, '
        + 'Aussteller, Zielgruppe und Nonce.'
    },
    {
      id: 'microsoft',
      name: 'Weiter mit Microsoft',
      unter: 'Privat oder geschäftlich',
      icon: 'person',
      farbe: '#0067b8',
      stufe: 2,
      erklaerung: 'TrimmoTrade erfährt Name und E-Mail-Adresse aus deinem Microsoft-Konto. Sonst nichts – kein '
        + 'Postfach, kein OneDrive.',
      einrichtung: 'Microsoft Entra ID: App-Registrierung, Weiterleitungs-URI, Bereiche openid/email/profile. '
        + 'Für private und geschäftliche Konten den Mandanten „common“ verwenden.'
    },
    {
      id: 'mail',
      echt: true,
      name: 'Mit E-Mail-Adresse',
      unter: 'Einmalcode statt Passwort',
      icon: 'nachricht',
      stufe: 1,
      erklaerung: 'Kein Passwort, das man vergessen oder wiederverwenden kann: Du bekommst einen sechsstelligen '
        + 'Code, der zehn Minuten gilt. Wer die Adresse nicht abrufen kann, kommt nicht hinein.',
      einrichtung: 'Nur ein Versanddienst nötig. Der Code wird serverseitig erzeugt, gehasht gespeichert und '
        + 'nach Ablauf oder fünf Fehlversuchen verworfen.'
    }
  ];

  const anbieter = (id) => ANBIETER.find((a) => a.id === id) || null;

  /* Welche Verfahren gerade zur Verfügung stehen. Ohne Server sind es
     alle – nachgebildet. Mit Server genau die, für die Zugangsdaten
     hinterlegt sind. */
  function verfuegbar() {
    if (!echt()) return ANBIETER.slice();
    return ANBIETER.filter((a) => API.verfahren.indexOf(a.id) >= 0);
  }

  /* ------------------------- Vertrauensstufen -------------------------

     Der eigentliche Schutz sitzt nicht in der Anmeldung, sondern hier:
     Wie viel ist über das Gegenüber bekannt, und sieht man es? */

  const STUFEN = [
    { n: 0, name: 'nicht bestätigt', kurz: 'offen', ton: 'schlecht',
      text: 'Es ist nichts geprüft. So ein Konto sollte nichts inserieren dürfen.' },
    { n: 1, name: 'E-Mail bestätigt', kurz: 'E-Mail', ton: 'warn',
      text: 'Die Adresse ist erreichbar. Das schließt Wegwerfadressen nicht aus.' },
    { n: 2, name: 'Gerät oder Anbieter bestätigt', kurz: 'Konto', ton: 'info',
      text: 'Passkey auf diesem Gerät oder ein bestätigtes Konto bei Google oder Microsoft. '
        + 'Massenhaftes Anlegen wird damit deutlich mühsamer.' },
    { n: 3, name: 'Telefonnummer bestätigt', kurz: 'Telefon', ton: 'gut',
      text: 'Eine Nummer je Konto. Der Punkt, an dem Betrug im großen Stil unwirtschaftlich wird.' },
    { n: 4, name: 'Ausweis geprüft', kurz: 'Ausweis', ton: 'gut',
      text: 'Für Inserierende der Maßstab. Prüfung über einen Dienst wie POSTIDENT oder eID – der Ausweis '
        + 'selbst wird dabei nicht gespeichert.' }
  ];

  const stufe = (n) => STUFEN[U.clamp(Math.round(n || 0), 0, STUFEN.length - 1)];

  /* ------------------------- Speicher -------------------------

     Ohne Server liegt das Konto im Browser, getrennt vom übrigen Stand:
     Wer sich abmeldet, soll seine Merkliste behalten, und wer die Daten
     löscht, nicht ungewollt ausgesperrt werden.

     Mit Server liegt es auf dem Server, und hier steht nur eine Kopie
     zur Anzeige. Die Kopie entscheidet nichts – bei jedem Start fragt
     die Anwendung nach, wer angemeldet ist. */

  function lesen() {
    try { return JSON.parse(localStorage.getItem(SPEICHER) || 'null'); } catch (e) { return null; }
  }

  function schreiben(k) {
    try {
      if (k) localStorage.setItem(SPEICHER, JSON.stringify(k));
      else localStorage.removeItem(SPEICHER);
      return true;
    } catch (e) { return false; }
  }

  let konto = null;

  function laden() {
    konto = echt() ? (API.konto || null) : lesen();
    return konto;
  }

  const aktuell = () => konto;
  const angemeldet = () => !!(konto && konto.id);

  /* ------------------------- Prüfungen ------------------------- */

  /* Bewusst keine der berüchtigten Riesenregeln: Sie schließen gültige
     Adressen aus und lassen ungültige durch. Geprüft wird die Form, den
     Rest erledigt der Code, der ankommen muss – oder eben nicht. */
  const mailForm = (m) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(String(m || '').trim());

  /* Wegwerfadressen sind kein Betrugsbeweis, aber ein Grund, die Stufe
     nicht anzuheben. Eine winzige Liste – vollständig wäre sie nie. */
  const WEGWERF = ['mailinator.com', 'trashmail.com', 'wegwerfmail.de', 'guerrillamail.com',
    '10minutemail.com', 'yopmail.com', 'temp-mail.org'];

  const istWegwerf = (m) => WEGWERF.indexOf(String(m).toLowerCase().split('@')[1] || '') >= 0;

  /* ------------------------- Werkzeug ------------------------- */

  const zufall = (n) => {
    const b = new Uint8Array(n);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(b);
    else for (let i = 0; i < n; i++) b[i] = Math.floor(Math.random() * 256);
    return b;
  };

  function b64(puffer) {
    const bytes = new Uint8Array(puffer);
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  const vonB64 = (s) => Uint8Array.from(
    atob(String(s).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)
  );

  const versprechen = (wert) => Promise.resolve(wert);
  const absage = (text) => Promise.reject(Object.assign(new Error(text), { text }));

  /* ------------------------- Einmalcode ------------------------- */

  /* Ohne Server läuft hier alles außer dem Versand wirklich: Der Code
     wird zufällig erzeugt, die Frist gilt, die Fehlversuche zählen. */

  let laufend = null;

  function codeAnfordern(mail, name) {
    const adresse = String(mail || '').trim().toLowerCase();
    if (!mailForm(adresse)) return absage('Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.');

    if (echt()) {
      return API.ruf('mail/code', { mail: adresse, name: String(name || '') })
        .then((d) => {
          laufend = { mail: adresse, vorgang: d.vorgang, bis: Date.now() + (d.gueltig || 10) * 60000 };
          return { gueltig: d.gueltig || CODE_GUELTIG_MIN, versuche: d.versuche || CODE_VERSUCHE, code: '' };
        });
    }

    const b = zufall(4);
    const zahl = ((b[0] << 16) | (b[1] << 8) | b[2]) % 1000000;
    laufend = {
      mail: adresse,
      name: String(name || ''),
      code: String(zahl).padStart(6, '0'),
      bis: Date.now() + CODE_GUELTIG_MIN * 60000,
      versuche: 0
    };
    return versprechen({ gueltig: CODE_GUELTIG_MIN, versuche: CODE_VERSUCHE, code: laufend.code });
  }

  function codeEinloesen(eingabe) {
    const c = laufend;
    if (!c) return absage('Es wurde kein Code angefordert.');
    const rein = String(eingabe || '').replace(/\s/g, '');

    if (echt()) {
      return API.ruf('mail/pruefen', { vorgang: c.vorgang, code: rein })
        .then((d) => { laufend = null; return uebernehmen(API.kontoMerken(d)); });
    }

    if (Date.now() > c.bis) { laufend = null; return absage('Der Code ist abgelaufen. Fordere einen neuen an.'); }
    c.versuche++;
    if (c.versuche > CODE_VERSUCHE) {
      laufend = null;
      return absage('Zu viele Fehlversuche. Fordere einen neuen Code an.');
    }
    if (rein !== c.code) {
      const uebrig = CODE_VERSUCHE - c.versuche + 1;
      return absage('Der Code stimmt nicht. Noch ' + uebrig + ' '
        + U.plural(uebrig, 'Versuch', 'Versuche') + '.');
    }
    const mail = c.mail, name = c.name;
    laufend = null;
    return versprechen(anmelden({ mail, name, anbieter: 'mail', mailBestaetigt: true }));
  }

  const codeStand = () => laufend;

  /* ------------------------- Passkey (WebAuthn) ------------------------- */

  /* Ein Passkey ist an eine Domain gebunden. Eine Datei auf der Platte
     hat keine – deshalb geht WebAuthn dort nicht, so sicher der Kontext
     sonst auch ist. Das vorher zu wissen ist besser, als den Nutzer in
     einen Dialog zu schicken, der mit einer Fehlermeldung endet. */
  const domaeneDa = () => location.protocol === 'http:' || location.protocol === 'https:';

  const passkeyMoeglich = () => !!(window.PublicKeyCredential && navigator.credentials
    && navigator.credentials.create) && domaeneDa();

  /** Warum nicht – für die Anzeige am gesperrten Knopf. */
  function passkeyGrund() {
    if (!(window.PublicKeyCredential && navigator.credentials && navigator.credentials.create)) {
      return 'Dieser Browser kann keine Passkeys';
    }
    if (!domaeneDa()) {
      return 'Geht nur im Web – ein Passkey braucht eine Domain, eine Datei auf der Platte hat keine';
    }
    return '';
  }

  function passkeyPlattform() {
    if (!passkeyMoeglich() || !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      return Promise.resolve(false);
    }
    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(() => false);
  }

  /* Die vom Server gelieferten Vorgaben tragen Zufallswerte als Text;
     der Browser will sie als Bytes. Diese Übersetzung – und nur sie –
     macht den Unterschied zwischen einer Anmeldung, die geht, und einer,
     die mit einer unverständlichen Fehlermeldung abbricht. */
  function optionenAufbereiten(o) {
    const p = Object.assign({}, o);
    p.challenge = vonB64(o.challenge);
    if (o.user) p.user = Object.assign({}, o.user, { id: vonB64(o.user.id) });
    ['excludeCredentials', 'allowCredentials'].forEach((feld) => {
      if (o[feld] && o[feld].length) {
        p[feld] = o[feld].map((c) => Object.assign({}, c, { id: vonB64(c.id) }));
      } else {
        delete p[feld];
      }
    });
    return p;
  }

  const antwortNeu = (c) => ({
    clientDataJSON: b64(c.response.clientDataJSON),
    attestationObject: b64(c.response.attestationObject)
  });

  const antwortAnmeldung = (c) => ({
    clientDataJSON: b64(c.response.clientDataJSON),
    authenticatorData: b64(c.response.authenticatorData),
    signature: b64(c.response.signature),
    userHandle: c.response.userHandle ? b64(c.response.userHandle) : null
  });

  /** Passkey anlegen – und damit anmelden, falls noch nicht angemeldet. */
  function passkeyAnlegen(name, mail) {
    if (!passkeyMoeglich()) return absage('Dieser Browser kann keine Passkeys.');

    if (echt()) {
      return API.ruf('passkey/neu/start', { name: name || '', mail: mail || '' })
        .then((d) => navigator.credentials.create({ publicKey: optionenAufbereiten(d.optionen) })
          .then((c) => {
            if (!c) throw new Error('Es wurde kein Passkey erstellt.');
            return API.ruf('passkey/neu/fertig', { vorgang: d.vorgang, antwort: antwortNeu(c) });
          }))
        .then((d) => uebernehmen(API.kontoMerken(d)))
        .catch(fehlerText);
    }

    return navigator.credentials.create({
      publicKey: {
        /* Ohne Server kommt die Aufforderung aus dem Browser. Für den
           Ablauf ist das richtig, für die Prüfung wertlos – genau das ist
           der Grund, warum WebAuthn ohne Gegenseite nicht vollständig
           ist. Mit Server stellt ihn der Server und prüft die Antwort. */
        challenge: zufall(32),
        rp: { name: 'TrimmoTrade' },
        user: { id: zufall(16), name: mail || name || 'trimmotrade', displayName: name || 'TrimmoTrade-Konto' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          residentKey: 'preferred',
          userVerification: 'required'
        },
        timeout: 60000,
        attestation: 'none'
      }
    }).then((c) => {
      if (!c) throw new Error('Es wurde kein Passkey erstellt.');
      const p = { id: c.id, geraet: geraet(), angelegt: U.isoDate(TT.now()), gesehen: U.isoDate(TT.now()) };
      const vorher = aktuell();
      return vorher && vorher.id
        ? aendern({ passkeys: (vorher.passkeys || []).concat([p]) })
        : anmelden({ anbieter: 'passkey', name: name || '', mail: mail || '', passkeys: [p] });
    }, fehlerText);
  }

  /** Anmeldung mit einem vorhandenen Passkey. */
  function passkeyAnmelden() {
    if (!passkeyMoeglich()) return absage('Dieser Browser kann keine Passkeys.');

    if (echt()) {
      return API.ruf('passkey/anmelden/start', {})
        .then((d) => navigator.credentials.get({ publicKey: optionenAufbereiten(d.optionen) })
          .then((c) => {
            if (!c) throw new Error('Die Anmeldung wurde abgebrochen.');
            return API.ruf('passkey/anmelden/fertig', {
              vorgang: d.vorgang, id: b64(c.rawId), antwort: antwortAnmeldung(c)
            });
          }))
        .then((d) => uebernehmen(API.kontoMerken(d)))
        .catch(fehlerText);
    }

    const k = aktuell();
    const opt = { challenge: zufall(32), timeout: 60000, userVerification: 'required' };
    const erste = k && k.passkeys && k.passkeys[0];
    if (erste && erste.id) {
      try { opt.allowCredentials = [{ type: 'public-key', id: vonB64(erste.id) }]; } catch (e) { /* egal */ }
    }
    return navigator.credentials.get({ publicKey: opt }).then((c) => {
      if (!c) throw new Error('Die Anmeldung wurde abgebrochen.');
      return k && k.id ? anmelden({}) : anmelden({ anbieter: 'passkey', passkeys: [
        { id: c.id, geraet: geraet(), angelegt: U.isoDate(TT.now()), gesehen: U.isoDate(TT.now()) }
      ] });
    }, fehlerText);
  }

  function passkeyLoeschen(id) {
    if (echt()) {
      return API.ruf('passkey/loeschen', { id }).then((d) => uebernehmen(API.kontoMerken(d)));
    }
    const k = aktuell();
    if (!k) return absage('Nicht angemeldet.');
    const rest = (k.passkeys || []).filter((p) => p.id !== id);
    if (!rest.length && !k.mailBestaetigt) {
      return absage('Das ist dein einziger Zugang. Hinterlege erst eine bestätigte E-Mail-Adresse, '
        + 'sonst kommst du nicht mehr in dein Konto.');
    }
    return versprechen(aendern({ passkeys: rest }));
  }

  /* Aus dem Abbruch am Gerät wird sonst eine Fehlermeldung, die niemand
     versteht. `NotAllowedError` heißt fast immer: Der Nutzer hat den
     Dialog weggeklickt oder die Frist ist abgelaufen. */
  function fehlerText(e) {
    const name = e && e.name;
    let text = (e && (e.text || e.message)) || 'Hat nicht geklappt.';
    if (name === 'NotAllowedError') text = 'Die Anmeldung wurde abgebrochen oder ist abgelaufen.';
    else if (name === 'InvalidStateError') text = 'Auf diesem Gerät liegt schon ein Passkey für dieses Konto.';
    else if (name === 'SecurityError') {
      text = domaeneDa()
        ? 'Passkeys brauchen eine gesicherte Verbindung (https).'
        : 'Ein Passkey ist an eine Domain gebunden. Diese Kopie läuft als Datei auf der Platte und hat '
          + 'keine – öffne die Anwendung unter trimmotrade.de, dann geht es.';
    }
    else if (name === 'AbortError') text = 'Der Vorgang wurde abgebrochen.';
    throw Object.assign(new Error(text), { text, name });
  }

  function geraet() {
    const u = navigator.userAgent || '';
    if (/iPhone/i.test(u)) return 'iPhone';
    if (/iPad/i.test(u)) return 'iPad';
    if (/Android/i.test(u)) return 'Android';
    if (/Windows/i.test(u)) return 'Windows';
    if (/Macintosh/i.test(u)) return 'Mac';
    return 'dieses Gerät';
  }

  /* ------------------------- Google und Microsoft ------------------------- */

  /* Mit Server verlässt der Browser die Seite und kommt angemeldet
     zurück. Das ist bei OAuth so vorgesehen und lässt sich nicht mit
     einem Hintergrundaufruf nachbilden – wer es doch tut, hat es falsch
     gebaut, denn dann liefe das Geheimnis durch den Browser. */
  function anbieterStarten(id, weiter) {
    if (!echt()) return false;
    const ziel = '/api/oauth/los?anbieter=' + encodeURIComponent(id)
      + (weiter ? '&weiter=' + encodeURIComponent(weiter) : '');
    location.href = ziel;
    return true;
  }

  /* ------------------------- Konto ------------------------- */

  function stufeBerechnen(k) {
    let n = 0;
    if (k.mailBestaetigt) n = 1;
    if ((k.passkeys && k.passkeys.length) || (k.anbieter && k.anbieter !== 'mail')) n = 2;
    if (k.telefonBestaetigt) n = 3;
    if (k.ausweisGeprueft) n = 4;
    /* Eine Wegwerfadresse hebt die Stufe nicht über eins – auch dann
       nicht, wenn ein Passkey daran hängt. */
    if (k.mail && istWegwerf(k.mail) && !k.telefonBestaetigt) n = Math.min(n, 1);
    return n;
  }

  /* Was der Server sagt, gilt. Die Kopie im Browser ist nur für die
     Anzeige und wird nicht befragt. */
  function uebernehmen(serverKonto) {
    const vorher = konto && konto.id;
    konto = serverKonto;
    if ((konto && konto.id) !== vorher) wecken();
    melden(serverKonto ? 'anmeldung' : 'abmeldung');
    return konto;
  }

  function anmelden(daten) {
    const vorher = aktuell();
    const k = Object.assign({
      id: (vorher && vorher.id) || 'k-' + b64(zufall(9)),
      angelegt: (vorher && vorher.angelegt) || U.isoDate(TT.now()),
      name: '', mail: '', anbieter: 'mail',
      mailBestaetigt: false, telefon: '', telefonBestaetigt: false,
      ausweisGeprueft: false, passkeys: [],
      agbStand: '', letzteAnmeldung: ''
    }, vorher || {}, daten);
    k.letzteAnmeldung = new Date().toISOString();
    k.stufe = stufeBerechnen(k);
    konto = k;
    schreiben(k);
    melden('anmeldung');
    return k;
  }

  function aendern(daten) {
    if (!angemeldet()) return null;
    const k = Object.assign({}, konto, daten);
    k.stufe = stufeBerechnen(k);
    konto = k;
    if (!echt()) schreiben(k);
    melden('konto');
    return k;
  }

  /** Angaben ändern. Eine neue Adresse gilt erst nach Bestätigung –
      sonst ließe sich ein Konto auf eine fremde Adresse umschreiben. */
  function angabenSpeichern(daten) {
    const k = aktuell();
    if (!k) return absage('Nicht angemeldet.');
    const mail = String(daten.mail || '').trim().toLowerCase();
    if (mail && !mailForm(mail)) return absage('Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.');

    if (echt()) {
      return API.ruf('konto', { name: daten.name || '', mail })
        .then((d) => ({ konto: uebernehmen(API.kontoMerken(d)), bestaetigen: !!d.bestaetigen }));
    }
    const geaendert = mail !== (k.mail || '');
    return versprechen({
      konto: aendern({
        name: daten.name || '', mail,
        mailBestaetigt: geaendert ? false : k.mailBestaetigt
      }),
      bestaetigen: geaendert && !!mail
    });
  }

  /* Wurde in einem anderen Fenster desselben Browsers an- oder
     abgemeldet, stimmt die Kopie hier nicht mehr. Der Server weiß es –
     also fragen, statt zu raten. */
  function auffrischen() {
    if (!echt()) { konto = lesen(); melden('konto'); return versprechen(konto); }
    return API.ruf('konto')
      .then((d) => uebernehmen(API.kontoMerken(d)))
      .catch(() => konto);
  }

  /* Ein Kritzel im gemeinsamen Speicher weckt die anderen Fenster. Der
     Inhalt ist gleichgültig – es zählt nur, dass sich etwas geändert
     hat; was, holen sie sich beim Server. */
  function wecken() {
    try { localStorage.setItem('trimmotrade.sitzung.v1', String(Date.now())); } catch (e) { /* egal */ }
  }

  function abmelden(alle) {
    if (echt()) {
      return API.ruf('abmelden', { alle: !!alle })
        .then(() => { API.kontoMerken(null); laufend = null; return uebernehmen(null); })
        /* Auch wenn der Server nicht antwortet: In diesem Browser gilt
           man ab jetzt als abgemeldet. Alles andere wäre für den Nutzer
           unverständlich – er hat auf „Abmelden“ gedrückt. */
        .catch(() => { API.kontoMerken(null); laufend = null; return uebernehmen(null); });
    }
    konto = null;
    schreiben(null);
    laufend = null;
    melden('abmeldung');
    return versprechen(null);
  }

  /* Konto vollständig löschen – Art. 17 DSGVO. Der übrige Stand bleibt
     davon unberührt; wer sein Konto löscht, will nicht zwingend seine
     Merkliste verlieren. Beides zusammen geht über „Meine Daten“. */
  function loeschen() {
    if (echt()) {
      return API.ruf('konto/loeschen', {})
        .then(() => { API.kontoMerken(null); return uebernehmen(null); });
    }
    return abmelden();
  }

  /* ------------------------- Beobachter ------------------------- */

  const hoerer = [];
  const on = (fn) => hoerer.push(fn);
  const melden = (grund) => hoerer.forEach((fn) => fn(konto, grund));

  /* ------------------------- Anzeige ------------------------- */

  function anzeigeName() {
    const k = aktuell();
    if (!k) return '';
    if (k.name) return k.name;
    if (k.mail) return k.mail.split('@')[0];
    return 'Konto';
  }

  const passkeys = () => (aktuell() && aktuell().passkeys) || [];

  TT.konto = {
    ANBIETER, STUFEN, CODE_GUELTIG_MIN, CODE_VERSUCHE, SPERRE_MIN,
    anbieter, verfuegbar, stufe, stufeBerechnen, echt,
    laden, aktuell, angemeldet, anmelden, aendern, angabenSpeichern,
    abmelden, loeschen, on,
    mailForm, istWegwerf, anzeigeName, passkeys,
    auffrischen, codeAnfordern, codeEinloesen, codeStand,
    passkeyMoeglich, passkeyGrund, passkeyPlattform, passkeyAnlegen, passkeyAnmelden, passkeyLoeschen,
    anbieterStarten
  };
})(window.TT = window.TT || {});
