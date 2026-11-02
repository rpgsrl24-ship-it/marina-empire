'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync('index.html','utf8');
const rollback=fs.readFileSync('docs/ROLLBACK_PRELANCIO.md','utf8');
const backup=fs.readFileSync('docs/CLOUD_BACKUP_CHECKLIST.md','utf8');
const paymentFiles=[
 'supabase/functions/marina-direct-checkout/index.ts',
 'supabase/functions/marina-issue-credit/index.ts',
 'supabase/functions/marina-redeem-credit/index.ts'
];

test('rollback procedure is commit-based and verifies the published revision',()=>{
 assert(rollback.includes('Non forzare il ramo `main`'));
 assert(rollback.includes('release.json'));
 assert(rollback.includes('hash della homepage'));
 assert(rollback.includes('account, salvataggi cloud o dati dei giocatori'));
});

test('payment server handlers remain hard-disabled independently of Pages rollback',()=>{
 for(const path of paymentFiles){
  const src=fs.readFileSync(path,'utf8');
  assert(src.includes('PAYMENTS_DISABLED'),path+' must remain hard-disabled');
  assert(src.includes('status: 503')||src.includes('status:503'),path+' must fail closed');
 }
});

test('Rose remains excluded from player investment after restore or rollback',()=>{
 assert(html.includes('const canInvestInMarina=id=>id!=="rose"'));
 assert(html.includes('RPG_HEADQUARTERS_NOTICE'));
 assert(rollback.includes("L'Isola delle Rose appartiene alla gestione esclusiva RPG Yacht"));
});

test('local and cloud restore retain a reverse path before replacing state',()=>{
 assert(html.includes('marina_empire_before_cloud_load'));
 assert(html.includes('marina_empire_before_backup_restore'));
 assert(html.includes('Impossibile creare la copia di sicurezza: caricamento annullato.'));
 assert(html.includes('const previousState=state;state=safe;if(persist()===false){state=previousState;return;}'));
 assert(backup.includes('Se la copia di sicurezza non puo essere scritta o verificata, il ripristino deve essere annullato.'));
});

test('backup procedure documents conflict, corrupt-save and owner acceptance limits',()=>{
 for(const marker of ['Conflitti tra dispositivi','salvataggio corrotto','revisione obsoleta','collaudo automatico non sostituisce la prova finale del titolare'])
  assert(backup.toLowerCase().includes(marker.toLowerCase()),'Missing backup safeguard: '+marker);
});

console.log('P0 backup/rollback contracts loaded');