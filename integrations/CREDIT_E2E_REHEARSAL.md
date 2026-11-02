# Marina Empire — End-to-end credit checkout rehearsal (no live payments)

## Preconditions
- WooCommerce credit packs 38090–38094 remain **draft**.
- ME_ISSUE_ENABLED, ME_DELIVERY_ENABLED, ME_REFUND_ENABLED and ME_RECONCILIATION_ENABLED remain **false**.
- Do not send real customer email, charge a card, or alter production wallets.
- Run in an isolated test database and WooCommerce staging environment with test payment gateway.
- Use a test recipient and a stub email provider.

## Test scenarios
| Case | Expected result |
| --- | --- |
| Unpaid order webhook | No voucher queued |
| Paid order, correct SKU and price | Exactly one encrypted outbox item per unit |
| Replayed webhook | No additional vouchers or outbox items |
| Wrong HMAC signature | HTTP 401, no database change |
| Invalid SKU, currency or discount | No voucher issued |
| Delivery worker disabled | HTTP 503, no email |
| Valid delivery | Email accepted once, status sent |
| Provider accepted but database write failed | Status sending; never automatic resend |
| Stale sending claim | Manual reconciliation, not automatic retry |
| Fully refunded unredeemed unsent voucher | Atomic revoke and cancellation |
| Partially refunded order | Manual review |
| Redeemed voucher on refund | Manual review; no automatic wallet debit |
| Refund webhook replay | Idempotent, no additional changes |

## Release gate
1. All Deno CI tests green.
2. Run end-to-end test with mock WooCommerce and email provider.
3. Verify database RLS and internal RPC permissions.
4. Configure encrypted secrets in a server-only runtime.
5. Verify sender domain and delivery provider idempotency.
6. Test interrupted jobs and recovery.
7. Confirm refunds do not debit redeemed balances automatically.
8. Obtain final human acceptance test before publishing products.
9. Enable gates only after separate sign-off.

**Current state:** development/staging only. No real purchase or refund tests have been performed.


## Stato verificato — 2 novembre 2026

### Già verificato
- GitHub Pages: deploy verde.
- Smoke test: verde.
- Mission regression: verde.
- Tracking Chromium: page_view / play_start / mission_complete verificati.
- Webhook WooCommerce Edge Function: ACTIVE, feature gate OFF.
- Riscatto voucher RC: ACTIVE, feature gate OFF.
- Worker email voucher RC: ACTIVE v2, feature gate OFF.
- Database crediti pulito: 0 voucher, 0 outbox, 0 wallet, 0 ledger.
- Test transazionale DB riuscito con rollback:
  - saldo 0 -> 50.000;
  - voucher -> redeemed;
  - una sola riga ledger;
  - una sola riga outbox;
  - doppio riscatto bloccato;
  - nessun residuo dopo rollback.
- Duplicate webhook coperto da test offline: nessun voucher duplicato.
- Account non verificato: riscatto respinto.
- Ordine non pagato / valuta errata / refund incompleto: respinti o inviati a revisione manuale.
- Refund di voucher già riscattato: nessun addebito automatico del wallet; revisione manuale.
- Isola delle Rose invariata: non acquistabile e gestita esclusivamente da RPG Yacht.

### Ancora da verificare live
1. Stato reale dei prodotti WooCommerce 38090–38094.
2. SKU, prezzo, virtuale/acquistabile e disponibilità reali su RPG Yacht.
3. Secrets reali WooCommerce nel backend.
4. Secret cifratura voucher.
5. Provider email reale + mittente verificato.
6. Webhook WooCommerce reale verso `marina-woo-credit-webhook`.
7. Ordine reale da EUR 4,99.
8. Emissione di un solo voucher.
9. Consegna email reale una sola volta.
10. Riscatto da account verificato.
11. Saldo wallet +50.000.
12. Retry webhook senza doppio accredito.
13. Refund reale controllato.

## Live release gate — obbligatorio
I flag restano OFF finché non sono vere tutte queste condizioni:

- `ME_WOO_CREDIT_WEBHOOK_ENABLED=true` SOLO durante E2E controllato.
- `ME_ISSUE_ENABLED=true` SOLO durante E2E controllato.
- `ME_RECOVERABLE_DELIVERY_READY=true` SOLO quando il worker email è configurato.
- `ME_DELIVERY_ENABLED=true` SOLO con provider email e mittente verificati.
- `ME_VOUCHERS_ENABLED=true` SOLO dopo conferma consegna voucher.
- `ME_REFUND_ENABLED=true` resta OFF nel primo lancio; refund gestiti manualmente finché non completiamo un test reale.

## Primo ordine live — EUR 4,99
Usare esclusivamente il pacchetto:
- Product ID 38090
- SKU `ME-CREDITS-50000`
- 50.000 crediti
- EUR 4,99

Criteri di successo:
- esattamente 1 ordine pagato;
- esattamente 1 voucher;
- esattamente 1 outbox email;
- esattamente 1 email inviata;
- esattamente 1 ledger entry;
- wallet incrementato di 50.000;
- secondo webhook: 0 nuovi voucher;
- secondo riscatto: respinto;
- nessun secret o codice voucher nei log.

Se uno solo di questi controlli fallisce, riportare tutti i flag a OFF e non pubblicare i pacchetti.
