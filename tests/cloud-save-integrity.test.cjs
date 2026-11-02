'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');
const html=fs.readFileSync('index.html','utf8');
function section(start,end){const a=html.indexOf(start),b=html.indexOf(end,a+start.length);assert(a>=0&&b>a,`${start} exists`);return html.slice(a,b);}
const equality=html.includes('function sameGameState(')?section('function sameGameState(','function safeSnapshot('):'';
const cloudSave=section('async function saveCloud()','function restoreCloudBackup()');
const firstSave=section('async function saveFirstAccountProgress()','async function saveCloud()');
const cloudLoad=section('async function loadCloud()','async function login()');
const autoLoad=section('async function reconcileAccountProgress()','let autoSaveInFlight=');
const restore=section('function restoreCloudBackup()','async function loadCloud()');
const persistence=section('function persist()','let meToastTimer=');
const clone=value=>JSON.parse(JSON.stringify(value));
function reordered(value){if(Array.isArray(value))return value.map(reordered);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).reverse().map(k=>[k,reordered(value[k])]));return value;}
function game(){return {name:'Comandante prova',coins:10000,prestige:50,fuel:300,condition:95,port:'cervia',boat:'voyager',owned:['voyager','open'],completed:['INTRO_RIMINI_CERVIA'],voyages:1,trip:null,marinas:{},reservations:[],fleetFuel:{voyager:300,open:120},fleetPorts:{voyager:'cervia',open:'rimini'}};}
function harness({initial=game(),remote=null,persistFails=false,changeOnRead=0,conflict=false,verificationChange=false}={}){
 const messages=[],tabs=[],storage=new Map(),effects={profile:0,writes:0,confirms:0,reads:0,persists:0};
 const fields={playerName:{value:''},welcome:{classList:{add(){}}}};
 let stored=remote?{game_state:clone(remote),updated_at:'2026-11-02T08:00:00Z'}:null;
 const ctx={JSON,Date,Number,Object,Array,console,account:{id:'account-a',email_confirmed_at:'2026-11-01'},state:clone(initial),busy:false,autoSaveInFlight:false,reconcileInFlight:false,window:{},
  validState:s=>!!s&&typeof s.name==='string'&&Array.isArray(s.owned)&&Array.isArray(s.completed)&&Number.isFinite(s.coins)&&Number.isFinite(s.fuel),
  safeSnapshot:()=>clone(ctx.state),fresh:()=>({...game(),name:'',voyages:0,completed:[],coins:10000}),
  confirm:()=>{effects.confirms++;return true;},cloudConflictMessage:()=>'',
  status:message=>messages.push(message),toggle(){},render(){},tick(){},el:id=>fields[id],showTab:id=>tabs.push(id),
  persist:()=>{effects.persists++;if(persistFails)return false;storage.set('active',JSON.stringify(ctx.state));return true;},
  localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)}
 };
 ctx.client={from(table){let op='select',payload,options,filters={};
  const execute=async()=>{
   if(table==='player_profiles'){effects.profile++;return {error:null};}
   if(op==='select'){
    effects.reads++;if(changeOnRead===effects.reads)ctx.account={id:'account-b',email_confirmed_at:'2026-11-01'};
    const data=stored?{...stored,game_state:reordered(stored.game_state)}:null;
    if(verificationChange&&effects.writes&&data)data.game_state.coins++;
    return {data,error:null};
   }
   if(op==='update'&&conflict)return {data:null,error:null};
   if(op==='upsert'&&options?.ignoreDuplicates&&stored)return {data:null,error:null};
   if(op==='update'&&filters.updated_at!==stored?.updated_at)return {data:null,error:null};
   effects.writes++;stored={game_state:clone(payload.game_state),updated_at:payload.updated_at};
   return {data:op==='update'?{user_id:ctx.account.id}:null,error:null};
  };
  const query={select(){return query;},eq(k,v){filters[k]=v;return query;},update(p){op='update';payload=p;return query;},insert(p){op='insert';payload=p;return query;},upsert(p,o){op='upsert';payload=p;options=o;return query;},maybeSingle:execute,then:(yes,no)=>execute().then(yes,no)};
  return query;
 }};
 vm.createContext(ctx);
 vm.runInContext(equality+cloudSave+firstSave+cloudLoad+autoLoad+restore,ctx);
 return {ctx,messages,tabs,storage,effects,run:name=>vm.runInContext(name+'()',ctx)};
}

