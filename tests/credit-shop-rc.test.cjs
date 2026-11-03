'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const src=fs.readFileSync('credit-purchase-rc.js','utf8');

for(const token of [
  'enabled:true',
  'directCheckoutReady:true',
  'ME-CREDITS-50000','ME-CREDITS-120000','ME-CREDITS-300000','ME-CREDITS-900000','ME-CREDITS-2000000',
  'productId:38090','productId:38094','price:"4,99"','price:"99,99"',
  'email_confirmed_at',
  'meCreditCheckoutReady',
  'marina-direct-checkout',
  'window.location.assign',
  'ACCEDI PER ACQUISTARE'
]) assert(src.includes(token),'Missing credit-shop safeguard: '+token);

assert(!src.includes('enabled:false'),'Credit shop must not fall back to pre-launch disabled state');
assert(!src.includes('window.open('),'Popup checkout is forbidden');
assert(src.includes('btn.disabled=!CONFIG.enabled||!user||busy'),'Buttons must remain disabled without a verified account or while checkout is busy');

console.log('PASS: credit shop is live with authenticated direct-checkout safeguards');
