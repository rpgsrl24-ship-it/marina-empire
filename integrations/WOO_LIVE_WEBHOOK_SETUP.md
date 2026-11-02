# Marina Empire — configurazione webhook WooCommerce LIVE

Stato: PREPARATO / NON ATTIVO

## Endpoint
- Delivery URL: `https://zrdetqvnjmqkfyajxjgp.supabase.co/functions/v1/marina-woo-credit-webhook`
- Edge Function: `marina-woo-credit-webhook`
- Supabase project: `zrdetqvnjmqkfyajxjgp`
- verify_jwt: false
- Autenticazione richiesta: firma HMAC WooCommerce + verifica ordine server-to-server

## Webhook WooCommerce
Creare da WooCommerce > Impostazioni > Avanzate > Webhook:
- Nome: `Marina Empire - Crediti ordine aggiornato`
- Stato iniziale: `Paused`
- Topic: `order.updated`
- Delivery URL: endpoint indicato sopra
- Secret: dedicato, lungo e casuale

## Gate
Non portare ACTIVE il webhook finché non sono configurati:
- `ME_WOO_WEBHOOK_SECRET`
- `ME_WOO_API_KEY`
- `ME_WOO_API_SECRET`
- `ME_WOO_BASE_URL=https://www.rpgyacht.com`
- `ME_VOUCHER_ENCRYPTION_KEY`
- `ME_WOO_CREDIT_WEBHOOK_ENABLED`
- `ME_ISSUE_ENABLED`
- `ME_RECOVERABLE_DELIVERY_READY`
- `ME_DELIVERY_ENABLED`
- `ME_VOUCHERS_ENABLED`

## Primo test LIVE
- Product ID 38090
- SKU `ME-CREDITS-50000`
- Prezzo EUR 4,99
- Crediti 50.000

Criteri:
1. un solo ordine pagato;
2. un solo voucher;
3. una sola outbox;
4. una sola email;
5. un solo ledger entry;
6. wallet +50.000;
7. retry webhook senza duplicati;
8. secondo riscatto respinto;
9. nessun secret/codice voucher nei log.

Se un controllo fallisce:
- webhook -> PAUSED;
- tutti i feature flag -> OFF;
- UI pacchetti resta `enabled:false`;
- nessuna promozione dei pacchetti.
