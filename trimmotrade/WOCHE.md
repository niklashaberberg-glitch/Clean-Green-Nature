# Zwölf Wochen

`START.md` sagt, was einzurichten ist. `GESCHAEFT.md` sagt, warum. Diese
Datei sagt, **wann** – ein Ziel je Woche, freitags gemessen.

Sie ist gegen einen einzigen Fehler gebaut, und der steht schon im
Geschäftsplan: Der häufigste Fehler eines Einzelunternehmens ist nicht
die falsche Strategie, sondern drei gleichzeitig.

> **Die Regel:** In jeder Woche steht **eine** Zahl. Wird sie nicht
> erreicht, wird die Woche wiederholt – nicht das Ziel gewechselt.

---

## Der Freitagstermin

Dreißig Minuten, jede Woche, im Kalender. Vier Fragen, aufgeschrieben:

1. Wie viele **echte, gültige Inserate** stehen in der Suche?
   (`php api/index.php zahlen`)
2. Wie viele **Erstgespräche** wurden diese Woche geführt?
3. Was war das Ziel der Woche – erreicht oder nicht?
4. Was ist das Ziel der nächsten Woche?

Mehr nicht. Ein Bericht, den niemand liest, ersetzt keinen Termin, den
man sich nimmt.

---

## Phase 1 · Woche 1–2: Der Betrieb muss stehen

Vertrieb vor dieser Phase ist verschwendete Zeit: Ein Interessent, der
auf eine halbfertige Seite kommt, kommt kein zweites Mal.

### Woche 1 – Einrichtung abschließen

| | |
|---|---|
| **Ziel** | `php api/index.php pruefen` meldet nichts mehr |
| **Zeit** | 3–4 Stunden |

- [ ] `api/config.php` vollständig, Impressum steht (→ `START.md` 1.1)
- [ ] Drei Cron-Aufträge eingerichtet: `melden`, `erinnern`, `aufraeumen`
      (→ `START.md` 1.5). **Ohne sie verschickt der Suchauftrag nichts** –
      der häufigste stille Ausfall.
- [ ] AVV mit netcup abgeschlossen und abgelegt (→ `START.md` 1.3)
- [ ] Verzeichnis von Verarbeitungstätigkeiten angelegt (→ `START.md` 1.4)
- [ ] Zertifikate für **beide** Schreibweisen jeder Domain, mit und ohne
      `www` – die `.htaccess` leitet auf `www` um, und eine Umleitung auf
      ein Zertifikat, das nicht gilt, endet in einer Warnseite
- [ ] Eine Testanfrage an sich selbst: kommt die Mail an, landet sie
      nicht im Spam?

### Woche 2 – Fünf echte Inserate

| | |
|---|---|
| **Ziel** | 5 echte Inserate mit Fotos stehen in der Suche |
| **Zeit** | 4–6 Stunden |

Aus dem eigenen Umfeld, erfragt, echt. Nicht kopiert.

Der Zweck ist nicht der Bestand – fünf Inserate sind kein Markt. Der
Zweck ist, dass **der ganze Ablauf einmal an echten Menschen läuft**:
Inserat einstellen, Anfrage bekommen, antworten, Termin, Absage. Was
dabei hakt, hakt bei jedem Kunden.

- [ ] 5 Inserate mit Bildern
- [ ] Selbst als Suchender eine Anfrage stellen und beantworten
- [ ] Einen Suchauftrag anlegen und warten, ob die Mail kommt
- [ ] Auf dem Telefon durchgehen – nicht nur am Rechner

---

## Phase 2 · Woche 3–6: Der erste Kunde

### Woche 3 – Die Liste und die Briefe

| | |
|---|---|
| **Ziel** | 20 Briefe frankiert und abgeschickt |
| **Zeit** | 5–6 Stunden |

- [ ] Liste mit 20 Wohnungsgenossenschaften in Köln und Umgebung,
      jeweils mit **Namen** des Ansprechpartners aus Impressum oder
      Genossenschaftsregister
- [ ] Brief aus `VERTRIEB.md` Abschnitt 3 anpassen, Datum für den Anruf
      eintragen – ein echtes Datum, sonst wird nie angerufen
