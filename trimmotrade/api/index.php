<?php
/* =====================================================================
   TrimmoTrade – der einzige Einstiegspunkt der Serverseite

   Alles unter /api/ landet hier; die .htaccess sorgt dafür. Ein einziger
   Einstieg statt einer Datei je Weg hat einen handfesten Grund: Prüfungen,
   die für alle gelten – Herkunft, Schutzmerkmal, Sperren –, stehen dann
   an einer Stelle und lassen sich nicht versehentlich übergehen.

   Was dieser Server kann, ist bewusst knapp gehalten: sagen, wer jemand
   ist, und verwalten, was öffentlich angeboten wird – Inserate, Anfragen
   darauf, Suchaufträge, Meldungen. Was er nicht kann und nicht soll:
   Merklisten, Vergleiche, Profile, den Dokumententresor, irgendeine
   Berechnung. Die bleiben im Browser.

   Die Grenze verläuft nicht willkürlich: Ein Inserat ist eine
   Veröffentlichung und muss andere erreichen. Eine Merkliste ist eine
   Notiz und geht niemanden etwas an. Je weniger auf dem Server liegt,
   desto kleiner ist das Ziel – und ein kleines Ziel ist die beste
   Vorsorge.
   ===================================================================== */

declare(strict_types=1);

/* Fehler gehören ins Protokoll, nicht in die Antwort: Eine PHP-Warnung
   mitten im JSON macht die Antwort unlesbar und verrät nebenbei Pfade
   und Versionsnummern. */
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

require_once __DIR__ . '/lib/antwort.php';

/* --- Konfiguration --------------------------------------------------- */

$cfgDatei = __DIR__ . '/config.php';
if (!is_file($cfgDatei)) {
    Antwort::json([
        'ok' => false,
        'eingerichtet' => false,
        'fehler' => 'Auf dem Server fehlt api/config.php. Die Anwendung läuft ohne Anmeldung weiter.',
    ], 503);
}
$cfg = require $cfgDatei;
if (!is_array($cfg)) {
    Antwort::json(['ok' => false, 'eingerichtet' => false,
        'fehler' => 'api/config.php gibt keine Einstellungen zurück.'], 503);
}

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/konto.php';
require_once __DIR__ . '/lib/sitzung.php';
require_once __DIR__ . '/lib/vorgang.php';
require_once __DIR__ . '/lib/grenze.php';
require_once __DIR__ . '/lib/mail.php';
require_once __DIR__ . '/lib/webauthn.php';
require_once __DIR__ . '/lib/oauth.php';
require_once __DIR__ . '/lib/orte.php';
require_once __DIR__ . '/lib/zaehler.php';
require_once __DIR__ . '/lib/inserat.php';
require_once __DIR__ . '/lib/bild.php';
require_once __DIR__ . '/lib/anfrage.php';
require_once __DIR__ . '/lib/auftrag.php';
require_once __DIR__ . '/lib/gruppe.php';
require_once __DIR__ . '/lib/moderation.php';
require_once __DIR__ . '/lib/ablage.php';
require_once __DIR__ . '/lib/tresor.php';
require_once __DIR__ . '/lib/termin.php';
require_once __DIR__ . '/lib/tarif.php';
require_once __DIR__ . '/lib/selbsttest.php';

Db::start($cfg);
Sitzung::start($cfg);
Grenze::start($cfg);
Post::start($cfg);
Oauth::start($cfg);
Bild::start($cfg);
Tarif::start($cfg);

const ANKER_COOKIE = 'tt_anker';

$BASIS  = rtrim((string) ($cfg['basis'] ?? ''), '/');
$RP_ID  = (string) ($cfg['rp_id'] ?? parse_url($BASIS, PHP_URL_HOST) ?: 'localhost');

/* --- Aufräumen von der Kommandozeile ----------------------------------
   Für einen Cron-Auftrag bei netcup: `php api/index.php aufraeumen`.
   Nötig ist er nicht – die Anwendung räumt gelegentlich beim normalen
   Zugriff selbst auf. Er nimmt den Besuchern nur die paar Millisekunden
   ab und macht das Aufräumen vorhersagbar. */
if (PHP_SAPI === 'cli') {
    $befehl = $argv[1] ?? '';
    $bekannt = ['aufraeumen', 'melden', 'erinnern', 'zahlen', 'pruefen', 'meldungen', 'meldung', 'freigeben'];
    if (!in_array($befehl, $bekannt, true)) {
        fwrite(STDERR, "Aufruf: php api/index.php <befehl>\n\n"
            . "Für den Cron-Auftrag\n"
            . "  melden        Suchaufträge abarbeiten und neue Treffer verschicken (stündlich)\n"
            . "  erinnern      anbietende Seite fragen, ob ein Inserat noch steht (täglich)\n"
            . "  aufraeumen    abgelaufene Sitzungen, Vorgänge, Gruppen, Freigaben und Termine\n"
            . "                wegräumen (nachts)\n\n"
            . "Zum Nachsehen\n"
            . "  pruefen       prüft Einrichtung und Betrieb und sagt, was fehlt\n"
            . "  zahlen [tage] den Trichter der letzten 14 Tage ausgeben\n\n"
            . "Meldungen (Art. 16 und 17 der Verordnung (EU) 2022/2065)\n"
            . "  meldungen                              offene Meldungen auflisten\n"
            . "  meldung <kennung>                      einen Vorgang ansehen\n"
            . "  meldung <kennung> sperren \"Grund\"      Inserat sperren, beide Seiten begründet benachrichtigen\n"
            . "  meldung <kennung> loeschen \"Grund\"     Inserat entfernen\n"
            . "  meldung <kennung> frei \"Grund\"         keine Maßnahme, Melder benachrichtigen\n"
            . "  freigeben <inserat> \"Grund\"           eine Sperre nach Widerspruch aufheben\n");
        exit(1);
    }
    try {
        Db::pdo();
        if ($befehl === 'aufraeumen') {
            $r = alleAufraeumen(true);
            Selbsttest::laufMerken('aufraeumen');
            echo "Aufgeräumt: " . $r['freigaben'] . " abgelaufene Freigaben, "
                . $r['termine'] . " vergangene Termine.\n";
        } elseif ($befehl === 'melden') {
            $n = Auftrag::lauf($BASIS, true);
            Selbsttest::laufMerken('melden');
            echo $n === 1 ? "1 Mail verschickt.\n" : $n . " Mails verschickt.\n";
        } elseif ($befehl === 'erinnern') {
            $n = Auftrag::erinnern($BASIS, true);
            Selbsttest::laufMerken('erinnern');
            echo $n === 1 ? "1 Erinnerung verschickt.\n" : $n . " Erinnerungen verschickt.\n";
        } elseif ($befehl === 'zahlen') {
            echo Zaehler::bericht((int) ($argv[2] ?? 14));
        } elseif ($befehl === 'pruefen') {
            echo (new Selbsttest($cfg, dirname(__DIR__)))->lauf();
        } elseif ($befehl === 'meldungen') {
            echo Moderation::liste();
        } elseif ($befehl === 'freigeben') {
            [$ok, $text] = Moderation::entsperren((string) ($argv[2] ?? ''), (string) ($argv[3] ?? ''));
            echo $text;
            exit($ok ? 0 : 1);
        } else {
            $kennung = (string) ($argv[2] ?? '');
            if ($kennung === '') {
                fwrite(STDERR, "Welcher Vorgang? php api/index.php meldungen zeigt die offenen.\n");
                exit(1);
            }
            if (!isset($argv[3])) {
                echo Moderation::einzeln($kennung);
                exit(0);
            }
            [$ok, $text] = Moderation::entscheiden($kennung, (string) $argv[3], (string) ($argv[4] ?? ''));
            echo $text;
            exit($ok ? 0 : 1);
        }
        exit(0);
    } catch (Throwable $e) {
        fwrite(STDERR, 'Fehlgeschlagen: ' . $e->getMessage() . "\n");
        exit(1);
    }
}

