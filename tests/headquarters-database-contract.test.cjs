// Prevent a later SQL redeployment from reopening the player RPC for RPG headquarters.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
let checked=0;
for(const file of files('supabase').filter(file=>file.endsWith('.sql'))){
 const sql=fs.readFileSync(file,'utf8');
 for(const match of sql.matchAll(/create\s+(?:or\s+replace\s+)?function\s+public\.reserve_berth\s*\([^]*?\bas\s+(\$\w*\$)([^]*?)\1/gi)){
  checked++;const body=match[2],guard=body.search(/if\s+p_marina_id\s*=\s*'rose'\s+then/i),write=body.search(/\binsert\s+into\s+public\.berth_bookings/i);
  assert(guard>=0&&write>guard,file+': Rose guard must precede any booking INSERT');
  assert(/raise\s+exception\s+using\s+errcode\s*=\s*'42501'[^]*?end if/i.test(body.slice(guard,write)),file+': Rose must reject explicitly');
  const allowed=body.match(/p_marina_id\s+not\s+in\s*\(([^)]*)\)/i);assert(allowed&&!allowed[1].includes("'rose'"),file+': player allowlist must exclude headquarters');
 }
}
assert(checked>0,'The reviewed player RPC guard must be present');
const readonly=fs.readFileSync('supabase/tests/reserve_berth_headquarters_readonly.sql','utf8');
assert(/begin\s+read\s+only/i.test(readonly)&&/set\s+local\s+role\s+authenticated/i.test(readonly),'Database regression must execute as a player without writes');
console.log('PASS: '+checked+' reserve_berth SQL definitions preserve RPG headquarters restriction; read-only runtime check retained');
