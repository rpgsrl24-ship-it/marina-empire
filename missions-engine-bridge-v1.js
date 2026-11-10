(()=>{
"use strict";
if(window.MarinaEmpireMissionBridge)return;
const clone=value=>{try{return JSON.parse(JSON.stringify(value))}catch(_){return null}};
const safeState=()=>({
  coins:Number(state?.coins)||0,
  prestige:Number(state?.prestige)||0,
  fuel:Number(state?.fuel)||0,
  condition:Number(state?.condition??100),
  port:String(state?.port||"rimini"),
  boat:String(state?.boat||"voyager"),
  completed:Array.isArray(state?.completed)?[...state.completed]:[],
  trip:state?.trip?clone(state.trip):null,
  voyages:Number(state?.voyages)||0,
  setupComplete:!!state?.setupComplete
});
function snapshot(){
  const s=safeState();
  const activeBoat=boat(s.boat);
  let list=[];
  try{
    list=availableMissions().map(m=>{
      const budget=missionBudget(m);
      return {
        id:String(m.id||""),
        name:String(m.name||"Missione"),
        service:String(m.service||"Missione"),
        client:String(m.client||""),
        dest:String(m.dest||""),
        destination:String(port(m.dest)?.name||m.dest||""),
        origin:String(port(s.port)?.name||s.port||""),
        reward:Number(m.reward)||0,
        prestige:Number(m.prestige)||0,
        cost:Number(m.cost)||0,
        fuel:Number(m.fuel)||0,
        distance:Number(m.plan?.distance)||0,
        ready:!!budget?.ready,
        reason:String(budget?.reason||""),
        total:Number(budget?.total)||0,
        refuel:Number(budget?.refuel)||0,
        boat:String(m.boat||s.boat)
      };
    });
  }catch(e){console.error("Mission bridge snapshot",e)}
  return {state:s,tank:Number(activeBoat?.tank)||300,missions:list};
}
window.MarinaEmpireMissionBridge={
  snapshot,
  start(id){
    const missionId=String(id||"");
    try{
      launch(missionId);
      const after=snapshot();
      const ok=!!after?.state?.trip&&String(after.state.trip.id||"")===missionId;
      return {ok,message:ok?"":"La missione non è stata avviata dal motore.",snapshot:after};
    }catch(e){return {ok:false,message:String(e?.message||e),snapshot:snapshot()}}
  },
  version:"missions-bridge-v2"
};
})();