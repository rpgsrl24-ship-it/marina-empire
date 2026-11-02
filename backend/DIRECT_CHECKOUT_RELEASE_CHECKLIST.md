# Direct checkout deployment checklist (payments OFF)

The current production entrypoints in `supabase/functions/` return a constant payment-disabled response. They contain no checkout, voucher issuance or redemption operations, and no environment flag can enable them. GitHub Pages does not deploy Edge Functions.

Deployment verified on **2 November 2026 at 09:58 CET**: all three functions are ACTIVE, version 2, with unchanged gateway JWT settings (checkout true, redemption false, issuance true). Live source contents match the reviewed entrypoints; empty POST requests carrying only the existing public `apikey` return `503 / PAYMENTS_DISABLED` for all three functions. See `docs/P0_PAYMENTS_OFF_2026-11-02.md` for source hashes, tests and the distinction between gateway and handler responses.

Previous implementations are preserved as non-deployable `.ts.txt` snapshots in `backend/payments-archive-2026-11-02/`. Do not restore them as a rollback: the public game must keep payments OFF. A future activation requires a reviewed replacement, an explicit deployment and all of the steps below:

1. Confirm each WooCommerce product is virtual, purchasable, and priced exactly as the server catalog; draft/hidden products may not be orderable.
2. Configure server-only WooCommerce API credentials; use least privilege. Never expose them in GitHub Pages.
3. Review WooCommerce order creation and payment URL behavior with an unpaid sandbox order.
4. Implement a server-side checkout intent bound to authenticated Supabase user, order ID, SKU, and expiration. Existing Woo order metadata alone is insufficient for payment fulfillment.
5. Implement a verified Woo webhook and reconciliation job; independently fetch order and verify payment, price, currency, refunds, SKU, identity, and server-owned intent.
6. Apply and test the private atomic wallet grant with a separate ledger, restricted backend role, and idempotency key. No browser-exposed crediting RPC.
7. Add refund reconciliation and manual review for already-spent balances.
8. Run E2E sandbox tests for duplicate webhook, concurrent webhook, failed payment, refund, and account mismatch.
9. Enable checkout only after user approval; enable wallet grants only after successful full QA.

The staging-only feature flags `ME_CHECKOUT_ENABLED` and `ME_DIRECT_GRANTS_ENABLED` remain separate from production activation. Keep them OFF until the authorized sandbox checks and release review are complete; they cannot activate the current constant-OFF production entrypoints.
