/* =====================================================================
   TrimmoTrade – Hilfe: Wissensbasis und Abgleich

   Was das hier ist und was es nicht ist, gehört an den Anfang, weil die
   Erwartung sonst falsch gesetzt wird: Das ist kein Sprachmodell. Es gibt
   keinen Server und nichts, was „versteht“. Was es gibt, ist eine
   gepflegte Liste von Antworten und ein Abgleich, der die Frage der
   passendsten Antwort zuordnet.

   Das ist für einen Hilfebereich kein Nachteil, sondern meistens besser:
   Die Antworten stimmen, weil jemand sie geschrieben hat, sie verweisen
   an die richtige Stelle in der Anwendung, und sie erfinden nichts. Wo
   der Abgleich nicht sicher ist, sagt er das und bietet den Weg zum
   Menschen an – statt zu raten.

   Der Abgleich selbst: Frage normalisieren (Kleinschreibung, Umlaute,
   Satzzeichen), grob stemmen, dann Schlagworte gewichtet zählen und die
   Beispielfragen als Ganzes mitbewerten. Kein Wunderwerk, aber für ein
   paar Dutzend Themen genauer als alles, was mehr Aufwand macht.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util;

  /* ------------------------- Textaufbereitung ------------------------- */

  const UMLAUT = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };

  function normalisieren(text) {
    return String(text || '').toLowerCase()
      .replace(/[äöüß]/g, (c) => UMLAUT[c])
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Wörter, die in jeder Frage stehen und nichts unterscheiden. */
  const STOPP = new Set(('der die das ein eine einen einem eines und oder aber wie was wo wann warum wieso '
    + 'ist sind war bin bist kann kannst koennen muss muessen soll sollte darf ich du sie wir ihr mein meine '
    + 'mir mich es im in am an auf fuer mit von zu zum zur bei nach aus dass denn nicht kein keine mal bitte '
    + 'gibt geht macht machen habe haben hat wird werden wurde man sich noch schon nur auch sehr').split(' '));

  /* Sehr grobes Stemmen. Deutsch ist dafür eigentlich zu unregelmäßig,
     aber für Schlagwortabgleich reicht es: Es fängt Plural und Beugung. */
  function stamm(wort) {
    let w = wort;
    ['ungen', 'ungs', 'ung', 'lich', 'igen', 'ern', 'en', 'er', 'es', 'em', 'e', 'n', 's']
      .some((endung) => {
        if (w.length > endung.length + 3 && w.slice(-endung.length) === endung) {
          w = w.slice(0, -endung.length);
          return true;
        }
        return false;
      });
    return w;
  }

  /* Der Umlautplural ist die zweite Falle nach den Komposita:
     „Aufträge“ wird zu „auftraege“, der Singular zu „auftrag“ – ohne
     diesen Schritt findet das eine das andere nie. */
  const entumlauten = (w) => w.replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');

  /* Drei Formen je Wort, weil keine allein genügt: wie geschrieben,
     gestemmt, und beides ohne Umlautrest. Verglichen wird jede mit jeder. */
  function formen(wort) {
    const g = stamm(wort);
    const e = entumlauten(g);
    return g === e ? [wort, g] : [wort, g, e];
  }

  function woerter(text) {
    return normalisieren(text).split(' ')
      .filter((w) => w.length > 1 && !STOPP.has(w))
      .map(stamm);
  }

  function wortFormen(text) {
    return normalisieren(text).split(' ')
      .filter((w) => w.length > 1 && !STOPP.has(w))
      .map(formen);
  }

  /* ------------------------- Wissensbasis -------------------------

     Jeder Eintrag: was gefragt wird (fragen), woran man es erkennt
     (schlag, gewichtet über die Reihenfolge), die Antwort und wohin es
     weitergeht. `antwort` darf eine Funktion sein – dann kann sie den
     tatsächlichen Stand dieser Anwendung berücksichtigen, statt eine
     allgemeine Auskunft zu geben. */

  const P = () => TT.plan;
  const S = () => TT.store;

  const THEMEN = [
    /* ---------------- Tarif und Geld ---------------- */
    {
      id: 'kosten',
      titel: 'Was kostet TrimmoTrade?',
      gruppe: 'Tarif',
      fragen: ['was kostet das', 'ist das kostenlos', 'preise', 'wie teuer ist plus', 'was kostet ein abo'],
      schlag: ['kosten', 'preis', 'teuer', 'kostenlos', 'gratis', 'gebuehr', 'bezahl', 'abo', 'euro'],
      antwort: () => {
        const t = TT.plan.TARIFE.plus;
        return 'Die Suche ist vollständig kostenlos: alle Inserate, Karte, Passung, Prüfhinweis gegen Betrug, '
          + 'Vergleichsmiete und sämtliche Rechner. Finanziert wird das über Anzeigen.\n\n'
          + 'TrimmoTrade Plus kostet ' + U.eur2(t.preisMonat) + ' im Monat oder ' + U.eur2(t.preisJahr)
          + ' im Jahr und nimmt vor allem Handarbeit ab: mehrere Suchaufträge, Serienbewerbung, '
          + 'Vertragslupe vollständig, Ringtausch über drei und vier Haushalte, keine Anzeigen.\n\n'
          + 'Die ersten ' + U.num(TT.plan.GRUENDER.plaetze) + ' Anmeldungen bekommen Plus zwölf Monate '
          + 'geschenkt – ohne Abo und ohne Zahlungsdaten.';
      },
      ziele: [['Tarife ansehen', 'plus'], ['Gründerplatz sichern', 'plus']]
    },
    {
      id: 'kuendigen',
      titel: 'Wie kündige ich?',
      gruppe: 'Tarif',
      fragen: ['wie kuendige ich', 'abo beenden', 'vertrag kuendigen', 'wie werde ich plus wieder los'],
      schlag: ['kuendig', 'beend', 'aufhoer', 'stornier', 'abbestell', 'vertrag', 'widerruf', 'abo'],
      muster: [/\b(los|raus|weg)\b/, /nicht mehr (zahl|bezahl|nutz)/],
      antwort: () => {
        const q = TT.plan.plusQuelle();
        if (q === 'gruender') {
          return 'Auf diesem Gerät läuft Plus über einen Gründerplatz – das ist kein Abo. Es verlängert sich '
            + 'nicht, es wird nichts abgebucht, und du musst nichts kündigen. Nach '
            + TT.plan.gruenderTageRest() + ' Tagen endet es von selbst.\n\n'
            + 'Zurückgeben kannst du den Platz trotzdem jederzeit.';
        }
        if (q === 'bezahlt') {
          return 'Über die Schaltfläche „Verträge hier kündigen“ – ohne Anmeldung, ohne Rückfrage, ohne Umweg '
            + 'über den Kundendienst. Die Kündigung wirkt zum Ende der laufenden Laufzeit, und der Eingang '
            + 'wird in Textform bestätigt.\n\nInnerhalb der ersten vierzehn Tage ist ein Widerruf möglich; '
            + 'der ist für dich meist günstiger.';
        }
        return 'Auf diesem Gerät läuft kein entgeltlicher Vertrag – der freie Tarif muss nicht gekündigt '
          + 'werden. Falls du doch einen hast: Die Schaltfläche „Verträge hier kündigen“ erledigt das ohne '
          + 'Anmeldung und ohne Rückfrage.';
      },
      ziele: [['Verträge kündigen', 'recht/kuendigen'], ['Widerrufsbelehrung', 'recht/widerruf']]
    },
    {
      id: 'werbung',
      titel: 'Warum sehe ich Anzeigen?',
      gruppe: 'Tarif',
      fragen: ['warum werbung', 'anzeigen ausschalten', 'werbung nervt', 'bekommt ihr meine daten'],
      schlag: ['werbung', 'anzeig', 'reklam', 'banner', 'tracking'],
      antwort: 'Anzeigen sind der Preis des freien Tarifs. Wer eine Wohnung sucht, hat oft gerade wenig Geld – '
        + 'ausgerechnet dann eine Bezahlschranke vor die Suche zu stellen, wäre verkehrt.\n\n'
        + 'Was dabei nicht passiert: Es werden keine Daten über dich an Werbetreibende gegeben. Welche Anzeige '
        + 'erscheint, entscheidet die Stelle auf der Seite, nicht dein Profil oder dein Verhalten. Deshalb gibt '
        + 'es auch kein Einwilligungsfenster – es gibt nichts einzuwilligen.\n\n'
        + 'Mit Plus verschwinden die Anzeigen.',
      ziele: [['Tarife ansehen', 'plus'], ['Datenschutzerklärung', 'recht/datenschutz']]
    },
    {
      id: 'hervorheben',
      titel: 'Mein Inserat wird kaum gesehen',
      gruppe: 'Inserieren',
      fragen: ['inserat hervorheben', 'wie komme ich nach oben', 'top anzeige', 'niemand meldet sich'],
      schlag: ['hervorheb', 'top', 'sichtbar', 'push', 'schieb', 'auffall', 'gesehen'],
      muster: [/(inserat|anzeige|angebot|wohnung).{0,24}(nach oben|weiter oben|hervor|sichtbar)/,
        /(nach oben|weiter oben).{0,24}(bring|komm|schieb|setz)/],
      antwort: () => {
        const preise = TT.plan.HERVORHEBUNG.map((x) => x.name + ' ' + U.eur2(x.preis)).join(', ');
        return 'Drei Möglichkeiten, gegen Gebühr: ' + preise + '. Mit Plus '
          + Math.round(TT.plan.PLUS_RABATT * 100) + ' % günstiger.\n\n'
          + 'Wichtig zu wissen: Hervorgehobene Inserate stehen in einem eigenen, als bezahlt gekennzeichneten '
          + 'Block über den Treffern – nie zwischen ihnen. Die Reihenfolge darunter verschiebt sich nicht.\n\n'
          + 'Vorher lohnt sich das Naheliegende: Fotos hinzufügen, den Preis gegen die Vergleichsmiete prüfen '
          + 'und die Beschreibung konkret machen. Das wirkt oft mehr als jede Hervorhebung.';
      },
      ziele: [['Eigene Inserate', 'inserieren'], ['Tarife und Preise', 'plus']]
    },

    /* ---------------- Bewerben ---------------- */
    {
      id: 'bewerben',
      titel: 'Wie bewerbe ich mich auf eine Wohnung?',
      gruppe: 'Bewerben',
      fragen: ['wie bewerbe ich mich', 'anschreiben schreiben', 'wie kontaktiere ich den vermieter'],
      schlag: ['bewerb', 'anschreib', 'kontakt', 'melden', 'nachricht', 'anfrag'],
      antwort: 'Auf jeder Objektseite steht „Anschreiben“ (beim Kauf: „Anfragen“). TrimmoTrade schreibt daraus '
        + 'einen Vorschlag mit den Angaben aus deinem Profil – Titel, Lage und Einzugstermin des jeweiligen '
        + 'Inserats stehen schon drin. Den Text kannst du vor dem Absenden ändern.\n\n'
        + 'Der Brief sagt dabei nur zu, was du wirklich hast. Ein Anschreiben, das Unterlagen verspricht, die '
        + 'es nicht gibt, fliegt spätestens bei der Besichtigung auf.',
      ziele: [['Profil ausfüllen', 'profil'], ['Zur Suche', 'suche']]
    },
    {
      id: 'unterlagen',
      titel: 'Welche Unterlagen brauche ich?',
      gruppe: 'Bewerben',
      fragen: ['welche unterlagen', 'was muss ich mitschicken', 'schufa noetig', 'selbstauskunft'],
      schlag: ['unterlag', 'schufa', 'selbstauskunft', 'gehaltsnachweis', 'nachweis', 'dokument', 'mappe',
        'ausweis', 'buergschaft', 'mietschuldenfrei'],
      antwort: 'Üblich sind Selbstauskunft, die letzten drei Gehaltsabrechnungen, Mietschuldenfreiheit und – '
        + 'erst später – die Schufa-Bonitätsauskunft.\n\n'
        + 'Die Reihenfolge ist wichtiger als die Vollständigkeit: <b>Schufa und Ausweiskopie gehören nicht in '
        + 'die erste Anfrage.</b> Erst wenn die Wohnung ernsthaft in Betracht kommt, also nach der '
        + 'Besichtigung. Kontoauszüge sind keine Einkommensnachweise – sie zeigen jede Ausgabe deines Lebens.\n\n'
        + 'Fragen nach Familienplanung, Religion, Herkunft, Parteizugehörigkeit oder Vorstrafen sind '
        + 'unzulässig und dürfen falsch beantwortet werden.',
      ziele: [['Bewerbermappe im Profil', 'profil'], ['Dokumententresor', 'tresor']]
    },
    {
      id: 'fragen-vermieter',
      titel: 'Welche Fragen darf ein Vermieter stellen?',
      gruppe: 'Bewerben',
      fragen: ['darf er nach religion fragen', 'unzulaessige fragen selbstauskunft',
        'muss ich sagen ob ich kinder will', 'darf man nach vorstrafen fragen', 'schwangerschaft'],
      schlag: ['religion', 'familienplanung', 'kinderwunsch', 'schwanger', 'vorstraf', 'herkunft',
        'partei', 'gewerkschaft', 'unzulaessig', 'erlaubt', 'krankheit'],
      muster: [/darf (er|sie|der vermieter|man).{0,30}frag/],
      antwort: 'Zulässig ist, was für das Mietverhältnis erheblich ist: Name, Zahl der einziehenden Personen, '
        + 'Beruf, gesichertes Einkommen und ob Mietschulden bestehen.\n\n'
        + '<b>Unzulässig sind Fragen nach</b> Familienplanung und Schwangerschaft, Religion, Herkunft und '
        + 'Staatsangehörigkeit, Partei- oder Gewerkschaftszugehörigkeit, Krankheiten sowie – von wenigen '
        + 'Ausnahmen abgesehen – nach Vorstrafen. Solche Fragen dürfen <b>falsch beantwortet werden</b>, ohne '
        + 'dass der Mietvertrag deshalb angefochten oder gekündigt werden kann.\n\n'
        + 'Auch die Einkommensfrage hat Grenzen: Kontoauszüge sind keine Einkommensnachweise, und die '
        + 'Schufa gehört nicht in die erste Anfrage.\n\n'
        + 'Steht so etwas im Inserat selbst und sortiert nach Herkunft, Geschlecht, Behinderung oder Alter '
        + 'aus, verstößt es gegen das Allgemeine Gleichbehandlungsgesetz und lässt sich melden.',
      ziele: [['Inhalt melden', 'recht/melden'], ['Bewerbermappe im Profil', 'profil']]
    },
    {
      id: 'tresor',
      titel: 'Was ist der Dokumententresor?',
      gruppe: 'Datenschutz',
      fragen: ['dokumententresor', 'unterlagen sicher verschicken', 'verschluesselt hochladen',
        'kennwort vergessen tresor'],
      schlag: ['tresor', 'verschluessel', 'freigab', 'verweis'],
      muster: [/(tresor|dokument|unterlag).{0,24}(kennwort|passwort|verschluessel|freigab)/,
        /(kennwort|passwort).{0,24}(tresor|dokument|unterlag)/],
      antwort: 'Du legst deine Unterlagen einmal verschlüsselt ab und verschickst beim Bewerben keinen Anhang, '
        + 'sondern einen Verweis, der nach gesetzter Frist und Zahl von Abrufen erlischt – und den du '
        + 'jederzeit widerrufen kannst.\n\n'
        + 'Verschlüsselt wird im Browser mit AES-GCM und 256 Bit, der Schlüssel entsteht aus deinem Kennwort '
        + 'und wird nirgends gespeichert. Auch der Dateiname ist verschlüsselt.\n\n'
        + '<b>Das Kennwort lässt sich nicht zurücksetzen.</b> Es gibt keinen Server, der es kennt. Vergisst du '
        + 'es, bleibt nur, den Tresor zu leeren und neu zu füllen.',
      ziele: [['Zum Dokumententresor', 'tresor']]
    },
    {
      id: 'chancen',
      titel: 'Ich bekomme nur Absagen',
      gruppe: 'Bewerben',
      fragen: ['nur absagen', 'keine antwort', 'wie erhoehe ich meine chancen', 'niemand antwortet'],
      schlag: ['absag', 'antwort', 'chance', 'erfolglos', 'klappt', 'aussichtslos', 'ignorier'],
      antwort: 'Auf jeder Objektseite steht eine ehrliche Einschätzung: wie viele Interessenten es gibt, wie '
        + 'schnell die Anbieterseite antwortet und wie deine Angaben dazu stehen. Sie ist absichtlich nicht '
        + 'beschönigend.\n\nWas messbar hilft: schnell sein (Suchauftrag mit sofortiger Meldung), die '
        + 'Bewerbermappe vollständig haben, ein Anschreiben, das erkennbar zu genau dieser Wohnung passt – und '
        + 'ein realistisches Budget. Wenn die Suche fast nichts durchlässt, zeigt TrimmoTrade unter den Treffern, '
        + 'welche Lockerung wie viele zusätzliche Wohnungen bringt.',
      ziele: [['Suchauftrag anlegen', 'agenten'], ['Was kann ich mir leisten?', 'leistbarkeit']]
    },

    /* ---------------- Suche ---------------- */
    {
      id: 'sortierung',
      titel: 'Wie entsteht die Reihenfolge der Treffer?',
      gruppe: 'Suche',
      fragen: ['wie wird sortiert', 'warum steht das oben', 'reihenfolge', 'kann man sich nach oben kaufen'],
      schlag: ['sortier', 'reihenfolg', 'ranking', 'oben', 'passung', 'algorithm'],
      antwort: 'Aus deinem Profil, und die Bewertung legt offen, warum: Unter jedem Treffer steht, welche '
        + 'Kriterien mit welchem Anteil eingeflossen sind. Die Gewichtung kannst du im Profil selbst '
        + 'verstellen – danach ändert sich die Reihenfolge.\n\n'
        + 'Bezahlte Plätze gibt es getrennt davon: Sie stehen über der Liste, tragen die Überschrift '
        + '„Top-Anzeigen“ und verschieben in der Liste darunter nichts.',
      ziele: [['Gewichtung im Profil', 'profil'], ['Zur Suche', 'suche']]
    },
    {
      id: 'suchauftrag',
      titel: 'Wie lege ich einen Suchauftrag an?',
      gruppe: 'Suche',
      fragen: ['suchauftrag', 'benachrichtigung neue wohnungen', 'alarm einrichten'],
      schlag: ['suchauftrag', 'agent', 'benachricht', 'meldung', 'alarm', 'alert', 'informier'],
      antwort: () => 'Filter in der Suche einstellen, dann unter „Suchaufträge“ speichern. Neue Treffer '
        + 'werden markiert, sobald sie auftauchen.\n\nIm freien Tarif ist '
        + TT.plan.GRENZEN.frei.suchauftraege + ' Auftrag möglich, mit Plus beliebig viele. Wer in mehreren '
        + 'Städten oder Preisklassen sucht, merkt den Unterschied am schnellsten.',
      ziele: [['Suchaufträge', 'agenten'], ['Zur Suche', 'suche']]
    },
    {
      id: 'ringtausch',
      titel: 'Was ist ein Ringtausch?',
      gruppe: 'Suche',
      fragen: ['ringtausch', 'wohnungstausch', 'wie funktioniert tauschen', 'dreiertausch'],
      schlag: ['ringtausch', 'wohnungstausch', 'tausch', 'kette', 'dreier', 'vierer'],
      antwort: 'Beim direkten Tausch müssen zwei Menschen genau das Gegenteil voneinander wollen – das '
        + 'passiert fast nie. In einer Kette reicht es, wenn jede die Wohnung der nächsten Person möchte: '
        + 'Anna zieht zu Ben, Ben zu Carla, Carla in Annas Wohnung.\n\n'
        + 'TrimmoTrade durchsucht alle Angebote automatisch nach solchen geschlossenen Ketten. Auf der Seite '
        + '„Ringtausch“ ist das in vier Bildern erklärt.\n\n'
        + 'Rechtlich ist es kein Tausch, sondern für jede Wohnung ein neuer Mietvertrag – alte Konditionen '
        + 'laufen nicht mit, und jede Vermieterseite muss zustimmen.',
      ziele: [['Ringtausch ansehen', 'tausch']]
    },
    {
      id: 'inserieren',
      titel: 'Wie gebe ich ein Inserat auf?',
      gruppe: 'Inserieren',
      fragen: ['inserat aufgeben', 'wohnung anbieten', 'haus verkaufen', 'grundstueck inserieren',
        'wie lade ich bilder hoch'],
      schlag: ['inserier', 'inserat', 'anbiet', 'einstell', 'verkauf', 'vermiet', 'grundstueck', 'foto', 'bild'],
      antwort: 'Unter „Inserieren“, mit sechs Angebotsarten: Wohnung vermieten, WG-Zimmer, Wohnung tauschen, '
        + 'Wohnung verkaufen, Haus verkaufen, Grundstück verkaufen. Welche Felder erscheinen, richtet sich '
        + 'nach der Art.\n\nFotos lassen sich direkt im Formular hochladen, bis zu zehn Stück. Sie werden im '
        + 'Browser verkleinert und bleiben auf deinem Gerät. Das erste Bild ist das Titelbild.\n\n'
        + 'Was nicht auf ein Inseratsfoto gehört: Personen ohne deren Einwilligung, Kennzeichen, Namensschilder '
        + 'an Klingel oder Briefkasten. Innenräume einer bewohnten Wohnung nur mit Zustimmung der Mietpartei.',
      ziele: [['Inserat aufgeben', 'inserieren']]
    },

    /* ---------------- Recht und Schutz ---------------- */
    {
      id: 'betrug',
      titel: 'Ist dieses Inserat echt?',
      gruppe: 'Schutz',
      fragen: ['betrug', 'ist das ein fake', 'vorkasse verlangt', 'anbieter im ausland', 'kaution vorab'],
      schlag: ['betrug', 'fake', 'faelsch', 'abzock', 'vorkasse', 'vorab', 'unserioes', 'misstrau', 'echt'],
      muster: [/(kaution|geld|anzahl|gebuehr).{0,30}(vorab|voraus|vorher|vorkasse|ohne besichtigung)/,
        /(vorab|voraus|vorher).{0,30}(zahl|ueberweis|schick)/,
        /(ohne|keine) besichtigung/, /(ausland|western union)/],
      antwort: 'TrimmoTrade markiert die typischen Muster von selbst: auffällig niedriger Preis, Anbieter '
        + 'angeblich im Ausland, keine Besichtigung möglich, Zahlung vor der Übergabe.\n\n'
        + '<b>Die wichtigste Regel: Vor der Besichtigung wird nichts gezahlt.</b> Keine Kaution, keine '
        + '„Reservierungsgebühr“, keine Schlüsselversendung gegen Vorkasse. Wer das verlangt, betrügt – ohne '
        + 'Ausnahme.\n\nEbenso wenig gehören Schufa, Ausweiskopie oder Kontoauszüge in eine erste Anfrage.\n\n'
        + 'Diese Prüfung ist im freien Tarif enthalten und wird es bleiben. Betrugsschutz hinter eine '
        + 'Bezahlschranke zu stellen wäre zynisch.',
      ziele: [['Inhalt melden', 'recht/melden'], ['Zur Suche', 'suche']]
    },
    {
      id: 'mietpreisbremse',
      titel: 'Ist die Miete zu hoch?',
      gruppe: 'Schutz',
      fragen: ['mietpreisbremse', 'zu teuer', 'vergleichsmiete', 'ist die miete zulaessig'],
      schlag: ['mietpreisbrems', 'vergleichsmiet', 'mietspiegel', 'ueberteuert', 'zulaessig', 'wucher'],
      antwort: 'Jedes Inserat wird gegen die ortsübliche Vergleichsmiete gestellt, mit dem Abstand in Prozent.\n\n'
        + 'In Gebieten mit angespanntem Wohnungsmarkt darf die Miete bei Neuvermietung höchstens 10 % über '
        + 'der ortsüblichen Vergleichsmiete liegen. TrimmoTrade zeigt, wo das greifen könnte und wie viel dann '
        + 'zulässig wäre. Ausnahmen gelten unter anderem für Neubauten ab 2014 und umfassend modernisierte '
        + 'Wohnungen; darüber muss die Vermieterseite vor Vertragsschluss informieren.\n\n'
        + 'Der Vergleichswert in dieser Vorführung ist eine Rechengröße, kein amtlicher Mietspiegel.',
      ziele: [['Zur Suche', 'suche'], ['Nebenkosten prüfen', 'nebenkosten']]
    },
    {
      id: 'datenschutz',
      titel: 'Was passiert mit meinen Daten?',
      gruppe: 'Datenschutz',
      fragen: ['datenschutz', 'werden meine daten gespeichert', 'dsgvo', 'daten loeschen'],
      schlag: ['datenschutz', 'daten', 'dsgvo', 'speicher', 'loesch', 'privat', 'cookie'],
      antwort: 'TrimmoTrade rechnet vollständig in deinem Browser. Profil, Merkliste, Suchaufträge, Nachrichten '
        + 'und eigene Inserate liegen im Speicher dieses Geräts und verlassen es nicht. Es gibt kein '
        + 'Nutzerkonto und keine Übertragung an Dritte.\n\n'
        + 'Es werden keine Werkzeuge zur Reichweitenmessung eingesetzt und keine Profile über dein Verhalten '
        + 'gebildet. Deshalb erscheint auch kein Einwilligungsfenster.\n\n'
        + 'Unter „Meine Daten“ im Fußbereich kannst du alles als Datei sichern oder vollständig löschen.',
      ziele: [['Datenschutzerklärung', 'recht/datenschutz'], ['Impressum', 'recht/impressum']]
    },
    {
      id: 'kaution',
      titel: 'Wie hoch darf die Kaution sein?',
      gruppe: 'Schutz',
      fragen: ['kaution hoehe', 'drei monatsmieten', 'kaution in raten', 'kaution zurueck'],
      schlag: ['kaution', 'sicherheitsleist', 'monatsmiet', 'rate'],
      antwort: 'Höchstens <b>drei Nettokaltmieten</b> (§ 551 BGB). Alles darüber ist unwirksam – auch dann, '
        + 'wenn es im Vertrag steht.\n\n'
        + 'Du darfst in drei gleichen Monatsraten zahlen; die erste wird zu Mietbeginn fällig. Die '
        + 'Vermieterseite muss die Kaution getrennt vom eigenen Vermögen und verzinslich anlegen.\n\n'
        + 'Zurück gibt es sie nach Ende des Mietverhältnisses, sobald keine Ansprüche mehr offen sind. Ein '
        + 'Teilbetrag für die noch ausstehende Nebenkostenabrechnung darf befristet einbehalten werden.',
      ziele: [['Übergabeprotokoll', 'uebergabe'], ['Nebenkosten prüfen', 'nebenkosten']]
    },
    {
      id: 'wbs',
      titel: 'Brauche ich einen Wohnberechtigungsschein?',
      gruppe: 'Rechnen',
      fragen: ['wbs', 'wohnberechtigungsschein', 'gefoerderte wohnung', 'sozialwohnung'],
      schlag: ['wbs', 'wohnberechtig', 'gefoerdert', 'sozialwohn', 'einkommensgrenz'],
      antwort: 'Für geförderte Wohnungen, ja. Der Rechner unter „Werkzeuge“ ermittelt dein maßgebliches '
        + 'Jahreseinkommen mit allen Pauschalen und stellt es der Einkommensgrenze gegenüber – die du selbst '
        + 'setzen kannst, weil jedes Bundesland eine andere hat.\n\n'
        + 'Beantragt wird der Schein beim Wohnungsamt der Gemeinde, meist gegen eine kleine Gebühr, und gilt '
        + 'in der Regel ein Jahr.',
      ziele: [['WBS berechnen', 'wbs'], ['Wohngeld prüfen', 'wohngeld']]
    },
    {
      id: 'nebenkosten',
      titel: 'Meine Nebenkostenabrechnung stimmt nicht',
      gruppe: 'Rechnen',
      fragen: ['nebenkosten pruefen', 'betriebskosten', 'nachzahlung zu hoch', 'abrechnung falsch'],
      schlag: ['nebenkost', 'betriebskost', 'abrechn', 'nachzahl', 'heizkost', 'umlag'],
      antwort: 'Der Prüfer unter „Werkzeuge“ geht die üblichen Fehler durch: Welche Posten dürfen überhaupt '
        + 'umgelegt werden, kam die Abrechnung rechtzeitig, wurden die Heizkosten richtig verteilt.\n\n'
        + 'Zwei Fristen sind entscheidend: Die Abrechnung muss dir <b>binnen zwölf Monaten</b> nach Ende des '
        + 'Abrechnungszeitraums zugehen, sonst sind Nachforderungen ausgeschlossen (§ 556 BGB). Einwenden '
        + 'kannst du binnen zwölf Monaten nach Zugang.\n\n'
        + 'Verwaltungskosten und Instandhaltung sind nicht umlagefähig – sie tauchen trotzdem oft auf.',
      ziele: [['Nebenkosten prüfen', 'nebenkosten']]
    },

    /* ---------------- Anwendung ---------------- */
    {
      id: 'konto',
      titel: 'Wie melde ich mich an?',
      gruppe: 'Anwendung',
      fragen: ['registrieren', 'konto anlegen', 'anmelden', 'passwort vergessen', 'login',
        'was ist ein passkey', 'anmeldung mit google'],
      schlag: ['konto', 'passwort', 'kennwort', 'account', 'registrier', 'anmeld', 'einlogg', 'login', 'zugang'],
      muster: [/(passwort|kennwort|zugang).{0,20}(vergess|verlor|zuruecksetz|aendern)/],
      antwort: 'Über einen der vier Wege auf der Startseite: <b>Passkey</b> (Face ID, Windows Hello oder '
        + 'Fingerabdruck), Google, Microsoft, Apple – oder mit deiner E-Mail-Adresse und einem Einmalcode.\n\n'
        + 'Ein Passwort gibt es in keinem der Wege. Beim Passkey entsteht der Schlüssel im Sicherheitschip '
        + 'deines Geräts und verlässt ihn nie; beim E-Mail-Weg bekommst du einen Code, der zehn Minuten gilt. '
        + 'Es gibt also nichts zu vergessen und nichts, was jemand abfischen könnte.\n\n'
        + 'Vergisst du, mit welchem Weg du dich angemeldet hast: Der E-Mail-Weg funktioniert immer, solange '
        + 'du die Adresse abrufen kannst.',
      ziele: [['Konto ansehen', 'konto'], ['Profil ausfüllen', 'profil']]
    },
    {
      id: 'stufen',
      titel: 'Was bedeutet die Vertrauensstufe?',
      gruppe: 'Schutz',
      fragen: ['vertrauensstufe', 'was heisst anbieter ungeprueft', 'ausweis geprueft',
        'wie erhoehe ich meine stufe'],
      schlag: ['vertrauensstuf', 'stufe', 'ungeprueft', 'geprueft', 'verifizier', 'identitaet'],
      antwort: 'Fünf Stufen, von 0 bis 4: nichts bestätigt, E-Mail bestätigt, Gerät oder Anbieterkonto '
        + 'bestätigt, Telefonnummer bestätigt, Ausweis geprüft.\n\n'
        + 'Sie steht an jedem Inserat, weil dort der Nutzen liegt: Ein Konto auf Stufe 0 oder 1 ist in Minuten '
        + 'angelegt – und nach einer Sperre genauso schnell wieder. Das heißt nicht, dass etwas nicht stimmt; '
        + 'es heißt, dass die üblichen Regeln besonders gelten.\n\n'
        + 'Die eigene Stufe hebst du unter „Konto“: Passkey hinterlegen bringt Stufe 2, eine bestätigte '
        + 'Telefonnummer Stufe 3, eine Ausweisprüfung Stufe 4. <b>Für das Suchen brauchst du keine hohe '
        + 'Stufe</b> – sie zählt vor allem, wenn du selbst inserierst.',
      ziele: [['Zum Konto', 'konto'], ['Inhalt melden', 'recht/melden']]
    },
    {
      id: 'daten-weg',
      titel: 'Meine Daten sind verschwunden',
      gruppe: 'Anwendung',
      fragen: ['daten weg', 'merkliste leer', 'alles verschwunden', 'anderes geraet'],
      schlag: ['weg', 'verschwund', 'verlor', 'leer', 'geraet', 'wiederherstell', 'sicherung'],
      antwort: 'Alles liegt im Speicher dieses Browsers – auch die Anmeldung. Es verschwindet, wenn die '
        + 'Browserdaten gelöscht werden, im privaten Modus beim Schließen des Fensters – und es ist auf einem '
        + 'anderen Gerät oder in einem anderen Browser von vornherein nicht da. Dort meldest du dich neu an; '
        + 'Merkliste und Profil wandern deshalb nicht mit.\n\n'
        + 'Vorbeugen lässt sich das unter „Meine Daten“ im Fußbereich: Dort sicherst du den Stand als Datei.\n\n'
        + 'Der Dokumententresor liegt getrennt davon und wird dabei bewusst nicht mitgesichert – '
        + 'verschlüsselte Dateien in eine Klartextdatei zu exportieren wäre das Gegenteil dessen, wofür er da ist.',
      ziele: [['Datenschutzerklärung', 'recht/datenschutz']]
    },
    {
      id: 'melden',
      titel: 'Ich möchte ein Inserat melden',
      gruppe: 'Schutz',
      fragen: ['inserat melden', 'beschwerde', 'rechtswidrig', 'diskriminierung im inserat'],
      schlag: ['meld', 'beschwer', 'rechtswidrig', 'anzeig', 'diskriminier', 'verstoss'],
      antwort: 'Über den Meldeweg unter „Rechtliches“. Gemeldet werden können erfundene Inserate, '
        + 'Zahlungsaufforderungen vor der Besichtigung, Angebote ohne Verfügungsbefugnis und Formulierungen, '
        + 'die nach Herkunft, Religion, Geschlecht, Behinderung oder Alter aussortieren.\n\n'
        + 'Der Eingang wird bestätigt, und über die Entscheidung ergeht eine begründete Mitteilung.',
      ziele: [['Inhalt melden', 'recht/melden']]
    }
  ];

  /* ------------------------- Abgleich ------------------------- */

  /* Vorberechnete Wortlisten – bei jedem Tastendruck neu zu stemmen wäre
     Verschwendung. */
  /* Die Wissensbasis ist je Sprache eine eigene, keine übersetzte: Der
     Abgleich läuft über Wortstämme und Muster, und deutsche Stämme
     finden in „how do I cancel“ nichts. Englische Themen stehen in
     hilfe-en.js und tragen sich hier ein. */
  const TABELLEN = Object.create(null);
  TABELLEN.de = THEMEN;

  let aktive = THEMEN;
  let INDEX = [];

  function indizieren() {
    const sprache = TT.i18n ? TT.i18n.sprache() : 'de';
    aktive = TABELLEN[sprache] || TABELLEN.de;
    INDEX = aktive.map((t) => ({
      thema: t,
      schlag: t.schlag.map(formen),
      muster: t.muster || [],
      fragen: t.fragen.map((f) => woerter(f)),
      titelWorte: woerter(t.titel)
    }));
  }

  function themenEintragen(sprache, liste) {
    TABELLEN[sprache] = liste;
    indizieren();
  }

  indizieren();

  const MINDEST = 2.2;

  function bewerten(eingabe) {
    const w = woerter(eingabe);
    if (!w.length) return [];
    const roh = normalisieren(eingabe);
    const wf = wortFormen(eingabe);
    const treffer = INDEX.map((eintrag) => {
      let punkte = 0;
      wf.forEach((formenDesWorts) => {
        const wort = formenDesWorts[1];
        /* Deutsch setzt Wörter zusammen: „Wohnungstausch“, „Nebenkosten-
           abrechnung“, „Mietpreisbremse“. Ein Abgleich, der nur den Anfang
           eines Wortes prüft, findet davon nichts – deshalb wird das
           Schlagwort auch mitten im Wort gesucht, und zwar in allen Formen
           gegen alle Formen. */
        eintrag.schlag.forEach((swFormen, i) => {
          const gewicht = 1 + Math.max(0, (eintrag.schlag.length - i)) / eintrag.schlag.length;
          let bestes = 0;
          formenDesWorts.forEach((a) => {
            swFormen.forEach((bWort) => {
              if (a === bWort) bestes = Math.max(bestes, 1.6);
              else if (bWort.length > 3 && a.indexOf(bWort) >= 0) bestes = Math.max(bestes, 1.0);
              else if (a.length > 3 && bWort.indexOf(a) === 0) bestes = Math.max(bestes, 0.8);
            });
          });
          punkte += bestes * gewicht;
        });
        eintrag.titelWorte.forEach((tw) => { if (wort === tw) punkte += 0.8; });
        eintrag.fragen.forEach((fw) => { if (fw.indexOf(wort) >= 0) punkte += 0.55; });
      });
      /* Muster fangen, was aus Einzelwörtern nicht hervorgeht: „Kaution
         vorab“ ist Betrug, nicht eine Frage zur Kautionshöhe. */
      eintrag.muster.forEach((m) => { if (m.test(roh)) punkte += 4.5; });
      /* Kurze Eingaben dürfen nicht dadurch gewinnen, dass sie viele
         Wörter haben – deshalb auf die Länge beziehen. */
      const norm = punkte / Math.sqrt(w.length);
      return { thema: eintrag.thema, punkte: Math.round(norm * 100) / 100 };
    });
    return treffer.filter((x) => x.punkte > 0).sort((a, b) => b.punkte - a.punkte);
  }

  /* Liefert entweder eine Antwort oder das Eingeständnis, es nicht zu
     wissen – samt der nächstbesten Themen. Raten wäre schlimmer. */
  function antworten(eingabe) {
    const rang = bewerten(eingabe);
    if (!rang.length || rang[0].punkte < MINDEST) {
      return { sicher: false, vorschlaege: rang.slice(0, 3).map((x) => x.thema) };
    }
    /* Wenn zwei Themen fast gleichauf liegen, ist Nachfragen ehrlicher
       als eine Antwort, die vielleicht am Thema vorbeigeht. */
    if (rang.length > 1 && rang[1].punkte > rang[0].punkte * 0.86) {
      return { sicher: false, unklar: true, vorschlaege: rang.slice(0, 3).map((x) => x.thema) };
    }
    return { sicher: true, thema: rang[0].thema, punkte: rang[0].punkte };
  }

  const thema = (id) => aktive.find((t) => t.id === id) || null;

  function text(t) {
    return typeof t.antwort === 'function' ? t.antwort() : t.antwort;
  }

  /* Themen für die Startauswahl: je Gruppe das erste. */
  function einstieg() {
    const gesehen = {};
    return aktive.filter((t) => {
      if (gesehen[t.gruppe]) return false;
      gesehen[t.gruppe] = true;
      return true;
    });
  }

  const GRUPPEN = () => {
    const g = {};
    aktive.forEach((t) => { (g[t.gruppe] = g[t.gruppe] || []).push(t); });
    return g;
  };

  TT.hilfe = {
    MINDEST, themenEintragen, indizieren,
    get THEMEN() { return aktive; },
    normalisieren, woerter, wortFormen, bewerten, antworten, thema, text, einstieg, GRUPPEN
  };
})(window.TT = window.TT || {});