/* --- Weg und Verfahren ------------------------------------------------ */

$pfad = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$pfad = preg_replace('#^.*?/api/#', '', '/' . ltrim($pfad, '/'));
$pfad = trim((string) $pfad, '/');
$art  = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

/* Zwei Wege tragen ihre Kennung im Pfad statt im Rumpf, weil sie
   verweisbar sein müssen: ein Inserat, das jemand teilt, und ein Bild,
   das im <img> steht. Alles Übrige nimmt die Kennung als JSON entgegen.

   Erkannt wird an der Form der Kennung, nicht am Anfang des Wegs: Sonst
   würde aus `bild/neu` ein Bild mit der Kennung „neu“ statt des Wegs,
   der ein Bild anlegt. */
$stueck = '';
if (preg_match('#^objekt/(tt[0-9a-f]{16})$#', $pfad, $m)) {
    $stueck = $m[1];
    $pfad = 'objekt';
} elseif (preg_match('#^bild/(b[0-9a-f]{18}(?:-k)?)$#', $pfad, $m)) {
    $stueck = $m[1];
    $pfad = 'bild';
}

/* Bilder sind um Größenordnungen größer als alles andere, was hier
   hereinkommt. Die Grenze steigt deshalb nur für diesen einen Weg. */
if ($pfad === 'bild/neu') {
    $GLOBALS['ROH_HOECHSTENS'] = 12000000;
}

/* Der Rumpf kommt als JSON. Formulare gibt es hier nicht – und weil es
   sie nicht gibt, kann auch keine fremde Seite eines abschicken. */
/* Aufräumen an einer Stelle.

   Sitzungen, Vorgänge und abgelaufene Gruppen kennt die Datenbank selbst;
   abgelaufene Freigaben und vergangene Besichtigungstermine kennen ihre
   eigenen Klassen. Der Würfel liegt deshalb hier und nicht in `Db`: Läge
   er dort, entschiede jeder Aufruf für sich, und es käme der Zustand
   vor, dass die Sitzungen weggeräumt sind und die Termine seit Monaten
   nicht. */
function alleAufraeumen(bool $erzwingen = false): array
{
    if (!$erzwingen && random_int(1, 50) !== 1) {
        return [];
    }
    Db::aufraeumen(true);
    $raus = ['freigaben' => 0, 'termine' => 0];
    try {
        $raus['freigaben'] = Tresor::aufraeumen();
        $raus['termine'] = Termin::aufraeumen();
    } catch (PDOException $e) {
        /* Ein misslungenes Aufräumen darf keine Anfrage abbrechen – der
           Besucher kann nichts dafür und der nächste Lauf versucht es
           erneut. */
        error_log('TrimmoTrade: Aufräumen fehlgeschlagen – ' . $e->getMessage());
    }
    return $raus;
}

function rumpf(): array
{
    static $d = null;
    if ($d !== null) {
        return $d;
    }
    $roh = file_get_contents('php://input') ?: '';
    $hoechstens = (int) ($GLOBALS['ROH_HOECHSTENS'] ?? 100000);
    if (strlen($roh) > $hoechstens) {
        Antwort::fehler('Die Anfrage ist zu groß.', 413);
    }
    /* Leerer Rumpf trotz angekündigter Länge: Dann hat PHP ihn selbst
       abgeschnitten, weil post_max_size kleiner ist als das, was
       ankam. Ohne diesen Hinweis sucht man den Fehler stundenlang im
       eigenen Code. */
    if ($roh === '' && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
        Antwort::fehler('Der Server hat die Anfrage abgeschnitten. '
            . 'In der Datei .user.ini muss post_max_size größer sein als das, was hochgeladen wird.', 413);
    }
    $j = json_decode($roh, true);
    $d = is_array($j) ? $j : [];
    return $d;
}

function feld(string $name, string $vorgabe = ''): string
{
    $w = rumpf()[$name] ?? $vorgabe;
    return is_string($w) ? $w : $vorgabe;
}

/* --- Was für alle gilt ------------------------------------------------ */

try {
    Db::pdo();
} catch (Throwable $e) {
    Antwort::panne('Datenbank nicht erreichbar – ' . $e->getMessage(), $cfg);
}

/* Änderungen brauchen den Nachweis, dass die Anfrage von dieser Seite
   kommt. Lesende Wege nicht: Sie ändern nichts, und `status` muss auch
   beim allerersten Aufruf funktionieren, bevor es ein Schutzmerkmal gibt. */
/* Änderungen brauchen den Nachweis, dass die Anfrage von dieser Seite
   kommt – mit genau einer Ausnahme.

   Apple gibt Name und E-Mail-Adresse nur heraus, wenn die Rückkehr als
   Formular kommt (`response_mode=form_post`). Das ist ein POST von
   appleid.apple.com auf diesen Server, also seitenübergreifend: Es
   trägt weder unser Schutzmerkmal noch eine Herkunft von hier. Beide
   Prüfungen würden es abweisen, und die Anmeldung mit Apple wäre
   unmöglich.

   Diese Ausnahme ist keine Lücke, weil der Weg seine eigenen Schlösser
   hat, und zwar strengere: ein `state`, der serverseitig zu einem
   Vorgang gehört und beim ersten Gebrauch gelöscht wird, ein Anker im
   Cookie, der die Rückkehr an denselben Browser bindet, ein `nonce` im
   Token und PKCE. Wer den Rückweg fälschen will, müsste alle vier
   haben. Und anders als bei den übrigen Wegen ändert dieser Aufruf für
   sich genommen nichts – er meldet an, mehr nicht. */
if ($art === 'POST' && $pfad !== 'oauth/zurueck') {
    Sitzung::herkunftPruefen($BASIS !== '' ? $BASIS : 'https://' . ($_SERVER['HTTP_HOST'] ?? ''));
    Sitzung::schutzPruefen();
}

alleAufraeumen();

/* =====================================================================
   Die einzelnen Wege
   ===================================================================== */

