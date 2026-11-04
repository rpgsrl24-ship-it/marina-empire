(()=>{
"use strict";
if(window.__ME_PC_MARINA_LIVE_V3__)return;
window.__ME_PC_MARINA_LIVE_V3__=true;

const style=document.createElement("style");
style.id="me-pc-marina-live-v3-style";
style.textContent=`
@media(min-width:900px){
  #mePcLiveButton{display:none!important}
  #meMarinaLiveV3Button{
    display:flex!important;position:fixed!important;left:16px!important;top:176px!important;
    z-index:10060!important;width:96px!important;height:82px!important;min-height:82px!important;
    align-items:center!important;justify-content:center!important;text-align:center!important;
    padding:8px!important;border:1px solid rgba(232,188,102,.88)!important;border-radius:16px!important;
    background:linear-gradient(145deg,#123d51,#082638)!important;color:#ffe2a3!important;
    font-size:11px!important;line-height:1.15!important;font-weight:900!important;letter-spacing:.05em!important;
    box-shadow:0 0 0 1px rgba(232,188,102,.15),0 10px 28px rgba(0,0,0,.38)!important;
    animation:meMarinaLivePulse 1.8s ease-in-out infinite!important;cursor:pointer!important
  }
  #meMarinaLiveV3Button[hidden]{display:none!important}
  #meMarinaLiveV3Panel{
    display:none!important;position:fixed!important;z-index:10070!important;
    top:76px!important;left:132px!important;right:132px!important;bottom:70px!important;
    overflow:hidden!important;border:1px solid rgba(220,181,108,.82)!important;border-radius:18px!important;
    background:rgba(4,24,36,.985)!important;box-shadow:0 28px 80px rgba(0,0,0,.72)!important;
    backdrop-filter:blur(14px)!important
  }
  #meMarinaLiveV3Panel.open{display:grid!important;grid-template-rows:54px minmax(0,1fr)!important}
  #meMarinaLiveV3Head{
    display:flex!important;align-items:center!important;justify-content:space-between!important;
    padding:0 16px!important;border-bottom:1px solid rgba(220,181,108,.38)!important;background:#0b3041!important
  }
  #meMarinaLiveV3Head strong{color:#f3d59d!important;font-size:16px!important;letter-spacing:.04em!important}
  #meMarinaLiveV3Close{width:36px!important;height:36px!important;min-height:36px!important;padding:0!important;border-radius:50%!important;font-size:22px!important}
  #meMarinaLiveV3Body{display:grid!important;grid-template-columns:1.1fr .9fr!important;gap:12px!important;padding:12px!important;min-height:0!important}
  .me-live-v3-card{min-height:0!important;overflow:auto!important;padding:13px!important;border:1px solid rgba(220,181,108,.28)!important;border-radius:13px!important;background:#082633!important}
  .me-live-v3-card h3{margin:0 0 10px!important;color:#f0d29d!important;font-size:15px!important}
  .me-live-v3-list{display:grid!important;gap:8px!important}
  .me-live-v3-item{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:10px!important;align-items:center!important;padding:10px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:10px!important;background:#0a2d3b!important}
  .me-live-v3-item strong{display:block!important;color:#fff!important;font-size:11px!important}
  .me-live-v3-item small{display:block!important;margin-top:3px!important;color:#b9cbd2!important;font-size:9px!important}
  .me-live-v3-item button{min-height:34px!important;padding:6px 9px!important;font-size:9px!important}
  @keyframes meMarinaLivePulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.16);box-shadow:0 0 0 2px rgba(255,218,143,.18),0 0 24px rgba(255,218,143,.24)}}
}
@media(max-width:899px){#meMarinaLiveV3Button,#meMarinaLiveV3Panel{display:none!important}}
`;
document.head.appendChild(style);

function marinaName(){
  try{
    if(typeof port==="function"&&typeof state!=="undefined")return port(state?.port||"rimini")?.name||"Marina";
    return typeof state!=="undefined"&&state?.port?String(state.port):"Marina";
  }catch(_){return"Marina"}
}
function traffic(){try{return window.MarinaEmpireLiveTraffic?.snapshot?.()||null}catch(_){return null}}
function contracts(){try{return window.MarinaEmpireLiveTraffic?.contracts?.()||[]}catch(_){return[]}}
function vhf(){
  try{
    const chain=window.MarinaEmpireEventChains?.current?.();
    if(chain?.stage?.vhf)return chain.stage.vhf;
  }catch(_){}
  const first=traffic()?.items?.[0];
  return first?first.name+" · "+String(first.action||"attività in marina").toLowerCase():"Port Control · traffico regolare";
}
function render(){
  const body=document.getElementById("meMarinaLiveV3Body");
  if(!body)return;
  const t=traffic(),cs=contracts();
  const trafficHtml=(t?.items||[]).slice(0,10).map((v,i)=>
    '<div class="me-live-v3-item"><div><strong>🛥️ '+String(v.name||"Unità")+'</strong><small>'+String(v.action||"Movimento in marina")+(v.berth?' · '+v.berth:'')+(Number(v.eta)>0?' · ETA '+v.eta+' min':'')+'</small></div><button type="button" data-live-v3-traffic="'+i+'">DETTAGLI</button></div>'
  ).join("")||'<div class="me-live-v3-item"><div><strong>⚓ Marina operativa</strong><small>Traffico regolare. Le unità continuano a muoversi nella scena.</small></div></div>';
  const contractsHtml=(cs||[]).slice(0,8).map((x,i)=>
    '<div class="me-live-v3-item"><div><strong>'+(x.icon||"🎯")+' '+String(x.title||"Richiesta")+'</strong><small>'+(x.clientVessel?.name?x.clientVessel.name+' · ':'')+Math.round(Number(x.reward)||0).toLocaleString("it-IT")+' cr</small></div><button type="button" data-live-v3-contract="'+i+'">ACCETTA</button></div>'
  ).join("")||'<div class="me-live-v3-item"><div><strong>Nessuna richiesta urgente</strong><small>Il mondo resta attivo: nuove richieste possono comparire durante il gioco.</small></div></div>';
  body.innerHTML=
    '<section class="me-live-v3-card"><h3>⚓ '+marinaName()+' · TRAFFICO LIVE</h3><div class="me-live-v3-list">'+trafficHtml+'</div></section>'+
    '<section class="me-live-v3-card"><h3>📻 VHF · RICHIESTE</h3><div class="me-live-v3-item"><div><strong>'+vhf()+'</strong><small>Comunicazione attiva dalla marina.</small></div></div><div class="me-live-v3-list" style="margin-top:8px">'+contractsHtml+'</div></section>';
}
function open(){const p=document.getElementById("meMarinaLiveV3Panel");if(!p)return;render();p.classList.add("open")}
function close(){document.getElementById("meMarinaLiveV3Panel")?.classList.remove("open")}
function syncVisibility(){
  const home=document.getElementById("home"),btn=document.getElementById("meMarinaLiveV3Button");
  if(btn)btn.hidden=innerWidth<900||!home||home.classList.contains("hide");
}
function ensure(){
  if(innerWidth<900)return;
  let btn=document.getElementById("meMarinaLiveV3Button");
  if(!btn){
    btn=document.createElement("button");
    btn.id="meMarinaLiveV3Button";
    btn.type="button";
    btn.innerHTML="⚓<br>MARINA<br>LIVE";
    btn.title="Apri Marina Live";
    document.body.appendChild(btn);
  }
  let panel=document.getElementById("meMarinaLiveV3Panel");
  if(!panel){
    panel=document.createElement("section");
    panel.id="meMarinaLiveV3Panel";
    panel.innerHTML='<div id="meMarinaLiveV3Head"><strong>⚓ MARINA LIVE · MONDO VIVO</strong><button type="button" id="meMarinaLiveV3Close" aria-label="Chiudi">×</button></div><div id="meMarinaLiveV3Body"></div>';
    document.body.appendChild(panel);
  }
  if(!btn.dataset.bound){btn.dataset.bound="1";btn.addEventListener("click",open)}
  const closeBtn=document.getElementById("meMarinaLiveV3Close");
  if(closeBtn&&!closeBtn.dataset.bound){closeBtn.dataset.bound="1";closeBtn.addEventListener("click",close)}
  if(!panel.dataset.bound){
    panel.dataset.bound="1";
    panel.addEventListener("click",e=>{
      const cb=e.target.closest("[data-live-v3-contract]");
      if(cb){
        const x=contracts()[Number(cb.dataset.liveV3Contract)];
        const fn=window.MarinaEmpireLiveTraffic?.startContract;
        if(x&&typeof fn==="function"){fn(x.dynamicId);render()}
        return;
      }
      const tb=e.target.closest("[data-live-v3-traffic]");
      if(tb){
        const v=traffic()?.items?.[Number(tb.dataset.liveV3Traffic)];
        if(v)alert(String(v.name||"Unità")+"\n"+String(v.action||"Movimento in marina")+(v.berth?"\n"+v.berth:"")+(Number(v.eta)>0?"\nETA "+v.eta+" min":""));
      }
    });
  }
  syncVisibility();
}
window.MarinaEmpireMarinaLive={open,close,render,ensure};
window.addEventListener("marina-empire-updated",()=>{ensure();render();syncVisibility()});
window.addEventListener("resize",()=>{ensure();syncVisibility()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
document.querySelectorAll(".screen").forEach(s=>new MutationObserver(syncVisibility).observe(s,{attributes:true,attributeFilter:["class"]}));
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensure,{once:true});else ensure();
setTimeout(ensure,500);
setTimeout(ensure,1500);
})();