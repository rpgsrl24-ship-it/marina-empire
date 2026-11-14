(function(){
"use strict";
const URL="https://zrdetqvnjmqkfyajxjgp.supabase.co";
const KEY="sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw";
let clientPromise=null,claimBusy=false;

function validGame(g){
 return !!(g&&typeof g.name==="string"&&g.name.trim()&&Number.isFinite(Number(g.coins))&&Number(g.coins)>=0);
}
function normalized(g){
 if(!g||typeof g!=="object")return null;
 const copy=JSON.parse(JSON.stringify(g));
 delete copy.lastArrival;
 delete copy.lastDockedBridge;
 return copy;
}
function sameGameState(a,b){
 try{return JSON.stringify(normalized(a))===JSON.stringify(normalized(b))}catch(_){return false}
}
function loadSupabase(){
 if(window.supabase?.createClient)return Promise.resolve(window.supabase);
 if(clientPromise)return clientPromise;
 clientPromise=new Promise((resolve,reject)=>{
   const s=document.createElement("script");
   s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.95.0/dist/umd/supabase.min.js";
   s.onload=()=>window.supabase?.createClient?resolve(window.supabase):reject(new Error("supabase_unavailable"));
   s.onerror=()=>reject(new Error("supabase_unavailable"));
   document.head.appendChild(s);
 });
 return clientPromise;
}
async function getClient(){
 const lib=await loadSupabase();
 if(!window.__meCreditGuardClient){
  window.__meCreditGuardClient=lib.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 }
 return window.__meCreditGuardClient;
}
function localContext(){
 const c=window.MarinaLocalSaveContext;
 if(!c)return null;
 const h=c.capture();
 const g=h&&c.readGame(h);
 return h&&g?{c,h,g}:null;
}
async function verifiedUser(c){
 const {data,error}=await c.auth.getUser();
 if(error||!data?.user?.id||!data.user.email_confirmed_at)return null;
 return data.user;
}
window.meCreditCheckoutReady=async function(){
 try{
  const local=localContext();
  if(!local||local.h.accountId===null||!validGame(local.g))return false;
  const c=await getClient(),user=await verifiedUser(c);
  if(!user||user.id!==local.h.accountId)return false;
  const snapshot=JSON.parse(JSON.stringify(local.g));
  const remote=await c.from("player_progress").select("game_state,updated_at").eq("user_id",user.id).maybeSingle();
  if(remote.error)throw remote.error;
  if(!remote.data){
   const profile=await c.from("player_profiles").upsert({user_id:user.id,captain_name:(snapshot.name||"Comandante").slice(0,32),updated_at:new Date().toISOString()},{onConflict:"user_id"});
   if(profile.error)throw profile.error;
   const saved=await c.from("player_progress").insert({user_id:user.id,game_state:snapshot,updated_at:new Date().toISOString()});
   if(saved.error)throw saved.error;
   return true;
  }
  if(!validGame(remote.data.game_state))return false;
  if(!sameGameState(remote.data.game_state,snapshot)){
   const saved=await c.from("player_progress").update({game_state:snapshot,updated_at:new Date().toISOString()}).eq("user_id",user.id);
   if(saved.error)throw saved.error;
  }
  return true;
 }catch(e){
  console.warn("Marina Empire credit sync guard",e);
  return false;
 }
};

async function claimPurchasedCreditsAfterReturn(forceCheck=false){
 if(claimBusy)return false;
 const url=new URL(location.href);
 if(!forceCheck&&url.searchParams.get("credit_purchase")!=="success")return false;
 claimBusy=true;
 try{
  const local=localContext();
  if(!local||local.h.accountId===null)return false;
  const c=await getClient(),user=await verifiedUser(c);
  if(!user||user.id!==local.h.accountId)return false;
  for(let attempt=0;attempt<8;attempt++){
   const result=await c.functions.invoke("marina-claim-purchased-credits",{body:{}});
   if(result.error)throw result.error;
   const data=result.data||{};
   if(data.result==="merged"&&validGame(data.game_state)){
    localStorage.setItem("marina_empire_before_credit_merge",JSON.stringify({savedAt:Date.now(),accountId:user.id,game:local.g}));
    if(!local.c.writeGame(local.h,data.game_state))throw new Error("local_merge_failed");
    url.searchParams.delete("credit_purchase");
    history.replaceState(null,"",url.pathname+(url.search||"")+url.hash);
    window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{source:"credit-merge",credits:Number(data.credits||0)}}));
    return true;
   }
   if(data.result==="nothing"&&attempt<7){await new Promise(r=>setTimeout(r,2500));continue;}
   return false;
  }
  return false;
 }catch(e){
  console.warn("Marina Empire credit claim guard",e);
  return false;
 }finally{claimBusy=false;}
}
window.meClaimPurchasedCreditsAfterReturn=claimPurchasedCreditsAfterReturn;
if(new URL(location.href).searchParams.get("credit_purchase")==="success"){
 setTimeout(()=>claimPurchasedCreditsAfterReturn(false),300);
}
})();