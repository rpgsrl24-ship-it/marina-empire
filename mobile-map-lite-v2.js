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
// Modern crew: keeps the existing per-voyage salary model and old roster fields.
const CREW_ROLES={
 voyager:["Comandante"],open:["Comandante","Marinaio"],yacht:["Comandante","Marinaio","Hostess"],yacht14:["Comandante","Marinaio","Hostess"],
 yacht20:["Comandante","Marinaio","Chef","Hostess"],yacht30:["Comandante","Primo Ufficiale","Engineer","Chef","Hostess","Deckhand"],
 luna:["Comandante","Primo Ufficiale","Engineer","Chef","Chief Steward/ess","Deckhand","Deckhand"]
};
const CREW_CANDIDATES=[
 {id:"marco-riva",name:"Marco Riva",role:"Comandante",skill:72,salary:210},
 {id:"elena-conti",name:"Elena Conti",role:"Primo Ufficiale",skill:68,salary:185},
 {id:"luca-ferri",name:"Luca Ferri",role:"Engineer",skill:74,salary:195},
 {id:"sofia-moretti",name:"Sofia Moretti",role:"Hostess",skill:70,salary:165},
 {id:"ana-silva",name:"Ana Silva",role:"Chief Steward/ess",skill:78,salary:215},
 {id:"matteo-gallo",name:"Matteo Gallo",role:"Deckhand",skill:66,salary:145},
 {id:"giulia-romano",name:"Giulia Romano",role:"Chef",skill:73,salary:190},
 {id:"davide-serra",name:"Davide Serra",role:"Marinaio",skill:64,salary:135}
];
const CREW_FOCUS={balanced:"Bilanciato",navigation:"Navigazione",technical:"Tecnica",hospitality:"Ospiti"};
const CREW_RESERVE=2000;
const crewRecord=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{};
const crewInt=(v,fallback=0,min=0,max=100000)=>v!=null&&Number.isFinite(Number(v))?Math.max(min,Math.min(max,Math.floor(Number(v)))):fallback;
function crewOwned(g){return boats.filter(b=>Array.isArray(g?.owned)&&g.owned.includes(b.id))}
function crewUnlocked(g){return crewInt(g?.voyages)>=4||crewOwned(g).length>=2}
function crewProgress(g,id){const p=crewRecord(g?.crewProgress?.[id]);return{xp:crewInt(p.xp),morale:crewInt(p.morale,85,35,100),training:crewInt(p.training,0,0,5),focus:Object.hasOwn(CREW_FOCUS,p.focus)?p.focus:"balanced"}}
function crewRoster(g,b){
 const roles=CREW_ROLES[b.id],saved=Array.isArray(g?.crewRoster?.[b.id])?g.crewRoster[b.id]:[],seen=new Set();
 const share=Math.floor(b.crew/roles.length),remainder=b.crew-share*roles.length;
 return roles.map((role,slot)=>{
  const base=share+(slot===0?remainder:0),r=crewRecord(saved[slot]);
  const candidate=CREW_CANDIDATES.find(x=>x.id===r.id&&x.role===role&&!seen.has(x.id));
  if(candidate)seen.add(candidate.id);
  const xp=crewInt(r.xp),skill=candidate?Math.min(95,candidate.skill+Math.floor(xp/5)):50;
  return{slot,id:candidate?candidate.id:"default-"+b.id+"-"+slot,name:candidate?candidate.name:role,role,skill,salary:candidate?Math.max(base,candidate.salary):base,xp:candidate||r.id==="default-"+b.id+"-"+slot?xp:0,morale:crewInt(r.morale,85,35,100),default:!candidate};
 });
}
function crewInfo(g,id){
 const b=crewOwned(g).find(x=>x.id===id);if(!b)return null;
 const members=crewRoster(g,b),p=crewProgress(g,id),unlocked=crewUnlocked(g),level=p.xp>=30?5:p.xp>=18?4:p.xp>=10?3:p.xp>=4?2:1;
 const inUse=new Set(crewOwned(g).flatMap(x=>crewRoster(g,x).filter(m=>!m.default).map(m=>m.id)));
 const candidates=CREW_CANDIDATES.filter(c=>CREW_ROLES[id].includes(c.role)).map(c=>{
  const target=members.find(m=>m.role===c.role&&m.default);
  return{...c,fee:900+c.skill*12,slot:target?.slot??-1,salary:target?Math.max(c.salary,target.salary):c.salary,available:!!target&&!inUse.has(c.id),reason:inUse.has(c.id)?"Già ingaggiato nella flotta":!target?"Libera prima un posto del ruolo":"",};
 });
 return{boat:b.id,name:b.name,...p,level,members,candidates,unlocked,active:!!g.trip,payroll:members.reduce((n,m)=>n+m.salary,0)};
}
function crewBenefits(g,b,kind){
 const c=crewInfo(g,b.id);
 // The Academy voyage remains entirely free. Never change the baseline salary of untouched crews.
 if(kind==="academy")return{salary:0,bonusRate:0,wearMult:1,version:1};
 if(!c)return{salary:b.crew,bonusRate:0,wearMult:1,version:1};
 const skill=c.members.reduce((n,m)=>n+Math.max(0,m.skill-50),0)/c.members.length;
 const focus=c.focus==="navigation"&&["transfer","rescue","cargo","recovery"].includes(kind)?.025:c.focus==="hospitality"&&kind==="charter"?.03:0;
 const morale=Math.max(.35,c.morale/100);
 const bonusRate=c.unlocked?Math.min(.18,Math.max(0,(Math.min(.06,c.xp*.002)+c.training*.012+Math.min(.05,skill*.0018)+focus)*morale)):0;
 return{salary:c.payroll,bonusRate,wearMult:c.unlocked&&c.focus==="technical"?.9:1,version:1};
}
function crewSnapshot(id){
 const g=read();if(!g)return null;
 const selected=crewInfo(g,id||g.boat)||crewInfo(g,g.boat)||crewInfo(g,crewOwned(g)[0]?.id);
 if(!selected)return null;
 const b=boats.find(x=>x.id===selected.boat);
 return{...selected,coins:g.coins,voyages:crewInt(g.voyages),owned:crewOwned(g).map(x=>({id:x.id,name:x.name})),benefits:Object.fromEntries(["transfer","rescue","cargo","charter","recovery"].map(k=>[k,crewBenefits(g,b,k)]))};
}
function saveCrewProgress(g,id,p,members){
 g.crewProgress=crewRecord(g.crewProgress);g.crewProgress[id]=p;
 g.crewRoster=crewRecord(g.crewRoster);g.crewRoster[id]=members;
}
function crewAction(id,action,value){
 const ctx=window.MarinaLocalSaveContext,h=getHandle(),g=h&&ctx?.readGame(h);
 if(!g)return{ok:false,message:"Salvataggio non disponibile"};
 const c=crewInfo(g,id);if(!c)return{ok:false,message:"Imbarcazione non posseduta"};
 if(!c.unlocked)return{ok:false,message:"Completa 4 viaggi o acquista una seconda imbarcazione"};
 if(g.trip)return{ok:false,message:"Gestisci l'equipaggio dopo l'ormeggio"};
 const members=c.members,p={xp:c.xp,morale:c.morale,training:c.training,focus:c.focus};
 let cost=0,message="";
 if(action==="recruit"){
  const cand=c.candidates.find(x=>x.id===value);
  if(!cand?.available||cand.slot<0)return{ok:false,message:cand?.reason||"Candidato non disponibile"};
  cost=cand.fee;const slot=cand.slot;
  members[slot]={slot,id:cand.id,name:cand.name,role:cand.role,skill:cand.skill,salary:cand.salary,xp:0,morale:88,default:false};
  message=cand.name+" ingaggiato";
 }else if(action==="dismiss"){
  const slot=Number(value),m=members[slot];
  if(!Number.isInteger(slot)||!m||m.default)return{ok:false,message:"Nessun professionista da sostituire"};
  const b=boats.find(x=>x.id===id);
  const original=crewRoster({},b)[slot];members[slot]=original;message="Equipaggio standard ripristinato";
 }else if(action==="train"){
  if(p.training>=5)return{ok:false,message:"Addestramento già al massimo"};
  cost=800;p.training++;p.morale=Math.min(100,p.morale+5);message="Addestramento completato";
 }else if(action==="rest"){
  if(p.morale>=100&&members.every(m=>m.morale>=100))return{ok:false,message:"Equipaggio già riposato"};
  cost=250;p.morale=Math.min(100,p.morale+18);members.forEach(m=>m.morale=Math.min(100,m.morale+15));message="Equipaggio riposato";
 }else if(action==="focus"){
  if(!Object.hasOwn(CREW_FOCUS,value))return{ok:false,message:"Assetto non valido"};
  p.focus=value;message="Assetto: "+CREW_FOCUS[value];
 }else return{ok:false,message:"Operazione non valida"};
 if(!Number.isSafeInteger(g.coins)||cost&&g.coins-cost<CREW_RESERVE)return{ok:false,message:"Mantieni almeno 2.000 crediti di riserva"};
 g.coins-=cost;saveCrewProgress(g,id,p,members);
 if(cost)g.economyHistory=(Array.isArray(g.economyHistory)?g.economyHistory:[]).concat([{kind:"crew_"+action,id,amount:-cost,at:Date.now()}]).slice(-300);
 if(!ctx.writeGame(h,g))return{ok:false,message:"Salvataggio non confermato"};
 return{ok:true,cost,message:message+(cost?" · -"+cost.toLocaleString("it-IT")+" crediti":"")};
}
function crewComplete(g,id){
 const c=crewInfo(g,id);if(!c)return;
 const p={xp:c.xp+1,morale:Math.max(35,c.morale-(c.focus==="technical"?3:c.focus==="hospitality"?5:4)),training:c.training,focus:c.focus};
 const members=c.members.map(m=>({...m,xp:m.xp+1,morale:Math.max(35,m.morale-3)}));
 saveCrewProgress(g,id,p,members);
}

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
// Use the same distance-weighted route for both the chart and yacht position.
function gpsTrackFor(from,to,progress){
 const points=routePoints(from,to);
 if(points.length<2)return null;
 const legs=points.slice(1).map((p,i)=>straight(points[i],p)),total=legs.reduce((a,b)=>a+b,0);
 if(!total)return null;
 const fraction=Math.max(0,Math.min(1,Number(progress)||0)),distance=fraction*total;
 let remaining=distance,index=0;
 for(;index<legs.length-1&&remaining>legs[index];index++)remaining-=legs[index];
 const start=points[index],end=points[index+1],part=legs[index]?Math.max(0,Math.min(1,remaining/legs[index])):0;
 const position=[start[0]+(end[0]-start[0])*part,start[1]+(end[1]-start[1])*part];
 // Smooth the course around a waypoint without a north-facing reset at departure/arrival.
 const a=geoAt(from,to,Math.max(0,fraction-.012)),b=geoAt(from,to,Math.min(1,fraction+.012));
 const dx=(b[1]-a[1])*Math.cos((a[0]+b[0])*.5*Math.PI/180),dy=b[0]-a[0];
 const bearing=(Math.atan2(dx,dy)*180/Math.PI+360)%360;
 return {points,position,travelled:[...points.slice(0,index+1),position],remaining:[position,...points.slice(index+1)],bearing,distance,total};
}
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
 return {id:String(t.id||""),voyageId:Number(t.voyageId)||0,name:String(t.mission?.name||"Missione attiva"),origin,originName:(ports.find(x=>x.id===origin)||ports[1]).name,dest,destinationName:(ports.find(x=>x.id===dest)||ports[1]).name,reward:Number(t.mission?.reward)||0,prestige:Number(t.mission?.prestige)||0,progress,distance,cruiseKnots:proj.effectiveKnots??knots,etaMinutesReal:Math.max(1,Math.round((distance*(1-progress)/Math.max(1,proj.effectiveKnots||knots))*60)),remainingSec:proj.remainingSec,route,missionKind:String(t.mission?.kind||"transfer"),objective:specFor(t.mission?.kind)?.objective||"",objectiveBonus:specFor(t.mission?.kind)?.bonus||0,objectivePrestige:specFor(t.mission?.kind)?.prestige||0,objectiveDone:!!specFor(t.mission?.kind)?.success.includes(t.eventChoice),eventKey:eventKeyForTrip(t,s.prestige),eventResolved:!!t.eventResolved,eventLabel:String(t.eventLabel||""),eventResult:String(t.eventResult||""),throttleMode:proj.mode.id,throttleLabel:proj.harbor?(t.dockingReady?"ORMEGGIO":"MANOVRA PORTO"):proj.mode.label,rpm:proj.effectiveRpm??proj.mode.rpm,temp:proj.effectiveTemp??proj.mode.temp,lph:Math.round((proj.effectiveLph??proj.mode.lph)*(t.mission?.researchVersion===1&&t.mission.researchFuelMult===.9?.9:1)*10)/10,fuelMult:proj.mode.fuelMult,researchFuelMult:t.mission?.researchVersion===1&&t.mission.researchFuelMult===.9?.9:1,harbor:!!proj.harbor,dockingReady:!!t.dockingReady,dockingElapsedMs:t.dockingReady?dockingElapsed(t):0,dockingOffset:Number(t.dockingOffset)||0,dockingDepth:Math.max(0,Math.min(100,Number(t.dockingDepth)||0)),dockingHeading:wrapDockAngle(t.dockingHeading),dockingOrientation:dockOrientation(t),dockingHeadingError:dockHeadingError(t),dockingTurning:hasDockTurn(t),dockingAssistUsed:!!(t.dockingAssistUsed||t.dockingAssist),dockingManualMoved:!!t.dockingManualMoved,enginePort:Number(t.enginePort)||0,engineStarboard:Number(t.engineStarboard)||0,bowThruster:Number(t.bowThruster)||0,bowThrusterAvailable:true,bowThrusterPower:Math.round(bowPower(s.boat)*100),helmAngle:Math.max(-30,Math.min(30,Number(t.helmAngle)||0)),dockingAssist:!!t.dockingAssist,dockingSurge:Number(t.dockingSurge)||0,dockingSway:Number(t.dockingSway)||0,dockingYawRate:Number(t.dockingYawRate)||0,dockingWind:Number(t.dockingWind)||0,dockingWindSide:Number(t.dockingWindSide)||0,dockingCurrent:Number(t.dockingCurrent)||0,dockingCurrentSide:Number(t.dockingCurrentSide)||0,dockingContacts:Number(t.dockingContacts)||0};
}
function snapshot(){const s=read()||{coins:10000,prestige:0,fuel:300,condition:100,port:"rimini",boat:"voyager",owned:["voyager"],completed:[],voyages:0};const b=boats.find(x=>x.id===s.boat)||boats[0];return{state:s,tank:b.tank,boatName:b.name,ports:ports.map(p=>({id:p.id,name:p.name,x:illustrated[p.id]?.[0]??50,y:illustrated[p.id]?.[1]??50})),chartPorts:ports.map(p=>({id:p.id,name:p.name,...project(...harborGPS[p.id])})),trip:tripView(s,b)}}
function researchEffects(g,now=Date.now()){return window.MarinaResearchBenefits?.effects(g,now)||{fuel:1,wear:1,berth:1,cost:1}}
function preview(dest){const shot=snapshot(),s=shot.state,b=boats.find(x=>x.id===s.boat)||boats[0],p=ports.find(x=>x.id===dest);if(!p||dest===s.port)return{ok:false,reason:"Seleziona una marina diversa"};const research=researchEffects(s),burn=b.burn*research.fuel,pl=plan(s.port,dest,b.tank,burn);const eta=Math.max(1,Math.round((pl.distance/b.knots)*60));const cost=Math.max(250,Math.round(pl.distance*7*b.mult))+crewBenefits(s,b,'transfer').salary;const reward=Math.max(1200,Math.round(pl.distance*20*b.mult));let fuelNow=Math.max(0,Math.min(b.tank,Number(s.fuel)||0)),refuel=0,ready=!!pl.possible&&!s.trip&&(Number(s.condition??100)>=30)&&(Array.isArray(s.owned)&&s.owned.includes(b.id));if(pl.possible){for(let i=0;i<pl.legs.length-1;i++){const req=Math.ceil(seaMiles(pl.legs[i],pl.legs[i+1])*burn);if(i>0){const liters=Math.max(0,req+pl.reserve-fuelNow);refuel+=liters*3;fuelNow+=liters}if(fuelNow<req+pl.reserve)ready=false;fuelNow-=Math.min(fuelNow,req)}}const total=cost+refuel;if((Number(s.coins)||0)<total)ready=false;const route=routePoints(s.port,dest).map(([lat,lon])=>project(lat,lon));return{ok:pl.possible,reason:pl.reason||"",origin:s.port,originName:(ports.find(x=>x.id===s.port)||ports[1]).name,dest,destinationName:p.name,distance:pl.distance,fuel:pl.fuel,researchFuelMult:research.fuel,cruiseKnots:b.knots,etaMinutesReal:eta,route,mission:{id:"R_"+b.id+"_"+s.port+"_"+dest,name:"Trasferimento nautico verso "+p.name,reward,prestige:Math.max(15,Math.round(pl.distance*.4*b.mult)),ready,reason:ready?"":"Controlla carburante, crediti e stato yacht",total}}}

