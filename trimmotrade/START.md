# TrimmoTrade – die ersten 90 Tage

Was tatsächlich getan werden muss, damit aus der Anwendung ein Betrieb
wird. In der Reihenfolge, in der es getan werden sollte.

> **Kein Rechtsrat.** Die Hinweise hier sind eine Orientierung mit
> Fundstellen, damit man weiß, wonach man fragt. Wo **[bestätigen]**
> steht, gehört die Frage einmal an eine Steuerberatung, eine
> Rechtsanwältin oder die IHK – einmal, und dann steht es fest.

---

## Abschnitt 1 · Bevor die Seite öffentlich beworben wird

Diese fünf Punkte sind keine Empfehlung. Ohne sie ist der Betrieb
angreifbar, und zwar von der ersten Stunde an.

### 1.1 Impressum vollständig ausfüllen ⚠️ **offen**

In der Anwendung unter **Rechtliches → Angaben zum Anbieter**. Die
Felder liegen dort und sind heute leer; jede Lücke erscheint im Text
sichtbar als `[… eintragen]`.

| Feld | Warum | Grundlage |
|---|---|---|
| Name | Anbieterkennzeichnung | § 5 Abs. 1 Nr. 1 DDG |
| Straße und Hausnummer | **ladungsfähige Anschrift**, kein Postfach | § 5 Abs. 1 Nr. 1 DDG |
| PLZ und Ort | dito | § 5 Abs. 1 Nr. 1 DDG |
| E-Mail-Adresse | Pflichtangabe | § 5 Abs. 1 Nr. 2 DDG |
| Telefonnummer | schnelle Kontaktaufnahme | § 5 Abs. 1 Nr. 2 DDG |
| Aufsichtsbehörde Datenschutz | Beschwerderecht | Art. 13 Abs. 2 lit. d DSGVO |
| Verantwortlich nach § 18 Abs. 2 MStV | bei journalistisch-redaktionellen Inhalten | § 18 Abs. 2 MStV |

Ein fehlendes Impressum ist der am einfachsten abzumahnende Fehler im
deutschen Internet. Er kostet mehrere hundert Euro und ist in zehn
Minuten vermieden.

**Zur Anschrift:** Wer nicht die Privatadresse veröffentlichen will,
braucht eine echte Geschäftsadresse, an der Post zugestellt werden kann.
Ein reines Postfach genügt nicht. Anbieter von Ladungsfähigen Adressen
gibt es; das kostet einen niedrigen zweistelligen Betrag im Monat
**[Anbieter prüfen]**.

### 1.2 Gewerbe anmelden

Beim Gewerbeamt der Stadt, in der der Betrieb sitzt. Kosten je nach
Kommune etwa 20–60 €. Danach kommt der steuerliche Erfassungsbogen vom
Finanzamt.

**Die Frage, die dabei geklärt gehört:** Braucht ein Wohnungsportal eine
Erlaubnis nach **§ 34c GewO** (Immobilienmakler)?

Die Erlaubnispflicht trifft, wer gewerbsmäßig den Abschluss von
Verträgen über Grundstücke oder Wohnräume **vermittelt oder die
Gelegenheit dazu nachweist**. Für ein Portal, auf dem Nutzende selbst
inserieren, wird das üblicherweise verneint: Es besteht kein
Maklervertrag mit den Parteien, es wird kein Erfolgshonorar für einen
zustande gekommenen Vertrag verlangt, und der Betreiber tritt nicht in
die Verhandlung ein. Die großen Portale arbeiten ohne diese Erlaubnis.

Zwei Dinge würden das ändern, und beide sind Geschäftsentscheidungen:

- Ein Entgelt, das an das **Zustandekommen** eines Miet- oder
  Kaufvertrags gekoppelt ist.
- Eine **individuelle Zuführung** bestimmter Interessenten an bestimmte
  Objekte gegen Bezahlung.

Solange nur Sichtbarkeit verkauft wird – Plus, Hervorhebung, Anzeigen –,
bleibt es beim erlaubnisfreien Betrieb. **[Bei der Gewerbeanmeldung
ausdrücklich ansprechen und die Antwort schriftlich festhalten.]**

