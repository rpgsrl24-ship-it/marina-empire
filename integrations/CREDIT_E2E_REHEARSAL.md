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
