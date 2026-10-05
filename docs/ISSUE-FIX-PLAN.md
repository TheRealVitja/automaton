# Upstream-Prüfung und Fixplan

Stand: 2026-10-05; geprüft gegen Fork-Commit `d8f8168`.
Quelle: https://github.com/Conway-Research/automaton/issues (offen und geschlossen).

## Zweck des Programms

Automaton ist eine TypeScript/Node.js-Runtime für einen dauerhaft laufenden
KI-Agenten. Sie verbindet Inferenz, Shell-/Dateiwerkzeuge, SQLite-Persistenz,
Gedächtnis, Heartbeat-Aufgaben, Wallets (EVM/Solana), Conway-Dienste und
Child-Agenten. Das erklärte Ziel ist ein Agent, der durch bezahlte Arbeit seine
Rechenkosten deckt und sich weiterentwickeln kann. Das Repository liefert die
Runtime; Cloud-Backend, Dashboard, Zahlungsabwicklung und Inferenzanbieter
liegen außerhalb dieses Repositories. Die README beschreibt ein Ziel, keinen
Nachweis wirtschaftlicher Selbstständigkeit.

## Vorgehen und Reihenfolge

1. Alle GitHub-Issues und zugehörigen Kommentare archivieren; Pull Requests
   ausschließen. Jede Issue bekommt Gruppe, Priorität, Befund und Codebeleg.
2. Bestehenden Fork prüfen: Typecheck, Build und Testbaseline. Geschlossene
   Issues erneut mit dem heutigen Code vergleichen; offen bedeutet nicht
   automatisch ungefixt, geschlossen nicht automatisch technisch gelöst.
3. P1 Zahlungs- und Netzwerkfehler beheben: einmal verwendbare SIWE-Verifikation
   nicht wiederholen; Zahlungsabsichten deduplizieren; tatsächliche
   Transferergebnisse prüfen; Guthabenreserve und konkurrierende Transfers
   schützen; externe URLs gegen private IPs, DNS-Wechsel und Redirects absichern.
4. P1/P2 Werkzeugschutz reparieren: gemeinsame Shell-Schutzregeln, validierte
   Git-Hashes und npm-Namen, sichere Ausführung installierter Programme,
   Sanitizing für x402-Ergebnisse.
5. P1/P2 Betriebsfehler reparieren: tote lokale Worker aus der Wiedervergabe
   ausschließen, Child-Konfiguration explizit übergeben, Benutzerverzeichnis
   plattformgerecht auflösen, Modellkonfiguration konsistent weitergeben.
6. Installation und Tests reparieren: npm-Build ohne vorausgesetztes pnpm,
   synchronisierte npm-Lockdatei, korrekte Dateipfade in Source-Tests.
7. Regressionstests für bestätigte Fehler, anschließend kompletter Testlauf,
   Typecheck und Build. Befunde und verbleibende Grenzen dokumentieren.

## Abgrenzung der Befunde

- **Bestätigter Bug:** Fehler im vorliegenden Code mit reproduzierbarer Ursache.
- **Bereits behoben:** die gemeldete Ursache ist im Fork beseitigt; Code/Test
  genannt, nicht allein der Issue-Status.
- **Extern:** gemeldeter Fehler liegt in einem nicht enthaltenen Dienst;
  aktuelle Störung wird ohne eigene Live-Reproduktion nicht behauptet.
- **Unklar:** für eine Diagnose fehlen Konfiguration, Logs oder Reproduktion.
- **Vorschlag/Support:** kein konkreter Defekt der Runtime.
- **Architekturgrenze:** reale Grenze, die eine zusätzliche Architektur benötigt,
  etwa OS-Isolation für eine Runtime mit bewusst erlaubtem Shellzugriff.

Es werden keine echten Zahlungen, Sandbox-Bestellungen oder Agentenstarts mit
produktiven Zugangsdaten für Tests ausgeführt. Serviceausfälle, Rückerstattungen
und Dashboardänderungen können mit Änderungen an dieser Runtime nicht erledigt
werden.

