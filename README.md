# Clean Green Nature

Dieses Repository enthält zwei voneinander unabhängige Projekte:

| Ordner | Was |
|---|---|
| Wurzel (`index.html`) | die Website von Clean Green Nature – siehe unten |
| [`nestwerk/`](nestwerk/) | **Nestwerk**, eine Wohnungssuche, die Mietmarkt, Kauf, WG-Zimmer und Wohnungstausch in einer Oberfläche zusammenführt |

Beide laufen ohne Build-Schritt, ohne Framework und ohne Abhängigkeiten.

---

# Clean Green Nature – Website

Einseitige Website für Laser-Graffitientfernung und Fassadenreinigung in Köln.

Die komplette Seite steckt in **einer einzigen Datei** (`index.html`): HTML, CSS,
JavaScript, alle Icons und Illustrationen. Es gibt keinen Build-Schritt, kein
Framework, keine Abhängigkeiten. Hochladen genügt. Dazu kommen drei eigene
Bilddateien im Ordner `images/` und einige Fotos von Unsplash – siehe unten.

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

## Was von außen geladen wird

Schriften, Icons, CSS und JavaScript stecken vollständig in der Datei – nichts
davon kommt von fremden Servern. Nichts blockiert das Rendern, und kein fremder
Dienst kann die Darstellung kaputt machen.

Von außen kommen nur zwei Dinge:

* **Bilder von Unsplash** (`images.unsplash.com`) – die sechs Materialkacheln
  und die drei Projektbilder im Spendentopf. Alle mit `loading="lazy"`, werden
  also erst geladen, wenn der Besucher den Bereich erreicht.
* **Der Formularversand** an **FormSubmit** (`formsubmit.co`) – erst beim
  aktiven Absenden, landet als E-Mail bei `info@cleangreennature.de`.

Beides ist in Ziffer 4, 6 und 7 der Datenschutzerklärung beschrieben.

**Falls ein Bild nicht lädt:** Die Kacheln behalten ihre Größe und zeigen eine
ruhige Farbfläche mit Beschriftung. Ein Ausfall von Unsplash führt also nie zu
Löchern im Layout.

**Bilder gegen eigene Fotos tauschen:** Nach `images.unsplash.com` suchen und
die `src`-Adresse durch den Pfad zum eigenen Bild ersetzen, z. B.
`images/fassade-ehrenfeld.jpg`. Bitte auch den `alt`-Text anpassen. Sobald alle
Unsplash-Adressen ersetzt sind, kann Ziffer 4 der Datenschutzerklärung
entfallen.

> **Hinweis zur ersten Anfrage:** FormSubmit verlangt eine einmalige
> Bestätigung. Nach der allerersten abgesendeten Anfrage kommt eine E-Mail mit
> einem Aktivierungslink an `info@cleangreennature.de`. Erst nach dem Klick
> darauf werden Anfragen zugestellt. Am besten selbst einmal testweise
> absenden, bevor die Seite live geht.

## Fotos im Anfrageformular

Interessenten können bis zu **3 Dateien** anhängen (je max. **5 MB**; JPG, PNG,
WEBP, HEIC oder PDF) – per Klick oder per Ziehen und Ablegen. Vor dem Absenden
sieht man Vorschaubilder und kann einzelne Dateien wieder entfernen.

Der Versand läuft je nach Situation über zwei Wege:

| Fall | Weg | Was der Besucher sieht |
|---|---|---|
| ohne Anhang | Hintergrundversand (AJAX) | Erfolgsmeldung direkt auf der Seite, kein Seitenwechsel |
| mit Anhang | klassischer Formular-POST | kurzer Seitenwechsel zu FormSubmit, dann zurück auf die Seite mit Erfolgsmeldung |

Der Rücksprung läuft über das Feld `_next`, das per JavaScript auf die aktuelle
Adresse plus `?anfrage=gesendet` gesetzt wird. Das funktioniert dadurch auf
jeder Domain, auch auf einer Testadresse – ohne dass etwas angepasst werden muss.

> **Bitte einmal testen:** Anhänge übernimmt FormSubmit; wie viele Dateien pro
> Anfrage tatsächlich zugestellt werden, entscheidet deren Dienst. Senden Sie
> sich einmal selbst eine Anfrage mit **zwei** Fotos und prüfen Sie, ob beide
> ankommen. Falls nur eines durchkommt, in `index.html` nach `MAX_FILES` suchen
> und den Wert auf `1` setzen – der Hinweistext unter der Upload-Fläche muss
> dann ebenfalls angepasst werden.

Limits ändern: `MAX_FILES`, `MAX_BYTES` und `OK_TYPES` stehen im Skript
direkt beieinander.

## Der Richtpreis-Rechner

Die Rechnung läuft ausschließlich im Browser des Besuchers:

