// Exercise the actual auth handlers with controlled provider replies.
// No network, real accounts, tokens or emails. Optional baseline reproducer:
// P0_AUTH_SOURCE_FILE=/tmp/baseline-index.html node tests/auth-request-lifecycle.test.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');
const html=fs.readFileSync(process.env.P0_AUTH_SOURCE_FILE||'index.html','utf8');
const user={id:'account-a',email:'captain@example.test',email_confirmed_at:'2026-11-02'};
const defer=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}};
function section(start,end){const a=html.indexOf(start),b=html.indexOf(end,a);assert(a>=0&&b>a,start);return html.slice(a,b)}
function element(){const classes=new Set();return {value:'',checked:false,disabled:false,textContent:'',style:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)},replaceChildren(){},addEventListener(){}}}
function harness(replies={}){
 const nodes=new Map(),el=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id)};
 el('cloudUsername').value='Captain';el('cloudEmail').value=user.email;el('cloudPassword').value='long-test-password';el('cloudPrivacy').checked=true;
 const calls=[],messages=[],timers=[];let listener,reconciliations=0;
 const methods=['signInWithPassword','signInWithOtp','signUp','resend','resetPasswordForEmail','updateUser','signOut','getUser'];
 const auth={};for(const method of methods)auth[method]=(...args)=>{calls.push({method,args});if(replies[method])return replies[method](...args);return Promise.resolve(method==='getUser'?{data:{user:null},error:null}:{data:{user},error:null})};
 auth.onAuthStateChange=fn=>{listener=fn;return {data:{subscription:{unsubscribe(){}}}}};
 const client={auth};
 const context={el,client,account:null,busy:false,window:{supabase:{createClient:()=>client},meRegisteredPlayer:false,meSelectLocalAccount(){},meRememberGuestProgress(){},meForgetGuestRegistration(){}},URL:'https://example.test',KEY_PUBLIC:'public-test',location:{origin:'https://example.test',pathname:'/marina-empire/'},state:{name:'Guest'},status:msg=>messages.push(msg),refreshPurchasedWallet(){},refreshRoseAdmin(){},showTab(){},render(){},reconcileAccountProgress(){reconciliations++},console,setTimeout(fn){timers.push(fn);return timers.length}};
 vm.createContext(context);
 const start=html.includes('let activeAuthRequest=')?'let activeAuthRequest=':'async function login()';
 vm.runInContext(section('function toggle(){','function validState(')+'\n'+section(start,'el("roseAdminRefresh").addEventListener'),context);
 return {context,el,calls,messages,timers,run:code=>vm.runInContext(code,context),emit(event,nextUser){assert(listener,'initialize first');listener(event,nextUser?{user:nextUser}:null)},get reconciliations(){return reconciliations}};
}

for(const [name,method] of [['login','signInWithPassword'],['register','signUp']]){
 test(name+' ignores duplicate submissions while the provider is pending',async()=>{
  const pending=defer(),h=harness({[method]:()=>pending.promise});
  const first=h.run(name+'()'),second=h.run(name+'()');
  assert.equal(h.calls.filter(x=>x.method===method).length,1);
  pending.resolve({data:{user},error:null});await Promise.all([first,second]);
  assert.equal(h.context.busy,false);
 });
}

test('OTP sending locks all competing controls and handlers until completion',async()=>{
 const pending=defer(),h=harness({signInWithOtp:()=>pending.promise});
 const first=h.run('emailAccess()');
 for(const id of ['cloudMagicLink','cloudRegister','cloudLogin','cloudResend','cloudResetPassword'])assert.equal(h.el(id).disabled,true,id);
 await h.run('login()');await h.run('register()');await h.run('resendConfirmation()');await h.run('resetPassword()');
 assert.equal(h.calls.length,1);
 pending.resolve({error:null});await first;
 for(const id of ['cloudMagicLink','cloudRegister','cloudLogin','cloudResend','cloudResetPassword'])assert.equal(h.el(id).disabled,false,id);
});

test('Provider failures release controls and show the failure without a rejected handler promise',async()=>{
 const cases=[['login','signInWithPassword'],['register','signUp'],['emailAccess','signInWithOtp'],['resendConfirmation','resend'],['resetPassword','resetPasswordForEmail']];
 for(const [name,method] of cases){
  const h=harness({[method]:async()=>{throw new Error('Controlled network failure')}});
  await assert.doesNotReject(h.run(name+'()'));
  assert.equal(h.context.busy,false,name);
  for(const id of ['cloudMagicLink','cloudRegister','cloudLogin','cloudResend','cloudResetPassword'])assert.equal(h.el(id).disabled,false,name+' '+id);
  assert.match(h.messages.at(-1),/Controlled network failure/);
 }
});

test('Logout affects only this session and a provider exception remains recoverable',async()=>{
 const h=harness({signOut:async()=>{throw new Error('Controlled signout failure')}});h.context.account=user;h.context.window.meRegisteredPlayer=true;
 h.run('toggle()');
 await assert.doesNotReject(h.run('signout()'));
 assert.equal(h.calls[0].method,'signOut');assert.equal(h.calls[0].args[0]?.scope,'local');
 assert.equal(h.context.busy,false);assert.equal(h.context.account.id,user.id);
 assert.match(h.messages.at(-1),/Controlled signout failure/);assert.equal(h.el('cloudLogout').disabled,false);
});

