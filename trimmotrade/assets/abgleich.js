/* =====================================================================
   TrimmoTrade – Abgleich mit dem Server

   Was jemand für sich festhält – Profil, Merkliste, Bewerbungstafel,
   Notizen, Suchaufträge, Umzugsplan, Übergabeprotokoll – lag bisher
   ausschließlich im Speicher des Browsers. Der Grund dafür war gut: Es
   geht niemanden etwas an.

   Der Grund trägt nur nicht weit genug. Wer die Wohnungssuche am
   Rechner beginnt und abends im Bus weitersucht, fand auf dem Telefon
   nichts wieder. Wer die Browserdaten löschte, verlor alles. Und weil
   Wohnungssuche aus Wochen des Wartens besteht, ist beides kein
   Randfall, sondern der Normalfall.

   Diese Datei hält beides zusammen, ohne die Trennlinie aufzugeben:

     · Der Browser bleibt der Ort, an dem gerechnet wird. Er schreibt
       weiter zuerst in seinen eigenen Speicher und arbeitet vollständig
       weiter, wenn der Server schweigt.
     · Der Server ist die Kopie, die den Gerätewechsel überlebt. Er
       bekommt JSON, gibt JSON zurück und wertet nichts davon aus.
     · Ohne Anmeldung geschieht hier gar nichts. Wer nur sucht,
       hinterlässt nach wie vor keine Spur.

   ZUM ZUSAMMENFÜHREN. Zwei Geräte, die dasselbe Feld verändern, sind
   ein Problem ohne schöne Lösung. Gewählt ist die Regel, die sich in
   einem Satz erklären lässt: Beim Start gewinnt der Server für jedes
   Feld, das hier seit dem letzten Abgleich nicht angefasst wurde – und
   der Browser für jedes, das er angefasst hat. Damit verliert niemand,
   was er gerade eingetragen hat, und das Telefon bekommt beim Öffnen
   den Stand vom Rechner.

   Was diese Regel nicht auflöst: zwei Geräte, die dasselbe Feld
   gleichzeitig ändern. Dann gewinnt, was zuletzt schreibt. Ein
   Abgleich Zeile für Zeile wäre möglich, würde die Anwendung aber
   ungleich komplizierter machen, als der Fall häufig ist – eine Person
   sucht selten von zwei Geräten gleichzeitig eine Wohnung.
   ===================================================================== */
