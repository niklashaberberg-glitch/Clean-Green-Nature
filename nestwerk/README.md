# Nestwerk

Eine Wohnungssuche, die Mietmarkt, Kaufangebote, WG-Zimmer und Wohnungstausch
in **einer** Oberfläche zusammenführt – mit einem Profil, einer Merkliste und
einer Bewerbermappe für alle vier Welten.

Läuft vollständig im Browser. Kein Server, kein Konto, keine Übertragung an
Dritte. Alles, was du eingibst, bleibt im Speicher deines Geräts.

---

## Das Geschäftsmodell in einem Satz

> **Plus bezahlt Zeitersparnis bei häufiger Nutzung – niemals einen Vorteil
> gegenüber anderen Bewerbern.**

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

**Was Plus ausdrücklich nicht kauft:** keine bessere Platzierung in der
Trefferliste, keinen Vorrang bei Vermietern, keinen Frühzugang zu Inseraten,
keine Daten anderer Nutzer. Genau das verkaufen die meisten Portale – und genau
deshalb ist ihre Trefferreihenfolge nicht nachvollziehbar.

| | Nestwerk frei | Nestwerk Plus |
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
Profils. Es gibt keinen Server, an den Daten gehen könnten.

In der Vorführung lässt sich Plus oben rechts mit einem Klick an- und
abschalten, damit beide Welten vergleichbar sind.

---

## Sofort ausprobieren

```
nestwerk/dist/nestwerk.html      per Doppelklick öffnen – das war es
```

Oder die aufgeteilte Fassung mit einem beliebigen Webserver:

```bash
cd nestwerk
python3 -m http.server 8080      # dann http://localhost:8080 öffnen
```

Beide Fassungen enthalten denselben Stand. Die Einzeldatei entsteht aus den
Quelldateien mit `node build.js` und braucht dafür nichts installiert.

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
Chancenrechnung. Solange nichts eingetragen ist, sagt Nestwerk bei den Chancen
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

Bei null oder sehr wenigen Treffern rechnet Nestwerk jede mögliche Lockerung
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
darüber, weist Nestwerk auf die Mietpreisbremse hin und nennt den Betrag, der
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
im Ausland“, Schlüssel per Kurier, keine Besichtigung: Nestwerk erkennt die
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
Gegenteil voneinander wollen müssen. Nestwerk baut aus allen Tauschangeboten
einen gerichteten Graphen – eine Kante bedeutet „diese Wohnung erfüllt meine
Suche“ – und sucht darin geschlossene Ketten mit zwei, drei oder vier
Beteiligten. Jede Kette bekommt eine Güte, das schwächste Glied wird benannt,
und wo Abstriche nötig sind, stehen sie dabei.

Für das eigene Angebot rechnet Nestwerk zusätzlich durch, welche Lockerung
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

Nestwerk kehrt das um. Die Dateien werden einmal im Browser verschlüsselt
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

### Bewerbungstafel

Jedes gemerkte Objekt durchläuft sechs Stufen: gemerkt, angeschrieben,
Termin, Unterlagen raus, Zusage, Absage. Daraus errechnet Nestwerk eine
Erfolgsquote – nützlich, um zu merken, ob die Suche zu eng oder das
Anschreiben zu blass ist.

### Besichtigung

Feste Zeitfenster statt Massenbesichtigung, dazu eine Checkliste mit sechzehn
Fragen von Schimmel über Wasserdruck bis zur letzten Nebenkostenabrechnung.
Notizen und Haken lassen sich als Text herauskopieren.

### Wie stehen deine Chancen?

Die meisten Portale sagen dazu nichts, weil die ehrliche Antwort unangenehm
ist. Nestwerk trennt, was der Mensch in der Hand hat, von dem, was er nicht in
der Hand hat: **die Stärke deiner Bewerbung** (Einkommen zur Kaltmiete,
Unterlagen, Zeitpunkt, Belegung, WBS) und **den Andrang** (wie viele sich
bereits gemeldet haben). Nur das Erste kannst du ändern – deshalb steht es
links und in der Ampel, und darunter stehen konkrete Schritte.

Eine einzige Prozentzahl würde beides vermischen und nur entmutigen.

### Doppelt eingestellte Wohnungen erkennen

Dieselbe Wohnung steht auf Portalen regelmäßig zweimal – vom Eigentümer und
vom beauftragten Makler, oder von zwei Maklern zugleich. Wer das nicht merkt,
bewirbt sich zweimal auf dasselbe Objekt und wirkt unentschlossen. Nestwerk
vergleicht Fläche, Zuschnitt, Baujahr, Etage, Lage und Preis und benennt die
Übereinstimmungen.

### Nebenkostenabrechnung prüfen

