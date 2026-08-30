/* =====================================================================
   TrimmoTrade – der echte Markt

   Bis hierhin kannte die Anwendung 275 Wohnungen, die sie selbst
   erzeugt: aus einer festen Zufallsfolge, immer dieselben, überall
   gleich. Das war richtig, solange es niemanden gab, der inseriert –
   eine leere Suche ist keine Anwendung, an der sich etwas ausprobieren
   lässt.

   Sobald aber ein Server antwortet und echte Inserate darauf liegen,
   kehrt sich das um. Dann sind die erzeugten Wohnungen nicht mehr
   Anschauung, sondern Behauptung: Wer eine davon anschreibt, schreibt
   ins Leere. Nach § 5 Abs. 1 UWG ist eine Angebotsangabe, die es nicht
   gibt, irreführend – und noch bevor irgendein Gericht das feststellt,
   hat der erste enttäuschte Suchende es allen erzählt.

   Deshalb gilt hier eine klare Reihenfolge:

     1. Echte Inserate stehen immer zuerst.
     2. Beispiele erscheinen nur, solange der Betrieb sie zulässt, und
        tragen sichtbar das Wort „Beispiel“.
     3. Über der Trefferliste steht ein Hinweis, solange Beispiele
        dabei sind. Er lässt sich nicht wegklicken.
     4. Schaltet der Betrieb sie ab, verschwinden sie vollständig – auch
        aus der Karte, dem Ringtausch und jeder Auswertung.

   Ohne Server bleibt alles wie bisher: die Anwendung läuft als
   Vorführung, mit Beispielen, und sagt das an jeder Stelle.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util;
  const G = TT.geo;

  let zustand = {
    geladen: false,
    echte: 0,        // wie viele echte Inserate es insgesamt gibt
    geholt: 0,       // wie viele davon hier liegen
    beispiele: true, // dürfen Beispiele gezeigt werden?
    fehler: ''
  };

  const horcher = [];
  const melden = () => horcher.forEach((f) => { try { f(zustand); } catch (e) { /* ein Horcher darf den nächsten nicht mitreißen */ } });

  /* ------------------------------------------------------------------
     Ein Inserat vom Server in die Form bringen, die der Rest der
     Anwendung kennt. Der Server schickt bewusst nicht alles: Was sich
     ausrechnen lässt, rechnet der Browser – die Vergleichsmiete etwa
     hängt an derselben Tabelle, die auch die Suche benutzt, und sie
     zweimal zu pflegen hieße, sie auseinanderlaufen zu lassen.
     ------------------------------------------------------------------ */
  function einpassen(l) {
    if (!l || !l.id) return null;
    l.echt = true;
    l.beispiel = false;

    /* Bilder: Der Server liefert Verweise, die Anwendung erwartet die
       Form, in der auch selbst hochgeladene Bilder vorliegen. */
    if (Array.isArray(l.bilder)) {
      l.bilder = l.bilder.map((b) => (b && b.url
        ? { id: b.id, datei: b.url, klein: b.klein, breite: b.breite, hoehe: b.hoehe, text: b.text || '' }
        : b));
    } else {
      l.bilder = [];
    }

    if (!Array.isArray(l.besichtigungen)) l.besichtigungen = [];
    if (!Array.isArray(l.quirks)) l.quirks = [];

    /* Die ortsübliche Vergleichsmiete. Ohne sie fehlt der Prüfhinweis
       zur Mietpreisbremse – und der ist der Grund, warum jemand hier
       sucht statt anderswo. */
    if (l.kind !== 'kauf' && l.viertelKey && G.districtByKey[l.viertelKey]) {
      l.vergleichsmiete = G.vergleichsmiete(l.viertelKey, l.flaeche || 1, l.baujahr || 1970, !!l.saniert);
    }
    if (!l.stats) l.stats = { aufrufe: 0, bewerber: 0, online: l.erstellt || '' };
    return l;
  }

  /* ------------------------------------------------------------------
     Einmischen und Aussortieren
     ------------------------------------------------------------------ */

  function einmischen(inserate) {
    const liste = TT.data.listings;
    const byId = TT.data.byId;

    /* Was schon da ist, wird ersetzt statt verdoppelt: Ein zweiter
       Aufruf derselben Suche darf keine Zwillinge erzeugen. */
    inserate.forEach((roh) => {
      const l = einpassen(roh);
      if (!l) return;
      const alt = byId[l.id];
      byId[l.id] = l;
      const stelle = alt ? liste.indexOf(alt) : -1;
      if (stelle >= 0) liste[stelle] = l;
      else liste.unshift(l);
    });
    zustand.geholt = liste.filter((l) => l.echt).length;
  }

  /* Beispiele aus allen Listen nehmen. Nicht ausblenden – entfernen:
     Ein ausgeblendetes Beispiel taucht sonst in der Karte, im
     Ringtausch oder in einer Auswertung doch wieder auf. */
  function beispieleRaus() {
    const liste = TT.data.listings;
    const byId = TT.data.byId;
    for (let i = liste.length - 1; i >= 0; i--) {
      const l = liste[i];
      if (!l.echt && !l.eigen) {
        delete byId[l.id];
        liste.splice(i, 1);
      }
    }
  }

  /* ------------------------------------------------------------------
     Laden
     ------------------------------------------------------------------ */

  let laeuft = null;

  function laden() {
    if (laeuft) return laeuft;
    if (!TT.api || !TT.api.da) {
      zustand.geladen = true;
      laeuft = Promise.resolve(zustand);
      return laeuft;
    }

    const angaben = (TT.api.markt) || {};
    zustand.echte = Number(angaben.inserate) || 0;
    zustand.beispiele = angaben.beispiele !== false;

    if (!zustand.beispiele) beispieleRaus();

    if (!zustand.echte) {
      zustand.geladen = true;
      laeuft = Promise.resolve(zustand);
      melden();
      return laeuft;
    }

    laeuft = TT.api.ruf('markt?wieviele=120&sortierung=neu')
      .then((d) => {
        einmischen(d.inserate || []);
        zustand.echte = Number(d.gesamt) || zustand.geholt;
        zustand.geladen = true;
        melden();
        return zustand;
      })
      .catch((e) => {
        /* Ein Marktplatz, dessen Server schweigt, ist immer noch ein
           Rechenwerkzeug. Sichtbar bleibt der Fehler trotzdem: Sonst
           sucht jemand in Beispielen und hält sie für den Bestand. */
        zustand.fehler = e && e.text ? e.text : 'Der Bestand ließ sich nicht laden.';
        zustand.geladen = true;
        melden();
        return zustand;
      });
    return laeuft;
  }

  /* Nach jeder eigenen Änderung: Bestand neu holen, ohne den Zwischen-
     speicher zu behalten. */
  function nachladen() {
    laeuft = null;
    if (TT.api && TT.api.da) {
      return TT.api.ruf('status').then((d) => {
        if (d && d.markt) TT.api.marktMerken(d.markt);
        return laden();
      }, () => laden());
    }
    return laden();
  }

  /* Ein einzelnes echtes Inserat nachholen – für einen geteilten
     Verweis auf etwas, das nicht in den ersten 120 lag. */
  /**
   * Ein einzelnes echtes Inserat holen.
   *
   * Mit `neu` auch dann, wenn es schon im Bestand liegt – nach einer
   * Buchung oder einem neuen Zeitfenster hat sich daran etwas geändert,
   * und die Zahl der freien Plätze hängt an den Buchungen aller.
   */
  function objekt(id, neu) {
    if (TT.data.byId[id] && !neu) return Promise.resolve(TT.data.byId[id]);
    if (!TT.api || !TT.api.da || !/^tt[0-9a-f]{16}$/.test(String(id))) {
      return Promise.resolve(TT.data.byId[id] || null);
    }
    return TT.api.ruf('objekt/' + encodeURIComponent(id))
      .then((d) => {
        if (!d || !d.inserat) return null;
        einmischen([d.inserat]);
        return TT.data.byId[id] || null;
      })
      .catch(() => null);
  }

  const istEcht = (l) => !!(l && l.echt);
  const istBeispiel = (l) => !!(l && !l.echt && !l.eigen);
  /* Sind Beispiele im Umlauf? Danach entscheidet sich, ob über der
     Trefferliste der Hinweis steht. */
  const zeigtBeispiele = () => TT.data.listings.some(istBeispiel);

  /* ------------------------------------------------------------------
     Zählen

     Gebündelt und mit Verzögerung: Eine Anfrage je Klick wäre ein
     Vielfaches des Verkehrs, den die Anwendung sonst erzeugt. Verloren
     geht dabei nichts, was zählt – beim Verlassen der Seite geht der
     Rest noch heraus.
     ------------------------------------------------------------------ */
  let offen = [];
  let uhr = null;

  function zaehle(name) {
    if (!TT.api || !TT.api.da || !name) return;
    offen.push(name);
    if (offen.length > 40) offen = offen.slice(-40);
    if (uhr) return;
    uhr = setTimeout(abschicken, 4000);
  }

  function abschicken() {
    clearTimeout(uhr);
    uhr = null;
    if (!offen.length || !TT.api || !TT.api.da) return;
    const namen = offen.slice();
    offen = [];
    /* Kein Nachfassen, kein Fehler nach außen: Eine Zahl, die nicht
       ankommt, darf niemandem auffallen. */
    TT.api.ruf('zaehlen', { namen }).catch(() => { });
  }

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('pagehide', abschicken);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') abschicken();
    });
  }

  TT.markt = {
    laden, nachladen, objekt, einmischen, zaehle,
    istEcht, istBeispiel, zeigtBeispiele,
    horchen: (f) => { horcher.push(f); },
    get zustand() { return zustand; },
    get echte() { return zustand.echte; },
    get beispieleErlaubt() { return zustand.beispiele; }
  };
})(window.TT = window.TT || {});
