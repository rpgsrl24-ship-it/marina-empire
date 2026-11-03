(()=>{
"use strict";
if(window.__ME_SPEC_CONTRACTS__)return;
window.__ME_SPEC_CONTRACTS__=true;

const style=document.createElement("style");
style.textContent=".me-spec-contract{margin:10px 0;padding:11px 12px;border:1px solid rgba(214,181,117,.42);border-radius:12px;background:linear-gradient(135deg,#0d3040,#172a36)}.me-spec-contract strong{color:#f2d293}.me-spec-contract p{margin:4px 0;font-size:10px}.me-spec-contract-meta{display:flex;gap:7px;flex-wrap:wrap;font-size:9px;color:#a8bec7}.me-spec-contract button{margin-top:8px;padding:8px 10px;border-radius:9px;border:1px solid rgba(214,181,117,.5);background:#1e4656;color:#fff}.me-spec-contract-progress{height:5px;background:#173543;border-radius:99px;overflow:hidden;margin-top:8px}.me-spec-contract-progress span{display:block;height:100%;width:0;background:#d6b575}";
document.head.appendChild(style);

let box=null,job=null,tick=null;
function host(){return document.querySelector(".me-live-marina")||document.getElementById("missionList")||document.querySelector("#missions .panel")}
function contract(){return window.MarinaEmpireSpecializationContracts?.current?.()||null}
function ensure(){const h=host();if(!h)return false;if(box&&box.isConnected)return true;box=document.createElement("div");box.className="me-spec-contract";h.appendChild(box);return true}
function render(){
 if(!ensure())return;
 const c=contract();
 if(!c){box.innerHTML="<strong>🎯 CONTRATTO SPECIALIZZAZIONE</strong><p>Scegli una specializzazione di carriera per ricevere incarichi esclusivi.</p>";return;}
 const rarity=c.rank?.label||"Junior";
 const availability=c.available!==false;
 box.innerHTML='<strong>'+c.icon+' CONTRATTO ESCLUSIVO · '+c.label+'</strong><p>'+c.title+'</p><div class="me-spec-contract-meta"><span>CATENA · STEP '+c.stage+'/3</span><span>RARITÀ · '+rarity.toUpperCase()+'</span><span>'+c.type+'</span><span>⏱ '+c.duration+'s</span><span>Costo '+c.cost+'</span><span>Ricompensa '+c.reward+'</span><span>Prestigio +'+c.prestige+'</span><span>Rep. '+c.sector+' +'+c.reputation+'</span></div>'+(availability?'<button type="button" '+(job?'disabled':'')+'>'+(c.stage===3?'CHIUDI CONTRATTO FINALE':'ACCETTA STEP '+c.stage)+'</button>':'<p style="color:#f0c58e"><b>Nessun contratto '+rarity+' disponibile in questa finestra.</b> Controlla più tardi o cambia marina.</p>')+'<div class="me-spec-contract-progress"><span></span></div><p class="me-spec-contract-status">'+(job?'In corso':(c.stage===3?'Finale della catena disponibile':'Catena in corso · prossimo step '+c.stage))+'</p>';
 box.querySelector("button")?.addEventListener("click",accept);
}
function accept(){
 if(job)return;
 const c=contract(),status=box.querySelector(".me-spec-contract-status");
 if(!c){status.textContent="Nessun contratto disponibile.";return;}
 const check=window.MarinaEmpireNpcEconomy?.canStart?.(c)||{ok:false,message:"Sistema incarichi non disponibile."};
 if(!check.ok){status.textContent=check.message||"Contratto non disponibile.";return;}
 job={...c,id:"spec-"+c.key+"-"+Date.now(),started:Date.now()};
 clearInterval(tick);
 tick=setInterval(()=>{
  const elapsed=(Date.now()-job.started)/1000,p=Math.min(100,elapsed/job.duration*100);
  const bar=box.querySelector(".me-spec-contract-progress span");if(bar)bar.style.width=p+"%";
  if(status)status.textContent=p>=100?"Registrazione contratto…":"In corso · "+Math.max(0,Math.ceil(job.duration-elapsed))+"s";
  if(p>=100){
   clearInterval(tick);tick=null;
   const r=window.MarinaEmpireSpecializationContracts?.complete?.(job,job.id)||{ok:false,message:"Contratto non registrato."};
   if(status)status.textContent=r.ok?(r.chainCompleted?("CATENA COMPLETATA · netto +"+r.net+" · bonus finale +"+(r.finaleBonus||0)+" · prestigio +"+r.prestige):("STEP "+(r.chainStage||job.stage)+" COMPLETATO · prossimo "+(r.chainNext||"—")+" · netto +"+r.net)):(r.message||"Contratto non registrato.");
   setTimeout(()=>{job=null;render()},r.ok?3500:5000);
  }
 },500);
}
function boot(){if(!ensure()){setTimeout(boot,800);return;}render();window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{box=null;ensure();render()},80));window.addEventListener("marina-world-event",()=>{if(!job)render()});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();