(function (TT) {
  'use strict';

  /* Welche Felder mitgehen. Die Liste muss zu der in api/lib/ablage.php
     passen; was hier steht und dort nicht, weist der Server ab.

     Nicht dabei und mit Absicht: `theme` und `ansicht` – die gehören
     zum Gerät, nicht zur Person. Wer am Telefon dunkel liest, will das
     am Rechner nicht zwingend auch. Ebenso wenig der Tarif: Der kommt
     vom Server selbst und wäre hier eine zweite Wahrheit. */
  const FELDER = [
    'profil', 'merkliste', 'vergleich', 'agenten', 'threads', 'gesehen',
    'filter', 'einstellungen', 'umzug', 'protokoll', 'werkzeuge',
    'meinTausch', 'hinweise', 'eigeneInserate'
  ];

  /* Ein paar Schalter gehören sachlich zum Profil, stehen im Zustand
     aber daneben. Sie gehen unter `einstellungen` mit, damit nicht für
     jeden einzelnen ein eigenes Feld nötig ist. */
  const EINSTELLUNGEN = ['profilAngelegt', 'filterBeruehrt', 'einzugsdatum', 'betreiber'];

  /* `hinweise` heißt im Browser seit jeher `hinweiseGelesen`. Zwei
     Namen für dieselbe Sache sind unschön; die Alternative wäre, im
     Browser umzubenennen und damit jeden vorhandenen Stand zu
     verlieren. */
  const ANDERS = { hinweise: 'hinweiseGelesen' };
  const imBrowser = (feld) => ANDERS[feld] || feld;

  const WARTEN_MS = 1500;    // so lange nach der letzten Änderung sammeln

  let letzterStand = null;   // was zuletzt hinausging, je Feld als Text
  let uhr = null;
  let laeuft = false;        // gerade unterwegs
  let nochmal = false;       // während des Sendens kam etwas Neues
  let bereit = false;        // erst nach dem ersten Holen wird geschickt
  const zustand = { an: false, fehler: '', zuletzt: 0, belegt: 0 };

  const amServer = () => !!(TT.api && TT.api.da && TT.konto && TT.konto.angemeldet());

  /* ------------------------------------------------------------------
     Ein Feld aus dem Zustand lesen und hineinschreiben
     ------------------------------------------------------------------ */

  function holeFeld(s, feld) {
    if (feld === 'einstellungen') {
      const raus = {};
      EINSTELLUNGEN.forEach((k) => { raus[k] = s[k]; });
      return raus;
    }
    return s[imBrowser(feld)];
  }

  function setzeFeld(s, feld, wert) {
    if (feld === 'einstellungen') {
      if (!wert || typeof wert !== 'object') return;
      EINSTELLUNGEN.forEach((k) => { if (wert[k] !== undefined) s[k] = wert[k]; });
      return;
    }
    const name = imBrowser(feld);
    /* Die Art muss stimmen. Käme für die Merkliste eine Liste an,
       stürzte der erste Zugriff darauf ab – und ein weißer Bildschirm
       ist schlimmer als ein verlorenes Feld. */
    const istListe = Array.isArray(s[name]);
    if (istListe !== Array.isArray(wert)) return;
    if (wert !== null && typeof wert !== 'object' && typeof s[name] === 'object') return;
    s[name] = wert;
  }

  const alsText = (w) => {
    try { return JSON.stringify(w === undefined ? null : w); } catch (e) { return null; }
  };

  function standAufnehmen(s) {
    const raus = {};
    FELDER.forEach((f) => { raus[f] = alsText(holeFeld(s, f)); });
    return raus;
  }

  /* ------------------------------------------------------------------
     Holen

     Läuft einmal beim Start und nach jeder Anmeldung. Danach schreibt
     nur noch der Browser.
     ------------------------------------------------------------------ */

  function holen() {
    if (!amServer()) {
      bereit = false;
      zustand.an = false;
      return Promise.resolve(null);
    }

    const s = TT.store.get();
    /* Was hier seit dem letzten Abgleich verändert wurde, behält den
       Vorrang. Beim allerersten Holen gibt es keinen letzten Abgleich –
       dann gilt alles als unberührt und der Server gewinnt überall, wo
       er etwas hat. */
    const angefasst = {};
    if (letzterStand) {
      FELDER.forEach((f) => {
        angefasst[f] = alsText(holeFeld(s, f)) !== letzterStand[f];
      });
    }

    return TT.api.ruf('ablage').then((d) => {
      const vomServer = (d && d.ablage) || {};
      let uebernommen = 0;

      TT.store.update((st) => {
        FELDER.forEach((f) => {
          if (!Object.prototype.hasOwnProperty.call(vomServer, f)) return;
          if (angefasst[f]) return;
          setzeFeld(st, f, vomServer[f]);
          uebernommen++;
        });
      }, 'abgleich');

      /* Nach dem Übernehmen ist der Zustand hier der Maßstab. Alles,
         was der Server nicht hatte oder was hier neuer ist, geht beim
         nächsten Schreiben hinaus. */
      letzterStand = {};
      const jetzt = TT.store.get();
      FELDER.forEach((f) => {
        letzterStand[f] = Object.prototype.hasOwnProperty.call(vomServer, f) && !angefasst[f]
          ? alsText(holeFeld(jetzt, f))
          : null;   // null heißt: der Server kennt es noch nicht
      });

      bereit = true;
      zustand.an = true;
      zustand.fehler = '';
      zustand.zuletzt = Date.now();
      zustand.belegt = Number(d && d.belegt) || 0;

      /* Was der Server noch nicht hat, gleich nachreichen. */
      planen();
      return { uebernommen };
    }, (e) => {
      /* Ein Server, der schweigt, darf die Anwendung nicht anhalten.
         Sie läuft mit dem Stand aus diesem Browser weiter. */
      bereit = false;
      zustand.an = false;
      zustand.fehler = (e && e.text) || 'Der Abgleich ist gerade nicht möglich.';
      return null;
    });
  }

  /* ------------------------------------------------------------------
     Schreiben

     `store.speichern()` ruft `angestossen()` bei jeder Änderung. Was
     sich wirklich geändert hat, ergibt der Vergleich mit dem letzten
     Stand – so muss keine Aufrufstelle wissen, welches Feld sie
     angefasst hat.
     ------------------------------------------------------------------ */

  function angestossen() {
    if (!bereit || !amServer()) return;
    if (uhr) clearTimeout(uhr);
    uhr = setTimeout(schicken, WARTEN_MS);
  }

  function offeneFelder() {
    const s = TT.store.get();
    const raus = {};
    let etwas = false;
    FELDER.forEach((f) => {
      const jetzt = alsText(holeFeld(s, f));
      if (jetzt === null) return;
      if (letzterStand && jetzt === letzterStand[f]) return;
      raus[f] = JSON.parse(jetzt);
      etwas = true;
    });
    return etwas ? raus : null;
  }

  function schicken() {
    clearTimeout(uhr);
    uhr = null;
    if (!bereit || !amServer()) return Promise.resolve(null);
    if (laeuft) { nochmal = true; return Promise.resolve(null); }

    const felder = offeneFelder();
    if (!felder) return Promise.resolve(null);

    /* Der Stand wird vor dem Senden festgehalten, nicht danach: Wer
       während des Sendens weitertippt, soll beim nächsten Lauf genau
       diese Änderung noch einmal mitschicken. */
    const gesendet = {};
    Object.keys(felder).forEach((f) => { gesendet[f] = alsText(felder[f]); });

    laeuft = true;
    return TT.api.ruf('ablage/setzen', { felder }).then((d) => {
      laeuft = false;
      letzterStand = Object.assign({}, letzterStand, gesendet);
      zustand.an = true;
      zustand.fehler = '';
      zustand.zuletzt = Date.now();
      zustand.belegt = Number(d && d.belegt) || zustand.belegt;
      if (nochmal) { nochmal = false; planen(); }
      return d;
    }, (e) => {
      laeuft = false;
      zustand.an = false;
      zustand.fehler = (e && e.text) || 'Der Abgleich ist gerade nicht möglich.';
      /* Nicht als gesendet vermerken – beim nächsten Anlauf geht es
         noch einmal hinaus. Bei einer vollen Ablage (413) hilft
         Wiederholen allerdings nicht; dann bleibt es beim Hinweis. */
      if (e && e.status === 413) {
        letzterStand = Object.assign({}, letzterStand, gesendet);
      }
      return null;
    });
  }

  function planen() {
    if (uhr) clearTimeout(uhr);
    uhr = setTimeout(schicken, 120);
  }

  /* Beim Verlassen der Seite noch einmal – sonst ginge verloren, was in
     den letzten anderthalb Sekunden eingetragen wurde. `keepalive`
     sorgt dafür, dass die Anfrage den Seitenwechsel überlebt. */
  function beimVerlassen() {
    if (!bereit || !amServer() || laeuft) return;
    const felder = offeneFelder();
    if (!felder) return;
    try {
      const keks = document.cookie.match(/(?:^|;\s*)tt_schutz=([^;]*)/);
      fetch('/api/ablage/setzen', {
        method: 'POST',
        credentials: 'same-origin',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          'X-TT-Schutz': keks ? decodeURIComponent(keks[1]) : ''
        },
        body: JSON.stringify({ felder })
      });
    } catch (e) { /* Beim Schließen ist ein Fehler nicht mehr zu melden */ }
  }

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('pagehide', beimVerlassen);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') beimVerlassen();
    });
  }

  /* Nach dem Abmelden darf nichts mehr hinausgehen – und der nächste
     angemeldete Mensch an diesem Gerät soll seinen eigenen Stand holen,
     nicht den vorigen weiterschreiben. */
  function zuruecksetzen() {
    if (uhr) clearTimeout(uhr);
    uhr = null;
    letzterStand = null;
    bereit = false;
    laeuft = false;
    nochmal = false;
    zustand.an = false;
  }

  TT.abgleich = {
    FELDER, EINSTELLUNGEN,
    holen, angestossen, schicken, zuruecksetzen,
    get zustand() { return zustand; },
    get bereit() { return bereit; }
  };
})(window.TT = window.TT || {});
