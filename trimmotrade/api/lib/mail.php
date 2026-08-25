<?php
/* =====================================================================
   E-Mail-Versand

   Drei Wege, weil drei Lagen vorkommen:

   'smtp' – der empfohlene. netcup legt zu jeder Domain Postfächer an;
            eines davon verschickt die Codes. Weil die Mail dann vom
            eigenen Mailserver kommt und zu SPF und DKIM der Domain
            passt, landet sie im Posteingang statt im Spam-Ordner. Das
            ist bei einer Anmeldemail keine Kleinigkeit: Eine Mail im
            Spam-Ordner ist eine Anmeldung, die nicht stattfindet.

   'mail' – PHP-eigenes mail(). Braucht keine Zugangsdaten, wird aber
            von vielen Empfängern misstrauisch behandelt.

   'log'  – schreibt statt zu senden. Zum Ausprobieren, ohne Postfach.

   Der SMTP-Teil ist bewusst von Hand geschrieben und nicht aus einer
   Bibliothek geholt: Er muss genau eine Sache können – eine kurze
   Textmail an eine Adresse –, und dafür lohnt kein Composer auf einem
   Webhosting-Paket ohne Kommandozeile.
   ===================================================================== */

require_once __DIR__ . '/antwort.php';

final class Post
{
    private static array $cfg = [];

    public static function start(array $cfg): void
    {
        self::$cfg = $cfg['mail'] ?? [];
    }

    public static function moeglich(): bool
    {
        $art = self::$cfg['art'] ?? '';
        if ($art === 'smtp') {
            return (self::$cfg['smtp']['host'] ?? '') !== ''
                && (self::$cfg['smtp']['pass'] ?? '') !== '';
        }
        return in_array($art, ['mail', 'log'], true);
    }

