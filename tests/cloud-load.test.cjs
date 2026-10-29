const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('async function loadCloud()');
const end=html.indexOf('async function login()',start);
assert(start>=0&&end>start,'cloud load function found');
const fn=html.slice(start,end);
async function scenario({failWrite=false,confirmLoad=true,remoteValid=true,remoteMissing=false,existingBackup=null}={}){
 let state={name:'Local',owned:[],completed:[],coins:100,fuel:30};
 const remote={name:'Online',owned:[],completed:[],coins:400,fuel:70};
 let backup=existingBackup?{key:"marina_empire_before_cloud_load",value:existingBackup}:null,writes=0;const messages=[];
 const els={playerName:{value:''},welcome:{classList:{add(){}}}};
 const context={account:{id:'test'},client:{from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({error:null,data:remoteMissing?null:{game_state:remoteValid?remote:{name:4}}})})})})},busy:false,
 validState:v=>v&&typeof v.name==='string'&&Array.isArray(v.owned),confirm:()=>confirmLoad,cloudConflictMessage:()=>'',safeSnapshot:()=>JSON.parse(JSON.stringify(state)),
 localStorage:{getItem:()=>backup?JSON.stringify(backup.value):null,setItem:(key,value)=>{if(failWrite)throw Error('QuotaExceeded');backup={key,value:JSON.parse(value)};}},Date,JSON,
 fresh:()=>({name:'Fresh',owned:[],completed:[],coins:0,fuel:0}),persist:()=>{writes++},el:k=>els[k],showTab:()=>{},render:()=>{},tick:()=>{},status:t=>messages.push(t),toggle:()=>{}};
 Object.defineProperty(context,'state',{get:()=>state,set:v=>{state=v}});
 await vm.runInNewContext(fn+';loadCloud()',context);
 return {state,backup,writes,messages,busy:context.busy};
}
(async()=>{
 let x=await scenario();assert.equal(x.state.name,'Online');assert.equal(x.backup.value.game.name,'Local');assert.equal(x.backup.value.game.coins,100);assert.equal(x.writes,1);assert.equal(x.busy,false);
 x=await scenario({failWrite:true});assert.equal(x.state.name,'Local');assert.equal(x.writes,0);assert.equal(x.backup,null);assert.equal(x.busy,false);
 x=await scenario({confirmLoad:false});assert.equal(x.state.name,'Local');assert.equal(x.backup,null);assert.equal(x.writes,0);
 x=await scenario({remoteValid:false});assert.equal(x.state.name,'Local');assert.equal(x.writes,0);assert(x.messages.some(m=>m.includes('dati non validi')));
 x=await scenario({remoteMissing:true});assert.equal(x.state.name,'Local');assert(x.messages.some(m=>m.includes('Nessuna partita online')));
 x=await scenario({existingBackup:{savedAt:1,game:{name:'Original',owned:[],completed:[],coins:800,fuel:40}}});assert.equal(x.state.name,'Online');assert.equal(x.backup.value.game.name,'Original');assert.equal(x.backup.value.game.coins,800);
 console.log('Cloud load and backup safety tests passed');
})().catch(e=>{console.error(e);process.exitCode=1});
