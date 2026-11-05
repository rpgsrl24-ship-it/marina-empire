(()=>{
"use strict";
if(window.__ME_SPEC_CONTRACTS__)return;
window.__ME_SPEC_CONTRACTS__=true;

const style=document.createElement("style");
style.textContent=".me-spec-contract{margin:10px 0;padding:11px 12px;border:1px solid rgba(214,181,117,.42);border-radius:12px;background:linear-gradient(135deg,#0d3040,#172a36);position:relative;z-index:2;pointer-events:auto}.me-spec-contract strong{color:#f2d293}.me-spec-contract p{margin:4px 0;font-size:10px}.me-spec-contract-meta{display:flex;gap:7px;flex-wrap:wrap;font-size:9px;color:#a8bec7}.me-spec-contract button{margin-top:8px;padding:8px 10px;border-radius:9px;border:1px solid rgba(214,181,117,.5);background:#1e4656;color:#fff;pointer-events:auto;position:relative;z-index:3}.me-spec-contract-progress{height:5px;background:#173543;border-radius:99px;overflow:hidden;margin-top:8px}.me-spec-contract-progress span{display:block;height:100%;width:0;background:#d6b575}@media(max-width:740px){.me-spec-contract{margin:8px 9px!important;padding:10px!important;clear:both}.me-spec-contract button{display:block;width:100%;min-height:44px;margin-top:8px!important;white-space:normal}}";
document.head.appendChild(style);

let box=null,job=null,tick=null;
function host(){return document.querySelector(".me-live-marina")||document.getElementById("missionList")||document.querySelector("#missions .panel")}
function contract(){return window.MarinaEmpireSpecializationContracts?.current?.()||null}
function ensure(){const h=host();if(!h)return false;if(box&&box.isConnected)return true;box=document.createElement("div");box.className="me-spec-contract";h.appendChild(box);return true}
function render(){
 if(!ensure())return;
 const c=contract();
 if(!c){box.innerHTML="<strong>🎯 CONTRATTO SPECIALIZZAZIONE</strong><p>Scegli una specializzazione di carriera per ricevere incarichi esclusivi. Serve almeno reputazione 40 (Livello 2) in un settore.</p><button type=\"button\" class=\"me-spec-open-career\">SCEGLI / SBLOCCA SPECIALIZZAZIONE</button>";box.querySelector(".me-spec-open-career")?.addEventListener("click",openCareer);return;}
 const rarity=c.rank?.label||"Junior";
 const availability=c.available!==false;
 const spec=window.MarinaEmpireSpecialization?.get?.();
 const careerBonus=spec?.bonus||"Vantaggio carriera attivo";
 const nextValue=Number(c.rank?.next);
 const nextRank=Number.isFinite(nextValue)?" · prossimo rango a "+nextValue+" rep":" · rango massimo";
 const daily=dailyOpportunity(c);
 box.innerHTML='<strong>'+c.icon+' CONTRATTO ESCLUSIVO · '+c.label+'</strong><p>'+c.title+'</p><p style="color:#f0d29d"><b>Vantaggio carriera:</b> '+careerBonus+' · '+rarity+nextRank+'</p>'+(daily.available?'<p style="padding:7px 8px;border-radius:8px;background:rgba(214,181,117,.10);color:#ffe0a0"><b>⭐ OCCASIONE DEL GIORNO</b> · ricompensa +20% · reputazione +25% · valida una volta oggi.</p>':daily.claimed?'<p style="color:#8faab5"><b>✓ Occasione del giorno completata.</b> Nuova opportunità domani.</p>':'')+'<div class="me-spec-contract-meta"><span>CATENA · STEP '+c.stage+'/3</span><span>RARITÀ · '+rarity.toUpperCase()+'</span><span>'+c.type+'</span><span>⏱ '+c.duration+'s</span><span>Costo '+c.cost+'</span><span>Ricompensa '+c.reward+'</span><span>Prestigio +'+c.prestige+'</span><span>Rep. '+c.sector+' +'+c.reputation+'</span></div>'+(availability?'<button type="button" '+(job?'disabled':'')+'>'+(c.stage===3?'CHIUDI CONTRATTO FINALE':'ACCETTA STEP '+c.stage)+'</button>':'<p style="color:#f0c58e"><b>Nessun contratto '+rarity+' disponibile in questa finestra.</b> Controlla più tardi o cambia marina.</p>')+'<div class="me-spec-contract-progress"><span></span></div><p class="me-spec-contract-status">'+(job?'In corso':(c.stage===3?'Finale della catena disponibile':'Catena in corso · prossimo step '+c.stage))+'</p>';
 box.querySelector("button")?.addEventListener("click",accept);
}
function dayKey(){
 const d=new Date();
 return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function dailyOpportunity(c){
 if(!c?.key)return {available:false,claimed:false,key:""};
 const key=dayKey()+"|"+c.key;
 const claimed=Array.isArray(state?.specializationDailyClaims)&&state.specializationDailyClaims.includes(key);
 return {available:!claimed,claimed,key};
}
function applyDailyBoost(c){
 const d=dailyOpportunity(c);
 if(!d.available)return {...c,dailyOpportunity:false,dailyKey:d.key};
 return {...c,dailyOpportunity:true,dailyKey:d.key,reward:Math.round((Number(c.reward)||0)*1.20),reputation:Math.round((Number(c.reputation)||0)*1.25)};
}
function claimDaily(job){
 if(!job?.dailyOpportunity||!job.dailyKey)return true;
 if(typeof meAtomicPersist!=="function")return false;
 return meAtomicPersist(()=>{
  state.specializationDailyClaims=Array.isArray(state.specializationDailyClaims)?state.specializationDailyClaims:[];
  if(!state.specializationDailyClaims.includes(job.dailyKey))state.specializationDailyClaims=[...state.specializationDailyClaims,job.dailyKey].slice(-90);
 });
}
function openCareer(){
 try{
  if(window.MarinaEmpireMobileHome?.open)window.MarinaEmpireMobileHome.open("office");
  else if(typeof showTab==="function")showTab("office");
  setTimeout(()=>{const t=document.querySelector("[data-career-spec]")?.closest(".item")||document.getElementById("careerSpecStatus");t?.scrollIntoView({behavior:"smooth",block:"center"});},180);
 }catch(_){if(typeof showTab==="function")showTab("office")}
}
function accept(){
 if(job)return;
 const c=contract(),status=box.querySelector(".me-spec-contract-status");
 if(!c){status.textContent="Nessun contratto disponibile.";return;}
 const check=window.MarinaEmpireNpcEconomy?.canStart?.(c)||{ok:false,message:"Sistema incarichi non disponibile."};
 if(!check.ok){status.textContent=check.message||"Contratto non disponibile.";return;}
 job={...applyDailyBoost(c),id:"spec-"+c.key+"-"+Date.now(),started:Date.now()};
 clearInterval(tick);
 tick=setInterval(()=>{
  const elapsed=(Date.now()-job.started)/1000,p=Math.min(100,elapsed/job.duration*100);
  const bar=box.querySelector(".me-spec-contract-progress span");if(bar)bar.style.width=p+"%";
  if(status)status.textContent=p>=100?"Registrazione contratto…":"In corso · "+Math.max(0,Math.ceil(job.duration-elapsed))+"s";
  if(p>=100){
   clearInterval(tick);tick=null;
   const r=window.MarinaEmpireSpecializationContracts?.complete?.(job,job.id)||{ok:false,message:"Contratto non registrato."};
   if(r.ok&&job.dailyOpportunity)claimDaily(job);
   if(status)status.textContent=r.ok?(r.chainCompleted?("CATENA COMPLETATA · netto +"+r.net+" · bonus finale +"+(r.finaleBonus||0)+" · prestigio +"+r.prestige+(job.dailyOpportunity?" · ⭐ bonus giorno applicato":"")):("STEP "+(r.chainStage||job.stage)+" COMPLETATO · prossimo "+(r.chainNext||"—")+" · netto +"+r.net+(job.dailyOpportunity?" · ⭐ bonus giorno applicato":""))):(r.message||"Contratto non registrato.");
   setTimeout(()=>{job=null;render()},r.ok?3500:5000);
  }
 },500);
}
function boot(){if(!ensure()){setTimeout(boot,800);return;}render();window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{box=null;ensure();render()},80));window.addEventListener("marina-world-event",()=>{if(!job)render()});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();