# Marina Empire - credit issuer launch gate (2026-11-01)

## Verified against live infrastructure
- Supabase project `marina-empire` is active.
- Tables: `me_credit_vouchers`, `me_credit_wallets`, `me_credit_ledger`.
- Voucher hash unique, ledger voucher reference unique, and unique index on `(woo_order_id, woo_order_item_id, woo_unit_index)`.
- `marina-redeem-credit` validates Supabase user internally and requires `ME_VOUCHERS_ENABLED=true`.
- `marina-issue-credit` deployed version 1 is a disabled 503 placeholder.
- WooCommerce product IDs 38090-38094 are drafts and virtual.
- Staging code: `integrations/woo-credit-issuer.staging.ts`; **not deployed**.

## Critical blockers before deploying or selling
1. **Recoverable delivery:** staging code inserts hash before email. If email fails, original plaintext code is lost, and retries skip existing vouchers. Design an encrypted outbox or transactional delivery with securely retained ciphertext and retry support. Never store plaintext codes.
2. **Order amount and refund validation:** verify expected SKU, unit price, currency, line item quantities, paid total, discounts, refund status and partial refunds from the authoritative WooCommerce API. Do not trust webhook payload fields for credits.
3. **Concurrency and replay:** unique index prevents duplicate voucher rows; test simultaneous webhooks, mail retry, replay and repeated purchase notifications. Do not treat duplicate as successful delivery unless delivery is verified.
4. **Authenticity:** webhook signature must be validated using a secret configured independently in WooCommerce and Supabase. Validate WooCommerce order fetch credentials, correct store origin and signature with real test payloads.
5. **Abuse protection:** cap quantity and request size; add rate limiting, logging without secrets or codes, and failure alerts.
6. **Revocation:** verify `me_revoke_unredeemed_order_internal` is called only for verified cancellations/refunds. Define a policy for already-redeemed refunded codes.
7. **Account binding:** the buyer's email and redeeming game account may differ; document the intended policy, support workflow and fraud handling.
8. **End-to-end:** test with a WooCommerce sandbox order and actual email delivery, redemption by a registered user, one-time-only enforcement, and balance update. Repeat on mobile.
9. **Configuration:** keep service-role, WooCommerce API credentials, webhook secret and mail credentials only in Supabase secrets. No secrets in GitHub Pages.
10. **Go/no-go:** publish products and enable `ME_ISSUE_ENABLED` and `ME_VOUCHERS_ENABLED` only after signed-off tests. Keep optional purchases unavailable while the free beta can operate.

## Approved packages (unchanged)
| WooCommerce product | SKU | Credits | EUR |
|---|---|---:|---:|
| 38090 | ME-CREDITS-50000 | 50,000 | 4.99 |
| 38091 | ME-CREDITS-120000 | 120,000 | 9.99 |
| 38092 | ME-CREDITS-300000 | 300,000 | 19.99 |
| 38093 | ME-CREDITS-900000 | 900,000 | 49.99 |
| 38094 | ME-CREDITS-2000000 | 2,000,000 | 99.99 |

**Status:** implementation in progress; no paid credit purchase has been tested or enabled.
