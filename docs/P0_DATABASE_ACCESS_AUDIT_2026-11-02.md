# P0 — Account, dati e base RPG Yacht — 2 novembre 2026

## Ambito e prove

Progetto Supabase identificato dal repository: `zrdetqvnjmqkfyajxjgp` (`marina-empire`). Lo stato restituito dal servizio è `ACTIVE_HEALTHY`, PostgreSQL 17.11.0.003, regione `eu-central-1`.

Sono stati letti soltanto metadati di schema, policy RLS, privilegi, definizioni delle funzioni e avvisi di sicurezza. Nessuna riga di profili, salvataggi, prenotazioni, portafogli o segnalazioni è stata consultata. Non sono stati creati account, inviate email o effettuate operazioni di pagamento.

## Permessi effettivamente osservati

| Oggetto | Regola osservata nel database |
| --- | --- |
| `player_profiles` | RLS attiva. Il giocatore legge/inserisce/aggiorna il proprio `user_id`; un membro di `me_admin_users` può leggere i profili per amministrazione. UPDATE comprende `USING` e `WITH CHECK` sul proprietario. |
| `player_progress` | RLS attiva. Stessa separazione per proprietario e lettura amministrativa. Nessuna policy anonima di lettura/scrittura. |
| `me_admin_users` | RLS attiva. `authenticated` può soltanto leggere la propria appartenenza; nessun privilegio client per inserirsi come amministratore. |
| `me_credit_wallets` | RLS attiva. Il client autenticato ha soltanto SELECT del proprio saldo; nessun privilegio di scrittura. |
| `me_chat_reports` | RLS attiva. INSERT richiede `reporter_id = auth.uid()`, stato `pending` e campi di revisione vuoti. Lettura e revisione riservate ai membri amministrativi. |
| `berth_bookings` | RLS attiva. `authenticated` ha soltanto SELECT delle proprie prenotazioni. Nessun grant o policy client INSERT/UPDATE. La tabella `berth_reservations` non esiste nel progetto attuale. |

I privilegi di base di profili, progressi e segnalazioni comprendono alcune operazioni più ampie del necessario; l'accesso alle righe resta subordinato alle policy osservate. Una futura riduzione dei privilegi richiede una revisione separata e non è stata eseguita in questo intervento.

Questo controllo conferma le regole configurate. Non sostituisce un collaudo tra due account reali su dispositivi differenti, che resta aperto.

## Correzione applicata: `reserve_berth`

La funzione pubblica per i giocatori accettava `rose`, nonostante i controlli dell'interfaccia. È stata applicata la migrazione ufficiale `reserve_berth_rpg_headquarters_guard` dopo una nuova lettura che ha confermato che la definizione non era cambiata durante la revisione.

Il nuovo ramo rifiuta sempre `rose` con SQLSTATE `42501` e messaggio «Isola delle Rose: base operativa riservata a RPG Yacht» prima di qualsiasi INSERT. Il percorso pubblico di prenotazione non concede privilegi di gestione del quartier generale.

Sono rimasti identici firma, proprietario `postgres`, `SECURITY DEFINER`, `search_path` vuoto e ACL `{postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres}`. `anon` non può eseguire la funzione; i giocatori non possono inserire o aggiornare direttamente `berth_bookings`. Non sono state cancellate prenotazioni o modificati saldi. Le altre marine mantengono la logica preesistente.

Prove dopo applicazione:

- `supabase/tests/reserve_berth_headquarters_readonly.sql`: **PASS** in transazione `READ ONLY`, ruolo `authenticated`, UUID fittizio usato soltanto come claim della sessione SQL. Nessun account è stato creato. La richiesta Rose viene negata prima di scritture; la validazione di un posto non valido a Rimini resta attiva.
- Nuova lettura di definizione, firma e ACL: **coerenti con la patch**.
- Il template storico `supabase/berth_reservations.sql` non definisce `reserve_berth` e non introduce policy client INSERT; non è stato distribuito.
- `tests/headquarters-database-contract.test.cjs` controlla tutte le definizioni SQL presenti nel repository affinché una futura distribuzione conservi il blocco Rose.

## Chat di marina: limite ancora aperto

Le policy controllate sopra proteggono le **segnalazioni**, non il trasporto dei messaggi. Il codice di `connect()` usa un client senza sessione persistente e un canale pubblico `marina-community-*`; il requisito «solo utenti registrati» è verificato nell'interfaccia con `window.meRegisteredPlayer`, ma non costituisce un'autorizzazione del canale sul server. Nessun messaggio reale è stato letto o inviato durante l'audit. La limitazione richiede un intervento specifico (canale privato con identità e policy server, oppure sospensione temporanea della chat); non viene dichiarata risolta da questa patch.

## Pagamenti

Le funzioni effettivamente distribuite sono state ispezionate. Sono poi state inviate soltanto le tre richieste vuote non autenticate descritte sotto:

