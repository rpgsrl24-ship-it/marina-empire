// Behavioral P0 navigation checks against production functions.
// Network, account services and rendering are excluded; no live player data is used.
// Run from repository root: node tests/navigation-p0.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const saveProtection = require('../save-state-guard.js');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function functionSource(name) {
  const start = html.indexOf('function ' + name + '(');
  assert(start >= 0, 'Missing production function: ' + name);
  let depth = 0, quote = null, escaped = false, lineComment = false, blockComment = false;
  for (let i = html.indexOf('{', start); i < html.length; i++) {
    const c = html[i], next = html[i + 1];
    if (lineComment) { if (c === '\n') lineComment = false; continue; }
    if (blockComment) { if (c === '*' && next === '/') { blockComment = false; i++; } continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '/' && next === '/') { lineComment = true; i++; continue; }
    if (c === '/' && next === '*') { blockComment = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    if (c === '}' && --depth === 0) return html.slice(start, i + 1);
  }
  throw Error('Unterminated production function: ' + name);
}
function declaration(name) {
  const line = html.split('\n').find(l => l.startsWith('const ' + name + '='));
  assert(line, 'Missing production declaration: ' + name);
  return line;
}
function harness(extra = {}) {
  let now = Date.UTC(2026, 10, 2, 9), renders = 0;
  class GameDate extends Date { static now() { return now; } }
  const storage = new Map(), notices = [], events = [], elements = {}, handlers = {};
  const context = vm.createContext({
    Date: GameDate, console, Math, Number, Object, String, Array, Set,
    KEY: 'navigation-p0-test',
    $: id => elements[id] || null,
    localStorage: {setItem:(k,v) => storage.set(k,v), getItem:k => storage.get(k) || null},
    document: {hidden:true,getElementById:() => null,addEventListener:(type,fn)=>{handlers[type]=fn;}},
    window: {meRegisteredPlayer:true,MarinaEmpireTraffic:{track:()=>{}},MarinaEmpireAuthenticatedActivity:{track:()=>{}}},
    notice: message => notices.push(message),
    render: () => renders++, showTab: name => events.push(name), money: String,
    updateVoyageMap: () => {},
    awardCareerMilestones: () => {},
  });
  for (const name of ['ports','boats','harborGPS','seaCorridors','adriaticPorts','tyrrhenianPorts',
    'coastalExit','adriaticSpine','tyrrhenianSpine','missions','fresh','boat','port']) {
    vm.runInContext(declaration(name), context);
  }
  const weatherStart=html.indexOf('const simulatedWeather=['),weatherEnd=html.indexOf('// Simulated sea-corridor graph',weatherStart);
  assert(weatherStart>=0&&weatherEnd>weatherStart,'Missing production simulated weather block');
  vm.runInContext(html.slice(weatherStart,weatherEnd),context);
  for (const name of ['straightNm','seaWaypoints','voyageRoutePoints','seaMiles','planSeaTrip',
    'crewForBoat','charterContract','availableMissions','findAvailableMission','missionBudget',
    'persist','meCloneState','meEconomyStateValid','meAtomicPersist','fuelBurnPerNm','launch','finishVoyage','voyageHeartbeat']) {
    vm.runInContext(functionSource(name), context);
  }
  const run = code => vm.runInContext(code, context);
  context.state = {...run('fresh()'), name:'Navigation test', setupComplete:true, coins:100000, ...extra};
  const guard=saveProtection.create({getStorage:()=>context.localStorage,fresh:()=>run('fresh()'),ports:run('ports.map(p=>p.id)'),boats:run('boats.map(b=>b.id)')});
  guard.read('navigation-p0-test');
  context.window.meCanWriteLocalSave=()=>{assert(guard.canWrite('navigation-p0-test',context.state),'Production navigation state must pass the save validator');return true;};
  context.window.meDidWriteLocalSave=raw=>guard.didWrite('navigation-p0-test',raw);
  return {
    context, run, notices, events, storage, elements, handlers,
    get state() { return context.state; },
    snapshot: () => JSON.stringify(context.state),
    nextLeg() { now = Number(context.state.trip.until); run('voyageHeartbeat()'); },
    restore() { context.state = JSON.parse(storage.get('navigation-p0-test')); },
    get renders() { return renders; },
  };
}
const cases = [];
function test(name, callback) { cases.push([name, callback]); }

