<?php
/* =====================================================================
   Anfragen und Meldungen

   Die Anfrage ist der einzige Weg, auf dem sich hier zwei Menschen
   erreichen. Deshalb steht sie unter zwei Regeln, die sich widersprechen
   könnten und es hier nicht tun:

   Erreichbarkeit: Eine Anfrage muss ankommen. Nicht „liegt im Postfach,
   falls sich jemand einloggt“, sondern eine Mail an die anbietende
   Seite, sofort, mit dem Wesentlichen darin.

   Sparsamkeit: Keine der beiden Adressen steht in der Mail der anderen.
   Wer eine Wohnung inseriert, bekommt sonst zwei Wochen später Werbung
   von Küchenstudios; wer sich bewirbt, bekommt sonst eine Absage per
   Telefon um 22 Uhr. Die Adresse gibt frei, wer antwortet – und dann
   auch nur die eigene.

   Was in der Mail steht, ist also die Nachricht ohne Rückweg, und der
   Rückweg ist ein Verweis in die Anwendung. Das ist ein Klick mehr. Er
   ist es wert.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/antwort.php';
require_once __DIR__ . '/mail.php';

final class Anfrage
{
    /** Wie viele Anfragen ein Konto am Tag verschicken darf. Wer mehr
        braucht, bewirbt sich nicht, sondern verteilt. */
    public const AM_TAG = 40;

    /* Was an Eckdaten mitgeschickt werden darf. Eine feste Liste, weil
       „schick einfach mit, was im Profil steht“ der Anfang davon wäre,
       dass eine Bewerbung Angaben zu Religion, Herkunft oder Gesundheit
       enthält – Daten nach Art. 9 DSGVO, nach denen niemand fragen darf
       und die hier deshalb gar nicht erst durchkommen. */
    private const ECKDATEN = [
        'haushalt'   => 40,   // „2 Erwachsene, 1 Kind“
        'einzug'     => 20,   // Datum als Text
        'beschaeftigung' => 60,
        'einkommen'  => 40,   // Spanne, keine Zahl auf den Euro
        'haustiere'  => 40,
        'raucher'    => 20,
        'wbs'        => 40,
        'buergschaft' => 40,
        /* Das Folgende darf eine Vermieterseite fragen und fragt sie
           ohnehin – es steht hier nur früher da. Alter und Geschlecht
           stehen bewusst nicht dabei: § 19 Abs. 5 AGG erlaubt die
           Auswahl danach unter Mitbewohnenden, nicht bei der Vermietung.
           Deshalb führt dieser Weg sie nicht, der Weg über Gruppe schon. */
        'einkommenArt' => 60,
        'kaution'      => 40,
        'mietdauer'    => 40,
        'flexibel'     => 40,
        'besichtigung' => 90,
    ];

    /* Dieselben Angaben noch einmal, in der Form, in der ein Programm
       damit rechnen kann.

       Kein Wort davon geht über das hinaus, was in der Liste oben
       ohnehin lesbar mitgeht – „2000 bis 2200 €“ und 2000 sagen
       dasselbe. Der Unterschied ist, dass sich aus der zweiten Form eine
       Reihenfolge rechnen lässt, und zwar im Browser der anbietenden
       Seite, nicht auf diesem Server: Eine Rangfolge, die hier entsteht,
       könnte niemand mehr nachvollziehen.

       Alter und Geschlecht stehen nicht in dieser Liste, und deshalb
       kann keine Formel sie gewichten. Das ist die ganze Absicherung –
       eine Zusage, dass man etwas nicht benutzt, ist keine. */
    private const BEWERBUNG_WORTE = [
        'einkommenArt'   => ['unbefristet', 'befristet', 'probezeit', 'selbststaendig',
                             'studium', 'ausbildung', 'rente', 'sonst'],
        'buergschaft'    => ['keine', 'eltern', 'sonstige'],
        'wbsStufe'       => ['a', 'b', 'c', 'unklar'],
        'einzugFlexibel' => ['genau', 'zwei_wochen', 'flexibel'],
    ];

    private static function bewerbungSaeubern(array $roh): array
    {
        $raus = [];
        foreach (self::BEWERBUNG_WORTE as $feld => $erlaubt) {
            $w = is_string($roh[$feld] ?? null) ? trim($roh[$feld]) : '';
            if ($w !== '' && in_array($w, $erlaubt, true)) {
                $raus[$feld] = $w;
            }
        }
        foreach (['mietdauer' => [1, 120], 'haushalt' => [1, 12], 'einkommenVon' => [0, 100000]] as $feld => $spanne) {
            if (isset($roh[$feld]) && is_numeric($roh[$feld]) && (int) $roh[$feld] > 0) {
                $raus[$feld] = Inserat::ganz($roh[$feld], $spanne[0], $spanne[1], $spanne[0]);
            }
        }
        if (!empty($roh['kautionBereit'])) {
            $raus['kautionBereit'] = true;
        }
        /* Der Einzugstermin als Datum, nicht als deutscher Text: Aus
           „1.11.2026“ rechnet niemand einen Abstand in Tagen. */
        $d = Inserat::text($roh['einzugAb'] ?? '', 10);
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) {
            $raus['einzugAb'] = $d;
        }
        $u = is_array($roh['unterlagen'] ?? null) ? $roh['unterlagen'] : [];
        $mappe = [];
        foreach (['schufa', 'gehaltsnachweise', 'ausweis', 'mietschuldenfrei', 'selbstauskunft', 'wbs'] as $k) {
            if (!empty($u[$k])) {
                $mappe[$k] = true;
            }
        }
        if ($mappe) {
            $raus['unterlagen'] = $mappe;
        }
        return $raus;
    }

    public static function senden(array $konto, array $inserat, array $roh, string $basis): array
    {
        if ((int) $inserat['konto_id'] === (int) $konto['id']) {
            Antwort::fehler('Das ist dein eigenes Inserat.', 409);
        }
        if ($inserat['stand'] !== 'aktiv' || (int) $inserat['laeuft_ab'] < time()) {
            Antwort::fehler('Dieses Inserat steht nicht mehr zur Verfügung.', 409);
        }

        $seit = time() - 86400;
        $heute = (int) Db::wert(
            'SELECT COUNT(*) FROM tt_anfrage WHERE von_konto_id = ? AND angelegt >= ?',
            [$konto['id'], $seit]
        );
        if ($heute >= self::AM_TAG) {
            Antwort::fehler('Mehr als ' . self::AM_TAG . ' Anfragen am Tag gehen nicht. '
                . 'Morgen wieder.', 429);
        }
        $schon = Db::zeile(
            'SELECT kennung FROM tt_anfrage WHERE von_konto_id = ? AND inserat_id = ?',
            [$konto['id'], $inserat['id']]
        );
        if ($schon) {
            Antwort::fehler('Du hast dieses Inserat schon angeschrieben.', 409, ['kennung' => $schon['kennung']]);
        }

        $text = Inserat::text($roh['text'] ?? '', 4000);
        if (mb_strlen($text, 'UTF-8') < 20) {
            Antwort::fehler('Schreib ein paar Sätze – eine leere Anfrage wird nicht beantwortet.', 422, ['feld' => 'text']);
        }

        $eck = [];
        foreach (self::ECKDATEN as $feld => $max) {
            $w = Inserat::text($roh['eckdaten'][$feld] ?? '', $max);
            if ($w !== '') {
                $eck[$feld] = $w;
            }
        }
        /* Nur, wenn die Eckdaten überhaupt mitgehen. Wer den Haken
           entfernt, schickt auch die rechenbare Fassung nicht mit. */
        if ($eck) {
            $b = self::bewerbungSaeubern(is_array($roh['bewerbung'] ?? null) ? $roh['bewerbung'] : []);
            if ($b) {
                $eck['bewerbung'] = $b;
            }
        }

        $name = Inserat::text($roh['name'] ?? '', 120) ?: ($konto['name'] ?? '');
        $mail = mail_normal(Inserat::text($roh['mail'] ?? '', 254));
        if ($mail !== '' && !mail_gueltig($mail)) {
            Antwort::fehler('Diese E-Mail-Adresse stimmt nicht.', 422, ['feld' => 'mail']);
        }
        if ($mail === '') {
            $mail = (string) ($konto['mail'] ?? '');
        }
        $telefon = Inserat::text($roh['telefon'] ?? '', 40);

        $kennung = 'a' . strtolower(bin2hex(random_bytes(8)));
        $jetzt = time();
        Db::fuehre(
            'INSERT INTO tt_anfrage (kennung, inserat_id, von_konto_id, an_konto_id, name, mail, telefon,
               text, eckdaten, vorne, stand, angelegt, gelesen)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0)',
            [$kennung, $inserat['id'], $konto['id'], $inserat['konto_id'], $name, $mail, $telefon,
                $text, json_encode($eck, JSON_UNESCAPED_UNICODE), 0, 'neu', $jetzt]
        );
        Db::fuehre('UPDATE tt_inserat SET anfragen = anfragen + 1 WHERE id = ?', [$inserat['id']]);

        self::melden($inserat, $name, $eck, $basis);
        Zaehler::plus('anfrage');

        return Db::zeile('SELECT * FROM tt_anfrage WHERE kennung = ?', [$kennung]) ?? [];
    }

    /** Die Mail an die anbietende Seite. Ohne Adresse des Absenders,
        ohne Telefonnummer, ohne den vollen Text – wer antworten will,
        öffnet die Anwendung. Das ist kein Gängeln: Es ist der Grund,
        warum die Adresse nicht in einem fremden Postfach landet, das
        morgen jemand anderem gehört. */
    private static function melden(array $inserat, string $name, array $eck, string $basis): void
    {
        $an = Db::wert('SELECT mail FROM tt_konto WHERE id = ? AND mail_bestaetigt = 1', [$inserat['konto_id']]);
        if (!is_string($an) || $an === '') {
            return;
        }
        /* Nur die lesbaren Zeilen. Die rechenbare Fassung derselben
           Angaben gehört in das Postfach, nicht in eine Mail – sie sagt
           nichts, was hier nicht schon steht. */
        $zeilen = [];
        foreach ($eck as $k => $v) {
            if (!is_string($v)) {
                continue;
            }
            $zeilen[] = '  ' . self::eckLabel($k) . ': ' . $v;
        }
        $text = "Für dein Inserat ist eine Anfrage eingegangen.\n\n"
            . 'Inserat: ' . $inserat['titel'] . "\n"
            . 'Von: ' . ($name !== '' ? $name : 'jemandem ohne Namensangabe') . "\n"
            . ($zeilen ? "\n" . implode("\n", $zeilen) . "\n" : '')
            . "\nDie Nachricht selbst steht in deinem Postfach:\n"
            . $basis . "/#/nachrichten\n\n"
            . "Warum nicht hier? Weil in dieser Mail weder deine noch die Adresse der anfragenden\n"
            . "Seite stehen soll. Wer antwortet, gibt seine Adresse selbst frei – niemand sonst.\n";
        Post::senden($an, 'Neue Anfrage zu „' . mb_substr((string) $inserat['titel'], 0, 60, 'UTF-8') . '“', $text);
    }

    private static function eckLabel(string $k): string
    {
        return [
            'haushalt' => 'Haushalt',
            'einzug' => 'Einzug ab',
            'beschaeftigung' => 'Beschäftigung',
            'einkommen' => 'Einkommen',
            'haustiere' => 'Haustiere',
            'raucher' => 'Rauchen',
            'wbs' => 'Wohnberechtigungsschein',
            'buergschaft' => 'Bürgschaft',
            'einkommenArt' => 'Art des Einkommens',
            'kaution' => 'Kaution',
            'mietdauer' => 'Gewünschte Mietdauer',
            'flexibel' => 'Einzugstermin',
            'besichtigung' => 'Besichtigung möglich',
        ][$k] ?? $k;
    }

    /* ------------------------------------------------------------------
       Postfach
       ------------------------------------------------------------------ */

    public static function eingang(int $kontoId, int $ab = 0): array
    {
        /* Warmmiete, Zimmerzahl und Termin des eigenen Inserats gehen
           mit: Ohne sie könnte der Browser keine Vorauswahl rechnen, und
           mit ihnen bleibt die Rechnung dort, wo die Entscheidung fällt.
           Es sind die eigenen Inserate der anbietenden Seite – hier wird
           nichts offengelegt, was sie nicht selbst geschrieben hat. */
        return Db::zeilen(
            'SELECT a.*, i.kennung AS inserat_kennung, i.titel AS inserat_titel,
                    i.warm AS inserat_warm, i.zimmer AS inserat_zimmer, i.frei_ab AS inserat_frei
               FROM tt_anfrage a JOIN tt_inserat i ON i.id = a.inserat_id
              WHERE a.an_konto_id = ? ORDER BY a.angelegt DESC LIMIT 100 OFFSET ' . max(0, min(1000, $ab)),
            [$kontoId]
        );
    }

    public static function ausgang(int $kontoId): array
    {
        return Db::zeilen(
            'SELECT a.*, i.kennung AS inserat_kennung, i.titel AS inserat_titel
               FROM tt_anfrage a JOIN tt_inserat i ON i.id = a.inserat_id
              WHERE a.von_konto_id = ? ORDER BY a.angelegt DESC LIMIT 100',
            [$kontoId]
        );
    }

    public static function nachAussen(array $z, bool $fuerEmpfaenger): array
    {
        $eck = json_decode((string) $z['eckdaten'], true);
        $d = [
            'id' => $z['kennung'],
            'inserat' => $z['inserat_kennung'] ?? '',
            'titel' => $z['inserat_titel'] ?? '',
            'text' => $z['text'],
            'stand' => $z['stand'],
            'angelegt' => (int) $z['angelegt'],
            'gelesen' => (int) $z['gelesen'],
            'eckdaten' => is_array($eck) ? $eck : [],
        ];
        /* Name, Adresse und Telefon sieht nur, wer die Anfrage bekommen
           hat – und wer sie geschrieben hat, sieht die eigenen Angaben.
           Ein Dritter sieht die Anfrage nie. */
        if ($fuerEmpfaenger) {
            $d['name'] = $z['name'];
            $d['mail'] = $z['mail'];
            $d['telefon'] = $z['telefon'];
            if (isset($z['inserat_warm'])) {
                $d['inseratDaten'] = [
                    'warm' => (int) $z['inserat_warm'],
                    'zimmer' => (float) $z['inserat_zimmer'],
                    'freiAb' => (string) $z['inserat_frei'],
                ];
            }
        }
        return $d;
    }

    public static function standSetzen(int $kontoId, string $kennung, string $neu): array
    {
        if (!in_array($neu, ['neu', 'gelesen', 'beantwortet', 'abgelehnt'], true)) {
            Antwort::fehler('Unbekannter Zustand.', 422);
        }
        $z = Db::zeile('SELECT * FROM tt_anfrage WHERE kennung = ?', [$kennung]);
        if (!$z || (int) $z['an_konto_id'] !== $kontoId) {
            Antwort::fehler('Diese Anfrage gibt es nicht.', 404);
        }
        Db::fuehre('UPDATE tt_anfrage SET stand = ?, gelesen = ? WHERE id = ?',
            [$neu, $z['gelesen'] ? $z['gelesen'] : time(), $z['id']]);
        return Db::zeile('SELECT * FROM tt_anfrage WHERE id = ?', [$z['id']]) ?? [];
    }
}

