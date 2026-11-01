-- Review-only refund handling design. Not deployed.
-- Refunds are NOT equivalent to blindly subtracting the original credit grant.
-- A user may already have spent purchased credits. Never create a negative
-- balance or silently erase a refund obligation.
create table if not exists me_private.direct_credit_refunds(
  woo_refund_id bigint primary key,
  woo_order_id bigint not null,
  woo_order_item_id bigint not null,
  user_id uuid not null references auth.users(id),
  refunded_credits bigint not null check(refunded_credits>0),
  status text not null check(status in ('pending','reversed','manual_review')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
alter table me_private.direct_credit_refunds enable row level security;
revoke all on me_private.direct_credit_refunds from public,anon,authenticated;
-- Processing plan:
-- 1. Verify WooCommerce refund independently with server credentials.
-- 2. Resolve original grant by immutable Woo order and item IDs.
-- 3. Deduplicate by Woo refund ID, enforce cumulative refunded credits <= grant.
-- 4. Lock wallet and grant in a single transaction.
-- 5. If enough unused balance remains, reverse credits and write a negative ledger entry.
-- 6. Otherwise mark manual_review; do not produce negative balances.
-- 7. Refund payment status and credit reversal require reconciliation.
-- 8. Partial refunds must map verified refunded quantities/amounts to credits.
-- 9. Never accept account ID or refund amount directly from browser.
