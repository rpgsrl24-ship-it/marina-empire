const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
let src=fs.readFileSync('backend/credit-order-plan-staging.ts','utf8');
src=src.replace(/^export type .*;\s*$/gm,'').replace(/export /g,'')
 .replace(/:Record<string,number>/g,'').replace(/:number/g,'').replace(/:string/g,'')
 .replace(/:VerifiedCreditLine\[\]/g,'').replace(/:VoucherUnit\[\]/g,'');
const ctx=vm.createContext({Number,Array,Set,Object,Error});
vm.runInContext(src,ctx);
const lines=[{id:11,sku:'ME-CREDITS-50000',quantity:2},{id:12,sku:'ME-CREDITS-120000',quantity:1}];
const plan=ctx.planVerifiedCreditOrder(10,'buyer@example.org',lines);
assert.equal(plan.length,3);
assert.deepEqual(Array.from(plan,x=>[x.itemId,x.unitIndex,x.credits]),[[11,0,50000],[11,1,50000],[12,0,120000]]);
assert.deepEqual(Array.from(ctx.planVerifiedCreditOrder(10,'buyer@example.org',lines),x=>JSON.stringify(x)),Array.from(plan,x=>JSON.stringify(x)));
assert.throws(()=>ctx.planVerifiedCreditOrder(10,'buyer@example.org',[lines[0],lines[0]]),/Invalid credit line/);
assert.throws(()=>ctx.planVerifiedCreditOrder(10,'buyer@example.org',[{...lines[0],quantity:101}]),/Invalid credit line/);
assert.throws(()=>ctx.planVerifiedCreditOrder(10,'buyer@example.org',[{...lines[0],sku:'OTHER'}]),/Invalid credit line/);
console.log('PASS: deterministic credit order unit plan');
