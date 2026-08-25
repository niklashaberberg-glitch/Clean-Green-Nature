/* =====================================================================
   TrimmoTrade – Anmeldung und Konto

   Was hier echt ist und was nicht, gehört an den Anfang:

   ECHT ist der Passkey. `navigator.credentials` spricht mit dem
   Betriebssystem, und Face ID, Windows Hello oder der Fingerabdruck
   laufen wirklich – der Schlüssel entsteht im Sicherheitschip des Geräts
   und verlässt ihn nie. Das ist zugleich das einzige Verfahren hier, das
   gegen die häufigste Betrugsform überhaupt schützt: Wer sich eine
   TrimmoTrade-Seite nachbaut und Zugangsdaten abfischt, bekommt mit einem
   Passkey nichts, weil der Schlüssel an die Domain gebunden ist.

   ECHT ist auch die Prüfung der Eingaben, der Einmalcode als Verfahren,
   die Ablauffrist, die Sperre nach zu vielen Fehlversuchen und die
   Vertrauensstufen.

   NICHT ECHT sein kann ohne Server: das Versenden der Bestätigungsmail
   (es gibt niemanden, der sie verschickt – der Code steht deshalb in
   dieser Vorführung auf dem Bildschirm) und der Rückkanal zu Google,
   Microsoft und Apple. Deren Verfahren braucht zwingend eine Serverseite,
   die das Geheimnis hält und das zurückgegebene Token prüft; ein reiner
   Browser kann das nicht, und wer behauptet, er könne es, hat es falsch
   gebaut. Was diese Anwendung deshalb tut: den Ablauf vollständig
   nachbilden, an jeder Stelle sagen, dass er nachgebildet ist, und in
   ANBIETER genau aufschreiben, was im Betrieb einzutragen ist.

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

  const SPEICHER = 'trimmotrade.konto.v1';
  const CODE_GUELTIG_MIN = 10;
  const CODE_VERSUCHE = 5;
  const SPERRE_MIN = 15;

  /* ------------------------- Anbieter -------------------------

     Was im Betrieb je Anbieter zu hinterlegen ist, steht hier – nicht in
     einer Anleitung, die niemand findet. `einrichtung` erscheint in der
     Anwendung an der Stelle, an der jemand den Knopf drückt. */

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
      einrichtung: 'Läuft ohne fremden Dienst. Im Betrieb prüft der Server die Signatur gegen den bei der '
        + 'Registrierung hinterlegten öffentlichen Schlüssel (WebAuthn, Relying Party = die eigene Domain).'
    },
    {
      id: 'google',
      nachbau: 'nachgebildet',
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
      nachbau: 'nachgebildet',
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
      id: 'apple',
      nachbau: 'nachgebildet',
      name: 'Weiter mit Apple',
      unter: 'Mit „E-Mail verbergen“',
      icon: 'person',
      farbe: '#111111',
      stufe: 2,
      erklaerung: 'Apple erlaubt es, die eigene Adresse zu verbergen: TrimmoTrade bekommt dann eine '
        + 'Weiterleitungsadresse statt deiner echten. Das funktioniert hier genauso – die Anwendung merkt den '
        + 'Unterschied nicht, und das ist der Sinn.',
      einrichtung: 'Apple Developer: Services-ID, Domain und Return-URL verifizieren, Schlüssel für das '
        + 'Client-Geheimnis erzeugen (JWT, alle sechs Monate zu erneuern). Achtung: Apple sendet Name und '
        + 'E-Mail nur beim allerersten Mal.'
    },
    {
      id: 'mail',
      /* Code, Frist und Fehlversuchszähler laufen wirklich – nur den
         Versand kann ein Browser nicht leisten. */
      echt: true,
      nachbau: 'Versand nachgebildet',
      name: 'Mit E-Mail-Adresse',
      unter: 'Einmalcode statt Passwort',
      icon: 'nachricht',
      stufe: 1,
      erklaerung: 'Kein Passwort, das man vergessen oder wiederverwenden kann: Du bekommst einen sechsstelligen '
        + 'Code, der zehn Minuten gilt. Wer die Adresse nicht abrufen kann, kommt nicht hinein.',
      einrichtung: 'Nur ein Versanddienst nötig. Der Code gehört serverseitig erzeugt, gehasht gespeichert und '
        + 'nach Ablauf oder fünf Fehlversuchen verworfen.'
    }
  ];

  const anbieter = (id) => ANBIETER.find((a) => a.id === id) || null;

  /* ------------------------- Vertrauensstufen -------------------------

     Der eigentliche Schutz sitzt nicht in der Anmeldung, sondern hier:
     Wie viel ist über das Gegenüber bekannt, und sieht man es? */

  const STUFEN = [
    { n: 0, name: 'nicht bestätigt', kurz: 'offen', ton: 'schlecht',
      text: 'Es ist nichts geprüft. So ein Konto sollte nichts inserieren dürfen.' },
    { n: 1, name: 'E-Mail bestätigt', kurz: 'E-Mail', ton: 'warn',
      text: 'Die Adresse ist erreichbar. Das schließt Wegwerfadressen nicht aus.' },
    { n: 2, name: 'Gerät oder Anbieter bestätigt', kurz: 'Konto', ton: 'info',
      text: 'Passkey auf diesem Gerät oder ein bestätigtes Konto bei Google, Microsoft oder Apple. '
        + 'Massenhaftes Anlegen wird damit deutlich mühsamer.' },
    { n: 3, name: 'Telefonnummer bestätigt', kurz: 'Telefon', ton: 'gut',
      text: 'Eine Nummer je Konto. Der Punkt, an dem Betrug im großen Stil unwirtschaftlich wird.' },
    { n: 4, name: 'Ausweis geprüft', kurz: 'Ausweis', ton: 'gut',
      text: 'Für Inserierende der Maßstab. Prüfung über einen Dienst wie POSTIDENT oder eID – der Ausweis '
        + 'selbst wird dabei nicht gespeichert.' }
  ];

  const stufe = (n) => STUFEN[U.clamp(Math.round(n || 0), 0, STUFEN.length - 1)];

  /* ------------------------- Speicher ------------------------- */

  /* Das Konto liegt getrennt vom übrigen Stand: Wer sich abmeldet, soll
     seine Merkliste behalten, und wer die Daten löscht, nicht ungewollt
     ausgesperrt werden. */
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
    konto = lesen();
    return konto;
  }

  const aktuell = () => konto || (konto = lesen());
  const angemeldet = () => !!(aktuell() && aktuell().id);

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

  /* ------------------------- Einmalcode ------------------------- */

  let laufenderCode = null;

  function codeErzeugen(mail) {
    const bytes = new Uint8Array(4);
    (window.crypto || {}).getRandomValues
      ? crypto.getRandomValues(bytes)
      : bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
    const zahl = ((bytes[0] << 16) | (bytes[1] << 8) | bytes[2]) % 1000000;
    laufenderCode = {
      mail: String(mail).trim().toLowerCase(),
      code: String(zahl).padStart(6, '0'),
      bis: Date.now() + CODE_GUELTIG_MIN * 60000,
      versuche: 0
    };
    return laufenderCode;
  }

  function codePruefen(eingabe) {
    const c = laufenderCode;
    if (!c) return { ok: false, grund: 'Es wurde kein Code angefordert.' };
    if (Date.now() > c.bis) { laufenderCode = null; return { ok: false, grund: 'Der Code ist abgelaufen. Fordere einen neuen an.' }; }
    c.versuche++;
    if (c.versuche > CODE_VERSUCHE) {
      laufenderCode = null;
      return { ok: false, grund: 'Zu viele Fehlversuche. Fordere einen neuen Code an.' };
    }
    if (String(eingabe).replace(/\s/g, '') !== c.code) {
      return { ok: false, grund: 'Der Code stimmt nicht. Noch ' + (CODE_VERSUCHE - c.versuche + 1)
        + ' ' + U.plural(CODE_VERSUCHE - c.versuche + 1, 'Versuch', 'Versuche') + '.' };
    }
    return { ok: true, mail: c.mail };
  }

  const codeStand = () => laufenderCode;

  /* ------------------------- Passkey (WebAuthn) -------------------------

     Der einzige Teil, der ohne Server wirklich läuft. Ohne Serverseite
     lässt sich die Signatur nicht prüfen – für die Vorführung genügt,
     dass das Gerät sie überhaupt erzeugt hat: Genau das ist der Beweis,
     dass Betriebssystem und Sicherheitschip mitgespielt haben. */

  const passkeyMoeglich = () => !!(window.PublicKeyCredential && navigator.credentials
    && navigator.credentials.create);

  function passkeyPlattform() {
    if (!passkeyMoeglich() || !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      return Promise.resolve(false);
    }
    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(() => false);
  }

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

  function passkeyAnlegen(name) {
    if (!passkeyMoeglich()) return Promise.reject(new Error('Dieser Browser kann keine Passkeys.'));
    const nutzerId = zufall(16);
    return navigator.credentials.create({
      publicKey: {
        /* Im Betrieb kommt die Aufforderung vom Server und wird dort
           gegen die Antwort geprüft. Eine im Browser erzeugte ist für den
           Ablauf richtig, für die Prüfung wertlos – das ist der Grund,
           warum WebAuthn ohne Server nicht vollständig ist. */
        challenge: zufall(32),
        rp: { name: 'TrimmoTrade' },
        user: { id: nutzerId, name: name || 'trimmotrade', displayName: name || 'TrimmoTrade-Konto' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          residentKey: 'preferred',
          userVerification: 'required'
        },
        timeout: 60000,
        attestation: 'none'
      }
    }).then((cred) => {
      if (!cred) throw new Error('Es wurde kein Passkey erstellt.');
      return { id: cred.id, roh: b64(cred.rawId), angelegt: new Date().toISOString() };
    });
  }

  function passkeyPruefen(passkey) {
    if (!passkeyMoeglich()) return Promise.reject(new Error('Dieser Browser kann keine Passkeys.'));
    const opt = {
      challenge: zufall(32),
      timeout: 60000,
      userVerification: 'required'
    };
    /* Ohne hinterlegten Schlüssel darf der Browser selbst wählen –
       genau das macht die Anmeldung ohne Eingabe möglich. */
    if (passkey && passkey.roh) {
      const roh = Uint8Array.from(atob(passkey.roh.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
      opt.allowCredentials = [{ type: 'public-key', id: roh }];
    }
    return navigator.credentials.get({ publicKey: opt }).then((cred) => {
      if (!cred) throw new Error('Die Anmeldung wurde abgebrochen.');
      return { id: cred.id };
    });
  }

  /* ------------------------- Anmelden ------------------------- */

  function stufeBerechnen(k) {
    let n = 0;
    if (k.mailBestaetigt) n = 1;
    if (k.passkey || (k.anbieter && k.anbieter !== 'mail')) n = 2;
    if (k.telefonBestaetigt) n = 3;
    if (k.ausweisGeprueft) n = 4;
    /* Eine Wegwerfadresse hebt die Stufe nicht über eins – auch dann
       nicht, wenn ein Passkey daran hängt. */
    if (k.mail && istWegwerf(k.mail) && !k.telefonBestaetigt) n = Math.min(n, 1);
    return n;
  }

  function anmelden(daten) {
    const vorher = aktuell();
    const k = Object.assign({
      id: (vorher && vorher.id) || 'k-' + b64(zufall(9)),
      angelegt: (vorher && vorher.angelegt) || U.isoDate(TT.now()),
      name: '', mail: '', anbieter: 'mail',
      mailBestaetigt: false, telefon: '', telefonBestaetigt: false,
      ausweisGeprueft: false, passkey: null,
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
    schreiben(k);
    melden('konto');
    return k;
  }

  function abmelden() {
    konto = null;
    schreiben(null);
    laufenderCode = null;
    melden('abmeldung');
  }

  /* Konto vollständig löschen – Art. 17 DSGVO. Der übrige Stand bleibt
     davon unberührt; wer sein Konto löscht, will nicht zwingend seine
     Merkliste verlieren. Beides zusammen geht über „Meine Daten“. */
  function loeschen() {
    abmelden();
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

  TT.konto = {
    ANBIETER, STUFEN, CODE_GUELTIG_MIN, CODE_VERSUCHE, SPERRE_MIN,
    anbieter, stufe, stufeBerechnen,
    laden, aktuell, angemeldet, anmelden, aendern, abmelden, loeschen, on,
    mailForm, istWegwerf, anzeigeName,
    codeErzeugen, codePruefen, codeStand,
    passkeyMoeglich, passkeyPlattform, passkeyAnlegen, passkeyPruefen
  };
})(window.TT = window.TT || {});
