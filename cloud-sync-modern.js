(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory;
 else root.MarinaCloudSync=factory(root.localStorage);
})(typeof window!=="undefined"?window:globalThis,function(storage){
"use strict";
const META_PREFIX="marina_empire_cloud_meta_";
const BACKUP_PREFIX="marina_empire_before_cloud_";
const clone=v=>JSON.parse(JSON.stringify(v));
function validGame(g){return !!(g&&typeof g.name==="string"&&g.name.trim()&&Number.isFinite(Number(g.coins))&&Number(g.coins)>=0)}
function stable(v){
 if(Array.isArray(v))return v.map(stable);
 if(v&&typeof v==="object")return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));
 return v;
}
function sameGame(a,b){try{return JSON.stringify(stable(a))===JSON.stringify(stable(b))}catch(_){return false}}
function metaKey(uid){return META_PREFIX+uid}
function backupKey(uid){return BACKUP_PREFIX+uid}
function readMeta(uid){try{return JSON.parse(storage.getItem(metaKey(uid))||"null")}catch(_){return null}}
function writeMeta(uid,updatedAt,game){try{const raw=JSON.stringify({updatedAt:updatedAt||null,game:clone(game),savedAt:Date.now()});storage.setItem(metaKey(uid),raw);return storage.getItem(metaKey(uid))===raw}catch(_){return false}}
function backupLocal(uid,game){try{const raw=JSON.stringify({savedAt:Date.now(),game:clone(game)});storage.setItem(backupKey(uid),raw);return storage.getItem(backupKey(uid))===raw}catch(_){return false}}
function make({client,localContext}){
 if(!client||!localContext)throw new Error("cloud_dependencies_missing");
 function accountHandle(uid){if(!localContext.select(uid))return null;return localContext.capture()}
 function readLocal(uid){const h=accountHandle(uid);return h?localContext.readGame(h):null}
 function writeLocal(uid,game){const h=accountHandle(uid);return !!(h&&localContext.writeGame(h,game))}
 async function user(){
  const r=await client.auth.getUser();
  const u=r?.data?.user;
  if(r?.error||!u?.id||!u.email_confirmed_at)return null;
  return u;
 }
 async function fetchRemote(uid){
  const r=await client.from("player_progress").select("game_state,updated_at").eq("user_id",uid).maybeSingle();
  if(r.error)throw r.error;
  if(!r.data)return null;
  if(!validGame(r.data.game_state))throw new Error("cloud_invalid_game");
  return {game:r.data.game_state,updatedAt:r.data.updated_at||null};
 }
 async function insertRemote(uid,game){
  const stamp=new Date().toISOString();
  const r=await client.from("player_progress").insert({user_id:uid,game_state:game,updated_at:stamp});
  if(r.error)throw r.error;
  const verify=await fetchRemote(uid);
  if(!verify||!sameGame(verify.game,game))throw new Error("cloud_insert_verify_failed");
  writeMeta(uid,verify.updatedAt,verify.game);
  return verify;
 }
 async function updateRemote(uid,game,previousUpdatedAt){
  const stamp=new Date().toISOString();
  let q=client.from("player_progress").update({game_state:game,updated_at:stamp}).eq("user_id",uid);
  if(previousUpdatedAt)q=q.eq("updated_at",previousUpdatedAt);
  const r=await q.select("user_id").maybeSingle();
  if(r.error)throw r.error;
  if(!r.data)throw new Error("cloud_conflict");
  const verify=await fetchRemote(uid);
  if(!verify||!sameGame(verify.game,game))throw new Error("cloud_update_verify_failed");
  writeMeta(uid,verify.updatedAt,verify.game);
  return verify;
 }
 async function reconcile({localWasCreatedFromGuest=false}={}){
  const u=await user();if(!u)return{ok:false,status:"guest"};
  const local=readLocal(u.id),remote=await fetchRemote(u.id),meta=readMeta(u.id);
  if(!remote){
   if(!validGame(local))return{ok:false,status:"no-local"};
   const saved=await insertRemote(u.id,local);
   return{ok:true,status:"uploaded",game:saved.game,updatedAt:saved.updatedAt};
  }
  if(!validGame(local)){
   if(!backupLocal(u.id,{name:"Comandante",coins:0})){} 
   if(!writeLocal(u.id,remote.game))return{ok:false,status:"local-write-failed"};
   writeMeta(u.id,remote.updatedAt,remote.game);
   return{ok:true,status:"downloaded",game:remote.game,updatedAt:remote.updatedAt};
  }
  if(sameGame(local,remote.game)){
   writeMeta(u.id,remote.updatedAt,remote.game);
   return{ok:true,status:"synced",game:local,updatedAt:remote.updatedAt};
  }
  if(localWasCreatedFromGuest){
   backupLocal(u.id,local);
   if(!writeLocal(u.id,remote.game))return{ok:false,status:"local-write-failed"};
   writeMeta(u.id,remote.updatedAt,remote.game);
   return{ok:true,status:"downloaded-existing-account",game:remote.game,updatedAt:remote.updatedAt};
  }
  if(meta&&meta.updatedAt===remote.updatedAt&&sameGame(meta.game,remote.game)){
   const saved=await updateRemote(u.id,local,remote.updatedAt);
   return{ok:true,status:"uploaded-local-changes",game:saved.game,updatedAt:saved.updatedAt};
  }
  if(meta&&sameGame(meta.game,local)&&!sameGame(meta.game,remote.game)){
   backupLocal(u.id,local);
   if(!writeLocal(u.id,remote.game))return{ok:false,status:"local-write-failed"};
   writeMeta(u.id,remote.updatedAt,remote.game);
   return{ok:true,status:"downloaded-remote-changes",game:remote.game,updatedAt:remote.updatedAt};
  }
  return{ok:false,status:"conflict",local,remote:remote.game,remoteUpdatedAt:remote.updatedAt};
 }
 async function forceUpload(){
  const u=await user();if(!u)return{ok:false,status:"guest"};
  const local=readLocal(u.id);if(!validGame(local))return{ok:false,status:"no-local"};
  const remote=await fetchRemote(u.id);
  if(!remote)return{ok:true,status:"uploaded",...(await insertRemote(u.id,local))};
  backupLocal(u.id,remote.game);
  const saved=await updateRemote(u.id,local,remote.updatedAt);
  return{ok:true,status:"uploaded-forced",game:saved.game,updatedAt:saved.updatedAt};
 }
 async function forceDownload(){
  const u=await user();if(!u)return{ok:false,status:"guest"};
  const remote=await fetchRemote(u.id);if(!remote)return{ok:false,status:"no-remote"};
  const local=readLocal(u.id);if(validGame(local))backupLocal(u.id,local);
  if(!writeLocal(u.id,remote.game))return{ok:false,status:"local-write-failed"};
  writeMeta(u.id,remote.updatedAt,remote.game);
  return{ok:true,status:"downloaded-forced",game:remote.game,updatedAt:remote.updatedAt};
 }
 return Object.freeze({reconcile,forceUpload,forceDownload,fetchRemote,readMeta,sameGame});
}
return make;
});