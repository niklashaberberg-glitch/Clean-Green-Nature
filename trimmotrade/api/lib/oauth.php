<?php
/* =====================================================================
   Anmeldung über Google und Microsoft (OpenID Connect)

   Der Ablauf in fünf Schritten:

   1. Der Nutzer drückt den Knopf. Der Server merkt sich einen
      Zufallswert („state“), einen zweiten („nonce“) und einen dritten,
      von dem er nur den Hash weitergibt („PKCE“), und schickt den
      Browser zum Anbieter.
   2. Der Nutzer meldet sich beim Anbieter an – auf dessen Seite, mit
      dessen Passwort. TrimmoTrade sieht davon nichts.
   3. Der Anbieter schickt den Browser zurück, mit einem einmaligen Code.
   4. Der Server tauscht den Code beim Anbieter gegen ein ID-Token. Das
      geschieht von Server zu Server – der Browser ist nicht beteiligt
      und kann nichts verändern.
   5. Der Server prüft die Signatur des Tokens und weiß dann, wer da ist.

   Warum drei Zufallswerte, wo einer reichen könnte:

   · `state` bindet die Rückkehr an den Aufbruch. Ohne ihn ließe sich
     einem Angemeldeten eine fremde Rückkehr unterschieben, sodass er
     unbemerkt im Konto des Angreifers landet.
   · `nonce` bindet das Token an genau diese Anfrage. Ohne ihn wäre ein
     einmal abgefangenes Token wiederverwendbar.
   · PKCE bindet den Tausch an denjenigen, der ihn begonnen hat. Ohne
     ihn genügte der abgefangene Code aus der Adresszeile.

   PKCE gilt vielerorts als „nur für Handy-Apps nötig“. Das war einmal;
   der aktuelle Stand der Technik (OAuth 2.1) verlangt ihn überall, und
   er kostet drei Zeilen.
   ===================================================================== */

require_once __DIR__ . '/antwort.php';
require_once __DIR__ . '/netz.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/vorgang.php';

final class OauthFehler extends RuntimeException
{
}

final class Oauth
{
    private static array $cfg = [];

    public static function start(array $cfg): void
    {
        self::$cfg = $cfg;
    }

    /** Alle Anbieter, in der Reihenfolge, in der sie angeboten werden. */
    public const ANBIETER = ['google', 'microsoft', 'apple', 'instagram'];

    /** Wer ein ID-Token nach OpenID Connect ausstellt. Instagram nicht:
        Dort gibt es nur ein Zugriffstoken und danach eine Abfrage. */
    private const OIDC = ['google', 'microsoft', 'apple'];

    /** Wer eine E-Mail-Adresse herausgibt. Instagram tut das nicht – es
        gibt dafür keinen Bereich, den man anfordern könnte. Wer sich so
        anmeldet, muss die Adresse hinterher nachtragen. */
    public static function liefertMail(string $anbieter): bool
    {
        return $anbieter !== 'instagram';
    }

    /** Welche Anbieter tatsächlich eingerichtet sind. Ein Knopf für einen
        Anbieter ohne Zugangsdaten führt nur in eine Fehlermeldung – der
        gehört gar nicht erst angezeigt.

        Die Zugangsdaten sehen nicht überall gleich aus: Google, Microsoft
        und Instagram geben ein festes Geheimnis heraus, Apple nicht. Dort
        bekommt man einen privaten Schlüssel und baut das Geheimnis bei
        jeder Anfrage selbst – also braucht es dort drei Angaben statt
        einer. */
    public static function verfuegbar(): array
    {
        $da = [];
        foreach (self::ANBIETER as $a) {
            $c = self::$cfg['oauth'][$a] ?? [];
            if (($c['client_id'] ?? '') === '') {
                continue;
            }
            if ($a === 'apple') {
                if (($c['team_id'] ?? '') !== '' && ($c['key_id'] ?? '') !== ''
                    && self::appleSchluessel($c) !== '') {
                    $da[] = $a;
                }
                continue;
            }
            if (($c['client_secret'] ?? '') !== '') {
                $da[] = $a;
            }
        }
        return $da;
    }

    /** Der private Schlüssel für Apple – als Pfad zur .p8-Datei oder
        unmittelbar als Text. Der Pfad ist der bessere Weg: So steht der
        Schlüssel nicht in derselben Datei wie alles andere und lässt sich
        einzeln mit engen Rechten ablegen. */
    private static function appleSchluessel(array $c): string
    {
        $pfad = (string) ($c['key_datei'] ?? '');
        if ($pfad !== '') {
            if (!is_readable($pfad)) {
                return '';
            }
            return (string) file_get_contents($pfad);
        }
        return (string) ($c['key_pem'] ?? '');
    }