// Distinct playable contracts, with stable transfer IDs for existing saves.
const contractSpecs=Object.freeze({
 rescue:{label:"Soccorso VHF",unlock:0,event:"rescue",objective:"Gestisci la richiesta di soccorso via VHF",success:["rescue","coastguard"],bonus:180,prestige:20},
 cargo:{label:"Consegna prioritaria",unlock:250,event:"cargo",objective:"Metti in sicurezza il carico durante la rotta",success:["cargoSecure"],bonus:220,prestige:15},
 charter:{label:"Charter VIP",unlock:250,event:"vip",objective:"Privilegia il comfort del cliente",success:["vipComfort"],bonus:250,prestige:25},
 recovery:{label:"Recupero water toy",unlock:1000,event:"seabob",objective:"Recupera il Seabob segnalato dal cliente",success:["seabobRecover"],bonus:300,prestige:25}
});
const specFor=k=>Object.hasOwn(contractSpecs,k)?contractSpecs[k]:null;
const eventCodes=Object.freeze({rescue:["rescue","coastguard"],weather:["safe","fast"],engine:["engineSlow","enginePush"],vip:["vipComfort","vipSpeed"],cargo:["cargoSecure","cargoRush"],patrol:["patrolAssist","patrolContinue"],mayday:["maydayRescue","maydayRelay"],seabob:["seabobRecover","seabobMark"],superyacht:["superyachtTender","superyachtDecline"],storm:["stormShelter","stormCross"]});
function eventKeyForTrip(t,prestige){
 if(Object.hasOwn(eventCodes,t?.eventKey))return t.eventKey;
 const forced=specFor(t?.mission?.kind)?.event;if(forced)return forced;
 const p=Math.max(0,Number(prestige)||0),seed=(Number(t?.voyageId)||1)+String(t?.id||"").split("").reduce((a,ch)=>a+ch.charCodeAt(0),0);
 const pool=p>=1000&&Math.abs(seed)%10===0?["mayday","seabob","superyacht","storm"]:p>=250?["rescue","weather","engine","vip","cargo","patrol"]:["rescue","weather","engine"];
 return pool[Math.abs(seed)%pool.length];
}
function missionCatalog(){
 const shot=snapshot(),s=shot.state,b=boats.find(x=>x.id===s.boat)||boats[0],originName=(ports.find(x=>x.id===s.port)||ports[1]).name;
 const list=[],reserve=Math.ceil(b.tank*.15),baseCrew=crewBenefits(s,b,'transfer'),research=researchEffects(s),burn=b.burn*research.fuel;
 if(s.port==="rimini"&&b.id==="voyager"&&(Number(s.voyages)||0)===0&&!(Array.isArray(s.completed)&&s.completed.includes("INTRO_RIMINI_CERVIA"))){
   const dist=seaMiles("rimini","cervia"),fuelCost=Math.ceil(dist*burn),ready=!s.trip&&(Number(s.condition??100)>=30)&&(Number(s.fuel)||0)>=fuelCost+reserve;
   list.push({id:"INTRO_RIMINI_CERVIA",name:"PRIMA MISSIONE · RPG Academy 8 · Rimini - Cervia",service:"Academy",kind:"academy",dest:"cervia",destination:"Cervia",origin:originName,reward:500,prestige:50,cost:0,total:0,fuel:fuelCost,researchFuelMult:research.fuel,distance:dist,boat:"voyager",ready,reason:ready?"":s.trip?(s.trip.dockingReady?"Completa l'ormeggio della missione attiva":"Completa prima la missione attiva"):"Controlla carburante e stato yacht"});
 }
 const introActive=s.port==="rimini"&&b.id==="voyager"&&(Number(s.voyages)||0)===0&&!(Array.isArray(s.completed)&&s.completed.includes("INTRO_RIMINI_CERVIA"));
 for(const p of ports){
   if(p.id===s.port)continue;
   if(introActive&&p.id==="cervia")continue;
   const distance=seaMiles(s.port,p.id),fuelCost=Math.ceil(distance*burn),cost=Math.max(250,Math.round(distance*7*b.mult))+baseCrew.salary,reward=Math.max(1200,Math.round(distance*20*b.mult)),prestige=Math.max(15,Math.round(distance*.4*b.mult));
   const direct=distance>0&&(fuelCost+reserve)<=b.tank;
   let ready=direct&&!s.trip&&(Number(s.condition??100)>=30)&&(Array.isArray(s.owned)&&s.owned.includes(b.id))&&(Number(s.fuel)||0)>=fuelCost+reserve&&(Number(s.coins)||0)>=cost;
   let reason="";
   if(!direct)reason="Serve una barca con maggiore autonomia";
   else if(s.trip)reason=s.trip.dockingReady?"Completa l'ormeggio della missione attiva":"Completa prima la missione attiva";
   else if((Number(s.condition??100))<30)reason="Manutenzione necessaria";
   else if((Number(s.fuel)||0)<fuelCost+reserve)reason="Carburante insufficiente · fai rifornimento in Marina";
   else if((Number(s.coins)||0)<cost)reason="Crediti insufficienti";
   list.push({id:"R_"+b.id+"_"+s.port+"_"+p.id,name:"Trasferimento nautico verso "+p.name,service:"Missione",kind:"transfer",dest:p.id,destination:p.name,origin:originName,reward,prestige,cost,total:cost,crewSalary:baseCrew.salary,crewBonus:Math.floor(reward*baseCrew.bonusRate),fuel:fuelCost,researchFuelMult:research.fuel,distance,boat:b.id,ready,reason});
 }
 if(!introActive){
  const routes=list.filter(m=>m.kind==="transfer").sort((a,b)=>Number(b.ready)-Number(a.ready)||a.distance-b.distance);
  const reachable=routes.filter(m=>m.fuel+reserve<=b.tank),candidates=reachable.length?reachable:routes;
  if(candidates.length)Object.entries(contractSpecs).forEach(([kind,spec],i)=>{
   const route=candidates[i%candidates.length],unlocked=(Number(s.prestige)||0)>=spec.unlock,crew=crewBenefits(s,b,kind);
   list.push({...route,crewBonus:Math.floor(route.reward*crew.bonusRate),id:"C_"+kind+"_"+b.id+"_"+s.port+"_"+route.dest,kind,service:spec.label,name:spec.label+" verso "+route.destination,objective:spec.objective,objectiveBonus:spec.bonus,objectivePrestige:spec.prestige,requiredPrestige:spec.unlock,ready:unlocked&&route.ready,reason:!unlocked?"Richiede "+spec.unlock.toLocaleString("it-IT")+" prestigio":route.reason});
  });
 }
 return list.sort((a,b)=>Number(b.kind==="academy")-Number(a.kind==="academy")||Number(b.ready)-Number(a.ready)||Number(!!specFor(b.kind))-Number(!!specFor(a.kind))||Number(a.distance)-Number(b.distance));
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
   const crew=crewBenefits(g,b,mission.kind||'transfer'),research=researchEffects(g);
   g.coins=Math.max(0,Number(g.coins)||0)-Math.max(0,Number(mission.cost)||0);
   // Fuel is consumed progressively during navigation so throttle changes have a real effect.
   g.voyageSerial=Math.max(0,Number(g.voyageSerial)||0)+1;
   const now=Date.now();
   g.trip={dockingVersion:DOCKING_STATE_VERSION,voyageId:g.voyageSerial,id:mission.id,origin:g.port,dest:mission.dest,legs:[g.port,mission.dest],legIndex:0,legSeconds:duration,sec:duration,fuelRate:b.burn*(mission.researchFuelMult===.9?.9:1),weather:"calm",weatherWear:3,weatherLabel:"CALMO",eventResolved:false,eventLabel:"",eventResult:"",eventBonus:0,eventPrestige:0,eventWear:0,throttleMode:"cruise",helmAngle:0,progressBase:0,startedAt:now,lastProgressAt:now,lastFuelAt:now,fuelUsed:0,throttleWear:0,mission:{id:mission.id,name:mission.name,dest:mission.dest,boat:mission.boat,kind:mission.kind||"transfer",reward:mission.reward,cost:mission.cost,fuel:mission.fuel,prestige:mission.prestige,sec:duration,crewVersion:1,crewSalary:crew.salary,crewBonus:Math.floor(mission.reward*crew.bonusRate),crewWearMult:crew.wearMult,researchVersion:1,researchFuelMult:mission.researchFuelMult===.9?.9:1,researchWearMult:research.wear},until:now+duration*1000};
   g.trip.eventKey=eventKeyForTrip(g.trip,g.prestige);
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
   if(!g.trip||g.trip.eventResolved||g.trip.dockingReady)return;
   const progress=projectedTrip(g.trip).progress,key=eventKeyForTrip(g.trip,g.prestige);
   if(progress<.24||progress>.94||!eventCodes[key]?.includes(code))return;
   g.trip.eventResolved=true;g.trip.eventKey=key;g.trip.eventChoice=code;g.trip.eventLabel=pick.label;g.trip.eventResult=pick.result;
   g.trip.eventBonus=Math.max(0,Number(g.trip.eventBonus)||0)+pick.bonus;
   g.trip.eventPrestige=Math.max(0,Number(g.trip.eventPrestige)||0)+pick.prestige;
   g.trip.eventWear=(Number(g.trip.eventWear)||0)+pick.wear;
   applied=true;
 });
 return ok&&applied?{ok:true,...pick}:{ok:false,message:"Evento non disponibile, già risolto o scelta non coerente"};
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
// Personal weekly challenge, using Monday 00:00 UTC boundaries.
// All progress and awards are committed together with a unique settled voyage.
const DOCK_WEEK_MS=604800000,DOCK_WEEK_OFFSET=259200000,DOCK_WEEK_GOAL=3,DOCK_WEEK_REWARD=1200,DOCK_WEEK_PRESTIGE=60;
const dockWeek=now=>Math.floor((Number(now)+DOCK_WEEK_OFFSET)/DOCK_WEEK_MS);
function dockingElapsed(t,now=Date.now()){
 const start=Number(t?.dockingStartedAt)||0;
 return start>0&&Number(now)>=start?Math.round(Number(now)-start):0;
}
function weeklyDockStatus(g,now=Date.now()){
 const week=dockWeek(now),r=g?.dockingChallenge,valid=r&&Number(r.week)===week;
 return {week,endsAt:(week+1)*DOCK_WEEK_MS-DOCK_WEEK_OFFSET,goal:DOCK_WEEK_GOAL,reward:DOCK_WEEK_REWARD,prestige:DOCK_WEEK_PRESTIGE,count:valid?Math.min(DOCK_WEEK_GOAL,Math.max(0,Math.floor(Number(r.count)||0))):0,claimed:!!(valid&&r.claimed),bestMs:valid?Math.max(0,Number(r.bestMs)||0):0,perfect:valid?Math.max(0,Math.floor(Number(r.perfect)||0)):0,clockMismatch:!!(r&&Number(r.week)>week)};
}
function recordWeeklyDock(g,t,grade,now){
 const summary=weeklyDockStatus(g,now),eligible=!!t.dockingReady&&Number(t.dockingManualBonus)===DOCK_MANUAL_BONUS&&t.dockingManualMoved&&!t.dockingAssist&&!t.dockingAssistUsed&&!(Number(t.dockingContacts)||0)&&["BUONO","PERFETTO"].includes(grade)&&Number(t.voyageId)>0&&String(t.id||"")!=="DEMO_DOCKING";
 const elapsed=dockingElapsed(t,now);
 if(!eligible||summary.clockMismatch)return{count:summary.count,eligible:false,reward:0,prestige:0,elapsed,newBest:false};
 const count=Math.min(DOCK_WEEK_GOAL,summary.count+1),newBest=elapsed>0&&(!summary.bestMs||elapsed<summary.bestMs);
 const claim=count===DOCK_WEEK_GOAL&&!summary.claimed;
 g.dockingChallenge={week:summary.week,count,claimed:summary.claimed||claim,bestMs:newBest?elapsed:summary.bestMs,perfect:summary.perfect+(grade==="PERFETTO"?1:0)};
 return{count,eligible:true,reward:claim?DOCK_WEEK_REWARD:0,prestige:claim?DOCK_WEEK_PRESTIGE:0,elapsed,newBest};
}
function finalizeTrip(g,dockingBonus=0,dockingPrestige=0,dockingGrade="STANDARD"){
 const trip=g.trip;if(!trip)return false;
 const m=trip.mission||{},id=String(trip.id||m.id||""),baseReward=Math.max(0,Number(m.reward)||0),basePrestige=Math.max(0,Number(m.prestige)||0),eventBonus=Math.max(0,Number(trip.eventBonus)||0),eventPrestige=Math.max(0,Number(trip.eventPrestige)||0),contract=specFor(m.kind),objectiveDone=!!contract&&contract.success.includes(trip.eventChoice),objectiveBonus=objectiveDone?contract.bonus:0,objectivePrestige=objectiveDone?contract.prestige:0,reward=baseReward+eventBonus+dockingBonus+objectiveBonus,prestige=basePrestige+eventPrestige+dockingPrestige+objectivePrestige,dest=String(m.dest||trip.dest||g.port);
 g.completed=Array.isArray(g.completed)?g.completed:[];g.settledVoyages=Array.isArray(g.settledVoyages)?g.settledVoyages:[];
 const voyageId=Number(trip.voyageId)||0,settled=voyageId>0&&g.settledVoyages.includes(voyageId);g.port=dest;
 if(!settled){
  if(id&&!g.completed.includes(id))g.completed.push(id);if(voyageId>0)g.settledVoyages.push(voyageId);
  const completedAt=Date.now(),weekly=recordWeeklyDock(g,trip,dockingGrade,completedAt),crewBonus=m.crewVersion===1?Math.max(0,Math.min(Math.floor(baseReward*.18),Number(m.crewBonus)||0)):0,totalReward=reward+weekly.reward+crewBonus,totalPrestige=prestige+weekly.prestige;
  g.coins=Math.max(0,Number(g.coins)||0)+totalReward;g.prestige=Math.max(0,Number(g.prestige)||0)+totalPrestige;g.voyages=Math.max(0,Number(g.voyages)||0)+1;g.earnings=Math.max(0,Number(g.earnings)||0)+totalReward;
  g.condition=Math.max(0,Math.min(100,(Number(g.condition??100)||100)-Math.max(0,(Number(trip.weatherWear)||3)+(Number(trip.eventWear)||0)+(Number(trip.throttleWear)||0))*(m.crewVersion===1&&m.crewWearMult===.9?.9:1)*(m.researchVersion===1&&m.researchWearMult===.8?.8:1)));
  if(m.crewVersion===1)crewComplete(g,String(m.boat||g.boat));
  g.lastArrival={destination:dest,reward:totalReward,baseReward,eventBonus,eventPrestige,weeklyDockReward:weekly.reward,weeklyDockPrestige:weekly.prestige,weeklyDockCount:weekly.count,weeklyDockEligible:weekly.eligible,dockingElapsedMs:weekly.elapsed,dockingNewBest:weekly.newBest,missionKind:m.kind||"transfer",objectiveDone,objectiveBonus,objectivePrestige,objective:contract?.objective||"",dockingBonus,dockingPrestige,dockingGrade,dockingOrientation:dockOrientation(trip),dockingManualBonus:Number(trip.dockingManualBonus)||0,dockingManualPrestige:Number(trip.dockingManualPrestige)||0,eventLabel:String(trip.eventLabel||""),eventResult:String(trip.eventResult||""),researchFuelMult:m.researchVersion===1&&m.researchFuelMult===.9?.9:1,researchWearMult:m.researchVersion===1&&m.researchWearMult===.8?.8:1,crewBonus,crewSalary:m.crewVersion===1?Math.max(0,Number(m.crewSalary)||0):0,charterBonus:0,charterRating:0,charterClient:"",charterTier:"",charterCareerTier:"",charterReturningClient:false,charterReputation:0,charterIncident:"",charterIncidentMatched:false,charterSpecialRequest:"",charterSpecialAccepted:false,charterSpecialMatched:false,charterClientLoyalty:"",prestige:totalPrestige,weather:String(trip.weather||"calm"),at:completedAt,voyageId,mission:String(m.name||"Missione completata"),emergency:false};
  g.missionHistory=(Array.isArray(g.missionHistory)?g.missionHistory:[]).concat([{id,voyageId,origin:String(trip.origin||""),destination:dest,name:g.lastArrival.mission,kind:g.lastArrival.missionKind,reward:totalReward,crewBonus,crewSalary:g.lastArrival.crewSalary,cost:Math.max(0,Number(m.cost)||0),prestige:totalPrestige,objectiveDone,objectiveBonus,dockingGrade,dockingElapsedMs:weekly.elapsed,weeklyDockReward:weekly.reward,at:g.lastArrival.at}]).slice(-30);
 }
 g.lastDockedBridge={origin:String(trip.origin||g.port),destination:dest,at:Date.now()};g.trip=null;return true;
}
function setHelm(angle){
 const s=read();if(!s?.trip)return{ok:false,message:"Timone disponibile solo durante una missione"};
 const a=Math.max(-30,Math.min(30,Math.round(Number(angle)||0)));
 const ok=mutate(g=>{if(g.trip){g.trip.helmAngle=a;if(g.trip.dockingReady)cancelDockAutomation(g.trip);}});
 const side=a===0?"CENTRO":a<0?"SINISTRA":"DRITTA";
 return ok?{ok:true,angle:a,dockingOffset:null,message:"Timone "+side+(a?" "+Math.abs(a)+"°":"")}:{ok:false,message:"Comando timone non salvato"};
}
const DOCK_MANUAL_BONUS=250,DOCK_MANUAL_PRESTIGE=20,DOCK_TURN_DEPTH=20;
function wrapDockAngle(value){const a=Number(value)||0;return ((a+180)%360+360)%360-180}
function dockOrientation(t){return t?.dockingOrientation==="stern"?"stern":"bow"}
function dockTarget(t){return dockOrientation(t)==="stern"?180:0}
function dockHeadingError(t){return Math.abs(wrapDockAngle((Number(t?.dockingHeading)||0)-dockTarget(t)))}
function hasDockTurn(t){return t?.dockingTurnTarget!=null&&Number.isFinite(Number(t.dockingTurnTarget))}
function stopDockMotion(t){t.enginePort=0;t.engineStarboard=0;t.bowThruster=0;t.helmAngle=0;t.dockingSurge=0;t.dockingSway=0;t.dockingYawRate=0}
function cancelDockAutomation(t){if(t.dockingAssist)t.dockingAssistUsed=true;t.dockingAssist=false;t.dockingTurnTarget=null}
function stepDockHeading(value,target,maxStep){const a=wrapDockAngle(value),d=wrapDockAngle(target-a);return wrapDockAngle(a+(Math.abs(d)<=maxStep?d:Math.sign(d)*maxStep))}
function setDockOrientation(mode){
 if(!["bow","stern"].includes(mode))return{ok:false,message:"Orientamento non valido"};
 const t=read()?.trip;if(!t?.dockingReady)return{ok:false,message:"Ormeggio non disponibile"};
 if((Number(t.dockingDepth)||0)>DOCK_TURN_DEPTH&&dockOrientation(t)!==mode)return{ok:false,message:"Esci dal posto barca prima di cambiare orientamento"};
 const ok=mutate(g=>{if(g.trip?.dockingReady)g.trip.dockingOrientation=mode;});
 return ok?{ok:true,mode,message:mode==="bow"?"Ormeggio di prua selezionato":"Ormeggio di poppa selezionato: ruota la barca e usa la retromarcia"}:{ok:false,message:"Orientamento non salvato"};
}
function rotateDock90(direction){
 const t=read()?.trip;if(!t?.dockingReady)return{ok:false,message:"Ormeggio non disponibile"};
 if((Number(t.dockingDepth)||0)>DOCK_TURN_DEPTH)return{ok:false,message:"Esci dal posto barca prima di ruotare"};
 if(hasDockTurn(t))return{ok:false,message:"Rotazione in corso"};
 const delta=Number(direction)<0?-90:90;
 const ok=mutate(g=>{if(!g.trip?.dockingReady)return;const a=g.trip;cancelDockAutomation(a);stopDockMotion(a);a.dockingTurnTarget=wrapDockAngle((Number(a.dockingHeading)||0)+delta);});
 return ok?{ok:true,message:"Rotazione di 90° in corso"}:{ok:false,message:"Rotazione non salvata"};
}
function dockingInertia(id){return({voyager:.92,open:.85,yacht:1,yacht14:1.1,yacht20:1.25,yacht30:1.42,luna:1.6})[String(id||"")]||1}
function bowPower(id){return({open:.65,voyager:.72,yacht:.88,yacht14:1,yacht20:1.18,yacht30:1.36,luna:1.6})[String(id||"")]||.8}
function applyDockingMotion(g){
 const t=g?.trip;if(!t?.dockingReady)return;
 const p=Math.max(-1,Math.min(1,Number(t.enginePort)||0)),s=Math.max(-1,Math.min(1,Number(t.engineStarboard)||0));
 const avg=(p+s)/2,split=(p-s)/2,helm=Math.max(-30,Math.min(30,Number(t.helmAngle)||0)),inertia=dockingInertia(g.boat);
 const bow=Math.max(-1,Math.min(1,Number(t.bowThruster)||0))*bowPower(g.boat);
 let surge=Number(t.dockingSurge)||0,sway=Number(t.dockingSway)||0,yaw=Number(t.dockingYawRate)||0;
 let depth=Math.max(0,Math.min(100,Number(t.dockingDepth)||0)),offset=Math.max(-40,Math.min(40,Number(t.dockingOffset)||0)),heading=wrapDockAngle(t.dockingHeading);
 if(hasDockTurn(t)){
   stopDockMotion(t);const target=Number(t.dockingTurnTarget);
   t.dockingHeading=stepDockHeading(heading,target,18);
   if(Math.abs(wrapDockAngle(target-t.dockingHeading))<.01)t.dockingTurnTarget=null;
   return;
 }
 const previousDepth=depth,previousHeading=heading;
 const wind=Math.max(0,Math.min(20,Number(t.dockingWind)||0)),windSide=Number(t.dockingWindSide)||0,current=Math.max(0,Math.min(3,Number(t.dockingCurrent)||0)),currentSide=Number(t.dockingCurrentSide)||0;
 // Damped velocity targets prevent accumulation, violent spins and lateral jumps.
 const approach=(value,target,rate)=>value+(target-value)*rate;
 const targetSurge=avg*2.15,thrustRate=.48/inertia;
 surge=approach(surge,targetSurge,Math.abs(avg)>.01?thrustRate:.38/inertia);
 if(Math.abs(surge)<.025)surge=0;
 const rudder=(helm/30)*Math.min(1,Math.abs(surge)/1.6)*1.2*Math.sign(surge);
 const targetYaw=(split*3.4+rudder+bow*1.1)/Math.sqrt(inertia);
 yaw=approach(yaw,targetYaw,.5/inertia);yaw=Math.max(-3.5,Math.min(3.5,yaw));
 if(Math.abs(yaw)<.025)yaw=0;
 const targetSway=(bow*.88+windSide*wind*.007+currentSide*current*.08)/inertia;
 sway=approach(sway,targetSway,.55/inertia);sway=Math.max(-1.15,Math.min(1.15,sway));
 if(Math.abs(sway)<.015)sway=0;
 heading=wrapDockAngle(heading+yaw*1.8);
 // Forward and side motion expressed in the same scene-space units.
 const radians=heading*Math.PI/180,forwardPx=surge*8.48,sidePx=sway*2.97;
 depth+=(forwardPx*Math.cos(radians)-sidePx*Math.sin(radians))/2.65;
 offset+=(forwardPx*Math.sin(radians)+sidePx*Math.cos(radians))/1.8;
 let contact=false;
 const axisError=Math.min(Math.abs(heading),Math.abs(wrapDockAngle(heading-180)));
 if(depth>26&&axisError>25){
   depth=Math.min(depth,Math.max(26,previousDepth));
   if(previousDepth>26){heading=previousHeading;yaw=0}
   surge*=.25;contact=true;
 }
 if(depth>96){depth=96;surge=0;contact=true}
 if(depth>26&&Math.abs(offset)>17){offset=Math.sign(offset)*17;sway=-sway*.32;contact=true}
 if(depth<0){depth=0;surge=0}
 if(depth>previousDepth+.1&&Math.abs(avg)>.01)t.dockingManualMoved=true;
 if(contact){t.dockingContacts=Math.max(0,Number(t.dockingContacts)||0)+1;t.dockingContactAt=Date.now();}
 t.dockingDepth=Math.max(0,Math.min(100,depth));t.dockingOffset=Math.max(-40,Math.min(40,offset));t.dockingHeading=wrapDockAngle(heading);
 t.dockingSurge=surge;t.dockingSway=sway;t.dockingYawRate=yaw;
}
function setDockEngine(side,state){
 const s=read();if(!s?.trip?.dockingReady)return{ok:false,message:"Motori di manovra disponibili solo in ormeggio"};
 const v=Math.max(-1,Math.min(1,Math.round(Number(state)||0)));let view=null;
 const ok=mutate(g=>{if(!g.trip?.dockingReady)return;cancelDockAutomation(g.trip);if(side==="port")g.trip.enginePort=v;else g.trip.engineStarboard=v;view={port:Number(g.trip.enginePort)||0,starboard:Number(g.trip.engineStarboard)||0,offset:Number(g.trip.dockingOffset)||0,depth:Number(g.trip.dockingDepth)||0,heading:Number(g.trip.dockingHeading)||0};});
 const label=v>0?"AVANTI":v<0?"INDIETRO":"FOLLE";
 return ok?{ok:true,...view,message:"Motore "+(side==="port"?"SX":"DX")+" "+label}:{ok:false,message:"Comando motore non salvato"};
}
function setBowThruster(state){
 const s=read();if(!s?.trip?.dockingReady)return{ok:false,message:"Elica di prua disponibile solo in ormeggio"};
 const v=Math.max(-1,Math.min(1,Math.round(Number(state)||0)));let view=null;
 const ok=mutate(g=>{if(!g.trip?.dockingReady)return;cancelDockAutomation(g.trip);g.trip.bowThruster=v;view={offset:Number(g.trip.dockingOffset)||0,depth:Number(g.trip.dockingDepth)||0,heading:Number(g.trip.dockingHeading)||0};});
 return ok?{ok:true,...view,message:v===0?"Elica di prua STOP":v<0?"Elica di prua SINISTRA":"Elica di prua DRITTA"}:{ok:false,message:"Comando elica di prua non salvato"};
}
function setDockAssist(enable=true){
 const s=read();if(!s?.trip?.dockingReady)return{ok:false,message:"Assistenza disponibile solo durante l'ormeggio"};
 let active=false;
 const ok=mutate(g=>{
   if(!g.trip?.dockingReady)return;
   g.trip.dockingAssist=enable!==false;active=!!g.trip.dockingAssist;
   if(active){g.trip.dockingAssistUsed=true;g.trip.dockingTurnTarget=null;stopDockMotion(g.trip); }
 });
 return ok?{ok:true,active,message:active?"Assistenza ormeggio attiva · la barca si allinea automaticamente":"Assistenza disattivata · controllo manuale"}:{ok:false,message:"Impossibile cambiare assistenza"};
}
function applyDockingAssistMotion(g){
 const t=g?.trip;if(!t?.dockingReady||!t.dockingAssist)return;
 const step=(value,target,maxStep)=>{const v=Number(value)||0,d=target-v;return Math.abs(d)<=maxStep?target:v+Math.sign(d)*maxStep};
 t.dockingAssistUsed=true;stopDockMotion(t);
 const target=dockTarget(t);
 // Back away from the fingers before changing orientation, then approach.
 if(dockHeadingError(t)>12&&(Number(t.dockingDepth)||0)>DOCK_TURN_DEPTH){
   t.dockingDepth=step(t.dockingDepth,0,14);return;
 }
 t.dockingOffset=Math.max(-40,Math.min(40,step(t.dockingOffset,0,7)));
 t.dockingHeading=stepDockHeading(t.dockingHeading,target,18);
 if(dockHeadingError(t)<=8)t.dockingDepth=Math.max(0,Math.min(100,step(t.dockingDepth,84,14)));
}
function adjustDocking(delta){
 const s=read();if(!s?.trip?.dockingReady)return{ok:false,message:"Ormeggio non ancora disponibile"};
 let offset=0;const ok=mutate(g=>{if(!g.trip?.dockingReady)return;cancelDockAutomation(g.trip);g.trip.dockingOffset=Math.max(-40,Math.min(40,(Number(g.trip.dockingOffset)||0)+Number(delta||0)));offset=g.trip.dockingOffset;});
 return ok?{ok:true,offset,message:Math.abs(offset)<=6?"Allineamento corretto: puoi ormeggiare.":offset<0?"Correggi ancora verso dritta.":"Correggi ancora verso sinistra."}:{ok:false,message:"Correzione non salvata"};
}
function completeDocking(){
 const s=read();if(!s?.trip?.dockingReady)return{ok:false,message:"Ormeggio non disponibile"};
 const offset=Math.abs(Number(s.trip.dockingOffset)||0),depth=Math.max(0,Math.min(100,Number(s.trip.dockingDepth)||0)),heading=dockHeadingError(s.trip);
 if(Number(s.trip.enginePort)||Number(s.trip.engineStarboard)||Number(s.trip.bowThruster)||0)return{ok:false,message:"Metti motori ed elica di prua su FOLLE/STOP"};
 if(hasDockTurn(s.trip)||Math.abs(Number(s.trip.dockingSurge)||0)>.55||Math.abs(Number(s.trip.dockingYawRate)||0)>.55||Math.abs(Number(s.trip.dockingSway)||0)>.45)return{ok:false,message:"Attendi che la barca sia ferma"};
 if(depth<70)return{ok:false,message:"Entra ancora un poco nel posto barca"};
 if(offset>10)return{ok:false,message:"Centra ancora la barca nel posto"};
 if(heading>12)return{ok:false,message:"Raddrizza ancora la barca"};
 const perfect=offset<=2&&heading<=3&&depth>=88,grade=perfect?"PERFETTO":"BUONO",clean=!!s.trip.dockingManualMoved&&!s.trip.dockingAssist&&!s.trip.dockingAssistUsed&&!(Number(s.trip.dockingContacts)||0);
 const manualBonus=clean?DOCK_MANUAL_BONUS:0,manualPrestige=clean?DOCK_MANUAL_PRESTIGE:0,bonus=(perfect?300:140)+manualBonus,prestige=(perfect?25:12)+manualPrestige,orientation=dockOrientation(s.trip);
 let done=false;const ok=mutate(g=>{if(!g.trip?.dockingReady)return;g.trip.dockingManualBonus=manualBonus;g.trip.dockingManualPrestige=manualPrestige;done=finalizeTrip(g,bonus,prestige,grade);});
 return ok&&done?{ok:true,grade,bonus,prestige,orientation,manualBonus,manualPrestige,message:"Ormeggio "+grade.toLowerCase()+" completato"}:{ok:false,message:"Ormeggio non completato"};
}
function pulse(){
 const s=read();if(!s?.trip)return {active:false,snapshot:snapshot()};
 const now=Date.now();
 mutate(g=>{
   if(!g.trip)return;
   if(!g.trip.dockingReady)settleTrip(g,now);
   else{
     if(!(Number(g.trip.dockingStartedAt)>0))g.trip.dockingStartedAt=now;
     const last=Math.max(0,Number(g.trip.dockingLastAt)||0);
     if(!last||now-last>=650){if(g.trip.dockingAssist)applyDockingAssistMotion(g);else applyDockingMotion(g);g.trip.dockingLastAt=now;}
   }
 });
 const fresh=read(),ft=fresh?.trip,proj=ft?projectedTrip(ft):null;
 if(ft&&!ft.dockingReady&&proj&&proj.progress>=.97){
   mutate(g=>{
     if(!g.trip)return;const ts=Date.now();
     g.trip.progressBase=.97;g.trip.lastProgressAt=ts;g.trip.lastFuelAt=ts;g.trip.until=ts;g.trip.dockingReady=true;g.trip.dockingStartedAt=ts;g.trip.throttleMode="eco";
     if(!Number.isFinite(Number(g.trip.dockingOffset)))g.trip.dockingOffset=((Number(g.trip.voyageId)||1)*17%25)-12;
     if(!Number.isFinite(Number(g.trip.dockingDepth)))g.trip.dockingDepth=0;
     if(!Number.isFinite(Number(g.trip.dockingHeading)))g.trip.dockingHeading=((Number(g.trip.voyageId)||1)*9%13)-6;
     g.trip.enginePort=0;g.trip.engineStarboard=0;g.trip.bowThruster=0;g.trip.dockingAssist=false;g.trip.dockingAssistUsed=false;g.trip.dockingManualMoved=false;g.trip.dockingOrientation="bow";g.trip.dockingTurnTarget=null;g.trip.dockingSurge=0;g.trip.dockingSway=0;g.trip.dockingYawRate=0;g.trip.dockingContacts=0;g.trip.dockingWind=(Number(g.trip.voyageId)||1)<=1?0:3+((Number(g.trip.voyageId)||1)%5);g.trip.dockingWindSide=((Number(g.trip.voyageId)||1)%2)?1:-1;g.trip.dockingCurrent=(Number(g.trip.voyageId)||1)<=1?0:(((Number(g.trip.voyageId)||1)*3)%4)*.2;g.trip.dockingCurrentSide=((Number(g.trip.voyageId)||1)%3===0)?-1:1;g.trip.dockingLastAt=ts;
   });
 }
 return {active:!!read()?.trip,snapshot:snapshot()};
}
window.MarinaEmpireMapLite={snapshot,preview,read,pulse,crewSnapshot,crewAction,weeklyDockStatus,missionCatalog,startMission,setThrottle,setHelm,setDockEngine,setBowThruster,setDockAssist,setDockOrientation,rotateDock90,adjustDocking,completeDocking,applyVoyageDecision,positionAt,gpsTrackFor,routeFor:(from,to)=>routePoints(from,to).map(([lat,lon])=>project(lat,lon)),routeGeoFor:(from,to)=>routePoints(from,to).map(([lat,lon])=>[lat,lon]),positionGeoAt:(from,to,progress)=>geoAt(from,to,progress)};
})();