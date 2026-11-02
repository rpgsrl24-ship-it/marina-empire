'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const shop=fs.readFileSync('credit-purchase-rc.js','utf8');
const index=fs.readFileSync('index.html','utf8');

assert(shop.includes('enabled:false'),'Credit shop must remain disabled before live E2E approval');
assert(!shop.includes('enabled:true'),'Credit shop cannot be enabled implicitly');
assert(shop.includes('btn.disabled=true'),'Purchase buttons must default disabled');
assert(!shop.includes('window.open('),'Direct purchase popups are forbidden before live E2E approval');
assert(!shop.includes('location.href='),'Direct purchase redirects are forbidden before live E2E approval');

assert(index.includes('window.MarinaEmpireCreditShopRC?.enabled===true'),'Voucher redemption client must depend on the credit release gate');
assert(index.includes('if(!creditRcEnabled())return;'),'Voucher redemption must fail closed when credits are disabled');

console.log('PASS: real-money credit release remains explicitly gated');
