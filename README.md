# Clean Green Nature – Website

Einseitige Website für chemiefreie Laserreinigung in Köln – für Industrie,
Infrastruktur und Denkmäler. Inhalt und Aufbau folgen der Kurzvorstellung
für Facility Management, Einkauf und die öffentliche Hand.

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
app/            Pflichtbuch – eigenständige App, siehe app/README.md
tools/          internes Werkzeug, gehört NICHT auf den Webserver
```

## Pflichtbuch – die App

Im Ordner `app/` liegt ein zweites, eigenständiges Erzeugnis: **Pflichtbuch**,
eine App zum Nachweis der Verkehrssicherungspflicht (Räum- und Streupflicht,
Sichtkontrollen, Mängel). Sie richtet sich an Hausverwaltungen,
Hausmeisterdienste und Bauhöfe – also an dieselben Ansprechpartner wie die
Laserreinigung.

Die App läuft offline, speichert ausschliesslich auf dem Gerät und versiegelt
jeden Eintrag mit einer verketteten Prüfsumme. Sie lässt sich unverändert als
Web-App betreiben und als Paket in den Google Play Store und den App Store
bringen. Einbau, Preismodell, Freischaltung und der Weg in beide Stores stehen
in `app/README.md`.

Der Ordner `tools/` enthält das Werkzeug zum Erzeugen der Freischalt-Schlüssel
und darf nicht mit hochgeladen werden.

## Veröffentlichen

`index.html`, den Ordner `images/`, `robots.txt` und `sitemap.xml` in das
Web-Wurzelverzeichnis des Hosters kopieren. Fertig.

**Domain:** Die Seite ist durchgängig auf `https://www.cleangreennature.de/`
eingestellt – so steht sie in der Kurzvorstellung und so lautet auch die
E-Mail-Adresse. Vorher stand hier `clean-green-nature.de` mit Bindestrichen.
Falls die Bindestrich-Variante doch die richtige ist: in `index.html`,
`robots.txt` und `sitemap.xml` nach `cleangreennature.de` suchen und ersetzen.
Die Adresse steht in `canonical`, den Open-Graph-Angaben und den Strukturdaten.

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

## GraffitiCare Portfolio

Der Abschnitt liegt unter dem Anker **`#graffiticare`** – genau die Adresse, auf
die die Kurzvorstellung verweist (`www.cleangreennature.de/#graffiticare`).

Drei Pakete, Preise je Objekt und Monat, netto:

| Paket | Preis | Sichtkontrollen | Entfernung/Jahr | Rückmeldung |
|---|---|---|---|---|
| BASIS | 35 € | 2 | bis 8 m² | 5 Werktage |
| AKTIV | 69 € | 4 | bis 16 m² | 48 Stunden |
| KOMPLETT | 129 € | 6 | bis 32 m² | 24 Stunden |

Der Portfolio-Rechner darunter multipliziert Objektzahl × Paketpreis und zieht
die Mengenstaffel ab. Er zeigt Monatsrate, effektiven Preis je Objekt und die
Summe auf 12 Monate. Ein Klick auf „Dieses Portfolio anfragen“ übernimmt die
Konfiguration ins Anfrageformular.

> **Bitte prüfen – die Staffel-Stufen sind von mir gesetzt.** Die
> Kurzvorstellung nennt nur „ab 5 Objekten eine Mengenstaffel von 5 bis 20 %“,
> aber nicht die Zwischenschritte. Hinterlegt ist:
>
> | Objekte | Rabatt |
> |---|---|
> | 1–4 | 0 % |
> | 5–9 | 5 % |
> | 10–19 | 10 % |
> | 20–49 | 15 % |
> | ab 50 | 20 % |
>
> Anpassen in `index.html` unter `VOLUME_SCALE` – die Übersicht im Aufklapper
> „Wie die Mengenstaffel gestaffelt ist“ erzeugt sich daraus automatisch.

Paketpreise ändern: an zwei Stellen, in den Karten (`.tier__price`) und in den
Optionen von `#pf-tier` (`data-price`).

