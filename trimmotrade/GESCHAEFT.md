# TrimmoTrade – von der Idee zum Geschäft

Diese Datei ist kein Marketingtext. Sie ist der Versuch, ehrlich
aufzuschreiben, woran ein Wohnungsportal in Deutschland scheitert, was
TrimmoTrade davon vermeiden kann und was daraus ein Geschäft macht, das
sich trägt.

Wo Zahlen stehen, die überprüft werden müssen, steht **[prüfen]** dabei.
Ein Geschäftsplan mit erfundenen Marktzahlen ist wertlos – und zwar
zuerst für den, der ihn geschrieben hat.

---

## 1. Die nüchterne Lage

### Was TrimmoTrade kann, das andere nicht können

Die Anwendung ist an drei Stellen deutlich besser als das, was in
Deutschland auf dem Markt ist:

1. **Ringtausch über mehrere Haushalte.** Der direkte Wohnungstausch
   scheitert am doppelten Zufall. Eine Kette aus drei oder vier
   Haushalten funktioniert – und der Suchalgorithmus dafür ist gebaut,
   geprüft und läuft. Kein großes Portal bietet das an.

2. **Vertragslupe, Mietpreisbremse, echte Monatskosten,
   Nebenkostenprüfung, WBS, Wohngeld.** Rechnungen mit belastbaren
   Rechtsgrundlagen statt Faustregeln. Das ist für sich genommen ein
   Grund, die Seite zu besuchen – auch ohne eine einzige Wohnung.

3. **Betrugserkennung und Kennzeichnung bezahlter Plätze.** Beides
   serverseitig, beides sichtbar. Wohnungssuchende sind misstrauisch,
   und sie haben recht damit.

### Was TrimmoTrade nicht hat

**Wohnungen.** Genau das ist das Geschäft. Alles andere ist Zubehör.

Ein Wohnungsportal ist ein zweiseitiger Markt mit einer unsymmetrischen
Anziehung: Suchende kommen, sobald es Wohnungen gibt. Wohnungen kommen
nicht, weil es Suchende geben *könnte*. Wer vermietet, inseriert dort,
wo in zwei Tagen achtzig Anfragen ankommen – und das ist am Anfang
nirgends hier.

Daraus folgt der wichtigste Satz dieses Dokuments:

> **Jede Stunde, die nicht in Angebot fließt, ist am Anfang verschwendet.**

### Der Wettbewerb

Frontal gegen ImmoScout24, Kleinanzeigen, Immowelt und WG-Gesucht zu
gehen, ist aussichtslos. Diese Anbieter haben Bestand, Marke und
Werbebudgets in einer Größenordnung, die ein Einzelunternehmen nicht
erreicht **[Marktanteile und Eigentümerstrukturen vor jeder externen
Verwendung prüfen – sie ändern sich durch Übernahmen laufend]**.

Nicht aussichtslos ist es, dort anzufangen, wo diese Anbieter nichts
tun. Davon gibt es vier Stellen, und alle vier sind gebaut.

---

## 2. Der Keil: vier Eingänge, die kein Angebot brauchen

Ein Portal ohne Wohnungen kann trotzdem gefunden und benutzt werden –
wenn es etwas anderes anbietet, das Menschen suchen. Das ist der einzige
Weg, an dem Punkt vorbeizukommen, an dem beide Marktseiten aufeinander
warten.

### Keil 1: Nachmieter (der stärkste)

Wer einen Nachmieter sucht, ist **beide Marktseiten in einer Person**:
Er hat eine Wohnung abzugeben und braucht eine neue. Ein einziger
gewonnener Nutzer bringt ein Inserat *und* eine Suche.

Das ist die sauberste Lösung des Kaltstartproblems, die es für dieses
Geschäft gibt, und sie ist bereits umgesetzt: `nachmieter-finden.html`
beantwortet die Rechtsfragen (§ 573c BGB, Nachmieterklausel, Ablöse nach
§ 4a WoVermRG) und führt danach in ein Konto, in dem Inserat und Suche
nebeneinander laufen.

**Zielgruppe:** Menschen im Umzug. In Deutschland ziehen jedes Jahr
mehrere Millionen Haushalte um **[Zahl beim Statistischen Bundesamt
prüfen]**. Ein winziger Anteil davon genügt.

### Keil 2: Ringtausch

Der Tausch spricht Menschen an, die *nicht* akut suchen, aber unzufrieden
wohnen: zu groß nach dem Auszug der Kinder, zu klein nach der Geburt, zu
weit weg vom neuen Arbeitsplatz. Diese Gruppe ist bei keinem Portal
erfasst, weil sie nichts sucht, was es dort gibt.

