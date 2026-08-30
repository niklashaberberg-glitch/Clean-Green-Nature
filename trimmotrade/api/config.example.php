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

    /* Apple. Als Einziger nicht kostenlos: Es setzt eine Mitgliedschaft
       im Apple Developer Program voraus (99 € im Jahr).

       Und als Einziger ohne festes Geheimnis. Apple gibt einen privaten
       Schlüssel als .p8-Datei heraus; das Client-Geheimnis baut der
       Server daraus bei jeder Anfrage selbst. Deshalb vier Angaben
       statt zwei. */
    'apple' => [
      // Die Services-ID, NICHT die App-ID. Sieht aus wie
      // 'de.trimmotrade.web'.
      'client_id' => '',
      // Zehn Zeichen, steht oben rechts im Developer-Portal.
      'team_id'   => '',
      // Zehn Zeichen, gehört zum Schlüssel unten.
      'key_id'    => '',
      /* Der Schlüssel. Besser als Pfad: Dann liegt er in einer eigenen
         Datei mit engen Rechten (chmod 600) und nicht in derselben wie
         alles andere. Er lässt sich bei Apple genau einmal
         herunterladen – wer ihn verliert, legt einen neuen an. */
      'key_datei' => '',    // z. B. __DIR__ . '/AuthKey_ABC1234567.p8'
      'key_pem'   => '',    // Alternative: der Inhalt unmittelbar hier
    ],

    /* Instagram. Zwei Dinge vorweg, damit die Enttäuschung nicht auf
       dem Server passiert:

       ERSTENS gibt Instagram KEINE E-Mail-Adresse heraus. Es gibt dafür
       keinen Bereich, den man anfordern könnte. Wer sich so anmeldet,
       hat ein Konto, das nichts empfangen kann – keine Anfrage auf ein
       Inserat, keine Absage eines Besichtigungstermins, keinen Treffer
       aus einem Suchauftrag. Die Anwendung fängt das ab: Solche Konten
       stehen auf Stufe 0 und werden aufgefordert, eine Adresse
       nachzutragen. Erreichbar sind sie erst danach.

       ZWEITENS geht es nur mit Instagram-Konten vom Typ Business oder
       Creator, nicht mit privaten. Die meisten Wohnungssuchenden haben
       ein privates Konto und können diesen Weg gar nicht nutzen.

       Wer beides gelesen hat und ihn trotzdem anbieten will, trägt hier
       die Zugangsdaten einer Meta-App mit dem Produkt „Instagram API
       mit Instagram-Login“ ein. Die ältere Basic-Display-Schnittstelle,
       die viele Anleitungen noch nennen, ist seit Dezember 2024
       abgeschaltet. */
    'instagram' => [
      'client_id'     => '',
      'client_secret' => '',
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
    /* Der Markt. Großzügiger als die Anmeldung, weil hier niemand etwas
       durchprobieren kann – die Grenzen stehen gegen Massenversand und
       gegen den, der tausend Wohnungen erfindet. */
    'inserat'        => ['kennung' => [20, 1440], 'ip' => [40, 1440]],
    'bild'           => ['kennung' => [120, 60],  'ip' => [200, 60]],
    'anfrage'        => ['kennung' => [40, 1440], 'ip' => [80, 1440]],
    'melden'         => ['ip' => [20, 1440]],
    'gruppe'         => ['kennung' => [30, 1440], 'ip' => [60, 1440]],
  ],

  /* --- Wer diese Seite betreibt ---------------------------------------
     Impressum, Datenschutzerklärung und AGB greifen ausschließlich auf
     diese Werte zu. Sie gehören hierher und nicht in die Oberfläche:

     Was jemand in der Anwendung einträgt, liegt im Speicher **seines**
     Browsers. Für eine Einzeldatei auf einem Stick ist das richtig – da
     ist jeder sein eigener Betreiber. Auf einer Website ist es falsch:
     Dann sähe jeder Besucher „[Straße eintragen]“, egal was der
     Betreiber bei sich eingetragen hat. Die Impressumspflicht nach
     § 5 DDG wäre nicht erfüllt, und das ist der am häufigsten
     abgemahnte Fehler im deutschen Internet.

     Was hier steht, gilt für alle. Leere Felder erscheinen in den Texten
     sichtbar als Lücke – nicht still verschwunden.

     `php api/index.php pruefen` sagt, was noch fehlt. */
  'betreiber' => [
    'name'       => 'Niklas Haberberg',   // Pflicht: § 5 Abs. 1 Nr. 1 DDG
    'rechtsform' => 'Einzelunternehmen (Kleingewerbe)',
    'zusatz'     => 'TrimmoTrade',       // Geschäftsbezeichnung
    'strasse'    => 'Plankgasse 34',     // Pflicht: ladungsfähige Anschrift, kein Postfach
    'plz'        => '50668',
    'ort'        => 'Köln',
    'land'       => 'Deutschland',
    'email'      => 'info@trimmotrade.de',   // Pflicht: § 5 Abs. 1 Nr. 2 DDG
    /* Pflicht: § 5 Abs. 1 Nr. 2 DDG verlangt eine Angabe, die eine
       „unmittelbare Kommunikation“ erlaubt; die Rechtsprechung lässt
       dafür in der Regel die Telefonnummer verlangen. Ein
       Kontaktformular allein genügt nicht zuverlässig. */
    'telefon'    => '+49 163 502 1968',
    /* Postfach für Anfragen. Getrennt von der Impressumsadresse: Die
       eine ist Pflichtangabe, die andere ein Arbeitsweg – wer beides
       vermischt, kann später keine davon ändern. Diese Adresse ist
       zugleich die Kontaktstelle nach Art. 11 und 12 DSA. */
    'service'    => 'service@trimmotrade.de',
    'ustId'            => '',  // § 27a UStG – bei Kleinunternehmern meist keine
    'kleinunternehmer' => true, // § 19 UStG: kein Ausweis von Umsatzsteuer
    'handelsregister'  => '',  // Kleingewerbe: keins
    'gewerbeamt'       => '',  // zuständige Stelle der Gewerbeanmeldung
    /* Die zuständige Aufsichtsbehörde folgt aus dem Sitz, nicht aus einer
       Wahl: Für nicht-öffentliche Stellen in Nordrhein-Westfalen ist es
       die Landesbeauftragte für Datenschutz und Informationsfreiheit.
       Art. 13 Abs. 2 lit. d DSGVO verlangt den Hinweis auf das
       Beschwerderecht – ohne Namen der Behörde läuft er ins Leere. */
    'aufsichtsbehoerde' => 'Landesbeauftragte für Datenschutz und Informationsfreiheit '
        . 'Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf',
    'verantwortlichMStV' => '', // § 18 Abs. 2 MStV – Name und Anschrift
    'stand'      => '2026-08-26',
  ],

  /* --- Der Markt ------------------------------------------------------
     Ob neben den echten Inseraten ein erzeugter Beispielbestand laufen
     darf. Im Betrieb gehört hier **false** hin, und deshalb steht es
     hier so:

     Erfundene Wohnungen neben echten zu zeigen, ist nach § 5 UWG
     irreführend. Vor allem aber zerstört die erste Anfrage an eine
     erfundene Adresse genau das Vertrauen, von dem ein Wohnungsportal
     als einzigem lebt. Ein leerer Markt ist unangenehm; ein Markt mit
     Wohnungen, die es nicht gibt, ist das Ende.

     Auf true zu stellen ist nur für eine Vorführung sinnvoll – etwa,
     um jemandem zu zeigen, wie die Suche mit Inhalt aussieht. Jedes
     Beispiel trägt dann sichtbar das Wort „Beispiel“, und über der
     Trefferliste steht ein Hinweis, der sich nicht wegklicken lässt. */
  'beispielmarkt' => false,

  /* Wo die Bilder der Inserate liegen. Der Ordner ist für den Browser
     gesperrt; ausgeliefert wird über /api/bild/… */
  'bilder' => __DIR__ . '/daten/bilder',

  /* Auf true setzen, solange etwas nicht läuft: dann stehen echte
     Fehlermeldungen in der Antwort statt nur „Da ist etwas schiefgegangen“.
     Im Betrieb false – Fehlermeldungen verraten Angreifern zu viel. */
  'entwicklung' => false,
];
