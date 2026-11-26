/* Local beta-save selection only. This is NOT authentication, authorization,
   purchased credit validation, or permission to write any server data.
   The SDK session is inspected only to avoid using another local player's save.
   Unknown session formats, missing helpers and changed contexts fail closed. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else {
    let storage = null;
    try { storage = root.localStorage; } catch (_) {}
    root.MarinaLocalSaveContext = factory(storage);
  }
})(typeof window !== 'undefined' ? window : globalThis, function createLocalSaveContext(storage) {
  'use strict';
  const contextKey = 'marina_empire_local_context_v1';
  const authKey = 'sb-zrdetqvnjmqkfyajxjgp-auth-token';
  const guestKey = 'marina_empire_beta_test_session';
  const validId = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(value);
  const saveKey = id => id === null ? guestKey : 'marina_empire_user_' + id;
  const validRecord = value => value && value.version === 1 &&
    (value.accountId === null || validId(value.accountId)) &&
    typeof value.revision === 'string' && value.revision.length > 0;
  const seenGameRaw = new Map();
  const seenLayoutRaw = new Map();
  function cachedIdentity() {
    try {
      const raw = storage.getItem(authKey);
      if (raw === null) return {accountId:null};
      const session = JSON.parse(raw), user = session && session.user;
      if (!user || !validId(user.id) || !user.email_confirmed_at || user.is_anonymous) return null;
      return {accountId:user.id};
    } catch (_) { return null; }
  }
  function select(accountId) {
    if (accountId === undefined) accountId = null;
    if (accountId !== null && !validId(accountId)) return false;
    try {
      const old = JSON.parse(storage.getItem(contextKey) || 'null');
      if (validRecord(old) && old.accountId === accountId) return true;
      const revision = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() :
        Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      const raw = JSON.stringify({version:1,accountId,revision});
      storage.setItem(contextKey,raw);
      return storage.getItem(contextKey) === raw;
    } catch (_) { return false; }
  }
  function capture() {
    try {
      const raw = storage.getItem(contextKey), record = JSON.parse(raw || 'null'), identity = cachedIdentity();
      if (!validRecord(record) || !identity || identity.accountId !== record.accountId) return null;
      const handle = Object.freeze({raw,accountId:record.accountId,saveKey:saveKey(record.accountId)});
      seenGameRaw.set(handle.raw, storage.getItem(handle.saveKey));
      return handle;
    } catch (_) { return null; }
  }
  function isCurrent(handle) {
    try {
      if (!handle || storage.getItem(contextKey) !== handle.raw) return false;
      const record = JSON.parse(handle.raw), identity = cachedIdentity();
      return !!(validRecord(record) && handle.accountId === record.accountId &&
        handle.saveKey === saveKey(record.accountId) && identity && identity.accountId === record.accountId);
    } catch (_) { return false; }
  }
  function readGame(handle) {
    if (!isCurrent(handle)) return null;
    try {
      const raw = storage.getItem(handle.saveKey);
      seenGameRaw.set(handle.raw, raw);
      const game = JSON.parse(raw || 'null');
      return game && typeof game.name === 'string' && game.name.trim() &&
        Number.isFinite(game.coins) && game.coins >= 0 ? game : null;
    } catch (_) { return null; }
  }
  function writeGame(handle, game) {
    if (!isCurrent(handle) || !game || typeof game.name !== 'string' || !game.name.trim() ||
      !Number.isFinite(game.coins) || game.coins < 0) return false;
    try {
      const before = storage.getItem(handle.saveKey);
      if (!seenGameRaw.has(handle.raw)) seenGameRaw.set(handle.raw,before);
      if (before !== seenGameRaw.get(handle.raw)) return false;
      const raw = JSON.stringify(game);
      if (!isCurrent(handle)) return false;
      storage.setItem(handle.saveKey,raw);
      if (storage.getItem(handle.saveKey) !== raw) return false;
      seenGameRaw.set(handle.raw,raw);
      return true;
    } catch (_) { return false; }
  }
  function layoutKey(handle, marinaId) {
    if (!isCurrent(handle) || typeof marinaId !== 'string' || !/^[a-z0-9_-]{1,64}$/.test(marinaId)) return null;
    return handle.accountId === null ? 'marina-empire-phase1-' + marinaId : handle.saveKey + '_marina_' + marinaId;
  }
  function readLayout(handle, marinaId) {
    const key = layoutKey(handle,marinaId);
    if (!key) return null;
    try {
      const raw=storage.getItem(key);
      seenLayoutRaw.set(handle.raw+'|'+marinaId,raw);
      return JSON.parse(raw || 'null');
    } catch (_) { return null; }
  }
  function writeLayout(handle, marinaId, layout) {
    const key = layoutKey(handle,marinaId);
    if (!key) return false;
    try {
      const tag=handle.raw+'|'+marinaId,before=storage.getItem(key);
      if(!seenLayoutRaw.has(tag))seenLayoutRaw.set(tag,before);
      if(before!==seenLayoutRaw.get(tag))return false;
      const raw = JSON.stringify(layout);
      if (!isCurrent(handle)) return false;
      storage.setItem(key,raw);
      if(storage.getItem(key)!==raw)return false;
      seenLayoutRaw.set(tag,raw);
      return true;
    } catch (_) { return false; }
  }
  function resetLayout(handle, marinaId) {
    const key = layoutKey(handle,marinaId);
    if (!key) return false;
    try {
      const tag=handle.raw+'|'+marinaId,before=storage.getItem(key);
      if(!seenLayoutRaw.has(tag))seenLayoutRaw.set(tag,before);
      if(before!==seenLayoutRaw.get(tag))return false;
      if (!isCurrent(handle)) return false;
      storage.removeItem(key);
      if(storage.getItem(key)!==null)return false;
      seenLayoutRaw.set(tag,null);
      return true;
    } catch (_) { return false; }
  }
  function hasExternalChange(handle,marinaId) {
    if(!isCurrent(handle))return true;
    try{
      if(seenGameRaw.has(handle.raw)&&storage.getItem(handle.saveKey)!==seenGameRaw.get(handle.raw))return true;
      if(marinaId!==undefined){
        const key=layoutKey(handle,marinaId),tag=handle.raw+'|'+marinaId;
        if(!key)return true;
        if(seenLayoutRaw.has(tag)&&storage.getItem(key)!==seenLayoutRaw.get(tag))return true;
      }
      return false;
    }catch(_){return true;}
  }
  return Object.freeze({select,capture,isCurrent,readGame,writeGame,layoutKey,readLayout,writeLayout,resetLayout,hasExternalChange});
});

// Pure research helpers shared by the modern local-save engines, with no storage side effects.
if(typeof window!=="undefined")window.MarinaResearchBenefits=(()=>{
 const ids=["efficient_engines","reinforced_hull","smart_pontoon","sustainable_energy","advanced_solar"];
 function completedAt(g,id){
  if(!ids.includes(id))return null;
  const r=g?.research?.[id];if(!r||!["active","complete"].includes(r.status))return null;
  const t=Number(r.status==="complete"?(r.completedAt||r.completesAt):r.completesAt);
  if(Number.isFinite(t)&&t>0)return t;
  return r.status==="complete"?0:null; // Preserve older undated completed research.
 }
 function complete(g,id,now=Date.now()){const t=completedAt(g,id);return t!==null&&Number.isFinite(now)&&t<=now}
 function effects(g,now=Date.now()){
  const engines=complete(g,"efficient_engines",now),hull=complete(g,"reinforced_hull",now),pontoon=complete(g,"smart_pontoon",now),energy=complete(g,"sustainable_energy",now),solar=complete(g,"advanced_solar",now);
  return{engines,hull,pontoon,energy,solar,fuel:engines?.9:1,wear:hull?.8:1,berth:pontoon?1.2:1,cost:solar?.75:energy?.85:1};
 }
 function marinaTransitions(g,from,to){return [...new Set(["smart_pontoon","sustainable_energy","advanced_solar"].map(id=>completedAt(g,id)).filter(t=>t!==null&&t>from&&t<to))].sort((a,b)=>a-b)}
 return Object.freeze({completedAt,complete,effects,marinaTransitions});
})();

/* Modern world calendar: shared pure simulation logic. */
if(typeof window!=="undefined")window.MarinaWorldLive=(()=>{
 const DAY=86400000,missions="./missions-mobile.html?v=20261125-missions13&tipo=special",marina="./marina-mobile.html?v=20261126-marina9#jobs",water="./weekend-water-toys.html";
 const defs=[
 ["charter_boom","🛥️","Boom charter","Aumentano le richieste di charter e accoglienza.","Charter e accoglienza +18%",.18,["charter"],["welcome"],missions,"VAI AI CONTRATTI"],
 ["yard_rush","🔧","Cantiere sotto pressione","Crescono gli incarichi tecnici e di consegna.","Consegne e assistenza tecnica +20%",.20,["cargo"],["pontoon","service"],marina,"APRI MARINA LIVE"],
 ["owner_selloff","💼","Vendite armatori","Gli armatori richiedono trasferimenti di imbarcazioni.","Trasferimenti +10%",.10,["transfer"],[],"./missions-mobile.html?v=20261125-missions13","CERCA TRASFERIMENTI"],
 ["fuel_pressure","⛽","Pressione sui rifornimenti","Il porto richiede supporto per ormeggi e servizi.","Incarichi ormeggi e servizi +12%",.12,[],["dock","service"],marina,"APRI MARINA LIVE"],
 ["quiet_harbor","⚓","Porto tranquillo","Una giornata dedicata alla cura della marina.","Controlli pontili e meteo +10%",.10,[],["pontoon","weather"],marina,"APRI MARINA LIVE"],
 ["vip_arrivals","✨","Arrivi VIP","Ospiti premium richiedono charter e accoglienza.","Charter e accoglienza +25%",.25,["charter"],["welcome"],missions,"VAI AI CONTRATTI"],
 ["regatta_day","⛵","Giornata di regata","La regata richiede trasferimenti e assistenza.","Trasferimenti e ormeggi +15%",.15,["transfer"],["dock"],marina,"APRI MARINA LIVE"],
 ["superyacht_week","🛳️","Superyacht · giornata premium","Nuovi incarichi per ospiti e servizi premium.","Charter e accoglienza +28%",.28,["charter"],["welcome"],missions,"VAI AI CONTRATTI"],
 ["toy_weekend","🌊","Weekend Water Toys","SUP, eFoil e recuperi water toys sono protagonisti.","Attività Water Toys e recuperi +22%",.22,["recovery"],["sup"],water,"APRI WATER TOYS"]];
 const day=now=>Math.floor(now/DAY);
 function current(now=Date.now()){
  const slot=day(now),weekday=new Date(slot*DAY).getUTCDay();
  const [id,icon,title,detail,bonus,rate,kinds,jobs,href,action]=defs[weekday===0||weekday===6?8:((slot%8)+8)%8];
  return {id,icon,title,detail,bonus,rate,kinds:kinds.slice(),jobs:jobs.slice(),href,action,slot,endsAt:(slot+1)*DAY};
 }
 function bonus(base,kind,type,now=Date.now()){
  const e=current(now),eligible=type==="mission"?e.kinds.includes(kind):type==="job"?e.jobs.includes(kind):type==="water"&&e.id==="toy_weekend";
  return {id:e.id,title:e.title,slot:e.slot,amount:eligible?Math.floor(Math.max(0,Number(base)||0)*e.rate+1e-9):0};
 }
 const jobs=[{id:"sup",icon:"🏄",name:"SUP Experience",cost:120,reward:650,prestige:10,duration:120000},{id:"efoil",icon:"⚡",name:"E-Foil Session",cost:250,reward:1200,prestige:18,duration:240000},{id:"concierge",icon:"🤿",name:"Water Toys Concierge",cost:420,reward:1800,prestige:28,duration:360000}];
 const record=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{};
 function done(g,id,slot){
  const h=record(g?.waterToysHistory);
  if(h["day:"+slot+":"+id])return true;
  return Object.entries(h).some(([key,r])=>r?.id===id&&!key.startsWith("day:")&&(day(Number(r.at))===slot||/^\d+:/.test(key)&&Math.floor(Number(key.split(":")[0])/96)===slot));
 }
 function waterCatalog(g,now=Date.now()){
  const event=current(now),active=g?.waterToysActivity||null,reason=!g?.setupComplete?"Apri prima la partita dalla Home.":g.trip?"Completa prima la navigazione e l'ormeggio.":!(Number(g.voyages)>=1)?"Completa prima la missione Academy.":"";
  return {event,active,reason,jobs:jobs.map(j=>{const completed=done(g,j.id,event.slot),b=bonus(j.reward,j.id,"water",now);return {...j,eventBonus:b.amount,done:completed,available:!reason&&!active&&!completed&&Number(g.coins)>=j.cost+2000}})};
 }
 function startWater(g,id,now=Date.now()){
  const s=waterCatalog(g,now),j=s.jobs.find(x=>x.id===id);
  if(!j?.available)return{ok:false,message:s.reason||"Attività non disponibile o crediti insufficienti (riserva 2.000)."};
  g.coins-=j.cost;g.waterToysActivity={id:j.id,name:j.name,startedAt:now,until:now+j.duration,cost:j.cost,reward:j.reward+j.eventBonus,prestige:j.prestige,daySlot:s.event.slot,eventId:s.event.id,eventBonus:j.eventBonus};
  g.waterToysStarted=Math.max(0,Math.floor(Number(g.waterToysStarted)||0))+1;
  return{ok:true,message:"Attività avviata"};
 }
 function claimWater(g,now=Date.now()){
  const a=g?.waterToysActivity,j=jobs.find(x=>x.id===a?.id);
  if(!a||!j||!Number.isFinite(Number(a.until))||now<Number(a.until)||g.trip)return{ok:false,message:g?.trip?"Completa prima l'ormeggio.":"Attività non ancora completata."};
  const slot=Number.isInteger(a.daySlot)?a.daySlot:day(Number(a.startedAt)||now),key="day:"+slot+":"+j.id;
  if(done(g,j.id,slot)){g.waterToysActivity=null;return{ok:true,message:"Premio già riscosso",amount:0}}
  const extra=a.eventId==="toy_weekend"?Math.max(0,Math.min(Math.floor(j.reward*.22),Number(a.eventBonus)||0)):0,reward=j.reward+extra;
  if(!Number.isSafeInteger(g.coins+reward))return{ok:false,message:"Saldo non valido"};
  g.coins+=reward;g.prestige=Math.max(0,Number(g.prestige)||0)+j.prestige;g.earnings=Math.max(0,Number(g.earnings)||0)+reward;
  g.waterToysCompleted=Math.max(0,Math.floor(Number(g.waterToysCompleted)||0))+1;
  const h=record(g.waterToysHistory);h[key]={id:j.id,at:now,reward,prestige:j.prestige,eventBonus:extra};
  g.waterToysHistory=Object.fromEntries(Object.entries(h).slice(-120));g.lastWaterToysEvent={id:j.id,name:j.name,reward,prestige:j.prestige,at:now};
  g.economyHistory=(Array.isArray(g.economyHistory)?g.economyHistory:[]).concat([{kind:"business_income",id:"water_toys",amount:reward,at:now}]).slice(-300);
  g.waterToysActivity=null;
  return{ok:true,amount:reward,message:"Premio riscosso · +"+reward.toLocaleString("it-IT")+" crediti"};
 }
 return Object.freeze({current,bonus,waterCatalog,startWater,claimWater});
})();
