<?php
/* =====================================================================
   Meldungen bearbeiten

   Ein Meldeweg, an dessen Ende niemand entscheidet, ist kein Meldeweg.
   Er ist eine Sammelstelle für Beschwerden, die niemand liest – und
   rechtlich schlechter als gar keiner, weil er ein Versprechen abgibt.

   Der Digital Services Act macht daraus drei Pflichten mit klarem
   Inhalt:

     Art. 16 Abs. 4  Empfangsbestätigung – erledigt beim Eingang.
     Art. 16 Abs. 5  Entscheidung mitteilen, samt Rechtsbehelfen.
     Art. 17         Wird etwas eingeschränkt, bekommt die betroffene
                     Seite eine Begründung mit fünf Bestandteilen:
                     was genau geschieht, auf welche Tatsachen es sich
                     stützt, ob dabei automatisiert entschieden wurde,
                     auf welcher Grundlage – Gesetz oder Vertrag –, und
                     wie man sich dagegen wehren kann.

   Diese Datei sorgt dafür, dass alle fünf wirklich in der Mail stehen.
   Sie sind kein Formelkram: Wer ein Inserat gesperrt bekommt und nur
   liest „verstößt gegen unsere Richtlinien“, kann sich dagegen nicht
   wehren – und genau das ist der Grund, warum der Gesetzgeber die Liste
   aufgeschrieben hat.

   Bedient wird das Ganze über die Kommandozeile. Eine Weboberfläche
   dafür wäre eine zweite Anmeldung, eine zweite Rechteverwaltung und
   eine zweite Angriffsfläche – für einen Betrieb mit einer Person ist
   das der schlechtere Tausch.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mail.php';

final class Moderation
{
    public const MASSNAHMEN = [
        'sperren'  => 'Inserat gesperrt',
        'loeschen' => 'Inserat gelöscht',
        'frei'     => 'Keine Maßnahme',
    ];

    /* ------------------------------------------------------------------
       Ansehen
       ------------------------------------------------------------------ */

    public static function offene(int $wieviele = 50): array
    {
        return Db::zeilen(
            "SELECT m.*, i.kennung AS inserat_kennung, i.titel AS inserat_titel, i.stand AS inserat_stand,
                    i.konto_id AS inserat_konto
               FROM tt_meldung m LEFT JOIN tt_inserat i ON i.id = m.inserat_id
              WHERE m.stand = 'offen' ORDER BY m.angelegt LIMIT " . max(1, min(200, $wieviele))
        );
    }

    public static function nachKennung(string $kennung): ?array
    {
        return Db::zeile(
            "SELECT m.*, i.kennung AS inserat_kennung, i.titel AS inserat_titel, i.stand AS inserat_stand,
                    i.konto_id AS inserat_konto, i.daten AS inserat_daten
               FROM tt_meldung m LEFT JOIN tt_inserat i ON i.id = m.inserat_id
              WHERE m.kennung = ?",
            [$kennung]
        );
    }

    /** Die Liste für die Kommandozeile. */
    public static function liste(int $wieviele = 50): string
    {
        $offen = self::offene($wieviele);
        if (!$offen) {
            return "Keine offenen Meldungen.\n";
        }
        $raus = count($offen) . ' offene ' . (count($offen) === 1 ? 'Meldung' : 'Meldungen') . ":\n\n";
        foreach ($offen as $m) {
            $tage = (int) floor((time() - (int) $m['angelegt']) / 86400);
            $raus .= '  ' . $m['kennung'] . '  ' . str_pad((string) $m['grund'], 16)
                . ' seit ' . $tage . ' ' . ($tage === 1 ? 'Tag' : 'Tagen') . "\n"
                . '    Inserat: ' . ($m['inserat_titel'] ?? '(gelöscht)')
                . ' [' . ($m['inserat_stand'] ?? '–') . "]\n"
                . '    ' . mb_substr(str_replace("\n", ' ', (string) $m['text']), 0, 96, 'UTF-8') . "\n\n";
        }
        $raus .= "Ansehen:     php api/index.php meldung <kennung>\n"
            . "Entscheiden: php api/index.php meldung <kennung> <sperren|loeschen|frei> \"Begründung\"\n";
        return $raus;
    }

    /** Ein Vorgang im Einzelnen – alles, was für die Entscheidung zählt. */
    public static function einzeln(string $kennung): string
    {
        $m = self::nachKennung($kennung);
        if (!$m) {
            return "Diesen Vorgang gibt es nicht.\n";
        }
        $d = json_decode((string) ($m['inserat_daten'] ?? ''), true);
        $d = is_array($d) ? $d : [];

        $raus = "Vorgang " . $m['kennung'] . "  (" . $m['stand'] . ")\n"
            . str_repeat('=', 60) . "\n"
            . 'Eingegangen: ' . date('d.m.Y H:i', (int) $m['angelegt']) . "\n"
            . 'Grund:       ' . (Meldung::GRUENDE[$m['grund']] ?? $m['grund']) . "\n"
            . 'Melder:      ' . (($m['mail'] ?? '') !== '' ? $m['mail'] : 'ohne Adresse')
            . ((int) $m['konto_id'] ? ' (angemeldet)' : ' (ohne Konto)') . "\n\n"
            . "Was gemeldet wurde:\n" . self::einruecken((string) $m['text']) . "\n\n";

        if ($m['inserat_kennung']) {
            $raus .= "Das Inserat:\n"
                . '  ' . $m['inserat_titel'] . "\n"
                . '  Zustand: ' . $m['inserat_stand'] . "\n"
                . '  Adresse: ' . Post::basis() . '/#/objekt/' . $m['inserat_kennung'] . "\n";
            if (!empty($d['verdachtsgruende'])) {
                $raus .= '  Eigene Prüfung schlug an: ' . implode(', ', $d['verdachtsgruende']) . "\n";
            }
            $raus .= "\nBeschreibung im Inserat:\n"
                . self::einruecken((string) ($d['beschreibung'] ?? '')) . "\n\n";

            /* Wie oft ist dieses Inserat schon gemeldet worden, und wie
               viele Inserate hat dieses Konto? Zwei Zahlen, die eine
               Einzelmeldung in den Zusammenhang stellen. */
            $weitere = (int) Db::wert(
                "SELECT COUNT(*) FROM tt_meldung WHERE inserat_id = ? AND kennung <> ?",
                [$m['inserat_id'], $kennung]
            );
            $vomKonto = (int) Db::wert('SELECT COUNT(*) FROM tt_inserat WHERE konto_id = ?', [$m['inserat_konto']]);
            $meldungenKonto = (int) Db::wert(
                'SELECT COUNT(*) FROM tt_meldung m JOIN tt_inserat i ON i.id = m.inserat_id WHERE i.konto_id = ?',
                [$m['inserat_konto']]
            );
            $raus .= 'Weitere Meldungen zu diesem Inserat: ' . $weitere . "\n"
                . 'Inserate dieses Kontos: ' . $vomKonto
                . ' · Meldungen insgesamt gegen dieses Konto: ' . $meldungenKonto . "\n";
        } else {
            $raus .= "Das gemeldete Inserat gibt es nicht mehr.\n";
        }

        if ($m['stand'] !== 'offen') {
            $raus .= "\nEntscheidung vom " . date('d.m.Y H:i', (int) $m['erledigt']) . ":\n"
                . self::einruecken((string) $m['entscheidung']) . "\n";
        } else {
            $raus .= "\nEntscheiden:\n"
                . '  php api/index.php meldung ' . $kennung . " sperren \"Begründung\"\n"
                . '  php api/index.php meldung ' . $kennung . " loeschen \"Begründung\"\n"
                . '  php api/index.php meldung ' . $kennung . " frei \"Begründung\"\n";
        }
        return $raus;
    }

    private static function einruecken(string $t): string
    {
        $t = trim($t);
        if ($t === '') {
            return '  (nichts)';
        }
        return '  ' . str_replace("\n", "\n  ", wordwrap($t, 72, "\n", false));
    }

    /* ------------------------------------------------------------------
       Entscheiden
       ------------------------------------------------------------------ */

    /**
     * @return array{0:bool,1:string} geklappt und der Bericht dazu
     */
    public static function entscheiden(string $kennung, string $massnahme, string $begruendung): array
    {
        if (!isset(self::MASSNAHMEN[$massnahme])) {
            return [false, 'Unbekannte Maßnahme. Möglich: ' . implode(', ', array_keys(self::MASSNAHMEN)) . "\n"];
        }
        $begruendung = trim($begruendung);
        /* Ohne Begründung geht nichts. Art. 17 Abs. 1 DSA verlangt sie,
           und „verstößt gegen unsere Richtlinien“ ist keine: Wer sich
           gegen eine Entscheidung wehren soll, muss wissen, worauf sie
           sich stützt. */
        if (mb_strlen($begruendung, 'UTF-8') < 20) {
            return [false, "Die Begründung fehlt oder ist zu kurz.\n\n"
                . "Art. 17 Abs. 1 DSA verlangt eine Begründung, aus der die Tatsachen hervorgehen,\n"
                . "auf die sich die Entscheidung stützt. Ein Satz, den die betroffene Person lesen\n"
                . "und dem sie widersprechen kann.\n"];
        }

        $m = self::nachKennung($kennung);
        if (!$m) {
            return [false, "Diesen Vorgang gibt es nicht.\n"];
        }
        if ($m['stand'] !== 'offen') {
            return [false, 'Dieser Vorgang ist schon entschieden (' . $m['stand'] . ").\n"];
        }

        $jetzt = time();
        $bericht = '';
        $inseratWeg = false;

        if ($m['inserat_kennung'] && $massnahme !== 'frei') {
            if ($massnahme === 'sperren') {
                Db::fuehre("UPDATE tt_inserat SET stand = 'gesperrt', geaendert = ? WHERE id = ?",
                    [$jetzt, $m['inserat_id']]);
                $bericht .= "Inserat gesperrt.\n";
            } else {
                Inserat::hartLoeschen((int) $m['inserat_id']);
                $inseratWeg = true;
                $bericht .= "Inserat gelöscht.\n";
            }
        } elseif ($massnahme !== 'frei') {
            $bericht .= "Das Inserat gibt es nicht mehr – es war nichts mehr zu tun.\n";
        }

        /* Alle offenen Meldungen zu demselben Inserat werden mit
           entschieden. Ein Inserat wird einmal gesperrt, nicht dreimal –
           und wer es gemeldet hat, hat Anspruch auf die Antwort, egal
           ob er der Erste war. */
        $betroffene = Db::zeilen(
            "SELECT * FROM tt_meldung WHERE inserat_id = ? AND stand = 'offen'",
            [$m['inserat_id']]
        );
        foreach ($betroffene as $eine) {
            Db::fuehre('UPDATE tt_meldung SET stand = ?, entscheidung = ?, erledigt = ? WHERE id = ?',
                [$massnahme, $begruendung, $jetzt, $eine['id']]);
            if (($eine['mail'] ?? '') !== '') {
                self::melderBenachrichtigen($eine, $m, $massnahme, $begruendung);
                $bericht .= 'Melder benachrichtigt: ' . $eine['mail'] . "\n";
            } else {
                $bericht .= "Ein Melder hat keine Adresse hinterlassen – keine Mitteilung möglich.\n";
            }
        }

        if ($massnahme !== 'frei' && $m['inserat_konto']) {
            $ok = self::anbieterBegruenden($m, $massnahme, $begruendung, $inseratWeg);
            $bericht .= $ok
                ? "Begründung nach Art. 17 DSA an die anbietende Seite verschickt.\n"
                : "ACHTUNG: Die anbietende Seite hat keine bestätigte Adresse – die nach Art. 17 DSA\n"
                  . "erforderliche Begründung konnte nicht zugestellt werden. Bitte von Hand nachholen.\n";
        }

        return [true, $bericht];
    }

    /** Art. 16 Abs. 5 DSA: Entscheidung und Rechtsbehelfe an den Melder. */
    private static function melderBenachrichtigen(array $meldung, array $m, string $massnahme, string $grund): void
    {
        $basis = Post::basis();
        $was = $massnahme === 'frei'
            ? "Wir haben das Inserat geprüft und keine Maßnahme getroffen."
            : ($massnahme === 'sperren'
                ? "Wir haben das gemeldete Inserat gesperrt. Es ist nicht mehr abrufbar."
                : "Wir haben das gemeldete Inserat gelöscht.");

        Post::senden(
            (string) $meldung['mail'],
            'Entscheidung zu deiner Meldung ' . $meldung['kennung'],
            "Danke, dass du dir die Mühe gemacht hast.\n\n"
            . 'Vorgang: ' . $meldung['kennung'] . "\n"
            . 'Inserat: ' . ($m['inserat_titel'] ?? '(nicht mehr vorhanden)') . "\n\n"
            . $was . "\n\n"
            . "Begründung:\n" . self::einruecken($grund) . "\n\n"
            . "Die Entscheidung hat ein Mensch getroffen; automatisierte Verfahren wurden dabei\n"
            . "nicht eingesetzt.\n\n"
            . "Wenn du damit nicht einverstanden bist, kannst du formlos widersprechen – eine\n"
            . "Antwort auf diese Mail genügt. Unabhängig davon steht dir der Rechtsweg offen.\n"
            . "Diese Mitteilung ergeht nach Art. 16 Abs. 5 der Verordnung (EU) 2022/2065.\n\n"
            . ($basis !== '' ? $basis . "\n" : '')
        );
    }

    /** Art. 17 DSA: die Begründung an die betroffene anbietende Seite –
        mit allen fünf Bestandteilen, die der Artikel verlangt. */
    private static function anbieterBegruenden(array $m, string $massnahme, string $grund, bool $geloescht): bool
    {
        $an = Db::wert('SELECT mail FROM tt_konto WHERE id = ? AND mail_bestaetigt = 1', [$m['inserat_konto']]);
        if (!is_string($an) || $an === '') {
            return false;
        }
        $basis = Post::basis();
        $was = $geloescht
            ? 'Dein Inserat wurde entfernt.'
            : 'Dein Inserat wurde gesperrt. Es ist für andere nicht mehr abrufbar.';

        [$ok] = Post::senden(
            $an,
            'Zu deinem Inserat „' . mb_substr((string) $m['inserat_titel'], 0, 50, 'UTF-8') . '“',
            $was . "\n\n"
            . "1. Was genau geschehen ist\n"
            . self::einruecken($geloescht
                ? 'Das Inserat wurde vollständig entfernt, einschließlich der Bilder. Dein Konto '
                  . 'bleibt bestehen; du kannst weiterhin inserieren.'
                : 'Das Inserat ist gesperrt und erscheint weder in der Suche noch über einen '
                  . 'direkten Verweis. Dein Konto bleibt bestehen; du kannst weiterhin inserieren.')
            . "\n\n"
            . "2. Worauf sich die Entscheidung stützt\n"
            . self::einruecken('Es ist eine Meldung nach Art. 16 der Verordnung (EU) 2022/2065 '
                . 'eingegangen. Nach Prüfung: ' . $grund)
            . "\n\n"
            . "3. Ob automatisiert entschieden wurde\n"
            . self::einruecken('Nein. Die Entscheidung hat ein Mensch getroffen. Eine automatische '
                . 'Prüfung auf bekannte Betrugsmuster läuft zwar bei jedem Inserat mit, sie führt '
                . 'aber zu keiner Maßnahme, sondern nur zu einem Hinweis.')
            . "\n\n"
            . "4. Auf welcher Grundlage\n"
            . self::einruecken('§ 8 und § 10 der Nutzungsbedingungen von TrimmoTrade '
                . ($basis !== '' ? '(' . $basis . '/#/recht/agb)' : '') . ', gegebenenfalls in '
                . 'Verbindung mit den dort genannten gesetzlichen Vorschriften.')
            . "\n\n"
            . "5. Wie du dich dagegen wehren kannst\n"
            . self::einruecken('Widerspruch ist sechs Monate lang formlos möglich – eine Antwort auf '
                . 'diese Mail genügt. Wir entscheiden darüber unverzüglich, begründet und nicht '
                . 'ausschließlich automatisiert. Unabhängig davon steht dir der Rechtsweg offen; '
                . 'ebenso die außergerichtliche Streitbeilegung nach Art. 21 der Verordnung.')
            . "\n\n"
            . "Diese Begründung ergeht nach Art. 17 der Verordnung (EU) 2022/2065.\n\n"
            . ($basis !== '' ? $basis . "\n" : '')
        );
        return $ok;
    }

    /* Ein Widerspruch, dem stattgegeben wird. */
    public static function entsperren(string $inseratKennung, string $grund): array
    {
        $i = Inserat::nachKennung($inseratKennung);
        if (!$i) {
            return [false, "Dieses Inserat gibt es nicht.\n"];
        }
        if ($i['stand'] !== 'gesperrt') {
            return [false, 'Dieses Inserat ist nicht gesperrt (' . $i['stand'] . ").\n"];
        }
        $jetzt = time();
        Db::fuehre("UPDATE tt_inserat SET stand = 'aktiv', geaendert = ?, laeuft_ab = ? WHERE id = ?",
            [$jetzt, $jetzt + Inserat::LAUFZEIT_TAGE * 86400, $i['id']]);
        Db::fuehre("UPDATE tt_meldung SET stand = 'frei', entscheidung = ?, erledigt = ?
                     WHERE inserat_id = ? AND stand <> 'frei'",
            [trim($grund), $jetzt, $i['id']]);

        $an = Db::wert('SELECT mail FROM tt_konto WHERE id = ? AND mail_bestaetigt = 1', [$i['konto_id']]);
        if (is_string($an) && $an !== '') {
            Post::senden($an, 'Dein Inserat ist wieder online',
                "Wir haben die Sperre aufgehoben.\n\n"
                . $i['titel'] . "\n"
                . Post::basis() . '/#/objekt/' . $i['kennung'] . "\n\n"
                . "Begründung:\n" . self::einruecken(trim($grund)) . "\n\n"
                . "Das Inserat läuft ab heute wieder " . Inserat::LAUFZEIT_TAGE . " Tage.\n");
        }
        return [true, "Inserat wieder freigegeben.\n"];
    }
}