Der Katalog der Betriebskostenverordnung ist abschließend: 15 Posten dürfen
umgelegt werden, 8 häufig auftauchende nicht – auch dann nicht, wenn der
Mietvertrag es behauptet. Nestwerk stellt beide Listen gegenüber, rechnet die
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
Kaltmiete als Netto). Nestwerk zeigt beide, sagt welche die engere ist, und
rechnet für jede Stadt aus, wie groß die Wohnung damit sein dürfte.

### Wohnberechtigungsschein und Wohngeld

Beide Leistungen bleiben massenhaft ungenutzt, weil viele annehmen, sie stünden
ihnen nicht zu.

Beim **WBS** rechnet Nestwerk den fiddligen Teil – das maßgebliche
Jahreseinkommen mit Werbungskosten-, Steuer-, Kranken- und Rentenpauschale und
den Freibeträgen – und stellt es der Einkommensgrenze gegenüber. Die Grenze
setzen aber die Länder selbst und weichen erheblich voneinander ab. Deshalb
rechnet Nestwerk nicht heimlich mit einer Zahl, sondern legt sie offen und
macht sie änderbar; voreingestellt ist der Bundesrahmen aus § 9 WoFG.

Beim **Wohngeld** gibt es bewusst keinen Eurobetrag. Die Höhe folgt einer Formel
mit Beiwerten, die je nach Haushaltsgröße verschieden sind und regelmäßig
geändert werden, und hängt zusätzlich an der Mietstufe der Gemeinde. Eine
ausgedachte Zahl wäre schlimmer als keine – sie würde vom Antrag abhalten oder
falsche Hoffnung machen. Nestwerk prüft stattdessen die Ausschlussgründe, ordnet
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
nestwerk/
  index.html            lädt die Einzelteile, kein Build nötig
  build.js              baut daraus die Einzeldatei (node build.js)
  dist/
    nestwerk.html       vollständige Seite in einer Datei
    artifact.html       nur der Seiteninhalt, zum Einbetten
  assets/
    app.css             Design-System, hell und dunkel
    util.js             Formate, DOM-Hilfen, Geo, Speicher
    geo.js              10 Städte, 83 Viertel, Vergleichswerte
    images.js           die selbst gezeichneten Ansichten
    data.js             erzeugt den Beispielbestand
    analyse.js          Vergleichsmiete, Risiko, Klauseln, Kosten, Passung
    match.js            WG-Passung und Ringsuche
    werkzeuge.js        Chancen, Doppel-Erkennung, Preisreihen, Leistbarkeit,
                        WBS, Wohngeld, Betriebskosten, Routenplanung
    store.js            Zustand und Speicherung
    plan.js             Tarife, Grenzen, Anzeigen
    tresor.js           Verschlüsselung, Ablage, befristete Freigaben
    karte.js            die Karte
    ui.js               Schale, Router, geteilte Bausteine
    view-*.js           die einzelnen Ansichten
    app.js              Start
```

Reihenfolge der Skripte ist bewusst: `util` zuerst, `app` zuletzt. Jede Datei
hängt sich an ein einziges globales `NW` und benutzt nur, was vorher da war.

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

Es gibt keinen Server. Merkliste, Profil, Suchaufträge, Nachrichten und
eigene Inserate liegen im `localStorage` dieses Browsers unter dem Schlüssel
`nestwerk.v1`. Unter „Meine Daten“ im Fußbereich lässt sich der Stand als
Datei sichern oder vollständig löschen. Beim Leeren der Browserdaten
verschwindet er ebenfalls.

Die Dokumente des Tresors liegen davon getrennt: das Chiffrat in der
IndexedDB `nestwerk-tresor`, die Kopfdaten der Freigaben unter
`nestwerk.tresor.v1`. Beides ist ohne Kennwort wertlos – der Schlüssel wird
nirgends abgelegt. „Meine Daten“ sichert den Tresor deshalb ausdrücklich
nicht mit; verschlüsselte Dateien in einer Klartextdatei zu exportieren wäre
das Gegenteil dessen, wofür er da ist.

## Hinweis zum Bestand

Alle Inserate, Anbieter, Namen, Adressen und Bewertungen sind erzeugt. Die
Vergleichswerte für Miete und Kaufpreis sind plausible Rechengrößen, kein
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

Dazu ein durchgespielter Weg einer erfundenen Nutzerin – von der leeren Seite
über Profil, Suche, Bewerbung und Rechner bis zum Umzugsplan. Automatische
Tests sagen, ob etwas funktioniert; nur das Durchspielen sagt, ob es
zusammenpasst. Gefunden und behoben wurden dabei unter anderem: eine Wand aus
gestapelten Meldungen beim Ausfüllen des Profils, ein verlorener Tastaturfokus
beim Merken, ein springender Bildlauf nach jeder Zustandsänderung und ein
Lockerungsvorschlag, der die Nutzerin an den falschen Ort geführt hätte.

Die Diagrammfarben sind mit einem Palettenprüfer gegen Farbfehlsichtigkeit
gerechnet – alle Paare, hell und dunkel, ΔE ≥ 9 unter Deuteranopie,
Protanopie und Tritanopie.
