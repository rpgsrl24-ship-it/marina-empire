# Marina Empire - credito acquistato (integrazione in preparazione)

Stato 29/10/2026: prodotti WooCommerce in bozza; nessuna vendita attiva.

## Prodotti WooCommerce
- ME-CREDITS-50000 / 50.000 / EUR 4,99
- ME-CREDITS-120000 / 120.000 / EUR 9,99
- ME-CREDITS-300000 / 300.000 / EUR 19,99
- ME-CREDITS-900000 / 900.000 / EUR 49,99
- ME-CREDITS-2000000 / 2.000.000 / EUR 99,99

## Backend già creato
Supabase project: zrdetqvnjmqkfyajxjgp
- me_credit_wallets: saldo autorevole acquistato
- me_credit_vouchers: hash del codice, stato e riferimento ordine
- me_credit_ledger: accrediti
- me_redeem_voucher_internal: RPC utilizzabile solo da service_role
- marina-redeem-credit: endpoint distribuito, disabilitato finché ME_VOUCHERS_ENABLED non è true
- marina-issue-credit: endpoint segnaposto che restituisce 503, nessuna emissione

## Flusso da completare
1. Ordine WooCommerce pagato, verificato server-to-server tramite API autenticata.
2. Per ogni unità del pacchetto, generare codice crittograficamente casuale; salvare solo SHA-256 nel database.
3. Persistenza sicura del codice in metadati ordine WooCommerce per reinvii, non in log pubblici.
4. Idempotenza su order_id + line_item_id + unit_index. NON usare una singola riga per quantità >1.
5. Invio al cliente solo dopo la conferma di persistenza.
6. Riscatto con account autenticato, controllo anti abuso, transazione atomica, saldo server.
7. Trattare rimborsi/chargeback: revoca codici non riscattati; gestione saldi già spesi.
8. Migrare le operazioni economiche del gioco dal localStorage al backend prima di rendere spendibili i crediti acquistati.

## Condizioni di lancio
Non pubblicare i prodotti, non attivare l'emissione e non abilitare il pulsante RISCATTA prima di test completi, audit e conferma esplicita.

## Test minimi
- pagamento confermato / pagamento fallito
- retry webhook / duplicato
- acquisto quantità 2+
- codice valido / codice inesistente / codice già riscattato
- riscatto simultaneo dello stesso codice
- utente non autenticato
- rimborso prima e dopo riscatto
- saldo invariato se transazione fallisce
