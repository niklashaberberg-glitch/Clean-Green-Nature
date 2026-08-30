<?php
/* =====================================================================
   Das Datenmodell an genau einer Stelle

   MariaDB und SQLite schreiben ein paar Dinge unterschiedlich (das
   automatische Hochzählen, die Textlängen, die Zeitstempel). Statt zwei
   Dateien zu pflegen, die auseinanderlaufen, steht das Modell hier
   einmal und wird für beide ausgegeben. `schema.sql` für die Einrichtung
   über phpMyAdmin entsteht daraus mit `php scripts/schema-ausgeben.php`.

   Der Server kennt vier Dinge:

     1. Wer jemand ist – Konten, Passkeys, Sitzungen.
     2. Was öffentlich angeboten wird – Inserate, Anfragen darauf,
        Besichtigungstermine, Suchaufträge, Meldungen nach Art. 16 DSA
        und die Gruppen, die sich zusammentun, um eine Wohnung
        gemeinsam zu nehmen.
     3. Was jemand für sich festhält – Profil, Merkliste, Bewerbungs-
        tafel, Notizen. Das lag lange nur im Browser, und das war der
        Grund, warum die Anwendung auf dem Telefon nichts von dem
        wusste, was am Rechner eingetragen worden war. Für eine
        Vorführung ging das; für einen Dienst, den jemand wirklich
        benutzt, nicht.
     4. Verschlüsselte Unterlagen und die befristeten Verweise darauf.
        Der Server bekommt hier ausschließlich Chiffrat zu sehen: Der
        Schlüssel entsteht im Browser aus dem Kennwort und wandert beim
        Freigeben in den Fragmentteil des Verweises, den Browser nie an
        einen Server senden. Ohne diese Tabelle wäre der Tresor eine
        Schublade, deren Verweis nur auf demselben Gerät aufgeht – also
        nutzlos für genau den Zweck, für den es ihn gibt.
   ===================================================================== */

final class Schema
{
    /** Wird bei jeder Änderung am Modell erhöht. Die Anwendung legt
        fehlende Tabellen selbst an; diese Zahl verhindert, dass sie das
        bei jedem Aufruf nachprüft. */
    public const VERSION = 4;

