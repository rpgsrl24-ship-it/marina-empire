// Behavioral P0 regressions. No network, live accounts, emails or real payments.
// Set P0_SOURCE_DIR to a baseline source snapshot to reproduce the original failures.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');
const path=require('node:path');
const source=file=>fs.readFileSync(path.join(process.env.P0_SOURCE_DIR||'.',file),'utf8');
const html=source('index.html'),adminHtml=source('admin.html');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}};
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function node(initial=''){
 const classes=new Set(initial.split(' ').filter(Boolean));let text='';
 return {children:[],value:'',style:{},disabled:false,
  get textContent(){return text+this.children.map(x=>x.textContent||'').join('')},set textContent(v){text=String(v);this.children=[]},
  classList:{add(...names){names.forEach(x=>classes.add(x))},remove(...names){names.forEach(x=>classes.delete(x))},contains(x){return classes.has(x)},toggle(x,force){const value=force===undefined?!classes.has(x):force;value?classes.add(x):classes.delete(x);return value}},
  replaceChildren(...children){text='';this.children=children},append(...children){this.children.push(...children)},appendChild(child){this.children.push(child);return child},
  setAttribute(){},addEventListener(type,fn){this['on'+type]=fn}
 };
}
function dom(){const elements=new Map();const get=id=>{if(!elements.has(id))elements.set(id,node(id==='dashboard'?'hidden':''));return elements.get(id)};return {get,elements,document:{getElementById:get,createElement:()=>node()}}}
function storage(seed={}){const data=new Map(Object.entries(seed));return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k),data}}
function queryClient(respond,calls=[]){return {from(table){calls.push(table);const filters={};const q={select(){return q},eq(k,v){filters[k]=v;return q},order(){return q},limit(){return q},gte(){return q},in(){return q},range(){return q},update(){return q},maybeSingle(){return Promise.resolve(respond(table,filters))},then(resolve,reject){return Promise.resolve(respond(table,filters)).then(resolve,reject)}};return q}}}
function functionSection(start,end){const a=html.indexOf(start),b=html.indexOf(end,a);assert(a>=0&&b>a,'Source section not found: '+start);return html.slice(a,b)}
function adminHarness(){
 const ui=dom(),calls=[];let currentUser={id:'admin-a',email:'admin@example.test'},listener=null;
 const client=queryClient((table,filters)=>{
  if(table==='me_admin_users')return {data:filters.user_id==='admin-a'?{user_id:'admin-a'}:null,error:null};
  if(table==='player_profiles')return {data:[{captain_name:'Private captain',created_at:'2026-11-01T00:00:00Z'}],count:1,error:null};
  if(table==='player_progress')return {data:[{game_state:{owned:['voyager'],completed:['trial'],voyages:1}}],count:1,error:null};
  return {data:[],count:0,error:null};
 },calls);
 client.auth={getUser:async()=>({data:{user:currentUser},error:currentUser?null:new Error('Auth session missing!')}),signOut:async()=>{currentUser=null;if(listener)listener('SIGNED_OUT',null);return {error:null}},signInWithPassword:async()=>({error:null}),onAuthStateChange:fn=>{listener=fn;return {data:{subscription:{unsubscribe(){}}}}}};
 client.channel=()=>{const ch={on(){return ch},subscribe(){return ch},presenceState(){return {}}};return ch};client.removeChannel=()=>{};
 const script=[...adminHtml.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].find(m=>m[1].includes('async function authorized(user)'))?.[1];assert(script,'Administrator script found');
 const context={document:ui.document,window:{supabase:{createClient:()=>client}},localStorage:storage(),console,Date,Intl,URL,setInterval:()=>1,clearInterval(){},setTimeout:()=>1};
 vm.runInNewContext(script,context);
 return {ui,calls,get listener(){return listener},signOutElsewhere(){currentUser=null;if(listener)listener('SIGNED_OUT',null)}};
}

