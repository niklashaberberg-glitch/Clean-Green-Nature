# TrimmoTrade

Eine Wohnungssuche, die Mietmarkt, Kaufangebote, WG-Zimmer und Wohnungstausch
in **einer** Oberfläche zusammenführt – mit einem Profil, einer Merkliste und
einer Bewerbermappe für alle vier Welten.

Läuft in zwei Lagen, und in beiden vollständig:

**Mit Server** (www.trimmotrade.de): ein echter Marktplatz. Inserate werden
veröffentlicht, Anfragen erreichen Menschen, Suchaufträge schicken Mails.
Auf dem Server liegen genau zwei Dinge – wer jemand ist, und was öffentlich
angeboten wird. Merkliste, Vergleich, Profil, Dokumententresor und jede
Berechnung bleiben im Browser.

**Ohne Server** (Einzeldatei, Kopie auf dem Stick, `file://`): dieselbe
Anwendung als Vorführung. Nichts verlangt eine Verbindung, nichts bricht ab,
und an jeder Stelle steht, dass es eine Vorführung ist.

> **Was jetzt zu tun ist**, damit daraus ein Betrieb wird, steht in
> [`START.md`](START.md). Warum – und woran ein Wohnungsportal in Deutschland
> scheitert – steht in [`GESCHAEFT.md`](GESCHAEFT.md).

---

## Das Geschäftsmodell in einem Satz

> **Plus bezahlt Zeitersparnis und Sichtbarkeit – nie, was jemand über eine
> Wohnung erfährt.**

Daraus folgt die ganze Aufteilung:

* **Frei bleibt, was schützt.** Prüfhinweis gegen Betrug, Vergleichsmiete,
  Mietpreisbremse, die ehrliche Chancen-Einschätzung, das Erkennen doppelt
  eingestellter Wohnungen. Betrugsschutz hinter eine Bezahlschranke zu stellen
  wäre zynisch.
* **Frei bleibt, was gerechnet werden muss.** Leistbarkeit, Wohngeld, WBS,
  echte Monatskosten, Nebenkostenprüfung, Übergabeprotokoll, Umzugsplan. Das
  braucht man ein paarmal im Leben – dafür ein Abo zu verlangen wäre unverschämt.
* **Frei bleibt die vollständige Suche.** Alle Inserate, alle vier
  Angebotsarten, Karte, Passung, Merkliste. Finanziert über Anzeigen.
* **Plus kostet, was jemand zehnmal am Tag anfasst.** Mehrere Suchaufträge,
  Serienbewerbung, Vertragslupe vollständig, Ringtausch über drei und vier
  Haushalte, mehrere Ankerpunkte, Marktdaten, Route für Besichtigungen,
  Erinnerung ans Nachfassen – und keine Anzeigen.

**Was Plus ausdrücklich nicht kauft:** keine andere Trefferreihenfolge, keinen
Frühzugang zu Inseraten, keine Daten anderer Nutzer, keinen besseren
Datenschutz gegen Aufpreis, keine bessere Bewertung eines Angebots.

## Bezahlte Sichtbarkeit

Zwei Dinge kauft Geld sehr wohl, und beide sind Sichtbarkeit:

1. **Anfragen von Plus-Nutzenden stehen im Postfach der anbietenden Seite
   oben** und sind dort mit „Plus“ gekennzeichnet.
2. **Inserate lassen sich hervorheben** – nach oben schieben für 2,90 €,
   farbig hervorheben für 6,90 € (7 Tage), Top-Anzeige für 14,90 € (7 Tage).
   Mit Plus 20 % günstiger.

Beides ist an eine Bedingung geknüpft, von der nicht abgewichen wird: **Es
wird angezeigt.**

* Eine Anfrage, die oben steht, weil sie bezahlt ist, trägt das Wort „Plus“.
  Daneben steht für die anbietende Seite lesbar, dass die Reihenfolge bezahlt
  ist und *nichts über die Eignung der Person aussagt*. Keine Anfrage wird
  gekürzt, versteckt oder gelöscht, weil jemand nicht zahlt.
* Ein hervorgehobenes Inserat steht in einem **eigenen, beschrifteten Block
  über** den Treffern, höchstens zwei auf einmal – nie zwischen ihnen. Die
  Liste darunter folgt weiter dem Profil, und die Erklärung „warum steht das
  ganz oben" sagt das ausdrücklich.

Der Grund ist nicht nur Anstand: Bezahlte Platzierung in Suchergebnissen ist
nach § 5b Abs. 1 Nr. 6 und Abs. 2 UWG kennzeichnungspflichtig. Untergemischte
Werbeplätze wären also ohnehin unzulässig – vor allem aber wären sie der
Anfang vom Ende jeder nachvollziehbaren Suche.

Diese Aufteilung hat auch einen ökonomischen Grund: Sie lässt den zahlen, der
etwas davon hat – die anbietende Seite –, und nicht den, der gerade eine
Wohnung sucht und meist wenig Geld hat.

Alles, was mit der **Wohnung selbst** zu tun hat – Prüfhinweis gegen Betrug,
Vergleichsmiete, Chancenschätzung, echte Kosten, Vertragslupe –, bleibt im
freien Tarif vollständig. Diese Grenze verschiebt sich nicht.

**Gründerplätze.** Die ersten 10.000 Anmeldungen bekommen Plus zwölf Monate
ohne Bezahlung. Das ist bewusst **kein Abo mit Gratismonat**: Es werden keine
Zahlungsdaten hinterlegt, nichts verlängert sich, und niemand muss kündigen.
Vier Wochen vor Ablauf erscheint ein Hinweisband, danach greift wieder der
freie Tarif. Wer weitermachen will, entscheidet sich aktiv dafür.

Die Plätze werden nicht zentral gezählt — dafür müsste die Serverseite mehr
tun als anmelden. Der Zähler ist deshalb ausdrücklich eine Hochrechnung aus
der Zeit seit dem Start, und die Anwendung sagt das an jeder Stelle dazu, an
der sie ihn zeigt.

| | TrimmoTrade frei | TrimmoTrade Plus |
|---|---|---|
| Preis | 0 € | 7,90 € im Monat, 69 € im Jahr |
| Suche, Karte, Passung | vollständig | vollständig |
| Prüfhinweis, Vergleichsmiete, Chancen | vollständig | vollständig |
| Alle Rechner und Prüfhilfen | vollständig | vollständig |
| Anzeigen | ja | nein |
| Suchaufträge | 1 | unbegrenzt |
| Ankerpunkte für Fahrzeiten | 1 | unbegrenzt |
| Objekte im Vergleich | 2 | 6 |
| Vertragslupe | erster Fund | alle Funde mit Erläuterung |
| Ringtausch | direkte Tausche | Ketten über drei und vier Haushalte |
| Serienbewerbung, Nachfass-Erinnerung, Route | – | ja |
| Marktdaten und Preisverlauf | – | ja |
| Exposé als Datei | – | ja |

Die Anzeigen im freien Tarif sind immer als Anzeige gekennzeichnet, sehen nie
aus wie ein Inserat und stehen nie in der Trefferreihenfolge. Welche erscheint,
entscheidet sich im Browser anhand der Stelle auf der Seite – nicht anhand des
Profils. Es gibt kein Werbenetzwerk, keine Kennung und nichts, was übertragen
würde.

In der Vorführung lässt sich Plus oben rechts mit einem Klick an- und
abschalten, damit beide Welten vergleichbar sind.

---

## Sofort ausprobieren

```
trimmotrade/dist/trimmotrade.html      per Doppelklick öffnen – das war es
```

Oder die aufgeteilte Fassung mit einem beliebigen Webserver:

```bash
cd trimmotrade
python3 -m http.server 8080      # dann http://localhost:8080 öffnen
```

Beide Fassungen enthalten denselben Stand. Die Einzeldatei entsteht aus den
Quelldateien mit `node build.js` und braucht dafür nichts installiert.

