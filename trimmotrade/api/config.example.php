<?php
/* =====================================================================
   TrimmoTrade – Konfiguration

   Diese Datei nach `config.php` kopieren und ausfüllen. `config.php`
   selbst gehört nicht ins Versionsverzeichnis und wird von der
   .htaccess für Besucher gesperrt.

   Alles, was hier leer bleibt, schaltet die zugehörige Anmeldeart
   einfach ab – die Anwendung läuft dann mit den übrigen Verfahren
   weiter und sagt an der Oberfläche, welche fehlen. Es gibt keinen
   Zustand, in dem eine halb eingerichtete Anmeldeart so tut, als
   funktioniere sie.
   ===================================================================== */

return [

  /* --- Adresse ------------------------------------------------------
     Ohne Schrägstrich am Ende. Muss exakt der Adresse entsprechen, unter
     der die Seite erreichbar ist – Google, Microsoft und WebAuthn
     vergleichen darauf zeichengenau. */
  'basis' => 'https://www.trimmotrade.de',

  /* Der Name der Domain ohne Schema und ohne Port. Für WebAuthn („Relying
     Party ID“). Ein Passkey, der hierfür angelegt wurde, funktioniert
     auch auf Unterdomains – aber nie auf einer anderen Domain. Das ist
     der Schutz gegen nachgebaute Anmeldeseiten.

     Achtung: `www.trimmotrade.de` und `trimmotrade.de` sind für WebAuthn
     nicht dasselbe. Wer `trimmotrade.de` einträgt, dessen Passkeys gelten
     auf beiden; wer `www.trimmotrade.de` einträgt, sperrt sich die Variante
     ohne www aus. Deshalb hier die kürzere Form – und in der .htaccess
     die Umleitung auf www. */
  'rp_id'   => 'trimmotrade.de',
  'rp_name' => 'TrimmoTrade',

  /* --- Datenbank ----------------------------------------------------
     Bei netcup im Kundenkonto (CCP) unter „Datenbanken“ anzulegen. Der
     Servername ist dort nicht `localhost`, sondern eine eigene Adresse
     der Form xxxxx.kasserver.com bzw. die im CCP angezeigte. */
  'db' => [
    'treiber' => 'mysql',          // 'mysql' oder 'sqlite'
    'host'    => 'localhost',
    'port'    => 3306,
    'name'    => 'k123456_trimmotrade',
    'nutzer'  => 'k123456_tt',
    'pass'    => '',
    'datei'   => __DIR__ . '/daten/trimmotrade.sqlite',   // nur für sqlite
  ],

  /* --- E-Mail-Versand -----------------------------------------------
     'art' => 'smtp'  – empfohlen. Zugangsdaten des Postfachs, das bei
                        netcup zur Domain gehört.
     'art' => 'mail'  – PHP-eigenes mail(). Braucht keine Zugangsdaten,
                        landet aber deutlich häufiger im Spam-Ordner.
     'art' => 'log'   – schreibt die Mail nach api/daten/mail.log, statt
                        sie zu senden. Zum Ausprobieren.
     'art' => ''      – Anmeldung per E-Mail-Code abgeschaltet. */
  'mail' => [
    'art'      => 'smtp',
    'von'      => 'anmeldung@trimmotrade.de',
    'von_name' => 'TrimmoTrade',
    'antwort'  => 'hallo@trimmotrade.de',
    'smtp' => [
      'host'  => 'mail.trimmotrade.de',
      'port'  => 587,              // 587 = STARTTLS, 465 = direktes TLS
      'tls'   => 'start',          // 'start' | 'direkt' | 'nein'
      'nutzer'=> 'anmeldung@trimmotrade.de',
      'pass'  => '',
    ],
  ],

  /* --- Anmeldung über fremde Konten ---------------------------------
     Beide optional. Fehlt das Geheimnis, verschwindet der Knopf. Wie die
     Werte zu beschaffen sind, steht in DEPLOY.md. */
  'oauth' => [
    'google' => [
      'client_id'     => '',
      'client_secret' => '',
    ],
    'microsoft' => [
      'client_id'     => '',
      'client_secret' => '',
      // 'common' = private und geschäftliche Konten,
      // 'organizations' = nur geschäftliche, oder eine Mandanten-ID.
      'mandant'       => 'common',
    ],
  ],

  /* --- Schrauben ----------------------------------------------------
     Sinnvolle Vorgaben; anfassen muss man das normalerweise nicht. */
  'code_gueltig_min'   => 10,     // Wie lange ein E-Mail-Code gilt
  'code_versuche'      => 5,      // Fehlversuche je Code
  'sitzung_tage'       => 30,     // Wie lange man angemeldet bleibt
  'sitzung_erneuern_h' => 24,     // Ab wann die Frist beim Besuch verlängert wird

  /* Sperren: [Anzahl, Zeitfenster in Minuten]. Erste Zahl je Kennung
     (E-Mail-Adresse), zweite je IP-Adresse. Die IP-Grenze ist bewusst
     großzügig, weil hinter einer Adresse ein ganzes Bürohaus stecken kann. */
  'grenze' => [
    'code_anfordern' => ['kennung' => [5, 60],  'ip' => [30, 60]],
    'code_pruefen'   => ['kennung' => [10, 60], 'ip' => [60, 60]],
    'passkey'        => ['kennung' => [20, 60], 'ip' => [60, 60]],
    'oauth'          => ['kennung' => [20, 60], 'ip' => [60, 60]],
  ],

  /* Auf true setzen, solange etwas nicht läuft: dann stehen echte
     Fehlermeldungen in der Antwort statt nur „Da ist etwas schiefgegangen“.
     Im Betrieb false – Fehlermeldungen verraten Angreifern zu viel. */
  'entwicklung' => false,
];
