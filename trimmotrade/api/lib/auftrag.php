<?php
/* =====================================================================
   Suchaufträge

   Der Suchauftrag ist die wichtigste Funktion dieser Anwendung, und das
   liegt nicht an ihm selbst, sondern an der Wohnungssuche: Sie besteht
   aus Warten. Wer eine Wohnung sucht, öffnet nicht dreimal täglich ein
   Portal – er tut es zwei Wochen lang und hört dann auf. Was ihn
   zurückholt, ist eine Mail mit einer Wohnung, die passt, geschickt
   bevor dreihundert andere sie gesehen haben.

   Für das Geschäft heißt das: Der Suchauftrag ist der Unterschied
   zwischen einem Besuch und einem Nutzer. Ohne ihn ist jede Anzeige
   Einwegverkehr.

   Drei Dinge sind deshalb nicht verhandelbar:

   1. Kein Doppelversand. `ab_id` merkt die laufende Nummer, nicht die
      Uhrzeit – zwei Inserate in derselben Sekunde gehen sonst verloren
      oder kommen zweimal.
   2. Ein Abmeldeverweis in jeder Mail, der ohne Anmeldung wirkt. Ohne
      ihn ist die Mail nach § 7 Abs. 2 UWG angreifbar und nach Art. 21
      DSGVO eine Zumutung.
   3. Nichts wird geschickt, wenn nichts da ist. Eine Mail „0 neue
      Treffer“ ist der schnellste Weg in den Spam-Ordner.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/antwort.php';
require_once __DIR__ . '/mail.php';

final class Auftrag
{
    public const HOECHSTENS_FREI = 1;    // muss zu plan.js passen
    public const HOECHSTENS_PLUS = 20;
    public const JE_MAIL         = 8;    // Treffer je Mail

    private const TAKTE = ['sofort' => 3600, 'taeglich' => 82800, 'woechentlich' => 601200];

    /* Welche Filterfelder ein Auftrag tragen darf – dieselbe Liste, die
       auch die Suche kennt. Ein Auftrag ist nichts anderes als eine
       gespeicherte Suche, und was die Suche nicht kann, kann er auch
       nicht. */
    private const FELDER = ['art', 'stadt', 'viertelKey', 'zimmerMin', 'zimmerMax',
        'flaecheMin', 'flaecheMax', 'warmMax', 'kaltMax', 'preisMax', 'nurMitBild'];

    public static function filterSaeubern(array $roh): array
    {
        $f = [];
        foreach (self::FELDER as $name) {
            if (!isset($roh[$name]) || $roh[$name] === '' || $roh[$name] === null) {
                continue;
            }
            $f[$name] = is_bool($roh[$name]) ? $roh[$name]
                : (is_numeric($roh[$name]) ? 0 + $roh[$name] : Inserat::text($roh[$name], 80));
        }
        return $f;
    }

    public static function anlegen(array $konto, array $roh, bool $plus): array
    {
        $grenze = $plus ? self::HOECHSTENS_PLUS : self::HOECHSTENS_FREI;
        $offen = (int) Db::wert('SELECT COUNT(*) FROM tt_auftrag WHERE konto_id = ?', [$konto['id']]);
        if ($offen >= $grenze) {
            Antwort::fehler($plus
                ? 'Mehr als ' . $grenze . ' Suchaufträge gehen nicht.'
                : 'Im freien Tarif ist ein Suchauftrag möglich. Lösch den alten oder nimm Plus.',
                409, ['grenze' => $grenze]);
        }

        $takt = is_string($roh['takt'] ?? null) && isset(self::TAKTE[$roh['takt']]) ? $roh['takt'] : 'taeglich';
        if ($takt === 'sofort' && !$plus) {
            $takt = 'taeglich';
        }
        $mail = mail_normal(Inserat::text($roh['mail'] ?? '', 254)) ?: (string) ($konto['mail'] ?? '');
        if ($mail === '' || !mail_gueltig($mail)) {
            Antwort::fehler('Ohne bestätigte E-Mail-Adresse kann der Suchauftrag nichts schicken.',
                422, ['feld' => 'mail']);
        }

        $filter = self::filterSaeubern(is_array($roh['filter'] ?? null) ? $roh['filter'] : []);
        /* Wo der Auftrag jetzt steht: Ab hier gilt alles als neu. Ohne
           das bekäme jeder neue Auftrag sofort den ganzen Bestand. */
        $hoechste = (int) (Db::wert('SELECT MAX(id) FROM tt_inserat') ?? 0);

        $kennung = 's' . strtolower(bin2hex(random_bytes(8)));
        Db::fuehre(
            'INSERT INTO tt_auftrag (kennung, konto_id, name, filter, takt, mail, ab_id, treffer, aus,
               abmelde_hash, angelegt, gesendet)
             VALUES (?,?,?,?,?,?,?,0,0,?,?,0)',
            [$kennung, $konto['id'], Inserat::text($roh['name'] ?? '', 120) ?: 'Mein Suchauftrag',
                json_encode($filter, JSON_UNESCAPED_UNICODE), $takt, $mail, $hoechste,
                merkmal_hash(zufall_text(24)), time()]
        );
        Zaehler::plus('auftrag-neu');
        return Db::zeile('SELECT * FROM tt_auftrag WHERE kennung = ?', [$kennung]) ?? [];
    }

    public static function meine(int $kontoId): array
    {
        return Db::zeilen('SELECT * FROM tt_auftrag WHERE konto_id = ? ORDER BY angelegt DESC', [$kontoId]);
    }

    public static function loeschen(int $kontoId, string $kennung): void
    {
        $z = Db::zeile('SELECT * FROM tt_auftrag WHERE kennung = ?', [$kennung]);
        if (!$z || (int) $z['konto_id'] !== $kontoId) {
            Antwort::fehler('Diesen Suchauftrag gibt es nicht.', 404);
        }
        Db::fuehre('DELETE FROM tt_auftrag WHERE id = ?', [$z['id']]);
    }

    public static function nachAussen(array $z): array
    {
        $f = json_decode((string) $z['filter'], true);
        return [
            'id' => $z['kennung'],
            'name' => $z['name'],
            'filter' => is_array($f) ? $f : [],
            'takt' => $z['takt'],
            'mail' => $z['mail'],
            'aus' => (int) $z['aus'] === 1,
            'treffer' => (int) $z['treffer'],
            'angelegt' => (int) $z['angelegt'],
            'gesendet' => (int) $z['gesendet'],
        ];
    }

    /* ------------------------------------------------------------------
       Der Lauf

           php api/index.php melden

       Gedacht als Cron-Auftrag, stündlich. Läuft er seltener, kommen die
       Mails seltener – kaputt geht nichts.
       ------------------------------------------------------------------ */

    public static function lauf(string $basis, bool $laut = false): int
    {
        $jetzt = time();
        $geschickt = 0;
        $auftraege = Db::zeilen('SELECT * FROM tt_auftrag WHERE aus = 0 ORDER BY id');

        foreach ($auftraege as $a) {
            $abstand = self::TAKTE[$a['takt']] ?? self::TAKTE['taeglich'];
            if ((int) $a['gesendet'] + $abstand > $jetzt) {
                continue;
            }

            $filter = json_decode((string) $a['filter'], true);
            $filter = is_array($filter) ? $filter : [];
            $filter['abId'] = (int) $a['ab_id'];
            $filter['sortierung'] = 'neu';

            $treffer = Inserat::suchen($filter, 0, self::JE_MAIL + 1);
            /* Die eigenen Inserate meldet niemand sich selbst. */
            $treffer = array_values(array_filter($treffer,
                static fn ($t) => (int) $t['konto_id'] !== (int) $a['konto_id']));

            $hoechste = (int) (Db::wert('SELECT MAX(id) FROM tt_inserat') ?? 0);
            if (!$treffer) {
                /* Nichts Neues: Marke vorrücken, keine Mail. */
                Db::fuehre('UPDATE tt_auftrag SET ab_id = ?, gesendet = ? WHERE id = ?',
                    [$hoechste, $jetzt, $a['id']]);
                continue;
            }

            $text = self::mailtext($a, $treffer, $basis);
            [$ok, $grund] = Post::senden(
                (string) $a['mail'],
                count($treffer) === 1
                    ? 'Eine neue Wohnung für „' . $a['name'] . '“'
                    : count($treffer) . ' neue Wohnungen für „' . $a['name'] . '“',
                $text
            );
            if (!$ok) {
                if ($laut) {
                    fwrite(STDERR, 'Auftrag ' . $a['kennung'] . ': ' . $grund . "\n");
                }
                continue;
            }
            Db::fuehre('UPDATE tt_auftrag SET ab_id = ?, gesendet = ?, treffer = treffer + ? WHERE id = ?',
                [$hoechste, $jetzt, count($treffer), $a['id']]);
            $geschickt++;
        }
        return $geschickt;
    }

    private static function mailtext(array $a, array $treffer, string $basis): string
    {
        $zeilen = [];
        foreach (array_slice($treffer, 0, self::JE_MAIL) as $t) {
            $preis = (int) $t['kaufpreis'] > 0
                ? number_format((int) $t['kaufpreis'], 0, ',', '.') . ' € Kaufpreis'
                : number_format((int) $t['warm'], 0, ',', '.') . ' € warm';
            $zeilen[] = '· ' . $t['titel'] . "\n"
                . '  ' . $preis . ' · ' . rtrim(rtrim(number_format((float) $t['zimmer'], 1, ',', ''), '0'), ',')
                . ' Zi. · ' . (int) $t['flaeche'] . " m²\n"
                . '  ' . $basis . '/#/objekt/' . $t['kennung'];
        }
        $mehr = count($treffer) > self::HOECHSTENS_FREI && count($treffer) > self::JE_MAIL
            ? "\nEs gibt noch mehr – der Rest steht in der Suche.\n" : '';

        return "Neu seit deiner letzten Mail:\n\n"
            . implode("\n\n", $zeilen) . "\n"
            . $mehr
            . "\n———\n"
            . "Suchauftrag „" . $a['name'] . "“ · " . self::taktText((string) $a['takt']) . "\n"
            . 'Ändern: ' . $basis . "/#/suche\n"
            . 'Abbestellen (ohne Anmeldung): ' . $basis . '/api/auftrag/aus?k=' . $a['kennung']
            . '&h=' . substr((string) $a['abmelde_hash'], 0, 32) . "\n";
    }

    private static function taktText(string $takt): string
    {
        return ['sofort' => 'stündlich', 'taeglich' => 'täglich', 'woechentlich' => 'wöchentlich'][$takt] ?? 'täglich';
    }

    /** Abmelden über den Verweis aus der Mail. Kein Konto nötig – wer
        abbestellen will, soll sich dafür nicht anmelden müssen. */
    public static function abmelden(string $kennung, string $halbhash): bool
    {
        $z = Db::zeile('SELECT * FROM tt_auftrag WHERE kennung = ?', [$kennung]);
        if (!$z) {
            return false;
        }
        if (!gleich_sicher(substr((string) $z['abmelde_hash'], 0, 32), $halbhash)) {
            return false;
        }
        Db::fuehre('UPDATE tt_auftrag SET aus = 1 WHERE id = ?', [$z['id']]);
        return true;
    }

    /* ------------------------------------------------------------------
       Erinnerung an die anbietende Seite

       „Ist die Wohnung noch frei?“ – sieben Tage bevor das Inserat
       verfällt. Das ist der Mechanismus gegen Karteileichen, und er ist
       der Grund, warum eine Suche hier etwas wert ist: Ein Portal, auf
       dem die Hälfte der Wohnungen längst weg ist, verbrennt die Zeit
       aller Suchenden.
       ------------------------------------------------------------------ */

    public static function erinnern(string $basis, bool $laut = false): int
    {
        $jetzt = time();
        $bald = $jetzt + 7 * 86400;
        $zeilen = Db::zeilen(
            "SELECT i.*, k.mail FROM tt_inserat i JOIN tt_konto k ON k.id = i.konto_id
              WHERE i.stand = 'aktiv' AND i.laeuft_ab < ? AND i.laeuft_ab > ? AND i.erinnert = 0
                AND k.mail_bestaetigt = 1 LIMIT 200",
            [$bald, $jetzt]
        );
        $n = 0;
        foreach ($zeilen as $i) {
            $tage = max(1, (int) ceil(((int) $i['laeuft_ab'] - $jetzt) / 86400));
            [$ok] = Post::senden(
                (string) $i['mail'],
                'Steht „' . mb_substr((string) $i['titel'], 0, 50, 'UTF-8') . '“ noch?',
                "Dein Inserat läuft in " . $tage . ' ' . ($tage === 1 ? 'Tag' : 'Tagen') . " aus.\n\n"
                . $i['titel'] . "\n"
                . $basis . '/#/objekt/' . $i['kennung'] . "\n\n"
                . "Ein Klick auf „Steht noch“ verlängert es um 60 Tage:\n"
                . $basis . "/#/inserieren\n\n"
                . "Warum wir fragen: Auf den meisten Portalen steht die Hälfte der Wohnungen noch,\n"
                . "wenn sie längst vergeben ist. Wer sucht, verliert damit Stunden. Deshalb läuft\n"
                . "hier jedes Inserat nach 60 Tagen aus, wenn niemand widerspricht.\n"
            );
            if ($ok) {
                Db::fuehre('UPDATE tt_inserat SET erinnert = ? WHERE id = ?', [$jetzt, $i['id']]);
                $n++;
            } elseif ($laut) {
                fwrite(STDERR, 'Erinnerung ' . $i['kennung'] . " ging nicht raus\n");
            }
        }
        return $n;
    }
}
