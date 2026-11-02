// Runs the production scripts with isolated browser/transport doubles. No messages or live data.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');
const html=fs.readFileSync(path.join(process.env.ME_PRIVACY_SOURCE_DIR||'.','index.html'),'utf8');
const script=id=>{const found=html.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)<\\/script>'));assert(found,id+' exists');return found[1]};

function trafficHarness({registered=false,blockedStorage=false,admin=false}={}){
 const calls={network:0,uuid:0,timer:0,listeners:0,writes:0};
 const local=new Map([
  ['me_anonymous_visitor_v1','11111111-1111-4111-8111-111111111111'],
  ['marina_empire_beta_test_session','guest progress'],
  ['marina_empire_user_player-a','account progress'],
  ['sb-project-auth-token','auth session'],
  ['me_admin_analytics_optout_v1',admin?'1':'0']
 ]),session=new Map([['me_traffic_session','22222222-2222-4222-8222-222222222222'],['unrelated','preserve']]);
 const storage=data=>({getItem(k){if(blockedStorage)throw Error('Storage unavailable');return data.get(k)||null},setItem(k,v){calls.writes++;if(blockedStorage)throw Error('Storage unavailable');data.set(k,v)},removeItem(k){if(blockedStorage)throw Error('Storage unavailable');data.delete(k)}});
 const window={meRegisteredPlayer:registered,addEventListener(){calls.listeners++}};
 const context={window,localStorage:storage(local),sessionStorage:storage(session),crypto:{randomUUID(){calls.uuid++;return '33333333-3333-4333-8333-333333333333'}},
  fetch(){calls.network++;return Promise.resolve({ok:true})},setInterval(){calls.timer++;return 1},setTimeout(){calls.timer++;return 1},clearInterval(){},Date,URL,URLSearchParams,
  document:{visibilityState:'visible',referrer:'https://social.example/post',addEventListener(){calls.listeners++}},location:{search:'?utm_source=social&utm_campaign=beta'}
 };
 vm.runInNewContext(script('me-traffic-v1'),context);
 return {calls,window,local,session};
}

for(const registered of [false,true])test('Paused usage analytics performs no network or persistent tracking for '+(registered?'registered players':'guests'),()=>{
 const h=trafficHarness({registered});
 for(const event of ['page_view','play_start','mission_complete','heartbeat','unknown'])h.window.MarinaEmpireTraffic.track(event,true);
 assert.deepEqual(h.calls,{network:0,uuid:0,timer:0,listeners:0,writes:0});
 assert.equal(h.local.has('me_anonymous_visitor_v1'),false);
 assert.equal(h.session.has('me_traffic_session'),false);
 assert.equal(h.local.get('marina_empire_beta_test_session'),'guest progress');
 assert.equal(h.local.get('marina_empire_user_player-a'),'account progress');
 assert.equal(h.local.get('sb-project-auth-token'),'auth session');
 assert.equal(h.local.get('me_admin_analytics_optout_v1'),'0');
 assert.equal(h.session.get('unrelated'),'preserve');
});

test('Blocked browser storage does not break gameplay or reactivate analytics',()=>{
 const h=trafficHarness({blockedStorage:true});
 assert.doesNotThrow(()=>h.window.MarinaEmpireTraffic.track('play_start'));
 assert.deepEqual(h.calls,{network:0,uuid:0,timer:0,listeners:0,writes:0});
});

test('Admin exclusion preference is preserved while old tracker identifiers are removed',()=>{
 const h=trafficHarness({admin:true});assert.equal(h.local.get('me_admin_analytics_optout_v1'),'1');assert.equal(h.local.has('me_anonymous_visitor_v1'),false);
});

test('Authenticated usage events never query identity or insert into the database while paused',async()=>{
 const start=html.indexOf('window.MarinaEmpireAuthenticatedActivity='),end=html.indexOf('function status(',start);assert(start>0&&end>start);
 let calls=0;
 const client={auth:{getUser(){calls++;return Promise.resolve({data:{user:{id:'player-a'}},error:null})}},from(){calls++;return {insert:async()=>({error:null})}}};
 const window={},context={window,client,account:{id:'player-a',email_confirmed_at:'2026-11-02'},Date,console,lastAuthenticatedStart:0};
 vm.runInNewContext(html.slice(start,end),context);
 for(const type of ['play_start','mission_complete','unknown'])await window.MarinaEmpireAuthenticatedActivity.track(type);
 assert.equal(calls,0);
});

function helpHarness(href){
 const nodes=new Map();const get=id=>{if(!nodes.has(id))nodes.set(id,{hidden:true,value:'Un problema da verificare',listeners:{},setAttribute(){},addEventListener(event,fn){this.listeners[event]=fn}});return nodes.get(id)};
 const parsed=new URL(href),location={href,origin:parsed.origin,pathname:parsed.pathname};let network=0;
 vm.runInNewContext(script('me-beta-help-v1'),{document:{getElementById:get},location,navigator:{userAgent:'Browser di prova'},URL,encodeURIComponent,alert(){},fetch(){network++}});
 return {get,location,get network(){return network}};
}

for(const suffix of ['#access_token=ACCESS_SECRET&refresh_token=REFRESH_SECRET&type=recovery','?token_hash=QUERY_SECRET&type=recovery#access_token=ACCESS_SECRET'])test('Assistance excludes query and fragment from automatic page diagnostics: '+(suffix[0]==='#'?'fragment only':'query plus fragment'),()=>{
 const base='https://rpgsrl24-ship-it.github.io/marina-empire/',h=helpHarness(base+suffix);
 assert.equal(h.location.href,base+suffix,'Opening the page must not send email or even open a draft');
 h.get('meBetaSend').listeners.click();
 const draft=new URL(h.location.href),body=draft.searchParams.get('body');
 assert.equal(draft.protocol,'mailto:');assert.equal(draft.pathname,'info@floatmarine.it');
 assert.match(body,/Un problema da verificare/);assert.match(body,/Dispositivo: Browser di prova/);
 assert(body.includes('Pagina: '+base));
 assert.doesNotMatch(body,/SECRET|access_token|refresh_token|token_hash|type=recovery/);
 assert.equal(h.network,0,'Only the local email draft is prepared; no message is sent');
});