### 1.3 Auftragsverarbeitung mit netcup

Der Hoster verarbeitet personenbezogene Daten im Auftrag. Nach **Art. 28
DSGVO** braucht es dafür einen Vertrag. netcup stellt ihn im
Kundenbereich bereit **[abschließen und ablegen]**.

Dasselbe gilt für jeden weiteren Dienst, der Daten zu sehen bekommt –
Zahlungsdienstleister, Mailversand, falls später ein externer dazukommt.

### 1.4 Verzeichnis von Verarbeitungstätigkeiten

**Art. 30 DSGVO.** Die Ausnahme für Betriebe unter 250 Beschäftigten
greift hier nicht: Sie gilt nur bei gelegentlicher Verarbeitung, und ein
Portal verarbeitet ständig.

Das Verzeichnis ist eine Tabelle, kein Gutachten. Je Vorgang: Zweck,
Kategorien betroffener Personen, Kategorien von Daten, Empfänger,
Löschfristen, technische und organisatorische Maßnahmen. Die Vorgänge
dieses Betriebs sind überschaubar:

1. Konto und Anmeldung (Kennung, Mailadresse, Passkey-Schlüssel, Sitzung)
2. Inserate (Angebotsdaten, Bilder, Kontobezug)
3. Anfragen (Name, Mailadresse, Telefon, Text, Eckdaten)
4. Suchaufträge (Filter, Mailadresse)
5. Meldungen nach Art. 16 DSA (Grund, Text, Mailadresse)
6. Serverprotokolle des Hosters

Kein Datenschutzbeauftragter nötig, solange nicht mindestens zwanzig
Personen ständig mit der Verarbeitung befasst sind (§ 38 Abs. 1 BDSG).

### 1.5 Kontaktstelle nach dem Digital Services Act

Als Hostingdienst mit Nutzerinhalten gelten die Pflichten der
Verordnung (EU) 2022/2065:

| Pflicht | Stand |
|---|---|
| Art. 11/12 – Kontaktstelle für Behörden und Nutzende, veröffentlicht | **im Impressum ergänzen** |
| Art. 14 – verständliche AGB mit Angaben zur Moderation | vorhanden |
| Art. 16 – Meldeverfahren ohne Kontozwang, Empfangsbestätigung | eingebaut |
| Art. 17 – begründete Entscheidung an Betroffene | Vorgang liegt in `tt_meldung`, **Begründung wird von Hand geschrieben** |

**Erleichterung, die hier greift:** Nach **Art. 19 DSA** sind
Kleinst- und Kleinunternehmen von den Pflichten des Abschnitts 3
(Art. 20 ff. – internes Beschwerdemanagement, außergerichtliche
Streitbeilegung, vertrauenswürdige Hinweisgeber, Transparenzberichte,
Rückverfolgbarkeit von Unternehmern) ausgenommen. Für einen
Einzelbetrieb bleibt es damit bei Kontaktstelle, AGB, Meldeweg und
Begründung. **[Vor Überschreiten der Schwellen erneut prüfen.]**

---

## Abschnitt 2 · Damit der Betrieb läuft

### 2.1 Cron-Aufträge einrichten

Im netcup-Kundenbereich (Webhosting → Cronjobs). Ohne diese drei
passiert nichts von dem, was Nutzer zurückholt:

```
# Suchaufträge abarbeiten – stündlich
0 * * * *   /usr/bin/php /pfad/zu/httpdocs/api/index.php melden

# „Steht das Inserat noch?“ – täglich um 9 Uhr
0 9 * * *   /usr/bin/php /pfad/zu/httpdocs/api/index.php erinnern

# Aufräumen – nachts
30 3 * * *  /usr/bin/php /pfad/zu/httpdocs/api/index.php aufraeumen
```

Den Pfad zu `php` gibt der Kundenbereich an; er unterscheidet sich je
nach PHP-Version. Prüfen lässt sich alles vorher über SSH oder, wenn es
keinen Zugang gibt, indem man den Auftrag einmal auf „jede Minute“ setzt
und die Mail des Cron-Dienstes abwartet.

### 2.2 PHP-Einstellungen