    /**
     * Das Client-Geheimnis für den Tokentausch.
     *
     * Bei Apple ist es kein hinterlegter Wert, sondern ein JWT, das hier
     * frisch signiert wird: `iss` die Team-Kennung, `sub` die Services-ID,
     * `aud` Apple selbst. Apple erlaubt höchstens sechs Monate Laufzeit;
     * zehn Minuten genügen vollkommen, weil es nur für diesen einen
     * Tausch gebraucht wird und danach nie wieder. Ein Geheimnis, das
     * zehn Minuten lebt, kann auch nicht ablaufen und den Betrieb
     * anhalten – der häufigste Betriebsfehler bei Apple.
     */
    private static function geheimnis(string $anbieter, array $c): string
    {
        if ($anbieter !== 'apple') {
            return (string) ($c['client_secret'] ?? '');
        }
        $jetzt = time();
        return Jwt::signierenEs256([
            'iss' => (string) $c['team_id'],
            'iat' => $jetzt,
            'exp' => $jetzt + 600,
            'aud' => 'https://appleid.apple.com',
            'sub' => (string) $c['client_id'],
        ], self::appleSchluessel($c), (string) $c['key_id']);
    }

    private static function endpunkte(string $anbieter): array
    {
        if ($anbieter === 'google') {
            return [
                'auth'   => 'https://accounts.google.com/o/oauth2/v2/auth',
                'token'  => 'https://oauth2.googleapis.com/token',
                'jwks'   => 'https://www.googleapis.com/oauth2/v3/certs',
                /* Google stellt in beiden Schreibweisen aus. Beide sind
                   echt; wer nur eine prüft, sperrt zufällig aus. */
                'iss'    => ['https://accounts.google.com', 'accounts.google.com'],
                'scope'  => 'openid email profile',
            ];
        }
        if ($anbieter === 'microsoft') {
            $m = self::$cfg['oauth']['microsoft']['mandant'] ?? 'common';
            $m = preg_match('/^[a-zA-Z0-9._-]{1,64}$/', $m) ? $m : 'common';
            return [
                'auth'    => "https://login.microsoftonline.com/$m/oauth2/v2.0/authorize",
                'token'   => "https://login.microsoftonline.com/$m/oauth2/v2.0/token",
                'jwks'    => "https://login.microsoftonline.com/$m/discovery/v2.0/keys",
                /* Bei 'common' meldet sich jeder Mandant mit seiner
                   eigenen Kennung im Aussteller. Erlaubt ist deshalb die
                   Form, und die Kennung darin muss zum `tid` im Token
                   passen – das prüft `austellerMicrosoft`. */
                'iss'     => null,
                'scope'   => 'openid email profile',
            ];
        }
        if ($anbieter === 'apple') {
            return [
                'auth'   => 'https://appleid.apple.com/auth/authorize',
                'token'  => 'https://appleid.apple.com/auth/token',
                'jwks'   => 'https://appleid.apple.com/auth/keys',
                'iss'    => ['https://appleid.apple.com'],
                'scope'  => 'name email',
                /* Wer bei Apple Name oder Adresse anfordert, muss die
                   Rückkehr als Formular entgegennehmen – anders gibt
                   Apple sie nicht heraus. Das hat eine Folge, die man
                   erst im Betrieb merkt: Eine anbieterübergreifende
                   POST-Anfrage bringt keine Cookies mit SameSite=Lax
                   mit. Der Anker muss deshalb bei Apple anders gesetzt
                   werden; siehe api/index.php. */
                'form_post' => true,
            ];
        }
        if ($anbieter === 'instagram') {
            return [
                'auth'   => 'https://www.instagram.com/oauth/authorize',
                'token'  => 'https://api.instagram.com/oauth/access_token',
                'jwks'   => '',
                'iss'    => null,
                /* Es gibt keinen Bereich für die E-Mail-Adresse. Was man
                   bekommt, ist eine Kennung und ein Benutzername. */
                'scope'  => 'instagram_business_basic',
                'ich'    => 'https://graph.instagram.com/v23.0/me',
            ];
        }
        throw new OauthFehler('Unbekannter Anbieter.');
    }

    /* -----------------------------------------------------------------
       Schritt 1: Los
       ----------------------------------------------------------------- */

