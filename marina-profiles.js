(()=>{
"use strict";
if(window.__ME_MARINA_PROFILES__)return;
window.__ME_MARINA_PROFILES__=true;

const DEFAULT={
 id:"default",label:"MARINA POLIVALENTE",description:"Traffico misto, servizi generali e domanda equilibrata.",
 trafficBias:1,
 vesselWeights:{superyacht:1,charter:1,regatta:1,service:1,port:1,commercial:1,rescue:1},
 contractWeights:{arrival:1,fuel:1,tech:1,charter:1,vip:1,broker:1,provisioning:1,toys:1,security:1,transfer:1}
};

const PROFILES={
 rose:{label:"BASE OPERATIVA RPG YACHT",description:"Hub operativo e dimostrativo RPG Yacht.",trafficBias:.9,vesselWeights:{superyacht:1.2,charter:1.1,regatta:.8,service:1.5,port:1.4,commercial:.35,rescue:1.1},contractWeights:{arrival:1.3,fuel:1.2,tech:1.35,charter:1,vip:1.2,broker:.8,provisioning:1.1,toys:1.35,security:1.1,transfer:1}},
 rimini:{label:"CHARTER & WATER TOYS",description:"Turismo nautico, charter giornaliero e servizi leisure.",trafficBias:1.08,vesselWeights:{superyacht:.9,charter:1.55,regatta:1.05,service:1.2,port:.9,commercial:.65,rescue:1},contractWeights:{arrival:1.2,fuel:1.15,tech:.95,charter:1.5,vip:1.1,broker:.85,provisioning:1.25,toys:1.55,security:.85,transfer:1.2}},
 ancona:{label:"PORTO TECNICO & COMMERCIALE",description:"Movimenti portuali, assistenza tecnica e traffico commerciale.",trafficBias:1.15,vesselWeights:{superyacht:.65,charter:.75,regatta:.65,service:1.25,port:1.45,commercial:1.75,rescue:1.15},contractWeights:{arrival:1.3,fuel:1.25,tech:1.55,charter:.7,vip:.65,broker:.85,provisioning:.8,toys:.55,security:1.15,transfer:.75}},
 lignano:{label:"LEISURE & FAMILY",description:"Diporto, vacanze, charter e attività acquatiche.",trafficBias:1.05,vesselWeights:{superyacht:.7,charter:1.45,regatta:1.05,service:1.1,port:.75,commercial:.45,rescue:.95},contractWeights:{arrival:1.2,fuel:1.15,tech:.85,charter:1.4,vip:.9,broker:.75,provisioning:1.2,toys:1.5,security:.7,transfer:1}},
 cervia:{label:"SPORT & REGATTA",description:"Vela, eventi sportivi, diporto e water toys.",trafficBias:.98,vesselWeights:{superyacht:.55,charter:1.1,regatta:1.65,service:1.05,port:.75,commercial:.35,rescue:1},contractWeights:{arrival:1.15,fuel:1,tech:.95,charter:1.1,vip:.75,broker:.7,provisioning:1,toys:1.45,security:1.05,transfer:.85}},
 bari:{label:"ADRIATIC GATEWAY",description:"Mix di charter, traffico commerciale e servizi portuali.",trafficBias:1.18,vesselWeights:{superyacht:.85,charter:1.15,regatta:.65,service:1.1,port:1.3,commercial:1.55,rescue:1.1},contractWeights:{arrival:1.3,fuel:1.25,tech:1.25,charter:1.1,vip:.9,broker:1,provisioning:1,toys:.8,security:1.15,transfer:1.05}},
 ravenna:{label:"TECH & WORKBOAT",description:"Assistenza tecnica, mezzi di servizio e traffico operativo.",trafficBias:1.12,vesselWeights:{superyacht:.5,charter:.7,regatta:.55,service:1.45,port:1.45,commercial:1.8,rescue:1.2},contractWeights:{arrival:1.2,fuel:1.3,tech:1.65,charter:.65,vip:.55,broker:.8,provisioning:.75,toys:.5,security:1.2,transfer:.65}},
 pescara:{label:"COASTAL LEISURE",description:"Diporto costiero, charter e attività locali.",trafficBias:.96,vesselWeights:{superyacht:.55,charter:1.35,regatta:1,service:1,port:.8,commercial:.65,rescue:1},contractWeights:{arrival:1.2,fuel:1.1,tech:.95,charter:1.35,vip:.8,broker:.8,provisioning:1.05,toys:1.25,security:.75,transfer:.85}},
 brindisi:{label:"TRANSIT & PORT SERVICES",description:"Transiti, servizi portuali, fuel e assistenza tecnica.",trafficBias:1.2,vesselWeights:{superyacht:.7,charter:.9,regatta:.55,service:1.25,port:1.45,commercial:1.7,rescue:1.15},contractWeights:{arrival:1.4,fuel:1.45,tech:1.35,charter:.8,vip:.7,broker:.9,provisioning:.9,toys:.55,security:1.2,transfer:.9}},
 salerno:{label:"LUXURY CHARTER HUB",description:"Charter premium, superyacht, hospitality e concierge.",trafficBias:1.16,vesselWeights:{superyacht:1.5,charter:1.45,regatta:.8,service:1.1,port:.9,commercial:.55,rescue:1},contractWeights:{arrival:1.25,fuel:1.2,tech:1.05,charter:1.5,vip:1.5,broker:1.15,provisioning:1.4,toys:1.25,security:1.2,transfer:1.4}},
 nettuno:{label:"YACHTING & TECH",description:"Diporto, charter e assistenza tecnica per yacht.",trafficBias:1.02,vesselWeights:{superyacht:.85,charter:1.3,regatta:1,service:1.1,port:.9,commercial:.5,rescue:1},contractWeights:{arrival:1.2,fuel:1.1,tech:1.3,charter:1.25,vip:.9,broker:1,provisioning:1.05,toys:1.1,security:.85,transfer:.9}},
 scarlino:{label:"SAILING & PREMIUM",description:"Vela, regate, yacht premium e servizi hospitality.",trafficBias:1.04,vesselWeights:{superyacht:1,charter:1.15,regatta:1.55,service:1,port:.75,commercial:.3,rescue:.95},contractWeights:{arrival:1.15,fuel:1,tech:1,charter:1.15,vip:1.15,broker:1.05,provisioning:1.2,toys:1.2,security:1,transfer:1.05}},
 loano:{label:"YACHT SERVICES HUB",description:"Yacht, charter, manutenzione e servizi premium.",trafficBias:1.08,vesselWeights:{superyacht:1.1,charter:1.25,regatta:.9,service:1.15,port:.85,commercial:.35,rescue:1},contractWeights:{arrival:1.2,fuel:1.15,tech:1.35,charter:1.25,vip:1.1,broker:1.1,provisioning:1.15,toys:1.05,security:.95,transfer:1}},
 portocervo:{label:"SUPERYACHT & VIP",description:"Superyacht, luxury hospitality, concierge e servizi VIP.",trafficBias:1.22,vesselWeights:{superyacht:1.9,charter:1.35,regatta:.9,service:1.1,port:.8,commercial:.2,rescue:1},contractWeights:{arrival:1.25,fuel:1.2,tech:1.05,charter:1.35,vip:1.8,broker:1.4,provisioning:1.55,toys:1.45,security:1.5,transfer:1.6}},
 capodorlando:{label:"ISLAND CHARTER & SAILING",description:"Charter, vela, cruising e servizi per itinerari insulari.",trafficBias:1.08,vesselWeights:{superyacht:.9,charter:1.5,regatta:1.3,service:1.05,port:.75,commercial:.3,rescue:1},contractWeights:{arrival:1.2,fuel:1.15,tech:.95,charter:1.5,vip:1.05,broker:.9,provisioning:1.3,toys:1.35,security:.8,transfer:1.05}}
};

function profile(id){
 const key=String(id||"").toLowerCase();
 const p=PROFILES[key]||DEFAULT;
 return {id:key||DEFAULT.id,...DEFAULT,...p,
  vesselWeights:{...DEFAULT.vesselWeights,...(p.vesselWeights||{})},
  contractWeights:{...DEFAULT.contractWeights,...(p.contractWeights||{})}
 };
}
function vesselWeight(vessel,id){
 const p=profile(id),key=String(vessel?.profile||"service");
 return Math.max(.05,Number(p.vesselWeights[key])||1);
}
function contractWeight(contract,id){
 const p=profile(id),key=String(contract?.id||"");
 return Math.max(.05,Number(p.contractWeights[key])||1);
}

window.MarinaEmpireMarinaProfiles={profile,vesselWeight,contractWeight,all:()=>({...PROFILES})};
})();