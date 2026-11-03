(()=>{
"use strict";
if(window.__ME_LIVE_TRAFFIC__)return;
window.__ME_LIVE_TRAFFIC__=true;

const VESSELS=[
 ["M/Y Aurora","superyacht"],["S/Y Levante","vela"],["Riva 56","motor yacht"],
 ["M/Y Blue Star","yacht"],["Tender 18","tender"],["S/Y Maestrale","vela"],
 ["M/Y Riviera","superyacht"],["Pilot 07","pilotina"],["M/Y Adriatica","yacht"],
 ["S/Y Bora","vela"],["M/Y Serenissima","yacht"],["Riva 44","motor yacht"]
];
const CONTRACTS=[
 {id:"arrival",icon:"⚓",type:"Ormeggio",title:"Assistenza arrivo yacht",sector:"marina",cost:90,reward:330,prestige:8,reputation:5,duration:24},
 {id:"fuel",icon:"⛽",type:"Rifornimento",title:"Coordinamento fuel dock",sector:"marina",cost:120,reward:420,prestige:9,reputation:6,duration:26},
 {id:"tech",icon:"🔧",type:"Tecnica",title:"Intervento tecnico rapido",sector:"tecnica",cost:170,reward:610,prestige:14,reputation:8,duration:34,requiredSectorLevel:2},
 {id:"charter",icon:"🛥️",type:"Charter",title:"Preparazione charter urgente",sector:"charter",cost:210,reward:760,prestige:16,reputation:9,duration:38},
 {id:"vip",icon:"✨",type:"Servizio VIP",title:"Accoglienza ospiti premium",sector:"servizi",cost:180,reward:680,prestige:15,reputation:8,duration:32,requiredSectorLevel:2},
 {id:"broker",icon:"💼",type:"Brokerage",title:"Sea trial riservato",sector:"broker",cost:140,reward:570,prestige:13,reputation:7,duration:30,requiredSectorLevel:2}
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
 const key=portKey(),w=world(),op=operation(),seed=hash(key+"|traffic|"+slot(120000)),base=Math.max(.55,Math.min(1.8,Number(w.traffic)||1));
 const operationBoost=(Math.max(1,Number(op.level)||1)-1)*.35;
 const volume=Math.max(3,Math.min(10,Math.round(3+base*2.2+operationBoost)));
 const items=[];
 for(let i=0;i<volume;i++){
  const v=VESSELS[(seed+i*7)%VESSELS.length];
  const mode=((seed>>>((i%4)*4))+i)%3;
  const eta=3+((seed+i*13)%22);
  items.push({
   name:v[0],kind:v[1],
   action:mode===0?"IN ARRIVO":mode===1?"IN PARTENZA":"IN MANOVRA",
   eta,
   berth:"P"+(1+((seed+i*5)%12))
  });
 }
 return {items,volume,world:w,operation:op};
}
function contractSnapshot(){
 const key=portKey(),w=world(),stage=careerLevel(),t=trust(),op=operation(),seed=hash(key+"|contracts|"+slot());
 const order=[...CONTRACTS].sort((a,b)=>(hash(a.id+"|"+seed)%1000)-(hash(b.id+"|"+seed)%1000));
 const contractCount=Math.min(4,2+(Math.max(1,Number(op.level)||1)>=3?1:0)+(Math.max(1,Number(op.level)||1)>=5?1:0));
 return order.slice(0,contractCount).map((c,i)=>{
  const demand=Math.max(.85,Math.min(1.45,Number(w.demand)||1));
  const trustBonus=1+(Math.max(1,Number(t.level)||1)-1)*.035;
  const stageBonus=1+(stage-1)*.08;
  const operationBonus=1+(Math.max(1,Number(op.level)||1)-1)*.03;
  const reward=Math.round(c.reward*demand*trustBonus*stageBonus*operationBonus);
  const prestige=Math.round(c.prestige*(1+(stage-1)*.06));
  const reputation=Math.round(c.reputation*(1+(stage-1)*.05));
  return {...c,reward,prestige,reputation,
    dynamicId:"dyn-"+key+"-"+slot()+"-"+i+"-"+c.id,
    marina:key,worldEvent:w.event?.title||"Attività ordinaria",operationLevel:op.level,operationLabel:op.label};
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
 const traffic=t.items.slice(0,4).map(x=>'<div class="me-traffic-row"><span>'+x.action+'</span><b>'+x.name+'</b><em>'+x.berth+' · '+x.eta+' min</em></div>').join("");
 const contractHtml=contracts.map(c=>{
  const running=active?.id===c.dynamicId;
  const check=window.MarinaEmpireNpcEconomy?.canStart?.(c)||{ok:false,message:"Sistema incarichi non disponibile"};
  const disabled=!!active||!check.ok;
  return '<article class="me-contract"><strong>'+c.icon+' '+c.title+'</strong><p>'+c.worldEvent+' · '+formatCredits(c.reward)+' cr · prestigio +'+c.prestige+' · rep. +'+c.reputation+'</p><button type="button" data-dyn-contract="'+c.dynamicId+'" '+(disabled?'disabled':'')+'>'+(running?'IN CORSO':check.ok?'ACCETTA CONTRATTO':check.message)+'</button><div class="me-contract-progress"><span data-progress="'+c.dynamicId+'"></span></div><div class="me-contract-status">'+(running?'Operazione in corso':('Disponibile ora · '+c.duration+'s'))+'</div></article>';
 }).join("");
 box.innerHTML='<div class="me-traffic-head"><strong>⚓ TRAFFICO 24/7 · '+t.volume+' UNITÀ ATTIVE</strong><span>'+((w.weather?.icon||"🌤️")+" "+(w.weather?.label||""))+'</span></div><div style="font-size:8px;color:#8fb0bb;margin:-2px 0 7px">Operatività marina Lv.'+t.operation.level+' · '+t.operation.label+(t.operation.next>0?' · '+t.operation.next+' catene al prossimo livello':' · livello massimo')+'</div><div class="me-traffic-grid"><div class="me-traffic-list">'+traffic+'</div><div class="me-contract-list">'+contractHtml+'</div></div>';
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
window.MarinaEmpireLiveTraffic={snapshot:trafficSnapshot,contracts:contractSnapshot};

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