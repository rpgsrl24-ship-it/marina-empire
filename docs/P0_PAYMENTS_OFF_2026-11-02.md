# P0-09 — Pagamenti OFF sul gioco pubblico — 2 novembre 2026

## Problema e correzione applicata

Il checkout e il riscatto distribuiti nella versione 1 dipendevano dai flag `ME_CHECKOUT_ENABLED` e `ME_VOUCHERS_ENABLED`. L'interfaccia era disabilitata, ma l'ispezione non poteva garantire il comportamento di un utente autenticato senza conoscere i flag effettivi. Non sono stati letti segreti o valori di ambiente.

Le tre entrypoint di produzione distribuite da `supabase/functions/` rispondono sempre **503 / `PAYMENTS_DISABLED`** alle POST. Non leggono flag o segreti, non consumano il body, non importano SDK, non verificano identità, non chiamano provider e non scrivono dati. Anche un ambiente accidentalmente configurato con flag `true` resta spento. Le richieste OPTIONS restituiscono 204; i metodi non supportati 405.

I percorsi per ordini, emissione e riscatto precedenti sono conservati in `backend/payments-archive-2026-11-02/`, con estensione `.ts.txt`, fuori dalle funzioni distribuite e senza import. L'attivazione futura richiede un nuovo codice revisionato, i collaudi sandbox e l'autorizzazione esplicita del titolare. Non può avvenire cambiando una variabile di ambiente.

La verifica JWT del gateway resta invariata: `true` per checkout/emissione, `false` per riscatto. Un rifiuto 401 del gateway rimane distinto dal 503 della funzione.

## Verifiche prima dell'intervento

- Letti changelog e documentazione Supabase su funzioni, header di autorizzazione e CORS.
- Ispezionate le tre funzioni live, tutte `ACTIVE`, versione 1; nessun valore segreto incluso nei sorgenti.
- Consultati soltanto conteggi aggregati dei log delle funzioni; nessun body, token, email o dato giocatore letto.
- Advisor di sicurezza coerenti con l'audit precedente: due informazioni RLS sulle tabelle interne voucher, tre avvisi sulle RPC ormeggi `SECURITY DEFINER` e protezione password compromesse disattivata. Nessun cambio a database, Auth o privilegi in questo intervento.

## Test comportamentali locali

`node tests/payments-off.test.cjs`: **6/6 test superati**. I test eseguono i file entrypoint effettivi in un contesto isolato, senza trasformazioni del codice.

- 1.134 POST attraverso le tre funzioni: sette valori di flag, tre origini, tre tipi di header Authorization e sei body, inclusi SKU, voucher, richiesta di accredito e JSON non valido.
- Ogni POST restituisce 503 e il codice `PAYMENTS_DISABLED`, senza URL checkout, redirect, saldo o identificativo ordine.
- Zero letture di ambiente/segreti, zero client Auth/database creati, zero fetch e zero hash voucher; il body della richiesta resta non letto.
- Preflight CORS supportato, origine di risposta limitata al dominio GitHub Pages, `cache-control: no-store`; GET, HEAD, PUT, PATCH e DELETE rifiutati.
- Le suite esistenti su accesso/pagamenti, checkout staging e voucher staging continuano a passare. Il codice dei futuri pagamenti resta verificabile separatamente, senza essere distribuito.

Gli header dei test rappresentano richieste arrivate al gestore dopo l'eventuale controllo del gateway. Non sono token reali e non costituiscono un collaudo di login. La proprietà dimostrata è che il gestore non ha alcun ramo capace di attivare un pagamento, per qualsiasi header ricevuto.

## Bundle revisionabile

Ogni funzione usa un solo file `index.ts`, senza import map o dipendenze. GitHub Pages non distribuisce queste funzioni: occorre un deploy Supabase separato dopo revisione.

| Funzione | verify_jwt | SHA-256 di index.ts |
| --- | --- | --- |
| marina-direct-checkout | true | `38ce17e231fb10564187c68cbdc0b52a9b358cd8982f3ef43068750a97079542` |
| marina-redeem-credit | false | `73b40ec2aaddf5c9aabe1aa8ce7035c87fe30797dcbb1348c0d55dcbf9066a3f` |
| marina-issue-credit | true | `f6e672b21fa68b17b59a5870acfac2eac9b951de2358c0c711f785a1b254e3b6` |

## Esito distribuzione e richieste reali

**Distribuito e verificato il 2 novembre 2026, ore 09:58 CET (Europe/Rome).** La rilettura precedente al deploy ha confermato che versioni 1, sorgenti e configurazione JWT non erano cambiati dalla revisione. I tre deploy sequenziali hanno prodotto funzioni **ACTIVE, versione 2**, con `verify_jwt` invariato. I sorgenti riletti dopo la distribuzione corrispondono integralmente ai bundle revisionati e agli hash indicati sopra.

Sono state inviate due POST vuote `{}` per funzione: una senza credenziali e una con la sola chiave publishable già pubblica nel frontend, nell'header `apikey`. Nessun header Authorization, token utente, cookie, SKU, codice voucher o dato personale è stato usato. La chiave pubblica permette di raggiungere il gestore secondo il comportamento del gateway osservato; non rappresenta l'identità di un giocatore.

| Funzione | POST anonima | POST con sola apikey pubblica | Conclusione |
| --- | --- | --- | --- |
| marina-direct-checkout | 401 del gateway | **503 / PAYMENTS_DISABLED** | Gestore OFF raggiunto e verificato. |
| marina-redeem-credit | **503 / PAYMENTS_DISABLED** | **503 / PAYMENTS_DISABLED** | Riscatto OFF verificato in entrambi i percorsi. |
| marina-issue-credit | 401 del gateway | **503 / PAYMENTS_DISABLED** | Emissione OFF raggiunta e verificata. |

Tutte le risposte del gestore riportano `cache-control: no-store`. Nessun ordine, pagamento, accredito, account o email è stato creato. Non è stato necessario procurare token o usare dati di giocatori. La proprietà OFF per le richieste di utenti autenticati deriva dal gestore senza rami attivabili, confrontato con il sorgente live e testato localmente con header di identità; non viene presentata come un accesso eseguito con un account reale.

Il blocco applicativo OFF di P0-09 è verificato sui tre endpoint distribuiti. La futura attivazione, i flussi di acquisto reali e il collaudo del titolare restano attività separate e non autorizzate da questa verifica.

## Riferimenti tecnici

- [Supabase: autorizzazione e verifica del gateway](https://supabase.com/docs/guides/functions/auth-headers).
- [Supabase: CORS delle Edge Functions](https://supabase.com/docs/guides/functions/cors).
- [Changelog Supabase](https://supabase.com/changelog).
- [Dismissione cifrari TLS precedenti](https://supabase.com/changelog/cbc-tls-ciphers-deprecated): cambiamento annunciato per il 10 novembre 2026, non richiede variazioni a questi gestori privi di chiamate esterne.
- [Advisor RLS senza policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- [Advisor RPC SECURITY DEFINER](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- [Protezione password compromesse](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
