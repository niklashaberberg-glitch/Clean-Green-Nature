<?php
/* =====================================================================
   Laufende Vorgänge

   Alles, was zwischen zwei Anfragen kurz gemerkt werden muss: der
   Einmalcode, die WebAuthn-Aufforderung, der Zwischenstand bei Google
   und Microsoft. Drei sehr verschiedene Dinge mit demselben Bedarf –
   kurzlebig, einmal verwendbar, mit Ablauf.

   Zwei Regeln, die jeden dieser Vorgänge betreffen:

   1. Das Geheimnis (der Code, die Aufforderung) steht nur als Hash da.
   2. Nach dem Einlösen wird der Vorgang gelöscht, nicht als „benutzt“
      markiert. Was gelöscht ist, kann nicht ein zweites Mal gelten.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/antwort.php';

final class Vorgang
{
    /**
     * @param string      $art     'mailcode' | 'wa-neu' | 'wa-anmelden' | 'oauth'
     * @param string      $bezug   Wozu er gehört – meist die E-Mail-Adresse
     * @param string|null $geheim  Was der Nutzer zurückschicken muss
     * @param array       $daten   Alles Weitere, als JSON
     * @return string     Die Kennung, unter der der Vorgang wiederzufinden ist
     */
    public static function anlegen(
        string $art,
        string $bezug,
        ?string $geheim,
        array $daten,
        int $gueltigSek
    ): string {
        $kennung = zufall_text(24);
        $jetzt = time();

        Db::fuehre(
            'INSERT INTO tt_vorgang (kennung, art, bezug, geheim_hash, daten, versuche, angelegt, laeuft_ab)
             VALUES (?, ?, ?, ?, ?, 0, ?, ?)',
            [
                $kennung,
                $art,
                mb_substr($bezug, 0, 254),
                $geheim !== null ? merkmal_hash($geheim) : '',
                json_encode($daten, JSON_UNESCAPED_UNICODE),
                $jetzt,
                $jetzt + $gueltigSek,
            ]
        );
        return $kennung;
    }

    public static function holen(string $kennung, string $art): ?array
    {
        if ($kennung === '' || strlen($kennung) > 64) {
            return null;
        }
        $v = Db::zeile('SELECT * FROM tt_vorgang WHERE kennung = ? AND art = ?', [$kennung, $art]);
        if (!$v) {
            return null;
        }
        if ((int) $v['laeuft_ab'] < time()) {
            self::loeschen($kennung);
            return null;
        }
        $v['daten'] = json_decode($v['daten'] ?? '[]', true) ?: [];
        return $v;
    }

    public static function loeschen(string $kennung): void
    {
        Db::fuehre('DELETE FROM tt_vorgang WHERE kennung = ?', [$kennung]);
    }

    /** Zählt einen Fehlversuch und sagt, ob noch welche übrig sind. */
    public static function fehlversuch(string $kennung, int $hoechstens): bool
    {
        Db::fuehre('UPDATE tt_vorgang SET versuche = versuche + 1 WHERE kennung = ?', [$kennung]);
        $n = (int) Db::wert('SELECT versuche FROM tt_vorgang WHERE kennung = ?', [$kennung]);
        if ($n >= $hoechstens) {
            self::loeschen($kennung);
            return false;
        }
        return true;
    }

    /** Ältere Vorgänge derselben Art zum selben Bezug wegräumen: Wer
        dreimal auf „Neuen Code“ drückt, soll nicht drei gültige Codes
        haben. Es gilt immer nur der zuletzt verschickte. */
    public static function vorherigeRaeumen(string $art, string $bezug): void
    {
        Db::fuehre('DELETE FROM tt_vorgang WHERE art = ? AND bezug = ?', [$art, mb_substr($bezug, 0, 254)]);
    }
}