## Umgesetzt

| Bereich | Beleg / Ergebnis |
|---|---|
| Provisionierung | `verify` und API-Key-Erzeugung ohne Wiederholung bei unklarem Ergebnis; ursprüngliche Serverfehler bleiben sichtbar. |
| Zahlungen | SQLite-Claim vor dem ersten Netzwerkaufruf, ein Idempotency-Key für beide x402-Schritte, gemeinsame Sperre für Bootstrap/Heartbeat/Tools/CLI, Ausgabenlimit vor Signatur, keine Wiederholung mutierender Requests. |
| Transfers | Gemeinsamer Prozess-Lock für `transfer_credits`/`fund_child`, frisches Guthaben und Mindestreserve, akzeptierten API-Status prüfen, fehlgeschlagene Transfers nicht als Ausgaben buchen; Child-Funding erhält dieselben Policylimits. |
| Externe URLs | Öffentliches HTTPS ohne URL-Credentials; alle DNS-Antworten prüfen und Socket an geprüfte IP binden; private/numerische Adressen und Redirects sperren; DNS-Abbruch, Zeit- und Antwortgrößenlimit; Git-Transport ebenfalls einschränken und DNS pinnen. |
| Werkzeugschutz | Gemeinsame Shellregeln auch ohne Policy-Engine, Git-Hashprüfung, npm-Namen ohne Optionen/Pfade, ausführbare Datei und getrennte Argumente für installierte Tools, x402-Output sanitizen. |
| Orchestrierung | Tote Worker aus der Wiedervergabe nehmen; sowohl `assigned` als auch `running` zurücksetzen. Child-Limit/RAM explizit übergeben, vorhandenes Checkout wiederverwenden, fehlgeschlagene Installation abbrechen. |
| Konfiguration | OS-Benutzerverzeichnis statt `/root`-Fallback, konsistente Modellwahl, Start mit bestehender Ollama-/BYOK-Konfiguration ohne Conway-Key. Lokale Modelle waren teilweise bereits vorhanden. |
| Heartbeat/Persistenz | `lowComputeMultiplier` wirkt für nicht essentielle Cron-/Intervallaufgaben; ungültige Lifecycle-Transitions bleiben aus autoritativer Historie; falsche/null JSON-Form wird durch vorhandenen Default ersetzt. |
| Installation/CLI | Runtime und CLI mit npm oder pnpm bauen; Lockdateien synchronisiert; CLI nutzt tatsächliche Runtime-Typen. Eigenes Funding kauft Credits mit Wallet-USDC statt Credits an sich selbst zu übertragen. |
| Tests/CI | URL-Dateipfade mit `fileURLToPath`; Worker-Tests in temporären Verzeichnissen; Loop/Harness mit passenden Netzwerk-Mocks; korrekte Vitest-Selektoren; CI wertet Test-Timeout als Fehler. |

Beim Gesamttest zusätzlich gefunden: BPE-Tokenzählung von sehr langen,
repetitiven Texten blockierte den Prozess minutenlang. Überlange Eingaben und
lange ununterbrochene Zeichenfolgen verwenden jetzt die vorhandene
Zeichen-Näherung; sie werden nicht im Token-LRU gehalten. Diese Näherung bleibt
eine Schätzung und garantiert keine exakte Tokenzahl für jeden Tokenizer.

## Verifikation

- Vollständige Testsuite: 69 Dateien, 1.712 Tests erfolgreich, darunter
  69 neue Regressionstests. Fehlerfälle werden unter anderem vor Signatur,
  bei verlorener Zahlungsantwort, nach Datenbank-Neuöffnung, bei konkurrierenden
  Transfers, privaten DNS-Antworten, blockierter DNS-Auflösung, falschen
  Command-Vorlagen und toten Workern geprüft.
- `npm run typecheck` und `npm run build` erfolgreich; Build umfasst Runtime
  und Creator-CLI.
