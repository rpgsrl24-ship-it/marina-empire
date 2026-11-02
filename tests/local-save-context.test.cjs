// Reproduces the original 3D debit against the guest save while a player was logged in.
// All sessions, storage and money below are isolated fixtures; no server is contacted.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');
const createContext=require('../local-save-context.js');
const scene=fs.readFileSync('marine-deluxe-originali.html','utf8');
const index=fs.readFileSync('index.html','utf8');
const GUEST='marina_empire_beta_test_session';
const AUTH='sb-zrdetqvnjmqkfyajxjgp-auth-token';
const accountKey=id=>'marina_empire_user_'+id;
const game=(name,coins)=>({name,coins,owned:['voyager'],completed:[],marinas:{}});
function fixture(){
 const data=new Map([[GUEST,JSON.stringify(game('Guest',10000))],
  [accountKey('player-a'),JSON.stringify(game('Player A',40000))],
  [accountKey('player-b'),JSON.stringify(game('Player B',80000))],
  ['marina-empire-phase1-rimini',JSON.stringify({built:9,occupied:[1,2],credits:10000})]]);
 const writes=[];
 const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>{writes.push(key);data.set(key,String(value))},removeItem:key=>{writes.push(key);data.delete(key)}};
 const api=createContext(storage);
 return {storage,api,data,writes,read:key=>JSON.parse(data.get(key)||'null'),
  session(id){if(id===null)data.delete(AUTH);else data.set(AUTH,JSON.stringify({user:{id,email_confirmed_at:'2026-11-02'}}));}};
}
function sceneHarness(f,helper=f.api){
 const elements=new Map(),$=id=>{if(!elements.has(id))elements.set(id,{});return elements.get(id)};
 const ctx={window:{MarinaLocalSaveContext:helper},localStorage:f.storage,current:{id:'rimini',piers:18},
  progress:{built:1,occupied:[],credits:0},$,Number,Array,JSON,Math,Date,
  confirm:()=>true,rebuild(){},update(){},slots:[],boats:[],yacht(){return {}},camera:{},orbit:{}};
 vm.createContext(ctx);
 const a=scene.indexOf('const marinaLocalContext='),b=scene.indexOf('function collectBerthIncome()',a);
 assert(a>=0&&b>a,'Contextual production save code exists');
 vm.runInContext(scene.slice(a,b),ctx);
 const controls=scene.split('\n').find(line=>line.startsWith("$('marina').onchange="));
 assert(controls,'Production controls found');
 vm.runInContext(controls,ctx);
 return {ctx,elements,run:code=>vm.runInContext(code,ctx)};
}

test('Registered 3D debit/reward uses its own save and never changes the guest',()=>{
 const f=fixture();f.session('player-a');f.api.select('player-a');
 const guestBefore=f.data.get(GUEST),bBefore=f.data.get(accountKey('player-b'));
 const h=sceneHarness(f);h.run('load()');
 assert.equal(h.ctx.progress.built,1,'Registered player must not inherit the guest layout');
 assert.equal(h.run('chargeEmpire(2000)'),true);
 assert.equal(f.read(accountKey('player-a')).coins,38000);
 assert.equal(h.run('rewardEmpire(450)'),true);
 assert.equal(f.read(accountKey('player-a')).coins,38450);
 assert.equal(f.data.get(GUEST),guestBefore);
 assert.equal(f.data.get(accountKey('player-b')),bBefore);
 assert(f.data.has(accountKey('player-a')+'_marina_rimini'));
 assert.equal(f.read('marina-empire-phase1-rimini').built,9);
 assert(!f.writes.includes(GUEST));
});

test('Guest save and historical guest layout still work without a session',()=>{
 const f=fixture();f.api.select(null);const aBefore=f.data.get(accountKey('player-a'));
 const h=sceneHarness(f);h.run('load()');assert.equal(h.ctx.progress.built,9);
 assert.equal(h.run('chargeEmpire(2000)'),true);assert.equal(f.read(GUEST).coins,8000);
 assert.equal(h.run('rewardEmpire(450)'),true);assert.equal(f.read(GUEST).coins,8450);
 assert.equal(f.data.get(accountKey('player-a')),aBefore);
});

