<?php
/* =====================================================================
   Das Datenmodell an genau einer Stelle

   MariaDB und SQLite schreiben ein paar Dinge unterschiedlich (das
   automatische Hochzählen, die Textlängen, die Zeitstempel). Statt zwei
   Dateien zu pflegen, die auseinanderlaufen, steht das Modell hier
   einmal und wird für beide ausgegeben. `schema.sql` für die Einrichtung
   über phpMyAdmin entsteht daraus mit `php scripts/schema-ausgeben.php`.

   Der Server kennt zwei Dinge, und nur die beiden:

     1. Wer jemand ist – Konten, Passkeys, Sitzungen.
     2. Was öffentlich angeboten wird – Inserate, Anfragen darauf,
        Suchaufträge, Meldungen nach Art. 16 DSA.

   Alles Übrige bleibt im Browser: Merkliste, Vergleich, Profil, der
   Dokumententresor, jede Berechnung. Das ist keine Bequemlichkeit,
   sondern die Trennlinie: Ein Inserat ist eine Veröffentlichung und
   gehört auf den Server. Ein Profil ist es nicht.
   ===================================================================== */

final class Schema
{
    /** Wird bei jeder Änderung am Modell erhöht. Die Anwendung legt
        fehlende Tabellen selbst an; diese Zahl verhindert, dass sie das
        bei jedem Aufruf nachprüft. */
    public const VERSION = 2;

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

        return $t;
    }
}
