# TrimmoTrade bei netcup einrichten

Diese Anleitung ist so geschrieben, dass sie von oben nach unten
abgearbeitet werden kann. Nach **Schritt 3** ist die Seite online und die
Anmeldung per E-Mail-Code funktioniert. Alles danach ist Zugabe: Passkeys,
Google, Microsoft. Wer nur einen Teil einrichtet, bekommt keine halb
kaputte Anwendung – nicht eingerichtete Verfahren erscheinen erst gar
nicht als Knopf.

**Was du brauchst:** dein netcup-Kundenkonto (CCP), einen FTP- oder
SFTP-Zugang, etwa eine Stunde. Programmierkenntnisse braucht es nicht.

---

## Übersicht: was wohin gehört

```
/                          ← Web-Wurzelverzeichnis der Domain
├── index.html             die Anwendung
├── assets/                Stil und Skripte
├── api/                   die Serverseite (PHP)
│   ├── index.php
│   ├── config.php         ← die legst DU an (aus config.example.php)
│   ├── lib/
│   └── daten/             ← muss beschreibbar sein
├── .htaccess              Umleitungen, Kopfzeilen, Kompression
├── robots.txt, sitemap.xml
├── favicon.svg, icon-*.png, apple-touch-icon.png, vorschau.png
├── 404.html
└── wohnungstausch.html, mietpreisbremse-pruefen.html,
    nebenkostenabrechnung-pruefen.html, wohnberechtigungsschein.html,
    wohnung-verkaufen-vorbereiten.html
```

Der Ordner `dist/` und die Dateien `build.js`, `scripts/`, `README.md`,
`DEPLOY.md` und `api/schema-ausgeben.php` gehören **nicht** auf den
Server. Sie schaden dort nicht, aber sie haben nichts verloren.

---

## Schritt 1 · Domain und TLS

1. Im **CCP** unter *Produkte → Webhosting → Domains* die Domain
   `trimmotrade.de` dem Webhosting-Paket zuordnen.
2. Als Dokumentenstamm (*Document Root*) das Verzeichnis wählen, in das
   du gleich hochlädst – üblicherweise `/httpdocs` oder `/www`.
3. Unter *SSL* ein **Let's-Encrypt-Zertifikat** ausstellen lassen, und
   zwar für `trimmotrade.de` **und** `www.trimmotrade.de`. Beide, nicht
   nur eines: Die `.htaccess` leitet auf `www` um, und eine Umleitung auf
   eine Adresse ohne gültiges Zertifikat ist eine Fehlermeldung.
4. Warten, bis das Zertifikat wirklich ausgestellt ist. Erst dann
   weitermachen – die HSTS-Zeile in der `.htaccess` sagt Browsern, sie
   sollen ein Jahr lang nur noch verschlüsselt zugreifen. Steht TLS
   dann nicht, ist die Seite für diese Besucher ein Jahr lang tot.

> **Falls es später klemmt:** Die Zeile
> `Header always set Strict-Transport-Security …` in der `.htaccess`
> lässt sich mit einem `#` davor vorübergehend abschalten.

**PHP-Version prüfen:** im CCP unter *Webhosting → PHP*. Nötig ist
**PHP 8.1 oder neuer**; 8.2 oder 8.3 sind die gute Wahl. Die
Erweiterungen `pdo_mysql`, `openssl`, `mbstring`, `json` und `curl` sind
bei netcup standardmäßig an.

---

## Schritt 2 · Datenbank anlegen

1. Im CCP unter *Datenbanken* eine **neue MariaDB-Datenbank** anlegen.
2. Notiere dir vier Angaben – du brauchst sie gleich alle:
   - **Servername** (etwas wie `mysqlxxx.netcup.net`, **nicht**
     `localhost`; welcher genau, steht im CCP an der Datenbank)
   - **Datenbankname**
   - **Benutzername**
   - **Passwort**
3. Tabellen musst du **nicht** anlegen. Die Anwendung tut das beim ersten
   Aufruf selbst. (Wer es lieber von Hand macht oder dessen Benutzer
   keine Tabellen anlegen darf: `api/schema.sql` einmal über phpMyAdmin
   einspielen.)

---

## Schritt 3 · Dateien hochladen und einstellen

1. Alles aus dem Ordner `trimmotrade/` in den Dokumentenstamm laden –
   ohne `dist/`, `scripts/`, `build.js`, `README.md`, `DEPLOY.md`.
   Achte darauf, dass auch die versteckten Dateien mitkommen:
   `.htaccess` und der Ordner `.well-known/`. Viele FTP-Programme
   blenden sie aus; bei FileZilla: *Server → Versteckte Dateien
   anzeigen*.
