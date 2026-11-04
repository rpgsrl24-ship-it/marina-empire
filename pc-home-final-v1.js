(()=>{
"use strict";
if(window.__ME_PC_HOME_FINAL_V1__) return;
window.__ME_PC_HOME_FINAL_V1__=true;

const st=document.createElement("style");
st.id="me-pc-home-final-v1-style";
st.textContent=`
@media(min-width:900px){
  #home .game-lux-home{display:block!important;height:100%!important}
  #mePcFinalHome{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:52px minmax(0,1fr)!important;gap:14px!important;height:100%!important}
  #mePcLiveButton{display:flex!important;align-items:center!important;justify-content:center!important;pointer-events:auto!important;position:fixed!important;left:18px!important;top:214px!important;width:96px!important;height:96px!important;z-index:10001!important;border:1px solid rgba(232,188,102,.82)!important;border-radius:18px!important;background:linear-gradient(135deg,#133c50,#0b3041)!important;color:#ffe2a3!important;font-size:11px!important;line-height:1.15!important;text-align:center!important;font-weight:900!important;letter-spacing:.04em!important;cursor:pointer!important;box-shadow:0 0 0 1px rgba(232,188,102,.18),0 0 24px rgba(232,188,102,.18)!important;animation:meLivePulse 1.5s ease-in-out infinite!important}
  #mePcFinalTicker{grid-column:1!important;grid-row:1!important;display:block!important;align-items:center!important;overflow:hidden!important;pointer-events:auto!important;position:relative!important;z-index:10000!important;border:1px solid rgba(232,188,102,.55)!important;border-radius:13px!important;background:rgba(5,27,40,.98)!important;box-shadow:0 0 0 1px rgba(232,188,102,.10)!important}
  #mePcFinalTicker .label{display:none!important}
  #mePcFinalTicker .window{height:100%!important;display:flex!important;align-items:center!important;overflow:hidden!important;white-space:nowrap!important}
  #mePcFinalTicker .track{display:flex!important;align-items:center!important;width:max-content!important;min-width:max-content!important;animation:meFinalTicker 28s linear infinite!important}
  #mePcFinalTicker .copy{display:flex!important;align-items:center!important;flex-shrink:0!important;visibility:visible!important;opacity:1!important}
  #mePcFinalTicker .item{display:inline-flex!important;align-items:center!important;padding:0 18px!important;pointer-events:auto!important;color:#dce8ec!important;font-size:10px!important;font-weight:700!important;cursor:pointer!important}
  #mePcFinalTicker .sep{color:#caa96a!important;font-size:8px!important}
  #mePcFinalPanels{grid-column:1!important;grid-row:2!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:14px!important;min-height:0!important;height:100%!important}
  #mePcCommandPanel,#mePcCareerPanel{min-width:0!important;min-height:0!important;height:100%!important;border:1px solid rgba(201,164,98,.55)!important;border-radius:16px!important;background:rgba(5,27,40,.96)!important;overflow:hidden!important;box-shadow:0 14px 30px rgba(0,0,0,.35)!important}
  #mePcCommandPanel{display:grid!important;grid-template-rows:46px minmax(0,1fr)!important 50px!important}
  #mePcCommandTitle{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:0 16px!important;border-bottom:1px solid rgba(201,164,98,.35)!important;background:#0b3041!important;color:#f2d59a!important}
  #mePcCommandTitle strong{font-size:16px!important;letter-spacing:.05em!important}
  #mePcCommandTitle span{font-size:9px!important;color:#b9cbd2!important}
  #mePcCommandBody{min-height:0!important;position:relative!important;overflow:hidden!important;background:#062838!important}
  #mePcMarinaFrame{width:100%!important;height:100%!important;border:0!important;display:block!important;background:#062838!important}
  #mePcMarinaControls{display:grid!important;grid-template-columns:46px minmax(0,1fr) 46px auto!important;gap:8px!important;align-items:center!important;padding:6px 8px!important;border-top:1px solid rgba(201,164,98,.35)!important;background:#0b3041!important}
  #mePcMarinaControls button{height:36px!important;min-height:36px!important;padding:6px 10px!important;font-size:10px!important}
  #mePcMarinaName{text-align:center!important;color:#f1d292!important;font-size:12px!important;font-weight:900!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  #mePcEnterMarina{padding:6px 14px!important}

  #mePcCareerPanel{overflow:auto!important}
  #mePcCareerPanel #meLongTermCareer{display:block!important;width:100%!important;height:100%!important;margin:0!important;border:0!important;border-radius:0!important}
  #home>.me-command-bottom,.me-command-bottom{z-index:9997!important}
  #meWorldLivePanel{display:none!important;position:absolute!important;pointer-events:auto!important;inset:56px 5% 34px!important;z-index:9998!important;border:1px solid rgba(201,164,98,.75)!important;border-radius:16px!important;background:rgba(4,22,34,.98)!important;box-shadow:0 22px 60px rgba(0,0,0,.62)!important;overflow:hidden!important}
  #meWorldLivePanel.open{display:grid!important;grid-template-rows:auto minmax(0,1fr)!important}
  #meWorldLiveHead{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:12px 16px!important;border-bottom:1px solid rgba(201,164,98,.38)!important;background:#0b3041!important}
  #meWorldLiveHead strong{color:#f0d29d!important;font-size:16px!important}
  #meWorldLiveHead button{width:34px!important;height:34px!important;min-height:34px!important;padding:0!important;border-radius:50%!important}
  #meWorldLiveBody{display:grid!important;grid-template-columns:1.1fr .9fr!important;gap:12px!important;padding:12px!important;min-height:0!important;overflow:hidden!important}
  .me-world-card{border:1px solid rgba(201,164,98,.28)!important;border-radius:12px!important;background:#082633!important;padding:12px!important;overflow:auto!important}
  .me-world-card h3{margin:0 0 10px!important;color:#f0d29d!important}
  .me-world-list{display:grid!important;gap:8px!important}
  .me-world-item{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:10px!important;align-items:center!important;padding:9px 10px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:10px!important;background:#0a2d3b!important}
  .me-world-item strong{display:block!important;color:#fff!important;font-size:11px!important}
  .me-world-item small{display:block!important;margin-top:3px!important;color:#b9cbd2!important;font-size:9px!important}
  .me-world-item button{min-height:36px!important;padding:7px 10px!important;font-size:9px!important}
  @keyframes meFinalTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes meLivePulse{0%,100%{box-shadow:inset 0 0 0 0 rgba(255,218,143,0),0 0 0 rgba(255,218,143,0);filter:brightness(1)}50%{box-shadow:inset 0 0 0 2px rgba(255,218,143,.28),0 0 18px rgba(255,218,143,.30);filter:brightness(1.18)}}
}
`;
document.head.appendChild(st);

const HOME_MARINAS=[
 {id:"rimini",name:"Marina di Rimini"},
 {id:"cervia",name:"Marina di Cervia"},
 {id:"ravenna",name:"Marina di Ravenna"},
 {id:"ancona",name:"Marina di Ancona"},
 {id:"pescara",name:"Marina di Pescara"},
 {id:"bari",name:"Marina di Bari"},
 {id:"brindisi",name:"Marina di Brindisi"},
 {id:"salerno",name:"Marina di Salerno"},
 {id:"nettuno",name:"Marina di Nettuno"},
 {id:"scarlino",name:"Marina di Scarlino"},
 {id:"loano",name:"Marina di Loano"},
 {id:"portocervo",name:"Porto Cervo"},
 {id:"lignano",name:"Marina di Lignano"}
];
let homeMarinaIndex=0;
function currentHomeMarina(){
 const id=String(state?.port||"rimini");
 const idx=HOME_MARINAS.findIndex(x=>x.id===id);
 if(idx>=0&&document.getElementById("mePcMarinaFrame")?.dataset.userSelected!=="1")homeMarinaIndex=idx;
 return HOME_MARINAS[homeMarinaIndex]||HOME_MARINAS[0];
}
function updateHomeMarina(force=false){
 const frame=document.getElementById("mePcMarinaFrame"), label=document.getElementById("mePcMarinaName");
 if(!frame)return;
 const m=currentHomeMarina();
 const src="./marine-deluxe-originali.html?marina="+encodeURIComponent(m.id)+"&home=1";
 if(force||!frame.src.includes("marina="+encodeURIComponent(m.id)))frame.src=src;
 if(label)label.textContent="⚓ "+m.name;
}
function shiftHomeMarina(dir){
 homeMarinaIndex=(homeMarinaIndex+dir+HOME_MARINAS.length)%HOME_MARINAS.length;
 const frame=document.getElementById("mePcMarinaFrame");
 if(frame)frame.dataset.userSelected="1";
 updateHomeMarina(true);
}
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
 items.push({type:"world",text:"📍 "+marinaName()+" · "+(state?.trip?"IN NAVIGAZIONE":"MONDO VIVO")});
 items.push({type:"vhf",text:"📻 VHF · "+vhf()});
 (t?.items||[]).slice(0,5).forEach((v,i)=>items.push({type:"traffic",index:i,text:"🛥️ "+v.name+" · "+v.action+(v.berth?" · "+v.berth:"")+(v.eta>0?" · "+v.eta+" min":"")}));
 const cs=contracts();
 if(cs[0])items.push({type:"contract",index:0,text:"🎯 "+cs[0].title+(cs[0].clientVessel?.name?" · "+cs[0].clientVessel.name:"")+" · "+Math.round(cs[0].reward).toLocaleString("it-IT")+" cr"});
 const html=items.map(x=>'<span class="item" data-live-type="'+x.type+'"'+(x.index!==undefined?' data-live-index="'+x.index+'"':'')+'>'+x.text+'</span><span class="sep">◆</span>').join("");
 return '<div class="copy">'+html+'</div><div class="copy" aria-hidden="true">'+html+'</div>';
}
function worldPanelHtml(){
 const t=traffic(), cs=contracts();
 const trafficHtml=(t?.items||[]).slice(0,8).map((v,i)=>'<div class="me-world-item"><div><strong>🛥️ '+v.name+'</strong><small>'+v.action+(v.berth?' · '+v.berth:'')+(v.eta>0?' · ETA '+v.eta+' min':'')+'</small></div><button type="button" data-world-traffic="'+i+'">DETTAGLI</button></div>').join("")||'<div class="me-world-item"><div><strong>Nessun traffico rilevante</strong><small>La marina è operativa.</small></div></div>';
 const contractHtml=(cs||[]).slice(0,6).map((x,i)=>'<div class="me-world-item"><div><strong>'+x.icon+' '+x.title+'</strong><small>'+(x.clientVessel?.name?x.clientVessel.name+' · ':'')+Math.round(x.reward).toLocaleString("it-IT")+' cr</small></div><button type="button" data-world-contract="'+i+'">ACCETTA</button></div>').join("")||'<div class="me-world-item"><div><strong>Nessuna richiesta urgente</strong><small>Controlla di nuovo tra poco.</small></div></div>';
 return '<div class="me-world-card"><h3>MONDO VIVO · '+marinaName()+'</h3><div class="me-world-list">'+trafficHtml+'</div></div><div class="me-world-card"><h3>VHF E RICHIESTE</h3><div class="me-world-item"><div><strong>📻 '+vhf()+'</strong><small>Comunicazione attiva dalla marina.</small></div></div><div class="me-world-list" style="margin-top:8px">'+contractHtml+'</div></div>';
}
function openWorld(){
 let panel=document.getElementById("meWorldLivePanel");
 if(!panel)return;
 const body=document.getElementById("meWorldLiveBody");
 if(body)body.innerHTML=worldPanelHtml();
 panel.classList.add("open");
}
function closeWorld(){document.getElementById("meWorldLivePanel")?.classList.remove("open")}
function bindWorldActions(){
 const ticker=document.getElementById("mePcFinalTicker");
 const liveButton=document.getElementById("mePcLiveButton");
 if(liveButton){
   liveButton.onclick=e=>{e.preventDefault();e.stopPropagation();openWorld();};
 }
 ticker?.querySelectorAll(".item").forEach(item=>{
   item.onclick=e=>{e.preventDefault();e.stopPropagation();openWorld();};
 });
 const panel=document.getElementById("meWorldLivePanel");
 if(panel&&!panel.dataset.bound){
   panel.dataset.bound="1";
   panel.addEventListener("click",e=>{
     if(e.target.closest("#meWorldLiveClose")){closeWorld();return}
     const cb=e.target.closest("[data-world-contract]");
     if(cb){
       const cs=contracts(); const x=cs[Number(cb.dataset.worldContract)];
       const fn=window.MarinaEmpireLiveTraffic?.startContract;
       if(x&&typeof fn==="function"){fn(x.dynamicId);openWorld();}
       return;
     }
     const tb=e.target.closest("[data-world-traffic]");
     if(tb){
       const t=traffic(),v=t?.items?.[Number(tb.dataset.worldTraffic)];
       if(v)alert(v.name+"\n"+v.action+(v.berth?"\n"+v.berth:"")+(v.eta>0?"\nETA "+v.eta+" min":""));
     }
   });
 }
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
   final.innerHTML='<button type="button" id="mePcLiveButton">⚓<br>MARINA<br>LIVE</button><div id="mePcFinalTicker"><div class="window"><div class="track" id="mePcFinalTickerTrack"></div></div></div><div id="mePcFinalPanels"><section id="mePcCommandPanel"><div id="mePcCommandTitle"><strong>⚓ MARINA ATTUALE</strong><span>MONDO VIVO</span></div><div id="mePcCommandBody"><iframe id="mePcMarinaFrame" title="Marina viva selezionata" loading="eager"></iframe></div><div id="mePcMarinaControls"><button type="button" id="mePcMarinaPrev">‹</button><div id="mePcMarinaName">Marina</div><button type="button" id="mePcMarinaNext">›</button><button type="button" id="mePcEnterMarina">ENTRA NELLA MARINA</button></div></section><section id="mePcCareerPanel"></section></div><section id="meWorldLivePanel"><div id="meWorldLiveHead"><strong>⚓ MONDO VIVO · CENTRALE OPERATIVA</strong><button type="button" id="meWorldLiveClose">×</button></div><div id="meWorldLiveBody"></div></section>';
   home.innerHTML="";
   home.appendChild(final);
 }
 hero.remove();
 updateHomeMarina();
 const prev=document.getElementById("mePcMarinaPrev"), next=document.getElementById("mePcMarinaNext"), enter=document.getElementById("mePcEnterMarina");
 if(prev&&!prev.dataset.bound){prev.dataset.bound="1";prev.onclick=()=>shiftHomeMarina(-1);}
 if(next&&!next.dataset.bound){next.dataset.bound="1";next.onclick=()=>shiftHomeMarina(1);}
 if(enter&&!enter.dataset.bound){enter.dataset.bound="1";enter.onclick=()=>{const m=currentHomeMarina();location.href="./marine-deluxe-originali.html?marina="+encodeURIComponent(m.id);};}
 document.getElementById("mePcCareerPanel")?.appendChild(career);
 const track=document.getElementById("mePcFinalTickerTrack");
 if(track)track.innerHTML=tickerHtml();
 bindWorldActions();
 const liveButton=document.getElementById("mePcLiveButton");
 if(liveButton){liveButton.title="Apri Mondo Vivo";}
 document.querySelectorAll("#mePcFinalTicker .item").forEach(el=>{el.setAttribute("role","button");el.setAttribute("tabindex","0");});

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