- [ ] `Angebot.pdf` beilegen (→ `unterlagen/`)
- [ ] Alle 20 am selben Tag zur Post

**Kein E-Mail-Versand.** Der Grund steht in `VERTRIEB.md` Abschnitt 1
und heißt § 7 Abs. 2 Nr. 2 UWG.

### Woche 4 – Anrufen

| | |
|---|---|
| **Ziel** | 20 von 20 angerufen |
| **Zeit** | 4 Stunden, verteilt auf drei Vormittage |

Das ist die Woche, in der die meisten aufgeben. Zehn Tage nach dem
Brief, vormittags zwischen 9 und 11 Uhr. Gesprächsleitfaden in
`VERTRIEB.md` Abschnitt 4.

- [ ] Jeder Anruf in die Tabelle: Ergebnis, nächster Schritt, Datum
- [ ] Bei „schicken Sie mal Unterlagen“: nachfragen, was drinstehen
      müsste. Die Antwort ist die nützlichste Information der Woche.

**Erwartung:** 10 Gespräche, 4 Termine. Weniger ist kein Grund
aufzuhören, sondern ein Grund nachzufragen, woran es lag.

### Woche 5 – Termine

| | |
|---|---|
| **Ziel** | 4 Gespräche geführt |
| **Zeit** | 6 Stunden inkl. Vorbereitung |

- [ ] Je Termin **vorher** die Zahlen des Hauses erfragen oder schätzen:
      Wohneinheiten, Fluktuation, Leerstandsdauer
- [ ] Die Rechnung aus `PREISE.md` Abschnitt 2 mit **deren** Zahlen
      rechnen, nicht mit den Beispielzahlen
- [ ] AVV vorab schicken, ungefragt. Das nimmt der Frage nach dem
      Datenschutz die Spitze, bevor sie gestellt wird.

### Woche 6 – Nachfassen und entscheiden

| | |
|---|---|
| **Ziel** | 1 Pilot verkauft **oder** verstanden, warum nicht |
| **Zeit** | 3 Stunden |

- [ ] Jeden Termin nachfassen, mit einem konkreten Vorschlag
- [ ] Bei Absage **immer** fragen: „Was hätte anders sein müssen?“
- [ ] Freitags entscheiden:
      - **Pilot verkauft** → Phase 3
      - **Termine, aber keine Zusage** → Angebot ändern, nicht mehr
        Briefe schreiben
      - **keine Termine aus 20 Briefen** → der Brief trifft das Problem
        nicht. Fünf Anrufe mit der Frage „Was hätte drinstehen müssen?“,
        dann neu schreiben.

---

## Phase 3 · Woche 7–12: Zwei Dinge gleichzeitig, mehr nicht

Ab hier läuft der Pilot. Daneben läuft **genau eine** zweite Sache.

### Woche 7–8 – Den Piloten zum Laufen bringen

| | |
|---|---|
| **Ziel** | 20 Tauschangebote aus dem Bestand des Kunden |
| **Zeit** | je 4 Stunden |

Ein Pilot ohne Angebote beweist nichts. Das ist Arbeit **beim Kunden**,
nicht in der Software:

- [ ] Schulung der Mitarbeitenden, zwei Stunden
- [ ] Aushang oder Mitgliederrundschreiben – der Kunde erreicht seine
      Mitglieder, TrimmoTrade nicht
- [ ] Nach zwei Wochen nachsehen: Wie viele Angebote? Welche Ketten?
- [ ] Wöchentlich fünf Minuten anrufen. Ein Pilot, den niemand begleitet,
      schläft ein.

### Woche 9–10 – Sichtbarkeit, die von selbst weiterläuft

| | |
|---|---|
| **Ziel** | 3 Verweise von fremden Seiten |
| **Zeit** | je 3 Stunden |

Die neun statischen Seiten sind der einzige Teil, den eine Suchmaschine
lesen kann. Sie wirken langsam, dafür dauerhaft und ohne laufende
Kosten.

- [ ] Mietervereine, Studierendenwerke, Stadtteilinitiativen anschreiben
      (Text in `VERTRIEB.md` Abschnitt 6)
