const assert=require("node:assert/strict");
const fs=require("node:fs");

const traffic=fs.readFileSync("live-traffic.js","utf8");
const chains=fs.readFileSync("service-chains.js","utf8");
const npc=fs.readFileSync("marina-npc.js","utf8");

for(const [name,src] of [["live-traffic.js",traffic],["service-chains.js",chains],["marina-npc.js",npc]]){
  assert.doesNotThrow(()=>new Function(src),name+" must remain valid JavaScript");
}

assert.match(traffic,/profile:"superyacht"/);
assert.match(traffic,/kind:"traghetto"/);
assert.match(traffic,/kind:"cargo"/);
assert.match(traffic,/kind:"peschereccio"/);
assert.match(traffic,/kind:"SAR"/);
assert.match(traffic,/function featuredVessel\(\)/);
assert.match(traffic,/serviceState:completed\?"IN PARTENZA":step>0\?"ORMEGGIATO":"IN ARRIVO"/);
assert.match(traffic,/id:"provisioning"/);
assert.match(traffic,/id:"toys"/);
assert.match(traffic,/id:"security"/);
assert.match(traffic,/id:"transfer"/);

assert.match(chains,/type:"Provisioning"/);
assert.match(chains,/type:"Water Toys"/);
assert.match(chains,/type:"Security"/);
assert.match(chains,/type:"Transfer VIP"/);
assert.match(chains,/MarinaEmpireLiveTraffic\?\.featuredVessel/);
assert.ok(chains.includes("chain.vessel.name"),"service chains must surface the persistent vessel identity");

assert.match(npc,/role:"Purser"/);
assert.match(npc,/role:"Deck Crew"/);
assert.match(npc,/role:"Security"/);
assert.match(npc,/role:"Concierge"/);


assert.match(traffic,/function vesselRelation\(vessel,key=portKey\(\)\)/);
assert.match(traffic,/CLIENTE VIP/);
assert.match(traffic,/useKnown=known\.length>0&&\(seed%100\)<60/);
assert.match(chains,/state\.vesselRelations/);
assert.match(chains,/visits:Math\.max\(0,Math\.floor\(Number\(vr\.visits\)\|\|0\)\)\+1/);
assert.match(chains,/services:Math\.max\(0,Math\.floor\(Number\(vr\.services\)\|\|0\)\)\+chain\.steps\.length/);


const profiles=fs.readFileSync("marina-profiles.js","utf8");
assert.doesNotThrow(()=>new Function(profiles),"marina-profiles.js must remain valid JavaScript");
assert.match(profiles,/portocervo:\{label:"SUPERYACHT & VIP"/);
assert.match(profiles,/ancona:\{label:"PORTO TECNICO & COMMERCIALE"/);
assert.match(profiles,/cervia:\{label:"SPORT & REGATTA"/);
assert.match(profiles,/function vesselWeight\(vessel,id\)/);
assert.match(profiles,/function contractWeight\(contract,id\)/);
assert.match(traffic,/function marinaProfile\(\)/);
assert.match(traffic,/MarinaEmpireMarinaProfiles\?\.vesselWeight/);
assert.match(traffic,/MarinaEmpireMarinaProfiles\?\.contractWeight/);


const localEvents=fs.readFileSync("marina-local-events.js","utf8");
assert.doesNotThrow(()=>new Function(localEvents),"marina-local-events.js must remain valid JavaScript");
assert.match(localEvents,/portocervo:\[/);
assert.match(localEvents,/Arrivi megayacht simulati/);
assert.match(localEvents,/ravenna:\[/);
assert.match(localEvents,/Turno cantiere/);
assert.match(localEvents,/rimini:\[/);
assert.match(localEvents,/Weekend water toys/);
assert.match(localEvents,/function contractWeight\(contract,port\)/);
assert.match(localEvents,/function vesselWeight\(vessel,port\)/);
assert.match(traffic,/function localEvent\(\)/);
assert.match(traffic,/MarinaEmpireLocalEvents\?\.contractWeight/);
assert.match(traffic,/MarinaEmpireLocalEvents\?\.vesselWeight/);
assert.match(traffic,/EVENTO LOCALE SIMULATO/);

console.log("live world contract: ok");
