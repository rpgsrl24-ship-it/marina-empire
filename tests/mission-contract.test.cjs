// Marina Empire: controlli statici di regressione (non sostituiscono i test nel browser).
// Esecuzione: node tests/mission-contract.test.cjs
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const tests = [
  ['Missioni dipendono dal porto corrente', /function availableMissions\(\)\{const here=state\.port/.test(html)],
  ['Prima missione Rimini-Cervia', /INTRO_RIMINI_CERVIA/.test(html) && /dest:"cervia"/.test(html)],
  ['Esclusione destinazione uguale alla partenza', /ports\.filter\(p=>p\.id!==here\)/.test(html)],
  ['Missione precedente vincolata al porto', /m\.origin===state\.port&&m\.dest!==state\.port/.test(html)],
  ['Controllo carburante e riserva', /function missionBudget\(m\)/.test(html) && /fuel<required\+reserve/.test(html)],
  ['Blocco navigazione contemporanea', /state\.trip\)return \{ready:false/.test(html)],
  ['Identificatore viaggio persistente', /voyageSerial/.test(html) && /voyageId:state\.voyageSerial/.test(html)],
  ['Salvataggio locale esplicito e verificato', /const snapshot=JSON\.stringify\(state\)/.test(html) && /localStorage\.setItem\(KEY,snapshot\)/.test(html) && /localStorage\.getItem\(KEY\)!==snapshot/.test(html)],
  ['Diagnostica beta presente', /function betaDiagnostics\(\)/.test(html)],
  ['Portafoglio marine: ricavi e costi separati', /function marinaPortfolioSummary\(\)/.test(html) && /gross,costs,net:gross-costs/.test(html)],
  ['Costi operativi marina inclusi nel rendimento', /function fleetDailyIncome\(\)/.test(html) && /berthDailyNet\(id\)-marinaOperatingCosts\(id\)\.total/.test(html)],
  ['Rendite ormeggi limitate a 24 ore per ciclo', /function earnBerthRentals\(\)/.test(html) && /Math\.min\(24,Math\.floor\(Math\.max\(0,now-Number\(m\.berthLastReward\)\)\/3600000\)\)/.test(html)],
  ['Rendite marine limitate a sette giorni per ciclo', /function earnMarinaIncome\(\)/.test(html) && /Math\.min\(7,Math\.floor\(Math\.max\(0,now-m\.lastReward\)\/86400000\)\)/.test(html)],
];
let failures = 0;
for (const [label, ok] of tests) { console.log((ok ? 'PASS' : 'FAIL') + ' ' + label); if (!ok) failures++; }
console.log(tests.length - failures + '/' + tests.length + ' controlli statici superati');
assert.equal(failures, 0, 'Contratti statici del gioco non rispettati');
