// End-to-end guest regression, with real Leaflet/Three.js and isolated networking.
// No request reaches Supabase, shops, analytics, email or payment services.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');

const root = path.resolve(process.env.ME_TEST_ROOT || path.join(__dirname, '..'));
const output = path.resolve(process.env.ME_TEST_OUTPUT || 'test-results/prelaunch');
const leaflet = path.dirname(require.resolve('leaflet/package.json'));
const three = path.dirname(path.dirname(require.resolve('three')));
const mime = {'.html':'text/html','.js':'text/javascript','.cjs':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7pUAAAAASUVORK5CYII=', 'base64');
const saveKey = 'marina_empire_beta_test_session';
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404); res.end('Not found'); return;}
  res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});

async function isolated(context,origin,traffic=[]) {
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === origin) return route.continue();
    if (url.hostname === 'zrdetqvnjmqkfyajxjgp.supabase.co' && url.pathname === '/rest/v1/me_game_events') {
      let body={};
      try {body=JSON.parse(request.postData()||'{}')} catch {}
      traffic.push({method:request.method(),headers:request.headers(),body});
      return route.fulfill({status:201,contentType:'application/json',body:''});
    }
    let file;
    if (url.hostname === 'unpkg.com' && url.pathname.startsWith('/leaflet@1.9.4/')) file = path.join(leaflet,url.pathname.split('/leaflet@1.9.4/')[1]);
    if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/npm/three@0.160.1/')) file = path.join(three,url.pathname.split('/npm/three@0.160.1/')[1]);
    if (file && fs.existsSync(file)) return route.fulfill({status:200, contentType:mime[path.extname(file)] || 'application/octet-stream', body:fs.readFileSync(file),headers:{'Access-Control-Allow-Origin':'*'}});
    if (request.resourceType() === 'image') return route.fulfill({status:200,contentType:'image/png',body:pixel});
    return route.abort('blockedbyclient');
  });
}

async function save(page) {return page.evaluate(key => JSON.parse(localStorage.getItem(key)), saveKey);}
async function goTab(page,id,mobile) {
  if (mobile) {
    const quick=page.locator(`[data-mobile-tab="${id}"]`);
    if (await quick.isVisible()) await quick.click();
    else if(await page.locator('#meMobileMoreToggle').isVisible()) {await page.locator('#meMobileMoreToggle').click(); await page.locator(`[data-mobile-more-tab="${id}"]`).click();}
    else await page.locator(`#navigation [data-tab="${id}"]`).click();
  } else await page.locator(`#navigation [data-tab="${id}"]`).click();
  await page.waitForFunction(id => !document.getElementById(id).classList.contains('hide'),id);
}

