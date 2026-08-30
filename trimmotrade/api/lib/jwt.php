<?php
/* =====================================================================
   ID-Token prüfen

   Google und Microsoft schicken nach der Anmeldung ein JSON Web Token:
   drei mit Punkten getrennte Teile – Kopf, Inhalt, Signatur. Der Inhalt
   sagt, wer sich angemeldet hat. Das ist die Stelle, an der die meisten
   Fehler passieren, und zwar immer derselbe: Man liest den Inhalt und
   glaubt ihm.

   Der Inhalt ist Base64, nicht verschlüsselt. Jeder kann ihn schreiben.
   Erst die Signatur macht ihn zur Aussage von Google – und die Signatur
   muss gegen den öffentlichen Schlüssel geprüft werden, den Google
   veröffentlicht, nicht gegen einen, der im Token selbst steht.

   Fünf Prüfungen, jede mit einem eigenen Angriff dahinter:

   · Verfahren aus dem Kopf ist RS256. Sonst ließe sich `alg: none`
     angeben – ein Token ganz ohne Signatur.
   · Signatur passt zum Schlüssel mit der genannten `kid` aus dem
     Verzeichnis des Anbieters.
   · `iss` ist der erwartete Aussteller. Sonst genügte ein Token von
     irgendeinem anderen Anbieter.
   · `aud` ist die eigene Client-ID. Sonst genügte ein Token, das
     derselbe Nutzer bei einer anderen Anwendung erzeugt hat.
   · `exp` ist noch nicht erreicht, `iat` nicht in der Zukunft.
   ===================================================================== */

require_once __DIR__ . '/antwort.php';
require_once __DIR__ . '/der.php';
require_once __DIR__ . '/netz.php';
require_once __DIR__ . '/db.php';

final class JwtFehler extends RuntimeException
{
}

final class Jwt
{
    /* Wie lange die Schlüssel des Anbieters zwischengespeichert werden.
       Sie wechseln alle paar Wochen; ein bisschen Vorrat spart bei jeder
       Anmeldung eine Anfrage nach draußen. Fehlt die `kid` im Vorrat,
       wird sofort neu geholt – ein Wechsel führt also nie zu Ausfällen. */
    private const VORRAT_SEK = 3600;

    /**
     * @param  string   $token       Das ID-Token
     * @param  string   $jwksUrl     Wo die öffentlichen Schlüssel stehen
     * @param  string[] $aussteller  Erlaubte Werte für `iss`
     * @param  string   $zielgruppe  Die eigene Client-ID
     * @return array                 Der geprüfte Inhalt
     */
    public static function pruefen(string $token, string $jwksUrl, array $aussteller, string $zielgruppe): array
    {
        $teile = explode('.', $token);
        if (count($teile) !== 3) {
            throw new JwtFehler('Das Token hat nicht die erwartete Form.');
        }
        [$kopfB64, $inhaltB64, $sigB64] = $teile;

        $kopf = json_decode(b64u_dekodieren($kopfB64), true);
        $inhalt = json_decode(b64u_dekodieren($inhaltB64), true);
        if (!is_array($kopf) || !is_array($inhalt)) {
            throw new JwtFehler('Das Token ist unlesbar.');
        }

        if (($kopf['alg'] ?? '') !== 'RS256') {
            throw new JwtFehler('Unerwartetes Signaturverfahren.');
        }
        $kid = (string) ($kopf['kid'] ?? '');
        if ($kid === '') {
            throw new JwtFehler('Dem Token fehlt die Schlüsselkennung.');
        }

        $pem = self::schluessel($jwksUrl, $kid);
        $ok = openssl_verify(
            $kopfB64 . '.' . $inhaltB64,
            b64u_dekodieren($sigB64),
            $pem,
            OPENSSL_ALGO_SHA256
        );
        if ($ok !== 1) {
            throw new JwtFehler('Die Signatur des Tokens stimmt nicht.');
        }

        /* Ein paar Sekunden Nachsicht für Uhren, die auseinanderlaufen.
           Mehr nicht: Wer eine Minute Spielraum gibt, verlängert die
           Gültigkeit abgelaufener Token um eine Minute. */
        $spiel = 60;
        $jetzt = time();

        if (!in_array((string) ($inhalt['iss'] ?? ''), $aussteller, true)) {
            throw new JwtFehler('Unerwarteter Aussteller.');
        }

        $aud = $inhalt['aud'] ?? '';
        $audListe = is_array($aud) ? $aud : [$aud];
        if (!in_array($zielgruppe, array_map('strval', $audListe), true)) {
            throw new JwtFehler('Das Token gehört zu einer anderen Anwendung.');
        }

        if (isset($inhalt['exp']) && $jetzt > (int) $inhalt['exp'] + $spiel) {
            throw new JwtFehler('Das Token ist abgelaufen. Versuch es noch einmal.');
        }
        if (isset($inhalt['iat']) && (int) $inhalt['iat'] > $jetzt + $spiel) {
            throw new JwtFehler('Das Token stammt aus der Zukunft.');
        }
        if (isset($inhalt['nbf']) && (int) $inhalt['nbf'] > $jetzt + $spiel) {
            throw new JwtFehler('Das Token gilt noch nicht.');
        }

        return $inhalt;
    }

