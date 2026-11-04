(()=>{"use strict";if(window.__ME_EVENT_CHAINS__)return;window.__ME_EVENT_CHAINS__=true;
const CHAINS=[
{id:"vip",icon:"✨",title:"OPERAZIONE VIP",duration:14400000,trigger:["vip_arrivals"],stages:[
{id:"arrival",label:"ARRIVO VIP",text:"Superyacht in ingresso e coordinamento banchina.",traffic:1.18,demand:1.12,service:1.08,vhf:"Port Control: arrivo VIP in avvicinamento, predisporre assistenza ormeggio."},
{id:"access",label:"GESTIONE ACCESSI",text:"Coordinamento area ospiti e servizi dedicati.",traffic:1.02,demand:1.18,service:1.18,vhf:"Marina Staff: area ospiti attiva, servizi dedicati in corso."},
{id:"provision",label:"PROVISIONING",text:"Cambusa, toys e servizi ospiti in preparazione.",traffic:.98,demand:1.24,service:1.22,vhf:"Marina Service: provisioning VIP in corso, priorità servizi premium."},
{id:"departure",label:"PARTENZA VIP",text:"Preparazione partenza e liberazione ormeggio.",traffic:1.16,demand:1.08,service:1.02,vhf:"Port Control: partenza VIP prevista a breve, mantenere libero il canale."}]},
{id:"weather",icon:"🌊",title:"SEQUENZA METEO TECNICA",duration:12600000,trigger:["rough"],stages:[
{id:"warning",label:"ALLERTA METEO",text:"Mare mosso e traffico ridotto in ingresso.",traffic:.72,demand:1.08,service:1.08,vhf:"VHF Meteo: mare mosso, ridurre velocità e verificare gli ormeggi."},
{id:"technical",label:"PICCO TECNICO",text:"Aumentano controlli, riparazioni e richieste assistenza.",traffic:.84,demand:1.2,service:1.28,vhf:"Marina Service: aumento richieste tecniche dopo il peggioramento meteo."},
{id:"delay",label:"RITARDI OPERATIVI",text:"Partenze ritardate e finestre di manovra ristrette.",traffic:.9,demand:1.12,service:1.14,vhf:"Port Control: partenze ritardate, attendere nuova finestra operativa."},
{id:"recovery",label:"RIAPERTURA FLUSSO",text:"Riprendono partenze e servizi arretrati.",traffic:1.12,demand:1.1,service:1.12,vhf:"Port Control: traffico in ripresa, priorità alle unità in attesa."}]},
{id:"charter",icon:"🛥️",title:"TURNAROUND CHARTER",duration:14400000,trigger:["charter_boom","toy_weekend"],stages:[
{id:"returns",label:"RIENTRI CHARTER",text:"Più yacht rientrano contemporaneamente.",traffic:1.18,demand:1.08,service:1.1,vhf:"Port Control: rientri charter multipli, assistenza ormeggio richiesta."},
{id:"service",label:"TURNAROUND SERVIZI",text:"Fuel, pulizia e controlli rapidi concentrati.",traffic:.94,demand:1.18,service:1.28,vhf:"Marina Staff: fuel e servizi charter in priorità."},
{id:"guests",label:"NUOVI OSPITI",text:"Transfer, cambusa e toys per nuove partenze.",traffic:1.02,demand:1.24,service:1.2,vhf:"Marina Service: nuovi ospiti in arrivo, provisioning e toys richiesti."},
{id:"departures",label:"ONDATA PARTENZE",text:"Nuove partenze aumentano il traffico in uscita.",traffic:1.24,demand:1.08,service:1.02,vhf:"Port Control: ondata partenze charter, mantenere libero il canale di uscita."}]}];
const st=document.createElement("style");st.id="me-event-chain-style";st.textContent=".me-event-chain{margin:8px 0;padding:9px 10px;border:1px solid rgba(214,181,117,.32);border-radius:10px;background:#0b2935}.me-event-chain-head{display:flex;justify-content:space-between;gap:8px}.me-event-chain-head strong{font-size:9px;color:#f1d397}.me-event-chain-head span{font-size:8px;color:#8faab4}.me-event-chain p{margin:5px 0;font-size:8.5px;color:#bdd0d6}.me-event-chain small{font-size:8px;color:#829da7}";document.head.appendChild(st);
let box=null;function port(){try{return String(state?.port||"rimini").toLowerCase()}catch(_){return"rimini"}}
function store(){if(typeof state==="undefined"||!state)return null;if(!state.marinaEventChains||typeof state.marinaEventChains!=="object")state.marinaEventChains={};return state.marinaEventChains}
function chainById(id){return CHAINS.find(c=>c.id===id)||null}
function choose(key=port()){
 const now=Date.now(),s=store(),saved=s?.[key];
 if(saved&&Number(saved.until)>now){
  const chain=chainById(saved.id);
  if(chain){
   const stageDur=chain.duration/chain.stages.length,idx=Math.min(chain.stages.length-1,Math.max(0,Math.floor((now-Number(saved.start))/stageDur)));
   return {...chain,start:Number(saved.start),until:Number(saved.until),stage:{...chain.stages[idx],index:idx,until:Number(saved.start)+(idx+1)*stageDur}};
  }
 }
 const w=window.MarinaEmpireWorldEvents?.modifiers?.(key)||{},eventId=w.event?.id,weatherId=w.weather?.id;
 const chain=CHAINS.find(c=>c.trigger.includes(eventId))||CHAINS.find(c=>c.trigger.includes(weatherId));
 if(!chain){if(saved&&s){delete s[key];try{if(typeof persist==="function")persist()}catch(_){}}return null}
 const start=now,until=start+chain.duration;
 if(s){s[key]={id:chain.id,start,until,trigger:eventId||weatherId||"",createdAt:now};try{if(typeof persist==="function")persist()}catch(_){}}
 return {...chain,start,until,stage:{...chain.stages[0],index:0,until:start+chain.duration/chain.stages.length}};
}
function modifiers(){const c=choose();return c?{traffic:c.stage.traffic,demand:c.stage.demand,service:c.stage.service,chain:c}:{traffic:1,demand:1,service:1,chain:null}}
function left(until){const m=Math.max(0,Math.ceil((until-Date.now())/60000));return m>=60?Math.floor(m/60)+"h "+(m%60)+"m":m+" min"}
function ensure(){const host=document.querySelector(".me-live-marina");if(!host)return false;if(box&&box.isConnected)return true;box=document.createElement("div");box.className="me-event-chain";box.id="meEventChain";host.appendChild(box);return true}
function draw(){if(!ensure())return;const c=choose();if(!c){box.style.display="none";return}box.style.display="";const next=c.stages[c.stage.index+1];box.innerHTML='<div class="me-event-chain-head"><strong>'+c.icon+' '+c.title+' · '+c.stage.label+'</strong><span>'+left(c.stage.until)+'</span></div><p>'+c.stage.text+'</p><small>'+(next?'Prossima fase: '+next.label+'.':'Sequenza in chiusura.')+'</small>'}
function boot(){if(typeof state==="undefined"||!state){setTimeout(boot,700);return}draw();setInterval(draw,60000);window.addEventListener("marina-world-event",draw);window.addEventListener("marina-empire-updated",()=>setTimeout(draw,80))}
window.MarinaEmpireEventChains={current:choose,modifiers};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();})();