async function trial(browser,origin,name,viewport,mobile) {
  const context=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const traffic=[];
  await isolated(context,origin,traffic);
  const page=await context.newPage(),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(origin) && r.status()>=400) missing.push(`${r.status()} ${new URL(r.url()).pathname}`);});
  await page.clock.setFixedTime(new Date('2026-11-02T09:00:00Z'));
  try {
    await page.goto(origin,{waitUntil:'load'});
    await page.locator('#playerName').fill('Collaudo P0');
    await page.locator('#play').click();
    assert.deepEqual(errors,[],`${name}: new player entry must not throw`);
    await page.locator('#confirmSetup').waitFor({state:'visible'});
    await page.locator('#setupMarina').selectOption('rimini');
    await page.locator('#confirmSetup').click();
    await page.locator('#missionList [data-mission]:enabled').first().waitFor({state:'visible'});
    assert.deepEqual(errors,[],`${name}: setup and rendering must not throw`);
    assert.ok((await page.locator('#fleetList').innerText()).includes('RPG'),'Fleet must finish rendering');
    assert.ok((await page.locator('#profileText').innerText()).includes('Collaudo P0'),'Profile must finish rendering');
    assert.equal(await page.locator('[data-marina="rose"]').count(),0,'Headquarters must not offer a purchase');
    assert.equal(await page.locator('[data-marina-upgrade="rose"]').count(),0,'Headquarters must not offer upgrades');
    assert.equal(await page.locator('[data-business-marina="rose"]').count(),0,'Headquarters must not sell businesses');
    assert.equal(await page.locator('#meVoucherRedeem').isDisabled(),true,'Paid-credit redemption stays disabled');
    assert.equal(await page.locator('#meVoucherCode').isDisabled(),true,'Paid-credit entry stays disabled');
    const transitionAudit=await page.evaluate(async tabs=>{
      const results=[];
      for(const tab of tabs){
        const button=document.querySelector('[data-tab="'+tab+'"]');
        const screen=document.getElementById(tab);
        if(!button||!screen)continue;
        const start=performance.now();
        button.click();
        await new Promise(resolve=>requestAnimationFrame(()=>resolve()));
        const style=getComputedStyle(screen),rect=screen.getBoundingClientRect();
        results.push({tab,elapsed:performance.now()-start,visible:style.display!=='none'&&!screen.classList.contains('hide')&&rect.height>0});
      }
      return results;
    },['home','office','map','fleet','marinas','profile','missions']);
    assert.ok(transitionAudit.length>=6,name+': primary navigation screens are present');
    for(const item of transitionAudit){
      assert.equal(item.visible,true,name+': '+item.tab+' screen is visible after navigation');
      assert.ok(item.elapsed<500,name+': '+item.tab+' transition completes within one responsive frame budget window');
    }
    const before=await save(page);
    await page.locator('#missionList [data-mission]:enabled').first().click();
    await page.waitForFunction(key=>!!JSON.parse(localStorage.getItem(key))?.trip,saveKey);
    const launched=await save(page);
    assert.notEqual(launched.trip.origin,launched.trip.dest,'Mission must move between distinct marinas');
    assert.equal(launched.trip.origin,before.port,'Departure must use the current marina');
    assert.ok(launched.coins>=0 && launched.coins<=before.coins,'Launch must not create a negative balance');
    assert.ok(launched.fuel>=0 && launched.fuel<before.fuel,'Launch must consume fuel');
    assert.ok(launched.condition>=0 && launched.condition<=100,'Condition must remain bounded');
    const voyageId=launched.trip.voyageId;
    await page.reload({waitUntil:'load'});
    const resumed=await save(page);
    assert.equal(resumed.trip.voyageId,voyageId,'Refresh must resume the same trip');
    assert.equal(resumed.coins,launched.coins,'Refresh must not charge twice');
    assert.equal(resumed.fuel,launched.fuel,'Refresh must not consume fuel twice');
    await page.clock.setFixedTime(new Date(launched.trip.until - launched.trip.sec * 500));
    await page.locator('#voyageCinema').waitFor({state:'visible'});
    await page.locator('#cinemaSea').waitFor({state:'visible'});
    await page.locator('#cinemaSea').scrollIntoViewIfNeeded();
    const voyageIdentity=await page.evaluate(trip=>({
      origin:port(trip.origin).name,
      destination:port(trip.legs?.[trip.legIndex+1]||trip.dest).name,
      yacht:boat(trip.mission?.boat||trip.boat||state.boat).name
    }),launched.trip);
    await page.waitForFunction(expected=>document.getElementById('cinemaRadio')?.textContent?.includes(expected),voyageIdentity.destination);
    const cinemaTitle=await page.locator('#cinemaTitle').innerText();
    const cinemaRadio=await page.locator('#cinemaRadio').innerText();
    assert.ok(cinemaTitle.includes(voyageIdentity.yacht),name+': console shows the active yacht');
    assert.ok(cinemaTitle.includes(voyageIdentity.origin)&&cinemaTitle.includes(voyageIdentity.destination),name+': console shows the current leg origin and destination');
    assert.ok(cinemaRadio.includes(voyageIdentity.yacht)&&cinemaRadio.includes(voyageIdentity.destination),name+': VHF follows active yacht and next marina');
    assert.equal(await page.locator('#cinemaDock').isVisible(),false,name+': old marina scene stays hidden while GPS bridge is the voyage view');
    const helmView=page.locator('#meHelmView');
    if(await helmView.isVisible())await helmView.click();
    await page.waitForFunction(()=>!document.getElementById('cinemaSea')?.classList.contains('me-helm-gps'));
    const seaMotion=await page.evaluate(()=>({
      helmAnimation:getComputedStyle(document.getElementById('meHelmWindow')).animationName,
      waterAnimation:getComputedStyle(document.querySelector('.me-water-motion'),'::before').animationName,
      wakeAnimation:getComputedStyle(document.querySelector('.me-wake'),'::before').animationName,
      waterOpacity:Number.parseFloat(getComputedStyle(document.querySelector('.me-water-motion')).opacity||'0'),
      wakeOpacity:Number.parseFloat(getComputedStyle(document.querySelector('.me-wake')).opacity||'0')
    }));
    assert.equal(seaMotion.helmAnimation,'none',name+': approved helm photo remains stable');
    assert.ok(seaMotion.waterAnimation.includes('meWaveTravel'),name+': water surface is animated in helm view');
    assert.ok(seaMotion.wakeAnimation.includes('meWakeFlow'),name+': wake is animated in helm view');
    assert.ok(seaMotion.waterOpacity>0&&seaMotion.wakeOpacity>0,name+': animated water and wake remain visible');
    const geometry=await page.evaluate(()=>{
      const rect=id=>{const b=document.getElementById(id).getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom}};
      return {viewport:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+2,sea:rect('cinemaSea'),gps:rect('voyageRouteMap'),controls:rect('meHelmControls'),markers:document.querySelectorAll('#voyageRouteMap .leaflet-marker-icon').length,route:document.querySelectorAll('#voyageRouteMap path.leaflet-interactive').length};
    });
    assert.ok(!geometry.overflow,`${name}: horizontal page overflow`);
    assert.ok(geometry.gps.width>70 && geometry.gps.height>45,`${name}: GPS is readable`);
    assert.ok(geometry.gps.x>=geometry.sea.x-2 && geometry.gps.right<=geometry.sea.right+2,`${name}: GPS remains inside the console`);
    assert.ok(geometry.controls.x>=-2 && geometry.controls.right<=geometry.viewport+2,`${name}: helm buttons remain on screen`);
    assert.ok(geometry.markers>0 && geometry.route>0,`${name}: yacht and route are drawn`);
    await page.screenshot({path:path.join(output,`${name}-voyage.png`),fullPage:false,animations:'disabled'});
    const expand=page.locator('#meVoyageExpand');
    if (mobile && await expand.isVisible()) {
      await expand.click();
      await page.waitForFunction(()=>document.body.classList.contains('me-voyage-focus'));
      const expanded=await page.evaluate(()=>{const r=document.getElementById('meHelmControls').getBoundingClientRect();const gps=document.getElementById('voyageRouteMap').getBoundingClientRect();return {bottom:r.bottom,top:r.top,height:innerHeight,gpsTop:gps.top,gpsBottom:gps.bottom}});
      assert.ok(expanded.top>=0 && expanded.bottom<=expanded.height+2, `${name}: expanded helm controls must be reachable`);
      assert.ok(expanded.gpsTop>=0 && expanded.gpsBottom<=expanded.height+2, `${name}: expanded GPS must be visible`);
      await page.screenshot({path:path.join(output,`${name}-expanded.png`),fullPage:false,animations:'disabled'});
      await expand.click();
    }
    const active=await save(page);
    assert.ok(active.trip, 'The console inspection must happen during navigation');
    await page.clock.setFixedTime(new Date(active.trip.until+1000));
    await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key))?.voyages===1,saveKey);
    const arrived=await save(page);
    assert.equal(arrived.trip,null,'Arrival clears the active trip');
    assert.equal(arrived.port,launched.trip.dest,'Arrival updates yacht location');
    assert.equal(arrived.voyages,1,'The first trip is counted once');
    assert.equal(arrived.lastArrival.reward,launched.trip.mission.reward,'The advertised mission reward is recorded');
    assert.ok(arrived.coins>=launched.coins+launched.trip.mission.reward,'Reward is credited');
    assert.ok(arrived.fuel>=0 && arrived.condition>=0,'Arrival cannot underflow fuel or condition');
    assert.equal(await page.locator('#voyageCinema').isVisible(),true,'The console remains after arrival');
    assert.equal(await page.locator('#voyageArrivalNotice').isVisible(),true,'Arrival summary is visible');
    const arrivalIdentity=await page.evaluate(()=>({title:document.getElementById('cinemaTitle')?.textContent||'',route:document.getElementById('meBridgeRoute')?.textContent||'',yacht:boat(state.boat).name,port:port(state.port).name}));
    assert.ok(arrivalIdentity.title.includes(arrivalIdentity.yacht)&&arrivalIdentity.title.includes(arrivalIdentity.port),name+': docked console shows yacht and actual arrival marina');
    assert.ok(arrivalIdentity.route.includes(arrivalIdentity.port),name+': docked route indicator uses the saved arrival marina');
    await page.reload({waitUntil:'load'});
    await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key))?.trip===null,saveKey);
    const reloaded=await save(page);
    assert.equal(reloaded.coins,arrived.coins,'Arrival refresh must not credit another reward');
    assert.equal(reloaded.voyages,1,'Arrival refresh must not duplicate the voyage');
    assert.equal(reloaded.port,arrived.port,'Arrival port persists');
    const trackedTypes=traffic.map(x=>x.body?.event_type);
    assert.ok(trackedTypes.includes('page_view'),name+': analytics records page_view');
    assert.equal(trackedTypes.filter(x=>x==='play_start').length,1,name+': analytics records play_start once');
    assert.equal(trackedTypes.filter(x=>x==='mission_complete').length,1,name+': analytics records mission_complete once');
    const analyticsRows=traffic.filter(x=>['page_view','play_start','mission_complete'].includes(x.body?.event_type));
    assert.ok(analyticsRows.length>=3,name+': expected analytics events were captured');
    const pageViewSessions=new Set(analyticsRows.filter(x=>x.body?.event_type==='page_view').map(x=>x.body?.session_id));
    assert.ok(pageViewSessions.size>=1,name+': every loaded page creates an in-memory analytics session');
    for(const entry of analyticsRows){
      assert.ok(pageViewSessions.has(entry.body?.session_id),name+': gameplay analytics belongs to a page-load session');
      assert.equal(entry.method,'POST',name+': analytics uses POST');
      assert.equal(entry.headers.prefer,'return=minimal',name+': analytics requests no returned rows');
      assert.equal(Object.hasOwn(entry.body,'visitor_id'),false,name+': analytics must not send persistent visitor_id');
      assert.equal(entry.body.source,'direct',name+': local QA traffic defaults to direct source');
    }
    await goTab(page,'missions',mobile);
    assert.ok((await page.locator('#missionList').innerText()).includes('REGISTRATI GRATIS E CONTINUA'),'Guest receives the signup invitation after trial');
    assert.equal(await page.locator('#missionList [data-mission]:enabled').count(),0,'Guest cannot start a second mission');
    await goTab(page,'profile',mobile);
    await page.locator('#cloudEmail').waitFor({state:'visible'});
    assert.ok((await page.locator('#profileText').innerText()).includes('1 viaggi'),'Profile reports the completed trial');
    assert.deepEqual(errors,[],`${name}: runtime errors`);
    assert.deepEqual(missing,[],`${name}: missing local assets`);
    await page.screenshot({path:path.join(output,`${name}-account.png`),fullPage:false,animations:'disabled'});
    console.log(`PASS ${name}: guest/setup/mission/refresh/arrival/no duplicate rewards/signup/payments/headquarters/GPS`);
  } catch(e) {
    await page.screenshot({path:path.join(output,`${name}-failure.png`),fullPage:false,animations:'disabled'}).catch(()=>{});
    console.error(JSON.stringify({scenario:name,runtimeErrors:errors,missingLocalAssets:missing}));
    throw e;
  } finally {await context.close();}
}

