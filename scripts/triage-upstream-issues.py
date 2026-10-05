#!/usr/bin/env python3
"""Render the reviewed upstream snapshot as a sorted, offline issue inventory."""
import collections
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / 'docs/upstream-issues/snapshot.json'
rows = json.loads(SNAPSHOT.read_text())['issues']
findings = {}

def assign(numbers, group, priority, verdict, evidence, action):
    for number in numbers:
        if number in findings:
            raise ValueError(f'Duplicate classification #{number}')
        findings[number] = dict(group=group, priority=priority, verdict=verdict,
                                evidence=evidence, action=action)

assign([9,29,50,69,223,290,292,297,302,303], 'Conway-Inferenz', 'P1', 'Extern',
       'Gemeldete Provider-Quota/Auth/TLS-Fehler stammen aus Conway oder dessen Inferenzanbietern; diese Server fehlen im Repo.',
       'Backend-Quota, Zertifikat und Guthabenzuordnung durch Betreiber prüfen. Kein Nachweis, dass die aktuelle Störung noch besteht.')
assign([12,294,339,353,356,359,371,372,376,377,379,406,419], 'Provisionierung', 'P1', 'Extern + lokale Fehlerbehandlung repariert',
       'src/identity/provision.ts: verify verwendete den generischen Retry-Client mit einem einmaligen Nonce. Die Meldungen zeigen daneben direkte Serverfehler auch ohne Client-Retry.',
       'Verify/API-Key-Erzeugung ohne Retry; Regression: provision-regression.test.ts. Frische-Nonce-401 und Datenbank-500 benötigen weiterhin Backend-Fixes.')
assign([408], 'Provisionierung', 'P1', 'Extern + lokale Fehlerbehandlung repariert',
       'Direkte verify-500 und on-chain Zahlung ohne Credit-Grant laut Issue; Server und Zahlungsledger fehlen. Lokale Retry-/Topup-Probleme zusätzlich bestätigt.',
       'Nonce-Replay beseitigt, persistente Topup-Sperre ergänzt; Betreiber muss Credit-Grant und betroffene Zahlung abgleichen.')
assign([20], 'Zahlungen und Guthaben', 'P1', 'Bestätigt; repariert',
       'packages/cli/src/commands/fund.ts nutzte den Agenten-Key, um Credits an dessen eigene Adresse zu übertragen; API lehnt dies ab.',
       'fund ohne --to kauft jetzt Credits mit Wallet-USDC; fremdes --to überträgt vorhandene Credits. Gemeinsame Topup-Sperre verwenden.')
assign([288,393], 'Zahlungen und Guthaben', 'P1', 'Bestätigt; repariert',
       'bootstrap, Inline-Loop und Heartbeat hatten getrennte Cooldowns. x402 hatte keine Zahlungsabsicht; neue Aufrufe erzeugten neue EIP-3009-Nonces.',
       'Gemeinsame SQLite-Claim vor dem ersten await, Idempotency-Key auf beiden HTTP-Legs, keine automatischen Probe-/Paid-Retries; unbekannten Zahlungsausgang dauerhaft sperren. x402-topup.test.ts.')
assign([177], 'Zahlungen und Guthaben', 'P1', 'Bestätigt; lokal repariert',
       'transfer_credits und fund_child prüften Guthaben und transferierten ohne gemeinsame Serialisierung.',
       'Payer-Mutex umfasst Check, Transfer und Buchung. Andere Prozesse und externe Inferenzkosten benötigen weiterhin serverseitige atomare Reserveprüfung.')
assign([396], 'Zahlungen und Guthaben', 'P1', 'Bestätigt; repariert',
       'financial.minimum_reserve gab immer null zurück; die Halbierungsregel ließ eine konfigurierte Mindestreserve unterschreiten.',
       'Policy prüft Turn-Guthaben; Executor prüft frisches Credit-Guthaben unter Lock. x402 prüft Wallet-USDC vor Signatur. fund_child erhält dieselben Transferlimits.')
