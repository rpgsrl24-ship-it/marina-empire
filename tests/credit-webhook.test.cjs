const fs=require('node:fs');
const assert=require('node:assert/strict');
const src=fs.readFileSync('backend/woo-credit-webhook-staging.ts','utf8');
for(const name of ['ME-CREDITS-50000','ME-CREDITS-120000','ME-CREDITS-300000','ME-CREDITS-900000','ME-CREDITS-2000000']) assert(src.includes(name));
for(const name of ['x-wc-webhook-signature','order.date_paid','creditLines.length === 0','Issuance and delivery not enabled']) assert(src.includes(name));
for(const name of ['constantTimeEqual','ME_WOO_WEBHOOK_SECRET','ME_WOO_CONSUMER_SECRET','base.hostname!=="rpgyacht.com"','order.currency!=="EUR"','Number.isSafeInteger(qty)','qty<=100','Invalid credit line','Invalid recipient','Too many credit units','planVerifiedCreditOrder','plannedUnits','Invalid credit issuance plan']) assert(src.includes(name),'Missing credit safeguard: '+name);
console.log('PASS: credit webhook staging contracts');
