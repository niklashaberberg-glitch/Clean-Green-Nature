# Pflichtbuch

Nachweis der Verkehrssicherungspflicht – Räum- und Streupflicht, Sichtkontrollen,
Reinigung und Mängel. Ein Einsatz ist in rund 30 Sekunden dokumentiert, mit Foto,
Standort, Uhrzeit und einer Prüfsumme, die nachträgliche Änderungen sichtbar macht.

Die App läuft vollständig auf dem Gerät. Kein Konto, kein Server, keine Cloud.

## Warum gerade das

Wer ein Grundstück bewirtschaftet, haftet für die Verkehrssicherheit. Nach einem
Sturz auf Glatteis liegt die Beweislast praktisch beim Pflichtigen: Er muss zeigen,
dass er geräumt und gestreut hat. Dokumentiert wird das bis heute überwiegend auf
Papierlisten oder in Excel – beides lässt sich nachträglich ohne jede Spur ändern
und ist genau deshalb angreifbar.

Software für Facility Management kann das, kostet aber vierstellig im Jahr und
richtet sich an grosse Betriebe. Dazwischen liegt die Lücke: Hausmeisterdienste,
kleine Hausverwaltungen, Winterdienstunternehmen, kommunale Bauhöfe.

Drei Dinge unterscheiden Pflichtbuch von einer Notiz-App:

1. **Verkettete Prüfsummen.** Jeder Eintrag wird mit SHA-256 versiegelt. In die
   Prüfsumme fliessen der gesamte Inhalt, alle Fotos und die Prüfsumme des
   vorherigen Eintrags ein. Ein nachträglich geänderter, eingefügter oder
   entfernter Eintrag bricht die Kette an nachweisbarer Stelle. Korrekturen sind
   nur als zusätzlicher Eintrag möglich – wie in einem Kassenbuch.
2. **Offline zuerst.** Gestreut wird um fünf Uhr morgens im Hinterhof. Die App
   braucht dort keine Verbindung; sie hat nie eine gebraucht.
3. **Keine Datenübertragung.** Nichts verlässt das Gerät. Das vereinfacht den
   Datenschutz erheblich und ist im Verkaufsgespräch ein Argument, kein Problem.

**Wichtig, ohne Beschönigung:** Die Kette belegt, dass ein Eintrag seit seiner
Erfassung unverändert ist. Sie belegt nicht, dass der Eintrag inhaltlich stimmt,
und sie sagt nichts darüber, wie ein Gericht den Nachweis im Einzelfall würdigt.
Bevor Sie mit Formulierungen wie „gerichtsfest" werben, lassen Sie den Text bitte
anwaltlich prüfen. Rechtlich haltbar ist die Aussage, dass nachträgliche
Änderungen technisch erkennbar sind.

## Dateien

```
index.html              die gesamte App – Aufbau, Gestaltung, Logik
manifest.webmanifest    Angaben für die Installation auf dem Startbildschirm
sw.js                   Service Worker, macht die App offline lauffähig
icons/                  App-Symbole (192, 512, maskierbar, Apple, Favicon)
```

Kein Build-Schritt, keine Abhängigkeiten, keine fremden Server – dieselbe Bauweise
wie die Website eine Ebene höher.

## Veröffentlichen als Web-App

Den Ordner `app/` in das Web-Wurzelverzeichnis hochladen. Erreichbar unter
`https://www.cleangreennature.de/app/`.

**HTTPS ist Pflicht.** Ohne HTTPS gibt es keinen Service Worker, keine Installation
auf dem Startbildschirm und keine Standortabfrage.

Danach lässt sich die App auf Android über „Zum Startbildschirm hinzufügen" und auf
dem iPhone über „Teilen → Zum Home-Bildschirm" installieren. Sie läuft dann im
Vollbild wie eine gewöhnliche App. Für viele Kunden reicht dieser Weg bereits –
und er kostet nichts.

## In den Google Play Store

Android nimmt eine PWA unverändert als App auf (Trusted Web Activity).