test('Two consecutive missions use the saved arrival marina, with no stale origin', () => {
  const h = harness();
  h.run('launch("INTRO_RIMINI_CERVIA")');
  assert.equal(h.state.trip.origin, 'rimini');
  assert.equal(h.state.trip.dest, 'cervia');
  h.nextLeg();
  assert.equal(h.state.port, 'cervia');
  assert.equal(h.state.trip, null);
  h.restore();
  assert.equal(h.state.fleetPorts.voyager, 'cervia');
  assert.equal(h.run('availableMissions().some(m=>m.dest===state.port)'), false);
  assert.equal(h.run('findAvailableMission("INTRO_RIMINI_CERVIA")'), undefined);
  const next = h.run('availableMissions().find(m=>m.dest==="ancona")');
  assert(next && h.run('missionBudget(availableMissions().find(m=>m.dest==="ancona")).ready'));
  h.context.nextId = next.id;
  h.run('launch(nextId)');
  assert.equal(h.state.trip.origin, 'cervia');
  assert.equal(h.state.trip.legs[0], 'cervia');
  while (h.state.trip) h.nextLeg();
  assert.equal(h.state.port, 'ancona');
  assert.equal(h.state.voyages, 2);
  h.restore();
  assert.equal(h.state.port, 'ancona');
  assert.equal(h.state.fleetPorts.voyager, 'ancona');
});

test('Unknown, stale and same-port missions cannot charge credits or move the yacht', () => {
  const h = harness();
  for (const id of ['UNKNOWN','R_voyager_rimini_rimini','R_voyager_ancona_bari','S001']) {
    const before = h.snapshot();
    h.context.requestedId = id;
    h.run('launch(requestedId)');
    assert.equal(h.snapshot(), before, id);
  }
  for (const [a,b] of [['rimini','rimini'],['rimini','unknown'],['unknown','rimini']]) {
    h.context.from = a; h.context.to = b;
    assert.equal(h.run('planSeaTrip(from,to,400).possible'), false);
  }
});

test('Every configured vessel produces a valid saved voyage and valid arrival state', () => {
  const catalog=harness().run('boats.map(b=>({id:b.id,tank:b.tank}))');
  for(const vessel of catalog){
    const h=harness({boat:vessel.id,owned:[vessel.id],fuel:vessel.tank});
    const mission=h.run('availableMissions().find(m=>m.dest==="cervia"&&missionBudget(m).ready)');
    assert(mission,vessel.id+' must have a representative available mission');
    h.context.missionId=mission.id;h.run('launch(missionId)');
    assert(h.state.trip);h.restore();assert(h.state.trip,vessel.id+' voyage is persisted');
    while(h.state.trip)h.nextLeg();
    h.restore();assert.equal(h.state.port,'cervia');assert.equal(h.state.trip,null);
  }
});

test('All configured vessel/port plans use finite valid legs and preserve the fuel reserve', () => {
  const h = harness();
  const report = h.run(`(() => {
    let possible=0, blocked=0, multi=0;
    for(const b of boats) for(const a of ports) for(const z of ports) {
      if(a.id===z.id)continue;
      const p=planSeaTrip(a.id,z.id,b.tank,fuelBurnPerNm(b.id));
      if(!p.possible){blocked++;continue;}
      if(p.legs.length>2)multi++;
      if(p.legs[0]!==a.id||p.legs.at(-1)!==z.id)throw Error('Wrong route endpoints');
      if(new Set(p.legs).size!==p.legs.length)throw Error('Cyclic route');
      let distance=0,fuel=0;
      for(let i=1;i<p.legs.length;i++) {
        const points=voyageRoutePoints(p.legs[i-1],p.legs[i]);
        if(points.length<2||points.some(x=>x.length!==2||!x.every(Number.isFinite)))throw Error('Invalid coordinates');
        if(JSON.stringify(points[0])!==JSON.stringify(harborGPS[p.legs[i-1]])||JSON.stringify(points.at(-1))!==JSON.stringify(harborGPS[p.legs[i]]))throw Error('GPS endpoints mismatch');
        const d=seaMiles(p.legs[i-1],p.legs[i]),f=Math.ceil(d*fuelBurnPerNm(b.id));
        if(!(d>0)||f+Math.ceil(b.tank*.15)>b.tank)throw Error('Impossible leg');
        distance+=d;fuel+=f;
      }
      if(p.distance!==distance||p.fuel!==fuel)throw Error('Plan totals mismatch');
      possible++;
    }
    return {possible,blocked,multi,total:possible+blocked};
  })()`);
  assert.equal(report.total, 1470);
  assert(report.multi > 0 && report.possible > 0);
  console.log('  ROUTE MATRIX ' + JSON.stringify(report));
});

