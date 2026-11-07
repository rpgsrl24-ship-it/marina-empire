(()=>{
"use strict";
if(window.__ME_HOME_WORLD_EVENT_CARD_V1__)return;
window.__ME_HOME_WORLD_EVENT_CARD_V1__=true;

const style=document.createElement("style");
style.textContent=`
.me-home-world-event-card{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:11px 12px;border:1px solid #d4ac63;border-radius:13px;background:linear-gradient(145deg,#15536c,#092f46);box-shadow:0 8px 22px #0004}
.me-home-world-event-card .ico{font-size:24px}.me-home-world-event-card small{display:block;color:#f1c86f;font-size:8px;font-weight:950;letter-spacing:.08em}.me-home-world-event-card strong{display:block;margin-top:2px;color:#fff0c8;font-size:11px}.me-home-world-event-card span{display:block;margin-top:3px;color:#b8d0d8;font-size:8px}
.me-home-world-event-card button{min-width:58px!important;min-height:39px!important;padding:7px 9px!important;border:1px solid #eccb83!important;background:linear-gradient(135deg,#eac977,#a97731)!important;color:#102432!important;font-size:9px!important;font-weight:950!important}
@media(max-width:430px){.me-home-world-event-card{grid-template-columns:auto minmax(0,1fr) auto;gap:7px;padding:10px}.me-home-world-event-card .ico{font-size:21px}.me-home-world-event-card button{min-width:52px!important;padding:6px!important}}
`;
document.head.appendChild(style);

function current(){
 try{
  const api=window.MarinaEmpireWorldEvents;
  const p=typeof state!=="undefined"?state?.port:null;
  return api?.displayEventFor?.(p)||api?.current?.()||null;
 }catch(_){return null}
}
function urlFor(e){
 try{
  const p=typeof state!=="undefined"?state?.port:null;
  return window.MarinaEmpireWorldEvents?.eventUrl?.(e,p)||"./evento-mondo.html?event="+encodeURIComponent(e?.id||"vip_arrivals");
 }catch(_){return"./evento-mondo.html"}
}
function timeLeft(e){
 try{return window.MarinaEmpireWorldEvents?.timeLeft?.(e?.until)||""}catch(_){return""}
}
function preferredHost(){
 const premium=document.getElementById("mePremiumHome");
 if(premium)return {host:premium,anchor:premium.querySelector(".meph-live")};
 const mobile=document.querySelector("#home .me-mobile-home-dashboard");
 if(mobile)return {host:mobile,anchor:mobile.querySelector(".me-mobile-home-hub")||mobile.firstElementChild};
 const home=document.getElementById("home");
 return home?{host:home,anchor:home.querySelector(".me-beta-launch-notice")}:null;
}
function ensure(){
 const loc=preferredHost();if(!loc)return null;
 let card=document.getElementById("meHomeWorldEventCard");
 if(!card){
  card=document.createElement("section");
  card.id="meHomeWorldEventCard";
  card.className="me-home-world-event-card";
  card.innerHTML='<div class="ico" id="meHomeWorldIcon">🌍</div><div><small>EVENTI DAL MONDO</small><strong id="meHomeWorldTitle">Evento in aggiornamento</strong><span id="meHomeWorldMeta">Nuove opportunità nel mondo nautico</span></div><button type="button" id="meHomeWorldOpen">APRI ›</button>';
 }
 if(card.parentNode!==loc.host){
  if(loc.anchor)loc.anchor.insertAdjacentElement("afterend",card);
  else loc.host.prepend(card);
 }
 card.querySelector("#meHomeWorldOpen").onclick=()=>{location.href=urlFor(current())};
 return card;
}
function render(){
 const card=ensure();if(!card)return;
 const e=current();
 if(!e){card.querySelector("#meHomeWorldTitle").textContent="Mondo nautico in aggiornamento";card.querySelector("#meHomeWorldMeta").textContent="Controlla tra poco";return}
 card.querySelector("#meHomeWorldIcon").textContent=e.icon||"🌍";
 card.querySelector("#meHomeWorldTitle").textContent=e.title||"Evento dal mondo";
 const left=timeLeft(e);
 card.querySelector("#meHomeWorldMeta").textContent=(e.bonus?e.bonus+" · ":"")+(left?"cambia tra "+left:e.text||"");
}
function boot(){render();setTimeout(render,500);setInterval(render,30000);window.addEventListener("marina-world-event",render);window.addEventListener("marina-empire-updated",render);window.addEventListener("resize",render)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();