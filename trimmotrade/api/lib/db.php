<?php
/* =====================================================================
   Datenbank

   Zwei Treiber, ein Verhalten. MariaDB ist der Betriebsfall bei netcup,
   SQLite der zum Ausprobieren auf dem eigenen Rechner – ohne
   Datenbankserver, ohne Einrichtung.

   Die Tabellen legt die Anwendung beim ersten Aufruf selbst an. Das ist
   der Grund, warum das Hochladen genügt und niemand SQL in phpMyAdmin
   einfügen muss. `schema.sql` gibt es trotzdem, für alle, die es lieber
   von Hand tun oder deren Datenbanknutzer keine Tabellen anlegen darf.
   ===================================================================== */

require_once __DIR__ . '/schema.php';

final class Db
{
    private static ?PDO $pdo = null;
    private static array $cfg = [];

    public static function start(array $cfg): void
    {
        self::$cfg = $cfg;
    }

    public static function pdo(): PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $d = self::$cfg['db'] ?? [];
        $treiber = $d['treiber'] ?? 'mysql';

        if ($treiber === 'sqlite') {
            $datei = $d['datei'] ?? (__DIR__ . '/../daten/trimmotrade.sqlite');
            $ordner = dirname($datei);
            if (!is_dir($ordner)) {
                @mkdir($ordner, 0770, true);
            }
            $pdo = new PDO('sqlite:' . $datei, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            /* Ohne das wartet SQLite bei gleichzeitigen Zugriffen nicht,
               sondern bricht sofort ab – bei zwei Anmeldungen im selben
               Moment wäre das ein Fehler ohne Not. */
            $pdo->exec('PRAGMA busy_timeout = 4000');
            $pdo->exec('PRAGMA journal_mode = WAL');
            $pdo->exec('PRAGMA foreign_keys = ON');
        } else {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
                $d['host'] ?? 'localhost',
                (int) ($d['port'] ?? 3306),
                $d['name'] ?? ''
            );
            $pdo = new PDO($dsn, $d['nutzer'] ?? '', $d['pass'] ?? '', [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                /* Echte vorbereitete Anweisungen statt der Nachbildung im
                   Treiber. Nur so trennt der Datenbankserver Befehl und
                   Wert wirklich – das ist der Schutz gegen eingeschleustes
                   SQL, nicht das Escapen. */
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        }

        self::$pdo = $pdo;
        self::modellPruefen();
        return $pdo;
    }

    /** Legt fehlende Tabellen an. Läuft nur, wenn die vermerkte Version
        nicht stimmt – also praktisch einmal. */
    private static function modellPruefen(): void
    {
        $pdo = self::$pdo;
        $treiber = self::$cfg['db']['treiber'] ?? 'mysql';

        $stand = 0;
        try {
            $z = $pdo->query("SELECT wert FROM tt_stand WHERE name = 'schema'");
            $stand = (int) ($z->fetchColumn() ?: 0);
        } catch (PDOException $e) {
            $stand = 0;   // Tabelle gibt es noch nicht – erster Start
        }
        if ($stand >= Schema::VERSION) {
            return;
        }

        foreach (Schema::anweisungen($treiber) as $sql) {
            try {
                $pdo->exec($sql);
            } catch (PDOException $e) {
                /* „Gibt es schon“ ist bei Indizes kein Fehler: MariaDB
                   kennt CREATE INDEX IF NOT EXISTS erst ab 10.1.4, und
                   MySQL gar nicht. Alles andere fliegt weiter. */
                if (!self::istSchonDa($e)) {
                    throw $e;
                }
            }
        }

        $ein = $treiber === 'sqlite'
            ? 'INSERT INTO tt_stand (name, wert) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET wert = excluded.wert'
            : 'INSERT INTO tt_stand (name, wert) VALUES (?, ?) ON DUPLICATE KEY UPDATE wert = VALUES(wert)';
        $pdo->prepare($ein)->execute(['schema', (string) Schema::VERSION]);
    }

    private static function istSchonDa(PDOException $e): bool
    {
        $t = strtolower($e->getMessage());
        return str_contains($t, 'already exists')
            || str_contains($t, 'duplicate key name')
            || str_contains($t, 'existiert bereits');
    }

    /* ----------------------------------------------------------------
       Kurzformen. Jede Abfrage in der Anwendung läuft über eine davon,
       und jede nimmt die Werte getrennt entgegen – zusammengesetztes SQL
       kommt in dieser Anwendung nirgends vor.
       ---------------------------------------------------------------- */

    public static function fuehre(string $sql, array $werte = []): PDOStatement
    {
        $s = self::pdo()->prepare($sql);
        $s->execute($werte);
        return $s;
    }

    public static function zeile(string $sql, array $werte = []): ?array
    {
        $z = self::fuehre($sql, $werte)->fetch();
        return $z === false ? null : $z;
    }

    public static function zeilen(string $sql, array $werte = []): array
    {
        return self::fuehre($sql, $werte)->fetchAll();
    }

    public static function wert(string $sql, array $werte = []): mixed
    {
        $w = self::fuehre($sql, $werte)->fetchColumn();
        return $w === false ? null : $w;
    }

    public static function letzteId(): int
    {
        return (int) self::pdo()->lastInsertId();
    }

    /* ----------------------------------------------------------------
       Aufräumen

       Abgelaufene Vorgänge, alte Sitzungen und Versuchszähler. Läuft
       gelegentlich beim normalen Zugriff mit, damit es auch ohne
       eingerichteten Cron-Auftrag passiert. Wer einen einrichtet, spart
       dem Besucher diese Millisekunden – nötig ist er nicht.
       ---------------------------------------------------------------- */

    public static function aufraeumen(bool $erzwingen = false): void
    {
        if (!$erzwingen && random_int(1, 50) !== 1) {
            return;
        }
        $jetzt = time();
        try {
            self::fuehre('DELETE FROM tt_vorgang WHERE laeuft_ab < ?', [$jetzt]);
            self::fuehre('DELETE FROM tt_sitzung WHERE laeuft_ab < ?', [$jetzt]);
            self::fuehre('DELETE FROM tt_versuch WHERE wann < ?', [$jetzt - 86400]);
        } catch (PDOException $e) {
            error_log('TrimmoTrade: Aufräumen fehlgeschlagen – ' . $e->getMessage());
        }
    }
}