- `npm run test:security`: 126 Tests erfolgreich;
  `npm run test:financial`: 39 Tests erfolgreich (Namensfilter, ergänzend zum
  vollständigen Lauf).
- Frische Kopie ohne `node_modules` und Build-Artefakte: `npm ci --offline`
  aus dem heruntergeladenen Cache, anschließend `npm run build` erfolgreich.
  Runtime- und CLI-Hilfe starten erfolgreich.
- pnpm-Lockdatei mit pnpm 10.28.1 aktualisiert und im Frozen-Modus geprüft;
  ein kompletter frischer pnpm-Installationslauf wurde nicht ausgeführt.
- Source-Testpfade zusätzlich aus einem Verzeichnis mit Leerzeichen geprüft:
  132 Tests erfolgreich. `git diff --check` erfolgreich.

## Verbleibende Arbeit mit externer Abhängigkeit

1. Conway-Betreiber: Auth-Datenbank/Nonce-Verifikation, Provider-Quota/TLS,
   VM-Zuordnung/Storage/Porttunnel, Dashboard und Gutschriften anhand der
   gruppierten Reproduktionen im Issue-Bericht prüfen. Die zugehörigen
   Backend-Repositories und Zugänge sind hier nicht vorhanden.
2. Zahlungsbackend: atomare Reservierung, garantierte Deduplizierung und eine
   abfragbare Zuordnung von Zahlungsabsicht, Settlement und Credit-Gutschrift
   bereitstellen. Danach kann die Runtime unbekannte Zahlungsresultate
   automatisch abgleichen statt dauerhaft zu sperren. Ein angenommener
   `pending`/`submitted`-Transfer ist noch kein Finalitätsnachweis.
3. Vor manuellem Aufheben einer `topup_intent:*`-Sperre: Automaton anhalten,
   Wallet-Zahlung und Conway-Gutschrift abgleichen, Datenbank sichern und nur
   die konkrete aufgelöste Absicht bereinigen. Kein automatisches erneutes
   Signieren nach einem Timeout.
4. Architekturmeldungen: verbindliche OS-Isolation für lokale Worker und
   getrennte Rechte für Secrets, Shellzugriff und Self-Modification planen.
   Regex- und Promptfilter ersetzen diese Grenzen nicht. Multiprozess-Reserve
   und atomare externe Abrechnung brauchen Unterstützung des Zahlungsdienstes.
5. Unklare Reports: Versionsstand, Konfiguration ohne Secrets, vollständige
   Logs und minimales Beispiel anfordern. Featurevorschläge separat bewerten.

Die Einzelbefunde und Codebelege stehen in [UPSTREAM-ISSUES.md](UPSTREAM-ISSUES.md).
Der Bericht ist offline mit `python3 scripts/triage-upstream-issues.py`
aus dem archivierten Snapshot reproduzierbar.

## Ergänzung: SIWS-Domainfehler (#373)

Der Solana-Login signierte bisher dieselbe feste Domain `conway.tech` wie SIWE.
Eine begrenzte Live-Diagnose mit absichtlich ungültigen Signaturen bestätigte:
`conway.tech` wird mit HTTP 400 `Domain mismatch` abgelehnt;
`api.conway.tech` passiert diese Prüfung und erreicht die Nonceprüfung (HTTP 401).
Der Nonce-Endpunkt liefert keine erwartete Domain mit.

SIWS signiert jetzt die Authority der eingestellten API-URL, einschließlich
eines benutzerdefinierten Ports. SIWE behält seine bisherige Domain. Drei neue
Regressionstests prüfen beide SIWS-Varianten und die bestehende EVM-Anmeldung;
die gezielte Suite mit SIWS-Signaturtests umfasst neun erfolgreiche Tests.
Runtime und CLI bauen erfolgreich. Es wurde keine echte Wallet angemeldet und
kein API-Key erzeugt; nach der Domainkorrektur können separate Backendfehler
bei Nonce-/Signaturprüfung weiterhin auftreten.