    /** @return string[] */
    public static function anweisungen(string $treiber): array
    {
        $sqlite = $treiber === 'sqlite';

        // Automatisch hochzählender Primärschlüssel
        $id  = $sqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY';
        // Zeitpunkte als Unix-Sekunden: keine Zeitzonenfallen, überall gleich sortierbar
        $zeit = $sqlite ? 'INTEGER NOT NULL' : 'BIGINT NOT NULL';
        $ja   = $sqlite ? 'INTEGER NOT NULL DEFAULT 0' : 'TINYINT(1) NOT NULL DEFAULT 0';
        $ende = $sqlite ? '' : ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';

        $t = [];

        /* --- Konten ---------------------------------------------------
           `kennung` ist die nach außen sichtbare Kontonummer. Sie ist
           zufällig, nicht fortlaufend: Aus einer fortlaufenden ließe
           sich ablesen, wie viele Konten es gibt und wann eines angelegt
           wurde. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_konto (
  id $id,
  kennung VARCHAR(64) NOT NULL,
  mail VARCHAR(254) DEFAULT NULL,
  mail_bestaetigt $ja,
  name VARCHAR(120) NOT NULL DEFAULT '',
  anbieter VARCHAR(20) NOT NULL DEFAULT 'mail',
  stufe INTEGER NOT NULL DEFAULT 0,
  gesperrt $ja,
  angelegt $zeit,
  gesehen $zeit,
  UNIQUE (kennung),
  UNIQUE (mail)
)$ende";

        /* --- Verknüpfte Fremdkonten -----------------------------------
           Ein Konto kann über mehrere Wege erreichbar sein: dieselbe
           Adresse bei Google und per E-Mail-Code. Deshalb eine eigene
           Tabelle statt einer Spalte. `fremd_id` ist die unveränderliche
           Kennung des Anbieters (`sub`), nicht die E-Mail-Adresse –
           Adressen ändern sich, `sub` nicht. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_fremd (
  id $id,
  konto_id BIGINT NOT NULL,
  anbieter VARCHAR(20) NOT NULL,
  fremd_id VARCHAR(255) NOT NULL,
  mail VARCHAR(254) NOT NULL DEFAULT '',
  angelegt $zeit,
  UNIQUE (anbieter, fremd_id)
)$ende";

        /* --- Passkeys -------------------------------------------------
           `oeff_schluessel` ist der öffentliche Teil – aus ihm lässt sich
           nichts ableiten, er darf hier stehen. `zaehler` ist der
           Signaturzähler des Geräts: Springt er zurück, ist der
           Authentikator geklont worden. Viele Geräte zählen gar nicht
           (dann bleibt er 0), deshalb ist der Rückwärtssprung nur bei
           Werten über null ein Alarm. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_passkey (
  id $id,
  konto_id BIGINT NOT NULL,
  cred_id TEXT NOT NULL,
  cred_hash VARCHAR(64) NOT NULL,
  oeff_schluessel TEXT NOT NULL,
  zaehler BIGINT NOT NULL DEFAULT 0,
  geraet VARCHAR(120) NOT NULL DEFAULT '',
  angelegt $zeit,
  gesehen $zeit,
  UNIQUE (cred_hash)
)$ende";

        /* --- Sitzungen ------------------------------------------------
           Gespeichert wird nur der Hash des Merkmals aus dem Cookie.
           Wer die Datenbank in die Hände bekommt, kann sich damit nicht
           anmelden. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_sitzung (
  id $id,
  konto_id BIGINT NOT NULL,
  merkmal_hash VARCHAR(64) NOT NULL,
  ip VARCHAR(45) NOT NULL DEFAULT '',
  browser VARCHAR(200) NOT NULL DEFAULT '',
  angelegt $zeit,
  gesehen $zeit,
  laeuft_ab $zeit,
  UNIQUE (merkmal_hash)
)$ende";

        /* --- Laufende Vorgänge ----------------------------------------
           Einmalcodes, WebAuthn-Aufforderungen und der Zwischenstand bei
           Google/Microsoft. Alles kurzlebig, alles mit Ablauf, alles mit
           demselben Aufräumen. `daten` ist JSON – der Inhalt hängt an
           der Art, und ein eigenes Tabellenschema je Art wäre hier
           Aufwand ohne Gewinn. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_vorgang (
  id $id,
  kennung VARCHAR(64) NOT NULL,
  art VARCHAR(24) NOT NULL,
  bezug VARCHAR(254) NOT NULL DEFAULT '',
  geheim_hash VARCHAR(64) NOT NULL DEFAULT '',
  daten TEXT NOT NULL,
  versuche INTEGER NOT NULL DEFAULT 0,
  angelegt $zeit,
  laeuft_ab $zeit,
  UNIQUE (kennung)
)$ende";

        /* --- Zähler für Sperren ---------------------------------------
           Ein Eintrag je Ereignis, aufgeräumt wie alles andere. Zählen
           statt Merken: So lässt sich ein gleitendes Fenster ohne
           Hintergrunddienst umsetzen. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_versuch (
  id $id,
  schluessel VARCHAR(190) NOT NULL,
  wann $zeit
)$ende";

        /* --- Inserate -------------------------------------------------
           Das Inserat selbst liegt als JSON in `daten` – es hat je nach
           Art (Miete, Kauf, WG, Tausch) andere Felder, und vierzig
           Spalten, von denen dreißig leer sind, wären ein schlechter
           Tausch. Herausgezogen ist genau das, wonach die Suche filtert
           und sortiert; alles andere liest der Browser aus dem JSON.

           `laeuft_ab` ist kein technisches Detail, sondern eine Zusage:
           Ein Inserat verfällt nach 60 Tagen, wenn niemand bestätigt,
           dass das Angebot noch steht. Karteileichen sind der häufigste
           Vorwurf an Wohnungsportale – hier verhindert sie die
           Datenbank, nicht der gute Wille. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_inserat (
  id $id,
  kennung VARCHAR(40) NOT NULL,
  konto_id BIGINT NOT NULL,
  kind VARCHAR(12) NOT NULL DEFAULT 'miete',
  typ VARCHAR(16) NOT NULL DEFAULT 'wohnung',
  titel VARCHAR(200) NOT NULL DEFAULT '',
  stadt VARCHAR(80) NOT NULL DEFAULT '',
  viertel_key VARCHAR(60) NOT NULL DEFAULT '',
  lat DOUBLE NOT NULL DEFAULT 0,
  lng DOUBLE NOT NULL DEFAULT 0,
  zimmer DOUBLE NOT NULL DEFAULT 0,
  flaeche INTEGER NOT NULL DEFAULT 0,
  kalt INTEGER NOT NULL DEFAULT 0,
  warm INTEGER NOT NULL DEFAULT 0,
  kaufpreis INTEGER NOT NULL DEFAULT 0,
  frei_ab VARCHAR(10) NOT NULL DEFAULT '',
  bilder INTEGER NOT NULL DEFAULT 0,
  wg_gruendung $ja,
  daten MEDIUMTEXT NOT NULL,
  stand VARCHAR(12) NOT NULL DEFAULT 'aktiv',
  aufrufe BIGINT NOT NULL DEFAULT 0,
  anfragen BIGINT NOT NULL DEFAULT 0,
  angelegt $zeit,
  geaendert $zeit,
  laeuft_ab $zeit,
  erinnert $zeit,
  UNIQUE (kennung)
)$ende";

        /* --- Bilder ---------------------------------------------------
           Die Datei liegt unter api/daten/bilder, nicht in der Datenbank:
           Ein Bild durch eine Datenbankabfrage zu schleusen kostet bei
           jedem Aufruf Speicher, den ein Webhosting-Paket nicht hat.
           Was hier steht, ist nur der Verweis – und die Maße, damit die
           Seite Platz reservieren kann, bevor das Bild da ist. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_bild (
  id $id,
  kennung VARCHAR(40) NOT NULL,
  inserat_id BIGINT NOT NULL,
  pos INTEGER NOT NULL DEFAULT 0,
  datei VARCHAR(100) NOT NULL,
  breite INTEGER NOT NULL DEFAULT 0,
  hoehe INTEGER NOT NULL DEFAULT 0,
  bytes INTEGER NOT NULL DEFAULT 0,
  angelegt $zeit,
  UNIQUE (kennung)
)$ende";

        /* --- Anfragen -------------------------------------------------
           Der einzige Weg, auf dem sich zwei Menschen hier erreichen.
           Die Adresse der anbietenden Seite steht nie in der Anfrage und
           die des Suchenden nie im Inserat: Beide Mails gehen über den
           Server, und erst eine Antwort gibt die Adresse frei. Wer eine
           Wohnung inseriert, soll danach nicht in Werbung ertrinken. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_anfrage (
  id $id,
  kennung VARCHAR(40) NOT NULL,
  inserat_id BIGINT NOT NULL,
  von_konto_id BIGINT NOT NULL DEFAULT 0,
  an_konto_id BIGINT NOT NULL DEFAULT 0,
  name VARCHAR(120) NOT NULL DEFAULT '',
  mail VARCHAR(254) NOT NULL DEFAULT '',
  telefon VARCHAR(40) NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  eckdaten TEXT NOT NULL,
  vorne $ja,
  stand VARCHAR(12) NOT NULL DEFAULT 'neu',
  angelegt $zeit,
  gelesen $zeit,
  UNIQUE (kennung)
)$ende";

        /* --- Suchaufträge ---------------------------------------------
           Der Grund, warum jemand wiederkommt. `ab_id` merkt sich, bis
           wohin schon gemeldet wurde – so kann der Lauf beliebig oft
           starten, ohne je etwas doppelt zu schicken. `abmelde_hash`
           erlaubt das Abbestellen ohne Anmeldung; ohne diesen Link wäre
           die Mail nach § 7 UWG angreifbar und nach Art. 21 DSGVO eine
           Zumutung. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_auftrag (
  id $id,
  kennung VARCHAR(40) NOT NULL,
  konto_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL DEFAULT '',
  filter TEXT NOT NULL,
  takt VARCHAR(10) NOT NULL DEFAULT 'taeglich',
  mail VARCHAR(254) NOT NULL DEFAULT '',
  ab_id BIGINT NOT NULL DEFAULT 0,
  treffer BIGINT NOT NULL DEFAULT 0,
  aus $ja,
  abmelde_hash VARCHAR(64) NOT NULL DEFAULT '',
  angelegt $zeit,
  gesendet $zeit,
  UNIQUE (kennung)
)$ende";

        /* --- Meldungen ------------------------------------------------
           Art. 16 DSA verlangt einen Meldeweg, der ohne Anmeldung
           erreichbar ist, eine Empfangsbestätigung und eine Entscheidung
           mit Begründung. Alle drei Schritte stehen in dieser Tabelle;
           was nicht darin steht, ist nicht passiert. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_meldung (
  id $id,
  kennung VARCHAR(40) NOT NULL,
  inserat_id BIGINT NOT NULL,
  konto_id BIGINT NOT NULL DEFAULT 0,
  mail VARCHAR(254) NOT NULL DEFAULT '',
  grund VARCHAR(40) NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  stand VARCHAR(12) NOT NULL DEFAULT 'offen',
  entscheidung TEXT NOT NULL,
  angelegt $zeit,
  erledigt $zeit,
  UNIQUE (kennung)
)$ende";

        /* --- Zählwerk -------------------------------------------------
           Eine Zeile je Tag und Ereignisname, sonst nichts. Keine
           Kennung, keine Adresse, keine Sitzung, kein Verlauf – aus
           „am 3. März 412 Suchen“ lässt sich niemand herauslesen. Damit
           ist es kein personenbezogenes Datum und braucht weder
           Einwilligung noch Cookie-Banner (§ 25 Abs. 2 Nr. 2 TDDDG greift
           gar nicht erst, weil nichts auf dem Gerät abgelegt wird).

           Es ist trotzdem genug, um das Geschäft zu steuern: Wie viele
           sehen die Suche, wie viele legen ein Inserat an, wie viele
           schreiben jemanden an. Ein Trichter braucht Zahlen, keine
           Personen. */
        /* --- WG-Gründung -----------------------------------------------
           Eine Gruppe von Menschen, die sich nicht kennen und gemeinsam
           eine bestimmte Wohnung nehmen wollen.

           Der Unterschied zu einem WG-Zimmer ist grundlegend: Dort gibt
           es die WG schon, und einer zieht ein. Hier gibt es sie noch
           nicht – die Wohnung steht leer, und drei Fremde entscheiden
           sich füreinander und für sie zugleich. Das ist derselbe
           doppelte Zufall, an dem der direkte Wohnungstausch scheitert,
           und er lässt sich auf dieselbe Weise auflösen: indem man die
           Suche sichtbar macht, statt sie dem Zufall zu überlassen.

           `inserat_id` darf 0 sein. Fällt die Wohnung weg, soll die
           Gruppe nicht mit ihr sterben – drei Menschen, die sich einig
           sind, sind das Wertvollere an der Sache. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_gruppe (
  id $id,
  kennung VARCHAR(40) NOT NULL,
  inserat_id BIGINT NOT NULL DEFAULT 0,
  gruender_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL DEFAULT '',
  ziel INTEGER NOT NULL DEFAULT 3,
  text TEXT NOT NULL,
  offen $ja,
  stand VARCHAR(12) NOT NULL DEFAULT 'offen',
  anfrage_id BIGINT NOT NULL DEFAULT 0,
  angelegt $zeit,
  geaendert $zeit,
  laeuft_ab $zeit,
  UNIQUE (kennung)
)$ende";

        /* --- Wer in einer Gruppe ist ------------------------------------
           `stand` unterscheidet drei Lagen, und die Unterscheidung ist
           kein Verwaltungskram, sondern Datenschutz: Wer erst angefragt
           hat, ist für die übrigen Mitglieder unsichtbar – nur die
           gründende Person sieht ihn. Erst wer aufgenommen ist, gehört
           dazu und sieht die anderen.

           `eckdaten` ist bewusst eine Kopie und kein Verweis aufs Profil:
           Was jemand beim Beitritt über sich gesagt hat, soll sich nicht
           rückwirkend ändern, wenn er später sein Profil bearbeitet. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_gruppe_person (
  id $id,
  kennung VARCHAR(40) NOT NULL,
  gruppe_id BIGINT NOT NULL,
  konto_id BIGINT NOT NULL,
  rolle VARCHAR(10) NOT NULL DEFAULT 'mitglied',
  stand VARCHAR(12) NOT NULL DEFAULT 'angefragt',
  vorstellung TEXT NOT NULL,
  eckdaten TEXT NOT NULL,
  angelegt $zeit,
  entschieden $zeit,
  UNIQUE (kennung),
  UNIQUE (gruppe_id, konto_id)
)$ende";

        $t[] = "CREATE TABLE IF NOT EXISTS tt_zaehler (
  tag VARCHAR(10) NOT NULL,
  name VARCHAR(60) NOT NULL,
  wert BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (tag, name)
)$ende";

        $t[] = "CREATE TABLE IF NOT EXISTS tt_stand (
  name VARCHAR(40) NOT NULL PRIMARY KEY,
  wert VARCHAR(190) NOT NULL
)$ende";

        /* --- Was jemand für sich festhält -----------------------------

           Ein Feld je Zeile statt einer großen Spalte mit allem darin.
           Das hat einen praktischen Grund: Der Browser schreibt nach
           jeder Änderung nur das eine Feld zurück, das sich geändert
           hat. Läge alles in einem Klumpen, überschriebe das Telefon
           beim Speichern der Merkliste das Profil, das am Rechner
           gerade bearbeitet wurde.

           `wert` ist JSON und wird vom Server nicht ausgewertet – er
           ist hier Schrank, nicht Buchhalter. Geprüft werden Größe und
           Feldname, sonst nichts. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_ablage (
  konto_id BIGINT NOT NULL,
  feld VARCHAR(40) NOT NULL,
  wert MEDIUMTEXT NOT NULL,
  geaendert $zeit,
  PRIMARY KEY (konto_id, feld)
)$ende";

        /* --- Dokumententresor -----------------------------------------

           `chiffrat` ist das mit AES-GCM verschlüsselte Dokument,
           `huelle` der damit verschlüsselte Dateiname und der mit dem
           Tresorschlüssel umschlossene Dokumentschlüssel. Beides ist
           für den Server ein Haufen Zeichen. Er kann es speichern,
           herausgeben und löschen – lesen kann er es nicht, auch nicht,
           wer die Datenbank in die Hände bekommt.

           Art, Größe und Datum liegen im Klartext: Ohne sie ließe sich
           die Liste im gesperrten Tresor nicht zeigen. Sie verraten
           nichts über den Inhalt. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_tresor (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  konto_id BIGINT NOT NULL,
  art VARCHAR(40) NOT NULL DEFAULT 'sonstiges',
  typ VARCHAR(80) NOT NULL DEFAULT '',
  groesse BIGINT NOT NULL DEFAULT 0,
  huelle MEDIUMTEXT NOT NULL,
  chiffrat LONGTEXT NOT NULL,
  hinzu $zeit
)$ende";

        /* Eine Freigabe ist ein Verweis mit Verfallsdatum und Zähler.
           `dokumente` nennt die Kennungen, `abrufe` die Zeitpunkte –
           beides JSON, beides klein. Der Schlüssel steht nicht hier
           und nirgends sonst auf dem Server. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_freigabe (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  konto_id BIGINT NOT NULL,
  dokumente TEXT NOT NULL,
  empfaenger VARCHAR(160) NOT NULL DEFAULT '',
  objekt VARCHAR(40) NOT NULL DEFAULT '',
  erstellt $zeit,
  ablauf $zeit,
  max_abrufe INTEGER NOT NULL DEFAULT 3,
  abrufe TEXT NOT NULL DEFAULT '[]',
  widerrufen $ja
)$ende";

        /* --- Besichtigungstermine -------------------------------------

           Sie gehören zum Inserat, nicht zum Konto: Wer das Inserat
           löscht, löscht die Termine mit. Ein Platz ist genommen,
           sobald eine Buchung dazu steht – gezählt wird nicht in einer
           Spalte, sondern aus den Buchungen. Eine Zählspalte läuft
           irgendwann auseinander, eine Zeile nicht. */
        $t[] = "CREATE TABLE IF NOT EXISTS tt_termin (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  inserat_id VARCHAR(40) NOT NULL,
  datum VARCHAR(10) NOT NULL,
  zeit VARCHAR(5) NOT NULL,
  art VARCHAR(40) NOT NULL DEFAULT 'Einzeltermin',
  plaetze INTEGER NOT NULL DEFAULT 1,
  angelegt $zeit
)$ende";