assign([399], 'Zahlungen und Guthaben', 'P1', 'Teilweise bestätigt; repariert',
       'API-Aufruf wurde bereits awaited: geworfene Netzwerkfehler erzeugten keine Buchung. Eine erfolgreiche HTTP-Antwort mit status=failed wurde aber gebucht.',
       'Nur bekannte akzeptierte Statuswerte buchen; abgelehnte/unklare Statuswerte werfen Fehler und erzeugen keinen Spend-Eintrag. Pending/submitted beschreibt API-Annahme, keine On-chain-Finalität.')
assign([91,202,229,236,237,278,293,307,314], 'Zahlungen und Guthaben', 'P1', 'Extern; lokale Mehrfachkäufe abgesichert',
       'Berichte über Zahlungen ohne Gutschrift, abweichende Dashboard-Balances oder verschwundene Credits. Der lokale Code enthält keine Conway-Settlement-/Credit-Ledger-Implementierung.',
       'Transaktionshash und Empfänger mit Betreiber-Ledger abgleichen. #288/#393 verhindern erneute Käufe bei unklarem Zahlungsausgang, ersetzen aber keine Gutschrift/Rückerstattung.')
assign([31,34,36,37,43,53,55,56,73,79,85,90,97,99,144,158,162,163,167,199,219,231,258,265,283,284], 'Conway-Sandbox und Ports', 'P1', 'Extern',
       'Ungültige IPs, falsche Worker-Routen, fehlende VM, Storage-I/O, Tunnel-404 und belastete VM-Bestellungen werden im entfernten Conway-Control-Plane verwaltet.',
       'Betreiber muss VM/Worker/Tunnel und Abrechnung prüfen. Nicht als durch einen Runtime-Patch behoben zählen.')
assign([10], 'Conway-Sandbox und Ports', 'P1', 'Extern / Konfiguration prüfen',
       '403 für eine Sandbox: API-Prüfung der Besitzrechte und Sandbox-Zuordnung fehlt im Repo.',
       'Key-Eigentümer und gespeicherte Sandbox-ID prüfen. Keine stille Ausführung auf dem lokalen Host als Ersatz.')
assign([224,259,262,266], 'Orchestrierung und Replikation', 'P1', 'Bestätigt; repariert',
       'Orchestrator setzte tote Worker-Aufträge auf pending, ließ den Child-Datensatz aber running; SimpleAgentTracker vergab denselben toten Worker erneut. Recovery übersah running-Aufträge.',
       'Toten Worker aus Pool entfernen und assigned/running-Aufträge freigeben. Regression mit echtem SimpleAgentTracker; Neustartfolgen bleiben ohne vorhandenen Worker erkennbar.')
assign([226], 'Orchestrierung und Replikation', 'P1', 'Teilweise bereits behoben; Rest repariert',
       'Scoped Child-Client und Wiederverwendung sind bereits vorhanden. Reuse schlug aber an erneutem git clone in ein vorhandenes /root/automaton fehl; Install-Exitcodes wurden ignoriert.',
       'Vorhandenes Checkout wiederverwenden und jeden Installationsschritt auf Erfolg prüfen. Sandbox-Löschung ist API-seitig deaktiviert; Reuse ist kein Refund.')
assign([404], 'Orchestrierung und Replikation', 'P2', 'Bestätigt; repariert',
       'AutomatonDatabase hat kein config-Feld; maxChildren und childSandboxMemoryMb wurden immer auf Defaults zurückgesetzt.',
       'Typisierte Config explizit an spawnChild und Legacy-Pfad übergeben; alle Runtime-Aufrufer angepasst. Regression für Limit und RAM-Tier.')
assign([225], 'Orchestrierung und Replikation', 'P2', 'Bereits behoben',
       'src/agent/loop.ts enthält spezielle BLOCKED-create_goal-Zählung, Backoff und Cycle-Limit; loop-detector verhindert wiederholte Muster.',
       'Bestehende Loop-Regressions behalten; tatsächliche Worker-Deadlocks zusätzlich durch #259 beheben.')