2. `api/config.example.php` auf dem Server nach **`api/config.php`**
   kopieren und öffnen.
3. Ausfüllen:

   ```php
   'basis'   => 'https://www.trimmotrade.de',
   'rp_id'   => 'trimmotrade.de',          // ohne www – siehe Kasten unten

   'db' => [
     'treiber' => 'mysql',
     'host'    => 'mysqlxxx.netcup.net',   // aus Schritt 2
     'name'    => 'DEIN_DATENBANKNAME',
     'nutzer'  => 'DEIN_BENUTZER',
     'pass'    => 'DEIN_PASSWORT',
   ],
   ```

4. Dem Ordner **`api/daten/`** Schreibrechte geben (CHMOD **770**, bei
   manchen Paketen 775). Dort liegt sonst nichts – bei MariaDB bleibt er
   leer –, aber der Mailversand im Probemodus schreibt hinein.

> ### Warum `rp_id` ohne `www`
> Ein Passkey ist an einen Domainnamen gebunden. Trägst du
> `www.trimmotrade.de` ein, gilt er **nur** dort; wer die Seite je unter
> `trimmotrade.de` aufruft, kann sich nicht anmelden. Mit
> `trimmotrade.de` gilt er für beide Schreibweisen. Deshalb: die kurze
> Form eintragen und die `.htaccess` auf `www` umleiten lassen.
> Ändere das später nicht mehr – alle bestehenden Passkeys würden
> ungültig.

**Jetzt prüfen:** `https://www.trimmotrade.de/api/status` im Browser
aufrufen. Erwartet wird eine Zeile wie

```json
{"ok":true,"eingerichtet":true,"verfahren":["passkey"],…}
```

- `"eingerichtet":false` → `api/config.php` fehlt oder ist nicht lesbar.
- Eine leere Seite oder ein 500er → siehe **Wenn etwas klemmt** unten.
- `"verfahren":["passkey"]` → richtig; `mail` kommt in Schritt 4 dazu.

---

## Schritt 4 · E-Mail-Versand (Anmeldung per Code)

Ohne diesen Schritt gibt es keinen Anmeldeknopf „Mit E-Mail-Adresse“.

1. Im CCP unter *Mail* ein Postfach anlegen, etwa
   **`anmeldung@trimmotrade.de`**. Passwort notieren.
2. In `api/config.php` eintragen:

   ```php
   'mail' => [
     'art'      => 'smtp',
     'von'      => 'anmeldung@trimmotrade.de',
     'von_name' => 'TrimmoTrade',
     'antwort'  => 'hallo@trimmotrade.de',   // wohin Antworten sollen
     'smtp' => [
       'host'   => 'mail.trimmotrade.de',    // oder der im CCP genannte
       'port'   => 587,
       'tls'    => 'start',
       'nutzer' => 'anmeldung@trimmotrade.de',
       'pass'   => 'DAS_POSTFACH_PASSWORT',
     ],
   ],
   ```

3. **SPF und DKIM einschalten.** Im CCP unter *Mail → Einstellungen*
   bzw. bei der DNS-Verwaltung der Domain. Das ist keine Kür: Eine
   Anmeldemail im Spam-Ordner ist eine Anmeldung, die nicht stattfindet.
   - SPF: netcup trägt den passenden Eintrag auf Knopfdruck ein.
   - DKIM: ebenfalls im CCP zu aktivieren.
   - DMARC (freiwillig, aber gut): TXT-Eintrag auf `_dmarc.trimmotrade.de`
     mit dem Wert `v=DMARC1; p=none; rua=mailto:postmaster@trimmotrade.de`

4. **Prüfen:** Seite aufrufen, „Mit E-Mail-Adresse“ wählen, eigene
   Adresse eintragen. Der Code muss binnen einer Minute ankommen.

Kommt nichts an: `'art' => 'log'` setzen, es noch einmal versuchen und in
`api/daten/mail.log` nachsehen. Steht der Code dort, ist der Ablauf in
Ordnung und es hakt nur am Versand. Dann `'art' => 'mail'` probieren –
das nutzt den Versand des Webservers und braucht keine Zugangsdaten,
landet aber häufiger im Spam.

---

## Schritt 5 · Anmeldung über Google

**In der Google Cloud Console** (console.cloud.google.com):

