-- Transaction-safe claim for an encrypted voucher delivery.
-- Apply only after reviewing worker authorization and mail provider setup.
-- The worker invokes this via service_role. Never expose to browser clients.
create or replace function public.me_claim_voucher_delivery_internal(p_delivery_id uuid)
returns table (
  id uuid,
  voucher_id uuid,
  recipient_email text,
  code_ciphertext text,
  code_nonce text,
  key_version integer,
  attempts integer
)
language plpgsql security invoker set search_path = ''
as $$
begin
  return query
  update public.me_voucher_delivery_outbox d
  set status='sending', attempts=d.attempts+1, updated_at=now()
  where d.id=p_delivery_id
    and d.status in ('pending','retry')
    and d.next_attempt_at <= now()
    and d.attempts < 8
  returning d.id,d.voucher_id,d.recipient_email,d.code_ciphertext,
            d.code_nonce,d.key_version,d.attempts;
end;
$$;
revoke all on function public.me_claim_voucher_delivery_internal(uuid) from public,anon,authenticated;
grant execute on function public.me_claim_voucher_delivery_internal(uuid) to service_role;

-- After an email provider call, the trusted worker should update status to
-- sent with provider_message_id, or retry with exponential backoff.
-- Recover stale 'sending' claims only after checking provider idempotency state.
-- Do not log decrypted codes or email provider request bodies.
