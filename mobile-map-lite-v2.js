(()=>{
"use strict";
const ports=[
{id:"rose",name:"Isola delle Rose"},{id:"rimini",name:"Rimini"},{id:"ancona",name:"Ancona"},{id:"lignano",name:"Lignano"},{id:"cervia",name:"Cervia"},{id:"bari",name:"Bari"},{id:"ravenna",name:"Marina di Ravenna"},{id:"pescara",name:"Marina di Pescara"},{id:"brindisi",name:"Marina di Brindisi"},{id:"salerno",name:"Marina d’Arechi — Salerno"},{id:"nettuno",name:"Marina di Nettuno"},{id:"scarlino",name:"Marina di Scarlino"},{id:"loano",name:"Marina di Loano"},{id:"portocervo",name:"Marina di Porto Cervo"},{id:"capodorlando",name:"Marina di Capo d’Orlando"}];
const boats=[
{id:"voyager",name:"RPG Academy 8",tank:400,burn:.85,knots:18,mult:1,crew:0},
{id:"open",name:"RPG Open 7",tank:300,burn:.75,knots:26,mult:1.3,crew:160},
{id:"yacht",name:"RPG Cruiser 12",tank:550,burn:.92,knots:22,mult:1.9,crew:420},
{id:"yacht14",name:"RPG Prestige 14",tank:700,burn:.98,knots:24,mult:2.05,crew:550},
{id:"yacht20",name:"RPG Elite 20",tank:1100,burn:1.05,knots:20,mult:2.3,crew:850},
{id:"yacht30",name:"RPG Majesty 30",tank:1700,burn:1.12,knots:17,mult:2.55,crew:1250},
{id:"luna",name:"RPG Imperial 60",tank:900,burn:1.18,knots:14,mult:2.7,crew:1500}];
const harborGPS={rose:[43.7,14.5],rimini:[44.071,12.579],ancona:[43.615,13.514],lignano:[45.680,13.148],cervia:[44.259,12.368],bari:[41.133,16.864],ravenna:[44.493,12.282],pescara:[42.46,14.23],brindisi:[40.65,17.97],salerno:[40.63,14.84],nettuno:[41.46,12.66],scarlino:[42.89,10.78],loano:[44.12,8.26],portocervo:[41.13,9.53],capodorlando:[38.15,14.74]};
const illustrated={rose:[69,32.47],rimini:[55.4,29.41],ancona:[60.3,34.47],lignano:[56.7,22.35],cervia:[54.8,25.41],bari:[86.7,57.88],ravenna:[46.1,26.94],pescara:[60.8,42.59],brindisi:[89.2,56.59],salerno:[65.5,56.71],nettuno:[48.9,50.35],scarlino:[34.7,39.29],loano:[15.6,29.88],portocervo:[25.2,52.82],capodorlando:[64.7,75.76]};
const coastal={lignano:[45.56,13.35],ravenna:[44.47,12.49],cervia:[44.24,12.57],rimini:[44.06,12.78],ancona:[43.61,13.77],rose:[43.7,14.5],pescara:[42.46,14.48],bari:[41.15,17.18],brindisi:[40.68,18.17],loano:[44.07,8.14],scarlino:[42.82,10.65],nettuno:[41.42,12.55],salerno:[40.52,14.78],portocervo:[41.19,9.75],capodorlando:[38.19,14.59]};
const ad=new Set(["rose","rimini","ancona","lignano","cervia","bari","ravenna","pescara","brindisi"]);
const adSpine=[[45.42,13.65],[44.65,13.30],[43.9,13.35],[43.15,14.2],[42.45,14.7],[41.7,16.2],[40.8,18.5],[39.65,19.25]];
const tySpine=[[44,8],[43.4,9.65],[42.7,10.4],[41.9,11.6],[41.25,12.75],[40.5,13.6],[39.4,13.9],[38.33,15.65]];
const corr={otranto:[39.65,19.25],ionian:[37.55,17.5],messinaSouth:[37.95,15.7],messinaNorth:[38.33,15.65]};
function straight(a,b){const rad=Math.PI/180,dLat=(b[0]-a[0])*rad,dLon=(b[1]-a[1])*rad,lat1=a[0]*rad,lat2=b[0]*rad;const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;return 3440.065*2*Math.asin(Math.min(1,Math.sqrt(h)))}
function nearest(p,arr){return arr.reduce((best,v,i)=>straight(p,v)<straight(p,arr[best])?i:best,0)}
function chain(p,q,spine){const i=nearest(p,spine),j=nearest(q,spine);return i<=j?spine.slice(i,j+1):spine.slice(j,i+1).reverse()}
function waypoints(a,b){const A=coastal[a],B=coastal[b];if(!A||!B)return[];const aa=ad.has(a),bb=ad.has(b);if(aa&&bb)return chain(A,B,adSpine);if(!aa&&!bb)return chain(A,B,tySpine);const x=aa?A:B,y=aa?B:A;const mid=[...chain(x,corr.otranto,adSpine),corr.ionian,corr.messinaSouth,corr.messinaNorth,...chain(corr.messinaNorth,y,tySpine)];return aa?mid:mid.reverse()}
function routePoints(a,b){const A=harborGPS[a],B=harborGPS[b];if(!A||!B)return[];if(a===b)return[A];const dep=coastal[a],arr=coastal[b];if(!dep||!arr)return[A,...waypoints(a,b),B];const nearby=ad.has(a)&&ad.has(b)&&straight(dep,arr)<=95;const pts=[A,dep,...(nearby?[]:waypoints(a,b)),arr,B];return pts.filter((p,i)=>!i||straight(p,pts[i-1])>0)}
function seaMiles(a,b){const pts=routePoints(a,b);return pts.slice(1).reduce((n,p,i)=>n+straight(pts[i],p),0)}
function plan(from,to,tank,burn){const cap=Math.max(1,Number(tank)||1),reserve=Math.ceil(cap*.15),rate=Number(burn)||.85;if(!harborGPS[from]||!harborGPS[to]||from===to)return{possible:false,distance:0,reason:"Destinazione non valida",stops:[],legs:[]};const ids=ports.map(p=>p.id),dist=Object.fromEntries(ids.map(id=>[id,Infinity])),prev={},seen=new Set();dist[from]=0;while(seen.size<ids.length){const cur=ids.filter(id=>!seen.has(id)).sort((a,b)=>dist[a]-dist[b])[0];if(!cur||!Number.isFinite(dist[cur]))break;if(cur===to)break;seen.add(cur);for(const next of ids){if(next===cur||seen.has(next))continue;const nm=seaMiles(cur,next);if(!nm||Math.ceil(nm*rate)+reserve>cap)continue;const c=dist[cur]+nm;if(c<dist[next]){dist[next]=c;prev[next]=cur}}}if(!Number.isFinite(dist[to]))return{possible:false,distance:seaMiles(from,to),reason:"Autonomia insufficiente",stops:[],legs:[]};const legs=[to];let c=to;while(c!==from&&legs.length<=ids.length){c=prev[c];if(!c)break;legs.unshift(c)};if(legs[0]!==from)return{possible:false,distance:0,reason:"Rotta non disponibile",stops:[],legs:[]};const distance=legs.slice(1).reduce((sum,id,i)=>sum+seaMiles(legs[i],id),0),fuel=legs.slice(1).reduce((sum,id,i)=>sum+Math.ceil(seaMiles(legs[i],id)*rate),0);return{possible:true,distance,fuel,stops:legs.slice(1,-1),legs,reserve,burnRate:rate}}
function project(lat,lon){return{x:(lon-6.2)/(19.4-6.2)*100,y:(48-lat)/(48-35)*100}}
function geoAt(from,to,progress){
 const points=routePoints(from,to);
 if(!points.length)return null;
 if(points.length===1)return points[0];
 const legs=points.slice(1).map((p,i)=>straight(points[i],p));
 const total=legs.reduce((sum,n)=>sum+n,0);
 if(!total)return points[0];
 let rem=Math.max(0,Math.min(1,Number(progress)||0))*total;
 for(let i=0;i<legs.length;i++){
  if(rem<=legs[i]||i===legs.length-1){
   const t=legs[i]?Math.max(0,Math.min(1,rem/legs[i])):0;
   return [points[i][0]+(points[i+1][0]-points[i][0])*t,points[i][1]+(points[i+1][1]-points[i][1])*t];
  }
  rem-=legs[i];
 }
 return points[points.length-1];
}
function positionAt(route,progress){
 if(!Array.isArray(route)||!route.length)return null;
 if(route.length===1)return route[0];
 const legs=route.slice(1).map((p,i)=>straight([48-route[i].y*13/100,6.2+route[i].x*13.2/100],[48-p.y*13/100,6.2+p.x*13.2/100]));
 const total=legs.reduce((a,b)=>a+b,0);
 if(!total)return route[0];
 let rem=Math.max(0,Math.min(1,Number(progress)||0))*total;
 for(let i=0;i<legs.length;i++){
  if(rem<=legs[i]||i===legs.length-1){
   const t=legs[i]?Math.max(0,Math.min(1,rem/legs[i])):0;
   return{x:route[i].x+(route[i+1].x-route[i].x)*t,y:route[i].y+(route[i+1].y-route[i].y)*t};
  }
  rem-=legs[i];
 }
 return route[route.length-1];
}
function getHandle(){const c=window.MarinaLocalSaveContext;if(!c)return null;let h=c.capture();if(!h){c.select(null);h=c.capture()}return h}
const DOCKING_STATE_VERSION=1;
function defaultGame(){return{name:"Comandante",coins:10000,prestige:0,fuel:300,condition:100,port:"rimini",boat:"voyager",owned:["voyager"],completed:[],trip:null,reservations:[],voyages:0,setupComplete:true,voyageSerial:0}}
function read(){
 const c=window.MarinaLocalSaveContext,h=getHandle();if(!c||!h)return null;
 let g=c.readGame(h);
 if(g){
   let changed=false;
   if(!Array.isArray(g.owned)){g.owned=[];changed=true}
   const selected=String(g.boat||"voyager");
   if(boats.some(x=>x.id===selected)&&!g.owned.includes(selected)){g.owned.push(selected);changed=true}
   if(!ports.some(p=>p.id===g.port)){g.port="rimini";changed=true}
   if(g.trip&&Number(g.trip.dockingVersion||0)<DOCKING_STATE_VERSION){
     const legacyArrived=!!g.trip.dockingReady||Number(g.trip.progressBase||0)>=.97||(Number(g.trip.until)||0)>0&&(Number(g.trip.until)||0)<=Date.now();
     if(legacyArrived){finalizeTrip(g,0,0,"RECUPERO");g.lastMissionRecoveryAt=Date.now();changed=true}
     else{g.trip.dockingVersion=DOCKING_STATE_VERSION;changed=true}
   }
   if(changed)c.writeGame(h,g);
   return g;
 }
 const fresh=defaultGame();if(c.writeGame(h,fresh))g=c.readGame(h);return g||fresh
}
function mutate(fn){
 const c=window.MarinaLocalSaveContext,h=getHandle();if(!c||!h)return false;
 const s=c.readGame(h);if(!s)return false;
 fn(s);return c.writeGame(h,s);
}
const throttleModes={
 eco:{id:"eco",label:"ECO",knots:12,speedMult:2/3,fuelMult:.67,rpm:1450,temp:72,wear:-1,lph:28},
 cruise:{id:"cruise",label:"CROCIERA",knots:18,speedMult:1,fuelMult:1,rpm:2150,temp:82,wear:0,lph:42},
 fast:{id:"fast",label:"FAST",knots:24,speedMult:4/3,fuelMult:1.38,rpm:2900,temp:91,wear:3,lph:58}
};
function throttleFor(t){return throttleModes[String(t?.throttleMode||"cruise")]||throttleModes.cruise}
function projectedTrip(t,now=Date.now()){
 const duration=Math.max(1,Number(t?.sec)||1),mode=throttleFor(t),saved=Math.max(0,Math.min(.97,Number(t?.progressBase)||0));
 if(t?.dockingReady)return{progress:.97,remainingSec:0,mode,harbor:true,effectiveKnots:0,effectiveRpm:0,effectiveTemp:Math.max(68,mode.temp-8),effectiveLph:3};
 const last=Math.max(0,Number(t?.lastProgressAt)||Number(t?.startedAt)||now),elapsed=Math.max(0,now-last);
 const harbor=saved<.15||saved>=.85;
 const phaseSpeed=harbor?Math.min(mode.speedMult,.34):mode.speedMult;
 const progress=Math.max(0,Math.min(.97,saved+elapsed/(duration*1000)*phaseSpeed));
 const remainingSec=Math.max(0,Math.ceil((.97-progress)*duration/Math.max(.01,phaseSpeed)));
 const effectiveKnots=harbor?Math.min(6,mode.knots):mode.knots;
 const effectiveRpm=harbor?Math.min(1100,mode.rpm):mode.rpm;
 const effectiveTemp=harbor?Math.max(68,mode.temp-8):mode.temp;
 const effectiveLph=harbor?Math.min(12,mode.lph):mode.lph;
 return{progress,remainingSec,mode,harbor,effectiveKnots,effectiveRpm,effectiveTemp,effectiveLph};
}
function settleTrip(g,now=Date.now()){
 const t=g?.trip;if(!t)return;
 const proj=projectedTrip(t,now),lastFuel=Math.max(0,Number(t.lastFuelAt)||Number(t.lastProgressAt)||Number(t.startedAt)||now);
 const fuelElapsed=Math.max(0,Math.min(now,lastFuel+proj.remainingSec*1000+600000)-lastFuel);
 const baseFuel=Math.max(0,Number(t.mission?.fuel)||0),duration=Math.max(1,Number(t.sec)||1);
 const fuelUse=baseFuel/duration*(fuelElapsed/1000)*proj.mode.fuelMult;
 if(fuelUse>0)g.fuel=Math.max(0,(Number(g.fuel)||0)-fuelUse);
 t.fuelUsed=Math.max(0,Number(t.fuelUsed)||0)+fuelUse;
 t.progressBase=proj.progress;t.lastProgressAt=now;t.lastFuelAt=now;
 t.until=now+proj.remainingSec*1000;
}
function tripView(s,b){
 const t=s?.trip;if(!t)return null;
 const proj=projectedTrip(t),progress=proj.progress,origin=String(t.origin||s.port),dest=String(t.dest||s.port),route=routePoints(origin,dest).map(([lat,lon])=>project(lat,lon));
 const distance=seaMiles(origin,dest),knots=proj.mode.knots;
 return {id:String(t.id||""),voyageId:Number(t.voyageId)||0,name:String(t.mission?.name||"Missione attiva"),origin,originName:(ports.find(x=>x.id===origin)||ports[1]).name,dest,destinationName:(ports.find(x=>x.id===dest)||ports[1]).name,reward:Number(t.mission?.reward)||0,prestige:Number(t.mission?.prestige)||0,progress,distance,cruiseKnots:proj.effectiveKnots??knots,etaMinutesReal:Math.max(1,Math.round((distance*(1-progress)/Math.max(1,proj.effectiveKnots||knots))*60)),remainingSec:proj.remainingSec,route,eventResolved:!!t.eventResolved,eventLabel:String(t.eventLabel||""),eventResult:String(t.eventResult||""),throttleMode:proj.mode.id,throttleLabel:proj.harbor?(t.dockingReady?"ORMEGGIO":"MANOVRA PORTO"):proj.mode.label,rpm:proj.effectiveRpm??proj.mode.rpm,temp:proj.effectiveTemp??proj.mode.temp,lph:proj.effectiveLph??proj.mode.lph,fuelMult:proj.mode.fuelMult,harbor:!!proj.harbor,dockingReady:!!t.dockingReady,dockingOffset:Number(t.dockingOffset)||0,dockingDepth:Math.max(0,Math.min(100,Number(t.dockingDepth)||0)),dockingHeading:Math.max(-45,Math.min(45,Number(t.dockingHeading)||0)),enginePort:Number(t.enginePort)||0,engineStarboard:Number(t.engineStarboard)||0,bowThruster:Number(t.bowThruster)||0,bowThrusterAvailable:["yacht14","yacht20","yacht30","luna"].includes(String(s.boat||"")),helmAngle:Math.max(-30,Math.min(30,Number(t.helmAngle)||0))};
}
function snapshot(){const s=read()||{coins:10000,prestige:0,fuel:300,condition:100,port:"rimini",boat:"voyager",owned:["voyager"],completed:[],voyages:0};const b=boats.find(x=>x.id===s.boat)||boats[0];return{state:s,tank:b.tank,boatName:b.name,ports:ports.map(p=>({id:p.id,name:p.name,x:illustrated[p.id]?.[0]??50,y:illustrated[p.id]?.[1]??50})),chartPorts:ports.map(p=>({id:p.id,name:p.name,...project(...harborGPS[p.id])})),trip:tripView(s,b)}}
function preview(dest){const shot=snapshot(),s=shot.state,b=boats.find(x=>x.id===s.boat)||boats[0],p=ports.find(x=>x.id===dest);if(!p||dest===s.port)return{ok:false,reason:"Seleziona una marina diversa"};const pl=plan(s.port,dest,b.tank,b.burn);const eta=Math.max(1,Math.round((pl.distance/b.knots)*60));const cost=Math.max(250,Math.round(pl.distance*7*b.mult))+b.crew;const reward=Math.max(1200,Math.round(pl.distance*20*b.mult));let fuelNow=Math.max(0,Math.min(b.tank,Number(s.fuel)||0)),refuel=0,ready=!!pl.possible&&!s.trip&&(Number(s.condition??100)>=30)&&(Array.isArray(s.owned)&&s.owned.includes(b.id));if(pl.possible){for(let i=0;i<pl.legs.length-1;i++){const req=Math.ceil(seaMiles(pl.legs[i],pl.legs[i+1])*b.burn);if(i>0){const liters=Math.max(0,req+pl.reserve-fuelNow);refuel+=liters*3;fuelNow+=liters}if(fuelNow<req+pl.reserve)ready=false;fuelNow-=Math.min(fuelNow,req)}}const total=cost+refuel;if(Number(s.coins)||0<total)ready=false;const route=routePoints(s.port,dest).map(([lat,lon])=>project(lat,lon));return{ok:pl.possible,reason:pl.reason||"",origin:s.port,originName:(ports.find(x=>x.id===s.port)||ports[1]).name,dest,destinationName:p.name,distance:pl.distance,fuel:pl.fuel,cruiseKnots:b.knots,etaMinutesReal:eta,route,mission:{id:"R_"+b.id+"_"+s.port+"_"+dest,name:"Trasferimento nautico verso "+p.name,reward,prestige:Math.max(15,Math.round(pl.distance*.4*b.mult)),ready,reason:ready?"":"Controlla carburante, crediti e stato yacht",total}}}

function missionCatalog(){
 const shot=snapshot(),s=shot.state,b=boats.find(x=>x.id===s.boat)||boats[0],originName=(ports.find(x=>x.id===s.port)||ports[1]).name;
 const list=[],reserve=Math.ceil(b.tank*.15);
 if(s.port==="rimini"&&b.id==="voyager"&&(Number(s.voyages)||0)===0&&!(Array.isArray(s.completed)&&s.completed.includes("INTRO_RIMINI_CERVIA"))){
   const dist=seaMiles("rimini","cervia"),fuelCost=Math.ceil(dist*b.burn),ready=!s.trip&&(Number(s.condition??100)>=30)&&(Number(s.fuel)||0)>=fuelCost+reserve;
   list.push({id:"INTRO_RIMINI_CERVIA",name:"PRIMA MISSIONE · RPG Academy 8 · Rimini - Cervia",service:"Academy",dest:"cervia",destination:"Cervia",origin:originName,reward:500,prestige:50,cost:0,total:0,fuel:fuelCost,distance:dist,boat:"voyager",ready,reason:ready?"":s.trip?(s.trip.dockingReady?"Completa l'ormeggio della missione attiva":"Completa prima la missione attiva"):"Controlla carburante e stato yacht"});
 }
 const introActive=s.port==="rimini"&&b.id==="voyager"&&(Number(s.voyages)||0)===0&&!(Array.isArray(s.completed)&&s.completed.includes("INTRO_RIMINI_CERVIA"));
 for(const p of ports){
   if(p.id===s.port)continue;
   if(introActive&&p.id==="cervia")continue;
   const distance=seaMiles(s.port,p.id),fuelCost=Math.ceil(distance*b.burn),cost=Math.max(250,Math.round(distance*7*b.mult))+b.crew,reward=Math.max(1200,Math.round(distance*20*b.mult)),prestige=Math.max(15,Math.round(distance*.4*b.mult));
   const direct=distance>0&&(fuelCost+reserve)<=b.tank;
   let ready=direct&&!s.trip&&(Number(s.condition??100)>=30)&&(Array.isArray(s.owned)&&s.owned.includes(b.id))&&(Number(s.fuel)||0)>=fuelCost+reserve&&(Number(s.coins)||0)>=cost;
   let reason="";
   if(!direct)reason="Serve una barca con maggiore autonomia";
   else if(s.trip)reason=s.trip.dockingReady?"Completa l'ormeggio della missione attiva":"Completa prima la missione attiva";
   else if((Number(s.condition??100))<30)reason="Manutenzione necessaria";
   else if((Number(s.fuel)||0)<fuelCost+reserve)reason="Carburante insufficiente · fai rifornimento in Marina";
   else if((Number(s.coins)||0)<cost)reason="Crediti insufficienti";
   list.push({id:"R_"+b.id+"_"+s.port+"_"+p.id,name:"Trasferimento nautico verso "+p.name,service:"Missione",dest:p.id,destination:p.name,origin:originName,reward,prestige,cost,total:cost,fuel:fuelCost,distance,boat:b.id,ready,reason});
 }
 return list.sort((a,b)=>Number(b.ready)-Number(a.ready)||Number(a.distance)-Number(b.distance));
}
function startMission(id,expectedDest){
 const before=read();if(before?.trip)return{ok:false,message:"Viaggio già in corso"};
 const mission=missionCatalog().find(m=>m.id===String(id||""));if(!mission)return{ok:false,message:"Missione non disponibile"};
 if(expectedDest&&String(mission.dest)!==String(expectedDest))return{ok:false,message:"Destinazione missione non coerente"};
 if(!mission.ready)return{ok:false,message:mission.reason||"Missione non pronta"};
 const ok=mutate(g=>{
   if(g.trip)throw new Error("Viaggio già in corso");
   const b=boats.find(x=>x.id===g.boat)||boats[0],duration=mission.id==="INTRO_RIMINI_CERVIA"?20:Math.max(20,Math.min(45,Math.round(mission.distance*.35)));
   g.setupComplete=true;g.homeMarina=g.homeMarina||g.port;g.investmentMarina=g.investmentMarina||g.port;
   g.coins=Math.max(0,Number(g.coins)||0)-Math.max(0,Number(mission.cost)||0);
   // Fuel is consumed progressively during navigation so throttle changes have a real effect.
   g.voyageSerial=Math.max(0,Number(g.voyageSerial)||0)+1;
   const now=Date.now();
   g.trip={dockingVersion:DOCKING_STATE_VERSION,voyageId:g.voyageSerial,id:mission.id,origin:g.port,dest:mission.dest,legs:[g.port,mission.dest],legIndex:0,legSeconds:duration,sec:duration,fuelRate:b.burn,weather:"calm",weatherWear:3,weatherLabel:"CALMO",eventResolved:false,eventLabel:"",eventResult:"",eventBonus:0,eventPrestige:0,eventWear:0,throttleMode:"cruise",helmAngle:0,progressBase:0,startedAt:now,lastProgressAt:now,lastFuelAt:now,fuelUsed:0,throttleWear:0,mission:{id:mission.id,name:mission.name,dest:mission.dest,boat:mission.boat,reward:mission.reward,cost:mission.cost,fuel:mission.fuel,prestige:mission.prestige,sec:duration},until:now+duration*1000};
 });
 if(!ok)return{ok:false,message:"Salvataggio della partenza non riuscito"};
 const saved=read(),trip=saved?.trip;
 if(!trip||String(trip.id)!==String(mission.id)||String(trip.dest)!==String(mission.dest))return{ok:false,message:"Partenza non confermata"};
 return{ok:true,snapshot:snapshot()};
}
function applyVoyageDecision(code){
 const choices={
  rescue:{label:"SOS VHF",result:"Hai deviato per prestare assistenza.",bonus:250,prestige:25,wear:2},
  coastguard:{label:"SOS VHF",result:"Hai coordinato il soccorso con la Guardia Costiera.",bonus:100,prestige:12,wear:0},
  safe:{label:"METEO",result:"Hai ridotto la velocità e protetto l'imbarcazione.",bonus:80,prestige:8,wear:-2},
  fast:{label:"METEO",result:"Hai mantenuto la velocità accettando maggiore usura.",bonus:180,prestige:5,wear:4},
  engineSlow:{label:"SALA MACCHINE",result:"Hai ridotto i giri e stabilizzato il motore.",bonus:120,prestige:10,wear:-1},
  enginePush:{label:"SALA MACCHINE",result:"Hai proseguito a piena potenza: consegna salva, ma maggiore usura.",bonus:260,prestige:6,wear:6},
  vipComfort:{label:"CHARTER VIP",result:"Hai privilegiato comfort e servizio del cliente.",bonus:160,prestige:22,wear:0},
  vipSpeed:{label:"CHARTER VIP",result:"Hai accettato la richiesta di arrivo rapido del cliente.",bonus:300,prestige:8,wear:3},
  cargoSecure:{label:"CARICO URGENTE",result:"Hai messo in sicurezza il carico e proseguito con cautela.",bonus:140,prestige:14,wear:0},
  cargoRush:{label:"CARICO URGENTE",result:"Hai mantenuto la tabella di marcia con il carico prioritario.",bonus:280,prestige:7,wear:4},
  patrolAssist:{label:"CONTROLLO IN MARE",result:"Hai collaborato con la pattuglia e completato il controllo.",bonus:110,prestige:20,wear:0},
  patrolContinue:{label:"CONTROLLO IN MARE",result:"Hai comunicato i dati via VHF e proseguito la missione.",bonus:190,prestige:6,wear:1},
  maydayRescue:{label:"EVENTO RARO · MAYDAY",result:"Hai completato un soccorso complesso in mare aperto.",bonus:700,prestige:55,wear:4},
  maydayRelay:{label:"EVENTO RARO · MAYDAY",result:"Hai coordinato un soccorso a distanza mantenendo la missione.",bonus:350,prestige:35,wear:0},
  seabobRecover:{label:"EVENTO RARO · RECUPERO",result:"Hai recuperato un Seabob disperso e lo hai riconsegnato al proprietario.",bonus:600,prestige:30,wear:1},
  seabobMark:{label:"EVENTO RARO · RECUPERO",result:"Hai segnalato la posizione del Seabob e proseguito la rotta.",bonus:280,prestige:18,wear:0},
  superyachtTender:{label:"EVENTO RARO · SUPERYACHT",result:"Hai effettuato un servizio tender VIP per un superyacht.",bonus:850,prestige:45,wear:2},
  superyachtDecline:{label:"EVENTO RARO · SUPERYACHT",result:"Hai rinunciato al servizio VIP per rispettare la missione principale.",bonus:300,prestige:12,wear:0},
  stormShelter:{label:"EVENTO RARO · TEMPESTA",result:"Hai cercato ridosso e superato la tempesta senza danni importanti.",bonus:420,prestige:40,wear:-2},
  stormCross:{label:"EVENTO RARO · TEMPESTA",result:"Hai attraversato la tempesta mantenendo la rotta.",bonus:900,prestige:25,wear:9}
 };
 const pick=choices[code];if(!pick)return{ok:false,message:"Scelta non valida"};
 let applied=false;
 const ok=mutate(g=>{
   if(!g.trip||g.trip.eventResolved)return;
   g.trip.eventResolved=true;g.trip.eventLabel=pick.label;g.trip.eventResult=pick.result;
   g.trip.eventBonus=Math.max(0,Number(g.trip.eventBonus)||0)+pick.bonus;
   g.trip.eventPrestige=Math.max(0,Number(g.trip.eventPrestige)||0)+pick.prestige;
   g.trip.eventWear=(Number(g.trip.eventWear)||0)+pick.wear;
   applied=true;
 });
 return ok&&applied?{ok:true,...pick}:{ok:false,message:"Evento già risolto o missione terminata"};
}
function setThrottle(modeId){
 const mode=throttleModes[String(modeId||"")];if(!mode)return{ok:false,message:"Modalità manetta non valida"};
 const before=read();if(!before?.trip)return{ok:false,message:"Manetta disponibile solo durante la navigazione"};
 if(before.trip.dockingReady)return{ok:false,message:"Motori al minimo: completa l'ormeggio"};
 const beforeProj=projectedTrip(before.trip);
 if((beforeProj.progress<.15||beforeProj.progress>=.85)&&mode.id==="fast")return{ok:false,message:"FAST non disponibile nelle acque portuali"};
 const current=throttleFor(before.trip),proj=projectedTrip(before.trip),baseFuel=Math.max(0,Number(before.trip.mission?.fuel)||0);
 const projectedFuel=baseFuel*Math.max(0,1-proj.progress)*mode.fuelMult/Math.max(.01,mode.speedMult);
 if((Number(before.fuel)||0)+.01<projectedFuel)return{ok:false,message:"Carburante insufficiente per mantenere "+mode.label};
 let applied=false;
 const ok=mutate(g=>{
   if(!g.trip)return;
   const now=Date.now();settleTrip(g,now);
   const old=throttleFor(g.trip),remaining=Math.max(0,1-(Number(g.trip.progressBase)||0));
   g.trip.throttleWear=Math.max(0,Number(g.trip.throttleWear)||0)+Math.max(0,mode.wear-old.wear)*remaining;
   g.trip.throttleMode=mode.id;
   const eta=Math.ceil(remaining*Math.max(1,Number(g.trip.sec)||1)/mode.speedMult);
   g.trip.until=now+eta*1000;
   applied=true;
 });
 return ok&&applied?{ok:true,mode:mode.id,label:mode.label,knots:mode.knots,rpm:mode.rpm,temp:mode.temp,lph:mode.lph,message:mode.label+" · "+mode.knots+" kn · "+mode.rpm+" RPM"}:{ok:false,message:"Cambio manetta non salvato"};
}
function finalizeTrip(g,dockingBonus=0,dockingPrestige=0,dockingGrade="STANDARD"){
 const trip=g.trip;if(!trip)return false;
 const m=trip.mission||{},id=String(trip.id||m.id||""),baseReward=Math.max(0,Number(m.reward)||0),basePrestige=Math.max(0,Number(m.prestige)||0),eventBonus=Math.max(0,Number(trip.eventBonus)||0),eventPrestige=Math.max(0,Number(trip.eventPrestige)||0),reward=baseReward+eventBonus+dockingBonus,prestige=basePrestige+eventPrestige+dockingPrestige,dest=String(m.dest||trip.dest||g.port);
 g.completed=Array.isArray(g.completed)?g.completed:[];g.settledVoyages=Array.isArray(g.settledVoyages)?g.settledVoyages:[];
 const voyageId=Number(trip.voyageId)||0,settled=voyageId>0&&g.settledVoyages.includes(voyageId);g.port=dest;
 if(!settled){
  if(id&&!g.completed.includes(id))g.completed.push(id);if(voyageId>0)g.settledVoyages.push(voyageId);
  g.coins=Math.max(0,Number(g.coins)||0)+reward;g.prestige=Math.max(0,Number(g.prestige)||0)+prestige;g.voyages=Math.max(0,Number(g.voyages)||0)+1;g.earnings=Math.max(0,Number(g.earnings)||0)+reward;
  g.condition=Math.max(0,Math.min(100,(Number(g.condition??100)||100)-Math.max(0,(Number(trip.weatherWear)||3)+(Number(trip.eventWear)||0)+(Number(trip.throttleWear)||0))));
  g.lastArrival={destination:dest,reward,baseReward,eventBonus,eventPrestige,dockingBonus,dockingPrestige,dockingGrade,eventLabel:String(trip.eventLabel||""),eventResult:String(trip.eventResult||""),crewBonus:0,charterBonus:0,charterRating:0,charterClient:"",charterTier:"",charterCareerTier:"",charterReturningClient:false,charterReputation:0,charterIncident:"",charterIncidentMatched:false,charterSpecialRequest:"",charterSpecialAccepted:false,charterSpecialMatched:false,charterClientLoyalty:"",prestige,weather:String(trip.weather||"calm"),at:Date.now(),voyageId,mission:String(m.name||"Missione completata"),emergency:false};
 }
 g.lastDockedBridge={origin:String(trip.origin||g.port),destination:dest,at:Date.now()};g.trip=null;return true;
}
function setHelm(angle){
 const s=read();if(!s?.trip)return{ok:false,message:"Timone disponibile solo durante una missione"};
 const a=Math.max(-30,Math.min(30,Math.round(Number(angle)||0)));
 const ok=mutate(g=>{if(g.trip)g.trip.helmAngle=a;});
 const side=a===0?"CENTRO":a<0?"SINISTRA":"DRITTA";
 return ok?{ok:true,angle:a,dockingOffset:null,message:"Timone "+side+(a?" "+Math.abs(a)+"°":"")}:{ok:false,message:"Comando timone non salvato"};
}
function applyDockingMotion(g){
 const t=g?.trip;if(!t?.dockingReady)return;
 const p=Math.max(-1,Math.min(1,Number(t.enginePort)||0)),s=Math.max(-1,Math.min(1,Number(t.engineStarboard)||0));
 let depth=Math.max(0,Math.min(100,Number(t.dockingDepth)||20));
 let offset=Math.max(-40,Math.min(40,Number(t.dockingOffset)||0));
 let heading=Math.max(-45,Math.min(45,Number(t.dockingHeading)||0));
 const avg=(p+s)/2,diff=p-s,helm=Math.max(-30,Math.min(30,Number(t.helmAngle)||0));
 depth=Math.max(0,Math.min(100,depth+avg*5.5));
 heading=Math.max(-45,Math.min(45,heading+diff*4.5));
 if(Math.abs(avg)>.01&&Math.abs(helm)>=5){
   heading=Math.max(-45,Math.min(45,heading+(helm/30)*3.2*Math.sign(avg)));
   offset=Math.max(-40,Math.min(40,offset+(helm/30)*1.4*Math.sign(avg)));
 }
 const bow=["yacht14","yacht20","yacht30","luna"].includes(String(g.boat||""))?Math.max(-1,Math.min(1,Number(t.bowThruster)||0)):0;
 if(bow){offset=Math.max(-40,Math.min(40,offset+bow*3.5));heading=Math.max(-45,Math.min(45,heading+bow*1.6));}
 t.dockingDepth=depth;t.dockingOffset=offset;t.dockingHeading=heading;
}
function setDockEngine(side,state){
 const s=read();if(!s?.trip?.dockingReady)return{ok:false,message:"Motori di manovra disponibili solo in ormeggio"};
 const v=Math.max(-1,Math.min(1,Math.round(Number(state)||0)));let view=null;
 const ok=mutate(g=>{if(!g.trip?.dockingReady)return;if(side==="port")g.trip.enginePort=v;else g.trip.engineStarboard=v;view={port:Number(g.trip.enginePort)||0,starboard:Number(g.trip.engineStarboard)||0,offset:Number(g.trip.dockingOffset)||0,depth:Number(g.trip.dockingDepth)||0,heading:Number(g.trip.dockingHeading)||0};});
 const label=v>0?"AVANTI":v<0?"INDIETRO":"FOLLE";
 return ok?{ok:true,...view,message:"Motore "+(side==="port"?"SX":"DX")+" "+label}:{ok:false,message:"Comando motore non salvato"};
}
function setBowThruster(state){
 const s=read();if(!s?.trip?.dockingReady)return{ok:false,message:"Elica di prua disponibile solo in ormeggio"};
 if(!["yacht14","yacht20","yacht30","luna"].includes(String(s.boat||"")))return{ok:false,message:"Questa imbarcazione non dispone di elica di prua"};
 const v=Math.max(-1,Math.min(1,Math.round(Number(state)||0)));let view=null;
 const ok=mutate(g=>{if(!g.trip?.dockingReady)return;g.trip.bowThruster=v;view={offset:Number(g.trip.dockingOffset)||0,depth:Number(g.trip.dockingDepth)||0,heading:Number(g.trip.dockingHeading)||0};});
 return ok?{ok:true,...view,message:v===0?"Elica di prua STOP":v<0?"Elica di prua SINISTRA":"Elica di prua DRITTA"}:{ok:false,message:"Comando elica di prua non salvato"};
}
function adjustDocking(delta){
 const s=read();if(!s?.trip?.dockingReady)return{ok:false,message:"Ormeggio non ancora disponibile"};
 let offset=0;const ok=mutate(g=>{if(!g.trip?.dockingReady)return;g.trip.dockingOffset=Math.max(-40,Math.min(40,(Number(g.trip.dockingOffset)||0)+Number(delta||0)));offset=g.trip.dockingOffset;});
 return ok?{ok:true,offset,message:Math.abs(offset)<=6?"Allineamento corretto: puoi ormeggiare.":offset<0?"Correggi ancora verso dritta.":"Correggi ancora verso sinistra."}:{ok:false,message:"Correzione non salvata"};
}
function completeDocking(){
 const s=read();if(!s?.trip?.dockingReady)return{ok:false,message:"Ormeggio non disponibile"};
 const offset=Math.abs(Number(s.trip.dockingOffset)||0),depth=Math.max(0,Math.min(100,Number(s.trip.dockingDepth)||0)),heading=Math.abs(Number(s.trip.dockingHeading)||0);
 if(Number(s.trip.enginePort)||Number(s.trip.engineStarboard)||Number(s.trip.bowThruster)||0)return{ok:false,message:"Metti motori ed elica di prua su FOLLE/STOP"};
 if(depth<78)return{ok:false,message:"Entra ancora nel posto barca"};
 if(offset>6)return{ok:false,message:"Barca non centrata nel posto barca"};
 if(heading>7)return{ok:false,message:"Raddrizza la barca prima di ormeggiare"};
 const perfect=offset<=2&&heading<=3&&depth>=88,grade=perfect?"PERFETTO":"BUONO",bonus=perfect?300:140,prestige=perfect?25:12;
 let done=false;const ok=mutate(g=>{if(!g.trip?.dockingReady)return;done=finalizeTrip(g,bonus,prestige,grade);});
 return ok&&done?{ok:true,grade,bonus,prestige,message:"Ormeggio "+grade.toLowerCase()+" completato"}:{ok:false,message:"Ormeggio non completato"};
}
function pulse(){
 const s=read();if(!s?.trip)return {active:false,snapshot:snapshot()};
 const now=Date.now();
 mutate(g=>{
   if(!g.trip)return;
   if(!g.trip.dockingReady)settleTrip(g,now);
   else{
     const last=Math.max(0,Number(g.trip.dockingLastAt)||0);
     if(!last||now-last>=650){applyDockingMotion(g);g.trip.dockingLastAt=now;}
   }
 });
 const fresh=read(),ft=fresh?.trip,proj=ft?projectedTrip(ft):null;
 if(ft&&!ft.dockingReady&&proj&&proj.progress>=.97){
   mutate(g=>{
     if(!g.trip)return;const ts=Date.now();
     g.trip.progressBase=.97;g.trip.lastProgressAt=ts;g.trip.lastFuelAt=ts;g.trip.until=ts;g.trip.dockingReady=true;g.trip.throttleMode="eco";
     if(!Number.isFinite(Number(g.trip.dockingOffset)))g.trip.dockingOffset=((Number(g.trip.voyageId)||1)*17%25)-12;
     if(!Number.isFinite(Number(g.trip.dockingDepth)))g.trip.dockingDepth=0;
     if(!Number.isFinite(Number(g.trip.dockingHeading)))g.trip.dockingHeading=((Number(g.trip.voyageId)||1)*9%13)-6;
     g.trip.enginePort=0;g.trip.engineStarboard=0;g.trip.bowThruster=0;g.trip.dockingLastAt=ts;
   });
 }
 return {active:!!read()?.trip,snapshot:snapshot()};
}
window.MarinaEmpireMapLite={snapshot,preview,read,pulse,missionCatalog,startMission,setThrottle,setHelm,setDockEngine,setBowThruster,adjustDocking,completeDocking,applyVoyageDecision,positionAt,routeFor:(from,to)=>routePoints(from,to).map(([lat,lon])=>project(lat,lon)),routeGeoFor:(from,to)=>routePoints(from,to).map(([lat,lon])=>[lat,lon]),positionGeoAt:(from,to,progress)=>geoAt(from,to,progress)};
})();