// Behavioral recovery checks. Only isolated storage; no network or real accounts.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const test=require('node:test'),assert=require('node:assert/strict');
const saveProtection=require('../save-state-guard.js');
const html=fs.readFileSync(path.join(process.env.ME_SAVE_SOURCE_DIR||'.','index.html'),'utf8');
const source=(start,end)=>{const a=html.indexOf(start),b=html.indexOf(end,a+start.length);assert(a>=0&&b>a);return html.slice(a,b);};
const core=source('const fresh=()=>','let meToastTimer=');
const line=prefix=>{const value=html.split('\n').find(item=>item.startsWith(prefix));assert(value,prefix);return value;};
const GUEST='marina_empire_beta_test_session';
const game=()=>({name:'Existing captain',coins:82000,fuel:220,condition:88,port:'rimini',boat:'voyager',owned:['voyager'],completed:['S001'],trip:null,reservations:[],voyages:1});
function harness(raw,{readFails=false,missingHelper=false}={}){
 const data=new Map(),writes=[],notices=[],nodes=new Map(),created=[],blobs=[];
 if(raw!==undefined)data.set(GUEST,raw);
 let inaccessible=readFails;
 function node(){const n={children:[],style:{},hidden:false,value:'',listeners:{},attributes:{},textContent:'',
  classList:{add(){},remove(){},toggle(){}},setAttribute(k,v){this.attributes[k]=v},
  replaceChildren(...items){this.children=items},append(...items){this.children.push(...items)},appendChild(item){this.children.push(item)},
  addEventListener(type,fn){this.listeners[type]=fn},click(){},remove(){}};created.push(n);return n;}
 for(const id of ['playerName','welcome','toast','exportSave','reset','importSaveFile'])nodes.set(id,node());
 const get=id=>nodes.get(id)||created.find(n=>n.id===id)||null;
 const document={getElementById:get,createElement:()=>node(),body:{prepend(){},appendChild(){}},querySelectorAll:()=>[]};
 const storage={getItem(key){if(inaccessible)throw Error('Storage denied');return data.get(key)??null;},setItem(key,value){writes.push(key);data.set(key,String(value));},removeItem(key){writes.push(key);data.delete(key);}};
 const ctx={KEY:GUEST,ME_BASE_SAVE_KEY:GUEST,TEST_MODE:true,window:{MarinaSaveProtection:missingHelper?undefined:saveProtection,meResetGuestRegistration(){}},document,localStorage:storage,
  ports:[{id:'rimini'},{id:'cervia'},{id:'rose'}],boats:[{id:'voyager'},{id:'open'}],boat:()=>({tank:400}),JSON,Number,Math,Array,Set,Error,Date,Blob,
  URL:{createObjectURL(blob){blobs.push(blob);return 'blob:isolated';},revokeObjectURL(){}},URLSearchParams,
  setTimeout:()=>1,console:{warn(){}},notice:message=>notices.push(message),$:get,
  confirm:()=>true,render(){},showTab(){},voyageHeartbeat(){},gameDay:()=> '2026-11-02',
  location:{search:'?reset=1',pathname:'/marina-empire/',hash:''},sessionStorage:{removeItem(){}},history:{replaceState(){}}
 };
 vm.createContext(ctx);vm.runInContext(core,ctx);
 return {ctx,data,writes,notices,blobs,get,raw:()=>data.get(GUEST),run:code=>vm.runInContext(code,ctx),denyReads(){inaccessible=true;}};
}

test('malformed JSON is preserved exactly and cannot be replaced by a fresh game',()=>{
 const raw='{"name":"Recover this captain",';const h=harness(raw);
 assert.equal(h.ctx.window.meLocalSaveBlocked?.(),true);
 assert.equal(h.run('persist()'),false);assert.equal(h.raw(),raw);assert.equal(h.writes.length,0);
 vm.runInContext(line('function enter(){'),h.ctx);h.get('playerName').value='New captain';h.run('enter()');
 assert.equal(h.raw(),raw);assert.equal(h.writes.length,0);assert.equal(h.run('state.name'),'');
});

test('invalid structural fields are quarantined before rendering or automatic writes',()=>{
 for(const patch of [{coins:null},{fuel:'220'},{owned:'voyager'},{completed:[null]},{reservations:{}},{trip:[]},{marinas:[]},{fleetPorts:{voyager:'unknown'}},{boat:'unknown'}]){
  const raw=JSON.stringify({...game(),...patch}),h=harness(raw);
  assert.equal(h.ctx.window.meLocalSaveBlocked?.(),true,JSON.stringify(patch));
  assert.equal(h.run('state.name'),'');assert.equal(h.run('persist()'),false);assert.equal(h.raw(),raw);
 }
});

test('an absent save remains a writable first game',()=>{
 const h=harness();assert.equal(h.ctx.window.meLocalSaveBlocked?.(),false);
 assert.equal(h.run('persist()'),true);assert.equal(JSON.parse(h.raw()).coins,10000);
});

test('legacy optional omissions and additional progress survive a normal load and save',()=>{
 const legacy={name:'Legacy captain',coins:91234,fuel:250,owned:['voyager'],completed:['OLD_MISSION'],customProgress:{harbor:'legacy',rank:7},careerAwards:[1,3],marinas:{rose:{lastReward:12}},businesses:{'rose:legacy':true}};
 const raw=JSON.stringify(legacy),h=harness(raw);
 assert.equal(h.ctx.window.meLocalSaveBlocked?.(),false);assert.equal(h.raw(),raw,'Reading must not migrate the original bytes');
 assert.equal(h.run('persist()'),true);
 const saved=JSON.parse(h.raw());for(const key of Object.keys(legacy))assert.deepEqual(saved[key],legacy[key],key);
 assert.equal(saved.port,'rimini');assert.equal(saved.condition,100);
});