In beiden Fällen ist die Anmeldung **nachgebildet** und sagt das an jeder
Stelle: Ohne Serverseite gibt es niemanden, der eine Mail verschicken oder
eine Signatur prüfen könnte. Wie die echte Anmeldung aufgesetzt wird, steht
in [DEPLOY.md](DEPLOY.md); was dahintersteckt, unter [Anmeldung](#anmeldung).

---

## Was die App kann

### Eine Suche über vier Angebotsarten

Mieten, Kaufen, WG-Zimmer und Wohnungstausch liegen nicht in getrennten
Portalen, sondern nebeneinander in derselben Trefferliste. Die Filter passen
sich der Auswahl an: Wer WG-Zimmer sucht, bekommt zusätzlich WG-Art, Rauchen
und Haustiere; wer kauft, sieht Kaufpreis statt Warmmiete.

Filterbar sind Stadt und Viertel, Preis, Zimmer, Fläche, Baujahr,
Energieklasse, sechzehn Ausstattungsmerkmale, Einzugstermin, Anbieterart,
Provisionsfreiheit, freier Umkreis auf der Karte und – sobald ein Ankerpunkt
im Profil steht – die maximale Fahrzeit zur Arbeit.

### Ein Profil, das überall gilt

Das Profil ist die einzige Stelle, an der jemand seine Suche beschreibt.
Städte, Budget, Zimmer, Fläche und Einzugstermin wandern von dort in die
Suchfilter, das Einkommen in den Leistbarkeitsrechner, die Haushaltsgröße in
Wohngeld und WBS, der Einzugstermin in den Umzugsplan, die Bewerbermappe ins
Anschreiben. Wer einmal filtert, behält die Kontrolle – ab dann folgt die Suche
nicht mehr automatisch, sondern nur noch auf Knopfdruck („Aus meinem Profil
füllen“), und ein Hinweis zeigt, wo Filter und Profil auseinanderlaufen.

Das Profil startet dabei **leer**. Erfundene Vorgaben wären bequem, lenken die
Suche aber, ohne dass jemand sie gewählt hätte: Ein vorbelegtes Pflichtmerkmal
blendet stillschweigend Wohnungen aus, ein erfundenes Einkommen verfälscht die
Chancenrechnung. Solange nichts eingetragen ist, sagt TrimmoTrade bei den Chancen
ausdrücklich „noch nicht einschätzbar“ – statt eine schwache Bewerbung zu
unterstellen, die es gar nicht beurteilen kann.

Umgekehrt gleicht der Leistbarkeitsrechner ab: Wer mit einem Budget sucht, das
die eigene Rechnung nicht hergibt, bekommt das gesagt – mit einem Knopf, der
Profil und Suche in einem Schritt korrigiert.

### Eine Reihenfolge, die sich erklärt

Es gibt keine bezahlten Plätze. Jedes Inserat bekommt eine Passung von 0 bis
100, die sich aus deinen eigenen Gewichtungen ergibt: Preis, Lage, Zuschnitt,
Ausstattung, Energie, Arbeitsweg, Preis-Leistung. Auf der Objektseite steht
aufgeschlüsselt, welcher Teil wie viel beigetragen hat. Über der Trefferliste
erklärt ein Aufklapper, warum das erste Ergebnis das erste ist.

### Wenn nichts passt

Bei null oder sehr wenigen Treffern rechnet TrimmoTrade jede mögliche Lockerung
einzeln durch und zeigt nur die, die wirklich Treffer bringen – mit der Zahl
dahinter. Entscheidend ist die Reihenfolge: Sortiert wird nicht nach Ertrag,
sondern nach Ertrag **gegen Eingriffstiefe**. „Such doch in einer anderen
Stadt“ bringt naturgemäß die meisten Treffer und ist zugleich der einzige
Vorschlag, der die Suche im Kern verändert – wer wegen einer neuen Stelle nach
Köln zieht, ist mit fünf Berliner Wohnungen nicht geholfen. Solche Vorschläge
stehen deshalb abgesetzt am Ende und sagen ausdrücklich, dass sie die Suche
grundlegend ändern.

Nicht dabei: den Prüfhinweis abschalten. Betrugsschutz ist keine Stellschraube,
an der man dreht, um mehr Treffer zu bekommen.

### Vergleichsmiete statt Bauchgefühl

Jede Miete wird gegen einen Vergleichswert für Viertel, Baujahr und Größe
gestellt und als Abweichung in Prozent gezeigt. Liegt die Miete mehr als 10 %
darüber, weist TrimmoTrade auf die Mietpreisbremse hin und nennt den Betrag, der
danach zulässig wäre. Beim Kauf gibt es stattdessen Preis je m²,
Kaufpreisfaktor und Bruttomietrendite.

### Vertragslupe

Der Inseratstext wird auf zwölf Formulierungen geprüft, die im Mietvertrag
Geld oder Rechte kosten: Kaution über drei Monatsmieten, Courtage für eine
Mietwohnung, Schönheitsreparaturen, Abstandszahlung, Staffel- und Indexmiete,
Möblierungszuschlag, pauschales Haustierverbot, angekündigter Eigenbedarf,
Wohnberechtigungsschein, Vergabe ohne Besichtigung, Zahlung vor Übergabe.
Zu jedem Fund gibt es die Fundstelle im Original, eine Einordnung und die
Fundstelle im Gesetz. Das sind allgemeine Hinweise, keine Rechtsberatung.

### Prüfhinweis gegen erfundene Inserate

Ungewöhnlich niedrige Miete, ein wenige Tage altes Anbieterkonto, „bin gerade
im Ausland“, Schlüssel per Kurier, keine Besichtigung: TrimmoTrade erkennt die
gängigen Muster, rechnet daraus eine Risikozahl und blendet Inserate mit
deutlicher Warnung standardmäßig aus – sichtbar und mit einem Schalter
umkehrbar.

### Was es wirklich kostet

Nicht nur die Warmmiete, sondern Strom nach Haushaltsgröße, Internet,
Rundfunkbeitrag und Versicherung. Dazu die Einmalkosten: Kaution, Courtage,
Küche, Umzug, Ummeldung. Am Ende steht die Summe fürs erste Jahr und die
Mietbelastungsquote mit Ampel. Bei Kaufobjekten kommt eine Finanzierungs-
rechnung dazu, samt Grunderwerbsteuer nach Bundesland.

### Ringtausch

Der direkte Wohnungstausch scheitert daran, dass zwei Haushalte exakt das
Gegenteil voneinander wollen müssen. TrimmoTrade baut aus allen Tauschangeboten
einen gerichteten Graphen – eine Kante bedeutet „diese Wohnung erfüllt meine
Suche“ – und sucht darin geschlossene Ketten mit zwei, drei oder vier
Beteiligten. Jede Kette bekommt eine Güte, das schwächste Glied wird benannt,
und wo Abstriche nötig sind, stehen sie dabei.

Für das eigene Angebot rechnet TrimmoTrade zusätzlich durch, welche Lockerung
wie viele zusätzliche Ketten öffnen würde – jede Variante einzeln
durchgerechnet, nicht geschätzt.

### WG-Passung

Sechs Dimensionen – Ordnung, Lautstärke, Besuch, Nähe, Rhythmus, Küche –
werden zwischen deinem Profil und der WG verglichen und als Doppelskala
gezeigt. Harte Grenzen der WG (Alter, gesuchtes Geschlecht, Rauchen,
Haustiere) erscheinen als Ausschlusskriterium statt als stiller Abzug.

### Bewerbermappe und Anschreiben

Aus dem Profil entsteht ein vorformuliertes Anschreiben, das sich vor dem
Absenden ändern lässt. Daneben steht, welche Unterlagen bereitliegen und
welche fehlen – mit dem Hinweis, dass Schufa und Ausweiskopie vor der
Besichtigung bei niemandem etwas zu suchen haben.

Der Brief sagt dabei nur zu, was tatsächlich vorliegt. Ein Anschreiben, das
Unterlagen verspricht, die es nicht gibt, fliegt spätestens bei der
Besichtigung auf.

### Dokumententresor

Wer sich auf zwanzig Wohnungen bewirbt, verschickt zwanzig Mal
Gehaltsnachweise, Ausweiskopie und Schufa – an Fremde, per E-Mail, ohne
Ablaufdatum. Die Unterlagen liegen danach in zwanzig Postfächern und bleiben
dort für immer.

TrimmoTrade kehrt das um. Die Dateien werden einmal im Browser verschlüsselt
abgelegt; verschickt wird nie die Datei, sondern ein Verweis, der nach
gesetzter Frist und gesetzter Zahl von Abrufen erlischt und sich jederzeit
widerrufen lässt. Jeder Abruf wird protokolliert.

Die Verschlüsselung ist echt, nicht angedeutet:

* **AES-GCM mit 256 Bit** für Inhalt und Dateiname. Auch der Name wird
  verschlüsselt – er verrät sonst mehr, als vielen bewusst ist.
* **PBKDF2 mit 310.000 Runden** leitet den Tresorschlüssel aus dem Kennwort
  ab. Der Schlüssel wird nirgends gespeichert; er lebt im Arbeitsspeicher,
  solange der Tresor offen ist, und ist nach dem Neuladen weg.
* **Ein eigener Schlüssel je Dokument**, umschlossen vom Tresorschlüssel. Nur
  deshalb lässt sich eine einzelne Gehaltsabrechnung freigeben, ohne den
  ganzen Tresor zu öffnen.
* **Der Freigabeschlüssel steht im Fragment** des Verweises, also hinter dem
  Rautezeichen. Diesen Teil senden Browser nie an einen Server. Ein Betreiber
  sähe die Anfrage, aber nie den Schlüssel.

Bei gesperrtem Tresor bleiben nur Art, Größe und Datum lesbar – gerade genug
für die Liste, sonst nichts. Was hier fehlt, ist der Server: In dieser
Vorführung liegt das Chiffrat in derselben Browser-Datenbank, weshalb ein
Verweis nur auf demselben Gerät funktioniert. Im Betrieb läge dort das
Chiffrat und sonst nichts.

Im Anschreiben und in der Serienbewerbung steckt die Freigabe direkt im
Formular. Die Serienbewerbung erzeugt bewusst **je Empfänger einen eigenen
Verweis** – ein gemeinsamer wäre ein Generalschlüssel, den jede Seite
weiterreichen könnte, und der Abrufzähler liefe für alle zusammen.

Der Tresor liegt vollständig im freien Tarif. Wer für Datenschutz zahlen muss,
hat keinen.

### Inserieren: vermieten, verkaufen, tauschen

Sechs Angebotsarten aus einem Formular: Wohnung vermieten, WG-Zimmer,
Wohnung tauschen, **Wohnung verkaufen, Haus verkaufen, Grundstück
verkaufen**. Welche Felder erscheinen, richtet sich nach der Art – beim
Verkauf Kaufpreis, Käuferprovision und Hausgeld statt Kaltmiete und Kaution,
beim Haus zusätzlich Grundstücksfläche und Bauweise.

Ein Grundstück ist dabei kein Sonderfall mit ausgegrauten Feldern, sondern
ein eigener Objekttyp. Es hat keine Zimmer, keine Etage und **keinen
Energieausweis** – § 80 GEG verlangt ihn nur für Gebäude, und eine erfundene
Klasse hinzuschreiben wäre schlechter, als das Feld wegzulassen. Stattdessen:
Grundstücksfläche, Art des Baulands, Bebauungsplan, Grund- und
Geschossflächenzahl, Erschließung.

Die Bewertung folgt: Ein unbebautes Grundstück gegen den Quadratmeterpreis
einer Wohnung zu stellen wäre grober Unfug, und ein Kaufpreisfaktor in
Jahresmieten ergibt keinen Sinn, wenn nichts vermietet werden kann. Deshalb
rechnet TrimmoTrade hier gegen einen aus dem örtlichen Preisniveau abgeleiteten
Bodenwert, zeigt die überbaubare Fläche aus GRZ und GFZ und weist auf die
Bauvoranfrage hin, wenn kein Bebauungsplan vorliegt. Die Kostenrechnung kennt
den Unterschied ebenfalls: Grunderwerbsteuer und Notar ja, Hausgeld und
Rundfunkbeitrag nein, dafür Erschließung und Bodengutachten.

Beim Kauf heißt es außerdem nicht „Anschreiben“, sondern **Anfragen** – mit
den fünf Fragen, deren Antworten den Preis mitbestimmen, und ohne
Einkommensangabe. Wer beim Kauf gleich schreibt, was er verdient, gibt seine
Verhandlungsposition ohne Not preis.

### Fotos im Inserat

Ein Knopf im Formular, bis zu zehn Bilder. Sie werden im Browser auf 1.400
Pixel Kantenlänge verkleinert und als JPEG abgelegt – ein Foto aus einer
heutigen Kamera hat gut vier Megabyte, und der Speicher eines Browsers fasst
insgesamt oft nur fünf. Danach bleiben rund 150 Kilobyte, ohne dass man den
Unterschied sieht.

Das erste Bild ist das Titelbild, die Reihenfolge lässt sich ändern, jedes
Bild kann eine Unterschrift bekommen. Wo Fotos liegen, ersetzen sie die
gezeichneten Ansichten vollständig – halb gezeichnet, halb fotografiert wäre
nur verwirrend – und der Hinweis unter der Galerie ändert sich mit. Reicht
der Speicher nicht, wird das Inserat wieder zurückgenommen statt halb
angelegt zu bleiben.

Dazu steht im Formular, was auf ein Inseratsfoto nicht gehört: keine Personen
ohne Einwilligung, keine Kennzeichen, keine Namensschilder an Klingel oder
Briefkasten. Fotos bewohnter Innenräume dürfen ohne Zustimmung der Mietpartei
nicht veröffentlicht werden.

### Ringtausch in vier Bildern

Der Ringtausch war bisher in Sätzen erklärt, und Sätze reichen dafür nicht:
Wer zum ersten Mal davon hört, stellt sich einen Tausch zwischen zwei Leuten
vor und stolpert genau an der Stelle, an der es interessant wird – dass
niemand die Wohnung dessen bekommt, dem er die eigene gibt.

Ein Knopf auf der Ringtausch-Seite und auf der Startseite öffnet deshalb vier
Bilder, die sich durchblättern lassen: warum der direkte Tausch fast nie
klappt, wie die Kette das löst, was am Umzugstag passiert, und was ein Ring
braucht, damit er hält. Die Bilder sind gezeichnet, nicht geladen – reines
SVG, das die Farben der Oberfläche übernimmt und in hell wie dunkel
funktioniert.

### Bewerbungstafel

Jedes gemerkte Objekt durchläuft sechs Stufen: gemerkt, angeschrieben,
Termin, Unterlagen raus, Zusage, Absage. Daraus errechnet TrimmoTrade eine
Erfolgsquote – nützlich, um zu merken, ob die Suche zu eng oder das
Anschreiben zu blass ist.

### Besichtigung

Feste Zeitfenster statt Massenbesichtigung, dazu eine Checkliste mit sechzehn
Fragen von Schimmel über Wasserdruck bis zur letzten Nebenkostenabrechnung.
Notizen und Haken lassen sich als Text herauskopieren.

### Wie stehen deine Chancen?

Die meisten Portale sagen dazu nichts, weil die ehrliche Antwort unangenehm
ist. TrimmoTrade trennt, was der Mensch in der Hand hat, von dem, was er nicht in
der Hand hat: **die Stärke deiner Bewerbung** (Einkommen zur Kaltmiete,
Unterlagen, Zeitpunkt, Belegung, WBS) und **den Andrang** (wie viele sich
bereits gemeldet haben). Nur das Erste kannst du ändern – deshalb steht es
links und in der Ampel, und darunter stehen konkrete Schritte.

Eine einzige Prozentzahl würde beides vermischen und nur entmutigen.

### Doppelt eingestellte Wohnungen erkennen

Dieselbe Wohnung steht auf Portalen regelmäßig zweimal – vom Eigentümer und
vom beauftragten Makler, oder von zwei Maklern zugleich. Wer das nicht merkt,
bewirbt sich zweimal auf dasselbe Objekt und wirkt unentschlossen. TrimmoTrade
vergleicht Fläche, Zuschnitt, Baujahr, Etage, Lage und Preis und benennt die
Übereinstimmungen.

### Nebenkostenabrechnung prüfen

Der Katalog der Betriebskostenverordnung ist abschließend: 15 Posten dürfen
umgelegt werden, 8 häufig auftauchende nicht – auch dann nicht, wenn der
Mietvertrag es behauptet. TrimmoTrade stellt beide Listen gegenüber, rechnet die
Summen und prüft die beiden Fristen, an denen die meisten Abrechnungen
scheitern: zwölf Monate für den Zugang, zwölf Monate für deine Einwendungen.
Am Ende steht ein vorformulierter Widerspruch.

### Übergabeprotokoll

Der wichtigste Zettel des ganzen Umzugs, und fast überall passiert er auf einem
Blatt Papier. Zählerstände mit Nummer, Schlüssel nach Art gezählt, jeder Raum
einzeln mit Zustand und Mängeln. Am Ende ein sauberer Text zum Ausdrucken.
Was hier nicht steht, gilt später als nicht vorhanden.

### Was kann ich mir leisten?

Zwei Grenzen, die ständig verwechselt werden: was dein Haushalt tragen kann
(die 30-Prozent-Faustregel) und was Vermieter sehen wollen (das Dreifache der
Kaltmiete als Netto). TrimmoTrade zeigt beide, sagt welche die engere ist, und
rechnet für jede Stadt aus, wie groß die Wohnung damit sein dürfte.

### Wohnberechtigungsschein und Wohngeld

Beide Leistungen bleiben massenhaft ungenutzt, weil viele annehmen, sie stünden
ihnen nicht zu.

Beim **WBS** rechnet TrimmoTrade den fiddligen Teil – das maßgebliche
Jahreseinkommen mit Werbungskosten-, Steuer-, Kranken- und Rentenpauschale und
den Freibeträgen – und stellt es der Einkommensgrenze gegenüber. Die Grenze
setzen aber die Länder selbst und weichen erheblich voneinander ab. Deshalb
rechnet TrimmoTrade nicht heimlich mit einer Zahl, sondern legt sie offen und
macht sie änderbar; voreingestellt ist der Bundesrahmen aus § 9 WoFG.

Beim **Wohngeld** gibt es bewusst keinen Eurobetrag. Die Höhe folgt einer Formel
mit Beiwerten, die je nach Haushaltsgröße verschieden sind und regelmäßig
geändert werden, und hängt zusätzlich an der Mietstufe der Gemeinde. Eine
ausgedachte Zahl wäre schlimmer als keine – sie würde vom Antrag abhalten oder
falsche Hoffnung machen. TrimmoTrade prüft stattdessen die Ausschlussgründe, ordnet
Einkommen und Mietbelastung ein und sagt, wo der Betrag herkommt.

### Marktdaten und Preisverlauf

Angebotsmieten je Quadratmeter, Monat für Monat über drei Jahre, für jedes
Viertel. Bis zu drei Viertel nebeneinander, dazu der Stadtdurchschnitt als
Bezugslinie. Die Farben der drei Reihen sind auf Farbfehlsichtigkeit geprüft –
alle Paare, hell und dunkel – und jede Linie trägt zusätzlich am Ende ihren
Namen. Es gibt eine Tabellenansicht für alle, die lieber Zahlen lesen.

### Weitere Werkzeuge

* **Vergleich** – bis zu vier Objekte in einer Tabelle, mit dem jeweils besten
  Wert je Zeile hervorgehoben.
* **Suchaufträge** – gespeicherte Filter, die beim nächsten Besuch zeigen, was
  seither neu dazugekommen ist.
* **Umzugsplan** – neunzehn Aufgaben mit Fristen, die sich aus dem
  Einzugstermin ergeben, inklusive der drei Monate Kündigungsfrist.
* **Mieten oder kaufen** – ein ehrlicher Vergleich: Der Mietende legt das
  Eigenkapital an und investiert die monatliche Differenz. Verglichen wird das
  Vermögen am Ende, nicht die Rate.
* **Inserieren** – Wohnung, WG-Zimmer oder Tauschangebot einstellen; das
  eigene Tauschangebot geht sofort in die Ringsuche ein.
* **Nachrichten** – Verläufe je Inserat, mit der Antwortquote des Anbieters
  daneben.
* **Nachfassen** – wer angeschrieben hat und seit Tagen nichts hört, bekommt
  eine Erinnerung und einen vorformulierten Text.
* **Serienbewerbung** – aus der Merkliste heraus, mit einem eigenen Anschreiben
  je Objekt. Ausdrücklich keine Rundmail: Wer erkennbar hundertfach kopiert,
  wird aussortiert.
* **Besichtigungen als Route** – Termine eines Tages nach kürzestem Weg
  geordnet, mit Fahrzeiten dazwischen und einer Warnung, wenn zwei Termine
  zeitlich nicht zusammenpassen.

---

## Farben

**Waldgrün, nicht Petrol.** Der Unterschied ist kein Geschmack, sondern
Wiedererkennung: Petrol und Orangerot tragen fast alle deutschen
Wohnungsportale. TrimmoTrade steht auf einem tiefen, gedeckten Grün mit **Beere**
als Zweitfarbe; die warmen, leicht sandigen Grauwerte halten es davon ab, ins
Krankenhausgrüne zu kippen, und die gezeichneten Ansichten der Wohnungen
ziehen mit.

„Gut" ist dabei bewusst limegrüner als der Markenton – sonst verschwimmen
Zustand und Marke zu einer grünen Suppe.

Statusfarben bleiben konventionell: Grün, Gelb und Rot bedeuten überall
dasselbe. Sie umzufärben, damit sie zum Markenton passen, würde
Verständlichkeit gegen Geschmack tauschen.

Jeder Wert ist nachgerechnet, nicht geschätzt. `node scripts/farben-pruefen.js
assets/app.css` liest die Token aus dem Stylesheet und meldet:

* Fließtext unter 4,5 zu 1 gegen irgendeine der fünf Flächen
* Schrift auf gefüllter Fläche unter 4,5 zu 1
* **Ränder von Bedienelementen unter 3 zu 1** (WCAG 1.4.11). Dafür gibt es
  ein eigenes Token `--rand-feld`: Ein Strukturstrich darf leise sein, ein
  Eingabefeld nicht – wer den Rahmen nicht sieht, sieht das Feld nicht.
  Beim alten Stand lag dieser Wert bei 1,7 zu 1.
* Diagrammfarben mit einem Abstand unter ΔE 9 (CIEDE2000) – geprüft normal
  und unter Prot-, Deuter- und Tritanopie. Beim alten Stand lagen Kauf und
  WG im Dunkelmodus bei ΔE 1,4 und waren damit für einen erheblichen Teil
  der Menschen nicht zu unterscheiden.

## Werbung

Zwei Anforderungen, die sich widersprechen, und beide gelten: **leise** und
**unverwechselbar**.

Leise heißt: kein Kasten, der lauter ist als ein Inserat, keine gefüllte
Fläche, kein Knopf in Akzentfarbe, kein Bild, das mit den Wohnungsbildern
konkurriert. Unverwechselbar heißt: Man darf keine Sekunde im Zweifel sein,
dass es Werbung ist. Gelöst ist das über eine eigene Grundfarbe – warm statt
grün –, einen Streifen an der linken Kante und das Wort „Anzeige“ in Versalien
darüber. Nicht über Lautstärke.

Dazu drei Regeln, die nicht verhandelbar sind:

* Eine Anzeige sieht **nie aus wie ein Inserat** und steht nie in der
  Trefferreihenfolge, sondern zwischen den Blöcken.
* Die Auswahl entsteht aus der **Stelle auf der Seite**, nicht aus Profil,
  Suche oder Verhalten. Es gibt keinen Abgleich mit Werbenetzwerken, keine
  Kennungen und keine Daten an Werbetreibende – deshalb ist dafür auch keine
  Einwilligung nötig, und es erscheint kein Zustimmungsfenster.
* Neben jeder Anzeige steht ein **„?“**, das genau das erklärt, und ein Weg zum
  anzeigenfreien Tarif.

## Der Markt

Bis vor Kurzem war TrimmoTrade ein sehr gutes Einzelplatzwerkzeug: Ein Inserat
verließ nie das Gerät, auf dem es entstand. Damit konnten sich Suchende und
Anbietende nicht erreichen – und ein Wohnungsportal, auf dem das nicht geht,
ist keins.

### Was ein Inserat durchläuft

1. **Anlegen.** Ein Formular für alle vier Angebotsarten. Zum Veröffentlichen
   braucht es eine bestätigte E-Mail-Adresse: Ein Inserat ist eine
   Veröffentlichung mit Rechtsfolgen – § 5a UWG bei falschen Angaben, § 87 GEG
   beim Energieausweis –, und wer sie abgibt, muss erreichbar sein.
2. **Prüfen.** Der Server glaubt dem Browser kein einziges Feld. Anbieterangaben,
   Koordinaten und Aufrufzahlen setzt er selbst aus Konto und Ortsliste; alles
   Übrige läuft durch eine feste Liste erlaubter Felder mit festen Grenzen.
   Ein selbst vergebenes „verifiziert“ fällt dabei genauso weg wie eine
   erfundene Wohnung in „Musterhausen“.
3. **Bilder.** Jedes Bild wird neu berechnet, nie durchgereicht. Das begrenzt es
   auf 1600 Pixel und entfernt die EXIF-Daten – in Handyfotos steht der
   Aufnahmeort, und ein Wohnungsfoto mit GPS-Koordinaten verrät die Adresse
   einer Wohnung, deren Inserat bewusst nur „Nähe Ehrenfeld“ sagt.
4. **Betrugsprüfung.** Serverseitig, nicht im Browser: Ein Hinweis, den man
   abschalten kann, schützt niemanden. Gesucht wird nach der üblichen Masche –
   Vorkasse, Treuhänder, Schlüssel per Post, Anbieter „im Ausland“, keine
   Besichtigung, Drängeln – und nach einem Preis unter der halben
   Vergleichsmiete. Gefunden wird nicht gelöscht, sondern markiert.
5. **Ablaufen.** Nach 60 Tagen verfällt ein Inserat, wenn niemand bestätigt,
   dass das Angebot noch steht. Sieben Tage vorher fragt eine Mail nach.
   Karteileichen sind der häufigste Vorwurf an Wohnungsportale – hier
   verhindert sie die Datenbank, nicht der gute Wille.

### Die Anfrage

Der einzige Weg, auf dem sich hier zwei Menschen erreichen. Er steht unter zwei
Regeln, die sich widersprechen könnten und es nicht tun:

**Sie muss ankommen.** Nicht „liegt im Postfach, falls sich jemand einloggt“,
sondern eine Mail an die anbietende Seite, sofort.

**Keine der beiden Adressen steht in der Mail der anderen.** Wer eine Wohnung
inseriert, bekommt sonst zwei Wochen später Werbung von Küchenstudios; wer sich
bewirbt, bekommt sonst eine Absage per Telefon um 22 Uhr. Die Adresse gibt frei,
wer antwortet – und dann auch nur die eigene.

Mitgehen dürfen Eckdaten aus dem Profil: Haushaltsgröße, Einzugstermin,
Beschäftigung, Einkommen **als Spanne**, Haustiere, Rauchen, WBS, Bürgschaft.
Was mitgeht, steht vor dem Absenden im Dialog – Feld für Feld. Profildaten
still mitzuschicken wäre genau die Sorte Bequemlichkeit, gegen die diese
Anwendung sonst überall antritt. Und was niemand fragen darf, kommt gar nicht
erst durch: keine Herkunft, keine Religion, keine Gesundheit, keine
Familienplanung (Art. 9 DSGVO, § 19 AGG).

### WG gründen

Auf jedem Portal gilt: Wer allein die Miete nicht aufbringt, sucht ein WG-Zimmer
und hofft, dass eine bestehende WG ihn nimmt. Was nie passiert: dass sich drei
Fremde zusammentun und eine Wohnung nehmen, die keiner von ihnen allein bekommen
hätte.

Das liegt nicht am Wollen, sondern daran, dass jeder gleichzeitig die Wohnung
**und** die Mitbewohner bräuchte – und beides voneinander abhängt. Derselbe
doppelte Zufall wie beim Wohnungstausch, dieselbe Auflösung: sichtbar machen, wer
sucht.

* Die anbietende Seite hakt beim Inserieren **„für eine WG-Gründung freigeben“**
  an und wählt die Vertragsform. Nur bei Miete, nur bei Wohnung oder Haus, nie
  mehr Personen als Zimmer.
* Wer sucht, eröffnet eine Gruppe zu dieser Wohnung oder tritt einer bei. Der
  Anteil je Person steht dabei – die erste Zahl, nach der gefragt wird.
* Die Passung rechnet über dieselben sechs Alltagsfragen wie bei einer
  bestehenden WG. Was sie **nicht** tut: nach Alter oder Geschlecht ausschließen.
  Eine WG darf danach auswählen (§ 19 Abs. 5 AGG nimmt das gemeinsame Wohnen
  aus) – eine Gruppe, die es noch gar nicht gibt, hat darüber nichts entschieden.
* Ist die Gruppe voll, geht **eine** Bewerbung hinaus. Für die Vermieterseite ist
  das der ganze Unterschied: drei einzelne Anfragen sind drei Leute, die allein
  nicht zahlen können; eine gemeinsame Bewerbung ist ein vollständiger Haushalt.

**Wer wen sieht** – die eigentliche Arbeit an dieser Funktion:

| Wer | Sieht |
|---|---|
| ohne Konto | Zahlen und den Text der Gruppe. Keine Person. |
| angemeldet | Rufname („Cem Y.“), Alter, Beruf, Vorstellung, Lebensrhythmus |
| dabei | zusätzlich die E-Mail-Adressen – man hat einander angenommen |
| gründend | zusätzlich die offenen Beitrittsanfragen |

Die anbietende Seite ist von Gruppen zu ihrem eigenen Inserat ausgeschlossen:
weder gründen noch beitreten. Was Bewerbende einander erzählen, erzählen sie
einander.

Und was hier ausdrücklich **nicht** stattfindet: eine Prüfung von Personen.
TrimmoTrade stellt niemanden fest, bewertet niemanden und steht für niemanden
ein. Alles andere zu behaupten wäre ein Versprechen, das niemand halten kann.

Dafür steht der Rechtsteil an jeder Stelle dabei, an der jemand zusagt:
gesamtschuldnerische Haftung (§ 421 BGB), Kaution nur einmal für die Wohnung und
nicht je Person (§ 551 Abs. 1 BGB), ein Auszug allein ist keine Kündigung, und
der Rundfunkbeitrag fällt einmal je Wohnung an.

### Der Suchauftrag

Die wichtigste Funktion dieser Anwendung, und das liegt nicht an ihr, sondern
an der Wohnungssuche: Sie besteht aus Warten. Wer sucht, öffnet nicht dreimal
täglich ein Portal – er tut es zwei Wochen lang und hört dann auf. Was ihn
zurückholt, ist eine Mail mit einer Wohnung, die passt.

Drei Dinge sind daran nicht verhandelbar: kein Doppelversand (die laufende
Nummer merkt sich die Grenze, nicht die Uhrzeit), ein Abmeldeverweis in jeder
Mail, der ohne Anmeldung wirkt (§ 7 UWG, Art. 21 DSGVO), und keine Mail, wenn
nichts da ist – „0 neue Treffer“ ist der schnellste Weg in den Spam-Ordner.

Der Serverfilter kann weniger als der Filter im Browser: Ausstattung,
Pendelzeit und WG-Merkmale rechnet die Anwendung aus dem Profil, und das kennt
der Server nicht. Statt das zu verschweigen, steht unter dem Schalter, welche
Kriterien die Mail nicht berücksichtigt. Lieber ein Treffer zu viel in der Mail
als eine Wohnung, die nie ankommt.

### Melden

Ein Portal, auf dem Fremde veröffentlichen, ist ein Hostingdienst im Sinne des
Digital Services Act. Daraus folgt ein Meldeweg, der **ohne Konto** erreichbar
ist (Art. 16 Abs. 1), eine Empfangsbestätigung (Abs. 4) und eine Entscheidung
mit Begründung (Abs. 5). Alle drei sind eingebaut, und der Vorgang steht in der
Datenbank – was nicht darin steht, ist nicht passiert, und im Streitfall zählt
genau das.

Der Meldeweg ohne Konto ist dabei nicht nur Pflicht, sondern das Wirksamste
daran: Wer ein Betrugsinserat erkennt, legt dafür kein Konto an. Er geht
weiter, und das Inserat bleibt stehen.

### Zählen, ohne jemanden zu zählen

Ein Geschäft, das seinen Trichter nicht kennt, rät. Die übliche Antwort darauf
ist ein Messdienst, ein Cookie-Banner und ein Auftragsverarbeitungsvertrag mit
einem Unternehmen in Kalifornien. Die Antwort hier ist eine Tabelle mit drei
Spalten: `tag | name | wert`.

Mehr wird nicht gespeichert. Keine Kennung, keine IP-Adresse, keine Sitzung,
kein Verlauf. Aus „am 3. März 412 Suchen“ lässt sich niemand herauslesen – es
ist kein personenbezogenes Datum, und weil auf dem Gerät nichts abgelegt wird,
stellt sich die Frage nach § 25 TDDDG gar nicht erst. Kein Banner, keine
Einwilligung.

Auf der Kommandozeile:

```
php api/index.php pruefen       # was an der Einrichtung fehlt
php api/index.php zahlen        # der Trichter der letzten 14 Tage
php api/index.php melden        # Suchaufträge abarbeiten (stündlich per Cron)
php api/index.php erinnern      # „Steht dein Inserat noch?“ (täglich)
php api/index.php aufraeumen    # abgelaufene Sitzungen, Vorgänge, Gruppen
php api/index.php meldungen     # offene Meldungen
php api/index.php meldung <k> sperren "Begründung"
```

### Entscheiden, was gemeldet wurde

Ein Meldeweg, an dessen Ende niemand entscheidet, ist keiner. Er ist rechtlich
schlechter als gar keiner, weil er ein Versprechen abgibt.

Deshalb gibt es die Moderation auf der Kommandozeile. Der Vorgang zeigt, was
gemeldet wurde, den Text des Inserats, ob die eigene Betrugsprüfung angeschlagen
hat, wie oft dasselbe Inserat schon gemeldet wurde und wie viele Meldungen es
gegen dieses Konto gibt. Danach: sperren, löschen oder nichts tun – **immer mit
Begründung**.

Die Begründung geht wörtlich in die Mail an die betroffene Seite, zusammen mit
den fünf Bestandteilen aus Art. 17 Abs. 1 DSA: was geschieht, worauf es sich
stützt, ob automatisiert entschieden wurde, auf welcher Grundlage und wie man
sich wehren kann. Eine Begründung unter zwanzig Zeichen lehnt das Programm ab.
„Verstößt gegen unsere Richtlinien“ ist keine – dagegen kann sich niemand
wehren, und genau deshalb steht die Liste in der Verordnung.

Eine Weboberfläche dafür gibt es bewusst nicht: Sie wäre eine zweite Anmeldung,
eine zweite Rechteverwaltung und eine zweite Angriffsfläche. Für einen Betrieb
mit einer Person ist das der schlechtere Tausch.

## Anmeldung

Suchen und Inserate ansehen geht ohne Anmeldung. Für alles, was etwas
festhält, braucht es ein Konto — vier Wege, sortiert nach Sicherheit statt
nach Bekanntheit:

| Weg | Stufe | Was dahintersteckt |
|---|---|---|
| **Passkey** | 2 | WebAuthn, serverseitig geprüfte Signatur |
| Google | 2 | OpenID Connect mit PKCE, ID-Token gegen Googles Schlüssel geprüft |
| Microsoft | 2 | dasselbe über Microsoft Entra ID, Mandant `common` |
| E-Mail mit Einmalcode | 1 | sechsstelliger Code per SMTP, gehasht gespeichert |

**Der Passkey steht oben, weil er als Einziges gegen die häufigste Masche
schützt:** eine nachgebaute Anmeldeseite. Ein Passkey ist an die Domain
gebunden, unter der er angelegt wurde. Wer auf eine gefälschte Seite
hereinfällt, gibt dort nichts preis — es gibt nichts einzugeben. Der
Schlüssel entsteht im Sicherheitschip des Geräts und verlässt ihn nie; auf
dem Server liegt nur der öffentliche Teil.

Ein Passwort gibt es in keinem der vier Wege.

### Zwei Lagen, eine Oberfläche

Die Anwendung läuft in zwei Lagen und funktioniert in beiden ganz:

**Mit Server** — unter `www.trimmotrade.de`, wo `api/` liegt und
`api/config.php` ausgefüllt ist. Dann ist die Anmeldung echt: Der Code geht
per Mail hinaus, die Signatur des Passkeys wird gegen den hinterlegten
öffentlichen Schlüssel gerechnet, Google und Microsoft antworten wirklich.
Die Sitzung hängt an einem Cookie, das kein Skript lesen kann.

**Ohne Server** — die Einzeldatei, eine Kopie auf dem Stick, `file://`. Dann
ist die Anmeldung nachgebildet und sagt das an jeder Stelle. Nichts verlangt
eine Verbindung, nichts bricht ab.

Welche Lage vorliegt, entscheidet ein einziger Aufruf beim Start
(`assets/api.js`). Verfahren, für die keine Zugangsdaten hinterlegt sind,
erscheinen gar nicht erst als Knopf — statt in eine Fehlermeldung zu führen.

### Die Serverseite

`api/` ist bewusst klein: PHP 8.1+, PDO, keine Abhängigkeiten, kein
Composer. Auf einem Webhosting-Paket ohne Kommandozeile lässt sich das
hochladen und es läuft. Die Tabellen legt die Anwendung beim ersten Aufruf
selbst an.

| Datei | Wofür |
|---|---|
| `api/index.php` | einziger Einstiegspunkt; hier stehen die Prüfungen, die für alle Wege gelten |
| `api/lib/webauthn.php` | Passkeys prüfen: Aufforderung, Herkunft, RP-ID, Flags, Signatur, Zähler |
| `api/lib/cbor.php` | so viel CBOR, wie WebAuthn braucht — Lesepfad, keine Ratefunktion |
| `api/lib/oauth.php` | OpenID Connect mit `state`, `nonce` und PKCE |
| `api/lib/jwt.php` | ID-Token prüfen: `alg`, Signatur, `iss`, `aud`, `exp` |
| `api/lib/der.php` | COSE- und JWK-Schlüssel nach PEM, für beides dieselben Bausteine |
| `api/lib/sitzung.php` | Sitzungscookie (HttpOnly, SameSite) und Schutz gegen untergeschobene Anfragen |
| `api/lib/grenze.php` | gleitende Sperren gegen das Durchprobieren von Codes |
| `api/lib/mail.php` | SMTP von Hand — eine kurze Textmail, mehr wird nicht gebraucht |
| `api/lib/konto.php` | Konten, Verknüpfungen, Vertrauensstufe, Löschung nach Art. 17 DSGVO |
| `api/lib/schema.php` | das Datenmodell an einer Stelle, für MariaDB und SQLite |

**Was der Server speichert:** Kontonummer, E-Mail-Adresse, Name,
Anmeldeverfahren, Vertrauensstufe, die öffentlichen Teile der Passkeys und
die offenen Sitzungen. **Was er nicht speichert:** Inserate, Merklisten,
Suchaufträge, Nachrichten, Notizen, Profile, Bilder, den Dokumententresor.
Das alles bleibt im Browser. Ein Anmeldeserver, der nichts weiter speichert,
ist ein kleines Ziel — und ein kleines Ziel ist die beste Vorsorge.

Wie das bei netcup einzurichten ist, steht Schritt für Schritt in
[DEPLOY.md](DEPLOY.md).

### Ohne Anmeldung erreichbar

**Die Suche und jedes Inserat.** Vollständig: Eckdaten, Beschreibung, Bilder,
Vergleichsmiete, Prüfhinweis, Vertragslupe, echte Monatskosten, Lage, Anbieter
und dessen Vertrauensstufe. Filtern, sortieren, blättern, Karte — alles geht.
Eine Wohnungsplattform, die ihren Bestand hinter einer Anmeldung versteckt,
verliert die Hälfte ihrer Besucher an der Tür und in den Suchmaschinen ohnehin.

Dazu Impressum, Datenschutzerklärung, AGB, Widerrufsbelehrung, der Meldeweg und
die Hilfe. § 5 DDG verlangt „ständig verfügbar" — hinter einer Anmeldung ist
nichts ständig verfügbar. Und wer nicht hereinkommt, braucht die Hilfe am
dringendsten.

### Was ein Konto braucht

Alles, was etwas anlegt, festhält, verschickt oder bucht: merken, vergleichen,
anschreiben, Suchaufträge, Notizen, Bewerbungsstand, Besichtigungstermine,
Checkliste, Exposé, Profil, eigene Inserate, Ringtausch, Werkzeuge,
Dokumententresor, Plus.

Ebenso alles, was mit dem Profil rechnet: Passungsring, Fahrzeit zur Arbeit,
WG-Abgleich, die Sortierung „Beste Passung“. Ohne Profil gäbe es dort nichts zu
rechnen — und eine Zahl auszugeben, hinter der nichts steht, wäre schlimmer als
keine.

**Der Riegel sitzt an einer Stelle**, im Verteiler der Aktionen
(`darfOhneKonto` in `assets/ui.js`), und er zählt das Erlaubte auf, nicht das
Verbotene. Wer eine neue Aktion einbaut und sie in einer Verbotsliste zu
ergänzen vergisst, hat ein Loch; wer sie in der Erlaubnisliste vergisst, hat
einen Knopf, der zur Anmeldung führt — ärgerlich, aber harmlos. Deshalb
herum.

Ein gesperrter Knopf verschwindet nicht, er erklärt sich: „Dafür brauchst du
ein Konto“, was genau daran hängt, und dass Ansehen weiterhin ohne Anmeldung
geht.

### Vertrauensstufen — hier sitzt der Schutz, nicht in der Anmeldung

Eine Anmeldepflicht hält keinen Betrüger auf. Ein Google-Konto ist in zwei
Minuten angelegt. Was wirklich wirkt, ist die Stufe darüber — und dass man
**sieht**, welche Stufe das Gegenüber hat:

| Stufe | Bedingung | Wirkung |
|---|---|---|
| 0 | nichts bestätigt | sollte nichts inserieren dürfen |
| 1 | E-Mail bestätigt | Wegwerfadressen bleiben möglich |
| 2 | Passkey oder Anbieterkonto | massenhaftes Anlegen wird mühsam |
| 3 | Telefonnummer bestätigt | Betrug im großen Stil wird unwirtschaftlich |
| 4 | Ausweis geprüft | für Inserierende der Maßstab |

Die Stufe steht **an jedem Inserat**, nicht nur im eigenen Konto: auf der
Karte als Kennzeichen, auf der Objektseite mit einem Satz dazu, was sie
bedeutet. Unter Stufe 2 warnt TrimmoTrade ausdrücklich — nicht, dass etwas nicht
stimmt, sondern dass die üblichen Regeln besonders gelten.

Eine Wegwerfadresse hebt die Stufe nicht über 1, auch mit Passkey.

## Hilfe

Unten rechts hängt auf jeder Seite ein Hilfefenster; unter `#/hilfe` stehen
dieselben Antworten als vollständige Seite.

**Das ist kein Sprachmodell**, und die Anwendung sagt das auch. Es gibt keinen
Server und nichts, was „versteht": Es gibt 22 hinterlegte Antworten und einen
Abgleich, der die Frage der passendsten zuordnet. Für einen Hilfebereich ist
das meistens besser – die Antworten stimmen, weil jemand sie geschrieben hat,
sie verweisen an die richtige Stelle in der Anwendung, und sie erfinden
nichts.

Einige Antworten kennen den tatsächlichen Stand: Auf „Wie kündige ich?"
antwortet die Hilfe anders, wenn Plus über einen Gründerplatz läuft
(dann gibt es nichts zu kündigen), als bei einem bezahlten Vertrag.

Am Abgleich waren zwei Dinge die eigentliche Arbeit, beide sprachbedingt:

* **Komposita.** „Wohnungstausch", „Nebenkostenabrechnung",
  „Mietpreisbremse" – ein Abgleich, der nur den Wortanfang prüft, findet
  davon nichts. Schlagworte werden deshalb auch mitten im Wort gesucht.
* **Umlautplural.** „Aufträge" wird zu `auftraege`, der Singular zu
  `auftrag`. Jedes Wort wird in drei Formen verglichen: wie geschrieben,
  gestemmt, und beides ohne Umlautrest.

Dazu Muster für Fälle, die aus Einzelwörtern nicht hervorgehen: „Kaution
vorab" ist eine Betrugsfrage, keine Frage zur zulässigen Kautionshöhe.

**Wo der Abgleich unsicher ist, rät er nicht.** Liegen zwei Themen fast
gleichauf, fragt er nach; findet er nichts, sagt er das und bietet den Weg
zum Menschen an. Ein Prüflauf über 44 Beispielfragen ordnet alle richtig zu –
und weist Unbekanntes als unbekannt aus.

### Weitergabe ans Service-Team

Führt die Hilfe nicht weiter, fasst sie das Gespräch zusammen und übergibt es
an `info@trimmotrade.de`. Die Zusammenfassung enthält Vorgangsnummer, Datum, die
gestellten Fragen, die Titel der gezeigten Antworten samt Rückmeldung
(„hat geholfen" / „hat nicht geholfen"), das Freitext-Anliegen und die
Kontaktangaben, die man selbst einträgt.

Nicht enthalten: Profil, Merkliste, Suchaufträge und alles aus dem
Dokumententresor.

Verschickt wird über das E-Mail-Programm des Geräts. Das ist keine Notlösung,
sondern datenschutzrechtlich die saubere Variante: **Es verlässt nichts das
Gerät, bevor jemand bewusst auf Senden klickt**, und der vollständige Text
steht vorher sichtbar da. Wo kein Mailprogramm eingerichtet ist, lässt sich
derselbe Text kopieren oder als Datei sichern. Im Betrieb würde ein Server
das übernehmen; die Zusammenfassung wäre dieselbe.

Die Zieladresse steht in `assets/recht.js` unter `service` und ist unter
`#/recht/angaben` änderbar.

## Rechtliches

Unter `#/recht` liegen Impressum (§ 5 DDG), Datenschutzerklärung (Art. 13/14
DSGVO), AGB, Widerrufsbelehrung mit Musterformular, der Meldeweg für
rechtswidrige Inhalte (Art. 16 der Verordnung (EU) 2022/2065), eine Erklärung
zur Barrierefreiheit und der Kündigungsknopf, den § 312k BGB verlangt.

Die Texte sind für ein **Kleingewerbe** geschrieben – Einzelunternehmen ohne
Handelsregistereintrag, Kleinunternehmerregelung nach § 19 UStG, also keine
ausgewiesene Umsatzsteuer.

Alle Betreiberangaben stehen an **einer** Stelle: in `assets/recht.js` unter
`VORGABE`, und zusätzlich unter `#/recht/angaben` im Browser änderbar. Was
fehlt, verschwindet nicht still, sondern erscheint im Text als rot markierte
Lücke und in einer Prüfliste mit der Vorschrift, aus der die Pflicht folgt.
Ein Impressum ohne ladungsfähige Anschrift ist abmahnbar; das soll man sehen.

Was die Texte nicht leisten: Rechtsberatung. `#/recht` führt die Punkte auf,
die keine Textbausteine sind, sondern Entscheidungen – Erlaubnis nach
§ 34c GewO, Auftragsverarbeitung mit dem Hoster, Verzeichnis von
Verarbeitungstätigkeiten, Zahlungsabwicklung, Gewerbeanmeldung.

## Karte ohne Kartendienst

Die Karte wird selbst gezeichnet: kein Kachelserver, kein fremdes Skript,
keine Nachverfolgung. Sie zeigt Preisniveau je Viertel als Wärmefläche,
bündelt Marker bei geringem Zoom, blendet ab einer bestimmten Vergrößerung
Preise statt Punkte ein und nimmt einen frei setzbaren Umkreis auf. Bedienbar
mit Maus, Touch und Tastatur.

## Bilder ohne Bilder

Statt Fotos von fremden Servern zeichnet die App jede Ansicht selbst:
Fassade, Wohnraum, Küche, Bad, Grundriss und Umgebung entstehen aus der
Kennung des Inserats. Gleiches Inserat, gleiches Bild – auch offline, ohne
Ladezeit und ohne kaputte Platzhalter.

---

## Aufbau

```
trimmotrade/
  index.html            lädt die Einzelteile, kein Build nötig
  build.js              baut daraus die Einzeldatei (node build.js)
  GESCHAEFT.md          Markt, Keil, Kaltstart, Zahlen, Risiken
  START.md              die ersten 90 Tage: Recht, Betrieb, erste Inserate
  DEPLOY.md             Schritt für Schritt zu netcup
  .user.ini             PHP-Einstellungen (Bildupload braucht 16 MB)
  scripts/
    farben-pruefen.js   rechnet Kontraste und Farbabstände nach
    seiten-bauen.js     baut die Ratgeberseiten, 404 und sitemap.xml
    orte-bauen.js       erzeugt api/lib/orte.php aus assets/geo.js
  dist/
    trimmotrade.html       vollständige Seite in einer Datei
    artifact.html       nur der Seiteninhalt, zum Einbetten
  assets/
    app.css             Design-System, hell und dunkel
    util.js             Formate, DOM-Hilfen, Geo, Speicher
    geo.js              10 Städte, 83 Viertel, Vergleichswerte
    images.js           gezeichnete Ansichten und eigene Fotos
    data.js             erzeugt den Beispielbestand
    analyse.js          Vergleichsmiete, Risiko, Klauseln, Kosten, Passung
    match.js            WG-Passung und Ringsuche
    werkzeuge.js        Chancen, Doppel-Erkennung, Preisreihen, Leistbarkeit,
                        WBS, Wohngeld, Betriebskosten, Routenplanung
    store.js            Zustand und Speicherung
    ring-bild.js        die vier Erklärbilder zum Ringtausch
    plan.js             Tarife, Grenzen, Gründerplätze, Anzeigen
    tresor.js           Verschlüsselung, Ablage, befristete Freigaben
    recht.js            Betreiberangaben, Pflichtfelder, Preishinweise
    hilfe.js            Wissensbasis der Hilfe und der Abgleich
    konto.js            Anmeldung, Passkeys, Einmalcode, Vertrauensstufen
    karte.js            die Karte
    markt.js            holt echte Inserate, trennt sie von den Beispielen,
                        zählt den Trichter ohne Personenbezug
    wg.js               Gruppen zur WG-Gründung, Passung, Eckdaten
    ui.js               Schale, Router, geteilte Bausteine
    view-*.js           die einzelnen Ansichten
    app.js              Start
  api/                  die Serverseite (PHP 8.1, kein Composer)
    index.php           einziger Einstiegspunkt, alle Wege
    schema.sql          Tabellen, erzeugt aus lib/schema.php
    lib/
      schema.php        das Datenmodell an einer Stelle
      orte.php          Städte und Viertel – erzeugt, nicht gepflegt
      inserat.php       Inserate: prüfen, speichern, suchen
      bild.php          Bilder neu berechnen (entfernt GPS aus Fotos)
      anfrage.php       Anfragen und Meldungen nach Art. 16 DSA
      auftrag.php       Suchaufträge, Meldelauf, Ablauferinnerung
      gruppe.php        WG-Gründung: wer wen sehen darf, gemeinsam bewerben
      moderation.php    Meldungen entscheiden und begründen (Art. 16/17 DSA)
      selbsttest.php    „was fehlt hier?“ für die Kommandozeile

Die Betreiberangaben für Impressum, Datenschutz und AGB stehen in
`api/config.php` unter `betreiber` und gehen über `/api/status` an jeden
Browser. Sie gehören dorthin und nicht in die Oberfläche: Was jemand in der
Anwendung einträgt, liegt im Speicher **seines** Browsers – auf einer Website
sähe jeder andere Besucher an dieser Stelle eine Lücke, und die
Impressumspflicht nach § 5 DDG wäre nicht erfüllt. In der Einzeldatei ohne
Server bleibt die Eingabe in der Oberfläche der richtige Weg: Dort ist jeder
sein eigener Betreiber.
      zaehler.php       Tagessummen ohne Kennung
      konto.php         Konten und Vertrauensstufen
      sitzung.php       Sitzungen, Schutzmerkmal, Herkunftsprüfung
      webauthn.php      Passkeys, serverseitig geprüft
      oauth.php         Google und Microsoft, mit PKCE
      jwt.php           ID-Token prüfen
      mail.php          SMTP von Hand, ohne Bibliothek
      grenze.php        Sperren gegen Durchprobieren
      db.php            MariaDB und SQLite, ein Verhalten
```

Reihenfolge der Skripte ist bewusst: `util` zuerst, `app` zuletzt. Jede Datei
hängt sich an ein einziges globales `TT` und benutzt nur, was vorher da war.

## Wo sich etwas ändern lässt

| Was | Wo |
|---|---|
| Städte, Viertel, Miet- und Kaufniveau | `assets/geo.js`, Feld `CITIES` |
| Menge und Mischung der Inserate | `assets/data.js`, Funktion `build` |
| Prüfregeln gegen Betrug | `assets/analyse.js`, `BETRUG_MUSTER` |
| Klauseln der Vertragslupe | `assets/analyse.js`, `KLAUSELN` |
| Strompreis, Rundfunkbeitrag, Internet | `assets/analyse.js`, oben im Modul |
| Grunderwerbsteuer je Bundesland | `assets/analyse.js`, `GRUNDERWERB` |
| Aufgaben im Umzugsplan | `assets/store.js`, `UMZUG_VORLAGE` |
| Fragen der Besichtigungs-Checkliste | `assets/store.js`, `BESICHTIGUNG_FRAGEN` |
| Preise, Grenzen und Leistungen der Tarife | `assets/plan.js`, `TARIFE` und `GRENZEN` |
| Anzeigen im freien Tarif | `assets/plan.js`, `ANZEIGEN` |
| Katalog der Betriebskosten | `assets/werkzeuge.js`, `BETRIEBSKOSTEN` |
| Einkommensgrenze für den WBS | `assets/werkzeuge.js`, `WBS_BUND` |
| Farben, Abstände, Rundungen | `assets/app.css`, ganz oben unter „Token“ |
| Diagrammfarben | `assets/app.css`, Abschnitt „Diagramme“ – nach Änderung mit dem Palettenprüfer nachrechnen |

## Bedienung

| Funktion | Bedienung |
|---|---|
| Schnellsuche | `Strg`/`Cmd` + `K`, oder `/` |
| Hauptbereiche | Tasten `1` bis `7` |
| Merken / Vergleichen | `M` und `V` auf einer Objektseite |
| Fenster schließen | `Esc` |
| Karte | Ziehen, Mausrad, `+`/`−`, Pfeiltasten bei Fokus |
| Hell oder dunkel | Schalter oben rechts, folgt sonst dem System |

## Barrierefreiheit

Sprungmarke zum Inhalt, sichtbare Fokusrahmen, Fokusfalle und Fokusrückgabe
in allen Fenstern, vollständige Bedienbarkeit per Tastatur, `aria`-Auszeichnung
für Navigation, Dialoge und Statusmeldungen, eine einzige `h1` je Ansicht,
keine doppelten IDs, kein waagerechter Überlauf von 320 px bis 1920 px,
`prefers-reduced-motion` wird berücksichtigt.

## Datenschutz

Zum Server geht genau eine Sache: die Anmeldung. Er beantwortet die Frage,
wer jemand ist, und speichert dafür Kontonummer, E-Mail-Adresse, Name,
Verfahren, Vertrauensstufe, die öffentlichen Teile der Passkeys und die
offenen Sitzungen. Mehr kennt er nicht.

Alles Übrige bleibt im Browser: Merkliste, Profil, Suchaufträge, Nachrichten
und eigene Inserate im `localStorage` unter dem Schlüssel
`trimmotrade.v1`, das Konto getrennt davon unter `trimmotrade.konto.v1` — wer sich
abmeldet, soll seine Merkliste behalten, und wer seine Daten löscht, nicht
ungewollt ausgesperrt werden. Unter „Meine Daten“ im Fußbereich lässt sich der Stand als
Datei sichern oder vollständig löschen. Beim Leeren der Browserdaten
verschwindet er ebenfalls.

Die Dokumente des Tresors liegen davon getrennt: das Chiffrat in der
IndexedDB `trimmotrade-tresor`, die Kopfdaten der Freigaben unter
`trimmotrade.tresor.v1`. Beides ist ohne Kennwort wertlos – der Schlüssel wird
nirgends abgelegt. „Meine Daten“ sichert den Tresor deshalb ausdrücklich
nicht mit; verschlüsselte Dateien in einer Klartextdatei zu exportieren wäre
das Gegenteil dessen, wofür er da ist.

## Hinweis zum Bestand

Es gibt zwei Sorten Inserate, und sie sind unterscheidbar:

**Echte Inserate** stammen von Menschen, die sie eingestellt haben. Sie liegen
auf dem Server, sie lassen sich anschreiben, und sie laufen nach 60 Tagen aus,
wenn niemand bestätigt, dass das Angebot noch steht.

**Beispiele** sind erzeugt – Anbieter, Namen, Adressen und Bewertungen sind
erfunden. Sie tragen oben links die Marke **Beispiel**, über der Trefferliste
steht ein Hinweis, der sich nicht wegklicken lässt, und eine Anfrage darauf
erreicht niemanden. Sie füllen die Suche, solange es zu wenige echte Inserate
gibt; abgeschaltet werden sie mit `'beispielmarkt' => false` in
`api/config.php`.

Warum das so genau genommen wird: Erfundene Wohnungen neben echten zu zeigen,
ohne es zu sagen, ist nach § 5 UWG irreführend – und spätestens die erste
Anfrage an eine erfundene Adresse zerstört das Einzige, wovon ein
Wohnungsportal lebt.

Die Vergleichswerte für Miete und Kaufpreis sind plausible Rechengrößen, kein
amtlicher Mietspiegel. Rechtliche Erläuterungen sind allgemeine Hinweise und
ersetzen keine Beratung.

## Getestet

Chromium, 320 px bis 1920 px, hell und dunkel, Maus, Tastatur und Touch,
aufgeteilt und als Einzeldatei über `file://` sowie eingebettet in eine fremde
Seitenhülle.

Automatisch geprüft über alle 19 Ansichten, in beiden Tarifen: keine
Konsolenfehler, keine doppelten IDs, genau eine `h1` je Ansicht, kein
Bedienelement ohne Beschriftung, kein Eingabefeld ohne Label, kein waagerechter
Überlauf bei 390 px. Zusätzlich geprüft: Regler lassen sich ziehen, ohne dass
die Eingabe abbricht, Textfelder behalten beim Tippen den Fokus, und keine
Zahl erscheint doppelt.

### Fristen sind Kalenderfristen

Eine nach Jahren oder Monaten bestimmte Frist rechnet man nicht in Tagen
(§§ 187, 188 BGB). Der 31. Dezember plus ein Jahr ist der 31. Dezember —
nicht der 30., wie 365 Tage ergäben, sobald ein Schalttag dazwischenliegt.
Der 29. Februar plus ein Jahr ist der 28. Februar, nicht der 1. März.
`U.addJahre` und `U.addMonate` in `assets/util.js` rechnen so; wer eine
neue Frist einbaut, nimmt sie und nicht `addDays`.

Dieselbe Sorgfalt bei der Kündigungsfrist: § 573c Abs. 1 BGB knüpft nicht
an einen Abstand in Tagen an, sondern an den Monat — Zugang bis zum
dritten Werktag, Ende mit Ablauf des übernächsten Monats. `U.dritterWerktag`
rechnet das aus.

### Der Markt, von außen geprüft

Der Marktplatz wird über die Schnittstelle geprüft, nicht über die Innereien –
62 Prüfungen, jede zweimal, mit derselben Antwort. Darunter die Fälle, in denen
etwas **nicht** gehen darf:

* ein Inserat, das sich selbst „verifiziert“ nennt, eigene Koordinaten mitbringt
  oder 99.999 Aufrufe behauptet — alle drei Angaben setzt der Server neu,
* ein Viertel, das es nicht gibt,
* `DROP TABLE tt_konto` im Sortierfeld (die Kontentabelle steht danach noch),
* eine PHP-Datei, die sich als JPEG ausgibt,
* ein Bild mit GPS-Koordinaten im EXIF (danach ist nichts davon übrig),
* das fremde Inserat ändern, löschen, bebildern; die fremde Anfrage umschalten,
* dieselbe Anfrage zweimal, die Anfrage an das eigene Inserat, die leere Anfrage,
* derselbe Suchauftrag zweimal gemeldet,
* ein gefälschter Abmeldeverweis.

Dazu ein Durchgang im echten Browser gegen den echten Server über den ganzen
Kreis: anmelden, inserieren mit Bild, ohne Konto in der Suche wiederfinden,
melden, anschreiben, Mail beim Anbieter — und die Gegenprobe, dass in dieser
Mail die Adresse der anfragenden Seite **nicht** steht.

Die WG-Gründung wird zweifach geprüft: 44 Prüfungen über die Schnittstelle und
ein Durchgang mit **drei gleichzeitig geöffneten Browsern** — Vermieterin,
Gründer, Beitretender. Dabei wird jede Stufe der Sichtbarkeit gegengeprüft: dass
ohne Konto keine Person erscheint, dass ein Angemeldeter den Rufnamen sieht und
die Adresse nicht, dass die Adressen erst nach der gegenseitigen Annahme
auftauchen, und dass die Vermieterin von alldem nichts sieht außer der
gemeinsamen Bewerbung.

Geprüft wird außerdem der Weg von einer älteren Fassung: Eine Datenbank auf dem
vorigen Stand bekommt beim ersten Aufruf die fehlende Spalte und die fehlenden
Tabellen. `CREATE TABLE IF NOT EXISTS` allein würde das nicht tun — einer
vorhandenen Tabelle fügt es nichts hinzu.

### Geprüft

Die Serverseite wird gegen ihre eigenen Angriffe geprüft, nicht nur auf
Funktion: wiederverwendete Aufforderung, verfälschte Signatur, gefälschte
Herkunft, vertauschte Aufforderungen, als Anmeldung ausgegebene
Registrierung, unbekannter Schlüssel — dazu die Tokenprüfung gegen
`alg: none`, `alg: HS256`, falschen Aussteller, falsche Zielgruppe,
abgelaufene und nachträglich veränderte Token. Der Passkey-Durchgang läuft
über einen virtuellen Authentikator, einmal mit ES256 und einmal mit RS256.

Die Rechner werden nicht auf „läuft durch“ geprüft, sondern auf „stimmt
die Zahl“: Rate, Restschuld und Volltilgungsdauer gegen die geschlossene
Form der Annuitätenrechnung, die Grunderwerbsteuersätze gegen die
amtlichen, die Einkommensgrenzen gegen § 9 WoFG, die Mietpreisbremse
gegen § 556d, jede Kostensumme gegen die Summe ihrer Posten — über den
ganzen Bestand, ohne einen negativen Betrag und ohne ein NaN.

Dazu ungeordnetes Bedienen: mehrere tausend zufällige Klicks, Eingaben
und Sprünge mit festem Startwert, angemeldet wie als Gast. Und die Lagen,
in denen der Browser nicht mitspielt — Speicher gesperrt, Speicher voll,
Stand kaputt, Server weg, Server antwortet Unsinn, Sitzung serverseitig
gelöscht.

Dazu ein durchgespielter Weg einer erfundenen Nutzerin – von der leeren Seite
über Profil, Suche, Bewerbung und Rechner bis zum Umzugsplan. Automatische
Tests sagen, ob etwas funktioniert; nur das Durchspielen sagt, ob es
zusammenpasst. Gefunden und behoben wurden dabei unter anderem: eine Wand aus
gestapelten Meldungen beim Ausfüllen des Profils, ein verlorener Tastaturfokus
beim Merken, ein springender Bildlauf nach jeder Zustandsänderung und ein
Lockerungsvorschlag, der die Nutzerin an den falschen Ort geführt hätte.

Die Diagrammfarben sind mit einem Palettenprüfer gegen Farbfehlsichtigkeit
gerechnet – alle Paare, hell und dunkel, ΔE ≥ 9 unter Deuteranopie,
Protanopie und Tritanopie (`scripts/farben-pruefen.js`).

## Zum Namen

Die Anwendung hieß bis zur Umbenennung Nestwerk. Geändert wurde alles: der
Anzeigename, die Domain in den Rechtstexten und im Meldeweg
(`info@trimmotrade.de`), der Ordner, die gebaute Einzeldatei, der interne
Namensraum im Quelltext (`TT` statt `NW`), das Präfix der Vorgangsnummern in
der Hilfe und die Schlüssel im Speicher des Browsers
(`trimmotrade.v1`, `trimmotrade.konto.v1`, `trimmotrade.sprache.v1`,
`trimmotrade.tresor.v1`, Datenbank `trimmotrade-tresor`).

Ein Umzug alter Daten findet dabei nicht statt. Das ist Absicht: Der alte
Name ist nie in Betrieb gegangen, und Umzugscode für einen Namen, den nie
jemand benutzt hat, wäre Ballast, den man ewig mitschleppt. Wer die
Anwendung vorher ausprobiert hat, findet seinen Stand nicht wieder – er
liegt unter den alten Schlüsseln im Browser und lässt sich dort noch
auslesen, aber die Anwendung sucht ihn nicht mehr.

## Sprachen

Deutsch ist die Ausgangssprache und steht im Quelltext. Englisch kommt aus
einem Wörterbuch, dessen Schlüssel der deutsche Satz selbst ist
(`assets/sprache-en.js`). Das hat zwei Gründe: Es gibt keine erfundenen
Bezeichner zu pflegen, und wenn ein Eintrag fehlt, erscheint der deutsche
Satz – nie ein leerer Platz und nie ein Schlüssel wie `profil.anker.titel`.

Übersetzt wird an genau einer Stelle: im Vorlagen-Tag `h` in `util.js`. Von
dort geht jeder Textlauf durch das Wörterbuch, das Markup bleibt unberührt.
Deshalb musste keine der dreißig Ansichtsdateien angefasst werden.

Ein Satz, den `${…}` unterbricht, ergibt einen Schlüssel mit Platzhaltern:
`Noch {0} Plätze frei`. Die englische Fassung darf sie umstellen – ohne das
wäre jeder eingeschobene Wert an die deutsche Satzstellung genagelt. Steht
ein Zeichen vor dem Text (`${ico('herz')}Merken`), gehört es nicht zum Satz;
der Nachschlag lässt Platzhalter am Rand deshalb weg, sonst bräche ein
zusätzliches Symbol im Markup jede Übersetzung. Der Bauplan je Vorlage hängt
an einer WeakMap über dem `strings`-Array, das getaggte Vorlagen bei jedem
Aufruf identisch wiederbekommen – die Übersetzung kostet damit je Vorlage
einmalig.

Was mitziehen musste:

- **Zahlen und Daten.** 1.274,50 € gegen €1,274.50, 25.08.2026 gegen
  25/08/2026. Ohne das liest ein englischer Leser „4,5 Zimmer“ als
  zweiundvierzig Komma fünf.
- **Zeitangaben.** „vor 2 Tagen“ ist ein Muster, kein verketteter Text.
- **Der erzeugte Bestand.** Titel und Beschreibungen entstehen aus
  Textbausteinen und stehen fertig zusammengesetzt im Inserat. Er wird beim
  Sprachwechsel neu gebaut; der Zufallsgenerator ist gesät, also kommen
  dieselben Kennungen, Preise und Flächen wieder heraus. Eigene Inserate
  bleiben unangetastet – das ist der Text des Menschen, nicht unserer.
- **Die Hilfe.** Kein Wörterbuch, sondern eine eigene Wissensbasis
  (`assets/hilfe-en.js`): Der Abgleich läuft über Wortstämme, und „kuendig“
  findet in „how do I cancel“ nichts.
- **Die Rechtstexte.** Übersetzt zum Verstehen, nicht zum Gelten. Über jedem
  steht in der englischen Fassung, dass die deutsche maßgeblich ist –
  Impressum, Erklärung und Geschäftsbedingungen wirken nach deutschem Recht,
  und zwei gleichrangige Fassungen wären zwei Verträge. Paragraphen bleiben
  im Original: „§ 551 BGB“ ist die Fundstelle, unter der man nachliest.

Deutsch bleibt die Voreinstellung. Automatisch nach der Browsersprache zu
schalten wäre bequem, überrascht aber: Der Bestand, die Städte und die
Rechtstexte sind deutsch. Wer umstellt, bleibt umgestellt.

Geprüft wird die Vollständigkeit nicht am Quelltext, sondern an der
Darstellung: Ein Skript besucht alle Ansichten auf Englisch, sammelt jeden
sichtbaren Textknoten samt Attributen und meldet, was noch deutsch ist. Von
1055 solchen Stellen sind zwei übrig, und beide mit Absicht – die
Beschriftung des Rückschalters und der Verweis auf die maßgebliche deutsche
Fassung.

## Durchgang durch alle Bereiche

Zum Abschluss ein Durchgang, der die Anwendung nicht entlang der Funktionen
prüft, sondern entlang der Annahmen. Jede Prüfung wurde vorher an einem
absichtlich eingebauten Fehler gemessen – ein Prüfer, der nie etwas findet,
sagt nichts.

Geprüft wurde:

- **Jedes Bedienelement anklicken** in allen Ansichten, in beiden Tarifen,
  angemeldet und nicht: 237 Elemente, keine Konsolenfehler.
- **Stumme Knöpfe**: Wo führt ein Klick zu gar nichts? So kam heraus, dass
  „Tausch anlegen“ eine Aktion trug, die es nie gab.
- **Zahlen**: kein NaN, kein Infinity, keine leere Einheit über alle 275
  Inserate und 14 Tauschketten.
- **Gespeicherter Zustand**: absichtlich verdorbene Werte, falsche Arten,
  abgeschnittenes JSON, voller Speicher.
- **Sehr lange Wörter** ohne Trennstelle in Titel, Adresse, Anbietername,
  Nachrichten und Notizen, bei 320, 390 und 1366 Pixeln.
- **Kennungen aus der Adresszeile**: `#/objekt/constructor` und Verwandte,
  die über den Prototyp ein Objekt liefern statt undefined.
- **Semantik**: Überschriftenfolge, zugängliche Namen, Landmarken,
  aria-Verweise, doppelte IDs.
- **Fokus**, mit der Tabulatortaste statt mit `element.focus()` – nur so
  greift `:focus-visible`, sonst misst man das Falsche.
- **Jede Feldart** in jeder Ansicht gegen die nackte Browservorgabe.
- **Flex- und Rasterbereiche mit Fließtext**, in denen ein Satz in
  getrennte Kästen zerfällt.
- **Typografie**: Anführungszeichen, Auslassungszeichen, Gedankenstriche,
  Einheiten, Schreibweisen.
- **Tempo**: Median 17 ms für die schwerste Ansicht, 6 ms auf einen
  Tastendruck in der Suche.
- **Tiefe Verweise und die Zurück-Taste**: jede Adresse beim Kaltstart, dazu
  Unsinn wie `#/objekt/` oder ein 300 Zeichen langer Name.

Gefunden und behoben wurden dabei unter anderem: ein Formular, das eigene
Inserate nicht laden konnte, Lockinserate mit widersprüchlicher Warm- und
Kaltmiete, ein weißer Bildschirm nach einem Wert falscher Art im Speicher,
eigene Inserate, die nach dem Neuladen aus dem Verzeichnis fielen, neun
Eingabefelder in nackter Browservorgabe (darunter die Anmeldung und der
Tresor), Meldungskästen, die Sätze mit Verweisen in drei Blöcke zerlegten,
ein abgeschalteter Fokusring an allen Formularfeldern und eine vollständige
Navigation auf der Anmeldeseite, in der jeder Punkt zur Anmeldeseite
zurückführte.