try {
    switch ($pfad) {

        /* --------------------------------------------------------------
           Was dieser Server anbietet

           Der erste Aufruf der Anwendung. Die Antwort entscheidet, welche
           Knöpfe die Anmeldeseite zeigt – ein Verfahren ohne Zugangsdaten
           erscheint gar nicht erst, statt in eine Fehlermeldung zu führen.
           -------------------------------------------------------------- */
        case 'status':
            $k = Sitzung::konto();
            $echte = Inserat::anzahl();
            Antwort::gut([
                'eingerichtet' => true,
                'verfahren' => array_values(array_filter([
                    'passkey',
                    Post::moeglich() ? 'mail' : null,
                    ...Oauth::verfuegbar(),
                ])),
                'schutz'   => Sitzung::schutzMerkmal(),
                'rpId'     => $RP_ID,
                'konto'    => $k ? Konto::nachAussen($k) : null,
                /* Wie viele echte Inserate es gibt, und ob daneben der
                   Beispielmarkt gezeigt werden darf. Beides entscheidet
                   im Browser darüber, ob oben ein Hinweis steht. Ein
                   Portal, das erfundene Wohnungen zeigt, ohne es zu
                   sagen, wäre nach § 5 UWG irreführend – und wäre nach
                   der ersten Anfrage an eine erfundene Adresse ohnehin
                   erledigt. */
                /* Wer diese Seite betreibt. Das sind ausschließlich
                   Angaben, die ohnehin öffentlich sein müssen – ein
                   Impressum ist zur Veröffentlichung bestimmt. Ohne
                   diesen Weg stünde es nur im Browser des Betreibers,
                   und jeder Besucher sähe eine Lücke. */
                'betreiber' => betreiberAngaben($cfg),
                'markt' => [
                    'inserate' => $echte,
                    'gruppen' => (int) Db::wert(
                        "SELECT COUNT(*) FROM tt_gruppe WHERE stand = 'offen' AND offen = 1 AND laeuft_ab > ?",
                        [time()]
                    ),
                    'beispiele' => (bool) ($cfg['beispielmarkt'] ?? false),
                    'bilder' => Bild::moeglich(),
                ],
            ]);
            // no break – Antwort beendet

        /* --------------------------------------------------------------
           Anmeldung mit E-Mail-Code
           -------------------------------------------------------------- */

        case 'mail/code':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            if (!Post::moeglich()) {
                Antwort::fehler('Auf diesem Server ist kein Mailversand eingerichtet.', 503);
            }
            $mail = mail_normal(feld('mail'));
            if (!mail_gueltig($mail)) {
                Antwort::fehler('Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.', 400, ['feld' => 'mail']);
            }
            Grenze::sperreOderWeiter('code_anfordern', $mail);

            $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            Vorgang::vorherigeRaeumen('mailcode', $mail);
            $kennung = Vorgang::anlegen('mailcode', $mail, $code, [
                'name' => mb_substr(trim(feld('name')), 0, 120),
            ], (int) ($cfg['code_gueltig_min'] ?? 10) * 60);

            [$ok, $grund] = Post::senden(
                $mail,
                'Dein Anmeldecode: ' . $code,
                mailText($code, (int) ($cfg['code_gueltig_min'] ?? 10), $BASIS)
            );
            if (!$ok) {
                Vorgang::loeschen($kennung);
                Antwort::panne('Mailversand fehlgeschlagen – ' . $grund, $cfg);
            }

            /* Ob es zu dieser Adresse schon ein Konto gibt, steht hier
               bewusst nicht. Aus dem Unterschied ließe sich ein
               Verzeichnis der Nutzer bauen. */
            Antwort::gut([
                'vorgang'  => $kennung,
                'gueltig'  => (int) ($cfg['code_gueltig_min'] ?? 10),
                'versuche' => (int) ($cfg['code_versuche'] ?? 5),
            ]);

        case 'mail/pruefen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $kennung = feld('vorgang');
            $eingabe = preg_replace('/\D/', '', feld('code'));
            $v = Vorgang::holen($kennung, 'mailcode');
            if (!$v) {
                Antwort::fehler('Der Code ist abgelaufen. Fordere einen neuen an.', 400, ['neu' => true]);
            }
            Grenze::sperreOderWeiter('code_pruefen', (string) $v['bezug']);

            $hoechstens = (int) ($cfg['code_versuche'] ?? 5);
            if (!gleich_sicher(merkmal_hash((string) $eingabe), (string) $v['geheim_hash'])) {
                $weiter = Vorgang::fehlversuch($kennung, $hoechstens);
                $uebrig = $hoechstens - ((int) $v['versuche'] + 1);
                Antwort::fehler(
                    $weiter
                        ? 'Der Code stimmt nicht. Noch ' . max(1, $uebrig) . ($uebrig === 1 ? ' Versuch.' : ' Versuche.')
                        : 'Zu viele Fehlversuche. Fordere einen neuen Code an.',
                    400,
                    ['feld' => 'code', 'neu' => !$weiter]
                );
            }

            Vorgang::loeschen($kennung);
            Grenze::freigeben('code_pruefen', (string) $v['bezug']);
            Grenze::freigeben('code_anfordern', (string) $v['bezug']);

            $konto = Konto::findenOderAnlegen(
                (string) $v['bezug'],
                true,
                'mail',
                (string) ($v['daten']['name'] ?? '')
            );
            Konto::stufeNeu((int) $konto['id']);
            Sitzung::anlegen((int) $konto['id']);
            Antwort::gut(['konto' => Konto::nachAussen(Konto::nachId((int) $konto['id']))]);

        /* --------------------------------------------------------------
           Die Adresse nachtragen

           Für Konten, die ohne eine entstanden sind. Das gibt es seit
           Instagram: Von dort kommt eine Kennung und ein Benutzername,
           aber keine E-Mail-Adresse – es gibt dafür keinen Bereich, den
           man anfordern könnte. Dasselbe trifft ein Konto, das mit einem
           Passkey allein angelegt wurde.

           Ohne Adresse ist so ein Konto ein Briefkasten ohne Schlitz:
           keine Anfrage auf ein Inserat, keine Absage eines Termins,
           kein Treffer aus einem Suchauftrag. Deshalb steht es auf
           Stufe 0, und deshalb gibt es diesen Weg.

           Den Code verschickt `mail/code` wie sonst auch. Hier wird nur
           geprüft – und das Ergebnis hängt an das angemeldete Konto,
           statt ein zweites zu suchen oder anzulegen.
           -------------------------------------------------------------- */

        case 'konto/mail-nachtragen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            if (!empty($k['mail']) && !empty($k['mail_bestaetigt'])) {
                Antwort::fehler('Für dieses Konto ist schon eine Adresse bestätigt.', 400);
            }
            $kennung = feld('vorgang');
            $eingabe = preg_replace('/\D/', '', feld('code'));
            $v = Vorgang::holen($kennung, 'mailcode');
            if (!$v) {
                Antwort::fehler('Der Code ist abgelaufen. Fordere einen neuen an.', 400, ['neu' => true]);
            }
            Grenze::sperreOderWeiter('code_pruefen', (string) $v['bezug']);

            $hoechstens = (int) ($cfg['code_versuche'] ?? 5);
            if (!gleich_sicher(merkmal_hash((string) $eingabe), (string) $v['geheim_hash'])) {
                $weiter = Vorgang::fehlversuch($kennung, $hoechstens);
                $uebrig = $hoechstens - ((int) $v['versuche'] + 1);
                Antwort::fehler(
                    $weiter
                        ? 'Der Code stimmt nicht. Noch ' . max(1, $uebrig) . ($uebrig === 1 ? ' Versuch.' : ' Versuche.')
                        : 'Zu viele Fehlversuche. Fordere einen neuen Code an.',
                    400,
                    ['feld' => 'code', 'neu' => !$weiter]
                );
            }

            $neueMail = (string) $v['bezug'];

            /* Gehört die Adresse schon einem anderen Konto, wird hier
               nichts zusammengelegt. Zwei Konten zu verschmelzen heißt,
               über fremde Inserate, Anfragen und Unterlagen zu
               entscheiden – das ist keine Sache, die eine Anmeldung
               nebenbei erledigt. Stattdessen der Hinweis, sich dort
               anzumelden und diesen Weg dann im Konto hinzuzufügen. */
            $fremd = Konto::nachMail($neueMail);
            if ($fremd && (int) $fremd['id'] !== (int) $k['id']) {
                Vorgang::loeschen($kennung);
                Antwort::fehler(
                    'Zu dieser Adresse gibt es schon ein Konto. Melde dich mit ihr an – '
                    . 'in den Kontoeinstellungen lässt sich dieser Anmeldeweg dann hinzufügen.',
                    409,
                    ['feld' => 'mail']
                );
            }

            Vorgang::loeschen($kennung);
            Grenze::freigeben('code_pruefen', $neueMail);
            Grenze::freigeben('code_anfordern', $neueMail);

            Konto::aendern((int) $k['id'], ['mail' => $neueMail, 'mail_bestaetigt' => 1]);
            Konto::stufeNeu((int) $k['id']);
            Antwort::gut(['konto' => Konto::nachAussen(Konto::nachId((int) $k['id']))]);

        /* --------------------------------------------------------------
           Passkey anlegen

           Zwei Lagen: angemeldet (ein weiteres Gerät hinzufügen) und
           nicht angemeldet (neues Konto, ganz ohne Adresse).
           -------------------------------------------------------------- */

        case 'passkey/neu/start':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::konto();
            Grenze::sperreOderWeiter('passkey', $k ? (string) $k['kennung'] : '');

            $aufforderung = zufall_text(32);
            $nutzerKennung = $k ? (string) $k['kennung'] : ('k-' . zufall_text(9));
            $anzeige = $k
                ? (($k['name'] ?? '') !== '' ? (string) $k['name'] : (string) ($k['mail'] ?? 'TrimmoTrade-Konto'))
                : (mb_substr(trim(feld('name')), 0, 120) ?: 'TrimmoTrade-Konto');
            $nutzerName = $k
                ? (($k['mail'] ?? '') !== '' ? (string) $k['mail'] : (string) $k['kennung'])
                : (mail_gueltig(feld('mail')) ? mail_normal(feld('mail')) : $nutzerKennung);

            $schonDa = [];
            if ($k) {
                foreach (Db::zeilen('SELECT cred_id FROM tt_passkey WHERE konto_id = ?', [(int) $k['id']]) as $p) {
                    $schonDa[] = (string) $p['cred_id'];
                }
            }

            $vorgang = Vorgang::anlegen('wa-neu', $nutzerKennung, $aufforderung, [
                'aufforderung' => $aufforderung,
                'konto_id' => $k ? (int) $k['id'] : 0,
                'nutzer'   => $nutzerKennung,
                'name'     => $anzeige,
                'mail'     => $k ? '' : (mail_gueltig(feld('mail')) ? mail_normal(feld('mail')) : ''),
            ], 300);

            Antwort::gut([
                'vorgang' => $vorgang,
                'optionen' => Webauthn::neuOptionen(
                    $RP_ID,
                    (string) ($cfg['rp_name'] ?? 'TrimmoTrade'),
                    b64u_kodieren($nutzerKennung),
                    $nutzerName,
                    $anzeige,
                    $aufforderung,
                    $schonDa
                ),
            ]);

        case 'passkey/neu/fertig':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $v = Vorgang::holen(feld('vorgang'), 'wa-neu');
            if (!$v) {
                Antwort::fehler('Der Vorgang ist abgelaufen. Versuch es noch einmal.', 400);
            }
            Vorgang::loeschen($v['kennung']);

            $antwort = rumpf()['antwort'] ?? [];
            if (!is_array($antwort)) {
                Antwort::fehler('Die Antwort des Geräts fehlt.', 400);
            }

            try {
                $erg = Webauthn::neuPruefen($antwort, holeAufforderung($v), $BASIS, $RP_ID);
            } catch (WebauthnFehler $e) {
                Antwort::fehler($e->getMessage(), 400);
            }

            $kontoId = (int) ($v['daten']['konto_id'] ?? 0);
            if ($kontoId === 0) {
                $sitzungsKonto = Sitzung::konto();
                if ($sitzungsKonto) {
                    $kontoId = (int) $sitzungsKonto['id'];
                } else {
                    $mailNeu = (string) ($v['daten']['mail'] ?? '');
                    $neu = Konto::findenOderAnlegen(
                        $mailNeu !== '' ? $mailNeu : null,
                        false,
                        'passkey',
                        (string) ($v['daten']['name'] ?? '')
                    );
                    $kontoId = (int) $neu['id'];
                    /* Die Kennung des Kontos muss die sein, die im
                       Schlüsselbund des Geräts steht – sonst findet die
                       Anmeldung ohne Eingabe das Konto nicht wieder. */
                    Db::fuehre('UPDATE tt_konto SET kennung = ? WHERE id = ?',
                        [(string) ($v['daten']['nutzer'] ?? $neu['kennung']), $kontoId]);
                }
            }

            if (Db::wert('SELECT id FROM tt_passkey WHERE cred_hash = ?', [merkmal_hash($erg['cred_id'])])) {
                Antwort::fehler('Dieser Passkey ist schon hinterlegt.', 409);
            }

            Db::fuehre(
                'INSERT INTO tt_passkey (konto_id, cred_id, cred_hash, oeff_schluessel, zaehler, geraet, angelegt, gesehen)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    $kontoId, $erg['cred_id'], merkmal_hash($erg['cred_id']), $erg['pem'],
                    $erg['zaehler'], geraeteName(), time(), time(),
                ]
            );
            Konto::stufeNeu($kontoId);

            if (!Sitzung::konto()) {
                Sitzung::anlegen($kontoId);
            }
            Antwort::gut(['konto' => Konto::nachAussen(Konto::nachId($kontoId))]);

        /* --------------------------------------------------------------
           Anmeldung mit Passkey
           -------------------------------------------------------------- */

        case 'passkey/anmelden/start':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            Grenze::sperreOderWeiter('passkey', '');
            $aufforderung = zufall_text(32);
            $vorgang = Vorgang::anlegen('wa-anmelden', '', $aufforderung, ['aufforderung' => $aufforderung], 300);
            Antwort::gut([
                'vorgang'  => $vorgang,
                /* Ohne `allowCredentials` sucht der Browser selbst den
                   passenden Schlüssel heraus. Genau deshalb braucht die
                   Anmeldung keine Eingabe – und deshalb steht hier auch
                   keine Adresse, die verraten würde, wer ein Konto hat. */
                'optionen' => Webauthn::anmeldeOptionen($RP_ID, $aufforderung),
            ]);

        case 'passkey/anmelden/fertig':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $v = Vorgang::holen(feld('vorgang'), 'wa-anmelden');
            if (!$v) {
                Antwort::fehler('Der Vorgang ist abgelaufen. Versuch es noch einmal.', 400);
            }
            Vorgang::loeschen($v['kennung']);

            $antwort = rumpf()['antwort'] ?? [];
            $credId = feld('id');
            if (!is_array($antwort) || $credId === '') {
                Antwort::fehler('Die Antwort des Geräts fehlt.', 400);
            }

            $p = Db::zeile('SELECT * FROM tt_passkey WHERE cred_hash = ?', [merkmal_hash($credId)]);
            if (!$p) {
                Antwort::fehler('Dieser Passkey ist hier nicht hinterlegt.', 400);
            }
            Grenze::sperreOderWeiter('passkey', (string) $p['konto_id']);

            try {
                $erg = Webauthn::anmeldungPruefen(
                    $antwort,
                    (string) $p['oeff_schluessel'],
                    (int) $p['zaehler'],
                    holeAufforderung($v),
                    $BASIS,
                    $RP_ID
                );
            } catch (WebauthnFehler $e) {
                Antwort::fehler($e->getMessage(), 400);
            }

            $konto = Konto::nachId((int) $p['konto_id']);
            if (!$konto) {
                Antwort::fehler('Zu diesem Passkey gibt es kein Konto mehr.', 400);
            }
            if (!empty($konto['gesperrt'])) {
                Antwort::fehler('Dieses Konto ist gesperrt.', 403);
            }

            Db::fuehre('UPDATE tt_passkey SET zaehler = ?, gesehen = ? WHERE id = ?',
                [$erg['zaehler'], time(), $p['id']]);
            Grenze::freigeben('passkey', (string) $p['konto_id']);
            Konto::stufeNeu((int) $konto['id']);
            Sitzung::anlegen((int) $konto['id']);
            Antwort::gut(['konto' => Konto::nachAussen(Konto::nachId((int) $konto['id']))]);

        case 'passkey/loeschen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            $id = feld('id');
            $p = Db::zeile('SELECT * FROM tt_passkey WHERE cred_hash = ? AND konto_id = ?',
                [merkmal_hash($id), (int) $k['id']]);
            if (!$p) {
                Antwort::fehler('Diesen Passkey gibt es nicht.', 404);
            }
            /* Den letzten Weg ins eigene Konto darf niemand versehentlich
               zumauern. Wer keine bestätigte Adresse hat und den einzigen
               Passkey löscht, kommt nie wieder hinein. */
            $anzahl = (int) Db::wert('SELECT COUNT(*) FROM tt_passkey WHERE konto_id = ?', [(int) $k['id']]);
            $andereWege = !empty($k['mail']) && !empty($k['mail_bestaetigt']);
            if ($anzahl <= 1 && !$andereWege) {
                Antwort::fehler('Das ist dein einziger Zugang. Hinterlege erst eine bestätigte '
                    . 'E-Mail-Adresse, sonst kommst du nicht mehr in dein Konto.', 409);
            }
            Db::fuehre('DELETE FROM tt_passkey WHERE id = ?', [$p['id']]);
            Konto::stufeNeu((int) $k['id']);
            Antwort::gut(['konto' => Konto::nachAussen(Konto::nachId((int) $k['id']))]);

        /* --------------------------------------------------------------
           Google und Microsoft

           Diese beiden Wege antworten nicht mit JSON, sondern leiten den
           Browser weiter – das ist bei OAuth so vorgesehen und lässt sich
           nicht mit einem Hintergrundaufruf nachbilden.
           -------------------------------------------------------------- */

        case 'oauth/los':
            $anbieter = (string) ($_GET['anbieter'] ?? '');
            if (!in_array($anbieter, Oauth::verfuegbar(), true)) {
                weiterZurSeite($BASIS, 'nicht-eingerichtet');
            }
            Grenze::sperreOderWeiter('oauth', $anbieter);
            /* Der Anker bindet den Vorgang an genau diesen Browser. Ohne
               ihn könnte jemand seine eigene Anmeldung beginnen, die
               Rückkehr abfangen und sie einem Fremden unterschieben – der
               säße dann unbemerkt im Konto des Angreifers und tippte dort
               seine Daten ein. Der Anker steht nur als Hash beim Vorgang. */
            $anker = zufall_text(16);
            /* SameSite: Lax genügt überall dort, wo die Rückkehr eine
               Umleitung ist – bei einer solchen schickt der Browser das
               Cookie mit. Apple kommt als Formular zurück, und bei einem
               seitenübergreifenden POST hält Lax das Cookie zurück. Dann
               fehlte der Anker, die Prüfung schlüge fehl, und die
               Anmeldung mit Apple ginge nie. Deshalb dort None, was
               zwingend Secure verlangt – auf einer Seite ohne TLS gibt
               es diesen Weg also nicht. */
            $ueberKreuz = $anbieter === 'apple';
            $sicher = str_starts_with($BASIS, 'https://');
            setcookie(ANKER_COOKIE, $anker, [
                'expires' => time() + 900, 'path' => '/api/',
                'secure' => $sicher || $ueberKreuz,
                'httponly' => true,
                'samesite' => $ueberKreuz ? 'None' : 'Lax',
            ]);
            try {
                $ziel = Oauth::losUrl(
                    $anbieter,
                    $BASIS . '/api/oauth/zurueck',
                    (string) ($_GET['weiter'] ?? ''),
                    merkmal_hash($anker)
                );
            } catch (OauthFehler $e) {
                weiterZurSeite($BASIS, 'nicht-eingerichtet');
            }
            header('Location: ' . $ziel, true, 302);
            exit;

        case 'oauth/zurueck':
            /* Google, Microsoft und Instagram kommen als Umleitung
               zurück, Apple als Formular. Beides landet hier; woher die
               Felder kommen, entscheidet das Verfahren. */
            $rueck = $art === 'POST' ? $_POST : $_GET;
            $fehlerCode = (string) ($rueck['error'] ?? '');
            if ($fehlerCode !== '') {
                /* `access_denied` heißt: Der Nutzer hat abgelehnt. Das ist
                   kein Fehler, sondern eine Entscheidung – und wird auch
                   so gemeldet. */
                weiterZurSeite($BASIS, $fehlerCode === 'access_denied' ? 'abgebrochen' : 'anbieter-fehler');
            }
            try {
                $d = Oauth::zurueck(
                    (string) ($rueck['state'] ?? ''),
                    (string) ($rueck['code'] ?? ''),
                    $BASIS . '/api/oauth/zurueck',
                    merkmal_hash((string) ($_COOKIE[ANKER_COOKIE] ?? '')),
                    /* Nur Apple, nur beim allerersten Mal: der Name als
                       JSON neben dem Code. */
                    mb_substr((string) ($rueck['user'] ?? ''), 0, 2000)
                );
            } catch (OauthFehler | NetzFehler | JwtFehler $e) {
                error_log('TrimmoTrade OAuth: ' . $e->getMessage());
                weiterZurSeite($BASIS, 'anbieter-fehler');
            }

            $konto = Konto::nachFremd($d['anbieter'], $d['sub']);
            if (!$konto) {
                $konto = Konto::findenOderAnlegen(
                    $d['mail'] !== '' ? $d['mail'] : null,
                    $d['mail_bestaetigt'],
                    $d['anbieter'],
                    $d['name']
                );
            }
            Konto::fremdVerknuepfen((int) $konto['id'], $d['anbieter'], $d['sub'], $d['mail']);
            Konto::aendern((int) $konto['id'], ['gesehen' => time()]);
            Konto::stufeNeu((int) $konto['id']);
            Sitzung::anlegen((int) $konto['id']);
            Grenze::freigeben('oauth', $d['anbieter']);
            setcookie(ANKER_COOKIE, '', ['expires' => time() - 3600, 'path' => '/api/']);

            weiterZurSeite($BASIS, '', $d['weiter']);

        /* --------------------------------------------------------------
           Konto
           -------------------------------------------------------------- */

        case 'konto':
            if ($art === 'GET') {
                $k = Sitzung::konto();
                Antwort::gut(['konto' => $k ? Konto::nachAussen($k) : null]);
            }
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            $name = mb_substr(trim(feld('name')), 0, 120);
            $felder = ['name' => $name];

            $mailNeu = mail_normal(feld('mail'));
            if ($mailNeu !== '' && $mailNeu !== ($k['mail'] ?? '')) {
                if (!mail_gueltig($mailNeu)) {
                    Antwort::fehler('Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.', 400, ['feld' => 'mail']);
                }
                if (Konto::nachMail($mailNeu)) {
                    /* Auch hier keine Auskunft darüber, ob es die Adresse
                       schon gibt – die Formulierung passt auf beide Fälle. */
                    Antwort::fehler('Diese Adresse lässt sich nicht übernehmen. '
                        . 'Melde dich mit ihr an, wenn sie dir gehört.', 409, ['feld' => 'mail']);
                }
                /* Die neue Adresse gilt erst nach Bestätigung. Ohne das
                   ließe sich ein Konto auf eine fremde Adresse umschreiben
                   und von dort übernehmen. */
                $felder['mail'] = $mailNeu;
                $felder['mail_bestaetigt'] = 0;
            }
            Konto::aendern((int) $k['id'], $felder);
            Konto::stufeNeu((int) $k['id']);
            Antwort::gut([
                'konto' => Konto::nachAussen(Konto::nachId((int) $k['id'])),
                'bestaetigen' => isset($felder['mail']),
            ]);

        case 'abmelden':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            if (!empty(rumpf()['alle'])) {
                $k = Sitzung::konto();
                if ($k) {
                    Sitzung::alleBeenden((int) $k['id']);
                }
            } else {
                Sitzung::beenden();
            }
            Antwort::gut();

        case 'konto/loeschen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Konto::loeschen((int) $k['id']);
            Sitzung::beenden();
            Antwort::gut();


        /* ==============================================================
           Der Markt

           Ab hier ist die Anwendung kein Werkzeug mehr, sondern ein Ort,
           an dem sich zwei Seiten treffen. Alles darunter folgt einer
           Regel: Lesen darf jeder, schreiben nur, wer angemeldet ist.
           Wer eine Wohnung sucht, soll nicht erst ein Konto anlegen, um
           zu sehen, ob es sich lohnt.
           ============================================================== */

        /* Öffentliche Suche. Antwortet auch ohne Konto und ohne Cookie. */
        case 'markt':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $f = [];
            foreach (['art', 'stadt', 'viertelKey', 'sortierung', 'zimmerMin', 'zimmerMax',
                      'flaecheMin', 'flaecheMax', 'warmMax', 'kaltMax', 'preisMax'] as $name) {
                if (isset($_GET[$name]) && is_string($_GET[$name]) && $_GET[$name] !== '') {
                    $f[$name] = mb_substr($_GET[$name], 0, 80, 'UTF-8');
                }
            }
            if (!empty($_GET['nurMitBild'])) {
                $f['nurMitBild'] = true;
            }
            if (!empty($_GET['nurWgGruendung'])) {
                $f['nurWgGruendung'] = true;
            }
            $ab = (int) ($_GET['ab'] ?? 0);
            $zeilen = Inserat::suchen($f, $ab, (int) ($_GET['wieviele'] ?? 60));
            Antwort::gut([
                'inserate' => array_map(static fn ($z) => Inserat::nachAussen($z), $zeilen),
                'gesamt' => Inserat::anzahl(),
                'ab' => $ab,
            ]);

        /* Ein einzelnes Inserat. Der Weg trägt die Kennung, damit er
           sich teilen lässt. */
        case 'objekt':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $z = Inserat::nachKennung($stueck);
            if (!$z) {
                Antwort::fehler('Dieses Inserat gibt es nicht.', 404);
            }
            $ich = Sitzung::konto();
            $meins = $ich && (int) $ich['id'] === (int) $z['konto_id'];
            if (!$meins && ($z['stand'] !== 'aktiv' || (int) $z['laeuft_ab'] < time())) {
                Antwort::fehler('Dieses Inserat steht nicht mehr zur Verfügung.', 410, ['weg' => true]);
            }
            /* Aufrufe zählt nur, wer nicht selbst inseriert hat – sonst
               zählt jeder Blick auf die eigene Wohnung mit und die Zahl
               ist wertlos. */
            if (!$meins) {
                Db::fuehre('UPDATE tt_inserat SET aufrufe = aufrufe + 1 WHERE id = ?', [$z['id']]);
                Zaehler::plus('objekt');
            }
            Antwort::gut(['inserat' => Inserat::nachAussen($z), 'meins' => $meins]);

        case 'bild':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            Bild::ausliefern($stueck);

        /* --------------------------------------------------------------
           Eigene Inserate
           -------------------------------------------------------------- */

        case 'inserat/meine':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(['inserate' => array_map(
                static fn ($z) => Inserat::nachAussen($z),
                Inserat::meine((int) $k['id'])
            )]);

        case 'inserat/neu':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            /* Ein Inserat ist eine Veröffentlichung mit Rechtsfolgen –
               § 5a UWG bei falschen Angaben, § 87 GEG beim
               Energieausweis. Wer sie abgibt, muss erreichbar sein.
               Deshalb: bestätigte Adresse, sonst nicht. */
            if ((int) $k['stufe'] < 1) {
                Antwort::fehler('Zum Inserieren braucht es eine bestätigte E-Mail-Adresse. '
                    . 'Sonst kann dich niemand erreichen – auch wir nicht.', 403, ['stufe' => (int) $k['stufe']]);
            }
            Grenze::sperreOderWeiter('inserat', (string) $k['kennung']);
            $neu = Inserat::anlegen($k, rumpf());
            Zaehler::plus('inserat-neu');
            Antwort::gut(['inserat' => $neu]);

        case 'inserat/aendern':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(['inserat' => Inserat::aendern($k, feld('id'), rumpf())]);

        case 'inserat/stand':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(['inserat' => Inserat::stand($k, feld('id'), feld('stand'))]);

        /* „Steht noch“ – der Klick, der ein Inserat um 60 Tage
           verlängert und Karteileichen verhindert. */
        case 'inserat/steht':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Zaehler::plus('inserat-verlaengert');
            Antwort::gut(['inserat' => Inserat::bestaetigen($k, feld('id'))]);

        case 'inserat/loeschen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Inserat::loeschen($k, feld('id'));
            Antwort::gut();

        case 'bild/neu':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            $z = Inserat::nachKennung(feld('id'));
            if (!$z || (int) $z['konto_id'] !== (int) $k['id']) {
                Antwort::fehler('Dieses Inserat gibt es nicht oder es gehört einem anderen Konto.', 404);
            }
            Grenze::sperreOderWeiter('bild', (string) $k['kennung']);
            $b = Bild::anlegen((int) $z['id'], (string) (rumpf()['bild'] ?? ''), (int) (rumpf()['pos'] ?? 0));
            Zaehler::plus('inserat-bild');
            Antwort::gut(['bilder' => Bild::zuInserat((int) $z['id'])]);

        case 'bild/weg':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            $z = Inserat::nachKennung(feld('id'));
            if (!$z || (int) $z['konto_id'] !== (int) $k['id']) {
                Antwort::fehler('Dieses Inserat gibt es nicht oder es gehört einem anderen Konto.', 404);
            }
            Bild::loeschen((int) $z['id'], feld('bild'));
            Antwort::gut(['bilder' => Bild::zuInserat((int) $z['id'])]);

        /* --------------------------------------------------------------
           Anfragen
           -------------------------------------------------------------- */

        case 'anfrage/neu':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            $z = Inserat::nachKennung(feld('id'));
            if (!$z) {
                Antwort::fehler('Dieses Inserat gibt es nicht.', 404);
            }
            Grenze::sperreOderWeiter('anfrage', (string) $k['kennung']);
            $a = Anfrage::senden($k, $z, rumpf(), $BASIS);
            Antwort::gut(['anfrage' => Anfrage::nachAussen($a + ['inserat_kennung' => $z['kennung'],
                'inserat_titel' => $z['titel']], false)]);

        case 'anfrage/postfach':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut([
                'eingang' => array_map(
                    static fn ($z) => Anfrage::nachAussen($z, true),
                    Anfrage::eingang((int) $k['id'])
                ),
                'ausgang' => array_map(
                    static fn ($z) => Anfrage::nachAussen($z, false),
                    Anfrage::ausgang((int) $k['id'])
                ),
            ]);

        case 'anfrage/stand':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Anfrage::standSetzen((int) $k['id'], feld('id'), feld('stand'));
            Antwort::gut();

        /* --------------------------------------------------------------
           Suchaufträge
           -------------------------------------------------------------- */

        case 'auftrag/neu':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            if ((int) $k['stufe'] < 1) {
                Antwort::fehler('Ein Suchauftrag schickt Mails. Dafür muss die Adresse bestätigt sein.',
                    403, ['stufe' => (int) $k['stufe']]);
            }
            Antwort::gut(['auftrag' => Auftrag::nachAussen(
                Auftrag::anlegen($k, rumpf(), !empty(rumpf()['plus']))
            )]);

        case 'auftrag/meine':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(['auftraege' => array_map(
                static fn ($z) => Auftrag::nachAussen($z),
                Auftrag::meine((int) $k['id'])
            )]);

        case 'auftrag/weg':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Auftrag::loeschen((int) $k['id'], feld('id'));
            Antwort::gut();

        /* Abmelden aus der Mail heraus – ohne Konto, mit einem Klick.
           Antwortet als Seite, nicht als JSON: Wer hier landet, kommt
           aus einem Mailprogramm und erwartet etwas Lesbares. */
        case 'auftrag/aus':
            $ok = Auftrag::abmelden(
                (string) ($_GET['k'] ?? ''),
                (string) ($_GET['h'] ?? '')
            );
            header('Content-Type: text/html; charset=utf-8');
            header('Cache-Control: no-store');
            echo abmeldeSeite($ok, $BASIS);
            exit;

        /* --------------------------------------------------------------
           Meldungen nach Art. 16 DSA – ausdrücklich ohne Kontozwang
           -------------------------------------------------------------- */

        case 'melden':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $z = Inserat::nachKennung(feld('id'));
            if (!$z) {
                Antwort::fehler('Dieses Inserat gibt es nicht.', 404);
            }
            Grenze::sperreOderWeiter('melden', besucher_ip());
            $m = Meldung::anlegen($z, Sitzung::konto(), rumpf(), $BASIS);
            Antwort::gut(['vorgang' => $m['kennung']]);

        /* --------------------------------------------------------------
           Zählen

           Nimmt einen Namen aus einer festen Liste entgegen und erhöht
           eine Tagessumme. Keine Kennung, keine Antwort mit Inhalt.
           -------------------------------------------------------------- */

        case 'zaehlen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $namen = rumpf()['namen'] ?? [];
            if (is_array($namen)) {
                foreach (array_slice($namen, 0, 20) as $n) {
                    if (is_string($n)) {
                        Zaehler::plus($n);
                    }
                }
            }
            Antwort::gut();


        /* --------------------------------------------------------------
           WG-Gründung

           Der einzige Bereich, in dem Nutzende einander begegnen, bevor
           es zu einem Vertrag kommt. Deshalb steht hier mehr Sorgfalt
           beim Sichtbarmachen als sonst irgendwo: Lesen darf viel, aber
           eine Person sieht man erst, wenn man angemeldet ist, und eine
           E-Mail-Adresse erst, wenn beide Seiten zugestimmt haben.
           -------------------------------------------------------------- */

        case 'gruppen':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $ich = Sitzung::konto();
            $zuInserat = (string) ($_GET['inserat'] ?? '');
            if ($zuInserat !== '') {
                $z = Inserat::nachKennung($zuInserat);
                if (!$z) {
                    Antwort::fehler('Dieses Inserat gibt es nicht.', 404);
                }
                Antwort::gut(['gruppen' => Gruppe::zuInserat((int) $z['id'], $ich)]);
            }
            Antwort::gut(['gruppen' => Gruppe::offene($ich, (int) ($_GET['wieviele'] ?? 40))]);

        case 'gruppe/meine':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(['gruppen' => Gruppe::meine($k)]);

        case 'gruppe/neu':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            if ((int) $k['stufe'] < 1) {
                Antwort::fehler('Zum Gründen einer WG braucht es eine bestätigte E-Mail-Adresse. '
                    . 'Wer mit Fremden zusammenziehen will, muss erreichbar sein.', 403, ['stufe' => (int) $k['stufe']]);
            }
            Grenze::sperreOderWeiter('gruppe', (string) $k['kennung']);
            Antwort::gut(['gruppe' => Gruppe::anlegen($k, rumpf())]);

        case 'gruppe/beitreten':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            if ((int) $k['stufe'] < 1) {
                Antwort::fehler('Zum Beitreten braucht es eine bestätigte E-Mail-Adresse.',
                    403, ['stufe' => (int) $k['stufe']]);
            }
            Grenze::sperreOderWeiter('gruppe', (string) $k['kennung']);
            Antwort::gut(['gruppe' => Gruppe::beitreten($k, feld('id'), rumpf())]);

        case 'gruppe/entscheiden':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(['gruppe' => Gruppe::entscheiden(
                $k, feld('id'), feld('person'), !empty(rumpf()['ja'])
            )]);

        case 'gruppe/verlassen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            $erg = Gruppe::verlassen($k, feld('id'));
            Antwort::gut(isset($erg['aufgeloest']) ? $erg : ['gruppe' => $erg]);

        case 'gruppe/bewerben':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Grenze::sperreOderWeiter('anfrage', (string) $k['kennung']);
            Antwort::gut(['gruppe' => Gruppe::bewerben($k, feld('id'), feld('text'), $BASIS)]);

        /* ==============================================================
           Was jemand für sich festhält

           Zwei Wege, mehr braucht es nicht: alles holen, Teile
           schreiben. Der Server wertet nichts davon aus.
           ============================================================== */

        case 'ablage':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut([
                'ablage' => Ablage::alles((int) $k['id']),
                'belegt' => Ablage::belegt((int) $k['id']),
            ]);

        case 'ablage/setzen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            $felder = rumpf()['felder'] ?? null;
            if (!is_array($felder)) {
                Antwort::fehler('Es kam kein Feld an.', 400);
            }
            Antwort::gut(Ablage::setzen((int) $k['id'], $felder));

        /* ==============================================================
           Dokumententresor

           Der Server sieht ausschließlich Chiffrat. Der einzige Weg
           ohne Anmeldung ist der Abruf einer Freigabe – er muss es
           sein: Die Vermieterseite legt für einen Blick in drei
           Gehaltsabrechnungen kein Konto an.
           ============================================================== */

        case 'tresor/liste':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut([
                'dokumente' => Tresor::liste((int) $k['id']),
                'freigaben' => Tresor::freigaben((int) $k['id']),
                'belegt'    => Tresor::belegt((int) $k['id']),
            ]);

        case 'tresor/neu':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Grenze::sperreOderWeiter('bild', (string) $k['kennung']);
            Antwort::gut(Tresor::hinzufuegen((int) $k['id'], rumpf()));

        case 'tresor/holen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(['dokument' => Tresor::holen((int) $k['id'], feld('id'))]);

        case 'tresor/loeschen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Tresor::loeschen((int) $k['id'], feld('id'));
            Antwort::gut(['dokumente' => Tresor::liste((int) $k['id'])]);

        case 'tresor/leeren':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(['geloescht' => Tresor::alleLoeschen((int) $k['id'])]);

        case 'freigabe/neu':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Grenze::sperreOderWeiter('anfrage', (string) $k['kennung']);
            Antwort::gut(['freigabe' => Tresor::freigeben((int) $k['id'], rumpf())]);

        case 'freigabe/widerrufen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Tresor::widerrufen((int) $k['id'], feld('id'));
            Antwort::gut(['freigaben' => Tresor::freigaben((int) $k['id'])]);

        case 'freigabe/loeschen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Tresor::freigabeLoeschen((int) $k['id'], feld('id'));
            Antwort::gut(['freigaben' => Tresor::freigaben((int) $k['id'])]);

        /* Ohne Anmeldung. Gesperrt ist der Weg trotzdem: Ohne den
           Schlüssel aus dem Fragmentteil des Verweises ist alles, was
           hier herauskommt, unlesbar. Die Sperre je IP steht gegen das
           Durchprobieren von Kennungen. */
        case 'freigabe/abruf':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            Grenze::sperreOderWeiter('melden', '');
            Antwort::gut(Tresor::abrufen(feld('id')));

        /* ==============================================================
           Besichtigungstermine
           ============================================================== */

        case 'termin/neu':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(Termin::anlegen($k, feld('inserat'), rumpf()));

        case 'termin/weg':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(Termin::entfernen($k, feld('id'), $BASIS));

        case 'termin/buchen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Grenze::sperreOderWeiter('anfrage', (string) $k['kennung']);
            Antwort::gut(Termin::buchen($k, feld('id'), $BASIS));

        case 'termin/absagen':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(Termin::absagen($k, feld('id')));

        case 'termin/meine':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Antwort::gut(['termine' => Termin::meine((int) $k['id'])]);

        /* ==============================================================
           Tarif
           ============================================================== */

        case 'tarif':
            if ($art !== 'GET') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            Antwort::gut(['tarif' => Tarif::stand(Sitzung::konto())]);

        case 'tarif/gruender':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            $g = Tarif::gruenderSichern($k);
            /* Frisch aus der Datenbank: Die Zeile in $k stammt von vor
               dem Schreiben und wüsste noch nichts von der Nummer. */
            Antwort::gut([
                'gruender' => $g,
                'tarif' => Tarif::stand(Db::zeile('SELECT * FROM tt_konto WHERE id = ?', [(int) $k['id']])),
            ]);

        case 'tarif/aufgeben':
            if ($art !== 'POST') {
                Antwort::fehler('Falsches Verfahren.', 405);
            }
            $k = Sitzung::verlangen();
            Tarif::gruenderAufgeben($k);
            Antwort::gut([
                'tarif' => Tarif::stand(Db::zeile('SELECT * FROM tt_konto WHERE id = ?', [(int) $k['id']])),
            ]);

        default:
            Antwort::fehler('Diesen Weg gibt es nicht.', 404);
    }
} catch (PDOException $e) {
    Antwort::panne('Datenbankfehler – ' . $e->getMessage(), $cfg);
} catch (Throwable $e) {
    Antwort::panne(get_class($e) . ': ' . $e->getMessage(), $cfg);
}