test('inaccessible storage never becomes permission to overwrite an unread save',()=>{
 const raw=JSON.stringify(game()),h=harness(raw,{readFails:true});
 assert.equal(h.ctx.window.meLocalSaveBlocked?.(),true);assert.equal(h.run('persist()'),false);
 assert.equal(h.raw(),raw);assert.equal(h.writes.length,0);
});

test('a valid alternate account remains usable while the corrupt guest slot stays protected',()=>{
 const raw='not-json',h=harness(raw),accountKey='marina_empire_user_player-b';
 h.data.set(accountKey,JSON.stringify({...game(),name:'Other account',coins:50000}));
 vm.runInContext(line('window.meSelectLocalAccount=function('),h.ctx);
 h.ctx.window.meSelectLocalAccount('player-b');assert.equal(h.run('state.name'),'Other account');
 assert.equal(h.ctx.window.meLocalSaveBlocked?.(),false);assert.equal(h.run('persist()'),true);assert.equal(h.raw(),raw);
 h.ctx.window.meSelectLocalAccount(null);assert.equal(h.ctx.window.meLocalSaveBlocked?.(),true);
 assert.equal(h.run('persist()'),false);assert.equal(h.raw(),raw);
});

test('cloud validation rejects malformed nested data before replacing local state',()=>{
 const h=harness(JSON.stringify(game()));vm.runInContext(line('function validState(s){'),h.ctx);
 h.ctx.candidate={...game(),reservations:{},trip:[]};assert.equal(h.run('validState(candidate)'),false);
 h.ctx.candidate={...game(),futureField:{preserved:true}};assert.equal(h.run('validState(candidate)'),true);
});

test('invalid backup content does not replace a valid active game',async()=>{
 const raw=JSON.stringify(game()),h=harness(raw);
 vm.runInContext(line('$("importSaveFile").addEventListener('),h.ctx);
 const backup={format:'marina-empire-backup',version:1,game:{...game(),marinas:42}};
 await h.get('importSaveFile').listeners.change({target:{value:'file',files:[{size:1000,text:async()=>JSON.stringify(backup)}]}});
 assert.equal(h.raw(),raw);assert.equal(h.writes.length,0);assert.equal(h.run('state.coins'),82000);
});

test('raw recovery download contains the exact original text, without a fabricated game',async()=>{
 const raw='{"name":"Capitano è", BROKEN';const h=harness(raw);
 assert.equal(typeof h.ctx.window.meExportProtectedSave,'function');assert.equal(h.ctx.window.meExportProtectedSave(),true);
 assert.equal(h.blobs.length,1);assert.equal(await h.blobs[0].text(),raw);assert.equal(h.raw(),raw);assert.equal(h.writes.length,0);
 const panel=h.get('meLocalSaveRecovery');assert(panel&&!panel.hidden);assert(panel.children.some(n=>String(n.textContent).includes('altro dispositivo')));
});

test('legacy reset query parameter cannot delete either a save or a marina layout',()=>{
 const raw='broken original',h=harness(raw);h.data.set('marina-empire-phase1-rimini','original layout');
 vm.runInContext(source('// For testers only:','const $=id=>'),h.ctx);
 assert.equal(h.raw(),raw);assert.equal(h.data.get('marina-empire-phase1-rimini'),'original layout');assert.equal(h.writes.length,0);
});

test('an invalid in-memory update cannot corrupt the last readable saved state',()=>{
 const raw=JSON.stringify(game()),h=harness(raw);h.run('state.coins=NaN');
 assert.equal(h.run('persist()'),false);assert.equal(h.raw(),raw);assert.equal(h.ctx.window.meLocalSaveBlocked?.(),true);
});

test('storage failure after loading retains the captured raw copy for recovery',async()=>{
 const raw=JSON.stringify(game()),h=harness(raw);h.denyReads();
 assert.equal(h.run('persist()'),false);assert.equal(h.ctx.window.meExportProtectedSave(),true);
 assert.equal(await h.blobs[0].text(),raw);assert.equal(h.writes.length,0);
});

test('a corrupt save appearing during the session is preserved instead of overwritten',()=>{
 const h=harness(JSON.stringify(game())),raw='broken in another tab';h.data.set(GUEST,raw);
 assert.equal(h.run('persist()'),false);assert.equal(h.raw(),raw);assert.equal(h.writes.length,0);
});

test('missing validation code fails closed and preserves the existing save',()=>{
 const raw=JSON.stringify(game()),h=harness(raw,{missingHelper:true});
 assert.equal(h.ctx.window.meLocalSaveBlocked?.(),true);assert.equal(h.run('persist()'),false);
 assert.equal(h.raw(),raw);assert.equal(h.writes.length,0);
});


test('a valid save changed by another tab is blocked instead of overwritten',()=>{
 const original=JSON.stringify(game()),h=harness(original);
 const newer=JSON.stringify({...game(),coins:83000,voyages:2});
 h.data.set(GUEST,newer);
 h.run('state.coins=99999');
 assert.equal(h.run('persist()'),false);
 assert.equal(h.raw(),newer);
 assert.equal(h.run('meRecoveryRecord().reason'),'conflict');
 const panel=h.get('meLocalSaveRecovery');
 assert(panel&&!panel.hidden);
 assert(panel.children.some(n=>String(n.textContent).includes("un'altra scheda")));
});