async function corruptSaveRecovery(browser,origin) {
  const name='recovery-mobile',raw='{"name":"Capitano da recuperare è", BROKEN';
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  await isolated(context,origin);
  await context.addInitScript(({key,raw})=>localStorage.setItem(key,raw),{key:saveKey,raw});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try {
    await page.goto(origin,{waitUntil:'load'});
    const panel=page.locator('#meLocalSaveRecovery');
    await panel.waitFor({state:'visible'});
    assert.equal(await page.locator('#welcome').isVisible(),true,'Recovery must be available over the welcome screen');
    const geometry=await panel.evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:innerWidth,height:innerHeight};});
    assert.ok(geometry.left>=0&&geometry.right<=geometry.width&&geometry.top>=0&&geometry.bottom<=geometry.height,'Recovery panel must fit the mobile viewport');
    for(const id of ['meDownloadProtectedSave','meRecoveryAccountAccess']){
      const button=page.locator('#'+id);await button.scrollIntoViewIfNeeded();
      assert.equal(await button.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),true,`${id}: welcome must not cover the recovery action`);
    }
    await page.evaluate(()=>{document.getElementById('playerName').value='Cannot replace original';document.getElementById('play').click();});
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),raw,'Entry must preserve the original corrupt save');
    const downloadEvent=page.waitForEvent('download');
    await page.locator('#meDownloadProtectedSave').click();
    const download=await downloadEvent;
    assert.equal(fs.readFileSync(await download.path(),'utf8'),raw,'Downloaded recovery copy must preserve the original text');
    await download.delete();
    await page.screenshot({path:path.join(output,`${name}-protected.png`),fullPage:false,animations:'disabled'});
    await page.locator('#meRecoveryAccountAccess').click();
    assert.equal(await page.locator('#welcome').isVisible(),false,'Account access must dismiss the welcome overlay');
    await page.locator('#cloudEmail').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('#cloudEmail').isVisible(),true,'The account form remains reachable');
    assert.equal(await page.locator('#cloudEmail').evaluate(el=>{const r=el.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===el;}),true,'Recovery must not cover the account input');
    assert.equal(await panel.evaluate(el=>el.parentElement.id),'profile','The recovery notice remains in the profile');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),raw,'Opening account access must not overwrite the protected save');
    assert.deepEqual(errors,[],`${name}: runtime errors`);
    await page.screenshot({path:path.join(output,`${name}-account.png`),fullPage:false,animations:'disabled'});
    console.log(`PASS ${name}: corrupt startup/original text/download/visible recovery/account access`);
  } catch(e) {
    await page.screenshot({path:path.join(output,`${name}-failure.png`),fullPage:false,animations:'disabled'}).catch(()=>{});
    console.error(JSON.stringify({scenario:name,runtimeErrors:errors}));
    throw e;
  } finally {await context.close();}
}