/* =====================================================================
   Kleinigkeiten
   ===================================================================== */

/* Die Aufforderung steht als Hash in der Datenbank – zurückrechnen lässt
   sie sich daraus nicht. Für WebAuthn wird aber der Klartext gebraucht,
   um ihn mit dem zu vergleichen, was das Gerät zurückschickt. Deshalb
   liegt sie zusätzlich in `daten`: kurzlebig, an einen Vorgang gebunden,
   und ohne Wert für sich allein – wer sie kennt, kann damit nichts, weil
   die Signatur trotzdem vom Gerät kommen muss. */
function holeAufforderung(array $v): string
{
    return (string) ($v['daten']['aufforderung'] ?? '');
}

/** Ein grober Hinweis, welches Gerät den Passkey angelegt hat – damit
    man ihn auf der Kontoseite wiedererkennt. Nicht mehr als das. */
function geraeteName(): string
{
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $paare = [
        'Windows'  => 'Windows', 'iPhone' => 'iPhone', 'iPad' => 'iPad',
        'Macintosh' => 'Mac', 'Android' => 'Android', 'Linux' => 'Linux',
    ];
    foreach ($paare as $suche => $name) {
        if (stripos($ua, $suche) !== false) {
            return $name;
        }
    }
    return 'Gerät';
}

