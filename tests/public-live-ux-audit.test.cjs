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

async function clickTrial(page){
  await page.locator('#playerName').fill('Audit Live');
  await page.locator('#play').click();
  await page.locator('#confirmSetup').waitFor({state:'visible',timeout:15000});
  await page.locator('#setupMarina').selectOption('rimini');
  await page.locator('#confirmSetup').click();
  await page.locator('#missionList [data-mission]:enabled').first().waitFor({state:'visible',timeout:15000});
}

async function runScenario(browser,name,viewport,mobile){
  const context=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
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
    await page.waitForLoadState('load',{timeout:30000});
    await page.screenshot({path:path.join(OUT,name+'-welcome.png'),fullPage:false,animations:'disabled'});
    const welcome=await pageAudit(page,name+' welcome');
    assert.equal(welcome.horizontalOverflow,false,name+': welcome has horizontal overflow');
    assert.equal(welcome.clipped.length,0,name+': welcome has clipped actions '+JSON.stringify(welcome.clipped));

    await clickTrial(page);
    await page.screenshot({path:path.join(OUT,name+'-missions.png'),fullPage:false,animations:'disabled'});
    const missions=await pageAudit(page,name+' missions');
    assert.equal(missions.horizontalOverflow,false,name+': missions has horizontal overflow');
    assert.equal(missions.clipped.length,0,name+': missions has clipped actions '+JSON.stringify(missions.clipped));

    const first=page.locator('#missionList [data-mission]:enabled').first();
    const firstText=(await first.innerText()).trim();
    await first.click();
    await page.waitForFunction(()=>!!JSON.parse(localStorage.getItem('marina_empire_beta_test_session'))?.trip,{timeout:15000});
    await page.locator('#voyageCinema').waitFor({state:'visible',timeout:15000});
    await page.locator('#cinemaSea').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(OUT,name+'-voyage.png'),fullPage:false,animations:'disabled'});
    const voyage=await pageAudit(page,name+' voyage');
    const geometry=await page.evaluate(()=>{
      const rect=id=>{const el=document.getElementById(id);if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
      return {
        gps:rect('voyageRouteMap'),
        sea:rect('cinemaSea'),
        controls:rect('meHelmControls'),
        weather:(document.getElementById('meBridgeWeather')?.textContent||'').trim(),
        title:(document.getElementById('cinemaTitle')?.textContent||'').trim()
      };
    });
    assert.equal(voyage.horizontalOverflow,false,name+': voyage has horizontal overflow');
    assert.equal(voyage.clipped.length,0,name+': voyage has clipped actions '+JSON.stringify(voyage.clipped));
    assert.ok(geometry.gps&&geometry.gps.w>70&&geometry.gps.h>45,name+': GPS is too small');
    assert.ok(geometry.sea&&geometry.gps.x>=geometry.sea.x-2&&geometry.gps.right<=geometry.sea.right+2,name+': GPS outside helm');
    assert.ok(geometry.controls&&geometry.controls.x>=-2&&geometry.controls.right<=viewport.width+2,name+': helm controls outside viewport');
    assert.match(geometry.weather,/METEO SIMULATO/,name+': weather label missing');

    if(mobile){
      const expand=page.locator('#meVoyageExpand');
      if(await expand.isVisible()){
        await expand.click();
        await page.waitForFunction(()=>document.body.classList.contains('me-voyage-focus'));
        await page.screenshot({path:path.join(OUT,name+'-voyage-expanded.png'),fullPage:false,animations:'disabled'});
        const expanded=await pageAudit(page,name+' expanded');
        assert.equal(expanded.horizontalOverflow,false,name+': expanded helm has horizontal overflow');
        assert.equal(expanded.clipped.length,0,name+': expanded helm has clipped actions '+JSON.stringify(expanded.clipped));
      }
    }

    const trip=await page.evaluate(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session')).trip);
    await page.clock.setFixedTime(new Date(trip.until+1000));
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('marina_empire_beta_test_session'))?.trip===null,{timeout:15000});
    await page.screenshot({path:path.join(OUT,name+'-arrival.png'),fullPage:false,animations:'disabled'});
    const arrival=await pageAudit(page,name+' arrival');
    assert.equal(arrival.horizontalOverflow,false,name+': arrival has horizontal overflow');
    assert.equal(arrival.clipped.length,0,name+': arrival has clipped actions '+JSON.stringify(arrival.clipped));

    console.log('LIVE_AUDIT '+JSON.stringify({
      scenario:name,
      viewport,
      firstMission:firstText.slice(0,120),
      welcome,
      missions,
      voyage,
      arrival,
      geometry,
      runtimeErrors:errors,
      badResponses
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