test('manual save verifies a JSONB round trip with reordered nested object keys',async()=>{
 const h=harness();await h.run('saveCloud');
 assert.equal(h.effects.writes,1);assert(h.messages.some(m=>m.startsWith('Partita beta salvata online e verificata.')));
 assert.equal(h.ctx.busy,false);
});
test('same remote game does not trigger an overwrite confirmation solely for object key order',async()=>{
 const h=harness({remote:reordered(game())});await h.run('saveCloud');
 assert.equal(h.effects.confirms,0);assert(h.messages.some(m=>m.startsWith('Partita beta salvata online e verificata.')));
});
test('first account save verifies reordered data without duplicating an existing game',async()=>{
 const h=harness();await h.run('saveFirstAccountProgress');
 assert.equal(h.effects.writes,1);assert(h.messages.some(m=>m.startsWith('Registrazione completata:')));
 await h.run('saveFirstAccountProgress');assert.equal(h.effects.writes,1);
});
test('actual data differences and concurrent changes remain blocked',async()=>{
 const different=game();different.coins=12000;
 const h=harness({remote:different,conflict:true});await h.run('saveCloud');
 assert.equal(h.effects.confirms,1);assert.equal(h.effects.writes,0);
 assert(h.messages.some(m=>m.includes('modificata da un altro dispositivo')));
 const v=harness({verificationChange:true});await v.run('saveCloud');
 assert(v.messages.some(m=>m.startsWith('Salvataggio non confermato:')));
});
test('array order and primitive types remain significant in save comparison',()=>{
 const h=harness();assert.equal(typeof h.ctx.sameGameState,'function');
 const a=game(),b=reordered(a);assert.equal(h.ctx.sameGameState(a,b),true);
 b.owned.reverse();assert.equal(h.ctx.sameGameState(a,b),false);
 assert.equal(h.ctx.sameGameState({coins:1},{coins:'1'}),false);
 assert.equal(h.ctx.sameGameState({trip:null},{}),false);
});
test('account change during initial read prevents prompts and all writes',async()=>{
 const remote=game();remote.coins=12000;
 const h=harness({remote,changeOnRead:1});await h.run('saveCloud');
 assert.equal(h.effects.confirms,0);assert.equal(h.effects.profile,0);assert.equal(h.effects.writes,0);
});
test('account change during verification cannot report success for the new account',async()=>{
 const h=harness({changeOnRead:2});await h.run('saveCloud');
 assert.equal(h.effects.writes,1);assert(!h.messages.some(m=>m.startsWith('Partita beta salvata online e verificata.')));
 assert(h.messages.some(m=>m.includes('account è cambiato')));
});
test('manual and automatic cloud loads resume the navigation view for an active trip',async()=>{
 const remote=game();remote.trip={id:'trip',origin:'rimini',dest:'cervia',start:1,end:2};
 const manual=harness({remote});await manual.run('loadCloud');assert.equal(manual.tabs.at(-1),'map');
 const empty={...game(),name:'',voyages:0,completed:[]};
 const auto=harness({initial:empty,remote});await auto.run('reconcileAccountProgress');assert.equal(auto.tabs.at(-1),'map');
});
test('failed active-save writes preserve the previous game on manual and automatic cloud load',async()=>{
 const remote=game();remote.name='Online';remote.coins=20000;
 const h=harness({remote,persistFails:true});await h.run('loadCloud');
 assert.equal(h.ctx.state.name,'Comandante prova');assert.equal(h.ctx.state.coins,10000);
 assert(!h.messages.some(m=>m.includes('caricata correttamente')));assert(h.storage.has('marina_empire_before_cloud_load'));
 const initial={...game(),name:'',voyages:0,completed:[]};
 const a=harness({initial,remote,persistFails:true});await a.run('reconcileAccountProgress');
 assert.equal(a.ctx.state.name,'');assert(!a.messages.some(m=>m.includes('recuperata automaticamente')));
});
test('failed backup restore preserves current game and its reverse backup',async()=>{
 const h=harness({persistFails:true});
 h.storage.set('marina_empire_before_cloud_load',JSON.stringify({accountId:'account-a',game:{...game(),name:'Backup',coins:500}}));
 await h.run('restoreCloudBackup');assert.equal(h.ctx.state.name,'Comandante prova');
 assert(h.storage.has('marina_empire_before_backup_restore'));
 assert(!h.messages.some(m=>m.startsWith('Copia locale ripristinata.')));
});
test('manual local save never reports success when browser storage rejects the write',()=>{
 const messages=[];const button={};const ctx={state:game(),KEY:'save',boat:()=>({tank:400}),JSON,Number,Math,Array,Error,console:{warn(){}},localStorage:{setItem(){throw Error('QuotaExceeded');},getItem(){return null;}},notice:m=>messages.push(m),$:()=>button};
 const buttonCode=html.split('\n').find(line=>line.startsWith('$("save").onclick='));assert(buttonCode);
 vm.runInNewContext(persistence+buttonCode+';$("save").onclick();',ctx);
 assert(messages.some(m=>m.includes('Salvataggio locale non riuscito')));assert(!messages.includes('Partita salvata'));
});
test('local persistence explicitly confirms success only after reading back the same bytes',()=>{
 const records=new Map();const ctx={state:game(),KEY:'save',boat:()=>({tank:400}),JSON,Number,Math,Array,Error,console:{warn(){}},localStorage:{setItem:(k,v)=>records.set(k,v),getItem:k=>records.get(k)},notice(){}};
 assert.equal(vm.runInNewContext(persistence+';persist()',ctx),true);
 ctx.localStorage.getItem=()=>null;assert.equal(vm.runInNewContext(persistence+';persist()',ctx),false);
});

