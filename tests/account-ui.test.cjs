const fs=require('node:fs');
const assert=require('node:assert/strict');

const profile=fs.readFileSync('profile-mobile.html','utf8');
const guard=fs.readFileSync('credit-sync-guard.js','utf8');
const local=fs.readFileSync('local-save-context.js','utf8');

for(const [label,pattern] of [
 ['modern profile navigation',/👤 Profilo/],
 ['modern account navigation',/⚙️ Account/],
 ['modern save navigation',/☁️ Salvataggi/],
 ['dedicated save section',/id="profileSaves"/],
 ['save state indicator',/id="saveState"/],
 ['save commander indicator',/id="saveCaptain"/],
 ['save marina indicator',/id="savePort"/],
 ['save voyage indicator',/id="saveVoyages"/],
 ['save status indicator',/id="saveStatus"/],
 ['local save context loaded',/local-save-context\.js/],
 ['hash-synced profile tabs',/syncProfileTabFromHash/]
])assert.match(profile,pattern,label);

assert.match(local,/function capture\(\)/,'local save context must expose capture');
assert.match(local,/function readGame\(handle\)/,'local save context must expose readGame');
assert.match(local,/function writeGame\(handle, game\)/,'local save context must expose writeGame');
assert.match(guard,/window\.meCreditCheckoutReady=async function\(\)/,'cloud checkout guard must exist');
assert.match(guard,/player_progress/,'cloud progress sync must exist');
assert.match(guard,/marina_empire_before_credit_merge/,'credit merge must keep a local backup');

console.log('Modern account and save discoverability contracts passed');
