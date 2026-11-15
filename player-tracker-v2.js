(()=>{
"use strict";
if(window.__ME_PLAYER_TRACKER_V2__)return;
window.__ME_PLAYER_TRACKER_V2__=true;
const URL="https://zrdetqvnjmqkfyajxjgp.supabase.co";
const KEY="sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw";
const VISITOR_KEY="marina_empire_visitor_id_v2";
const SESSION_KEY="marina_empire_session_id_v2";
const PLAY_KEY="marina_empire_play_started_v2";
let clientPromise=null,active=false,lastHeartbeat=0;

function uuid(){try{return crypto.randomUUID()}catch(_){return "00000000-0000-4000-8000-"+Math.random().toString(16).slice(2).padEnd(12,"0").slice(0,12)}}
function getId(storage,key){
 try{let v=storage.getItem(key);if(!/^[0-9a-f-]{36}$/i.test(v||"")){v=uuid();storage.setItem(key,v)}return v}catch(_){return uuid()}
}
const visitorId=getId(localStorage,VISITOR_KEY);
const sessionId=getId(sessionStorage,SESSION_KEY);
function acquisition(){
 try{
  const a=JSON.parse(localStorage.getItem("marina_empire_acquisition_v1")||"null")||{};
  return{source:String(a.source||"direct").slice(0,80),medium:String(a.medium||"").slice(0,80),campaign:String(a.campaign||"").slice(0,100)}
 }catch(_){return{source:"direct",medium:"",campaign:""}}
}
function loadSupabase(){
 if(window.supabase?.createClient)return Promise.resolve(window.supabase);
 if(clientPromise)return clientPromise;
 clientPromise=new Promise((resolve,reject)=>{
  const s=document.createElement("script");
  s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.0/dist/umd/supabase.min.js";
  s.onload=()=>window.supabase?.createClient?resolve(window.supabase):reject(new Error("supabase_unavailable"));
  s.onerror=()=>reject(new Error("supabase_unavailable"));
  document.head.appendChild(s);
 });
 return clientPromise;
}
async function client(){
 const lib=await loadSupabase();
 if(!window.__mePlayerTrackerClient)window.__mePlayerTrackerClient=lib.createClient(URL,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 return window.__mePlayerTrackerClient;
}
async function send(eventType){
 if(!["page_view","play_start","mission_complete","heartbeat"].includes(eventType))return false;
 try{
  const c=await client(),a=acquisition();
  const r=await c.from("me_game_events").insert({event_type:eventType,session_id:sessionId,visitor_id:visitorId,source:a.source,medium:a.medium,campaign:a.campaign});
  if(r.error)throw r.error;
  return true;
 }catch(e){console.warn("Marina Empire player tracker",e);return false}
}
function startPlay(){
 if(active)return;
 active=true;
 try{
  if(sessionStorage.getItem(PLAY_KEY)!=="1"){
   sessionStorage.setItem(PLAY_KEY,"1");
   send("play_start");
  }
 }catch(_){send("play_start")}
}
function heartbeat(){
 if(!active||document.hidden)return;
 const now=Date.now();if(now-lastHeartbeat<55000)return;lastHeartbeat=now;send("heartbeat");
}
window.MarinaEmpirePlayerTracker=Object.freeze({track:send,startPlay,visitorId,sessionId});
send("page_view");
["pointerdown","keydown","touchstart"].forEach(name=>window.addEventListener(name,startPlay,{once:true,passive:true}));
setInterval(heartbeat,60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)heartbeat()});
})();