test('First-leg fuel boundary matches budget and rejects one litre below reserve', () => {
  const h = harness();
  const required = h.run('Math.ceil(seaMiles("rimini","cervia")*fuelBurnPerNm("voyager"))+Math.ceil(boat("voyager").tank*.15)');
  h.state.fuel = required - 1;
  assert.equal(h.run('missionBudget(findAvailableMission("INTRO_RIMINI_CERVIA")).ready'), false);
  const before = h.snapshot();
  h.run('launch("INTRO_RIMINI_CERVIA")');
  assert.equal(h.snapshot(), before);
  h.state.fuel = required;
  assert.equal(h.run('missionBudget(findAvailableMission("INTRO_RIMINI_CERVIA")).ready'), true);
  h.run('launch("INTRO_RIMINI_CERVIA")');
  assert.equal(h.state.fuel, 60);
  h.nextLeg();
  assert.equal(h.state.fuel, 60);
  assert.ok([95,96,97].includes(h.state.condition),'Weather wear must be 3-5%');
});

test('Maintenance threshold and active-voyage guards prevent extra charges', () => {
  const h = harness({condition:29});
  const before = h.snapshot();
  assert.equal(h.run('missionBudget(findAvailableMission("INTRO_RIMINI_CERVIA")).ready'), false);
  h.run('launch("INTRO_RIMINI_CERVIA")');
  assert.equal(h.snapshot(), before);
  h.state.condition = 30;
  h.run('launch("INTRO_RIMINI_CERVIA")');
  assert(h.state.trip);
  const running = h.snapshot();
  h.run('launch("INTRO_RIMINI_CERVIA")');
  assert.equal(h.snapshot(), running);
  h.nextLeg();
  assert.equal(h.state.condition, 27);
});

test('Multi-stop budgets equal actual costs and preserve progress after reload', () => {
  const h = harness({fuel:400});
  const candidate = h.run('availableMissions().find(m=>m.plan?.possible&&m.plan.legs.length>2&&missionBudget(m).ready)');
  assert(candidate, 'A real configured route with refuelling stops must be tested');
  const initialCoins = h.state.coins;
  h.context.candidateId = candidate.id;
  const budget = h.run('missionBudget(findAvailableMission(candidateId))');
  h.run('launch(candidateId)');
  const planned = JSON.parse(JSON.stringify(h.state.trip.legs));
  let stops = 0;
  while(h.state.trip) {
    h.restore();
    const previous = h.state.trip.legIndex;
    h.nextLeg();
    assert(h.state.fuel >= 60 && h.state.fuel <= 400);
    if(h.state.trip) {
      stops++;
      assert.equal(h.state.trip.legIndex,previous+1);
      assert.equal(h.state.port,planned[previous+1]);
      assert.equal(h.state.voyages,0);
      assert.equal(h.state.fleetPorts.voyager,h.state.port);
    }
  }
  assert.equal(stops,planned.length-2);
  assert.equal(h.state.port,candidate.dest);
  assert.equal(h.state.coins,initialCoins-budget.total+candidate.reward);
  assert.ok([95,96,97].includes(h.state.condition),'Weather wear must be 3-5%');
  assert.equal(h.state.voyages,1);
});

test('Insufficient funds for scheduled stops reject departure before any charge', () => {
  const h = harness({fuel:400});
  const m = h.run('availableMissions().find(m=>m.plan?.possible&&m.plan.legs.length>2&&missionBudget(m).refuel>0)');
  assert(m);
  h.context.missionId = m.id;
  const budget = h.run('missionBudget(findAvailableMission(missionId))');
  h.state.coins = budget.total-1;
  const before = h.snapshot();
  assert.equal(h.run('missionBudget(findAvailableMission(missionId)).ready'),false);
  h.run('launch(missionId)');
  assert.equal(h.snapshot(),before);
});

