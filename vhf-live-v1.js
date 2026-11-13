(()=>{
"use strict";
if(window.MarinaEmpireVHF)return;
const CALLS=Object.freeze([
 Object.freeze({type:"BERTH",icon:"⚓",channel:"CH 09",title:"ASSISTENZA ORMEGGIO",message:"Yacht Aurora in ingresso. Richiesto supporto al pontile e conferma posto barca.",reward:220,prestige:8,duration:5}),
 Object.freeze({type:"SERVICE",icon:"⛽",channel:"CH 12",title:"SUPPORTO FUEL DOCK",message:"Fuel dock operativo: richiesta assistenza per rifornimento prioritario e controllo sicurezza.",reward:320,prestige:12,duration:6}),
 Object.freeze({type:"VIP",icon:"👑",channel:"CH 72",title:"ARRIVO VIP",message:"Tender ospiti VIP in avvicinamento. Richiesta accoglienza e coordinamento accesso riservato.",reward:480,prestige:18,duration:8}),
 Object.freeze({type:"EMERGENCY",icon:"🚨",channel:"CH 16",title:"URGENZA IN MARINA",message:"Imbarcazione con avaria leggera in ingresso. Richiesto supporto immediato e messa in sicurezza.",reward:700,prestige:30,duration:10})
]);
function ctx(){const c=window.MarinaLocalSaveContext;if(!c)return null;let h=c.capture();if(!h){c.select(null);h=c.capture()}return h?{c,h}:null}
function read(){const x=ctx();return x?.c?.readGame?.(x.h)||null}
function write(g){const x=ctx();return !!(x&&x.c.writeGame(x.h,g))}
function dayKey(now=Date.now()){
 try{return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(now))}
 catch(_){return new Date(now).toISOString().slice(0,10)}
}
function hash(s){let h=2166136261;for(const ch of String(s||"")){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function resolved(game,id){return Array.isArray(game?.vhfHistory)&&game.vhfHistory.some(x=>x&&x.id===id)}
function make(game){
 const voyages=Math.max(0,Math.floor(Number(game?.voyages)||0)),port=String(game?.port||"rimini");
 if(voyages<1||game?.trip)return null;
 const seed=dayKey()+"|"+port+"|"+voyages,template=CALLS[hash(seed)%CALLS.length];
 return Object.freeze({
  id:"VHF_"+dayKey().replaceAll("-","")+"_"+port+"_"+voyages+"_"+template.type,
  port,voyages,type:template.type,icon:template.icon,channel:template.channel,title:template.title,message:template.message,
  reward:template.reward,prestige:template.prestige,duration:template.duration
 });
}
function current(){
 const game=read();if(!game)return{ok:false,state:"unavailable",message:"Salvataggio non disponibile"};
 const active=game.vhfActiveCall;
 if(active&&active.id){
  const wait=Math.max(0,(Number(active.readyAt)||0)-Date.now());
  return{ok:true,state:wait>0?"active_wait":"active_ready",call:Object.freeze({...active,waitMs:wait}),message:wait>0?"Intervento in corso":"Intervento pronto per la chiusura"};
 }
 if(game.trip)return{ok:true,state:"sailing",message:"Canale VHF in ascolto durante la navigazione."};
 const call=make(game);
 if(!call)return{ok:true,state:"locked",message:"Completa il primo viaggio per attivare Radio VHF Live."};
 if(resolved(game,call.id))return{ok:true,state:"resolved",call,message:"Chiamata gestita. Una nuova richiesta potrà arrivare dopo il prossimo viaggio."};
 return{ok:true,state:"available",call,message:"Nuova chiamata VHF ricevuta."};
}
function accept(){
 const game=read();if(!game)return{ok:false,message:"Salvataggio non disponibile"};
 if(game.vhfActiveCall?.id)return{ok:false,message:"Hai già un intervento VHF attivo"};
 const call=make(game);if(!call)return{ok:false,message:"Nessuna chiamata disponibile"};
 if(resolved(game,call.id))return{ok:false,message:"Questa chiamata è già stata gestita"};
 const active={...call,acceptedAt:Date.now(),readyAt:Date.now()+Math.max(3,Number(call.duration)||5)*1000};
 game.vhfActiveCall=active;
 if(!write(game))return{ok:false,message:"Impossibile salvare l'intervento"};
 return{ok:true,message:"Chiamata accettata · "+call.title,call:active};
}
function ignore(){
 const game=read();if(!game)return{ok:false,message:"Salvataggio non disponibile"};
 if(game.vhfActiveCall?.id)return{ok:false,message:"L'intervento è già stato accettato"};
 const call=make(game);if(!call)return{ok:false,message:"Nessuna chiamata disponibile"};
 game.vhfHistory=Array.isArray(game.vhfHistory)?game.vhfHistory:[];
 if(!resolved(game,call.id))game.vhfHistory.push({id:call.id,status:"ignored",type:call.type,port:call.port,at:Date.now()});
 game.vhfHistory=game.vhfHistory.slice(-60);
 if(!write(game))return{ok:false,message:"Impossibile salvare la scelta"};
 return{ok:true,message:"Chiamata ignorata. Il canale resta in ascolto.",call};
}
function complete(){
 const game=read();if(!game)return{ok:false,message:"Salvataggio non disponibile"};
 const call=game.vhfActiveCall;if(!call?.id)return{ok:false,message:"Nessun intervento VHF attivo"};
 if(game.trip)return{ok:false,message:"Completa prima la navigazione"};
 if(String(game.port||"")!==String(call.port||""))return{ok:false,message:"Torna nella marina della chiamata per chiudere l'intervento"};
 const wait=Math.max(0,(Number(call.readyAt)||0)-Date.now());
 if(wait>0)return{ok:false,message:"Intervento in corso · ancora "+Math.max(1,Math.ceil(wait/1000))+" s",waitMs:wait};
 game.vhfHistory=Array.isArray(game.vhfHistory)?game.vhfHistory:[];
 if(resolved(game,call.id)){game.vhfActiveCall=null;write(game);return{ok:false,message:"Intervento già accreditato"}}
 const reward=Math.max(0,Number(call.reward)||0),prestige=Math.max(0,Number(call.prestige)||0),port=String(call.port||game.port||"rimini");
 game.coins=Math.max(0,Number(game.coins)||0)+reward;
 game.prestige=Math.max(0,Number(game.prestige)||0)+prestige;
 game.marinaOperations=game.marinaOperations||{};
 const raw=game.marinaOperations[port]||{};
 game.marinaOperations[port]={...raw,completed:Math.max(0,Number(raw.completed)||0)+1};
 game.vhfCompleted=Math.max(0,Number(game.vhfCompleted)||0)+1;
 game.vhfHistory.push({id:call.id,status:"completed",type:call.type,port,reward,prestige,at:Date.now()});
 game.vhfHistory=game.vhfHistory.slice(-60);
 game.lastVhfCall={id:call.id,type:call.type,title:call.title,port,reward,prestige,at:Date.now()};
 game.vhfActiveCall=null;
 if(!write(game))return{ok:false,message:"Salvataggio intervento non confermato"};
 const saved=read();
 if(!saved||!resolved(saved,call.id))return{ok:false,message:"Accredito VHF non confermato"};
 return{ok:true,message:"Intervento VHF completato · +"+reward+" crediti · +"+prestige+" prestigio",reward,prestige,call};
}
window.MarinaEmpireVHF=Object.freeze({calls:CALLS,current,accept,ignore,complete,read,dayKey});
})();