assign([183,394], 'Netzwerk und SSRF', 'P1', 'Bestätigt; repariert',
       'Discovery prüfte nur Host-Strings; x402 prüfte nur HTTPS. Beide konnten private DNS-Ziele und Redirects kontaktieren.',
       'Gemeinsamer public-http-Transport prüft alle DNS-Antworten, normalisierte IPv4/IPv6 und private Bereiche; pinnt Socket-IP mit ursprünglichem TLS-Hostname und verweigert Redirects. public-http.test.ts.')
assign([397], 'Netzwerk und SSRF', 'P1', 'Bestätigt; repariert',
       'gitClone quotete Shellargumente, akzeptierte aber file/ssh/HTTP und interne Ziele.',
       'Nur öffentliche HTTPS-URLs; DNS-IP an libcurl pinnen, Protokolle und Redirects beschränken. Git muss http.curloptResolve unterstützen; Shell bleibt eine bewusst allgemeinere Fähigkeit.')
assign([182], 'Netzwerk und SSRF', 'P2', 'Bereits behoben; Redirect-Grenze ergänzt',
       'ResilientHttpClient.assertSecureUrl erzwingt bereits HTTPS; HTTP nur explizit für Loopback.',
       'Implizite Redirects jetzt zusätzlich abgelehnt. Dies ist keine SSRF-Sperre für ausdrücklich konfigurierte lokale Provider.')
assign([395], 'Werkzeugschutz', 'P1', 'Bestätigt; repariert',
       'EXTERNAL_SOURCE_TOOLS enthielt x402_fetch nicht; GeneralHarness schützte seinen Alias, direkter executeTool-Pfad nicht.',
       'x402_fetch-Ergebnisse vor Modellkontext sanitizen; direkte Regression mit ChatML-Injektion.')
assign([398,402], 'Werkzeugschutz', 'P1', 'Bestätigt; repariert',
       'tools.ts hatte eine zweite, schwächere Forbidden-Pattern-Liste ohne policy-engine/policy-rules-Schutz.',
       'Gemeinsamen Matcher aus command-safety.ts nutzen; Direktaufrufe ohne PolicyEngine testen.')
assign([180], 'Werkzeugschutz', 'P1', 'Bestätigt; repariert',
       'pull_upstream interpolierte commit ungeprüft; die Policy konnte umgangen werden, wenn kein Engine-Parameter übergeben wurde.',
       'Ausführungsseitige Hex-Hash-Validierung und Shellquoting ergänzt; injizierter Hash erreicht conway.exec nicht.')
assign([181], 'Werkzeugschutz', 'P2', 'Teilweise bestätigt; repariert',
       'Regex verhinderte Shell-Metazeichen bereits, erlaubte aber Optionen und Dateipfade; die behauptete direkte Shell-Injection war dadurch nicht reproduzierbar.',
       'npm-Paketformat enger, -- vor Paket, Shellquoting in allen drei Pfaden. Regression für --prefix und lokale Pfade.')
assign([400], 'Werkzeugschutz', 'P2', 'Hardening; repariert',
       'DB-command war absichtlich eine Shellvorlage; Ausführung ohne Prüfung bestätigt. Voraussetzung des beschriebenen Angriffs ist bereits Schreibzugriff auf die DB; MCP-Ausführung ist im Code nur ein Stub.',
       'Nur ein Executable plus getrennte feste String-Argumente; alles quoten, gemeinsame Schutzprüfung. Allgemeiner Shellzugriff bleibt Teil des Produktes.')
assign([3,28,172,173,174,175,176,179,310], 'Werkzeugschutz', 'P2', 'Bereits behoben',
       'ESM/execFileSync im Loader, Shellquoting in Git/read_file/installierten Args, kein API-Key-Getter oder Remote-403-Local-Fallback; LocalWorker liest über confinierte Harness-Pfade.',
       'Bestehende command-injection, skills-hardening und local-worker-security Tests prüfen diese Fälle; #400 verschärft zusätzlich die Command-Vorlage.')
