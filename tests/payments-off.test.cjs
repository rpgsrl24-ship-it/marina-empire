// Execute the deployed entrypoints with no network or real account credentials.
// Even accidentally enabled flags and payment-shaped requests must stay inert.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

const functions = ['marina-direct-checkout', 'marina-redeem-credit', 'marina-issue-credit'];
const flags = [undefined, '', 'false', '0', 'true', 'TRUE', '1'];
const origins = [undefined, 'https://rpgsrl24-ship-it.github.io', 'https://untrusted.example'];
const authorization = [undefined, 'Bearer local-registered-player', 'Bearer local-admin'];
const bodies = [
  '{}',
  '{invalid-json',
  JSON.stringify({sku:'ME-CREDITS-50000'}),
  JSON.stringify({sku:'ME-CREDITS-2000000',quantity:99,user_id:'other-player',price:0}),
  JSON.stringify({code:'ME-AAAAAAAA-BBBBBBBB-CCCCCCCC'}),
  JSON.stringify({order_id:42,status:'completed',credits:2000000}),
];

function load(name, flag) {
  let handler;
  const calls = {env:0,auth:0,fetch:0,crypto:0};
  const unexpected = key => () => {calls[key]++; throw new Error('Unexpected '+key+' operation');};
  const context = {
    Deno:{serve:fn=>{handler=fn},env:{get(){calls.env++;return flag}}},
    Response, Request, Headers, URL,
    fetch:unexpected('fetch'), createClient:unexpected('auth'),
    crypto:{subtle:{digest:unexpected('crypto')}}
  };
  const filename = 'supabase/functions/'+name+'/index.ts';
  vm.runInNewContext(fs.readFileSync(filename,'utf8'),context,{filename,timeout:1000});
  assert.equal(typeof handler,'function');
  return {handler,calls};
}

for (const name of functions) {
  test(name+': every POST remains disabled regardless of flag, identity, origin and payload', async()=>{
    for (const flag of flags) {
      const {handler,calls} = load(name,flag);
      for (const origin of origins) for (const auth of authorization) for (const body of bodies) {
        const headers = {'content-type':'application/json'};
        if (origin) headers.origin=origin;
        if (auth) headers.authorization=auth;
        const req = new Request('https://example.test/'+name,{method:'POST',headers,body});
        const response = await handler(req);
        assert.equal(response.status,503);
        assert.equal(response.headers.get('cache-control'),'no-store');
        assert.equal(response.headers.get('access-control-allow-origin'),'https://rpgsrl24-ship-it.github.io');
        assert.equal(response.headers.get('location'),null);
        assert.deepEqual(await response.json(),{error:'Pagamenti e ricariche non ancora attivi',code:'PAYMENTS_DISABLED'});
        assert.equal(req.bodyUsed,false,'Payment payload must not be consumed');
      }
      assert.deepEqual(calls,{env:0,auth:0,fetch:0,crypto:0},'No flag/secret read or external side effect');
    }
  });

  test(name+': CORS preflight and unsupported methods are inert',async()=>{
    const {handler,calls} = load(name,'true');
    const preflight = await handler(new Request('https://example.test/'+name,{method:'OPTIONS',headers:{origin:'https://rpgsrl24-ship-it.github.io','access-control-request-method':'POST','access-control-request-headers':'authorization,apikey,content-type,x-client-info'}}));
    assert.equal(preflight.status,204);
    assert.equal(await preflight.text(),'');
    const allowHeaders=preflight.headers.get('access-control-allow-headers').split(',');
    for (const header of ['authorization','apikey','content-type','x-client-info']) assert(allowHeaders.includes(header));
    for (const method of ['GET','HEAD','PUT','PATCH','DELETE']) {
      const response=await handler(new Request('https://example.test/'+name,{method}));
      assert.equal(response.status,405);
      assert.equal(response.headers.get('allow'),'POST, OPTIONS');
    }
    assert.deepEqual(calls,{env:0,auth:0,fetch:0,crypto:0});
  });
}
