-- REVIEW ONLY: transaction-safe issuance for encrypted delivery.
-- Apply after reviewing the outbox table schema and permissions.
-- Intended for trusted service_role only; do not grant to anon/authenticated.
create or replace function public.me_issue_voucher_with_outbox_internal(
  p_code_hash text,
  p_credits bigint,
  p_order_id bigint,
  p_item_id bigint,
  p_unit_index integer,
  p_recipient_email text,
  p_ciphertext text,
  p_nonce text,
  p_key_version integer default 1
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_credits not in (50000,120000,300000,900000,2000000)
     or p_order_id <= 0 or p_item_id <= 0
     or p_unit_index < 0 or p_unit_index > 99
     or length(p_code_hash) <> 64
     or p_code_hash !~ '^[0-9a-f]{64}$'
     or length(p_recipient_email) > 320
     or p_recipient_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
     or length(p_ciphertext) < 16
     or length(p_nonce) < 12
     or p_key_version < 1 then
    raise exception 'Invalid voucher request';
  end if;
  insert into public.me_credit_vouchers
    (code_hash,credits,woo_order_id,woo_order_item_id,woo_unit_index,status)
  values (p_code_hash,p_credits,p_order_id,p_item_id,p_unit_index,'issued')
  returning id into v_id;
  insert into public.me_voucher_delivery_outbox
    (voucher_id,woo_order_id,woo_order_item_id,woo_unit_index,recipient_email,
     code_ciphertext,code_nonce,key_version,status)
  values (v_id,p_order_id,p_item_id,p_unit_index,p_recipient_email,
          p_ciphertext,p_nonce,p_key_version,'pending');
  return v_id;
end;
$$;
revoke all on function public.me_issue_voucher_with_outbox_internal(
 text,bigint,bigint,bigint,integer,text,text,text,integer
) from public, anon, authenticated;
grant execute on function public.me_issue_voucher_with_outbox_internal(
 text,bigint,bigint,bigint,integer,text,text,text,integer
) to service_role;
-- Uniqueness on order/item/unit ensures retries fail atomically with SQLSTATE 23505.
-- Caller should then fetch the existing outbox entry, not generate a new code.
-- The Edge Function must verify WooCommerce payment, SKU and amounts first.