assign([401], 'Orchestrierung und Replikation', 'P3', 'Observability-Hardening; repariert',
       'Ungültige Übergänge wurden korrekt abgelehnt, aber nicht geloggt; das ist kein nachgewiesener State-Machine-Bypass.',
       'Strukturierte Warnung mit Child, Ausgangs-/Zielstatus; hasChild ergänzt. Abgelehnte Übergänge dürfen nicht als letzter gültiger State in Lifecycle-Events erscheinen.')
assign([403], 'Persistenz', 'P2', 'Meldung überwiegend falsch; Null-JSON gehärtet',
       'safeJsonParse hatte bereits einen typisierten Fallback bei Syntaxfehlern; behaupteter null-Rückgabewert für Fehler ist falsch. Gültiges JSON null oder falscher Containertyp konnte dennoch durchkommen.',
       'Fallback bei null/falschem Array-/Objekttyp ergänzt; existing data-layer Tests plus Null-Config-Regression.')
assign([350], 'Installation und Plattform', 'P2', 'Bestätigt; repariert',
       '17 Source-Assertions lasen new URL(...).pathname; Leerzeichen waren als %20 im Dateinamen.',
       'fileURLToPath verwenden; beide Testdateien zusätzlich aus einer Kopie mit Leerzeichen im Pfad ausführen.')
assign([47,279], 'Installation und Plattform', 'P1', 'Bestätigt; repariert',
       'npm run build rief ein nicht installiertes pnpm auf; package-lock enthielt nur TypeScript und Version 0.1.0.',
       'Beide Builds über tsc ausführen; npm-Workspace verknüpfen; beide Lockdateien synchronisieren und CLI-Start prüfen.')
assign([68], 'Installation und Plattform', 'P2', 'Bereits behoben; weitere Buildfehler repariert',
       'tsconfig schließt src/__tests__ bereits aus; @types/better-sqlite3 liegt in dependencies. Zusätzlicher pnpm-Build-Blocker entspricht #47.',
       'Typecheck und beide Builds prüfen; #47 repariert npm-Quickstart.')
assign([355], 'Installation und Plattform', 'P2', 'Bestätigt; Pfade repariert',
       'HOME || /root war unter Windows falsch; identische Fallbacks in Wallet, Konfiguration, CLI, Soul und Skills.',
       'os.homedir konsistent verwenden. In #355 gemeldete frische-Nonce-401 ist getrennt serverseitig; Linux-Shellwerkzeuge werden dadurch nicht zu Windows-Kommandos.')
assign([373], 'Installation und Plattform', 'P2', 'Bestätigt; Pfade und SIWS-Domain repariert',
       'Windows-HOME-Fallback erzeugte eine zweite Wallet. Der daneben gemeldete SIWS-Domainfehler war unabhängig davon reproduzierbar: conway.tech wurde vom Verifier mit Domain mismatch abgewiesen; api.conway.tech passierte die Domainprüfung und erreichte die Nonceprüfung.',
       'os.homedir konsistent verwenden; SIWS-Domain aus der eingestellten API-Authority ableiten, SIWE-Domain beibehalten. Drei Regressionstests prüfen Standard-API, benutzerdefinierten Host/Port und EVM. Mit ungültigen Testsignaturen wurde nur die Domainprüfung eingegrenzt, keine erfolgreiche Provisionierung belegt.')
assign([165], 'Installation und Plattform', 'P2', 'Architektur-/Plattformgrenze',
       'Walletpfade werden repariert, aber exec ist ein POSIX-Shellwerkzeug und übersetzt ls -la nicht für Windows cmd.',
       'Runtime unter Linux/WSL betreiben; native Windows-Ausführung benötigt einen expliziten Shelladapter und separate Plattformtests.')
