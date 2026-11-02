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
  for(let i=0;i<marina.piers;i++) assert.equal(marina.pier_ids[i],marina.id+':P'+String(i+1).padStart(2,'0'));
  const m=byId.get(marina.id);
  assert.ok(m,'Missing scene: '+marina.id);
  assert.equal(m.piers,marina.piers,marina.id);
  assert.equal(m.capacity,marina.berths,marina.id);
}
assert.equal(scene.length,catalog.marinas.length);
console.log('OK: 12 marine, 295 pontili, 11100 posti; catalogo e scena allineati per i totali.');
console.log('Nota: i singoli intervalli di posti in Supabase NON sono verificati da questo test.');
