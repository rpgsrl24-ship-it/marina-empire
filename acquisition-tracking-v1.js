(()=>{
"use strict";
if(window.__ME_ACQUISITION_TRACKING_V1__)return;
window.__ME_ACQUISITION_TRACKING_V1__=true;
const KEY="marina_empire_acquisition_v1";
function clean(v,n=80){return String(v||"").trim().slice(0,n)}
function readParams(){
 const q=new URLSearchParams(location.search);
 return {
  source:clean(q.get("utm_source")||q.get("source")||"direct"),
  medium:clean(q.get("utm_medium")||""),
  campaign:clean(q.get("utm_campaign")||""),
  content:clean(q.get("utm_content")||""),
  term:clean(q.get("utm_term")||""),
  landing:clean(location.pathname+location.search,300),
  firstSeenAt:Date.now()
 };
}
function existing(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(_){return null}}
function save(){
 let a=existing();
 if(!a){
  a=readParams();
  try{localStorage.setItem(KEY,JSON.stringify(a))}catch(_){}
 }
 window.MarinaEmpireAcquisition={...(window.MarinaEmpireAcquisition||{}),get:()=>({...a})};
 return a;
}
function attachToState(){
 try{
  if(typeof state==="undefined"||!state?.name)return;
  const a=existing()||save();
  if(state.acquisition&&state.acquisition.source)return;
  if(typeof meAtomicPersist==="function"){
   meAtomicPersist(()=>{state.acquisition={...a}});
  }else state.acquisition={...a};
 }catch(_){}
}
function track(name,extra={}){
 const a=existing()||save();
 const payload={event:name,source:a.source,medium:a.medium,campaign:a.campaign,content:a.content,...extra};
 try{
  if(typeof gtag==="function")gtag("event",name,{utm_source:a.source,utm_medium:a.medium,utm_campaign:a.campaign,utm_content:a.content,...extra});
 }catch(_){}
 try{
  window.MarinaEmpireTraffic?.track?.(name,payload);
 }catch(_){}
}
const a=save();
window.MarinaEmpireAcquisition={
 get:()=>({...a}),
 track,
 link(base,content=""){
  const u=new URL(base,location.origin);
  u.searchParams.set("utm_source","meta");
  u.searchParams.set("utm_medium","paid_social");
  u.searchParams.set("utm_campaign","marina_empire_launch");
  if(content)u.searchParams.set("utm_content",clean(content));
  return u.toString();
 }
};
function boot(){
 attachToState();
 track("acquisition_session_start");
 window.addEventListener("marina-empire-updated",attachToState);
 document.addEventListener("click",e=>{
  if(e.target.closest("[data-mission]"))track("acquisition_mission_click");
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();