```
Grundwert  = Fläche (m²) × Untergrund-Ansatz (€/m²) × Verschmutzungsfaktor
Richtpreis = Grundwert × 0,95  bis  Grundwert × 1,15
```

**Kleinaufträge:** Bis 2 km Entfernung gibt es keinen Mindestauftragswert –
auch ein einzelnes Tag am Garagentor ist damit ein normaler Auftrag. Erst über
2 km greift der Mindestauftragswert von 250 €, sofern der Grundwert darunter
liegt.

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
| Fotos anhängen | Klick auf die Fläche oder Dateien darauf ziehen |
| Heller/dunkler Modus | Schalter in der Kopfzeile, folgt sonst dem System |
| Fenster schließen | `Esc`, Klick daneben oder das ×-Symbol |
| Angaben übernehmen | „Zusammenfassung kopieren“ unter dem Richtpreis |

## Barrierefreiheit

Sprungmarke zum Inhalt, sichtbare Fokusrahmen, Fokusfalle und Fokusrückgabe in
allen Fenstern, vollständige Bedienbarkeit per Tastatur,
`aria`-Auszeichnung für Menü, Dialoge und Statusmeldungen, eine einzige `h1` mit
sauberer Überschriftenhierarchie sowie vollständige Berücksichtigung von
`prefers-reduced-motion`.

Ohne JavaScript bleiben alle Inhalte lesbar und das Formular absendbar; nur die
interaktiven Zugaben entfallen.

## Getestet

Chromium, Breiten von 320 px bis 1920 px, heller und dunkler Modus, mit und
ohne JavaScript, Maus/Tastatur/Touch. Kein horizontaler Überlauf, keine
Konsolenfehler, keine doppelten IDs.

---

# Nestwerk – Wohnungssuche

Liegt in [`nestwerk/`](nestwerk/) und hat mit der Website nichts zu tun –
eigener Ordner, eigene Dateien, eigene Dokumentation.

Nestwerk führt zusammen, was sonst auf drei Portale verteilt ist: Mietmarkt,
Kaufangebote, WG-Zimmer und Wohnungstausch. Ein Profil, eine Merkliste, eine
Bewerbermappe für alle vier.

**Zum Ausprobieren:** `nestwerk/dist/nestwerk.html` per Doppelklick öffnen.

Was dabei über die Vorlagen hinausgeht:

* **Ringtausch** – findet Tauschketten über zwei, drei oder vier Haushalte,
  nicht nur den direkten Tausch, der praktisch nie zustande kommt.
* **Vergleichsmiete** an jedem Inserat, mit Hinweis auf die Mietpreisbremse.
* **Vertragslupe** – liest den Inseratstext auf Klauseln, die später Geld
  kosten, und erklärt jede einzeln.
* **Prüfhinweis** – erkennt die üblichen Muster erfundener Inserate.
* **Chancen ehrlich** – trennt, was du beeinflussen kannst (deine Bewerbung)
  von dem, was du nicht beeinflussen kannst (der Andrang).
* **Doppelte Inserate** – dieselbe Wohnung von zwei Maklern wird erkannt.
* **Echte Monatskosten** statt Warmmiete, inklusive Einmalkosten beim Einzug.
* **Passung ohne bezahlte Plätze**, mit offengelegter Rechnung.
* **WG-Passung** über sechs Dimensionen des Zusammenlebens.
* **Werkzeuge fürs ganze Wohnen** – Leistbarkeit, Wohngeld, Wohnberechtigungs-
  schein, Umzugsplan, Übergabeprotokoll, Nebenkostenprüfung, Marktdaten.
* **Karte und Bilder selbst gezeichnet** – kein Kachelserver, keine fremden
  Fotos, keine Nachverfolgung.

## Das Geschäftsmodell

Ein freier Tarif mit Anzeigen und ein Abo für 7,90 € im Monat. Die Aufteilung
folgt einem einzigen Satz:

> **Plus bezahlt Zeitersparnis bei häufiger Nutzung – niemals einen Vorteil
> gegenüber anderen Bewerbern.**

Frei bleibt deshalb alles, was schützt (Betrugserkennung, Vergleichsmiete,
Chancen), alles, was gerechnet werden muss (Leistbarkeit, Wohngeld, WBS,
Nebenkosten, Übergabe), und die vollständige Suche. Plus kostet, was jemand
zehnmal am Tag anfasst: mehrere Suchaufträge, Serienbewerbung, die vollständige
Vertragslupe, Ringtauschketten, Marktdaten – und keine Anzeigen.

Ausdrücklich **nicht** käuflich: bessere Platzierung, Vorrang bei Vermietern,
Frühzugang zu Inseraten. Genau das verkaufen die meisten Portale.

Alles läuft im Browser. Kein Server, kein Konto, keine Übertragung an Dritte.
Die vollständige Beschreibung steht in [`nestwerk/README.md`](nestwerk/README.md).