function failedLocalReplacementHarness(){
 const nodes=new Map(),messages=[],effects={writes:0,registrationReset:0,render:0};
 const state=game(),saved=JSON.stringify(state);
 const get=id=>{if(!nodes.has(id))nodes.set(id,{addEventListener(type,fn){this[type]=fn;},classList:{add(){},remove(){}}});return nodes.get(id);};
 const ctx={state,KEY:'existing',JSON,Number,Math,Array,Set,Error,console:{warn(){}},
  localStorage:{setItem(){effects.writes++;throw Error('QuotaExceeded');},getItem(){return saved;}},
  notice:message=>messages.push(message),$:get,confirm:()=>true,
  fresh:()=>({...game(),name:'',voyages:0,completed:[],coins:10000}),boat:()=>({tank:400}),
  boats:[{id:'voyager'},{id:'open'}],ports:[{id:'rimini'},{id:'cervia'}],gameDay:()=> '2026-11-02',
  window:{meResetGuestRegistration(){effects.registrationReset++;}},render(){effects.render++;},showTab(){}
 };
 vm.createContext(ctx);vm.runInContext(persistence,ctx);
 return {ctx,state,get,messages,effects};
}

test('failed new-game persistence preserves the existing game and the guest registration claim',()=>{
 const h=failedLocalReplacementHarness();
 const handler=html.split('\n').find(line=>line.startsWith('$("reset").onclick='));assert(handler);
 vm.runInContext(handler,h.ctx);h.get('reset').onclick();
 assert.equal(h.effects.writes,1,'The test must reach the rejected storage write');
 assert.equal(h.ctx.state,h.state,'The exact previous state must remain active');
 assert.equal(h.ctx.state.name,'Comandante prova');assert.equal(h.ctx.state.coins,10000);
 assert.equal(h.effects.registrationReset,0,'A failed reset must not release the existing guest claim');
 assert(h.messages.some(message=>message.includes('Salvataggio locale non riuscito')));
});

test('failed imported-backup persistence preserves the existing game without a restore confirmation',async()=>{
 const h=failedLocalReplacementHarness();
 const handler=html.split('\n').find(line=>line.startsWith('$("importSaveFile").addEventListener('));assert(handler);
 vm.runInContext(handler,h.ctx);
 const backup={format:'marina-empire-backup',version:1,game:{...game(),name:'Backup',coins:500}};
 await h.get('importSaveFile').change({target:{value:'selected',files:[{size:1000,text:async()=>JSON.stringify(backup)}]}});
 assert.equal(h.effects.writes,1,'The test must reach the rejected storage write');
 assert.equal(h.ctx.state,h.state,'The exact previous state must remain active');
 assert.equal(h.ctx.state.name,'Comandante prova');assert.equal(h.ctx.state.coins,10000);
 assert.equal(h.effects.render,0,'Do not render the imported state after its write fails');
 assert(h.messages.some(message=>message.includes('Salvataggio locale non riuscito')));
 assert(!h.messages.includes('Backup ripristinato sul dispositivo'));
});