/* =====================================================================
   Meldungen nach Art. 16 DSA

   Ein Portal, auf dem Fremde etwas veröffentlichen, ist ein
   Hostingdienst im Sinne des Digital Services Act. Daraus folgen drei
   Pflichten, die keine Auslegungsfrage sind:

     Art. 16 Abs. 1  – ein Meldeweg, elektronisch und leicht zugänglich,
                       und zwar ohne Konto.
     Art. 16 Abs. 4  – eine Empfangsbestätigung, unverzüglich.
     Art. 16 Abs. 5  – eine Entscheidung mit Begründung.
     Art. 17         – eine Begründung an den, dessen Inhalt entfernt
                       wurde, mit Hinweis auf den Rechtsbehelf.

   Deshalb ist das hier kein Formular, das in ein Postfach schreibt,
   sondern ein Vorgang mit Zuständen. Was nicht in der Tabelle steht,
   ist nicht passiert – und im Streitfall zählt genau das.
   ===================================================================== */

final class Meldung
{
    public const GRUENDE = [
        'betrug' => 'Betrugsverdacht (Vorkasse, kein Besichtigungstermin)',
        'doppelt' => 'Dasselbe Objekt mehrfach eingestellt',
        'weg' => 'Wohnung ist längst vergeben',
        'falsch' => 'Falsche Angaben (Preis, Fläche, Lage)',
        'diskriminierung' => 'Diskriminierende Formulierung (§ 19 AGG)',
        'rechte' => 'Fremde Bilder oder Texte',
        'sonst' => 'Etwas anderes',
    ];

