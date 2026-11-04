(()=>{
"use strict";
if(window.__ME_LIVE_HOME_WORLD__)return;
window.__ME_LIVE_HOME_WORLD__=true;

const style=document.createElement("style");
style.id="me-live-home-world-style";
style.textContent=`
.me-live-home-overlay{display:none}
@media(max-width:899px){
  #home .hero{position:relative!important;overflow:hidden!important}
  #home .hero-copy{display:none!important}
  #home .me-home-vessel{display:none!important}
  #home .me-home-status{display:none!important}
  .me-live-home-overlay{display:block;position:absolute;inset:0;z-index:5;pointer-events:none}
  .me-live-home-loc{
    position:absolute;left:12px;top:12px;padding:8px 10px;border:1px solid rgba(214,181,117,.55);border-radius:10px;
    background:rgba(4,31,44,.82);backdrop-filter:blur(8px);font-size:10px;color:#dce7eb
  }
  .me-live-home-loc b{display:block;color:#f3d595;font-size:13px}
  .me-live-home-vhf{
    position:absolute;top:12px;left:50%;transform:translateX(-50%);width:min(74%,420px);
    padding:9px 11px;border:1px solid rgba(214,181,117,.55);border-radius:12px;background:rgba(4,31,44,.86);
    backdrop-filter:blur(10px);pointer-events:auto
  }
  .me-live-home-vhf small{display:block;color:#efc977;font-size:8px;font-weight:900;letter-spacing:.08em}
  .me-live-home-vhf strong{display:block;margin-top:4px;color:#fff;font-size:12px;line-height:1.3}
  .me-live-home-traffic{
    position:absolute;left:10px;right:10px;bottom:84px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px
  }
  .me-live-home-traffic>div{
    min-width:0;padding:6px 7px;border-radius:9px;background:rgba(3,28,41,.72);border:1px solid rgba(255,255,255,.09);
    backdrop-filter:blur(6px);font-size:8px;color:#b8ccd3
  }
  .me-live-home-traffic b{display:block;color:#f0d29d;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .me-live-home-contract{
    position:absolute;left:50%;bottom:10px;transform:translateX(-50%);width:min(88%,560px);
    padding:9px 10px;border-radius:13px;border:1px solid #c29a60;background:rgba(4,29,43,.92);backdrop-filter:blur(10px);
    display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;pointer-events:auto
  }
  .me-live-home-contract small{display:block;color:#dfbd78;font-size:8px;font-weight:900;letter-spacing:.08em}
  .me-live-home-contract strong{display:block;margin-top:3px;color:#fff2ce;font-size:11px;line-height:1.25}
  .me-live-home-contract button{
    min-height:40px;padding:8px 10px;border-color:#d2ad67;background:linear-gradient(135deg,#e1bb6d,#a46f25);
    color:#10202b;font-weight:900;font-size:9px
  }
  .me-live-home-marina{
    position:absolute;inset:0;overflow:hidden;pointer-events:none
  }
  .me-live-home-boat{
    position:absolute;left:-80px;z-index:2;font-size:30px;filter:drop-shadow(0 4px 3px rgba(0,0,0,.45));
    animation:meHomeTraffic var(--dur) linear var(--delay) infinite
  }
  .me-live-home-boat small{
    display:block;margin-top:-2px;padding:2px 5px;border-radius:999px;background:rgba(2,26,36,.76);
    color:#fff;font-size:7px;white-space:nowrap
  }
  .me-live-home-boat:nth-child(1){top:43%;--dur:22s;--delay:-3s}
  .me-live-home-boat:nth-child(2){top:53%;--dur:27s;--delay:-12s}
  .me-live-home-boat:nth-child(3){top:63%;--dur:31s;--delay:-19s}
}
@media(min-width:741px) and (max-width:899px) and (orientation:landscape){
  .top{display:none!important}
  .me-compact-hud{position:fixed;top:4px;left:145px;right:145px;z-index:9997;margin:0!important;grid-template-columns:repeat(4,1fr)!important}
  .me-command-rail{display:flex!important;top:54px!important;bottom:12px!important;width:82px!important}
  .me-command-rail.left{left:8px!important;border-radius:14px!important}
  .me-command-rail.right{right:8px!important;border-radius:14px!important}
  .me-command-rail button{width:70px!important;height:62px!important;min-height:62px!important;font-size:22px!important}
  .shell{padding-left:100px!important;padding-right:100px!important;padding-top:56px!important}
  #home .hero{height:calc(100svh - 64px)!important;min-height:calc(100svh - 64px)!important;margin:0!important;border-radius:16px!important}
  .me-command-bottom{left:170px!important;right:170px!important;bottom:8px!important}
  .me-live-home-vhf{width:min(48%,520px)!important;top:18px!important}
  .me-live-home-loc{top:18px!important;left:18px!important}
  .me-live-home-traffic{left:18px!important;right:18px!important;bottom:90px!important;grid-template-columns:repeat(3,1fr)!important}
  .me-live-home-contract{width:min(72%,760px)!important;bottom:14px!important}
}
@keyframes meHomeTraffic{0%{transform:translateX(0)}100%{transform:translateX(calc(100vw + 260px))}}
`;
document.head.appendChild(style);

let root=null,currentIndex=0,lastKey="";
function marinaName(){
 try{return typeof port==="function"?(port(state?.port||"rimini")?.name||"Marina di Rimini"):String(state?.port||"Rimini")}catch(_){return"Marina di Rimini"}
}
function ensure(){
 const hero=document.querySelector("#home .hero");if(!hero)return false;
 if(root&&root.isConnected)return true;
 root=document.createElement("div");root.className="me-live-home-overlay";root.innerHTML=
 '<div class="me-live-home-marina" id="meLiveHomeMarina"></div>'+
 '<div class="me-live-home-loc" id="meLiveHomeLoc"></div>'+
 '<div class="me-live-home-vhf" id="meLiveHomeVhf"></div>'+
 '<div class="me-live-home-traffic" id="meLiveHomeTraffic"></div>'+
 '<div class="me-live-home-contract" id="meLiveHomeContract"></div>';
 hero.appendChild(root);return true;
}
function safeTraffic(){
 try{return window.MarinaEmpireLiveTraffic?.snapshot?.()||null}catch(_){return null}
}
function safeContracts(){
 try{return window.MarinaEmpireLiveTraffic?.contracts?.()||[]}catch(_){return[]}
}
function vhfText(){
 try{
  const chain=window.MarinaEmpireEventChains?.current?.();
  if(chain?.stage?.vhf)return chain.stage.vhf;
 }catch(_){}
 const t=safeTraffic();
 const first=t?.items?.[0];
 if(first)return first.name+" · "+String(first.action||"attività in marina").toLowerCase();
 return "Port Control: marina operativa · traffico regolare.";
}
function renderBoats(t){
 const box=document.getElementById("meLiveHomeMarina");if(!box)return;
 const items=(t?.items||[]).slice(0,3);
 box.innerHTML=items.map((v,i)=>'<div class="me-live-home-boat"><span>🛥️</span><small>'+v.name+'</small></div>').join("");
}
function renderTraffic(t){
 const box=document.getElementById("meLiveHomeTraffic");if(!box)return;
 const items=(t?.items||[]).slice(0,3);
 box.innerHTML=items.map(v=>'<div><b>'+v.name+'</b><span>'+v.action+(v.berth?' · '+v.berth:'')+(v.eta>0?' · '+v.eta+' min':'')+'</span></div>').join("");
}
function renderContract(){
 const box=document.getElementById("meLiveHomeContract");if(!box)return;
 const contracts=safeContracts();
 if(!contracts.length){
   box.innerHTML='<div><small>AZIONE CONSIGLIATA</small><strong>Nessun incarico urgente. Controlla missioni o attività nautiche.</strong></div><button type="button" data-home-fallback="missions">MISSIONI</button>';
   box.querySelector("button").onclick=()=>typeof showTab==="function"&&showTab("missions");return;
 }
 currentIndex=currentIndex%contracts.length;
 const c=contracts[currentIndex];
 const client=c.clientVessel?.name?(" · "+c.clientVessel.name):"";
 box.innerHTML='<div><small>AZIONE CONSIGLIATA</small><strong>'+c.icon+' '+c.title+client+' · '+Math.round(c.reward).toLocaleString("it-IT")+' cr</strong></div><button type="button" data-home-contract="'+c.dynamicId+'">ACCETTA</button>';
 const btn=box.querySelector("button");
 btn.onclick=()=>{
   const fn=window.MarinaEmpireLiveTraffic?.startContract;
   if(typeof fn==="function")fn(c.dynamicId);
   if(typeof showTab==="function")showTab("marinas");
 };
}
function render(){
 if(!ensure()||typeof state==="undefined")return;
 const t=safeTraffic();
 const key=JSON.stringify([state.port,Math.floor(Date.now()/15000),t?.items?.map(x=>x.id)]);
 if(key===lastKey)return;lastKey=key;
 document.getElementById("meLiveHomeLoc").innerHTML='<b>📍 '+marinaName()+'</b><span>'+(state.trip?'IN NAVIGAZIONE':'MONDO VIVO · '+(t?.volume||0)+' UNITÀ ATTIVE')+'</span>';
 document.getElementById("meLiveHomeVhf").innerHTML='<small>📻 VHF · IN DIRETTA</small><strong>'+vhfText()+'</strong>';
 renderBoats(t);renderTraffic(t);renderContract();
}
function rotate(){
 const cs=safeContracts();if(cs.length){currentIndex=(currentIndex+1)%cs.length;renderContract()}
}
function boot(){
 render();
 setInterval(render,15000);
 setInterval(rotate,12000);
 window.addEventListener("marina-empire-updated",()=>setTimeout(render,80));
 window.addEventListener("marina-world-event",()=>setTimeout(render,80));
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)render()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();