assign([285], 'Installation und Plattform', 'P2', 'Ressourcen-/Deploymentproblem',
       'Installation auf 512-MiB-VM laut Bericht mit OOM abgebrochen; TypeScript/Node-Build hat Ressourcenbedarf, kein fehlerhafter Credit-Algorithmus.',
       'Auf größerem Builder bauen und fertige dist-Artefakte ausliefern; VM-Betreiber muss Mindestgröße/Swap dokumentieren.')
assign([385], 'Inferenzkonfiguration', 'P2', 'Vorschlag mit bestätigten lokalen Blockern; repariert',
       'Ollama-Unterstützung existiert bereits, aber --run verlangte einen Conway-Key und modelStrategy ignorierte das top-level inferenceModel; Routingmatrix konnte eigene Modelle überstimmen.',
       'Eigene Inferenz ohne Conway-Key zulassen, Modellwerte konsistent übernehmen und explizites lokales Modell bevorzugen. Conway-VM/Domain-Capabilities benötigen weiterhin Conway.')
assign([89], 'Inferenzkonfiguration', 'P2', 'Historische Ursache begrenzt; nicht erneut reproduziert',
       'src/agent/context.ts, memory/context-manager.ts und context-hardening.test.ts begrenzen inzwischen History und Input. Issue enthält alten 164k-Token-Kontext, keinen aktuellen Repro.',
       'Aktuellen Provider, contextWindow und Tool-Schemas bei erneutem Fehler aufzeichnen. Kein Anspruch, dass jede Kombination niemals den Kontext überschreitet.')
assign([289], 'Inferenzkonfiguration', 'P3', 'Optimierung; teilweise vorhanden',
       'Statuswerkzeuge sind bereits IDLE_ONLY_TOOLS; Loop filtert Status-Turns und hat Idle-/Cycle-Limits; Heartbeat nutzt TickContext-Caching.',
       'Kosten zuerst messen; zusätzliche Tool-Caches brauchen eine definierte Frischegrenze und sind kein belegter Korrektheitsfix.')
assign([24,25,26,27], 'Architektur und Vertrauensgrenzen', 'P2', 'Reale Architekturgrenze',
       'Prompt-/Regex-Policy kann beliebigen Shellzugriff als root nicht vollständig isolieren. Quarantine für hohe Transfers existiert, umfassende externe Freigabe und unabhängiger Verifier nicht.',
       'Deployment mit unprivilegiertem Executor, separatem Wallet-/Policy-Broker, schreibgeschützten Policy-Mounts und optionaler Approval-/Verifier-Schnittstelle planen; keine falsche Garantie durch weitere Regexes.')
assign([17,48,49,80,93,212,243,276,282], 'Dashboard und Support', 'P2', 'Extern',
       'Dashboard-Anmeldung, Wallet-Connector, Website-Anleitungen und Discord-Einladung gehören nicht zu dieser Runtime.',
       'Conway-Webprojekt/Support benötigt eigene Änderungen. Lokale README kann nur den Runtime-Start erklären.')
assign([61,101,232], 'Domains', 'P2', 'Extern / Support',
       'Pending-Bestellung, Fulfillment und Refund liegen beim Conway-Domainservice bzw. Registrar.',
       'Order-ID beim Betreiber prüfen; Runtime kann keine fremde Registrar-Bestellung abschließen.')
assign([38,44,59,88,119,190,192,197,211,247,248,291,305,319,324,331,352,8,81], 'Vorschläge und Integrationen', 'P4', 'Vorschlag; kein belegter Bug',
       'Neue Plattformen, Fähigkeiten, Governance-/Zertifizierungsskills, Payment-Protokolle oder Integrationen statt einer reproduzierten Runtime-Abweichung.',
       'Separat als Feature bewerten; keine fremden beworbenen Services installieren. #81: EIP-712-Domain für unterstützte USDC-Verträge ist derzeit ausdrücklich festgelegt.')
