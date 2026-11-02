/* Read-only validation and recovery for local beta saves. No server permissions. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory();
 else root.MarinaSaveProtection=factory();
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const own=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);
 const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
 const finite=value=>typeof value==='number'&&Number.isFinite(value);
 const nonnegative=value=>finite(value)&&value>=0;
 function validate(value,portIds,boatIds){
  if(!record(value)||typeof value.name!=='string'||!nonnegative(value.coins)||!nonnegative(value.fuel))return false;
  if(!Array.isArray(value.owned)||!value.owned.length||!value.owned.every(id=>typeof id==='string'&&boatIds.has(id)))return false;
  if(!Array.isArray(value.completed)||!value.completed.every(id=>typeof id==='string'))return false;
  for(const key of ['port','homeMarina','investmentMarina'])if(own(value,key)&&!portIds.has(value[key]))return false;
  for(const key of ['boat','setupBoat'])if(own(value,key)&&!boatIds.has(value[key]))return false;
  if(own(value,'boat')&&!value.owned.includes(value.boat))return false;
  if(own(value,'condition')&&(!nonnegative(value.condition)||value.condition>100))return false;
  for(const key of ['prestige','voyages','voyageSerial'])if(own(value,key)&&!nonnegative(value[key]))return false;
  for(const key of ['earnings','charterLastReward','charterEarnings','berthRentalEarnings'])if(own(value,key)&&!finite(value[key]))return false;
  for(const key of ['setupComplete','tutorialDismissed'])if(own(value,key)&&typeof value[key]!=='boolean')return false;
  for(const key of ['settledVoyages','careerAwards'])if(own(value,key)&&(!Array.isArray(value[key])||!value[key].every(id=>typeof id==='string'||nonnegative(id))))return false;
  if(own(value,'reservations')){
   if(!Array.isArray(value.reservations)||!value.reservations.every(item=>record(item)&&portIds.has(item.marina)&&typeof item.slot==='string'&&typeof item.date==='string'))return false;
  }
  for(const key of ['fleetFuel','fleetCondition','fleetPorts'])if(own(value,key)){
   if(!record(value[key]))return false;
   for(const [id,entry] of Object.entries(value[key])){
    if(!boatIds.has(id))continue; // Preserve fields from other/older catalog versions.
    if(key==='fleetPorts'?!portIds.has(entry):!nonnegative(entry))return false;
    if(key==='fleetCondition'&&entry>100)return false;
   }
  }
  for(const key of ['marinas','businesses'])if(own(value,key)){
   if(!record(value[key]))return false;
   for(const item of Object.values(value[key])){
    if(item===null||typeof item==='boolean')continue; // Historical ownership flags are harmless.
    if(!record(item))return false;
    for(const field of ['lastReward','berthLastReward','level'])if(own(item,field)&&!finite(item[field]))return false;
   }
  }
  for(const key of ['lastArrival','lastDockedBridge'])if(own(value,key)&&value[key]!==null){
   if(!record(value[key]))return false;
   for(const field of ['origin','destination'])if(own(value[key],field)&&!portIds.has(value[key][field]))return false;
  }
  if(own(value,'trip')&&value.trip!==null){
   const trip=value.trip;
   if(!record(trip)||typeof trip.id!=='string'||!portIds.has(trip.dest)||!nonnegative(trip.until)||!finite(trip.sec)||trip.sec<=0)return false;
   if(own(trip,'origin')&&!portIds.has(trip.origin))return false;
   if(own(trip,'boat')&&!boatIds.has(trip.boat))return false;
   if(own(trip,'voyageId')&&typeof trip.voyageId!=='string'&&!nonnegative(trip.voyageId))return false;
   if(own(trip,'settled')&&typeof trip.settled!=='boolean')return false;
   if(own(trip,'legIndex')&&(!Number.isInteger(trip.legIndex)||trip.legIndex<0))return false;
   if(own(trip,'legs')){
    if(!Array.isArray(trip.legs)||trip.legs.length<2||!trip.legs.every(id=>portIds.has(id))||trip.legs[trip.legs.length-1]!==trip.dest)return false;
    if(own(trip,'legIndex')&&(!Number.isInteger(trip.legIndex)||trip.legIndex<0||trip.legIndex>=trip.legs.length-1))return false;
   }
   if(own(trip,'legSeconds')&&(!finite(trip.legSeconds)||trip.legSeconds<=0))return false;
   if(own(trip,'mission')){
    const mission=trip.mission;
    if(!record(mission)||typeof mission.id!=='string'||mission.dest!==trip.dest||!nonnegative(mission.reward))return false;
    if(own(mission,'boat')&&!boatIds.has(mission.boat))return false;
    for(const key of ['cost','fuel','prestige'])if(own(mission,key)&&!nonnegative(mission[key]))return false;
   }
  }
  return true;
 }
 function create({getStorage,fresh,ports,boats}){
  const portIds=new Set(ports),boatIds=new Set(boats),records=new Map();
  const valid=value=>validate(value,portIds,boatIds);
  function lock(key,reason,raw){
   const previous=records.get(key);
   const protection={key,blocked:true,reason,raw:typeof raw==='string'?raw:previous?.raw??null};
   records.set(key,protection);return protection;
  }
  function read(key){
   let raw;
   try{raw=getStorage().getItem(key);}catch(_){lock(key,'storage');return fresh();}
   if(raw===null){records.set(key,{key,blocked:false,reason:'',raw:null});return fresh();}
   try{
    const data=JSON.parse(raw);
    if(!valid(data))throw Error('Invalid save');
    const state={...fresh(),...data};
    if(!valid(state))throw Error('Invalid legacy defaults');
    records.set(key,{key,blocked:false,reason:'',raw});return state;
   }catch(_){lock(key,'invalid',raw);return fresh();}
  }
  function canWrite(key,state){
   const protection=records.get(key);
   if(!protection||protection.blocked)return false;
   let raw;
   try{raw=getStorage().getItem(key);}catch(_){lock(key,'storage');return false;}
   if(raw!==null){try{if(!valid(JSON.parse(raw))){lock(key,'invalid',raw);return false;}}catch(_){lock(key,'invalid',raw);return false;}}
   if(!valid(state)){lock(key,'state',raw);return false;}
   return true;
  }
  function didWrite(key,raw){records.set(key,{key,blocked:false,reason:'',raw});}
  function protection(key){return records.get(key)||{key,blocked:true,reason:'unread',raw:null};}
  return {validate:valid,read,canWrite,didWrite,protection};
 }
 return {create};
});
