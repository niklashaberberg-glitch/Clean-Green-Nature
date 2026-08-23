/* =====================================================================
   Nestwerk – Tarife und Werbung

   Leitgedanke, an dem sich jede Entscheidung hier messen lassen muss:

     Plus bezahlt Zeitersparnis und Sichtbarkeit.
     Plus verändert nie, was jemand über eine Wohnung erfährt.

   Deshalb bleibt alles frei, was schützt (Prüfhinweis, Vergleichsmiete,
   Chancen), was gerechnet werden muss (Leistbarkeit, Wohngeld, Kosten)
   und was man einmal im Leben braucht (Übergabe, Nebenkosten, Umzug).
   Hinter Plus liegt, was jemand zehnmal am Tag anfasst.

   Zwei Dinge kauft Plus inzwischen doch, und beide sind bezahlte
   Sichtbarkeit. Das ist eine Entscheidung des Betriebs, keine technische
   Notwendigkeit – deshalb steht sie hier so deutlich:

     1. Anfragen von Plus-Nutzenden erscheinen im Postfach der
        anbietenden Seite weiter oben.
     2. Inserate lassen sich gegen Gebühr hervorheben.

   Beides ist an eine Bedingung geknüpft, von der nicht abgewichen wird:
   Es wird angezeigt. Eine Anfrage, die oben steht, weil sie bezahlt ist,
   trägt das Wort „Plus“; ein hervorgehobenes Inserat steht in einem
   eigenen, beschrifteten Block und nicht in der Trefferreihenfolge.
   Bezahlte Platzierung heimlich unter organische Ergebnisse zu mischen,
   wäre nach § 5b Abs. 1 Nr. 6 und Abs. 2 UWG ohnehin unzulässig – vor
   allem aber wäre es der Anfang vom Ende jeder nachvollziehbaren Suche.

   Was Plus weiterhin nicht kauft: eine bessere Platzierung in der
   Trefferliste anderer, früheren Zugang zu neuen Inseraten, Daten
   anderer Nutzender oder besseren Datenschutz gegen Aufpreis.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;

  /* ------------------------- Tarife ------------------------- */

  const TARIFE = {
    frei: {
      id: 'frei', name: 'Nestwerk frei', preisMonat: 0, preisJahr: 0,
      zeile: 'Vollständige Suche, dauerhaft kostenlos – finanziert über Anzeigen.'
    },
    plus: {
      id: 'plus', name: 'Nestwerk Plus', preisMonat: 7.90, preisJahr: 69,
      zeile: 'Für alle, die täglich suchen: keine Anzeigen, keine Limits, weniger Handarbeit.'
    }
  };

  /* Alles, was sich zwischen den Tarifen unterscheidet, steht hier –
     einmal, an einer Stelle, damit Preisseite und Sperren nie auseinanderlaufen. */
  const GRENZEN = {
    frei: {
      suchauftraege: 1,
      vergleich: 2,
      anker: 1,
      lupeFunde: 1,
      ringLaenge: 2,
      werbung: true,
      stellschrauben: false,
      serienbewerbung: false,
      marktdaten: false,
      exposeExport: false,
      nachfassen: false,
      tagesplan: false,
      anfrageVorne: false
    },
    plus: {
      suchauftraege: Infinity,
      vergleich: 6,
      anker: Infinity,
      lupeFunde: Infinity,
      ringLaenge: 4,
      werbung: false,
      stellschrauben: true,
      serienbewerbung: true,
      marktdaten: true,
      exposeExport: true,
      nachfassen: true,
      tagesplan: true,
      anfrageVorne: true
    }
  };

  /* Beschreibung jeder Leistung – Grundlage für Preisseite und Sperrhinweise. */
  const LEISTUNGEN = [
    { id: 'suche', gruppe: 'Suchen', name: 'Alle Inserate, alle vier Angebotsarten',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'passung', gruppe: 'Suchen', name: 'Passung nach eigenem Profil, ohne bezahlte Plätze',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'karte', gruppe: 'Suchen', name: 'Karte mit Preisniveau und Umkreis',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'merkliste', gruppe: 'Suchen', name: 'Merkliste und Bewerbungstafel',
      frei: 'unbegrenzt', plus: 'unbegrenzt', gleich: true },

    { id: 'pruefhinweis', gruppe: 'Schutz', name: 'Prüfhinweis gegen erfundene Inserate',
      frei: 'vollständig', plus: 'vollständig', gleich: true,
      warum: 'Betrugsschutz hinter eine Bezahlschranke zu stellen wäre zynisch.' },
    { id: 'spiegel', gruppe: 'Schutz', name: 'Vergleichsmiete und Mietpreisbremse',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'chancen', gruppe: 'Schutz', name: 'Ehrliche Einschätzung deiner Chancen',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'duplikate', gruppe: 'Schutz', name: 'Doppelt eingestellte Wohnungen erkennen',
      frei: 'vollständig', plus: 'vollständig', gleich: true },

    { id: 'rechner', gruppe: 'Rechnen', name: 'Leistbarkeit, Wohngeld, WBS, echte Monatskosten',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'nebenkosten', gruppe: 'Rechnen', name: 'Nebenkostenabrechnung prüfen',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'uebergabe', gruppe: 'Rechnen', name: 'Übergabeprotokoll und Umzugsplan',
      frei: 'vollständig', plus: 'vollständig', gleich: true,
      warum: 'Braucht man einmal beim Umzug – dafür ein Abo zu verlangen wäre unverschämt.' },

    { id: 'tresor', gruppe: 'Schutz', name: 'Dokumententresor mit Ende-zu-Ende-Verschlüsselung',
      frei: 'unbegrenzt', plus: 'unbegrenzt', gleich: true,
      warum: 'Wer für Datenschutz zahlen muss, hat keinen. Verschlüsselung ist kein Zusatzverkauf.' },
    { id: 'freigaben', gruppe: 'Schutz', name: 'Befristete Verweise statt Anhänge, jederzeit widerrufbar',
      frei: 'unbegrenzt', plus: 'unbegrenzt', gleich: true },

    { id: 'werbung', gruppe: 'Täglich', name: 'Anzeigenfrei', frei: 'mit Anzeigen', plus: 'ohne Anzeigen' },
    { id: 'suchauftraege', gruppe: 'Täglich', name: 'Suchaufträge mit sofortiger Meldung',
      frei: '1 Auftrag', plus: 'unbegrenzt' },
    { id: 'anker', gruppe: 'Täglich', name: 'Ankerpunkte für Fahrzeiten',
      frei: '1 Ort', plus: 'unbegrenzt' },
    { id: 'vergleich', gruppe: 'Täglich', name: 'Objekte nebeneinander vergleichen',
      frei: '2 Objekte', plus: '6 Objekte' },
    { id: 'lupe', gruppe: 'Täglich', name: 'Vertragslupe',
      frei: 'erster Fund', plus: 'alle Funde mit Erläuterung' },
    { id: 'ring', gruppe: 'Täglich', name: 'Ringtausch',
      frei: 'direkte Tausche', plus: 'Ketten über drei und vier Haushalte' },
    { id: 'stellschrauben', gruppe: 'Täglich', name: 'Durchgerechnete Stellschrauben beim Tausch',
      frei: 'nein', plus: 'ja' },
    { id: 'serie', gruppe: 'Täglich', name: 'Serienbewerbung aus der Merkliste',
      frei: 'nein', plus: 'ja' },
    { id: 'nachfassen', gruppe: 'Täglich', name: 'Erinnerung ans Nachfassen',
      frei: 'nein', plus: 'ja' },
    { id: 'tagesplan', gruppe: 'Täglich', name: 'Besichtigungen zu einer Route ordnen',
      frei: 'nein', plus: 'ja' },
    { id: 'marktdaten', gruppe: 'Täglich', name: 'Preisverlauf und Marktdaten je Viertel',
      frei: 'nein', plus: 'ja' },
    { id: 'expose', gruppe: 'Täglich', name: 'Exposé und Merkliste als Datei',
      frei: 'nein', plus: 'ja' },

    { id: 'anfrageVorne', gruppe: 'Sichtbarkeit', name: 'Anfragen stehen im Postfach der Anbieter oben',
      frei: 'in der Reihenfolge des Eingangs', plus: 'oben, sichtbar gekennzeichnet',
      warum: 'Die anbietende Seite sieht, dass die Reihenfolge bezahlt ist. Verschwiegen wäre sie unzulässig.' },
    { id: 'hervorheben', gruppe: 'Sichtbarkeit', name: 'Eigenes Inserat hervorheben',
      frei: 'einzeln buchbar', plus: 'einzeln buchbar, 20 % günstiger',
      warum: 'Hervorgehobene Inserate stehen in einem eigenen, beschrifteten Block – nie in der Trefferreihenfolge.' }
  ];

  /* Was Plus ausdrücklich nicht kauft. Steht so auch auf der Preisseite. */
  const NICHT_KAEUFLICH = [
    'Keine andere Trefferreihenfolge. Die Sortierung entsteht allein aus deinem Profil – bezahlte Plätze stehen in einem eigenen, beschrifteten Block darüber.',
    'Keine unsichtbare Bevorzugung. Wo Bezahlung die Reihenfolge ändert, steht es dabei – im Postfach der Anbieter genauso wie in der Suche.',
    'Kein Frühzugang zu neuen Inseraten. Alle sehen jedes Inserat in derselben Sekunde.',
    'Keine Daten anderer Nutzerinnen und Nutzer.',
    'Kein besserer Datenschutz gegen Aufpreis – der Dokumententresor und die widerrufbaren Verweise sind im freien Tarif vollständig enthalten.',
    'Keine Werbung, die sich als Inserat ausgibt – Anzeigen sind immer als solche gekennzeichnet.'
  ];

  /* ------------------------- Inserate hervorheben -------------------------

     Das Modell, das jeder von Kleinanzeigen kennt: Wer sein Angebot
     schneller loswerden will, zahlt für Sichtbarkeit. Für eine Plattform
     ist es die verlässlichste Einnahme überhaupt, weil sie den zahlt, der
     einen Nutzen davon hat – die anbietende Seite –, und nicht den, der
     gerade eine Wohnung sucht und meist wenig Geld hat.

     Entscheidend ist, wie es eingebaut wird. Ein gekaufter Platz mitten
     in der Trefferliste macht die Reihenfolge unerklärbar und ist nach
     § 5b UWG kennzeichnungspflichtig. Deshalb hier: eigener Block über
     den Ergebnissen, beschriftet, in der Zahl begrenzt. Die organische
     Liste darunter bleibt unberührt und folgt weiter dem Profil. */

  const HERVORHEBUNG = [
    {
      id: 'schub', name: 'Nach oben schieben', preis: 2.90, tage: 0,
      kurz: 'Das Inserat gilt wieder als frisch und steht in „neueste zuerst“ ganz oben.',
      wirkung: 'einmalig, sofort', icon: 'pfeilUnten'
    },
    {
      id: 'farbe', name: 'Hervorheben', preis: 6.90, tage: 7,
      kurz: 'Die Karte bekommt einen farbigen Rand und ein Kennzeichen – sie bleibt an ihrem Platz, fällt aber auf.',
      wirkung: '7 Tage', icon: 'stern'
    },
    {
      id: 'top', name: 'Top-Anzeige', preis: 14.90, tage: 7,
      kurz: 'Das Inserat steht über den Treffern in einem eigenen, als bezahlt gekennzeichneten Block.',
      wirkung: '7 Tage', icon: 'blitz'
    }
  ];

  /* Höchstens so viele bezahlte Plätze über einer Trefferliste. Mehr, und
     der eigentliche Inhalt beginnt unterhalb des Bildschirmrands. */
  const TOP_MAX = 2;
  const PLUS_RABATT = 0.20;

  const hervorhebung = (id) => HERVORHEBUNG.find((x) => x.id === id) || null;

  function hervorhebungPreis(id) {
    const p = hervorhebung(id);
    if (!p) return 0;
    return istPlus() ? Math.round(p.preis * (1 - PLUS_RABATT) * 100) / 100 : p.preis;
  }

  /* Läuft die Hervorhebung eines Inserats gerade? */
  function boostAktiv(l, art) {
    const b = l && l.boost;
    if (!b) return false;
    if (art && b.art !== art) return false;
    if (!b.bis) return b.art === 'schub';
    return new Date(b.bis) > NW.now();
  }

  const istTop = (l) => boostAktiv(l, 'top');
  const istHervorgehoben = (l) => boostAktiv(l, 'farbe') || boostAktiv(l, 'top');

  /* ------------------------- Anfragen sortieren -------------------------

     Die Reihenfolge im Postfach der anbietenden Seite. Plus zuerst, dann
     nach Eingang. Der Rang wird zurückgegeben, damit die Oberfläche ihn
     anzeigen kann – eine Sortierung, die niemand erklärt, ist genau die,
     die man nicht bauen darf. */
  function anfrageRang(a) {
    return (a && a.plus) ? 0 : 1;
  }

  function anfragenSortieren(liste) {
    return liste.slice().sort((a, b) => {
      const r = anfrageRang(a) - anfrageRang(b);
      if (r) return r;
      return String(a.zeit || '').localeCompare(String(b.zeit || ''));
    });
  }

  /* ------------------------- Gründerplätze -------------------------

     Die ersten zehntausend Anmeldungen bekommen Plus ein Jahr lang ohne
     Bezahlung. Kein Abo, das sich verlängert, keine hinterlegte Karte:
     Nach dem Jahr endet der Platz von selbst und die Anwendung fällt in
     den freien Tarif zurück. Wer dann bezahlen will, entscheidet sich neu.

     Was in dieser Vorführung fehlt, ist die zentrale Stelle, die zählt.
     Ohne Server kann kein Browser wissen, wie viele Plätze anderswo schon
     vergeben sind. Der Zähler unten ist deshalb ausdrücklich eine
     Hochrechnung aus der Zeit seit dem Start – und die Anwendung sagt das
     an jeder Stelle dazu, an der sie ihn zeigt. Im Betrieb vergibt der
     Server die Nummer, und zwar genau einmal. */

  const GRUENDER = {
    plaetze: 10000,
    monate: 12,
    start: '2026-08-01',
    /* Für die Hochrechnung: So viele Plätze gehen im Schnitt am Tag weg.
       Eine Annahme, keine Messung. */
    proTag: 140
  };

  const gruender = () => NW.store.get().gruender || { nummer: 0, seit: '', bis: '' };

  function gruenderAktiv() {
    const g = gruender();
    return !!(g.nummer && g.bis && new Date(g.bis) > NW.now());
  }

  function gruenderTageRest() {
    const g = gruender();
    if (!g.bis) return 0;
    return Math.max(0, Math.ceil((new Date(g.bis) - NW.now()) / 86400000));
  }

  /* Hochgerechnet, nicht gezählt – siehe oben. */
  function gruenderVergeben() {
    const tage = Math.max(0, Math.floor((NW.now() - new Date(GRUENDER.start)) / 86400000));
    const geschaetzt = Math.min(GRUENDER.plaetze - 1, Math.round(tage * GRUENDER.proTag));
    return gruender().nummer ? Math.max(geschaetzt, gruender().nummer) : geschaetzt;
  }

  const gruenderFrei = () => Math.max(0, GRUENDER.plaetze - gruenderVergeben());

  /* Vergibt den eigenen Platz. Gibt die Nummer zurück oder 0, wenn nichts
     mehr frei ist oder schon einer vergeben wurde. */
  function gruenderSichern() {
    if (gruender().nummer) return 0;
    if (!gruenderFrei()) return 0;
    const nummer = gruenderVergeben() + 1;
    const bis = new Date(NW.now().getTime());
    bis.setMonth(bis.getMonth() + GRUENDER.monate);
    NW.store.set({ gruender: { nummer, seit: U.isoDate(NW.now()), bis: U.isoDate(bis) } }, 'tarif');
    return nummer;
  }

  function gruenderAufgeben() {
    NW.store.set({ gruender: { nummer: 0, seit: '', bis: '' } }, 'tarif');
  }

  /* ------------------------- Zustand ------------------------- */

  function aktuell() {
    const s = NW.store.get();
    if (s.tarif === 'plus') return 'plus';
    return gruenderAktiv() ? 'plus' : 'frei';
  }

  /* Woher Plus kommt – die Oberfläche muss beides auseinanderhalten
     können, sonst bietet sie einem Gründer ein Abo an, das er nicht
     braucht, oder verschweigt ihm, dass sein Jahr ausläuft. */
  function plusQuelle() {
    const s = NW.store.get();
    if (s.tarif === 'plus') return 'bezahlt';
    return gruenderAktiv() ? 'gruender' : null;
  }

  const istPlus = () => aktuell() === 'plus';
  const grenze = (name) => GRENZEN[aktuell()][name];
  const darf = (name) => !!GRENZEN[aktuell()][name];

  function leistung(id) {
    return LEISTUNGEN.find((l) => l.id === id);
  }

  function wechseln(tarif, intervall) {
    NW.store.set({
      tarif: tarif === 'plus' ? 'plus' : 'frei',
      tarifIntervall: intervall || 'monat',
      tarifSeit: U.isoDate(NW.now())
    }, 'tarif');
  }

  /* ------------------------- Anzeigen ------------------------- */

  /* Erfundene Beispielanzeigen. Keine echten Marken, keine echten
     Angebote – sie zeigen nur, wie Werbung im freien Tarif aussieht:
     immer gekennzeichnet, nie im Gewand eines Inserats. */
  const ANZEIGEN = [
    {
      id: 'umzug', art: 'Umzug', icon: 'umzug',
      titel: 'Umzugshelfer im Umkreis vergleichen',
      text: 'Drei Angebote für den Umzugstag, Halteverbot inklusive.',
      absender: 'Beispiel-Umzugsdienst', ruf: 'Angebote ansehen'
    },
    {
      id: 'kaution', art: 'Finanzen', icon: 'euro',
      titel: 'Kautionsbürgschaft statt Barkaution',
      text: 'Drei Monatsmieten nicht auf einmal binden – gegen Jahresbeitrag.',
      absender: 'Beispiel-Bürgschaft', ruf: 'Bedingungen lesen'
    },
    {
      id: 'hausrat', art: 'Versicherung', icon: 'schluessel',
      titel: 'Hausrat zum Einzug versichern',
      text: 'Schutz ab dem Tag der Schlüsselübergabe.',
      absender: 'Beispiel-Versicherung', ruf: 'Tarif berechnen'
    },
    {
      id: 'internet', art: 'Anschluss', icon: 'blitz',
      titel: 'Internet an der neuen Adresse prüfen',
      text: 'Verfügbarkeit und Schaltdauer vor dem Einzug klären.',
      absender: 'Beispiel-Anbieter', ruf: 'Adresse prüfen'
    },
    {
      id: 'moebel', art: 'Einrichtung', icon: 'haus',
      titel: 'Küche nach Maß für kleine Grundrisse',
      text: 'Planung vor Ort, Aufbau am Einzugstag.',
      absender: 'Beispiel-Küchenstudio', ruf: 'Termin anfragen'
    },
    {
      id: 'strom', art: 'Energie', icon: 'blitz',
      titel: 'Stromtarif zum Einzug wechseln',
      text: 'Anmeldung an der neuen Adresse in wenigen Minuten.',
      absender: 'Beispiel-Energieversorger', ruf: 'Tarife vergleichen'
    },
    {
      id: 'handwerk', art: 'Handwerk', icon: 'stift',
      titel: 'Malerarbeiten vor dem Einzug',
      text: 'Wände streichen, bevor die Möbel kommen.',
      absender: 'Beispiel-Malerbetrieb', ruf: 'Angebot einholen'
    }
  ];

  /* Wählt eine Anzeige stabil zur Position – beim Blättern springt
     dadurch nichts herum. */
  function anzeige(schluessel) {
    if (!GRENZEN[aktuell()].werbung) return null;
    return ANZEIGEN[U.hash(String(schluessel)) % ANZEIGEN.length];
  }

  /* Nach wie vielen Treffern eine Anzeige eingeschoben wird. */
  const ANZEIGE_ABSTAND = 6;

  NW.plan = {
    TARIFE, GRENZEN, LEISTUNGEN, NICHT_KAEUFLICH, ANZEIGEN, ANZEIGE_ABSTAND, GRUENDER,
    HERVORHEBUNG, TOP_MAX, PLUS_RABATT,
    hervorhebung, hervorhebungPreis, boostAktiv, istTop, istHervorgehoben,
    anfrageRang, anfragenSortieren,
    aktuell, istPlus, plusQuelle, grenze, darf, leistung, wechseln, anzeige,
    gruender, gruenderAktiv, gruenderTageRest, gruenderVergeben, gruenderFrei,
    gruenderSichern, gruenderAufgeben
  };
})(window.NW = window.NW || {});
