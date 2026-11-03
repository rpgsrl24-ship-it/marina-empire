# Marina Empire - Checklist crediti

Stato: acquisti non ancora attivi.

1. Verificare il pagamento WooCommerce.
2. Generare un codice unico per ogni pacchetto acquistato.
3. Consegnare il codice al cliente via email.
4. Permettere il riscatto soltanto all'account registrato.
5. Registrare ogni accredito e ogni spesa nel portafoglio online.
6. Impedire doppi accrediti e doppi addebiti.
7. Testare rimborsi, interruzioni di rete e utilizzo da due dispositivi.
8. Pubblicare i pacchetti solo dopo una prova completa di acquisto e utilizzo.

I crediti della beta sono separati dai crediti acquistati.

## Pacchetti WooCommerce verificati (1 novembre 2026)

| SKU | Crediti | Prezzo EUR | Stato |
|---|---:|---:|---|
| ME-CREDITS-50000 | 50.000 | 4,99 | Bozza |
| ME-CREDITS-120000 | 120.000 | 9,99 | Bozza |
| ME-CREDITS-300000 | 300.000 | 19,99 | Bozza |
| ME-CREDITS-900000 | 900.000 | 49,99 | Bozza |
| ME-CREDITS-2000000 | 2.000.000 | 99,99 | Bozza |

Non accettare SKU diversi e non fidarsi del prezzo o della quantità inviati dal browser. Verificare gli ordini pagati direttamente con WooCommerce, impedire l'emissione doppia per ogni riga e unità acquistata e consegnare il codice solo dopo la conferma del pagamento.

**Blocco tecnico confermato:** la funzione Supabase `marina-issue-credit` non è ancora configurata per emettere codici. Nessuna vendita va abilitata finché non sono funzionanti emissione, consegna, riscatto e spesa sul server.


## Stato tecnico aggiornato - 3 novembre 2026

Completato:
- [x] Wallet server-side con saldo non negativo.
- [x] Voucher univoci con hash server-side.
- [x] Vincolo idempotente ordine/riga/unita per impedire doppie emissioni.
- [x] Ledger degli accrediti.
- [x] Outbox per consegna email del codice.
- [x] Webhook WooCommerce server-authoritative.
- [x] Verifica firma webhook.
- [x] Verifica ordine reale tramite WooCommerce REST API.
- [x] Controllo SKU, product ID, quantita, prezzo e valuta.
- [x] Gestione rimborsi: voucher non riscattati revocati.
- [x] Rimborso dopo riscatto: revisione manuale, nessun addebito automatico al wallet.
- [x] Funzioni interne voucher non eseguibili da anon/authenticated.
- [x] Test GitHub release-gate e smoke test passati.
- [x] Playwright desktop/mobile collegato alla CI gratuita.

Da completare prima dell'attivazione:
- [ ] Verifica live su RPG Yacht dei 5 prodotti WooCommerce e relativi ID/prezzi.
- [ ] Verifica gateway carta/PayPal attivi.
- [ ] Verifica/creazione webhook WooCommerce verso marina-woo-credit-webhook.
- [ ] Verifica segreti WooCommerce e provider email presenti in Supabase.
- [ ] Test email reale del codice.
- [ ] Ordine reale di collaudo da EUR 4,99.
- [ ] Riscatto del codice con account registrato.
- [ ] Test rimborso dell'ordine di collaudo.
- [ ] Solo dopo il collaudo: abilitare i pulsanti ACQUISTA CREDITI nel client.

Nota: al 3 novembre 2026 gli acquisti restano intenzionalmente disabilitati nel client pubblico.