## Der Richtpreis-Rechner

Für **Einzelaufträge**. Die Rechnung läuft ausschließlich im Browser des
Besuchers:

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
| Portfolio berechnen | Regler und Paketwahl unter `#graffiticare` |

## Barrierefreiheit

Sprungmarke zum Inhalt, sichtbare Fokusrahmen, Fokusfalle und Fokusrückgabe in
allen Fenstern, vollständige Bedienbarkeit per Tastatur,
`aria`-Auszeichnung für Menü, Dialoge und Statusmeldungen, eine einzige `h1` mit
sauberer Überschriftenhierarchie sowie vollständige Berücksichtigung von
`prefers-reduced-motion`.

Ohne JavaScript bleiben alle Inhalte lesbar und das Formular absendbar; nur die
interaktiven Zugaben entfallen.

## Woher der Inhalt stammt

Texte, Leistungsbereiche, Einsatzbereiche, Ablaufschritte, Paketpreise und die
Positionierung folgen der Kurzvorstellung („Chemiefreie Laserreinigung für
Industrie, Infrastruktur & Denkmäler“, 2 Seiten). Zwei Abweichungen sind
bewusst:

* **Clean Advertising** steht nicht in der Kurzvorstellung, war aber auf der
  Seite ausgearbeitet. Es ist nicht gelöscht, sondern als ergänzende Leistung
  unter die sechs Kernbereiche gerückt.
* **Laserbeauftragter**: Die Kurzvorstellung nennt nur „Gründer“. Da die Rolle
  ausdrücklich hervorgehoben werden sollte, steht sie weiterhin in der Vision
  und in den Strukturdaten.

## Anfrageformular

Die Felder heißen im E-Mail-Eingang so, wie sie hier stehen:

| Block | Felder |
|---|---|
| Kontakt | `Name_Firma`, `email`, `Telefon`, `Ort_Stadtteil` |
| Leistungsbereich | `Leistung_Graffitientfernung`, `Leistung_Fassade_Denkmal`, `Leistung_Industrie_Anlagen`, `Leistung_Verkehr`, `Leistung_Aussenanlagen_Parkraum`, `Leistung_Clean_Advertising` |
| Zusätzlich | `Wunsch_Probelaserung`, `Interesse_Dokumentation`, `Interesse_Rahmenvertrag`, `Interesse_Objektbesichtigung` |
| Einzelauftrag | `Flaeche_in_qm`, `Entfernung_in_km`, `Untergrund_Material`, `Verschmutzungsgrad`, `Berechneter_Richtpreis` |
| Portfolio | `Interesse_GraffitiCare_Portfolio`, `GraffitiCare_Objektumfang`, `GraffitiCare_Untergrund`, `GraffitiCare_Freitext`, `GraffitiCare_Kalkulation` |
| Sonstiges | `Allgemeine_Beschreibung`, `attachment` |

Nur ausgefüllte Felder werden übertragen – die E-Mail bleibt dadurch kurz.
Zugeklappte Detailblöcke werden abgeschaltet, damit ihre Vorgabewerte nicht als
scheinbare Angaben mitgesendet werden.

## Getestet

Chromium, Breiten von 320 px bis 1920 px, heller und dunkler Modus, mit und
ohne JavaScript, Maus/Tastatur/Touch.

Automatisch geprüft und ohne Befund:

* HTML-Verschachtelung, doppelte IDs, tote Anker, nicht auflösbare Icons
* Farbkontrast nach WCAG AA in beiden Modi, inklusive Flächen über Farbverläufen
* Fokusfalle, Fokusrückgabe und Escape in allen sechs Fenstern und in der Suche
* Überschriftenhierarchie ohne Sprünge, genau eine `h1`, alle Bereiche
  ausgezeichnet, jedes Eingabefeld mit zugänglichem Namen
* kein horizontaler Überlauf, Layoutverschiebung (CLS) = 0
* keine Konsolen- oder Laufzeitfehler
