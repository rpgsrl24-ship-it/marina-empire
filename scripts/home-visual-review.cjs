// Read-only audit of currently published Marina Empire home. No game or server mutations.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve('test-results/home-visual-live');
fs.mkdirSync(out, { recursive:true });
const base='https://rpgsrl24-ship-it.github.io/marina-empire/';
async function inspect(browser,label,viewport,isMobile) {
 const context=await browser.newContext({viewport,isMobile,hasTouch:isMobile,deviceScaleFactor:1});
 await context.route('**/*',async route=>{
  let u;try{u=new URL(route.request().url())}catch{ return route.continue()}
  if(u.hostname.endsWith('supabase.co') && u.pathname.includes('/me_game_events'))
   return route.fulfill({status:201,contentType:'application/json',body:'{}'});
  if(u.hostname.endsWith('supabase.co')||u.hostname.endsWith('rpgyacht.com')||u.hostname.endsWith('resend.com'))
   return route.abort();
  return route.continue();
 });
 const page=await context.newPage();
 const report={label,viewport,errors:[],badAssets:[],steps:[],started:new Date().toISOString()};
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.errors.push('console: '+m.text().slice(0,180));});
 page.on('response',r=>{
  if(r.url().startsWith(base)&&r.status()>=400)report.badAssets.push(r.status()+' '+r.url().slice(0,125));
 });
 try {
  const r=await page.goto(base+'?visual-audit=20261104',{waitUntil:'domcontentloaded',timeout:45000});
  report.http=r?.status();
  const release=await page.request.get(base+'release.json?visual-audit='+Date.now()).catch(()=>null);
  if(release?.ok())report.release=await release.json().catch(()=>null);
  await page.locator('#playerName').waitFor({state:'visible',timeout:15000});
  await page.screenshot({path:path.join(out,label+'-welcome.png'),animations:'disabled'});
  await page.locator('#playerName').fill('Audit grafico');
  await page.locator('#play').click();
  await page.locator('#confirmSetup').waitFor({state:'visible',timeout:15000});
  await page.locator('#setupMarina').selectOption('rimini');
  await page.locator('#confirmSetup').click();
  await page.locator('#missionList [data-mission]:enabled').first().waitFor({state:'visible',timeout:25000});
  report.steps.push('Guest welcome and Rimini setup passed');
  const homeButton=page.locator('.me-command-rail.left [data-deck-tab="home"]');
  if(await homeButton.isVisible())await homeButton.click();
  else await page.evaluate(()=>typeof showTab==='function'&&showTab('home'));
  await page.waitForTimeout(5200);
  await page.screenshot({path:path.join(out,label+'-home.png'),animations:'disabled'});
  report.home=await page.evaluate(()=>{
   const v=el=>{if(!el)return false;const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>2&&r.height>2&&s.display!=='none'&&s.visibility!=='hidden'};
   const info=id=>{const el=document.getElementById(id);if(!el)return null;const r=el.getBoundingClientRect();return {exists:true,visible:v(el),text:(el.textContent||'').trim().slice(0,150),width:Math.round(r.width),height:Math.round(r.height),src:el.getAttribute('src')||null}};
   const btn=[...document.querySelectorAll('.me-command-rail button')].map(el=>{const r=el.getBoundingClientRect();return {label:el.title||el.textContent.trim(),visible:v(el),clipped:r.left<0||r.right>innerWidth||r.top<0||r.bottom>innerHeight}});
   return {title:document.title,viewport:[innerWidth,innerHeight],horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2,
     home:info('home'),marinaFrame:info('meHomeMarinaFrame'),legacyFrame:info('mePcMarinaFrame'),
     career:info('meHomeCareerCard'),worldLiveButton:info('mePcLiveButton'),
     ticker:info('mePcFinalTicker'),bottomAction:info('meCommandBottom'),
     fuel:info('meQuickFuel'),repair:info('meQuickRepair'),rails:btn,
     homePanelAPI:typeof window.MarinaEmpireHomePanels?.open==='function',
     liveTrafficAPI:typeof window.MarinaEmpireLiveTraffic?.snapshot==='function'
   };
  });
  const frameElement=page.locator('#meHomeMarinaFrame');
  if(await frameElement.count()){
   const frame=await frameElement.contentFrame();
   report.scene={url:frame.url()};
   try {
    report.scene.elements=await frame.evaluate(()=>({
     title:document.title,canvases:document.querySelectorAll('canvas').length,
     cleanEmbed:document.documentElement.classList.contains('me-home-embed'),
     visibleHeaders:[...document.querySelectorAll('header,aside,.controls,.tip')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.tagName),
     sceneHeight:document.querySelector('main')?.getBoundingClientRect().height
    }));
   }catch(e){report.scene.error=String(e)}
  }
  if(!isMobile){
   for(const section of ['missions','fleet','marinas','office']){
    const b=page.locator('.me-command-rail [data-deck-tab="'+section+'"]').first();
    if(!(await b.isVisible())){report.steps.push('not visible '+section);continue}
    await b.click();await page.waitForTimeout(500);
    const state=await page.evaluate(section=>{
      const a=document.getElementById(section),h=document.getElementById('home');
      return {section,opensInsideHome:a?.classList.contains('me-home-panel'),homeStillVisible:!!h&&!h.classList.contains('hide'),bodyPanel:document.body.classList.contains('me-home-panel-open'),closeButton:!!a?.querySelector('.me-home-panel-close')};
    },section);
    report.steps.push(state);
    if(section==='missions')await page.screenshot({path:path.join(out,label+'-missions-panel.png'),animations:'disabled'});
    const close=page.locator('#'+section+' > .me-home-panel-close');
    if(await close.isVisible())await close.click();
    else report.steps.push('MISSING_CLOSE_BUTTON '+section);
    await page.waitForTimeout(150);
   }
   await page.screenshot({path:path.join(out,label+'-returned-home.png'),animations:'disabled'});
  }
 }catch(e){report.fatal=String(e.stack||e).slice(0,1800)}
 finally{report.finished=new Date().toISOString();await context.close();fs.writeFileSync(path.join(out,label+'-report.json'),JSON.stringify(report,null,2));}
 return report;
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
 let a=[];
 try{
  a.push(await inspect(browser,'desktop',{width:1440,height:900},false));
  a.push(await inspect(browser,'mobile',{width:390,height:844},true));
 }finally{await browser.close()}
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(a,null,2));
 console.log('HOME_VISUAL_AUDIT '+JSON.stringify(a));
})().catch(e=>{console.error(e);process.exitCode=1});
