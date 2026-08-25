<?php
/* =====================================================================
   DER – die paar Bausteine, die für öffentliche Schlüssel nötig sind

   Zwei Stellen brauchen dasselbe: WebAuthn bekommt den öffentlichen
   Schlüssel als COSE-Abbildung, Google und Microsoft liefern ihn als
   JSON-Web-Key. OpenSSL will beide Male PEM. Dazwischen liegt DER, und
   das ist überschaubar genug, um es hier einmal richtig zu haben,
   statt es an zwei Stellen halb zu wiederholen.

   Jeder DER-Wert ist Typ · Länge · Inhalt. Nur die Länge ist etwas
   umständlich: bis 127 steht sie direkt da, darüber sagt das erste Byte,
   wie viele Längenbytes folgen.
   ===================================================================== */

final class Der
{
    public static function laenge(int $n): string
    {
        if ($n < 0x80) {
            return chr($n);
        }
        $b = '';
        while ($n > 0) {
            $b = chr($n & 0xff) . $b;
            $n >>= 8;
        }
        return chr(0x80 | strlen($b)) . $b;
    }

    public static function folge(string $inhalt): string
    {
        return "\x30" . self::laenge(strlen($inhalt)) . $inhalt;
    }

    public static function oid(string $roh): string
    {
        return "\x06" . self::laenge(strlen($roh)) . $roh;
    }

    public static function bitfolge(string $roh): string
    {
        // Das führende Null-Byte sagt: keine ungenutzten Bits am Ende.
        return "\x03" . self::laenge(strlen($roh) + 1) . "\x00" . $roh;
    }

    public static function zahl(string $roh): string
    {
        $roh = ltrim($roh, "\x00");
        if ($roh === '') {
            $roh = "\x00";
        }
        /* DER-Zahlen sind vorzeichenbehaftet. Ist das oberste Bit gesetzt,
           gilt der Wert ohne führende Null als negativ – bei einem
           RSA-Modul wäre das ein kaputter Schlüssel. */
        if (ord($roh[0]) > 0x7f) {
            $roh = "\x00" . $roh;
        }
        return "\x02" . self::laenge(strlen($roh)) . $roh;
    }

    public static function pem(string $der): string
    {
        return "-----BEGIN PUBLIC KEY-----\n"
            . chunk_split(base64_encode($der), 64, "\n")
            . "-----END PUBLIC KEY-----\n";
    }

    /** RSA-Modul und -Exponent als fertiges PEM. */
    public static function rsaPem(string $n, string $e): string
    {
        $kennung = self::folge(
            self::oid("\x2a\x86\x48\x86\xf7\x0d\x01\x01\x01")   // 1.2.840.113549.1.1.1
            . "\x05\x00"                                         // NULL
        );
        $inhalt = self::bitfolge(self::folge(self::zahl($n) . self::zahl($e)));
        return self::pem(self::folge($kennung . $inhalt));
    }

    /** Ein Punkt auf der Kurve P-256 als fertiges PEM. */
    public static function p256Pem(string $x, string $y): string
    {
        $kennung = self::folge(
            self::oid("\x2a\x86\x48\xce\x3d\x02\x01")            // 1.2.840.10045.2.1
            . self::oid("\x2a\x86\x48\xce\x3d\x03\x01\x07")      // 1.2.840.10045.3.1.7
        );
        return self::pem(self::folge($kennung . self::bitfolge("\x04" . $x . $y)));
    }
}