1. Oben links ein **Projekt anlegen**, etwa „TrimmoTrade“.
2. *APIs & Dienste → OAuth-Zustimmungsbildschirm*:
   - Nutzertyp **Extern**, dann *Erstellen*.
   - App-Name `TrimmoTrade`, Support-E-Mail, Logo (optional).
   - **Autorisierte Domains:** `trimmotrade.de`
   - Bereiche: `openid`, `.../auth/userinfo.email`,
     `.../auth/userinfo.profile` – mehr nicht. Wer mehr anfordert,
     braucht eine Überprüfung durch Google und bekommt sie für diese
     drei nicht.
   - Veröffentlichungsstatus auf **In Produktion** setzen. Solange er
     auf „Testing“ steht, können sich nur eingetragene Testnutzer
     anmelden.
3. *APIs & Dienste → Anmeldedaten → Anmeldedaten erstellen →
   OAuth-Client-ID*:
   - Anwendungstyp: **Webanwendung**
   - Autorisierte JavaScript-Quellen:
     `https://www.trimmotrade.de`
   - **Autorisierte Weiterleitungs-URIs** – zeichengenau, mit `https`,
     mit `www`, ohne Schrägstrich am Ende:

     ```
     https://www.trimmotrade.de/api/oauth/zurueck
     ```

4. **Client-ID** und **Client-Geheimnis** kopieren und in
   `api/config.php` eintragen:

   ```php
   'google' => [
     'client_id'     => '…….apps.googleusercontent.com',
     'client_secret' => 'GOCSPX-……',
   ],
   ```

Erscheint beim Anmelden „Fehler 400: redirect_uri_mismatch“, stimmt die
Weiterleitungs-URI nicht auf das Zeichen genau überein. Häufigste
Ursachen: `http` statt `https`, fehlendes `www`, ein Schrägstrich zu
viel.

---

## Schritt 6 · Anmeldung über Microsoft

**Im Azure-Portal** (portal.azure.com) unter *Microsoft Entra ID →
App-Registrierungen*:

1. **Neue Registrierung**:
   - Name: `TrimmoTrade`
   - Unterstützte Kontotypen: **Konten in einem beliebigen
     Organisationsverzeichnis und persönliche Microsoft-Konten**
     (entspricht dem Mandanten `common`).
   - Umleitungs-URI: Plattform **Web**, Adresse

     ```
     https://www.trimmotrade.de/api/oauth/zurueck
     ```

2. Auf der Übersichtsseite die **Anwendungs-ID (Client)** kopieren.
3. *Zertifikate & Geheimnisse → Neuer Geheimer Clientschlüssel*.
   **Wichtig:** Der Wert ist nur ein einziges Mal sichtbar – sofort
   kopieren. Kopiere den **Wert**, nicht die *Geheimnis-ID*.
   Notiere dir das Ablaufdatum; nach 6, 12 oder 24 Monaten muss der
   Schlüssel erneuert werden, sonst hört die Anmeldung an einem
   Dienstagmorgen ohne Vorwarnung auf zu funktionieren.
4. *API-Berechtigungen*: `openid`, `email`, `profile` (Microsoft Graph,
   delegiert). Mehr wird nicht gebraucht.
5. In `api/config.php`:

   ```php
   'microsoft' => [
     'client_id'     => '……-……-……-……-……',
     'client_secret' => 'DER_WERT_AUS_SCHRITT_3',
     'mandant'       => 'common',
   ],
   ```

---

## Schritt 7 · Impressum und Kontaktangaben

Die Anwendung zeigt selbst an, was noch fehlt: Ruf
`https://www.trimmotrade.de/#/recht/angaben` auf. Dort stehen alle
Pflichtangaben nach § 5 DDG mit einem Zähler, wie viele noch offen sind.

Einzutragen sind sie in **`assets/recht.js`** (ganz oben im
`ANGABEN`-Objekt): Name, Anschrift, E-Mail, Telefon, ggf.
Umsatzsteuer-ID und Aufsichtsbehörde. Danach die Datei erneut hochladen.

Ohne diese Angaben ist die Seite abmahnfähig. Das ist kein Randthema:
Impressumsverstöße sind der häufigste Grund für Abmahnungen gegen kleine
Websites.

---

## Schritt 8 · Bei Suchmaschinen anmelden

1. **Google Search Console** (search.google.com/search-console):
   Property `https://www.trimmotrade.de` anlegen, über den DNS-Eintrag
   oder die HTML-Datei bestätigen, dann unter *Sitemaps* eintragen:

   ```
   https://www.trimmotrade.de/sitemap.xml
   ```

2. **Bing Webmaster Tools** (bing.com/webmasters): dasselbe. Bing lässt
   sich mit einem Klick aus der Search Console importieren.

