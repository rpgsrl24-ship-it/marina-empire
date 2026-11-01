const fs=require('node:fs');
const assert=require('node:assert/strict');
const vm=require('node:vm');
let src=fs.readFileSync('backend/direct-credit-checkout-staging.ts','utf8');
src=src.replace(/export /g,'').replace(/:string/g,'').replace(/:number/g,'')
 .replace(/ as keyof typeof CREDIT_PRODUCTS/g,'')
 .replace(/order:\{[\s\S]*?\},expected:\{[\s\S]*?\}\)/,'order,expected)');
const ctx=vm.createContext({Object,Number,Error});
vm.runInContext(src,ctx);
const id='123e4567-e89b-42d3-a456-426614174000';
const plan=ctx.planDirectCheckout('ME-CREDITS-50000',2,id);
assert.equal(plan.expectedCredits,100000);
assert.equal(plan.expectedPriceCents,998);
assert.throws(()=>ctx.planDirectCheckout('BAD',1,id),/Invalid checkout/);
assert.throws(()=>ctx.planDirectCheckout('ME-CREDITS-50000',1,'bad'),/Invalid checkout/);
const expected={orderId:20,productId:38090,quantity:2,accountId:id};
const order={id:20,status:'processing',date_paid:'2026-11-02T12:00:00',currency:'EUR',line_items:[{id:21,product_id:38090,quantity:2,total:'9.98',total_tax:'0.00'}],meta_data:[{key:'_me_account_id',value:id}],refunds:[],total:'9.98'};
assert.equal(ctx.verifyPaidDirectOrder(order,expected).credits,100000);
assert.throws(()=>ctx.verifyPaidDirectOrder({...order,date_paid:null},expected),/not eligible/);
assert.throws(()=>ctx.verifyPaidDirectOrder({...order,refunds:[{id:123}]},expected),/not eligible/);
assert.throws(()=>ctx.verifyPaidDirectOrder({...order,refunds:undefined},expected),/not eligible/);
assert.throws(()=>ctx.verifyPaidDirectOrder({...order,line_items:[{...order.line_items[0],total:'0.01'}]},expected),/amount/);
const vatOrder={...order,line_items:[{...order.line_items[0],total:'8.18',total_tax:'1.80'}]};
assert.equal(ctx.verifyPaidDirectOrder(vatOrder,expected).credits,100000);
assert.throws(()=>ctx.verifyPaidDirectOrder({...order,total:'0.01'},expected),/amount/);
assert.throws(()=>ctx.verifyPaidDirectOrder({...order,meta_data:[{key:'_me_account_id',value:'other'}]},expected),/Account mismatch/);
console.log('PASS: direct checkout staging contract');
