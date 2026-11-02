'use strict';
const assert = require('node:assert/strict');
const {test} = require('node:test');
const catalog = require('../marine-catalogo-approvato.json');
const snapshot = require('../tests/fixtures/marina-docks-2026-11-02.json');
const {readSceneLayouts, auditDockMapping} = require('./audit-scene-berths.cjs');
const {resolveVisualBerth} = require('./resolve-visual-berth.cjs');
assert.equal(snapshot.ranges_verified_contiguous, true);
const rows = Object.entries(snapshot.berth_ends).flatMap(([marina_id, ends]) => ends.map((end,i) =>
  ({marina_id, dock_number:i+1, berth_start:i ? ends[i-1]+1 : 1, berth_end:end})));
const layouts = readSceneLayouts(catalog);
const report = auditDockMapping(catalog, rows, layouts);
const dock = (id,n) => rows.find(d => d.marina_id===id && d.dock_number===n);
const rose = layouts.find(x => x.sceneId==='rose');
test('Rose uses the original scene: 82 central and 1418 annex slots', () => {
  assert.equal(rose.sceneFile, 'isola-delle-rose-originale.html');
  assert.equal(rose.capacities.length,40);
  assert.equal(rose.capacities.slice(0,20).reduce((a,b)=>a+b,0),82);
  assert.equal(rose.capacities.slice(20).reduce((a,b)=>a+b,0),1418);
  assert.equal(rose.capacities[0],8);
  assert.equal(rose.capacities[39],88);
});
test('all 295 observed dock ranges are audited, not a sample', () => {
  assert.equal(report.checkedPiers,295);
  assert.equal(report.marinas.length,12);
  assert.equal(rows.reduce((n,d)=>n+d.berth_end-d.berth_start+1,0),11100);
  assert.equal(report.marinas.find(m=>m.sceneId==='rose').mismatches.length,40);
  assert.equal(report.marinas.find(m=>m.sceneId==='scarlino').mismatches.length,0);
  assert.equal(report.bookable,false);
});
test('reject every observed Rose dock, including previously false matches', () => {
  for(let n=1;n<=40;n++) assert.throws(()=>resolveVisualBerth(catalog,dock('rose',n),'rose',n,1),/capacities differ/);
});
test('reject former synthetic 38-slot Rose dock', () => {
  assert.throws(()=>resolveVisualBerth(catalog,{marina_id:'rose',dock_number:1,berth_start:1,berth_end:38},'rose',1,2),/capacities differ/);
});
test('mismatches rejected; every matching candidate remains non-bookable', () => {
  for(const m of report.marinas) for(const d of rows.filter(d=>d.marina_id===m.databaseId)){
    if(m.mismatches.some(x=>x.pier===d.dock_number)){
      assert.throws(()=>resolveVisualBerth(catalog,d,m.sceneId,d.dock_number,1),/capacities differ/);
    }else{
      const result=resolveVisualBerth(catalog,d,m.sceneId,d.dock_number,1);
      assert.equal(result.berth_number,d.berth_start);
      assert.equal(result.bookable,false);
      assert.equal(result.mapping_status,'numeric-candidate-only');
      assert.ok(Object.isFrozen(result));
    }
  }
});
test('index boundaries, database offset and marina aliases', () => {
  assert.equal(resolveVisualBerth(catalog,dock('scarlino',2),'scarlino',2,1).berth_number,39);
  assert.equal(resolveVisualBerth(catalog,dock('scarlino',2),'scarlino',2,38).berth_number,76);
  assert.equal(resolveVisualBerth(catalog,dock('porto_cervo',2),'portocervo',2,1).marina_id,'porto_cervo');
  assert.equal(resolveVisualBerth(catalog,dock('capo_orlando',2),'capodorlando',2,1).marina_id,'capo_orlando');
  for(const bad of [0,-1,39,1.5,'1',NaN]) assert.throws(()=>resolveVisualBerth(catalog,dock('scarlino',2),'scarlino',2,bad));
});
test('reject wrong marina/pier, duplicate IDs and out-of-catalog ranges', () => {
  assert.throws(()=>resolveVisualBerth(catalog,dock('scarlino',1),'rimini',1,1),/mismatch/);
  assert.throws(()=>resolveVisualBerth(catalog,dock('scarlino',1),'scarlino',2,1),/mismatch/);
  assert.throws(()=>resolveVisualBerth(catalog,{...dock('scarlino',1),berth_end:951},'scarlino',1,1),/Invalid dock range/);
  assert.throws(()=>resolveVisualBerth({...catalog,marinas:[...catalog.marinas,catalog.marinas[0]]},dock('rose',1),'rose',1,1),/duplicate/);
});
test('audit rejects incomplete, duplicate, unknown and non-contiguous data', () => {
  assert.throws(()=>auditDockMapping(catalog,rows.slice(1),layouts),/Incomplete/);
  assert.throws(()=>auditDockMapping(catalog,[...rows,rows[0]],layouts),/Duplicate/);
  assert.throws(()=>auditDockMapping(catalog,[{...rows[0],marina_id:'unknown'},...rows.slice(1)],layouts),/Invalid/);
  assert.throws(()=>auditDockMapping(catalog,[{...rows[0],berth_start:2},...rows.slice(1)],layouts),/Non-contiguous/);
  assert.throws(()=>auditDockMapping(catalog,[{...rows[0],berth_end:0},...rows.slice(1)],layouts),/Invalid/);
});
console.log('Snapshot 2026-11-02; numeric audit only, NO booking authorization.');
console.log(JSON.stringify({checkedPiers:report.checkedPiers,capacityMismatches:report.capacityMismatches,marinas:report.marinas.map(m=>({id:m.sceneId,mismatches:m.mismatches.length,piers:m.piers}))}));
