<?php
/* =====================================================================
   Sperren gegen Durchprobieren

   Ein sechsstelliger Code hat eine Million Möglichkeiten. Ohne Grenze
   sind die in einer halben Stunde durchprobiert – mit Grenze nie. Das
   ist der eigentliche Grund, warum es diese Datei gibt; alles andere
   ist Beiwerk.

   Gezählt wird zweifach: je Kennung (E-Mail-Adresse) und je IP-Adresse.
   Die Kennung fängt den Angriff auf ein bestimmtes Konto ab, die IP den
   Versuch, viele Konten gleichzeitig zu treffen. Beide Fenster gleiten:
   Statt „ab jetzt eine Stunde gesperrt“ wird gezählt, wie viele
   Versuche in der letzten Stunde liegen. Das trifft den Angreifer
   genauso hart und den vergesslichen Nutzer viel weniger.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/antwort.php';

final class Grenze
{
    private static array $cfg = [];

    public static function start(array $cfg): void
    {
        self::$cfg = $cfg['grenze'] ?? [];
    }

    /**
     * Prüft und zählt in einem Schritt. Gibt die Sekunden bis zum
     * nächsten erlaubten Versuch zurück, oder 0, wenn es weitergeht.
     *
     * Das Zählen passiert vor der eigentlichen Arbeit, nicht danach:
     * Sonst zählt ein Angreifer, der die Verbindung abbricht, gar nicht.
     */
    public static function pruefen(string $art, string $kennung): int
    {
        $regel = self::$cfg[$art] ?? null;
        if (!$regel) {
            return 0;
        }

        $jetzt = time();
        $wartezeit = 0;

        $prueflinge = [];
        if ($kennung !== '' && isset($regel['kennung'])) {
            $prueflinge[] = [$art . '|k|' . mb_substr($kennung, 0, 150), $regel['kennung']];
        }
        $ip = besucher_ip();
        if ($ip !== '' && isset($regel['ip'])) {
            $prueflinge[] = [$art . '|i|' . $ip, $regel['ip']];
        }

        foreach ($prueflinge as [$schluessel, [$hoechstens, $fensterMin]]) {
            $ab = $jetzt - $fensterMin * 60;
            $anzahl = (int) Db::wert(
                'SELECT COUNT(*) FROM tt_versuch WHERE schluessel = ? AND wann >= ?',
                [$schluessel, $ab]
            );
            if ($anzahl >= $hoechstens) {
                /* Frei wird der Platz, sobald der älteste Versuch aus dem
                   Fenster fällt. Genau diese Sekunde bekommt der Nutzer
                   genannt – „später nochmal“ ist keine Auskunft. */
                $aeltester = (int) Db::wert(
                    'SELECT MIN(wann) FROM tt_versuch WHERE schluessel = ? AND wann >= ?',
                    [$schluessel, $ab]
                );
                $frei = $aeltester + $fensterMin * 60 - $jetzt;
                $wartezeit = max($wartezeit, max(1, $frei));
            }
            Db::fuehre('INSERT INTO tt_versuch (schluessel, wann) VALUES (?, ?)', [$schluessel, $jetzt]);
        }

        return $wartezeit;
    }

    /** Nach einem geglückten Versuch werden die Zähler dieser Kennung
        geleert – wer sich richtig angemeldet hat, soll nicht an einer
        Sperre hängen, die seine eigenen Tippfehler aufgebaut haben. */
    public static function freigeben(string $art, string $kennung): void
    {
        if ($kennung === '') {
            return;
        }
        Db::fuehre('DELETE FROM tt_versuch WHERE schluessel = ?', [$art . '|k|' . mb_substr($kennung, 0, 150)]);
    }

    /** Bricht mit einer verständlichen Meldung ab, wenn gesperrt. */
    public static function sperreOderWeiter(string $art, string $kennung): void
    {
        $warten = self::pruefen($art, $kennung);
        if ($warten <= 0) {
            return;
        }
        Antwort::fehler(self::text($warten), 429, ['warten' => $warten]);
    }

    private static function text(int $sek): string
    {
        if ($sek < 90) {
            return 'Zu viele Versuche. Warte ' . max(10, (int) ceil($sek / 10) * 10) . ' Sekunden.';
        }
        $min = (int) ceil($sek / 60);
        if ($min < 60) {
            return 'Zu viele Versuche. Warte ' . $min . ' Minuten.';
        }
        $std = (int) ceil($min / 60);
        return 'Zu viele Versuche. Warte ' . $std . ($std === 1 ? ' Stunde.' : ' Stunden.');
    }
}
