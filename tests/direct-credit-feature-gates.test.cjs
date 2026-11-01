const fs=require('node:fs');const assert=require('node:assert/strict');const vm=require('node:vm');
const source=fs.readFileSync('backend/direct-credit-feature-gates.ts','utf8')
.replace(/export type CreditFlags=\{[^}]*\};/,'')
.replace(/export /g,'').replace(/flags:CreditFlags/g,'flags');
const ctx=vm.createContext({Error});
vm.runInContext(source,ctx);
assert.equal(ctx.checkoutAllowed({}),false);
assert.equal(ctx.grantAllowed({}),false);
assert.equal(ctx.checkoutAllowed({ME_CHECKOUT_ENABLED:'true'}),true);
assert.equal(ctx.grantAllowed({ME_CHECKOUT_ENABLED:'true'}),false);
assert.equal(ctx.grantAllowed({ME_DIRECT_GRANTS_ENABLED:'true'}),false);
assert.equal(ctx.grantAllowed({ME_CHECKOUT_ENABLED:'true',ME_DIRECT_GRANTS_ENABLED:'true'}),true);
assert.throws(()=>ctx.requireCheckoutAllowed({}),/disabled/);
assert.throws(()=>ctx.requireGrantAllowed({ME_CHECKOUT_ENABLED:'true'}),/disabled/);
console.log('PASS: direct credit feature gates default off');
