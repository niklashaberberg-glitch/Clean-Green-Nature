/* =====================================================================
   TrimmoTrade – English

   Der Schlüssel ist der deutsche Satz, so wie er im Quelltext steht,
   auf eine Zeile gebracht. Fehlt ein Eintrag, erscheint der deutsche
   Satz – nie ein leerer Platz und nie ein Bezeichner.

   {0}, {1} … stehen für die Werte, die zur Laufzeit eingesetzt werden.
   Ihre Reihenfolge darf sich unterscheiden: Deutsch stellt Verben und
   Zahlen anders als Englisch, und eine Übersetzung, die sich daran
   nicht rühren dürfte, wäre keine.

   Was bewusst nicht übersetzt wird:
   - Eigennamen: TrimmoTrade, Köln, Ehrenfeld, Prenzlauer Berg.
   - Deutsche Rechtsbegriffe, für die es keine gleichbedeutende
     englische Entsprechung gibt (Kaltmiete, Mietspiegel, Kaution,
     Schufa, Kleingewerbe). Sie stehen im Original, mit einer knappen
     Erklärung dahinter – eine erfundene Übersetzung wäre schlechter
     als das Wort, nach dem man suchen kann.
   - Paragraphen: „§ 551 BGB“ bleibt „§ 551 BGB“.
   ===================================================================== */
(function (TT) {
  'use strict';
  const e = (tabelle) => TT.i18n.eintragen('en', tabelle);

  /* ------------------------- Schale, überall ------------------------- */

  e({
    'TrimmoTrade': 'TrimmoTrade',
    'TrimmoTrade, zur Startseite': 'TrimmoTrade, to the home page',
    'Zum Inhalt springen': 'Skip to content',
    'Hauptbereiche': 'Main sections',
    'Schnellsuche': 'Quick search',
    'Schnellsuche (Strg + K)': 'Quick search (Ctrl + K)',
    'Suchaufträge': 'Saved searches',
    'Vergleich': 'Compare',
    'Vergleichen': 'Compare',
    'Merken': 'Save',
    'Ansehen': 'View',
    'Darstellung wechseln': 'Switch appearance',
    'Hell oder dunkel': 'Light or dark',
    'Inserieren': 'Post a listing',
    'Konto': 'Account',
    'Hilfe': 'Help',
    'Tarife': 'Plans',
    'Werkzeuge': 'Tools',
    'Dokumententresor': 'Document vault',
    'Tastaturbefehle': 'Keyboard shortcuts',
    'Meine Daten': 'My data',
    'Schließen': 'Close',
    'Verstanden': 'Got it',
    'Weitermachen': 'Continue',
    'Karte': 'Map',
    'Inhalt': 'Content',
    'Anzeige': 'Ad',
    'Esc': 'Esc',
    'Strg': 'Ctrl',

    /* Navigation */
    'Start': 'Home',
    'Suchen': 'Search',
    'Ringtausch': 'Swap chains',
    'Merkliste': 'Saved',
    'Nachrichten': 'Messages',
    'Profil': 'Profile',

    /* Rechtliches im Fußbereich */
    'Impressum': 'Legal notice',
    'Datenschutz': 'Privacy',
    'AGB': 'Terms',
    'Widerruf': 'Right of withdrawal',
    'Verträge kündigen': 'Cancel contracts',
    'Inhalt melden': 'Report content',
    'Barrierefreiheit': 'Accessibility',

    'führt Mietmarkt, WG-Suche und Wohnungstausch in einer Oberfläche zusammen.':
      'brings the rental market, flatshare search and apartment swaps together in one interface.',
    'Vorführfassung mit erzeugtem Beispielbestand. Alle Angaben, Anbieter und Adressen sind erfunden. Rechtliche Erläuterungen sind allgemeine Hinweise und ersetzen keine Beratung. Deine Eingaben bleiben im Browser dieses Geräts.':
      'Demo version with a generated sample inventory. All details, providers and addresses are fictitious. Legal explanations are general notes and do not replace advice. Everything you enter stays in this device’s browser.',

    /* Preiszeile und Karten */
    'warm · {1} kalt': 'incl. bills · {1} base rent',
    '{4} ansehen': 'View {4}',
    'Warum sehe ich das?': 'Why am I seeing this?',
    'ohne Anzeigen lesen': 'read without ads',
    'Ohne Anzeigen lesen': 'Read without ads',

    /* Datei sichern, wenn der Browser nichts ablegen darf */
    'In dieser Umgebung darf die Seite keine Datei ablegen. Der vollständige Inhalt steht hier zum Kopieren – speichere ihn als':
      'This environment does not let the page save a file. The full content is here to copy – save it as',
    'Kopieren': 'Copy',
    /* Gründerjahr */
    'Dein Gründerjahr endet': 'Your founder year ends',
    ', am {2}. Danach läuft nichts weiter und es wird nichts abgebucht – der freie Tarif steht dir offen, Plus nur, wenn du dich aktiv dafür entscheidest.':
      ', on {2}. Nothing continues after that and nothing is charged – the free plan stays open to you, and Plus only if you actively choose it.',
    'Tarife ansehen': 'See plans',
    'Hinweis ausblenden': 'Hide notice',
    'Dein Gründerjahr ist abgelaufen.': 'Your founder year has ended.',
    'Merkliste, Profil und Notizen sind vollständig erhalten; nur die Plus-Funktionen ruhen.':
      'Your saved list, profile and notes are fully intact; only the Plus features are paused.',

    /* Schnellsuche */
    'Stadt, Viertel, Stichwort oder Bereich…': 'City, neighbourhood, keyword or section…',

    /* Sperrhinweis */
    'Im freien Tarif:': 'On the free plan:',
    'Mit Plus:': 'With Plus:',
    'im Monat, monatlich kündbar – oder {6} im Jahr.':
      'per month, cancellable monthly – or {6} per year.',
    'Was Plus nicht kauft': 'What Plus does not buy',
    'Keine bessere Platzierung, keinen Vorrang bei Vermietern und keinen Frühzugang zu Inseraten. Alle sehen jedes Inserat in derselben Sekunde.':
      'No better placement, no priority with landlords and no early access to listings. Everyone sees every listing in the same second.',
    'Alle Unterschiede ansehen': 'See all differences',
    'Plus in dieser Vorführung aktivieren': 'Activate Plus in this demo',
    /* Bezahlte Plätze */
    'Diese Inserate stehen dort, weil die anbietende Seite für den Platz bezahlt hat. TrimmoTrade zeigt bezahlte Plätze':
      'These listings appear there because the advertiser paid for the placement. TrimmoTrade shows paid placements',
    'getrennt und beschriftet': 'separately and labelled',
    '– nie zwischen den Treffern.': '– never among the results.',
    'Was das nicht bedeutet:': 'What that does not mean:',
    'Die Reihenfolge deiner Treffer darunter ändert sich dadurch nicht. Sie folgt weiter deinem Profil.':
      'The order of your results below is unaffected. It still follows your profile.',
    'Ein bezahlter Platz sagt nichts über die Wohnung. Prüfhinweis, Vergleichsmiete und Chancen rechnet TrimmoTrade hier genauso wie überall.':
      'A paid placement says nothing about the apartment. TrimmoTrade calculates the check notice, benchmark rent and your chances here exactly as everywhere else.',
    'Kein Inserat verschwindet, weil ein anderes bezahlt hat. Die Liste bleibt vollständig.':
      'No listing disappears because another one paid. The list stays complete.',
    'Höchstens {0} bezahlte Plätze über einer Trefferliste. Mehr, und der eigentliche Inhalt begänne unterhalb des Bildschirmrands.':
      'At most {0} paid placements above a result list. Any more and the actual content would start below the fold.',
    'Eigenes Inserat hervorheben': 'Promote your own listing',

    /* Anzeigen */
    'TrimmoTrade ist im freien Tarif vollständig nutzbar – die Suche, die Karte, der Prüfhinweis, die Vergleichsmiete und alle Rechner. Bezahlt wird das über Anzeigen.':
      'TrimmoTrade is fully usable on the free plan – the search, the map, the check notice, the benchmark rent and every calculator. Ads pay for it.',
    'Was wir dabei nicht tun:': 'What we do not do:',
    'Anzeigen sehen nie aus wie ein Inserat und stehen nie in der Trefferreihenfolge.':
      'Ads never look like a listing and never sit in the result order.',
    'Kein Werbetreibender bekommt Einfluss darauf, welche Wohnungen dir angezeigt werden.':
      'No advertiser gets any influence over which apartments you are shown.',
    'Es werden keine Daten über dich an Werbetreibende gegeben – die Auswahl entsteht im Browser.':
      'No data about you is passed to advertisers – the selection happens in your browser.',
    'In dieser Vorführung sind alle Anzeigen erfunden und führen nirgendwohin.':
      'In this demo all ads are fictitious and lead nowhere.',

    /* Tastaturbefehle */
    'Schnellsuche über Bereiche, Städte, Viertel und Inserate':
      'Quick search across sections, cities, neighbourhoods and listings',
    'Schnellsuche, wenn kein Eingabefeld aktiv ist': 'Quick search when no input field is focused',
    'Fenster und Schnellsuche schließen': 'Close dialogs and quick search',
    'Direkt in einen Hauptbereich springen': 'Jump straight to a main section',
    'Auf einer Objektseite: merken': 'On a listing page: save',
    'Auf einer Objektseite: zum Vergleich': 'On a listing page: add to compare',
    'Ziehen zum Verschieben, Mausrad oder': 'Drag to pan, scroll wheel or',
    'zum Zoomen, Pfeiltasten bei Fokus': 'to zoom, arrow keys when focused',

    /* Meine Daten */
    'TrimmoTrade speichert alles ausschließlich im Speicher dieses Browsers. Es gibt keinen Server, kein Konto und keine Übertragung an Dritte.':
      'TrimmoTrade stores everything solely in this browser’s storage. There is no server, no account and no transfer to third parties.',
    'Merkungen': 'saved items',
    '{1} Suchaufträge': '{1} saved searches',
    'Nachrichtenverläufe': 'message threads',
    'eigene Inserate': 'of your own listings',
    'Belegter Speicher: rund {4} kB': 'Storage used: about {4} kB',
    'Beim Leeren der Browserdaten verschwindet auch dieser Stand.':
      'Clearing your browser data also removes this state.',
    'Als Datei sichern': 'Save as a file',
    'Alles zurücksetzen': 'Reset everything'
  });

  /* ------------------------- Startseite ------------------------- */

  e({
    'Deine Bewerbungen': 'Your applications',
    'alle ansehen': 'see all',
    'Mietwohnungen, Eigentum, WG-Zimmer und Wohnungstausch – eine Suche, ein Profil, eine Bewerbermappe.':
      'Rentals, property to buy, flatshare rooms and apartment swaps – one search, one profile, one application folder.',
    'Stadt, Viertel oder Stichwort suchen': 'Search city, neighbourhood or keyword',
    'Neu und passend': 'New and matching',
    'zur vollen Suche': 'to the full search',
    'Was TrimmoTrade anders macht': 'What TrimmoTrade does differently',
    'Ringtausch statt Sackgasse': 'Swap chains instead of dead ends',
    'Der direkte Wohnungstausch scheitert am doppelten Zufall. TrimmoTrade sucht Ketten über mehrere Haushalte – gerade sind {11} Dreierketten offen.':
      'A direct apartment swap fails on a double coincidence. TrimmoTrade looks for chains across several households – {11} three-way chains are open right now.',
    'in vier Bildern erklärt': 'explained in four pictures',
    'Ketten ansehen': 'See chains',

    'Preis mit Vergleichswert': 'Price with a benchmark',
    'Jedes Inserat wird gegen die ortsübliche Vergleichsmiete gestellt – samt Hinweis, wo die Mietpreisbremse greifen könnte.':
      'Every listing is set against the local benchmark rent (ortsübliche Vergleichsmiete) – including a note on where the rent cap (Mietpreisbremse) might apply.',

    'Vertragslupe': 'Contract magnifier',
    'Staffelmiete, Schönheitsreparaturen, Abstandszahlung, Kaution über drei Mieten: TrimmoTrade liest den Text und erklärt, was das bedeutet.':
      'Stepped rent, cosmetic repairs, key money, a deposit above three months’ rent: TrimmoTrade reads the text and explains what it means.',

    'Betrugsmuster erkennen': 'Spotting fraud patterns',
    'Zu billig, Anbieter angeblich im Ausland, keine Besichtigung, Kaution vorab – die typischen Muster werden markiert statt versteckt.':
      'Too cheap, a provider supposedly abroad, no viewing, deposit up front – the usual patterns get flagged instead of hidden.',

    'Echte Monatskosten': 'Real monthly costs',
    'Warmmiete plus Strom, Internet, Rundfunkbeitrag – und was der Einzug einmalig kostet, inklusive Kaution und Küche.':
      'Rent including bills plus electricity, internet and the broadcasting fee – and what moving in costs once, deposit and kitchen included.',

    'Reihenfolge ohne Bezahlung': 'Ranking nobody can buy',
    'Sortiert wird nach deinem Profil. Es gibt keine gekauften Plätze, und die Bewertung legt offen, warum etwas oben steht. Auch Plus kauft keinen Platz weiter oben.':
      'Sorting follows your profile. There are no bought positions, and the score shows why something is at the top. Plus does not buy a higher position either.',

    'Doppelte Inserate erkennen': 'Spotting duplicate listings',
    'Dieselbe Wohnung steht oft zweimal im Angebot, von zwei Maklern. TrimmoTrade merkt das und sagt es, bevor du dich zweimal bewirbst.':
      'The same apartment is often listed twice, by two agents. TrimmoTrade notices and tells you before you apply twice.',

    'Auch nach dem Einzug': 'After you move in, too',
    'Übergabeprotokoll, Umzugsplan und die Prüfung der Nebenkostenabrechnung – die Werkzeuge hören nicht auf, wenn der Vertrag unterschrieben ist.':
      'Handover report, moving plan and a check of the service-charge statement – the tools do not stop once the contract is signed.',

    'Rechnen und prüfen – von der ersten Frage „was kann ich mir leisten“ bis zur Nebenkostenabrechnung zwei Jahre später.':
      'Calculate and check – from the first question, “what can I afford”, to the service-charge statement two years later.'
  });

  /* ------------------------- Suche ------------------------- */

  e({
    'Wohnungen, WG-Zimmer und Tauschangebote suchen':
      'Search apartments, flatshare rooms and swap offers',
    'Angebotsart': 'Offer type',
    'Freitextsuche': 'Free-text search',
    'Stichwort, Straße, Viertel, Anbieter…': 'Keyword, street, neighbourhood, provider…',
    'Sortierung': 'Sorting',
    'Darstellung': 'View',
    'Nur Liste': 'List only',
    'Liste und Karte': 'List and map',
    'Nur Karte': 'Map only',
    'Filter': 'Filters',
    'Suchergebnisse': 'Search results',
    'Zuschnitt': 'Layout',
    'Gebäude': 'Building',
    'Energieklasse bis': 'Energy class up to',
    'egal': 'any',
    'Einzug': 'Move-in',
    'frei spätestens am': 'available no later than',
    'Nur zeigen, wenn': 'Only show if',
    'Als Suchauftrag merken': 'Save as a search',
    'neu in 7 Tagen': 'new in 7 days',
    'Keine Treffer': 'No results',
    '&nbsp;Treffer zeigen': '&nbsp;show results',
    'TrimmoTrade merkt sich diese Filter und zeigt dir beim nächsten Besuch, was seither neu hinzugekommen ist.':
      'TrimmoTrade remembers these filters and shows you what has been added since, next time you visit.',
    'Objekte passen aktuell.': 'listings match right now.',
    'Anlegen': 'Create',
    'Bezahlte Platzierungen': 'Paid placements',
    'Top-Anzeigen': 'Top ads',
    'Warum steht das hier?': 'Why is this here?',
    'Bezahlte Platzierung der anbietenden Seite. Sie ändert nichts an der Reihenfolge darunter – die folgt weiter deinem Profil.':
      'A paid placement by the advertiser. It changes nothing about the order below – that still follows your profile.',
    'Warum steht „{1}“ ganz oben?': 'Why is “{1}” at the top?',
    'TrimmoTrade sortiert nach deinem Profil, nicht nach bezahlter Platzierung. Für dieses Inserat zählen vor allem {2}. Insgesamt ergibt das {3} von 100 Punkten.':
      'TrimmoTrade sorts by your profile, not by paid placement. For this listing what counts most is {2}. Altogether that comes to {3} out of 100 points.',
    'Bezahlte Plätze gibt es getrennt davon: Sie stehen über der Liste, tragen die Überschrift „Top-Anzeigen“ und verschieben in der Liste darunter nichts.':
      'Paid placements exist separately from that: they sit above the list, carry the heading “Top ads” and move nothing in the list below.',
    'Gewichtung im Profil ändern': 'Change the weighting in your profile',
    '– dann ändert sich auch die Reihenfolge.': '– then the order changes too.'
  });

  /* ------------------------- Ringtausch ------------------------- */

  e({
    'Beim direkten Tausch müssen zwei Menschen exakt das Gegenteil voneinander wollen – das passiert fast nie. In einer Kette reicht es, wenn jeder die Wohnung des Nächsten möchte. TrimmoTrade durchsucht alle Angebote nach solchen geschlossenen Ketten.':
      'A direct swap needs two people to want exactly the opposite of each other – which almost never happens. In a chain it is enough that each person wants the next one’s apartment. TrimmoTrade searches every offer for such closed chains.',
    'In vier Bildern erklärt': 'Explained in four pictures',
    'gefunden': 'found',
    'direkt · {6} Dreier · {7} Vierer': 'direct · {6} three-way · {7} four-way',
    'nur Ketten mit meinem Angebot': 'only chains including my offer',
    'höchstens': 'at most',
    'Güte ab {10} %': 'quality from {10} %',
    'Güte': 'Quality',
    'schwächstes Glied: {6} %': 'weakest link: {6} %',
    'von {8} Vermieterzustimmungen liegen vor': 'of {8} landlord approvals are in',
    'Kette anstoßen': 'Start the chain',
    'direkte Tausche': 'direct swaps',
    'Ketten insgesamt': 'chains in total',
    'würden deine Wohnung nehmen': 'would take your apartment',
    'Wohnungen passen dir': 'apartments suit you',

    'Dein Tauschangebot fehlt noch': 'Your swap offer is still missing',
    'Ohne eigene Wohnung im Topf kann TrimmoTrade dich in keine Kette einbauen. Das Anlegen dauert zwei Minuten.':
      'Without your own apartment in the pool, TrimmoTrade cannot fit you into any chain. Adding it takes two minutes.',
    'Angebot anlegen': 'Create an offer',
    'Dein Angebot': 'Your offer',
    'Zi. · {2} m² · {3} warm': 'rooms · {2} m² · {3} incl. bills',
    'gesucht:': 'looking for:',
    'ab {7} Zi., {8} m², bis': 'from {7} rooms, {8} m², up to',
    'Ändern': 'Edit',
    'Entfernen': 'Remove',
    'Wie ein Tausch praktisch abläuft': 'How a swap works in practice',
    'Kette bestätigen': 'Confirm the chain',
    'Alle Beteiligten sagen zu. Ein Wackelkandidat reißt die ganze Kette.':
      'Everyone involved says yes. One waverer breaks the whole chain.',
    'Vermieter fragen': 'Ask the landlords',
    'Jede Vermieterseite muss zustimmen. Genossenschaften und kommunale Gesellschaften sind das gewohnt, private Eigentümer meist nicht.':
      'Every landlord has to agree. Housing co-operatives and municipal companies are used to this; private owners usually are not.',
    'Termine abstimmen': 'Line up the dates',
    'Alle Umzüge sollten in dieselbe Woche fallen – sonst zahlt jemand doppelt Miete.':
      'All the moves should fall in the same week – otherwise someone pays double rent.',
    'Verträge schließen': 'Sign the contracts',
    'Rechtlich ist es kein Tausch, sondern für jede Wohnung ein neuer Mietvertrag. Alte Konditionen laufen nicht mit.':
      'Legally it is not a swap but a new tenancy agreement for each apartment. Old terms do not carry over.',
    'Übergaben protokollieren': 'Record the handovers',
    'Zählerstände, Mängel, Schlüsselanzahl – jede Wohnung einzeln.':
      'Meter readings, defects, number of keys – each apartment separately.',
    'Ein Anspruch auf Zustimmung besteht nicht. Manche Vermieter verlangen dieselben Unterlagen wie bei jeder Neuvermietung – die Bewerbermappe im Profil hilft auch hier.':
      'There is no legal right to approval. Some landlords ask for the same documents as for any new letting – the application folder in your profile helps here too.',
    'Das Ganze als Bild': 'The whole thing as a picture',
    'Alle Tauschangebote': 'All swap offers',
    'Alle in der Suche ansehen': 'See them all in the search',
    'TrimmoTrade hat eine Nachricht vorbereitet, die an alle Beteiligten geht. In dieser Vorführung wird nichts wirklich verschickt – kopier den Text und nutze ihn, wie du magst.':
      'TrimmoTrade has prepared a message to go to everyone involved. Nothing is actually sent in this demo – copy the text and use it however you like.',
    'Zurück': 'Back',
    'Schritt {3} von': 'Step {3} of'
  });

  /* ------------------------- Marktdaten ------------------------- */

  e({
    'Marktdaten und Preisverlauf': 'Market data and price history',
    'Wie sich die Mieten je Viertel über drei Jahre entwickelt haben – und welche Viertel gerade am schnellsten teurer werden.':
      'How rents per neighbourhood have moved over three years – and which neighbourhoods are getting more expensive fastest right now.',
    'Mietentwicklung je Quadratmeter, alle drei Monate': 'Rent trend per square metre, every three months',
    'Monat': 'Month',
    'im Mittel': 'on average',
    'Heute in': 'Today in',
    'Das aktuelle Preisniveau je Viertel siehst du auch im freien Tarif – hier und als Wärmefläche auf der Karte.':
      'You can see the current price level per neighbourhood on the free plan too – here and as a heat layer on the map.',
    'Der Verlauf gehört zu Plus': 'The history is part of Plus',
    'Was der freie Tarif nicht zeigt: die 36-Monats-Reihe je Viertel, der Vergleich mehrerer Viertel nebeneinander, die Veränderung im letzten Jahr und der Stadtdurchschnitt als Bezugslinie.':
      'What the free plan does not show: the 36-month series per neighbourhood, several neighbourhoods side by side, the change over the past year, and the city average as a reference line.',
    'Das ist eine der wenigen Funktionen hinter der Schranke, weil man sie beim Eingrenzen der Suche immer wieder aufruft – anders als etwa das Übergabeprotokoll, das man einmal braucht und das deshalb frei bleibt.':
      'This is one of the few features behind the barrier, because you come back to it again and again while narrowing your search – unlike, say, the handover report, which you need once and which therefore stays free.',
    'Angebotsmieten je Quadratmeter, Monat für Monat über drei Jahre. Wähle unten ein Viertel und stell bis zu zwei weitere daneben.':
      'Asking rents per square metre, month by month over three years. Pick a neighbourhood below and set up to two more beside it.',
    'Stadt': 'City',
    'Viertel': 'Neighbourhood',
    'Angebotsmiete in': 'Asking rent in',
    'in zwölf Monaten': 'over twelve months',
    'in drei Jahren': 'over three years',
    '. von': 'of',
    'teuerstes Viertel in': 'most expensive neighbourhood in',
    'Verlauf': 'History',
    'Bis zu zwei Viertel danebenstellen': 'Add up to two neighbourhoods alongside',
    'Mehr als drei Linien lassen sich nicht mehr sicher unterscheiden – deshalb ist bei zwei Vergleichsvierteln Schluss.':
      'More than three lines can no longer be told apart reliably – which is why it stops at two comparison neighbourhoods.',
    'Alle Viertel in {18} heute': 'All neighbourhoods in {18} today',
    'Klick auf ein Viertel, um es oben in den Verlauf zu holen.':
      'Click a neighbourhood to pull it into the chart above.',
    'Was daraus folgt': 'What follows from this',
    'In {21} liegt die Angebotsmiete bei {22} €/m² und ist binnen zwölf Monaten um {23} % {24}. Am schnellsten zieht gerade {25} an ({26} % im Jahr) – solche Viertel sind oft noch bezahlbar, aber nicht mehr lange.':
      'In {21} the asking rent stands at {22} €/m² and has {24} by {23} % within twelve months. The fastest riser right now is {25} ({26} % a year) – neighbourhoods like that are often still affordable, but not for much longer.',
    'Für die Praxis heißt das zweierlei. Erstens: Eine Wohnung, die heute {27} €/m² kostet, wird bei gleichbleibendem Tempo in fünf Jahren {28} €/m² kosten – für dich als Bestandsmieter nicht, denn deine Miete steigt nur nach den Regeln des Mietvertrags. Wer bleibt, spart. Zweitens: Weicht ein Inserat stark vom Verlauf ab, lohnt der Blick in die Vergleichsmiete auf der Objektseite.':
      'In practice that means two things. First: an apartment costing {27} €/m² today will cost {28} €/m² in five years at the same pace – but not for you as a sitting tenant, because your rent only rises under the rules of your contract. Staying put saves money. Second: if a listing deviates sharply from the trend, it is worth looking at the benchmark rent on the listing page.',
    'Angebotsmieten, nicht Bestandsmieten. Sie liegen systematisch höher, weil nur neu vermietete Wohnungen einfließen. In dieser Vorführung sind die Reihen erzeugt.':
      'Asking rents, not rents under existing contracts. They are systematically higher because only newly let apartments feed in. In this demo the series are generated.'
  });

  /* ------------------------- Hilfe ------------------------- */

  e({
    'Alle Themen auf einen Blick. Für eine einzelne Frage genügt das Hilfefenster unten rechts – es ist auf jeder Seite erreichbar.':
      'Every topic at a glance. For a single question the help window at the bottom right is enough – it is available on every page.',
    'Das hier ist kein Sprachmodell': 'This is not a language model',
    'Die Hilfe rechnet im Browser und ordnet deine Frage einer von {2} hinterlegten Antworten zu. Sie erfindet nichts, und wo sie unsicher ist, sagt sie es und fragt nach. Führt das nicht weiter, geht die Zusammenfassung auf deinen Klick an {3} – dort schaut ein Mensch darauf.':
      'The help runs in your browser and matches your question to one of {2} stored answers. It invents nothing, and where it is unsure it says so and asks. If that leads nowhere, one click sends the summary to {3} – where a person looks at it.',
    'Frage stellen': 'Ask a question',
    'Direkt ans Service-Team': 'Straight to the service team',
    'Deine Frage': 'Your question',
    'Frage eingeben…': 'Type your question…',
    'Frage senden': 'Send question',
    'alle Themen': 'all topics',
    'Ans Service-Team weitergeben': 'Pass on to the service team',
    'Die Zusammenfassung dieses Gesprächs geht an': 'The summary of this conversation goes to',
    '. Sie wird gleich vollständig angezeigt – abgeschickt wird sie erst, wenn du es auslöst.':
      '. It will be shown in full in a moment – it is only sent once you trigger it.',
    'Dein Name (freiwillig)': 'Your name (optional)',
    'Deine E-Mail für die Antwort': 'Your email for the reply',
    'ohne Adresse kann niemand antworten': 'without an address nobody can reply',
    'Worum geht es? Was fehlt dir noch?': 'What is it about? What is still missing?',
    'Je konkreter, desto schneller die Antwort.': 'The more specific, the faster the answer.',
    'Nachricht anzeigen': 'Show message',
    'Was übertragen wird – und was nicht': 'What is transmitted – and what is not',
    'Übertragen wird ausschließlich der Text, der dir gleich angezeigt wird: deine Fragen, die Titel der gezeigten Antworten, dein Anliegen und die Kontaktangaben, die du selbst einträgst.':
      'The only thing transmitted is the text you are about to see: your questions, the titles of the answers shown, your request and the contact details you enter yourself.',
    'Nicht übertragen werden': 'Not transmitted',
    'dein Profil, deine Merkliste, deine Suchaufträge und die Unterlagen aus dem Dokumententresor.':
      'your profile, your saved list, your saved searches and the documents in the vault.',
    'Es gibt keinen Server, der das verschicken könnte. Die Nachricht wird an das E-Mail-Programm dieses Geräts übergeben – dort kannst du sie vor dem Senden noch ändern. Wo kein Programm eingerichtet ist, kopier den Text oder sichere ihn als Datei.':
      'There is no server that could send it. The message is handed to this device’s email program – you can still change it there before sending. Where no program is set up, copy the text or save it as a file.',
    'Text kopieren': 'Copy text',
    'Als Datei': 'As a file',
    'E-Mail öffnen': 'Open email',
    'Diese Nachricht wird übergeben': 'This message will be handed over'
  });

  /* ------------------------- Objektseite ------------------------- */

  e({
    'Pfad': 'Breadcrumb',
    'Suche': 'Search',
    '· {2} von': '· {2} of',
    'Vorheriges Bild': 'Previous image',
    'Nächstes Bild': 'Next image',
    'Bildauswahl': 'Image selection',
    'Teilen': 'Share',
    'Eckdaten': 'Key facts',
    'Provision': 'Commission',
    'Online seit': 'Online since',
    'Interessenten': 'Interested parties',
    'bei {36} Aufrufen': 'from {36} views',
    'Ausstattung': 'Features',
    'Beschreibung': 'Description',
    'echte Monatskosten': 'real monthly costs',
    'Exposé als Datei': 'Listing sheet as a file',
    'Ähnliche Angebote': 'Similar offers',
    'Nicht gefunden': 'Not found',
    'Dieses Inserat gibt es nicht (mehr)': 'This listing does not exist (any more)',
    'Vielleicht ist der Verweis alt, oder das Inserat wurde zurückgezogen.':
      'Perhaps the link is old, or the listing has been withdrawn.',
    'Zur Suche': 'To the search',
    /* Kosten */
    'Was es wirklich kostet': 'What it really costs',
    'Nicht nur die Warmmiete – auch Strom, Internet, Rundfunkbeitrag und der Einzug selbst.':
      'Not just the rent including bills – electricity, internet, the broadcasting fee and moving in itself.',
    'Jeden Monat': 'Every month',
    'Summe': 'Total',
    'Einmalig beim Einzug': 'One-off when moving in',
    'Mietbelastungsquote': 'Rent-to-income ratio',
    'Erstes Jahr insgesamt:': 'First year in total:',
    'Haushaltsgröße und Einkommen anpassen': 'Adjust household size and income',
    'Personen im Haushalt': 'People in the household',
    'Nettoeinkommen im Monat (Haushalt)': 'Net monthly income (household)',
    'Beides fließt nur in die Rechnung auf diesem Gerät ein.':
      'Both only feed into the calculation on this device.',
    'Übernehmen': 'Apply',

    /* Preisvergleich */
    'Preis im Vergleich': 'Price in comparison',
    'je m² Grundstück': 'per m² of land',
    'abgeleiteter Bodenwert': 'derived land value',
    'überbaubar bei GRZ': 'buildable area at a GRZ of',
    'Geschossfläche bei GFZ': 'floor area at a GFZ of',
    'Der Bodenwert ist hier aus dem örtlichen Kaufpreisniveau abgeleitet, kein amtlicher Bodenrichtwert. Den führt der Gutachterausschuss der Gemeinde; die Auskunft ist meist kostenlos und in den meisten Bundesländern online abrufbar.':
      'The land value here is derived from local purchase prices, not an official standard land value (Bodenrichtwert). That is kept by the municipality’s valuation committee; the information is usually free and available online in most federal states.',
    'günstig': 'cheap',
    'ortsüblich': 'in line with local rates',
    'teuer': 'expensive',
    '– {5} €/m² gegenüber {6} €/m² Vergleichswert für {7}, Baujahr {8}{9}, {10} m². Das sind {11}{12} %.':
      '– {5} €/m² against a benchmark of {6} €/m² for {7}, built {8}{9}, {10} m². That is {11}{12} %.',
    'Der Vergleichswert ist eine Rechengröße dieser Vorführung, kein amtlicher Mietspiegel.':
      'The benchmark is a computed figure in this demo, not an official rent index (Mietspiegel).',
    'je m² Kaufpreis': 'per m² purchase price',
    'Vergleichswert': 'benchmark',
    'Jahresmieten (Kaufpreisfaktor)': 'annual rents (price-to-rent multiple)',
    'Bruttomietrendite': 'Gross rental yield',
    'Ein Faktor unter 25 gilt als günstig, über 35 als ambitioniert. Er sagt, wie viele Jahre Nettokaltmiete den Kaufpreis decken – ohne Nebenkosten und Instandhaltung.':
      'A multiple below 25 counts as cheap, above 35 as ambitious. It says how many years of base rent cover the purchase price – excluding running costs and maintenance.',

    /* Vertragslupe */
    'Im Inseratstext stehen keine der typischen Klauseln, die später Ärger machen.':
      'The listing text contains none of the usual clauses that cause trouble later.',
    'TrimmoTrade liest den Inseratstext auf Formulierungen, die im Mietvertrag Geld oder Rechte kosten können. {1} {2} in diesem Inserat.':
      'TrimmoTrade reads the listing text for wording that can cost you money or rights in the tenancy agreement. {1} {2} in this listing.',
    'Allgemeine Hinweise zur Einordnung, keine Rechtsberatung. Im Zweifel hilft ein Mieterverein oder eine Anwältin für Mietrecht.':
      'General notes for orientation, not legal advice. If in doubt, a tenants’ association or a tenancy-law solicitor can help.',
    'Prüfhinweis': 'Check notice',
    /* Chancen */
    'Wie stehen deine Chancen?': 'What are your chances?',
    'Zwei Dinge entscheiden, und nur eines davon hast du in der Hand. Deshalb stehen sie hier getrennt.':
      'Two things decide it, and only one of them is in your hands. That is why they are shown separately.',
    'Andrang:': 'Demand:',
    'Darauf hast du keinen Einfluss{8}.': 'You have no influence over this{8}.',
    'Die Schätzung geht von der Zahl der Interessenten aus und gewichtet dein Profil dagegen. Sie kennt nicht, wen die Vermieterseite tatsächlich sympathisch findet – das entscheidet oft mehr als jede Zahl. Und sie ist kein Grund, es nicht zu versuchen: Auch eine Wohnung mit hundert Interessenten wird an genau eine Person vergeben.':
      'The estimate starts from the number of interested parties and weighs your profile against it. It does not know who the landlord actually warms to – which often decides more than any number. And it is no reason not to try: even an apartment with a hundred interested parties goes to exactly one person.',

    /* Doppelte Inserate */
    'Diese Wohnung steht möglicherweise mehrfach im Angebot':
      'This apartment may be listed more than once',
    'Gleiche Fläche, gleicher Zuschnitt, fast gleicher Preis im selben Viertel. Bevor du dich zweimal auf dieselbe Wohnung bewirbst, vergleich die Angaben.':
      'Same floor area, same layout, almost the same price in the same neighbourhood. Before you apply twice for the same apartment, compare the details.',
    'Zwei Anfragen zum selben Objekt wirken bei der Vermieterseite unentschlossen. Such dir den Weg aus, der dir mehr Auskunft gibt – meist der direkte Eigentümer.':
      'Two enquiries about the same property look indecisive to the landlord. Pick the route that gives you more information – usually the owner directly.',

    /* Passung */
    'Passung zu deinem Profil': 'Match with your profile',
    'Die Reihenfolge deiner Suche entsteht ausschließlich aus diesen Werten.':
      'The order of your search results comes solely from these values.',
    'Gewichtung ändern': 'Change the weighting',
    '– niemand kann sich hier nach oben kaufen.': '– nobody can buy their way up here.',

    /* WG */
    'Die WG': 'The flatshare',
    'Freies Zimmer': 'Available room',
    'm² · {3} warm': 'm² · {3} incl. bills',
    'WG-Art': 'Flatshare type',
    'Gesucht': 'Looking for',
    '{6}, {7}–{8} Jahre': '{6}, aged {7}–{8}',
    'Rauchen': 'Smoking',
    'Haustiere': 'Pets',
    'Sprachen': 'Languages',
    'Bad': 'Bathroom',

    /* Tausch */
    'Tauschwunsch': 'Swap request',
    'Wunschorte': 'Preferred locations',
    'Mindestens': 'At least',
    'Zimmer, {4} m²': 'rooms, {4} m²',
    'Warmmiete bis': 'Rent incl. bills up to',
    'Wunschausstattung': 'Desired features',
    'Vermieterzustimmung': 'Landlord approval',
    'Wohnungstausch geht nur mit der Vermieterseite': 'An apartment swap only works with the landlord',
    'Ein Tausch ist rechtlich kein Übergang des Mietvertrags, sondern zweimal Kündigung und zweimal Neuabschluss. Beide Vermieter müssen mitspielen. Viele Genossenschaften und kommunale Gesellschaften unterstützen das ausdrücklich, private Eigentümer selten. Frag früh nach – nicht erst, wenn die Kette steht.':
      'Legally a swap is not a transfer of the tenancy but two terminations and two new contracts. Both landlords have to play along. Many housing co-operatives and municipal companies actively support it; private owners rarely do. Ask early – not once the chain is already in place.',

    /* Lage und Anbieter */
    'Lage': 'Location',
    'Anbieter': 'Provider',
    '· aktiv seit {5} ·': '· active since {5} ·',
    'antwortet': 'replies',
    'im Schnitt': 'on average',
    'Antwortquote und Reaktionszeit stammen aus dem bisherigen Verhalten auf der Plattform. Unter 50 % lohnt sich eine zweite Option.':
      'Reply rate and response time come from past behaviour on the platform. Below 50 % it is worth having a second option.',

    /* Besichtigung */
    'Besichtigung': 'Viewing',
    'Für dieses Objekt sind keine Termine hinterlegt. Frag beim Anschreiben direkt nach zwei konkreten Zeitfenstern – das spart eine Runde.':
      'No appointments are stored for this property. When you write, ask straight away for two specific time slots – it saves a round trip.',
    'Besichtigung buchen': 'Book a viewing',
    'Feste Zeitfenster statt Massenandrang. Ein Platz gehört dir, sobald du ihn nimmst.':
      'Fixed time slots instead of a crowd. A slot is yours as soon as you take it.',
    'Besichtigungs-Checkliste öffnen': 'Open the viewing checklist',
    'Abhaken, was du geprüft hast. Alles bleibt bei diesem Objekt gespeichert und lässt sich am Ende als Text kopieren.':
      'Tick off what you have checked. Everything stays saved with this property and can be copied as text at the end.',
    'Als Text kopieren': 'Copy as text',
    'Fertig': 'Done',
    'Nachricht': 'Message',
    'Absenden': 'Send',
    /* Finanzierung */
    'Finanzierung überschlagen': 'Rough financing estimate',
    'Eigenkapital': 'Equity',
    'Sollzins': 'Interest rate',
    'Anfangstilgung': 'Initial repayment rate',
    'Gesamtkosten mit Nebenkosten': 'Total cost including fees',
    'Darlehen': 'Loan',
    'Rate im Monat': 'Monthly instalment',
    'Restschuld nach 10 Jahren': 'Remaining debt after 10 years',
    '{12} Jahre': '{12} years',
    'bis zur Volltilgung': 'to full repayment',
    'Eigenkapitalquote': 'Equity ratio',
    'Annuitätendarlehen ohne Sondertilgung. Banken erwarten meist mindestens die Kaufnebenkosten als Eigenkapital, besser 20 % des Kaufpreises dazu.':
      'An annuity loan without extra repayments. Banks usually expect at least the purchase fees as equity, and preferably 20 % of the price on top.'
  });

  /* ------------------------- Merkliste, Vergleich, Nachrichten ------------------------- */

  e({
    'Status': 'Status',
    'Merkmal': 'Feature',
    'Verläufe': 'Threads',

    'Noch nichts gemerkt': 'Nothing saved yet',
    'Klick bei einem Inserat auf das Herz. Hier entsteht daraus eine Tafel, die deine Bewerbungen von „gemerkt“ bis „Zusage“ begleitet.':
      'Click the heart on a listing. That builds a board here which follows your applications from “saved” to “accepted”.',
    'Merkliste und Bewerbungen': 'Saved listings and applications',
    'Alles, was du im Blick hast – vom ersten Merken bis zur Zusage.':
      'Everything you are keeping an eye on – from first saving it to the acceptance.',
    'Objekte insgesamt': 'listings in total',
    'in Bearbeitung': 'in progress',
    'Zusagen': 'acceptances',
    'Erfolgsquote': 'success rate',
    'Der Status lässt sich in jeder Karte umstellen. TrimmoTrade zählt daraus deine Erfolgsquote – nützlich, um zu merken, ob die Suche zu eng oder das Anschreiben zu blass ist.':
      'You can change the status on every card. TrimmoTrade works out your success rate from that – useful for noticing whether your search is too narrow or your covering letter too bland.',
    'Nach kürzestem Weg geordnet. Wo zwei Termine zeitlich nicht zusammenpassen, steht es dabei.':
      'Ordered by the shortest route. Where two appointments clash, it says so.',
    'Fahrzeiten mit öffentlichen Verkehrsmitteln geschätzt, 30 Minuten je Besichtigung eingerechnet.':
      'Travel times estimated by public transport, with 30 minutes allowed per viewing.',

    'Noch nichts im Vergleich': 'Nothing to compare yet',
    'Bis zu {2} Objekte lassen sich nebeneinanderstellen – mit echten Monatskosten, Vergleichsmiete und Passung in einer Tabelle.':
      'You can set up to {2} listings side by side – with real monthly costs, benchmark rent and match in one table.',
    'Objekte suchen': 'Search listings',
    'von {2} Plätzen belegt. Der jeweils beste Wert je Zeile ist hervorgehoben.':
      'of {2} slots used. The best value in each row is highlighted.',
    'Vergleich als Text kopieren': 'Copy comparison as text',
    '{0}Suchaufträge': '{0}Saved searches',
    'Kein Suchauftrag angelegt': 'No saved search yet',
    'Stell in der Suche deine Filter ein und speichere sie. TrimmoTrade zeigt dir dann bei jedem Besuch, was seither neu dazugekommen ist – über alle vier Angebotsarten hinweg.':
      'Set your filters in the search and save them. TrimmoTrade then shows you on every visit what has been added since – across all four offer types.',
    'Filter einstellen': 'Set filters',
    'Gespeicherte Filter. Was seit dem letzten Öffnen dazugekommen ist, steht oben.':
      'Saved filters. Whatever has arrived since you last opened them is at the top.',
    'Warum stehen manche Anfragen oben?': 'Why are some enquiries at the top?',
    'Anfragen von Nutzenden mit': 'Enquiries from users with',
    'TrimmoTrade Plus': 'TrimmoTrade Plus',
    'werden zuerst gezeigt und sind mit „Plus“ gekennzeichnet. Das ist bezahlte Sichtbarkeit, kein Urteil über die Person: TrimmoTrade sagt damit nichts darüber, wer besser zu deiner Wohnung passt. Darunter folgen alle weiteren in der Reihenfolge des Eingangs – gelöscht oder versteckt wird keine.':
      'are shown first and are marked “Plus”. That is paid visibility, not a judgement about the person: TrimmoTrade is saying nothing about who suits your apartment better. Below them all the others follow in order of arrival – none is deleted or hidden.',
    'Du kannst die Reihenfolge ignorieren; die Liste zeigt alle Anfragen vollständig.':
      'You can ignore the order; the list shows every enquiry in full.',
    'Beispielanfragen dieser Vorführung. Es gibt keinen Server, also auch niemanden, der wirklich geschrieben hätte – die Namen und Texte entstehen aus der Kennung des Inserats und bleiben deshalb gleich.':
      'Sample enquiries for this demo. There is no server, so nobody actually wrote them – the names and texts are derived from the listing’s identifier and therefore stay the same.',
    'Noch kein eigener Verlauf': 'No thread of your own yet',
    'Sobald du ein Inserat anschreibst, erscheint der Verlauf hier.':
      'As soon as you write to a listing, the thread appears here.',
    'Antwort schreiben…': 'Write a reply…',
    'Senden': 'Send',
    'Umzugsplan': 'Moving plan',
    'Zwanzig Aufgaben mit Fristen, die sich aus deinem Einzugstermin ergeben. Zwei davon haben harte gesetzliche Grenzen – die sind markiert.':
      'Twenty tasks with deadlines derived from your move-in date. Two of them have hard legal limits – those are marked.',
    'Geplanter Einzug': 'Planned move-in',
    'von {5} erledigt': 'of {5} done',
    'Plan als Text kopieren': 'Copy plan as text',
    'Nur als erledigt merken': 'Just mark as done',

    'Kurz, freundlich, mit einem einfachen Ausweg für die Gegenseite – so bekommt man am ehesten überhaupt eine Antwort.':
      'Short, friendly, with an easy way out for the other side – that is how you are most likely to get any reply at all.',
    'Für jedes Objekt entsteht ein eigenes Anschreiben aus deinem Profil – mit Titel, Lage und Einzugstermin des jeweiligen Inserats. Keine Rundmail: Wer erkennbar hundertfach kopiert, wird aussortiert.':
      'A separate covering letter is written for each property from your profile – with the title, location and move-in date of that listing. No mass mailing: anyone visibly copying the same text a hundred times gets weeded out.',
    'Zusatz für alle Anschreiben (freiwillig)': 'Addition to every covering letter (optional)',
    'Etwas, das für alle gilt – etwa der frühestmögliche Einzugstermin.':
      'Something that applies to all of them – the earliest possible move-in date, for instance.',
    'Alle ausgewählten absenden': 'Send all selected'
  });

  /* ------------------------- Profil und Inserieren ------------------------- */

  e({
    'Dein Profil': 'Your profile',
    'TrimmoTrade sortiert und rechnet ausschließlich mit diesen Angaben. Sie liegen im Speicher dieses Browsers – es gibt keinen Server und kein Konto.':
      'TrimmoTrade sorts and calculates using these details only. They live in this browser’s storage – there is no server and no account.',
    'Änderungen werden sofort übernommen': 'Changes are applied immediately',
    'Über dich': 'About you',
    'Vorname Nachname': 'First name Last name',
    'Alter': 'Age',
    'Geschlecht (für WG-Suchen)': 'Gender (for flatshare searches)',
    'Beruf oder Tätigkeit': 'Job or occupation',
    'z. B. Erzieherin': 'e.g. nursery teacher',
    'Nettoeinkommen im Monat': 'Net monthly income',
    'ich rauche': 'I smoke',

    'Was du suchst': 'What you are looking for',
    'Budget Warmmiete': 'Budget, rent incl. bills',
    'Budget Kaufpreis': 'Budget, purchase price',
    'nur bei Kaufinteresse': 'only if you are looking to buy',
    'Zimmer mindestens': 'Rooms at least',
    'Fläche mindestens (m²)': 'Floor area at least (m²)',
    'Einzug ab': 'Move-in from',
    'Städte': 'Cities',
    'Muss vorhanden sein': 'Must have',
    'Fehlt ein Pflichtmerkmal, rutscht das Inserat deutlich nach unten – aber es verschwindet nicht.':
      'If a must-have is missing, the listing drops well down the list – but it does not disappear.',
    'Wäre schön': 'Nice to have',

    'Ankerpunkte für den Arbeitsweg': 'Anchor points for your commute',
    'Statt Luftlinie rechnet TrimmoTrade die Fahrzeit zu den Orten, an denen du regelmäßig sein musst – Arbeit, Uni, Kita, Familie.':
      'Instead of straight-line distance, TrimmoTrade works out the travel time to the places you have to be regularly – work, university, nursery, family.',
    'Bezeichnung': 'Label',
    'Arbeit, Uni, Kita…': 'Work, university, nursery…',
    'Ort': 'Place',
    'Hinzufügen': 'Add',
    'Verkehrsmittel für die Rechnung': 'Mode of transport for the calculation',

    'Was dir wichtig ist': 'What matters to you',
    'Diese Regler bestimmen die Reihenfolge deiner Suchergebnisse. Kein Anbieter kann sich hier nach oben kaufen.':
      'These sliders determine the order of your search results. No provider can buy their way up here.',
    'auf Standard zurücksetzen': 'reset to default',

    'Dein WG-Profil': 'Your flatshare profile',
    'Sechs Fragen, aus denen sich die Passung zu jeder WG errechnet. Es gibt kein Richtig – ehrlich ist besser als sympathisch.':
      'Six questions from which the match with every flatshare is calculated. There is no right answer – honest beats likeable.',
    'Alles hier ist freiwillig. Was du nicht beantwortest, zählt nicht mit – es rechnet dann nur weniger, nicht schlechter. Es gibt kein Richtig; ehrlich ist besser als sympathisch, denn eine Passung, die auf einer geschönten Angabe steht, hält bis zum Einzug.':
      'Everything here is optional. What you leave unanswered simply does not count – less is calculated, not worse. There is no right answer; honest beats likeable, because a match built on a flattering answer lasts until move-in day.',
    'Die sechs Alltagsfragen': 'The six everyday questions',
    '– ab 40 Zeichen zählt der Text als ausgefüllt.': '– from 40 characters the text counts as filled in.',
    /* Die sechs Regler aus match.js. Sie standen bisher nur als Teil
       längerer Sätze in der Tabelle. */
    'Ordnung': 'Tidiness',
    'entspannt': 'relaxed',
    'sehr ordentlich': 'very tidy',
    'Lautstärke': 'Noise',
    'ruhig': 'quiet',
    'lebhaft': 'lively',
    'Besuch': 'Visitors',
    'selten': 'rarely',
    'ständig offen': 'always welcome',
    'Nähe': 'Closeness',
    'echte Wohngemeinschaft': 'a real shared home',
    'Rhythmus': 'Rhythm',
    'Frühaufsteher': 'early riser',
    'Nachtmensch': 'night owl',
    'Küche': 'Kitchen',
    'oft zusammen': 'often together',
    'Schufa-Bonitätsauskunft': 'Schufa credit report',
    'Nach der 30-Prozent-Faustregel liegt deine Obergrenze bei rund':
      'By the 30-per-cent rule of thumb your upper limit is around',
    'Warmmiete. Viele Vermieter rechnen zusätzlich mit dem Dreifachen der Kaltmiete als Mindesteinkommen.':
      'rent including bills. Many landlords also expect a minimum income of three times the cold rent.',

    'Vier weitere, an denen es meistens hängt': 'Four more, where it usually comes apart',
    'Diese vier sind noch nicht beantwortet, solange du den Regler nicht bewegt hast – ein Wert in der Mitte wäre eine Antwort, die du nicht gegeben hast.':
      'These four count as unanswered until you move the slider – a value in the middle would be an answer you never gave.',
    'noch nicht beantwortet': 'not answered yet',
    'Zu Hause': 'At home',
    'kaum da': 'rarely there',
    'fast immer da': 'almost always there',
    'Wer den ganzen Tag in der Wohnung arbeitet, teilt sie anders als jemand, der nur zum Schlafen kommt. Das ist der häufigste unausgesprochene Konflikt.':
      'Someone who works in the flat all day shares it differently from someone who only comes home to sleep. This is the most common unspoken conflict.',
    'Gemeinschaftsräume': 'Shared rooms',
    'gelassen': 'relaxed',
    'sofort aufgeräumt': 'tidied straight away',
    'Nicht das eigene Zimmer entscheidet, sondern die Küche. Zwei Menschen mit derselben Vorstellung davon streiten fast nie.':
      'It is not your own room that decides it, it is the kitchen. Two people who see it the same way almost never argue.',
    'Feiern': 'Parties',
    'nie in der Wohnung': 'never in the flat',
    'gern und oft': 'gladly and often',
    'Haushalt': 'Household',
    'jeder für sich': 'each on their own',
    'Haushaltskasse und gemeinsam einkaufen': 'a kitty and shopping together',

    'Womit du leben kannst, und womit nicht': 'What you can live with, and what you cannot',
    'Rauchst du?': 'Do you smoke?',
    'nur auf Balkon oder draußen': 'only on the balcony or outside',
    'auch in der Wohnung': 'indoors as well',
    'Und bei den anderen?': 'And the others?',
    'ist mir egal': 'does not bother me',
    'draußen ja, drinnen nicht': 'outside yes, indoors no',
    'gar kein Rauch': 'no smoke at all',
    'Bringst du ein Tier mit?': 'Are you bringing an animal?',
    'Tiere der anderen': 'Other people’s animals',
    'gern': 'happily',
    'lieber ohne': 'rather not',
    'geht nicht – Allergie': 'not possible – allergy',
    'Wie du isst': 'How you eat',
    'alles': 'everything',
    'vegetarisch': 'vegetarian',
    'vegan': 'vegan',
    'halal': 'halal',
    'koscher': 'kosher',
    'Und in der gemeinsamen Küche?': 'And in the shared kitchen?',
    'jeder wie er mag': 'everyone as they please',
    'kein Fleisch zubereiten': 'no meat prepared here',
    'getrennte Regale und Pfannen': 'separate shelves and pans',
    'Diese Angabe ist ein Ausschlusskriterium: Sie senkt keine Passung um ein paar Prozent, sondern sagt Nein. Das ist auch der Grund, warum sie oben steht und nicht im Kleingedruckten.':
      'This answer is a dealbreaker: it does not shave a few per cent off a match, it says no. That is also why it sits at the top and not in the small print.',
    'Wie du isst, geht ausschließlich in die Passung zu anderen Suchenden ein – in die Vorauswahl einer Vermieterseite fließt es nicht, dort hat es nichts zu suchen.':
      'How you eat feeds only into the match with other flat-hunters – it plays no part in a landlord’s shortlist, where it has no business being.',

    'Dein Alltag': 'Your everyday life',
    'Beschäftigung': 'Employment',
    'Vollzeit': 'Full-time',
    'Teilzeit': 'Part-time',
    'Schichtdienst': 'Shift work',
    'selbstständig': 'self-employed',
    'Rente': 'Retired',
    'auf Suche': 'looking for work',
    'So lange möchtest du bleiben': 'How long you would like to stay',
    'ein halbes Jahr': 'six months',
    'etwa ein Jahr': 'about a year',
    'zwei Jahre': 'two years',
    'drei Jahre': 'three years',
    'länger': 'longer',
    'Sprachen, die du sprichst': 'Languages you speak',
    'weitere Sprache': 'another language',
    'z. B. Polnisch': 'e.g. Polish',
    'Gefragt wird danach, weil eine gemeinsame Sprache den Alltag einfacher macht – nicht nach Herkunft. In der Vorauswahl einer Vermieterseite kommt diese Angabe nicht vor.':
      'This is asked because a shared language makes everyday life easier – not to ask about origin. It plays no part in a landlord’s shortlist.',
    'Steht schon in der Liste.': 'Already on the list.',
    'Acht Sprachen sind genug.': 'Eight languages are enough.',

    'Mit wem du wohnen möchtest': 'Who you want to live with',
    'Warum eine WG das darf': 'Why a flatshare is allowed to choose',
    '§ 19 Abs. 5 AGG nimmt das gemeinsame Bewohnen einer Wohnung vom Benachteiligungsverbot aus: Wer eine Wohnung mit anderen teilt, darf sich aussuchen, mit wem. Für die Vermietung selbst gilt das nicht – Alter und Geschlecht kommen deshalb in der Vorauswahl, die eine Vermieterseite sieht, an keiner Stelle vor.':
      '§ 19 (5) AGG exempts sharing a home from the prohibition of discrimination: whoever shares a flat with others may choose whom. That does not apply to letting itself – which is why age and gender appear nowhere in the shortlist a landlord sees.',
    'Alter ab': 'Age from',
    'Alter bis': 'Age up to',
    'Zusammensetzung': 'Composition',
    'lieber gemischt': 'mixed, preferably',
    'reine Frauen-WG': 'women only',
    'reine Männer-WG': 'men only',
    '„ab {0}“ und „bis {1}“ schließen einander aus – so gefiltert bliebe niemand übrig.':
      '“from {0}” and “up to {1}” rule each other out – filtered like that, nobody would be left.',
    'Was für eine WG es werden soll': 'What kind of flatshare it should be',
    'Die drei Sätze, die jemand liest, bevor er sich für ein Kennenlernen entscheidet. Konkret schlägt sympathisch: „Ich koche fast jeden Abend und freue mich, wenn jemand mitisst“ sagt mehr als „unkompliziert und offen“.':
      'The three sentences someone reads before deciding to meet you. Concrete beats likeable: “I cook almost every evening and I am glad when someone joins me” says more than “easy-going and open”.',
    'Zum Beispiel: Ich bin 29, arbeite in der Pflege im Schichtdienst und bin deshalb auch mal werktags zu Hause. Ich koche gern und viel, räume dabei aber erst hinterher auf.':
      'For example: I am 29, I work shifts in care and so I am sometimes home on weekdays. I cook a lot and enjoy it, but I only tidy up afterwards.',
    '{0} von 1200 Zeichen': '{0} of 1200 characters',

    'Für die Bewerbung um eine Wohnung': 'For applying for a flat',
    'Genau das, wonach eine Vermieterseite fragen darf – und nicht mehr. Aus diesen Angaben entsteht die Reihenfolge, in der deine Anfrage neben den anderen steht. Sie sortiert; sie sortiert niemanden aus.':
      'Exactly what a landlord may ask about – and nothing more. These answers produce the order in which your enquiry stands beside the others. It sorts; it sorts nobody out.',
    'Woher dein Einkommen kommt': 'Where your income comes from',
    'unbefristetes Arbeitsverhältnis': 'permanent employment',
    'befristeter Vertrag': 'fixed-term contract',
    'noch in der Probezeit': 'still in the probation period',
    'Studium': 'Studying',
    'Ausbildung': 'Apprenticeship',
    'anderes': 'something else',
    'keine': 'none',
    'Elternbürgschaft': 'parental guarantee',
    'andere Bürgschaft': 'another guarantee',
    'Bürgschaft vorhanden': 'guarantee available',
    'keiner': 'none',
    'WBS Stufe A': 'WBS level A',
    'WBS Stufe B': 'WBS level B',
    'WBS Stufe C': 'WBS level C',
    'beantragt': 'applied for',
    'Stufe': 'Level',
    'So lange willst du mieten': 'How long you want to rent',
    'unter einem Jahr': 'under a year',
    'drei Jahre und mehr': 'three years or more',
    'so lange wie möglich': 'as long as possible',
    'mindestens drei Jahre': 'at least three years',
    'etwa zwei Jahre': 'about two years',
    'Beim Einzugstermin bist du': 'On the move-in date you are',
    'auf den Termin festgelegt': 'tied to the date',
    'zwei Wochen flexibel': 'flexible by two weeks',
    'ganz flexibel': 'fully flexible',
    'Bisherige Mietverhältnisse': 'Previous tenancies',
    'Die Kaution liegt bereit': 'The deposit is ready',
    'Höchstens drei Nettokaltmieten, und sie darf in drei Raten gezahlt werden – § 551 BGB. Wer mehr verlangt, verlangt zu viel.':
      'At most three months’ net cold rent, and it may be paid in three instalments – § 551 BGB. Anyone asking for more is asking for too much.',
    'liegt bereit': 'ready',
    'Wann du zur Besichtigung kannst': 'When you can make a viewing',
    'werktags tagsüber': 'weekdays during the day',
    'abends': 'evenings',
    'am Wochenende': 'at weekends',
    'auch kurzfristig': 'at short notice too',
    'Eine anbietende Seite vergibt Termine in Blöcken. Wer sagt, wann er kann, bekommt einen – wer es nicht sagt, wird zurückgestellt.':
      'A landlord hands out viewing slots in blocks. Say when you can come and you get one; say nothing and you are set aside.',
    'So läse sich deine Bewerbung heute': 'How your application would read today',
    'Gerechnet gegen eine gedachte Wohnung zu deinem Budget von {0} warm:':
      'Calculated against an imagined flat at your budget of {0} including bills:',

    'Kein Druck und keine Punktejagd: Die Liste sagt nur, wonach TrimmoTrade noch nicht rechnen kann. Ein halb ausgefülltes Profil sucht trotzdem – es sucht nur gröber.':
      'No pressure and no points to chase: the list only says what TrimmoTrade cannot calculate with yet. A half-filled profile still searches – it just searches more coarsely.',
    'Für die Suche': 'For the search',
    'Für die Passung zu Menschen und Wohnungen': 'For matching with people and flats',
    'Es fehlt noch: {0}.': 'Still missing: {0}.',
    'Vollständig. Mehr braucht die Rechnung nicht.': 'Complete. The calculation needs no more.',
    'Unter der Hälfte ist eine Passung eher ein Eindruck als eine Aussage – sie steht dann auch so da und nicht als runde Zahl.':
      'Below half, a match is more of an impression than a statement – and it is shown as such, not as a round number.',
    'Die vier weiteren Regler': 'The four further sliders',
    'Beschäftigungsart': 'Type of employment',
    'Gewünschte Mietdauer': 'Desired tenancy length',
    'Einkommensart': 'Type of income',
    'Über mich': 'About me',

    /* Die Vorauswahl im Postfach der anbietenden Seite */
    'Sortiert nach Eignung, nicht nach Eingang – und nichts ist ausgeblendet: Wer hinten steht, steht trotzdem da. Gerechnet wird ausschließlich mit dem, wonach gefragt werden darf; Alter und Geschlecht stehen in keiner Anfrage.':
      'Sorted by suitability, not by arrival – and nothing is hidden: whoever is at the bottom is still there. Only what may lawfully be asked is used; age and gender appear in no enquiry.',
    'Ausschluss': 'Dealbreaker',
    'Warum': 'Why',
    'wenige Angaben': 'few answers',
    'Inserat entfernt': 'Listing removed',
    'Anfrage': 'enquiry',
    'Anfragen': 'enquiries',
    'Art des Einkommens': 'Type of income',
    'Kaution': 'Deposit',
    'Einzugstermin': 'Move-in date',
    'Besichtigung möglich': 'Viewing possible',
    'Die Warmmiete ist {0} % des Nettoeinkommens – sehr komfortabel.':
      'The rent including bills is {0} % of net income – very comfortable.',
    '{0} % des Nettoeinkommens – im üblichen Rahmen.': '{0} % of net income – within the usual range.',
    '{0} % des Nettoeinkommens – für viele Vermietende die Obergrenze.':
      '{0} % of net income – the upper limit for many landlords.',
    '{0} % des Nettoeinkommens – darüber wird selten zugesagt.':
      '{0} % of net income – above that, few applications succeed.',
    '{0} von {1} Unterlagen liegen bereit.': '{0} of {1} documents are ready.',
    'Mindestens {0} Jahre geplant.': 'At least {0} years planned.',
    'Rund zwei Jahre geplant.': 'About two years planned.',
    'Etwa ein Jahr geplant.': 'About a year planned.',
    'Unter einem Jahr – für viele Vermietende zu kurz.': 'Under a year – too short for many landlords.',
    'Liegt rund {0} Monate daneben.': 'About {0} months off.',
    'Eine Person auf {0} Zimmer.': 'One person for {0} rooms.',
    '{0} Personen auf {1} Zimmer.': '{0} people for {1} rooms.',
    '{0} Personen auf {1} Zimmer – eng, aber üblich.': '{0} people for {1} rooms – tight, but common.',
    '{0} Personen auf {1} Zimmer. Das überschreitet, was in vielen Bundesländern als Überbelegung gilt.':
      '{0} people for {1} rooms. That exceeds what many federal states treat as overcrowding.',
    'Ähnlicher Alltag: {0}': 'Similar daily rhythm: {0}',
    'Gemeinsame Sprache: {0}': 'Shared language: {0}',
    'Sehr unterschiedliche Vorstellungen davon, wie lange das halten soll ({0} gegen {1} Jahre).':
      'Very different ideas about how long this should last ({0} versus {1} years).',
    'Du möchtest ohne Tiere wohnen ({0}).': 'You want to live without animals ({0}).',
    'Schichtdienst trifft auf einen anderen Rhythmus – das lässt sich regeln, aber es gehört besprochen.':
      'Shift work meets a different rhythm – that can be arranged, but it needs discussing.',
    'In der Küche soll kein Fleisch zubereitet werden – die andere Seite isst welches.':
      'No meat is to be prepared in the kitchen – the other person eats it.',
    'Die andere Seite möchte eine fleischfreie Küche.': 'The other person wants a meat-free kitchen.',
    'Gleiche Ernährung – das macht die Küche einfacher.': 'The same diet – that makes the kitchen easier.',
    'Keine gemeinsame Sprache angegeben.': 'No shared language given.',
    'Tier': 'animal',
    'raucht nicht': 'does not smoke',
    'raucht auf dem Balkon': 'smokes on the balcony',
    'raucht in der Wohnung': 'smokes indoors',
    'keine Tiere': 'no animals',
    'Für eine belastbare Einschätzung fehlen noch Angaben.':
      'Some answers are still missing for a reliable estimate.',
    'Sehr gut geeignet': 'Very well suited',
    'Gut geeignet': 'Well suited',
    'Kommt in Frage': 'Worth considering',
    'Eher schwierig': 'Rather difficult',
    'Zu wenig Angaben': 'Too few answers',
    'Ein Ausschlusskriterium steht dagegen': 'A dealbreaker stands in the way',
    'Mietbelastung': 'Rent burden',
    'Unterlagen': 'Documents',
    'Mietdauer': 'Tenancy length',
    'Die Mappe ist vollständig.': 'The folder is complete.',
    'Liegt vor.': 'Available.',
    'Flexibel.': 'Flexible.',
    'Passt fast auf den Tag.': 'Almost to the day.',
    'Liegt um ein paar Wochen daneben.': 'A few weeks off.',
    'Rente – planbar und dauerhaft': 'pension – predictable and lasting',
    'selbstständig – üblich sind die letzten zwei Steuerbescheide':
      'self-employed – the last two tax assessments are customary',
    'befristetes Arbeitsverhältnis': 'fixed-term employment',
    'Elternbürgschaft vorhanden': 'parental guarantee available',
    'Im Inserat ausdrücklich erlaubt.': 'Expressly permitted in the listing.',
    'Das Inserat sagt nichts dazu – frag früh, bevor beide Seiten Zeit investieren.':
      'The listing says nothing about it – ask early, before both sides invest time.',
    'Bei dieser Mietbelastung wäre eine Bürgschaft das wirksamste Mittel.':
      'At this rent burden, a guarantee would be the most effective step.',
    'Diese Wohnung ist an einen Wohnberechtigungsschein gebunden. Ohne ihn ist eine Vermietung nicht zulässig.':
      'This flat requires a housing entitlement certificate (WBS). Without one, letting it is not permitted.',

    /* Die Passung zwischen Menschen */
    'Sehr ähnliche Vorstellungen vom Alltag': 'Very similar ideas about everyday life',
    'Passt gut zusammen': 'A good fit',
    'Geht, mit ein paar Absprachen': 'Workable, with a few agreements',
    'Deutliche Unterschiede – vorher reden': 'Clear differences – talk first',
    'Sehr unterschiedliche Vorstellungen': 'Very different ideas',
    'Zu wenig Angaben für eine Einschätzung': 'Too few answers for an assessment',
    'Erste Einschätzung – dafür fehlen noch Angaben': 'A first impression – answers are still missing',
    'Ein Ausschlusskriterium': 'One dealbreaker',
    'Ausschlusskriterien': 'Dealbreakers',
    'am wenigsten mit {0} ({1} %)': 'least of all with {0} ({1} %)',
    'Du möchtest ohne Rauch wohnen, die andere Seite raucht.':
      'You want to live smoke-free; the other person smokes.',
    'In der Wohnung soll nicht geraucht werden.': 'There is to be no smoking in the flat.',
    'Eine Allergie schließt ein Tier in der Wohnung aus.': 'An allergy rules out an animal in the flat.',
    'Außerhalb der Altersspanne, die du dir wünschst.': 'Outside the age range you are looking for.',
    'Du möchtest in einer reinen Frauen-WG wohnen.': 'You want to live in a women-only flatshare.',
    'Du möchtest in einer reinen Männer-WG wohnen.': 'You want to live in a men-only flatshare.',
    'Dazu deine Antworten zum Alltag – daraus rechnet sich die Passung. Ohne sie sieht die Gruppe keine Einschätzung.':
      'Plus your everyday answers – the match is calculated from them. Without them the group sees no assessment.',
    'Mehr als diese Liste geht nicht mit. Weder deine Adresse noch dein Einkommen auf den Euro, und nichts, wonach niemand fragen darf.':
      'Nothing beyond this list goes out. Neither your address nor your income to the euro, and nothing nobody is allowed to ask about.',
    'Die Fragen im Profil': 'The questions in your profile',
    'Geschlecht': 'Gender',
    'Rauch der anderen': 'Other people’s smoke',
    'Eigene Tiere': 'Your own animals',
    'Ernährung': 'Diet',
    'Gemeinsame Küche': 'Shared kitchen',
    'Art der WG': 'Kind of flatshare',
    'Bleiben möchte ich': 'I would like to stay',
    'Vier weitere Regler': 'Four further sliders',
    'Antwort': 'answer',
    'Antworten': 'answers',
    'weiblich': 'female',
    'männlich': 'male',
    'nichtbinär': 'non-binary',
    'keine Angabe': 'not stated',


    'Bewerbermappe': 'Application folder',
    'Wer die Unterlagen parat hat, bewirbt sich in Minuten statt in Tagen. Hak ab, was bei dir bereitliegt.':
      'With your documents ready, you apply in minutes instead of days. Tick off what you have to hand.',
    'Datensparsam bewerben': 'Applying without oversharing',
    'Vor der Besichtigung darf niemand Schufa, Kontoauszüge, Ausweiskopie oder Angaben zu Familienplanung, Religion oder Vorstrafen verlangen. Solche Fragen dürfen im Zweifel falsch beantwortet werden, ohne dass der Vertrag angreifbar wird. Erst wenn die Wohnung ernsthaft in Betracht kommt, sind Einkommensnachweise und Schufa üblich.':
      'Before the viewing, nobody may demand a Schufa credit report, bank statements, a copy of your ID, or details about family planning, religion or criminal record. If in doubt, such questions may be answered untruthfully without making the contract challengeable. Only once the apartment is seriously in play are proof of income and a Schufa report customary.',
    'Unterlagen verschlüsselt ablegen': 'Store documents encrypted',
    'Im Dokumententresor liegen die Dateien verschlüsselt. Beim Bewerben verschickst du dann keinen Anhang, sondern einen Verweis, der nach gesetzter Frist erlischt und sich widerrufen lässt. Was dort liegt, wird hier automatisch abgehakt.':
      'In the document vault your files are encrypted. When you apply you then send not an attachment but a link that expires after a set period and can be revoked. Whatever is in there is ticked off here automatically.',
    'Kurze Vorstellung': 'Short introduction',
    'Zwei bis drei Sätze über dich. TrimmoTrade baut sie in jedes Anschreiben ein.':
      'Two or three sentences about you. TrimmoTrade works them into every covering letter.',
    'Vorstellung': 'Introduction',
    'Zum Beispiel: Ich arbeite seit vier Jahren fest bei …, bin ruhig, nicht rauchend und suche etwas Langfristiges.':
      'For example: I have had a permanent job at … for four years, I am quiet, a non-smoker, and looking for something long-term.',
    'Wie vollständig ist dein Profil?': 'How complete is your profile?',
    /* Inserieren */
    'Inserat aufgeben': 'Post a listing',
    'Vermieten, verkaufen, ein Zimmer anbieten oder tauschen – ein Formular für alles. Das Inserat bleibt auf diesem Gerät und taucht in deiner Suche, in der Karte und im Ringtausch auf.':
      'Let, sell, offer a room or swap – one form for all of it. The listing stays on this device and shows up in your search, on the map and in the swap chains.',
    'Art des Angebots': 'Type of offer',
    'Stadt und Viertel': 'City and neighbourhood',
    'Straße (ungefähr)': 'Street (approximate)',
    'Nähe Beispielstraße': 'Near Example Street',
    'Zimmer': 'Rooms',
    'Wohnfläche in m²': 'Living space in m²',
    'Etage': 'Floor',
    'Etagen im Haus': 'Floors in the building',
    'Baujahr': 'Year built',
    'Heizung': 'Heating',
    'Grundstücksfläche in m²': 'Plot area in m²',
    'Bauweise': 'Construction type',
    'Art des Grundstücks': 'Type of plot',
    'Bebauungsplan': 'Development plan',
    'Grundflächenzahl (GRZ)': 'Site coverage ratio (GRZ)',
    'Geschossflächenzahl (GFZ)': 'Floor area ratio (GFZ)',
    'Erschließungskosten': 'Development charges',
    'Kaltmiete': 'Base rent (Kaltmiete)',
    'Nebenkosten': 'Service charges',
    'Heizkosten': 'Heating costs',
    'Kaution in Kaltmieten': 'Deposit in months’ base rent',
    'Frei ab': 'Available from',
    'Kaufpreis': 'Purchase price',
    'Käuferprovision in Prozent': 'Buyer’s commission in per cent',
    'Hausgeld im Monat': 'Monthly service charge (Hausgeld)',
    'Bezugsfrei ab': 'Vacant from',
    'Provision und Kosten beim Kauf': 'Commission and costs when buying',
    'Seit dem 23. Dezember 2020 gilt bei Wohnungen und Einfamilienhäusern an Verbraucher: Die Maklerprovision wird geteilt, und die Käuferseite zahlt höchstens so viel wie die Verkäuferseite (§§ 656c, 656d BGB). Für Grundstücke und Mehrfamilienhäuser gilt das nicht. TrimmoTrade rechnet die Nebenkosten des Erwerbs – Grunderwerbsteuer nach Bundesland, Notar und Grundbuch – bei jedem Angebot durch und zeigt sie neben dem Kaufpreis.':
      'Since 23 December 2020, for apartments and single-family houses sold to consumers: the agent’s commission is split, and the buyer pays no more than the seller (§§ 656c, 656d BGB). This does not apply to plots of land or apartment blocks. TrimmoTrade works out the purchase costs – land transfer tax by federal state, notary and land registry – for every offer and shows them next to the price.',
    'Grund für den Tausch': 'Reason for the swap',
    'z. B. neuer Job in Leipzig': 'e.g. new job in Leipzig',
    'Fläche mindestens': 'Floor area at least',
    'Warmmiete höchstens': 'Rent incl. bills at most',
    'auch Ringtausch über mehrere Haushalte': 'swap chains across several households too',
    'Was sollte man über die Wohnung und die Nachbarschaft wissen?':
      'What should people know about the apartment and the neighbourhood?',
    'Was du nicht schreiben darfst': 'What you may not write',
    'Formulierungen, die nach Herkunft, Religion, Geschlecht, Behinderung oder Alter aussortieren, sind nach dem Allgemeinen Gleichbehandlungsgesetz unzulässig. Bei WG-Zimmern in der eigenen Wohnung ist die Auswahl freier – trotzdem gilt: Beschreibe die WG, nicht wen du ausschließt.':
      'Wording that filters by origin, religion, gender, disability or age is unlawful under the German Equal Treatment Act (AGG). For a room in your own flatshare you have more freedom to choose – even so: describe the flatshare, not who you are excluding.',
    'Inserat anlegen': 'Create listing',
    /* Fotos */
    'Fotos': 'Photos',
    'Inserate mit Fotos werden deutlich häufiger geöffnet. Bis zu {0} Bilder, JPG, PNG, WEBP oder HEIC. Das erste ist das Titelbild.':
      'Listings with photos get opened far more often. Up to {0} images, JPG, PNG, WEBP or HEIC. The first one is the cover image.',
    'Bilder hochladen': 'Upload images',
    'Die Bilder werden beim Ablegen auf {4} Pixel Kantenlänge verkleinert und bleiben im Speicher dieses Geräts. Sie werden nirgendwohin übertragen – es gibt keinen Server.':
      'Images are scaled down to {4} pixels along the longer edge when stored and stay in this device’s storage. They are not transmitted anywhere – there is no server.',
    'Was auf ein Inseratsfoto nicht gehört': 'What does not belong in a listing photo',
    'Keine Personen ohne deren Einwilligung, keine Kennzeichen, keine Namensschilder an Klingel oder Briefkasten, keine Post auf dem Tisch. Wer die Wohnung noch bewohnt, sollte vorher gefragt werden: Fotos der Innenräume dürfen ohne Zustimmung der Mietpartei nicht veröffentlicht werden.':
      'No people without their consent, no number plates, no name tags on the doorbell or letterbox, no post on the table. Anyone still living in the apartment should be asked first: photos of the interior may not be published without the tenant’s consent.',

    '{0}Automatisch gespeichert um {1} Uhr': '{0}Saved automatically at {1}',

    /* Hervorhebung */
    'Wer schneller vermieten oder verkaufen will, kann für Sichtbarkeit zahlen. Was du dabei':
      'If you want to let or sell faster, you can pay for visibility. What you are',
    'nicht': 'not',
    'kaufst: eine bessere Bewertung, einen anderen Platz in der Trefferreihenfolge oder das Verschwinden anderer Inserate.':
      'buying: a better score, a different position in the result order, or other listings disappearing.',
    'Warum das gekennzeichnet wird': 'Why this is labelled',
    'Bezahlte Platzierung in Suchergebnissen muss als solche erkennbar sein (§ 5b Abs. 1 Nr. 6 und Abs. 2 UWG). TrimmoTrade löst das nicht mit einem kleinen Sternchen, sondern mit einem eigenen Block über den Treffern. Das ist ehrlicher – und wirkt erfahrungsgemäß besser als ein getarnter Platz, weil niemand sich getäuscht fühlt.':
      'Paid placement in search results has to be recognisable as such (§ 5b(1) no. 6 and (2) UWG). TrimmoTrade does not handle that with a small asterisk but with a separate block above the results. That is more honest – and in practice works better than a disguised slot, because nobody feels misled.',
    'In dieser Vorführung wird nichts abgebucht. Im Betrieb liefe die Zahlung über den Zahlungsdienstleister, mit Rechnung und Widerrufsbelehrung.':
      'Nothing is charged in this demo. In production the payment would run through the payment provider, with an invoice and a withdrawal notice.',

    /* Mieten oder kaufen */
    'Mieten oder kaufen': 'Rent or buy',
    'Der Vergleich rechnet ehrlich: Der Mietende legt das Eigenkapital an und investiert jeden Monat die Differenz zur Kaufrate. Verglichen wird am Ende das Vermögen, nicht das Gefühl.':
      'The comparison plays fair: the renter invests the equity and puts the monthly difference from the mortgage payment into the market. What gets compared in the end is wealth, not gut feeling.',
    'Die Immobilie': 'The property',
    'Bundesland (Grunderwerbsteuer)': 'Federal state (land transfer tax)',
    'Die Alternative': 'The alternative',
    'Zahlen im Detail': 'Figures in detail',
    'Ohne Steuern, Sondertilgung, Modernisierungsstau und Umzugskosten. Die Rechnung reagiert empfindlich auf Wertsteigerung und Anlagerendite – schieb beide Regler bewusst, nicht optimistisch.':
      'Excluding taxes, extra repayments, deferred modernisation and moving costs. The calculation is sensitive to appreciation and investment return – move both sliders deliberately, not optimistically.',
    'Werte zurücksetzen': 'Reset values',
    'Vermögen nach {2} Jahren mit Kauf': 'Wealth after {2} years if you buy',
    'Immobilienwert {3} minus Restschuld': 'Property value {3} minus remaining debt',
    'Vermögen nach {7} Jahren mit Miete': 'Wealth after {7} years if you rent',
    'angelegtes Eigenkapital plus monatliche Differenz bei {8} % Rendite':
      'invested equity plus the monthly difference at a {8} % return',
    'Kauf': 'Buy',
    'Miete plus Anlage': 'Rent plus investment',
    'Kaufnebenkosten ({1} % Grunderwerbsteuer, 2 % Notar, {2} % Makler)':
      'Purchase costs ({1} % land transfer tax, 2 % notary, {2} % agent)',
    'Annuität im Monat': 'Monthly mortgage payment',
    'echte Monatsbelastung mit Hausgeld und Rücklage':
      'real monthly burden including service charge and reserve',
    'gezahlte Zinsen in {7} Jahren': 'interest paid over {7} years',
    'Restschuld nach {9} Jahren': 'remaining debt after {9} years',
    'gezahlte Miete in {11} Jahren': 'rent paid over {11} years',
    'Ausgaben als Käufer in {13} Jahren': 'outgoings as a buyer over {13} years'
  });

  /* ------------------------- Tarife ------------------------- */

  e({
    'Ein Satz erklärt das ganze Modell:': 'One sentence explains the whole model:',
    'Plus bezahlt Zeitersparnis und Sichtbarkeit – nie, was du über eine Wohnung erfährst.':
      'Plus pays for saved time and visibility – never for what you learn about an apartment.',
    'Prüfhinweis, Vergleichsmiete, Chancen und alle Rechner bleiben kostenlos. Und wo Bezahlung eine Reihenfolge ändert, steht es dabei.':
      'The check notice, benchmark rent, your chances and every calculator stay free. And wherever payment changes an order, it says so.',
    'Zahlungsweise': 'Billing',
    'monatlich': 'monthly',
    'jährlich': 'yearly',
    '% günstiger': '% cheaper',
    'dauerhaft': 'permanently',
    'im Monat, {1} im Jahr': 'per month, {1} per year',
    'im Monat, monatlich kündbar': 'per month, cancellable monthly',
    'Leistung': 'Feature',
    'frei': 'Free',
    'Plus': 'Plus',
    'Vorführung': 'Demo',
    'Werkzeuge ansehen': 'See the tools',
    "Los geht's": 'Let’s go',

    'Was Plus ausdrücklich nicht kauft': 'What Plus explicitly does not buy',
    'Die meisten Wohnungsportale verkaufen genau das. TrimmoTrade nicht – und das ist keine Marketingzeile, sondern der Grund, warum die Reihenfolge deiner Treffer nachvollziehbar bleibt.':
      'Most property portals sell exactly that. TrimmoTrade does not – and that is not a marketing line but the reason the order of your results stays explainable.',
    'Alles im Vergleich': 'Everything compared',
    '{11}Eigenes Inserat hervorheben': '{11}Promote your own listing',
    'Für die anbietende Seite, unabhängig vom Tarif einzeln buchbar. Mit Plus {12} % günstiger.':
      'For advertisers, bookable separately regardless of plan. {12} % cheaper with Plus.',
    'Bezahlte Plätze stehen getrennt': 'Paid placements are kept separate',
    'Hervorgehobene Inserate erscheinen in einem eigenen Block über den Treffern, beschriftet als Top-Anzeigen, höchstens {15} auf einmal. Sie werden nicht zwischen die Ergebnisse gemischt und verschieben in der Liste darunter nichts. Wer sucht, sieht damit weiterhin eine Reihenfolge, die sich aus seinem Profil erklärt – und erkennt auf den ersten Blick, was bezahlt ist. Untergemischte Werbeplätze wären nach § 5b UWG ohnehin kennzeichnungspflichtig.':
      'Promoted listings appear in their own block above the results, labelled as top ads, at most {15} at a time. They are not mixed in among the results and move nothing in the list below. Anyone searching still sees an order that follows from their profile – and can tell at a glance what is paid for. Ads mixed in among results would require labelling under § 5b UWG anyway.',
    'Buchen lässt sich das unter': 'You can book it under',
    'bei deinen eigenen Inseraten.': 'with your own listings.',

    'Gründerplatz {2} von': 'Founder place {2} of',
    'Gründerplätze': 'Founder places',
    'Alle {1} Plätze sind vergeben': 'All {1} places have been taken',
    'Das Kontingent ist erschöpft. Der freie Tarif bleibt vollständig nutzbar – alles, was schützt und gerechnet werden muss, war nie hinter der Bezahlschranke.':
      'The allocation is used up. The free plan remains fully usable – everything that protects you or has to be calculated was never behind the paywall.',
    'Die ersten {1} bekommen Plus ein Jahr geschenkt': 'The first {1} get Plus free for a year',
    'Ein volles Jahr mit allen Plus-Funktionen, ohne Bezahlung.':
      'A full year with all Plus features, at no charge.',
    'Kein Abo:': 'Not a subscription:',
    'keine Zahlungsdaten, keine stille Verlängerung, keine Kündigung nötig. Nach {2} Monaten endet der Platz von selbst, und du entscheidest neu.':
      'no payment details, no silent renewal, no cancellation needed. After {2} months the place ends by itself and you decide again.',
    'von {4} Plätzen vergeben': 'of {4} places taken',
    'noch frei': 'still free',
    '· {8} vergeben': '· {8} taken',
    'Platz sichern – {10} Monate Plus, 0 €': 'Claim a place – {10} months of Plus, €0',
    'Mit dem Sichern gelten die': 'By claiming one you accept the',
    'Geschäftsbedingungen': 'terms and conditions',
    ', insbesondere § 6. Ein Widerrufsrecht besteht nicht, weil keine Zahlungspflicht entsteht – beenden lässt sich der Platz trotzdem jederzeit.':
      ', in particular § 6. There is no right of withdrawal because no payment obligation arises – you can still end the place at any time.',
    'In dieser Vorführung gibt es keinen Server, der die Plätze zentral zählt. Der Zähler oben ist deshalb eine Hochrechnung aus der Zeit seit dem Start, keine Messung. Im Betrieb vergibt der Server jede Nummer genau einmal.':
      'In this demo there is no server counting the places centrally. The counter above is therefore an extrapolation from the time since launch, not a measurement. In production the server issues each number exactly once.',
    'Plus läuft ab sofort für {0} Monate': 'Plus now runs for {0} months',
    ', bis zum {1}.': ', until {1}.',
    'Keine Zahlungsdaten hinterlegt und keine nötig.': 'No payment details stored, and none needed.',
    'Keine automatische Verlängerung. Der Platz endet von selbst.':
      'No automatic renewal. The place ends by itself.',
    'Vier Wochen vor Ablauf erinnert dich TrimmoTrade – rechtzeitig genug, um in Ruhe zu entscheiden.':
      'Four weeks before it expires TrimmoTrade reminds you – early enough to decide without pressure.',
    'Jederzeit zurückgebbar, ohne Begründung.': 'Returnable at any time, no reason required.',
    'Es gilt § 6 der': '§ 6 of the',
    'Hier wird nichts abgebucht und nichts abgeschlossen. Der Schalter oben ändert nur, welche Funktionen diese Anwendung dir freigibt – damit du siehst, worin der Unterschied besteht.':
      'Nothing is charged here and nothing is signed up for. The switch above only changes which features this app unlocks for you – so you can see what the difference is.',

    'Häufige Fragen': 'Frequently asked questions',
    'Wie kündige ich?': 'How do I cancel?',
    'Im Monatstarif zum Ende des laufenden Monats, mit einem Klick in diesem Bereich. Es gibt keine Mindestlaufzeit, keine Kündigungsfrist und keine Rückfrage, warum du gehst. Im Jahrestarif läuft das Abo zum Ende des bezahlten Jahres aus und verlängert sich nur, wenn du zustimmst.':
      'On the monthly plan, at the end of the current month, with one click in this section. There is no minimum term, no notice period and no question about why you are leaving. On the yearly plan the subscription runs out at the end of the paid year and only renews if you agree.',
    'Was passiert mit meinen Daten, wenn ich kündige?': 'What happens to my data if I cancel?',
    'Nichts. Merkliste, Profil, Notizen und Suchaufträge bleiben vollständig erhalten – nur die Plus-Funktionen sind dann nicht mehr verfügbar. Über den vierten Suchauftrag hinaus wird nichts gelöscht, er wird nur nicht mehr geprüft, bis du wieder Platz schaffst.':
      'Nothing. Your saved list, profile, notes and saved searches stay fully intact – only the Plus features are no longer available. Nothing beyond the fourth saved search is deleted; it just stops being checked until you make room again.',
    'Warum gibt es überhaupt Anzeigen?': 'Why are there ads at all?',
    'Weil die Suche sonst nicht vollständig kostenlos bleiben könnte. Wer eine Wohnung sucht, hat oft gerade wenig Geld – ausgerechnet dann eine Bezahlschranke vor die Suche zu stellen, wäre verkehrt. Anzeigen sind deshalb der Preis des freien Tarifs, und sie sind immer als Anzeige gekennzeichnet.':
      'Because otherwise the search could not stay completely free. People looking for an apartment often have little money right then – putting a paywall in front of the search at exactly that moment would be wrong. Ads are therefore the price of the free plan, and they are always labelled as ads.',
    'Bekommen Werbetreibende meine Daten?': 'Do advertisers get my data?',
    'Nein. Welche Anzeige erscheint, entscheidet sich im Browser anhand der Stelle auf der Seite – nicht anhand deines Profils, deiner Suche oder deines Verhaltens. Es gibt keinen Server, an den etwas gehen könnte.':
      'No. Which ad appears is decided in your browser from the position on the page – not from your profile, your search or your behaviour. There is no server anything could go to.',
    'Bringt Plus mir eine Wohnung schneller?': 'Does Plus get me an apartment faster?',
    'Es spart vor allem Handarbeit: mehrere Suchaufträge statt einem, Serienbewerbung statt jede Anfrage einzeln, Besichtigungen als Route statt als Zettelwirtschaft.':
      'Mostly it saves manual work: several saved searches instead of one, batch applications instead of one enquiry at a time, viewings as a route instead of a pile of notes.',
    'Dazu kommt eines, das offen ausgesprochen gehört:': 'And one thing that deserves to be said openly:',
    'Deine Anfrage steht im Postfach der anbietenden Seite oben': 'Your enquiry sits at the top of the advertiser’s inbox',
    'und ist dort mit „Plus“ gekennzeichnet. Ob das hilft, entscheidet die anbietende Seite – TrimmoTrade sagt ihr ausdrücklich dazu, dass die Reihenfolge bezahlt ist und nichts über die Eignung aussagt. Keine Anfrage wird verborgen, gekürzt oder gelöscht, weil jemand nicht zahlt.':
      'and is marked “Plus” there. Whether that helps is up to the advertiser – TrimmoTrade explicitly tells them that the order is paid for and says nothing about suitability. No enquiry is hidden, shortened or deleted because someone is not paying.',
    'Ist es fair, dass zahlende Anfragen oben stehen?': 'Is it fair that paying enquiries come first?',
    'Eine ehrliche Antwort: Es ist ein Vorteil, und er kostet Geld. TrimmoTrade hält ihn deshalb so klein und so sichtbar wie möglich – die anbietende Seite sieht die Kennzeichnung, sieht alle Anfragen vollständig und kann die Reihenfolge ignorieren. Was Plus nicht kann: den Inhalt einer Anfrage verändern, eine Bewertung verbessern oder andere Anfragen verdrängen.':
      'An honest answer: it is an advantage, and it costs money. TrimmoTrade therefore keeps it as small and as visible as possible – the advertiser sees the label, sees every enquiry in full, and can ignore the order. What Plus cannot do: change the content of an enquiry, improve a score, or push other enquiries out.',
    'Alles, was mit der': 'Everything to do with the',
    'Wohnung selbst': 'apartment itself',
    'zu tun hat – Prüfhinweis gegen Betrug, Vergleichsmiete, Chancen, echte Kosten –, bleibt im freien Tarif vollständig. Diese Grenze verschiebt sich nicht.':
      '– the fraud check notice, benchmark rent, your chances, real costs – stays complete on the free plan. That line does not move.',
    'Kann ich mein eigenes Inserat nach oben kaufen?': 'Can I buy my own listing to the top?',
    'Ja, und zwar unabhängig vom Tarif: Es gibt drei Hervorhebungen ab {18}. Sie erscheinen in einem eigenen, als bezahlt beschrifteten Block über den Treffern – nie zwischen ihnen. Was du dabei nicht kaufst: eine bessere Bewertung deines Inserats oder einen anderen Platz in der Reihenfolge darunter.':
      'Yes, and regardless of plan: there are three promotion options from {18}. They appear in their own block above the results, labelled as paid – never among them. What you are not buying: a better score for your listing, or a different position in the order below.',
    'Was passiert nach dem Gründerjahr?': 'What happens after the founder year?',
    'Es endet. Ohne Rechnung, ohne Abbuchung, ohne dass du kündigen müsstest – ein Gründerplatz ist kein Abo, das sich stillschweigend in ein bezahltes verwandelt. Vier Wochen vorher weist TrimmoTrade darauf hin. Wer dann weitermachen will, entscheidet sich aktiv dafür; wer nichts tut, nutzt den freien Tarif weiter.':
      'It ends. No invoice, no charge, no need to cancel – a founder place is not a subscription that quietly turns into a paid one. TrimmoTrade points this out four weeks in advance. Anyone who wants to carry on actively chooses to; anyone who does nothing carries on with the free plan.',
    'Kann ich Plus erst ausprobieren?': 'Can I try Plus first?',
    'In dieser Vorführung ist Plus mit einem Klick an- und abschaltbar, damit du beide Welten vergleichen kannst. Im Betrieb wären die ersten vierzehn Tage kostenlos und ohne Zahlungsdaten.':
      'In this demo Plus can be switched on and off with one click so you can compare both worlds. In production the first fourteen days would be free and without payment details.'
  });

  /* ------------------------- Anmeldung und Konto ------------------------- */

  e({
    'Willkommen bei TrimmoTrade': 'Welcome to TrimmoTrade',
    'Warum steht der Passkey oben?': 'Why is the passkey at the top?',
    'Weil er als Einziges gegen die häufigste Masche schützt: eine nachgebaute Anmeldeseite. Ein Passkey ist an die Adresse gebunden, unter der er angelegt wurde. Wer auf eine gefälschte Seite hereinfällt, gibt dort nichts preis – es gibt nichts einzugeben. Der Schlüssel entsteht im Sicherheitschip deines Geräts und verlässt ihn nie.':
      'Because it is the only one that protects against the commonest trick: a fake sign-in page. A passkey is bound to the address it was created under. Anyone falling for a forged page gives nothing away – there is nothing to type. The key is created in your device’s security chip and never leaves it.',
    'Bei Google, Microsoft und Apple bekommt TrimmoTrade Name und E-Mail-Adresse, dein Passwort dort aber nie zu sehen. Beim Weg über die E-Mail-Adresse gibt es gar kein Passwort, sondern einen Code, der zehn Minuten gilt.':
      'With Google, Microsoft and Apple, TrimmoTrade receives your name and email address but never sees your password there. Going via your email address there is no password at all, just a code valid for ten minutes.',
    'E-Mail-Adresse': 'Email address',
    'name@beispiel.de': 'name@example.com',
    'Name (freiwillig)': 'Name (optional)',
    'wie du in Anfragen erscheinst': 'how you appear in enquiries',
    'Code anfordern': 'Request code',
    'anderes Verfahren wählen': 'choose a different method',
    'Wir haben einen sechsstelligen Code an': 'We have sent a six-digit code to',
    'geschickt. Er gilt {1} Minuten.': '. It is valid for {1} minutes.',
    'Code': 'Code',
    'Anmelden': 'Sign in',
    'neuen Code anfordern': 'request a new code',
    'Adresse ändern': 'change address',
    'Nachgebildeter Ablauf': 'Simulated flow',
    'Das echte Verfahren braucht zwingend eine Serverseite, die das Geheimnis hält und das zurückgegebene Token prüft. Ein reiner Browser kann das nicht. Was du gleich siehst, entspricht dem Ablauf – die Bestätigung kommt aber nicht von {1}.':
      'The real procedure necessarily needs a server side that holds the secret and verifies the returned token. A browser alone cannot do that. What you are about to see matches the flow – but the confirmation does not come from {1}.',
    'TrimmoTrade möchte auf dein Konto zugreifen': 'TrimmoTrade would like to access your account',
    'Name und Profilbild': 'Name and profile picture',
    'E-Mail-Adresse und ob sie bestätigt ist': 'Email address and whether it is verified',
    'Kein Zugriff auf Kontakte, Kalender, Dateien oder Postfach':
      'No access to contacts, calendar, files or mailbox',
    'Dein Passwort bekommt TrimmoTrade nie zu sehen': 'TrimmoTrade never gets to see your password',
    'Welches Konto?': 'Which account?',
    'Name': 'Name',
    'Zulassen und anmelden': 'Allow and sign in',
    'Abbrechen': 'Cancel',
    'Was im Betrieb einzurichten ist': 'What has to be set up in production',
    'Ich habe die': 'I have read the',
    'Allgemeinen Geschäftsbedingungen': 'terms and conditions',
    'und die': 'and the',
    'Datenschutzerklärung': 'privacy policy',
    'gelesen und bin damit einverstanden.': 'and agree to them.',
    'Eine Anmeldung allein hält keinen Betrüger auf': 'Signing in alone stops no fraudster',
    'Ein Konto ist überall in zwei Minuten angelegt. Was wirklich hilft, ist die Stufe darüber – ein an das Gerät gebundener Schlüssel, eine bestätigte Telefonnummer, ein geprüfter Ausweis – und dass man':
      'An account takes two minutes to create anywhere. What really helps is the level above that – a key bound to the device, a verified phone number, a checked ID – and that you can',
    'sieht': 'see',
    ', welche Stufe das Gegenüber hat. TrimmoTrade zeigt das an jedem Inserat.':
      'which level the other party has. TrimmoTrade shows this on every listing.',

    'Wie du angemeldet bist, was davon bestätigt ist und wie du beides änderst.':
      'How you are signed in, what of that is verified, and how to change either.',
    'E-Mail': 'Email',
    'Angemeldet über': 'Signed in via',
    'Konto seit': 'Account since',
    'Zuletzt angemeldet': 'Last signed in',
    'Passkey': 'Passkey',
    'Abmelden': 'Sign out',
    'Konto löschen': 'Delete account',
    'Vertrauensstufe': 'Trust level',
    'Was über ein Konto bekannt ist, entscheidet, wie viel es darf – und was andere über es sehen. Genau hier, nicht bei der Anmeldung selbst, sitzt der Schutz vor Betrug.':
      'What is known about an account decides how much it may do – and what others see about it. This, not the sign-in itself, is where protection from fraud sits.',
    'Angaben ändern': 'Change details',
    'Wird die Adresse geändert, gilt sie erst nach einer neuen Bestätigung – sonst könnte man ein Konto auf eine fremde Adresse umschreiben.':
      'If the address is changed it only takes effect after fresh verification – otherwise an account could be rewritten to someone else’s address.',
    'Was von deinem Konto gespeichert wird': 'What is stored about your account',
    'Name, E-Mail-Adresse, das gewählte Verfahren und die Vertrauensstufe – im Speicher dieses Browsers, wie alles andere. Beim Passkey liegt nur die Kennung hier; der Schlüssel selbst bleibt im Sicherheitschip des Geräts und ist von hier aus nicht lesbar.':
      'Name, email address, the chosen method and the trust level – in this browser’s storage, like everything else. With a passkey only the identifier is here; the key itself stays in the device’s security chip and cannot be read from here.',
    '„Konto löschen“ entfernt diese Angaben vollständig. Merkliste, Profil und Notizen bleiben erhalten – beides zusammen löschst du über':
      '“Delete account” removes these details entirely. Your saved list, profile and notes remain – you delete both together via',
    'im Fußbereich.': 'in the footer.',
    'Eine bestätigte Nummer ist der Punkt, an dem Betrug im großen Stil unwirtschaftlich wird: Nummern kosten Geld und lassen sich nicht beliebig oft neu beschaffen.':
      'A verified number is the point at which large-scale fraud stops paying: numbers cost money and cannot be obtained again indefinitely.',
    'Mobilnummer': 'Mobile number',
    'Nachgebildet': 'Simulated',
    'Es gibt keinen Server, der eine SMS verschicken könnte. Im Betrieb käme jetzt ein Code auf das Telefon – über einen Versanddienst, der pro Nachricht abrechnet.':
      'There is no server that could send an SMS. In production a code would arrive on your phone now – via a delivery service billing per message.',
    'Als bestätigt eintragen': 'Mark as verified',
    'Für Inserierende ist das der Maßstab. Geprüft wird über einen Dienst – POSTIDENT in der Filiale oder per Video, oder die eID-Funktion des Personalausweises.':
      'For advertisers this is the benchmark. Verification runs through a service – POSTIDENT in a branch or by video, or the eID function of the German ID card.',
    'Der Ausweis selbst wird nicht gespeichert.': 'The ID document itself is not stored.',
    'Zurück kommt nur die Bestätigung, dass die Person geprüft wurde, mit Name und Geburtsdatum.':
      'All that comes back is confirmation that the person was verified, with name and date of birth.',
    'Ein Ausweis je Konto. Wer aussortiert wird, kann nicht in fünf Minuten wiederkommen.':
      'One ID per account. Anyone removed cannot be back five minutes later.',
    'Kostet Geld – je nach Verfahren wenige Euro je Prüfung. Deshalb sinnvoll für Inserierende, nicht für alle.':
      'It costs money – a few euros per check, depending on the method. Which is why it makes sense for advertisers, not for everyone.',
    'Hier gibt es keinen Prüfdienst. Der Knopf setzt die Stufe, damit du siehst, was sie bewirkt.':
      'There is no verification service here. The button sets the level so you can see what it does.',
    'Als geprüft eintragen': 'Mark as verified'
  });

  /* ------------------------- Dokumententresor ------------------------- */

  e({
    'Wer sich auf zwanzig Wohnungen bewirbt, verschickt zwanzig Mal Gehaltsnachweise, Ausweiskopie und Schufa – an Fremde, ohne Ablaufdatum. Danach liegen die Unterlagen in zwanzig Postfächern und bleiben dort. Hier legst du sie einmal verschlüsselt ab und verschickst nur noch einen Verweis, der abläuft und sich widerrufen lässt.':
      'Apply for twenty apartments and you send payslips, a copy of your ID and a Schufa report twenty times – to strangers, with no expiry date. After that your documents sit in twenty mailboxes and stay there. Here you store them once, encrypted, and only send a link that expires and can be revoked.',
    'Was hier tatsächlich passiert': 'What actually happens here',
    'Deine Dateien werden im Browser mit': 'Your files are encrypted in the browser with',
    'AES-GCM und 256 Bit': 'AES-GCM and 256 bits',
    'verschlüsselt, bevor sie gespeichert werden. Der Schlüssel entsteht aus deinem Kennwort über':
      'before they are stored. The key is derived from your password using',
    'PBKDF2 mit {1} Runden': 'PBKDF2 with {1} rounds',
    'und wird nirgends abgelegt – er lebt nur im Arbeitsspeicher, solange der Tresor offen ist. Nach dem Neuladen der Seite ist er weg.':
      'and is stored nowhere – it lives only in memory while the vault is open. Reload the page and it is gone.',
    'Jedes Dokument bekommt einen': 'Each document gets its',
    'eigenen Schlüssel': 'own key',
    ', der mit dem Tresorschlüssel umschlossen wird. Nur deshalb lässt sich eine einzelne Gehaltsabrechnung freigeben, ohne den ganzen Tresor zu öffnen. Auch der Dateiname wird verschlüsselt – er verrät sonst mehr, als vielen bewusst ist.':
      ', wrapped with the vault key. That is the only reason a single payslip can be shared without opening the whole vault. The file name is encrypted too – otherwise it gives away more than most people realise.',
    'Beim Freigeben wandern die Dokumentschlüssel in den': 'When sharing, the document keys go into the',
    'Fragmentteil': 'fragment part',
    'des Verweises, also hinter das Rautezeichen. Browser senden diesen Teil nie an einen Server. Ein Betreiber sähe also die Anfrage, aber nie den Schlüssel.':
      'of the link, that is, after the hash sign. Browsers never send that part to a server. An operator would see the request but never the key.',
    'Was hier fehlt, ist der Server.': 'What is missing here is the server.',
    'In dieser Vorführung liegt das Chiffrat in diesem Browser, der Verweis funktioniert deshalb nur auf diesem Gerät. Im Betrieb läge dort das Chiffrat und sonst nichts: kein Schlüssel, keine Datei im Klartext, nichts, was ein Einbruch verwertbar machen würde. Ablauf und Abrufzähler würde der Server durchsetzen – hier tut es die Anwendung selbst.':
      'In this demo the ciphertext lives in this browser, so the link only works on this device. In production the server would hold the ciphertext and nothing else: no key, no file in the clear, nothing a break-in could make use of. Expiry and the access counter would be enforced by the server – here the app does it itself.',

    'Dieser Browser kann das nicht': 'This browser cannot do it',
    'Für den Tresor braucht es die Verschlüsselungsfunktionen des Browsers und einen lokalen Datenspeicher. Beides fehlt hier – meist, weil die Seite ohne gesicherte Verbindung geöffnet wurde oder der private Modus den Speicher sperrt.':
      'The vault needs the browser’s cryptography functions and local storage. Both are missing here – usually because the page was opened without a secure connection, or private mode is blocking storage.',
    /* „Profil“ steht in der Navigation und mitten in diesem Satz – ein
       Schlüssel, zwei Stellen. Deshalb hier großgeschrieben: Es ist der
       Name eines Bereichs, nicht ein beliebiges Wort. */
    'Die Bewerbermappe im': 'The application folder in your',
    'funktioniert weiterhin; du verschickst deine Unterlagen dann wie gewohnt selbst.':
      'still works; you then send your documents yourself as usual.',

    'Tresor einrichten': 'Set up the vault',
    'Ein Kennwort, das nur du kennst. Daraus entsteht der Schlüssel – gespeichert wird er nirgends.':
      'A password only you know. The key is derived from it – and stored nowhere.',
    'Kennwort': 'Password',
    'mindestens acht Zeichen': 'at least eight characters',
    'Kennwort wiederholen': 'Repeat password',
    'Dieses Kennwort lässt sich nicht zurücksetzen': 'This password cannot be reset',
    'Es gibt keinen Server, der es kennt, und keine Wiederherstellung per E-Mail. Genau das ist der Punkt: Wer den Speicher dieses Geräts in die Hände bekommt, kommt ohne das Kennwort nicht an deine Unterlagen. Vergisst du es, sind sie auch für dich verloren – dann bleibt nur, den Tresor zu leeren und neu zu füllen.':
      'There is no server that knows it and no recovery by email. That is precisely the point: anyone who gets hold of this device’s storage cannot reach your documents without the password. If you forget it, they are lost to you as well – all that remains is to empty the vault and fill it again.',
    'Tresor anlegen': 'Create vault',
    'Tresor gesperrt': 'Vault locked',
    'Öffnen': 'Open',
    'Kennwort vergessen – Tresor leeren': 'Password forgotten – empty the vault',

    'Deine Unterlagen': 'Your documents',
    'Tresor schließen': 'Close vault',
    'Art der Unterlage': 'Type of document',
    'Datei': 'File',
    'Datei wählen': 'Choose file',
    'noch keine gewählt': 'none chosen yet',
    'Verschlüsselt ablegen': 'Store encrypted',
    'PDF, JPG, PNG, WEBP oder HEIC, je bis 8 MB. Die Datei wird verschlüsselt, bevor sie den Arbeitsspeicher verlässt – unverschlüsselt liegt sie zu keinem Zeitpunkt im Speicher des Geräts.':
      'PDF, JPG, PNG, WEBP or HEIC, up to 8 MB each. The file is encrypted before it leaves memory – at no point does it sit unencrypted in the device’s storage.',
    'Freigaben': 'Shares',
    'von {10} noch gültig': 'of {10} still valid',
    'Ein Widerruf wirkt sofort: Der Verweis führt danach ins Leere, auch wenn ihn jemand gespeichert hat. Bei Dateien im E-Mail-Postfach gibt es das nicht.':
      'Revoking takes effect immediately: the link then leads nowhere, even if someone saved it. Files in an email inbox offer nothing of the sort.',

    'Was du ohnehin nie mitschicken solltest': 'What you should never send anyway',
    'Auch der beste Tresor hilft nicht gegen die falsche Reihenfolge.':
      'Even the best vault does not help against the wrong order of events.',
    'Schufa und Ausweiskopie gehören nicht in die erste Anfrage.':
      'A Schufa report and a copy of your ID do not belong in the first enquiry.',
    'Erst wenn die Wohnung ernsthaft in Betracht kommt – also nach der Besichtigung.':
      'Only once the apartment is seriously in play – that is, after the viewing.',
    'Die Ausweisnummer schwärzen.': 'Black out the ID number.',
    'Für die Identitätsprüfung reichen Name, Geburtsdatum und Foto; die Nummer braucht niemand.':
      'Name, date of birth and photo are enough to check identity; nobody needs the number.',
    'Kontoauszüge sind keine Einkommensnachweise.': 'Bank statements are not proof of income.',
    'Sie zeigen jede Ausgabe deines Lebens. Gehaltsabrechnungen genügen.':
      'They show every expense in your life. Payslips are sufficient.',
    'Fragen nach Familienplanung, Religion, Herkunft, Parteizugehörigkeit oder Vorstrafen':
      'Questions about family planning, religion, origin, party membership or criminal record',
    'sind unzulässig. Sie dürfen falsch beantwortet werden, ohne dass der Vertrag deshalb angreifbar wird.':
      'are not permitted. They may be answered untruthfully without making the contract challengeable.',

    'Freigegebene Unterlagen': 'Shared documents',
    'Wird entschlüsselt…': 'Decrypting…',
    'So funktioniert dieser Verweis': 'How this link works',
    'Die Unterlagen wurden verschlüsselt abgelegt. Der Schlüssel steckt im Teil dieses Verweises hinter dem Rautezeichen – Browser senden ihn nie an einen Server. Wer den Verweis nicht hat, kann die Dateien nicht lesen, auch nicht der Betreiber.':
      'The documents were stored encrypted. The key sits in the part of this link after the hash sign – browsers never send it to a server. Anyone without the link cannot read the files, the operator included.',
    'Dieser Verweis ist unvollständig.': 'This link is incomplete.',
    'gültig bis': 'valid until',
    'Abrufe': 'accesses',
    'freigegeben': 'shared',
    '. Nach Ablauf oder Widerruf führt dieser Verweis ins Leere – die Dateien lassen sich dann nicht mehr öffnen.':
      '. Once expired or revoked this link leads nowhere – the files can no longer be opened.',
    'Kein Zugriff': 'No access',
    'Das ist der Sinn der Sache: Ein Verweis, der abgelaufen oder widerrufen wurde, lässt sich nicht wiederbeleben – auch nicht von der Person, die ihn erstellt hat.':
      'That is the whole point: a link that has expired or been revoked cannot be brought back – not even by the person who created it.',
    'Vorschau für diesen Dateityp gibt es hier nicht. Du kannst die Datei entschlüsselt sichern.':
      'There is no preview for this file type here. You can save the file decrypted.',
    'Für diesen Dateityp gibt es hier keine Vorschau. Sichere die Datei, um sie zu öffnen.':
      'There is no preview for this file type here. Save the file to open it.',
    'Entschlüsselt sichern': 'Save decrypted',
    'Verschickt wird kein Anhang, sondern ein Verweis, der von selbst erlischt. Wähl nur aus, was in diesem Schritt wirklich gebraucht wird.':
      'What gets sent is not an attachment but a link that expires by itself. Select only what is genuinely needed at this step.',
    'Dokumente': 'Documents',
    'Empfänger (nur für deine Übersicht)': 'Recipient (for your overview only)',
    'Gültig für': 'Valid for',
    '3 Tage': '3 days',
    '7 Tage': '7 days',
    '14 Tage': '14 days',
    '30 Tage': '30 days',
    'Höchstens abrufbar': 'Retrievable at most',
    'einmal': 'once',
    'dreimal': 'three times',
    'fünfmal': 'five times',
    'zehnmal': 'ten times',
    'Kürzer und seltener ist besser. Für eine Besichtigung reicht meist ein Abruf über drei Tage.':
      'Shorter and fewer is better. For a viewing, one access over three days is usually enough.',
    'Verweis erzeugen': 'Create link',
    'Unterlagen sicher mitschicken': 'Send documents securely',
    'Verweis erzeugt und unten in den Text eingefügt: {1} {2}, gültig {3} {4}, {5} {6}.':
      'Link created and inserted into the text below: {1} {2}, valid {3} {4}, {5} {6}.',
    'Widerrufen kannst du ihn jederzeit im': 'You can revoke it at any time in the',
    'Dieser Verweis gilt': 'This link is valid for',
    'Tage': 'days',
    'und lässt sich': 'and can be opened',
    'Mal': 'times',
    'öffnen. Danach ist er wertlos. Im Tresor kannst du ihn jederzeit vorher widerrufen.':
      '. After that it is worthless. You can revoke it in the vault at any time before then.',
    'Verweis': 'Link',
    'Der Schlüssel steckt im Verweis': 'The key is in the link',
    'Alles hinter dem Rautezeichen ist der Schlüssel. Wer den Verweis weitergibt, gibt die Unterlagen weiter. Verschick ihn deshalb einzeln und nicht in Verteilern.':
      'Everything after the hash sign is the key. Whoever passes on the link passes on the documents. Send it individually, not to a mailing list.',
    'In dieser Vorführung liegen die verschlüsselten Dateien in diesem Browser – der Verweis funktioniert deshalb nur auf diesem Gerät.':
      'In this demo the encrypted files live in this browser – so the link only works on this device.',
    'Verweis kopieren': 'Copy link'
  });

  /* ------------------------- Werkzeuge ------------------------- */

  e({
    'Rechnen, prüfen, protokollieren. Das meiste davon braucht man genau einmal – und genau dann ist es viel wert. Deshalb ist bis auf die Marktdaten alles im freien Tarif enthalten.':
      'Calculate, check, record. Most of this you need exactly once – and precisely then it is worth a lot. Which is why everything except the market data is included in the free plan.',

    'Was kann ich mir leisten?': 'What can I afford?',
    'Die meisten scheitern nicht am eigenen Budget, sondern an einer Regel, die Vermieter anwenden: das Dreifache der Kaltmiete als Nettoeinkommen. Beide Grenzen stehen hier nebeneinander.':
      'Most people fail not on their own budget but on a rule landlords apply: net income of three times the base rent. Both limits are shown side by side here.',
    'Deine Zahlen': 'Your figures',
    'Nettoeinkommen des Haushalts im Monat': 'Net monthly household income',
    'Andere feste Raten im Monat': 'Other fixed monthly payments',
    'Kredit, Leasing, Unterhalt': 'Loan, leasing, maintenance',
    'Eigenkapital für einen Kauf': 'Equity for a purchase',
    'Dein Suchbudget von {1} liegt innerhalb dessen, was dein Haushalt trägt. Damit suchst du realistisch.':
      'Your search budget of {1} is within what your household can carry. That makes your search realistic.',
    'Dein Suchbudget liegt über dieser Rechnung': 'Your search budget is above this calculation',
    'Im Profil suchst du bis': 'In your profile you are searching up to',
    'warm. Bequem wären {2}, die Schmerzgrenze liegt bei {3} – du bist also {4} darüber. Das kann eine bewusste Entscheidung sein; oft ist es aber schlicht nie nachgerechnet worden.':
      'incl. bills. Comfortable would be {2}, the pain threshold is {3} – so you are {4} above it. That can be a deliberate decision; often it simply has never been worked out.',
    'Suchbudget auf {6} setzen': 'Set search budget to {6}',
    'auf {8} setzen': 'set to {8}',
    'Trag dein Nettoeinkommen ein, dann rechnet TrimmoTrade.':
      'Enter your net income and TrimmoTrade will do the maths.',
    'Warmmiete, die bequem passt (30 % vom Verfügbaren)':
      'Rent incl. bills that fits comfortably (30 % of what is available)',
    'noch machbar, aber ohne Puffer (35 %)': 'still doable, but with no buffer (35 %)',
    'Kaltmiete, die Vermieter erwarten (Netto ÷ 3)': 'Base rent landlords expect (net income ÷ 3)',
    'Kaltmiete, mit der du realistisch suchst': 'Base rent you can realistically search with',
    'Wie groß darf die Wohnung sein?': 'How big can the apartment be?',
    'Bei {9} Kaltmiete – das sind {10} warm abzüglich rund 26 % für Neben- und Heizkosten – und dem mittleren Preis je Viertel der Stadt.':
      'At {9} base rent – that is {10} incl. bills less around 26 % for service and heating costs – and the average price per neighbourhood in the city.',
    'Grau hinterlegt, wo es für {12} {13} eng wird.': 'Shaded grey where it gets tight for {12} {13}.',
    'Und wenn du kaufen willst?': 'And if you want to buy?',
    'Kaufpreis, den die Rate trägt': 'Purchase price the instalment supports',
    'Monatsrate (35 % vom Verfügbaren)': 'Monthly instalment (35 % of what is available)',
    'Darlehen bei {17} % Zins und {18} % Tilgung': 'Loan at {17} % interest and {18} % repayment',
    'Kaufnebenkosten – die müssen aus dem Eigenkapital kommen':
      'Purchase costs – these have to come out of your equity',
    'Reicht dein Eigenkapital nicht für die Nebenkosten, finanziert kaum eine Bank.':
      'If your equity does not cover the purchase costs, hardly any bank will lend.',
    'Genauer rechnen unter „Mieten oder kaufen“': 'Calculate more precisely under “Rent or buy”',
    'Die 30-Prozent-Regel ist eine Faustregel, keine Grenze':
      'The 30 per cent rule is a rule of thumb, not a limit',
    'Wer wenig verdient, gibt fast zwangsläufig mehr als 30 % fürs Wohnen aus – in vielen Städten sind 40 % und mehr Alltag. Die Zahl taugt nicht als Vorwurf, sondern als Warnsignal: Über 40 % bleibt für unerwartete Ausgaben nichts übrig. Dann lohnt der Blick auf Wohngeld und den Wohnberechtigungsschein.':
      'Anyone on a low income almost inevitably spends more than 30 % on housing – in many cities 40 % and more is everyday reality. The figure is not a reproach but a warning sign: above 40 % nothing is left for unexpected expenses. That is when it is worth looking at housing benefit (Wohngeld) and the social housing entitlement certificate (WBS).',
    'Wohngeld prüfen': 'Check housing benefit',
    'Wohnberechtigungsschein prüfen': 'Check housing entitlement certificate',
    'Wohnberechtigungsschein': 'Housing entitlement certificate (WBS)',
    'Geförderte Wohnungen sind oft deutlich günstiger und ihre Mieten steigen langsamer. Der Schein ist der Schlüssel dazu – und die Hürde ist niedriger, als viele denken.':
      'Subsidised apartments are often considerably cheaper and their rents rise more slowly. The certificate is the key to them – and the bar is lower than many people think.',
    'Die Einkommensgrenze setzt dein Bundesland': 'Your federal state sets the income limit',
    'Sie unterscheidet sich erheblich – manche Länder liegen deutlich über dem Bundesrahmen, viele kennen zusätzliche Stufen für höhere Einkommen. TrimmoTrade rechnet deshalb nicht heimlich mit einer Zahl: Voreingestellt ist der Bundesrahmen aus § 9 WoFG ({2} für deine Haushaltsgröße), und du kannst ihn durch die Grenze deiner Stadt ersetzen. Sie steht auf der Seite deines Wohnungsamts.':
      'It varies considerably – some states are well above the federal framework, and many have extra tiers for higher incomes. So TrimmoTrade does not quietly compute with one number: the default is the federal framework from § 9 WoFG ({2} for your household size), and you can replace it with your city’s limit. It is on your housing office’s website.',
    'Deine Angaben': 'Your details',
    'Bruttojahreseinkommen des Haushalts': 'Gross annual household income',
    'davon Kinder': 'of which children',
    'davon erwerbstätig': 'of which in employment',
    'Einkommensgrenze deines Landes': 'Your state’s income limit',
    'leer = Bundesrahmen {8} €': 'empty = federal framework {8} €',
    'Abzüge und Freibeträge': 'Deductions and allowances',
    'Einkommensteuer wird gezahlt': 'Income tax is paid',
    '10 % Pauschale': '10 % flat rate',
    'Pflichtbeiträge zur Kranken- und Pflegeversicherung':
      'Compulsory health and long-term care insurance contributions',
    'Pflichtbeiträge zur Rentenversicherung': 'Compulsory pension insurance contributions',
    'Schwerbehinderung im Haushalt': 'Severe disability in the household',
    'zusätzlicher Freibetrag': 'additional allowance',
    'So kommt die Zahl zustande': 'How the figure is arrived at',
    'Bruttojahreseinkommen': 'Gross annual income',
    'maßgebliches Jahreseinkommen': 'relevant annual income',
    'eingestellte Einkommensgrenze': 'income limit set',
    'Wenn es passt: so geht es weiter': 'If it fits: what happens next',
    'Antrag beim Wohnungsamt': 'Apply at the housing office',
    'Formular der Stadt, meist auch online. Kostet je nach Kommune nichts bis rund 25 €.':
      'Your city’s form, usually available online too. Costs anywhere from nothing to about €25 depending on the municipality.',
    'Nachweise beilegen': 'Attach the evidence',
    'Einkommensnachweise der letzten zwölf Monate, Ausweis, Meldebescheinigung.':
      'Proof of income for the last twelve months, ID, registration certificate.',
    'Bearbeitung abwarten': 'Wait for processing',
    'Zwei bis acht Wochen. Beantrage früh – ohne Schein kannst du dich auf geförderte Wohnungen nicht bewerben.':
      'Two to eight weeks. Apply early – without the certificate you cannot apply for subsidised apartments.',
    'Gültigkeit beachten': 'Mind the validity',
    'Der Schein gilt in der Regel ein Jahr. Läuft er ab, während du suchst, verlängere rechtzeitig.':
      'The certificate is usually valid for a year. If it expires while you are searching, renew it in good time.',
    'Inserate mit WBS-Bedarf ansehen': 'See listings requiring a WBS',
    'Wohngeld bleibt millionenfach unbeantragt, weil viele annehmen, es stehe ihnen nicht zu. Diese Vorprüfung klärt in einer Minute, ob sich der Antrag lohnt.':
      'Housing benefit goes unclaimed millions of times over because many assume they are not entitled. This pre-check settles in a minute whether applying is worth it.',
    'Deine Situation': 'Your situation',
    'Bruttoeinkommen des Haushalts im Monat': 'Gross monthly household income',
    'Warmmiete im Monat': 'Monthly rent incl. bills',
    'Trifft eines davon auf dich zu?': 'Does any of these apply to you?',
    'Warum hier kein Eurobetrag steht': 'Why no euro amount is shown here',
    'Die Höhe folgt einer Formel mit Beiwerten, die je nach Haushaltsgröße verschieden sind, und hängt zusätzlich an der Mietstufe deiner Gemeinde. Beides ändert sich regelmäßig. Eine ausgedachte Zahl wäre schlimmer als keine – sie würde dich vom Antrag abhalten oder falsche Hoffnung machen. Den Betrag berechnet die Wohngeldstelle; die amtlichen Rechner der Länder liefern ihn verlässlich.':
      'The amount follows a formula with coefficients that differ by household size, and also depends on your municipality’s rent tier. Both change regularly. A made-up figure would be worse than none – it would either put you off applying or raise false hopes. The housing benefit office calculates the amount; the states’ official calculators give it reliably.'
  });

  /* ------------------------- Nebenkosten und Protokoll ------------------------- */

  e({
    'Nebenkostenabrechnung prüfen': 'Check the service-charge statement',
    'Schätzungen zufolge ist etwa jede zweite Betriebskostenabrechnung fehlerhaft. Am häufigsten stehen Posten darin, die gar nicht umgelegt werden dürfen – oder die Abrechnung kommt zu spät und die Nachzahlung ist damit hinfällig.':
      'By some estimates about half of all service-charge statements contain errors. Most often they include items that may not be passed on at all – or the statement arrives too late, which voids the additional payment.',
    'Trag die Posten aus deiner Abrechnung ein. Du musst nicht alle erfassen – die auffälligen genügen.':
      'Enter the items from your statement. You do not have to capture them all – the conspicuous ones are enough.',
    'Betrag für': 'Amount for',
    'Rahmendaten': 'Basic details',
    'Ende des Abrechnungszeitraums': 'End of the billing period',
    'Abrechnung bei dir eingegangen am': 'Statement received by you on',
    'Geleistete Vorauszahlungen': 'Advance payments made',
    'Auf dich entfallende Gesamtkosten': 'Total costs attributed to you',
    'Auffälligkeiten': 'Red flags',
    'Heizkosten wurden allein nach Wohnfläche verteilt': 'Heating costs were split by floor area alone',
    'ohne Verbrauchserfassung': 'without metering consumption',
    'Einsicht in die Belege wurde mir verweigert': 'I was refused access to the receipts',
    'Diese Posten dürfen umgelegt werden': 'These items may be passed on',
    'Der Katalog der Betriebskostenverordnung ist abschließend. Trag ein, was in deiner Abrechnung steht – die Summen erscheinen oben.':
      'The catalogue in the Operating Costs Ordinance (BetrKV) is exhaustive. Enter what is on your statement – the totals appear above.',
    'Diese Posten dürfen nicht umgelegt werden': 'These items may not be passed on',
    'Auch dann nicht, wenn im Mietvertrag etwas anderes steht – solche Klauseln sind unwirksam.':
      'Not even if the tenancy agreement says otherwise – such clauses are void.',
    'Die wichtigste Frist': 'The most important deadline',
    'Die Abrechnung muss dir binnen zwölf Monaten nach Ende des Abrechnungszeitraums zugehen. Danach ist eine Nachforderung ausgeschlossen – ein Guthaben bekommst du trotzdem. Umgekehrt hast du selbst zwölf Monate ab Zugang Zeit, Einwendungen zu erheben.':
      'The statement has to reach you within twelve months of the end of the billing period. After that no additional payment can be demanded – you still get any credit. Conversely, you yourself have twelve months from receipt to raise objections.',
    'Allgemeine Hinweise zur Einordnung, keine Rechtsberatung. Bei größeren Beträgen prüft ein Mieterverein die Abrechnung meist für einen kleinen Beitrag vollständig.':
      'General notes for orientation, not legal advice. For larger amounts a tenants’ association will usually check the whole statement for a small fee.',
    'Prüf den Text und passe ihn an. Schick ihn nachweisbar – per Einschreiben oder mit Lesebestätigung. Die Frist für Einwendungen beträgt zwölf Monate ab Zugang der Abrechnung.':
      'Check the text and adapt it. Send it verifiably – by registered post or with a read receipt. The deadline for objections is twelve months from receipt of the statement.',
    'Schreiben': 'Letter',
    'Vorlage zur Orientierung, keine Rechtsberatung. Bei hohen Beträgen lohnt der Gang zum Mieterverein.':
      'A template for orientation, not legal advice. For large amounts it is worth going to a tenants’ association.',

    'Übergabeprotokoll': 'Handover report',
    'Der wichtigste Zettel des ganzen Umzugs. Was hier nicht steht, gilt später als nicht vorhanden – und wird beim Auszug von deiner Kaution abgezogen.':
      'The most important piece of paper in the whole move. Whatever is not on it counts later as not having existed – and gets deducted from your deposit when you move out.',
    'Drei Regeln für die Übergabe': 'Three rules for the handover',
    'Fotografiere jeden Mangel mit Datum, bevor du unterschreibst. Trag auch Kleinigkeiten ein – der Kratzer im Parkett kostet später mehr als die Minute jetzt. Und unterschreibe nichts, worin eine Formulierung wie „in einwandfreiem Zustand übernommen“ steht, solange du nicht jeden Raum gesehen hast.':
      'Photograph every defect with the date before you sign. Note the small things too – the scratch in the parquet costs more later than the minute it takes now. And sign nothing containing wording like “taken over in flawless condition” until you have seen every room.',
    'Rahmen': 'Framework',
    'Anlass': 'Occasion',
    'Einzug – Übernahme': 'Moving in – taking over',
    'Auszug – Rückgabe': 'Moving out – handing back',
    'Anschrift der Wohnung': 'Address of the apartment',
    'Straße, Nr., PLZ, Ort, Lage im Haus': 'Street, no., postcode, town, position in the building',
    'Datum': 'Date',
    'Uhrzeit': 'Time',
    'Übergebende Person': 'Person handing over',
    'Übernehmende Person': 'Person taking over',
    'Weitere Anwesende': 'Others present',
    'Zeugen sind bei Streit Gold wert': 'Witnesses are worth their weight in gold in a dispute',
    'Zählerstände': 'Meter readings',
    'Mit Foto festhalten. Ohne abgelesenen Stand zahlst du unter Umständen den Verbrauch der Vormieter mit.':
      'Record them with a photo. Without a reading you may end up paying for the previous tenants’ consumption.',
    'Schlüssel': 'Keys',
    'Jeder fehlende Schlüssel kann beim Auszug eine ganze Schließanlage kosten. Zähl sie jetzt.':
      'Every missing key can cost an entire locking system when you move out. Count them now.',
    'Räume': 'Rooms',
    'Raum hinzufügen': 'Add room',
    'Bemerkungen': 'Remarks',
    'Vereinbarungen, offene Punkte, Termine für Nacharbeiten':
      'Agreements, open points, dates for remedial work',
    'Fertiges Protokoll': 'Finished report',
    'Drucken': 'Print',
    'Zweimal ausdrucken, beide Seiten unterschreiben, jede Seite behält ein Exemplar. Fotos gehören dazu – am besten als Anlage benannt und mit dem Datum im Dateinamen.':
      'Print two copies, both parties sign, each side keeps one. Photos belong with it – ideally named as an annex and with the date in the file name.'
  });

  /* ------------------------- Bestand: Titel und Beschreibungen -------------------------

     Der erzeugte Beispielbestand wird beim Sprachwechsel neu gebaut; die
     Bausteine unten sind die Teile, aus denen Titel und Beschreibungen
     entstehen. Viertel, Straßen und Städte bleiben deutsch – sie sind
     Eigennamen, und wer in Köln sucht, sucht nicht in „Cologne“. */

  e({
    '{0}-Zimmer-Wohnung': '{0}-room apartment',
    '{0} m² Zimmer in {1}er-WG': '{0} m² room in a {1}-person flatshare',
    '{0}-Zimmer-Wohnung zum Tausch': '{0}-room apartment for swap',
    'Haus': 'House',
    ' mit Balkon': ' with balcony',
    ' mit Garten': ' with garden',
    ' mit Terrasse': ' with terrace',
    ' und ': ' and ',
    ' oder ': ' or ',
    'Zimmer': 'rooms',

    'Die Wohnung liegt in {0} und umfasst {1}{2}.': 'The apartment is in {0} and comprises {1}{2}.',
    'Die Immobilie liegt in {0} und umfasst {1}{2}.': 'The property is in {0} and comprises {1}{2}.',
    '{0} m² Zimmerfläche in einer {1} m² großen Wohnung': '{0} m² of room space in a {1} m² apartment',
    '{0} Zimmer auf {1} m²': '{0} rooms across {1} m²',
    '{0} Zimmer auf {1} m² in {2}.': '{0} rooms across {1} m² in {2}.',
    ' im Erdgeschoss': ' on the ground floor',
    ' im Dachgeschoss': ' on the top floor',
    ' im {0}. Obergeschoss': ' on floor {0}',
    'Zur Ausstattung gehören {0}.': 'Features include {0}.',

    /* Eröffnungssätze */
    'Charmante Altbauwohnung mit hohen Decken, Stuck und großen Fenstern.':
      'Charming period apartment with high ceilings, stucco and large windows.',
    'Gewachsener Altbau, ruhig gelegen, mit Blick ins begrünte Hinterhaus.':
      'Established period building, quietly situated, looking onto the leafy rear courtyard.',
    'Klassische Gründerzeitwohnung mit Flügeltüren und Dielenboden.':
      'Classic nineteenth-century apartment with double doors and floorboards.',
    'Solide geschnittene Wohnung im gepflegten Mehrfamilienhaus.':
      'Solidly laid-out apartment in a well-kept apartment building.',
    'Zweckmäßige Wohnung mit gutem Schnitt und praktischer Raumaufteilung.':
      'Practical apartment with a good layout and sensible room division.',
    'Helle Wohnung in ruhiger Wohnanlage mit gepflegter Außenanlage.':
      'Bright apartment in a quiet development with well-kept grounds.',
    'Moderne Wohnung mit bodentiefen Fenstern und hochwertiger Ausstattung.':
      'Modern apartment with floor-to-ceiling windows and high-quality fittings.',
    'Frisch fertiggestellte Wohnung mit durchdachtem Grundriss.':
      'Newly completed apartment with a well-considered floor plan.',
    'Energieeffiziente Wohnung im nachhaltigen Neubauquartier.':
      'Energy-efficient apartment in a sustainable new-build quarter.',
    'Freistehendes Einfamilienhaus mit eigenem Grundstück und Garten.':
      'Detached family house with its own plot and garden.',
    'Gepflegtes Reihenmittelhaus in familienfreundlicher Nachbarschaft.':
      'Well-kept mid-terrace house in a family-friendly neighbourhood.',

    /* Zustand */
    'Die Wohnung wurde zuletzt vollständig renoviert und ist bezugsfertig.':
      'The apartment has recently been fully renovated and is ready to move into.',
    'Bad und Küche wurden vor wenigen Jahren erneuert.':
      'Bathroom and kitchen were renewed a few years ago.',
    'Der Zustand ist gepflegt; kleinere Gebrauchsspuren sind vorhanden.':
      'It is in well-kept condition; there is some minor wear.',
    'Vor Einzug werden Wände frisch gestrichen und die Böden aufgearbeitet.':
      'Before you move in the walls will be freshly painted and the floors refinished.',
    'Das Objekt ist unrenoviert und wird im Ist-Zustand übergeben.':
      'The property is unrenovated and will be handed over as it stands.',

    /* Lage */
    'Einkaufsmöglichkeiten, Bäckerei und Apotheke sind fußläufig erreichbar.':
      'Shops, a bakery and a pharmacy are within walking distance.',
    'Die nächste Haltestelle liegt rund fünf Gehminuten entfernt.':
      'The nearest stop is about a five-minute walk away.',
    'Kitas, Grundschule und Spielplatz befinden sich im direkten Umfeld.':
      'Nurseries, a primary school and a playground are right nearby.',
    'Der nächste Park ist in wenigen Minuten zu Fuß erreicht.':
      'The nearest park is a few minutes away on foot.',
    'Die Straße ist verkehrsberuhigt, abends wird es hier sehr still.':
      'The street is traffic-calmed and it gets very quiet here in the evening.',
    'Cafés, kleine Läden und Wochenmarkt prägen das Viertel.':
      'Cafés, small shops and a weekly market give the neighbourhood its character.',

    /* Formalien */
    'Bitte bringen Sie zur Besichtigung eine Selbstauskunft und die letzten drei Gehaltsnachweise mit.':
      'Please bring a tenant self-disclosure form and your last three payslips to the viewing.',
    'Eine Mietschuldenfreiheitsbescheinigung des Vorvermieters wird benötigt.':
      'A certificate of no rent arrears from your previous landlord is required.',
    'Die Besichtigung erfolgt in Einzelterminen, nicht als Sammelbesichtigung.':
      'Viewings are held as individual appointments, not as group viewings.',
    'Wir melden uns in der Regel innerhalb von zwei Werktagen zurück.':
      'We normally get back to you within two working days.',
    'Ein Wohnberechtigungsschein ist erforderlich.':
      'A housing entitlement certificate (WBS) is required.',

    /* Auffälligkeiten für die Vertragslupe */
    'Vereinbart ist eine Staffelmiete mit jährlicher Erhöhung um 3,5 % ab dem zweiten Mietjahr.':
      'A stepped rent (Staffelmiete) has been agreed, rising 3.5 % annually from the second year of the tenancy.',
    'Die Miete ist als Indexmiete an den Verbraucherpreisindex gekoppelt.':
      'The rent is index-linked (Indexmiete) to the consumer price index.',
    'Die Schönheitsreparaturen werden auf den Mieter übertragen und sind bei Auszug fachgerecht auszuführen.':
      'Cosmetic repairs are passed to the tenant and must be carried out professionally on moving out.',
    'Für die vorhandene Einbauküche wird eine Abstandszahlung von 4.500 € an den Vormieter fällig.':
      'A key-money payment of €4,500 is due to the previous tenant for the fitted kitchen.',
    'Die Kaution beträgt vier Nettokaltmieten und ist vor Schlüsselübergabe vollständig zu hinterlegen.':
      'The deposit is four months’ base rent and must be paid in full before the keys are handed over.',
    'Es fällt eine Courtage von 2,38 Nettokaltmieten inkl. MwSt. an, zahlbar durch den Mieter.':
      'A commission of 2.38 months’ base rent including VAT applies, payable by the tenant.',
    'Für die Möblierung wird ein monatlicher Zuschlag von 180 € zusätzlich zur Kaltmiete erhoben.':
      'A monthly surcharge of €180 for the furnishings is charged on top of the base rent.',
    'Da ich beruflich im Ausland bin, erfolgt die Schlüsselübergabe per Kurier, nachdem die erste Miete und die Kaution überwiesen wurden.':
      'As I am abroad for work, the keys will be handed over by courier once the first month’s rent and the deposit have been transferred.',
    'Eine Vorabbesichtigung ist leider nicht möglich; die Vergabe erfolgt nach Aktenlage.':
      'Unfortunately a prior viewing is not possible; the apartment will be allocated on the basis of the paperwork.',
    'Das Halten von Haustieren jeder Art ist ausnahmslos untersagt.':
      'Keeping pets of any kind is prohibited without exception.',
    'Der Vermieter behält sich vor, die Wohnung nach zwei Jahren wegen Eigenbedarf zu kündigen.':
      'The landlord reserves the right to terminate the tenancy after two years for personal use.',

    /* WG-Beschreibung */
    'Wir sind eine {0}er-WG ({1}).': 'We are a {0}-person flatshare ({1}).',
    'Wir verstehen uns als {0}.': 'We see ourselves as {0}.',
    'Es gibt einen Putzplan, an den sich alle halten.':
      'There is a cleaning rota and everyone sticks to it.',
    'Geputzt wird ohne festen Plan, aber es klappt.':
      'Cleaning happens without a fixed rota, but it works.',
    'Ein- bis zweimal die Woche kochen wir zusammen.':
      'We cook together once or twice a week.',
    'Jeder kocht für sich, gemeinsam essen ist möglich, aber kein Muss.':
      'Everyone cooks for themselves; eating together is possible but not expected.',
    'Rauchen: {0}. Haustiere: {1}.': 'Smoking: {0}. Pets: {1}.',

    /* Tausch */
    'Tauschangebot: {0}': 'Swap offer: {0}',
    'Gesucht wird eine Wohnung in {0} mit mindestens {1} Zimmern und {2} m², warm bis {3}.':
      'Looking for an apartment in {0} with at least {1} rooms and {2} m², up to {3} including bills.',
    'Zustimmung des Vermieters: {0}.': 'Landlord’s approval: {0}.',
    'liegt vor': 'granted',
    'in Klärung': 'being clarified',
    'noch offen': 'still open',

    /* Beispielanfragen */
    'Guten Tag, die Wohnung passt genau zu dem, was wir suchen. Wären zwei Termine kommende Woche möglich?':
      'Hello, the apartment is exactly what we are looking for. Would two appointments next week be possible?',
    'Hallo, ich arbeite seit vier Jahren fest in der Nähe und würde allein einziehen. Unterlagen liegen bereit.':
      'Hi, I have had a permanent job nearby for four years and would be moving in alone. My documents are ready.',
    'Guten Tag, wir sind zu zweit, beide berufstätig, ohne Haustiere. Ist die Küche im Preis enthalten?':
      'Hello, there are two of us, both employed, no pets. Is the kitchen included in the price?',
    'Hallo, ich suche zum Quartalsende und bin beim Termin flexibel. Gibt es einen Stellplatz?':
      'Hi, I am looking to move at the end of the quarter and am flexible on dates. Is there a parking space?',
    'Guten Tag, wie hoch war die letzte Nebenkostenabrechnung, und wann wurde die Heizung erneuert?':
      'Hello, how high was the last service-charge statement, and when was the heating renewed?',
    'Hallo, ich hätte Interesse an einer Besichtigung. Nachweise kann ich sofort digital bereitstellen.':
      'Hi, I would be interested in a viewing. I can provide documentation digitally straight away.',

    /* Ausstattung */
    'Balkon': 'Balcony', 'Loggia': 'Loggia', 'Terrasse': 'Terrace', 'Garten': 'Garden',
    'Dachterrasse': 'Roof terrace', 'Einbauküche': 'Fitted kitchen', 'Aufzug': 'Lift',
    'Barrierefrei': 'Step-free', 'Stellplatz': 'Parking space', 'Garage': 'Garage',
    'Keller': 'Cellar', 'Fahrradkeller': 'Bike store', 'Waschmaschinenanschluss': 'Washing machine connection',
    'Badewanne': 'Bathtub', 'Gäste-WC': 'Guest WC', 'Parkett': 'Parquet', 'Dielenboden': 'Floorboards',
    'Fußbodenheizung': 'Underfloor heating', 'Möbliert': 'Furnished', 'Teilmöbliert': 'Part-furnished',
    'Haustiere erlaubt': 'Pets allowed', 'Glasfaser': 'Fibre optic', 'Abstellraum': 'Storage room',
    'Kamin': 'Fireplace', 'Denkmalschutz': 'Listed building', 'Concierge': 'Concierge',
    'Gemeinschaftsgarten': 'Communal garden', 'Paketstation': 'Parcel locker',

    /* Heizung */
    'Gas-Zentralheizung': 'Central gas heating', 'Fernwärme': 'District heating',
    'Wärmepumpe': 'Heat pump', 'Öl-Zentralheizung': 'Central oil heating',
    'Pelletheizung': 'Pellet heating', 'Gasetagenheizung': 'Gas floor heating',
    'Nachtspeicheröfen': 'Night storage heaters',

    /* WG-Art */
    'Studenten-WG': 'student flatshare', 'Berufstätigen-WG': 'working professionals’ flatshare',
    'Zweck-WG': 'a practical arrangement', 'keine Zweck-WG': 'more than a practical arrangement',
    'Männer-WG': 'all-male flatshare', 'Frauen-WG': 'all-female flatshare',
    'gemischte WG': 'mixed flatshare', 'LGBTQIA+ freundlich': 'LGBTQIA+ friendly',
    'Wohnprojekt': 'housing project', 'Alleinerziehenden-WG': 'single parents’ flatshare',
    'Mehrgenerationen-WG': 'multi-generation flatshare', 'Vegetarisch/Vegan': 'vegetarian/vegan',

    /* Sprachen */
    'Deutsch': 'German', 'Englisch': 'English', 'Türkisch': 'Turkish', 'Spanisch': 'Spanish',
    'Französisch': 'French', 'Polnisch': 'Polish', 'Arabisch': 'Arabic', 'Italienisch': 'Italian',
    'Ukrainisch': 'Ukrainian', 'Vietnamesisch': 'Vietnamese',

    /* Zeitangaben */
    'gerade eben': 'just now',
    'gestern': 'yesterday',
    'vor {0} Min.': '{0} min ago',
    'vor {0} Std.': '{0} h ago',
    'vor {0} Tagen': '{0} days ago',
    'vor {0} Monaten': '{0} months ago',
    'vor {0} Jahren': '{0} years ago',
    '{0} Min.': '{0} min',
    '{0} Std.': '{0} h'
  });

  /* ------------------------- Beschriftungen aus den Tabellen ------------------------- */

  e({
    /* Angebotsarten */
    'Miete': 'Rent', 'Kauf': 'Buy', 'WG-Zimmer': 'Flatshare room', 'Tausch': 'Swap',
    'Haus zur Miete': 'House to rent',
    'Wohnung vermieten': 'Let an apartment', 'Wohnung verkaufen': 'Sell an apartment',
    'Haus verkaufen': 'Sell a house', 'Grundstück verkaufen': 'Sell a plot',
    'Wohnung tauschen': 'Swap an apartment', 'WG-Zimmer anbieten': 'Offer a flatshare room',
    'Neues Inserat': 'New listing', 'Deine Inserate': 'Your listings',

    /* Zusammengesetzte Beschriftungen */
    '{0} % zum Spiegel': '{0} % vs. benchmark',
    'WG mit {0}': 'flatshare of {0}',
    'Weitere {0} von {1} zeigen': 'Show {0} more of {1}',
    '{0} von {1} Treffern geladen': '{0} of {1} results loaded',
    '{0} Zimmer weniger als gewünscht': '{0} rooms fewer than wanted',
    '{0} m² weniger als gewünscht': '{0} m² less than wanted',
    '{0} über der Preisgrenze': '{0} over the price limit',
    '{0}, {1} → zieht nach {2}, {3}': '{0}, {1} → moving to {2}, {3}',
    'Erdgeschoss': 'ground floor', 'Dachgeschoss': 'top floor',
    '{0}. OG': 'floor {0}', '{0} von {1}': '{0} of {1}', 'Etage:': 'Floor:',
    'Direkter Tausch': 'Direct swap',
    'Tauschkette mit {0} Beteiligten': 'Swap chain with {0} participants',
    'Wohnung gesamt': 'Apartment total',
    'Karte der Suchergebnisse': 'Map of the search results',
    'Die Ansichten sind schematische Zeichnungen aus den Objektdaten, keine Fotos.':
      'The views are schematic drawings generated from the property data, not photos.',

    /* Suchfilter */
    'Zurücksetzen': 'Reset',
    'Aus meinem Profil füllen': 'Fill from my profile',
    'von': 'from', 'bis': 'to',
    'Zimmer ab': 'Rooms from', 'Zimmer bis': 'Rooms to',
    'Fläche ab': 'Area from', 'Fläche bis': 'Area to',
    'Baujahr ab': 'Built from',
    'Trag im': 'Enter a work or university address in your',
    'einen Arbeits- oder Uniort ein, dann filtert TrimmoTrade nach echter Fahrzeit statt nach Luftlinie.':
      ', then TrimmoTrade filters by real travel time instead of straight-line distance.',
    'deine Arbeits- oder Studienadresse ein, dann zeigt TrimmoTrade hier die Fahrzeiten.':
      ', then TrimmoTrade shows the travel times here.',
    'provisionsfrei': 'no commission',
    'keine Zweck-WG': 'not just a practical arrangement',
    'nur rauchfreie WGs': 'non-smoking flatshares only',
    'Anbieter geprüft': 'Provider verified',
    'Anbieter ungeprüft': 'Provider unverified',
    'Anbieter antwortet': 'Provider replies',
    'ohne Prüfhinweis': 'without a check notice',
    'blendet Inserate mit deutlichen Betrugsmerkmalen aus':
      'hides listings with clear signs of fraud',
    'mittleres WG-Zimmer': 'median flatshare room',
    'mittlere Warmmiete': 'median rent incl. bills',
    'Interessenten im Mittel': 'interested parties on average',
    'Treffer': 'results',
    'In der Suche öffnen': 'Open in the search',
    'Zur Vergleichsmiete': 'Vs. benchmark rent',
    'Deine Notiz': 'Your note',
    'Was ist dir aufgefallen?': 'What did you notice?',
    'Anfragen zu deinen Inseraten': 'Enquiries about your listings',
    'Inserat': 'listing', 'Inserate': 'listings',
    'Anfrage': 'enquiry', 'Anfragen': 'enquiries',
    'mit Plus': 'with Plus',
    'Beste Passung': 'Best match', 'Neueste': 'Newest',
    'Preis aufsteigend': 'Price ascending', 'Preis absteigend': 'Price descending',
    'Fläche absteigend': 'Area descending', 'Kürzester Weg': 'Shortest commute',

    /* Startseite: Werkzeugkarten */
    'Noch': 'Still',
    'Plätze frei. Kein Abo, keine Zahlungsdaten, keine Verlängerung – nach zwölf Monaten endet der Platz von selbst.':
      'places free. No subscription, no payment details, no renewal – after twelve months the place ends by itself.',
    'was Plus enthält': 'what Plus includes',
    'Erst damit sortiert TrimmoTrade nach deiner Passung statt nach Zufall.':
      'Only then does TrimmoTrade sort by how well things match you rather than at random.',
    'Wie viel Miete kannst du tragen?': 'How much rent can you carry?',
    'Zwei Grenzen entscheiden: dein Budget und die Regel, die Vermieter anwenden.':
      'Two limits decide it: your budget and the rule landlords apply.',
    'Malerarbeiten vor dem Einzug': 'Painting before you move in',
    'Wände streichen, bevor die Möbel kommen.': 'Paint the walls before the furniture arrives.',
    'WG-Passung {0} % – passt sehr gut': 'Flatshare match {0} % – a very good fit',

    /* Werkzeugliste */
    'Zwei Grenzen, die ständig verwechselt werden: was dein Haushalt trägt und was Vermieter sehen wollen. Dazu, wie groß die Wohnung dafür sein darf.':
      'Two limits that are constantly confused: what your household can carry and what landlords want to see. Plus how big the apartment can be for that.',
    'vor der ersten Suche': 'before your first search',
    'Rechnet dein maßgebliches Jahreseinkommen mit allen Pauschalen aus und stellt es der Einkommensgrenze gegenüber – die du selbst setzen kannst.':
      'Works out your relevant annual income with all the flat-rate deductions and sets it against the income limit – which you can set yourself.',
    'wenn geförderte Wohnungen in Frage kommen': 'if subsidised apartments are an option',
    'Klärt zuerst, ob Wohngeld überhaupt in Betracht kommt – die Ausschlussgründe schließen die meisten Anträge schon vorher aus.':
      'First establishes whether housing benefit is even a possibility – the exclusion criteria rule out most applications beforehand.',
    'wenn die Miete zu viel vom Einkommen frisst': 'if rent eats too much of your income',
    'Vermögensvergleich über frei wählbare Jahre. Der Mietende legt sein Eigenkapital an und investiert die monatliche Differenz.':
      'A wealth comparison over as many years as you like. The renter invests their equity and the monthly difference.',
    'wenn Kaufen im Raum steht': 'if buying is on the table',
    'Wie sich die Mieten je Viertel über drei Jahre entwickelt haben, und welche Viertel gerade am schnellsten teurer werden.':
      'How rents per neighbourhood have moved over three years, and which neighbourhoods are getting more expensive fastest.',
    'beim Eingrenzen der Suche': 'while narrowing your search',
    'Neunzehn Aufgaben mit Fristen, die sich aus deinem Einzugstermin ergeben – von der Kündigung bis zur Kaution zurück.':
      'Nineteen tasks with deadlines derived from your move-in date – from giving notice to getting your deposit back.',
    'sobald der Termin steht': 'as soon as the date is fixed',
    'Zählerstände, Schlüssel und Mängel Raum für Raum. Am Ende ein Text zum Ausdrucken. Was hier nicht drinsteht, zahlst du später.':
      'Meter readings, keys and defects room by room. A printable text at the end. Whatever is not in it, you pay for later.',
    'am Tag der Übergabe': 'on handover day',

    /* Umzugsplan */
    'Alte Wohnung kündigen': 'Give notice on your old apartment',
    'Drei Monate Frist zum Monatsende, spätestens am dritten Werktag.':
      'Three months’ notice to the end of the month, by the third working day at the latest.',
    'Neuen Mietvertrag prüfen und unterschreiben': 'Check and sign the new tenancy agreement',
    'Kaution überweisen oder Bürgschaft beantragen': 'Transfer the deposit or apply for a guarantee',
    'Ratenzahlung in drei Monatsraten ist zulässig.': 'Paying in three monthly instalments is permitted.',
    'Urlaub für den Umzugstag einreichen': 'Book time off for moving day',
    'Umzugsunternehmen oder Transporter buchen': 'Book a removal firm or a van',
    'Kartons besorgen und mit dem Packen anfangen': 'Get boxes and start packing',
    'Halteverbotszone beantragen': 'Apply for a no-parking zone',
    'Beim Straßenverkehrsamt, je nach Stadt 2 bis 4 Wochen Vorlauf.':
      'At the road traffic office; 2 to 4 weeks’ lead time depending on the city.',
    'Strom- und Gasanbieter ummelden': 'Transfer your electricity and gas contracts',
    'Internet und Telefon ummelden': 'Transfer your internet and phone',
    'Der Anbieter darf den Vertrag am neuen Ort fortsetzen; sonst Sonderkündigungsrecht.':
      'The provider may continue the contract at the new address; otherwise you have a special right to cancel.',
    'Hausrat- und Haftpflichtversicherung anpassen': 'Update your contents and liability insurance',
    'Nachsendeauftrag stellen': 'Set up mail forwarding',
    'Alte Wohnung besenrein herrichten': 'Leave the old apartment broom-clean',
    'Zählerstände in beiden Wohnungen ablesen': 'Read the meters in both apartments',
    'am Umzugstag': 'on moving day',
    'Mit Foto und Unterschrift beider Seiten festhalten.':
      'Record it with a photo and signatures from both sides.',
    'Übergabeprotokoll ausfüllen': 'Fill in the handover report',
    'Jeden Mangel eintragen – später zählt nur, was im Protokoll steht.':
      'Note every defect – later only what is in the report counts.',
    'Beim Einwohnermeldeamt ummelden': 'Register your new address',
    'Innerhalb von zwei Wochen; die Wohnungsgeberbestätigung nicht vergessen.':
      'Within two weeks; do not forget the landlord’s confirmation of residence.',
    'Bank, Arbeitgeber und Abos informieren': 'Tell your bank, employer and subscriptions',
    'Kfz ummelden': 'Re-register your vehicle',
    'Kaution der alten Wohnung zurückfordern': 'Reclaim the deposit on your old apartment',
    'Bis zu sechs Monate Prüffrist sind üblich; danach nachhaken.':
      'A review period of up to six months is normal; chase it up after that.',

    /* Profil: Gewichtung, WG, Unterlagen */
    'Preis': 'Price', 'Lage': 'Location', 'Zuschnitt': 'Layout', 'Energie': 'Energy',
    'Arbeitsweg': 'Commute', 'Preis-Leistung': 'Value for money',
    'Wie stark der Abstand zum Budget zählt': 'How much the gap to your budget counts',
    'Wunschviertel gegenüber Wunschstadt': 'Preferred neighbourhood vs. preferred city',
    'Zimmerzahl und Fläche': 'Number of rooms and floor area',
    'Pflicht- und Wunschmerkmale': 'Must-have and nice-to-have features',
    'Verbrauch und Heizung': 'Consumption and heating',
    'Fahrzeit zu deinen Ankerpunkten': 'Travel time to your anchor points',
    'Abstand zur Vergleichsmiete': 'Gap to the benchmark rent',
    'Konto und Vertrauensstufe': 'Account and trust level',
    '· {0}. Die Vertrauensstufe zählt vor allem, wenn du selbst inserierst – andere sehen sie an deinem Angebot.':
      '· {0}. The trust level counts above all when you advertise yourself – others see it on your offer.',
    'sehr ordentlich': 'very tidy', 'jeder für sich': 'everyone for themselves',
    'Wie ihr zusammenpasst': 'How you fit together',
    'du': 'you', 'diese WG': 'this flatshare',
    'Standardformular mit Angaben zu Person, Beruf, Einkommen':
      'Standard form covering personal details, occupation and income',
    'die letzten drei Abrechnungen': 'the last three payslips',
    'nicht älter als drei Monate – erst nach der Besichtigung herausgeben':
      'no older than three months – only hand it over after the viewing',
    'Bescheinigung der bisherigen Vermieterseite': 'Certificate from your previous landlord',

    /* Konto: Vertrauensstufen */
    'Mit E-Mail-Adresse': 'With an email address',
    'Mit Google': 'With Google', 'Mit Microsoft': 'With Microsoft', 'Mit Apple': 'With Apple',
    'Mit Passkey': 'With a passkey',
    'nicht bestätigt': 'not verified',
    'E-Mail bestätigt': 'Email verified',
    'Gerät oder Anbieter bestätigt': 'Device or provider verified',
    'Telefonnummer bestätigt': 'Phone number verified',
    'Ausweis geprüft': 'ID verified',
    'deine Stufe': 'your level',
    'Es ist nichts geprüft. So ein Konto sollte nichts inserieren dürfen.':
      'Nothing has been verified. An account like this should not be allowed to advertise.',
    'Die Adresse ist erreichbar. Das schließt Wegwerfadressen nicht aus.':
      'The address is reachable. That does not rule out disposable addresses.',
    'Passkey auf diesem Gerät oder ein bestätigtes Konto bei Google, Microsoft oder Apple. Massenhaftes Anlegen wird damit deutlich mühsamer.':
      'A passkey on this device or a verified account with Google, Microsoft or Apple. That makes creating accounts in bulk considerably more laborious.',
    'Eine Nummer je Konto. Der Punkt, an dem Betrug im großen Stil unwirtschaftlich wird.':
      'One number per account. The point at which large-scale fraud stops paying.',
    'Für Inserierende der Maßstab. Prüfung über einen Dienst wie POSTIDENT oder eID – der Ausweis selbst wird dabei nicht gespeichert.':
      'The benchmark for advertisers. Verification via a service such as POSTIDENT or eID – the ID document itself is not stored.',
    'Anmelden mit Face ID, Windows Hello oder Fingerabdruck – auf Stufe 2':
      'Sign in with Face ID, Windows Hello or a fingerprint – to level 2',
    'Eine Nummer je Konto – auf Stufe 3': 'One number per account – to level 3',
    'Für Inserierende der Maßstab – auf Stufe 4': 'The benchmark for advertisers – to level 4',
    'Passkey hinterlegen': 'Add a passkey',
    'Telefonnummer bestätigen': 'Verify phone number',
    'Ausweis prüfen lassen': 'Get your ID verified',
    'nachgebildet': 'simulated',
    'Höchste Stufe erreicht.': 'Highest level reached.',

    /* WG-Daten */
    'überall erlaubt': 'allowed everywhere', 'nur auf dem Balkon': 'on the balcony only',
    'nicht erlaubt': 'not allowed', 'draußen': 'outside',
    'erlaubt': 'allowed', 'vorhanden': 'yes, we have pets',
    'geteilt': 'shared', 'eigenes Bad': 'private bathroom',
    'alle Geschlechter': 'all genders', 'eher weiblich': 'preferably female',
    'eher männlich': 'preferably male',
    'Privatperson': 'Private individual', 'Makler': 'Estate agent',
    'Hausverwaltung': 'Property manager', 'Genossenschaft': 'Housing co-operative',

    /* Tarifzeilen */
    'Vollständige Suche, dauerhaft kostenlos – finanziert über Anzeigen.':
      'The complete search, free forever – funded by ads.',
    'Für alle, die täglich suchen: keine Anzeigen, keine Limits, weniger Handarbeit.':
      'For anyone searching daily: no ads, no limits, less manual work.',
    'TrimmoTrade frei': 'TrimmoTrade Free', 'TrimmoTrade Plus': 'TrimmoTrade Plus',
    'dein Tarif': 'your plan',
    'Zum freien Tarif zurück': 'Back to the free plan',
    'mit Anzeigen': 'with ads', 'ohne Anzeigen': 'without ads',
    'Alle Inserate aus allen vier Angebotsarten': 'Every listing from all four offer types',
    'Alle Rechner: Leistbarkeit, Wohngeld, WBS, Nebenkosten, Übergabe':
      'Every calculator: affordability, housing benefit, WBS, service charges, handover',
    '1 Suchauftrag mit sofortiger Meldung': '1 saved search with instant alerts',
    '2 Objekte im Vergleich': '2 listings in the comparison',
    '6 Objekte im Vergleich': '6 listings in the comparison',
    'Alles aus dem freien Tarif': 'Everything from the free plan',
    'Keine Anzeigen': 'No ads',
    'Unbegrenzt viele Suchaufträge': 'Unlimited saved searches',
    'Vertragslupe vollständig, mit Erläuterung zu jedem Fund':
      'The full contract magnifier, with an explanation for every finding',
    'Ringtausch über drei und vier Haushalte, mit Stellschrauben':
      'Swap chains across three and four households, with adjustable factors',
    'Unbegrenzt viele Ankerpunkte für Fahrzeiten': 'Unlimited anchor points for travel times',
    'Serienbewerbung aus der Merkliste': 'Batch applications from your saved list',
    'Erinnerung ans Nachfassen': 'Reminders to follow up',
    'Besichtigungen zu einer Route ordnen': 'Viewings arranged into a route',
    'Preisverlauf und Marktdaten je Viertel': 'Price history and market data per neighbourhood',
    'Exposé und Merkliste als Datei': 'Listing sheet and saved list as a file',

    'Keine andere Trefferreihenfolge. Die Sortierung entsteht allein aus deinem Profil – bezahlte Plätze stehen in einem eigenen, beschrifteten Block darüber.':
      'No different result order. The sorting comes solely from your profile – paid placements sit in their own labelled block above it.',
    'Keine unsichtbare Bevorzugung. Wo Bezahlung die Reihenfolge ändert, steht es dabei – im Postfach der Anbieter genauso wie in der Suche.':
      'No invisible favouritism. Wherever payment changes an order, it says so – in the advertiser’s inbox just as in the search.',
    'Kein Frühzugang zu neuen Inseraten. Alle sehen jedes Inserat in derselben Sekunde.':
      'No early access to new listings. Everyone sees every listing in the same second.',
    'Keine Daten anderer Nutzerinnen und Nutzer.': 'No data about other users.',
    'Kein besserer Datenschutz gegen Aufpreis – der Dokumententresor und die widerrufbaren Verweise sind im freien Tarif vollständig enthalten.':
      'No better privacy for a surcharge – the document vault and the revocable links are fully included in the free plan.',
    'Keine Werbung, die sich als Inserat ausgibt – Anzeigen sind immer als solche gekennzeichnet.':
      'No advertising disguised as a listing – ads are always labelled as ads.',

    'Der Kern der Anwendung. Vollständig im freien Tarif.':
      'The core of the app. Complete on the free plan.',
    'Alle Inserate, alle vier Angebotsarten': 'Every listing, all four offer types',
    'Passung nach eigenem Profil, ohne bezahlte Plätze':
      'Matching against your own profile, with no paid placements',
    'Karte mit Preisniveau und Umkreis': 'Map with price levels and a radius',
    'Merkliste und Bewerbungstafel': 'Saved list and application board',
    'Alles, was dich vor Schaden bewahrt. Bleibt frei – dafür Geld zu nehmen wäre falsch.':
      'Everything that keeps you from harm. Stays free – charging for it would be wrong.',
    'Prüfhinweis gegen erfundene Inserate': 'Check notice against fake listings',
    'Betrugsschutz hinter eine Bezahlschranke zu stellen wäre zynisch.':
      'Putting fraud protection behind a paywall would be cynical.',
    'Vergleichsmiete und Mietpreisbremse': 'Benchmark rent and the rent cap',
    'Ehrliche Einschätzung deiner Chancen': 'An honest estimate of your chances',
    'Doppelt eingestellte Wohnungen erkennen': 'Spotting duplicate listings',
    'Dokumententresor mit Ende-zu-Ende-Verschlüsselung':
      'Document vault with end-to-end encryption',
    'Wer für Datenschutz zahlen muss, hat keinen. Verschlüsselung ist kein Zusatzverkauf.':
      'If you have to pay for privacy, you do not have it. Encryption is not an upsell.',
    'Werkzeuge, die man ein paarmal im Leben braucht. Bleiben frei.':
      'Tools you need a handful of times in your life. They stay free.',
    'Übergabeprotokoll und Umzugsplan': 'Handover report and moving plan',
    'Braucht man einmal beim Umzug – dafür ein Abo zu verlangen wäre unverschämt.':
      'You need it once when moving – charging a subscription for that would be outrageous.',
    'Was jemand anfasst, der wirklich sucht. Hier liegt der Unterschied.':
      'What someone genuinely searching actually touches. This is where the difference lies.',
    'Suchaufträge mit sofortiger Meldung': 'Saved searches with instant alerts',
    'Ankerpunkte für Fahrzeiten': 'Anchor points for travel times',
    'alle Funde mit Erläuterung': 'every finding with an explanation',
    'Ketten über drei und vier Haushalte': 'Chains across three and four households',
    'Durchgerechnete Stellschrauben beim Tausch': 'Fully calculated levers for swaps',
    'Bezahlte Sichtbarkeit – die einzige Stelle, an der Geld eine Reihenfolge ändert. Sie wird deshalb überall gekennzeichnet, wo sie wirkt.':
      'Paid visibility – the one place where money changes an order. Which is why it is labelled everywhere it takes effect.',
    'Anfragen stehen im Postfach der Anbieter oben':
      'Enquiries sit at the top of the advertiser’s inbox',
    'Die anbietende Seite sieht, dass die Reihenfolge bezahlt ist. Verschwiegen wäre sie unzulässig.':
      'The advertiser can see that the order is paid for. Concealing it would be unlawful.',
    'in der Reihenfolge des Eingangs': 'in order of arrival',
    'oben, sichtbar gekennzeichnet': 'at the top, visibly labelled',
    'Eigenes Inserat hervorheben': 'Promoting your own listing',
    'Hervorgehobene Inserate stehen in einem eigenen, beschrifteten Block – nie in der Trefferreihenfolge.':
      'Promoted listings sit in their own labelled block – never in the result order.',
    'Nach oben schieben': 'Push to the top',
    'Das Inserat gilt wieder als frisch und steht in „neueste zuerst“ ganz oben.':
      'The listing counts as fresh again and appears at the very top under “newest first”.',
    'Farbig hervorheben': 'Highlight in colour',
    'Die Karte bekommt einen farbigen Rand und ein Kennzeichen – sie bleibt an ihrem Platz, fällt aber auf.':
      'The card gets a coloured border and a marker – it stays where it is but stands out.',
    'Top-Anzeige': 'Top ad',
    'Das Inserat steht über den Treffern in einem eigenen, als bezahlt gekennzeichneten Block.':
      'The listing appears above the results in its own block, labelled as paid.',
    'Im Preis ist keine Umsatzsteuer enthalten; es wird keine ausgewiesen (Kleinunternehmerregelung nach § 19 UStG).':
      'The price contains no VAT and none is shown (small-business rule under § 19 UStG).',

    /* Chancen und Prüfhinweise */
    'Deine Bewerbung: noch nicht einschätzbar': 'Your application: not yet assessable',
    'Dafür fehlen TrimmoTrade noch Angaben aus deinem Profil.':
      'TrimmoTrade is still missing details from your profile for that.',
    'Über deine Bewerbung weiß TrimmoTrade noch nichts – ohne Einkommen und Unterlagen im Profil lässt sich nichts einschätzen. Was feststeht: Es haben sich bereits {0} andere gemeldet.':
      'TrimmoTrade knows nothing about your application yet – without income and documents in your profile there is nothing to assess. What is certain: {0} others have already been in touch.',
    'Was du jetzt tun kannst': 'What you can do now',
    'Trag Einkommen und vorhandene Unterlagen im Profil ein – danach kann TrimmoTrade deine Chancen wirklich einschätzen.':
      'Enter your income and the documents you have in your profile – then TrimmoTrade can genuinely assess your chances.',
    'Nimm einen der hinterlegten Termine sofort – gebuchte Termine kommen vor formlosen Anfragen.':
      'Take one of the available slots straight away – booked appointments come before informal enquiries.',
    'Anteil Internet und Rundfunk': 'Share of internet and broadcasting fee',
    'wird bei Auszug zurückgezahlt': 'refunded when you move out',
    'Trag dein Nettoeinkommen im Profil ein, dann zeigt TrimmoTrade die Belastungsquote.':
      'Enter your net income in your profile and TrimmoTrade will show the rent-to-income ratio.'
  });

  /* ------------------------- Rechtstexte -------------------------

     Übersetzt zum Verstehen, nicht zum Gelten: Über jedem dieser
     Dokumente steht in der englischen Fassung der Hinweis, dass die
     deutsche maßgeblich ist. Paragraphen und Gesetzesnamen bleiben im
     Original – „§ 551 BGB“ ist die Fundstelle, unter der man nachliest,
     und eine Übersetzung des Namens hilft dabei niemandem. */

  e({
    'Rechtliches': 'Legal',
    'Fassung vom': 'Version of',
    'Anbieter, Datenschutz, Geschäftsbedingungen und Widerruf – die Angaben, die eine Seite in Deutschland führen muss, und die, die man führen sollte.':
      'Provider, privacy, terms and withdrawal – the information a website in Germany must carry, and the information it ought to carry.',
    'noch': 'still',
    'Pflichtangabe fehlt': 'mandatory detail missing',
    'Pflichtangaben fehlen': 'mandatory details missing',
    'Solange sie fehlen, ist dieses Dokument nicht vollständig. Im Text stehen die Lücken markiert.':
      'While they are missing this document is incomplete. The gaps are marked in the text.',
    'Angaben ergänzen': 'Complete the details',
    'Diese Texte sind ein Entwurf, keine Rechtsberatung':
      'These texts are a draft, not legal advice',
    'Sie sind nach den geltenden Vorschriften geschrieben – Digitale-Dienste-Gesetz, DSGVO, BGB, Verordnung über digitale Dienste – und decken ab, was ein Kleingewerbe mit einer solchen Seite braucht. Aber sie ersetzen nicht den Blick von jemandem mit Zulassung. Vor dem ersten echten Nutzer gehören vor allem die Geschäftsbedingungen, die Haftung und die Frage nach einer Erlaubnis gemäß § 34c GewO geprüft.':
      'They are written to the applicable rules – the German Digital Services Act (DDG), the GDPR, the Civil Code (BGB) and the EU Digital Services Act – and cover what a small business running a site like this needs. But they do not replace a look from someone qualified. Before the first real user, the terms, the liability provisions and the question of a licence under § 34c GewO in particular should be reviewed.',
    'Angaben zum Anbieter': 'Provider details',
    'Name, Anschrift, Kontakt und Steuerstatus – von hier speisen sich alle Dokumente.':
      'Name, address, contact and tax status – every document draws on this.',
    'Was vor dem Start noch zu klären ist': 'What still needs settling before launch',
    'Punkte, die kein Textbaustein löst, sondern eine Entscheidung.':
      'Points no template solves – only a decision does.',

    /* Impressum */
    'Rechtsform: {3}.': 'Legal form: {3}.',
    'Kontakt': 'Contact',
    'Telefon': 'Phone',
    '§ 5 Abs. 1 Nr. 2 DDG verlangt Angaben, die eine schnelle elektronische Kontaktaufnahme und unmittelbare Kommunikation ermöglichen. Die E-Mail-Adresse ist dafür Pflicht; die Nummer ist der übliche zweite Weg.':
      '§ 5(1) no. 2 DDG requires details enabling rapid electronic contact and direct communication. An email address is mandatory for this; a phone number is the customary second route.',
    'Umsatzsteuer': 'VAT',
    'Die Steuernummer ist keine Pflichtangabe im Impressum und wird hier bewusst nicht veröffentlicht.':
      'The tax number is not a mandatory item in the legal notice and is deliberately not published here.',
    'Verantwortlich für redaktionelle Inhalte': 'Responsible for editorial content',
    'Gemäß § 18 Abs. 2 des Medienstaatsvertrags:':
      'Pursuant to § 18(2) of the German Interstate Media Treaty:',
    'Verbraucherstreitbeilegung': 'Consumer dispute resolution',
    'Der Anbieter ist weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 Verbraucherstreitbeilegungsgesetz).':
      'The provider is neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board (§ 36 VSBG).',
    'Ein Hinweis auf die Online-Streitbeilegungsplattform der Europäischen Kommission entfällt: Die Plattform wurde zum 20. Juli 2025 eingestellt. Verweise darauf sind seitdem gegenstandslos und sollten von Websites entfernt werden.':
      'No reference to the European Commission’s online dispute resolution platform is given: the platform was discontinued on 20 July 2025. References to it have been meaningless since then and should be removed from websites.',
    'Erlaubnispflicht': 'Licensing',
    'TrimmoTrade führt Angebote Dritter zusammen und stellt Werkzeuge zur Prüfung und Bewertung bereit. Der Anbieter vermittelt keine Miet- oder Kaufverträge und erhält von Vermietenden oder Verkaufenden im Erfolgsfall keine Provision. Eine Erlaubnis nach § 34c Gewerbeordnung ist danach nicht erforderlich.':
      'TrimmoTrade brings together third-party offers and provides tools for checking and assessing them. The provider does not broker rental or purchase agreements and receives no success commission from landlords or sellers. A licence under § 34c of the German Trade Regulation Act (GewO) is therefore not required.',
    'Haftung für Inhalte und Verweise': 'Liability for content and links',
    'Für eigene Inhalte ist der Anbieter nach den allgemeinen Gesetzen verantwortlich. Für Angebote, die Nutzende einstellen, gelten die Vorschriften der Verordnung (EU) 2022/2065 über digitale Dienste: Der Anbieter ist nicht verpflichtet, sie allgemein zu überwachen, entfernt sie aber unverzüglich, sobald er von einer Rechtsverletzung Kenntnis erlangt.':
      'The provider is responsible for its own content under the general laws. For offers posted by users, Regulation (EU) 2022/2065 on digital services applies: the provider is not obliged to monitor them generally, but removes them without delay upon obtaining knowledge of an infringement.',
    'Hier lässt sich ein Inhalt melden.': 'Content can be reported here.',
    'Für Inhalte verlinkter Seiten ist deren Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.':
      'The operators of linked sites are responsible for their content. No legal infringements were apparent at the time the links were set.',
    'Urheberrecht': 'Copyright',
    'Aufbau, Texte, Grafiken und Quelltext dieser Anwendung sind urheberrechtlich geschützt. Vervielfältigung, Bearbeitung und Verbreitung bedürfen der Zustimmung des Anbieters, soweit das Urheberrechtsgesetz nichts anderes erlaubt.':
      'The structure, texts, graphics and source code of this application are protected by copyright. Reproduction, modification and distribution require the provider’s consent unless the German Copyright Act permits otherwise.',

    /* Datenschutz */
    'Das Wichtigste zuerst': 'The most important part first',
    'TrimmoTrade rechnet vollständig im Browser. Suche, Bewertung, Karte, Ringtausch, Merkliste und Profil entstehen auf deinem Gerät und bleiben dort. Es gibt kein Nutzerkonto, keine Übertragung deiner Eingaben an den Anbieter und keine Weitergabe an Dritte.':
      'TrimmoTrade computes entirely in the browser. The search, scoring, map, swap chains, saved list and profile all happen on your device and stay there. There is no user account, no transfer of what you enter to the provider, and no disclosure to third parties.',
    'Es werden keine Werkzeuge zur Reichweitenmessung eingesetzt, keine Profile über dein Verhalten gebildet und keine Werbung nach deinen Interessen ausgespielt. Deshalb erscheint auch kein Fenster, das um Einwilligung bittet: Es gibt nichts, wozu eine Einwilligung nötig wäre.':
      'No analytics tools are used, no profiles are built about your behaviour, and no interest-based advertising is served. That is also why no consent dialog appears: there is nothing that would require consent.',
    '1. Verantwortlicher': '1. Controller',
    'Verantwortlich im Sinne von Art. 4 Nr. 7 DSGVO ist:':
      'The controller within the meaning of Art. 4(7) GDPR is:',
    'E-Mail: {4} · Telefon:': 'Email: {4} · Phone:',
    '2. Datenschutzbeauftragter': '2. Data protection officer',
    'Ein Datenschutzbeauftragter ist nicht bestellt. Nach § 38 Abs. 1 BDSG besteht dazu keine Pflicht, weil in der Regel weniger als zwanzig Personen ständig mit der automatisierten Verarbeitung personenbezogener Daten beschäftigt sind und keine Verarbeitung stattfindet, die eine Datenschutz-Folgenabschätzung erfordert.':
      'No data protection officer has been appointed. Under § 38(1) BDSG there is no obligation to do so, because as a rule fewer than twenty people are permanently engaged in the automated processing of personal data and no processing takes place that would require a data protection impact assessment.',
    '3. Aufruf der Seite (Server-Protokolle)': '3. Accessing the site (server logs)',
    'Beim Aufruf überträgt dein Browser technisch notwendige Daten an den Server, auf dem die Seite liegt: IP-Adresse, Datum und Uhrzeit, aufgerufene Datei, übertragene Datenmenge, Browsertyp und Betriebssystem sowie die zuvor besuchte Seite.':
      'When you access the site your browser transmits technically necessary data to the server hosting it: IP address, date and time, the file requested, the volume of data transferred, browser type and operating system, and the previously visited page.',
    'Zweck': 'Purpose',
    'Auslieferung der Seite, Betriebssicherheit, Abwehr von Angriffen':
      'delivering the page, operational security, defending against attacks',
    'Rechtsgrundlage': 'Legal basis',
    'Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an einem störungsfreien und sicheren Betrieb':
      'Art. 6(1)(f) GDPR – legitimate interest in trouble-free and secure operation',
    'Speicherdauer': 'Retention',
    'in der Regel sieben Tage, danach automatische Löschung':
      'as a rule seven days, then automatic deletion',
    'Empfänger': 'Recipients',
    'der Hostinganbieter als Auftragsverarbeiter nach Art. 28 DSGVO':
      'the hosting provider as a processor under Art. 28 GDPR',
    '4. Anmeldung und Konto': '4. Signing in and your account',
    'Die Nutzung setzt eine Anmeldung voraus. Verarbeitet werden dabei Name (freiwillig), E-Mail-Adresse, das gewählte Anmeldeverfahren, der Zeitpunkt der letzten Anmeldung und die Vertrauensstufe.':
      'Use requires signing in. The data processed are your name (optional), email address, the sign-in method chosen, the time of your last sign-in and your trust level.',
    'Bereitstellung des Zugangs, Zuordnung von Inseraten und Anfragen, Schutz vor missbräuchlicher Mehrfachanlage':
      'providing access, attributing listings and enquiries, protection against abusive multiple accounts',
    'Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Nutzungsvertrags; für die Missbrauchsabwehr zusätzlich Art. 6 Abs. 1 lit. f DSGVO':
      'Art. 6(1)(b) GDPR – performance of the user agreement; additionally Art. 6(1)(f) GDPR for abuse prevention',
    'bis zur Löschung des Kontos; sie ist jederzeit ohne Angabe von Gründen möglich':
      'until the account is deleted; this is possible at any time without giving reasons',
    'Anmeldung über Google, Microsoft oder Apple': 'Signing in via Google, Microsoft or Apple',
    'Wählst du einen dieser Wege, erfährt der jeweilige Anbieter, dass du dich bei TrimmoTrade anmeldest. An TrimmoTrade übermittelt werden Name, E-Mail-Adresse und die Angabe, ob sie bestätigt ist – nicht dein dortiges Passwort und keine weiteren Inhalte deines Kontos. Es besteht kein Zugriff auf Kontakte, Kalender, Dateien oder Postfach.':
      'If you choose one of these routes, that provider learns that you are signing in to TrimmoTrade. What is transmitted to TrimmoTrade is your name, email address and whether it is verified – not your password there and no other content from your account. There is no access to contacts, calendar, files or mailbox.',
    'Verantwortlich für die Verarbeitung auf ihrer Seite sind die Anbieter selbst: Google Ireland Limited, Microsoft Ireland Operations Limited und Apple Distribution International Limited, jeweils mit Sitz in Irland. Soweit dabei Daten in die Vereinigten Staaten übermittelt werden, stützt sich das auf den Angemessenheitsbeschluss der Europäischen Kommission zum EU-US Data Privacy Framework; die genannten Anbieter sind darunter zertifiziert.':
      'The providers themselves are the controllers for the processing on their side: Google Ireland Limited, Microsoft Ireland Operations Limited and Apple Distribution International Limited, each established in Ireland. Where data is transferred to the United States in the process, this relies on the European Commission’s adequacy decision on the EU-US Data Privacy Framework; the providers named are certified under it.',
    'Bei Apple lässt sich die eigene Adresse verbergen. TrimmoTrade erhält dann eine Weiterleitungsadresse bei':
      'With Apple you can hide your own address. TrimmoTrade then receives a relay address at',
    'und kennt die echte Adresse nicht. Die Anwendung behandelt beide gleich.':
      'and does not know the real one. The application treats both the same.',
    'Beim Passkey entsteht das Schlüsselpaar im Sicherheitsbaustein deines Geräts. Der private Schlüssel verlässt das Gerät nicht und ist für TrimmoTrade nicht lesbar; gespeichert wird nur die Kennung des Schlüssels. Biometrische Merkmale – Gesicht, Fingerabdruck – werden weder übertragen noch verarbeitet: Sie entsperren ausschließlich lokal das Gerät (Art. 9 DSGVO ist damit nicht berührt).':
      'With a passkey the key pair is created in your device’s secure element. The private key does not leave the device and is not readable by TrimmoTrade; only the key’s identifier is stored. Biometric features – face, fingerprint – are neither transmitted nor processed: they unlock the device locally and nothing more (Art. 9 GDPR is therefore not engaged).',
    'Bestätigung von Adresse und Telefonnummer': 'Verifying your address and phone number',
    'Der Einmalcode dient allein der Bestätigung, dass du die angegebene Adresse abrufen kannst. Er gilt {6} Minuten und wird danach verworfen. Eine Telefonnummer wird nur verarbeitet, wenn du sie selbst zur Bestätigung angibst.':
      'The one-time code serves solely to confirm that you can access the address given. It is valid for {6} minutes and is discarded afterwards. A phone number is only processed if you provide it yourself for verification.',
    '5. Speicher deines Browsers': '5. Your browser’s storage',
    'TrimmoTrade legt deine Eingaben im lokalen Speicher deines Browsers ab – Profil, Merkliste, Suchaufträge, Nachrichten, eigene Inserate und die Einstellungen zur Darstellung. Diese Daten verlassen dein Gerät nicht. Der Anbieter hat keinen Zugriff darauf.':
      'TrimmoTrade stores what you enter in your browser’s local storage – profile, saved list, saved searches, messages, your own listings and your display settings. This data does not leave your device. The provider has no access to it.',
    'Für den Zugriff auf diesen Speicher ist keine Einwilligung erforderlich: Er ist unbedingt erforderlich, damit der von dir ausdrücklich gewünschte Dienst überhaupt funktioniert (§ 25 Abs. 2 Nr. 2 des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes). Cookies zu Werbe- oder Analysezwecken werden nicht gesetzt.':
      'No consent is required for access to this storage: it is strictly necessary for the service you expressly requested to work at all (§ 25(2) no. 2 TDDDG). No cookies are set for advertising or analytics purposes.',
    'Du kannst diese Daten jederzeit im Fußbereich unter „Meine Daten“ als Datei sichern oder vollständig löschen. Sie verschwinden ebenfalls, wenn du die Browserdaten löschst.':
      'You can save this data as a file or delete it entirely at any time under “My data” in the footer. It also disappears if you clear your browser data.',
    '6. Dokumententresor': '6. Document vault',
    'Legst du Unterlagen im Dokumententresor ab, werden sie': 'If you place documents in the vault they are encrypted',
    'vor dem Speichern': 'before being stored',
    'in deinem Browser verschlüsselt – mit AES-GCM und 256 Bit. Der Schlüssel entsteht aus deinem Kennwort und wird nirgends gespeichert. Verschlüsselt werden auch die Dateinamen.':
      'in your browser – with AES-GCM and 256 bits. The key is derived from your password and is stored nowhere. File names are encrypted too.',
    'Gibst du Unterlagen frei, wird kein Anhang verschickt, sondern ein Verweis. Der Schlüssel dazu steht im Fragmentteil dieses Verweises – dem Teil hinter dem Rautezeichen, den Browser grundsätzlich nicht an Server übertragen. Der Anbieter kann die abgelegten Dateien deshalb auch dann nicht lesen, wenn er Zugriff auf den Speicher hätte.':
      'If you share documents, no attachment is sent but a link. The key to it sits in the fragment part of that link – the part after the hash sign, which browsers as a rule do not transmit to servers. The provider therefore cannot read the stored files even if it had access to the storage.',
    'Erfüllung des Vertrags über die Nutzung von TrimmoTrade':
      'performance of the contract for the use of TrimmoTrade',
    'Art. 6 Abs. 1 lit. b DSGVO; für die Verschlüsselung zugleich Art. 32 DSGVO – Sicherheit der Verarbeitung':
      'Art. 6(1)(b) GDPR; for the encryption also Art. 32 GDPR – security of processing',
    'bis du das Dokument löschst oder den Tresor leerst':
      'until you delete the document or empty the vault',
    'In dieser Vorführfassung liegen auch die verschlüsselten Dateien ausschließlich in deinem Browser. Im Betrieb läge dort das Chiffrat und sonst nichts.':
      'In this demo version the encrypted files also live solely in your browser. In production the server would hold the ciphertext and nothing else.',
    '7. Werbung im freien Tarif': '7. Advertising on the free plan',
    'Der freie Tarif wird über Anzeigen finanziert. Diese Anzeigen sind fest hinterlegt und werden nach der Stelle ausgewählt, an der sie erscheinen – nicht nach deiner Person, deinem Verhalten oder deinen Eingaben. Es findet kein Abgleich mit Werbenetzwerken statt, es werden keine Kennungen gesetzt und es gehen keine Daten an Werbetreibende. Deshalb ist auch dafür keine Einwilligung erforderlich.':
      'The free plan is funded by ads. These ads are fixed in the application and are selected by the position in which they appear – not by who you are, how you behave or what you enter. There is no matching against ad networks, no identifiers are set, and no data goes to advertisers. No consent is required for this either.',
    'Anzeigen sind stets als solche gekennzeichnet (§ 5a Abs. 4 des Gesetzes gegen den unlauteren Wettbewerb) und werden nie im Erscheinungsbild eines Inserats dargestellt.':
      'Ads are always labelled as such (§ 5a(4) of the German Unfair Competition Act, UWG) and are never presented in the appearance of a listing.',
    '8. Kontaktaufnahme und Hilfe': '8. Getting in touch and help',
    'Schreibst du per E-Mail, verarbeitet der Anbieter die Angaben aus deiner Nachricht, um sie zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogenen Anfragen, sonst Art. 6 Abs. 1 lit. f DSGVO. Die Nachrichten werden gelöscht, sobald die Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.':
      'If you write by email, the provider processes the details in your message in order to answer it. The legal basis is Art. 6(1)(b) GDPR for contract-related enquiries, otherwise Art. 6(1)(f) GDPR. Messages are deleted once the enquiry has been dealt with conclusively and no statutory retention periods stand in the way.',
    'Die Hilfe in der Anwendung beantwortet Fragen': 'The help inside the application answers questions',
    'im Browser': 'in the browser',
    '; dabei wird nichts übertragen. Führt sie nicht weiter, kannst du die Zusammenfassung an {16} weitergeben. Das geschieht nur auf deinen ausdrücklichen Klick, über dein eigenes E-Mail-Programm – und':
      '; nothing is transmitted in the process. If it leads nowhere you can pass the summary on to {16}. That happens only on your explicit click, through your own email program – and',
    'der vollständige Text wird dir vorher angezeigt': 'the full text is shown to you beforehand',
    '. Übertragen wird ausschließlich, was dort steht: deine Fragen, die Themen der gegebenen Antworten, dein Freitext und die Kontaktangaben, die du selbst einträgst. Profil, Merkliste und die Inhalte des Dokumententresors sind nicht enthalten und werden auch nicht angehängt.':
      '. The only thing transmitted is what it says there: your questions, the topics of the answers given, your free text and the contact details you enter yourself. Your profile, saved list and the contents of the document vault are not included and are not attached.',
    '9. Bezahlung von TrimmoTrade Plus': '9. Paying for TrimmoTrade Plus',
    'Für bezahlte Verträge werden die zur Abwicklung nötigen Daten verarbeitet: Name, E-Mail-Adresse, Zahlungsdaten sowie Beginn und Laufzeit. Die Zahlung selbst wickelt ein Zahlungsdienstleister ab, an den die dafür erforderlichen Daten übermittelt werden.':
      'For paid contracts the data needed to handle them is processed: name, email address, payment details, and the start and term. The payment itself is handled by a payment service provider, to whom the data required for that is transmitted.',
    'Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Vertrags; für Rechnungsdaten zusätzlich Art. 6 Abs. 1 lit. c DSGVO':
      'Art. 6(1)(b) GDPR – performance of the contract; additionally Art. 6(1)(c) GDPR for invoice data',
    'Rechnungsunterlagen zehn Jahre nach § 147 der Abgabenordnung und § 257 des Handelsgesetzbuchs':
      'invoice records for ten years under § 147 AO and § 257 HGB',
    'Solange Plus nur über einen Gründerplatz vergeben wird, fallen weder Zahlungsdaten noch Rechnungen an.':
      'As long as Plus is only granted through a founder place, neither payment data nor invoices arise.',
    '10. Keine automatisierte Entscheidung über Personen': '10. No automated decisions about people',
    'TrimmoTrade bewertet Angebote, nicht Menschen. Die Passung, die Chancenschätzung und der Prüfhinweis beziehen sich auf Wohnungen und Inseratstexte und dienen deiner eigenen Einordnung. Eine automatisierte Entscheidung mit rechtlicher Wirkung gegenüber Personen im Sinne von Art. 22 DSGVO findet nicht statt.':
      'TrimmoTrade assesses offers, not people. The match score, the estimate of your chances and the check notice relate to apartments and listing texts and serve your own judgement. No automated decision producing legal effects concerning individuals within the meaning of Art. 22 GDPR takes place.',
    '11. Übermittlung in Drittländer': '11. Transfers to third countries',
    'Über die in Abschnitt 4 beschriebene Anmeldung bei Google, Microsoft oder Apple hinaus findet keine Übermittlung personenbezogener Daten in Länder außerhalb der Europäischen Union und des Europäischen Wirtschaftsraums statt. Wer das vermeiden möchte, meldet sich mit Passkey oder mit E-Mail-Adresse an – beide Wege kommen ohne fremden Anbieter aus.':
      'Beyond the sign-in via Google, Microsoft or Apple described in section 4, no personal data is transferred to countries outside the European Union and the European Economic Area. If you want to avoid it, sign in with a passkey or with your email address – both routes work without any third-party provider.',
    '12. Deine Rechte': '12. Your rights',
    'Auskunft': 'Access',
    'darüber, welche Daten verarbeitet werden (Art. 15 DSGVO)':
      'to information on what data is processed (Art. 15 GDPR)',
    'Berichtigung': 'Rectification',
    'unrichtiger Daten (Art. 16 DSGVO)': 'of inaccurate data (Art. 16 GDPR)',
    'Löschung': 'Erasure',
    '(Art. 17 DSGVO)': '(Art. 17 GDPR)',
    'Einschränkung der Verarbeitung': 'Restriction of processing',
    '(Art. 18 DSGVO)': '(Art. 18 GDPR)',
    'Datenübertragbarkeit': 'Data portability',
    'in einem gängigen Format (Art. 20 DSGVO)': 'in a common format (Art. 20 GDPR)',
    'Widerspruch': 'Objection',
    'gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)':
      'to processing based on legitimate interests (Art. 21 GDPR)',
    'einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)':
      'of consent given, with effect for the future (Art. 7(3) GDPR)'
  });

  /* ------------------------- Geschäftsbedingungen ------------------------- */

  e({
    'Für die Ausübung genügt eine formlose Nachricht an {24}.':
      'An informal message to {24} is enough to exercise them.',
    'Weil deine Eingaben ausschließlich in deinem Browser liegen, kannst du Auskunft, Übertragbarkeit und Löschung dort unmittelbar selbst ausüben: im Fußbereich unter „Meine Daten“.':
      'Because what you enter lives solely in your browser, you can exercise access, portability and erasure there yourself directly: under “My data” in the footer.',
    '13. Beschwerderecht': '13. Right to complain',
    'Du kannst dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere in dem Mitgliedstaat deines Aufenthaltsorts, deines Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Für den Anbieter zuständig ist {25}.':
      'You can complain to a data protection supervisory authority (Art. 77 GDPR), in particular in the member state of your residence, your place of work or the place of the alleged infringement. The authority responsible for the provider is {25}.',
    '14. Pflicht zur Bereitstellung': '14. Obligation to provide data',
    'Du bist nicht verpflichtet, personenbezogene Daten bereitzustellen. Ohne die Angaben im Profil fallen allerdings die Funktionen weg, die darauf aufbauen – etwa die Passung oder die Chancenschätzung.':
      'You are not obliged to provide personal data. Without the details in your profile, however, the features that build on them fall away – the match score or the estimate of your chances, for instance.',
    '15. Änderungen': '15. Changes',
    'Diese Erklärung gilt in der Fassung vom {26}. Ändert sich die Anwendung, wird sie angepasst.':
      'This policy applies in the version of {26}. If the application changes, it will be adapted.',

    '§ 1 Anbieter, Geltungsbereich': '§ 1 Provider, scope',
    '(1) Anbieter von TrimmoTrade ist {2}, {3} (nachfolgend „Anbieter“). Die vollständigen Angaben stehen im':
      '(1) The provider of TrimmoTrade is {2}, {3} (the “provider”). The full details are in the',
    '(2) Diese Bedingungen gelten für alle Verträge über die Nutzung von TrimmoTrade in der jeweils bei Vertragsschluss geltenden Fassung.':
      '(2) These terms apply to all contracts for the use of TrimmoTrade in the version in force when the contract is concluded.',
    '(3) Verbraucher ist, wer ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder der gewerblichen noch der selbständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB). Unternehmer ist, wer dabei in Ausübung einer solchen Tätigkeit handelt (§ 14 BGB).':
      '(3) A consumer is anyone entering into a legal transaction for purposes predominantly outside their trade, business or profession (§ 13 BGB). A trader is anyone acting in the exercise of such an activity (§ 14 BGB).',
    '(4) Abweichende Bedingungen der Nutzenden werden nicht Vertragsbestandteil, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.':
      '(4) Users’ differing terms do not become part of the contract unless the provider expressly agrees to their application in writing.',

    '§ 2 Gegenstand der Leistung': '§ 2 Subject matter of the service',
    '(1) TrimmoTrade ist eine Oberfläche, die Wohnungsangebote verschiedener Art – Miete, Kauf, WG-Zimmer und Wohnungstausch – zusammenführt und Werkzeuge zu ihrer Prüfung und Einordnung bereitstellt.':
      '(1) TrimmoTrade is an interface that brings together housing offers of various kinds – rental, purchase, flatshare rooms and apartment swaps – and provides tools for checking and assessing them.',
    '(2) Der Anbieter': '(2) The provider',
    'vermittelt keine Miet- oder Kaufverträge': 'does not broker rental or purchase agreements',
    'und wird nicht Partei der Verträge, die zwischen Nutzenden und Anbietenden von Wohnraum zustande kommen. Er erhält von Vermietenden oder Verkaufenden keine erfolgsabhängige Vergütung.':
      'and does not become a party to the contracts concluded between users and those offering housing. It receives no success-based remuneration from landlords or sellers.',
    '(3) Bewertungen, Vergleichsmieten, Chancenschätzungen, Prüfhinweise und Vertragshinweise sind':
      '(3) Scores, benchmark rents, estimates of your chances, check notices and contract notes are',
    'Rechenergebnisse und allgemeine Hinweise': 'computed results and general notes',
    '. Sie beruhen auf den verfügbaren Angaben und allgemein zugänglichen Rechenwerten. Sie sind weder eine Rechts- noch eine Steuer- oder Anlageberatung und ersetzen eine solche nicht.':
      '. They are based on the available details and publicly accessible reference figures. They are neither legal, tax nor investment advice and do not replace any such advice.',
    '(4) Für Richtigkeit, Vollständigkeit und Aktualität von Angeboten, die Dritte einstellen, steht der Anbieter nicht ein.':
      '(4) The provider does not warrant the accuracy, completeness or currency of offers posted by third parties.',

    '§ 3 Anmeldung und Zustandekommen des Vertrags': '§ 3 Signing in and formation of the contract',
    '(2) Die Anmeldung setzt die Zustimmung zu diesen Bedingungen und die Kenntnisnahme der Datenschutzerklärung voraus. Beide sind vor der Anmeldung ohne Anmeldung abrufbar.':
      '(2) Signing in requires agreement to these terms and acknowledgement of the privacy policy. Both are available before signing in, without signing in.',
    '(3) Es besteht kein Anspruch auf Anmeldung. Der Anbieter kann sie ablehnen, insbesondere bei begründetem Verdacht auf missbräuchliche Mehrfachanlage.':
      '(3) There is no right to be admitted. The provider may refuse, in particular where there is reasonable suspicion of abusive multiple accounts.',
    '(4) Je Person ist ein Konto zulässig. Zugangsmittel dürfen nicht weitergegeben werden. Wer den Verdacht hat, dass ein anderer Zugang zu seinem Konto hat, teilt das unverzüglich mit.':
      '(4) One account per person is permitted. Access credentials may not be passed on. Anyone suspecting that someone else has access to their account must report it without delay.',
    '(5) Bestimmte Handlungen setzen eine Vertrauensstufe voraus – insbesondere das Einstellen von Angeboten. Die Stufen und ihre Voraussetzungen sind in der Anwendung beschrieben.':
      '(5) Certain actions require a trust level – posting offers in particular. The levels and their requirements are described in the application.',
    '(6) Das Konto kann jederzeit, ohne Angabe von Gründen und ohne Frist gelöscht werden. Damit endet der unentgeltliche Nutzungsvertrag.':
      '(6) The account can be deleted at any time, without giving reasons and without notice. This ends the free user agreement.',
    '(7) Ein Vertrag über TrimmoTrade Plus kommt zustande, wenn der Anbieter die Bestellung annimmt oder die Leistung freischaltet. Vor der Bestellung werden die wesentlichen Merkmale, der Gesamtpreis, die Laufzeit und die Kündigungsbedingungen angezeigt. Die Schaltfläche, mit der die Bestellung abgeschlossen wird, ist mit „zahlungspflichtig bestellen“ beschriftet (§ 312j Abs. 3 BGB).':
      '(7) A contract for TrimmoTrade Plus is formed when the provider accepts the order or activates the service. Before ordering, the essential characteristics, the total price, the term and the cancellation conditions are displayed. The button completing the order is labelled “order with obligation to pay” (§ 312j(3) BGB).',
    '(8) Der Vertragstext wird nach Abschluss auf einem dauerhaften Datenträger bestätigt (§ 312f BGB). Vertragssprache ist Deutsch.':
      '(8) The contract text is confirmed on a durable medium after conclusion (§ 312f BGB). The language of the contract is German.',

    '§ 4 Freier Tarif und Werbung': '§ 4 Free plan and advertising',
    '(1) Der freie Tarif ist dauerhaft ohne Entgelt nutzbar und über Anzeigen finanziert.':
      '(1) The free plan is usable permanently at no charge and is funded by ads.',
    '(2) Anzeigen sind stets als solche gekennzeichnet und vom übrigen Inhalt deutlich abgesetzt. Sie werden nicht nach dem Verhalten oder den Eingaben der Nutzenden ausgewählt.':
      '(2) Ads are always labelled as such and clearly set apart from the rest of the content. They are not selected on the basis of users’ behaviour or entries.',
    '(3) Der Anbieter behält sich vor, Umfang und Platzierung von Anzeigen zu ändern. Die Funktionen des freien Tarifs bleiben davon unberührt.':
      '(3) The provider reserves the right to change the extent and placement of ads. The features of the free plan remain unaffected.',

    '§ 5 TrimmoTrade Plus': '§ 5 TrimmoTrade Plus',
    '(1) TrimmoTrade Plus umfasst die auf der': '(1) TrimmoTrade Plus comprises the services described on the',
    'Tarifseite': 'plans page',
    'beschriebenen Leistungen. Plus verändert': '. Plus does',
    'nicht die Bewertung oder die Trefferreihenfolge': 'not change the scoring or the result order',
    'für andere Nutzende und verschafft': 'for other users and provides',
    'keinen früheren Zugang': 'no earlier access',
    'zu neuen Angeboten. Zur vorrangigen Anzeige von Anfragen bei der anbietenden Seite siehe § 6.':
      'to new offers. On the priority display of enquiries in the advertiser’s inbox, see § 6.',
    '(2) Der Preis beträgt {4} im Monat oder {5} im Jahr.':
      '(2) The price is {4} per month or {5} per year.',
    '(3) Die Laufzeit beträgt je nach Wahl einen Monat oder ein Jahr und verlängert sich jeweils um denselben Zeitraum, wenn nicht bis zum Ablauf gekündigt wird. Die Kündigung ist jederzeit zum Ende der laufenden Laufzeit möglich, für Verbraucherinnen und Verbraucher nach Ablauf der Erstlaufzeit jederzeit mit einer Frist von einem Monat (§ 309 Nr. 9 BGB).':
      '(3) The term is one month or one year, as chosen, and renews for the same period unless cancelled before it ends. Cancellation is possible at any time with effect from the end of the current term; for consumers, after the initial term has expired, at any time with one month’s notice (§ 309 no. 9 BGB).',
    '(4) Die Kündigung ist ohne Anmeldung und ohne Umweg über den Kundendienst möglich, über die Schaltfläche':
      '(4) Cancellation is possible without signing in and without any detour via customer service, using the button',
    '„Verträge hier kündigen“': '“Cancel contracts here”',
    '(§ 312k BGB). Eine formlose Nachricht an {7} genügt ebenfalls.':
      '(§ 312k BGB). An informal message to {7} is equally sufficient.',
    '(5) Erhöht der Anbieter den Preis, teilt er dies mindestens sechs Wochen vor Wirksamwerden in Textform mit. Die Nutzenden können den Vertrag bis zum Wirksamwerden zum Zeitpunkt der Erhöhung kündigen; darauf wird in der Mitteilung hingewiesen.':
      '(5) If the provider raises the price it will give notice in text form at least six weeks before it takes effect. Users may cancel the contract with effect from the date of the increase up until it takes effect; the notice will point this out.',

    '§ 6 Bezahlte Sichtbarkeit': '§ 6 Paid visibility',
    '(1) Der Anbieter stellt zwei Formen bezahlter Sichtbarkeit bereit:':
      '(1) The provider offers two forms of paid visibility:',
    'Vorrang von Anfragen.': 'Priority for enquiries.',
    'Anfragen von Nutzenden mit TrimmoTrade Plus werden im Posteingang der anbietenden Seite vorrangig angezeigt und dort als solche gekennzeichnet.':
      'Enquiries from users with TrimmoTrade Plus are displayed first in the advertiser’s inbox and labelled as such there.',
    'Hervorhebung von Inseraten.': 'Promotion of listings.',
    'Einzeln buchbar zu den auf der': 'Bookable individually at the prices stated on the',
    'genannten Preisen.': '.',
    '(2) Bezahlte Platzierungen werden stets als solche gekennzeichnet und getrennt von den organischen Ergebnissen dargestellt (§ 5b Abs. 1 Nr. 6 und Abs. 2 UWG). Die Reihenfolge der übrigen Treffer bleibt davon unberührt; sie entsteht allein aus den Angaben des suchenden Nutzers.':
      '(2) Paid placements are always labelled as such and shown separately from the organic results (§ 5b(1) no. 6 and (2) UWG). The order of the remaining results is unaffected; it derives solely from the searching user’s own details.',
    '(3) Bezahlte Sichtbarkeit verändert nicht die inhaltliche Bewertung eines Angebots. Prüfhinweis, Vergleichsmiete, Chancenschätzung und Kostenrechnung sind davon unabhängig und bleiben im freien Tarif vollständig verfügbar.':
      '(3) Paid visibility does not change the substantive assessment of an offer. The check notice, benchmark rent, estimate of your chances and cost calculation are independent of it and remain fully available on the free plan.',
    '(4) Es besteht kein Anspruch auf eine bestimmte Anzahl von Aufrufen, Anfragen oder auf einen Vermietungs- oder Verkaufserfolg. Die Zahl gleichzeitig angezeigter bezahlter Plätze ist begrenzt; sind alle belegt, wird die Buchung erst zum nächstmöglichen Zeitpunkt wirksam.':
      '(4) There is no entitlement to any particular number of views or enquiries, or to a successful letting or sale. The number of paid placements shown at the same time is limited; if all are taken, the booking takes effect at the next possible time.',
    '(5) Hervorhebungen sind digitale Dienstleistungen. Für Verbraucherinnen und Verbraucher gilt das':
      '(5) Promotions are digital services. For consumers the',
    'Widerrufsrecht': 'right of withdrawal',
    '; beginnt die Leistung auf ausdrücklichen Wunsch sofort, erlischt es nach § 356 Abs. 5 BGB.':
      'applies; if performance begins immediately at your express request, it lapses under § 356(5) BGB.',

    '§ 7 Gründerplätze': '§ 7 Founder places',
    '(1) Der Anbieter vergibt die ersten': '(1) The provider grants the first',
    'Plätze': 'places',
    'mit den Leistungen von TrimmoTrade Plus für': 'with the services of TrimmoTrade Plus for',
    'Monate ohne Entgelt': 'months free of charge',
    '(Gründerplatz).': '(founder place).',
    '(2) Der Gründerplatz ist': '(2) A founder place is',
    'kein Abonnement': 'not a subscription',
    '. Er verlängert sich nicht, geht nicht in einen bezahlten Vertrag über und erfordert keine Zahlungsdaten. Nach Ablauf der {12} Monate stehen die Leistungen des freien Tarifs zur Verfügung; wer Plus danach weiter nutzen möchte, entscheidet sich neu.':
      '. It does not renew, does not turn into a paid contract and requires no payment details. After the {12} months have elapsed the services of the free plan are available; anyone wishing to carry on using Plus decides afresh.',
    '(3) Es besteht kein Anspruch auf einen Gründerplatz. Die Vergabe erfolgt in der Reihenfolge des Eingangs und endet, sobald das Kontingent erschöpft ist. Ein Gründerplatz wird je Person einmal vergeben und ist nicht übertragbar.':
      '(3) There is no entitlement to a founder place. They are granted in order of arrival and end once the allocation is used up. One founder place is granted per person and it is not transferable.',
    '(4) Der Anbieter kann einen Gründerplatz entziehen, wenn er durch falsche Angaben oder mehrfache Anmeldung derselben Person erlangt wurde.':
      '(4) The provider may withdraw a founder place if it was obtained through false statements or through the same person signing up more than once.',
    '(5) Der Gründerplatz kann jederzeit ohne Angabe von Gründen beendet werden. Da er unentgeltlich ist, entsteht dabei keine Zahlungspflicht und es besteht kein Anspruch auf Erstattung.':
      '(5) A founder place can be ended at any time without giving reasons. As it is free of charge, no payment obligation arises and there is no claim to a refund.',

    '§ 8 Pflichten der Nutzenden': '§ 8 Users’ obligations',
    '(1) Angaben, die Nutzende einstellen, müssen zutreffend sein. Insbesondere dürfen keine Wohnungen angeboten werden, über die keine Verfügungsbefugnis besteht.':
      '(1) Details posted by users must be accurate. In particular, no apartments may be offered over which the user has no right of disposal.',
    '(2) Untersagt sind insbesondere:': '(2) The following are prohibited in particular:',
    'Angebote, die es nicht gibt, sowie Zahlungsaufforderungen vor einer Besichtigung':
      'offers that do not exist, and demands for payment before a viewing',
    'Formulierungen, die nach Herkunft, Religion, Geschlecht, Behinderung, Alter oder sexueller Identität aussortieren (§§ 19, 21 Allgemeines Gleichbehandlungsgesetz)':
      'wording that filters by origin, religion, gender, disability, age or sexual identity (§§ 19, 21 AGG)',
    'Fragen nach Familienplanung, Religion, Parteizugehörigkeit oder Vorstrafen gegenüber Bewerbenden':
      'questions to applicants about family planning, religion, party membership or criminal convictions',
    'das automatisierte Auslesen der Anwendung sowie Versuche, ihre technischen Schutzvorkehrungen zu umgehen':
      'automated scraping of the application and attempts to circumvent its technical protection measures',
    'Inhalte, die Rechte Dritter verletzen': 'content that infringes third-party rights',
    '(3) Nutzende halten den Anbieter von Ansprüchen Dritter frei, die auf einer schuldhaften Verletzung dieser Pflichten beruhen, einschließlich angemessener Kosten der Rechtsverteidigung.':
      '(3) Users indemnify the provider against third-party claims arising from a culpable breach of these obligations, including reasonable costs of legal defence.',

    '§ 9 Inhalte der Nutzenden': '§ 9 User content',
    '(1) Rechte an eingestellten Inhalten verbleiben bei den Nutzenden.':
      '(1) Rights in posted content remain with the users.',
    '(2) Für die Dauer der Einstellung räumen Nutzende dem Anbieter das einfache, räumlich unbegrenzte Recht ein, diese Inhalte im Rahmen der Anwendung anzuzeigen, technisch zu vervielfältigen und in Formate umzuwandeln, die zur Darstellung nötig sind. Weitergehende Rechte werden nicht eingeräumt.':
      '(2) For as long as the content is posted, users grant the provider the non-exclusive, geographically unlimited right to display it within the application, to reproduce it technically and to convert it into formats needed for display. No further rights are granted.',
    '(3) Mit der Löschung eines Inhalts endet das Nutzungsrecht, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.':
      '(3) Deleting content ends the right of use, unless statutory retention obligations stand in the way.',

    '§ 10 Entfernen von Inhalten, Sperrung, Beschwerde':
      '§ 10 Removal of content, suspension, complaints',
    '(1) Der Anbieter kann Inhalte entfernen oder den Zugang einschränken, wenn sie rechtswidrig sind oder gegen § 8 verstoßen.':
      '(1) The provider may remove content or restrict access if it is unlawful or breaches § 8.',
    '(2) Betroffene erhalten dazu eine': '(2) Those affected receive a',
    'Begründung': 'statement of reasons',
    'mit Angabe des Grundes, der Tatsachengrundlage und der Möglichkeiten, dagegen vorzugehen (Art. 17 der Verordnung (EU) 2022/2065).':
      'setting out the ground, the factual basis and the options for challenging it (Art. 17 of Regulation (EU) 2022/2065).',
    '(3) Gegen eine Entscheidung kann innerhalb von sechs Monaten formlos Beschwerde an {18} erhoben werden. Der Anbieter entscheidet darüber unverzüglich, begründet und nicht ausschließlich automatisiert.':
      '(3) A decision can be challenged informally within six months by writing to {18}. The provider decides without delay, with reasons, and not solely by automated means.',
    '(4) Rechtswidrige Inhalte lassen sich': '(4) Unlawful content can be',
    'hier melden': 'reported here',
    '. Meldungen werden zeitnah, sorgfältig und nicht willkürlich bearbeitet (Art. 16 der Verordnung (EU) 2022/2065).':
      '. Reports are handled promptly, diligently and non-arbitrarily (Art. 16 of Regulation (EU) 2022/2065).',

    '§ 11 Verfügbarkeit': '§ 11 Availability',
    '(1) Der Anbieter bemüht sich um eine möglichst unterbrechungsfreie Verfügbarkeit, schuldet sie aber nicht ununterbrochen. Wartungsarbeiten, Störungen der Netze Dritter und Ereignisse höherer Gewalt können zu Unterbrechungen führen.':
      '(1) The provider endeavours to keep the service available without interruption but does not owe uninterrupted availability. Maintenance, faults in third-party networks and force majeure events can cause interruptions.',
    '(2) Geplante Wartungsarbeiten werden nach Möglichkeit angekündigt und in nutzungsschwache Zeiten gelegt.':
      '(2) Planned maintenance is announced where possible and scheduled for low-usage periods.',
    '(3) Fällt eine bezahlte Leistung länger als 48 zusammenhängende Stunden aus, verlängert sich die Laufzeit auf Verlangen entsprechend.':
      '(3) If a paid service is unavailable for more than 48 consecutive hours, the term is extended accordingly on request.'
  });

  /* ------------------------- Widerruf, Meldeweg, Barrierefreiheit ------------------------- */

  e({
    '§ 12 Mängel und Haftung': '§ 12 Defects and liability',
    '(1) Für die Bereitstellung digitaler Produkte gegen Entgelt gelten die §§ 327 ff. BGB. Der Anbieter schuldet die vereinbarte und die objektiv erforderliche Beschaffenheit einschließlich der Aktualisierungen, die zum Erhalt der Vertragsmäßigkeit nötig sind.':
      '(1) §§ 327 et seq. BGB apply to the supply of digital products for payment. The provider owes the agreed and the objectively required quality, including the updates needed to maintain conformity with the contract.',
    '(2) Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei der Verletzung von Leben, Körper oder Gesundheit, nach dem Produkthaftungsgesetz sowie im Umfang einer übernommenen Garantie.':
      '(2) The provider is liable without limitation for intent and gross negligence, for injury to life, body or health, under the German Product Liability Act, and to the extent of any guarantee given.',
    '(3) Bei einfacher Fahrlässigkeit haftet der Anbieter nur für die Verletzung wesentlicher Vertragspflichten – solcher Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung regelmäßig vertraut werden darf – und begrenzt auf den vertragstypischen, vorhersehbaren Schaden.':
      '(3) In cases of ordinary negligence the provider is liable only for breach of material contractual obligations – obligations whose fulfilment makes proper performance of the contract possible in the first place and on whose observance a party may regularly rely – and limited to the foreseeable damage typical of the contract.',
    '(4) Im Übrigen ist die Haftung ausgeschlossen. Eine Änderung der Beweislast zum Nachteil der Nutzenden ist damit nicht verbunden.':
      '(4) Liability is otherwise excluded. This does not involve any change in the burden of proof to users’ detriment.',
    '(5) Der Anbieter haftet nicht für Entscheidungen, die auf Grundlage der Rechenergebnisse und Hinweise nach § 2 Abs. 3 getroffen werden, und nicht für das Verhalten anderer Nutzender.':
      '(5) The provider is not liable for decisions taken on the basis of the computed results and notes under § 2(3), nor for the conduct of other users.',
    '§ 13 Kündigung durch den Anbieter': '§ 13 Termination by the provider',
    '(1) Unentgeltliche Nutzungsverhältnisse kann der Anbieter mit einer Frist von vier Wochen kündigen.':
      '(1) The provider may terminate free user relationships on four weeks’ notice.',
    '(2) Das Recht zur Kündigung aus wichtigem Grund bleibt beiderseits unberührt. Ein wichtiger Grund liegt für den Anbieter insbesondere bei erheblichen oder wiederholten Verstößen gegen § 8 vor.':
      '(2) The right to terminate for good cause remains unaffected on both sides. For the provider, good cause exists in particular in the case of serious or repeated breaches of § 8.',
    '§ 14 Änderung dieser Bedingungen': '§ 14 Changes to these terms',
    '(1) Der Anbieter kann diese Bedingungen ändern, wenn dies zur Anpassung an geänderte Rechtslage, Rechtsprechung oder an Änderungen der Anwendung erforderlich ist und die Nutzenden dadurch nicht unangemessen benachteiligt werden.':
      '(1) The provider may amend these terms where necessary to adapt to a changed legal position, case law or changes to the application, and where users are not thereby unreasonably disadvantaged.',
    '(2) Änderungen werden mindestens sechs Wochen vor Wirksamwerden in Textform mitgeteilt. Widersprechen Nutzende nicht bis zum Wirksamwerden, gelten die Änderungen als angenommen; auf diese Folge und auf das Widerspruchsrecht wird in der Mitteilung gesondert hingewiesen. Im Fall des Widerspruchs kann jede Seite den Vertrag zum Zeitpunkt des Wirksamwerdens kündigen.':
      '(2) Changes are notified in text form at least six weeks before they take effect. If users do not object before they take effect, the changes are deemed accepted; the notice separately points out this consequence and the right to object. In the event of an objection, either side may terminate the contract with effect from the date the changes take effect.',
    '§ 15 Schlussbestimmungen': '§ 15 Final provisions',
    '(1) Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Verbraucherinnen und Verbrauchern bleiben die zwingenden Schutzvorschriften des Staates erhalten, in dem sie ihren gewöhnlichen Aufenthalt haben (Art. 6 Abs. 2 der Verordnung (EG) Nr. 593/2008).':
      '(1) German law applies, excluding the UN Convention on Contracts for the International Sale of Goods. Consumers retain the mandatory protective provisions of the state in which they have their habitual residence (Art. 6(2) of Regulation (EC) No 593/2008).',
    '(2) Ist die nutzende Person Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand der Sitz des Anbieters.':
      '(2) If the user is a merchant, a legal person under public law or a special fund under public law, the place of jurisdiction is the provider’s registered office.',
    '(3) Der Anbieter nimmt nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil (§ 36 VSBG).':
      '(3) The provider does not take part in dispute resolution proceedings before a consumer arbitration board (§ 36 VSBG).',
    '(4) Sollte eine Bestimmung unwirksam sein, bleibt der Vertrag im Übrigen wirksam.':
      '(4) Should any provision be invalid, the remainder of the contract stays in force.',
    'Fassung vom {19}.': 'Version of {19}.',
    'Fassung vom {15}.': 'Version of {15}.',

    /* Widerruf */
    'Gilt der Widerruf für dich?': 'Does the right of withdrawal apply to you?',
    'Das Widerrufsrecht besteht bei Verträgen, die': 'The right of withdrawal exists for contracts concluded',
    'gegen Entgelt': 'for payment',
    'im Fernabsatz geschlossen werden – also bei TrimmoTrade Plus. Für den freien Tarif und für einen':
      'at a distance – that is, for TrimmoTrade Plus. For the free plan and for a',
    'Gründerplatz besteht kein Widerrufsrecht': 'founder place there is no right of withdrawal',
    ', weil dabei keine Zahlungspflicht entsteht. Beides lässt sich jederzeit und ohne Grund beenden.':
      ', because no payment obligation arises. Both can be ended at any time and without giving a reason.',
    'Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.':
      'You have the right to withdraw from this contract within fourteen days without giving any reason. The withdrawal period is fourteen days from the day the contract is concluded.',
    'Um dein Widerrufsrecht auszuüben, musst du uns ({3}, {4}, {5}, {6}) mittels einer eindeutigen Erklärung – zum Beispiel per Post versandter Brief oder E-Mail – über deinen Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst dafür das beigefügte Muster verwenden, das aber nicht vorgeschrieben ist.':
      'To exercise your right of withdrawal you must inform us ({3}, {4}, {5}, {6}) of your decision to withdraw from this contract by an unequivocal statement – for example a letter sent by post or an email. You may use the attached model form for this, though it is not mandatory.',
    'Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.':
      'To meet the withdrawal deadline it is sufficient for you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period has expired.',
    'Folgen des Widerrufs': 'Effects of withdrawal',
    'Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.':
      'If you withdraw from this contract, we shall reimburse to you all payments received from you without undue delay and in any event not later than fourteen days from the day on which we are informed about your decision to withdraw from this contract. We will carry out such reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees as a result of such reimbursement.',
    'Hast du verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so hast du uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zum Zeitpunkt deiner Mitteilung bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht (§ 357 Abs. 8 BGB).':
      'If you requested that the service should begin during the withdrawal period, you shall pay us an amount which is in proportion to what has been provided until you communicated your withdrawal, in comparison with the full coverage of the contract (§ 357(8) BGB).',
    'Vorzeitiges Erlöschen': 'Early lapse',
    'Das Widerrufsrecht erlischt bei einem Vertrag über die Bereitstellung digitaler Inhalte oder Dienstleistungen vorzeitig, wenn wir mit der Ausführung begonnen haben, nachdem du':
      'For a contract on the supply of digital content or services, the right of withdrawal lapses early if we have begun performance after you have',
    'ausdrücklich zugestimmt hast, dass wir vor Ablauf der Widerrufsfrist beginnen,':
      'expressly consented to us beginning before the withdrawal period expires,',
    'bestätigt hast, dass du dadurch dein Widerrufsrecht verlierst, und':
      'acknowledged that you thereby lose your right of withdrawal, and',
    'wir dir diese Bestätigung auf einem dauerhaften Datenträger zur Verfügung gestellt haben (§ 356 Abs. 5 BGB, § 312f Abs. 3 BGB).':
      'we have provided you with that confirmation on a durable medium (§ 356(5) BGB, § 312f(3) BGB).',
    'TrimmoTrade holt diese Zustimmung in der Bestellstrecke ausdrücklich ein – als eigenes Kästchen, nicht vorausgewählt. Wer nicht zustimmt, wird nach Ablauf der vierzehn Tage freigeschaltet und behält sein Widerrufsrecht ungeschmälert.':
      'TrimmoTrade obtains this consent expressly during the order process – as its own checkbox, not pre-ticked. Anyone who does not consent is activated after the fourteen days have elapsed and keeps their right of withdrawal undiminished.',
    'Muster-Widerrufsformular': 'Model withdrawal form',
    'Wenn du den Vertrag widerrufen willst, füll dieses Formular aus und schick es zurück. Vorgeschrieben ist es nicht.':
      'If you wish to withdraw from the contract, fill in this form and send it back. It is not mandatory.',
    'An {10} {11} {12} Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: TrimmoTrade Plus Bestellt am (*) / erhalten am (*): ______________________ Name des/der Verbraucher(s): ____________________________ Anschrift des/der Verbraucher(s): _______________________ ________________________________________________________ Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier) Datum: __________________ (*) Unzutreffendes streichen.':
      'To {10} {11} {12} I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the supply of the following service: TrimmoTrade Plus Ordered on (*) / received on (*): ______________________ Name of consumer(s): ____________________________________ Address of consumer(s): _________________________________ ________________________________________________________ Signature of consumer(s) (only if this form is notified on paper) Date: __________________ (*) Delete as appropriate.',
    'Formular kopieren': 'Copy form',
    'Als Textdatei sichern': 'Save as a text file',
    /* Meldeweg */
    'Wofür dieser Weg gedacht ist': 'What this route is for',
    'Für Inhalte in TrimmoTrade, die gegen Recht verstoßen: erfundene Inserate, Zahlungsaufforderungen vor der Besichtigung, Angebote ohne Verfügungsbefugnis, benachteiligende Formulierungen im Sinne des Allgemeinen Gleichbehandlungsgesetzes oder Verletzungen von Rechten Dritter.':
      'For content in TrimmoTrade that breaks the law: invented listings, demands for payment before a viewing, offers made without the right of disposal, discriminatory wording within the meaning of the German Equal Treatment Act, or infringements of third-party rights.',
    'Was eine Meldung enthalten sollte': 'What a report should contain',
    'eine': 'a',
    'hinreichend begründete Erläuterung': 'sufficiently substantiated explanation',
    ', warum der Inhalt rechtswidrig ist': 'of why the content is unlawful',
    'die': 'the',
    'genaue Angabe des Ortes': 'exact location',
    '– am einfachsten der Verweis auf das Inserat': '– most simply the link to the listing',
    'Name und E-Mail-Adresse': 'Name and email address',
    'der meldenden Person; das entfällt bei Meldungen zu bestimmten Straftaten gegen die sexuelle Selbstbestimmung':
      'of the person reporting; this is not required for reports concerning certain offences against sexual self-determination',
    'Bestätigung': 'Confirmation',
    ', dass die Angaben nach bestem Wissen richtig und vollständig sind':
      'that the information is accurate and complete to the best of your knowledge',
    'Wie es weitergeht': 'What happens next',
    'Der Eingang wird unverzüglich bestätigt. Die Meldung wird zeitnah, sorgfältig, frei von Willkür und objektiv bearbeitet. Über die Entscheidung und die Möglichkeiten, dagegen vorzugehen, ergeht eine begründete Mitteilung. Wird eine Entscheidung nicht ausschließlich von Hand getroffen, wird auf den Einsatz automatisierter Mittel hingewiesen.':
      'Receipt is confirmed without delay. The report is handled promptly, diligently, non-arbitrarily and objectively. A reasoned notice is issued about the decision and the options for challenging it. If a decision is not taken entirely by hand, the use of automated means is disclosed.',
    'Kontaktstelle': 'Point of contact',
    'Meldungen und alle Anliegen nach den Artikeln 11 und 12 der Verordnung gehen an: {5}. Die Kommunikation ist in':
      'Reports and all matters under Articles 11 and 12 of the Regulation go to: {5}. Communication is possible in',
    'deutscher': 'German',
    'Sprache möglich.': '.',
    'Der Anbieter ist ein Kleinstunternehmen im Sinne der Empfehlung 2003/361/EG und damit von den zusätzlichen Pflichten für Online-Plattformen nach Abschnitt 3 des Kapitels III der Verordnung befreit (Art. 19). Die Pflichten aus den Artikeln 11 bis 18 gelten gleichwohl und werden erfüllt.':
      'The provider is a micro-enterprise within the meaning of Recommendation 2003/361/EC and is therefore exempt from the additional obligations for online platforms under Section 3 of Chapter III of the Regulation (Art. 19). The obligations under Articles 11 to 18 nevertheless apply and are met.',
    'Missbräuchliche Meldungen': 'Abusive reports',
    'Wer wiederholt offensichtlich unbegründet meldet, kann nach vorheriger Verwarnung für eine angemessene Zeit von der Bearbeitung ausgeschlossen werden (Art. 23 Abs. 2 der Verordnung).':
      'Anyone repeatedly submitting manifestly unfounded reports may, after a prior warning, be excluded from having reports processed for a reasonable period (Art. 23(2) of the Regulation).',

    /* Barrierefreiheit */
    'Stand': 'As at',
    'TrimmoTrade ist so gebaut, dass es sich vollständig mit der Tastatur bedienen lässt und mit Vorleseprogrammen zurechtkommt. Geprüft wurde gegen die Web Content Accessibility Guidelines in der Fassung 2.2, Stufe AA.':
      'TrimmoTrade is built so that it can be operated entirely with the keyboard and works with screen readers. It has been tested against the Web Content Accessibility Guidelines version 2.2, level AA.',
    'alle Bedienelemente mit Tastatur erreichbar, sichtbarer Fokus, Sprungmarke zum Inhalt':
      'every control reachable by keyboard, a visible focus indicator, a skip link to the content',
    'Kontraste durchgerechnet statt geschätzt: Fließtext mindestens 4,5 zu 1, große Schrift und Bedienelemente mindestens 3 zu 1 – in hell und dunkel':
      'contrast calculated rather than estimated: body text at least 4.5:1, large text and controls at least 3:1 – in light and dark',
    'Farbe nie als einziges Unterscheidungsmerkmal; Diagrammfarben zusätzlich auf Unterscheidbarkeit bei Farbfehlsichtigkeit geprüft':
      'colour never the only distinguishing feature; chart colours additionally checked for distinguishability under colour vision deficiency',
    'Beschriftungen an jedem Eingabefeld, sinnvolle Überschriftenordnung, genau eine Hauptüberschrift je Ansicht':
      'a label on every input field, a sensible heading order, exactly one main heading per view',
    'Bewegung nur, wenn das Betriebssystem sie nicht abbestellt hat (':
      'motion only where the operating system has not opted out of it (',
    'kein waagerechter Überlauf von 320 bis 1920 Pixel Breite':
      'no horizontal overflow from 320 to 1920 pixels wide',
    'Was noch nicht barrierefrei ist': 'What is not yet accessible',
    'Die': 'The',
    'lässt sich mit der Tastatur verschieben und zoomen, ersetzt aber räumliche Information nicht vollständig durch Text. Alle Angaben stehen zusätzlich in der Trefferliste.':
      'can be panned and zoomed with the keyboard but does not fully replace spatial information with text. All the details are also in the result list.',
    'Preisverläufe': 'Price histories',
    'im Marktbereich sind Diagramme. Die Zahlen dahinter stehen als Tabelle darunter, die Beschreibung der Kurve ist knapp.':
      'in the market section are charts. The figures behind them are given as a table underneath; the description of the curve is brief.',
    'Bilder der Angebote sind schematische Zeichnungen. Ihre Beschreibung nennt Gebäudeart und Lage, nicht den tatsächlichen Zustand.':
      'Images of offers are schematic drawings. Their description names the building type and location, not the actual condition.',
    'Rückmeldung': 'Feedback',
    'Fällt etwas auf, das sich nicht bedienen lässt: {10}. Rückmeldungen zur Barrierefreiheit werden vorrangig behandelt.':
      'If you notice something that cannot be operated: {10}. Accessibility feedback is treated as a priority.',
    'Rechtlicher Rahmen': 'Legal framework',
    'Das Barrierefreiheitsstärkungsgesetz gilt seit dem 28. Juni 2025 unter anderem für Dienstleistungen im elektronischen Geschäftsverkehr gegenüber Verbraucherinnen und Verbrauchern. Kleinstunternehmen, die Dienstleistungen erbringen – weniger als zehn Beschäftigte und höchstens zwei Millionen Euro Jahresumsatz –, sind davon ausgenommen (§ 3 Abs. 3 BFSG). Der Anbieter fällt derzeit unter diese Ausnahme und hält die Anforderungen dennoch freiwillig ein.':
      'The German Accessibility Strengthening Act (BFSG) has applied since 28 June 2025 to, among other things, e-commerce services provided to consumers. Micro-enterprises providing services – fewer than ten employees and no more than two million euros in annual turnover – are exempt (§ 3(3) BFSG). The provider currently falls under this exemption and meets the requirements voluntarily nonetheless.',

    /* Kündigung */
    'Kündigung auf anderem Weg': 'Cancelling by other means',
    'Eine formlose Erklärung genügt jederzeit, ohne Begründung:':
      'An informal statement is always sufficient, with no reason required:',
    'Post': 'Post',
    'Gib an, welcher Vertrag gekündigt werden soll, und wann die Kündigung wirken soll – zum nächstmöglichen Zeitpunkt oder zu einem bestimmten Datum. Der Eingang wird in Textform bestätigt, und zwar mit Angabe des Zeitpunkts, zu dem die Kündigung wirkt (§ 312k Abs. 4 BGB).':
      'State which contract is to be cancelled and when the cancellation should take effect – at the earliest possible date or on a specific date. Receipt is confirmed in text form, stating the point at which the cancellation takes effect (§ 312k(4) BGB).',
    'Widerruf statt Kündigung': 'Withdrawal instead of cancellation',
    'Innerhalb der ersten vierzehn Tage nach Vertragsschluss ist ein Widerruf möglich, der den Vertrag von Anfang an rückabwickelt. Das ist für dich meist günstiger als eine Kündigung.':
      'Within the first fourteen days after the contract is concluded you can withdraw, which unwinds the contract from the outset. That is usually better for you than cancelling.',
    'Zur Widerrufsbelehrung.': 'To the withdrawal notice.',

    /* Betreiberangaben */
    'Diese Angaben bleiben auf diesem Gerät': 'These details stay on this device',
    'Sie liegen im Speicher dieses Browsers, wie alles andere auch. Für den echten Betrieb gehören sie fest in den Quelltext – in':
      'They live in this browser’s storage, like everything else. For real operation they belong permanently in the source code – in',
    'assets/recht.js': 'assets/recht.js',
    'unter': 'under',
    'VORGABE': 'VORGABE',
    '. Dann stehen sie für alle Aufrufe bereit und nicht nur für deinen.':
      '. Then they are available for every visitor, not just for you.',
    'Angaben': 'Details',
    'Kleinunternehmerregelung nach § 19 UStG': 'Small-business rule under § 19 UStG',
    'Dann wird keine Umsatzsteuer ausgewiesen, und die Preisangaben sagen das dazu.':
      'No VAT is then shown, and the price statements say so.',
    'Angaben übernehmen': 'Apply details',
    'So sehen sie im Impressum aus': 'This is how they look in the legal notice',
    'Impressum ansehen': 'View legal notice'
  });

  /* ------------------------- Letzte Muster und Betreiberangaben ------------------------- */

  e({
    'Nähe {0}': 'near {0}',
    'ohne {0}': 'no {0}',
    ' – rechnerisch {0} von 100': ' – {0} out of 100 on the numbers',
    '{0} Jahre': 'aged {0}',
    'Seit {0} Tagen online, noch früh genug.': 'Online for {0} days, still early enough.',
    'Seit {0} Tagen online – die ersten Besichtigungen laufen wahrscheinlich schon.':
      'Online for {0} days – the first viewings are probably already under way.',
    'Seit {0} Tagen online. Entweder ist es schwer vermietbar, oder die Vergabe stockt.':
      'Online for {0} days. Either it is hard to let, or the allocation has stalled.',
    'Der Anbieter antwortet nur in {0} % der Fälle.': 'The provider only replies {0} % of the time.',
    '{0} % zur Vergleichsmiete': '{0} % vs. the benchmark rent',
    'Faktor {0} Jahresmieten': 'multiple of {0} annual rents',
    '{0} von {1} Pflicht': '{0} of {1} must-haves',
    '{0} von {1} Wunsch': '{0} of {1} nice-to-haves',
    'WG: {0} von 10': 'Flatshare: {0} out of 10',
    'Du: {0} von 10': 'You: {0} out of 10',
    'Zeitpunkt': 'Timing',
    'Deine Bewerbung': 'Your application',
    'Andrang': 'Demand',
    'Miete + WG-Zimmer': 'Rent + flatshare room',
    'Mit Plus kannst du beliebig viele anlegen.': 'With Plus you can create as many as you like.',
    '2 Objekte stehen auf „gemerkt“. TrimmoTrade schreibt für jedes ein eigenes Anschreiben aus deinem Profil – angepasst an Titel, Lage und Preis, nicht als Rundmail.':
      '2 listings are marked “saved”. TrimmoTrade writes a separate covering letter for each from your profile – tailored to the title, location and price, not a mass mailing.',
    'Objekte stehen auf „gemerkt“. TrimmoTrade schreibt für jedes ein eigenes Anschreiben aus deinem Profil – angepasst an Titel, Lage und Preis, nicht als Rundmail.':
      'listings are marked “saved”. TrimmoTrade writes a separate covering letter for each from your profile – tailored to the title, location and price, not a mass mailing.',
    'Hervorgehobene Inserate stehen in einem eigenen, als bezahlt gekennzeichneten Block über den Treffern – nie zwischen ihnen. Die Reihenfolge der Suche bleibt unberührt.':
      'Promoted listings sit in their own block above the results, labelled as paid – never among them. The search order is unaffected.',
    'nur mit geschwärzter Nummer und erst bei ernsthaftem Interesse':
      'only with the number blacked out, and only once there is serious interest',
    'falls Einkommen oder Bonität nicht reichen': 'if income or creditworthiness is not enough',
    'nur für geförderte Wohnungen nötig': 'only needed for subsidised apartments',
    'Welche Posten überhaupt umgelegt werden dürfen, ob die Abrechnung rechtzeitig kam und ob die Heizkosten richtig verteilt wurden.':
      'Which items may be passed on at all, whether the statement arrived in time, and whether the heating costs were split correctly.',
    'wenn die Abrechnung im Briefkasten liegt': 'when the statement is in your letterbox',
    'Unterlagen einmal verschlüsselt ablegen und beim Bewerben nur einen Verweis verschicken, der nach gesetzter Frist erlischt und sich jederzeit widerrufen lässt.':
      'Store your documents once, encrypted, and when applying send only a link that expires after a set period and can be revoked at any time.',
    'vor der ersten Bewerbung': 'before your first application',
    'Zwei Grenzen, die ständig verwechselt werden: was dein Haushalt trägt und was Vermieter sehen wollen. Dazu, wie groß die Wohnung in jeder Stadt sein dürfte.':
      'Two limits that are constantly confused: what your household can carry and what landlords want to see. Plus how big the apartment could be in each city.',
    'Rechnet dein maßgebliches Jahreseinkommen mit allen Pauschalen aus und stellt es der Einkommensgrenze gegenüber – die du selbst setzen kannst, weil jedes Land eine andere hat.':
      'Works out your relevant annual income with all the flat-rate deductions and sets it against the income limit – which you can set yourself, because every state has a different one.',
    'Vermögensvergleich über frei wählbare Jahre. Der Mietende legt sein Eigenkapital an und investiert die monatliche Differenz – anders ist der Vergleich unehrlich.':
      'A wealth comparison over as many years as you like. The renter invests their equity and the monthly difference – any other comparison is dishonest.',

    /* Rechtsübersicht und Betreiberangaben */
    'Angaben gemäß § 5 des Digitale-Dienste-Gesetzes (DDG).':
      'Information pursuant to § 5 of the German Digital Services Act (DDG).',
    'Informationen nach Artikel 13 und 14 der Datenschutz-Grundverordnung.':
      'Information under Articles 13 and 14 of the General Data Protection Regulation.',
    'Für die Nutzung von TrimmoTrade durch Verbraucherinnen, Verbraucher und Unternehmen.':
      'For the use of TrimmoTrade by consumers and businesses.',
    'Für Verbraucherinnen und Verbraucher bei entgeltlichen Verträgen.':
      'For consumers, in the case of paid contracts.',
    'Meldeweg nach Art. 16 der Verordnung über digitale Dienste.':
      'Reporting route under Art. 16 of the Digital Services Act.',
    'Meldeweg nach Artikel 16 der Verordnung (EU) 2022/2065 über digitale Dienste.':
      'Reporting route under Article 16 of Regulation (EU) 2022/2065 on digital services.',
    'Erklärung zur Barrierefreiheit': 'Accessibility statement',
    'Was umgesetzt ist, was fehlt und wo Rückmeldung ankommt.':
      'What is implemented, what is missing and where feedback goes.',
    'Was umgesetzt ist, was fehlt, und wo Rückmeldung ankommt.':
      'What is implemented, what is missing, and where feedback goes.',
    'Wer die Seite betreibt und wie er erreichbar ist – Pflichtangaben nach § 5 DDG.':
      'Who runs the site and how to reach them – mandatory details under § 5 DDG.',
    'Welche Daten verarbeitet werden, auf welcher Grundlage und welche Rechte du hast.':
      'What data is processed, on what basis, and what rights you have.',
    'Was TrimmoTrade leistet, was es kostet und was gilt, wenn etwas schiefgeht.':
      'What TrimmoTrade does, what it costs, and what applies if something goes wrong.',
    'Vierzehn Tage Widerrufsrecht bei bezahlten Verträgen, mit Musterformular.':
      'Fourteen days’ right of withdrawal on paid contracts, with a model form.',
    'Verträge hier kündigen': 'Cancel contracts here',
    'Die Schaltfläche, die § 312k BGB verlangt – ohne Umweg über den Kundendienst.':
      'The button § 312k BGB requires – with no detour via customer service.',
    'Die Schaltfläche, die § 312k BGB verlangt: ohne Anmeldung, ohne Rückfrage, ohne Umweg.':
      'The button § 312k BGB requires: no sign-in, no questions, no detour.',
    'Läuft seit kurzem, Abrechnung {0}.': 'Running since recently, billed {0}.',
    'Die Kündigung wirkt zum Ende der laufenden Laufzeit. Bis dahin stehen alle Leistungen zur Verfügung. Eine Bestätigung geht in Textform zu.':
      'The cancellation takes effect at the end of the current term. Until then all services remain available. A confirmation is sent in text form.',
    'Vertrag jetzt kündigen': 'Cancel contract now',
    'Von hier speisen sich Impressum, Datenschutzerklärung, AGB und Widerrufsbelehrung – jede Angabe steht nur einmal.':
      'The legal notice, privacy policy, terms and withdrawal notice all draw on this – each detail appears only once.',
    'Name des Anbieters': 'Provider’s name',
    'Vor- und Nachname oder Firma': 'First and last name, or company',
    'Straße und Hausnummer': 'Street and house number',
    'kein Postfach – die Anschrift muss ladungsfähig sein':
      'no PO box – the address must be one where documents can be served',
    'Pflichtangabe nach § 5 DDG': 'mandatory under § 5 DDG',
    'der übliche zweite Kontaktweg': 'the customary second contact route',
    'Postfach des Service-Teams': 'Service team mailbox',
    'wohin die Hilfe Anfragen weiterleitet': 'where the help forwards enquiries',
    'nur falls vorhanden – Kleinunternehmer haben meist keine':
      'only if you have one – small businesses usually do not',
    'Stelle der Gewerbeanmeldung': 'Trade registration office',
    'etwa „Gewerbeamt der Stadt …“': 'e.g. “Trade office of the city of …”',
    'die Behörde des Bundeslandes, in dem du sitzt': 'the authority of the federal state you are based in',
    'Verantwortlich nach § 18 Abs. 2 MStV': 'Responsible under § 18(2) MStV',
    'leer lassen, wenn es dieselbe Person und Anschrift ist':
      'leave empty if it is the same person and address',
    'keine – Kleinunternehmerregelung nach § 19 UStG':
      'none – small-business rule under § 19 UStG',
    'Diese Angabe fehlt noch': 'This detail is still missing',
    '[{0} eintragen]': '[enter {0}]',
    'Noch {0} Angaben fehlen': '{0} details are still missing',
    'Ein Impressum ohne ladungsfähige Anschrift oder ohne schnelle Kontaktmöglichkeit erfüllt die Pflicht aus § 5 DDG nicht – und das ist abmahnbar. Die Lücken sind in allen Dokumenten markiert.':
      'A legal notice without a serviceable address or a rapid means of contact does not meet the obligation under § 5 DDG – and that can attract a formal warning. The gaps are marked in every document.',
    '§ 5 Abs. 1 Nr. 1 DDG – ladungsfähige Anschrift, kein Postfach':
      '§ 5(1) no. 1 DDG – a serviceable address, not a PO box',
    '– § 5 Abs. 1 Nr. 1 DDG – ladungsfähige Anschrift, kein Postfach':
      '– § 5(1) no. 1 DDG – a serviceable address, not a PO box',
    '§ 5 Abs. 1 Nr. 2 DDG – oder ein anderes ebenso schnelles Mittel; die Rechtsprechung verlangt in der Regel die Nummer':
      '§ 5(1) no. 2 DDG – or another equally rapid means; the case law generally requires the number',
    '– § 5 Abs. 1 Nr. 2 DDG – oder ein anderes ebenso schnelles Mittel; die Rechtsprechung verlangt in der Regel die Nummer':
      '– § 5(1) no. 2 DDG – or another equally rapid means; the case law generally requires the number',
    'Art. 13 Abs. 2 lit. d DSGVO – Hinweis auf das Beschwerderecht':
      'Art. 13(2)(d) GDPR – notice of the right to complain',
    '– Art. 13 Abs. 2 lit. d DSGVO – Hinweis auf das Beschwerderecht':
      '– Art. 13(2)(d) GDPR – notice of the right to complain',
    'Jetzt eintragen': 'Enter now',
    'Legal form: Einzelunternehmen (Kleingewerbe). Ein Eintrag im Handelsregister besteht nicht; als Kleingewerbe besteht dazu keine Pflicht.':
      'Legal form: sole trader (small business). There is no commercial register entry; as a small business there is no obligation to have one.',
    'Einzelunternehmen (Kleingewerbe)': 'sole trader (small business)',
    'Ein Eintrag im Handelsregister besteht nicht; als Kleingewerbe besteht dazu keine Pflicht.':
      'There is no commercial register entry; as a small business there is no obligation to have one.',
    'Es besteht keine Umsatzsteuer-Identifikationsnummer.': 'There is no VAT identification number.',
    'Niklas Haberberg, Anschrift wie oben': 'Niklas Haberberg, address as above',

    /* Was vor dem Start zu klären ist */
    'Erlaubnis nach § 34c GewO – vermutlich nicht nötig, aber zu prüfen':
      'Licence under § 34c GewO – probably not needed, but worth checking',
    'Wer gewerbsmäßig den Abschluss von Verträgen über Wohnräume vermittelt oder die Gelegenheit dazu nachweist, braucht eine Erlaubnis der Gewerbebehörde. TrimmoTrade führt fremde Angebote zusammen und nimmt keine Provision – danach greift die Pflicht nicht. Die Abgrenzung ist im Einzelfall aber unscharf; ein kurzer Anruf beim Gewerbeamt kostet nichts.':
      'Anyone who commercially brokers contracts for residential premises, or points out the opportunity to conclude them, needs a licence from the trade authority. TrimmoTrade brings together third-party offers and takes no commission – on that basis the obligation does not apply. The dividing line is blurred in individual cases, though; a short call to the trade office costs nothing.',
    'Domain und Postfach müssen dir gehören': 'The domain and mailbox have to be yours',
    'Auftragsverarbeitung mit dem Hoster': 'A processing agreement with the host',
    'Verzeichnis von Verarbeitungstätigkeiten': 'Record of processing activities',
    'Gewerbeanmeldung und Finanzamt': 'Trade registration and the tax office',
    'Diese Texte durch eine anwaltliche Prüfung schicken':
      'Have these texts reviewed by a lawyer'
  });

  /* ------------------------- Letzte Lücken ------------------------- */

  e({
    'EG': 'GF', 'DG': 'top',
    'WG-Passung {0} % – passt gut': 'Flatshare match {0} % – a good fit',
    'WG-Passung {0} % – passt eher nicht': 'Flatshare match {0} % – probably not a fit',
    'Noch {0} Plätze frei. Kein Abo, keine Zahlungsdaten, keine Verlängerung – nach zwölf Monaten endet der Platz von selbst.':
      '{0} places still free. No subscription, no payment details, no renewal – after twelve months the place ends by itself.',
    'Plätze frei. Kein Abo, keine Zahlungsdaten, keine Verlängerung – nach zwölf Monaten endet der Platz von selbst.':
      'places still free. No subscription, no payment details, no renewal – after twelve months the place ends by itself.',
    'im Architekturbüro': 'at an architecture practice',

    /* Was vor dem Start noch zu klären ist */
    'Wer gewerbsmäßig den Abschluss von Verträgen über Wohnräume vermittelt oder die Gelegenheit dazu nachweist, braucht eine Erlaubnis der Gewerbebehörde. TrimmoTrade führt fremde Angebote zusammen und verlangt dafür kein Erfolgshonorar von Vermietenden – das spricht dagegen, dass eine Erlaubnis nötig ist. Sobald aber eine Provision im Erfolgsfall fließt, sieht es anders aus. Diese Frage gehört vor dem Start einmal schriftlich geklärt, am besten beim zuständigen Ordnungs- oder Gewerbeamt.':
      'Anyone who commercially brokers contracts for residential premises, or points out the opportunity to conclude them, needs a licence from the trade authority. TrimmoTrade brings together third-party offers and charges landlords no success fee for doing so – which argues against a licence being needed. As soon as a commission flows on success, though, it looks different. This question should be settled in writing once before launch, ideally with the responsible public order or trade office.',
    'Die Hilfe leitet Anfragen an info@trimmotrade.de weiter. Bevor das erste Mal jemand darauf antwortet, muss die Domain registriert und das Postfach eingerichtet sein – und jemand muss es lesen. Ein Kontaktweg, der ins Leere geht, ist schlimmer als keiner: Nach § 5 DDG muss die Kontaktaufnahme tatsächlich möglich sein, und wer binnen weniger Tage nicht antwortet, verliert mehr als eine Anfrage.':
      'The help forwards enquiries to info@trimmotrade.de. Before anyone answers one for the first time, the domain has to be registered and the mailbox set up – and someone has to read it. A contact route that leads nowhere is worse than none: under § 5 DDG contact must actually be possible, and anyone who does not reply within a few days loses more than one enquiry.',
    'Sobald die Seite bei einem Anbieter liegt, verarbeitet dieser Anbieter personenbezogene Daten – mindestens die IP-Adressen der Aufrufe. Dafür braucht es einen Vertrag nach Art. 28 DSGVO. Die meisten Hoster stellen ihn zum Abschluss im Kundenkonto bereit.':
      'Once the site is hosted with a provider, that provider processes personal data – the IP addresses of visits at the very least. That requires a contract under Art. 28 GDPR. Most hosts make one available to conclude in your customer account.',
    'Art. 30 DSGVO verlangt es auch von kleinen Betrieben, sobald die Verarbeitung nicht nur gelegentlich erfolgt – bei einer laufenden Website ist das der Fall. Es ist kein Formular für die Behörde, sondern eine eigene Übersicht, die auf Verlangen vorgelegt wird.':
      'Art. 30 GDPR requires one of small businesses too, as soon as processing is more than occasional – which it is for a live website. It is not a form for the authority but your own overview, produced on request.',
    'Zahlungsabwicklung': 'Payment processing',
    'Sobald Plus bezahlt wird, kommt ein Zahlungsdienstleister ins Spiel. Er wird in der Datenschutzerklärung als Empfänger genannt, und die Bestellstrecke braucht die Schaltfläche mit der Aufschrift „zahlungspflichtig bestellen“ (§ 312j Abs. 3 BGB) sowie die Bestätigung des Vertrags auf einem dauerhaften Datenträger (§ 312f BGB).':
      'As soon as Plus is paid for, a payment service provider comes into play. It is named as a recipient in the privacy policy, and the order process needs the button labelled “order with obligation to pay” (§ 312j(3) BGB) as well as confirmation of the contract on a durable medium (§ 312f BGB).',
    'Das Kleingewerbe wird beim Gewerbeamt der Wohnsitzgemeinde angemeldet; das Finanzamt schickt danach den Fragebogen zur steuerlichen Erfassung, in dem die Kleinunternehmerregelung nach § 19 UStG gewählt werden kann. Sie gilt, solange der Umsatz im laufenden Jahr 100.000 Euro nicht übersteigt. Wird die Grenze im Jahr überschritten, endet die Regelung ab diesem Umsatz – dann ist Umsatzsteuer auszuweisen, und die Preisangaben auf der Seite müssen mit.':
      'A small business is registered with the trade office of the municipality where you live; the tax office then sends the questionnaire for tax registration, in which the small-business rule under § 19 UStG can be chosen. It applies as long as turnover in the current year does not exceed 100,000 euros. If the threshold is exceeded during the year, the rule ends from that turnover onwards – VAT then has to be shown, and the prices on the site have to follow.',
    'Was hier steht, ist mit Sorgfalt und nach den geltenden Vorschriften geschrieben, aber es ist keine Rechtsberatung und ersetzt sie nicht. Vor dem ersten echten Nutzer sollte jemand mit Zulassung darüber gesehen haben – vor allem AGB, Haftung und die Frage nach § 34c GewO.':
      'What is written here is drafted with care and in line with the applicable rules, but it is not legal advice and does not replace it. Before the first real user, someone qualified should have looked over it – the terms, the liability provisions and the § 34c GewO question above all.',
    'Ein Impressum ohne ladungsfähige Anschrift oder ohne schnelle Kontaktmöglichkeit erfüllt die Pflicht aus § 5 DDG nicht – und das ist abmahnbar. Die Lücken sind in allen Dokumenten sichtbar markiert.':
      'A legal notice without a serviceable address or a rapid means of contact does not meet the obligation under § 5 DDG – and that can attract a formal warning. The gaps are visibly marked in every document.'
  });

  e({
    'WG': 'Share',
    'Noch {0} Angabe fehlt': '{0} detail is still missing',
    'Anschrift wie oben': 'address as above',
    'Objekte stehen auf „gemerkt“.': 'listings are marked “saved”.',
    'seit {0}': 'since {0}',
    'Die Vertrauensstufe zählt vor allem, wenn du selbst inserierst – andere sehen sie an deinem Angebot.':
      'The trust level counts above all when you advertise yourself – others see it on your offer.'
  });

  e({
    'Angemeldet als': 'Signed in as',
    'Profil ausfüllen': 'Fill in your profile',
    'Eigene Angaben ändern': 'Change your own details',
    'WG-Passung {0} % – {1}': 'Flatshare match {0} % – {1}',
    'passt sehr gut': 'a very good fit', 'passt gut': 'a good fit',
    'passt eher nicht': 'probably not a fit', 'passt kaum': 'barely a fit',
    'Abrechnung {0}.': 'Billed {0}.',
    'jährlich': 'yearly', 'monatlich': 'monthly',
    'Über deine Bewerbung weiß TrimmoTrade noch nichts – ohne Einkommen und Unterlagen im Profil lässt sich nichts einschätzen. Was feststeht:':
      'TrimmoTrade knows nothing about your application yet – without income and documents in your profile there is nothing to assess. What is certain:',
    'Bisher hat sich niemand sonst gemeldet.': 'Nobody else has been in touch so far.',
    'Bisher hat sich eine weitere Person gemeldet.': 'One other person has been in touch so far.',
    'Es haben sich bereits {0} andere gemeldet.': '{0} others have already been in touch.',
    'Serienbewerbung': 'Batch application',
    'Anschreiben vorbereiten': 'Prepare covering letters'
  });

  e({
    'Platz frei.': 'place free.', 'Plätze frei.': 'places free.',
    'Kein Abo, keine Zahlungsdaten, keine Verlängerung – nach zwölf Monaten endet der Platz von selbst.':
      'No subscription, no payment details, no renewal – after twelve months the place ends by itself.',
    'Läuft seit {0},': 'Running since {0},',
    'kurzem': 'recently',
    'Vertrag': 'Contract', 'Umzug': 'Move', 'Ämter': 'Authorities', 'Danach': 'Afterwards',
    'Ein Impressum ohne ladungsfähige Anschrift oder ohne schnelle Kontaktmöglichkeit erfüllt die Pflicht aus § 5 DDG nicht – und das ist abmahnbar. Die Lücken sind in allen Dokumenten sichtbar markiert, damit sie nicht untergehen.':
      'A legal notice without a serviceable address or a rapid means of contact does not meet the obligation under § 5 DDG – and that can attract a formal warning. The gaps are visibly marked in every document so they do not get lost.'
  });

  e({
    /* Kurze Beschriftungen ohne eindeutige deutsche Marker – die findet
       kein Prüfer über Wortlisten, nur das Auge. */
    'Mieten': 'Rent', 'Kaufen': 'Buy', 'Tauschen': 'Swap',
    'neu': 'new', 'geprüft': 'verified',
    '{0} Zi.': '{0} rm', 'ab {0}': 'from {0}', 'ab {0} Zi.': 'from {0} rm',
    '({0} €/m² kalt)': '({0} €/m² base rent)',
    'Interessent': 'interested party', 'Interessenten': 'interested parties',
    'Treffer zeigen': 'show results',
    'Umkreis': 'Radius', 'Städte': 'Cities', 'Viertel wählen': 'Choose neighbourhoods'
  });

  e({
    'Plus entdecken': 'Discover Plus',
    'Leg ein': 'Create a',
    'an, dann füllt TrimmoTrade diese Filter von selbst – und du musst nichts zweimal eintippen.':
      'and TrimmoTrade fills these filters in by itself – so you do not have to type anything twice.',
    'Weicht ab:': 'Differs:',
    'Gemessen ab {0} mit {1}.': 'Measured from {0} by {1}.',

    /* ---------------------------------------------------------------
       Anmeldung mit Serverseite, Datenschutzerklärung dazu
       --------------------------------------------------------------- */

    'Beispielanfragen dieser Vorführung. Es hat niemand wirklich geschrieben – die Namen und Texte entstehen aus der Kennung des Inserats und bleiben deshalb gleich.':
      'Sample enquiries for this demonstration. Nobody actually wrote them – the names and texts are derived from the listing’s identifier and therefore stay the same.',
    'TrimmoTrade sortiert und rechnet ausschließlich mit diesen Angaben. Sie liegen im Speicher dieses Browsers und werden nirgendwohin übertragen.':
      'TrimmoTrade sorts and calculates using these details only. They live in this browser’s storage and are not transmitted anywhere.',
    'Die Bilder werden beim Ablegen auf {4} Pixel Kantenlänge verkleinert und bleiben im Speicher dieses Geräts. Übertragen wird keines davon.':
      'On upload the images are reduced to {4} pixels along the longer edge and stay in this device’s storage. None of them is transmitted.',
    'Niemand kennt es außer dir – auch der Server nicht, der die Anmeldung erledigt; der sieht weder deine Unterlagen noch dieses Kennwort. Eine Wiederherstellung per E-Mail gibt es deshalb nicht, und genau das ist der Punkt: Wer den Speicher dieses Geräts in die Hände bekommt, kommt ohne das Kennwort nicht an deine Unterlagen. Vergisst du es, sind sie auch für dich verloren – dann bleibt nur, den Tresor zu leeren und neu zu füllen.':
      'Nobody knows it but you – not even the server that handles sign-in; it sees neither your documents nor this password. That is why there is no recovery by email, and that is exactly the point: anyone who gets hold of this device’s storage cannot reach your documents without the password. If you forget it, they are lost to you as well – then all that remains is to empty the vault and fill it afresh.',
    'Die Plätze werden hier nicht zentral gezählt: Der Zähler oben ist eine Hochrechnung aus der Zeit seit dem Start, keine Messung. Sobald die Vergabe wirklich läuft, bekommt jede Nummer genau einen Platz.':
      'The places are not counted centrally here: the figure above is an extrapolation from the time since launch, not a measurement. Once places are really being issued, each number gets exactly one.',
    'Nein. Welche Anzeige erscheint, entscheidet sich im Browser anhand der Stelle auf der Seite – nicht anhand deines Profils, deiner Suche oder deines Verhaltens. Es gibt kein Werbenetzwerk, keine Kennung und nichts, was übertragen würde.':
      'No. Which advert appears is decided in the browser from its position on the page – not from your profile, your search or your behaviour. There is no ad network, no identifier and nothing that would be transmitted.',
    'Passkey auf diesem Gerät oder ein bestätigtes Konto bei Google oder Microsoft. Massenhaftes Anlegen wird damit deutlich mühsamer.':
      'A passkey on this device or a verified account with Google or Microsoft. Creating accounts in bulk becomes considerably more laborious.',
    '„Konto löschen“ entfernt diese Angaben vollständig{28}. Merkliste, Profil und Notizen bleiben erhalten; beides zusammen löschst du über':
      '“Delete account” removes these details completely{27}. Shortlist, profile and notes remain; you delete both together under',

    /* Kontoseite mit Server */
    'Auf allen Geräten abmelden': 'Sign out on all devices',
    'Auf allen Geräten abmelden? Du musst dich danach überall neu anmelden.':
      'Sign out on all devices? You will have to sign in again everywhere afterwards.',
    'Überall abgemeldet.': 'Signed out everywhere.',
    'Weiteres Gerät hinterlegen': 'Add another device',
    'Damit du dich auch von deinem anderen Gerät anmelden kannst':
      'So you can sign in from your other device too',
    'Passkeys': 'Passkeys',
    'entfernen': 'remove',
    'Geräte': 'devices',
    'Dein Passkey': 'Your passkey',
    'Deine Passkeys': 'Your passkeys',
    'hinterlegt am': 'registered on',
    'Diesen Passkey entfernen? Von diesem Gerät kannst du dich danach nicht mehr damit anmelden.':
      'Remove this passkey? You will no longer be able to sign in with it from this device.',
    'Passkey entfernt.': 'Passkey removed.',
    'noch nicht bestätigt': 'not yet verified',
    'Die Stufen 3 und 4 brauchen einen Prüfdienst – einen SMS-Versender für die Nummer, POSTIDENT oder eID für den Ausweis. Beides ist auf diesem Server noch nicht eingerichtet, deshalb steht hier kein Knopf, der nichts täte.':
      'Levels 3 and 4 need a verification service – an SMS sender for the number, POSTIDENT or eID for the identity document. Neither is set up on this server yet, which is why there is no button here that would do nothing.',
    'Auf dem Server: E-Mail-Adresse, Name, das gewählte Verfahren, die Vertrauensstufe und der öffentliche Teil deiner Passkeys. Sonst nichts – keine Inserate, keine Merkliste, keine Nachrichten, kein Profil. Das alles bleibt im Speicher dieses Browsers.':
      'On the server: email address, name, the chosen method, the trust level and the public part of your passkeys. Nothing else – no listings, no shortlist, no messages, no profile. All of that stays in this browser’s storage.',
    'Der private Teil des Passkeys bleibt im Sicherheitschip deines Geräts und ist weder von hier noch vom Server aus lesbar.':
      'The private part of the passkey stays in your device’s secure chip and is readable neither from here nor from the server.',
    ' – auch auf dem Server': ' – on the server as well',
    'Gerät': 'device',

    /* Anmeldeseite mit Server */
    'einen Moment …': 'one moment …',
    'Code wird verschickt …': 'sending code …',
    'wird geprüft …': 'checking …',
    'Nichts angekommen? Schau in den Spam-Ordner. Die Mail kommt von': 'Nothing arrived? Check the spam folder. The mail comes from',
    'Diese Kopie läuft ohne Server, also gibt es niemanden, der eine Mail verschicken könnte. Auf':
      'This copy runs without a server, so there is nobody who could send an email. On',
    'steht hier nichts – der Code kommt dann in dein Postfach.':
      'nothing appears here – the code then arrives in your inbox.',
    'Diese Kopie läuft ohne Server. Das echte Verfahren braucht zwingend eine Serverseite, die das Geheimnis hält und das zurückgegebene Token prüft; ein reiner Browser kann das nicht. Was du gleich siehst, entspricht dem Ablauf – die Bestätigung kommt aber nicht von {0}.':
      'This copy runs without a server. The real procedure strictly requires a server side that holds the secret and verifies the returned token; a browser alone cannot do that. What you are about to see matches the flow – but the confirmation does not come from {0}.',
    'Diese Kopie läuft ohne Server, also kann niemand eine SMS verschicken. Im Betrieb käme jetzt ein Code auf das Telefon – über einen Versanddienst, der pro Nachricht abrechnet.':
      'This copy runs without a server, so nobody can send a text message. In production a code would now arrive on the phone – via a sending service that charges per message.',
    'Noch kein Passkey auf diesem Gerät?': 'No passkey on this device yet?',
    'Jetzt einen anlegen und damit ein Konto eröffnen': 'Create one now and open an account with it',
    'Konto mit Passkey anlegen': 'Create an account with a passkey',
    'Dein Gerät erzeugt gleich einen Schlüssel, der nur für trimmotrade.de gilt und den Sicherheitschip nie verlässt. Eine E-Mail-Adresse brauchst du dafür nicht – die kannst du später auf der Kontoseite nachtragen.':
      'Your device is about to create a key that is valid only for trimmotrade.de and never leaves the secure chip. You do not need an email address for it – you can add one later on the account page.',
    'Passkey anlegen': 'Create passkey',
    'Du wirst gleich zu {0} weitergeleitet und kommst danach hierher zurück.':
      'You will now be forwarded to {0} and will come back here afterwards.',
    'Weiter': 'Continue',
    'Neuer Code verschickt.': 'New code sent.',
    'Die Anmeldung wurde abgebrochen. Es ist nichts passiert.': 'The sign-in was cancelled. Nothing happened.',
    'Der Anbieter hat die Anmeldung nicht abgeschlossen. Versuch es noch einmal oder nimm ein anderes Verfahren.':
      'The provider did not complete the sign-in. Try again or use a different method.',
    'Dieses Verfahren ist auf diesem Server nicht eingerichtet.': 'This method is not set up on this server.',
    'Geht nur im Web – ein Passkey braucht eine Domain, eine Datei auf der Platte hat keine':
      'Only works on the web – a passkey needs a domain, and a file on disk has none',
    'Ein Passkey ist an eine Domain gebunden. Diese Kopie läuft als Datei auf der Platte und hat keine – öffne die Anwendung unter trimmotrade.de, dann geht es.':
      'A passkey is bound to a domain. This copy runs as a file on disk and has none – open the application at trimmotrade.de and it will work.',
    'Auf diesem Gerät liegt schon ein Passkey für dieses Konto.': 'This device already holds a passkey for this account.',
    'Der Vorgang wurde abgebrochen.': 'The operation was cancelled.',
    'Der Server ist gerade nicht erreichbar. Versuch es gleich noch einmal.':
      'The server cannot be reached right now. Try again in a moment.',
    'Bei Google und Microsoft bekommt TrimmoTrade Name und E-Mail-Adresse, dein Passwort dort aber nie zu sehen. Beim Weg über die E-Mail-Adresse gibt es gar kein Passwort, sondern einen Code, der zehn Minuten gilt.':
      'With Google and Microsoft, TrimmoTrade gets your name and email address but never sees your password there. The email route has no password at all, only a code valid for ten minutes.',
    'Über einen der Wege auf der Startseite: {0} (Face ID, Windows Hello oder Fingerabdruck), Google, Microsoft – oder mit deiner E-Mail-Adresse und einem Einmalcode.':
      'Through one of the routes on the start page: {0} (Face ID, Windows Hello or a fingerprint), Google, Microsoft – or with your email address and a one-time code.',

    /* Meine Daten */
    'Alles, was du hier eingibst, liegt im Speicher dieses Browsers – Merkliste, Suchaufträge, Nachrichten, eigene Inserate, Profil und Notizen. Nichts davon geht an einen Server, nichts an Dritte. Übertragen wird allein die Anmeldung; was dabei gespeichert wird, steht in der':
      'Everything you enter here lives in this browser’s storage – shortlist, saved searches, messages, your own listings, profile and notes. None of it goes to a server, none to third parties. Only the sign-in is transmitted; what is stored in the process is set out in the',
    'TrimmoTrade verschickt die Nachricht nicht selbst, sondern übergibt sie dem E-Mail-Programm dieses Geräts – dort kannst du sie vor dem Senden noch ändern. Wo kein Programm eingerichtet ist, kopier den Text oder sichere ihn als Datei.':
      'TrimmoTrade does not send the message itself but hands it to this device’s email program – there you can still change it before sending. Where no program is set up, copy the text or save it as a file.',

    /* Datenschutzerklärung: Abschnitt zur Serverseite */
    'TrimmoTrade rechnet im Browser. Suche, Bewertung, Karte, Ringtausch, Merkliste, Nachrichten, eigene Inserate und Profil entstehen auf deinem Gerät und bleiben dort. Sie werden nicht an den Anbieter übertragen und nicht an Dritte weitergegeben.':
      'TrimmoTrade computes in the browser. Search, assessment, map, ring swap, shortlist, messages, your own listings and profile arise on your device and stay there. They are not transmitted to the provider and not passed on to third parties.',
    'Zum Server geht genau eine Sache: die': 'Exactly one thing goes to the server: the',
    '. Er beantwortet die Frage, wer du bist – mehr kennt er nicht. Was dort gespeichert wird, steht vollständig in Abschnitt 4; es ist eine kurze Liste, und sie enthält nichts von dem, was du in der Anwendung eingibst.':
      '. It answers the question of who you are – it knows nothing more. What is stored there is set out in full in section 4; it is a short list, and it contains nothing of what you enter in the application.',
    'eine zufällige Kontonummer, die nichts über dich verrät': 'a random account number that reveals nothing about you',
    'deine E-Mail-Adresse, sofern du eine angegeben hast, und ob sie bestätigt ist':
      'your email address, if you gave one, and whether it is verified',
    'ein Name, wenn du einen angibst – freiwillig': 'a name, if you give one – voluntary',
    'das gewählte Anmeldeverfahren und die Vertrauensstufe': 'the chosen sign-in method and the trust level',
    'der öffentliche Teil deiner Passkeys nebst Gerätebezeichnung':
      'the public part of your passkeys together with the device designation',
    'bei Anmeldung über Google oder Microsoft deren unveränderliche Kontokennung':
      'when signing in via Google or Microsoft, their immutable account identifier',
    'deine offenen Sitzungen: Zeitpunkt, IP-Adresse und Browserangabe des Geräts, damit du sie beenden kannst':
      'your open sessions: time, IP address and browser designation of the device, so that you can end them',
    'Nicht auf dem Server liegen:': 'Not held on the server:',
    'Inserate, Merkliste, Suchaufträge, Nachrichten, Notizen, Profil, Bilder und der Dokumententresor. Diese Daten verlassen deinen Browser nicht.':
      'listings, shortlist, saved searches, messages, notes, profile, images and the document vault. These data do not leave your browser.',
    'bis zur Löschung des Kontos; sie ist jederzeit ohne Angabe von Gründen möglich und wirkt sofort. Sitzungen enden spätestens nach dreißig Tagen ohne Nutzung, Anmeldecodes nach {13} Minuten.':
      'until the account is deleted; that is possible at any time without giving reasons and takes effect immediately. Sessions end after thirty days without use at the latest, sign-in codes after {13} minutes.',
    'Cookies der Anmeldung': 'Cookies used for signing in',
    'Für die Anmeldung werden zwei Cookies gesetzt. Das eine hält die Sitzung offen und ist für Skripte nicht lesbar; das andere schützt vor Anfragen, die dir eine fremde Seite unterschiebt. Beide sind für den von dir gewünschten Dienst unbedingt erforderlich, weshalb dafür keine Einwilligung nötig ist (§ 25 Abs. 2 Nr. 2 TDDDG). Cookies zu Werbe- oder Analysezwecken werden nicht gesetzt – es gibt keine.':
      'Two cookies are set for signing in. One keeps the session open and is not readable by scripts; the other protects against requests slipped to you by an external page. Both are strictly necessary for the service you requested, which is why no consent is required for them (§ 25(2) no. 2 TDDDG). No cookies for advertising or analytics are set – there are none.',
    'Anmeldung über Google oder Microsoft': 'Signing in via Google or Microsoft',
    'Verantwortlich für die Verarbeitung auf ihrer Seite sind die Anbieter selbst: Google Ireland Limited und Microsoft Ireland Operations Limited, beide mit Sitz in Irland. Soweit dabei Daten in die Vereinigten Staaten übermittelt werden, stützt sich das auf den Angemessenheitsbeschluss der Europäischen Kommission zum EU-US Data Privacy Framework; beide Anbieter sind darunter zertifiziert.':
      'Responsible for the processing on their side are the providers themselves: Google Ireland Limited and Microsoft Ireland Operations Limited, both based in Ireland. Insofar as data are transferred to the United States in the process, this relies on the European Commission’s adequacy decision on the EU-US Data Privacy Framework; both providers are certified under it.',
    'Beim Passkey entsteht das Schlüsselpaar im Sicherheitsbaustein deines Geräts. Der private Schlüssel verlässt das Gerät nicht und ist für TrimmoTrade nicht lesbar; auf dem Server liegt nur der öffentliche Teil, mit dem sich Signaturen prüfen, aber keine erzeugen lassen. Biometrische Merkmale – Gesicht, Fingerabdruck – werden weder übertragen noch verarbeitet: Sie entsperren ausschließlich lokal das Gerät (Art. 9 DSGVO ist damit nicht berührt).':
      'With a passkey the key pair arises in your device’s security element. The private key does not leave the device and is not readable by TrimmoTrade; only the public part is held on the server, with which signatures can be verified but none created. Biometric features – face, fingerprint – are neither transmitted nor processed: they unlock the device locally and nothing else (Art. 9 GDPR is therefore not engaged).',
    'Bestätigung der Adresse': 'Verification of the address',
    'Der Einmalcode dient allein der Bestätigung, dass du die angegebene Adresse abrufen kannst. Er gilt {14} Minuten, wird nur als Hashwert gespeichert und nach Ablauf, nach {15} Fehlversuchen oder nach erfolgreicher Anmeldung gelöscht. Die Zustellung erfolgt über das Postfach des Anbieters bei seinem Hostinganbieter; ein weiterer Versanddienst ist nicht beteiligt.':
      'The one-time code serves solely to confirm that you can access the address given. It is valid for {14} minutes, is stored only as a hash value and is deleted on expiry, after {15} failed attempts or after a successful sign-in. Delivery goes through the provider’s mailbox at its hosting provider; no further sending service is involved.',
    'Abwehr von Angriffen auf die Anmeldung': 'Defence against attacks on the sign-in',
    'Um das Durchprobieren von Codes zu verhindern, wird für kurze Zeit festgehalten, wie viele Anmeldeversuche von einer IP-Adresse und zu einer Adresse ausgingen. Diese Zähler werden nach spätestens 24 Stunden gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO – ohne diese Maßnahme wäre ein sechsstelliger Code in kurzer Zeit zu erraten.':
      'To prevent codes being tried out one after another, a record is kept for a short time of how many sign-in attempts came from an IP address and were made for an address. These counters are deleted after 24 hours at the latest. The legal basis is Art. 6(1)(f) GDPR – without this measure a six-digit code could be guessed in short order.',
    'Für den Zugriff auf diesen Speicher ist keine Einwilligung erforderlich: Er ist unbedingt erforderlich, damit der von dir ausdrücklich gewünschte Dienst überhaupt funktioniert (§ 25 Abs. 2 Nr. 2 des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes).':
      'No consent is required for access to this storage: it is strictly necessary for the service you expressly requested to work at all (§ 25(2) no. 2 of the Telecommunications Digital Services Data Protection Act).',
    'Auch die verschlüsselten Dateien liegen ausschließlich in deinem Browser. Der Server der Anmeldung sieht sie nie – er kennt weder Dateien noch Kennwort noch Schlüssel.':
      'The encrypted files, too, live solely in your browser. The sign-in server never sees them – it knows neither files nor password nor key.',
    'Über die in Abschnitt 4 beschriebene Anmeldung bei Google oder Microsoft hinaus findet keine Übermittlung personenbezogener Daten in Länder außerhalb der Europäischen Union und des Europäischen Wirtschaftsraums statt. Wer das vermeiden möchte, meldet sich mit Passkey oder mit E-Mail-Adresse an – beide Wege kommen ohne fremden Anbieter aus.':
      'Beyond the sign-in via Google or Microsoft described in section 4, no personal data are transferred to countries outside the European Union and the European Economic Area. Anyone wishing to avoid that signs in with a passkey or with an email address – both routes work without an external provider.',

    /* ---------------------------------------------------------------
       Ohne Anmeldung stöbern
       --------------------------------------------------------------- */

    'Dafür brauchst du ein Konto': 'You need an account for that',
    'gehört zu deinem Konto – dabei entsteht etwas, das dir gehört und das du wiederfinden willst.':
      'belongs to your account – it creates something that is yours and that you will want to find again.',
    'Diese Funktion': 'This feature',
    'Ansehen kannst du weiterhin alles ohne Anmeldung:': 'You can still look at everything without signing in:',
    'die Suche, jedes Inserat, die Vergleichsmiete, den Prüfhinweis und die echten Monatskosten.':
      'the search, every listing, the comparable rent, the fraud warning and the true monthly costs.',
    'Ein Konto dauert eine halbe Minute': 'An account takes half a minute',
    'Mit einem Passkey ganz ohne Eingabe – Face ID, Windows Hello oder Fingerabdruck. Ein Passwort gibt es hier nicht.':
      'With a passkey, without typing anything – Face ID, Windows Hello or a fingerprint. There is no password here.',
    'Weiter stöbern': 'Keep browsing',
    'Konto anlegen': 'Create an account',

    /* Wofür genau ein Konto nötig ist */
    'Inserate merken': 'Saving listings',
    'Inserate vergleichen': 'Comparing listings',
    'Eine Anfrage schreiben': 'Writing an enquiry',
    'Suchaufträge speichern': 'Saving searches',
    'Filter aus deinem Profil füllen': 'Filling the filters from your profile',
    'Einen Umkreis um deinen Ankerpunkt setzen': 'Setting a radius around your anchor point',
    'Notizen zu einem Inserat': 'Notes on a listing',
    'Den Stand deiner Bewerbung festhalten': 'Recording where your application stands',
    'Die Besichtigungs-Checkliste': 'The viewing checklist',
    'Einen Besichtigungstermin buchen': 'Booking a viewing appointment',
    'Einen Besichtigungstermin absagen': 'Cancelling a viewing appointment',
    'Das Exposé als Datei': 'The listing details as a file',
    'Die Kostenrechnung auf deinen Haushalt einstellen': 'Adjusting the cost calculation to your household',
    'Werte in dein Profil übernehmen': 'Copying values into your profile',

    /* Anmeldeseite und Schaufenster */
    'Erst einmal umsehen – Angebote ohne Anmeldung ansehen':
      'Have a look around first – browse listings without signing in',
    'TrimmoTrade, zur Suche': 'TrimmoTrade, to the search',

    /* Statt der Passung */
    'Passt das zu dir?': 'Does this suit you?',
    'Mit einem Konto rechnet TrimmoTrade für jedes Inserat aus, wie gut es zu deinen Angaben passt – Preis, Größe, Lage, Fahrzeit zur Arbeit, Ausstattung – und sortiert die Suche danach. Nach deinem Profil, nicht nach bezahlter Platzierung.':
      'With an account, TrimmoTrade works out for every listing how well it matches what you said you need – price, size, location, commute, features – and orders the search by that. By your profile, not by paid placement.',
    'Ansehen kannst du ohne Anmeldung alles auf dieser Seite.':
      'Everything on this page is visible without signing in.',
    'Suchen und ansehen geht ohne Anmeldung. Mit einem Profil füllt TrimmoTrade diese Filter von selbst und rechnet Passung und Fahrzeit aus.':
      'Searching and browsing work without signing in. With a profile, TrimmoTrade fills these filters in by itself and works out match and commute.',
    'Wie gut ihr zusammenpasst, rechnet TrimmoTrade aus, sobald ein paar Angaben zu dir vorliegen.':
      'TrimmoTrade works out how well you fit together as soon as it knows a few things about you.',
    'Die Fahrzeiten stehen hier, sobald eine Arbeits- oder Studienadresse im Profil hinterlegt ist.':
      'Travel times appear here as soon as a work or study address is stored in the profile.',
    'Für dieses Angebot gibt es aktuell keine geschlossene Kette. Mit einem eigenen Angebot schließt du sie vielleicht.':
      'There is currently no closed chain for this offer. With an offer of your own you might close it.',

    /* Lücken, die erst im Gastzustand sichtbar wurden */
    'Weiter mit Google': 'Continue with Google',
    'Weiter mit Microsoft': 'Continue with Microsoft',
    'Google-Konto': 'Google account',
    'Privat oder geschäftlich': 'Personal or work',
    'Alle Ketten im Ringtausch ansehen': 'See all chains in the ring swap',
    'passende {1} im Bestand': 'matching {1} in the market',
    'Internet an der neuen Adresse prüfen': 'Check internet availability at the new address',
    'Verfügbarkeit und Schaltdauer vor dem Einzug klären.':
      'Clarify availability and activation time before moving in.',
    'Face ID, Windows Hello oder Fingerabdruck': 'Face ID, Windows Hello or a fingerprint',
    'Helles Zimmer in entspannter WG.': 'Bright room in a relaxed flatshare.',
    'Freies Zimmer in gewachsener Wohngemeinschaft.': 'Room available in an established flatshare.',
    'Schönes, ruhiges Zimmer mit eigenem Balkonzugang.': 'Attractive, quiet room with its own balcony access.',
    '(1) Suche und Inserate lassen sich ohne Anmeldung ansehen. Ein Konto braucht, wer Inserate merken oder vergleichen, Anbieter anschreiben, Suchaufträge anlegen, Unterlagen ablegen oder selbst inserieren will. Die Anmeldung ist möglich mit einem Passkey, über ein Konto bei Google oder Microsoft oder mit einer E-Mail-Adresse und einem Einmalcode. Mit der Anmeldung kommt ein unentgeltlicher Nutzungsvertrag über den freien Tarif zustande; ohne Anmeldung entsteht kein Vertragsverhältnis.':
      '(1) The search and the listings can be viewed without signing in. An account is needed to save or compare listings, to contact providers, to create saved searches, to store documents or to advertise. Signing in is possible with a passkey, via an account with Google or Microsoft, or with an email address and a one-time code. Signing in forms a free-of-charge usage contract covering the free tier; without signing in no contractual relationship arises.',
    'Suche und Inserate lassen sich ohne Anmeldung ansehen; dabei entsteht kein Konto und wird nichts über dich gespeichert. Wer ein Konto anlegt, wird auf der Serverseite geführt – und die gibt es für nichts anderes. Gespeichert wird dort genau Folgendes:':
      'The search and the listings can be viewed without signing in; no account is created and nothing about you is stored in the process. Anyone who creates an account is held on the server side – and that exists for nothing else. Exactly the following is stored there:',
    'Ohne Anmeldung geht auch das nicht: Suche und Inserate lassen sich ansehen, ohne dass ein Konto entsteht.':
      'Without signing in, not even that happens: the search and the listings can be viewed without an account coming into being.',
    /* Kündigungsfrist nach § 573c BGB */
    'Um das alte Mietverhältnis zum {1} zu beenden, muss die Kündigung spätestens am {2} beim Vermieter sein: bis zum dritten Werktag eines Monats, dann endet das Mietverhältnis mit Ablauf des übernächsten Monats (§ 573c Abs. 1 BGB).':
      'To end the old tenancy on {1}, the notice must reach the landlord by {2} at the latest: by the third working day of a month, the tenancy then ends at the close of the month after next (§ 573c(1) BGB).',
    'Feiertage sind dabei nicht berücksichtigt – sie sind je Bundesland verschieden. Gib die Kündigung ein paar Tage früher ab und lass dir den Zugang bestätigen: Es zählt der Zugang, nicht das Absendedatum.':
      'Public holidays are not taken into account – they differ from state to state. Hand in the notice a few days earlier and get receipt confirmed: what counts is arrival, not the date you sent it.',

  });


  /* -------------------------------------------------------------------
     Der echte Markt

     Ab hier geht es um Inserate, die es wirklich gibt, um Anfragen, die
     wirklich ankommen, und um den Hinweis, dass daneben Beispiele
     stehen. Gerade dieser Hinweis muss auf Englisch genauso deutlich
     sein wie auf Deutsch: Eine abgeschwächte Übersetzung wäre eine
     andere Aussage.
     ------------------------------------------------------------------- */
  e({
    /* Bestand und Beispiele */
    'Beispiel': 'Example',
    'Diese Wohnungen sind Beispiele': 'These flats are examples',
    '{0} echte Inserate – der Rest sind Beispiele': '{0} real listings – the rest are examples',
    'TrimmoTrade zeigt einen erzeugten Beispielmarkt, solange noch wenige echte Inserate da sind. Jedes Beispiel trägt oben links das Wort':
      'TrimmoTrade shows a generated example market while there are still few real listings. Every example is labelled',
    '. Dahinter steht niemand: Eine Anfrage erreicht keinen Menschen, und die Preise sind gerechnet, nicht verlangt.':
      ' in the top left corner. There is nobody behind them: an enquiry reaches no one, and the prices are calculated, not asked for.',
    'Echte Inserate sind daran zu erkennen, dass die Marke fehlt.':
      'Real listings are the ones without that label.',
    'Selbst inserieren': 'Post your own listing',
    ' dauert zwei Minuten und ist kostenlos.': ' takes two minutes and is free.',
    'Der Bestand ließ sich gerade nicht laden.': 'The listings could not be loaded just now.',
    ' Was du hier siehst, sind Beispiele.': ' What you see here are examples.',
    'Der Bestand ließ sich nicht laden.': 'The listings could not be loaded.',

    /* Fußzeile */
    'Alle Inserate stammen von den Menschen, die sie eingestellt haben.':
      'Every listing comes from the person who posted it.',
    'Neben {0} echten Inseraten läuft ein erzeugter Beispielbestand mit; jedes Beispiel ist als solches markiert.':
      'Alongside {0} real listings a generated example set is running; every example is labelled as one.',
    'Erzeugter Beispielbestand: Anbieter und Adressen sind erfunden.':
      'Generated example listings: advertisers and addresses are invented.',
    'Rechtliche Erläuterungen sind allgemeine Hinweise und ersetzen keine Beratung. Merkliste, Profil und Unterlagen bleiben im Browser dieses Geräts.':
      'Legal notes are general information and no substitute for advice. Shortlist, profile and documents stay in this device’s browser.',
    'Wohnung vermieten': 'Letting a flat',
    'Nachmieter finden': 'Finding a successor tenant',
    'Nebenkosten prüfen': 'Check service charges',
    'Verkauf vorbereiten': 'Preparing a sale',

    /* Anschreiben mit Eckdaten */
    'Diese Eckdaten gehen mit': 'These key facts go along',
    'Mitschicken': 'Send along',
    'Mehr als das geht nie hinaus. Das Einkommen als Spanne, nie auf den Euro – und nichts, wonach niemand fragen darf: keine Herkunft, keine Religion, keine Gesundheit, keine Familienplanung (Art. 9 DSGVO, § 19 AGG).':
      'Nothing beyond this ever leaves. Income as a range, never to the euro – and nothing nobody may ask about: no origin, no religion, no health, no family planning (Art. 9 GDPR, § 19 AGG).',
    'Dein Profil ist noch leer': 'Your profile is still empty',
    'Haushaltsgröße, Einzugstermin und Beschäftigung sind die drei Angaben, nach denen sonst zurückgefragt wird.':
      'Household size, move-in date and employment are the three things people otherwise ask back about.',
    'Im Profil ergänzen': 'Add them in your profile',
    ' – dann stehen sie beim nächsten Mal von selbst dabei.': ' – then they are there by themselves next time.',
    'Haushalt': 'Household', 'Einzug ab': 'Moving in from', 'Beschäftigung': 'Employment',
    'Einkommen': 'Income', 'Rauchen': 'Smoking', 'Wohnberechtigungsschein': 'WBS certificate',
    'Bürgschaft': 'Guarantor',
    '1 Person': '1 person', 'Personen': 'people', 'bis': 'to', 'keine': 'none',
    'ja': 'yes', 'nein': 'no', 'liegt vor': 'available', 'möglich': 'possible',
    'Wird gesendet …': 'Sending …',
    'Anfrage abgeschickt. Die anbietende Seite bekommt eine Mail.':
      'Enquiry sent. The advertiser receives an email.',
    'Das ist ein Beispielinserat – die Nachricht bleibt bei dir.':
      'This is an example listing – the message stays with you.',
    'Die Anfrage ging nicht hinaus.': 'The enquiry did not go out.',

    /* Melden nach Art. 16 DSA */
    'Inserat melden': 'Report listing',
    'Melden': 'Report',
    'Sag uns in einem Satz, was nicht stimmt. Wir sehen es uns an und antworten mit einer Entscheidung und ihrer Begründung.':
      'Tell us in one sentence what is wrong. We will look into it and reply with a decision and its reasons.',
    'Was ist los?': 'What is wrong?',
    'Zum Beispiel: Der Anbieter verlangt die Kaution vorab per Überweisung, eine Besichtigung sei nicht möglich.':
      'For example: the advertiser wants the deposit up front by bank transfer and says a viewing is not possible.',
    'Deine E-Mail-Adresse (freiwillig)': 'Your email address (optional)',
    'damit du die Antwort bekommst': 'so that you get the answer',
    'Melden geht ohne Konto – so verlangt es Art. 16 Abs. 1 der Verordnung (EU) 2022/2065. Ohne Adresse können wir dir allerdings nicht sagen, was daraus wurde.':
      'Reporting works without an account – Art. 16(1) of Regulation (EU) 2022/2065 requires that. Without an address, though, we cannot tell you what came of it.',
    'Betrugsverdacht – Vorkasse, kein Besichtigungstermin': 'Suspected fraud – payment up front, no viewing',
    'Wohnung ist längst vergeben': 'The flat has long been taken',
    'Falsche Angaben zu Preis, Fläche oder Lage': 'Wrong details on price, size or location',
    'Dasselbe Objekt steht mehrfach hier': 'The same property is listed more than once',
    'Diskriminierende Formulierung (§ 19 AGG)': 'Discriminatory wording (§ 19 AGG)',
    'Fremde Bilder oder Texte': 'Someone else’s images or text',
    'Etwas anderes': 'Something else',
    'Wird gemeldet …': 'Reporting …',
    'Beschreib in einem Satz, was nicht stimmt.': 'Describe in one sentence what is wrong.',
    'Das ist ein Beispielinserat – dahinter steht niemand, den man melden könnte.':
      'This is an example listing – there is nobody behind it to report.',
    'Die Meldung ging nicht hinaus.': 'The report did not go out.',

    /* Inserieren */
    'Vermieten, verkaufen, ein Zimmer anbieten oder tauschen – ein Formular für alles. Das Inserat wird veröffentlicht: Es steht danach in der Suche aller, in der Karte und im Ringtausch.':
      'Let, sell, offer a room or swap – one form for everything. The listing is published: it then appears in everybody’s search, on the map and in the swap ring.',
    'Vermieten, verkaufen, ein Zimmer anbieten oder tauschen – ein Formular für alles. Ohne Verbindung bleibt das Inserat auf diesem Gerät und taucht nur in deiner eigenen Suche auf.':
      'Let, sell, offer a room or swap – one form for everything. Without a connection the listing stays on this device and only appears in your own search.',
    'Dieses Inserat sieht sonst niemand': 'Nobody else sees this listing',
    'Zum Veröffentlichen brauchst du ein Konto.': 'You need an account to publish.',
    ' dauert eine halbe Minute – der Entwurf bleibt dabei stehen.':
      ' takes half a minute – your draft stays where it is.',
    'Diese Kopie läuft ohne Verbindung zum Server. Das Inserat bleibt im Speicher dieses Browsers und ist eine Vorführung, kein Angebot.':
      'This copy runs without a connection to the server. The listing stays in this browser’s storage and is a demonstration, not an offer.',
    'Inserat veröffentlichen': 'Publish listing',
    'Änderung speichern': 'Save change',
    'Wird veröffentlicht …': 'Publishing …',
    'Wird geändert …': 'Saving …',
    'Inserat veröffentlicht. Ab jetzt steht es in der Suche.':
      'Listing published. From now on it is in the search.',
    'Inserat geändert. Die Änderung ist sofort sichtbar.':
      'Listing changed. The change is visible right away.',
    'Inserat steht – {0} Bilder gingen nicht durch.': 'Listing is up – {0} images did not get through.',
    'Das Inserat ging nicht hinaus.': 'The listing did not go out.',
    'Dieses Inserat löschen?': 'Delete this listing?',
    'Inserat gelöscht. Es ist aus der Suche verschwunden.':
      'Listing deleted. It has gone from the search.',
    'Löschen ging nicht.': 'Deleting did not work.',
    'Steht noch': 'Still available',
    'Einen Moment …': 'One moment …',
    'abgelaufen': 'expired',
    'läuft in {0} Tagen aus': 'expires in {0} days',
    'Verlängert bis {0}.': 'Extended to {0}.',
    'Verlängert.': 'Extended.',
    'Verlängern ging nicht.': 'Extending did not work.',

    /* Postfach */
    'Echte Anfragen': 'Real enquiries',
    'An deine Inserate': 'To your listings',
    'Von dir geschrieben': 'Written by you',
    'ohne Namen': 'without a name',
    'Inserat gelöscht': 'Listing deleted',
    'noch ungelesen': 'not read yet',
    'beantwortet': 'answered',
    'abgesagt': 'declined',
    'gelesen': 'read',
    'neu': 'new',
    'eingegangen': 'received',
    'geschrieben': 'written',
    'Die Adresse steht hier und in keiner Mail. Wer antwortet, gibt seine eigene frei – niemand sonst.':
      'The address is here and in no email. Whoever answers releases their own – nobody else.',
    '„Noch ungelesen“ heißt nicht ignoriert. Viele öffnen ihr Postfach einmal am Tag. Nachfassen lohnt sich erfahrungsgemäß nach drei bis vier Tagen, nicht früher.':
      '“Not read yet” does not mean ignored. Many people open their inbox once a day. Following up pays off after three or four days, not earlier.',
    'Vermerkt.': 'Noted.',
    'Das ließ sich nicht vermerken.': 'That could not be noted.',

    /* Suchauftrag per Mail */
    'per Mail melden': 'notify by email',
    'Mail-Benachrichtigung braucht ein Konto auf trimmotrade.de.':
      'Email notification needs an account on trimmotrade.de.',
    'stündlich': 'hourly', 'täglich': 'daily', 'wöchentlich': 'weekly',
    'Die Mail kann nicht alles:': 'The email cannot do everything:',
    'Eingerichtet. Du bekommst eine Mail, sobald etwas Passendes dazukommt.':
      'Set up. You get an email as soon as something matching appears.',
    'Keine Mails mehr für diesen Suchauftrag.': 'No more emails for this saved search.',
    'Das ging nicht.': 'That did not work.',
    'mehrere Angebotsarten': 'several offer types',
    'mehrere Städte': 'several cities',
    'einzelne Viertel': 'individual districts',
    'Pendelzeit': 'commuting time',
    'Energieklasse': 'energy class',
    'Baujahr': 'year built',
    'WG-Merkmale': 'flatshare criteria',

    /* Sonstiges, das ohne Eintrag deutsch geblieben war */
  });


  /* Die Rechtstexte zum Markt – Abschnitte 5 bis 9 der
     Datenschutzerklärung und die neuen Absätze in § 2 der AGB. */
  e({
    "TrimmoTrade rechnet im Browser. Suche, Bewertung, Karte, Ringtausch, Merkliste, Vergleich, Notizen und Profil entstehen auf deinem Gerät und bleiben dort. Sie werden nicht an den Anbieter übertragen und nicht an Dritte weitergegeben.":
      "TrimmoTrade does its calculating in the browser. Search, assessment, map, swap ring, shortlist, comparison, notes and profile are created on your device and stay there. They are not transmitted to the provider and not passed on to third parties.",
    "Zum Server geht, was andere erreichen muss – und sonst nichts. Das sind vier Dinge: die":
      "What has to reach other people goes to the server – and nothing else. That is four things: the",
    ", die du veröffentlichst (Abschnitt 5), die":
      "you publish (section 5), the",
    ", die du schreibst oder bekommst (Abschnitt 6), und deine":
      "you write or receive (section 6), and your",
    ", damit die Mail auch dann herausgeht, wenn du gerade nicht hier bist (Abschnitt 7).":
      "so that the email goes out even when you are not here (section 7).",
    "Die Trennlinie verläuft nicht willkürlich: Ein Inserat ist eine Veröffentlichung und muss andere erreichen. Eine Merkliste ist eine Notiz und geht niemanden etwas an.":
      "The dividing line is not arbitrary: a listing is a publication and has to reach other people. A shortlist is a note and is nobody else’s business.",
    "Es werden keine Werkzeuge zur Reichweitenmessung eingesetzt, keine Profile über dein Verhalten gebildet und keine Werbung nach deinen Interessen ausgespielt. Gezählt wird nur, wie oft eine Ansicht an einem Tag insgesamt geöffnet wurde – ohne Kennung, ohne Adresse, ohne Verlauf (Abschnitt 9). Deshalb erscheint auch kein Fenster, das um Einwilligung bittet: Es gibt nichts, wozu eine Einwilligung nötig wäre.":
      "No audience-measurement tools are used, no profiles of your behaviour are built and no interest-based advertising is shown. All that is counted is how often a view was opened in total on a given day – with no identifier, no address, no history (section 9). That is why no window appears asking for consent: there is nothing consent would be needed for.",
    "Merkliste, Vergleich, Bewerbungstafel, Notizen, Profil, Suchverlauf, jede Berechnung und der Dokumententresor. Diese Daten verlassen deinen Browser nicht.":
      "Shortlist, comparison, application board, notes, profile, search history, every calculation and the document vault. This data does not leave your browser.",
    "5. Inserate, die du veröffentlichst":
      "5. Listings you publish",
    "Ein Inserat ist eine Veröffentlichung. Es ist für jeden sichtbar, auch ohne Konto, und es lässt sich verweisen und teilen. Gespeichert werden die Angaben, die du im Formular machst – Art, Lage, Größe, Preis, Ausstattung, Beschreibung, Energieausweis und Bilder –, dazu die Verbindung zu deinem Konto, der Zeitpunkt und die Zahl der Aufrufe und Anfragen.":
      "A listing is a publication. It is visible to anyone, with or without an account, and it can be linked to and shared. What is stored is what you enter in the form – type, location, size, price, features, description, energy certificate and images – plus the link to your account, the time and the number of views and enquiries.",
    "Als Name der anbietenden Seite erscheint der Name aus deinem Konto.":
      "The advertiser name shown is the name from your account.",
    "Deine E-Mail-Adresse und deine Telefonnummer stehen nicht im Inserat":
      "Your email address and your phone number do not appear in the listing",
    "und werden auch nicht an Suchende übermittelt.":
      "and are not passed on to searchers either.",
    "Hochgeladene Bilder werden beim Empfang neu berechnet. Dabei werden Aufnahmedaten aus der Datei entfernt – insbesondere Ortsangaben, die viele Kameras und Telefone einbetten. Diese Angaben würden sonst die genaue Adresse verraten, obwohl im Inserat nur das Viertel steht.":
      "Uploaded images are recalculated on receipt. Capture data is removed from the file in the process – in particular location data, which many cameras and phones embed. Otherwise that data would give away the exact address even though the listing names only the district.",
    "Veröffentlichung deines Angebots, Auffindbarkeit in der Suche, Schutz anderer Nutzender vor betrügerischen Angeboten":
      "Publishing your offer, making it findable in the search, protecting other users from fraudulent offers",
    "Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Nutzungsvertrags; für die Prüfung auf Betrugsmuster zusätzlich Art. 6 Abs. 1 lit. f DSGVO":
      "Art. 6(1)(b) GDPR – performance of the user agreement; for the fraud-pattern check additionally Art. 6(1)(f) GDPR",
    "bis du das Inserat löschst, längstens 60 Tage nach der letzten Bestätigung. Danach verfällt es und wird entfernt. Mit dem Inserat verschwinden die Bilder.":
      "until you delete the listing, at most 60 days after the last confirmation. After that it expires and is removed. The images go with the listing.",
    "die Öffentlichkeit, soweit das Inserat veröffentlicht ist; im Übrigen der Hostinganbieter als Auftragsverarbeiter nach Art. 28 DSGVO":
      "the public, insofar as the listing is published; otherwise the hosting provider as a processor under Art. 28 GDPR",
    "Jedes Inserat wird beim Anlegen auf typische Betrugsmuster geprüft – etwa Vorkasse, Schlüsselversand per Post oder einen Preis weit unter der ortsüblichen Vergleichsmiete. Gefunden wird nicht gelöscht, sondern gekennzeichnet. Eine automatisierte Entscheidung mit rechtlicher Wirkung im Sinne des Art. 22 DSGVO ist damit nicht verbunden.":
      "Every listing is checked for typical fraud patterns when it is created – payment up front, keys sent by post, or a price far below the local comparable rent. What is found is not deleted but labelled. No automated decision with legal effect within the meaning of Art. 22 GDPR is involved.",
    "Wenn du auf ein Inserat antwortest, wird deine Nachricht auf dem Server gespeichert und der anbietenden Seite in deren Postfach angezeigt. Gespeichert werden dein Text, dein Name, deine E-Mail-Adresse und – falls angegeben – deine Telefonnummer sowie die Eckdaten, die du im Dialog":
      "When you reply to a listing, your message is stored on the server and shown to the advertiser in their inbox. What is stored is your text, your name, your email address and – if given – your phone number, along with the key facts you",
    "Welche Eckdaten das sind, steht vor dem Absenden im Dialog, Feld für Feld. Möglich sind Haushaltsgröße, Einzugstermin, Beschäftigung, eine Einkommens":
      "Which key facts those are is shown in the dialog before you send, field by field. Possible are household size, move-in date, employment, an income",
    ", Haustiere, Rauchen, Wohnberechtigungsschein und Bürgschaft. Der Betrag deines Einkommens wird bewusst nur als Spanne übermittelt. Angaben zu Herkunft, Religion, Gesundheit, Familienplanung oder sexueller Orientierung – besondere Kategorien nach Art. 9 DSGVO – werden nicht übermittelt, auch dann nicht, wenn sie im Text stehen sollten; danach zu fragen wäre zudem nach § 19 AGG unzulässig.":
      ", pets, smoking, WBS certificate and guarantor. The amount of your income is deliberately transmitted only as a range. Data on origin, religion, health, family planning or sexual orientation – special categories under Art. 9 GDPR – is not transmitted, not even if it appears in the text; asking for it would also be unlawful under § 19 AGG.",
    "Die E-Mail an die anbietende Seite enthält weder deine Adresse noch deine Telefonnummer.":
      "The email to the advertiser contains neither your address nor your phone number.",
    "Sie enthält nur den Hinweis, dass eine Anfrage vorliegt, und einen Verweis in das Postfach. Umgekehrt bekommst du die Adresse der anbietenden Seite nicht – erst wer antwortet, gibt seine eigene frei.":
      "It only says that an enquiry has arrived and links to the inbox. Conversely you do not get the advertiser’s address – only whoever answers releases their own.",
    "Herstellung des Kontakts zwischen suchender und anbietender Seite":
      "Establishing contact between the searching and the advertising side",
    "Art. 6 Abs. 1 lit. b DSGVO – vorvertragliche Maßnahme auf deine Anfrage hin":
      "Art. 6(1)(b) GDPR – pre-contractual measure at your request",
    "bis zur Löschung deines Kontos. Eine Anfrage bleibt bestehen, auch wenn das Inserat gelöscht wird: Sie gehört beiden Seiten, und ein Verlauf, der verschwindet, weil die Gegenseite aufräumt, ist keiner.":
      "until your account is deleted. An enquiry stays even when the listing is deleted: it belongs to both sides, and a thread that disappears because the other side tidies up is not a thread.",
    "die anbietende Seite des jeweiligen Inserats":
      "the advertiser of the listing in question",
    "7. Suchaufträge und Erinnerungen":
      "7. Saved searches and reminders",
    "Ein Suchauftrag speichert deine Filter und deine E-Mail-Adresse auf dem Server. Kommt ein passendes Inserat dazu, geht eine Mail an dich hinaus. Ohne Speicherung auf dem Server ginge das nicht: Der Browser kann nichts schicken, während er geschlossen ist.":
      "A saved search stores your filters and your email address on the server. When a matching listing appears, an email goes out to you. Without storage on the server that would not work: a browser cannot send anything while it is closed.",
    "Wer inseriert, bekommt außerdem eine Erinnerung, bevor ein Inserat nach 60 Tagen verfällt.":
      "Anyone who advertises also gets a reminder before a listing expires after 60 days.",
    "Jede dieser Mails enthält einen Abmeldeverweis, der ohne Anmeldung wirkt.":
      "Every one of these emails contains an unsubscribe link that works without signing in.",
    "Ein Klick genügt, und es kommt nichts mehr.":
      "One click, and nothing more arrives.",
    "Benachrichtigung über neue Angebote, Aktualität des Bestands":
      "Notification about new offers, keeping the listings current",
    "Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des von dir angelegten Suchauftrags":
      "Art. 6(1)(b) GDPR – performance of the saved search you created",
    "bis du den Suchauftrag löschst oder dein Konto beendest":
      "until you delete the saved search or close your account",
    "jederzeit über den Verweis in der Mail oder in der Anwendung (Art. 21 DSGVO)":
      "at any time via the link in the email or in the application (Art. 21 GDPR)",
    "Ein Inserat lässt sich melden, ohne dass ein Konto nötig ist – so verlangt es Art. 16 Abs. 1 der Verordnung (EU) 2022/2065 über digitale Dienste. Gespeichert werden der Grund, dein Text und, falls du sie angibst, deine E-Mail-Adresse. Die Adresse ist freiwillig; ohne sie lässt sich die Entscheidung nicht mitteilen.":
      "A listing can be reported without an account being needed – Art. 16(1) of Regulation (EU) 2022/2065 on digital services requires that. What is stored is the reason, your text and, if you give it, your email address. The address is optional; without it the decision cannot be communicated to you.",
    "Prüfung des gemeldeten Inhalts, Empfangsbestätigung und Mitteilung der Entscheidung":
      "Examining the reported content, acknowledging receipt and communicating the decision",
    "Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit Art. 16 der Verordnung (EU) 2022/2065 – rechtliche Verpflichtung":
      "Art. 6(1)(c) GDPR in conjunction with Art. 16 of Regulation (EU) 2022/2065 – legal obligation",
    "so lange, wie die Nachvollziehbarkeit der Entscheidung es erfordert; danach Löschung":
      "for as long as the traceability of the decision requires; deleted thereafter",
    "9. Reichweitenmessung ohne Personenbezug":
      "9. Audience measurement without personal data",
    "Um zu erkennen, welche Teile der Anwendung benutzt werden, wird eine einzige Tabelle geführt. Sie hat drei Spalten:":
      "To see which parts of the application are used, a single table is kept. It has three columns:",
    "Name der Ansicht":
      "name of the view",
    ". Aus „am 3. März 412 Suchen“ lässt sich niemand herauslesen.":
      ". Nobody can be picked out of “412 searches on 3 March”.",
    "Nicht gespeichert werden: Kennung, IP-Adresse, Sitzung, Reihenfolge der Aufrufe, Gerät, Herkunftsseite. Auf deinem Gerät wird dafür nichts abgelegt, weshalb sich die Frage nach § 25 TDDDG nicht stellt. Ein Personenbezug im Sinne des Art. 4 Nr. 1 DSGVO entsteht nicht; damit ist die DSGVO auf diese Zählung nicht anwendbar.":
      "Not stored: identifier, IP address, session, order of views, device, referring page. Nothing is stored on your device for this, so the question of § 25 TDDDG does not arise. No personal reference within the meaning of Art. 4(1) GDPR comes about; the GDPR therefore does not apply to this count.",
    "Warum das hier trotzdem steht: Wer wissen will, was mit ihm passiert, soll nicht erst herausfinden müssen, was":
      "Why it is stated here anyway: whoever wants to know what happens to them should not first have to work out what is",
    "TrimmoTrade legt deine Eingaben im lokalen Speicher deines Browsers ab – Profil, Merkliste, Vergleich, Bewerbungstafel, Notizen, gespeicherte Filter und die Einstellungen zur Darstellung. Diese Daten verlassen dein Gerät nicht. Der Anbieter hat keinen Zugriff darauf.":
      "TrimmoTrade stores your entries in your browser’s local storage – profile, shortlist, comparison, application board, notes, saved filters and the display settings. This data does not leave your device. The provider has no access to it.",
    "Zwei Dinge liegen dabei an beiden Stellen, und das hat einen Grund: Ein Inserat, das du veröffentlichst, steht auf dem Server (Abschnitt 5) – sonst könnte es niemand sehen. Ein Suchauftrag, der dir Mails schickt, steht ebenfalls dort (Abschnitt 7) – sonst käme keine Mail, während dein Browser geschlossen ist. Was ohne Server auskommt, bleibt hier.":
      "Two things are in both places, and there is a reason: a listing you publish is on the server (section 5) – otherwise nobody could see it. A saved search that sends you emails is there too (section 7) – otherwise no email would arrive while your browser is closed. What works without a server stays here.",
    "13. Kontaktaufnahme und Hilfe":
      "13. Getting in touch and help",
    "14. Bezahlung von TrimmoTrade Plus":
      "14. Paying for TrimmoTrade Plus",
    "15. Keine automatisierte Entscheidung über Personen":
      "15. No automated decisions about people",
    "17. Deine Rechte":
      "17. Your rights",
    "19. Pflicht zur Bereitstellung":
      "19. Obligation to provide data",
    "(5) Ein eingestelltes Inserat ist eine":
      "(5) A published listing is a",
    ": Es ist für jedermann sichtbar, auch ohne Konto, und über einen dauerhaften Verweis erreichbar. Es":
      ": it is visible to anyone, with or without an account, and reachable via a permanent link. It",
    "läuft 60 Tage nach der letzten Bestätigung ab":
      "expires 60 days after the last confirmation",
    "und wird danach entfernt. Der Anbieter erinnert vorher per E-Mail; eine Bestätigung verlängert die Laufzeit um weitere 60 Tage. Diese Befristung dient der Aktualität des Bestands und gilt für alle gleichermaßen.":
      "and is removed after that. The provider sends a reminder by email beforehand; a confirmation extends the term by another 60 days. This time limit serves to keep the listings current and applies to everyone alike.",
    "(6) Anfragen zwischen Nutzenden werden über den Dienst zugestellt. Der Anbieter gibt dabei":
      "(6) Enquiries between users are delivered through the service. In doing so the provider passes on",
    "weder die E-Mail-Adresse noch die Telefonnummer":
      "neither the email address nor the phone number",
    "einer Seite an die andere weiter; die benachrichtigende E-Mail enthält lediglich den Hinweis auf eine vorliegende Anfrage. Welche Angaben eine Anfrage begleiten, entscheidet die anfragende Person vor dem Absenden.":
      "of one side to the other; the notifying email merely says that an enquiry has arrived. Which details accompany an enquiry is decided by the enquiring person before sending.",
  });


  /* -------------------------------------------------------------------
     WG-Gründung
     ------------------------------------------------------------------- */
  e({
    "für WG-Gründung freigegeben":
      "released for founding a flatshare",
    "Wohnungen, die an mehrere Fremde zusammen vermietet werden":
      "Flats let to several strangers together",
    "An eine WG vermieten?":
      "Let to a flatshare?",
    "Eine Wohnung ab drei Zimmern ist für eine Person zu groß und für viele Familien zu teuer. Drei Leute, die sich hier finden, zahlen sie zusammen ohne Mühe – und sie bewerben sich als ein Haushalt, nicht als drei Einzelne.":
      "A flat with three or more rooms is too big for one person and too expensive for many families. Three people who find each other here pay it together without effort – and they apply as one household, not as three individuals.",
    "Für eine WG-Gründung freigeben":
      "Release for founding a flatshare",
    "Mehrere Fremde können sich hier zusammentun und sich gemeinsam bewerben. Du entscheidest wie immer, wer die Wohnung bekommt.":
      "Several strangers can team up here and apply together. You still decide who gets the flat, as always.",
    "Bei einem gemeinsamen Vertrag haften alle als Gesamtschuldner (§ 421 BGB) – für dich die sicherere Form. Die Kaution bleibt in jedem Fall auf drei Nettokaltmieten für die ganze Wohnung begrenzt, nicht je Person (§ 551 Abs. 1 BGB).":
      "With a joint agreement everybody is jointly and severally liable (§ 421 BGB) – the safer form for you. The deposit stays capped at three months’ net rent for the whole flat in any case, not per person (§ 551 Abs. 1 BGB).",
    "Eine Wohnung, die für eine Person zu groß und für eine Familie zu teuer ist, wird bezahlbar, sobald sich drei Leute finden. Hier findet man sie – vor der Wohnung, nicht danach.":
      "A flat that is too big for one person and too expensive for a family becomes affordable as soon as three people find each other. Here is where they do – before the flat, not after.",
    "Eine WG zu gründen heißt, dass sich Menschen finden, die sich nicht kennen. Das geht nur dort, wo mehr als ein Browser beteiligt ist – auf":
      "Founding a flatshare means people find each other who do not know each other. That only works where more than one browser is involved – on",
    ". Diese Kopie läuft ohne Verbindung und zeigt nur, wie es aussieht.":
      ". This copy runs without a connection and only shows what it looks like.",
    "Was ihr rechtlich unterschreibt:":
      "What you are signing, legally:",
    "Ein gemeinsamer Vertrag":
      "One joint agreement",
    "Alle stehen zusammen im Vertrag.":
      "Everybody is on the same contract.",
    "Die anbietende Seite bevorzugt das fast immer.":
      "Landlords almost always prefer this.",
    "Wer auszieht, kann ersetzt werden – wenn alle zustimmen.":
      "Whoever moves out can be replaced – if everybody agrees.",
    "Solltet ihr wissen":
      "You should know",
    "Ihr haftet als Gesamtschuldner (§ 421 BGB): Zahlt einer nicht, kann die Vermieterseite die volle Miete von jedem Einzelnen verlangen.":
      "You are jointly and severally liable (§ 421 BGB): if one does not pay, the landlord can demand the full rent from any single one of you.",
    "Ein Auszug allein geht nicht. Der Wechsel einer Person ist eine Vertragsänderung und braucht die Zustimmung aller Mitmietenden und der Vermieterseite.":
      "Moving out alone does not work. Replacing one person is a change to the contract and needs the agreement of all co-tenants and of the landlord.",
    "Vier Dinge, die fast alle falsch machen":
      "Four things almost everybody gets wrong",
    "Die Kaution gilt für die Wohnung, nicht je Person.":
      "The deposit applies to the flat, not per person.",
    "Höchstens drei Nettokaltmieten insgesamt (§ 551 Abs. 1 BGB). Wer von jedem drei Monatsmieten verlangt, verlangt zu viel – und ihr dürft in drei Raten zahlen.":
      "Three months’ net rent in total at most (§ 551 Abs. 1 BGB). Demanding three months from each is too much – and you may pay in three instalments.",
    "Ein Auszug beim gemeinsamen Vertrag ist keine Kündigung.":
      "Moving out under a joint agreement is not a notice.",
    "Man kündigt nur gemeinsam. Wer allein gehen will, braucht eine Vertragsänderung – und damit das Ja aller anderen und der Vermieterseite.":
      "Notice is given jointly only. Whoever wants to leave alone needs a change to the contract – and with it the yes of everybody else and of the landlord.",
    "Jede Person muss sich anmelden":
      "Every person has to register",
    ", innerhalb von zwei Wochen. Die Vermieterseite ist verpflichtet, dafür eine Wohnungsgeberbestätigung auszustellen (§ 19 BMG).":
      ", within two weeks. The landlord is obliged to issue a landlord’s confirmation for that (§ 19 BMG).",
    "Der Rundfunkbeitrag fällt einmal je Wohnung an":
      "The broadcasting fee is charged once per flat",
    ", nicht je Person. Eine WG zahlt zusammen einen Beitrag – klärt gleich, wer ihn anmeldet und wie ihr teilt.":
      ", not per person. A flatshare pays one fee together – settle right away who registers it and how you split it.",
    "Allgemeine Hinweise, keine Rechtsberatung. Bei einem gemeinsamen Vertrag über mehrere Jahre lohnt der Blick eines Mietervereins, bevor unterschrieben wird.":
      "General information, not legal advice. For a joint agreement running several years, a tenants’ association is worth consulting before anybody signs.",
    ", damit die Mail auch dann herausgeht, wenn du gerade nicht hier bist (Abschnitt 7). Dazu kommt, was du einer":
      ", so that the email goes out even when you are not here (section 7). Added to that is what you tell a",
    "über dich erzählst, wenn du eine gründest oder ihr beitrittst (Abschnitt 8).":
      "about yourself when you found one or join one (section 8).",
    "Es werden keine Werkzeuge zur Reichweitenmessung eingesetzt, keine Profile über dein Verhalten gebildet und keine Werbung nach deinen Interessen ausgespielt. Gezählt wird nur, wie oft eine Ansicht an einem Tag insgesamt geöffnet wurde – ohne Kennung, ohne Adresse, ohne Verlauf (Abschnitt 10). Deshalb erscheint auch kein Fenster, das um Einwilligung bittet: Es gibt nichts, wozu eine Einwilligung nötig wäre.":
      "No audience-measurement tools are used, no profiles of your behaviour are built and no interest-based advertising is shown. All that is counted is how often a view was opened in total on a given day – with no identifier, no address, no history (section 10). That is why no window appears asking for consent: there is nothing consent would be needed for.",
    "8. Gruppen zur WG-Gründung":
      "8. Groups for founding a flatshare",
    "Wer eine Gruppe eröffnet oder ihr beitritt, gibt anderen Menschen etwas über sich preis – das ist der Zweck der Sache und nicht ihr Nebeneffekt. Deshalb steht hier genau, wer was zu sehen bekommt.":
      "Whoever opens a group or joins one reveals something about themselves to other people – that is the point of the thing, not a side effect. So here is exactly who gets to see what.",
    "Gespeichert werden dein Vorstellungstext und die Eckdaten, die du im Formular":
      "What is stored is your introduction text and the key facts you",
    ": Alter, Beruf, eine Einkommens":
      "in the form: age, occupation, an income",
    ", Rauchen, Haustiere, gewünschter Einzugstermin und deine sechs Antworten zum Alltag, aus denen sich die Passung rechnet. Diese Angaben werden als Kopie gespeichert und ändern sich nicht mehr, wenn du später dein Profil bearbeitest.":
      ", smoking, pets, desired move-in date and your six answers about everyday life, from which the match is calculated. These details are stored as a copy and do not change later if you edit your profile.",
    "Ohne Konto sichtbar":
      "Visible without an account",
    "nur Zahlen und der Text der Gruppe – keine Person":
      "numbers and the group’s text only – no person",
    "Rufname und erster Buchstabe des Nachnamens („Cem Y.“), Alter, Beruf, Einzugstermin, Vorstellungstext, Lebensrhythmus":
      "First name and initial of the surname (“Cem Y.”), age, occupation, move-in date, introduction text, everyday rhythm",
    "Für Mitglieder sichtbar":
      "Visible to members",
    "zusätzlich die E-Mail-Adressen – erst dann, wenn beide Seiten einander angenommen haben":
      "in addition the email addresses – only once both sides have accepted each other",
    "Für die gründende Person":
      "For the founding person",
    "Die anbietende Seite der Wohnung ist von Gruppen zu ihrem eigenen Inserat ausgeschlossen – weder gründen noch beitreten. Was Bewerbende einander erzählen, erzählen sie einander. Was die Vermieterseite erfährt, steht in der gemeinsamen Bewerbung, und das sind Haushaltsgröße und Berufe, nicht die einzelnen Vorstellungstexte.":
      "The advertiser of the flat is excluded from groups for their own listing – neither founding nor joining. What applicants tell each other, they tell each other. What the landlord learns is in the joint application, and that is household size and occupations, not the individual introduction texts.",
    "Zusammenfinden von Menschen, die gemeinsam eine Wohnung mieten wollen":
      "Bringing together people who want to rent a flat jointly",
    "Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Nutzungsvertrags und vorvertragliche Maßnahme auf deine eigene Anfrage hin":
      "Art. 6(1)(b) GDPR – performance of the user agreement and pre-contractual measure at your own request",
    "bis die Gruppe aufgelöst wird oder abläuft, spätestens mit der Löschung deines Kontos. Eine Gruppe läuft 45 Tage nach der letzten Änderung ab.":
      "until the group is dissolved or expires, at the latest when your account is deleted. A group expires 45 days after the last change.",
    "die übrigen Mitglieder der Gruppe im oben beschriebenen Umfang":
      "the other members of the group, to the extent described above",
    "Nicht übermittelt werden Angaben zu Herkunft, Religion, Gesundheit, Familienplanung oder sexueller Orientierung (Art. 9 DSGVO) – sie kommen im Formular gar nicht erst vor. Eine Auswahl nach Alter oder Geschlecht nimmt TrimmoTrade nicht vor; dass eine WG das für sich tun darf (§ 19 Abs. 5 AGG nimmt das gemeinsame Wohnen aus), ist eine Entscheidung der Menschen, nicht dieser Anwendung.":
      "Data on origin, religion, health, family planning or sexual orientation (Art. 9 GDPR) is not transmitted – it does not appear in the form in the first place. TrimmoTrade makes no selection by age or gender; that a flatshare may do so for itself (§ 19 Abs. 5 AGG exempts shared living) is a decision of the people, not of this application.",
    "Was ausdrücklich nicht stattfindet:":
      "What explicitly does not happen:",
    "eine Prüfung von Personen. TrimmoTrade stellt niemanden fest, bewertet niemanden und steht für niemanden ein. Wer sich hier zusammentut, entscheidet selbst – alles andere zu behaupten wäre ein Versprechen, das niemand halten kann.":
      "any vetting of people. TrimmoTrade identifies nobody, rates nobody and vouches for nobody. Whoever teams up here decides for themselves – claiming anything else would be a promise nobody can keep.",
    "10. Reichweitenmessung ohne Personenbezug":
      "10. Audience measurement without personal data",
    "14. Kontaktaufnahme und Hilfe":
      "14. Getting in touch and help",
    "15. Bezahlung von TrimmoTrade Plus":
      "15. Paying for TrimmoTrade Plus",
    "16. Keine automatisierte Entscheidung über Personen":
      "16. No automated decisions about people",
    "18. Deine Rechte":
      "18. Your rights",
    "20. Pflicht zur Bereitstellung":
      "20. Obligation to provide data",
    "(7) Der Dienst ermöglicht es Nutzenden, sich zu Gruppen zusammenzuschließen, um eine Wohnung gemeinsam zu mieten. Der Anbieter":
      "(7) The service lets users team up in groups in order to rent a flat jointly. The provider",
    "prüft die Beteiligten nicht":
      "does not vet the people involved",
    ", stellt ihre Identität nicht fest und steht für sie nicht ein. Er wird weder Partei eines Mietvertrags noch einer Vereinbarung zwischen den Mitgliedern einer Gruppe. Die Entscheidung, mit wem jemand zusammenzieht, treffen ausschließlich die Beteiligten.":
      ", does not establish their identity and does not vouch for them. It becomes party neither to a tenancy agreement nor to any arrangement between the members of a group. Who moves in with whom is decided solely by those involved.",
    /* Gruppenkarten und Dialoge – sie erscheinen erst, wenn es Gruppen
       gibt, und wurden deshalb im Durchlauf nicht gezeichnet. */
    'WG gründen': 'Start a flatshare',
    'WG gründen – zu mehreren eine Wohnung nehmen': 'Start a flatshare – take a flat with others',
    'Eine WG gründen': 'Founding a flatshare',
    'Für eine WG-Gründung freigegeben': 'Released for founding a flatshare',
    'Die anbietende Seite vermietet diese Wohnung ausdrücklich auch an mehrere Personen, die sich nicht kennen.':
      'The advertiser explicitly lets this flat to several people who do not know each other.',
    ' Bei {0} Personen zahlt jede etwa {1} warm.': ' With {0} people each pays about {1} incl. bills.',
    'bis {0} Personen': 'up to {0} people',
    'Gruppen werden geladen …': 'Loading groups …',
    'Zu dieser Wohnung gibt es noch keine Gruppe.': 'There is no group for this flat yet.',
    'Gruppe gründen': 'Open a group',
    'Beitreten': 'Join',
    'Deine Gruppen': 'Your groups',
    'Gruppen, die noch jemanden suchen': 'Groups still looking for someone',
    'Gerade sucht keine Gruppe': 'No group is looking right now',
    'Gruppen entstehen an einer konkreten Wohnung. Such dir eine, die für eine WG-Gründung freigegeben ist, und eröffne die erste.':
      'Groups form around a specific flat. Find one released for founding a flatshare and open the first group.',
    'Wohnungen für WG-Gründung': 'Flats for founding a flatshare',
    'Dafür braucht es die Website': 'This needs the website',
    'Ansehen geht ohne Konto, mitmachen nicht': 'Looking works without an account, joining does not',
    'Wer einer Gruppe beitritt, erzählt Fremden etwas über sich. Das setzt voraus, dass man weiß, mit wem man es zu tun hat – deshalb geht es nur mit bestätigter Adresse.':
      'Whoever joins a group tells strangers something about themselves. That presupposes knowing who you are dealing with – which is why it needs a confirmed address.',
    '{0} % Passung': '{0} % match',
    '{0} frei': '{0} free',
    'voll': 'full',
    '{0} Jahre': '{0} years old',
    'jemand': 'somebody',
    'gegründet': 'founded it',
    'du': 'you',
    'Wohnung weg': 'Flat gone',
    'je Person warm, bei {0} Personen': 'per person incl. bills, with {0} people',
    'Diese Gruppe hat sich gemeinsam beworben.': 'This group has applied together.',
    'Vollzählig – die Gruppe kann sich bewerben.': 'Complete – the group can apply.',
    'Noch niemand hat sich vorgestellt.': 'Nobody has introduced themselves yet.',
    'Wer dabei ist, siehst du nach der Anmeldung. Ohne Konto zeigen wir keine Personen.':
      'You see who is in it after signing in. Without an account we show no people.',
    '{0} möchten dazukommen': '{0} would like to join',
    'Du entscheidest. Bis dahin sehen die übrigen Mitglieder diese Anfragen nicht.':
      'You decide. Until then the other members do not see these requests.',
    'Aufnehmen': 'Accept',
    'Absagen': 'Decline',
    'Deine Anfrage liegt bei der Gruppe.': 'Your request is with the group.',
    'zurückziehen': 'withdraw',
    'Gemeinsam bewerben': 'Apply together',
    'Gruppe auflösen': 'Dissolve group',
    'Gruppe verlassen': 'Leave group',
    'Diese Gruppe nimmt gerade niemanden auf.': 'This group is not taking anyone right now.',
    'Für eine Einschätzung fehlt dein Alltagsprofil.': 'Your everyday profile is missing for an assessment.',
    'Sechs Fragen im Profil': 'Six questions in your profile',
    ' genügen.': ' are enough.',

    /* Gründen */
    'Du eröffnest eine Gruppe für': 'You are opening a group for',
    '. Andere sehen sie, stellen sich vor, und du entscheidest, wer dazukommt.':
      '. Others see it, introduce themselves, and you decide who joins.',
    'Name der Gruppe': 'Name of the group',
    'WG in': 'Flatshare in',
    'Zu wie vielt?': 'How many of you?',
    ' je Person': ' per person',
    'Was für eine WG soll das werden?': 'What kind of flatshare should it be?',
    'Zweck-WG oder gemeinsam kochen? Ruhig oder offen für Besuch? Je klarer, desto passender melden sich Leute.':
      'Just sharing costs, or cooking together? Quiet, or open to visitors? The clearer you are, the better the people who get in touch.',
    'Gruppe eröffnen': 'Open the group',
    'Wird eröffnet …': 'Opening …',
    'Gruppe eröffnet. Jetzt kann sich jemand melden.': 'Group opened. Now somebody can get in touch.',
    'Schreib ein paar Sätze über dich – ohne das meldet sich niemand.':
      'Write a few sentences about yourself – without it nobody will get in touch.',

    /* Vorstellung */
    'Ein paar Sätze über dich': 'A few sentences about yourself',
    'Wer du bist, was du arbeitest, wie du wohnst – und warum diese Wohnung.':
      'Who you are, what you do, how you live – and why this flat.',
    'Das geht aus deinem Profil mit': 'This goes along from your profile',
    'Dazu deine sechs Antworten zum Alltag – daraus rechnet sich die Passung. Ohne sie sieht die Gruppe keine Einschätzung.':
      'Plus your six answers about everyday life – the match is calculated from them. Without them the group sees no assessment.',
    'Dein Profil ist leer': 'Your profile is empty',
    'Alter, Beruf und die sechs Fragen zum Alltag entscheiden darüber, ob jemand dich aufnimmt.':
      'Age, occupation and the six everyday questions decide whether somebody takes you in.',
    ' – es dauert zwei Minuten.': ' – it takes two minutes.',
    'Deine E-Mail-Adresse sehen die anderen erst, wenn ihr euch gegenseitig angenommen habt. Vorher steht dort nur dein Rufname.':
      'The others only see your email address once you have accepted each other. Before that only your first name is shown.',
    'Alter': 'Age', 'Beruf': 'Occupation',

    /* Beitreten */
    'Der Gruppe beitreten': 'Join the group',
    'Du stellst dich': 'You are introducing yourself to',
    'vor. Die gründende Person entscheidet, ob du dazukommst; die übrigen Mitglieder sehen deine Anfrage bis dahin nicht.':
      '. The founding person decides whether you join; until then the other members do not see your request.',
    'Bevor du zusagst': 'Before you commit',
    'Bei einem gemeinsamen Mietvertrag haftet ihr als Gesamtschuldner: Zahlt eine Person nicht, kann die Vermieterseite die volle Miete von jeder Einzelnen verlangen (§ 421 BGB). Trefft euch, bevor ihr unterschreibt.':
      'With a joint tenancy agreement you are jointly and severally liable: if one person does not pay, the landlord can demand the full rent from any single one of you (§ 421 BGB). Meet up before you sign.',
    'Anfrage schicken': 'Send request',
    'Wird geschickt …': 'Sending …',
    'Anfrage geschickt. Die Gruppe bekommt eine Mail.': 'Request sent. The group gets an email.',
    'Schreib ein paar Sätze über dich – sonst kann niemand entscheiden.':
      'Write a few sentences about yourself – otherwise nobody can decide.',

    /* Entscheiden und verlassen */
    'Aufgenommen. Ihr seht jetzt eure Adressen.': 'Accepted. You can now see each other’s addresses.',
    'Abgesagt.': 'Declined.',
    'Die Gruppe auflösen? Alle Mitglieder werden benachrichtigt.':
      'Dissolve the group? All members will be notified.',
    'Diese Gruppe wirklich verlassen?': 'Really leave this group?',
    'Gruppe aufgelöst.': 'Group dissolved.',
    'Du bist raus.': 'You are out.',

    /* Bewerben */
    'Eure Bewerbung geht als': 'Your application goes out as',
    'eine': 'one',
    'Anfrage hinaus – nicht als': 'enquiry – not as',
    'einzelne. Für die anbietende Seite ist das der Unterschied zwischen':
      'separate ones. For the advertiser that is the difference between',
    'Leuten, die allein nicht zahlen können, und einem vollständigen Haushalt.':
      'people who cannot pay on their own and one complete household.',
    'Eure Nachricht': 'Your message',
    'Das steht automatisch dabei': 'This is included automatically',
    'Personen als WG': 'people as a flatshare',
    'Namen und Adressen der Einzelnen gehen nicht mit. Wer antwortet, entscheidet selbst, wem er sie gibt.':
      'Names and addresses of the individuals do not go along. Whoever answers decides for themselves who gets them.',
    'Bewerbung abschicken': 'Send application',
    'Bewerbung abgeschickt. Die anbietende Seite bekommt eine Mail.':
      'Application sent. The advertiser gets an email.',
    'zu zweit': 'two of us', 'zu dritt': 'three of us', 'zu viert': 'four of us',
    'zu fünft': 'five of us', 'zu sechst': 'six of us',
    'mit {0} Personen': 'a group of {0}',
    'Guten Tag,\n\nwir sind {0} und würden die Wohnung gern gemeinsam nehmen. Wir haben uns über TrimmoTrade gefunden und stellen uns gern persönlich vor.\n\nÜber einen Besichtigungstermin würden wir uns freuen.':
      'Hello,\n\nwe are {0} and would like to take the flat together. We found each other through TrimmoTrade and would be glad to introduce ourselves in person.\n\nWe would appreciate a viewing appointment.',

    /* Formular */
    'Höchstens wie viele Personen?': 'At most how many people?',
    'Vertragsform': 'Form of contract',
    'ein gemeinsamer Vertrag (üblich)': 'one joint agreement (usual)',
    'ein Vertrag je Zimmer': 'one agreement per room',
    'Hinweis an die Gruppe (freiwillig)': 'Note to the group (optional)',
    'etwa: Ich hätte gern einen gemeinsamen Vertrag und eine Kaution von drei Kaltmieten insgesamt.':
      'e.g.: I would prefer one joint agreement and a deposit of three months’ net rent in total.',
    'Ein Vertrag je Zimmer': 'One agreement per room',
    'Jede Person hat einen eigenen Vertrag.': 'Every person has their own agreement.',
    'Keine Haftung für die anderen.': 'No liability for the others.',
    'Jede Person kann für sich kündigen, ohne die anderen zu fragen.':
      'Every person can give notice for themselves without asking the others.',
    'Deutlich seltener – für die Vermieterseite ist es mehr Verwaltung.':
      'Much rarer – it means more administration for the landlord.',
    'Die Gemeinschaftsräume gehören dann niemandem allein; das gehört geregelt.':
      'The shared rooms then belong to nobody alone; that needs to be settled.',
    'Noch offen': 'Still open',
    'Die Vertragsform ist noch nicht entschieden.': 'The form of contract has not been decided yet.',
    'Ihr könnt danach fragen, bevor ihr euch festlegt.': 'You can ask about it before committing.',
    'Fragt früh. Nach der Zusage ist die Verhandlungsposition schlechter.':
      'Ask early. After the acceptance your bargaining position is weaker.',
    'Spricht dafür': 'In favour',

    /* Kontohinweis */
    'Einer WG-Gründung beitreten': 'Joining a flatshare being founded'

  });


  /* Die Zustandshinweise am eigenen Inserat – gesperrt, vom Netz,
     abgelaufen, läuft bald aus. */
  e({
    'Dieses Inserat ist gesperrt.': 'This listing is blocked.',
    'Es erscheint weder in der Suche noch über einen Verweis. Die Begründung steht in der Mail dazu – zusammen mit dem Weg, dagegen vorzugehen. Ein Widerspruch ist sechs Monate lang formlos möglich; eine Antwort auf diese Mail genügt.':
      'It appears neither in the search nor via a link. The reasons are in the email about it – together with how to challenge the decision. An objection is possible informally for six months; a reply to that email is enough.',
    'Dieses Inserat ist vom Netz.': 'This listing is offline.',
    'Nur du siehst es.': 'Only you can see it.',
    'Wieder aufnehmen': 'Put it back online',
    'Dieses Inserat ist abgelaufen.': 'This listing has expired.',
    'Nach 60 Tagen ohne Bestätigung verschwindet ein Angebot aus der Suche – so bleibt der Bestand aktuell.':
      'After 60 days without confirmation an offer disappears from the search – that is what keeps the listings current.',
    '„Steht noch“ nimmt es wieder auf': '“Still available” brings it back',
    'Dein Inserat läuft in {1} Tagen aus.': 'Your listing expires in {1} days.',
    '„Steht noch“ verlängert es um 60 Tage': '“Still available” extends it by 60 days'
  });


  /* Was einem eigenen Inserat noch fehlt. */
  e({
    'Eine Sache würde dieses Inserat besser machen': 'One thing would make this listing better',
    '{0} Dinge würden dieses Inserat besser machen': '{0} things would make this listing better',
    'Dein Inserat ist vollständig. Mehr lässt sich hier nicht verbessern.':
      'Your listing is complete. There is nothing more to improve here.',
    'Inserat ändern': 'Edit listing',
    'Nur du siehst diese Liste. Sie beruht darauf, was Suchende erfahrungsgemäß anklicken und beantworten – nicht auf einer Bewertung deiner Wohnung.':
      'Only you see this list. It is based on what searchers tend to click and answer – not on any rating of your flat.',
    'Kein Foto': 'No photo',
    'Inserate ohne Bild werden selten geöffnet. Ein einziges Foto vom hellsten Raum reicht für den Anfang.':
      'Listings without a picture are rarely opened. A single photo of the brightest room is enough to start with.',
    'Nur {0} Fotos': 'Only {0} photos',
    'Wohnbereich, Küche, Bad – drei Bilder beantworten die meisten Rückfragen von selbst.':
      'Living area, kitchen, bathroom – three pictures answer most questions by themselves.',
    'Sehr kurze Beschreibung': 'Very short description',
    'Wer wenig schreibt, bekommt Rückfragen statt Bewerbungen. Lage, Zuschnitt, Nachbarschaft, ab wann – vier Sätze genügen.':
      'Write little and you get questions instead of applications. Location, layout, neighbourhood, from when – four sentences are enough.',
    'Keine Ausstattung angegeben': 'No features listed',
    'Balkon, Einbauküche, Keller, Aufzug: Danach wird gefiltert. Was nicht angehakt ist, taucht in diesen Suchen nicht auf.':
      'Balcony, fitted kitchen, cellar, lift: people filter by these. What is not ticked does not appear in those searches.',
    'Keine Nebenkosten': 'No service charges',
    'Ohne sie lässt sich die Warmmiete nicht rechnen – und danach sucht fast jeder.':
      'Without them the total rent cannot be calculated – and that is what almost everybody searches by.',
    'Der Einzugstermin liegt in der Vergangenheit': 'The move-in date is in the past',
    'Das wirkt wie ein vergessenes Inserat. Ein aktuelles Datum hilft.':
      'That looks like a forgotten listing. A current date helps.',
    'Nicht für eine WG-Gründung freigegeben': 'Not released for founding a flatshare',
    'Ab drei Zimmern ist das oft der schnellste Weg: Mehrere Suchende tun sich zusammen und bewerben sich als ein Haushalt. Du entscheidest weiterhin, wer die Wohnung bekommt.':
      'From three rooms on this is often the fastest route: several searchers team up and apply as one household. You still decide who gets the flat.'
  });


  /* Woher die Betreiberangaben kommen. */
  e({
    'Diese Angaben liegen nur in diesem Browser.': 'These details are only in this browser.',
    'Auf einer Website reicht das nicht: Jeder andere Besucher sähe an ihrer Stelle eine Lücke, und die Impressumspflicht nach § 5 DDG wäre nicht erfüllt. Auf dem Server gehören sie in':
      'On a website that is not enough: every other visitor would see a gap in their place, and the imprint obligation under § 5 DDG would not be met. On the server they belong in',
    'sagt, was dort noch fehlt.': 'says what is still missing there.',
    'Diese Angaben kommen vom Server': 'These details come from the server',
    '– aus': '– from',
    ', Abschnitt': ', section',
    '. Damit sehen sie alle Besucher, und genau so muss es sein. Ändern lassen sie sich nur dort; was du unten einträgst, wirkt nur in diesem Browser und wird von den Serverangaben überschrieben.':
      '. That way every visitor sees them, which is exactly how it has to be. They can only be changed there; what you enter below applies to this browser alone and is overridden by the server’s values.'
  });

  /* ---------------------------------------------------------------
     Was mit dem Echt-Betrieb dazukam: die Ablage für den
     Gerätewechsel, der Tresor auf dem Server, Besichtigungstermine –
     und die Rechtstexte, die das beschreiben. */
  e({
    'TrimmoTrade rechnet im Browser. Suche, Bewertung, Karte, Ringtausch, Passung und jede Schätzung entstehen auf deinem Gerät.':
      'TrimmoTrade computes in the browser. Search, assessment, map, chain swap, match and every estimate are produced on your device.',
    'Ohne Anmeldung verlässt davon nichts deinen Browser':
      'Without an account none of it leaves your browser',
    '– Suche und Inserate lassen sich ansehen, ohne dass ein Konto entsteht und ohne dass etwas über dich gespeichert wird.':
      '– search and listings can be viewed without creating an account and without anything about you being stored.',
    'Mit einem Konto kommt eines hinzu: Dein Arbeitsstand liegt zusätzlich auf dem Server, damit du ihn auf jedem deiner Geräte wiederfindest und nicht verlierst, wenn du die Browserdaten löschst. Der Server verwahrt ihn und wertet ihn nicht aus – keine Suche über Profile, keine Auswertung, keine Statistik (Abschnitt 11).':
      'With an account one thing is added: your working state is also held on the server, so that you find it again on every one of your devices and do not lose it when you clear your browser data. The server keeps it and does not evaluate it – no searching across profiles, no analysis, no statistics (section 11).',
    'Zum Server geht damit: die': 'What therefore goes to the server: the',
    '(Abschnitt 4), die': '(section 4), the',
    '(Abschnitt 6), deine': '(section 6), your',
    ', damit die Mail auch dann herausgeht, wenn du gerade nicht hier bist (Abschnitt 7), was du einer':
      ', so that the mail goes out even while you are not here (section 7), what you tell a',
    'über dich erzählst (Abschnitt 8), dein': 'about yourself (section 8), your',
    'für den Gerätewechsel (Abschnitt 11) und der': 'for switching devices (section 11) and the',
    '– der allerdings verschlüsselt wird, bevor er den Browser verlässt, und für den Anbieter nicht lesbar ist (Abschnitt 12).':
      '– which, however, is encrypted before it leaves the browser and cannot be read by the provider (section 12).',
    'Die Trennlinie verläuft nicht willkürlich: Was andere erreichen muss, gehört auf den Server. Was nur dich angeht, liegt dort so, dass der Anbieter nichts damit anfängt – und die Unterlagen, bei denen das nicht genügt, liegen verschlüsselt.':
      'The dividing line is not arbitrary: whatever has to reach other people belongs on the server. Whatever concerns only you is held there in a way the provider can do nothing with – and the documents for which that is not enough are held encrypted.',
    'Es werden keine Werkzeuge zur Reichweitenmessung eingesetzt, keine Profile über dein Verhalten gebildet und keine Werbung ausgespielt – es gibt hier keine. Gezählt wird nur, wie oft eine Ansicht an einem Tag insgesamt geöffnet wurde – ohne Kennung, ohne Adresse, ohne Verlauf (Abschnitt 10). Deshalb erscheint auch kein Fenster, das um Einwilligung bittet: Es gibt nichts, wozu eine Einwilligung nötig wäre.':
      'No reach-measurement tools are used, no profiles of your behaviour are built and no advertising is served – there is none here. All that is counted is how often a view was opened in total on a given day – without an identifier, without an address, without a history (section 10). That is also why no window appears asking for consent: there is nothing consent would be needed for.',

    /* Abschnitt 4 */
    'Nicht im Konto stehen:': 'Not held in your account:',
    'das Farbschema, die gewählte Ansichtsart und jede Berechnung der Rechner – die entsteht bei jedem Aufruf neu auf deinem Gerät. Was du an Profil, Merkliste, Vergleich, Bewerbungstafel und Suchaufträgen anlegst, wird dagegen deinem Konto zugeordnet gespeichert, damit es auf jedem deiner Geräte da ist; Abschnitt 11 beschreibt das im Einzelnen, Abschnitt 12 den Dokumententresor.':
      'the colour scheme, the chosen view mode and every calculation the tools make – that is produced afresh on your device each time. What you create as profile, saved list, comparison, application board and saved searches, by contrast, is stored against your account so that it is there on every one of your devices; section 11 describes this in detail, section 12 the document vault.',

    /* Abschnitt 6: Besichtigungstermine */
    'Wer inseriert, kann Termine zur Besichtigung eintragen. Buchst du einen davon, wird gespeichert, welches Konto welchen Termin belegt – mehr nicht. Die anbietende Seite erfährt, dass ein Platz genommen wurde, und sieht, wie viele Plätze belegt sind; deinen Namen bekommt sie an dieser Stelle nicht. Auch die übrigen Teilnehmer siehst du nicht, und sie sehen dich nicht: Wer zu einer Besichtigung geht, hat nicht eingewilligt, den Mitbewerbern namentlich bekannt zu werden.':
      'Anyone who lists a property can enter viewing appointments. If you book one, what is stored is which account holds which appointment – nothing more. The offering side learns that a slot has been taken and sees how many slots are filled; it does not get your name at this point. You do not see the other attendees either, and they do not see you: going to a viewing is not consent to become known by name to your fellow applicants.',
    'Eine Mail geht an dich, wenn die anbietende Seite den Termin absagt. Sagst du selbst ab, verschwindet deine Buchung sofort und der Platz wird wieder frei.':
      'You receive an email if the offering side cancels the appointment. If you cancel yourself, your booking disappears immediately and the slot is free again.',
    'Vereinbarung und Verwaltung von Besichtigungsterminen':
      'arranging and managing viewing appointments',
    'Art. 6 Abs. 1 lit. b DSGVO – vorvertragliche Maßnahme auf deine Buchung hin':
      'Art. 6(1)(b) GDPR – pre-contractual step taken at your booking',
    'bis du absagst; im Übrigen 90 Tage nach dem Termin, mit dem Inserat oder mit deinem Konto auch früher':
      'until you cancel; otherwise 90 days after the appointment, or sooner together with the listing or your account',

    /* Abschnitt 11: Ablage */
    '11. Dein Arbeitsstand: Browser und Gerätewechsel':
      '11. Your working state: browser and switching devices',
    'TrimmoTrade legt deine Eingaben zuerst im lokalen Speicher deines Browsers ab – Profil, Merkliste, Vergleich, Bewerbungstafel, Notizen, gespeicherte Filter und die Einstellungen zur Darstellung.':
      'TrimmoTrade first stores what you enter in your browser’s local storage – profile, saved list, comparison, application board, notes, saved filters and the display settings.',
    'Ohne Konto bleibt es dabei:': 'Without an account it stays that way:',
    'Diese Daten verlassen dein Gerät nicht, und der Anbieter hat keinen Zugriff darauf.':
      'This data does not leave your device, and the provider has no access to it.',
    'Bist du angemeldet, wird derselbe Stand zusätzlich zu deinem Konto auf dem Server abgelegt. Das ist der Grund, warum du die Suche am Rechner beginnen und unterwegs auf dem Telefon fortsetzen kannst – und warum gelöschte Browserdaten nicht mehr alles mitnehmen.':
      'If you are signed in, the same state is additionally stored against your account on the server. That is why you can start searching on the computer and carry on from your phone – and why clearing your browser data no longer takes everything with it.',
    'Was mitgeht:': 'What travels with you:',
    'Profil, Merkliste samt deiner Notizen, Vergleich, Bewerbungstafel, Suchaufträge, zuletzt gesehene Inserate, gespeicherte Filter, Umzugsplan, Übergabeprotokoll, die zuletzt eingegebenen Werte der Rechner und welche Hinweise du weggeklickt hast':
      'profile, saved list including your notes, comparison, application board, saved searches, recently viewed listings, saved filters, moving plan, handover record, the values last entered into the calculators, and which notices you have dismissed',
    'Was nicht mitgeht:': 'What does not:',
    'Farbschema und Ansichtsart – die gehören zum Gerät und nicht zu dir':
      'colour scheme and view mode – those belong to the device, not to you',
    'Was der Server damit tut:': 'What the server does with it:',
    'nichts. Er nimmt die Angaben als Text entgegen, gibt sie unverändert zurück und liest sie nicht aus. Es findet keine Suche über Profile statt, keine Auswertung, keine Statistik, keine Weitergabe.':
      'nothing. It takes the entries as text, hands them back unchanged and does not read them. There is no searching across profiles, no analysis, no statistics, no passing on.',
    'Fortsetzen der Nutzung auf einem anderen Gerät und Schutz deiner Eingaben vor Verlust':
      'continuing use on another device and protecting your entries against loss',
    'Art. 6 Abs. 1 lit. b DSGVO – Erfüllung des Nutzungsvertrags über ein Konto, dessen Zweck genau das ist':
      'Art. 6(1)(b) GDPR – performance of the usage contract for an account whose purpose is precisely this',
    'bis du die Angaben in der Anwendung löschst, längstens bis zur Löschung deines Kontos':
      'until you delete the entries in the application, at the latest when your account is deleted',
    'der Hostinganbieter als Auftragsverarbeiter nach Art. 28 DSGVO. An Dritte geht nichts.':
      'the hosting provider as a processor under Art. 28 GDPR. Nothing goes to third parties.',
    'Der Browser bleibt die Wahrheit für den laufenden Besuch, der Server ist die Kopie, die den Gerätewechsel überlebt. Fällt der Server aus, arbeitet die Anwendung weiter – nur eben ohne Abgleich.':
      'The browser remains the truth for the current visit; the server is the copy that survives a change of device. If the server fails, the application carries on – simply without syncing.',
    'Für den Zugriff auf den Speicher deines Browsers ist keine Einwilligung erforderlich: Er ist unbedingt erforderlich, damit der von dir ausdrücklich gewünschte Dienst überhaupt funktioniert (§ 25 Abs. 2 Nr. 2 des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes).':
      'No consent is required for access to your browser’s storage: it is strictly necessary for the service you expressly requested to work at all (§ 25(2) no. 2 TDDDG, the German Telecommunications Digital Services Data Protection Act).',
    'Du kannst diese Daten jederzeit im Fußbereich unter „Meine Daten“ als Datei sichern oder vollständig löschen. Löschst du sie dort, während du angemeldet bist, verschwinden sie auch auf dem Server.':
      'You can save this data as a file or delete it entirely at any time via “My data” in the footer. If you delete it there while signed in, it disappears from the server as well.',

    /* Abschnitt 12: Tresor */
    'in deinem Browser verschlüsselt, bevor sie ihn verlassen':
      'encrypted in your browser before they leave it',
    '– mit AES-GCM und 256 Bit. Der Schlüssel entsteht aus deinem Kennwort und wird nirgends gespeichert; verschlüsselt wird auch der Dateiname.':
      '– with AES-GCM and 256 bits. The key is derived from your passphrase and is stored nowhere; the file name is encrypted too.',
    'Erst danach geht das Chiffrat zum Server. Es liegt dort, damit du deine Unterlagen auf einem zweiten Gerät wiederfindest und damit ein Verweis, den du verschickst, auch dann aufgeht, wenn dein Browser geschlossen ist. Ohne das wäre eine Freigabe wertlos.':
      'Only then does the ciphertext go to the server. It is held there so that you find your documents again on a second device, and so that a link you send opens even while your browser is closed. Without that, sharing would be worthless.',
    'Der Anbieter kann diese Dateien nicht lesen.': 'The provider cannot read these files.',
    'Er hat weder dein Kennwort noch den Schlüssel; im Speicher liegt für ihn Rauschen. Unverschlüsselt liegen genau drei Angaben, ohne die sich der Tresor nicht bedienen ließe: die Art der Unterlage, die du beim Ablegen gewählt hast (etwa „Gehaltsnachweis“), die Größe in Byte und der Zeitpunkt des Ablegens.':
      'It has neither your passphrase nor the key; what sits in storage is noise as far as it is concerned. Exactly three details are held unencrypted, without which the vault could not be operated: the kind of document you chose when filing it (“proof of income”, say), the size in bytes and the time of filing.',
    'Gibst du Unterlagen frei, wird kein Anhang verschickt, sondern ein Verweis. Der Schlüssel dazu steht im Fragmentteil dieses Verweises – dem Teil hinter dem Rautezeichen, den Browser grundsätzlich nicht an Server übertragen. Zur Freigabe selbst wird gespeichert, welche Dokumente sie umfasst, für wen du sie gedacht hast, wann sie abläuft, wie oft sie noch abgerufen werden darf und der Zeitpunkt jedes Abrufs – damit du siehst, ob deine Unterlagen angesehen wurden. Wer abgerufen hat, wird nicht festgehalten.':
      'When you share documents, no attachment is sent – a link is. Its key sits in the fragment part of that link, the part after the hash sign, which browsers as a rule never transmit to a server. For the share itself, what is stored is which documents it covers, whom you intended it for, when it expires, how many retrievals are left and the time of each retrieval – so that you can see whether your documents were looked at. Who retrieved them is not recorded.',
    'Erfüllung des Vertrags über die Nutzung von TrimmoTrade; bei einer Freigabe die Übermittlung an die Stelle, der du sie zugedacht hast':
      'performance of the contract for using TrimmoTrade; in the case of a share, transmission to the party you intended it for',
    'bis du das Dokument löschst, den Tresor leerst oder dein Konto beendest. Eine Freigabe verliert ihre Wirkung mit dem Ablauf, den du gesetzt hast – längstens nach 30 Tagen; widerrufen kannst du sie jederzeit vorher, und der Verweis führt danach sofort ins Leere. Der Eintrag selbst bleibt noch 14 Tage stehen, damit du nachsehen kannst, was du wann freigegeben hast, und wird dann gelöscht.':
      'until you delete the document, empty the vault or close your account. A share stops working at the expiry you set – 30 days at the most; you can revoke it at any time before that, and the link then leads nowhere immediately. The entry itself remains for a further 14 days so that you can look up what you shared and when, and is then deleted.',
    'der Hostinganbieter als Auftragsverarbeiter nach Art. 28 DSGVO; darüber hinaus nur, wem du selbst einen Verweis gibst':
      'the hosting provider as a processor under Art. 28 GDPR; beyond that, only whoever you give a link to yourself',
    'Warum das hier so ausführlich steht: „Ende-zu-Ende-verschlüsselt“ schreiben viele. Prüfbar wird es erst, wenn danebensteht, was':
      'Why this is set out at such length: plenty of people write “end-to-end encrypted”. It only becomes checkable once it says alongside what is',
    'verschlüsselt ist.': 'encrypted.',

    /* Abschnitt 18: Rechte */
    'Auskunft, Übertragbarkeit und Löschung kannst du unmittelbar selbst ausüben, ohne jemanden zu fragen: im Fußbereich unter „Meine Daten“. Was dort als Datei herauskommt, ist derselbe Stand, der zu deinem Konto abgelegt ist; was du dort löschst, verschwindet auch auf dem Server. Für das Konto selbst genügt ein Klick in den Einstellungen – die Löschung wirkt sofort und nimmt Inserate, Ablage und Tresor mit.':
      'Access, portability and erasure you can exercise directly yourself, without asking anyone: via “My data” in the footer. What comes out there as a file is the same state that is stored against your account; what you delete there disappears from the server too. For the account itself a single click in the settings is enough – deletion takes effect immediately and takes listings, stored state and vault with it.',

    /* AGB */
    '(6) Ein entgeltlicher Vertrag kommt erst zustande, wenn in der Anwendung ein Zahlungsweg angeboten wird. Solange das nicht der Fall ist, gibt es keine Schaltfläche, mit der sich Plus kaufen ließe, es werden keine Zahlungsdaten erhoben und es entsteht keine Zahlungspflicht; die Absätze 1 bis 5 beschreiben dann die Bedingungen, zu denen ein Vertrag geschlossen würde. Zugänglich sind die Leistungen von Plus in dieser Zeit über einen Gründerplatz nach § 7.':
      '(6) A paid contract only comes into being once a payment method is offered in the application. For as long as that is not the case there is no button with which Plus could be bought, no payment data is collected and no payment obligation arises; paragraphs 1 to 5 then describe the terms on which a contract would be concluded. During that time the Plus features are available through a founder place under § 7.',
    '(6) § 5 Abs. 6 gilt entsprechend: Ohne angebotenen Zahlungsweg lässt sich bezahlte Sichtbarkeit nicht buchen. Die Reihenfolge der Treffer entsteht dann ausschließlich aus den Angaben der suchenden Person.':
      '(6) § 5(6) applies accordingly: without a payment method on offer, paid visibility cannot be booked. The order of results then arises exclusively from the details given by the person searching.',

    /* Der Datendialog im Fußbereich */
    'Alles, was du hier eingibst, liegt zuerst im Speicher dieses Browsers – Merkliste, Suchaufträge, Nachrichten, eigene Inserate, Profil und Notizen. Ohne Anmeldung bleibt es dort und geht an niemanden. Bist du angemeldet, liegt derselbe Stand zusätzlich in deinem Konto, damit du ihn auf jedem deiner Geräte wiederfindest; ausgewertet wird er nicht, und an Dritte geht nichts. Das Einzelne steht in der':
      'Everything you enter here is held first in this browser’s storage – saved list, saved searches, messages, your own listings, profile and notes. Without an account it stays there and goes to nobody. If you are signed in, the same state is also held in your account so that you find it again on every one of your devices; it is not evaluated, and nothing goes to third parties. The details are in the',
    'Beim Leeren der Browserdaten verschwindet dieser Stand hier. Bist du angemeldet, holt ihn die nächste Anmeldung aus deinem Konto zurück – „Alles zurücksetzen“ löscht ihn dagegen an beiden Stellen.':
      'Clearing your browser data makes this state disappear here. If you are signed in, the next sign-in fetches it back from your account – “Reset everything”, by contrast, deletes it in both places.',

    /* Fußzeile und Profil */
    'Rechtliche Erläuterungen sind allgemeine Hinweise und ersetzen keine Beratung. Unterlagen im Dokumententresor werden verschlüsselt, bevor sie den Browser verlassen.':
      'Legal explanations are general information and are no substitute for advice. Documents in the vault are encrypted before they leave the browser.',
    'TrimmoTrade sortiert und rechnet ausschließlich mit diesen Angaben. Gerechnet wird auf deinem Gerät. Bist du angemeldet, liegen sie zusätzlich in deinem Konto, damit du sie auf jedem Gerät hast; an eine anbietende Seite geht davon nur, was du in einer Anfrage ausdrücklich freigibst.':
      'TrimmoTrade sorts and calculates using these details alone. The calculating happens on your device. If you are signed in, they are also held in your account so that you have them on every device; the only part that reaches an offering side is what you expressly release in an enquiry.',
    'Die Bilder werden schon in deinem Browser auf {4} Pixel Kantenlänge verkleinert und erst dann übertragen – ein Inserat, dessen Fotos niemand sieht, wäre keins. Beim Löschen des Inserats verschwinden sie mit.':
      'The photos are scaled down to {4} pixels on the longest edge in your browser and only then uploaded – a listing whose photos nobody can see would not be one. When the listing is deleted they go with it.',

    /* Tresor-Ansicht ohne Server */
    'Diese Kopie läuft ohne Verbindung; das Chiffrat liegt in diesem Browser, und der Verweis geht deshalb nur auf diesem Gerät auf. Auf':
      'This copy runs without a connection; the ciphertext sits in this browser, so the link only opens on this device. On',
    'liegt es auf dem Server – auch dort nur das Chiffrat –, und der Verweis funktioniert überall.':
      'it sits on the server – there too only the ciphertext – and the link works anywhere.'
  });

  /* ---------------------------------------------------------------
     Was nach dem Wegfall der Werbung übrig blieb, dazu die Tariffragen,
     die Tauschgründe und die Objektbeschreibungen. */
  e({
    /* Werbefreiheit */
    'Werbung gibt es hier nicht': 'There is no advertising here',
    'Werbung wird nicht ausgespielt.': 'No advertising is served.',
    'Ohne Werbung – die gibt es hier nirgends': 'Ad-free – there is none anywhere here',
    'Keine Werbung. Es gibt hier keine Anzeigen – weder eigene noch fremde, weder gekennzeichnet noch getarnt.':
      'No advertising. There are no ads here – neither our own nor anyone else’s, neither labelled nor disguised.',
    '– keine Banner, kein Werbenetzwerk, keine Anzeigen im Gewand eines Inserats. Das ist keine Einstellung, die sich umlegen ließe: Es ist nichts eingebaut, was Werbung ausspielen könnte.':
      '– no banners, no ad network, no ads dressed up as listings. This is not a setting that could be flipped: nothing is built in that could serve advertising.',
    'Auf TrimmoTrade erscheint keine Werbung – weder eigene noch fremde. Es ist kein Werbenetzwerk eingebunden, es werden keine Werbekennungen gesetzt, und es gehen keine Daten an Werbetreibende. Es gibt auch nichts, was sich zuschalten ließe: Die Anwendung enthält keinen Programmteil, der Anzeigen ausspielen könnte.':
      'No advertising appears on TrimmoTrade – neither our own nor anyone else’s. No ad network is embedded, no advertising identifiers are set, and no data goes to advertisers. There is also nothing that could be switched on: the application contains no component capable of serving ads.',
    'Nein. Es gibt kein Werbenetzwerk, keine Kennung für Dritte und nichts, was über dein Verhalten übertragen würde. Gezählt wird nur, wie oft eine Ansicht an einem Tag insgesamt geöffnet wurde – ohne Kennung, ohne Adresse, ohne Reihenfolge.':
      'No. There is no ad network, no identifier for third parties and nothing that would be transmitted about your behaviour. All that is counted is how often a view was opened in total on a given day – without an identifier, without an address, without an order of events.',

    /* Tarif */
    'Wie kann der freie Tarif kostenlos sein?': 'How can the free plan be free?',
    'Weil ihn diejenigen tragen, die Plus nehmen oder ein Inserat hervorheben. Wer eine Wohnung sucht, hat oft gerade wenig Geld – ausgerechnet dann eine Bezahlschranke vor die Suche zu stellen, wäre verkehrt. Deshalb ist alles, was vor Schaden bewahrt oder gerechnet werden muss, dauerhaft frei.':
      'Because it is carried by those who take Plus or promote a listing. People looking for a home often have little money at that very moment – putting a paywall in front of the search precisely then would be wrong. That is why everything that protects you from harm or has to be calculated is free for good.',
    'Getragen wird der freie Tarif von den entgeltlichen Leistungen – TrimmoTrade Plus und die Hervorhebung eigener Inserate. Beide sind dort, wo sie wirken, als bezahlt gekennzeichnet (§ 5b Abs. 1 Nr. 6 des Gesetzes gegen den unlauteren Wettbewerb).':
      'The free plan is carried by the paid services – TrimmoTrade Plus and promoting your own listings. Both are marked as paid wherever they take effect (§ 5b(1) no. 6 of the German Act against Unfair Competition).',
    'Vollständige Suche, dauerhaft kostenlos. Getragen von denen, die Plus nehmen.':
      'The full search, free for good. Carried by those who take Plus.',
    'Für alle, die täglich suchen: keine Limits, weniger Handarbeit.':
      'For everyone searching daily: no limits, less manual work.',
    '(1) Der freie Tarif ist dauerhaft ohne Entgelt nutzbar. Er umfasst die vollständige Suche, die Karte, die Bewertung nach dem eigenen Profil, den Prüfhinweis auf Betrugsmerkmale, den Abgleich mit der ortsüblichen Vergleichsmiete und sämtliche Rechner.':
      '(1) The free plan can be used without payment indefinitely. It comprises the full search, the map, the assessment against your own profile, the fraud-indicator warning, the comparison with the local reference rent (ortsübliche Vergleichsmiete) and all calculators.',
    'Der freie Tarif wird durch die entgeltlichen Leistungen nach den §§ 5 und 6 getragen.':
      'The free plan is carried by the paid services under §§ 5 and 6.',
    '(3) Der Anbieter behält sich vor, den Umfang des freien Tarifs zu ändern. Leistungen, die dem Schutz der Nutzenden dienen – insbesondere Prüfhinweis, Vergleichsmiete und Meldeweg –, bleiben entgeltfrei.':
      '(3) The provider reserves the right to change the scope of the free plan. Services that protect users – in particular the fraud-indicator warning, the reference rent and the reporting channel – remain free of charge.',

    /* Datenschutz: Reste */
    'Du kannst dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere in dem Mitgliedstaat deines Aufenthaltsorts, deines Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Für den Anbieter zuständig ist {28}.':
      'You can lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), in particular in the Member State of your residence, your place of work or the place of the alleged infringement. The authority responsible for the provider is {28}.',
    'Für die Ausübung genügt eine formlose Nachricht an {27}.':
      'An informal message to {27} is enough to exercise them.',
    'Diese Erklärung gilt in der Fassung vom {29}. Ändert sich die Anwendung, wird sie angepasst.':
      'This statement applies in the version of {29}. If the application changes, it will be updated.',
    '13. Keine Werbung': '13. No advertising',
    'in der Erklärung steht.': 'in the statement.',

    /* Anfragen und Bewerbungen */
    '{0} Objekte stehen auf „gemerkt“. TrimmoTrade schreibt für jedes ein eigenes Anschreiben aus deinem Profil – angepasst an Titel, Lage und Preis, nicht als Rundmail.':
      '{0} properties are marked “saved”. TrimmoTrade writes a separate cover message for each one from your profile – tailored to title, location and price, not a circular.',
    '; dabei wird nichts übertragen. Führt sie nicht weiter, kannst du die Zusammenfassung an {19} weitergeben. Das geschieht nur auf deinen ausdrücklichen Klick, über dein eigenes E-Mail-Programm – und':
      '; nothing is transmitted in the process. If it leads nowhere, you can pass the summary on to {19}. That only happens on your explicit click, through your own email program – and',
    'zusätzlich die offenen Beitrittsanfragen': 'plus the pending requests to join',
    'bei {39} Aufrufen': 'across {39} views',

    /* Graffiti-Hinweis und Verkaufspreis */
    'Vor den Fotos: der erste Eindruck von außen': 'Before the photos: the first impression from outside',
    'Was den Verkaufspreis sonst noch bewegt': 'What else moves the sale price',
    'Eine besprühte Fassade drückt den Preis und lässt Kaufinteressenten auf Vernachlässigung schließen – auch bei einer sanierten Wohnung. Entfernen lohnt sich deshalb vor dem ersten Termin. Sandstrahlen und Chemie greifen Putz und Klinker an; Laserreinigung arbeitet chemiefrei und ist auch bei Denkmalschutz zulässig.':
      'A sprayed façade pushes the price down and makes buyers infer neglect – even for a renovated apartment. Removing it therefore pays off before the first viewing. Sandblasting and chemicals attack render and brickwork; laser cleaning works without chemicals and is permitted even on listed buildings.',
    'Laser-Graffitientfernung bei Clean Green Nature': 'Laser graffiti removal at Clean Green Nature',
    'Eigenständiges Unternehmen desselben Inhabers. Für TrimmoTrade entsteht daraus kein Vermittlungsentgelt.':
      'A separate company with the same owner. No referral fee accrues to TrimmoTrade from this.',

    /* Tauschgründe */
    'Beziehung beendet – die Wohnung allein ist zu teuer.':
      'Relationship over – the apartment is too expensive on my own.',
    'Die Kinder sind aus dem Haus – die Wohnung ist zu groß geworden.':
      'The children have moved out – the apartment has become too big.',
    'Die Treppen werden beschwerlich, gesucht wird etwas Barrierefreies.':
      'The stairs are getting hard; looking for something step-free.',
    'Pendeln frisst zu viel Zeit, ich möchte näher an die Arbeit.':
      'Commuting eats too much time; I want to be closer to work.',
    'Studienortwechsel zum kommenden Semester.': 'Moving university for the coming semester.',
    'Wir bekommen Nachwuchs und brauchen ein Zimmer mehr.':
      'We are expecting a baby and need one more room.',
    'Wir wollen näher zur Familie ziehen.': 'We want to move closer to family.',

    /* Objektangaben */
    'Doppelhaushälfte mit Süd-Garten und ausgebautem Dachgeschoss.':
      'Semi-detached house with a south-facing garden and converted loft.',
    'Wohnbaugrundstück mit Altbestand': 'Residential building plot with existing structure',
    'kein Bebauungsplan – § 34 BauGB': 'no development plan – § 34 BauGB',
    'auf dem Balkon': 'on the balcony',
    'nicht erwünscht': 'not wanted',

    /* Angaben zum Anbieter */
    'Die Hilfe leitet Anfragen an das Servicepostfach weiter (service@trimmotrade.de), das Impressum nennt die Geschäftsadresse (info@trimmotrade.de). Bevor das erste Mal jemand darauf antwortet, muss die Domain registriert und das Postfach eingerichtet sein – und jemand muss es lesen. Ein Kontaktweg, der ins Leere geht, ist schlimmer als keiner: Nach § 5 DDG muss die Kontaktaufnahme tatsächlich möglich sein, und wer binnen weniger Tage nicht antwortet, verliert mehr als eine Anfrage.':
      'The help section forwards enquiries to the service mailbox (service@trimmotrade.de); the imprint names the business address (info@trimmotrade.de). Before anyone replies to them for the first time, the domain has to be registered and the mailbox set up – and somebody has to read it. A contact route that leads nowhere is worse than none: under § 5 DDG contact must actually be possible, and anyone who fails to answer within a few days loses more than one enquiry.',
    'etwa „TrimmoTrade“': 'e.g. “TrimmoTrade”',
    '{0} Unterlage fehlt – wer sie parat hat, ist schneller.':
      '{0} document is missing – having it ready makes you faster.',
    '{0} Unterlagen fehlen – wer sie parat hat, ist schneller.':
      '{0} documents are missing – having them ready makes you faster.'
  });

  /* Besichtigungstermine – die Oberfläche dazu. */
  e({
    'Besichtigungstermine': 'Viewing appointments',
    'Feste Zeitfenster statt Massenandrang. Wer einen Platz nimmt, bekommt ihn – und du bekommst eine Mail. Wie viele dabei sind, entscheidest du je Fenster.':
      'Fixed time slots instead of a crowd at the door. Whoever takes a slot gets it – and you get an email. How many people attend is up to you, slot by slot.',
    'Noch kein Termin angelegt. Zwei feste Fenster ersparen erfahrungsgemäß ein Dutzend Nachrichten.':
      'No appointment created yet. Two fixed slots typically save you a dozen messages.',
    'Zum Buchen brauchst du ein Konto – sonst wüsste niemand, wer kommt.':
      'You need an account to book – otherwise nobody would know who is coming.',
    'Wer gebucht hat, bekommt eine Absage per Mail, wenn du ein Fenster entfernst. Die Namen der Buchenden stehen hier nicht – sie stehen in deinem Posteingang, sobald jemand dir schreibt.':
      'Anyone who has booked receives a cancellation by email if you remove a slot. The names of those who booked are not shown here – they appear in your inbox as soon as somebody writes to you.',
    'Fenster anlegen': 'Create slot',
    'Termin entfernen': 'Remove appointment',
    'Einzeltermin': 'Individual viewing',
    'Sammeltermin': 'Group viewing',
    'Videobesichtigung': 'Video viewing',
    'Offene Besichtigung': 'Open house',
    'ausgebucht': 'fully booked',
    'nehmen': 'take',
    'Du hast den {0} um {1} Uhr.': 'You have {0} at {1}.',
    'Die anbietende Seite weiß Bescheid.': 'The offering side has been told.',
    'Dieser Termin ist voll.': 'This appointment is full.',
    'Termin gebucht. Die anbietende Seite ist benachrichtigt.':
      'Appointment booked. The offering side has been notified.',
    'Termin abgesagt.': 'Appointment cancelled.',
    'Fenster angelegt.': 'Slot created.',
    'Fenster entfernt.': 'Slot removed.'
  });

  /* Rückmeldungen beim Buchen und Anlegen von Terminen. */
  e({
    'Termin am {0} um {1} Uhr gebucht.': 'Appointment booked for {0} at {1}.',
    'Termin gebucht.': 'Appointment booked.',
    'Termin abgesagt. Der Platz ist wieder frei.': 'Appointment cancelled. The slot is free again.',
    'Zeitfenster angelegt.': 'Time slot created.',
    'Dieses Zeitfenster entfernen? Wer gebucht hat, bekommt eine Absage.':
      'Remove this time slot? Anyone who booked will get a cancellation.',
    'Entfernt. {0} Buchung abgesagt.': 'Removed. {0} booking cancelled.',
    'Entfernt.': 'Removed.',
    'Wird angelegt …': 'Creating …'
  });

  e({ 'Alle Pflichtangaben sind eingetragen.': 'All mandatory details are filled in.' });

  /* Registrierung, Apple und Instagram. */
  e({
    'Kostenlos, in unter einer Minute. Es gibt kein Passwort – du wählst einen Weg, und damit meldest du dich künftig auch an.':
      'Free, in under a minute. There is no password – you pick a method, and that is how you sign in from then on.',
    'Noch kein Konto?': 'No account yet?',
    'Eins anlegen – kostet nichts': 'Create one – it’s free',
    'Schon ein Konto?': 'Already have an account?',
    'Hier anmelden': 'Sign in here',
    'Merkliste, Profil und Bewerbungen auf allen deinen Geräten – angefangen am Rechner, weiter im Bus':
      'Saved list, profile and applications on every one of your devices – start at the computer, carry on from the bus',
    'Suchaufträge, die dir schreiben, sobald etwas Passendes dazukommt':
      'Saved searches that write to you as soon as something suitable appears',
    'Anfragen an Inserate, Besichtigungstermine buchen, selbst inserieren':
      'Enquire about listings, book viewing appointments, list your own property',
    'Der Dokumententresor: Unterlagen verschlüsselt ablegen und einzeln freigeben':
      'The document vault: store papers encrypted and share them one at a time',

    'Weiter mit Instagram': 'Continue with Instagram',
    'ohne E-Mail-Adresse': 'no email address',

    'E-Mail-Adresse nachtragen': 'Add your email address',
    'Dir fehlt noch eine E-Mail-Adresse.': 'You are still missing an email address.',
    'Ohne sie kann dich niemand erreichen: keine Anfrage auf ein Inserat, keine Absage eines Besichtigungstermins, kein Treffer aus einem Suchauftrag. Umsehen kannst du dich; alles Übrige braucht sie.':
      'Without one nobody can reach you: no enquiry about a listing, no cancellation of a viewing, no match from a saved search. You can look around; everything else needs it.',
    'Jetzt nachtragen': 'Add it now',
    'Deinem Konto fehlt eine Adresse. Solange das so ist, kann dich niemand erreichen: keine Anfrage auf ein Inserat, keine Absage eines Besichtigungstermins, kein Treffer aus einem Suchauftrag. Anfragen und Inserieren sind deshalb gesperrt.':
      'Your account has no address. As long as that is the case nobody can reach you: no enquiry about a listing, no cancellation of a viewing, no match from a saved search. Enquiring and listing are therefore blocked.',
    'Deine E-Mail-Adresse': 'Your email address',
    'Code schicken': 'Send code',
    'Andere Adresse': 'Different address',
    'Wird verschickt …': 'Sending …',
    'Wird geprüft …': 'Checking …',
    'Code verschickt.': 'Code sent.',
    'Adresse bestätigt. Jetzt kann dich jemand erreichen.':
      'Address confirmed. Now people can reach you.',

    'Wählst du einen dieser Wege, erfährt der jeweilige Anbieter, dass du dich bei TrimmoTrade anmeldest. Dein dortiges Passwort bekommt TrimmoTrade nie zu sehen, und es besteht kein Zugriff auf Kontakte, Kalender, Dateien oder Postfach. Was übermittelt wird, ist von Anbieter zu Anbieter verschieden:':
      'If you pick one of these, that provider learns that you are signing in to TrimmoTrade. TrimmoTrade never sees your password there, and there is no access to contacts, calendar, files or mailbox. What is transmitted differs from provider to provider:',
    'Name, E-Mail-Adresse und die Angabe, ob sie bestätigt ist':
      'name, email address and whether it is confirmed',
    'Name und E-Mail-Adresse. Bei einem privaten Konto gilt die Adresse hier nicht als bestätigt, weil sie dort frei wählbar ist; bei einem Geschäfts- oder Schulkonto stammt sie aus dem Verzeichnis des Arbeitgebers.':
      'Name and email address. For a personal account the address does not count as confirmed here, because it can be chosen freely there; for a work or school account it comes from the employer’s directory.',
    'Benutzername und eine Kontokennung.': 'Username and an account identifier.',
    'Keine E-Mail-Adresse': 'No email address',
    '– Instagram gibt keine heraus. Ein so entstandenes Konto ist deshalb nicht erreichbar und steht auf Vertrauensstufe 0, bis du eine Adresse nachträgst und bestätigst.':
      '– Instagram does not release one. An account created this way is therefore unreachable and sits at trust level 0 until you add and confirm an address.',
    'Verantwortlich für die Verarbeitung auf ihrer Seite sind die Anbieter selbst: Google Ireland Limited, Microsoft Ireland Operations Limited und Apple Distribution International Ltd., alle drei mit Sitz in Irland, sowie Meta Platforms Ireland Limited für Instagram. Soweit dabei Daten in die Vereinigten Staaten übermittelt werden, stützt sich das auf den Angemessenheitsbeschluss der Europäischen Kommission zum EU-US Data Privacy Framework; alle vier Anbieter sind darunter zertifiziert.':
      'The providers themselves are the controllers for the processing on their side: Google Ireland Limited, Microsoft Ireland Operations Limited and Apple Distribution International Ltd., all three based in Ireland, plus Meta Platforms Ireland Limited for Instagram. Where data is transferred to the United States, this rests on the European Commission’s adequacy decision for the EU-US Data Privacy Framework; all four providers are certified under it.',
    'Welche dieser Wege tatsächlich angeboten werden, entscheidet die Einrichtung dieses Servers. Ein Anbieter, für den keine Zugangsdaten hinterlegt sind, erscheint gar nicht erst als Schaltfläche – und dann geht auch nichts an ihn.':
      'Which of these are actually offered depends on how this server is set up. A provider with no credentials stored does not appear as a button at all – and then nothing goes to it either.',
    'Wenn die Adresse nachgetragen wird': 'When the address is added later',
    'Entsteht ein Konto ohne E-Mail-Adresse – über Instagram oder mit einem Passkey allein –, fordert die Anwendung dazu auf, eine nachzutragen. Das ist keine Schikane, sondern die Voraussetzung dafür, dass dich überhaupt jemand erreichen kann. Bis dahin lässt sich die Suche benutzen; anfragen, inserieren und Termine buchen nicht.':
      'If an account is created without an email address – via Instagram, or with a passkey alone – the application asks you to add one. That is not red tape but the precondition for anyone being able to reach you at all. Until then you can use the search; enquiring, listing and booking appointments you cannot.',
    'Gehört die nachgetragene Adresse bereits einem anderen Konto, werden die beiden':
      'If the address you add already belongs to another account, the two are',
    'zusammengelegt. Zwei Konten zu verschmelzen hieße, über fremde Inserate, Anfragen und Unterlagen zu entscheiden; das erledigt eine Anmeldung nicht nebenbei. Stattdessen erscheint der Hinweis, sich mit dieser Adresse anzumelden.':
      'merged. Merging two accounts would mean deciding about someone else’s listings, enquiries and documents; a sign-in does not do that in passing. Instead you are told to sign in with that address.',
    'Über die in Abschnitt 4 beschriebene Anmeldung bei Google, Microsoft, Apple oder Instagram hinaus findet keine Übermittlung personenbezogener Daten in Länder außerhalb der Europäischen Union und des Europäischen Wirtschaftsraums statt. Wer das vermeiden möchte, meldet sich mit Passkey oder mit E-Mail-Adresse an – beide Wege kommen ohne fremden Anbieter aus und sind deshalb auch die beiden, die oben stehen.':
      'Beyond the sign-in via Google, Microsoft, Apple or Instagram described in section 4, no personal data is transferred to countries outside the European Union and the European Economic Area. Anyone who wants to avoid this signs in with a passkey or an email address – both work without any external provider, which is also why they are the two listed first.'
  });

  /* Nachgezogen: Apple ist wieder raus, dafür die Gerätewörter für den
     Passkey und der Hinweis in der serverlosen Vorschau. */
  e({
    'Anmeldung über Google, Microsoft oder Instagram':
      'Signing in via Google, Microsoft or Instagram',
    'Verantwortlich für die Verarbeitung auf ihrer Seite sind die Anbieter selbst: Google Ireland Limited und Microsoft Ireland Operations Limited, beide mit Sitz in Irland, sowie Meta Platforms Ireland Limited für Instagram. Soweit dabei Daten in die Vereinigten Staaten übermittelt werden, stützt sich das auf den Angemessenheitsbeschluss der Europäischen Kommission zum EU-US Data Privacy Framework; alle drei Anbieter sind darunter zertifiziert.':
      'The providers themselves are the controllers for the processing on their side: Google Ireland Limited and Microsoft Ireland Operations Limited, both based in Ireland, plus Meta Platforms Ireland Limited for Instagram. Where data is transferred to the United States, this rests on the European Commission’s adequacy decision for the EU-US Data Privacy Framework; all three providers are certified under it.',
    'Über die in Abschnitt 4 beschriebene Anmeldung bei Google, Microsoft oder Instagram hinaus findet keine Übermittlung personenbezogener Daten in Länder außerhalb der Europäischen Union und des Europäischen Wirtschaftsraums statt. Wer das vermeiden möchte, meldet sich mit Passkey oder mit E-Mail-Adresse an – beide Wege kommen ohne fremden Anbieter aus und sind deshalb auch die beiden, die oben stehen.':
      'Beyond the sign-in via Google, Microsoft or Instagram described in section 4, no personal data is transferred to countries outside the European Union and the European Economic Area. Anyone who wants to avoid this signs in with a passkey or an email address – both work without any external provider, which is also why they are the two listed first.',

    /* Wie der Passkey auf dem jeweiligen Gerät heißt. */
    'Mit Face ID oder Touch ID': 'With Face ID or Touch ID',
    'Mit Windows Hello': 'With Windows Hello',
    'Mit Fingerabdruck oder Gesicht': 'With fingerprint or face',
    'Kein Passwort. Dein Gerät bestätigt, dass du es bist – beim nächsten Mal genügt ein Blick.':
      'No password. Your device confirms it is you – next time a glance is enough.',

    /* Die Vorschau ohne Server. */
    'Diese Vorschau läuft ohne Server.': 'This preview runs without a server.',
    'Passkey und E-Mail-Code funktionieren hier wirklich':
      'Passkey and email code really do work here',
    '– Google, Microsoft und Instagram brauchen den Server und sind nur angedeutet.':
      '– Google, Microsoft and Instagram need the server and are only indicated.',

    'Dokumententresor': 'Document vault'
  });

  e({
    'Instagram ist der eine Weg, der keine E-Mail-Adresse liefert – die gibt es dort nicht zum Anfordern. Wer so hereinkommt, trägt sie danach nach; ohne sie kann dich niemand erreichen.':
      'Instagram is the one route that does not supply an email address – there is nothing to request there. Anyone coming in that way adds one afterwards; without it nobody can reach you.'
  });

  e({ 'TrimmoTrade Plus aktiv': 'TrimmoTrade Plus active' });

  /* Der Fußbereich in Spalten */
  e({
    'Rechtliches': 'Legal',
    'Ratgeber': 'Guides',
    'In der Anwendung': 'In the app',
    'Mietmarkt, WG-Suche und Wohnungstausch in einer Oberfläche – mit einem Profil und einer Bewerbermappe.':
      'Rentals, flatshares and apartment swaps in one interface – with one profile and one application folder.'
  });

})(window.TT = window.TT || {});