/** Zurück in die Anwendung. Der Hash-Teil sagt ihr, was zu zeigen ist. */
function weiterZurSeite(string $basis, string $fehler = '', string $weiter = ''): never
{
    $ziel = ($basis !== '' ? $basis : '') . '/';
    if ($fehler !== '') {
        $ziel .= '#/anmelden?fehler=' . rawurlencode($fehler);
    } elseif ($weiter !== '' && preg_match('#^[a-z0-9/_-]{1,80}$#i', $weiter)) {
        /* Nur eigene Wege, und die auch nur in dieser engen Form. Eine
           offene Weiterleitung ist eine Einladung an jeden, der einen
           Anmeldelink verschicken will, der auf seiner Seite endet. */
        $ziel .= '#/' . ltrim($weiter, '/');
    } else {
        $ziel .= '#/start';
    }
    header('Location: ' . $ziel, true, 302);
    exit;
}

function mailText(string $code, int $minuten, string $basis): string
{
    return "Dein Anmeldecode für TrimmoTrade:\n\n"
        . "    $code\n\n"
        . "Er gilt $minuten Minuten und lässt sich einmal verwenden.\n\n"
        . "Wenn du dich nicht anmelden wolltest, ist nichts passiert – dann hat\n"
        . "jemand deine Adresse eingetippt. Du musst nichts weiter tun; ohne den\n"
        . "Code kommt niemand hinein. Der Code ist nur für dich: Wir fragen dich\n"
        . "nie danach, weder per Mail noch am Telefon.\n\n"
        . ($basis !== '' ? "$basis\n" : '');
}

