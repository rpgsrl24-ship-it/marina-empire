(()=>{
"use strict";
if(window.MarinaEmpireMapBridge)return;
const clone=value=>{try{return JSON.parse(JSON.stringify(value))}catch(_){return null}};
const safeState=()=>({
  coins:Number(state?.coins)||0,
  prestige:Number(state?.prestige)||0,
  fuel:Number(state?.fuel)||0,
  condition:Number(state?.condition??100),
  port:String(state?.port||"rimini"),
  boat:String(state?.boat||"voyager"),
  trip:state?.trip?clone(state.trip):null,
  completed:Array.isArray(state?.completed)?[...state.completed]:[],
  voyages:Number(state?.voyages)||0
});
function projectedRoute(origin,dest){
  try{
    return voyageRoutePoints(origin,dest).map(([lat,lon])=>{
      const [x,y]=projection(lon,lat);
      return {x:Number((x/10).toFixed(3)),y:Number((y/8.5).toFixed(3)),lat,lon};
    });
  }catch(_){return []}
}
function portList(){
  return ports.map(p=>{
    const point=illustratedHarbors[p.id]||projection(harborGPS[p.id]?.[1],harborGPS[p.id]?.[0]);
    return {id:p.id,name:p.name,x:Number((point[0]/10).toFixed(3)),y:Number((point[1]/8.5).toFixed(3))};
  });
}
const cruiseByBoat={voyager:18,open:26,yacht:22,yacht14:24,yacht20:20,yacht30:17,luna:14};
function cruiseKnots(id){return Number(cruiseByBoat[id])||18}
function preview(dest){
  const s=safeState(),target=ports.find(p=>p.id===dest);
  if(!target||dest===s.port)return {ok:false,reason:"Seleziona una marina diversa dalla posizione attuale"};
  const activeBoat=boat(s.boat),burn=fuelBurnPerNm(s.boat),plan=planSeaTrip(s.port,dest,activeBoat.tank,burn);
  let mission=null,budget=null;
  try{
    mission=availableMissions().find(m=>m.dest===dest&&m.boat===s.boat)||availableMissions().find(m=>m.dest===dest)||null;
    if(mission)budget=missionBudget(mission);
  }catch(_){}
  return {
    ok:!!plan?.possible,
    reason:String(plan?.reason||""),
    origin:s.port,
    originName:port(s.port).name,
    dest,
    destinationName:target.name,
    distance:Number(plan?.distance)||0,
    fuel:Number(plan?.fuel)||0,
    cruiseKnots:cruiseKnots(s.boat),
    etaMinutesReal:Math.max(1,Math.round(((Number(plan?.distance)||0)/cruiseKnots(s.boat))*60)),
    stops:Array.isArray(plan?.stops)?plan.stops.map(id=>({id,name:port(id).name})):[],
    route:projectedRoute(s.port,dest),
    mission:mission?{
      id:String(mission.id||""),
      name:String(mission.name||"Missione"),
      reward:Number(mission.reward)||0,
      prestige:Number(mission.prestige)||0,
      sec:Number(mission.sec)||0,
      ready:!!budget?.ready,
      reason:String(budget?.reason||""),
      total:Number(budget?.total)||0
    }:null
  };
}
function tripSnapshot(){
  const s=safeState(),t=s.trip;
  if(!t)return null;
  const duration=Math.max(1,Number(t.sec)||1),remaining=Math.max(0,(Number(t.until)||Date.now())-Date.now());
  const progress=Math.max(0,Math.min(1,1-remaining/(duration*1000)));
  const origin=String(t.origin||s.port),dest=String(t.dest||s.port),distance=seaMiles(origin,dest),knots=cruiseKnots(s.boat);
  return {
    id:String(t.id||""),
    name:String(t.mission?.name||"Missione attiva"),
    origin,
    originName:port(origin).name,
    dest,
    destinationName:port(dest).name,
    reward:Number(t.mission?.reward)||0,
    prestige:Number(t.mission?.prestige)||0,
    progress,
    distance:Number(distance)||0,
    cruiseKnots:knots,
    etaMinutesReal:Math.max(1,Math.round(((Number(distance)||0)*(1-progress)/knots)*60)),
    remainingSec:Math.max(0,Math.ceil(remaining/1000)),
    route:projectedRoute(origin,dest)
  };
}
function snapshot(){
  const s=safeState(),activeBoat=boat(s.boat);
  return {
    state:s,
    tank:Number(activeBoat?.tank)||300,
    boatName:String(activeBoat?.name||"Yacht"),
    ports:portList(),
    trip:tripSnapshot()
  };
}
window.MarinaEmpireMapBridge={
  version:"map-bridge-v1",
  snapshot,
  preview,
  navigate(dest){
    if(state?.trip)return {ok:true,active:true,snapshot:snapshot()};
    const p=preview(String(dest||""));
    if(!p.ok)return {ok:false,message:p.reason||"Rotta non disponibile",preview:p};
    if(!p.mission)return {ok:false,message:"Non c'è una missione disponibile per questa destinazione.",preview:p};
    if(!p.mission.ready)return {ok:false,message:p.mission.reason||"Missione non pronta",preview:p};
    try{launch(p.mission.id);return {ok:true,active:true,snapshot:snapshot()}}
    catch(e){return {ok:false,message:String(e?.message||e),preview:p}}
  }
};
})();