async function multiTabConflict(browser,origin) {
  const name='multi-tab-conflict';
  const base={name:'Concorrenza P0',coins:10000,fuel:300,condition:100,port:'rimini',boat:'voyager',owned:['voyager'],completed:[],trip:null,reservations:[],voyages:0};
  const context=await browser.newContext({viewport:{width:1100,height:800}});
  await isolated(context,origin);
  await context.addInitScript(({key,raw})=>localStorage.setItem(key,raw),{key:saveKey,raw:JSON.stringify(base)});
  const first=await context.newPage(),stale=await context.newPage(),errors=[];
  stale.on('pageerror',e=>errors.push(e.message));
  try {
    await first.goto(origin,{waitUntil:'domcontentloaded',timeout:30000});
    await stale.goto(origin,{waitUntil:'domcontentloaded',timeout:30000});
    await first.waitForFunction(()=>typeof window.meCanWriteLocalSave==='function');
    await stale.waitForFunction(()=>typeof window.meCanWriteLocalSave==='function');
    const latest=await first.evaluate(key=>{
      const value=JSON.parse(localStorage.getItem(key));
      value.coins=12345;
      value.voyages=1;
      const raw=JSON.stringify(value);
      localStorage.setItem(key,raw);
      return raw;
    },saveKey);
    await stale.waitForFunction(()=>window.meLocalSaveBlocked?.()===true);
    const panel=stale.locator('#meLocalSaveRecovery');
    await panel.waitFor({state:'visible'});
    assert.match(await panel.innerText(),/altra scheda/i,'Stale tab must explain the conflict');
    assert.equal(await stale.evaluate(()=>window.meCanWriteLocalSave?.()),false,'Stale tab must be write-blocked');
    assert.equal(await stale.evaluate(()=>persist()),false,'Stale tab persistence must fail closed');
    assert.equal(await stale.evaluate(key=>localStorage.getItem(key),saveKey),latest,'Stale tab cannot overwrite the newer save');
    assert.deepEqual(errors,[],name+': runtime errors');
    console.log('PASS '+name+': storage event/conflict notice/stale write blocked');
  } finally {await context.close();}
}

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const options={headless:true,args:['--enable-unsafe-swiftshader']};
  if(process.env.ME_CHROMIUM_PATH) options.executablePath=process.env.ME_CHROMIUM_PATH;
  const browser=await chromium.launch(options);
  try {
    if (!process.env.ME_TEST_SCENARIO || process.env.ME_TEST_SCENARIO==='multi-tab-conflict') await multiTabConflict(browser,origin);
    for (const scenario of [
      ['desktop',{width:1440,height:1000},false],
      ['mobile-portrait',{width:390,height:844},true],
      ['mobile-landscape',{width:844,height:390},true]
    ]) {
      if (!process.env.ME_TEST_SCENARIO || process.env.ME_TEST_SCENARIO===scenario[0]) await trial(browser,origin,...scenario);
    }
    if (!process.env.ME_TEST_SCENARIO || process.env.ME_TEST_SCENARIO==='recovery-mobile') await corruptSaveRecovery(browser,origin);
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