/** Die Seite, auf der jemand landet, der einen Suchauftrag abbestellt.
    Bewusst eine eigene, winzige Seite ohne JavaScript: Sie muss auch
    dann funktionieren, wenn die Anwendung gerade nicht läuft. */
function abmeldeSeite(bool $ok, string $basis): string
{
    $titel = $ok ? 'Abbestellt' : 'Das hat nicht geklappt';
    $text = $ok
        ? 'Dieser Suchauftrag schickt dir keine Mails mehr. Deine anderen Suchaufträge laufen weiter.'
        : 'Der Verweis stimmt nicht oder der Suchauftrag ist längst gelöscht. In beiden Fällen kommt '
          . 'von diesem Auftrag nichts mehr.';
    $h = static fn (string $t): string => htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    return '<!doctype html><html lang="de"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<meta name="robots" content="noindex">'
        . '<title>' . $h($titel) . ' – TrimmoTrade</title>'
        . '<style>:root{color-scheme:light dark}'
        . 'body{font:1rem/1.6 system-ui,sans-serif;margin:0;display:grid;place-items:center;'
        . 'min-height:100vh;padding:2rem;background:#f6f7f9;color:#14161a}'
        . '@media(prefers-color-scheme:dark){body{background:#14161a;color:#e9eaee}}'
        . 'main{max-width:34rem;background:#fff;padding:2rem;border-radius:14px;'
        . 'box-shadow:0 1px 3px rgba(0,0,0,.12)}'
        . '@media(prefers-color-scheme:dark){main{background:#1d2026;box-shadow:none;'
        . 'border:1px solid #33373f}}'
        . 'h1{font-size:1.35rem;margin:0 0 .6rem}p{margin:0 0 1rem}'
        . 'a{color:#1b6b4a;font-weight:600}'
        . '@media(prefers-color-scheme:dark){a{color:#6fd3a4}}</style></head><body><main>'
        . '<h1>' . $h($titel) . '</h1><p>' . $h($text) . '</p>'
        . '<p><a href="' . $h($basis !== '' ? $basis . '/' : '/') . '">Zurück zu TrimmoTrade</a></p>'
        . '</main></body></html>';
}