Der Ringtausch hat zwei Eigenschaften, die ihn geschäftlich wertvoll
machen: Er erzeugt **Inserate von Menschen, die sonst nie inseriert
hätten**, und er ist eine Geschichte, die sich erzählen lässt – lokale
Presse, Mietervereine, Stadtteilinitiativen.

### Keil 3: WG-Gründung

Der Keil, der beide Marktseiten zugleich bedient – und der einzige, der einer
Vermieterseite einen Grund gibt, **hierher** zu inserieren statt woanders.

Eine Vier-Zimmer-Wohnung für 1.600 Euro warm ist für eine Person zu groß und für
viele Familien zu teuer. Sie steht deshalb lange leer. Drei Leute zahlen 533 Euro
und nehmen sie sofort – nur finden sie sich nicht, weil jeder gleichzeitig die
Wohnung und zwei Mitbewohner bräuchte.

Was das geschäftlich wert ist:

- **Ein Nutzer bringt zwei weitere.** Wer eine Gruppe eröffnet, holt die anderen
  selbst dazu. Billiger kommt kein Portal an Nutzer.
- **Die anbietende Seite hat einen echten Grund.** Wer eine schwer vermietbare
  Wohnung hat, findet das bei ImmoScout nicht. Das ist das erste Argument in
  diesem Geschäftsplan, das nicht „wir sind netter“ lautet.
- **Es ist schwer nachzubauen.** Nicht technisch – aber ein großes Portal müsste
  dafür Personendaten zwischen Nutzenden sichtbar machen, mit allem, was daran
  hängt. Die Zurückhaltung großer Anbieter an genau dieser Stelle ist der Grund,
  warum es das Angebot nicht gibt.

**Zielgruppe:** Studierende, Auszubildende, Berufsanfänger, frisch Getrennte –
alle, für die eine ganze Wohnung nicht in Frage kommt und ein WG-Zimmer nicht
frei wird.

**Was die Gruppe zusammenhält, ist die Passung.** Drei Fremde, die eine Wohnung
nehmen, haben ein Problem, das eine bestehende WG nicht hat: Niemand kennt
niemanden. Zehn Alltagsfragen – Ordnung, Lärm, Besuch, Nähe, Rhythmus, Küche,
Zeit zu Hause, Gemeinschaftsräume, Feiern, gemeinsamer Haushalt – plus die
harten Punkte (Rauch, Tiere, Küche) beantworten vorher, worüber sonst erst nach
dem Einzug geredet wird. Gerechnet wird gegen jedes Mitglied einzeln, und der
schlechteste Einzelwert zählt doppelt: Wer mit zwei von drei Menschen gut
auskommt und mit dem dritten gar nicht, zieht nicht ein.

Das ist kein Beiwerk, sondern der Grund, warum die Gruppe hält. Eine Gruppe, die
nach vier Wochen wieder auseinanderfällt, kostet die anbietende Seite mehr Zeit
als eine Absage.

### Keil 4: Die Werkzeuge

Nebenkostenabrechnung prüfen, Mietpreisbremse rechnen,
Wohnberechtigungsschein, Wohngeld, Übergabeprotokoll. Fünf
Ratgeberseiten liegen dafür bereit, alle mit belastbarer
Rechtsgrundlage.

Diese Seiten bringen Besucher ohne jedes Angebot. Sie machen keinen
Umsatz, aber sie bauen zwei Dinge auf, die später zählen: Sichtbarkeit
in Suchmaschinen und den Ruf, dass hier jemand die Sache versteht.

---

## 3. Wo das Geld herkommt

### Was heute eingebaut ist

> Die Preise selbst stehen seit dem Umbau in **`PREISE.md`** und in
> `scripts/preise.js`, aus dem auch die Website und das Angebot als PDF
> entstehen. Hier steht nur noch, warum.

| Quelle | Preis | Einschätzung |
|---|---|---|
| TrimmoTrade Plus | 7,90 €/Monat, 69 €/Jahr | Trägt sich erst bei vielen tausend Nutzern |
| Hervorhebung von Inseraten | einzeln buchbar | Braucht Suchende, sonst wertlos |
| Anzeigen im freien Tarif | – | Braucht Reichweite, die es noch nicht gibt |

Nüchtern gerechnet: Bei 7,90 € im Monat und einer Umwandlungsquote von
zwei Prozent – für ein kostenloses Werkzeug ein guter Wert – braucht es
**rund 6.300 aktive Nutzer für 1.000 € Monatsumsatz**. Das ist
erreichbar, aber nicht in den ersten zwölf Monaten.

