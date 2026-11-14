(()=>{
"use strict";
if(window.MarinaEmpireCommunityExpansion)return;
const ENDPOINT="https://zrdetqvnjmqkfyajxjgp.supabase.co/functions/v1/marina-community-expansion";
let cache=null,pending=null;
async function load(force=false){
 if(cache&&!force)return cache;
 if(pending&&!force)return pending;
 pending=fetch(ENDPOINT,{cache:"no-store"}).then(async r=>{
   if(!r.ok)throw new Error("expansion_http_"+r.status);
   const data=await r.json();
   if(!data?.ok||!Array.isArray(data.stages))throw new Error("expansion_invalid");
   cache=data;return data;
 }).catch(e=>{console.warn("Marina Empire community expansion",e);return null}).finally(()=>{pending=null});
 return pending;
}
function summary(data){
 if(!data)return null;
 const next=data.nextUnlock;
 return Object.freeze({
  captains:Number(data.captains)||0,
  voyages:Number(data.voyages)||0,
  prestige:Number(data.prestige)||0,
  nextLabel:next?.label||"MONDO",
  remaining:Math.max(0,Number(next?.remaining)||0),
  stages:data.stages||[]
 });
}
function render(el,data){
 if(!el||!data)return false;
 el.innerHTML=(data.stages||[]).map(s=>{
   const cls=s.unlocked?"open":s.id===data.nextUnlock?.id?"next":"locked";
   const title=s.unlocked?(s.label+" sbloccata"):(s.id===data.nextUnlock?.id?("Mancano "+Math.max(0,data.nextUnlock.remaining)+" viaggi community"):"Bloccata");
   return '<div class="'+cls+'" title="'+title.replace(/"/g,"&quot;")+'">'+s.label+'</div>';
 }).join("");
 return true;
}
window.MarinaEmpireCommunityExpansion=Object.freeze({load,summary,render});
})();