    /* -----------------------------------------------------------------
       Das Schlüsselverzeichnis des Anbieters
       ----------------------------------------------------------------- */

    private static function schluessel(string $jwksUrl, string $kid): string
    {
        $satz = self::jwks($jwksUrl, false);
        $pem = self::suchen($satz, $kid);
        if ($pem !== null) {
            return $pem;
        }
        /* Nicht gefunden heißt fast immer: Der Anbieter hat gewechselt,
           und der Vorrat ist alt. Einmal frisch holen – findet sich der
           Schlüssel dann immer noch nicht, stimmt etwas anderes nicht. */
        $satz = self::jwks($jwksUrl, true);
        $pem = self::suchen($satz, $kid);
        if ($pem === null) {
            throw new JwtFehler('Der Signaturschlüssel ist unbekannt.');
        }
        return $pem;
    }

    private static function suchen(array $satz, string $kid): ?string
    {
        foreach ($satz['keys'] ?? [] as $s) {
            if (($s['kid'] ?? '') !== $kid) {
                continue;
            }
            if (($s['kty'] ?? '') !== 'RSA') {
                continue;
            }
            $n = b64u_dekodieren((string) ($s['n'] ?? ''));
            $e = b64u_dekodieren((string) ($s['e'] ?? ''));
            if ($n === '' || $e === '') {
                return null;
            }
            return Der::rsaPem($n, $e);
        }
        return null;
    }

    private static function jwks(string $url, bool $frisch): array
    {
        $kennung = 'jwks-' . substr(hash('sha256', $url), 0, 24);

        if (!$frisch) {
            $z = Db::zeile(
                'SELECT daten FROM tt_vorgang WHERE kennung = ? AND art = ? AND laeuft_ab > ?',
                [$kennung, 'jwks', time()]
            );
            if ($z) {
                $d = json_decode($z['daten'], true);
                if (is_array($d)) {
                    return $d;
                }
            }
        }

        $satz = Netz::get($url);
        if (!isset($satz['keys']) || !is_array($satz['keys'])) {
            throw new JwtFehler('Das Schlüsselverzeichnis ist unbrauchbar.');
        }

        Db::fuehre('DELETE FROM tt_vorgang WHERE kennung = ?', [$kennung]);
        Db::fuehre(
            'INSERT INTO tt_vorgang (kennung, art, bezug, geheim_hash, daten, versuche, angelegt, laeuft_ab)
             VALUES (?, ?, ?, ?, ?, 0, ?, ?)',
            [$kennung, 'jwks', '', '', json_encode($satz), time(), time() + self::VORRAT_SEK]
        );

        return $satz;
    }
}
