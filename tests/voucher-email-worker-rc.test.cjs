'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');

const worker=fs.readFileSync('supabase/functions/marina-voucher-delivery-worker-rc/index.ts','utf8');
const crypto=fs.readFileSync('supabase/functions/marina-voucher-delivery-worker-rc/voucher-crypto.ts','utf8');
const recovery=fs.readFileSync('supabase/functions/marina-voucher-delivery-worker-rc/voucher-recovery-policy.ts','utf8');

for(const token of [
  'ME_DELIVERY_ENABLED','ME_DELIVERY_WORKER_TOKEN','ME_VOUCHER_ENCRYPTION_KEY','ME_RESEND_API_KEY','ME_FROM_EMAIL','SUPABASE_SECRET_KEYS','SUPABASE_SERVICE_ROLE_KEY','readSecretKey',
  'me_voucher_delivery_outbox','me_claim_voucher_delivery_internal','Idempotency-Key',
  'pending','retry','sending','sent','provider_message_id','attempts', 'limit(10)',
  'https://api.resend.com/emails','Delivery disabled','Unauthorized'
]) assert(worker.includes(token),'Missing delivery safeguard: '+token);

assert(worker.indexOf('ME_DELIVERY_ENABLED') < worker.indexOf('createClient('),'Feature gate must run before privileged client creation');
assert(worker.includes('.eq("status","sending")'),'Updates must be conditional on an active claim');
assert(worker.includes('Leave status as sending for manual provider reconciliation instead.'),'Accepted-provider ambiguity must fail closed');
assert(!worker.includes('console.log(code)'),'Voucher plaintext must never be logged');
assert(!worker.includes('console.log(row.recipient_email)'),'Recipient email must never be logged');
assert(crypto.includes('AES-GCM'),'Voucher ciphertext must use authenticated encryption');
assert(recovery.includes('manual_provider_reconciliation'),'Ambiguous deliveries must require reconciliation');
assert(recovery.includes('Retry limit reached'),'Retry exhaustion must not loop forever');

console.log('PASS: voucher email worker RC remains gated, idempotent and conservative');