1. **Play-Konto anlegen** – einmalig 25 US-Dollar.
   Melden Sie sich als **Organisation** an, nicht als Privatperson: Für neue
   Privatkonten verlangt Google vor der Veröffentlichung einen geschlossenen Test
   mit 12 Testern über 14 Tage. Für Organisationskonten entfällt das. Dafür wird
   eine D-U-N-S-Nummer gebraucht (kostenlos bei Dun & Bradstreet, Bearbeitung
   dauert ein bis zwei Wochen – rechtzeitig beantragen).
   Die Anforderungen ändern sich gelegentlich; bitte im Play-Console-Hilfebereich
   gegenprüfen.
2. **Paket erzeugen** – auf [pwabuilder.com](https://www.pwabuilder.com) die
   Adresse `https://www.cleangreennature.de/app/` eintragen und ein Android-Paket
   erstellen lassen. Alternativ auf der Kommandozeile:
   ```
   npm i -g @bubblewrap/cli
   bubblewrap init --manifest https://www.cleangreennature.de/app/manifest.webmanifest
   bubblewrap build
   ```
3. **Verknüpfung bestätigen** – der Bauvorgang liefert einen SHA-256-Fingerabdruck.
   Damit die App ohne Adresszeile startet, muss unter
   `https://www.cleangreennature.de/.well-known/assetlinks.json` liegen:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": { "namespace": "android_app",
                 "package_name": "de.cleangreennature.pflichtbuch",
                 "sha256_cert_fingerprints": ["HIER DER FINGERABDRUCK"] }
   }]
   ```
   Ohne diese Datei erscheint oben eine Adresszeile – die App funktioniert, sieht
   aber nicht aus wie eine App.
4. **Eintrag ausfüllen** – Beschreibung, mindestens zwei Bildschirmfotos,
   Symbol 512×512, Grafik 1024×500, Datenschutzerklärung als öffentliche Adresse,
   Formular „Datensicherheit" (hier durchgehend: keine Datenerhebung, keine
   Weitergabe), Altersfreigabe.
5. Prüfung durch Google: in der Regel wenige Tage.

## In den App Store

Aufwendiger. Rechnen Sie mit einem Tag Arbeit und laufenden Kosten.

* **Ein Mac mit Xcode ist zwingend.** Ohne Apple-Rechner geht es nicht.
* **99 US-Dollar im Jahr**, laufend. Für die Firmenanmeldung ebenfalls D-U-N-S.
* **Eine blosse Webansicht wird abgelehnt** (Richtlinie 4.2, „Minimum
  Functionality"). Verpacken Sie die App deshalb mit **Capacitor** und nutzen Sie
  Kamera und Standort über die nativen Erweiterungen:
  ```
  npm i -D @capacitor/cli && npx cap init Pflichtbuch de.cleangreennature.pflichtbuch
  npm i @capacitor/core @capacitor/camera @capacitor/geolocation
  # den Inhalt von app/ als webDir eintragen
  npx cap add ios && npx cap open ios
  ```
  In `Info.plist` müssen `NSCameraUsageDescription` und
  `NSLocationWhenInUseUsageDescription` mit einer verständlichen deutschen
  Begründung stehen, sonst wird abgelehnt.
* **Zum Verkauf:** Verkaufen Sie die Freischaltung über Rechnung ausserhalb der
  App – bei Geschäftskunden ist das ohnehin üblich und Ihnen bleiben die 15 bis 30
  Prozent Ladenprovision erspart. Nehmen Sie in der iOS-Fassung aber den Hinweis
  auf die E-Mail-Adresse im Freischaltfenster heraus (`KAUF_MAIL`): Apple sieht
  Hinweise auf Kaufwege ausserhalb der App kritisch. Ein reines Eingabefeld für
  den Schlüssel ist unproblematisch.

## Freischaltung einrichten

Kostenfrei führt die App **ein Objekt** vollständig – mit Fotos, Standort, Kette
und PDF. Wer mehrere Objekte betreut, braucht einen Schlüssel.

Die Prüfung läuft mit einer Signatur (ECDSA P-256) auf dem Gerät des Kunden, ohne
Internet und ohne Konto. Einrichtung:

1. `tools/lizenz-generator.html` **lokal** im Browser öffnen (Doppelklick genügt).
2. Einmalig ein Schlüsselpaar erzeugen. Den privaten Schlüssel sicher verwahren.
3. Den öffentlichen Schlüssel in `app/index.html` einsetzen – dort steht
   `const LIZENZ_PUBKEY = null;`.
4. Für jeden Kunden im selben Werkzeug einen Schlüssel ausstellen (Name, Anzahl
   Objekte, Laufzeit) und mit der Rechnung versenden.

**Der Generator gehört nicht auf den Webserver.** Wer den privaten Schlüssel hat,
kann beliebig viele Freischaltungen erzeugen. Beim Hochladen den Ordner `tools/`
weglassen.

Und offen gesagt: Die Sperre lässt sich von einem entschlossenen Anwender mit
Kenntnis der Browser-Entwicklerwerkzeuge umgehen – das gilt für jede rein lokale
App. Bei Geschäftskunden, die eine Rechnung brauchen und im Streitfall ein
sauberes Protokoll vorlegen wollen, ist das kein praktisches Problem.

## Was Sie noch anpassen sollten

| Stelle in `index.html` | Bedeutung |
|---|---|
| `KAUF_MAIL` | Anlaufstelle für Freischaltungen, steht derzeit auf `info@cleangreennature.de` |
| `LIZENZ_PUBKEY` | öffentlicher Schlüssel, siehe oben |
| `FREI_OBJEKTE` | Objekte in der kostenfreien Fassung, derzeit 1 |
| `MAX_FOTOS` | Fotos je Eintrag, derzeit 6 |
| `ARTEN` | Einsatzarten und die zugehörigen Maßnahmen |
| `WETTER` | Auswahlliste der Witterung |

Für den Store brauchen Sie zusätzlich eine **eigene Datenschutzerklärung für die
App** unter einer öffentlichen Adresse. Sie fällt kurz aus: Es werden keine Daten
erhoben, nichts verlassen das Gerät, Kamera und Standort werden nur auf
ausdrückliche Handlung hin verwendet und ausschliesslich lokal gespeichert.

## Getestet

Chromium, Bildschirmbreiten von 320 bis 1920 Pixeln, heller und dunkler Modus.
Automatisch geprüft und ohne Befund:

* Objekt anlegen, Einsatz starten, Maßnahmen wählen, Foto anhängen, versiegeln
* Zeitmessung, Standorterfassung, laufender Einsatz übersteht das Schliessen
* Kettenprüfung über Einträge **und** Fotos
* nachträgliche Änderung in der Datenbank wird erkannt und benannt
* Sicherung, Löschen des Bestands, Wiedereinlesen – Prüfsummen bleiben gleich
* Betrieb ohne Netzverbindung über den Service Worker
* Freischaltung: gesperrte Grenze, falscher Schlüssel, verfälschte Signatur,
  gültiger Schlüssel, Fortbestand nach Neustart
* PDF-Ausgabe mit Tabelle, Prüfergebnis, Unterschriftszeile und Fotoanhang
* kein waagerechter Überlauf, keine Konsolenfehler

## Grenzen

* **Ein Gerät, ein Bestand.** Es gibt keine Übertragung zwischen Geräten und keine
  Mehrbenutzerfassung. Wer im Team arbeitet, führt je Gerät ein Buch und legt die
  PDF-Protokolle zusammen. Ein Abgleich wäre der nächste sinnvolle Ausbau – er
  bräuchte dann allerdings einen Server und damit einen Auftragsverarbeitungsvertrag.
* **Der Speicher hängt am Browser.** Wird die App deinstalliert oder die
  Website-Daten gelöscht, ist der Bestand weg. Die App fordert dauerhaften
  Speicher an und weist auf die Sicherung hin – die Sicherung bleibt trotzdem
  Pflicht.
* **Die PDF-Ausgabe läuft über den Druckdialog.** Auf dem iPhone: Teilen → Drucken
  → mit zwei Fingern aufziehen → als PDF sichern. Das ist ein Umweg, kostet aber
  keine zusätzliche Bibliothek.
