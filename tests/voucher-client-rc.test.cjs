'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const src=fs.readFileSync('index.html','utf8');

for(const token of [
  'creditRcEnabled()',
  'window.MarinaEmpireCreditShopRC?.enabled===true',
  'marina-redeem-credit-rc',
  'client.auth.getSession()',
  'authorization":"Bearer "+token',
  'apikey":KEY_PUBLIC',
  'ME-[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}',
  'Codice riscattato. Saldo server aggiornato.',
  'el("meVoucherRedeem").addEventListener("click",redeemVoucherRc)',
  'syncVoucherRcUi()'
]) assert(src.includes(token),'Missing voucher client safeguard: '+token);

assert(src.includes('if(!creditRcEnabled())return;'),'Voucher redemption must remain gated');
assert(src.includes('input.disabled=!ready;button.disabled=!ready;'),'Voucher UI must stay disabled until account+flag are ready');
assert(!src.includes('SUPABASE_SERVICE_ROLE_KEY'),'Client must not expose service role keys');
assert(!src.includes('SUPABASE_SECRET_KEYS'),'Client must not expose secret keys');

console.log('PASS: voucher redemption client RC remains gated and uses user session only');
