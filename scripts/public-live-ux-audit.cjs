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

async function assertDesktopDockFits(page,label){
  const metrics=await page.evaluate(()=>{
    const selectors=['.head','.dockModeTitle','.dockFlow','#berthScene','.dockInstruction','.dockQuick','.dockConsole','#dockAssist','#dockBowMode','#dockSternMode','#dockRotateLeft','#dockRotateRight','#dockHelmLeft','#dockHelmRight','#dockNow','#dockStatus','nav.bottom','[data-dock-engine="port:1"]','[data-dock-engine="port:-1"]','[data-dock-engine="starboard:1"]','[data-dock-engine="starboard:-1"]','#bowThrusterBox'];
    const bounds=selectors.flatMap(sel=>{
      const el=document.querySelector(sel);if(!el)return [{sel,missing:true}];
      const r=el.getBoundingClientRect();if(getComputedStyle(el).display==='none'||!r.width||!r.height)return [];
      return [{sel,left:r.left,top:r.top,right:r.right,bottom:r.bottom}];
    });
    const scene=document.querySelector('#berthScene').getBoundingClientRect(),controls=document.querySelector('.dockConsole').getBoundingClientRect();
    return {width:innerWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth,bounds,sideBySide:controls.left>=scene.right-2};
  });
  assert.ok(metrics.sideBySide,label+': desktop scene and controls must be side by side');
  assert.ok(metrics.scrollHeight<=metrics.height+2,label+': desktop must fit vertically '+JSON.stringify(metrics));
  assert.ok(metrics.scrollWidth<=metrics.width+2,label+': desktop must fit horizontally '+JSON.stringify(metrics));
  const out=metrics.bounds.filter(r=>r.missing||r.top<-2||r.left<-2||r.bottom>metrics.height+2||r.right>metrics.width+2);
  assert.deepEqual(out,[],label+': essential controls outside desktop viewport');
  console.log('DESKTOP_DOCK_FIT '+JSON.stringify({label,width:metrics.width,height:metrics.height,scrollHeight:metrics.scrollHeight,scrollWidth:metrics.scrollWidth}));
}

