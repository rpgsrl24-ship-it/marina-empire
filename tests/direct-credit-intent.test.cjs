const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('backend/direct-credit-intent-staging.ts','utf8')
 .replace(/export type CheckoutIntent=\{[\s\S]*?\};/,'')
 .replace(/export /g,'')
 .replace(/intent:CheckoutIntent/g,'intent')
 .replace(/verifiedUserId:string/g,'verifiedUserId')
 .replace(/sku:string/g,'sku')
 .replace(/quantity:number/g,'quantity')
 .replace(/now:number/g,'now');
const ctx=vm.createContext({Number,Error});vm.runInContext(source,ctx);
const id='123e4567-e89b-42d3-a456-426614174000',intentId='123e4567-e89b-42d3-a456-426614174001';
const now=1000000,sku='ME-CREDITS-50000';
const intent={id:intentId,userId:id,sku,quantity:1,expiresAt:now+300000};
assert.equal(ctx.verifyCheckoutIntent(intent,id,sku,1,now).userId,id);
assert.throws(()=>ctx.verifyCheckoutIntent(intent,'123e4567-e89b-42d3-a456-426614174002',sku,1,now),/invalid/);
assert.throws(()=>ctx.verifyCheckoutIntent(intent,id,sku,1,now+300000),/expired/);
assert.throws(()=>ctx.verifyCheckoutIntent({...intent,expiresAt:now+3600000},id,sku,1,now),/expired/);
assert.throws(()=>ctx.verifyCheckoutIntent(intent,id,sku,2,now),/invalid/);
console.log('PASS: checkout intent ownership and expiration');
