// Behavioral regression: RPG Yacht headquarters cannot become a player asset.
// Run from repository root: node tests/headquarters.test.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const rose = fs.readFileSync('isola-delle-rose-originale.html', 'utf8');

// Extract the actual production functions without loading browser/network services.
function functionSource(source, name) {
  const start = source.indexOf('function ' + name + '(');
  assert(start >= 0, 'Missing production function: ' + name);
  let depth = 0, quote = null, escaped = false, opened = false;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    const c = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') { depth++; opened = true; }
    if (c === '}' && --depth === 0 && opened) return source.slice(start, i + 1);
  }
  throw Error('Unterminated production function: ' + name);
}
function declaration(name) {
  const line = html.split('\n').find(l => l.startsWith('const ' + name + '='));
  assert(line, 'Missing production declaration: ' + name);
  return line;
}
const elements = Object.fromEntries(['officeDashboard', 'businessList', 'marinaList'].map(id => [id, {innerHTML:''}]));
const messages = [], handlers = {};
let saves = 0, renders = 0;
const context = vm.createContext({
  state: {}, Date, Math, Number, Object, String, Array, Set,
  $: id => elements[id],
  money: n => Math.round(n).toLocaleString('it-IT'),
  notice: text => messages.push(text),
  persist: () => { saves++; return true; }, meAtomicPersist: fn => { fn(); saves++; return true; }, render: () => { renders++; },
  localStorage: { getItem: () => null },
  berthCapacity: 6,
  gameDay: () => '2026-11-02',
  document: { addEventListener: (event, fn) => { handlers[event] = fn; }, querySelector: () => null },
});
const economy = html.slice(html.indexOf('const marinaEconomy='), html.indexOf('const harborGPS='));
vm.runInContext(declaration('ports') + '\n' + economy + '\n' + declaration('nauticalBusinesses'), context);
for (const name of ['marinaPortfolioSummary', 'fleetDailyIncome', 'marinaBerthSummary', 'renderOffice',
  'renderBusinesses', 'earnBusinessIncome', 'marinaOperatingCosts', 'berthDailyNet',
  'earnBerthRentals', 'earnMarinaIncome', 'berthStatus', 'reserveBerth', 'cancelBerth', 'voyageMarinaURL']) {
  vm.runInContext(functionSource(html, name), context);
}
vm.runInContext('const port=id=>ports.find(p=>p.id===id)||ports[0];', context);
const eventLine = html.split('\n').find(l => l.startsWith('document.addEventListener("change",e=>{if(e.target.id==="investmentMarina")'));
assert(eventLine, 'Production marina click handler missing');
vm.runInContext(eventLine, context);
const run = code => vm.runInContext(code, context);
function click(selector, dataset) {
  handlers.click({target:{closest: candidate => candidate === selector ? {dataset} : null}});
}
function player(extra = {}) {
  return {name:'P0 test',coins:100000000,earnings:0,port:'rose',boat:'voyager',owned:['voyager'],
    marinas:{},businesses:{},reservations:[],trip:null, ...extra};
}

assert.equal(run('canInvestInMarina("rose")'), false);
assert.equal(run('marinaPrice("rose")'), null, 'Headquarters must have no player price');
assert.equal(run('marinaIncome("rose")'), 0);
assert.equal(run('canInvestInMarina("unknown")'), false);
assert.equal(run('marinaPrice("rimini")'), 8000000);

for (const legacy of [false, true]) {
  const stamp = Date.now() - 3 * 86400000;
  context.state = player(legacy ? {
    marinas:{rose:{lastReward:stamp,berthLastReward:stamp,level:4,built:40}},
    businesses:{'rose:sup':{lastReward:stamp,marinaId:'rose'}},
    reservations:[{marina:'rose',slot:'A-01',date:'2026-11-02'}],
  } : {});
  const snapshot = JSON.stringify(context.state), writesBefore = saves;
  for (const [selector, dataset] of [
    ['[data-marina]', {marina:'rose'}],
    ['[data-marina-upgrade]', {marinaUpgrade:'rose'}],
    ['[data-business]', {business:'sup',businessMarina:'rose'}],
    ['[data-berth]', {berth:'rose',slot:'A-01'}],
    ['[data-marina]', {marina:'unknown'}],
  ]) {
    click(selector, dataset);
    assert.equal(JSON.stringify(context.state), snapshot, 'Denied action must not change player save: ' + selector);
  }
  run('reserveBerth("rose","A-02"); cancelBerth("rose","A-01");');
  assert.equal(JSON.stringify(context.state), snapshot, 'Direct booking calls must also be denied');
  assert.equal(run('fleetDailyIncome()'), 0);
  assert.equal(run('marinaPortfolioSummary().owned'), 0);
  assert.equal(run('marinaPortfolioSummary().activities'), 0);
  assert.equal(run('marinaPortfolioSummary().net'), 0);
  assert.equal(run('berthDailyNet("rose")'), 0);
  assert.equal(run('marinaOperatingCosts("rose").total'), 0);
  run('earnBusinessIncome(); earnMarinaIncome(); earnBerthRentals();');
  assert.equal(JSON.stringify(context.state), snapshot, 'Legacy headquarters must not earn, debit or erase player data');
  assert.equal(saves, writesBefore, 'No persistence should follow a denied headquarters action');
}