- [ ] Google Search Console einrichten, Sitemap einreichen
- [ ] Nach vier Wochen nachsehen, welche der neun Seiten überhaupt
      Aufrufe hat. Die drei besten ausbauen, die anderen liegen lassen.

### Woche 11 – Die zweite Runde Briefe

| | |
|---|---|
| **Ziel** | 20 Briefe, diesmal mit Referenz |
| **Zeit** | 4 Stunden |

Derselbe Brief, ein Satz mehr: „Seit [Monat] läuft die Tauschbörse bei
[Kunde] – gern stelle ich den Kontakt her.“ Dieser eine Satz ist der
Unterschied zwischen der ersten und der zweiten Runde.

- [ ] **Vorher** die Erlaubnis des Piloten einholen, ihn zu nennen.
      Ungefragt genannt zu werden, verärgert genau den einen Kunden, den
      man hat.

### Woche 12 – Bilanz

| | |
|---|---|
| **Ziel** | Eine Entscheidung, schriftlich |
| **Zeit** | 2 Stunden |

Drei Zahlen, aus `php api/index.php zahlen` und der Vertriebstabelle:

| Zahl | Nach 12 Wochen | Was sie bedeutet |
|---|---|---|
| Echte Inserate in der Suche | | unter 25: der Verbrauchermarkt trägt noch nicht |
| Geführte Erstgespräche | | unter 8: es wurde nicht genug angerufen |
| Zahlende Kunden | | 1 reicht für Phase 4. 0 heißt: Angebot ändern |

**Und dann die eine Frage, die zählt:** Welcher der beiden Wege hat sich
bewegt – der Verbrauchermarkt oder der B2B-Weg? Der andere wird für die
nächsten drei Monate liegen gelassen. Nicht aufgegeben, liegen gelassen.

Es ist gut möglich, dass der B2B-Weg trägt und der Verbrauchermarkt
nicht. Das ist kein Scheitern, sondern das Ergebnis, für das die zwölf
Wochen da waren.

---

## Was in diesen zwölf Wochen **nicht** getan wird

Jede dieser Zeilen ist eine Versuchung, und jede kostet eine Woche:

- **Keine zweite Stadt.** Dreihundert Inserate in Köln sind ein Markt,
  dreißig in zehn Städten sind nichts.
- **Keine neuen Funktionen**, außer der Pilot verlangt sie ausdrücklich.
  Die Anwendung kann mehr, als heute jemand benutzt.
- **Kein Umbau der Gestaltung.** Sie ist fertig genug.
- **Keine Werbeanzeigen.** Ohne Bestand verbrennt jeder Euro.
- **Keine App.** Die Anwendung läuft im Browser und lässt sich zum
  Startbildschirm hinzufügen. Ein App-Store-Auftritt kostet Wochen und
  bringt keinen einzigen Inserierenden.
- **Kein zweites Produkt.**

---

## Wenn nach zwölf Wochen nichts trägt

Auch das gehört aufgeschrieben, und zwar vorher – hinterher findet man
immer einen Grund weiterzumachen.

**Nicht sofort aufhören.** Zwölf Wochen sind für einen zweiseitigen
Markt kurz. Aber:

- Wurden die 40 Briefe wirklich verschickt und die 40 Anrufe wirklich
  gemacht? Wenn nein, ist die Frage noch offen.
- Sagen die Absagen dasselbe? Fünf Mal derselbe Einwand ist eine
  Antwort, keine Pechsträhne.
- Läuft der Betrieb ohne laufende Kosten weiter? Dann kostet Warten
  fast nichts, und die Ratgeberseiten wachsen von selbst.

**Die ehrliche Abbruchbedingung:** 40 Briefe, 40 Anrufe, mehr als fünf
Gespräche – und niemand will zahlen. Dann ist es nicht der Vertrieb,
sondern das Angebot.

---

## Verwandte Unterlagen

- `START.md` – die Einrichtung im Einzelnen
- `VERTRIEB.md` – die Anschreiben und der Gesprächsleitfaden
- `PREISE.md` – die Rechnung, die im Termin auf den Tisch kommt
- `AVV.md` – der Vertrag, der vor dem Termin verschickt wird
- `GESCHAEFT.md` – warum dieser Weg
