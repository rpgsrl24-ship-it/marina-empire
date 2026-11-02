// Execute the production community script. No network, real users or messages.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync(path.join(process.env.ME_CHAT_SOURCE_DIR||'.','index.html'),'utf8');
const script=html.match(/<script id="me-community-v1">([\s\S]*?)<\/script>/)?.[1];
assert(script,'Community script exists');

function harness({registered=false,missingPanel=false}={}){
 const calls={sdk:0,channel:0,track:0,send:0,interval:0,timeout:0};
 const listeners=new Map(),nodes=new Map(),intervals=[];
 function node(){return {textContent:'',children:[],disabled:false,placeholder:'',attributes:{},listeners:{},
  replaceChildren(...children){this.children=children;this.textContent=''},
  setAttribute(name,value){this.attributes[name]=value},
  addEventListener(name,fn){this.listeners[name]=fn}
 }}
 const note=node();
 const get=id=>{if(missingPanel)return null;if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
 if(!missingPanel){
  get('marinaCommunity').querySelector=selector=>{assert.equal(selector,'p:last-child');return note};
  get('communityMessages').children=[{textContent:'Previously displayed message'}];
  get('communityUsers').textContent='Previously displayed players';
 }
 const channel={on(){return channel},subscribe(){return channel},track(){calls.track++},send(){calls.send++;return Promise.resolve('ok')}};
 const window={meRegisteredPlayer:registered,supabase:{createClient(){calls.sdk++;return {channel(){calls.channel++;return channel}}}},
  addEventListener(name,fn){listeners.set(name,fn)}
 };
 const context={window,document:{getElementById:get,addEventListener(){}},state:{name:'Registered captain',setupComplete:true,port:'rimini'},
  port:()=>({name:'Rimini'}),console,Date,Math,crypto:{randomUUID:()=> 'test-session'},
  localStorage:{getItem:()=>null,setItem(){}},
  setInterval(fn){calls.interval++;intervals.push(fn);return 1},setTimeout(){calls.timeout++;return 1}
 };
 vm.runInNewContext(script,context);
 return {get,note,calls,window,context,listeners,tick(){for(const fn of intervals)fn()}};
}

function assertNoTransport(h){
 assert.deepEqual(h.calls,{sdk:0,channel:0,track:0,send:0,interval:0,timeout:0},'Paused chat must never initialize a transport or reconnect timer');
}

test('Guest entry does not open any public or private chat channel',()=>{
 const h=harness();assertNoTransport(h);
 assert.equal(h.get('communityInput').disabled,true);
 assert.equal(h.get('communitySend').disabled,true);
 assert.match(h.get('communityStatus').textContent,/temporaneamente non disponibile/);
});

test('A registered player with a valid game cannot bypass the pause',()=>{
 const h=harness({registered:true});h.tick();assertNoTransport(h);
 assert.equal(h.get('communityInput').disabled,true);
 assert.equal(h.get('communitySend').disabled,true);
 assert.equal(h.get('communityMessages').children.length,0);
 assert.equal(h.get('communityUsers').textContent,'');
 assert.match(h.note.textContent,/continuare a giocare/);
});

test('Game and account updates keep chat controls disabled without reconnecting',()=>{
 const h=harness();h.window.meRegisteredPlayer=true;h.context.state.port='ancona';
 h.get('communityInput').disabled=false;h.get('communitySend').disabled=false;
 h.listeners.get('marina-empire-updated')();
 assert.equal(h.get('communityInput').disabled,true);
 assert.equal(h.get('communitySend').disabled,true);assertNoTransport(h);
});

test('A forced form submission is cancelled and cannot send a message',()=>{
 const h=harness({registered:true});let prevented=false;
 h.get('communityInput').disabled=false;h.get('communityInput').value='Do not transmit';
 h.get('communityForm').listeners.submit({preventDefault(){prevented=true}});
 assert.equal(prevented,true);
 assert.equal(h.get('communityInput').disabled,true);
 assert.equal(h.get('communitySend').disabled,true);assertNoTransport(h);
});

test('Missing community elements do not interrupt the rest of the game',()=>{
 const h=harness({registered:true,missingPanel:true});assertNoTransport(h);
 assert.doesNotThrow(()=>h.listeners.get('marina-empire-updated')());
});