test('A returned logout error retains a coherent connected UI and permits retry',async()=>{
 const h=harness({signOut:async()=>({error:{message:'Logout unavailable'}})});h.context.account=user;h.context.window.meRegisteredPlayer=true;
 h.run('toggle()');
 await h.run('signout()');
 assert.equal(h.context.account.id,user.id);assert.equal(h.context.window.meRegisteredPlayer,true);
 assert.equal(h.el('cloudLogout').disabled,false);assert.equal(h.el('cloudLogin').disabled,true);assert.equal(h.context.busy,false);
 assert.match(h.el('cloudConnectionBadge').textContent,/ACCOUNT COLLEGATO/);assert.match(h.messages.at(-1),/Logout unavailable/);
});

test('The sign-in event from the current request leaves a coherent connected UI',async()=>{
 let h;h=harness({signInWithPassword:async()=>{h.emit('SIGNED_IN',user);return {data:{user},error:null}}});
 await h.run('initialize()');await h.run('login()');
 assert.equal(h.context.account.id,user.id);assert.equal(h.context.window.meRegisteredPlayer,true);assert.equal(h.context.busy,false);
 assert.equal(h.el('cloudPassword').value,'');assert.equal(h.el('cloudLogin').disabled,true);assert.equal(h.el('cloudLogout').disabled,false);
 assert.match(h.messages.at(-1),/Account connesso/);
});

test('A late reset reply cannot overwrite the signed-out session state',async()=>{
 const pending=defer(),h=harness({getUser:async()=>({data:{user},error:null}),resetPasswordForEmail:()=>pending.promise});
 await h.run('initialize()');const request=h.run('resetPassword()');h.emit('SIGNED_OUT',null);
 const message=h.messages.at(-1);pending.resolve({error:null});await request;
 assert.equal(h.context.account,null);assert.equal(h.context.window.meRegisteredPlayer,false);assert.equal(h.messages.at(-1),message);
});

test('A cancelled recovery reply cannot unlock a newer request or close its session UI',async()=>{
 const oldReply=defer(),newReply=defer(),h=harness({getUser:async()=>({data:{user},error:null}),updateUser:()=>oldReply.promise,resetPasswordForEmail:()=>newReply.promise});
 await h.run('initialize()');h.emit('PASSWORD_RECOVERY',user);
 h.el('cloudNewPassword').value='new-safe-password';h.el('cloudConfirmPassword').value='new-safe-password';
 const oldRequest=h.run('applyNewPassword()');h.emit('SIGNED_OUT',null);
 const nextRequest=h.run('resetPassword()');assert.equal(h.calls.filter(x=>x.method==='resetPasswordForEmail').length,1,'New session can make a new request');
 oldReply.resolve({error:null});await oldRequest;
 assert.equal(h.context.busy,true,'Old finally must not release the newer request');
 newReply.resolve({error:null});await nextRequest;assert.equal(h.context.busy,false);
});

test('A rejected initial getUser cannot override a later successful sign-in event',async()=>{
 const pending=defer(),h=harness({getUser:()=>pending.promise});const initialization=h.run('initialize()');
 h.emit('SIGNED_IN',user);const message=h.messages.at(-1);pending.reject(new Error('Stale initialization failure'));await initialization;
 assert.equal(h.context.account.id,user.id);assert.equal(h.messages.at(-1),message);
});

test('Queued account reconciliation never runs over the password recovery screen',async()=>{
 const h=harness({getUser:async()=>({data:{user},error:null})});await h.run('initialize()');assert(h.timers.length>0);
 h.emit('PASSWORD_RECOVERY',user);for(const fn of h.timers)fn();
 assert.equal(h.reconciliations,0);assert.equal(h.el('cloudApplyNewPassword').disabled,false);
});

test('Queued reconciliation does not race another operation using the shared busy lock',async()=>{
 const h=harness({getUser:async()=>({data:{user},error:null})});await h.run('initialize()');h.context.busy=true;
 for(const fn of h.timers)fn();assert.equal(h.reconciliations,0);assert.equal(h.context.busy,true);
});

test('Failed password update keeps recovery available and releases all request controls',async()=>{
 const h=harness({getUser:async()=>({data:{user},error:null}),updateUser:async()=>({error:{message:'Recovery temporarily unavailable'}})});
 await h.run('initialize()');h.emit('PASSWORD_RECOVERY',user);
 h.el('cloudNewPassword').value='new-safe-password';h.el('cloudConfirmPassword').value='new-safe-password';
 await h.run('applyNewPassword()');
 assert.equal(h.context.busy,false);assert.equal(h.el('cloudRecoveryPanel').classList.contains('hide'),false);
 assert.equal(h.el('cloudApplyNewPassword').disabled,false);assert.match(h.messages.at(-1),/Recovery temporarily unavailable/);
});

test('Recovery completion clears sensitive fields and disables the spent recovery action',async()=>{
 const h=harness({getUser:async()=>({data:{user},error:null})});await h.run('initialize()');h.emit('PASSWORD_RECOVERY',user);
 h.el('cloudNewPassword').value='new-safe-password';h.el('cloudConfirmPassword').value='new-safe-password';
 await h.run('applyNewPassword()');
 assert.equal(h.el('cloudNewPassword').value,'');assert.equal(h.el('cloudConfirmPassword').value,'');
 assert.equal(h.el('cloudApplyNewPassword').disabled,true);assert.equal(h.context.busy,false);
});
