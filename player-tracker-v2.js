(()=>{
"use strict";
if(window.__ME_PLAYER_TRACKER_V2__)return;
window.__ME_PLAYER_TRACKER_V2__=true;
const URL="https://zrdetqvnjmqkfyajxjgp.supabase.co";
const KEY="sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw";
const VISITOR_KEY="marina_empire_visitor_id_v2";
const SESSION_KEY="marina_empire_session_id_v2";
const PLAY_KEY="marina_empire_play_started_v2";
let clientPromise=null,active=false,lastHeartbeat=0,playPending=false;
const stages=new Set();

function uuid(){try{return crypto.randomUUID()}catch(_){return "00000000-0000-4000-8000-"+Math.random().toString(16).slice(2).padEnd(12,"0").slice(0,12)}}
function getId(storage,key){
 try{let v=storage.getItem(key);if(!/^[0-9a-f-]{36}$/i.test(v||"")){v=uuid();storage.setItem(key,v)}return v}catch(_){return uuid()}
}
// Optional analytics: no tracking or identifiers before explicit permission.
const CONSENT="marina_empire_analytics_choice_v1",ATTR="marina_empire_analytics_attribution_v2";
const choice=()=>{try{return localStorage.getItem(CONSENT)||""}catch(_){return ""}};
let visitorId=null,sessionId=null;
function allowed(){return choice()==="yes"}
function initIds(){if(!allowed())return false;visitorId=visitorId||getId(localStorage,VISITOR_KEY);sessionId=sessionId||getId(sessionStorage,SESSION_KEY);return true}
function clean(v,n=80){const s=String(v||"").trim();return /^[a-zA-Z0-9_. -]+$/.test(s)?s.slice(0,n):""}
function captureAttribution(){
 if(!allowed())return;
 try{const q=new URLSearchParams(location.search),source=clean(q.get("utm_source")),medium=clean(q.get("utm_medium")),campaign=clean(q.get("utm_campaign"),100);
 if(source)localStorage.setItem(ATTR,JSON.stringify({source,medium,campaign}));
 }catch(_){}
}
function eraseAnalytics(){
 try{[VISITOR_KEY,ATTR,"marina_empire_acquisition_v1"].forEach(k=>localStorage.removeItem(k));
 for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k?.startsWith("marina_empire_reported_voyage_v1_"))localStorage.removeItem(k)}
 [SESSION_KEY,PLAY_KEY].forEach(k=>sessionStorage.removeItem(k));
 for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i);if(k?.startsWith("me_stage_"))sessionStorage.removeItem(k)}
 }catch(_){}
 visitorId=sessionId=null;active=false;stages.clear();
}
if(allowed()){initIds();captureAttribution()}else eraseAnalytics();
function acquisition(){
 try{
  const a=JSON.parse(localStorage.getItem(ATTR)||"null")||{};
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
 if(!allowed()||!["page_view","play_start","mission_complete","heartbeat","mission_selected","mission_started","navigation_reached","docking_reached","mission_start_failed","registration_opened","registration_submitted","account_verified"].includes(eventType)||!initIds())return false;
 try{
  const c=await client();if(!allowed())return false;const a=acquisition();
  const r=await c.from("me_game_events").insert({event_type:eventType,session_id:sessionId,visitor_id:visitorId,source:a.source,medium:a.medium,campaign:a.campaign});
  if(r.error)throw r.error;
  return true;
 }catch(e){console.warn("Marina Empire player tracker",e);return false}
}
async function startPlay(){
 if(!allowed())return false;
 active=true;
 let done=false;
 try{done=sessionStorage.getItem(PLAY_KEY)==="1"}catch(_){}
 if(done||playPending)return true;
 playPending=true;
 const ok=await send("play_start");
 playPending=false;
 if(ok&&allowed()){try{sessionStorage.setItem(PLAY_KEY,"1")}catch(_){}}
 return ok;
}
const completionPending=new Set();
async function completeVoyage(voyageId){
 if(!allowed()||!initIds())return false;
 const id=String(voyageId||"").trim();
 if(!id||id==="0")return false;
 const key="marina_empire_reported_voyage_v1_"+visitorId+"_"+id;
 try{if(localStorage.getItem(key)==="1")return true}catch(_){}
 if(completionPending.has(key))return false;
 completionPending.add(key);
 try{
  const ok=await send("mission_complete");
  if(ok&&allowed()){try{localStorage.setItem(key,"1")}catch(_){}}
  return ok;
 }finally{completionPending.delete(key)}
}
function heartbeat(){
 if(!allowed()||!active||document.hidden)return;
 const now=Date.now();if(now-lastHeartbeat<55000)return;lastHeartbeat=now;send("heartbeat");
}
async function stage(event,key="session"){
 if(!allowed())return false;
 const k=event+"|"+String(key);if(stages.has(k))return true;
 try{if(sessionStorage.getItem("me_stage_"+k)==="1")return true}catch(_){}
 stages.add(k);const ok=await send(event);
 if(ok&&allowed()){try{sessionStorage.setItem("me_stage_"+k,"1")}catch(_){}}else stages.delete(k);
 return ok;
}
window.MarinaEmpirePlayerTracker=Object.freeze({track:send,stage,startPlay,completeVoyage,get visitorId(){return visitorId},get sessionId(){return sessionId}});
function preferences(){
 const old=document.getElementById("meAnalyticsChoice");if(old){old.remove();return}
 const box=document.createElement("section");box.id="meAnalyticsChoice";box.setAttribute("aria-label","Preferenze statistiche");
 box.style.cssText="position:fixed;z-index:10001;bottom:76px;left:12px;right:12px;max-width:440px;margin:auto;padding:12px;background:#fff;color:#123e59;border:1px solid #8eb8ca;border-radius:12px;box-shadow:0 3px 16px #0004;font:13px system-ui";
 box.innerHTML='<strong>Statistiche facoltative</strong><p>Aiutaci a migliorare il gioco: possiamo misurare le fasi delle missioni e i ritorni tramite un codice casuale del browser. Puoi rifiutare senza perdere funzionalità. <a href="./privacy.html">Privacy</a></p><div style="display:flex;gap:8px"><button type="button" data-choice="no" style="flex:1;padding:9px">NO, GRAZIE</button><button type="button" data-choice="yes" style="flex:1;padding:9px">ACCETTO</button></div>';
 box.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{try{localStorage.setItem(CONSENT,b.dataset.choice)}catch(_){}box.remove();if(allowed()){initIds();captureAttribution();send("page_view");}else eraseAnalytics()});
 document.body.appendChild(box);
}
const control=document.createElement("button");control.id="meAnalyticsControl";control.type="button";control.textContent="Privacy e statistiche";control.style.cssText="display:block;margin:8px auto;padding:6px;border:0;background:transparent;color:inherit;font:11px system-ui;text-decoration:underline";control.onclick=preferences;(document.querySelector("main")||document.body).appendChild(control);
if(!choice()&&/mobile-home\.html$/.test(location.pathname))preferences();
if(allowed())send("page_view");
// Consent controls are not gameplay. The first actual interaction starts a session.
function gameplayInteraction(event){
 if(event.target?.closest?.("#meAnalyticsChoice,#meAnalyticsControl"))return;
 if(allowed())startPlay();
}
["pointerdown","keydown","touchstart"].forEach(name=>window.addEventListener(name,gameplayInteraction,{passive:true}));
window.addEventListener("storage",event=>{if(event.key===CONSENT&&!allowed())eraseAnalytics()});
setInterval(heartbeat,60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)heartbeat()});
})();