/** Die Betreiberangaben, wie sie an den Browser gehen.

    Eine feste Liste, obwohl die Werte aus der eigenen Konfiguration
    stammen und niemand sie unterschieben kann: Sie sorgt dafür, dass ein
    versehentlich danebengeschriebener Schlüssel – ein Passwort im
    falschen Block etwa – nicht mit hinausgeht. Was nicht auf der Liste
    steht, geht nicht raus. */
function betreiberAngaben(array $cfg): array
{
    $quelle = is_array($cfg['betreiber'] ?? null) ? $cfg['betreiber'] : [];
    $raus = [];
    foreach (['name', 'rechtsform', 'zusatz', 'strasse', 'plz', 'ort', 'land', 'email',
              'telefon', 'service', 'ustId', 'handelsregister', 'gewerbeamt',
              'aufsichtsbehoerde', 'verantwortlichMStV', 'stand'] as $feld) {
        $w = $quelle[$feld] ?? null;
        if (is_string($w) && trim($w) !== '') {
            $raus[$feld] = mb_substr(trim($w), 0, 200, 'UTF-8');
        }
    }
    if (isset($quelle['kleinunternehmer'])) {
        $raus['kleinunternehmer'] = (bool) $quelle['kleinunternehmer'];
    }
    return $raus;
}
