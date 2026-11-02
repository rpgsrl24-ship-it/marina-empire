'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const test=require('node:test');
const webcrypto=require('node:crypto').webcrypto;
const source=fs.readFileSync('backend/marina-redeem-credit-release-candidate.ts','utf8');

function load(envValues,fetchImpl){
  let handler;
  const context={
    Deno:{serve:fn=>{handler=fn},env:{get:key=>envValues[key]}},
    Response,Request,Headers,URL,TextEncoder,Uint8Array,Array,Number,JSON,String,
    crypto:webcrypto,fetch:fetchImpl
  };
  vm.runInNewContext(source,context,{filename:'backend/marina-redeem-credit-release-candidate.ts'});
  return handler;
}
test('release candidate remains disabled unless explicitly enabled',async()=>{
  let fetches=0;
  const handler=load({},async()=>{fetches++;throw new Error('unexpected fetch')});
  const res=await handler(new Request('https://example.test',{method:'POST',headers:{origin:'https://rpgsrl24-ship-it.github.io'},body:'{}'}));
  assert.equal(res.status,503);assert.equal(fetches,0);
  assert.equal((await res.json()).code,'VOUCHERS_DISABLED');
});
test('valid verified account redeems exactly one hashed voucher through internal RPC',async()=>{
  const calls=[];
  const env={
    ME_VOUCHERS_ENABLED:'true',
    SUPABASE_URL:'https://project.supabase.co',
    SUPABASE_PUBLISHABLE_KEYS:JSON.stringify({default:'sb_publishable_test'}),
    SUPABASE_SECRET_KEYS:JSON.stringify({default:'sb_secret_test'})
  };
  const handler=load(env,async(url,options={})=>{
    calls.push({url:String(url),options});
    if(String(url).endsWith('/auth/v1/user')) return new Response(JSON.stringify({id:'11111111-1111-4111-8111-111111111111',email_confirmed_at:'2026-11-02T10:00:00Z',is_anonymous:false}),{status:200,headers:{'content-type':'application/json'}});
    if(String(url).endsWith('/rest/v1/rpc/me_redeem_voucher_internal')){
      const body=JSON.parse(options.body);
      assert.match(body.p_code_hash,/^[0-9a-f]{64}$/);
      assert.equal(body.p_user_id,'11111111-1111-4111-8111-111111111111');
      assert.equal(options.headers.apikey,'sb_secret_test');
      assert.equal(options.headers.authorization,undefined);
      return new Response('50000',{status:200,headers:{'content-type':'application/json'}});
    }
    throw new Error('unexpected URL '+url);
  });
  const res=await handler(new Request('https://example.test',{method:'POST',headers:{origin:'https://rpgsrl24-ship-it.github.io',authorization:'Bearer user-token','content-type':'application/json'},body:JSON.stringify({code:'ME-AAAAAAAA-BBBBBBBB-CCCCCCCC'})}));
  assert.equal(res.status,200);assert.deepEqual(await res.json(),{ok:true,balance:50000});assert.equal(calls.length,2);
});
test('unverified accounts and invalid voucher codes fail closed',async()=>{
  const env={ME_VOUCHERS_ENABLED:'true',SUPABASE_URL:'https://project.supabase.co',SUPABASE_ANON_KEY:'legacy-anon',SUPABASE_SERVICE_ROLE_KEY:'legacy-service'};
  let calls=0;
  const unverified=load(env,async()=>{calls++;return new Response(JSON.stringify({id:'u',email_confirmed_at:null,is_anonymous:false}),{status:200,headers:{'content-type':'application/json'}})});
  const r1=await unverified(new Request('https://example.test',{method:'POST',headers:{origin:'https://rpgsrl24-ship-it.github.io',authorization:'Bearer t'},body:JSON.stringify({code:'ME-AAAAAAAA-BBBBBBBB-CCCCCCCC'})}));
  assert.equal(r1.status,401);assert.equal(calls,1);
  calls=0;
  const verified=load(env,async(url)=>{calls++;if(String(url).endsWith('/auth/v1/user'))return new Response(JSON.stringify({id:'u',email_confirmed_at:'yes',is_anonymous:false}),{status:200,headers:{'content-type':'application/json'}});throw new Error('RPC must not run')});
  const r2=await verified(new Request('https://example.test',{method:'POST',headers:{origin:'https://rpgsrl24-ship-it.github.io',authorization:'Bearer t'},body:JSON.stringify({code:'bad'})}));
  assert.equal(r2.status,400);assert.equal(calls,1);
});