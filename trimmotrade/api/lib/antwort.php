<?php
/* =====================================================================
   Antworten und Fehler

   Ein Grundsatz zieht sich durch die ganze Anmeldung: Nach außen darf
   nie erkennbar sein, ob es eine Adresse gibt. „Kennen wir nicht“ und
   „Passwort falsch“ sind zwei Auskünfte, aus denen sich ein Verzeichnis
   bauen lässt. Deshalb heißt es hier an den entscheidenden Stellen
   immer gleich: „Wenn es zu dieser Adresse ein Konto gibt, ist der Code
   unterwegs.“
   ===================================================================== */

final class Antwort
{
    public static function json(array $daten, int $status = 200): never
    {
        if (!headers_sent()) {
            http_response_code($status);
            header('Content-Type: application/json; charset=utf-8');
            header('Cache-Control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');
            header('X-Content-Type-Options: nosniff');
            header('Referrer-Policy: strict-origin-when-cross-origin');
        }
        echo json_encode($daten, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function gut(array $daten = []): never
    {
        self::json(['ok' => true] + $daten);
    }

    /* `feld` sagt der Oberfläche, welches Eingabefeld hervorzuheben ist.
       `warten` trägt bei Sperren die Sekunden bis zum nächsten Versuch. */
    public static function fehler(string $text, int $status = 400, array $mehr = []): never
    {
        self::json(['ok' => false, 'fehler' => $text] + $mehr, $status);
    }

    /* Für alles, was nicht der Nutzer verschuldet hat. Der Grund landet
       im Fehlerprotokoll, nicht in der Antwort – es sei denn, die
       Entwicklungsschraube steht auf true. */
    public static function panne(string $intern, array $cfg = []): never
    {
        error_log('TrimmoTrade: ' . $intern);
        $sichtbar = !empty($cfg['entwicklung'])
            ? $intern
            : 'Da ist auf unserer Seite etwas schiefgegangen. Versuch es in einer Minute noch einmal.';
        self::json(['ok' => false, 'fehler' => $sichtbar], 500);
    }
}

/* ---------------------------------------------------------------------
   Kleinkram, den mehrere Bausteine brauchen
   --------------------------------------------------------------------- */

/** Base64url ohne Füllzeichen – die Schreibweise, die WebAuthn und JWT
    durchgängig verwenden. */
function b64u_kodieren(string $roh): string
{
    return rtrim(strtr(base64_encode($roh), '+/', '-_'), '=');
}

function b64u_dekodieren(string $s): string
{
    $s = strtr($s, '-_', '+/');
    $rest = strlen($s) % 4;
    if ($rest) {
        $s .= str_repeat('=', 4 - $rest);
    }
    $roh = base64_decode($s, true);
    return $roh === false ? '' : $roh;
}

function zufall_text(int $bytes = 32): string
{
    return b64u_kodieren(random_bytes($bytes));
}

/* Zum Speichern von Sitzungsmerkmalen und Codes: Nie das Original in die
   Datenbank. Wer die Datenbank kopiert, hat damit keinen einzigen
   gültigen Schlüssel in der Hand. Für Zufallswerte mit voller Entropie
   ist SHA-256 dafür ausreichend und schnell – PBKDF2 & Co. schützen vor
   Wörterbüchern, und die gibt es hier nicht. */
function merkmal_hash(string $klar): string
{
    return hash('sha256', $klar);
}

/** Vergleich ohne Zeitunterschied. Bei sechsstelligen Codes ist das kein
    theoretisches Problem: Ein Zeichen weniger Rechenzeit je Fehlversuch
    verrät über viele Versuche hinweg den Code. */
function gleich_sicher(string $a, string $b): bool
{
    return hash_equals($a, $b);
}

/** Die Adresse des Besuchers. Bei netcup steht die echte in
    REMOTE_ADDR; Weiterleitungs-Kopfzeilen sind fälschbar und werden
    deshalb bewusst nicht ausgewertet. */
function besucher_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return is_string($ip) ? substr($ip, 0, 45) : '';
}

/** Mail-Adressen werden für Vergleich und Speicherung vereinheitlicht.
    Nur Kleinschreibung und Leerraum – keine Punkte-Entfernung wie bei
    Gmail: Das ist Anbieterwissen und trifft bei anderen daneben. */
function mail_normal(string $m): string
{
    return mb_strtolower(trim($m), 'UTF-8');
}

function mail_gueltig(string $m): bool
{
    return (bool) filter_var($m, FILTER_VALIDATE_EMAIL) && strlen($m) <= 254;
}