    /** @return string Die Adresse, zu der der Browser geschickt wird */
    public static function losUrl(
        string $anbieter,
        string $rueckkehr,
        string $weiter = '',
        string $ankerHash = ''
    ): string {
        $c = self::$cfg['oauth'][$anbieter] ?? [];
        if (($c['client_id'] ?? '') === '') {
            throw new OauthFehler('Dieser Anmeldeweg ist auf diesem Server nicht eingerichtet.');
        }
        $e = self::endpunkte($anbieter);

        $state = zufall_text(24);
        $nonce = zufall_text(24);
        /* Der Prüfwert bleibt beim Server, weitergegeben wird nur sein
           Hash. Wer die Umleitung mitliest, hat damit nichts. */
        $pkce  = zufall_text(32);
        $pkceHash = b64u_kodieren(hash('sha256', $pkce, true));

        Vorgang::anlegen('oauth', $anbieter, $state, [
            'anbieter' => $anbieter,
            'nonce'    => $nonce,
            'pkce'     => $pkce,
            'weiter'   => $weiter,
            'anker'    => $ankerHash,
        ], 900);

        $felder = [
            'client_id'     => $c['client_id'],
            'response_type' => 'code',
            'redirect_uri'  => $rueckkehr,
            'scope'         => $e['scope'],
            'state'         => $state,
        ];

        if (in_array($anbieter, self::OIDC, true)) {
            $felder['nonce'] = $nonce;
        }

        /* PKCE kennt Instagram nicht, und ein unbekanntes Feld weist es
           mit einer Fehlerseite ab statt es zu übergehen. Bei den
           übrigen dreien gehört es dazu. */
        if ($anbieter !== 'instagram') {
            $felder['code_challenge'] = $pkceHash;
            $felder['code_challenge_method'] = 'S256';
            /* Kein `prompt=consent`: Wer schon zugestimmt hat, soll nicht
               bei jeder Anmeldung wieder gefragt werden. */
            $felder['access_type'] = 'online';
        }

        if (!empty($e['form_post'])) {
            $felder['response_mode'] = 'form_post';
        }

        return $e['auth'] . '?' . http_build_query($felder);
    }

    /* -----------------------------------------------------------------
       Schritt 4 und 5: Zurück
       ----------------------------------------------------------------- */

    /**
     * @return array{anbieter:string, sub:string, mail:string,
     *               mail_bestaetigt:bool, name:string, weiter:string}
     */
    public static function zurueck(
        string $state,
        string $code,
        string $rueckkehr,
        string $ankerHash = '',
        string $appleNutzer = ''
    ): array {
        $v = Vorgang::holen(self::vorgangKennung($state), 'oauth');
        if (!$v || !gleich_sicher($v['geheim_hash'], merkmal_hash($state))) {
            throw new OauthFehler('Diese Anmeldung ist abgelaufen oder gehört nicht hierher. Fang noch einmal an.');
        }
        /* Sofort löschen: Ein zweiter Aufruf mit demselben `state` ist
           entweder ein Nachladen der Seite oder ein Angriff. In beiden
           Fällen darf er nicht wirken. */
        Vorgang::loeschen($v['kennung']);

        /* Der Anker aus dem Cookie muss zu dem passen, der beim Aufbruch
           hinterlegt wurde. Sonst kommt die Rückkehr aus einem anderen
           Browser als der Aufbruch – und dann gehört sie nicht hierher. */
        $erwartet = (string) ($v['daten']['anker'] ?? '');
        if ($erwartet !== '' && !gleich_sicher($erwartet, $ankerHash)) {
            throw new OauthFehler('Diese Anmeldung gehört zu einem anderen Browser. Fang noch einmal an.');
        }

        $anbieter = (string) ($v['daten']['anbieter'] ?? '');
        $c = self::$cfg['oauth'][$anbieter] ?? [];
        $e = self::endpunkte($anbieter);
        $weiter = (string) ($v['daten']['weiter'] ?? '');

        if ($anbieter === 'instagram') {
            return self::zurueckInstagram($c, $e, $code, $rueckkehr, $weiter);
        }

        $felder = [
            'grant_type'    => 'authorization_code',
            'code'          => $code,
            'redirect_uri'  => $rueckkehr,
            'client_id'     => $c['client_id'],
            'client_secret' => self::geheimnis($anbieter, $c),
            'code_verifier' => (string) ($v['daten']['pkce'] ?? ''),
        ];
        $token = Netz::post($e['token'], $felder);

        $idToken = (string) ($token['id_token'] ?? '');
        if ($idToken === '') {
            throw new OauthFehler('Der Anbieter hat kein Ausweis-Token geschickt.');
        }

        $aussteller = $e['iss'];
        $inhalt = Jwt::pruefen(
            $idToken,
            $e['jwks'],
            $aussteller ?? self::microsoftAussteller($idToken),
            (string) $c['client_id']
        );

        /* Der Zufallswert aus Schritt 1 muss im Token stehen. Fehlt er
           oder stimmt er nicht, ist das Token nicht die Antwort auf
           diese Anfrage – egal, wie gültig es sonst aussieht. */
        $nonce = (string) ($v['daten']['nonce'] ?? '');
        if (!gleich_sicher((string) ($inhalt['nonce'] ?? ''), $nonce)) {
            throw new OauthFehler('Die Antwort passt nicht zur Anfrage.');
        }

        $sub = (string) ($inhalt['sub'] ?? '');
        if ($sub === '') {
            throw new OauthFehler('Dem Token fehlt die Kontokennung.');
        }

        [$mail, $bestaetigt] = self::mailAus($anbieter, $inhalt);

        $name = mb_substr(trim((string) ($inhalt['name'] ?? '')), 0, 120);
        if ($anbieter === 'apple' && $name === '') {
            $name = self::appleName($appleNutzer);
        }

        return [
            'anbieter'        => $anbieter,
            'sub'             => $sub,
            'mail'            => $mail,
            'mail_bestaetigt' => $bestaetigt,
            'name'            => $name,
            'weiter'          => $weiter,
        ];
    }

