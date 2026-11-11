'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const core=['mobile-home.html','missions-mobile.html','map-mobile.html','marina-mobile.html','fleet-mobile.html'];
const expected=['HOME','MAPPA','MISSIONI','FLOTTA','MARINA','MARKET'];

for(const p of core){
 const html=fs.readFileSync(p,'utf8');
 assert(!html.includes('🪙 MONETE'),p+' must not use MONETE for the game currency');
 const nav=(html.match(/<nav class="bottom">([\s\S]*?)<\/nav>/)||[])[1]||'';
 for(const label of expected)assert(nav.includes('>'+label+'</a>'),p+' bottom nav missing '+label);
 const positions=expected.map(label=>nav.indexOf('>'+label+'</a>'));
 assert.deepEqual([...positions].sort((a,b)=>a-b),positions,p+' bottom nav order must be canonical');
}

const home=fs.readFileSync('mobile-home.html','utf8');
assert(home.includes('🪙 CREDITI'),'Home must label game money as CREDITI');
assert(home.includes('RICERCA<br>& REFIT'),'Home action must match Research destination');
assert(home.includes('href="./crew-mobile.html"'),'Equipaggio must use its dedicated compatibility URL');
assert(home.includes('BASE RPG · ISOLA DELLE ROSE'),'Base RPG label must identify Isola delle Rose');
assert(home.includes('completed.includes("INTRO_RIMINI_CERVIA")'),'Home next-step logic must consider completed intro mission');

const direction=fs.readFileSync('direction-mobile.html','utf8');
assert(direction.includes('🪙 CREDITI'),'Direction HUD must use CREDITI');
assert(direction.includes('CREDITI DISPONIBILI'),'Direction economy must use CREDITI wording');
assert(!direction.includes('<span>MONETE</span>'),'Direction must not use MONETE for the same resource');

const market=fs.readFileSync('marketplace-mobile.html','utf8');
assert(market.includes('PREZZI REALI €'),'Marketplace must clearly label real-money prices');
assert(market.includes('Solo valuta di gioco · nessun pagamento reale'),'Marketplace must distinguish in-game credits');

console.log('PASS: core navigation, currency wording, Home labels and Marketplace money semantics are consistent.');
