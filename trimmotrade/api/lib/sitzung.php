<?php
/* =====================================================================
   Sitzungen

   Bewusst nicht PHP-eigene Sitzungen. Deren Merkmal liegt als Datei auf
   dem Server, die Frist hängt an der Konfiguration des Hosters, und
   „überall abmelden“ gibt es nicht. Hier steht die Sitzung in der
   Datenbank: Sie hat eine eigene Frist, lässt sich einzeln beenden, und
   der Nutzer sieht auf der Kontoseite, welche Geräte angemeldet sind.

   Im Cookie steht ein Zufallswert. In der Datenbank steht nur dessen
   Hash. Der Unterschied entscheidet, was ein gestohlener Datenbestand
   wert ist: mit Klartext alles, mit Hash nichts.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/antwort.php';
require_once __DIR__ . '/konto.php';

final class Sitzung
{
    public const COOKIE = 'tt_sitzung';

    private static array $cfg = [];
    private static ?array $konto = null;
    private static bool $geladen = false;

    public static function start(array $cfg): void
    {
        self::$cfg = $cfg;
    }

    private static function sicher(): bool
    {
        /* Beim Ausprobieren auf 127.0.0.1 gibt es kein TLS. Ein Cookie
           mit `Secure` käme dort nie an – und ein Entwickler, der
           deswegen `Secure` dauerhaft ausbaut, ist genau die Panne, die
           das hier verhindern soll. */
        $https = ($_SERVER['HTTPS'] ?? '') !== '' && ($_SERVER['HTTPS'] ?? '') !== 'off';
        $host = $_SERVER['HTTP_HOST'] ?? '';
        $lokal = str_starts_with($host, '127.0.0.1') || str_starts_with($host, 'localhost')
            || str_starts_with($host, '[::1]');
        return $https || !$lokal;
    }

    public static function anlegen(int $kontoId): string
    {
        $merkmal = zufall_text(32);
        $jetzt = time();
        $tage = (int) (self::$cfg['sitzung_tage'] ?? 30);

        Db::fuehre(
            'INSERT INTO tt_sitzung (konto_id, merkmal_hash, ip, browser, angelegt, gesehen, laeuft_ab)
             VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $kontoId,
                merkmal_hash($merkmal),
                besucher_ip(),
                mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200),
                $jetzt,
                $jetzt,
                $jetzt + $tage * 86400,
            ]
        );

        self::cookieSetzen($merkmal, $jetzt + $tage * 86400);
        Konto::aendern($kontoId, ['gesehen' => $jetzt]);
        self::$konto = Konto::nachId($kontoId);
        self::$geladen = true;
        return $merkmal;
    }

    private static function cookieSetzen(string $wert, int $bis): void
    {
        if (headers_sent()) {
            return;
        }
        setcookie(self::COOKIE, $wert, [
            'expires'  => $bis,
            'path'     => '/',
            /* HttpOnly: Kein Skript im Browser kommt an das Merkmal. Das
               nimmt eingeschleustem Code die einfachste Beute.
               SameSite=Lax: Das Cookie geht nicht bei Anfragen mit, die
               eine fremde Seite auslöst – der Schutz gegen untergeschobene
               Formulare. „Lax“ statt „Strict“, weil die Rückkehr von
               Google und Microsoft sonst ohne Sitzung ankäme. */
            'secure'   => self::sicher(),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    /** Lädt die Sitzung aus dem Cookie. Gibt das Konto zurück oder null. */
    public static function konto(): ?array
    {
        if (self::$geladen) {
            return self::$konto;
        }
        self::$geladen = true;
        self::$konto = null;

        $merkmal = $_COOKIE[self::COOKIE] ?? '';
        if (!is_string($merkmal) || strlen($merkmal) < 20) {
            return null;
        }

        $s = Db::zeile(
            'SELECT * FROM tt_sitzung WHERE merkmal_hash = ?',
            [merkmal_hash($merkmal)]
        );
        $jetzt = time();
        if (!$s || (int) $s['laeuft_ab'] < $jetzt) {
            if ($s) {
                Db::fuehre('DELETE FROM tt_sitzung WHERE id = ?', [$s['id']]);
            }
            self::cookieLoeschen();
            return null;
        }

        $k = Konto::nachId((int) $s['konto_id']);
        if (!$k || !empty($k['gesperrt'])) {
            Db::fuehre('DELETE FROM tt_sitzung WHERE id = ?', [$s['id']]);
            self::cookieLoeschen();
            return null;
        }

        /* Nicht bei jedem Aufruf schreiben: Eine Anwendung, die auf jeder
           Seite eine Zeile ändert, macht die Datenbank ohne Not zum
           Nadelöhr. Einmal am Tag genügt für „zuletzt gesehen“, und die
           Frist verlängert sich dabei gleich mit. */
        $abstand = (int) (self::$cfg['sitzung_erneuern_h'] ?? 24) * 3600;
        if ($jetzt - (int) $s['gesehen'] > $abstand) {
            $tage = (int) (self::$cfg['sitzung_tage'] ?? 30);
            Db::fuehre('UPDATE tt_sitzung SET gesehen = ?, laeuft_ab = ? WHERE id = ?',
                [$jetzt, $jetzt + $tage * 86400, $s['id']]);
            Konto::aendern((int) $k['id'], ['gesehen' => $jetzt]);
            self::cookieSetzen($merkmal, $jetzt + $tage * 86400);
            $k['gesehen'] = $jetzt;
        }

        self::$konto = $k;
        return $k;
    }

    public static function beenden(): void
    {
        $merkmal = $_COOKIE[self::COOKIE] ?? '';
        if (is_string($merkmal) && $merkmal !== '') {
            Db::fuehre('DELETE FROM tt_sitzung WHERE merkmal_hash = ?', [merkmal_hash($merkmal)]);
        }
        self::cookieLoeschen();
        self::$konto = null;
        self::$geladen = true;
    }

    /** Alle Sitzungen dieses Kontos – „auf allen Geräten abmelden“. */
    public static function alleBeenden(int $kontoId): void
    {
        Db::fuehre('DELETE FROM tt_sitzung WHERE konto_id = ?', [$kontoId]);
        self::cookieLoeschen();
        self::$konto = null;
        self::$geladen = true;
    }

    private static function cookieLoeschen(): void
    {
        if (headers_sent()) {
            return;
        }
        setcookie(self::COOKIE, '', [
            'expires' => time() - 3600, 'path' => '/',
            'secure' => self::sicher(), 'httponly' => true, 'samesite' => 'Lax',
        ]);
    }

    /** Für Wege, die zwingend eine Anmeldung brauchen. */
    public static function verlangen(): array
    {
        $k = self::konto();
        if (!$k) {
            Antwort::fehler('Dafür musst du angemeldet sein.', 401);
        }
        return $k;
    }

    /* ----------------------------------------------------------------
       Schutz gegen untergeschobene Anfragen (CSRF)

       SameSite=Lax deckt das Meiste ab, ist aber allein zu wenig: Ältere
       Browser kennen es nicht, und es gibt Randfälle. Deshalb zusätzlich
       ein Merkmal, das im Cookie und im Kopf der Anfrage stehen muss.
       Fremde Seiten können den Kopf nicht setzen, ohne dass der Browser
       vorher um Erlaubnis fragt – das ist der ganze Trick.
       ---------------------------------------------------------------- */

    public const SCHUTZ_COOKIE = 'tt_schutz';
    public const SCHUTZ_KOPF   = 'HTTP_X_TT_SCHUTZ';

    public static function schutzMerkmal(): string
    {
        $da = $_COOKIE[self::SCHUTZ_COOKIE] ?? '';
        if (is_string($da) && strlen($da) >= 20) {
            return $da;
        }
        $neu = zufall_text(24);
        if (!headers_sent()) {
            setcookie(self::SCHUTZ_COOKIE, $neu, [
                'expires' => time() + 30 * 86400, 'path' => '/',
                'secure' => self::sicher(),
                /* Dieses eine Cookie MUSS für Skripte lesbar sein – der
                   Browser soll seinen Wert ja in den Kopf schreiben. Es
                   ist deshalb auch nichts wert, wenn man es allein hat:
                   Angemeldet ist man über das andere. */
                'httponly' => false, 'samesite' => 'Lax',
            ]);
            $_COOKIE[self::SCHUTZ_COOKIE] = $neu;
        }
        return $neu;
    }

    public static function schutzPruefen(): void
    {
        $cookie = $_COOKIE[self::SCHUTZ_COOKIE] ?? '';
        $kopf = $_SERVER[self::SCHUTZ_KOPF] ?? '';
        if (!is_string($cookie) || !is_string($kopf) || $cookie === '' || !gleich_sicher($cookie, $kopf)) {
            Antwort::fehler('Diese Anfrage kam nicht von der Seite selbst. Lade die Seite neu.', 403);
        }
    }

    /** Prüft, ob die Anfrage von der eigenen Seite kommt. Origin ist vom
        Browser gesetzt und für Skripte nicht fälschbar. */
    public static function herkunftPruefen(string $basis): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin === '') {
            return;   // Kein Origin bei einfachen Aufrufen – dann greift der Schutzkopf
        }
        $eigen = parse_url($basis, PHP_URL_HOST);
        $kam = parse_url($origin, PHP_URL_HOST);
        if ($kam === null || $eigen === null) {
            Antwort::fehler('Unerwartete Herkunft.', 403);
        }
        /* Mit und ohne www gilt als dieselbe Seite – die Umleitung in der
           .htaccess räumt das auf, aber die erste Anfrage kann noch von
           der anderen Schreibweise kommen. */
        $ab = static fn (string $h): string => preg_replace('/^www\./', '', mb_strtolower($h));
        if ($ab($kam) !== $ab($eigen) && !in_array($kam, ['127.0.0.1', 'localhost'], true)) {
            Antwort::fehler('Unerwartete Herkunft.', 403);
        }
    }
}
