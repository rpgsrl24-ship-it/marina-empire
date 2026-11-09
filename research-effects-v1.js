(()=>{
"use strict";
if(window.__ME_RESEARCH_EFFECTS_V1__)return;
window.__ME_RESEARCH_EFFECTS_V1__=true;
function game(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function rec(id){
 const g=game(),r=g&&g.research&&typeof g.research==="object"?g.research[id]:null;
 return r&&typeof r==="object"?r:null;
}
function complete(id){
 const r=rec(id);if(!r)return false;
 return r.status==="complete"||(r.status==="active"&&Number(r.completesAt)>0&&Number(r.completesAt)<=Date.now());
}
function fuelMultiplier(){return complete("efficient_engines")?.9:1}
function wearMultiplier(){return complete("reinforced_hull")?.8:1}
function berthMultiplier(){return complete("smart_pontoon")?1.2:1}
function marinaCostMultiplier(){
 if(complete("advanced_solar"))return .75;
 if(complete("sustainable_energy"))return .85;
 return 1;
}
function snapshot(){return{
 efficientEngines:complete("efficient_engines"),
 reinforcedHull:complete("reinforced_hull"),
 smartPontoon:complete("smart_pontoon"),
 sustainableEnergy:complete("sustainable_energy"),
 advancedSolar:complete("advanced_solar"),
 fuelMultiplier:fuelMultiplier(),
 wearMultiplier:wearMultiplier(),
 berthMultiplier:berthMultiplier(),
 marinaCostMultiplier:marinaCostMultiplier()
}}
window.MarinaEmpireResearchEffects=Object.freeze({complete,fuelMultiplier,wearMultiplier,berthMultiplier,marinaCostMultiplier,snapshot});
})();