test('Admin logout hides and clears data even when getUser reports no session',async()=>{
 const h=adminHarness();await flush();assert.equal(h.ui.get('dashboard').classList.contains('hidden'),false);assert.match(h.ui.get('profiles').textContent,/Private captain/);
 await h.ui.get('signout').onclick();await flush();
 assert.equal(h.ui.get('dashboard').classList.contains('hidden'),true,'Logged-out dashboard must be hidden');
 assert.equal(h.ui.get('profiles').textContent,'','Private profiles must be cleared');
 assert.equal(h.ui.get('identity').textContent,'');
});
test('Admin logout in another tab immediately invalidates the displayed dashboard',async()=>{
 const h=adminHarness();await flush();assert.equal(typeof h.listener,'function','Admin must listen for authentication changes');h.signOutElsewhere();
 assert.equal(h.ui.get('dashboard').classList.contains('hidden'),true);assert.equal(h.ui.get('profiles').textContent,'');
});
test('A late admin membership response cannot reopen the game dashboard after logout',async()=>{
 const ui=dom(),membership=deferred(),calls=[];const client=queryClient(table=>table==='me_admin_users'?membership.promise:table==='player_profiles'?{error:null,count:1,data:[{captain_name:'Private captain'}]}:{error:null,count:0,data:[]},calls);
 const context={document:ui.document,el:ui.get,account:{id:'admin-a'},client,console,Date,Intl};vm.createContext(context);
 const start=html.includes('let adminRequestVersion=')?'let adminRequestVersion=':'async function refreshRoseAdmin()';vm.runInContext(functionSection(start,'function toggle()'),context);
 const pending=vm.runInContext('refreshRoseAdmin()',context);context.account=null;await vm.runInContext('refreshRoseAdmin()',context);membership.resolve({error:null,data:{user_id:'admin-a'}});await pending;
 assert.equal(ui.get('roseAdminPanel').classList.contains('hide'),true);assert.equal(ui.get('roseAdminStats').textContent,'');assert.equal(calls.filter(x=>x==='player_profiles'||x==='player_progress').length,0,'No private reads after account changed');
});
test('A failed admin check never reveals previous account statistics',async()=>{
 const ui=dom();ui.get('roseAdminStats').textContent='Private captain';const context={document:ui.document,el:ui.get,account:{id:'player-b'},client:queryClient(()=>Promise.reject(new Error('offline'))),console,Date,Intl};
 vm.createContext(context);const start=html.includes('let adminRequestVersion=')?'let adminRequestVersion=':'async function refreshRoseAdmin()';await vm.runInContext(functionSection(start,'function toggle()')+';refreshRoseAdmin()',context);
 assert.equal(ui.get('roseAdminPanel').classList.contains('hide'),true);assert.equal(ui.get('roseAdminStats').textContent,'');
});
test('A late wallet response cannot show the previous account balance',async()=>{
 const ui=dom(),a=deferred(),b=deferred();const context={el:ui.get,account:{id:'a'},client:queryClient((table,f)=>f.user_id==='a'?a.promise:b.promise)};vm.createContext(context);
 const start=html.includes('let walletRequestVersion=')?'let walletRequestVersion=':'async function refreshPurchasedWallet()';const end=html.includes('let adminRequestVersion=')?'let adminRequestVersion=':'async function refreshRoseAdmin()';vm.runInContext(functionSection(start,end),context);
 const first=vm.runInContext('refreshPurchasedWallet()',context);context.account={id:'b'};const second=vm.runInContext('refreshPurchasedWallet()',context);b.resolve({error:null,data:{balance:200}});await second;a.resolve({error:null,data:{balance:100}});await first;
 assert.match(ui.get('meWalletBalance').textContent,/200/);assert.doesNotMatch(ui.get('meWalletBalance').textContent,/100/);
});
function guestHarness(){
 const base='marina_empire_beta_test_session',guest={name:'Guest captain',owned:['voyager'],completed:['trial'],coins:10420,fuel:350,voyages:1};const ui=dom(),saved=storage({[base]:JSON.stringify(guest)});
 const context={KEY:base,state:JSON.parse(JSON.stringify(guest)),window:{MarinaSaveProtection:require('../save-state-guard.js')},localStorage:saved,$:ui.get,document:ui.document,ports:[{id:'rimini'},{id:'cervia'}],boats:[{id:'voyager'}],console,fresh:()=>({name:'',owned:['voyager'],completed:[],coins:10000,fuel:400,voyages:0}),render(){},showTab(){},persist(){saved.setItem(context.KEY,JSON.stringify(context.state))}};
 vm.createContext(context);vm.runInContext(functionSection('const ME_BASE_SAVE_KEY=KEY;','// For testers only:'),context);
 if(html.includes('const meSaveProtection='))vm.runInContext(functionSection('const meSaveProtection=','function persist()'),context);
 return {context,ui,saved,guest,base};
}
test('Verified first signup keeps guest progress and assigns it to only one account',()=>{
 const h=guestHarness(),w=h.context.window,user={id:'new-a',email:'new@example.test',email_confirmed_at:'2026-11-02'};
 w.meRememberGuestProgress?.(user.email);w.meSelectLocalAccount(user.id);assert.equal(h.context.state.name,'');
 w.meClaimGuestProgress?.(user);assert.equal(h.context.state.name,h.guest.name,'The first verified signup must keep the guest captain');assert.equal(h.context.state.coins,h.guest.coins);assert.equal(h.context.state.voyages,1);assert.equal(JSON.parse(h.saved.getItem(h.base)).name,h.guest.name,'Original guest save stays recoverable');
 w.meSelectLocalAccount(null);w.meRememberGuestProgress?.('other@example.test');w.meSelectLocalAccount('new-b');assert.equal(!!w.meClaimGuestProgress?.({id:'new-b',email:'other@example.test',email_confirmed_at:'2026-11-02'}),false);assert.equal(h.context.state.name,'');
});
test('Guest progress is never silently imported by ordinary login, wrong email, or an unverified account',()=>{
 for(const mode of ['ordinary-login','wrong-email','unverified']){
  const h=guestHarness(),w=h.context.window;if(mode!=='ordinary-login')w.meRememberGuestProgress?.('expected@example.test');w.meSelectLocalAccount('new-user');
  assert.equal(!!w.meClaimGuestProgress?.({id:'new-user',email:mode==='wrong-email'?'other@example.test':'expected@example.test',email_confirmed_at:mode==='unverified'?null:'2026-11-02'}),false);assert.equal(h.context.state.name,'');
 }
});
test('Guest handoff preserves an existing account save',()=>{
 const h=guestHarness(),w=h.context.window;w.meRememberGuestProgress?.('new@example.test');h.saved.setItem('marina_empire_user_existing',JSON.stringify({...h.guest,name:'Existing captain',coins:25000}));w.meSelectLocalAccount('existing');
 assert.equal(!!w.meClaimGuestProgress?.({id:'existing',email:'new@example.test',email_confirmed_at:'2026-11-02'}),false);assert.equal(h.context.state.name,'Existing captain');assert.equal(h.context.state.coins,25000);
});
test('A deliberately new guest game can be claimed without reusing an earlier guest copy',()=>{
 const h=guestHarness(),w=h.context.window,a={id:'owner-a',email:'a@example.test',email_confirmed_at:'2026-11-02'},b={id:'owner-b',email:'b@example.test',email_confirmed_at:'2026-11-02'};
 w.meRememberGuestProgress?.(a.email);w.meSelectLocalAccount(a.id);w.meClaimGuestProgress?.(a);
 w.meSelectLocalAccount(null);const enterLine=html.split('\n').find(line=>line.startsWith('function enter()'));assert(enterLine);h.context.notice=()=>{};h.context.voyageHeartbeat=()=>{};
 h.ui.get('playerName').value='Second guest';h.context.confirm=()=>false;vm.runInContext(enterLine+';enter()',h.context);
 assert.equal(h.context.state.name,h.guest.name);assert.equal(h.saved.getItem(h.base+'_claimed_by'),a.id,'Cancelled reset keeps assignment');
 h.context.confirm=()=>true;vm.runInContext('enter()',h.context);assert.equal(h.context.state.name,'Second guest');assert.equal(h.context.state.voyages,0);assert.equal(h.saved.getItem(h.base+'_claimed_by'),null);
 h.context.state.voyages=1;h.context.state.completed=['new-trial'];h.context.persist();w.meRememberGuestProgress?.(b.email);w.meSelectLocalAccount(b.id);w.meClaimGuestProgress?.(b);
 assert.equal(h.context.state.name,'Second guest');assert.equal(h.context.state.voyages,1);assert.equal(JSON.parse(h.saved.getItem('marina_empire_user_'+a.id)).name,h.guest.name,'First account is untouched');
 w.meResetGuestRegistration?.();assert.equal(h.saved.getItem(h.base+'_claimed_by'),b.id,'Reset hook in an account slot cannot release guest assignment');
});
test('Cloud backup restore rejects a backup owned by another account',()=>{
 const ui=dom(),messages=[];let writes=0;const state={name:'B',owned:[],completed:[],coins:50,fuel:20};const saved=storage({marina_empire_before_cloud_load:JSON.stringify({accountId:'a',game:{...state,name:'A',coins:999}})});
 const context={account:{id:'b'},state,localStorage:saved,validState:()=>true,confirm:()=>true,safeSnapshot:()=>state,fresh:()=>state,persist:()=>{writes++},el:ui.get,showTab(){},render(){},tick(){},status:t=>messages.push(t),Date};
 vm.runInNewContext(functionSection('function restoreCloudBackup()','async function loadCloud()')+';restoreCloudBackup()',context);assert.equal(writes,0);assert.equal(context.state.name,'B');assert(messages.some(x=>x.includes('altro account')));
});
test('Password recovery emitted during session initialization opens the recovery form',async()=>{
 const ui=dom(),tabs=[];let listener=null;ui.get('welcome').classList.remove('hide');ui.get('cloudRecoveryPanel').classList.add('hide');
 const user={id:'recovery-user',email:'recover@example.test',email_confirmed_at:'2026-11-02'};
 const client={auth:{onAuthStateChange:fn=>{listener=fn},getUser:async()=>{if(listener)listener('PASSWORD_RECOVERY',{user});return {data:{user},error:null}}}};
 const context={el:ui.get,client:null,account:null,passwordRecoveryMode:false,URL:'https://example.test',KEY_PUBLIC:'test',window:{supabase:{createClient:()=>client}},state:{name:''},toggle(){},status(){},console,render(){},showTab:id=>tabs.push(id),setTimeout:()=>1};vm.createContext(context);
 if(html.includes('let activeAuthRequest='))vm.runInContext(functionSection('let activeAuthRequest=','async function login()'),context);
 vm.runInContext(functionSection('function showPasswordRecovery()','async function applyNewPassword()'),context);
 await vm.runInContext(functionSection('async function initialize()','el("roseAdminRefresh").addEventListener')+';initialize()',context);
 assert.equal(context.passwordRecoveryMode,true);assert.equal(ui.get('cloudRecoveryPanel').classList.contains('hide'),false);assert.equal(ui.get('welcome').classList.contains('hide'),true);assert(tabs.includes('profile'));
});
test('Disabled checkout rejects before authentication or external requests',async()=>{
 let code=source('supabase/functions/marina-direct-checkout/index.ts');code=code.slice(code.indexOf('const headers=')).replace(/Deno\.env\.get\(("[A-Z_]+")\)!(?!=)/g,'Deno.env.get($1)');
 for(const flag of [undefined,'false','0','']){let handler,remoteCalls=0;vm.runInNewContext(code,{Deno:{env:{get:()=>flag},serve:fn=>{handler=fn}},Response,Request,URL,createClient(){remoteCalls++;throw Error('Must not authenticate')},fetch(){remoteCalls++;throw Error('Must not create orders')}});
  const result=await handler(new Request('https://example.test/checkout',{method:'POST',headers:{authorization:'Bearer fake'},body:'{}'}));assert.equal(result.status,503);assert.equal(remoteCalls,0);
 }
});
