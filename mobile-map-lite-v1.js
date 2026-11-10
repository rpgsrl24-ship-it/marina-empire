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
function straight(a,b){const lat=(a[0]+b[0])/2*Math.PI/180;return Math.round(Math.hypot((a[0]-b[0])*60,(a[1]-b[1])*60*Math.cos(lat))*1.12)}
function nearest(p,arr){return arr.reduce((best,v,i)=>straight(p,v)<straight(p,arr[best])?i:best,0)}
function chain(p,q,spine){const i=nearest(p,spine),j=nearest(q,spine);return i<=j?spine.slice(i,j+1):spine.slice(j,i+1).reverse()}
function waypoints(a,b){const A=coastal[a],B=coastal[b];if(!A||!B)return[];const aa=ad.has(a),bb=ad.has(b);if(aa&&bb)return chain(A,B,adSpine);if(!aa&&!bb)return chain(A,B,tySpine);const x=aa?A:B,y=aa?B:A;const mid=[...chain(x,corr.otranto,adSpine),corr.ionian,corr.messinaSouth,corr.messinaNorth,...chain(corr.messinaNorth,y,tySpine)];return aa?mid:mid.reverse()}
function routePoints(a,b){const A=harborGPS[a],B=harborGPS[b];if(!A||!B)return[];if(a===b)return[A];const dep=coastal[a],arr=coastal[b];if(!dep||!arr)return[A,...waypoints(a,b),B];const nearby=ad.has(a)&&ad.has(b)&&straight(dep,arr)<=95;const pts=[A,dep,...(nearby?[]:waypoints(a,b)),arr,B];return pts.filter((p,i)=>!i||straight(p,pts[i-1])>0)}
function seaMiles(a,b){const pts=routePoints(a,b);return pts.slice(1).reduce((n,p,i)=>n+straight(pts[i],p),0)}
function plan(from,to,tank,burn){const cap=Math.max(1,Number(tank)||1),reserve=Math.ceil(cap*.15),rate=Number(burn)||.85;if(!harborGPS[from]||!harborGPS[to]||from===to)return{possible:false,distance:0,reason:"Destinazione non valida",stops:[],legs:[]};const ids=ports.map(p=>p.id),dist=Object.fromEntries(ids.map(id=>[id,Infinity])),prev={},seen=new Set();dist[from]=0;while(seen.size<ids.length){const cur=ids.filter(id=>!seen.has(id)).sort((a,b)=>dist[a]-dist[b])[0];if(!cur||!Number.isFinite(dist[cur]))break;if(cur===to)break;seen.add(cur);for(const next of ids){if(next===cur||seen.has(next))continue;const nm=seaMiles(cur,next);if(!nm||Math.ceil(nm*rate)+reserve>cap)continue;const c=dist[cur]+nm;if(c<dist[next]){dist[next]=c;prev[next]=cur}}}if(!Number.isFinite(dist[to]))return{possible:false,distance:seaMiles(from,to),reason:"Autonomia insufficiente",stops:[],legs:[]};const legs=[to];let c=to;while(c!==from&&legs.length<=ids.length){c=prev[c];if(!c)break;legs.unshift(c)};if(legs[0]!==from)return{possible:false,distance:0,reason:"Rotta non disponibile",stops:[],legs:[]};const distance=legs.slice(1).reduce((sum,id,i)=>sum+seaMiles(legs[i],id),0),fuel=legs.slice(1).reduce((sum,id,i)=>sum+Math.ceil(seaMiles(legs[i],id)*rate),0);return{possible:true,distance,fuel,stops:legs.slice(1,-1),legs,reserve,burnRate:rate}}
function project(lat,lon){return{x:(lon-6.2)/(19.4-6.2)*100,y:(48-lat)/(48-35)*100}}
function getHandle(){const c=window.MarinaLocalSaveContext;if(!c)return null;let h=c.capture();if(!h){c.select(null);h=c.capture()}return h}
function read(){const c=window.MarinaLocalSaveContext,h=getHandle();return c&&h?c.readGame(h):null}
function mutate(fn){
 const c=window.MarinaLocalSaveContext,h=getHandle();if(!c||!h)return false;
 const s=c.readGame(h);if(!s)return false;
 fn(s);return c.writeGame(h,s);
}
function tripView(s,b){
 const t=s?.trip;if(!t)return null;
 const duration=Math.max(1,Number(t.sec)||1),remaining=Math.max(0,(Number(t.until)||Date.now())-Date.now());
 const progress=Math.max(0,Math.min(1,1-remaining/(duration*1000)));
 const origin=String(t.origin||s.port),dest=String(t.dest||s.port),route=routePoints(origin,dest).map(([lat,lon])=>project(lat,lon));
 const distance=seaMiles(origin,dest),knots=Number(b?.knots)||18;
 return {id:String(t.id||""),name:String(t.mission?.name||"Missione attiva"),origin,originName:(ports.find(x=>x.id===origin)||ports[1]).name,dest,destinationName:(ports.find(x=>x.id===dest)||ports[1]).name,reward:Number(t.mission?.reward)||0,prestige:Number(t.mission?.prestige)||0,progress,distance,cruiseKnots:knots,etaMinutesReal:Math.max(1,Math.round((distance*(1-progress)/knots)*60)),remainingSec:Math.max(0,Math.ceil(remaining/1000)),route};
}
function snapshot(){const s=read()||{coins:10000,prestige:0,fuel:300,condition:100,port:"rimini",boat:"voyager",owned:["voyager"],completed:[],voyages:0};const b=boats.find(x=>x.id===s.boat)||boats[0];return{state:s,tank:b.tank,boatName:b.name,ports:ports.map(p=>({id:p.id,name:p.name,x:illustrated[p.id]?.[0]??50,y:illustrated[p.id]?.[1]??50})),trip:tripView(s,b)}}
function preview(dest){const shot=snapshot(),s=shot.state,b=boats.find(x=>x.id===s.boat)||boats[0],p=ports.find(x=>x.id===dest);if(!p||dest===s.port)return{ok:false,reason:"Seleziona una marina diversa"};const pl=plan(s.port,dest,b.tank,b.burn);const eta=Math.max(1,Math.round((pl.distance/b.knots)*60));const cost=Math.max(250,Math.round(pl.distance*7*b.mult))+b.crew;const reward=Math.max(1200,Math.round(pl.distance*20*b.mult));let fuelNow=Math.max(0,Math.min(b.tank,Number(s.fuel)||0)),refuel=0,ready=!!pl.possible&&!s.trip&&(Number(s.condition??100)>=30)&&(Array.isArray(s.owned)&&s.owned.includes(b.id));if(pl.possible){for(let i=0;i<pl.legs.length-1;i++){const req=Math.ceil(seaMiles(pl.legs[i],pl.legs[i+1])*b.burn);if(i>0){const liters=Math.max(0,req+pl.reserve-fuelNow);refuel+=liters*3;fuelNow+=liters}if(fuelNow<req+pl.reserve)ready=false;fuelNow-=Math.min(fuelNow,req)}}const total=cost+refuel;if(Number(s.coins)||0<total)ready=false;const route=routePoints(s.port,dest).map(([lat,lon])=>project(lat,lon));return{ok:pl.possible,reason:pl.reason||"",origin:s.port,originName:(ports.find(x=>x.id===s.port)||ports[1]).name,dest,destinationName:p.name,distance:pl.distance,fuel:pl.fuel,cruiseKnots:b.knots,etaMinutesReal:eta,route,mission:{id:"R_"+b.id+"_"+s.port+"_"+dest,name:"Trasferimento nautico verso "+p.name,reward,prestige:Math.max(15,Math.round(pl.distance*.4*b.mult)),ready,reason:ready?"":"Controlla carburante, crediti e stato yacht",total}}}
function pulse(){
 const s=read();if(!s?.trip)return {active:false,snapshot:snapshot()};
 const t=s.trip;
 if(t.id!=="INTRO_RIMINI_CERVIA")return {active:true,needsAuthoritativeEngine:true,snapshot:snapshot()};
 let changed=false;
 if(!Number.isFinite(Number(t.sec))||Number(t.sec)>20||(Number(t.until)-Date.now())>20000){
   changed=mutate(g=>{if(!g.trip||g.trip.id!=="INTRO_RIMINI_CERVIA")return;g.trip.sec=20;g.trip.legSeconds=20;g.trip.until=Date.now()+20000;});
 }
 const now=Date.now(),fresh=read(),ft=fresh?.trip;
 if(ft&&Number(ft.until)<=now){
   mutate(g=>{
     const trip=g.trip;if(!trip||trip.id!=="INTRO_RIMINI_CERVIA")return;
     const m=trip.mission||{},reward=Math.max(0,Number(m.reward)||500),prestige=Math.max(0,Number(m.prestige)||50),dest=String(m.dest||trip.dest||"cervia");
     g.port=dest;
     g.completed=Array.isArray(g.completed)?g.completed:[];
     if(!g.completed.includes(trip.id))g.completed.push(trip.id);
     g.coins=Math.max(0,Number(g.coins)||0)+reward;
     g.prestige=Math.max(0,Number(g.prestige)||0)+prestige;
     g.voyages=Math.max(0,Number(g.voyages)||0)+1;
     g.earnings=Math.max(0,Number(g.earnings)||0)+reward;
     g.condition=Math.max(0,(Number(g.condition??100)||100)-Math.max(0,Number(trip.weatherWear)||3));
     g.lastArrival={destination:dest,reward,baseReward:reward,crewBonus:0,charterBonus:0,charterRating:0,charterClient:"",charterTier:"",charterCareerTier:"",charterReturningClient:false,charterReputation:0,charterIncident:"",charterIncidentMatched:false,charterSpecialRequest:"",charterSpecialAccepted:false,charterSpecialMatched:false,charterClientLoyalty:"",prestige,weather:String(trip.weather||"calm"),at:Date.now(),mission:String(m.name||"PRIMA MISSIONE · RPG Academy 8 · Rimini - Cervia"),emergency:false};
     g.lastDockedBridge={origin:String(trip.origin||"rimini"),destination:dest,at:Date.now()};
     g.trip=null;
   });
 }
 return {active:!!read()?.trip,changed,snapshot:snapshot()};
}
window.MarinaEmpireMapLite={snapshot,preview,read,pulse};
})();