        $t[] = "CREATE TABLE IF NOT EXISTS tt_buchung (
  termin_id VARCHAR(40) NOT NULL,
  konto_id BIGINT NOT NULL,
  angelegt $zeit,
  PRIMARY KEY (termin_id, konto_id)
)$ende";

        /* --- Nachträglich hinzugekommene Spalten -----------------------

           `CREATE TABLE IF NOT EXISTS` legt eine fehlende Tabelle an –
           einer vorhandenen fügt es nichts hinzu. Wer schon eine ältere
           Fassung betreibt, bekäme sonst beim ersten Aufruf einen
           Datenbankfehler, weil eine Abfrage eine Spalte nennt, die es
           bei ihm nicht gibt.

           Deshalb steht jede später hinzugekommene Spalte hier noch
           einmal als ALTER TABLE. Bei einer frischen Einrichtung
           scheitert das mit „Spalte gibt es schon“ – und genau das ist
           der Fall, den `istSchonDa` durchgehen lässt. */
        $t[] = "ALTER TABLE tt_inserat ADD COLUMN wg_gruendung $ja";

        /* Plus und der Gründerplatz gehören ans Konto, nicht in den
           Browser. Vorher stand beides im Speicher des Geräts: Wer sich
           am Telefon anmeldete, hatte dort kein Plus, und die Zahl der
           vergebenen Plätze war eine Hochrechnung aus der Zeit seit dem
           Start – also geraten. § 7 der Geschäftsbedingungen sagt „die
           ersten 500“, und das lässt sich nur zentral einhalten. */
        $t[] = "ALTER TABLE tt_konto ADD COLUMN plus_bis $zeit DEFAULT 0";
        $t[] = "ALTER TABLE tt_konto ADD COLUMN gruender_nr INTEGER DEFAULT 0";
        $t[] = "ALTER TABLE tt_konto ADD COLUMN gruender_bis $zeit DEFAULT 0";

        /* --- Indizes --------------------------------------------------
           Getrennt, weil MariaDB sie in CREATE TABLE erlaubt, SQLite
           aber nicht. Jeder deckt eine Abfrage ab, die auf jedem
           Seitenaufruf läuft. */
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_fremd_konto ON tt_fremd (konto_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_passkey_konto ON tt_passkey (konto_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_sitzung_konto ON tt_sitzung (konto_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_sitzung_ab ON tt_sitzung (laeuft_ab)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_vorgang_ab ON tt_vorgang (laeuft_ab)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_vorgang_bezug ON tt_vorgang (art, bezug)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_versuch ON tt_versuch (schluessel, wann)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_inserat_suche ON tt_inserat (stand, laeuft_ab)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_inserat_konto ON tt_inserat (konto_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_inserat_ort ON tt_inserat (viertel_key, stand)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_bild_inserat ON tt_bild (inserat_id, pos)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_anfrage_an ON tt_anfrage (an_konto_id, angelegt)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_anfrage_von ON tt_anfrage (von_konto_id, angelegt)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_anfrage_inserat ON tt_anfrage (inserat_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_auftrag_konto ON tt_auftrag (konto_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_auftrag_lauf ON tt_auftrag (aus, gesendet)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_meldung_stand ON tt_meldung (stand, angelegt)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_gruppe_inserat ON tt_gruppe (inserat_id, stand)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_gruppe_gruender ON tt_gruppe (gruender_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_person_gruppe ON tt_gruppe_person (gruppe_id, stand)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_person_konto ON tt_gruppe_person (konto_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_tresor_konto ON tt_tresor (konto_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_freigabe_konto ON tt_freigabe (konto_id, erstellt)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_freigabe_ablauf ON tt_freigabe (ablauf)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_termin_inserat ON tt_termin (inserat_id, datum, zeit)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_buchung_konto ON tt_buchung (konto_id)';
        $t[] = 'CREATE INDEX IF NOT EXISTS ix_konto_gruender ON tt_konto (gruender_nr)';

        return $t;
    }
}
