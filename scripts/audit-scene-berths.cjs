'use strict';
// Numeric audit only. Does not authorize bookings or change scene geometry.
const fs = require('node:fs');
const path = require('node:path');
function check(ok, message) { if (!ok) throw Error(message); }
const positive = n => Number.isSafeInteger(n) && n > 0;
function readSceneLayouts(catalog, root = path.resolve(__dirname, '..')) {
  check(Array.isArray(catalog?.marinas), 'Missing approved catalog');
  const deluxe = fs.readFileSync(path.join(root, 'marine-deluxe-originali.html'), 'utf8');
  const rose = fs.readFileSync(path.join(root, 'isola-delle-rose-originale.html'), 'utf8');
  const data = deluxe.match(/const DATA=(\[[\s\S]*?\]);/);
  check(data, 'Missing Deluxe scene DATA');
  const entries = JSON.parse(data[1]);
  const compact = deluxe.replace(/\s+/g, '');
  check(compact.includes('perPier=Math.floor(max/p),remainder=max%p;') &&
    compact.includes('count=perPier+(i<remainder?1:0)'), 'Unsupported Deluxe slot generator');
  const specs = rose.match(/const specs=\[([\s\S]*?)\];const groups=/);
  check(specs, 'Missing original Rose specs');
  const lengths = Array.from(specs[1].matchAll(/\blen\s*:\s*(\d+(?:\.\d+)?)/g), m => Number(m[1]));
  const rc = rose.replace(/\s+/g, '');
  check(lengths.length === 20 &&
    rc.includes('constpairs=Math.max(1,Math.floor((p.len-14)/14))') &&
    rc.includes('for(leti=0;i<20;i++){constx=345+i*33.7,pairs=i===19?44:35,len=14*pairs+14;') &&
    rc.includes('hit.userData.pier=i+20;'), 'Unsupported original Rose slot generator');
  const roseCounts = lengths.map(n => 2 * Math.max(1, Math.floor((n - 14) / 14)))
    .concat(Array.from({length:20}, (_, i) => 2 * (i === 19 ? 44 : 35)));
  const sceneIds = new Set(), databaseIds = new Set();
  return catalog.marinas.map(m => {
    const db = m.database_id || m.id;
    check(typeof m.id === 'string' && typeof db === 'string' && positive(m.piers) && positive(m.berths), 'Invalid catalog marina');
    check(!sceneIds.has(m.id) && !databaseIds.has(db), 'Duplicate catalog marina');
    sceneIds.add(m.id); databaseIds.add(db);
    const source = String(m.scene).split('?')[0];
    let counts;
    if (m.id === 'rose') {
      check(source === 'isola-delle-rose-originale.html', 'Rose must use its original scene');
      counts = roseCounts;
    } else {
      check(source === 'marine-deluxe-originali.html', 'Unsupported scene file');
      const matching = entries.filter(x => x.id === (m.scene_id || m.id));
      check(matching.length === 1, 'Missing or duplicate scene marina');
      const d = matching[0];
      check(d.piers === m.piers && d.capacity === m.berths, 'Scene/catalog totals differ');
      counts = Array.from({length:d.piers}, (_, i) => Math.floor(d.capacity / d.piers) + (i < d.capacity % d.piers ? 1 : 0));
    }
    check(counts.length === m.piers && counts.every(positive) && counts.reduce((a,b)=>a+b,0) === m.berths, 'Invalid visual pier inventory');
    return Object.freeze({sceneId:m.id, databaseId:db, sceneFile:source, capacities:Object.freeze([...counts]), bookable:false});
  });
}
function auditDockMapping(catalog, rows, layouts) {
  check(Array.isArray(catalog?.marinas) && Array.isArray(rows) && Array.isArray(layouts), 'Missing inventory data');
  check(layouts.length === catalog.marinas.length, 'Incomplete scene inventory');
  const allowed = new Set(catalog.marinas.map(m => m.database_id || m.id));
  check(allowed.size === catalog.marinas.length, 'Duplicate catalog marina');
  const seen = new Set();
  for (const d of rows) {
    check(d && allowed.has(d.marina_id) && [d.dock_number,d.berth_start,d.berth_end].every(positive) && d.berth_end >= d.berth_start, 'Invalid database dock');
    const key = d.marina_id + ':' + d.dock_number;
    check(!seen.has(key), 'Duplicate database dock'); seen.add(key);
  }
  const marinas = catalog.marinas.map(m => {
    const db = m.database_id || m.id;
    const found = layouts.filter(l => l.sceneId === m.id && l.databaseId === db);
    check(found.length === 1 && found[0].capacities.length === m.piers, 'Missing visual layout');
    const layout = found[0];
    check(layout.capacities.every(positive) && layout.capacities.reduce((a,b)=>a+b,0) === m.berths, 'Invalid layout totals');
    const docks = rows.filter(d => d.marina_id === db).sort((a,b)=>a.dock_number-b.dock_number);
    check(docks.length === m.piers, 'Incomplete database marina');
    let last = 0;
    const mismatches = [];
    docks.forEach((d,i) => {
      check(d.dock_number === i+1 && d.berth_start === last+1, 'Non-contiguous dock ranges');
      last = d.berth_end;
      const actual = d.berth_end-d.berth_start+1;
      if (actual !== layout.capacities[i]) mismatches.push({pier:i+1, visual:layout.capacities[i], database:actual});
    });
    check(last === m.berths, 'Database/catalog totals differ');
    return {sceneId:m.id, databaseId:db, piers:docks.length, capacityMatches:docks.length-mismatches.length, mismatches, bookable:false};
  });
  return {status:'numeric-audit-only', checkedPiers:rows.length, capacityMismatches:marinas.reduce((n,m)=>n+m.mismatches.length,0), marinas, bookable:false};
}
module.exports = {readSceneLayouts, auditDockMapping};
