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