Die Datei `.user.ini` liegt im Webverzeichnis und setzt
`post_max_size = 16M`. Ohne sie schneidet PHP den Bildupload ab, und die
Anwendung kann nur noch raten, woran es lag (sie sagt es dann immerhin).

Nötig ist außerdem die Bildbibliothek **GD**. Ob sie da ist, sagt
`/api/status` im Feld `markt.bilder`. Bei netcup ist sie in der Regel
aktiv; sonst über den Kundenbereich einschalten.

### 2.3 Der Beispielmarkt

In `api/config.php`:

```php
'beispielmarkt' => true,   // solange es zu wenige echte Inserate gibt
```

Solange das auf `true` steht, zeigt die Suche neben echten Inseraten den
erzeugten Beispielbestand – jedes Beispiel mit Marke, dazu ein Hinweis
über der Trefferliste, der sich nicht wegklicken lässt.

**Ab etwa 300 echten Inseraten in einer Stadt gehört hier `false` hin.**
Erfundene Wohnungen neben echten zu zeigen ist irreführend im Sinne des
§ 5 UWG, und spätestens die erste Anfrage an eine erfundene Adresse
zerstört genau das Vertrauen, von dem der ganze Betrieb lebt.

### 2.4 Sicherung

netcup sichert die Datenbank im Rahmen des Pakets **[Umfang und
Aufbewahrungsdauer im Kundenbereich prüfen]**. Was dabei leicht vergessen
wird: der Ordner `api/daten/bilder`. Die Bilder liegen als Dateien, nicht
in der Datenbank – eine Datenbanksicherung allein stellt sie nicht wieder
her.

Einmal im Monat eine eigene Kopie ziehen (Datenbankexport plus
Bilderordner) und außerhalb des Servers ablegen.

### 2.5 Was regelmäßig anzusehen ist

| Wie oft | Was | Womit |
|---|---|---|
| täglich | offene Meldungen | `SELECT * FROM tt_meldung WHERE stand = 'offen'` |
| wöchentlich | der Trichter | `php api/index.php zahlen` |
| wöchentlich | Inserate mit Verdacht | Feld `verdachtsgruende` im Inserat |
| monatlich | Sicherung ziehen | siehe 2.4 |

---

## Abschnitt 3 · Geld einnehmen

Solange nichts verkauft wird, ist dieser Abschnitt nicht dringend. Vor
der ersten Zahlung muss er vollständig abgearbeitet sein.

### 3.1 Umsatzsteuer

Die Kleinunternehmerregelung nach **§ 19 UStG** befreit vom Ausweis der
Umsatzsteuer, solange der Umsatz die Grenzen nicht überschreitet. Die
Beträge wurden zum 1. Januar 2025 geändert **[aktuelle Grenzen bei der
Steuerberatung bestätigen – sie werden regelmäßig angepasst]**.

In `assets/recht.js` steht dafür `kleinunternehmer: true`. Wird die
Regelung verlassen, gehört dort `false` hin und in die Preisangaben die
Umsatzsteuer.

### 3.2 Zahlungsdienstleister

Für ein Abo braucht es einen Anbieter, der wiederkehrende Zahlungen
einzieht (Stripe, Mollie, PayPal und andere). Drei Dinge sind dabei zu
regeln: der Vertrag, die Auftragsverarbeitung nach Art. 28 DSGVO und die
Erweiterung der Datenschutzerklärung um den Empfänger.

### 3.3 Was im Bestellablauf stehen muss

Alles davon ist in der Anwendung bereits umgesetzt und beim Anschalten
der Zahlung noch einmal zu prüfen:

- **Schaltfläche mit eindeutiger Beschriftung** – „zahlungspflichtig
  bestellen“ oder ebenso eindeutig (§ 312j Abs. 3 BGB). Fehlt sie,
  kommt kein Vertrag zustande.
- **Kündigungsschaltfläche** – für Dauerschuldverhältnisse im
  elektronischen Geschäftsverkehr (§ 312k BGB), erreichbar ohne
  Anmeldung.
