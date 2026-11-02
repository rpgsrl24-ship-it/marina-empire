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

for(const registered of [false,true])test('Session analytics records only allowed events without persistent traffic identifiers for '+(registered?'registered players':'guests'),()=>{
 const h=trafficHarness({registered});
 h.window.MarinaEmpireTraffic.track('play_start',true);
 h.window.MarinaEmpireTraffic.track('play_start',true);
 h.window.MarinaEmpireTraffic.track('mission_complete');
 h.window.MarinaEmpireTraffic.track('heartbeat');
 assert.equal(h.calls.network,3,'page_view plus one play_start plus one mission_complete');
 assert.equal(h.calls.uuid,1,'one in-memory session id per page load');
 assert.equal(h.calls.timer,0);assert.equal(h.calls.listeners,0);assert.equal(h.calls.writes,0);
 assert.equal(h.local.has('me_anonymous_visitor_v1'),false);
 assert.equal(h.session.has('me_traffic_session'),false);
 assert.equal(h.local.get('marina_empire_beta_test_session'),'guest progress');
 assert.equal(h.local.get('marina_empire_user_player-a'),'account progress');
 assert.equal(h.local.get('sb-project-auth-token'),'auth session');
 assert.equal(h.session.get('unrelated'),'preserve');
});

test('Blocked browser storage does not break session analytics or gameplay',()=>{
 const h=trafficHarness({blockedStorage:true});
 assert.doesNotThrow(()=>h.window.MarinaEmpireTraffic.track('play_start'));
 assert.equal(h.calls.network,2,'page_view and play_start still use the in-memory session');
 assert.equal(h.calls.uuid,1);assert.equal(h.calls.timer,0);assert.equal(h.calls.listeners,0);assert.equal(h.calls.writes,0);
});

test('Old tracker identifiers are removed without touching unrelated browser state',()=>{
 const h=trafficHarness({admin:true});assert.equal(h.local.has('me_anonymous_visitor_v1'),false);assert.equal(h.local.get('me_admin_analytics_optout_v1'),'1');assert.equal(h.calls.writes,0);
});

test('Authenticated activity records only verified play starts and mission completions',async()=>{
 const start=html.indexOf('window.MarinaEmpireAuthenticatedActivity='),end=html.indexOf('function status(',start);assert(start>0&&end>start);
 const inserted=[];let verified=0;
 const client={auth:{getUser(){verified++;return Promise.resolve({data:{user:{id:'player-a'}},error:null})}},from(name){assert.equal(name,'me_authenticated_activity');return {insert:async row=>{inserted.push(row);return {error:null}}}}};
 const window={},context={window,client,account:{id:'player-a',email_confirmed_at:'2026-11-02'},Date,console,lastAuthenticatedStart:0};
 vm.runInNewContext(html.slice(start,end),context);
 await window.MarinaEmpireAuthenticatedActivity.track('play_start');
 await window.MarinaEmpireAuthenticatedActivity.track('play_start');
 await window.MarinaEmpireAuthenticatedActivity.track('mission_complete');
 await window.MarinaEmpireAuthenticatedActivity.track('unknown');
 assert.equal(verified,2);assert.equal(JSON.stringify(inserted),JSON.stringify([{user_id:'player-a',event_type:'play_start'},{user_id:'player-a',event_type:'mission_complete'}]));
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