test('Unexpected loss of stop funds docks without reward or negative fuel', () => {
  const h = harness({fuel:400});
  const m = h.run('availableMissions().find(m=>m.plan?.possible&&m.plan.legs.length>2&&missionBudget(m).refuel>0)');
  h.context.missionId = m.id;
  h.run('launch(missionId)');
  const firstStop = h.state.trip.legs[1];
  h.state.coins = 0;
  h.state.fuel = 60;
  h.nextLeg();
  assert.equal(h.state.trip,null);
  assert.equal(h.state.port,firstStop);
  assert.equal(h.state.coins,0);
  assert.equal(h.state.voyages,0);
  assert.equal(h.state.lastDockedBridge.interrupted,true);
  assert(h.state.fuel>=0);
  h.restore();
  assert.equal(h.state.fleetPorts.voyager,firstStop);
});

test('Marina fuel and repair services stop at capacity and are unavailable at sea', () => {
  const h = harness({fuel:390,condition:95});
  for(const id of ['refuel','repair']) {
    h.elements[id] = {};
    const line = html.split('\n').find(l=>l.startsWith('$("'+id+'").onclick='));
    assert(line);
    h.run(line);
  }
  const initialCoins = h.state.coins;
  h.elements.refuel.onclick();
  assert.equal(h.state.fuel,400);
  assert.equal(h.state.coins,initialCoins-30);
  h.elements.refuel.onclick();
  assert.equal(h.state.coins,initialCoins-30);
  h.elements.repair.onclick();
  assert.equal(h.state.condition,100);
  assert.equal(h.state.coins,initialCoins-1030);
  h.run('launch("INTRO_RIMINI_CERVIA")');
  const sailing = h.snapshot();
  h.elements.refuel.onclick();h.elements.repair.onclick();
  assert.equal(h.snapshot(),sailing);
});

test('Changing yachts restores each vessel port, fuel and wear without moving the other vessel', () => {
  const h = harness({port:'cervia',fuel:380,condition:93,owned:['voyager','open'],
    fleetPorts:{voyager:'cervia',open:'ancona'},fleetFuel:{voyager:380,open:120},
    fleetCondition:{voyager:93,open:72}});
  const line=html.split('\n').find(l=>l.startsWith('document.addEventListener("change",e=>{if(e.target.id==="investmentMarina")'));
  assert(line,'Production vessel-selection handler missing');
  h.run(line);
  const choose=id=>h.handlers.click({target:{closest:selector=>selector==='[data-boat]'?{dataset:{boat:id}}:null}});
  const coins=h.state.coins;
  choose('open');
  assert.equal(h.state.boat,'open');
  assert.equal(h.state.port,'ancona');
  assert.equal(h.state.fuel,120);
  assert.equal(h.state.condition,72);
  // Model a saved visit made by this vessel, then switch away and back.
  h.state.port='bari';h.state.fuel=20;h.state.condition=69;
  h.run('persist()');
  choose('voyager');
  assert.equal(h.state.port,'cervia');
  assert.equal(h.state.fuel,380);
  assert.equal(h.state.condition,93);
  choose('open');
  assert.equal(h.state.port,'bari');
  assert.equal(h.state.fuel,20);
  assert.equal(h.state.condition,69);
  assert.equal(h.state.coins,coins);
  choose('voyager');
  h.run('launch("R_voyager_cervia_ancona")');
  assert(h.state.trip);
  const sailing=h.snapshot();
  choose('open');
  assert.equal(h.snapshot(),sailing,'A vessel cannot be changed in the middle of a voyage');
});

let failures = 0;
for (const [name, callback] of cases) {
  try { callback(); console.log('PASS ' + name); }
  catch(error) { failures++; console.error('FAIL ' + name); console.error(error.stack); }
}
console.log((cases.length-failures)+'/'+cases.length+' behavioral navigation P0 checks passed');
assert.equal(failures,0,'P0 navigation regression');
