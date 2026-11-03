(()=>{
"use strict";
if(window.__ME_SERVICE_CHAINS__)return;
window.__ME_SERVICE_CHAINS__=true;

const CHAINS=[
 {id:"superyacht",title:"ARRIVO SUPERYACHT",icon:"🛥️",steps:[
  {type:"Ormeggio",title:"Assegna l'ormeggio",cost:80,reward:300,prestige:7,reputation:5},
  {type:"Rifornimento",title:"Coordina il rifornimento",cost:130,reward:460,prestige:9,reputation:6},
  {type:"Tecnica",title:"Verifica assistenza tecnica",cost:170,reward:620,prestige:13,reputation:8,requiredSectorLevel:2},
  {type:"Servizio VIP",title:"Accoglienza ospiti VIP",cost:180,reward:690,prestige:15,reputation:9,requiredSectorLevel:2}
 ]},
 {id:"charter",title:"TURNAROUND CHARTER",icon:"⚓",steps:[
  {type:"Ormeggio",title:"Gestisci il rientro charter",cost:70,reward:270,prestige:6,reputation:4},
  {type:"Tecnica",title:"Controllo rapido yacht",cost:150,reward:540,prestige:11,reputation:7},
  {type:"Servizio VIP",title:"Prepara i nuovi ospiti",cost:160,reward:610,prestige:13,reputation:8}
 ]},
 {id:"regatta",title:"OPERAZIONE REGATA",icon:"⛵",steps:[
  {type:"Ormeggio",title:"Accoglienza equipaggio",cost:60,reward:250,prestige:6,reputation:4},
  {type:"Rifornimento",title:"Supporto logistico",cost:110,reward:400,prestige:8,reputation:5},
  {type:"Charter",title:"Servizio hospitality",cost:170,reward:650,prestige:14,reputation:8}
 ]}
];

let box=null,refresh=null;

function portKey(){
 try{return String(state?.port||"rimini").toLowerCase()}catch(_){return"rimini"}
}
function daySlot(){return Math.floor(Date.now()/21600000)}
function hash(str){let h=7;for(const ch of String(str))h=(Math.imul(h,31)+ch.charCodeAt(0))>>>0;return h}
function selected(){
 const key=portKey(),idx=hash(key+"|"+daySlot())%CHAINS.length;
 return CHAINS[idx];
}
function progress(){
 try{
  const all=state?.serviceChains&&typeof state.serviceChains==="object"?state.serviceChains:{};
  const key=portKey()+"|"+daySlot();
  const raw=all[key]||{};
  return {key,step:Math.max(0,Math.floor(Number(raw.step)||0)),completed:!!raw.completed};
 }catch(_){return {key:portKey()+"|"+daySlot(),step:0,completed:false}}
}
function buildContract(chain,p){
 const base=chain.steps[Math.min(p.step,chain.steps.length-1)];
 if(!base)return null;
 const world=window.MarinaEmpireWorldEvents?.modifiers?.(portKey())||{};
 const demand=Math.max(.9,Math.min(1.4,Number(world.demand)||1));
 const career=Math.max(1,Number(window.MarinaEmpireCareerPath?.snapshot?.()?.current?.level)||1);
 const localTrust=window.MarinaEmpireMarinaBenefits?.forMarina?.(portKey())||{level:1,reputation:0};
 const trustLevel=Math.max(1,Math.min(5,Number(localTrust.level)||1));
 const localBonus=1+(trustLevel-1)*.04;
 return {
  ...base,
  id:"chain-"+p.key+"-"+p.step,
  icon:chain.icon,
  reward:Math.round(base.reward*demand*(1+(career-1)*.06)*localBonus),
  prestige:Math.round(base.prestige*(1+(career-1)*.04)),
  reputation:Math.round(base.reputation*(1+(career-1)*.04)),
  localTrustLevel:trustLevel,
  localTrustReputation:Math.max(0,Math.floor(Number(localTrust.reputation)||0)),
  localBonusPct:Math.round((localBonus-1)*100),
  requiredSectorLevel:Math.max(1,Number(base.requiredSectorLevel)||1)
 };
}
function ensure(){
 const host=document.querySelector(".me-traffic-board");
 if(!host)return false;
 if(box&&box.isConnected)return true;
 box=document.createElement("section");
 box.className="me-service-chain";
 box.style.cssText="margin-top:9px;padding:9px;border:1px solid rgba(214,181,117,.24);border-radius:9px;background:#0b2c39";
 host.appendChild(box);
 return true;
}
function render(){
 if(!ensure())return;
 const chain=selected(),p=progress();
 if(p.completed){
  box.innerHTML='<strong style="color:#f0d296;font-size:9px">'+chain.icon+' '+chain.title+' · COMPLETATA</strong><p style="font-size:8.5px;color:#a9bec6;margin:5px 0 0">Catena operativa conclusa. Una nuova situazione arriverà nella prossima finestra marina.</p>';
  return;
 }
 const c=buildContract(chain,p),check=window.MarinaEmpireNpcEconomy?.canStart?.(c)||{ok:false,message:"Sistema incarichi non disponibile"};
 const steps=chain.steps.map((s,i)=>'<span style="font-size:8px;color:'+(i<p.step?'#96d7bb':i===p.step?'#f0d296':'#78949f')+'">'+(i<p.step?'✓ ':i===p.step?'● ':'○ ')+(i+1)+'</span>').join(' · ');
 box.innerHTML='<strong style="color:#f0d296;font-size:9px">'+chain.icon+' CATENA LIVE · '+chain.title+'</strong><p style="font-size:8.5px;color:#b9ccd2;margin:5px 0">'+steps+' · STEP '+(p.step+1)+'/'+chain.steps.length+'</p><p style="font-size:9px;margin:5px 0;color:#e1e9ec"><b>'+c.title+'</b> · '+Math.round(c.reward).toLocaleString("it-IT")+' cr · prestigio +'+c.prestige+' · rep. +'+c.reputation+(c.localBonusPct>0?' · bonus marina +'+c.localBonusPct+'%':'')+'</p><button type="button" data-chain-start style="width:100%;padding:7px;border:1px solid rgba(214,181,117,.45);border-radius:8px;background:#17475a;color:#fff;font-size:8.5px" '+(!check.ok?'disabled':'')+'>'+(check.ok?'COMPLETA STEP':check.message)+'</button><p data-chain-status style="font-size:8px;color:#8ca8b2;margin:5px 0 0">Completando tutti gli step ottieni un bonus finale.</p>';
 box.querySelector("[data-chain-start]")?.addEventListener("click",()=>complete(chain,p,c));
}
function complete(chain,p,c){
 const status=box?.querySelector("[data-chain-status]");
 const result=window.MarinaEmpireNpcEconomy?.complete?.(c,c.id)||{ok:false,message:"Operazione non disponibile"};
 if(!result.ok){if(status)status.textContent=result.message||"Operazione non registrata";return}
 const isLast=p.step>=chain.steps.length-1;
 const bonus=isLast?Math.round(chain.steps.reduce((n,s)=>n+s.reward,0)*.22):0;
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{
  state.serviceChains=state.serviceChains&&typeof state.serviceChains==="object"?state.serviceChains:{};
  state.serviceChains[p.key]={step:isLast?p.step:p.step+1,completed:isLast,updatedAt:Date.now(),chain:chain.id};
  if(isLast){
   state.coins+=bonus;
   state.prestige=(Number(state.prestige)||0)+25;
   state.earnings=(Number(state.earnings)||0)+bonus;
   state.serviceChainsCompleted=(Number(state.serviceChainsCompleted)||0)+1;
  }
 }):false;
 if(!ok){if(status)status.textContent="Incarico completato, ma avanzamento catena non salvato.";return}
 if(status)status.textContent=isLast?"Catena completata · bonus +"+bonus.toLocaleString("it-IT")+" crediti · prestigio +25":"Step completato. Nuovo incarico disponibile.";
 try{render()}catch(_){}
}
window.MarinaEmpireServiceChains={current:()=>({chain:selected(),progress:progress()})};
function boot(){
 if(!ensure()){setTimeout(boot,800);return}
 render();
 clearInterval(refresh);refresh=setInterval(render,45000);
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{box=null;render()},100));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();