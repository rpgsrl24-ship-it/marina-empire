'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 const box={window:{},console};vm.runInNewContext(fs.readFileSync('alliance-modern-v1.js','utf8'),box);const a=box.window.MarinaClubs;
 assert(a.validName('Club Adriatico'));assert(a.validName('Équipe 1'));assert(!a.validName('!!'));assert(!a.validName('123'));assert(!a.validName('A'.repeat(33)));
 let h={accountId:null},user={id:'qa',email_confirmed_at:'yes',is_anonymous:false},calls=[];const id='12345678-1234-1234-1234-123456789abc';
 const svc=a.service({auth:{getUser:async()=>({data:{user}})},rpc:async(name,args)=>{calls.push({name,args});return{data:{ok:true}}}},()=>h);
 await assert.rejects(svc.state());assert.equal(calls.length,0);h={accountId:'qa'};
 await svc.state('test');await svc.act('create','  Club  Adriatico  ');await svc.act('join',id);await svc.act('checkin');await svc.act('leave');
 assert.equal(calls[0].name,'me_club_state');assert.equal(calls[1].args.p_name,'Club Adriatico');assert.equal(calls[2].args.p_club_id,id);assert.equal(calls[3].args.p_action,'checkin');assert.equal(calls[4].args.p_action,'leave');
 assert.equal((await svc.act('join','bad')).ok,false);user.is_anonymous=true;await assert.rejects(svc.state());assert.equal(calls.length,5);
 const market=fs.readFileSync('marketplace-mobile.html','utf8'),shop=fs.readFileSync('credit-purchase-rc.js','utf8');
 const products=[...market.matchAll(/data-me-credit-product="(\d+)"/g)].map(m=>+m[1]);assert.deepEqual(products,[38090,38091,38092,38093,38094]);
 assert(market.includes('meCreditPurchaseStatus'));assert(market.includes('supabase-js@2.57.0'));assert(market.includes('./pubblicita.html'));
 assert(shop.includes('window.location.assign(data.checkout_url)'));assert(shop.includes('dest.protocol!=="https:"'));assert(shop.includes('busy=true;document.querySelectorAll'));
 for(const p of ['alliance-mobile.html','marketplace-mobile.html','mobile-home.html'])for(const m of fs.readFileSync(p,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())new vm.Script(m[1],{filename:p});
 console.log('PASS: clubs auth boundary, validated actions and complete paid credit store controls.');
})().catch(e=>{console.error(e);process.exitCode=1});