### Was fehlt – und deutlich schneller trägt

**Wohnungsgenossenschaften und kommunale Wohnungsgesellschaften.**

Diese Organisationen haben exakt das Problem, für das der Ringtausch
gebaut ist:

- Ältere Mitglieder wohnen in zu großen Wohnungen und würden tauschen,
  finden aber niemanden.
- Familien in zu kleinen Wohnungen stehen auf einer Warteliste.
- Ein interner Tausch spart der Genossenschaft Leerstand, Inserat,
  Besichtigungen und Neuvermietungsaufwand – und hält Mitglieder.

> **Die Voraussetzung, ohne die dieser ganze Abschnitt Theorie bleibt:
> ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.** Keine
> Genossenschaft und keine kommunale Wohnungsgesellschaft unterschreibt
> einen Vertrag über eine Software, in die Mitgliederdaten fließen, ohne
> ihn. Das ist keine Formalie: Es ist die erste Frage der
> Datenschutzbeauftragten, und sie kommt vor dem Preis. Der Vertrag
> liegt seit dem Umbau als **`AVV.md`** vor, samt Anlage über die
> tatsächlichen technischen Maßnahmen – einschließlich der Tabelle
> darüber, was **nicht** vorhanden ist. Einmal anwaltlich prüfen lassen,
> dann steht er für alle Kunden.

Fast alle organisieren das heute mit einem Aushang oder einer
Excel-Tabelle. Eine gehostete Tauschbörse für den eigenen Bestand ist
ein Produkt, das aus der vorhandenen Technik entsteht: dieselbe
Matching-Rechnung, dieselbe Oberfläche, ein Mandant je Genossenschaft.

Warum das geschäftlich besser ist als der Verbrauchermarkt:

- **Zehn Kunden statt zehntausend.** Ein Vertrag über 299 € im Monat
  ersetzt rund vierzig Plus-Abos. Zehn solcher Kunden sind 2.990 € im
  Monat – dieselbe Summe über Plus verlangte 6.300 aktive Nutzer.
  Zehn Gespräche sind führbar, sechstausend Nutzer nicht.
- **Kein Kaltstart.** Der Bestand ist schon da; die Mitglieder sind
  schon da.
- **Kein Wettbewerb.** ImmoScout verkauft das nicht.
- **Referenzen wirken.** Genossenschaften reden miteinander, in
  Verbänden und auf Tagungen.

Das ist die realistischste Antwort auf die Frage, wie aus dieser
Anwendung ein tragfähiges Geschäft wird. Der Verbrauchermarkt bleibt
daneben bestehen – er kostet fast nichts und wächst langsam mit.

**Die Vorauswahl gehört in dasselbe Gespräch.** Wer eine Wohnung
inseriert, bekommt achtzig Anfragen und liest zehn. Welche zehn das
sind, entscheidet heute die Uhrzeit des Eingangs. TrimmoTrade sortiert
sie nach Eignung – Mietbelastung, Einkommensart, Bürgschaft,
Unterlagen, Mietdauer, Termin, Haushaltsgröße – und legt jede Zahl mit
ihrer Begründung offen. Nichts wird ausgeblendet, und Alter und
Geschlecht kommen nicht vor: Sie stehen in keiner Anfrage, also kann
keine Formel sie gewichten.

Für eine Hausverwaltung ist das die Stunde Arbeit je Wohnung, die
sonst niemand bezahlt. Für eine Genossenschaft ist es zusätzlich die
Antwort auf eine Frage, die dort tatsächlich gestellt wird: ob eine
Vorauswahl dem AGG standhält. Eine, deren Gründe jeder nachlesen kann,
hält ihm eher stand als die stille Reihenfolge im Posteingang.

### Die Verbindung zu Clean Green Nature

Beide Unternehmen sprechen dieselben Menschen an: Eigentümer,
Hausverwaltungen, Wohnungsgesellschaften. Wer eine Fassade reinigen
lässt, verwaltet Wohnungen; wer Wohnungen verwaltet, hat
Tauschinteressenten im Bestand.

Das ist kein Zufallsvorteil, sondern ein echter: Ein Erstgespräch bei
einer Hausverwaltung ist die teuerste Stufe im Vertrieb, und wer es
ohnehin führt, kann zwei Angebote mitbringen. Wichtig ist dabei die
Trennung, die schon im Text steht: **eigenständiges Unternehmen desselben
Inhabers, kein Vermittlungsentgelt.** Vermischte Provisionsströme wären
weder rechtlich sauber noch glaubwürdig.