    /* -----------------------------------------------------------------
       Instagram: derselbe Ablauf, aber ohne Ausweis

       Google, Microsoft und Apple stellen ein signiertes ID-Token aus –
       eine Aussage, die für sich steht und sich prüfen lässt. Instagram
       nicht. Dort gibt es ein Zugriffstoken, mit dem man anschließend
       fragen muss, wem es gehört. Das ist schwächer: Die Antwort ist
       nicht signiert, und ihre Echtheit hängt allein daran, dass sie
       über TLS von graph.instagram.com kam.

       Und es gibt keine E-Mail-Adresse. Nicht „selten“ oder „nur bei
       manchen“ – es gibt dafür keinen Bereich, den man anfordern könnte.
       Wer sich so anmeldet, kann von dieser Seite keine Nachricht
       bekommen: keine Anfrage auf ein Inserat, keine Absage eines
       Besichtigungstermins, keinen Treffer aus einem Suchauftrag. Das
       Konto entsteht deshalb ohne Adresse und bleibt auf Stufe 0, bis
       eine nachgetragen und bestätigt ist.
       ----------------------------------------------------------------- */

    private static function zurueckInstagram(
        array $c,
        array $e,
        string $code,
        string $rueckkehr,
        string $weiter
    ): array {
        $token = Netz::post($e['token'], [
            'client_id'     => $c['client_id'],
            'client_secret' => $c['client_secret'],
            'grant_type'    => 'authorization_code',
            'redirect_uri'  => $rueckkehr,
            'code'          => $code,
        ]);

        $zugriff = (string) ($token['access_token'] ?? '');
        if ($zugriff === '') {
            throw new OauthFehler('Instagram hat kein Zugriffstoken geschickt.');
        }

        $ich = Netz::get($e['ich'] . '?' . http_build_query([
            'fields'       => 'id,username',
            'access_token' => $zugriff,
        ]));

        $sub = (string) ($ich['id'] ?? ($token['user_id'] ?? ''));
        if ($sub === '') {
            throw new OauthFehler('Instagram hat keine Kontokennung geschickt.');
        }

        return [
            'anbieter'        => 'instagram',
            'sub'             => $sub,
            'mail'            => '',
            'mail_bestaetigt' => false,
            'name'            => mb_substr(trim((string) ($ich['username'] ?? '')), 0, 120),
            'weiter'          => $weiter,
        ];
    }

    /**
     * Der Name bei Apple.
     *
     * Er steht nicht im Token, sondern kommt einmalig als Formularfeld
     * mit – beim allerersten Mal und nie wieder. Wer ihn dort nicht
     * aufhebt, bekommt ihn nie: Auch das Löschen und Neuanlegen des
     * Kontos hilft nicht, dazu müsste der Nutzer die Anwendung in seinen
     * Apple-Einstellungen erst wieder abmelden.
     */
    private static function appleName(string $roh): string
    {
        if ($roh === '') {
            return '';
        }
        $d = json_decode($roh, true);
        if (!is_array($d)) {
            return '';
        }
        $n = $d['name'] ?? [];
        $teile = array_filter([
            trim((string) ($n['firstName'] ?? '')),
            trim((string) ($n['lastName'] ?? '')),
        ], static fn ($x) => $x !== '');
        return mb_substr(implode(' ', $teile), 0, 120);
    }

