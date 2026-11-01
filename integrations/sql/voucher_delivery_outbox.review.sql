-- REVIEW ONLY. Do not apply until the issuer and mail worker are updated.
-- Encrypted voucher delivery outbox. Ciphertext is encrypted by the Edge Function
-- with a server-only AES-256-GCM key (ME_VOUCHER_ENCRYPTION_KEY).
-- NEVER store plaintext voucher codes or encryption keys in the database.
create table if not exists public.me_voucher_delivery_outbox (
  id uuid primary key default gen_random_uuid(),
  voucher_id uuid not null unique references public.me_credit_vouchers(id),
  woo_order_id bigint not null,
  woo_order_item_id bigint not null,
  woo_unit_index integer not null check (woo_unit_index >= 0),
  recipient_email text not null,
  code_ciphertext text not null,
  code_nonce text not null,
  key_version integer not null default 1,
  status text not null default 'pending'
    check (status in ('pending','sending','sent','retry','failed','cancelled')),
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz not null default now(),
  last_error text,
  provider_message_id text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (woo_order_id, woo_order_item_id, woo_unit_index)
);
alter table public.me_voucher_delivery_outbox enable row level security;
revoke all on public.me_voucher_delivery_outbox from public, anon, authenticated;
create index if not exists me_voucher_outbox_due_idx
  on public.me_voucher_delivery_outbox (next_attempt_at, created_at)
  where status in ('pending','retry');
-- No public RLS policies. Access only from trusted server service-role code.
-- IMPORTANT: voucher + outbox must be inserted in ONE transaction; two
-- independent REST inserts are NOT atomic. Use a private, audited RPC.
-- Mail worker must atomically claim rows to avoid duplicate sends, use the
-- provider's idempotency key, and retain ciphertext for bounded retries.
-- Refund handling must cancel pending sends and revoke unredeemed vouchers.
