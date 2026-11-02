// Production presence handlers, isolated from Supabase and real administrators.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const test=require('node:test');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(process.env.ME_PRESENCE_SOURCE_DIR||'.','admin.html'),'utf8');
const begin=html.indexOf('function startLive(){'),end=html.indexOf('async function refreshTraffic(){',begin);
assert(begin>0&&end>begin);

function harness(){
 const nodes=new Map(),channels=[];let databaseReads=0;
 const get=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'—',classList:{contains:()=>false}});return nodes.get(id)};
 const client={from(){databaseReads++;throw Error('Online presence must not query behavioral analytics')},
  channel(){const ch={records:{},on(event,filter,fn){assert.equal(event,'presence');assert.equal(filter.event,'sync');ch.sync=fn;return ch},subscribe(fn){ch.status=fn;return ch},presenceState(){return ch.records}};channels.push(ch);return ch},removeChannel(){}
 };
 const context={$:get,client,window:{supabase:{createClient:()=>client}},url:'https://example.test',key:'public',adminAccessEpoch:1,activeAdminId:'admin-a',liveChannel:null,liveClient:null,livePeak:0,livePresenceReady:false,Date,Math,console,clearInterval(){}};
 context.currentAdmin=epoch=>epoch===context.adminAccessEpoch&&!!context.activeAdminId;
 vm.createContext(context);vm.runInContext(html.slice(begin,end),context);
 return {get,context,channels,get databaseReads(){return databaseReads},run(code){return vm.runInContext(code,context)}};
}

test('Admin online count comes from connected page presence without querying usage events',async()=>{
 const h=harness();h.run('startLive()');const ch=h.channels[0];ch.status('SUBSCRIBED');
 ch.records={a:[{id:'session-a'},{id:'session-a'}],b:[{id:'session-b'}],observer:[{}]};ch.sync();await h.run('refreshOnline()');
 assert.equal(String(h.get('livePlayers').textContent),'2');assert.equal(String(h.get('livePeak').textContent),'2');
 assert.match(h.get('liveStatus').textContent,/schede|sessioni/i);assert.match(h.get('liveStatus').textContent,/non.*persone/i);
 assert.equal(h.databaseReads,0);
 ch.records={};ch.sync();assert.equal(String(h.get('livePlayers').textContent),'0');assert.equal(String(h.get('livePeak').textContent),'2');
});

test('Unsynchronized or disconnected presence is unavailable, never a false zero',async()=>{
 const h=harness();h.run('startLive()');const ch=h.channels[0];ch.status('SUBSCRIBED');await h.run('refreshOnline()');
 assert.equal(h.get('livePlayers').textContent,'—');
 ch.records={a:[{id:'session-a'}]};ch.sync();ch.status('CHANNEL_ERROR');await h.run('refreshOnline()');
 assert.equal(h.get('livePlayers').textContent,'—');assert.match(h.get('liveStatus').textContent,/offline|non disponibile/i);
 assert.equal(h.databaseReads,0);
});

test('Late presence callbacks cannot restore values after an administrator logs out',()=>{
 const h=harness();h.run('startLive()');const ch=h.channels[0];ch.status('SUBSCRIBED');ch.records={a:[{id:'session-a'}]};ch.sync();
 h.context.adminAccessEpoch++;h.context.activeAdminId=null;h.run('stopLive()');h.get('livePlayers').textContent='—';h.get('liveStatus').textContent='';
 ch.sync();ch.status('SUBSCRIBED');ch.status('CHANNEL_ERROR');
 assert.equal(h.get('livePlayers').textContent,'—');assert.equal(h.get('liveStatus').textContent,'');
});

test('Callbacks from a previous connection cannot overwrite a new admin view',()=>{
 const h=harness();h.run('startLive()');const old=h.channels[0];h.run('stopLive()');h.context.adminAccessEpoch++;
 h.run('startLive()');const current=h.channels[1];current.status('SUBSCRIBED');current.records={a:[{id:'a'}],b:[{id:'b'}],c:[{id:'c'}]};current.sync();
 old.records={stale:[{id:'old'}]};old.sync();old.status('CHANNEL_ERROR');
 assert.equal(String(h.get('livePlayers').textContent),'3');assert.doesNotMatch(h.get('liveStatus').textContent,/offline/);
});

test('Late sync after a channel error cannot turn stale records into online sessions',async()=>{
 const h=harness();h.run('startLive()');const ch=h.channels[0];ch.status('SUBSCRIBED');ch.records={a:[{id:'session-a'}]};ch.sync();
 ch.status('CHANNEL_ERROR');ch.sync();await h.run('refreshOnline()');
 assert.equal(h.get('livePlayers').textContent,'—');assert.match(h.get('liveStatus').textContent,/offline/);
 ch.status('SUBSCRIBED');await h.run('refreshOnline()');assert.equal(h.get('livePlayers').textContent,'—');
 ch.records={};ch.sync();assert.equal(String(h.get('livePlayers').textContent),'0');
});