---

## 4. Die Zahlen, die zählen

Die Anwendung zählt seit dem Umbau tagesweise mit – ohne Kennung, ohne
Cookie, ohne Personenbezug (`php api/index.php zahlen`). Damit lassen
sich fünf Verhältnisse verfolgen. Absolute Zahlen schmeicheln; Quoten
nicht.

| Kennzahl | Was sie sagt | Woran es liegt, wenn sie schlecht ist |
|---|---|---|
| Suche → Objekt | Trifft die Trefferliste? | Zu wenig Bestand, falsche Stadt, schlechte Fotos |
| Objekt → „Konto nötig“ | Wollen Besucher etwas tun? | Die Seite überzeugt nicht |
| „Konto nötig“ → Konto | Ist die Hürde niedrig genug? | Anmeldung zu umständlich oder unklar |
| Objekt → Anfrage | Kommt es zum Kontakt? | Inserate wirken unecht oder unattraktiv |
| Inserieren → Inserat | Kommt Angebot herein? | Das Formular ist zu lang oder verlangt zu viel |
| WG-Beitritt → Bewerbung | Werden Gruppen vollzählig? | Zu wenige Wohnungen freigegeben, zu wenige Suchende |

**Die eine Zahl, die über alles entscheidet:** Wie viele echte,
gültige Inserate stehen heute in der Suche? Steht sie bei null, ist jede
andere Kennzahl Beschäftigung.

### Meilensteine

| Stufe | Bestand | Was sie bedeutet |
|---|---|---|
| Vorführung | 0 echte | Beispielmarkt, klar gekennzeichnet |
| Erster Beweis | 25 echte in **einer** Stadt | Eine Anfrage erreicht einen Menschen |
| Erste Liquidität | 150 in einer Stadt | Die Suche liefert brauchbare Ergebnisse |
| Beispielmarkt aus | 300 in einer Stadt | `'beispielmarkt' => false` in `api/config.php` |
| Zweite Stadt | 300 + 25 | Erst wenn die erste trägt |

**Eine Stadt zuerst.** Liquidität in einem Wohnungsmarkt ist lokal:
Dreihundert Inserate in Köln sind ein Markt, dreißig in zehn Städten sind
nichts. Köln bietet sich an, weil dort auch das andere Unternehmen sitzt
und persönliche Ansprache möglich ist.

---

## 5. Wie die ersten Inserate hereinkommen

Ohne Werbebudget. In der Reihenfolge, in der sich der Aufwand lohnt:

1. **Nachmieter-Suchende direkt ansprechen.** Wer in Kleinanzeigen oder
   Aushängen einen Nachmieter sucht, hat ein Problem, das TrimmoTrade
   löst. Ein persönlicher Hinweis – kein Massenversand, der wäre nach
   § 7 UWG unzulässig – wirkt hier besser als jede Anzeige.

2. **Mietervereine, Studierendenwerke, Stadtteilinitiativen.** Die
   Werkzeuge (Nebenkosten, Mietpreisbremse, WBS) sind für deren
   Beratungsarbeit nützlich. Ein Verweis von dort bringt genau die
   Menschen, die auch inserieren.

3. **Genossenschaften ansprechen.** Nicht mit „inserieren Sie bei uns“,
   sondern mit „Ihre Mitglieder wollen tauschen und finden niemanden“.
   Das ist ein anderes Gespräch, und es ist das bessere.

4. **Hausverwaltungen aus dem CGN-Kundenkreis.** Bestehender Kontakt,
   bestehendes Vertrauen.

5. **Suchmaschinen.** Sieben Ratgeberseiten stehen. Sie wirken langsam,
   dafür dauerhaft und ohne laufende Kosten.

Was ausdrücklich **nicht** getan wird: Inserate von anderen Portalen
kopieren. Das ist urheberrechtlich angreifbar, es erzeugt genau die
Karteileichen, gegen die dieses Portal antritt, und es zerstört das
einzige, was es zu verkaufen hat.

---

## 6. Was schiefgehen kann

