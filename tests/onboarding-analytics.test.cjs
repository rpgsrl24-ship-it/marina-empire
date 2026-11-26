'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('player-tracker-v2.js','utf8');
function scenario(consent){
 const data=new Map();if(consent)data.set('marina_empire_analytics_choice_v1',consent);
 const session=new Map(),storage=m=>({getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),get length(){return m.size},key:i=>[...m.keys()][i]});
 let writes=0,uuids=0;const listeners={};
 const el=()=>({style:{},setAttribute(){},querySelectorAll(){return[]},appendChild(){},remove(){}});
 const document={body:el(),createElement:el,getElementById:()=>null,querySelector:()=>null,addEventListener(){},hidden:false};
 const window={supabase:{createClient:()=>({from:()=>({insert:async()=>{writes++;return{error:null}}})})},addEventListener(name,fn){listeners[name]=fn}};
 vm.runInNewContext(source,{window,document,localStorage:storage(data),sessionStorage:storage(session),location:{pathname:'/mobile-home.html',search:'?utm_source=meta&utm_medium=paid_social&utm_campaign=launch'},URLSearchParams,crypto:{randomUUID(){uuids++;return '11111111-1111-4111-8111-111111111111'}},setInterval(){},console,Date});
 return {api:window.MarinaEmpirePlayerTracker,data,session,listeners,get writes(){return writes},get uuids(){return uuids}};
}
(async()=>{
 for(const choice of ['', 'no']){const s=scenario(choice);assert.equal(await s.api.track('mission_started'),false);assert.equal(s.uuids,0);assert.equal(s.writes,0);}
 const s=scenario('yes');await s.api.stage('mission_started',1);await s.api.stage('mission_started',1);assert.equal(s.writes,2);assert.equal(JSON.parse(s.data.get('marina_empire_analytics_attribution_v2')).source,'meta');
 s.listeners.pointerdown({target:{closest:()=>({})}});await Promise.resolve();await Promise.resolve();assert.equal(s.writes,2,'privacy choice does not count as gameplay');
 s.session.set('unrelated','preserve');
 s.data.set('marina_empire_analytics_choice_v1','no');s.listeners.storage({key:'marina_empire_analytics_choice_v1'});assert.equal(await s.api.track('mission_complete'),false);assert.equal(s.writes,2);
 assert.equal(s.session.has('me_stage_mission_started|1'),false,'revoking consent clears analytics stage markers');
 assert.equal(s.session.get('unrelated'),'preserve','do not erase unrelated game state');
 assert.equal(s.api.visitorId,null);
 for(const p of ['index.html','mobile-home.html','missions-mobile.html','map-mobile.html','cabina-mobile.html','account-mobile.html'])for(const m of fs.readFileSync(p,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())new vm.Script(m[1],{filename:p});
 assert(fs.readFileSync('mobile-home.html','utf8').includes('id="academyStart"'));
 console.log('PASS: consent, campaign capture, stage deduplication, inline scripts and Academy entry');
})().catch(e=>{console.error(e);process.exitCode=1});