- `marina-direct-checkout`: esige `ME_CHECKOUT_ENABLED === "true"`; altrimenti termina con 503 prima di creare un ordine.
- `marina-redeem-credit`: esige `ME_VOUCHERS_ENABLED === "true"`, poi verifica l'utente sul server; le RPC interne di emissione/riscatto non sono eseguibili da `anon` o `authenticated`.
- `marina-issue-credit`: restituisce sempre 503, emissione non configurata.

### Verifica HTTP reale, senza possibilità di ordine o accredito

Il 2 novembre 2026 è stata inviata **una sola POST per endpoint**, con body `{}` e soltanto gli header `Content-Type: application/json` e `Origin: https://rpgsrl24-ship-it.github.io`. Non sono stati forniti Authorization, API key, cookie, codici voucher, SKU, email o altri dati utente. Prima della prova è stato verificato nel codice distribuito che l'assenza di Authorization interrompe checkout e riscatto prima di qualsiasi operazione d'ordine/accredito; l'emissione non contiene operazioni di emissione attive.

| Endpoint | Status osservato | Risposta, limitata al messaggio d'errore | Conclusione consentita |
| --- | --- | --- | --- |
| `marina-redeem-credit` | **503** | `Ricariche non ancora attive` | Il blocco delle ricariche è effettivamente attivo nel servizio al momento della prova. Questa risposta viene emessa dal gate prima della verifica del Bearer. |
| `marina-direct-checkout` | **401** | `UNAUTHORIZED_NO_AUTH_HEADER` / `Missing authorization header` | Il gateway respinge una richiesta non autenticata. Il valore effettivo del gate checkout non è osservabile con questa prova perché il gateway interviene prima della funzione. |
| `marina-issue-credit` | **401** | `UNAUTHORIZED_NO_AUTH_HEADER` / `Missing authorization header` | Il gateway respinge la richiesta. Il codice distribuito ispezionato è comunque uno stub che restituisce 503 senza emettere voucher. |

Non sono stati eseguiti retry né procurati token per oltrepassare il middleware. Nessun acquisto, ordine, accredito o email è stato generato. Non sono stati letti segreti o variabili di ambiente. La prova non attesta il comportamento del checkout di un account autenticato; l'interfaccia continua a mantenere disabilitati ricariche e pagamenti, e il test locale verifica la chiusura del checkout con flag assente o falso.

## Correzioni di interfaccia account

`tests/p0-access-payment.test.cjs` esegue funzioni effettive con risposte controllate, senza rete. Copre logout amministrativo anche senza sessione, logout da altra scheda, risposte admin/portafoglio ritardate, conservazione della prima partita durante la registrazione, separazione tra account, nuova partita ospite esplicitamente confermata, proprietà del backup, recupero password durante l'inizializzazione e checkout chiuso.

Il trasferimento ospite richiede una richiesta di registrazione/accesso via email effettuata su quel browser, email confermata corrispondente, nessuna partita locale o cloud da sostituire e assegnazione ad un solo account. Logout e cambio account non liberano l'assegnazione. Soltanto una nuova partita ospite esplicitamente confermata può creare una nuova assegnazione.

## P0-18 — Privacy: ancora aperto

Il modulo obbliga alla presa visione di un'informativa, ma il repository non contiene né il relativo testo né un collegamento. Non è corretto considerare chiusa la voce.

La casella marketing è ora disabilitata e indica che le comunicazioni commerciali non sono disponibili nella beta. Il codice non registra quel consenso. I collegamenti di assistenza a `info@floatmarine.it` sono presenti; nessun messaggio di prova è stato inviato.

Il testo specifico del gioco deve descrivere almeno i dati realmente trattati: email e nome pubblico, autenticazione, salvataggi, messaggi pubblici di marina e segnalazioni, identificatori del browser/sessione, provenienza UTM ed eventi di attività. Devono essere definiti dal titolare anche conservazione/cancellazione, basi giuridiche, fornitori e trasferimenti applicabili. Non sono state inventate promesse di cancellazione o garanzie legali, né riutilizzata automaticamente l'informativa del negozio.

## Avvisi Supabase successivi alla correzione

L'esecuzione degli advisor non ha introdotto nuovi rilievi rispetto al controllo iniziale. Restano:

- Due informazioni «RLS senza policy» sulle tabelle interne voucher e consegne: nessuna policy client è coerente con l'accesso tramite operazioni interne. [Riferimento Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- Tre avvisi per RPC `SECURITY DEFINER` eseguibili da utenti autenticati: `reserve_berth`, `cancel_berth`, `me_berth_availability`. Sono stati verificati `auth.uid()`, ambito del proprietario per cancellazione e ritorno dei soli numeri posto per disponibilità. Il blocco Rose è ora aggiunto al percorso di prenotazione. [Riferimento Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- Protezione contro password compromesse disattivata. Non è stata cambiata la configurazione Auth. [Riferimento Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

Le prenotazioni riuscite nelle altre marine, le email di conferma/recupero e la sincronizzazione tra dispositivi reali non sono state collaudate da questo audit.
