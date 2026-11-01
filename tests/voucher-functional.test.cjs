// Functional staging test: mocked database, no real vouchers or orders.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const crypto=require('node:crypto').webcrypto;
function load(path, context) {
  let src=fs.readFileSync(path,'utf8');
  src=src.replace(/^import .*;\s*$/gm,'').replace(/^type .*;\s*$/gm,'').replace(/export /g,'');
  src=src.replace(/: Uint8Array/g,'').replace(/:PaidLine/g,'').replace(/:Rpc/g,'').replace(/: string\[\]/g,'').replace(/:Uint8Array/g,'').replace(/:Record<string,unknown>/g,'').replace(/:unknown/g,'').replace(/:string/g,'');
  vm.runInContext(src,context,{filename:path});
}
const ctx=vm.createContext({crypto,TextEncoder,TextDecoder,Uint8Array,Array,Number,Math,Error,RegExp,btoa,console});
load('backend/voucher-crypto-staging.ts',ctx);
load('backend/voucher-issuance-staging.ts',ctx);
const key=new Uint8Array(32);key.fill(7);
const line={orderId:101,itemId:202,unitIndex:0,credits:50000,recipientEmail:'test@example.org'};
(async()=>{
  let calls=0;
  const issued=await ctx.issuePaidLineStaging(line,key,async(name,args)=>{
    calls++;assert.equal(name,'me_issue_voucher_with_outbox_internal');
    assert.equal(args.p_credits,50000);assert.equal(args.p_order_id,101);
    assert.match(args.p_code_hash,/^[0-9a-f]{64}$/);
    assert.ok(args.p_ciphertext.length>30);assert.ok(args.p_nonce.length>12);
    const bytes=(value)=>Uint8Array.from(Buffer.from(value,'base64'));
    const aes=await crypto.subtle.importKey('raw',key,{name:'AES-GCM'},false,['decrypt']);
    const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(args.p_nonce)},aes,bytes(args.p_ciphertext));
    const code=new TextDecoder().decode(clear);
    assert.match(code,/^ME-[A-Z2-9]{8}-[A-Z2-9]{8}-[A-Z2-9]{8}$/);
    const digest=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(code))).toString('hex');
    assert.equal(digest,args.p_code_hash);
    const wrongKey=new Uint8Array(32);wrongKey.fill(8);
    const wrongAes=await crypto.subtle.importKey('raw',wrongKey,{name:'AES-GCM'},false,['decrypt']);
    await assert.rejects(crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(args.p_nonce)},wrongAes,bytes(args.p_ciphertext)));
    const corrupted=bytes(args.p_ciphertext);corrupted[0]^=1;
    await assert.rejects(crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(args.p_nonce)},aes,corrupted));
    return {data:'test-voucher-id',error:null};
  });
  assert.equal(issued.voucherId,'test-voucher-id');
  assert.equal(calls,1);
  await assert.rejects(ctx.issuePaidLineStaging({...line,credits:42},key,async()=>{throw Error('unexpected rpc')}),/Invalid paid line/);
  await assert.rejects(ctx.issuePaidLineStaging(line,key,async()=>({data:null,error:{message:'duplicate key value violates unique constraint'}})),/already issued/);
  console.log('PASS: voucher staging functional mocks');
})().catch(e=>{console.error(e);process.exitCode=1});