async function seedUnifiedGame(context){
  await context.addInitScript(()=>{
    const game={
      name:'Audit Live',coins:10000,prestige:0,fuel:300,condition:100,port:'rimini',
      boat:'voyager',owned:['voyager'],completed:[],trip:null,reservations:[],voyages:0,
      setupComplete:true,voyageSerial:0
    };
    if(!localStorage.getItem('marina_empire_beta_test_session')){
      localStorage.setItem('marina_empire_local_context_v1',JSON.stringify({version:1,accountId:null,revision:'live-audit-v2'}));
      localStorage.setItem('marina_empire_beta_test_session',JSON.stringify(game));
    }
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
    await page.locator('#academyStart').waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('#academyStart').isEnabled(),true,name+': immediate Academy start');
    await page.locator('#meAnalyticsChoice [data-choice="no"]').click();
    assert.equal(await page.evaluate(()=>localStorage.getItem('marina_empire_visitor_id_v2')),null,name+': analytics refusal creates no persistent ID');
    await page.screenshot({path:path.join(OUT,name+'-home.png'),fullPage:false,animations:'disabled'});
    const home=await pageAudit(page,name+' home');
    assert.equal(await page.locator('#weeklyDock').isVisible(),true,name+': weekly challenge card');
    assert.match(await page.locator('#weeklyDockCount').innerText(),/0 \/ 3/);
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

    assert.equal(await page.locator('#careerGuide').isVisible(),true,name+': first-trip guide visible');
    assert.equal(await page.locator('[data-kind="all"]').isVisible(),true,name+': mission filters visible');
    const first=page.locator('[data-start]:enabled').first();
    const firstCard=first.locator('xpath=ancestor::article[1]');
    const firstText=(await firstCard.innerText()).trim();
    assert.match(firstText,/Rimini/i,name+': first mission must originate in Rimini');
    // Check both the mission catalog and the new one-click Academy flow.
    if(name==='mobile-portrait'){
      await page.goto(LIVE+'mobile-home.html?v=20261111-home6',{waitUntil:'domcontentloaded',timeout:30000});
      await page.locator('#academyStart').click();
    }else await first.click();
    await page.waitForURL(/cabina-mobile\.html/,{timeout:30000});
    await page.locator('#dockPreviewEntry').waitFor({state:'attached',timeout:15000});
    await page.locator('body.navigationMode .navDeck').waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('#miniBoat svg').isVisible(),true,name+': live yacht');
    assert.ok(await page.locator('#miniRemainingRoute').getAttribute('d'),name+': GPS shows remaining track');
    assert.ok(await page.locator('#miniDoneRoute').getAttribute('d'),name+': GPS shows sailed track');
    assert.equal(await page.locator('#helmWheel svg').isVisible(),true,name+': steering wheel');
    const bridge=await pageAudit(page,name+' navigation bridge');
    assert.equal(bridge.horizontalOverflow,false,name+': navigation horizontal overflow');
    assert.deepEqual(bridge.clipped,[],name+': navigation clipped controls');
    for(const selector of ['.cockpitGps','#helmLeft','#helmRight','#helmWheel','#throttleLever','[data-throttle="eco"]','[data-throttle="cruise"]','[data-throttle="fast"]','#vhfBtn','.cockpitPhase'])assert.equal(await page.locator(selector).isVisible(),true,name+': '+selector);
    await page.locator('[data-throttle="eco"]').click();
    assert.equal(await page.evaluate(()=>window.MarinaEmpireMapLite.snapshot().trip.throttleMode),'eco');
    await page.locator('[data-throttle="cruise"]').click();
    await page.locator('#helmLeft').click();
    assert.ok(await page.evaluate(()=>window.MarinaEmpireMapLite.snapshot().trip.helmAngle<0));
    await page.locator('#helmWheel').click();
    assert.equal(await page.evaluate(()=>window.MarinaEmpireMapLite.snapshot().trip.helmAngle),0);
    await page.screenshot({path:path.join(OUT,name+'-navigation-bridge.png'),fullPage:false,animations:'disabled'});
    await page.goto(LIVE+'map-mobile.html',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#routeStatus').waitFor({state:'visible',timeout:15000});
    await page.waitForFunction(()=>document.querySelector('#routeStatus')?.textContent?.includes('→'),null,{timeout:15000});
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

    await page.locator('#cabinJump a').click();
    await page.waitForURL(/cabina-mobile\.html/,{timeout:20000});
    await page.locator('#dockingPanel').waitFor({state:'visible',timeout:180000});
    await page.screenshot({path:path.join(OUT,name+'-docking.png'),fullPage:true,animations:'disabled'});
    const docking=await pageAudit(page,name+' docking');
    if(!mobile&&viewport.width>=1000)await assertDesktopDockFits(page,name+' real docking');
    assert.equal(docking.horizontalOverflow,false,name+': docking has horizontal overflow');
    assert.equal(docking.clipped.length,0,name+': docking has clipped actions '+JSON.stringify(docking.clipped));
    assert.equal(await page.locator('.dockArtwork').isVisible(),true,name+': new docking artwork must be visible');
    assert.equal(await page.locator('#dockElapsed').isVisible(),true,name+': docking timer visible');
    assert.equal(await page.locator('nav.bottom').evaluate(el=>getComputedStyle(el).position),'relative',name+': navigation must not cover docking controls');
    assert.ok(await page.locator('[data-dock-engine="port:0"]').evaluate(el=>el.getBoundingClientRect().height>=40),name+': motor control must have a usable touch target');
    const navTop=await page.locator('nav.bottom').evaluate(el=>el.getBoundingClientRect().top+scrollY);
    const dockBottom=await page.locator('#dockNow').evaluate(el=>el.getBoundingClientRect().bottom+scrollY);
    assert.ok(navTop>=dockBottom,name+': navigation must be below docking controls');
    assert.equal(await page.locator('#bowThrusterBox').isVisible(),true,name+': Academy 8 bow thruster');
    await page.locator('#dockAssist').click();
    await page.waitForFunction(()=>!document.getElementById('dockNow')?.disabled,null,{timeout:20000});
    await page.locator('#dockNow').click();
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')||'null')?.trip===null,null,{timeout:15000});
    await page.waitForTimeout(800);
    await page.screenshot({path:path.join(OUT,name+'-arrival.png'),fullPage:false,animations:'disabled'});
    const arrivalSave=await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')||'null'));
    assert.equal(arrivalSave?.port,'cervia',name+': arrival must move player to Cervia');
    assert.ok(Number(arrivalSave?.prestige)>0,name+': arrival must credit prestige');
    assert.ok(Array.isArray(arrivalSave?.completed)&&arrivalSave.completed.length>0,name+': arrival must mark mission completed');
    assert.equal(Number(arrivalSave?.lastArrival?.weeklyDockReward)||0,0,name+': assisted docking cannot receive weekly reward');
    assert.equal(await page.locator('#arrivalNext').isVisible(),true,name+': first-arrival next steps');
    assert.equal(await page.locator('#arrivalAccount').isVisible(),true,name+': optional guest account link');
    assert.equal(await page.evaluate(()=>localStorage.getItem('marina_empire_visitor_id_v2')),null,name+': gameplay works without analytics');

    const realBefore=await page.evaluate(()=>localStorage.getItem('marina_empire_beta_test_session'));
    await page.goto(LIVE+'cabina-mobile.html?anteprima=ormeggio',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#dockPreviewBanner').waitFor({state:'visible',timeout:15000});
    await page.locator('#dockingPanel .dockArtwork').waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('.cockpitOne').isVisible(),false,name+': practice must not show sailing cockpit');
    assert.equal(await page.locator('#bowThrusterBox').isVisible(),true,name+': practice yacht has bow thruster');
    await page.screenshot({path:path.join(OUT,name+'-practice.png'),fullPage:true,animations:'disabled'});
    const practice=await pageAudit(page,name+' practice');
    if(!mobile&&viewport.width>=1000)await assertDesktopDockFits(page,name+' practice');
    assert.equal(practice.horizontalOverflow,false,name+': practice has horizontal overflow');
    assert.equal(practice.clipped.length,0,name+': practice has clipped actions '+JSON.stringify(practice.clipped));
    assert.equal(await page.locator('nav.bottom').evaluate(el=>getComputedStyle(el).position),'relative',name+': practice navigation must not cover docking controls');
    if(!mobile){
      for(const size of [{width:1366,height:768},{width:1280,height:600},{width:1024,height:600}]){
        await page.setViewportSize(size);
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.waitForTimeout(200);
        await assertDesktopDockFits(page,name+' practice '+size.width+'x'+size.height);
        await page.screenshot({path:path.join(OUT,'desktop-practice-'+size.width+'x'+size.height+'.png'),fullPage:false,animations:'disabled'});
      }
      await page.setViewportSize(viewport);
    }
    const startHeading=await page.evaluate(()=>window.MarinaEmpireMapLite.snapshot().trip.dockingHeading);
    await page.locator('#dockRotateRight').click();
    await page.waitForFunction(h=>{const t=window.MarinaEmpireMapLite.snapshot().trip;return !t.dockingTurning&&Math.abs(((t.dockingHeading-h-90+180)%360+360)%360-180)<.1},startHeading,{timeout:12000});
    await page.locator('#dockRotateLeft').click();
    await page.waitForFunction(h=>{const t=window.MarinaEmpireMapLite.snapshot().trip;return !t.dockingTurning&&Math.abs(((t.dockingHeading-h+180)%360+360)%360-180)<.1},startHeading,{timeout:12000});
    await page.locator('#dockSternMode').click();
    assert.equal(await page.locator('#dockSternMode').getAttribute('aria-pressed'),'true');
    await page.locator('#dockBowMode').click();
    assert.equal(await page.locator('#dockBowMode').getAttribute('aria-pressed'),'true');
    const lever=page.locator('[data-lever-side="port"]');
    if(await lever.isVisible()){
      await lever.click({position:{x:10,y:10}});
      assert.equal(await lever.getAttribute('aria-valuenow'),'1',name+': physical lever must command forward');
      await lever.press('Home');
      assert.equal(await lever.getAttribute('aria-valuenow'),'0',name+': physical lever must return to neutral');
    }
    const initial=await page.locator('#dockYacht').getAttribute('transform');
    await page.locator('[data-dock-engine="port:1"]').click();
    await page.locator('[data-dock-engine="starboard:1"]').click();
    await page.waitForFunction(initial=>document.getElementById('dockYacht')?.getAttribute('transform')!==initial,initial,{timeout:8000});
    await page.locator('[data-dock-engine="port:0"]').click();
    await page.locator('[data-dock-engine="starboard:0"]').click();
    await page.locator('#dockAssist').click();
    await page.waitForFunction(()=>!document.getElementById('dockNow')?.disabled,null,{timeout:20000});
    await page.locator('#dockNow').click();
    await page.locator('#arrival').waitFor({state:'visible',timeout:15000});
    assert.match(await page.locator('#arrivalReward').innerText(),/Allenamento completato/);
    assert.equal(await page.locator('#arrivalNext').isVisible(),false,name+': practice not a real Academy completion');
    assert.equal(await page.evaluate(()=>localStorage.getItem('marina_empire_beta_test_session')),realBefore,name+': practice must leave real save unchanged');
    assert.equal(await page.locator('#dockPreviewEntry').isVisible(),true,name+': practice restart must be visible');
    await page.goto(LIVE+'missions-mobile.html?tipo=special',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('[data-kind="special"][aria-pressed="true"]').waitFor({state:'visible',timeout:15000});
    await page.locator('.contractObjective').first().waitFor({state:'visible',timeout:15000});
    assert.ok(await page.locator('[data-start^="C_rescue_"]:enabled').count(),name+': rescue contract unlocked after Academy');
    assert.ok(await page.locator('[data-start^="C_charter_"]:disabled').count(),name+': VIP contract requires prestige');
    await page.locator('[data-kind="transfer"]').click();
    assert.equal(await page.locator('.contractObjective').count(),0,name+': transfer filter separates special contracts');
    await page.goto(LIVE+'docking-ranking.html?v=20261125-cup1',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#count').waitFor({state:'visible',timeout:15000});
    assert.match(await page.locator('#count').innerText(),/0\/3/);
    assert.equal(await page.locator('#submit').isDisabled(),true,name+': guests cannot publish scores');
    assert.equal(await page.locator('#remove').isDisabled(),true,name+': guests cannot remove scores');
    const cup=await pageAudit(page,name+' cup');
    assert.equal(cup.horizontalOverflow,false,name+': cup has horizontal overflow');
    assert.equal(cup.clipped.length,0,name+': cup has clipped controls');
    await page.goto(LIVE+'marina-mobile.html?v=20261126-marina9#jobs',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#jobsPanel[data-loaded="true"]').waitFor({state:'visible',timeout:15000}).catch(async e=>{throw new Error(name+': Marina Live did not render; '+JSON.stringify({errors,save:await page.evaluate(()=>{const g=JSON.parse(localStorage.getItem('marina_empire_beta_test_session')||'{}');return {port:g.port,voyages:g.voyages,trip:!!g.trip,engine:!!window.MarinaEmpireMarinaLite}})}))});
    assert.equal(await page.locator('.jobCard').count(),3,name+': expected three local job cards');
    assert.ok(await page.locator('[data-job-open="dock"]').count(),name+': dock job blocked: '+await page.locator('#jobText').innerText());
    assert.match(await page.locator('#jobsCount').innerText(),/0 \/ 3/);
    await page.locator('[data-job-open="dock"]').click();
    await page.locator('[data-job-choice="1"]').click();
    assert.match(await page.locator('.jobFeedback').innerText(),/non corretta/);
    await page.locator('[data-job-choice="0"]').click();
    assert.match(await page.locator('#jobsCount').innerText(),/1 \/ 3/);
    const jobsAudit=await pageAudit(page,name+' marina jobs');
    assert.equal(jobsAudit.horizontalOverflow,false,name+': jobs layout overflow');
    await page.goto(LIVE+'mobile-home.html?v=20261111-home6',{waitUntil:'domcontentloaded',timeout:30000});
    assert.match(await page.locator('#dailyMissionBtn').innerText(),/RISCATTA PREMIO/);
    const beforeDaily=await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).coins);
    await page.locator('#dailyMissionBtn').click();
    await page.waitForFunction(()=>document.getElementById('dailyMissionBtn')?.textContent==='PREMIO RISCOSSO',null,{timeout:15000});
    const afterDaily=await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).coins);
    assert.equal(afterDaily,beforeDaily+500);
    assert.equal(await page.locator('#dailyMissionBtn').isDisabled(),true);
    if(name==='desktop'){
      // An isolated test save only; no paid API or real accounts.
      await page.evaluate(()=>{const k='marina_empire_beta_test_session',g=JSON.parse(localStorage.getItem(k));g.coins=30000000;localStorage.setItem(k,JSON.stringify(g));});
      await page.goto(LIVE+'marina-mobile.html?v=20261126-marina9&porto=cervia#property',{waitUntil:'domcontentloaded',timeout:30000});
      await page.locator('#buyMarina').waitFor({state:'visible',timeout:15000});
      page.on('dialog',d=>d.accept());
      await page.locator('#buyMarina').click();
      await page.waitForFunction(()=>document.getElementById('buyMarina').hidden);
      await page.locator('#buildPontoon').click();
      assert.equal(await page.locator('#pontoons').innerText(),'2/30');
      await page.locator('#upgradeMarina').click();
      assert.equal(await page.locator('#level').innerText(),'Liv. 2');
      assert.equal(await page.locator('#collectMarina').isDisabled(),true);
      await page.evaluate(()=>{const k='marina_empire_beta_test_session',g=JSON.parse(localStorage.getItem(k)),r=g.marinas.cervia;r.lastReward-=86400001;r.berthLastReward=r.lastReward;r.incomeCursor=r.lastReward;r.incomeBank=0;localStorage.setItem(k,JSON.stringify(g));});
      await page.goto(LIVE+'direction-mobile.html?v=20261126-direction3',{waitUntil:'domcontentloaded',timeout:30000});
      await page.locator('#portfolioCollect:enabled').waitFor({state:'visible',timeout:15000});
      const pre=await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).coins);
      await page.locator('#portfolioCollect').click();
      const post=await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).coins);
      assert.ok(post>pre,'marina income credited to saved balance');assert.equal(await page.locator('#portfolioCollect').isDisabled(),true);
      assert.equal(await page.locator('#revenueChart .barcol').count(),7);
      assert.equal((await pageAudit(page,name+' direction')).horizontalOverflow,false);
    }
    await page.evaluate(()=>{const k='marina_empire_beta_test_session',g=JSON.parse(localStorage.getItem(k));g.voyages=Math.max(4,g.voyages);g.coins=Math.max(10000,g.coins);localStorage.setItem(k,JSON.stringify(g))});
    await page.goto(LIVE+'crew-mobile.html',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#crewTrain:enabled').waitFor({state:'visible',timeout:15000});
    if(name!=='desktop')page.on('dialog',d=>d.accept());
    const beforeCrew=await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).coins);
    await page.locator('#crewTrain').click();
    assert.equal(await page.locator('#crewTraining').innerText(),'1/5');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).coins),beforeCrew-800);
    await page.locator('[data-recruit="marco-riva"]').click();
    assert.equal(await page.locator('#payroll').innerText(),'210');
    assert.equal(await page.locator('[data-recruit="marco-riva"]').isDisabled(),true);
    await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('#crewTraining').innerText(),'1/5');
    assert.equal(await page.locator('#payroll').innerText(),'210');
    assert.equal((await pageAudit(page,name+' crew')).horizontalOverflow,false);
    await page.screenshot({path:path.join(OUT,name+'-crew.png'),fullPage:true,animations:'disabled'});
    // Timed research in an isolated local save.
    await page.evaluate(()=>{const k='marina_empire_beta_test_session',g=JSON.parse(localStorage.getItem(k));g.coins=Math.max(g.coins,100000);g.research={};localStorage.setItem(k,JSON.stringify(g))});
    await page.goto(LIVE+'research-mobile.html?v=20261109-research1',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('[data-start="efficient_engines"]:enabled').waitFor({state:'visible',timeout:15000});
    await page.locator('[data-start="efficient_engines"]').click();
    assert.equal(await page.locator('#effectFuel').innerText(),'0%');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).research.efficient_engines.status),'active');
    await page.evaluate(()=>{const k='marina_empire_beta_test_session',g=JSON.parse(localStorage.getItem(k));g.research.efficient_engines.completesAt=Date.now()-1;localStorage.setItem(k,JSON.stringify(g))});
    await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('#effectFuel').innerText(),'-10%');
    assert.equal((await pageAudit(page,name+' research')).horizontalOverflow,false);
    await page.screenshot({path:path.join(OUT,name+'-research.png'),fullPage:true,animations:'disabled'});
    await page.goto(LIVE+'mobile-home.html?v=20261111-home6',{waitUntil:'domcontentloaded',timeout:30000});
    const eventTitle=await page.locator('#worldTitle').innerText();assert.notEqual(eventTitle,'Evento del giorno');
    await page.locator('#worldCard a').click();await page.waitForURL(/evento-mondo\.html/);
    assert.equal(await page.locator('#title').innerText(),eventTitle);
    assert.equal((await pageAudit(page,name+' world event')).horizontalOverflow,false);
    await page.goto(LIVE+'weekend-water-toys.html',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('[data-water-job="sup"]:enabled').waitFor({state:'visible',timeout:15000});
    const preWater=await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).coins);
    await page.locator('[data-water-job="sup"]').click();assert.equal(await page.locator('#waterClaim').isDisabled(),true);
    const activity=await page.evaluate(()=>{const k='marina_empire_beta_test_session',g=JSON.parse(localStorage.getItem(k));g.waterToysActivity.until=Date.now()-1;localStorage.setItem(k,JSON.stringify(g));return g.waterToysActivity});
    await page.locator('#waterClaim:enabled').waitFor({state:'visible',timeout:15000});
    await page.locator('#waterClaim').click();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).coins),preWater-120+activity.reward);
    assert.equal(await page.locator('[data-water-job="sup"]').innerText(),'COMPLETATO OGGI');
    assert.equal((await pageAudit(page,name+' water toys')).horizontalOverflow,false);
    console.log('LIVE_AUDIT '+JSON.stringify({
      scenario:name,viewport,firstMission:firstText.slice(0,140),
      route:active.route,destination:active.destination,mission:active.mission,
      arrival:{port:arrivalSave.port,coins:arrivalSave.coins,prestige:arrivalSave.prestige,voyages:arrivalSave.voyages},
      home,missions,map,docking,practice,runtimeErrors:errors,badResponses
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
