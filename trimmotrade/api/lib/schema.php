<?php
/* =====================================================================
   Das Datenmodell an genau einer Stelle

   MariaDB und SQLite schreiben ein paar Dinge unterschiedlich (das
   automatische Hochzählen, die Textlängen, die Zeitstempel). Statt zwei
   Dateien zu pflegen, die auseinanderlaufen, steht das Modell hier
   einmal und wird für beide ausgegeben. `schema.sql` für die Einrichtung
   über phpMyAdmin entsteht daraus mit `php scripts/schema-ausgeben.php`.

   Was hier NICHT steht, ist ebenso wichtig: keine Inserate, keine
   Merklisten, keine Nachrichten, keine Profile. Der Server kennt nur,
   wer jemand ist – der ganze Rest der Anwendung bleibt im Browser.
   ===================================================================== */

final class Schema
{
    /** Wird bei jeder Änderung am Modell erhöht. Die Anwendung legt
        fehlende Tabellen selbst an; diese Zahl verhindert, dass sie das
        bei jedem Aufruf nachprüft. */
    public const VERSION = 1;

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

        return $t;
    }
}
