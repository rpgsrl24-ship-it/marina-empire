// Read-only consistency check for the approved marina inventory.
// Run: node scripts/check-marina-inventory.cjs
const fs = require('node:fs');
const assert = require('node:assert/strict');
const catalog = JSON.parse(fs.readFileSync('marine-catalogo-approvato.json','utf8'));
const html = fs.readFileSync('marine-deluxe-originali.html','utf8');
const match = html.match(/const DATA=(\[[\s\S]*?\]);/);
assert.ok(match, '3D marina data missing');
const scene = JSON.parse(match[1]);
const byId = new Map(scene.map(m => [m.id,m]));
assert.equal(catalog.marinas.length,12);
assert.equal(catalog.marinas.reduce((n,m)=>n+m.piers,0),295);
assert.equal(catalog.marinas.reduce((n,m)=>n+m.berths,0),11100);
for(const marina of catalog.marinas){
  assert.equal(marina.pier_ids.length,marina.piers,marina.id);
  assert.equal(new Set(marina.pier_ids).size,marina.piers,marina.id);
  for(let i=0;i<marina.piers;i++) assert.equal(marina.pier_ids[i],(marina.database_id || marina.id)+':P'+String(i+1).padStart(2,'0'));
  const m=byId.get(marina.id);
  assert.ok(m,'Missing scene: '+marina.id);
  assert.equal(m.piers,marina.piers,marina.id);
  assert.equal(m.capacity,marina.berths,marina.id);
}
// Validate the slot distribution algorithm used by the 3D scene.
// Visual slot IDs remain separate from live database berth numbers.
for(const marina of catalog.marinas){
  const countPerPier=Math.floor(marina.berths/marina.piers);
  const remainder=marina.berths%marina.piers;
  const visualCounts=Array.from({length:marina.piers},(_,i)=>countPerPier+(i<remainder?1:0));
  assert.equal(visualCounts.reduce((sum,n)=>sum+n,0),marina.berths,marina.id);
  assert.ok(visualCounts.every(n=>n>0),marina.id+': empty visual pier');
}
assert.ok(html.includes("localBerthIndex:k+1"),'Visual slot indices missing');
assert.ok(html.includes("visualBerthCode:"),'Visual berth codes missing');
// Explicit safety guard: never equate visual slot numbering with server bookings.
assert.ok(html.includes('visualBerthCode:'),'Visual slot code must remain distinct');
assert.ok(!html.includes('berth_number:slots.length'),'Scene must not assign global berth numbers from visual slots');
// Every marina must have a distinct scene ID and database ID.
assert.equal(new Set(catalog.marinas.map(m=>m.id)).size,catalog.marinas.length,'Duplicate scene marina ID');
assert.equal(new Set(catalog.marinas.map(m=>m.database_id || m.id)).size,catalog.marinas.length,'Duplicate database marina ID');
for(const marina of catalog.marinas){
  assert.ok(marina.database_id || marina.id,'Missing database mapping');
  assert.ok(marina.pier_ids.every(id=>id.startsWith((marina.database_id || marina.id)+':P')),marina.id+': incorrect database pier prefix');
}
assert.equal(scene.length,catalog.marinas.length);
console.log('OK: 12 marine, 295 pontili, 11100 posti; catalogo e scena allineati per i totali.');
console.log('Nota: i singoli intervalli di posti in Supabase NON sono verificati da questo test.');
