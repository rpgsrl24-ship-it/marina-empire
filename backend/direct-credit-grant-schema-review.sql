// Design-only SQL: review and apply through controlled database migration after QA.
// This file is NOT executed by the web app or GitHub Pages.
// Uses a private schema to avoid exposing a privileged grant function via PostgREST.
create schema if not exists me_private;
create table if not exists me_private.direct_credit_grants(
  woo_order_id bigint not null,
  woo_order_item_id bigint not null,
  user_id uuid not null references auth.users(id),
  credits bigint not null check(credits>0),
  created_at timestamptz not null default now(),
  primary key(woo_order_id,woo_order_item_id)
);
revoke all on schema me_private from public,anon,authenticated;
revoke all on all tables in schema me_private from public,anon,authenticated;
alter table me_private.direct_credit_grants enable row level security;
-- The eventual grant RPC must lock by order/item, insert a unique grant,
-- increment me_credit_wallets and insert an auditable ledger row in ONE transaction.
-- No RPC is deployed by this design-only file.
