(()=>{
"use strict";
if(window.__ME_PC_HOME_FINAL_V1__) return;
window.__ME_PC_HOME_FINAL_V1__=true;

const st=document.createElement("style");
st.id="me-pc-home-final-v1-style";
st.textContent=`
@media(min-width:900px){
  #home .game-lux-home{display:block!important;height:100%!important}
  #mePcFinalHome{display:grid!important;grid-template-rows:42px minmax(0,1fr)!important;gap:14px!important;height:100%!important}
  #mePcFinalTicker{display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;align-items:center!important;overflow:hidden!important;border:1px solid rgba(201,164,98,.55)!important;border-radius:11px!important;background:rgba(5,27,40,.95)!important}
  #mePcFinalTicker .label{height:100%!important;display:flex!important;align-items:center!important;padding:0 14px!important;border-right:1px solid rgba(201,164,98,.4)!important;background:#0b3041!important;color:#f0d29d!important;font-size:9px!important;font-weight:900!important;white-space:nowrap!important}
  #mePcFinalTicker .window{overflow:hidden!important;white-space:nowrap!important}
  #mePcFinalTicker .track{display:flex!important;width:max-content!important;animation:meFinalTicker 34s linear infinite!important}
  #mePcFinalTicker .copy{display:flex!important;align-items:center!important;flex-shrink:0!important}
  #mePcFinalTicker .item{padding:0 16px!important;color:#dce8ec!important;font-size:10px!important;font-weight:700!important}
  #mePcFinalTicker .sep{color:#caa96a!important;font-size:8px!important}
  #mePcFinalPanels{display:grid!important;grid-template-columns:1fr 1fr!important;gap:14px!important;min-height:0!important;height:100%!important}
  #mePcCommandPanel,#mePcCareerPanel{min-width:0!important;min-height:0!important;height:100%!important;border:1px solid rgba(201,164,98,.55)!important;border-radius:16px!important;background:rgba(5,27,40,.96)!important;overflow:hidden!important;box-shadow:0 14px 30px rgba(0,0,0,.35)!important}
  #mePcCommandPanel{display:grid!important;grid-template-rows:46px minmax(0,1fr)!important}
  #mePcCommandTitle{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:0 16px!important;border-bottom:1px solid rgba(201,164,98,.35)!important;background:#0b3041!important;color:#f2d59a!important}
  #mePcCommandTitle strong{font-size:16px!important;letter-spacing:.05em!important}
  #mePcCommandTitle span{font-size:9px!important;color:#b9cbd2!important}
  #mePcCommandBody{min-height:0!important;position:relative!important;overflow:hidden!important}
  #mePcCommandBody .hero{width:100%!important;max-width:none!important;height:100%!important;min-height:0!important;max-height:none!important;margin:0!important;border:0!important;border-radius:0!important;aspect-ratio:auto!important}
  #mePcCommandBody .me-live-home-loc,#mePcCommandBody .me-live-home-vhf,#mePcCommandBody .me-live-home-traffic,#mePcCommandBody .me-live-home-contract{display:none!important}
  #mePcCareerPanel{overflow:auto!important}
  #mePcCareerPanel #meLongTermCareer{display:block!important;width:100%!important;height:100%!important;margin:0!important;border:0!important;border-radius:0!important}
  #home>.me-command-bottom,.me-command-bottom{z-index:9997!important}
  @keyframes meFinalTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
}
`;
document.head.appendChild(st);

function marinaName(){
 try{return typeof port==="function"?(port(state?.port||"rimini")?.name||"Rimini"):String(state?.port||"Rimini")}catch(_){return"Rimini"}
}
function traffic(){
 try{return window.MarinaEmpireLiveTraffic?.snapshot?.()||null}catch(_){return null}
}
function contracts(){
 try{return window.MarinaEmpireLiveTraffic?.contracts?.()||[]}catch(_){return[]}
}
function vhf(){
 try{
   const chain=window.MarinaEmpireEventChains?.current?.();
   if(chain?.stage?.vhf)return chain.stage.vhf;
 }catch(_){}
 const t=traffic(), first=t?.items?.[0];
 return first?first.name+" · "+String(first.action||"attività in marina").toLowerCase():"Port Control · traffico regolare";
}
function tickerHtml(){
 const t=traffic(), items=[];
 items.push("📍 "+marinaName()+" · "+(state?.trip?"IN NAVIGAZIONE":"MONDO VIVO"));
 items.push("📻 VHF · "+vhf());
 (t?.items||[]).slice(0,5).forEach(v=>items.push("🛥️ "+v.name+" · "+v.action+(v.berth?" · "+v.berth:"")+(v.eta>0?" · "+v.eta+" min":"")));
 const cs=contracts();
 if(cs[0])items.push("🎯 "+cs[0].title+(cs[0].clientVessel?.name?" · "+cs[0].clientVessel.name:"")+" · "+Math.round(cs[0].reward).toLocaleString("it-IT")+" cr");
 const html=items.map(x=>'<span class="item">'+x+'</span><span class="sep">◆</span>').join("");
 return '<div class="copy">'+html+'</div><div class="copy" aria-hidden="true">'+html+'</div>';
}
function build(){
 if(innerWidth<900)return;
 const home=document.querySelector("#home .game-lux-home");
 const hero=home?.querySelector(".hero");
 const career=document.getElementById("meLongTermCareer");
 if(!home||!hero||!career)return false;

 let final=document.getElementById("mePcFinalHome");
 if(!final){
   final=document.createElement("div");
   final.id="mePcFinalHome";
   final.innerHTML='<div id="mePcFinalTicker"><div class="label">⚓ MARINA LIVE</div><div class="window"><div class="track" id="mePcFinalTickerTrack"></div></div></div><div id="mePcFinalPanels"><section id="mePcCommandPanel"><div id="mePcCommandTitle"><strong>🧭 PLANCIA DI COMANDO</strong><span>MARINA EMPIRE</span></div><div id="mePcCommandBody"></div></section><section id="mePcCareerPanel"></section></div>';
   home.innerHTML="";
   home.appendChild(final);
 }
 document.getElementById("mePcCommandBody")?.appendChild(hero);
 document.getElementById("mePcCareerPanel")?.appendChild(career);
 const track=document.getElementById("mePcFinalTickerTrack");
 if(track)track.innerHTML=tickerHtml();
 return true;
}
function boot(){
 if(build()) return;
 const mo=new MutationObserver(()=>{if(build())mo.disconnect()});
 mo.observe(document.body,{childList:true,subtree:true});
 setTimeout(build,500);
 setTimeout(build,1500);
}
window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{build();const t=document.getElementById("mePcFinalTickerTrack");if(t)t.innerHTML=tickerHtml()},50));
window.addEventListener("resize",build);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();