assign([240], 'Vorschläge und Integrationen', 'P4', 'Bereits umgesetzt',
       'Discovery akzeptiert rpcUrl und reicht ihn an Registry-Abfragen weiter; discovery-abi.test.ts prüft diese Anbindung.',
       'Bestehenden konfigurierbaren RPC-Pfad behalten.')
assign([188], 'Werkzeugschutz', 'P2', 'Bereits begrenzt; Architekturgrenze bleibt',
       'createSkill/installSkill validieren Namen und Skills-Verzeichnis; write_file hat Home-Confinement und Protected-File-Prüfung. Allgemeines exec bleibt frei.',
       'Skills-Regressions bestehen; echte Dateisystemisolation gehört zum getrennten Executor, siehe #27.')
assign([201,39], 'Conway-Sandbox und Ports', 'P2', 'Teilweise bereits behoben / neue Daten nötig',
       'Lokaler exec verwendet inzwischen Benutzer-Home und Pufferlimit; lokale/remote Modi und Scoped Clients sind explizit. Ein list_sandboxes-Aufruf wechselt nicht automatisch die eigene Sandbox-ID.',
       'Gespeicherte sandboxId prüfen. Logs zeigen weiterhin nur einen Ausschnitt; vollständige Tool-Ergebnisse liegen in DB/Modellkontext. Neue Remote-Reproduktion nötig.')
assign([244,301,322,143,82,76,213,263,268,323,335], 'Fragen und Support', 'P3', 'Support / Dokumentation',
       'Wallet-Recovery, Guthabenhilfe, Konfigurationsfrage, Advisory-Anfrage, Solana-Status oder Nachweisfrage ohne reproduzierten Runtime-Defekt.',
       'Private Keys nicht aus Adressen rekonstruierbar; Serverwallet-Export benötigt Betreiber. #263: Standardlink auf die kanonische EIP-Seite aktualisieren. #335: README ist kein Erfolgsnachweis.')
assign([7,16,45,46,51,92,95,218,220,245,274,295,296,300,311,320,325,357,362,366,380,384,390,392,407,299,131,154,230], 'Unklare Meldungen und sonstige Beiträge', 'P3', 'Nicht hinreichend belegt',
       'Kein aktueller minimaler Runtime-Repro, teilweise nur Screenshot, leerer Text, Social-Post, Geschäftsresultat oder mehrere vermischte Serviceprobleme.',
       'Konfiguration ohne Secrets, Versionsstand, vollständige Fehlermeldung und erwartetes Verhalten nötig. Keine automatische Bugbehauptung; #390 kann vom behobenen npm-Buildfehler profitieren.')

assign([4], 'Heartbeat', 'P2', 'Teilweise bereits behoben; Rest repariert',
       'Daemon nutzt defaultIntervalMs bereits; lowComputeMultiplier stand jedoch nur im TickContext und beeinflusste die Scheduler-Fälligkeit nicht.',
       'Nicht essentielle Cron-/Intervallaufgaben werden jetzt um den konfigurierten Faktor verzögert; Credits, USDC, Inbox und Health bleiben erreichbar. Scheduler-Regression für beide Zeitplanarten.')

missing = {r['number'] for r in rows} - findings.keys()
extra = findings.keys() - {r['number'] for r in rows}
if missing or extra:
    raise ValueError(f'Unclassified: {sorted(missing)}; absent: {sorted(extra)}')

result = []
for row in rows:
    result.append({k: row[k] for k in ['number', 'title', 'state', 'html_url']} | findings[row['number']])