    /**
     * @return array{0:bool,1:string} ok und, wenn nicht, der Grund
     */
    public static function senden(string $an, string $betreff, string $text): array
    {
        if (!mail_gueltig($an)) {
            return [false, 'Ungültige Empfängeradresse.'];
        }

        $von     = self::$cfg['von'] ?? ('noreply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
        $vonName = self::$cfg['von_name'] ?? 'TrimmoTrade';
        $antwort = self::$cfg['antwort'] ?? $von;

        /* Kopfzeilen aus fremder Eingabe sind der klassische Einbruchsweg:
           Ein Zeilenumbruch im Betreff hängt beliebige weitere Kopfzeilen
           an, etwa ein zweites Bcc. Deshalb fliegt hier alles raus, was
           eine Zeile beenden könnte – vor jeder weiteren Verarbeitung. */
        $betreff = self::einzeilig($betreff);
        $an      = self::einzeilig($an);

        $kopf = [
            'From: ' . self::adresse($vonName, $von),
            'Reply-To: ' . $antwort,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            /* Sagt Postfächern und Weiterleitungen: nicht beantworten,
               nicht automatisch abwesend melden. Verhindert Schleifen. */
            'Auto-Submitted: auto-generated',
            'X-Auto-Response-Suppress: All',
            'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . self::domainVon($von) . '>',
        ];

        $art = self::$cfg['art'] ?? '';

        if ($art === 'log') {
            $datei = __DIR__ . '/../daten/mail.log';
            @file_put_contents(
                $datei,
                '=== ' . gmdate('c') . " ===\nAn: $an\nBetreff: $betreff\n\n$text\n\n",
                FILE_APPEND
            );
            return [true, ''];
        }

        if ($art === 'smtp') {
            return self::smtp($an, $betreff, $text, $kopf, $von);
        }

        if ($art === 'mail') {
            $ok = @mail($an, self::betreffKodieren($betreff), $text, implode("\r\n", $kopf), '-f' . $von);
            return [$ok, $ok ? '' : 'mail() hat abgelehnt.'];
        }

        return [false, 'Es ist kein Versandweg eingerichtet.'];
    }

    private static function einzeilig(string $s): string
    {
        return trim(str_replace(["\r", "\n", "\0"], ' ', $s));
    }

    private static function domainVon(string $adresse): string
    {
        $t = explode('@', $adresse);
        return count($t) > 1 ? end($t) : 'localhost';
    }

    /* Ein Anzeigename mit Umlauten braucht die Kodierung nach RFC 2047,
       sonst kommt Kauderwelsch an. */
    private static function adresse(string $name, string $mail): string
    {
        $name = self::einzeilig($name);
        if ($name === '') {
            return $mail;
        }
        $sicher = preg_match('/^[\x20-\x7E]+$/', $name) === 1;
        $teil = $sicher ? '"' . str_replace('"', '', $name) . '"' : self::betreffKodieren($name);
        return $teil . ' <' . $mail . '>';
    }

    private static function betreffKodieren(string $s): string
    {
        if (preg_match('/^[\x20-\x7E]+$/', $s) === 1) {
            return $s;
        }
        return '=?UTF-8?B?' . base64_encode($s) . '?=';
    }

    /* ----------------------------------------------------------------
       SMTP

       Klein gehalten und trotzdem vollständig: EHLO, STARTTLS, AUTH
       LOGIN oder PLAIN, MAIL FROM, RCPT TO, DATA. Jede Antwort wird
       geprüft – ein SMTP-Server, der „550 Relay denied“ sagt, darf nicht
       als geglückter Versand durchgehen.
       ---------------------------------------------------------------- */

    private static function smtp(string $an, string $betreff, string $text, array $kopf, string $von): array
    {
        $s = self::$cfg['smtp'] ?? [];
        $host = $s['host'] ?? '';
        $port = (int) ($s['port'] ?? 587);
        $tls  = $s['tls'] ?? 'start';

        if ($host === '') {
            return [false, 'Kein SMTP-Server eingetragen.'];
        }

        $ziel = ($tls === 'direkt' ? 'ssl://' : 'tcp://') . $host . ':' . $port;
        $rahmen = stream_context_create(['ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'SNI_enabled' => true,
        ]]);

        $verbindung = @stream_socket_client($ziel, $nr, $grund, 12, STREAM_CLIENT_CONNECT, $rahmen);
        if (!$verbindung) {
            return [false, 'SMTP nicht erreichbar: ' . $grund];
        }
        stream_set_timeout($verbindung, 12);

        $lesen = static function () use ($verbindung): array {
            $letzte = '';
            /* Mehrzeilige Antworten: „250-“ heißt, es kommt noch etwas,
               „250 “ mit Leerzeichen ist die letzte Zeile. */
            while (($zeile = fgets($verbindung, 1024)) !== false) {
                $letzte .= $zeile;
                if (strlen($zeile) >= 4 && $zeile[3] === ' ') {
                    break;
                }
            }
            return [(int) substr($letzte, 0, 3), trim($letzte)];
        };
        $sagen = static function (string $befehl) use ($verbindung, $lesen): array {
            fwrite($verbindung, $befehl . "\r\n");
            return $lesen();
        };
        $zu = static function () use ($verbindung): void {
            @fwrite($verbindung, "QUIT\r\n");
            @fclose($verbindung);
        };

        [$code] = $lesen();
        if ($code !== 220) {
            $zu();
            return [false, 'SMTP-Begrüßung fehlt (' . $code . ').'];
        }

        $eigen = self::domainVon($von);
        [$code, $antwortText] = $sagen('EHLO ' . $eigen);
        if ($code !== 250) {
            $zu();
            return [false, 'EHLO abgelehnt (' . $code . ').'];
        }

        if ($tls === 'start') {
            [$code] = $sagen('STARTTLS');
            if ($code !== 220) {
                $zu();
                return [false, 'STARTTLS abgelehnt (' . $code . ').'];
            }
            $art = STREAM_CRYPTO_METHOD_TLS_CLIENT;
            if (!@stream_socket_enable_crypto($verbindung, true, $art)) {
                $zu();
                /* Hier wird bewusst abgebrochen statt unverschlüsselt
                   weiterzumachen: Sonst gingen die Zugangsdaten des
                   Postfachs im Klartext über die Leitung, und der
                   Angreifer, der STARTTLS wegfiltert, bekäme genau das,
                   worauf er wartet. */
                return [false, 'TLS ließ sich nicht aufbauen.'];
            }
            [$code, $antwortText] = $sagen('EHLO ' . $eigen);
            if ($code !== 250) {
                $zu();
                return [false, 'EHLO nach TLS abgelehnt (' . $code . ').'];
            }
        }

        $nutzer = (string) ($s['nutzer'] ?? '');
        $pass   = (string) ($s['pass'] ?? '');
        if ($nutzer !== '') {
            $kannPlain = stripos($antwortText, 'PLAIN') !== false;
            if ($kannPlain) {
                [$code] = $sagen('AUTH PLAIN ' . base64_encode("\0" . $nutzer . "\0" . $pass));
            } else {
                [$code] = $sagen('AUTH LOGIN');
                if ($code === 334) {
                    [$code] = $sagen(base64_encode($nutzer));
                }
                if ($code === 334) {
                    [$code] = $sagen(base64_encode($pass));
                }
            }
            if ($code !== 235) {
                $zu();
                return [false, 'Anmeldung am Mailserver abgelehnt (' . $code . ').'];
            }
        }

        [$code] = $sagen('MAIL FROM:<' . $von . '>');
        if ($code !== 250) {
            $zu();
            return [false, 'Absender abgelehnt (' . $code . ').'];
        }
        [$code] = $sagen('RCPT TO:<' . $an . '>');
        if ($code !== 250 && $code !== 251) {
            $zu();
            return [false, 'Empfänger abgelehnt (' . $code . ').'];
        }
        [$code] = $sagen('DATA');
        if ($code !== 354) {
            $zu();
            return [false, 'DATA abgelehnt (' . $code . ').'];
        }

        $rumpf = implode("\r\n", array_merge(
            ['To: ' . $an, 'Subject: ' . self::betreffKodieren($betreff)],
            $kopf
        )) . "\r\n\r\n" . self::punkteSchuetzen($text) . "\r\n.";

        [$code] = $sagen($rumpf);
        $zu();

        return $code === 250 ? [true, ''] : [false, 'Versand abgelehnt (' . $code . ').'];
    }

    /* Ein Punkt am Zeilenanfang beendet in SMTP die Nachricht. Steht er
       im Text, muss er verdoppelt werden – sonst bricht eine Mail, deren
       Zeile zufällig mit einem Punkt beginnt, mitten drin ab. */
    private static function punkteSchuetzen(string $text): string
    {
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = str_replace("\n", "\r\n", $text);
        return preg_replace('/^\./m', '..', $text);
    }
}
