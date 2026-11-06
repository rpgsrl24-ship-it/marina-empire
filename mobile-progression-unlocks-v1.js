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
 #meMobileArrivalReward{
   display:none!important;order:-14!important;margin:0!important;padding:10px 11px!important;
   border:1px solid rgba(101,205,173,.48)!important;border-radius:13px!important;
   background:linear-gradient(145deg,#0a3941,#072936)!important;
   box-shadow:0 7px 18px rgba(0,0,0,.22)!important
 }
 #meMobileArrivalReward.show{display:block!important}
 #meMobileArrivalReward small{display:block!important;color:#8fd8bf!important;font-size:7px!important;font-weight:950!important;letter-spacing:.12em!important}
 #meMobileArrivalReward strong{display:block!important;margin-top:2px!important;color:#f3d598!important;font-size:14px!important}
 #meMobileArrivalReward p{margin:6px 0!important;color:#cfe1e4!important;font-size:9px!important;line-height:1.3!important}
 #meMobileArrivalReward button{width:100%!important;min-height:42px!important;margin-top:7px!important;padding:7px 9px!important;border:1px solid #d6b575!important;border-radius:9px!important;background:#123c4d!important;color:#f3d79c!important;font-size:9px!important;font-weight:950!important}
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
 const voyages=num(state?.voyages),jobs=vhfCount(),rep=bestSectorRep(),guestJobs=num(state?.guestTrialJobsUsed);
 if(!window.meRegisteredPlayer){
  if(voyages===0)return {step:1,total:8,title:"Completa la prima missione",desc:"Salpa da Rimini e completa il primo viaggio.",value:0,target:1,label:"0 / 1 missione",action:"MISSIONI",panel:"missions"};
  if(voyages===1&&guestJobs<1)return {step:2,total:8,title:"Prova Marina Live",desc:"Completa 1 incarico VHF gratuito prima della seconda missione.",value:0,target:1,label:"0 / 1 incarico VHF",action:"MARINA LIVE",panel:"marinas"};
  if(voyages===1&&guestJobs>=1)return {step:3,total:8,title:"Completa la seconda missione",desc:"Hai provato Marina Live. Ora salpa di nuovo per concludere il tour.",value:1,target:2,label:"1 / 2 missioni",action:"SECONDA MISSIONE",panel:"missions"};
  if(voyages>=2)return {step:4,total:8,title:"Salva il tuo impero",desc:"Tour completato: registrati gratis per salvare e continuare.",value:1,target:1,label:"TOUR COMPLETO",action:"REGISTRATI",panel:"profile"};
 }
 const career=window.MarinaEmpireCareerPath?.snapshot?.();
 if(career?.next){
  const missing=career.missing||[];
  const first=missing[0];
  const done=Math.max(0,(career.next.requirements||[]).filter(x=>x.done).length);
  const total=Math.max(1,(career.next.requirements||[]).length);
  return {
   step:Math.max(1,Math.min(8,Number(career.current?.level)||1)),
   total:8,
   title:"Verso "+career.next.title,
   desc:career.next.focus,
   value:done,target:total,
   label:first?(first.label+" · "+Math.floor(first.value||0)+" / "+Math.floor(first.target||1)):"Obiettivi fase completati",
   action:first?("VAI A "+String(first.tab||"missions").toUpperCase()):"CONTINUA",
   panel:first?.tab||"missions"
  };
 }
 if(voyages<2)return {step:1,total:8,title:"Completa il tour iniziale",desc:"Concludi 2 missioni e prova Marina Live.",value:voyages,target:2,label:voyages+" / 2 missioni",action:"MISSIONI",panel:"missions"};
 if(jobs<5)return {step:2,total:8,title:"Diventa operatore di marina",desc:"Completa incarichi VHF per sbloccare Port Assistant e vantaggi locali.",value:jobs,target:5,label:jobs+" / 5 incarichi VHF",action:"MARINA LIVE",panel:"marinas"};
 if(rep<40)return {step:3,total:8,title:"Sblocca una specializzazione",desc:"Porta almeno un settore a 40 reputazione per scegliere la tua carriera.",value:rep,target:40,label:rep+" / 40 reputazione",action:"CRESCI REPUTAZIONE",panel:"marinas"};
 const spec=specializationLabel();
 return {step:8,total:8,title:"Marina Empire",desc:(spec?spec+" attivo. ":"")+"Continua a competere, gestire marine, yacht, equipaggi e attività nel mondo vivo.",value:1,target:1,label:"Carriera avanzata continua",action:"DIREZIONE",panel:"office"};
}function openPanel(id){
 if(window.MarinaEmpireMobileHome?.open){window.MarinaEmpireMobileHome.open(id);return}
 if(typeof showTab==="function")showTab(id);
}
function ensure(){
 if(typeof innerWidth!=="undefined"&&innerWidth>899)return null;
 const home=document.querySelector("#home .me-mobile-home-dashboard");if(!home)return null;
 if(!document.getElementById("meMobileArrivalReward")){
  const arrival=document.createElement("section");
  arrival.id="meMobileArrivalReward";
  arrival.innerHTML='<small>MISSIONE COMPLETATA</small><strong id="meMobileArrivalRewardTitle">Arrivo registrato</strong><p id="meMobileArrivalRewardText"></p><button type="button" id="meMobileArrivalRewardAction">CONTINUA</button>';
  arrival.querySelector("#meMobileArrivalRewardAction").addEventListener("click",()=>{
   const voyages=num(state?.voyages),guestJobs=num(state?.guestTrialJobsUsed);
   if(!window.meRegisteredPlayer&&voyages===1&&guestJobs<1){openPanel("marinas");return}
   if(!window.meRegisteredPlayer&&voyages===1&&guestJobs>=1){openPanel("missions");return}
   if(!window.meRegisteredPlayer&&voyages>=2){openPanel("profile");return}
   openPanel("marinas");
  });
  home.prepend(arrival);
 }
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
 const arrival=document.getElementById("meMobileArrivalReward");
 if(arrival){
  const a=state?.lastArrival,active=!!(a&&!state?.trip&&Number.isFinite(Number(a.at))&&Date.now()-Number(a.at)<15*60*1000);
  arrival.classList.toggle("show",active);
  if(active){
   const voyages=num(state?.voyages),guestJobs=num(state?.guestTrialJobsUsed);
   const title=document.getElementById("meMobileArrivalRewardTitle"),textEl=document.getElementById("meMobileArrivalRewardText"),btn=document.getElementById("meMobileArrivalRewardAction");
   if(title)title.textContent="⚓ "+String(typeof port==="function"?port(a.destination||state.port)?.name||"Marina":"Marina")+" · +"+num(a.reward).toLocaleString("it-IT")+" cr";
   if(textEl)textEl.textContent="Prestigio +"+num(a.prestige)+" · carburante "+num(state.fuel)+" L · stato yacht "+num(state.condition)+"%.";
   if(btn){
    if(!window.meRegisteredPlayer&&voyages===1&&guestJobs<1)btn.textContent="PROVA MARINA LIVE";
    else if(!window.meRegisteredPlayer&&voyages===1)btn.textContent="SECONDA MISSIONE";
    else if(!window.meRegisteredPlayer&&voyages>=2)btn.textContent="REGISTRATI E CONTINUA";
    else btn.textContent="APRI MARINA LIVE";
   }
  }
 }
 const m=milestone(),pct=Math.max(0,Math.min(100,Math.round((m.value/Math.max(1,m.target))*100)));
 box.innerHTML='<div id="meMobileGrowthHead"><div><small>PROGRESSIONE COMANDANTE</small><strong>'+m.title+'</strong></div><span id="meMobileGrowthStep">FASE '+m.step+'/'+(m.total||8)+'</span></div>'+
  '<p>'+m.desc+'</p><div id="meMobileGrowthBar"><i style="width:'+pct+'%"></i></div>'+
  '<div id="meMobileGrowthMeta"><span>'+m.label+'</span><span>'+pct+'%</span></div>'+
  '<button type="button" id="meMobileGrowthAction">'+m.action+'</button>'+
  '<div id="meMobileGrowthMilestones">'+Array.from({length:m.total||8},(_,x)=>x+1).map(i=>'<i class="'+(i<=m.step?'on':'')+'"></i>').join("")+'</div>';
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