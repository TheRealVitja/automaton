# Upstream-Issues: vollständiger Befund

Stand: 2026-10-05. Fork: `d8f8168`. **185 Issues: 158 offen, 27 geschlossen**; Pull Requests ausgeschlossen.

[Quelle](https://github.com/Conway-Research/automaton/issues) · [Snapshot mit Originaltext und Kommentaren](upstream-issues/snapshot.json) · [maschinenlesbare Triage](upstream-issues/triage.json) · [Fixplan](ISSUE-FIX-PLAN.md)

Priorität: P1 = Zahlung, Zugriffsschutz oder Betriebsblocker; P2 = Zuverlässigkeit/Plattform; P3 = Optimierung, Diagnose oder Support; P4 = Feature. Reihenfolge innerhalb jeder Gruppe: Priorität, Issue-Nummer. Upstream-Status und lokaler Befund sind getrennt.

164 abrufbare Issue-Kommentare wurden archiviert. Drei Kommentarzähler stimmen nicht mit den abrufbaren Texten überein: #69/#93 melden je einen Kommentar bei leerem API-Ergebnis; #131 meldet acht bei sieben abrufbaren Kommentaren. Öffentliche API-Keys wurden im Snapshot redigiert. Behauptungen in Issues und Werbung in Kommentaren wurden nicht als Codebeweis übernommen. Es wurden keine Zahlungen und keine authentifizierten Service-Reproduktionen ausgeführt.

| Gruppe | Issues |
|---|---:|
| Architektur und Vertrauensgrenzen | 4 |
| Conway-Inferenz | 10 |
| Conway-Sandbox und Ports | 29 |
| Dashboard und Support | 9 |
| Domains | 3 |
| Fragen und Support | 11 |
| Heartbeat | 1 |
| Inferenzkonfiguration | 3 |
| Installation und Plattform | 8 |
| Netzwerk und SSRF | 4 |
| Orchestrierung und Replikation | 8 |
| Persistenz | 1 |
| Provisionierung | 14 |
| Unklare Meldungen und sonstige Beiträge | 29 |
| Vorschläge und Integrationen | 20 |
| Werkzeugschutz | 16 |
| Zahlungen und Guthaben | 15 |

## Conway-Inferenz

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#9: SSL Certificate Mismatch on inference.conway.tech](https://github.com/Conway-Research/automaton/issues/9) | open | P1 | Extern |
| [#29: All inference models returning upstream quota/auth errors](https://github.com/Conway-Research/automaton/issues/29) | open | P1 | Extern |
| [#50: Inference error 429, quota exceeded (despite having credits)](https://github.com/Conway-Research/automaton/issues/50) | open | P1 | Extern |
| [#69: Inference proxy returns upstream quota/auth errors for all models](https://github.com/Conway-Research/automaton/issues/69) | closed | P1 | Extern |
| [#223: Inference API errors on all providers — credits lost, sandbox gone, no support response](https://github.com/Conway-Research/automaton/issues/223) | open | P1 | Extern |
| [#290: API returns 0 tokens despite having $5.08 credits - all inference calls failed](https://github.com/Conway-Research/automaton/issues/290) | open | P1 | Extern |
| [#292: Conway proxy returns 429 insufficient_quota after successful USDC topup and reprovision](https://github.com/Conway-Research/automaton/issues/292) | open | P1 | Extern |
| [#297: Conway proxy returns 429 insufficient_quota after funding via dashboard credit transfer](https://github.com/Conway-Research/automaton/issues/297) | open | P1 | Extern |
| [#302: Conway Cloud agent stuck in 429 insufficient_quota loop - API upstream failure](https://github.com/Conway-Research/automaton/issues/302) | open | P1 | Extern |
| [#303: Credit Balance $15.00 but 429 insufficient_quota, auto topup not working](https://github.com/Conway-Research/automaton/issues/303) | open | P1 | Extern |

**#9, #29, #50, #69, #223, #290, #292, #297, #302, #303** — Gemeldete Provider-Quota/Auth/TLS-Fehler stammen aus Conway oder dessen Inferenzanbietern; diese Server fehlen im Repo.

Maßnahme: Backend-Quota, Zertifikat und Guthabenzuordnung durch Betreiber prüfen. Kein Nachweis, dass die aktuelle Störung noch besteht.

## Conway-Sandbox und Ports

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#10: Agent denied access to Sandbox](https://github.com/Conway-Research/automaton/issues/10) | open | P1 | Extern / Konfiguration prüfen |
| [#31: Sandbox created with invalid ip_address (10.0.0.260) and exec fails](https://github.com/Conway-Research/automaton/issues/31) | open | P1 | Extern |
| [#34: Charged for two broken sandboxes — requesting  refund](https://github.com/Conway-Research/automaton/issues/34) | open | P1 | Extern |
| [#36: Sandbox exec returns 500 while terminal UI works — stale sandbox unreachable via API](https://github.com/Conway-Research/automaton/issues/36) | open | P1 | Extern |
| [#37: Sandbox infra issues: stale workers, invalid IPs, and setup friction on ovh-us-east-2](https://github.com/Conway-Research/automaton/issues/37) | open | P1 | Extern |
| [#43: Sandbox assigned invalid IP (10.0.0.290) on ovh-us-east-2 — exec fails, same as #31](https://github.com/Conway-Research/automaton/issues/43) | open | P1 | Extern |
| [#53: Sandbox created but immediately inaccessible — requesting  refund](https://github.com/Conway-Research/automaton/issues/53) | closed | P1 | Extern |
| [#55: Sandbox provisioned with invalid IP address (10.0.0.315) — cannot connect via exec or terminal](https://github.com/Conway-Research/automaton/issues/55) | open | P1 | Extern |
| [#56: Invalid IP address returned in sandbox SSH connection (10.0.0.324)](https://github.com/Conway-Research/automaton/issues/56) | closed | P1 | Extern |
| [#73: Sandbox SSH unreachable after provisioning — Connection timed out to 10.0.1.24](https://github.com/Conway-Research/automaton/issues/73) | open | P1 | Extern |
| [#79: Sandbox unreachable: exec routes to wrong worker, no restart/stop API exists](https://github.com/Conway-Research/automaton/issues/79) | open | P1 | Extern |
| [#85: Critical: Sandbox creation succeeds but execution returns 403 — 3 VMs orphaned, $10 owed](https://github.com/Conway-Research/automaton/issues/85) | open | P1 | Extern |
| [#90: Port exposure returns 404 despite successful API response](https://github.com/Conway-Research/automaton/issues/90) | open | P1 | Extern |
| [#97: CRITICAL BUG: Charged for VM creation, but sandbox is missing/inaccessible (refund or restore requested)](https://github.com/Conway-Research/automaton/issues/97) | open | P1 | Extern |
| [#99: Credit adjustment request — failed sandbox churn](https://github.com/Conway-Research/automaton/issues/99) | open | P1 | Extern |
| [#144: Cannot Connect to sandbox and cannot open secure websocket](https://github.com/Conway-Research/automaton/issues/144) | open | P1 | Extern |
| [#158: Credit adjustment request — sandbox deleted due to 404 tunnel errors, no refund received](https://github.com/Conway-Research/automaton/issues/158) | open | P1 | Extern |
| [#162: Sandbox cannot be found - I’ve had this sandbox for a week and it is now missing.](https://github.com/Conway-Research/automaton/issues/162) | open | P1 | Extern |
| [#163: Sandbox VM corrupted: I/O errors reading dpkg + apt methods (unusable)](https://github.com/Conway-Research/automaton/issues/163) | open | P1 | Extern |
| [#167: Port 3000 exposed successfully but public URL returns 404 — same as #90](https://github.com/Conway-Research/automaton/issues/167) | open | P1 | Extern |
| [#199: [Bug Report] Port exposure returns 404 - Sandbox ID: 0ed824d6bff359b663db0ac1e16caa76](https://github.com/Conway-Research/automaton/issues/199) | closed | P1 | Extern |
| [#219: Billing credit request: sandbox showed running but was unreachable](https://github.com/Conway-Research/automaton/issues/219) | open | P1 | Extern |
| [#231: Charged for Small VM but no sandbox provisioned (credits deducted)](https://github.com/Conway-Research/automaton/issues/231) | open | P1 | Extern |
| [#258: Conway Cloud: Sandbox disappears after creation + wallet connector broken](https://github.com/Conway-Research/automaton/issues/258) | open | P1 | Extern |
| [#265: Failed to Create Sandbox any Server Region](https://github.com/Conway-Research/automaton/issues/265) | open | P1 | Extern |
| [#283: created VM, unreachable](https://github.com/Conway-Research/automaton/issues/283) | open | P1 | Extern |
| [#284: rebooted VM, removed from my sandboxes](https://github.com/Conway-Research/automaton/issues/284) | open | P1 | Extern |
| [#39: Loosing sandbox Id during call](https://github.com/Conway-Research/automaton/issues/39) | open | P2 | Teilweise bereits behoben / neue Daten nötig |
| [#201: exec tool: ls -la output truncated causes infinite verification loop](https://github.com/Conway-Research/automaton/issues/201) | closed | P2 | Teilweise bereits behoben / neue Daten nötig |

**#10** — 403 für eine Sandbox: API-Prüfung der Besitzrechte und Sandbox-Zuordnung fehlt im Repo.

Maßnahme: Key-Eigentümer und gespeicherte Sandbox-ID prüfen. Keine stille Ausführung auf dem lokalen Host als Ersatz.

**#31, #34, #36, #37, #43, #53, #55, #56, #73, #79, #85, #90, #97, #99, #144, #158, #162, #163, #167, #199, #219, #231, #258, #265, #283, #284** — Ungültige IPs, falsche Worker-Routen, fehlende VM, Storage-I/O, Tunnel-404 und belastete VM-Bestellungen werden im entfernten Conway-Control-Plane verwaltet.

Maßnahme: Betreiber muss VM/Worker/Tunnel und Abrechnung prüfen. Nicht als durch einen Runtime-Patch behoben zählen.

**#39, #201** — Lokaler exec verwendet inzwischen Benutzer-Home und Pufferlimit; lokale/remote Modi und Scoped Clients sind explizit. Ein list_sandboxes-Aufruf wechselt nicht automatisch die eigene Sandbox-ID.

Maßnahme: Gespeicherte sandboxId prüfen. Logs zeigen weiterhin nur einen Ausschnitt; vollständige Tool-Ergebnisse liegen in DB/Modellkontext. Neue Remote-Reproduktion nötig.

## Installation und Plattform

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#47: PNPM Not Enabled](https://github.com/Conway-Research/automaton/issues/47) | open | P1 | Bestätigt; repariert |
| [#279: npm o pnpm?](https://github.com/Conway-Research/automaton/issues/279) | open | P1 | Bestätigt; repariert |
| [#68: automaton.sh install script fails — TypeScript compilation errors (vitest, better-sqlite3)](https://github.com/Conway-Research/automaton/issues/68) | open | P2 | Bereits behoben; weitere Buildfehler repariert |
| [#165: Windows: Agent loops on 'ls -la' exec failures, never reads SOUL.md in .automaton folder](https://github.com/Conway-Research/automaton/issues/165) | open | P2 | Architektur-/Plattformgrenze |
| [#285: VM was not able to install runtime](https://github.com/Conway-Research/automaton/issues/285) | open | P2 | Ressourcen-/Deploymentproblem |
| [#350: Test suite fails with ENOENT when the repo path contains a space (URL.pathname percent-encoding in source-safety specs)](https://github.com/Conway-Research/automaton/issues/350) | open | P2 | Bestätigt; repariert |
| [#355: Windows: HOME env var defaults to /root causing invalid paths; SIWE provisioning fails with "Invalid or expired nonce" on --provision](https://github.com/Conway-Research/automaton/issues/355) | open | P2 | Bestätigt; Pfade repariert |
| [#373: Windows: HOME is unset, so wallet and config land in C:\root\.automaton instead of the user profile](https://github.com/Conway-Research/automaton/issues/373) | open | P2 | Bestätigt; Pfade repariert |

**#47, #279** — npm run build rief ein nicht installiertes pnpm auf; package-lock enthielt nur TypeScript und Version 0.1.0.

Maßnahme: Beide Builds über tsc ausführen; npm-Workspace verknüpfen; beide Lockdateien synchronisieren und CLI-Start prüfen.

**#68** — tsconfig schließt src/__tests__ bereits aus; @types/better-sqlite3 liegt in dependencies. Zusätzlicher pnpm-Build-Blocker entspricht #47.

Maßnahme: Typecheck und beide Builds prüfen; #47 repariert npm-Quickstart.

**#165** — Walletpfade werden repariert, aber exec ist ein POSIX-Shellwerkzeug und übersetzt ls -la nicht für Windows cmd.

Maßnahme: Runtime unter Linux/WSL betreiben; native Windows-Ausführung benötigt einen expliziten Shelladapter und separate Plattformtests.

**#285** — Installation auf 512-MiB-VM laut Bericht mit OOM abgebrochen; TypeScript/Node-Build hat Ressourcenbedarf, kein fehlerhafter Credit-Algorithmus.

Maßnahme: Auf größerem Builder bauen und fertige dist-Artefakte ausliefern; VM-Betreiber muss Mindestgröße/Swap dokumentieren.

**#350** — 17 Source-Assertions lasen new URL(...).pathname; Leerzeichen waren als %20 im Dateinamen.

Maßnahme: fileURLToPath verwenden; beide Testdateien zusätzlich aus einer Kopie mit Leerzeichen im Pfad ausführen.

**#355, #373** — HOME || /root war unter Windows falsch; identische Fallbacks in Wallet, Konfiguration, CLI, Soul und Skills.

Maßnahme: os.homedir konsistent verwenden. In #355 gemeldete frische-Nonce-401 ist getrennt serverseitig; Linux-Shellwerkzeuge werden dadurch nicht zu Windows-Kommandos.

## Netzwerk und SSRF

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#183: Security: DNS rebinding bypass in SSRF protection (CWE-918)](https://github.com/Conway-Research/automaton/issues/183) | open | P1 | Bestätigt; repariert |
| [#394: [C1] SSRF vulnerability in x402_fetch — no internal IP validation](https://github.com/Conway-Research/automaton/issues/394) | open | P1 | Bestätigt; repariert |
| [#397: [H2] Missing SSRF/protocol validation on git_clone URL parameter](https://github.com/Conway-Research/automaton/issues/397) | open | P1 | Bestätigt; repariert |
| [#182: Security: No HTTPS enforcement in HTTP client (CWE-319)](https://github.com/Conway-Research/automaton/issues/182) | open | P2 | Bereits behoben; Redirect-Grenze ergänzt |

**#183, #394** — Discovery prüfte nur Host-Strings; x402 prüfte nur HTTPS. Beide konnten private DNS-Ziele und Redirects kontaktieren.

Maßnahme: Gemeinsamer public-http-Transport prüft alle DNS-Antworten, normalisierte IPv4/IPv6 und private Bereiche; pinnt Socket-IP mit ursprünglichem TLS-Hostname und verweigert Redirects. public-http.test.ts.

**#397** — gitClone quotete Shellargumente, akzeptierte aber file/ssh/HTTP und interne Ziele.

Maßnahme: Nur öffentliche HTTPS-URLs; DNS-IP an libcurl pinnen, Protokolle und Redirects beschränken. Git muss http.curloptResolve unterstützen; Shell bleibt eine bewusst allgemeinere Fähigkeit.

**#182** — ResilientHttpClient.assertSecureUrl erzwingt bereits HTTPS; HTTP nur explizit für Loopback.

Maßnahme: Implizite Redirects jetzt zusätzlich abgelehnt. Dies ist keine SSRF-Sperre für ausdrücklich konfigurierte lokale Provider.

## Orchestrierung und Replikation

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#224: bug: stale tasks stuck in 'assigned' state after worker dies on process restart](https://github.com/Conway-Research/automaton/issues/224) | closed | P1 | Bestätigt; repariert |
| [#226: bug: sandbox always created fresh, never reused; exec runs on parent sandbox](https://github.com/Conway-Research/automaton/issues/226) | closed | P1 | Teilweise bereits behoben; Rest repariert |
| [#259: Orchestrator deadlock in `executing` with stale `local://` assignment causes repeated `create_goal BLOCKED` sleep loop](https://github.com/Conway-Research/automaton/issues/259) | open | P1 | Bestätigt; repariert |
| [#262: Stuck goal ID blocking all progress – Request manual release of dead worker lock](https://github.com/Conway-Research/automaton/issues/262) | open | P1 | Bestätigt; repariert |
| [#266: Orchestrator deadlock: workers die and block all new goal creation](https://github.com/Conway-Research/automaton/issues/266) | open | P1 | Bestätigt; repariert |
| [#225: bug: agent stuck in create_goal BLOCKED loop, burning ~15k tokens per turn](https://github.com/Conway-Research/automaton/issues/225) | closed | P2 | Bereits behoben |
| [#404: [M3] Unsafe (db as any).config access in spawn.ts](https://github.com/Conway-Research/automaton/issues/404) | open | P2 | Bestätigt; repariert |
| [#401: [H6] ChildLifecycle.transition() throws without logging failed attempts](https://github.com/Conway-Research/automaton/issues/401) | open | P3 | Observability-Hardening; repariert |

**#224, #259, #262, #266** — Orchestrator setzte tote Worker-Aufträge auf pending, ließ den Child-Datensatz aber running; SimpleAgentTracker vergab denselben toten Worker erneut. Recovery übersah running-Aufträge.

Maßnahme: Toten Worker aus Pool entfernen und assigned/running-Aufträge freigeben. Regression mit echtem SimpleAgentTracker; Neustartfolgen bleiben ohne vorhandenen Worker erkennbar.

**#226** — Scoped Child-Client und Wiederverwendung sind bereits vorhanden. Reuse schlug aber an erneutem git clone in ein vorhandenes /root/automaton fehl; Install-Exitcodes wurden ignoriert.

Maßnahme: Vorhandenes Checkout wiederverwenden und jeden Installationsschritt auf Erfolg prüfen. Sandbox-Löschung ist API-seitig deaktiviert; Reuse ist kein Refund.

**#225** — src/agent/loop.ts enthält spezielle BLOCKED-create_goal-Zählung, Backoff und Cycle-Limit; loop-detector verhindert wiederholte Muster.

Maßnahme: Bestehende Loop-Regressions behalten; tatsächliche Worker-Deadlocks zusätzlich durch #259 beheben.

**#404** — AutomatonDatabase hat kein config-Feld; maxChildren und childSandboxMemoryMb wurden immer auf Defaults zurückgesetzt.

Maßnahme: Typisierte Config explizit an spawnChild und Legacy-Pfad übergeben; alle Runtime-Aufrufer angepasst. Regression für Limit und RAM-Tier.

**#401** — Ungültige Übergänge wurden korrekt abgelehnt, aber nicht geloggt; das ist kein nachgewiesener State-Machine-Bypass.

Maßnahme: Strukturierte Warnung mit Child, Ausgangs-/Zielstatus; hasChild ergänzt. Abgelehnte Übergänge dürfen nicht als letzter gültiger State in Lifecycle-Events erscheinen.

## Provisionierung

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#12: Auto-provision failed: Failed to get nonce: 502  (Provisioning Conway API key (SIWE))](https://github.com/Conway-Research/automaton/issues/12) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#294: I'm encountering a persistent SIWE authentication failure when trying to register my   agent to the Conway platform.](https://github.com/Conway-Research/automaton/issues/294) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#339: SIWE provisioning fails: POST /v1/auth/verify returns 500 Database error (fresh wallet)](https://github.com/Conway-Research/automaton/issues/339) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#353: Provision fails with SIWE verification: "Invalid or expired nonce" (401) on Windows v0.2.1](https://github.com/Conway-Research/automaton/issues/353) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#356: SIWE provisioning fails with "Invalid or expired nonce" despite fast round-trip and correct clock](https://github.com/Conway-Research/automaton/issues/356) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#359: SIWE provisioning fails with "Invalid or expired nonce" (401) — reproducible on latest main](https://github.com/Conway-Research/automaton/issues/359) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#371: SIWE provisioning fails with HTTP 500 Database error](https://github.com/Conway-Research/automaton/issues/371) | closed | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#372: SIWE provisioning fails: /v1/auth/verify returns 500 Database error / 401 Invalid or expired nonce](https://github.com/Conway-Research/automaton/issues/372) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#376: Provisioning fails — SIWE endpoint not issuing nonce (401 Invalid or expired nonce)](https://github.com/Conway-Research/automaton/issues/376) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#377: SIWE provisioning fails with 500 Database error](https://github.com/Conway-Research/automaton/issues/377) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#379: SIWE provisioning fails with 500 Database error on /v1/auth/verify](https://github.com/Conway-Research/automaton/issues/379) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#406: --provision fails immediately with "Invalid or expired nonce" even with a fresh nonce (22ms round-trip)](https://github.com/Conway-Research/automaton/issues/406) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#408: API outage: /v1/auth/verify returns 500 Database error for all valid SIWE signatures (blocks provisioning) + x402 top-up paid on-chain but never credited](https://github.com/Conway-Research/automaton/issues/408) | open | P1 | Extern + lokale Fehlerbehandlung repariert |
| [#419: Provisioning fails with 500 Database error on /v1/auth/verify](https://github.com/Conway-Research/automaton/issues/419) | open | P1 | Extern + lokale Fehlerbehandlung repariert |

**#12, #294, #339, #353, #356, #359, #371, #372, #376, #377, #379, #406, #419** — src/identity/provision.ts: verify verwendete den generischen Retry-Client mit einem einmaligen Nonce. Die Meldungen zeigen daneben direkte Serverfehler auch ohne Client-Retry.

Maßnahme: Verify/API-Key-Erzeugung ohne Retry; Regression: provision-regression.test.ts. Frische-Nonce-401 und Datenbank-500 benötigen weiterhin Backend-Fixes.

**#408** — Direkte verify-500 und on-chain Zahlung ohne Credit-Grant laut Issue; Server und Zahlungsledger fehlen. Lokale Retry-/Topup-Probleme zusätzlich bestätigt.

Maßnahme: Nonce-Replay beseitigt, persistente Topup-Sperre ergänzt; Betreiber muss Credit-Grant und betroffene Zahlung abgleichen.

## Werkzeugschutz

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#180: Security: Unescaped commit hash in pull_upstream cherry-pick (CWE-78)](https://github.com/Conway-Research/automaton/issues/180) | open | P1 | Bestätigt; repariert |
| [#395: [H1] x402_fetch tool result not sanitized for prompt injection](https://github.com/Conway-Research/automaton/issues/395) | open | P1 | Bestätigt; repariert |
| [#398: [H3] Duplicate isForbiddenCommand patterns between tools.ts and command-safety.ts](https://github.com/Conway-Research/automaton/issues/398) | open | P1 | Bestätigt; repariert |
| [#402: [M2] Legacy isForbiddenCommand in tools.ts missing policy-engine protection patterns](https://github.com/Conway-Research/automaton/issues/402) | open | P1 | Bestätigt; repariert |
| [#3: skills/loader.ts uses require() in ESM context](https://github.com/Conway-Research/automaton/issues/3) | open | P2 | Bereits behoben |
| [#28: Security Vulnerability Report & Sponsorship Offer from Singularity R&D](https://github.com/Conway-Research/automaton/issues/28) | open | P2 | Bereits behoben |
| [#172: fix: CWE-78 — Unescaped repoPath in git tools enables shell injection (8 locations)](https://github.com/Conway-Research/automaton/issues/172) | closed | P2 | Bereits behoben |
| [#173: fix: CWE-78 — Unescaped url and targetPath in git_clone enables shell injection](https://github.com/Conway-Research/automaton/issues/173) | closed | P2 | Bereits behoben |
| [#174: fix: CWE-78 — JSON.stringify in shell command enables injection in installed tool executor](https://github.com/Conway-Research/automaton/issues/174) | closed | P2 | Bereits behoben |
| [#175: fix: CWE-200 — API key exposed via runtime getter on Conway client](https://github.com/Conway-Research/automaton/issues/175) | closed | P2 | Bereits behoben |
| [#176: fix: CWE-636 — Silent fallback to local execSync on 403 bypasses sandbox](https://github.com/Conway-Research/automaton/issues/176) | closed | P2 | Bereits behoben |
| [#179: Security: Unescaped filePath in read_file shell fallback (CWE-78)](https://github.com/Conway-Research/automaton/issues/179) | open | P2 | Bereits behoben |
| [#181: Security: Unescaped package names in npm install commands (CWE-78)](https://github.com/Conway-Research/automaton/issues/181) | open | P2 | Teilweise bestätigt; repariert |
| [#188: new skills write_file will write files all over the place](https://github.com/Conway-Research/automaton/issues/188) | closed | P2 | Bereits begrenzt; Architekturgrenze bleibt |
| [#310: Security Vulnerability: path traversal in local-worker read_file, no sandbox clamping](https://github.com/Conway-Research/automaton/issues/310) | closed | P2 | Bereits behoben |
| [#400: [H5] Installed tool executor runs arbitrary DB-stored commands without validation](https://github.com/Conway-Research/automaton/issues/400) | open | P2 | Hardening; repariert |

**#180** — pull_upstream interpolierte commit ungeprüft; die Policy konnte umgangen werden, wenn kein Engine-Parameter übergeben wurde.

Maßnahme: Ausführungsseitige Hex-Hash-Validierung und Shellquoting ergänzt; injizierter Hash erreicht conway.exec nicht.

**#395** — EXTERNAL_SOURCE_TOOLS enthielt x402_fetch nicht; GeneralHarness schützte seinen Alias, direkter executeTool-Pfad nicht.

Maßnahme: x402_fetch-Ergebnisse vor Modellkontext sanitizen; direkte Regression mit ChatML-Injektion.

**#398, #402** — tools.ts hatte eine zweite, schwächere Forbidden-Pattern-Liste ohne policy-engine/policy-rules-Schutz.

Maßnahme: Gemeinsamen Matcher aus command-safety.ts nutzen; Direktaufrufe ohne PolicyEngine testen.

**#3, #28, #172, #173, #174, #175, #176, #179, #310** — ESM/execFileSync im Loader, Shellquoting in Git/read_file/installierten Args, kein API-Key-Getter oder Remote-403-Local-Fallback; LocalWorker liest über confinierte Harness-Pfade.

Maßnahme: Bestehende command-injection, skills-hardening und local-worker-security Tests prüfen diese Fälle; #400 verschärft zusätzlich die Command-Vorlage.

**#181** — Regex verhinderte Shell-Metazeichen bereits, erlaubte aber Optionen und Dateipfade; die behauptete direkte Shell-Injection war dadurch nicht reproduzierbar.

Maßnahme: npm-Paketformat enger, -- vor Paket, Shellquoting in allen drei Pfaden. Regression für --prefix und lokale Pfade.

**#188** — createSkill/installSkill validieren Namen und Skills-Verzeichnis; write_file hat Home-Confinement und Protected-File-Prüfung. Allgemeines exec bleibt frei.

Maßnahme: Skills-Regressions bestehen; echte Dateisystemisolation gehört zum getrennten Executor, siehe #27.

**#400** — DB-command war absichtlich eine Shellvorlage; Ausführung ohne Prüfung bestätigt. Voraussetzung des beschriebenen Angriffs ist bereits Schreibzugriff auf die DB; MCP-Ausführung ist im Code nur ein Stub.

Maßnahme: Nur ein Executable plus getrennte feste String-Argumente; alles quoten, gemeinsame Schutzprüfung. Allgemeiner Shellzugriff bleibt Teil des Produktes.

## Zahlungen und Guthaben

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#20: Not able to get credits with usdc](https://github.com/Conway-Research/automaton/issues/20) | open | P1 | Bestätigt; repariert |
| [#91: **Same issue here — USDC on wallet, $0 credits, billing UI broken**](https://github.com/Conway-Research/automaton/issues/91) | open | P1 | Extern; lokale Mehrfachkäufe abgesichert |
| [#177: fix: CWE-367 — TOCTOU race condition in transfer_credits balance check](https://github.com/Conway-Research/automaton/issues/177) | open | P1 | Bestätigt; lokal repariert |
| [#202: Credits topup successful but AI reads $0.00 - infinite critical loop](https://github.com/Conway-Research/automaton/issues/202) | open | P1 | Extern; lokale Mehrfachkäufe abgesichert |
| [#229: Credits vanishing without transaction records — $516 lost across two events](https://github.com/Conway-Research/automaton/issues/229) | closed | P1 | Extern; lokale Mehrfachkäufe abgesichert |
| [#236: Credits not registered after on-chain topup - 3x $5 USDC](https://github.com/Conway-Research/automaton/issues/236) | closed | P1 | Extern; lokale Mehrfachkäufe abgesichert |
| [#237: Credits not registered after on-chain USDC top-ups (3 × $5) – wallet funded, 0 credits](https://github.com/Conway-Research/automaton/issues/237) | open | P1 | Extern; lokale Mehrfachkäufe abgesichert |
| [#278: Credit topup successful but balance shows $0 - Insufficient credits error](https://github.com/Conway-Research/automaton/issues/278) | open | P1 | Extern; lokale Mehrfachkäufe abgesichert |
| [#288: Credit bootstrap topup issue](https://github.com/Conway-Research/automaton/issues/288) | open | P1 | Bestätigt; repariert |
| [#293: $30 USDC paid via EIP-3009 transferWithAuthorization but zero credits delivered - SIWE verify returns 500](https://github.com/Conway-Research/automaton/issues/293) | open | P1 | Extern; lokale Mehrfachkäufe abgesichert |
| [#307: Credits not registered after 3x $5 USDC top-ups](https://github.com/Conway-Research/automaton/issues/307) | open | P1 | Extern; lokale Mehrfachkäufe abgesichert |
| [#314: Credits show $15 on dashboard but inference returns 0 cents](https://github.com/Conway-Research/automaton/issues/314) | open | P1 | Extern; lokale Mehrfachkäufe abgesichert |
| [#393: Retry-driven duplicate USDC topups: fresh EIP-3009 nonce + no idempotency key on x402Fetch's paid leg (matches #236, #288)](https://github.com/Conway-Research/automaton/issues/393) | open | P1 | Bestätigt; repariert |
| [#396: [C3] Minimum reserve policy rule is a no-op (returns null unconditionally)](https://github.com/Conway-Research/automaton/issues/396) | open | P1 | Bestätigt; repariert |
| [#399: [H4] transfer_credits records transaction BEFORE verifying transfer success](https://github.com/Conway-Research/automaton/issues/399) | open | P1 | Teilweise bestätigt; repariert |

**#20** — packages/cli/src/commands/fund.ts nutzte den Agenten-Key, um Credits an dessen eigene Adresse zu übertragen; API lehnt dies ab.

Maßnahme: fund ohne --to kauft jetzt Credits mit Wallet-USDC; fremdes --to überträgt vorhandene Credits. Gemeinsame Topup-Sperre verwenden.

**#91, #202, #229, #236, #237, #278, #293, #307, #314** — Berichte über Zahlungen ohne Gutschrift, abweichende Dashboard-Balances oder verschwundene Credits. Der lokale Code enthält keine Conway-Settlement-/Credit-Ledger-Implementierung.

Maßnahme: Transaktionshash und Empfänger mit Betreiber-Ledger abgleichen. #288/#393 verhindern erneute Käufe bei unklarem Zahlungsausgang, ersetzen aber keine Gutschrift/Rückerstattung.

**#177** — transfer_credits und fund_child prüften Guthaben und transferierten ohne gemeinsame Serialisierung.

Maßnahme: Payer-Mutex umfasst Check, Transfer und Buchung. Andere Prozesse und externe Inferenzkosten benötigen weiterhin serverseitige atomare Reserveprüfung.

**#288, #393** — bootstrap, Inline-Loop und Heartbeat hatten getrennte Cooldowns. x402 hatte keine Zahlungsabsicht; neue Aufrufe erzeugten neue EIP-3009-Nonces.

Maßnahme: Gemeinsame SQLite-Claim vor dem ersten await, Idempotency-Key auf beiden HTTP-Legs, keine automatischen Probe-/Paid-Retries; unbekannten Zahlungsausgang dauerhaft sperren. x402-topup.test.ts.

**#396** — financial.minimum_reserve gab immer null zurück; die Halbierungsregel ließ eine konfigurierte Mindestreserve unterschreiten.

Maßnahme: Policy prüft Turn-Guthaben; Executor prüft frisches Credit-Guthaben unter Lock. x402 prüft Wallet-USDC vor Signatur. fund_child erhält dieselben Transferlimits.

**#399** — API-Aufruf wurde bereits awaited: geworfene Netzwerkfehler erzeugten keine Buchung. Eine erfolgreiche HTTP-Antwort mit status=failed wurde aber gebucht.

Maßnahme: Nur bekannte akzeptierte Statuswerte buchen; abgelehnte/unklare Statuswerte werfen Fehler und erzeugen keinen Spend-Eintrag. Pending/submitted beschreibt API-Annahme, keine On-chain-Finalität.

## Architektur und Vertrauensgrenzen

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#24: Slow-burn semantic attacks that build trust over many turns are not mitigated](https://github.com/Conway-Research/automaton/issues/24) | open | P2 | Reale Architekturgrenze |
| [#25: High-risk operations lack creator confirmation flow](https://github.com/Conway-Research/automaton/issues/25) | open | P2 | Reale Architekturgrenze |
| [#26: Dual-context verification (second inference call) not implemented](https://github.com/Conway-Research/automaton/issues/26) | open | P2 | Reale Architekturgrenze |
| [#27: chmod 444 file protections are reversible — agent runs as root in sandbox](https://github.com/Conway-Research/automaton/issues/27) | open | P2 | Reale Architekturgrenze |

**#24, #25, #26, #27** — Prompt-/Regex-Policy kann beliebigen Shellzugriff als root nicht vollständig isolieren. Quarantine für hohe Transfers existiert, umfassende externe Freigabe und unabhängiger Verifier nicht.

Maßnahme: Deployment mit unprivilegiertem Executor, separatem Wallet-/Policy-Broker, schreibgeschützten Policy-Mounts und optionaler Approval-/Verifier-Schnittstelle planen; keine falsche Garantie durch weitere Regexes.

## Dashboard und Support

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#17: app.conway.tech dashboard does nothing after sign-in (can't reach billing)](https://github.com/Conway-Research/automaton/issues/17) | open | P2 | Extern |
| [#48: 404 on app.conway.tech](https://github.com/Conway-Research/automaton/issues/48) | open | P2 | Extern |
| [#49: app.conway.tech instructions not accurate](https://github.com/Conway-Research/automaton/issues/49) | open | P2 | Extern |
| [#80: Dashboard sign-in bug - stuck on sign-in page after wallet authentication](https://github.com/Conway-Research/automaton/issues/80) | open | P2 | Extern |
| [#93: Rainbow wallet connect button broken on mobile and desktop](https://github.com/Conway-Research/automaton/issues/93) | open | P2 | Extern |
| [#212: can't sign in](https://github.com/Conway-Research/automaton/issues/212) | open | P2 | Extern |
| [#243: Billing page blank after login - cannot top up credits](https://github.com/Conway-Research/automaton/issues/243) | open | P2 | Extern |
| [#276: Cannot Complete Creation of Account/Sign-in](https://github.com/Conway-Research/automaton/issues/276) | open | P2 | Extern |
| [#282: discord support page link is invalid](https://github.com/Conway-Research/automaton/issues/282) | open | P2 | Extern |

**#17, #48, #49, #80, #93, #212, #243, #276, #282** — Dashboard-Anmeldung, Wallet-Connector, Website-Anleitungen und Discord-Einladung gehören nicht zu dieser Runtime.

Maßnahme: Conway-Webprojekt/Support benötigt eigene Änderungen. Lokale README kann nur den Runtime-Start erklären.

## Domains

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#61: Domain registration stuck at "pending"](https://github.com/Conway-Research/automaton/issues/61) | open | P2 | Extern / Support |
| [#101: Question about domain registration flow](https://github.com/Conway-Research/automaton/issues/101) | closed | P2 | Extern / Support |
| [#232: Domain Registration Issue - Refund for Unactivated Domain](https://github.com/Conway-Research/automaton/issues/232) | closed | P2 | Extern / Support |

**#61, #101, #232** — Pending-Bestellung, Fulfillment und Refund liegen beim Conway-Domainservice bzw. Registrar.

Maßnahme: Order-ID beim Betreiber prüfen; Runtime kann keine fremde Registrar-Bestellung abschließen.

## Heartbeat

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#4: Heartbeat daemon ignores config (defaultIntervalMs / lowComputeMultiplier)](https://github.com/Conway-Research/automaton/issues/4) | closed | P2 | Teilweise bereits behoben; Rest repariert |

**#4** — Daemon nutzt defaultIntervalMs bereits; lowComputeMultiplier stand jedoch nur im TickContext und beeinflusste die Scheduler-Fälligkeit nicht.

Maßnahme: Nicht essentielle Cron-/Intervallaufgaben werden jetzt um den konfigurierten Faktor verzögert; Credits, USDC, Inbox und Health bleiben erreichbar. Scheduler-Regression für beide Zeitplanarten.

## Inferenzkonfiguration

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#89: Conway inference error: context_length_exceeded when running long turns](https://github.com/Conway-Research/automaton/issues/89) | open | P2 | Historische Ursache begrenzt; nicht erneut reproduziert |
| [#385: SUGGESTION  Why cant we run automaton with local models and VMs?](https://github.com/Conway-Research/automaton/issues/385) | open | P2 | Vorschlag mit bestätigten lokalen Blockern; repariert |
| [#289: Excessive balance checks causing unnecessary credit consumption](https://github.com/Conway-Research/automaton/issues/289) | open | P3 | Optimierung; teilweise vorhanden |

**#89** — src/agent/context.ts, memory/context-manager.ts und context-hardening.test.ts begrenzen inzwischen History und Input. Issue enthält alten 164k-Token-Kontext, keinen aktuellen Repro.

Maßnahme: Aktuellen Provider, contextWindow und Tool-Schemas bei erneutem Fehler aufzeichnen. Kein Anspruch, dass jede Kombination niemals den Kontext überschreitet.

**#385** — Ollama-Unterstützung existiert bereits, aber --run verlangte einen Conway-Key und modelStrategy ignorierte das top-level inferenceModel; Routingmatrix konnte eigene Modelle überstimmen.

Maßnahme: Eigene Inferenz ohne Conway-Key zulassen, Modellwerte konsistent übernehmen und explizites lokales Modell bevorzugen. Conway-VM/Domain-Capabilities benötigen weiterhin Conway.

**#289** — Statuswerkzeuge sind bereits IDLE_ONLY_TOOLS; Loop filtert Status-Turns und hat Idle-/Cycle-Limits; Heartbeat nutzt TickContext-Caching.

Maßnahme: Kosten zuerst messen; zusätzliche Tool-Caches brauchen eine definierte Frischegrenze und sind kein belegter Korrektheitsfix.

## Persistenz

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#403: [M4] safeJsonParse returns null but callers don't null-check](https://github.com/Conway-Research/automaton/issues/403) | open | P2 | Meldung überwiegend falsch; Null-JSON gehärtet |

**#403** — safeJsonParse hatte bereits einen typisierten Fallback bei Syntaxfehlern; behaupteter null-Rückgabewert für Fehler ist falsch. Gültiges JSON null oder falscher Containertyp konnte dennoch durchkommen.

Maßnahme: Fallback bei null/falschem Array-/Objekttyp ergänzt; existing data-layer Tests plus Null-Config-Regression.

## Fragen und Support

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#76: minimum amount?](https://github.com/Conway-Research/automaton/issues/76) | open | P3 | Support / Dokumentation |
| [#82: Fund my agent](https://github.com/Conway-Research/automaton/issues/82) | open | P3 | Support / Dokumentation |
| [#143: Sent USDC on Ethereum instead of Base – recovery request](https://github.com/Conway-Research/automaton/issues/143) | open | P3 | Support / Dokumentation |
| [#213: How to change API_Key and base_url?](https://github.com/Conway-Research/automaton/issues/213) | open | P3 | Support / Dokumentation |
| [#244: Agent sandbox recovery — lost local wallet, sandbox still running](https://github.com/Conway-Research/automaton/issues/244) | open | P3 | Support / Dokumentation |
| [#263: Broken link for the ERC 8004 standard?](https://github.com/Conway-Research/automaton/issues/263) | open | P3 | Support / Dokumentation |
| [#268: sol integration](https://github.com/Conway-Research/automaton/issues/268) | open | P3 | Support / Dokumentation |
| [#301: Request export of server-side wallet private key for web-deployed Automaton](https://github.com/Conway-Research/automaton/issues/301) | open | P3 | Support / Dokumentation |
| [#322: funds lost](https://github.com/Conway-Research/automaton/issues/322) | open | P3 | Support / Dokumentation |
| [#323: Request: publish security advisory for fixed vulnerability in #310/#313 (CVE eligibility)](https://github.com/Conway-Research/automaton/issues/323) | open | P3 | Support / Dokumentation |
| [#335: Is there any verifiable evidence that an Automaton has become self-sustaining?](https://github.com/Conway-Research/automaton/issues/335) | open | P3 | Support / Dokumentation |

**#76, #82, #143, #213, #244, #263, #268, #301, #322, #323, #335** — Wallet-Recovery, Guthabenhilfe, Konfigurationsfrage, Advisory-Anfrage, Solana-Status oder Nachweisfrage ohne reproduzierten Runtime-Defekt.

Maßnahme: Private Keys nicht aus Adressen rekonstruierbar; Serverwallet-Export benötigt Betreiber. #263: Standardlink auf die kanonische EIP-Seite aktualisieren. #335: README ist kein Erfolgsnachweis.

## Unklare Meldungen und sonstige Beiträge

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#7: Agent flickering from 3 tools to 0 tools](https://github.com/Conway-Research/automaton/issues/7) | closed | P3 | Nicht hinreichend belegt |
| [#16: Insufficient Quota Error](https://github.com/Conway-Research/automaton/issues/16) | closed | P3 | Nicht hinreichend belegt |
| [#45: Sanbox Auto-provisioning does not work](https://github.com/Conway-Research/automaton/issues/45) | closed | P3 | Nicht hinreichend belegt |
| [#46: API Error on Automaton start up](https://github.com/Conway-Research/automaton/issues/46) | open | P3 | Nicht hinreichend belegt |
| [#51: 'check_social_inbox' fetch failed](https://github.com/Conway-Research/automaton/issues/51) | open | P3 | Nicht hinreichend belegt |
| [#92: Automaton stuck in a wakeup loop, x402 fetch problems](https://github.com/Conway-Research/automaton/issues/92) | open | P3 | Nicht hinreichend belegt |
| [#95: 404 not found](https://github.com/Conway-Research/automaton/issues/95) | open | P3 | Nicht hinreichend belegt |
| [#131: greetings from daimon — fellow autonomous agent building a network](https://github.com/Conway-Research/automaton/issues/131) | open | P3 | Nicht hinreichend belegt |
| [#154: Greetings from Cybergod](https://github.com/Conway-Research/automaton/issues/154) | open | P3 | Nicht hinreichend belegt |
| [#218: .](https://github.com/Conway-Research/automaton/issues/218) | open | P3 | Nicht hinreichend belegt |
| [#220: help](https://github.com/Conway-Research/automaton/issues/220) | open | P3 | Nicht hinreichend belegt |
| [#230: WeChat交流群](https://github.com/Conway-Research/automaton/issues/230) | open | P3 | Nicht hinreichend belegt |
| [#245: its a scam and crypto drainer](https://github.com/Conway-Research/automaton/issues/245) | open | P3 | Nicht hinreichend belegt |
| [#274: Setup failure: Web Terminal disconnects during installation wizard, causing DB 'identity.value' constraint error](https://github.com/Conway-Research/automaton/issues/274) | open | P3 | Nicht hinreichend belegt |
| [#295: Agent 37900 Shows "assigned: 4" But Receives 0 Executable Tasks - $8.58 Credits Wasted](https://github.com/Conway-Research/automaton/issues/295) | open | P3 | Nicht hinreichend belegt |
| [#296: Urgent: Social Relay Connectivity Issue - Agent Cannot Receive Tasks](https://github.com/Conway-Research/automaton/issues/296) | open | P3 | Nicht hinreichend belegt |
| [#299: Web4.0](https://github.com/Conway-Research/automaton/issues/299) | closed | P3 | Nicht hinreichend belegt |
| [#300: Local automaton ran 14 days, 276 goals, .00 revenue, repeated proposal-batch loops](https://github.com/Conway-Research/automaton/issues/300) | open | P3 | Nicht hinreichend belegt |
| [#311: Persistent 404 on all V1 API endpoints & Failed Credit Top-up](https://github.com/Conway-Research/automaton/issues/311) | open | P3 | Nicht hinreichend belegt |
| [#320: Automaton](https://github.com/Conway-Research/automaton/issues/320) | open | P3 | Nicht hinreichend belegt |
| [#325: new](https://github.com/Conway-Research/automaton/issues/325) | open | P3 | Nicht hinreichend belegt |
| [#357: Automatic](https://github.com/Conway-Research/automaton/issues/357) | open | P3 | Nicht hinreichend belegt |
| [#362: money](https://github.com/Conway-Research/automaton/issues/362) | open | P3 | Nicht hinreichend belegt |
| [#366: start](https://github.com/Conway-Research/automaton/issues/366) | open | P3 | Nicht hinreichend belegt |
| [#380: Wisdomv22400](https://github.com/Conway-Research/automaton/issues/380) | open | P3 | Nicht hinreichend belegt |
| [#384: mio](https://github.com/Conway-Research/automaton/issues/384) | closed | P3 | Nicht hinreichend belegt |
| [#390: Having trouble installing Automaton](https://github.com/Conway-Research/automaton/issues/390) | open | P3 | Nicht hinreichend belegt |
| [#392: tips for 401](https://github.com/Conway-Research/automaton/issues/392) | open | P3 | Nicht hinreichend belegt |
| [#407: idea](https://github.com/Conway-Research/automaton/issues/407) | open | P3 | Nicht hinreichend belegt |

**#7, #16, #45, #46, #51, #92, #95, #131, #154, #218, #220, #230, #245, #274, #295, #296, #299, #300, #311, #320, #325, #357, #362, #366, #380, #384, #390, #392, #407** — Kein aktueller minimaler Runtime-Repro, teilweise nur Screenshot, leerer Text, Social-Post, Geschäftsresultat oder mehrere vermischte Serviceprobleme.

Maßnahme: Konfiguration ohne Secrets, Versionsstand, vollständige Fehlermeldung und erwartetes Verhalten nötig. Keine automatische Bugbehauptung; #390 kann vom behobenen npm-Buildfehler profitieren.

## Vorschläge und Integrationen

| Issue | Upstream | Priorität | Lokaler Befund |
|---|---|---|---|
| [#8: add ability to use chatgpt pro account for token usage](https://github.com/Conway-Research/automaton/issues/8) | open | P4 | Vorschlag; kein belegter Bug |
| [#38: proposal: collective intelligence relay — shared learning across automaton instances](https://github.com/Conway-Research/automaton/issues/38) | open | P4 | Vorschlag; kein belegter Bug |
| [#44: AgentPartner: Professional Network, Ventures, and Collaborators for Automatons](https://github.com/Conway-Research/automaton/issues/44) | open | P4 | Vorschlag; kein belegter Bug |
| [#59: ICP canister as native automaton runtime — replacing Conway Cloud dependency](https://github.com/Conway-Research/automaton/issues/59) | open | P4 | Vorschlag; kein belegter Bug |
| [#81: chore: Dynamically load EIP712 name/version strings](https://github.com/Conway-Research/automaton/issues/81) | open | P4 | Vorschlag; kein belegter Bug |
| [#88: feat: add xProof skill - on-chain output certification for Automatons](https://github.com/Conway-Research/automaton/issues/88) | open | P4 | Vorschlag; kein belegter Bug |
| [#119: feat: add Kevros governance identity skill — verifiable trust for automatons](https://github.com/Conway-Research/automaton/issues/119) | open | P4 | Vorschlag; kein belegter Bug |
| [#190: Partnership: Billy Trust Score + Conway Automaton](https://github.com/Conway-Research/automaton/issues/190) | open | P4 | Vorschlag; kein belegter Bug |
| [#192: Feature: Add 0xWork as a revenue source for Automatons](https://github.com/Conway-Research/automaton/issues/192) | open | P4 | Vorschlag; kein belegter Bug |
| [#197: How can automatons submit PRs / branches of their evolution for other agents?](https://github.com/Conway-Research/automaton/issues/197) | open | P4 | Vorschlag; kein belegter Bug |
| [#211: Request for Agent Marketplace](https://github.com/Conway-Research/automaton/issues/211) | open | P4 | Vorschlag; kein belegter Bug |
| [#240: feat(discovery): configurable RPC endpoint for agent discovery](https://github.com/Conway-Research/automaton/issues/240) | closed | P4 | Bereits umgesetzt |
| [#247: [Feature Request] Reputation check for external wallet interactions](https://github.com/Conway-Research/automaton/issues/247) | open | P4 | Vorschlag; kein belegter Bug |
| [#248: Add L402 Protocol Support for Lightning-Based API Access](https://github.com/Conway-Research/automaton/issues/248) | open | P4 | Vorschlag; kein belegter Bug |
| [#291: Invitation to help bootstrap "Success": A browser-only Automaton migration experiment](https://github.com/Conway-Research/automaton/issues/291) | open | P4 | Vorschlag; kein belegter Bug |
| [#305: Proposal: Observer Protocol for Self-Replicating Agent Verification](https://github.com/Conway-Research/automaton/issues/305) | open | P4 | Vorschlag; kein belegter Bug |
| [#319: 🫘 GoldBean — Real-time EVM blockchain data via x402 micropayments (1¢ per call)](https://github.com/Conway-Research/automaton/issues/319) | open | P4 | Vorschlag; kein belegter Bug |
| [#324: Integration idea: buyer recipe for live CDP-indexed x402 services](https://github.com/Conway-Research/automaton/issues/324) | open | P4 | Vorschlag; kein belegter Bug |
| [#331: [Skill Proposal] per-inference cryptographic receipt for automaton outputs — 152 bytes, offline verifiable](https://github.com/Conway-Research/automaton/issues/331) | open | P4 | Vorschlag; kein belegter Bug |
| [#352: [Proposal] Native security skill to prevent on-chain draining attacks](https://github.com/Conway-Research/automaton/issues/352) | open | P4 | Vorschlag; kein belegter Bug |

**#8, #38, #44, #59, #81, #88, #119, #190, #192, #197, #211, #247, #248, #291, #305, #319, #324, #331, #352** — Neue Plattformen, Fähigkeiten, Governance-/Zertifizierungsskills, Payment-Protokolle oder Integrationen statt einer reproduzierten Runtime-Abweichung.

Maßnahme: Separat als Feature bewerten; keine fremden beworbenen Services installieren. #81: EIP-712-Domain für unterstützte USDC-Verträge ist derzeit ausdrücklich festgelegt.

**#240** — Discovery akzeptiert rpcUrl und reicht ihn an Registry-Abfragen weiter; discovery-abi.test.ts prüft diese Anbindung.

Maßnahme: Bestehenden konfigurierbaren RPC-Pfad behalten.

## Grenzen der abgeschlossenen Änderungen

- Keine Gutschriften, Rückerstattungen, Service-Quota-Änderungen oder Dashboard-Fixes: der dafür zuständige Servercode fehlt.
- Pending/submitted Transfers sind API-seitig angenommen. Die vorhandene Transaktionstabelle besitzt kein Settlement-Statusmodell; dies ist kein On-chain-Finalitätsnachweis.
- Unklare Topups bleiben über Neustarts gesperrt. Vor Aufheben einer `topup_intent:*`-Sperre in der KV-Tabelle muss ein Betreiber Zahlung und Gutschrift abgleichen. Ein Idempotency-Key allein beweist keine serverseitige Deduplizierung.
- Transfer-Mutex schützt konkurrierende Aufrufe dieses Prozesses. Atomare Reservegarantie über Prozesse und fremde Kosten benötigt das Zahlungsbackend.
- HTTPS-Redirects werden verweigert. Git-Clone benötigt Git/libcurl mit `http.curloptResolve`; die [Git-Dokumentation](https://git-scm.com/docs/git-config/2.54.0) beschreibt DNS-Pinning und Redirect-Verhalten.
- Shellzugriff und Self-Modification sind Produktfunktionen. Prompt-Sanitizing und lokale Policies bieten keine OS-Isolation und keinen Beweis, dass Langzeitinjektion ausgeschlossen ist.
