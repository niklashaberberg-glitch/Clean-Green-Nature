# Clean Green Nature – Website

Einseitige Website für Laser-Graffitientfernung und Fassadenreinigung in Köln.

Die komplette Seite steckt in **einer einzigen Datei** (`index.html`): HTML, CSS,
JavaScript und sämtliche Grafiken. Es gibt keinen Build-Schritt, kein
Framework, keine Abhängigkeiten. Hochladen genügt.

## Dateien

```
index.html      die gesamte Website
images/         drei Bilddateien – siehe images/README.md
robots.txt      Freigabe für Suchmaschinen + Verweis auf die Sitemap
sitemap.xml     Seitenverzeichnis für Google & Co.
```

## Veröffentlichen

`index.html`, den Ordner `images/`, `robots.txt` und `sitemap.xml` in das
Web-Wurzelverzeichnis des Hosters kopieren. Fertig.

Sobald die endgültige Domain feststeht: In `index.html`, `robots.txt` und
`sitemap.xml` nach `clean-green-nature.de` suchen und ersetzen. Die Adresse
steht dort in `canonical`, den Open-Graph-Angaben und den Strukturdaten.

## Keine externen Aufrufe

Die Seite lädt beim Aufruf **nichts** von fremden Servern – keine Schriften,
keine Icon-Bibliothek, kein CSS-Framework, keine Stockfotos. Das hat drei
Effekte:

* **Datenschutz** – ohne Aufruf des Kontaktformulars fließen keine Daten an
  Dritte. Die Datenschutzerklärung in der Seite beschreibt genau das.
* **Tempo** – ein einziger Seitenaufruf, nichts blockiert das Rendern.
* **Verlässlichkeit** – kein fremder Dienst kann die Darstellung stören.

Die einzige Ausnahme ist der aktive Versand des Anfrageformulars. Dieses geht
an **FormSubmit** (`formsubmit.co`) und landet als E-Mail bei
`info@cleangreennature.de`.

> **Hinweis zur ersten Anfrage:** FormSubmit verlangt eine einmalige
> Bestätigung. Nach der allerersten abgesendeten Anfrage kommt eine E-Mail mit
> einem Aktivierungslink an `info@cleangreennature.de`. Erst nach dem Klick
> darauf werden Anfragen zugestellt. Am besten selbst einmal testweise
> absenden, bevor die Seite live geht.

## Der Richtpreis-Rechner

Die Rechnung läuft ausschließlich im Browser des Besuchers:

```
Grundwert  = Fläche (m²) × Untergrund-Ansatz (€/m²) × Verschmutzungsfaktor
Richtpreis = Grundwert × 0,95  bis  Grundwert × 1,15
```

Liegt die Entfernung über 10 km und der Grundwert unter 250 €, wird mit dem
Mindestauftragswert von 250 € gerechnet.

**Preise anpassen:** Die Ansätze stehen als `data-price` direkt an den Optionen
des Auswahlfeldes `#surface-select`, der Zuschlag für mehrlagige Verschmutzung
als `data-mult` an `#layer-select`. Beispiel:

```html
<option data-price="45" value="Klinker / Backstein">Klinker / Backstein</option>
```

Mindestauftragswert und Entfernungsgrenze stehen im Skript als
`MIN_ORDER_VALUE` und `MIN_ORDER_DISTANCE_KM`.

## Texte ändern

Alle Texte stehen als normaler HTML-Fließtext in `index.html`. Die Abschnitte
sind mit Kommentaren voneinander abgesetzt, zum Beispiel
`<!-- ===================== Leistungen ===================== -->`.

Rechtstexte (Impressum, Datenschutz, AGB) liegen ganz unten in den
Fenster-Bereichen und sind mit `id="modal-impressum"`, `id="modal-datenschutz"`
und `id="modal-agb"` markiert.

## Bedienung für Besucher

| Funktion | Bedienung |
|---|---|
| Suche über die ganze Seite | `Strg`/`Cmd` + `K` oder `/`, sonst die Lupe |
| Vorher/Nachher-Vergleich | ziehen, tippen oder Pfeiltasten |
| Heller/dunkler Modus | Schalter in der Kopfzeile, folgt sonst dem System |
| Fenster schließen | `Esc`, Klick daneben oder das ×-Symbol |
| Angaben übernehmen | „Zusammenfassung kopieren“ unter dem Richtpreis |

## Barrierefreiheit

Sprungmarke zum Inhalt, sichtbare Fokusrahmen, Fokusfalle und Fokusrückgabe in
allen Fenstern, Bedienung per Tastatur für Vergleichsregler und Suche,
`aria`-Auszeichnung für Regler, Menü und Dialoge, eine einzige `h1` mit
sauberer Überschriftenhierarchie sowie vollständige Berücksichtigung von
`prefers-reduced-motion`.

Ohne JavaScript bleiben alle Inhalte lesbar und das Formular absendbar; nur die
interaktiven Zugaben entfallen.

## Getestet

Chromium, Breiten von 320 px bis 1920 px, heller und dunkler Modus, mit und
ohne JavaScript, Maus/Tastatur/Touch. Kein horizontaler Überlauf, keine
Konsolenfehler, keine doppelten IDs.
