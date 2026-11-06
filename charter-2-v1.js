(()=>{
"use strict";
if(window.__ME_CHARTER_2_V1__)return;
window.__ME_CHARTER_2_V1__=true;

const TIERS={
 standard:{label:"Standard",icon:"⚓",cost:0,rating:0,reward:.00,text:"Servizio essenziale, nessun costo extra."},
 premium:{label:"Premium",icon:"✨",cost:350,rating:.35,reward:.05,text:"Provisioning migliore e attenzione ospiti."},
 luxury:{label:"Luxury",icon:"👑",cost:800,rating:.70,reward:.10,text:"Servizio VIP, provisioning e concierge completi."}
};
const CLIENTS=[
 {id:"family",label:"Famiglia",icon:"👨‍👩‍👧",pref:"comfort",need:"Comfort, puntualità e servizio semplice"},
 {id:"corporate",label:"Corporate",icon:"💼",pref:"precision",need:"Puntualità, privacy e organizzazione"},
 {id:"vip",label:"VIP",icon:"🥂",pref:"luxury",need:"Privacy, servizio premium e cura dei dettagli"},
 {id:"honeymoon",label:"Honeymoon",icon:"💍",pref:"hospitality",need:"Atmosfera, comfort e servizio personale"},
 {id:"event",label:"Evento",icon:"🎉",pref:"service",need:"Coordinamento, ospitalità e puntualità"},
 {id:"influencer",label:"Creator / Influencer",icon:"📸",pref:"experience",need:"Esperienza memorabile e servizio impeccabile"}
];
const SPECIAL_REQUESTS=[
 {id:"menu",icon:"🍽️",title:"Menu personalizzato",text:"Gli ospiti chiedono una cambusa dedicata.",cost:120,bonus:.04,rating:.16,bestFocus:"hospitality",minTier:"premium"},
 {id:"privacy",icon:"🔒",title:"Privacy totale",text:"Cliente VIP: accessi ridotti e massima discrezione.",cost:180,bonus:.05,rating:.18,bestFocus:"hospitality",minTier:"luxury"},
 {id:"schedule",icon:"⏱️",title:"Orario prioritario",text:"Arrivo puntuale richiesto per un appuntamento a terra.",cost:90,bonus:.035,rating:.14,bestFocus:"navigation",minTier:"standard"},
 {id:"toys",icon:"🏄",title:"Water toys pronti",text:"Gli ospiti vogliono SUP, Seabob ed e-foil disponibili.",cost:160,bonus:.05,rating:.17,bestFocus:"hospitality",minTier:"premium"},
 {id:"technical",icon:"🔧",title:"Comfort tecnico premium",text:"Richiesta massima affidabilità di bordo e impianti.",cost:140,bonus:.045,rating:.16,bestFocus:"technical",minTier:"premium"},
 {id:"content",icon:"📸",title:"Esperienza fotografica",text:"Il cliente vuole soste scenografiche e servizio dedicato.",cost:110,bonus:.04,rating:.15,bestFocus:"navigation",minTier:"premium"}
];
const TIER_ORDER={standard:1,premium:2,luxury:3};

const style=document.createElement("style");
style.id="me-charter2-style";
style.textContent=`
.me-charter2{margin:8px 0;padding:9px;border:1px solid rgba(214,181,117,.32);border-radius:10px;background:rgba(5,31,44,.55)}
.me-charter2-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.me-charter2-head b{color:#f2d293}.me-charter2 small{color:#91aab4}
.me-charter2-actions{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.me-charter2-actions button{flex:1 1 100px;min-height:38px;padding:6px;font-size:8px}
.me-charter2-actions button.on{border-color:#e2c17e;background:#173f50;color:#ffe0a0}.me-charter2-status{margin-top:6px;color:#e9cb8f;font-size:9px}
@media(max-width:740px){.me-charter2{padding:8px}.me-charter2-actions button{min-height:44px;font-size:9px}}
`;
document.head.appendChild(style);

function stateRef(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function isCharter(m){
 if(!m||String(m.id||"").startsWith("INTRO_"))return false;
 const service=String(m.service||m.name||"").toLowerCase();
 return String(m.boat||"voyager")!=="voyager" && /(charter|escursione|tour|crociere|evento|ospiti|vip)/i.test(service);
}
function profile(m){
 const seed=hash((m?.id||"")+"|"+(m?.dest||"")+"|"+(m?.client||""));
 const c=CLIENTS[seed%CLIENTS.length];
 return {...c,party:2+(seed%7),priority:(seed%3===0?"Alta":"Normale")};
}
function specialRequest(m){
 if(!isCharter(m))return null;
 const seed=hash((m?.id||"")+"|special|"+(m?.dest||""));
 return SPECIAL_REQUESTS[seed%SPECIAL_REQUESTS.length];
}
function prepFor(m){
 const s=stateRef();if(!s||!m)return null;
 const all=s.charterPrep&&typeof s.charterPrep==="object"?s.charterPrep:{};
 return all[m.id]||null;
}
function prepare(m,tierKey){
 const s=stateRef();if(!s||!m||!isCharter(m)||!TIERS[tierKey]||s.trip)return false;
 const tier=TIERS[tierKey],old=prepFor(m),already=Math.max(0,Number(old?.costPaid)||0),extra=Math.max(0,tier.cost-already);
 if((Number(s.coins)||0)<extra){if(typeof notice==="function")notice("Crediti insufficienti per la preparazione charter.");return false}
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{
  s.coins-=extra;
  s.charterPrep=s.charterPrep&&typeof s.charterPrep==="object"?s.charterPrep:{};
  s.charterPrep[m.id]={tier:tierKey,costPaid:already+extra,at:Date.now(),client:profile(m).id,specialAccepted:!!old?.specialAccepted,specialCostPaid:Math.max(0,Number(old?.specialCostPaid)||0)};
 }):false;
 if(!ok)return false;
 if(typeof render==="function")render();
 if(typeof notice==="function")notice("Charter preparato: "+tier.label+(extra?" · "+extra.toLocaleString("it-IT")+" crediti":""));
 window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"charter-prep"}}));
 return true;
}
function beforeLaunch(m){
 if(!isCharter(m))return {ok:true};
 const p=prepFor(m);
 if(!p||!TIERS[p.tier])return {ok:false,message:"Prima prepara il charter scegliendo Standard, Premium o Luxury."};
 return {ok:true,prep:p,tier:TIERS[p.tier],client:profile(m)};
}
function setSpecialRequest(m,accept){
 const s=stateRef();if(!s||!m||!isCharter(m)||s.trip)return false;
 const req=specialRequest(m),p=prepFor(m);
 if(!req){return false}
 if(!p||!TIERS[p.tier]){if(typeof notice==="function")notice("Prima scegli il livello di servizio del charter.");return false}
 const already=Math.max(0,Number(p.specialCostPaid)||0),extra=accept?Math.max(0,req.cost-already):0;
 if(accept&&(Number(s.coins)||0)<extra){if(typeof notice==="function")notice("Crediti insufficienti per la richiesta speciale.");return false}
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{
  if(accept)s.coins-=extra;
  p.specialAccepted=!!accept;
  p.specialCostPaid=accept?already+extra:already;
 }):false;
 if(!ok)return false;
 if(typeof render==="function")render();
 if(typeof notice==="function")notice(accept?"Richiesta speciale accettata: "+req.title:"Richiesta speciale non inclusa");
 window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"charter-special"}}));
 return true;
}
function specialOutcome(m,crew,tierKey){
 const req=specialRequest(m),p=prepFor(m);
 if(!req||!p?.specialAccepted)return {request:req,accepted:false,matched:false,rating:0,bonus:0};
 const tierOk=(TIER_ORDER[tierKey]||1)>=(TIER_ORDER[req.minTier]||1);
 const focusOk=String(crew?.focus||"balanced")===req.bestFocus;
 const matched=tierOk&&focusOk;
 return {request:req,accepted:true,matched,rating:matched?req.rating:-.18,bonus:matched?req.bonus:0};
}
function cardAddon(m){
 if(!isCharter(m))return "";
 const c=profile(m),p=prepFor(m),selected=p?.tier||"",req=specialRequest(m);
 return '<div class="me-charter2"><div class="me-charter2-head"><div><small>CHARTER 2.0 · PROFILO CLIENTE</small><b>'+c.icon+' '+c.label+' · '+c.party+' ospiti</b></div><small>Priorità '+c.priority+'</small></div><small>'+c.need+'</small><div class="me-charter2-actions">'+Object.entries(TIERS).map(([k,t])=>'<button type="button" data-charter-prep="'+k+'" data-charter-mission="'+String(m.id).replace(/"/g,"&quot;")+'" class="'+(selected===k?'on':'')+'">'+t.icon+' '+t.label+(t.cost?' · '+t.cost+' CR':' · 0 CR')+'</button>').join("")+'</div><div class="me-charter2-status">'+(selected?('Preparazione attiva: '+TIERS[selected].label+' · costo già sostenuto '+Math.max(0,Number(p.costPaid)||0).toLocaleString("it-IT")+' CR'):'Scegli il livello di servizio prima della partenza.')+'</div>'+(req?'<div class="me-charter2-status"><b>'+req.icon+' RICHIESTA SPECIALE · '+req.title+'</b><br>'+req.text+' · costo '+req.cost+' CR · consigliato '+req.minTier+' + assetto '+req.bestFocus+'.</div><div class="me-charter2-actions"><button type="button" data-charter-special="yes" data-charter-mission="'+String(m.id).replace(/"/g,"&quot;")+'" class="'+(p?.specialAccepted?'on':'')+'">ACCETTA RICHIESTA</button><button type="button" data-charter-special="no" data-charter-mission="'+String(m.id).replace(/"/g,"&quot;")+'">NON INCLUDERE</button></div>':'')+'</div>';
}
const INCIDENTS=[
 {id:"diet",icon:"🍽️",title:"Richiesta speciale cambusa",text:"Gli ospiti chiedono un menu diverso all'ultimo minuto.",best:"hospitality"},
 {id:"late",icon:"⏱️",title:"Cambio programma",text:"Il cliente modifica l'orario e chiede maggiore puntualità.",best:"navigation"},
 {id:"comfort",icon:"🛋️",title:"Comfort ospiti",text:"Un ospite segnala comfort insufficiente durante il viaggio.",best:"hospitality"},
 {id:"technical",icon:"🔧",title:"Piccola anomalia tecnica",text:"Serve attenzione dell'equipaggio per evitare disservizi.",best:"technical"},
 {id:"privacy",icon:"🔒",title:"Richiesta privacy VIP",text:"Il cliente chiede maggiore discrezione e gestione ospiti.",best:"hospitality"},
 {id:"weather",icon:"🌦️",title:"Meteo variabile",text:"Il piano va adattato senza compromettere l'esperienza.",best:"navigation"}
];
function incidentFor(m,trip){
 if(!isCharter(m))return null;
 const seed=hash((m.id||"")+"|"+(trip?.voyageId||0)+"|"+(trip?.weather||""));
 if(seed%100>=58)return null;
 return INCIDENTS[seed%INCIDENTS.length];
}
function incidentEffect(m,trip,crew){
 const incident=incidentFor(m,trip);if(!incident)return {incident:null,rating:0,bonus:0};
 const focus=String(crew?.focus||"balanced");
 const matched=focus===incident.best;
 return {incident,rating:matched?.18:-.12,bonus:matched?.025:0};
}
function charterStats(){
 const s=stateRef();
 const raw=s?.charterStats&&typeof s.charterStats==="object"?s.charterStats:{completed:0,ratingTotal:0,bestRating:0,repeatClients:0};
 const completed=Math.max(0,Number(raw.completed)||0);
 const avg=completed>0?Math.max(0,Number(raw.ratingTotal)||0)/completed:0;
 const rep=Math.max(0,Math.floor(Number(s?.sectorReputation?.charter)||0));
 const tier=rep>=120&&avg>=4.5?4:rep>=60&&avg>=4.2?3:rep>=25&&avg>=3.9?2:1;
 const label=tier===4?"Charter Elite":tier===3?"Luxury Charter":tier===2?"Charter Premium":"Charter Base";
 return {completed,avg:Math.round(avg*10)/10,bestRating:Number(raw.bestRating)||0,repeatClients:Math.max(0,Number(raw.repeatClients)||0),reputation:rep,tier,label};
}
function returningClient(m){
 const s=stateRef(),stats=charterStats();
 if(!isCharter(m)||stats.completed<2)return null;
 const seed=hash((m.id||"")+"|return|"+stats.completed+"|"+stats.reputation);
 if(seed%100>Math.min(72,18+stats.repeatClients*6+stats.tier*5))return null;
 const previous=s?.lastCharterReview;
 return previous?.client?{label:previous.client,bonus:.04,rating:.12}:null;
}
function progressionBonus(m){
 if(!isCharter(m))return {reward:1,prestige:1,label:""};
 const s=charterStats();
 const reward=1+(s.tier-1)*.04;
 const prestige=1+(s.tier-1)*.05;
 return {reward,prestige,label:s.label,tier:s.tier};
}
function arrivalResult(m,trip,crewReward){
 if(!isCharter(m))return null;
 const p=prepFor(m),tier=TIERS[p?.tier]||TIERS.standard,c=profile(m);
 const returning=returningClient(m),progress=progressionBonus(m);
 const crew=window.MarinaEmpireCrew?.snapshot?.(m.boat)||{level:1,morale:75,training:0,focus:"balanced"};
 const spec=window.MarinaEmpireSpecialization?.get?.();
 const incident=incidentEffect(m,trip,crew),special=specialOutcome(m,crew,p?.tier||"standard");
 let rating=3.25+tier.rating+(Math.max(1,Number(crew.level)||1)-1)*.09+Math.min(.25,(Number(crew.training)||0)*.05)+incident.rating+(returning?.rating||0)+special.rating;
 if(Number(crew.morale)>=90)rating+=.18;else if(Number(crew.morale)<55)rating-=.45;
 if(crew.focus==="hospitality")rating+=.28;
 if(spec?.key==="charter")rating+=.18;
 if(String(trip?.weather||"").toLowerCase().includes("storm"))rating-=.35;
 rating=Math.max(1,Math.min(5,Math.round(rating*10)/10));
 const ratingBoost=rating>=4.7?.12:rating>=4.3?.08:rating>=3.9?.04:0;
 const pct=Math.max(0,tier.reward+ratingBoost+incident.bonus+special.bonus+(returning?.bonus||0)+(progress.reward-1));
 const bonus=Math.round(Math.max(0,Number(crewReward)||0)*pct);
 const reputation=Math.max(3,Math.round((rating*2.2+(tier===TIERS.luxury?2:0))*progress.prestige));
 return {missionId:m.id,client:returning?{...c,label:returning.label}:c,returningClient:!!returning,careerTier:progress.label,careerTierLevel:progress.tier,tierKey:p?.tier||"standard",tierLabel:tier.label,rating,bonus,reputation,pct,incident:incident.incident,incidentMatched:!!(incident.incident&&incident.bonus>0),specialRequest:special.request,specialAccepted:special.accepted,specialMatched:special.matched};
}
function applyArrival(r){
 const s=stateRef();if(!s||!r)return;
 s.charterStats=s.charterStats&&typeof s.charterStats==="object"?s.charterStats:{completed:0,ratingTotal:0,bestRating:0,repeatClients:0};
 s.charterStats.completed=Math.max(0,Number(s.charterStats.completed)||0)+1;
 s.charterStats.ratingTotal=Math.max(0,Number(s.charterStats.ratingTotal)||0)+r.rating;
 s.charterStats.bestRating=Math.max(Number(s.charterStats.bestRating)||0,r.rating);
 if(r.rating>=4.5)s.charterStats.repeatClients=Math.max(0,Number(s.charterStats.repeatClients)||0)+1;
 if(r.returningClient)s.charterStats.returningCompleted=Math.max(0,Number(s.charterStats.returningCompleted)||0)+1;
 s.sectorReputation=s.sectorReputation&&typeof s.sectorReputation==="object"?s.sectorReputation:{};
 s.sectorReputation.charter=Math.max(0,Math.floor(Number(s.sectorReputation.charter)||0))+r.reputation;
 if(s.charterPrep&&typeof s.charterPrep==="object")delete s.charterPrep[r.missionId];
 s.lastCharterReview={missionId:r.missionId,client:r.client.label,rating:r.rating,tier:r.tierLabel,bonus:r.bonus,reputation:r.reputation,returningClient:!!r.returningClient,careerTier:r.careerTier||"",incident:r.incident?.title||"",incidentMatched:!!r.incidentMatched,specialRequest:r.specialRequest?.title||"",specialAccepted:!!r.specialAccepted,specialMatched:!!r.specialMatched,at:Date.now()};
}
document.addEventListener("click",e=>{
 const special=e.target.closest("[data-charter-special]");
 if(special){
  e.preventDefault();e.stopPropagation();
  try{const m=typeof findAvailableMission==="function"?findAvailableMission(special.dataset.charterMission):null;if(m)setSpecialRequest(m,special.dataset.charterSpecial==="yes")}catch(_){}
  return;
 }
 const b=e.target.closest("[data-charter-prep]");if(!b)return;
 e.preventDefault();e.stopPropagation();
 try{
  const m=typeof findAvailableMission==="function"?findAvailableMission(b.dataset.charterMission):null;
  if(m)prepare(m,b.dataset.charterPrep);
 }catch(_){}
});
window.MarinaEmpireCharter2={isCharter,profile,specialRequest,prepFor,prepare,setSpecialRequest,beforeLaunch,cardAddon,arrivalResult,applyArrival,incidentFor,charterStats,progressionBonus,returningClient,tiers:TIERS};
})();