# Nestwerk

Eine Wohnungssuche, die Mietmarkt, Kaufangebote, WG-Zimmer und Wohnungstausch
in **einer** Oberfläche zusammenführt – mit einem Profil, einer Merkliste und
einer Bewerbermappe für alle vier Welten.

Läuft vollständig im Browser. Kein Server, kein Konto, keine Übertragung an
Dritte. Alles, was du eingibst, bleibt im Speicher deines Geräts.

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

### Eine Reihenfolge, die sich erklärt

Es gibt keine bezahlten Plätze. Jedes Inserat bekommt eine Passung von 0 bis
100, die sich aus deinen eigenen Gewichtungen ergibt: Preis, Lage, Zuschnitt,
Ausstattung, Energie, Arbeitsweg, Preis-Leistung. Auf der Objektseite steht
aufgeschlüsselt, welcher Teil wie viel beigetragen hat. Über der Trefferliste
erklärt ein Aufklapper, warum das erste Ergebnis das erste ist.

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

### Bewerbungstafel

Jedes gemerkte Objekt durchläuft sechs Stufen: gemerkt, angeschrieben,
Termin, Unterlagen raus, Zusage, Absage. Daraus errechnet Nestwerk eine
Erfolgsquote – nützlich, um zu merken, ob die Suche zu eng oder das
Anschreiben zu blass ist.

### Besichtigung

Feste Zeitfenster statt Massenbesichtigung, dazu eine Checkliste mit sechzehn
Fragen von Schimmel über Wasserdruck bis zur letzten Nebenkostenabrechnung.
Notizen und Haken lassen sich als Text herauskopieren.

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
    store.js            Zustand und Speicherung
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
| Farben, Abstände, Rundungen | `assets/app.css`, ganz oben unter „Token“ |

## Bedienung

| Funktion | Bedienung |
|---|---|
| Schnellsuche | `Strg`/`Cmd` + `K`, oder `/` |
| Hauptbereiche | Tasten `1` bis `6` |
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

## Hinweis zum Bestand

Alle Inserate, Anbieter, Namen, Adressen und Bewertungen sind erzeugt. Die
Vergleichswerte für Miete und Kaufpreis sind plausible Rechengrößen, kein
amtlicher Mietspiegel. Rechtliche Erläuterungen sind allgemeine Hinweise und
ersetzen keine Beratung.

## Getestet

Chromium, 320 px bis 1920 px, hell und dunkel, Maus, Tastatur und Touch,
aufgeteilt und als Einzeldatei über `file://`. Keine Konsolenfehler, keine
doppelten IDs, kein waagerechter Überlauf.
