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

## Der Portfolio-Rechner (GraffitiCare)

Der Abschnitt `#graffiticare` verkauft das Abo als Objekt-Abo mit festem Monatspreis.
Die Rechnung läuft wie beim Richtpreis-Rechner nur im Browser:

```
Monatspreis = Objekte × Tarifpreis × (1 − Mengenstaffel)
```

**Tarifpreise ändern:** Maßgeblich sind die `data-price` (€ je Objekt und Monat) und
`data-incl` (enthaltene m² je Objekt und Jahr) an den Optionen des Auswahlfeldes
`#pf-plan`. Die Preise in den drei Tarifkarten werden daraus gesetzt; der dort
hinterlegte Text ist nur die Anzeige, falls kein JavaScript läuft. Wer die Preise
ändert, sollte daher auch den Text in den Karten und die Angaben in den Strukturdaten
(`"@id": ".../#service-graffiticare"`) anpassen.

**Mengenstaffel** steht im Skript als `PF_TIERS`, die Vergleichsrechnung gegen die
Einzelbeauftragung als `PF_SINGLE_JOB` (Rechnungsbetrag je Vorfall) und
`PF_AREA_PER_INCIDENT` (Fläche je Vorfall). Beide Werte hängen zusammen: Wer den einen
ändert, sollte den anderen mitziehen, sonst passen Kontingente und Vergleich nicht mehr
zusammen. Aus ihnen leitet der Rechner auch die Tarifempfehlung ab.

Die Schaltflächen `data-portfolio-plan` und `data-portfolio-request` springen zum
Anfrageformular, setzen dort den Haken „GraffitiCare Abo“ und tragen Objektanzahl und
Tarif in die Felder `GraffitiCare_Objektanzahl` und `GraffitiCare_Tarif` ein.

> **Vor dem Livegang:** Die Tarife sind ein kalkulierter Vorschlag – Herleitung,
> Deckungsbeitrag und Vertriebsweg stehen in
> [`GESCHAEFTSMODELL-GRAFFITICARE.md`](GESCHAEFTSMODELL-GRAFFITICARE.md). Bitte gegen die
> eigenen Kosten gegenrechnen. Ebenso ist § 7 der AGB (Laufzeit, Kontingent,
> Reaktionszeit, Preisanpassung) ein Entwurf und sollte einmal juristisch geprüft werden,
> bevor die Seite online geht.

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