    public static function anlegen(array $inserat, ?array $konto, array $roh, string $basis): array
    {
        $grund = is_string($roh['grund'] ?? null) && isset(self::GRUENDE[$roh['grund']])
            ? $roh['grund'] : 'sonst';
        $text = Inserat::text($roh['text'] ?? '', 2000);
        $mail = mail_normal(Inserat::text($roh['mail'] ?? '', 254));
        if ($mail !== '' && !mail_gueltig($mail)) {
            Antwort::fehler('Diese E-Mail-Adresse stimmt nicht.', 422, ['feld' => 'mail']);
        }
        if ($konto && $mail === '') {
            $mail = (string) ($konto['mail'] ?? '');
        }
        if (mb_strlen($text, 'UTF-8') < 10) {
            Antwort::fehler('Beschreib in einem Satz, was nicht stimmt – sonst lässt sich nichts prüfen.',
                422, ['feld' => 'text']);
        }

        $kennung = 'm' . strtolower(bin2hex(random_bytes(8)));
        Db::fuehre(
            'INSERT INTO tt_meldung (kennung, inserat_id, konto_id, mail, grund, text, stand, entscheidung, angelegt, erledigt)
             VALUES (?,?,?,?,?,?,?,?,?,0)',
            [$kennung, $inserat['id'], $konto['id'] ?? 0, $mail, $grund, $text, 'offen', '', time()]
        );

        /* Art. 16 Abs. 4: Empfangsbestätigung, unverzüglich. */
        if ($mail !== '') {
            Post::senden(
                $mail,
                'Deine Meldung ist angekommen',
                "Danke – deine Meldung zu einem Inserat ist eingegangen.\n\n"
                . 'Vorgang: ' . $kennung . "\n"
                . 'Inserat: ' . $inserat['titel'] . "\n"
                . 'Grund: ' . self::GRUENDE[$grund] . "\n\n"
                . "Wir sehen sie uns an und melden uns mit einer Entscheidung und ihrer Begründung.\n"
                . "Diese Bestätigung schicken wir nach Art. 16 Abs. 4 der Verordnung (EU) 2022/2065.\n\n"
                . $basis . "\n"
            );
        }
        Zaehler::plus('meldung');
        return Db::zeile('SELECT * FROM tt_meldung WHERE kennung = ?', [$kennung]) ?? [];
    }
}
