(()=>{
"use strict";
if(window.__ME_GUIDANCE_V1__)return;
window.__ME_GUIDANCE_V1__=true;

const style=document.createElement("style");
style.id="me-guidance-v1-style";
style.textContent=`
@media(max-width:899px){
 .me-guide-target{position:relative!important;box-shadow:0 0 0 2px rgba(255,199,77,.42),0 0 22px rgba(255,188,62,.28)!important}
 #meGuideToast{position:fixed;z-index:99990;left:10px;right:10px;bottom:calc(78px + env(safe-area-inset-bottom,0px));display:none;grid-template-columns:auto minmax(0,1fr) auto;gap:9px;align-items:center;padding:10px 11px;border:1px solid #e0b45f;border-radius:13px;background:linear-gradient(145deg,rgba(6,31,44,.98),rgba(10,55,72,.98));box-shadow:0 12px 30px #0009}
 #meGuideToast.show{display:grid}
 #meGuideToast .me-guide-icon{font-size:22px}
 #meGuideToast small{display:block;color:#8faab5;font-size:7px;font-weight:900;letter-spacing:.12em}
 #meGuideToast strong{display:block;margin-top:2px;color:#f5d99c;font-size:11px;line-height:1.15}
 #meGuideToast p{margin:3px 0 0;color:#c8d8dd;font-size:8px;line-height:1.25}
 #meGuideToast button{min-height:38px!important;padding:7px 9px!important;font-size:8px!important;font-weight:950!important}
}
@media(min-width:900px){#meGuideToast{display:none!important}}
`;
document.head.appendChild(style);

function sref(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function now(){return Date.now()}
function num(v){return Math.max(0,Math.floor(Number(v)||0))}
function boatInfo(s){try{return typeof boat==="function"?boat(s?.boat):null}catch(_){return null}}
function getNext(){
 const s=sref();
 if(!s||!s.name)return {id:"start",icon:"⚓",title:"Inizia il tuo impero",text:"Crea il comandante e avvia la prima partita.",target:"profile",label:"INIZIA"};
 if(!s.setupComplete&&!s.trip&&num(s.voyages)===0)return {id:"setup",icon:"🧭",title:"Prepara la tua base",text:"Completa il setup iniziale e preparati alla prima missione.",target:"office",label:"CONFIGURA"};
 if(s.trip)return {id:"trip",icon:"🗺️",title:"Segui la rotta",text:"La tua barca è in navigazione. Controlla GPS, carburante e arrivo.",target:"map",label:"APRI MAPPA"};
 const vhf=document.querySelector(".me-live-vhf-action");
 if(vhf&&/RISCUOTI/i.test(vhf.textContent||""))return {id:"vhf-collect",icon:"🪙",title:"Riscuoti l'incarico",text:"L'incarico VHF è completato. Ritira subito la ricompensa.",target:"vhf",label:"RISCUOTI"};
 if(vhf&&/PRENDI INCARICO/i.test(vhf.textContent||"")&&num(s.voyages)>=1)return {id:"vhf",icon:"📻",title:"Nuovo incarico disponibile",text:"La marina ha un nuovo incarico VHF pronto per te.",target:"vhf",label:"PRENDI INCARICO"};
 if(!window.meRegisteredPlayer&&num(s.voyages)>=2)return {id:"register",icon:"👤",title:"Salva il tuo impero",text:"Hai completato il tour. Registrati gratis per continuare senza perdere i progressi.",target:"profile",label:"REGISTRATI"};
 const y=boatInfo(s),tank=Math.max(1,Number(y?.tank)||300);
 if((Number(s.fuel)||0)<tank*.25)return {id:"fuel",icon:"⛽",title:"Carburante basso",text:"Fai il pieno prima della prossima missione.",target:"services",label:"FAI IL PIENO"};
 if((Number(s.condition)||100)<60)return {id:"repair",icon:"🔧",title:"Yacht da controllare",text:"La manutenzione è sotto il livello consigliato.",target:"services",label:"MANUTENZIONE"};
 try{
  const g=window.MarinaEmpireMobileProgression?.milestone?.();
  if(g?.panel)return {id:"growth-"+(g.step||1),icon:"🎯",title:g.title||"Prossimo obiettivo",text:g.desc||"Continua a far crescere il tuo impero.",target:g.panel,label:g.action||"CONTINUA"};
 }catch(_){}
 return {id:"mission",icon:"🎯",title:"Scegli la prossima missione",text:"Completa missioni per guadagnare crediti, prestigio e sbloccare nuove attività.",target:"missions",label:"MISSIONI"};
}

function commercePrompt(){
 const s=sref();if(!s||!window.meRegisteredPlayer||s.trip)return null;
 const t=now(),last=Number(localStorage.getItem("me_last_store_prompt")||0);
 if(t-last<45*60*1000)return null;
 let need=0,reason="";
 try{
  const open=(typeof boats!=="undefined"?boats:[]).find(x=>x.id==="open");
  if(open&&!s.owned?.includes?.("open")){
    need=Math.max(0,(Number(open.price)||80000)-num(s.coins));
    if(need>0&&need<=30000)reason="Ti mancano "+need.toLocaleString("it-IT")+" crediti per la prossima barca.";
  }
 }catch(_){}
 if(!reason&&num(s.coins)<4000)reason="La tua cassa è quasi vuota: puoi continuare a giocare oppure ricaricare crediti.";
 if(!reason)return null;
 return {id:"store",icon:"💳",title:"Vuoi accelerare la crescita?",text:reason,target:"credits",label:"VEDI CREDITI",commercial:true};
}

function targetEl(action){
 if(action.target==="vhf")return document.getElementById("mephJob")||document.querySelector(".me-live-vhf-action");
 if(action.target==="missions")return document.querySelector('#mePremiumHome [data-go="missions"]')||document.querySelector('[data-mobile-tab="missions"]');
 if(action.target==="map")return document.querySelector('#mePremiumHome [data-go="map"]')||document.querySelector('[data-mobile-tab="map"]');
 if(action.target==="fleet")return document.querySelector('#mePremiumHome [data-go="fleet"]')||document.querySelector('[data-mobile-tab="fleet"]');
 if(action.target==="profile")return document.querySelector('#mePremiumHome [data-go="profile"]');
 if(action.target==="credits")return document.querySelector('#mePremiumHome [data-go="credits"]');
 if(action.target==="office")return document.querySelector('#mePremiumHome [data-go="office"]');
 if(action.target==="services")return document.getElementById("mephMore");
 return document.querySelector('#mePremiumHome [data-go="'+action.target+'"]');
}

function clearBadges(){
 document.querySelectorAll(".me-guide-badge").forEach(x=>x.remove());
 document.querySelectorAll(".me-guide-target").forEach(x=>x.classList.remove("me-guide-target"));
}

function badge(action){
 clearBadges();
 const el=targetEl(action);if(!el)return;
 el.classList.add("me-guide-target");
}

function ensureUI(){
 let toast=document.getElementById("meGuideToast");
 if(!toast){
  toast=document.createElement("div");toast.id="meGuideToast";
  toast.innerHTML='<div class="me-guide-icon">🎯</div><div><small>PROSSIMA AZIONE</small><strong></strong><p></p></div><button type="button">APRI</button>';
  document.body.appendChild(toast);
 }
 return toast;
}

function openAction(a){
 if(a.commercial)localStorage.setItem("me_last_store_prompt",String(now()));
 if(a.target==="vhf"){
   const b=document.querySelector(".me-live-vhf-action");
   if(b&&!b.disabled){b.click();return}
   if(typeof showTab==="function")showTab("marinas");return
 }
 if(a.target==="services"){document.getElementById("mephMore")?.click();return}
 if(typeof showTab==="function")showTab(a.target);
}

let toastTimer=null,lastActionId="";
function showToast(a,force=false){
 const toast=ensureUI();if(!toast||!a)return;
 if(!force&&a.id===lastActionId)return;
 lastActionId=a.id;
 toast.querySelector(".me-guide-icon").textContent=a.icon||"🎯";
 toast.querySelector("small").textContent=a.commercial?"OPPORTUNITÀ":"PROSSIMA AZIONE";
 toast.querySelector("strong").textContent=a.title;
 toast.querySelector("p").textContent=a.text;
 const btn=toast.querySelector("button");btn.textContent=a.label||"APRI";btn.onclick=()=>{toast.classList.remove("show");openAction(a)};
 toast.classList.add("show");
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),a.commercial?9000:7000);
}

function maybeReturnNudge(){
 const s=sref();if(!s?.name)return;
 const key="me_last_seen",last=Number(localStorage.getItem(key)||0),gap=now()-last;
 localStorage.setItem(key,String(now()));
 if(last&&gap>6*60*60*1000){
   setTimeout(()=>showToast({id:"return-"+Math.floor(now()/21600000),icon:"⚓",title:"La marina è ancora attiva",text:"Nuovi movimenti, incarichi ed eventi ti aspettano.",target:"marinas",label:"TORNA IN MARINA"},true),1400);
 }
}

function sync(){
 if((Number(globalThis.innerWidth)||1024)>899)return;
 ensureUI();
 const a=getNext();
 badge(a);
 const home=document.getElementById("home");
 const onHome=home&&!home.classList.contains("hide");
 if(onHome)showToast(a);
 const cp=commercePrompt();
 if(onHome&&cp)setTimeout(()=>showToast(cp,true),5000);
 localStorage.setItem("me_last_seen",String(now()));
}

window.MarinaEmpireGuidance={next:getNext,sync,show:showToast};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{maybeReturnNudge();setTimeout(sync,800)},{once:true});
else {maybeReturnNudge();setTimeout(sync,800)}
window.addEventListener("marina-empire-updated",()=>setTimeout(sync,100));
window.addEventListener("marina-world-event",()=>setTimeout(sync,100));
document.addEventListener("visibilitychange",()=>{if(!document.hidden)setTimeout(sync,200)});
setInterval(sync,20000);
})();