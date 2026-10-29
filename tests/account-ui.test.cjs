const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
for(const [label,pattern] of [
 ['desktop account navigation',/data-tab="profile">COMANDANTE \/ ACCOUNT<\/button>/],
 ['mobile account navigation',/data-mobile-tab="profile"><span>👤<\/span>ACCOUNT<\/button>/],
 ['cloud account heading',/<h3>ACCOUNT E SALVATAGGI ONLINE<\/h3>/],
 ['cloud login action',/id="cloudLogin"/],
 ['cloud upload action',/id="cloudUpload"/],
 ['cloud download action',/id="cloudDownload"/],
 ['backup restore action',/restoreCloudButton\.addEventListener\("click",restoreCloudBackup\)/]
])assert.match(html,pattern,label);
console.log('Account discoverability contracts passed');
