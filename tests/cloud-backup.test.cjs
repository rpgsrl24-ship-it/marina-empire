const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const begin=html.indexOf('function restoreCloudBackup()');
const end=html.indexOf('async function loadCloud()',begin);
assert(begin>=0&&end>begin,'restore function exists');
const source=html.slice(begin,end);
function run({backup,accepted=true}){
 let state={name:'Cloud',owned:[],completed:[],coins:50,fuel:10};
 const messages=[];let writes=0;let reverseBackup=null;
 const fields={playerName:{value:''},welcome:{classList:{add(){}}}};
 const ctx={JSON,localStorage:{getItem(){return backup===null?null:JSON.stringify(backup)},setItem(k,v){reverseBackup={key:k,value:JSON.parse(v)}}},validState:s=>!!s&&typeof s.name==='string'&&Array.isArray(s.owned),confirm:()=>accepted,fresh:()=>({name:'New',owned:[],completed:[],coins:0,fuel:0}),persist:()=>{writes++},el:k=>fields[k],showTab:()=>{},render:()=>{},tick:()=>{},status:s=>messages.push(s)};
 Object.defineProperty(ctx,'state',{get:()=>state,set:v=>{state=v}});
 vm.runInNewContext(source+';restoreCloudBackup();',ctx);
 return {state,writes,messages,fields,reverseBackup};
}
const good={savedAt:123,game:{name:'Local',owned:[],completed:[],coins:900,fuel:60}};
let x=run({backup:good});assert.equal(x.state.name,'Local');assert.equal(x.state.coins,900);assert.equal(x.writes,1);assert.equal(x.fields.playerName.value,'Local');assert.equal(x.reverseBackup.value.game.name,'Cloud');
x=run({backup:good,accepted:false});assert.equal(x.state.name,'Cloud');assert.equal(x.writes,0);assert.equal(x.reverseBackup,null);
x=run({backup:null});assert.equal(x.state.name,'Cloud');assert.equal(x.writes,0);
x=run({backup:{game:{name:'Broken'}}});assert.equal(x.state.name,'Cloud');assert.equal(x.writes,0);
assert(html.includes('localStorage.setItem(backupKey,JSON.stringify({savedAt:Date.now(),game:safeSnapshot()}))'));
assert(html.includes('Impossibile creare la copia di sicurezza: caricamento annullato.'));
assert(html.includes('restoreCloudButton.addEventListener("click",restoreCloudBackup)'));
console.log('Cloud backup/restore tests passed');
