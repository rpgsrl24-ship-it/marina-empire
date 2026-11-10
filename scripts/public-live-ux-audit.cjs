'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');

const LIVE='https://rpgsrl24-ship-it.github.io/marina-empire/';
const OUT=path.resolve('test-results/live-public');
fs.mkdirSync(OUT,{recursive:true});

async function blockPrivateAndPaid(context){
  await context.route('**/*', async route=>{
    const req=route.request();
    let url;
    try{url=new URL(req.url())}catch{return route.continue();}
    if(url.hostname==='zrdetqvnjmqkfyajxjgp.supabase.co'){
      if(url.pathname==='/rest/v1/me_game_events') return route.fulfill({status:201,contentType:'application/json',body:''});
      if(url.pathname.startsWith('/auth/')||url.pathname.startsWith('/rest/')||url.pathname.startsWith('/functions/'))
        return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'LIVE_AUDIT_BLOCKED'})});
    }
    if(/rpgyacht\.com$/i.test(url.hostname)||/resend\.com$/i.test(url.hostname))
      return route.abort('blockedbyclient');
    return route.continue();
  });
}

async function pageAudit(page,label){
  return page.evaluate(label=>{
    const visible=el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>1&&r.height>1;
    };
    const vw=innerWidth,vh=innerHeight;
    const actionables=[...document.querySelectorAll('button,a,input,select,textarea')].filter(visible);
    const clipped=actionables.map(el=>{
      const r=el.getBoundingClientRect();
      return {tag:el.tagName,id:el.id||'',text:(el.innerText||el.value||el.getAttribute('aria-label')||'').trim().slice(0,80),left:r.left,right:r.right,top:r.top,bottom:r.bottom};
    }).filter(x=>x.left<-2||x.right>vw+2);
    const tiny=actionables.map(el=>{
      const r=el.getBoundingClientRect();
      return {tag:el.tagName,id:el.id||'',text:(el.innerText||el.value||'').trim().slice(0,80),w:r.width,h:r.height};
    }).filter(x=>x.w<32||x.h<28);
    const textOverflow=[...document.querySelectorAll('body *')].filter(visible).map(el=>({el,r:el.getBoundingClientRect()}))
      .filter(x=>x.r.width>0&&x.el.scrollWidth>x.el.clientWidth+3&&!['HTML','BODY'].includes(x.el.tagName))
      .slice(0,25).map(x=>({tag:x.el.tagName,id:x.el.id||'',cls:x.el.className||'',cw:x.el.clientWidth,sw:x.el.scrollWidth,text:(x.el.textContent||'').trim().slice(0,80)}));
    return {
      label,
      viewport:{width:vw,height:vh},
      pageScrollWidth:document.documentElement.scrollWidth,
      horizontalOverflow:document.documentElement.scrollWidth>vw+2,
      clipped,
      tiny,
      textOverflow,
      title:document.title
    };
  },label);
}

async function seedUnifiedGame(context){
  await context.addInitScript(()=>{
    const game={
      name:'Audit Live',coins:10000,prestige:0,fuel:300,condition:100,port:'rimini',
      boat:'voyager',owned:['voyager'],completed:[],trip:null,reservations:[],voyages:0,
      setupComplete:true,voyageSerial:0
    };
    localStorage.setItem('marina_empire_local_context_v1',JSON.stringify({version:1,accountId:null,revision:'live-audit-v2'}));
    localStorage.setItem('marina_empire_beta_test_session',JSON.stringify(game));
  });
}

