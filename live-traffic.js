(()=>{
"use strict";
if(window.__ME_LIVE_TRAFFIC__)return;
window.__ME_LIVE_TRAFFIC__=true;

const VESSELS=[
 {id:"aurora",name:"M/Y Aurora",kind:"superyacht",length:62,profile:"superyacht"},
 {id:"levante",name:"S/Y Levante",kind:"vela",length:24,profile:"regatta"},
 {id:"riva56",name:"Riva 56",kind:"motor yacht",length:17,profile:"charter"},
 {id:"blue-star",name:"M/Y Blue Star",kind:"yacht",length:34,profile:"charter"},
 {id:"tender18",name:"Tender 18",kind:"tender",length:8,profile:"service"},
 {id:"maestrale",name:"S/Y Maestrale",kind:"vela",length:21,profile:"regatta"},
 {id:"riviera",name:"M/Y Riviera",kind:"superyacht",length:55,profile:"superyacht"},
 {id:"pilot07",name:"Pilot 07",kind:"pilotina",length:14,profile:"port"},
 {id:"adriatica",name:"M/Y Adriatica",kind:"yacht",length:29,profile:"charter"},
 {id:"bora",name:"S/Y Bora",kind:"vela",length:18,profile:"regatta"},
 {id:"serenissima",name:"M/Y Serenissima",kind:"yacht",length:41,profile:"superyacht"},
 {id:"riva44",name:"Riva 44",kind:"motor yacht",length:13,profile:"charter"},
 {id:"ferry-adriatico",name:"Adriatico Express",kind:"traghetto",length:96,profile:"commercial"},
 {id:"cargo-venere",name:"M/V Venere",kind:"cargo",length:138,profile:"commercial"},
 {id:"fishing-nettuno",name:"Nettuno 5",kind:"peschereccio",length:19,profile:"commercial"},
 {id:"rescue01",name:"Rescue 01",kind:"SAR",length:16,profile:"rescue"}
];
const CONTRACTS=[
 {id:"arrival",icon:"⚓",type:"Ormeggio",title:"Assistenza arrivo yacht",sector:"marina",cost:90,reward:330,prestige:8,reputation:5,duration:24},
 {id:"fuel",icon:"⛽",type:"Rifornimento",title:"Coordinamento fuel dock",sector:"marina",cost:120,reward:420,prestige:9,reputation:6,duration:26},
 {id:"tech",icon:"🔧",type:"Tecnica",title:"Intervento tecnico rapido",sector:"tecnica",cost:170,reward:610,prestige:14,reputation:8,duration:34,requiredSectorLevel:2},
 {id:"charter",icon:"🛥️",type:"Charter",title:"Preparazione charter urgente",sector:"charter",cost:210,reward:760,prestige:16,reputation:9,duration:38},
 {id:"vip",icon:"✨",type:"Servizio VIP",title:"Accoglienza ospiti premium",sector:"servizi",cost:180,reward:680,prestige:15,reputation:8,duration:32,requiredSectorLevel:2},
 {id:"broker",icon:"💼",type:"Brokerage",title:"Sea trial riservato",sector:"broker",cost:140,reward:570,prestige:13,reputation:7,duration:30,requiredSectorLevel:2},
 {id:"provisioning",icon:"🥂",type:"Provisioning",title:"Provisioning e cambusa premium",sector:"servizi",cost:150,reward:540,prestige:11,reputation:7,duration:28},
 {id:"toys",icon:"🏄",type:"Water Toys",title:"Preparazione water toys",sector:"servizi",cost:160,reward:590,prestige:12,reputation:7,duration:30},
 {id:"security",icon:"🛡️",type:"Security",title:"Coordinamento security ospiti",sector:"servizi",cost:190,reward:710,prestige:15,reputation:8,duration:34,requiredSectorLevel:2},
 {id:"transfer",icon:"🚐",type:"Transfer VIP",title:"Transfer VIP marina-aeroporto",sector:"servizi",cost:170,reward:640,prestige:13,reputation:8,duration:31}
];

const style=document.createElement("style");
style.id="me-live-traffic-style";
style.textContent=`
.me-traffic-board{margin:9px 10px 10px;padding:10px;border:1px solid rgba(194,154,96,.28);border-radius:11px;background:#092632}
.me-traffic-head{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:7px}
.me-traffic-head strong{font-size:9px;letter-spacing:.08em;color:#f0d29d}.me-traffic-head span{font-size:8px;color:#8eb0bc}
.me-traffic-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:9px}
.me-traffic-list,.me-contract-list{display:grid;gap:5px;min-width:0}
.me-traffic-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:6px;align-items:center;padding:6px 7px;border-radius:8px;background:rgba(255,255,255,.025);font-size:8.5px;color:#c6d5da}
.me-traffic-row b{color:#e9d4aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.me-traffic-row em{font-style:normal;color:#8da8b2;font-size:8px}
.me-contract{padding:7px;border:1px solid rgba(214,181,117,.19);border-radius:8px;background:#0b2d3b}
.me-contract strong{display:block;color:#f3d7a1;font-size:9px}.me-contract p{margin:4px 0;font-size:8.5px;color:#b9ccd2}
.me-contract button{width:100%;margin-top:5px;padding:6px 8px;border:1px solid rgba(214,181,117,.42);border-radius:8px;background:#16465a;color:#fff;font-size:8.5px}
.me-contract button:disabled{opacity:.5}
.me-contract-status{margin-top:5px;font-size:8px;color:#8da9b3}
.me-contract-progress{height:4px;margin-top:5px;background:#153947;border-radius:99px;overflow:hidden}.me-contract-progress span{display:block;height:100%;background:#d1ae70;width:0}
@media(max-width:740px){.me-traffic-board{margin:7px 8px 8px;padding:8px}.me-traffic-grid{grid-template-columns:1fr}.me-traffic-list{grid-template-columns:1fr 1fr}.me-traffic-row{grid-template-columns:36px minmax(0,1fr);}.me-traffic-row em{grid-column:2}.me-contract-list{grid-template-columns:1fr 1fr}}
@media(max-width:430px){.me-traffic-list,.me-contract-list{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

let box=null,active=null,tickTimer=null,refreshTimer=null;

function hash(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function portKey(){
 try{if(typeof state!=="undefined"&&state?.port)return String(state.port).toLowerCase()}catch(_){}
 return document.querySelector(".me-current-marina-card")?.dataset?.marinaCard||"rimini";
}
function slot(ms=300000){return Math.floor(Date.now()/ms)}
function chainSlot(){return Math.floor(Date.now()/21600000)}
function vesselRelation(vessel,key=portKey()){
 try{
  const raw=state?.vesselRelations?.[String(key).toLowerCase()]?.[String(vessel?.id||"")]||{};
  const visits=Math.max(0,Math.floor(Number(raw.visits)||0));
  const services=Math.max(0,Math.floor(Number(raw.services)||0));
  const level=visits>=7?5:visits>=4?4:visits>=2?3:visits>=1?2:1;
  const label=level===5?"CLIENTE VIP":level===4?"CLIENTE PREFERITO":level===3?"CLIENTE ABITUALE":level===2?"DI RITORNO":"NUOVO CLIENTE";
  return {visits,services,level,label,lastAt:Number(raw.lastAt)||0,lastChain:String(raw.lastChain||"")};
 }catch(_){return {visits:0,services:0,level:1,label:"NUOVO CLIENTE",lastAt:0,lastChain:""}}
}
function featuredVessel(){
 const key=portKey(),eligible=VESSELS.filter(v=>["superyacht","charter","regatta"].includes(v.profile));
 const seed=hash(key+"|featured|"+chainSlot());
 const known=eligible.filter(v=>vesselRelation(v,key).visits>0);
 const useKnown=known.length>0&&(seed%100)<60;
 const pool=useKnown?known:eligible;
 const ranked=[...pool].sort((a,b)=>{
  const pa=window.MarinaEmpireMarinaProfiles?.vesselWeight?.(a,key)||1,pb=window.MarinaEmpireMarinaProfiles?.vesselWeight?.(b,key)||1;
  const la=window.MarinaEmpireLocalEvents?.vesselWeight?.(a,key)||1,lb=window.MarinaEmpireLocalEvents?.vesselWeight?.(b,key)||1;
  return (hash(b.id+"|"+seed)%1000)*pb*lb-(hash(a.id+"|"+seed)%1000)*pa*la;
 });
 const v=ranked[0]||pool[0];
 let raw={};
 try{raw=state?.serviceChains?.[key+"|"+chainSlot()]||{}}catch(_){}
 const step=Math.max(0,Math.floor(Number(raw.step)||0)),completed=!!raw.completed,relation=vesselRelation(v,key);
 return {...v,featured:true,relation,serviceState:completed?"IN PARTENZA":step>0?"ORMEGGIATO":"IN ARRIVO",chainStep:step,chainCompleted:completed};
}
function marinaProfile(){
 return window.MarinaEmpireMarinaProfiles?.profile?.(portKey())||{label:"MARINA POLIVALENTE",description:"Traffico misto e servizi generali.",trafficBias:1};
}
function localEvent(){
 return window.MarinaEmpireLocalEvents?.modifiers?.(portKey())||{traffic:1,demand:1,event:{title:"Attività locale ordinaria",text:"Operatività regolare.",icon:"⚓"}};
}
function world(){
 return window.MarinaEmpireWorldEvents?.modifiers?.(portKey())||{traffic:1,demand:1,event:{title:"Attività ordinaria"},weather:{label:"CALMO",icon:"☀️"}};
}
function careerLevel(){
 const s=window.MarinaEmpireCareerPath?.snapshot?.();
 return Math.max(1,Math.min(5,Number(s?.current?.level)||1));
}
function trust(){
 return window.MarinaEmpireMarinaBenefits?.forMarina?.(portKey())||{level:1,reputation:0,serviceDiscount:0};
}
function operation(){
 return window.MarinaEmpireServiceChains?.operation?.(portKey())||{level:1,completed:0,next:2,label:"OPERATIVITÀ BASE"};
}
function trafficSnapshot(){
 const key=portKey(),w=world(),op=operation(),profile=marinaProfile(),local=localEvent(),seed=hash(key+"|traffic|"+slot(120000)),base=Math.max(.55,Math.min(1.8,Number(w.traffic)||1));
 const operationBoost=(Math.max(1,Number(op.level)||1)-1)*.35;
 const profileBias=Math.max(.75,Math.min(1.3,Number(profile.trafficBias)||1));
 const localBias=Math.max(.7,Math.min(1.4,Number(local.traffic)||1));
 const memoryTraffic=Math.max(.75,Math.min(1.3,Number(window.MarinaEmpireMarinaMemory?.trafficMultiplier?.(key))||1));
 const volume=Math.max(3,Math.min(10,Math.round(3+base*profileBias*localBias*memoryTraffic*2.2+operationBoost)));
 const feature=featuredVessel(),items=[{
  ...feature,
  action:feature.serviceState,
  eta:feature.chainCompleted?4:feature.chainStep>0?0:3+seed%9,
  berth:"P"+(1+(hash(feature.id+"|"+key)%12))
 }];
 for(let i=0;i<volume-1;i++){
  const candidates=VESSELS.filter(v=>v.id!==feature.id);
  candidates.sort((a,b)=>{
   const pa=window.MarinaEmpireMarinaProfiles?.vesselWeight?.(a,key)||1,pb=window.MarinaEmpireMarinaProfiles?.vesselWeight?.(b,key)||1;
   const la=window.MarinaEmpireLocalEvents?.vesselWeight?.(a,key)||1,lb=window.MarinaEmpireLocalEvents?.vesselWeight?.(b,key)||1;
   return (hash(b.id+"|"+seed+"|"+i)%1000)*pb*lb-(hash(a.id+"|"+seed+"|"+i)%1000)*pa*la;
  });
  const v=candidates[i%candidates.length];
  if(!v)continue;
  const mode=((seed>>>((i%4)*4))+i)%3;
  const eta=3+((seed+i*13)%22);
  items.push({
   ...v,featured:false,
   action:mode===0?"IN ARRIVO":mode===1?"IN PARTENZA":"IN MANOVRA",
   eta,
   berth:"P"+(1+((seed+i*5)%12))
  });
 }
 return {items:items.slice(0,volume),volume,world:w,operation:op,featured:feature,profile,local};
}
function contractSnapshot(){
 const key=portKey(),w=world(),local=localEvent(),stage=careerLevel(),t=trust(),op=operation(),seed=hash(key+"|contracts|"+slot());
 const order=[...CONTRACTS].sort((a,b)=>{
  const pa=window.MarinaEmpireMarinaProfiles?.contractWeight?.(a,key)||1,pb=window.MarinaEmpireMarinaProfiles?.contractWeight?.(b,key)||1;
  const la=window.MarinaEmpireLocalEvents?.contractWeight?.(a,key)||1,lb=window.MarinaEmpireLocalEvents?.contractWeight?.(b,key)||1;
  return (hash(b.id+"|"+seed)%1000)*pb*lb-(hash(a.id+"|"+seed)%1000)*pa*la;
 });
 const memory=window.MarinaEmpireMarinaMemory?.current?.()||{pressure:1,serviceLoad:1};
 const pressure=Math.max(.75,Math.min(1.35,Number(memory.pressure)||1));
 const serviceLoad=Math.max(.8,Math.min(1.3,Number(memory.serviceLoad)||1));
 const pressureExtra=pressure>=1.18?1:0;
 const contractCount=Math.min(4,2+(Math.max(1,Number(op.level)||1)>=3?1:0)+(Math.max(1,Number(op.level)||1)>=5?1:0)+pressureExtra);
 return order.slice(0,contractCount).map((c,i)=>{
  const demand=Math.max(.85,Math.min(1.65,(Number(w.demand)||1)*(Number(local.demand)||1)*serviceLoad));
  const trustBonus=1+(Math.max(1,Number(t.level)||1)-1)*.035;
  const stageBonus=1+(stage-1)*.08;
  const operationBonus=1+(Math.max(1,Number(op.level)||1)-1)*.03;
  const reward=Math.round(c.reward*demand*trustBonus*stageBonus*operationBonus);
  const prestige=Math.round(c.prestige*(1+(stage-1)*.06));
  const reputation=Math.round(c.reputation*(1+(stage-1)*.05));
  return {...c,reward,prestige,reputation,
    dynamicId:"dyn-"+key+"-"+slot()+"-"+i+"-"+c.id,
    marina:key,worldEvent:w.event?.title||"Attività ordinaria",localEvent:local.event?.title||"Attività locale ordinaria",operationLevel:op.level,operationLabel:op.label};
 });
}
function ensure(){
 const host=document.querySelector(".me-live-marina");
 if(!host)return false;
 if(box&&box.isConnected&&box.closest(".me-live-marina")===host)return true;
 box=document.createElement("section");box.className="me-traffic-board";box.setAttribute("aria-label","Traffico e contratti marina");
 const vhf=host.querySelector(".me-live-vhf");
 if(vhf&&vhf.nextSibling)host.insertBefore(box,vhf.nextSibling);else host.appendChild(box);
 return true;
}
function formatCredits(n){return Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT")}
function render(){
 if(!ensure())return;
 const t=trafficSnapshot(),contracts=contractSnapshot(),w=t.world;
 const traffic=t.items.slice(0,5).map(x=>'<div class="me-traffic-row"><span>'+x.action+'</span><b>'+(x.featured?'★ ':'')+x.name+(x.featured&&x.relation?.level>1?' · '+x.relation.label:'')+'</b><em>'+x.kind+' · '+x.berth+(x.eta>0?' · '+x.eta+' min':'')+'</em></div>').join("");
 const contractHtml=contracts.map(c=>{
  const running=active?.id===c.dynamicId;
  const check=window.MarinaEmpireNpcEconomy?.canStart?.(c)||{ok:false,message:"Sistema incarichi non disponibile"};
  const disabled=!!active||!check.ok;
  return '<article class="me-contract"><strong>'+c.icon+' '+c.title+'</strong><p>'+c.worldEvent+' · '+formatCredits(c.reward)+' cr · prestigio +'+c.prestige+' · rep. +'+c.reputation+'</p><button type="button" data-dyn-contract="'+c.dynamicId+'" '+(disabled?'disabled':'')+'>'+(running?'IN CORSO':check.ok?'ACCETTA CONTRATTO':check.message)+'</button><div class="me-contract-progress"><span data-progress="'+c.dynamicId+'"></span></div><div class="me-contract-status">'+(running?'Operazione in corso':('Disponibile ora · '+c.duration+'s'))+'</div></article>';
 }).join("");
 const mem=window.MarinaEmpireMarinaMemory?.current?.()||null;
 const memText=mem?' · memoria traffico '+(mem.pressure>=1.2?'alta':mem.pressure>=1.02?'attiva':mem.pressure<.88?'bassa':'normale'):'';
 box.innerHTML='<div class="me-traffic-head"><strong>⚓ TRAFFICO 24/7 · '+t.volume+' UNITÀ ATTIVE</strong><span>'+((w.weather?.icon||"🌤️")+" "+(w.weather?.label||""))+'</span></div><div style="font-size:8px;color:#d6b575;margin:-2px 0 3px">Profilo marina · '+t.profile.label+memText+'</div><div style="font-size:8.5px;color:#f0cf8a;margin:0 0 3px">'+(t.local.event?.icon||"⚓")+' EVENTO LOCALE SIMULATO · '+(t.local.event?.title||"Attività ordinaria")+'</div><div style="font-size:8px;color:#8fb0bb;margin:0 0 7px">'+(t.local.event?.text||t.profile.description)+' · Operatività Lv.'+t.operation.level+' · '+t.operation.label+(t.operation.next>0?' · '+t.operation.next+' catene al prossimo livello':' · livello massimo')+'</div><div class="me-traffic-grid"><div class="me-traffic-list">'+traffic+'</div><div class="me-contract-list">'+contractHtml+'</div></div>';
 box.querySelectorAll("[data-dyn-contract]").forEach(btn=>btn.addEventListener("click",()=>start(btn.dataset.dynContract)));
}
function start(id){
 if(active)return;
 const c=contractSnapshot().find(x=>x.dynamicId===id);if(!c)return;
 const check=window.MarinaEmpireNpcEconomy?.canStart?.(c)||{ok:false,message:"Sistema incarichi non disponibile"};
 if(!check.ok){render();return;}
 active={id:c.dynamicId,contract:c,started:Date.now()};
 clearInterval(tickTimer);
 tickTimer=setInterval(()=>{
  if(!active){clearInterval(tickTimer);return}
  const elapsed=(Date.now()-active.started)/1000,p=Math.max(0,Math.min(100,elapsed/active.contract.duration*100));
  const bar=box?.querySelector('[data-progress="'+active.id+'"]');if(bar)bar.style.width=p+"%";
  const status=bar?.closest(".me-contract")?.querySelector(".me-contract-status");
  if(status)status.textContent=p>=100?"Registrazione incarico…":"Operazione in corso · "+Math.max(0,Math.ceil(active.contract.duration-elapsed))+"s";
  if(p>=100){
   clearInterval(tickTimer);tickTimer=null;
   const finished=active;active=null;
   const r=window.MarinaEmpireNpcEconomy?.complete?.(finished.contract,finished.id)||{ok:false,message:"Incarico non registrato"};
   if(status)status.textContent=r.ok?("Completato · netto +"+formatCredits(r.net)+" cr · rep. "+r.sector+" +"+r.reputation):(r.message||"Incarico non registrato");
   setTimeout(render,r.ok?2600:4200);
  }
 },400);
 render();
}
window.MarinaEmpireLiveTraffic={snapshot:trafficSnapshot,contracts:contractSnapshot,featuredVessel,vesselRelation};

function boot(){
 if(!ensure()){setTimeout(boot,700);return}
 render();
 clearInterval(refreshTimer);refreshTimer=setInterval(()=>{if(!active)render()},30000);
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{box=null;ensure();render()},80));
 window.addEventListener("marina-world-event",()=>{if(!active)render()});
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&!active)render()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();