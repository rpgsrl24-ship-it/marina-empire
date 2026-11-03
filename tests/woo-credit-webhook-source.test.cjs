'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const src=fs.readFileSync('supabase/functions/marina-woo-credit-webhook/index.ts','utf8');
for(const token of [
 'ME_WOO_CREDIT_WEBHOOK_ENABLED','ME_ISSUE_ENABLED','ME_RECOVERABLE_DELIVERY_READY',
 'x-wc-webhook-signature','ME_WOO_WEBHOOK_SECRET','ME_WOO_API_KEY','ME_WOO_API_SECRET',
 'SUPABASE_SECRET_KEYS','SUPABASE_SERVICE_ROLE_KEY','readSecretKey','ME_VOUCHER_ENCRYPTION_KEY','rpgyacht.com','www.rpgyacht.com',
 'processing','completed','order.currency!=="EUR"','order.refunds.length',
 'ME-CREDITS-50000','ME-CREDITS-2000000','priceCents:499','priceCents:9999',
 'gross!==pack.priceCents*qty','subGross!==pack.priceCents*qty',
 'me_issue_voucher_with_outbox_internal','me_credit_vouchers','stored.code_hash===codeHash',
 'Too many credit units','Payload too large',
 '_refunded_item_id','/refunds?per_page=100','me_handle_refunded_voucher_internal',
 'revoked_cancelled','redeemed_review','Refund protection unavailable'
]) assert(src.includes(token),'Missing webhook safeguard: '+token);
assert(!src.includes('console.log(voucherCode)'));
assert(!src.includes('return reply({ok:true,code:'));
console.log('PASS: Woo credit webhook remains gated and server-authoritative');
