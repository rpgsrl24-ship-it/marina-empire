(()=>{
"use strict";
if(window.__ME_MOBILE_PROGRESSION_UNLOCKS_V1__)return;
window.__ME_MOBILE_PROGRESSION_UNLOCKS_V1__=true;

const style=document.createElement("style");
style.id="me-mobile-progression-unlocks-v1-style";
style.textContent=`
@media(max-width:899px){
 #meMobileGrowth{
   order:-13!important;margin:0!important;padding:10px 11px!important;
   border:1px solid rgba(205,166,96,.48)!important;border-radius:13px!important;
   background:linear-gradient(145deg,#092d3d,#072432)!important;
   box-shadow:0 7px 18px rgba(0,0,0,.22)!important
 }
 #meMobileGrowthHead{display:flex!important;justify-content:space-between!important;gap:8px!important;align-items:flex-start!important}
 #meMobileGrowthHead small{display:block!important;color:#8ea9b4!important;font-size:7px!important;font-weight:950!important;letter-spacing:.12em!important}
 #meMobileGrowthHead strong{display:block!important;margin-top:2px!important;color:#f3d598!important;font-size:13px!important;line-height:1.08!important}
 #meMobileGrowthStep{flex:0 0 auto!important;padding:5px 7px!important;border:1px solid rgba(214,181,117,.38)!important;border-radius:999px!important;color:#eacb8c!important;font-size:8px!important;font-weight:900!important}
 #meMobileGrowth p{margin:6px 0!important;color:#c3d4da!important;font-size:9px!important;line-height:1.3!important}
 #meMobileGrowthBar{height:5px!important;border-radius:99px!important;background:#173845!important;overflow:hidden!important;margin-top:7px!important}
 #meMobileGrowthBar i{display:block!important;height:100%!important;border-radius:99px!important;background:#d3ad62!important}
 #meMobileGrowthMeta{display:flex!important;justify-content:space-between!important;gap:8px!important;margin-top:5px!important;color:#8faab5!important;font-size:8px!important}
 #meMobileGrowthAction{width:100%!important;min-height:42px!important;margin-top:8px!important;padding:7px 9px!important;border:1px solid #d6b575!important;border-radius:9px!important;background:#123c4d!important;color:#f3d79c!important;font-size:9px!important;font-weight:950!important}
 #meMobileGrowthMilestones{display:flex!important;gap:4px!important;margin-top:8px!important}
 #meMobileGrowthMilestones i{display:block!important;flex:1!important;height:3px!important;border-radius:99px!important;background:#173845!important}
 #meMobileGrowthMilestones i.on{background:#d6b575!important}
}
@media(min-width:900px){#meMobileGrowth{display:none!important}}
`;
document.head.appendChild(style);

function num(v){return Math.max(0,Math.floor(Number(v)||0))}
function bestSectorRep(){
 const r=state?.sectorReputation&&typeof state.sectorReputation==="object"?Object.values(state.sectorReputation):[];
 return r.reduce((m,v)=>Math.max(m,num(v)),0);
}
function vhfCount(){return Array.isArray(state?.vhfJobs)?state.vhfJobs.length:0}
function boats(){return Array.isArray(state?.owned)?new Set(state.owned).size:0}
function specializationLabel(){
 const s=window.MarinaEmpireSpecialization?.get?.();
 if(!s)return "";
 const rank=window.MarinaEmpireSpecialization?.rankFor?.(s.key);
 return s.icon+" "+s.label+(rank?.label?" · "+rank.label:"");
}
function milestone(){
 const voyages=num(state?.voyages),jobs=vhfCount(),rep=bestSectorRep(),prestige=num(state?.prestige),fleet=boats();
 if(voyages<2)return {step:1,title:"Completa il tour iniziale",desc:"Concludi 2 missioni e prova Marina Live.",value:voyages,target:2,label:voyages+" / 2 missioni",action:"MISSIONI",panel:"missions"};
 if(jobs<5)return {step:2,title:"Diventa operatore di marina",desc:"Completa incarichi VHF per sbloccare Port Assistant e vantaggi locali.",value:jobs,target:5,label:jobs+" / 5 incarichi VHF",action:"MARINA LIVE",panel:"marinas"};
 if(rep<40)return {step:3,title:"Sblocca una specializzazione",desc:"Porta almeno un settore a 40 reputazione per scegliere la tua carriera.",value:rep,target:40,label:rep+" / 40 reputazione",action:"CRESCI REPUTAZIONE",panel:"marinas"};
 if(!String(state?.specialization||""))return {step:3,title:"Scegli la tua carriera",desc:"Hai raggiunto la reputazione richiesta. Ora scegli una specializzazione e sblocca i contratti esclusivi.",value:1,target:1,label:"Specializzazione disponibile",action:"SCEGLI SPECIALIZZAZIONE",panel:"office"};
 const armatureScore=Math.min(3,(voyages>=6?1:0)+(fleet>=2?1:0)+(prestige>=1000?1:0));
 if(armatureScore<3)return {step:4,title:"Diventa Armatore",desc:"Obiettivo carriera: 6 viaggi, 2 yacht e 1.000 prestigio.",value:armatureScore,target:3,label:(voyages>=6?"✓":"○")+" 6 viaggi · "+(fleet>=2?"✓":"○")+" 2 yacht · "+(prestige>=1000?"✓":"○")+" 1.000 prestigio",action:fleet<2?"FLOTTA":"MISSIONI",panel:fleet<2?"fleet":"missions"};
 const spec=specializationLabel();
 return {step:5,title:"Espandi il tuo impero",desc:(spec?spec+" attivo. ":"")+"Alterna missioni, Marina Live, mercato e attività per avanzare verso Operatore Nautico.",value:1,target:1,label:spec||"Carriera avanzata attiva",action:"DIREZIONE",panel:"office"};
}
function openPanel(id){
 if(window.MarinaEmpireMobileHome?.open){window.MarinaEmpireMobileHome.open(id);return}
 if(typeof showTab==="function")showTab(id);
}
function ensure(){
 if(typeof innerWidth!=="undefined"&&innerWidth>899)return null;
 const home=document.querySelector("#home .me-mobile-home-dashboard");if(!home)return null;
 let box=document.getElementById("meMobileGrowth");if(box)return box;
 box=document.createElement("section");box.id="meMobileGrowth";
 const services=document.getElementById("meMobileHomeServices");
 if(services)services.insertAdjacentElement("afterend",box);
 else {
  const daily=document.getElementById("meMobileDailyOps");
  if(daily)daily.insertAdjacentElement("beforebegin",box);
  else home.append(box);
 }
 box.addEventListener("click",e=>{
  if(e.target.closest("#meMobileGrowthAction"))openPanel(milestone().panel);
 });
 return box;
}
function render(){
 if(typeof state==="undefined"||!state?.name)return;
 const box=ensure();if(!box)return;
 const m=milestone(),pct=Math.max(0,Math.min(100,Math.round((m.value/Math.max(1,m.target))*100)));
 box.innerHTML='<div id="meMobileGrowthHead"><div><small>PROGRESSIONE COMANDANTE</small><strong>'+m.title+'</strong></div><span id="meMobileGrowthStep">FASE '+m.step+'/5</span></div>'+
  '<p>'+m.desc+'</p><div id="meMobileGrowthBar"><i style="width:'+pct+'%"></i></div>'+
  '<div id="meMobileGrowthMeta"><span>'+m.label+'</span><span>'+pct+'%</span></div>'+
  '<button type="button" id="meMobileGrowthAction">'+m.action+'</button>'+
  '<div id="meMobileGrowthMilestones">'+[1,2,3,4,5].map(i=>'<i class="'+(i<=m.step?'on':'')+'"></i>').join("")+'</div>';
}
window.MarinaEmpireMobileProgression={render,milestone};
function boot(){
 if(!ensure()){setTimeout(boot,500);return}
 render();
 window.addEventListener("marina-empire-updated",()=>setTimeout(render,60));
 window.addEventListener("marina-world-event",()=>setTimeout(render,60));
 setInterval(render,15000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();