test('Every old 3D control fails closed after another account or logout is selected',()=>{
 for(const next of ['player-b',null]){
  const f=fixture();f.session('player-a');f.api.select('player-a');const h=sceneHarness(f);h.run('load()');
  f.session(next);f.api.select(next);
  const stored=[...f.data.entries()],writes=f.writes.length,progress=JSON.stringify(h.ctx.progress);
  assert.equal(h.run('chargeEmpire(2000)'),false);assert.equal(h.run('rewardEmpire(650)'),false);assert.equal(h.run('save()'),false);
  for(const id of ['build','arrive','maxiArrive','depart','charterStandard','charterLuxury','reset']){
   h.elements.get(id).onclick();
   assert.equal(JSON.stringify(h.ctx.progress),progress,id+' must not change stale in-memory progress');
  }
  assert.deepEqual([...f.data.entries()],stored);assert.equal(f.writes.length,writes);
  assert.match(h.elements.get('message').textContent,/account cambiato/);
 }
});

test('Session change is detected even before index updates the selected namespace',()=>{
 const f=fixture();f.session('player-a');f.api.select('player-a');const h=sceneHarness(f);h.run('load()');
 f.session('player-b');const writes=f.writes.length;
 assert.equal(h.run('chargeEmpire(2000)'),false);assert.equal(f.api.capture(),null);
 assert.equal(f.writes.length,writes);assert.equal(f.read(GUEST).coins,10000);
 f.session(null);assert.equal(h.run('rewardEmpire(650)'),false);assert.equal(f.api.capture(),null);
});

test('Returning to the same account does not revalidate a handle from an earlier account switch',()=>{
 const f=fixture();f.session('player-a');f.api.select('player-a');const old=f.api.capture();
 f.api.select('player-a');assert(f.api.isCurrent(old),'Repeated UI refresh preserves the same context');
 f.session('player-b');f.api.select('player-b');f.session('player-a');f.api.select('player-a');
 assert.equal(f.api.isCurrent(old),false);assert(f.api.capture());
});

test('Missing helper, missing context and unrecognized or unverified session never fall back to the guest',()=>{
 for(const mode of ['helper','context','malformed','unverified','mismatch']){
  const f=fixture();
  if(mode!=='context')f.api.select(mode==='mismatch'?'player-a':null);
  if(mode==='malformed')f.data.set(AUTH,'not-json');
  if(mode==='unverified')f.data.set(AUTH,JSON.stringify({user:{id:'player-a',email_confirmed_at:null}}));
  if(mode==='mismatch')f.session('player-b');
  const stored=[...f.data.entries()],writes=f.writes.length;
  const h=sceneHarness(f,mode==='helper'?null:f.api);h.run('load()');
  assert.equal(h.run('chargeEmpire(2000)'),false);assert.equal(h.run('rewardEmpire(650)'),false);assert.equal(h.run('save()'),false);
  assert.deepEqual([...f.data.entries()],stored,mode);assert.equal(f.writes.length,writes,mode);
 }
});

test('Account layouts are separate and index reads the matching account layout',()=>{
 const f=fixture();
 for(const [id,built,occupied] of [['player-a',3,[1]],['player-b',5,[2,3]]]){
  f.session(id);f.api.select(id);const handle=f.api.capture();
  assert(f.api.writeLayout(handle,'rimini',{built,occupied,berthEarnings:built*100}));
 }
 const summary=index.split('\n').find(line=>line.startsWith('function marinaBerthSummary(id)'));
 assert(summary);
 const ctx={localStorage:f.storage,KEY:accountKey('player-a'),ME_BASE_SAVE_KEY:GUEST,state:{marinas:{}}};
 vm.createContext(ctx);vm.runInContext(summary,ctx);
 assert.equal(vm.runInContext('marinaBerthSummary("rimini").built',ctx),3);
 assert.equal(vm.runInContext('marinaBerthSummary("rimini").occupied',ctx),1);
 ctx.KEY=accountKey('player-b');assert.equal(vm.runInContext('marinaBerthSummary("rimini").built',ctx),5);
 ctx.KEY=GUEST;assert.equal(vm.runInContext('marinaBerthSummary("rimini").built',ctx),9);
});

test('Invalid amounts and inaccessible storage cannot mutate saves',()=>{
 const f=fixture();f.api.select(null);const h=sceneHarness(f);const original=f.data.get(GUEST);
 for(const amount of [-2000,0,Infinity,NaN,1.5]){
  assert.equal(h.run('chargeEmpire('+String(amount)+')'),false);
  assert.equal(h.run('rewardEmpire('+String(amount)+')'),false);
 }
 assert.equal(f.data.get(GUEST),original);
 const blocked=createContext({getItem(){throw Error('storage blocked')},setItem(){throw Error('storage blocked')}});
 assert.equal(blocked.select(null),false);assert.equal(blocked.capture(),null);
 assert.equal(blocked.writeGame(null,game('Guest',1000)),false);
});
