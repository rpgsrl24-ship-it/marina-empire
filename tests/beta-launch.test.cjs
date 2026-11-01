// Non-destructive beta launch regression contracts (no browser state mutation).
const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
function expect(fragment,reason){assert(html.includes(fragment),reason)}
expect('function launch(id)', 'Missing mission launch');
expect('function finishVoyage()', 'Missing mission arrival');
expect('function voyageHeartbeat()', 'Missing voyage recovery heartbeat');
expect('function persist()', 'Missing save persistence');
expect('function betaDiagnostics()', 'Missing beta diagnostics');
expect('function planSeaTrip(', 'Missing route planning');
expect('function renderMissionChoices()', 'Missing mission listing');
expect('window.meRegisteredPlayer', 'Missing guest/registered distinction');
expect('state.setupComplete', 'Missing initial setup gate');
expect('state.settledVoyages', 'Missing duplicate reward guard');
expect('id="meVoucherRedeem"', 'Missing payment/voucher control');
expect('meVoucherRedeem', 'Missing voucher disable diagnostics');
expect('name="viewport"', 'Missing mobile viewport');
expect('https://rpgsrl24-ship-it.github.io/marina-empire/', 'Missing canonical public game URL');
assert(/function launch\(id\)[\s\S]*?state\.trip=\{[\s\S]*?persist\(\)/.test(html),'Mission must persist active voyage');
assert(/function finishVoyage\(\)[\s\S]*?alreadySettled/.test(html),'Arrival must guard duplicate settlement');

// Critical pre-launch checks: prevent broken trial gates or mission economics.
expect('function confirmSetup()', 'Missing first-run setup confirmation');
expect('REGISTRATI GRATIS E CONTINUA', 'Missing post-trial signup CTA');
expect('Bilancio missione:', 'Missing voyage economy estimate');
expect('Missioni pronte:', 'Missing mission readiness overview');
assert(/function launch\(id\)[\s\S]*?window\.meRegisteredPlayer[\s\S]*?showTab\("profile"\)/.test(html), 'Guest must be directed to signup after trial');
assert(/function renderMissionChoices\(\)[\s\S]*?state\.setupComplete[\s\S]*?CONFIGURA LA PARTITA/.test(html), 'First mission must respect setup gate');
// Mobile return and save durability are launch-critical.
expect('document.addEventListener("visibilitychange"', 'Missing mobile background/foreground recovery');
expect('window.addEventListener("pageshow"', 'Missing mobile page restore handler');
expect('window.addEventListener("focus"', 'Missing window focus voyage recovery');
expect('localStorage.getItem(KEY)!==snapshot', 'Missing local save readback verification');
assert(/function voyageHeartbeat\(\)/.test(html), 'Missing voyage progress recovery');
console.log('PASS: beta onboarding, mission persistence, duplicate settlement, and public URL contracts');