- **Widerrufsbelehrung** und Muster-Widerrufsformular (§§ 355, 356 BGB).
- **Erlöschen des Widerrufsrechts** bei sofortiger Ausführung nur mit
  ausdrücklicher Zustimmung und Kenntnisnahme (§ 356 Abs. 5 BGB).
- **Preisangaben** mit dem Hinweis nach § 19 UStG, solange die
  Kleinunternehmerregelung gilt.

---

## Abschnitt 4 · Die ersten Inserate

Technik ohne Angebot ist eine Vorführung. Dieser Abschnitt ist der, an
dem sich entscheidet, ob daraus ein Geschäft wird – die Begründung steht
in `GESCHAEFT.md`.

### Woche 1–2: fünf echte Inserate

Aus dem eigenen Umfeld. Echt, mit Fotos, mit richtigen Preisen. Zweck ist
nicht der Bestand, sondern der Beweis: Läuft der ganze Ablauf mit
Menschen, die nicht wissen, wie er gebaut ist?

Dabei mitprüfen: Kommt die Anfragemail an oder landet sie im Spam?
Verstehen Vermietende das Formular? Wie lange dauert es wirklich?

### Woche 3–6: zwanzig Nachmieter-Suchende

Einzeln, persönlich, mit Bezug auf ihre konkrete Wohnung. **Kein
Massenversand** – unaufgeforderte Werbemails an Verbraucher sind nach
§ 7 Abs. 2 UWG unzulässig, und eine Abmahnung dafür wäre ein
selbstverschuldeter Rückschlag.

Zulässig und wirksam: dort antworten, wo jemand öffentlich sucht, mit
einem echten Hinweis statt einer Anzeige.

### Woche 4–8: drei Genossenschaften

Nicht mit „inserieren Sie bei uns“. Das Thema ist der Ringtausch im
eigenen Bestand: Ältere Mitglieder in zu großen Wohnungen, Familien in
zu kleinen, und niemand, der sie zusammenbringt.

Für das Gespräch nützlich:
- die Ringtausch-Ansicht der Anwendung, an echten Zahlen vorgeführt,
- `wohnungstausch.html` als Unterlage,
- die Rechnung, was eine vermiedene Neuvermietung spart.

### Woche 8–12: auswerten und entscheiden

`php api/index.php zahlen` und die Frage: Welcher der drei Wege hat
Inserate gebracht – Nachmieter, Ringtausch oder Genossenschaften?

Der, der trägt, bekommt die nächsten drei Monate ganz. Die anderen beiden
bleiben liegen. Ein Einzelbetrieb, der drei Wege gleichzeitig verfolgt,
geht keinen davon zu Ende.

---

## Anhang: Prüfliste vor dem Start

```
Rechtlich
  [ ] Impressum vollständig (Name, Anschrift, Mail, Telefon)
  [ ] Aufsichtsbehörde Datenschutz eingetragen
  [ ] DSA-Kontaktstelle im Impressum genannt
  [ ] Gewerbe angemeldet
  [ ] § 34c GewO geklärt und schriftlich festgehalten
  [ ] AV-Vertrag mit netcup abgeschlossen
  [ ] Verzeichnis der Verarbeitungstätigkeiten angelegt

Technisch
  [ ] api/config.php gefüllt, Rechte 600
  [ ] rp_id = trimmotrade.de (ohne www – sonst brechen alle Passkeys)
  [ ] TLS für www und ohne www, Weiterleitung auf eine Fassung
  [ ] SPF, DKIM und DMARC gesetzt, Testmail kommt im Posteingang an
  [ ] GD aktiv (/api/status → markt.bilder = true)
  [ ] .user.ini liegt im Webverzeichnis
  [ ] drei Cron-Aufträge eingerichtet und einmal gelaufen
  [ ] Sicherung geprüft, Bilderordner eingeschlossen

Inhaltlich
  [ ] fünf echte Inserate mit Fotos stehen
  [ ] eine Anfrage von einem fremden Gerät verschickt und angekommen
  [ ] eine Meldung abgesetzt und beantwortet
  [ ] Suchauftrag angelegt, Mail kam an, Abmeldelink geht
  [ ] Sitemap bei Google Search Console und Bing eingereicht
```