result.sort(key=lambda r: (r['priority'], r['group'], r['number']))
(ROOT / 'docs/upstream-issues/triage.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
counts = collections.Counter(r['group'] for r in result)
lines = [
    '# Upstream-Issues: vollständiger Befund', '',
    'Stand: 2026-10-05. Fork: `d8f8168`. **185 Issues: 158 offen, 27 geschlossen**; Pull Requests ausgeschlossen.', '',
    '[Quelle](https://github.com/Conway-Research/automaton/issues) · [Snapshot mit Originaltext und Kommentaren](upstream-issues/snapshot.json) · [maschinenlesbare Triage](upstream-issues/triage.json) · [Fixplan](ISSUE-FIX-PLAN.md)', '',
    'Priorität: P1 = Zahlung, Zugriffsschutz oder Betriebsblocker; P2 = Zuverlässigkeit/Plattform; P3 = Optimierung, Diagnose oder Support; P4 = Feature. Reihenfolge innerhalb jeder Gruppe: Priorität, Issue-Nummer. Upstream-Status und lokaler Befund sind getrennt.', '',
    '164 abrufbare Issue-Kommentare wurden archiviert. Drei Kommentarzähler stimmen nicht mit den abrufbaren Texten überein: #69/#93 melden je einen Kommentar bei leerem API-Ergebnis; #131 meldet acht bei sieben abrufbaren Kommentaren. Öffentliche API-Keys wurden im Snapshot redigiert. Behauptungen in Issues und Werbung in Kommentaren wurden nicht als Codebeweis übernommen. Es wurden keine Zahlungen und keine authentifizierten Service-Reproduktionen ausgeführt.', '',
    '| Gruppe | Issues |', '|---|---:|',
] + [f'| {group} | {count} |' for group, count in sorted(counts.items())]
for group in sorted(counts, key=lambda g: (min(r['priority'] for r in result if r['group'] == g), g)):
    lines += ['', f'## {group}', '', '| Issue | Upstream | Priorität | Lokaler Befund |', '|---|---|---|---|']
    group_rows = [r for r in result if r['group'] == group]
    for r in group_rows:
        title = r['title'].replace('|', '\\|').replace('\n', ' ').strip()
        lines.append(f"| [#{r['number']}: {title}]({r['html_url']}) | {r['state']} | {r['priority']} | {r['verdict']} |")
    # One explanation per common root cause; every issue remains explicitly mapped.
    explanations = collections.defaultdict(list)
    for r in group_rows:
        explanations[(r['evidence'], r['action'])].append(r['number'])
    for (evidence, action), numbers in explanations.items():
        lines += ['', '**' + ', '.join(f'#{n}' for n in numbers) + '** — ' + evidence, '', 'Maßnahme: ' + action]
lines += ['', '## Grenzen der abgeschlossenen Änderungen', '',
          '- Keine Gutschriften, Rückerstattungen, Service-Quota-Änderungen oder Dashboard-Fixes: der dafür zuständige Servercode fehlt.',
          '- Pending/submitted Transfers sind API-seitig angenommen. Die vorhandene Transaktionstabelle besitzt kein Settlement-Statusmodell; dies ist kein On-chain-Finalitätsnachweis.',
          '- Unklare Topups bleiben über Neustarts gesperrt. Vor Aufheben einer `topup_intent:*`-Sperre in der KV-Tabelle muss ein Betreiber Zahlung und Gutschrift abgleichen. Ein Idempotency-Key allein beweist keine serverseitige Deduplizierung.',
          '- Transfer-Mutex schützt konkurrierende Aufrufe dieses Prozesses. Atomare Reservegarantie über Prozesse und fremde Kosten benötigt das Zahlungsbackend.',
          '- HTTPS-Redirects werden verweigert. Git-Clone benötigt Git/libcurl mit `http.curloptResolve`; die [Git-Dokumentation](https://git-scm.com/docs/git-config/2.54.0) beschreibt DNS-Pinning und Redirect-Verhalten.',
          '- Shellzugriff und Self-Modification sind Produktfunktionen. Prompt-Sanitizing und lokale Policies bieten keine OS-Isolation und keinen Beweis, dass Langzeitinjektion ausgeschlossen ist.', '']
(ROOT / 'docs/UPSTREAM-ISSUES.md').write_text('\n'.join(lines))
print(f'Rendered {len(result)} issue assessments across {len(counts)} groups')
