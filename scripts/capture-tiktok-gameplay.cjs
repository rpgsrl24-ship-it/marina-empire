// Marina Empire organic TikTok capture: REAL browser interactions on original game code.
// No mock UI, no replacement game screenshots, no live accounts, no payments.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const cp = require('node:child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'test-results', 'tiktok-gameplay');
fs.mkdirSync(out, { recursive: true });
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
  const full = path.resolve(root, pathname);
  if (!full.startsWith(root + path.sep) || !fs.existsSync(full) || !fs.statSync(full).isFile()) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(full)] || 'application/octet-stream' });
  fs.createReadStream(full).pipe(res);
});

async function goTab(page, id) {
  const b = page.locator('[data-mobile-tab="' + id + '"]');
  if (await b.isVisible()) await b.click();
  else if (await page.locator('#meMobileMoreToggle').isVisible()) {
    await page.locator('#meMobileMoreToggle').click();
    await page.locator('[data-mobile-more-tab="' + id + '"]').click();
  } else await page.locator('#navigation [data-tab="' + id + '"]').click();
  await page.waitForFunction(id => !document.getElementById(id).classList.contains('hide'), id);
}
async function hold(page, seconds, label) {
  await page.waitForTimeout(seconds * 1000);
  await page.screenshot({path:path.join(out, 'keyframe-' + label + '.png')});
}
function ffbin(exe, args) {
  const v = cp.spawnSync(exe, args, { encoding:'utf8' });
  if (v.status !== 0) throw new Error(exe + ' failed: ' + v.stderr);
}
function makeMusic(file, seconds) {
  const rate=44100, frames=Math.ceil(seconds*rate);
  const pcm=Buffer.alloc(44+2*frames);
  pcm.write('RIFF',0);pcm.writeUInt32LE(pcm.length-8,4);pcm.write('WAVEfmt ',8);
  pcm.writeUInt32LE(16,16);pcm.writeUInt16LE(1,20);pcm.writeUInt16LE(1,22);
  pcm.writeUInt32LE(rate,24);pcm.writeUInt32LE(rate*2,28);pcm.writeUInt16LE(2,32);
  pcm.writeUInt16LE(16,34);pcm.write('data',36);pcm.writeUInt32LE(frames*2,40);
  const chords=[[110,130.81,164.81],[87.31,130.81,174.61],[98,146.83,196],[82.41,123.47,164.81]];
  for(let i=0;i<frames;i++){
    const t=i/rate, bar=Math.floor(t/4.5), notes=chords[bar%chords.length];
    const beat=t*2, pulse=Math.exp(-6*(beat%1));
    const bass=Math.sin(2*Math.PI*notes[0]*t)*0.08;
    let pad=0;
    for(let k=0;k<notes.length;k++)pad+=0.029*Math.sin(2*Math.PI*notes[k]*t+0.19*k);
    const high=0.018*pulse*Math.sin(2*Math.PI*notes[2]*4*t);
    const envelope=Math.min(1,t/1.2)*Math.min(1,Math.max(0,(seconds-t)/1.4));
    const s=Math.max(-1,Math.min(1,envelope*(bass+pad+high)));
    pcm.writeInt16LE(Math.round(s*32767),44+i*2);
  }
  fs.writeFileSync(file,pcm);
}
(async ()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
  const context=await browser.newContext({
    viewport:{width:432,height:768},isMobile:true,hasTouch:true,deviceScaleFactor:1,
    recordVideo:{dir:out,size:{width:720,height:1280}}
  });
  // Protect user/server data: the recording is an ISOLATED guest demonstration.
  await context.route('**/*', async route=>{
    const u=new URL(route.request().url());
    if (u.hostname.endsWith('supabase.co')||/paypal|stripe|google-analytics|googletagmanager|facebook.com\/tr|doubleclick/i.test(u.hostname+u.pathname)) return route.abort();
    try {await route.continue();} catch {}
  });
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror', e=>pageErrors.push(e.message));
  const capture=page.video();
  const status={origin:'LOCAL CHECKOUT OF ORIGINAL GAME',pageErrors:[],steps:[],video:null};
  try{
    await page.goto(origin+'/index.html', {waitUntil:'load',timeout:45000});
    await page.locator('#playerName').waitFor({state:'visible',timeout:30000});
    await hold(page,3,'welcome-original');
    await page.locator('#playerName').fill('Capitano RPG');
    await hold(page,2,'nickname-original');
    await page.locator('#play').click();
    await page.locator('#confirmSetup').waitFor({state:'visible',timeout:20000});
    await page.locator('#setupMarina').selectOption('rimini');
    await hold(page,2,'rimini-setup-original');
    await page.locator('#confirmSetup').click();
    await page.locator('#missionList [data-mission]:enabled').first().waitFor({state:'visible',timeout:20000});
    status.steps.push('Guest startup, Rimini setup successful');
    await goTab(page,'home');
    await hold(page,4,'home-original');
    await goTab(page,'fleet');
    await hold(page,3,'fleet-original');
    await goTab(page,'missions');
    await hold(page,4,'missions-original');
    await page.locator('#missionList [data-mission]:enabled').first().click();
    await page.waitForFunction(()=>{try {return !!JSON.parse(localStorage.getItem('marina_empire_beta_test_session'))?.trip;} catch{return false;}},null,{timeout:15000});
    status.steps.push('Actual playable guest mission started');
    await goTab(page,'map');
    await hold(page,7,'navigation-original');
    await goTab(page,'home');
    await hold(page,4,'home-followup-original');
    status.steps.push('Navigation and post-launch home captured');
  }catch(e){
    status.captureError=String(e.stack||e);
    console.error('CAPTURE ERROR',status.captureError);
  }finally{
    status.pageErrors=pageErrors.slice(0,20);
    await context.close();
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
  const webm=await capture.path();
  status.video=path.basename(webm);
  fs.writeFileSync(path.join(out,'capture-status.json'),JSON.stringify(status,null,2));
  if(status.captureError)throw new Error('Guest walkthrough failed. Inspect capture-status.json and keyframes.');
  const dur=Number(cp.execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',webm],{encoding:'utf8'}).trim());
  const wav=path.join(out,'original-bed.wav');
  makeMusic(wav,dur);
  const font='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
  const vf=[
    'fps=30','scale=720:1280:flags=lanczos','format=yuv420p',
    "drawbox=x=0:y=75:w=720:h=105:color=black@0.67:t=fill:enable='between(t,0,4)'",
    "drawtext=fontfile="+font+":text='MARINA EMPIRE':x=(w-text_w)/2:y=95:fontsize=52:fontcolor=0xE5BA69:enable='between(t,0,4)'",
    "drawbox=x=0:y=1090:w=720:h=135:color=black@0.7:t=fill:enable='gte(t,24)'",
    "drawtext=fontfile="+font+":text='PROVA UNA MISSIONE GRATIS':x=(w-text_w)/2:y=1114:fontsize=28:fontcolor=white:enable='gte(t,24)'",
    "drawtext=fontfile="+font+":text='MARINA EMPIRE - BETA':x=(w-text_w)/2:y=1166:fontsize=23:fontcolor=0xE5BA69:enable='gte(t,24)'"
  ].join(',');
  const mp4=path.join(out,'Marina_Empire_TikTok_Gameplay_Originale.mp4');
  ffbin('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',webm,'-i',wav,'-vf',vf,'-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart',mp4]);
  status.output={file:path.basename(mp4),durationSeconds:dur,dimensions:'720x1280',render:'actual Playwright guest flow from main game source'};
  fs.writeFileSync(path.join(out,'capture-status.json'),JSON.stringify(status,null,2));
  console.log(JSON.stringify(status,null,2));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