async function runScenario(browser,name,viewport,mobile){
  const context=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  await seedUnifiedGame(context);
  await blockPrivateAndPaid(context);
  const page=await context.newPage();
  const errors=[],badResponses=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{
    try{
      const u=new URL(r.url());
      if(u.hostname==='rpgsrl24-ship-it.github.io'&&r.status()>=400) badResponses.push(r.status()+' '+u.pathname);
    }catch{}
  });

  try{
    await page.goto(LIVE,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForURL(/mobile-home\.html/,{timeout:15000});
    await page.waitForLoadState('load',{timeout:30000});
    await page.screenshot({path:path.join(OUT,name+'-home.png'),fullPage:false,animations:'disabled'});
    const home=await pageAudit(page,name+' home');
    assert.equal(home.horizontalOverflow,false,name+': home has horizontal overflow');
    assert.equal(home.clipped.length,0,name+': home has clipped actions '+JSON.stringify(home.clipped));

    const missionLink=page.locator('a[href*="missions-mobile.html"]').first();
    await missionLink.waitFor({state:'visible',timeout:15000});
    await missionLink.click();
    await page.waitForURL(/missions-mobile\.html/,{timeout:15000});
    await page.locator('[data-start]:enabled').first().waitFor({state:'visible',timeout:20000});
    await page.screenshot({path:path.join(OUT,name+'-missions.png'),fullPage:false,animations:'disabled'});
    const missions=await pageAudit(page,name+' missions');
    assert.equal(missions.horizontalOverflow,false,name+': missions has horizontal overflow');
    assert.equal(missions.clipped.length,0,name+': missions has clipped actions '+JSON.stringify(missions.clipped));

    const first=page.locator('[data-start]:enabled').first();
    const firstCard=first.locator('xpath=ancestor::article[1]');
    const firstText=(await firstCard.innerText()).trim();
    assert.match(firstText,/Rimini/i,name+': first mission must originate in Rimini');
    await first.click();
    await page.waitForFunction(()=>location.pathname.endsWith('/map-mobile.html'),{timeout:20000});
    await page.locator('#routeStatus').waitFor({state:'visible',timeout:15000});
    await page.waitForFunction(()=>document.querySelector('#routeStatus')?.textContent?.includes('→'),{timeout:15000});
    await page.screenshot({path:path.join(OUT,name+'-map-active.png'),fullPage:false,animations:'disabled'});
    const map=await pageAudit(page,name+' map active');
    assert.equal(map.horizontalOverflow,false,name+': map has horizontal overflow');
    assert.equal(map.clipped.length,0,name+': map has clipped actions '+JSON.stringify(map.clipped));

    const active=await page.evaluate(()=>({
      route:(document.getElementById('routeStatus')?.textContent||'').trim(),
      destination:(document.getElementById('destination')?.textContent||'').trim(),
      mission:(document.getElementById('missionText')?.textContent||'').trim(),
      save:JSON.parse(localStorage.getItem('marina_empire_beta_test_session')||'null')
    }));
    assert.ok(active.save?.trip,name+': accepted mission must create an active trip');
    assert.ok(active.route.includes('Cervia')&&active.destination.includes('Cervia'),name+': accepted mission route/destination must stay synchronized to Cervia');
    assert.match(active.mission,/RPG Academy 8/i,name+': map must show the accepted mission');

    const trip=active.save.trip;
    await page.clock.setFixedTime(new Date(Number(trip.until)+1500));
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')||'null')?.trip===null,{timeout:20000});
    await page.waitForTimeout(300);
    await page.screenshot({path:path.join(OUT,name+'-arrival.png'),fullPage:false,animations:'disabled'});
    const arrivalSave=await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')||'null'));
    assert.equal(arrivalSave?.port,'cervia',name+': arrival must move player to Cervia');
    assert.ok(Number(arrivalSave?.prestige)>0,name+': arrival must credit prestige');
    assert.ok(Array.isArray(arrivalSave?.completed)&&arrivalSave.completed.length>0,name+': arrival must mark mission completed');

    console.log('LIVE_AUDIT '+JSON.stringify({
      scenario:name,viewport,firstMission:firstText.slice(0,140),
      route:active.route,destination:active.destination,mission:active.mission,
      arrival:{port:arrivalSave.port,coins:arrivalSave.coins,prestige:arrivalSave.prestige,voyages:arrivalSave.voyages},
      home,missions,map,runtimeErrors:errors,badResponses
    }));
    assert.deepEqual(errors,[],name+': runtime errors '+JSON.stringify(errors));
    assert.deepEqual(badResponses,[],name+': missing/bad live assets '+JSON.stringify(badResponses));
  }finally{
    await context.close();
  }
}

(async()=>{
  const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
  try{
    await runScenario(browser,'desktop',{width:1440,height:1000},false);
    await runScenario(browser,'mobile-portrait',{width:390,height:844},true);
    await runScenario(browser,'mobile-landscape',{width:844,height:390},true);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
