// Static production checks for the registered-player community chat.
// No network, real users or messages are contacted.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync(path.join(process.env.ME_CHAT_SOURCE_DIR||'.','index.html'),'utf8');
const script=html.match(/<script id="me-community-v2">([\s\S]*?)<\/script>/)?.[1];
assert(script,'Community script exists');

test('Community is reserved for authenticated confirmed accounts',()=>{
 assert(script.includes('client.auth.getUser()'));
 assert(script.includes('email_confirmed_at'));
 assert(script.includes('setEnabled(ok)'));
 assert(script.includes('Registrati gratuitamente o accedi'));
});

test('Community offers global and current-marina rooms',()=>{
 assert(html.includes('<option value="global">🌍 COMMUNITY GENERALE</option>'));
 assert(html.includes('<option value="marina">⚓ MARINA ATTUALE</option>'));
 assert(script.includes('return "marina-"+id'));
 assert(script.includes('roomLabel()'));
});

test('Community persists messages and subscribes to realtime database changes',()=>{
 assert(script.includes('from("me_community_messages").select'));
 assert(script.includes('from("me_community_messages").insert'));
 assert(script.includes('"postgres_changes"'));
 assert(script.includes('event:"INSERT"'));
 assert(script.includes('event:"UPDATE"'));
 assert(script.includes('event:"DELETE"'));
});

test('Community renders message text safely and supports reports',()=>{
 assert(script.includes('body.textContent=m.body||""'));
 assert(script.includes('name.textContent=m.captain_name||"Comandante"'));
 assert(script.includes('from("me_chat_reports").insert'));
 assert(script.includes('data-community-report'));
});

test('Community script has valid JavaScript syntax',()=>{
 assert.doesNotThrow(()=>new vm.Script(script,{filename:'me-community-v2'}));
});
