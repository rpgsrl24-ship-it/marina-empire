'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const src=fs.readFileSync('credit-purchase-rc.js','utf8');
for(const token of [
  'enabled:false',
  'ME-CREDITS-50000','ME-CREDITS-120000','ME-CREDITS-300000','ME-CREDITS-900000','ME-CREDITS-2000000',
  'productId:38090','productId:38094','price:"4,99"','price:"99,99"',
  'ACQUISTA · NON ANCORA ATTIVO',
  'btn.disabled=true'
]) assert(src.includes(token),'Missing credit-shop safeguard: '+token);
assert(!src.includes('location.href='));
assert(!src.includes('window.open('));
console.log('PASS: credit shop RC remains disabled and preserves approved packs');
