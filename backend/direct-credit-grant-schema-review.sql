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

create table if not exists me_private.direct_credit_ledger(
  id bigint generated always as identity primary key,
  woo_order_id bigint not null,
  woo_order_item_id bigint not null,
  user_id uuid not null references auth.users(id),
  delta bigint not null,
  created_at timestamptz not null default now(),
  unique(woo_order_id,woo_order_item_id)
);
alter table me_private.direct_credit_ledger enable row level security;
revoke all on me_private.direct_credit_ledger from public,anon,authenticated;
-- Proposed transaction-safe grant RPC (NOT DEPLOYED).
-- Run only from a trusted backend role after server-side Woo verification.
create or replace function me_private.grant_paid_order(
  p_order_id bigint,p_item_id bigint,p_user_id uuid,p_credits bigint
) returns jsonb language plpgsql security invoker
set search_path='' as $$
declare v_balance bigint; v_inserted integer;
begin
  if p_order_id<=0 or p_item_id<=0 or p_credits<=0 or p_credits>20000000
     or p_user_id is null then raise exception 'Invalid grant'; end if;
  insert into me_private.direct_credit_grants(woo_order_id,woo_order_item_id,user_id,credits)
    values(p_order_id,p_item_id,p_user_id,p_credits)
    on conflict do nothing;
  get diagnostics v_inserted=row_count;
  if v_inserted=0 then
    if not exists(select 1 from me_private.direct_credit_grants
      where woo_order_id=p_order_id and woo_order_item_id=p_item_id
      and user_id=p_user_id and credits=p_credits)
    then raise exception 'Conflicting replay'; end if;
    select balance into v_balance from public.me_credit_wallets where user_id=p_user_id;
    return jsonb_build_object('credited',false,'balance',coalesce(v_balance,0));
  end if;
  insert into public.me_credit_wallets(user_id,balance)
    values(p_user_id,p_credits)
    on conflict(user_id) do update
    set balance=public.me_credit_wallets.balance+excluded.balance,updated_at=now()
    returning balance into v_balance;
  -- A separate direct-order ledger is required: the existing voucher ledger
  -- uses voucher_id and must not be reused for voucherless purchases.
  insert into me_private.direct_credit_ledger(woo_order_id,woo_order_item_id,user_id,delta)
    values(p_order_id,p_item_id,p_user_id,p_credits);
  return jsonb_build_object('credited',true,'balance',v_balance);
end $$;
revoke all on function me_private.grant_paid_order(bigint,bigint,uuid,bigint)
  from public,anon,authenticated;