| Risiko | Wirkung | Was dagegen schon eingebaut ist |
|---|---|---|
| Kein Angebot | Tödlich | Nachmieter-Keil, Ringtausch, B2B-Weg |
| Betrugsinserate | Rufschaden, sofort | Serverseitige Musterprüfung, Meldeweg nach Art. 16 DSA, Vertrauensstufen |
| Karteileichen | Nutzer bleiben weg | Inserate laufen nach 60 Tagen aus, Erinnerung vorher |
| Beispielmarkt wirkt echt | Irreführung nach § 5 UWG | Marke an jedem Beispiel, Hinweis über der Liste, abschaltbar |
| Abmahnung Impressum | Kosten, vermeidbar | Anschrift, beide E-Mail-Adressen und die Telefonnummer stehen in `api/config.php` und gehen an jeden Browser (§ 5 Abs. 1 Nr. 2 DDG) |
| Kalte Werbe-E-Mail | Abmahnung, drei- bis vierstellig je Fall | § 7 Abs. 2 Nr. 2 UWG gilt auch gegenüber Firmen. Der Weg ist Brief → Anruf → E-Mail; ausgeführt in `VERTRIEB.md` Abschnitt 1 |
| Kein AVV zur Hand | Der B2B-Weg endet im ersten Gespräch | `AVV.md` liegt fertig vor, mit Anlage über die tatsächlichen Maßnahmen |
| Umsatzsteuerpflicht übersehen | Nachzahlung | Ab drei bis vier B2B-Kunden ist die Grenze des § 19 UStG überschritten. Gerechnet in `PREISE.md` Abschnitt 5 |
| Datenpanne | Meldepflicht Art. 33 DSGVO | Wenig Daten auf dem Server, Tresor Ende-zu-Ende verschlüsselt |
| Zeit reicht nicht | Wahrscheinlichster Fall | Eine Stadt, ein Keil, nichts parallel |

Das ehrlichste Risiko steht in der letzten Zeile. Ein
Einzelunternehmen mit einem zweiten Betrieb daneben hat begrenzte
Stunden. Der häufigste Fehler ist nicht die falsche Strategie, sondern
drei gleichzeitig.

---

## 7. Was als Nächstes zu tun ist

Die technische Seite ist weit: Inserate, Anfragen, Suchaufträge,
Meldewege, Messung, Bilder, Betrugsprüfung – alles läuft und ist
geprüft. Was jetzt fehlt, ist kein Code.

**Die Reihenfolge steht als Wochenplan in `WOCHE.md`** – ein Ziel je
Woche, freitags gemessen, über zwölf Wochen. Kurz gefasst:

1. Die Einrichtung abschließen, vor allem die drei Cron-Aufträge
   (`melden`, `erinnern`, `aufraeumen`). Ohne sie verschickt der
   Suchauftrag nichts – der häufigste stille Ausfall.
2. Fünf eigene oder erfragte Inserate einstellen – aus dem eigenen
   Umfeld, echt, mit Fotos. Damit prüft sich der ganze Ablauf ein
   letztes Mal an echten Menschen.
3. Zwanzig Wohnungsgenossenschaften **anschreiben, per Brief**, mit dem
   Angebot als Anlage. Die Briefe stehen fertig in `VERTRIEB.md`, das
   Angebot entsteht als PDF aus `scripts/unterlagen-bauen.js`.
4. Zehn Tage später alle zwanzig anrufen. Das ist die Woche, in der die
   meisten aufgeben, und sie entscheidet über alles Weitere.
5. **Nachmieter-Suchende nicht kalt anschreiben.** Der frühere Punkt
   dieser Liste war rechtlich nicht haltbar: Eine Werbe-E-Mail an einen
   Verbraucher ohne dessen ausdrückliche Einwilligung verstößt gegen
   § 7 Abs. 2 Nr. 2 UWG. Der Weg zu diesen Menschen führt über
   Auffindbarkeit, nicht über Ansprache – die Ratgeberseite
   `nachmieter-finden.html` steht dafür.
6. Nach zwölf Wochen `php api/index.php zahlen` ansehen und
   entscheiden, welcher Weg sich bewegt hat. Der andere wird liegen
   gelassen.

Punkt 6 ist der wichtigste. Es ist gut möglich, dass der B2B-Weg trägt
und der Verbrauchermarkt nicht – oder umgekehrt. Diese Frage lässt sich
nicht am Schreibtisch beantworten, nur an Zahlen.

---

## Die Unterlagen dazu

| Datei | Wofür |
|---|---|
| `PREISE.md` | Was es kostet, warum – und die Umsatzsteuerfrage |
| `VERTRIEB.md` | Die Anschreiben, wörtlich, plus die Grenzen des § 7 UWG |
| `AVV.md` | Der Vertrag nach Art. 28 DSGVO, ohne den nichts geht |
| `WOCHE.md` | Zwölf Wochen, ein Ziel je Woche |
| `START.md` | Die Einrichtung, rechtlich und technisch |
| `unterlagen/` | Angebot und Vertrag als PDF, aus denselben Quellen erzeugt |