    /**
     * Ob die Adresse als bestätigt gilt – die Frage, an der die
     * Kontenübernahme hängt.
     *
     * Google sagt es ausdrücklich mit `email_verified`. Microsoft nicht:
     * Dort ist die Adresse eines Geschäftskontos vom Mandanten vergeben
     * und damit belegt, die eines privaten Kontos aber frei wählbar und
     * nur bestätigt, wenn Microsoft sie geprüft hat. Deshalb gilt hier
     * nur, was aus dem Verzeichnis kommt (`preferred_username` bei
     * einem Geschäftskonto), als bestätigt.
     *
     * @return array{0:string,1:bool}
     */
    private static function mailAus(string $anbieter, array $inhalt): array
    {
        /* Apple sagt es wie Google ausdrücklich. Eine Besonderheit gibt
           es doch: Wer „E-Mail-Adresse verbergen“ wählt, bekommt eine
           Weiterleitungsadresse bei privaterelay.appleid.com. Die geht,
           solange die Anwendung angemeldet bleibt und die Absenderdomain
           bei Apple hinterlegt ist – ist sie das nicht, kommt keine Mail
           an und niemand merkt es. Der Hinweis dazu steht in DEPLOY.md. */
        if ($anbieter === 'apple') {
            $mail = mail_normal((string) ($inhalt['email'] ?? ''));
            $bestaetigt = $mail !== '' && (
                ($inhalt['email_verified'] ?? null) === true
                || ($inhalt['email_verified'] ?? null) === 'true'
            );
            return [$mail, $bestaetigt];
        }
        if ($anbieter === 'google') {
            $mail = mail_normal((string) ($inhalt['email'] ?? ''));
            return [$mail, $mail !== '' && !empty($inhalt['email_verified'])];
        }

        // Microsoft
        $mail = mail_normal((string) ($inhalt['email'] ?? ''));
        if ($mail === '') {
            $u = (string) ($inhalt['preferred_username'] ?? '');
            $mail = mail_gueltig($u) ? mail_normal($u) : '';
        }
        /* 9188040d-… ist der Mandant für private Microsoft-Konten. Alles
           andere ist ein Geschäfts- oder Schulkonto: Dort ist die Adresse
           vom Arbeitgeber vergeben und damit so belegt, wie sie es sein
           kann. Bei privaten Konten bleibt sie hier unbestätigt – es
           entsteht dann ein eigenes Konto statt einer Übernahme. */
        $privat = ($inhalt['tid'] ?? '') === '9188040d-6c67-4c5b-b112-36a304b66dad';
        $bestaetigt = $mail !== '' && !$privat;
        if (!empty($inhalt['email_verified'])) {
            $bestaetigt = $mail !== '';
        }
        return [$mail, $bestaetigt];
    }

    /** Bei `common` steht die Mandantenkennung im Token selbst. Erlaubt
        ist deshalb genau der Aussteller, der zu dieser Kennung gehört –
        nicht „irgendein login.microsoftonline.com“. */
    private static function microsoftAussteller(string $token): array
    {
        $teile = explode('.', $token);
        $inhalt = count($teile) === 3 ? json_decode(b64u_dekodieren($teile[1]), true) : null;
        $tid = is_array($inhalt) ? (string) ($inhalt['tid'] ?? '') : '';
        if (!preg_match('/^[0-9a-fA-F-]{36}$/', $tid)) {
            throw new OauthFehler('Dem Token fehlt die Mandantenkennung.');
        }
        return ["https://login.microsoftonline.com/$tid/v2.0"];
    }

    /* Der Vorgang ist unter einer eigenen Kennung abgelegt, nicht unter
       dem `state` selbst: So steht der Wert, den der Browser sieht,
       nirgends in der Datenbank. Gefunden wird er über den Hash. */
    private static function vorgangKennung(string $state): string
    {
        $z = Db::zeile(
            'SELECT kennung FROM tt_vorgang WHERE art = ? AND geheim_hash = ?',
            ['oauth', merkmal_hash($state)]
        );
        return $z ? (string) $z['kennung'] : '';
    }
}
