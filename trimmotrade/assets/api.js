/* =====================================================================
   TrimmoTrade – die Verbindung zur Serverseite

   Diese Anwendung läuft in zwei Lagen, und sie soll in beiden ganz
   funktionieren:

   Mit Server (www.trimmotrade.de): Die Anmeldung ist echt. Der Code geht
   per Mail hinaus, die Signatur des Passkeys wird geprüft, Google und
   Microsoft antworten wirklich. Die Sitzung hängt an einem Cookie, das
   kein Skript lesen kann.

   Ohne Server (die Einzeldatei, eine Kopie auf dem Stick, file://): Die
   Anmeldung ist nachgebildet und sagt das an jeder Stelle. Nichts
   verlangt eine Verbindung, nichts bricht ab.

   Welche Lage vorliegt, entscheidet ein einziger Aufruf beim Start. Er
   hat eine kurze Frist: Eine Anwendung, die drei Sekunden vor einer
   weißen Seite wartet, weil ein Server nicht antwortet, ist schlechter
   als eine, die sofort da ist und die Anmeldung als nachgebildet
   kennzeichnet.

   Ein Wort zum Schutzmerkmal: Jede ändernde Anfrage trägt es im Kopf.
   Der Wert steht in einem Cookie, das Skripte lesen dürfen – anders als
   das Sitzungscookie, das ausdrücklich HttpOnly ist. Eine fremde Seite
   kann das Cookie nicht lesen und den Kopf nicht setzen; genau daran
   scheitert die untergeschobene Anfrage.
   ===================================================================== */
(function (TT) {
  'use strict';

  const FRIST_MS = 4000;
  const PROBE_MS = 2500;

  let zustand = {
    da: false,               // Antwortet ein Server?
    geprueft: false,
    verfahren: [],           // Was er anbietet: passkey, mail, google, microsoft
    rpId: '',
    konto: null,             // Wer angemeldet ist – vom Server, nicht aus dem Browser
    grund: '',               // Warum kein Server, falls keiner da ist
    /* Wie viele echte Inserate es gibt und ob daneben Beispiele gezeigt
       werden dürfen. Beides kommt vom Server, weil beides eine
       Entscheidung des Betriebs ist und keine des Browsers. */
    markt: { inserate: 0, beispiele: true, bilder: false }
  };

  const eigenerServer = () => location.protocol === 'http:' || location.protocol === 'https:';

  function keks(name) {
    const t = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return t ? decodeURIComponent(t[1]) : '';
  }

  /* Eine Anfrage mit Frist. `fetch` allein hat keine – ohne das hinge die
     Oberfläche an einem Server, der die Verbindung offen lässt. */
  function mitFrist(pfad, o, ms) {
    const steuerung = window.AbortController ? new AbortController() : null;
    if (steuerung) o.signal = steuerung.signal;
    const uhr = setTimeout(() => { if (steuerung) steuerung.abort(); }, ms);
    return fetch(pfad, o).finally(() => clearTimeout(uhr));
  }

  /**
   * Ruft einen Weg der Serverseite auf.
   * Ohne `daten` ein GET, mit `daten` ein POST mit JSON.
   * Lehnt mit einem Error ab, dessen `.text` die Meldung für den Nutzer
   * ist – die Oberfläche muss nie zwischen Netz- und Serverfehler
   * unterscheiden.
   */
  function ruf(weg, daten) {
    const o = {
      method: daten ? 'POST' : 'GET',
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    };
    if (daten) {
      o.headers['Content-Type'] = 'application/json';
      o.headers['X-TT-Schutz'] = keks('tt_schutz');
      o.body = JSON.stringify(daten);
    }
    return mitFrist('/api/' + weg, o, FRIST_MS).then((antwort) => {
      return antwort.json().catch(() => {
        throw fehlerAus('Der Server hat unerwartet geantwortet.', antwort.status);
      }).then((d) => {
        if (d && d.ok) return d;
        throw fehlerAus(
          (d && d.fehler) || 'Da ist etwas schiefgegangen.',
          antwort.status,
          d || {}
        );
      });
    }, () => {
      throw fehlerAus('Der Server ist gerade nicht erreichbar. Versuch es gleich noch einmal.', 0);
    });
  }

  function fehlerAus(text, status, mehr) {
    const e = new Error(text);
    e.text = text;
    e.status = status || 0;
    Object.keys(mehr || {}).forEach((k) => { if (k !== 'fehler' && k !== 'ok') e[k] = mehr[k]; });
    return e;
  }

  /* Bricht der Schutz weg – etwa weil das Cookie abgelaufen ist –, holt
     ein Aufruf von `status` ein neues und der Versuch läuft ein zweites
     Mal. Erst wenn auch der scheitert, sieht der Nutzer einen Fehler. */
  function rufMitNachfassen(weg, daten) {
    return ruf(weg, daten).catch((e) => {
      if (e.status !== 403 || !daten) throw e;
      return ruf('status').then(() => ruf(weg, daten));
    });
  }

  /* ------------------------- Der erste Aufruf ------------------------- */

  let bereitVersprechen = null;

  function pruefen() {
    if (bereitVersprechen) return bereitVersprechen;

    if (!eigenerServer()) {
      zustand.geprueft = true;
      zustand.grund = 'datei';
      bereitVersprechen = Promise.resolve(zustand);
      return bereitVersprechen;
    }

    bereitVersprechen = mitFrist('/api/status', {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    }, PROBE_MS)
      .then((a) => a.json().catch(() => null))
      .then((d) => {
        if (d && d.ok && d.eingerichtet) {
          zustand.da = true;
          zustand.verfahren = d.verfahren || [];
          zustand.rpId = d.rpId || '';
          zustand.konto = d.konto || null;
          if (d.markt) zustand.markt = d.markt;
        } else {
          /* Ein Server, der zwar da ist, aber keine Anmeldung anbietet –
             etwa weil config.php fehlt. Für die Anwendung ist das
             dasselbe wie kein Server, nur der Grund ist ein anderer. */
          zustand.grund = d && d.fehler ? 'unfertig' : 'keiner';
        }
        return zustand;
      })
      .catch(() => { zustand.grund = 'keiner'; return zustand; })
      .then((z) => { z.geprueft = true; return z; });

    return bereitVersprechen;
  }

  /* Nach jeder Anmeldung und Abmeldung: Was der Server sagt, gilt. */
  function kontoMerken(d) {
    zustand.konto = (d && d.konto) || null;
    return zustand.konto;
  }

  TT.api = {
    get da() { return zustand.da; },
    get geprueft() { return zustand.geprueft; },
    get verfahren() { return zustand.verfahren; },
    get konto() { return zustand.konto; },
    get markt() { return zustand.markt; },
    marktMerken: (m) => { if (m) zustand.markt = m; },
    get grund() { return zustand.grund; },
    kann: (v) => zustand.da && zustand.verfahren.indexOf(v) >= 0,
    pruefen, ruf: rufMitNachfassen, kontoMerken
  };
})(window.TT = window.TT || {});
