# Direct checkout deployment checklist (payments OFF)

The checkout Edge Function source is staged in supabase/functions/marina-direct-checkout/index.ts.
It is NOT deployed by GitHub Pages. Never enable ME_CHECKOUT_ENABLED before completing these steps:

1. Confirm each WooCommerce product is virtual, purchasable, and priced exactly as the server catalog; draft/hidden products may not be orderable.
2. Configure server-only WooCommerce API credentials; use least privilege. Never expose them in GitHub Pages.
3. Review WooCommerce order creation and payment URL behavior with an unpaid sandbox order.
4. Implement a server-side checkout intent bound to authenticated Supabase user, order ID, SKU, and expiration. Existing Woo order metadata alone is insufficient for payment fulfillment.
5. Implement a verified Woo webhook and reconciliation job; independently fetch order and verify payment, price, currency, refunds, SKU, identity, and server-owned intent.
6. Apply and test the private atomic wallet grant with a separate ledger, restricted backend role, and idempotency key. No browser-exposed crediting RPC.
7. Add refund reconciliation and manual review for already-spent balances.
8. Run E2E sandbox tests for duplicate webhook, concurrent webhook, failed payment, refund, and account mismatch.
9. Enable checkout only after user approval; enable wallet grants only after successful full QA.

Current gates: ME_CHECKOUT_ENABLED=false, ME_DIRECT_GRANTS_ENABLED=false.