3. Prüfen, dass `https://www.trimmotrade.de/robots.txt` erreichbar ist
   und die Sitemap nennt.

Danach dauert es einige Tage bis Wochen, bis die Seite in den
Ergebnissen auftaucht. Die fünf Ratgeberseiten
(`wohnungstausch.html` und die anderen) sind dabei das Zugpferd: Die
Anwendung selbst ist für Suchmaschinen weitgehend unsichtbar, weil ihre
Inhalte erst im Browser entstehen.

---

## Schritt 9 · Aufräumauftrag (freiwillig)

Abgelaufene Anmeldecodes und alte Sitzungen räumt die Anwendung
gelegentlich beim normalen Zugriff selbst weg. Wer das lieber geordnet
hat, legt im CCP unter *Cronjobs* einen täglichen Auftrag an:

```
php /pfad/zum/dokumentenstamm/api/index.php aufraeumen
```

Nötig ist er nicht. Er nimmt den Besuchern nur ein paar Millisekunden ab.

---

## Wenn etwas klemmt

| Was du siehst | Was los ist |
|---|---|
| `api/status` liefert eine **leere Seite** oder HTTP 500 | PHP-Fehler. Im CCP unter *Logs* das Fehlerprotokoll ansehen. Zum Suchen in `api/config.php` `'entwicklung' => true` setzen – dann steht der Grund in der Antwort. **Danach unbedingt wieder auf `false`.** |
| `api/status` liefert die **Datei im Klartext** statt JSON | PHP läuft für dieses Verzeichnis nicht. Im CCP die PHP-Version für die Domain setzen. |
| **404** auf `api/status` | Die `.htaccess` fehlt (versteckte Datei nicht mitgeladen) oder `mod_rewrite` ist aus. |
| „Datenbank nicht erreichbar“ | Servername, Benutzer oder Passwort stimmen nicht. Bei netcup ist der Host **nicht** `localhost`. |
| Anmeldemail kommt nicht an | Erst Spam-Ordner. Dann `'art' => 'log'` und in `api/daten/mail.log` sehen. Dann SPF/DKIM prüfen. |
| Passkey: „Diese Anmeldung kam von einer anderen Adresse“ | `'basis'` in der Konfiguration stimmt nicht mit der aufgerufenen Adresse überein – meist fehlt `www` oder es steht `http` statt `https`. |
| Passkey: „gehört zu einer anderen Adresse“ | `rp_id` wurde nachträglich geändert. Zurückändern; sonst sind alle bestehenden Passkeys ungültig. |
| Google: `redirect_uri_mismatch` | Die Weiterleitungs-URI in der Cloud Console stimmt nicht zeichengenau. |
| Microsoft: `AADSTS7000215` | Falsches Client-Geheimnis – vermutlich wurde die Geheimnis-**ID** statt des **Werts** kopiert. |
| Nach Wochen: „unauthorized_client“ bei Microsoft | Das Client-Geheimnis ist abgelaufen. Im Azure-Portal ein neues erzeugen. |

---

## Was regelmäßig zu tun ist

- **Microsoft-Geheimnis erneuern**, bevor es abläuft (Datum notieren).
- **Let's-Encrypt-Zertifikat**: netcup erneuert es selbst; einmal im Jahr
  nachsehen schadet nicht.
- **PHP-Version**: bleibt die Anwendung stehen, weil netcup eine alte
  Version abschaltet, im CCP auf die nächste stellen. Die Anwendung
  läuft mit allem ab 8.1.
- **Datensicherung**: netcup sichert das Webhosting-Paket. Die Datenbank
  enthält ausschließlich Konten – ist sie weg, müssen sich alle neu
  anmelden, verloren geht nichts anderes. Der eigentliche Inhalt der
  Anwendung liegt ohnehin in den Browsern der Nutzenden.

---

## Was der Server *nicht* tut

Damit klar ist, was hier verantwortet wird: Der Server beantwortet
ausschließlich die Frage, wer jemand ist. Er speichert Kontonummer,
E-Mail-Adresse, Name, Verfahren, Vertrauensstufe, die öffentlichen Teile
der Passkeys und die offenen Sitzungen. Inserate, Merklisten,
Nachrichten, Notizen, Profile, Bilder und der Dokumententresor bleiben im
Browser der Nutzenden und erreichen ihn nie.

Das ist eine Entscheidung, keine Auslassung: Ein Anmeldeserver, der
nichts weiter speichert, ist ein kleines Ziel – und ein kleines Ziel ist
die beste Vorsorge.