// Genuine investments remain functional in other marinas.
context.state = player({port:'rimini'});
click('[data-marina]', {marina:'rimini'});
assert.equal(context.state.coins, 92000000);
assert(Number.isFinite(context.state.marinas.rimini.lastReward));
assert.equal(run('marinaPortfolioSummary().owned'), 1);
click('[data-business]', {business:'sup',businessMarina:'rimini'});
assert.equal(context.state.coins, 91988000);
assert(context.state.businesses['rimini:sup']);
const levelCost = Math.round(8000000 * .025);
click('[data-marina-upgrade]', {marinaUpgrade:'rimini'});
assert.equal(context.state.marinas.rimini.level, 2);
assert.equal(context.state.coins, 91988000 - levelCost);
assert(run('fleetDailyIncome()') > 0);

// UI does not describe old headquarters entries as player-owned or purchasable.
context.state = player({investmentMarina:'rose',marinas:{rose:{lastReward:Date.now()}},
  businesses:{'rose:sup':{lastReward:Date.now()}}});
run('renderOffice(); renderBusinesses();');
for (const id of ['officeDashboard','businessList']) {
  assert(elements[id].innerHTML.includes('RPG Yacht'));
  assert(elements[id].innerHTML.includes('Non in vendita'));
  assert(elements[id].innerHTML.includes('./isola-delle-rose-originale.html'));
  assert(!/data-(?:marina(?:-upgrade)?|business|office-marina3d)=/.test(elements[id].innerHTML));
  assert(!elements[id].innerHTML.includes('5.000.000'));
}
const marinaListLine = html.split('\n').find(l => l.startsWith('$("marinaList").innerHTML=ports.map('));
assert(marinaListLine, 'Production marina list renderer missing');
run(marinaListLine);
assert(!/data-(?:marina|berth)="rose"/.test(elements.marinaList.innerHTML));
assert(elements.marinaList.innerHTML.includes('data-marina="rimini"'));
assert.equal(run('voyageMarinaURL("rose")'), './isola-delle-rose-originale.html');

// Standalone original scene: execute public management controls and click a berth.
const roseElements = {};
const roseMessages = [];
let storageWrites = 0;
const pointerHandlers = {};
const occupied = new Set(['1-1']);
const reserved = new Set();
let clickedBerth = '1-1';
const roseContext = vm.createContext({
  $: id => roseElements[id] ||= {},
  say: text => roseMessages.push(text),
  state:{credits:125800,active:40,lastCharter:0,booked:['1-1']},
  occupied, reserved,
  localStorage:{setItem:()=>storageWrites++,removeItem:()=>storageWrites++},
  renderer:{domElement:{addEventListener:(event,fn)=>pointerHandlers[event]=fn,
    getBoundingClientRect:()=>({left:0,top:0,width:100,height:100})}},
  THREE:{Raycaster:class {setFromCamera(){} intersectObjects(){return [{object:{parent:{visible:true},userData:{id:clickedBerth}}}]}},
    Vector2:class {set(){}}},
  camera:{}, slots:[], Math,
});
const visitMessage = rose.split('\n').find(l => l.startsWith('const RPG_VISIT_MESSAGE='));
assert(visitMessage);
vm.runInContext(visitMessage, roseContext);
vm.runInContext(functionSource(rose,'adjustCredits') + ';' + functionSource(rose,'save'), roseContext);
for (const id of ['charter','unlock','reset']) {
  const handler = rose.match(new RegExp("\\$\\('" + id + "'\\)\\.onclick=\\(\\)=>say\\(RPG_VISIT_MESSAGE\\);"));
  assert(handler, id + ' must be a read-only public control');
  vm.runInContext(handler[0], roseContext);
  roseElements[id].onclick();
  assert(roseMessages.at(-1).includes('gestione esclusiva RPG Yacht'));
  assert(new RegExp('<button id="' + id + '" disabled>').test(rose));
}
assert.equal(vm.runInContext('adjustCredits(650)', roseContext), false);
assert.equal(vm.runInContext('adjustCredits(-4000)', roseContext), false);
const pointerLine = rose.split('\n').find(l => l.startsWith('const ray=new THREE.Raycaster()'));
assert(pointerLine, 'Original scene berth interaction missing');
vm.runInContext(pointerLine, roseContext);
for (const berth of ['1-1','1-2']) {
  clickedBerth = berth;
  pointerHandlers.pointerdown({clientX:20,clientY:20});
  pointerHandlers.pointerup({clientX:20,clientY:20});
  assert.deepEqual([...occupied], ['1-1']);
  assert(roseMessages.at(-1).includes('Gestione riservata a RPG Yacht'));
}
vm.runInContext('save()', roseContext);
assert.equal(storageWrites, 0, 'Public scene must not write player money or marina layout');
assert(!/localStorage\.(setItem|removeItem)/.test(rose), 'No public persistence mutations in headquarters scene');
for (const token of ["$('transferSmall').onclick=()=>transferBetween(false)", "$('arrival').onclick=", 'renderer.setAnimationLoop(', 'function goToMarina(']) {
  assert(rose.includes(token), 'Original visual controls and animation must remain: ' + token);
}
console.log('PASS: headquarters purchases, upgrades, business, legacy income, UI and original-scene money/berth guards; other marina investments still work.');
