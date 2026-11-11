'use strict';
const assert=require('node:assert/strict');
const makeFactory=require('../cloud-sync-modern.js');

function storage(){
 const m=new Map();
 return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),_m:m};
}
function game(coins=10000,name='Comandante'){return{name,coins,prestige:0,fuel:300,condition:100,port:'rimini',boat:'voyager',owned:['voyager'],completed:[],trip:null,voyages:0}}
function localContext(initial){
 let current='user1',games={user1:initial?JSON.parse(JSON.stringify(initial)):null};
 return {
  select:id=>{current=id;return true},
  capture:()=>({accountId:current}),
  readGame:h=>games[h.accountId]?JSON.parse(JSON.stringify(games[h.accountId])):null,
  writeGame:(h,g)=>{games[h.accountId]=JSON.parse(JSON.stringify(g));return true},
  _get:id=>games[id]?JSON.parse(JSON.stringify(games[id])):null,
  _set:(id,g)=>{games[id]=g?JSON.parse(JSON.stringify(g)):null}
 };
}
function client(remoteRef){
 const user={id:'user1',email:'test@example.com',email_confirmed_at:'2026-11-11T00:00:00Z'};
 return {
  auth:{getUser:async()=>({data:{user},error:null})},
  from(table){
   assert.equal(table,'player_progress');
   let op='select',payload=null,filters={};
   const q={
    select(){return q},
    insert(p){op='insert';payload=p;return q},
    update(p){op='update';payload=p;return q},
    eq(k,v){filters[k]=v;return q},
    async maybeSingle(){
     if(op==='select')return{data:remoteRef.value?{game_state:JSON.parse(JSON.stringify(remoteRef.value.game)),updated_at:remoteRef.value.updatedAt}:null,error:null};
     if(op==='update'){
      if(!remoteRef.value||filters.updated_at!==undefined&&filters.updated_at!==remoteRef.value.updatedAt)return{data:null,error:null};
      remoteRef.value={game:JSON.parse(JSON.stringify(payload.game_state)),updatedAt:payload.updated_at};
      return{data:{user_id:'user1'},error:null};
     }
     return{data:null,error:null};
    },
    then(resolve,reject){
     if(op==='insert'){
      remoteRef.value={game:JSON.parse(JSON.stringify(payload.game_state)),updatedAt:payload.updated_at};
      return Promise.resolve({error:null}).then(resolve,reject);
     }
     return q.maybeSingle().then(resolve,reject);
    }
   };
   return q;
  }
 };
}

(async()=>{
 // A. First device: local exists, cloud empty => upload.
 let s=storage(),local=localContext(game(10000)),remote={value:null};
 let cloud=makeFactory(s)({client:client(remote),localContext:local});
 let r=await cloud.reconcile();
 assert.equal(r.status,'uploaded');
 assert.equal(remote.value.game.coins,10000);

 // B. Existing cloud on a new device: guest-derived local must not overwrite cloud.
 const device2=localContext(game(10000,'Guest copy'));
 cloud=makeFactory(s)({client:client(remote),localContext:device2});
 r=await cloud.reconcile({localWasCreatedFromGuest:true});
 assert.equal(r.status,'downloaded-existing-account');
 assert.equal(device2._get('user1').coins,10000);
 assert.equal(device2._get('user1').name,'Comandante');

 // C. Local-only changes after synced baseline => upload with optimistic version check.
 let baseline=remote.value.updatedAt;
 device2._set('user1',game(12500));
 s.setItem('marina_empire_cloud_meta_user1',JSON.stringify({updatedAt:baseline,game:game(10000),savedAt:Date.now()}));
 cloud=makeFactory(s)({client:client(remote),localContext:device2});
 r=await cloud.reconcile();
 assert.equal(r.status,'uploaded-local-changes');
 assert.equal(remote.value.game.coins,12500);

 // D. Remote-only change after baseline => download.
 const syncedMeta={updatedAt:remote.value.updatedAt,game:game(12500),savedAt:Date.now()};
 s.setItem('marina_empire_cloud_meta_user1',JSON.stringify(syncedMeta));
 device2._set('user1',game(12500));
 remote.value={game:game(14000),updatedAt:'2026-11-11T07:30:00.000Z'};
 r=await makeFactory(s)({client:client(remote),localContext:device2}).reconcile();
 assert.equal(r.status,'downloaded-remote-changes');
 assert.equal(device2._get('user1').coins,14000);

 // E. Both local and remote changed from same baseline => explicit conflict, no overwrite.
 s.setItem('marina_empire_cloud_meta_user1',JSON.stringify({updatedAt:'baseline',game:game(14000),savedAt:Date.now()}));
 device2._set('user1',game(15000));
 remote.value={game:game(16000),updatedAt:'remote-new'};
 r=await makeFactory(s)({client:client(remote),localContext:device2}).reconcile();
 assert.equal(r.status,'conflict');
 assert.equal(device2._get('user1').coins,15000);
 assert.equal(remote.value.game.coins,16000);

 console.log('PASS: modern cloud sync handles upload, download, and multi-device conflicts safely.');
})().catch(e=>{console.error(e);process.exitCode=1});
