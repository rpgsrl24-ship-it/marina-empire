'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const sql=fs.readFileSync('supabase/p0_least_privilege_and_rose_availability_guard.sql','utf8');

assert(sql.includes('revoke all on table public.player_profiles from anon;'));
assert(sql.includes('revoke all on table public.player_progress from anon;'));
assert(sql.includes('grant select, insert, update on table public.player_profiles to authenticated;'));
assert(sql.includes('grant select, insert, update on table public.player_progress to authenticated;'));
assert(sql.includes('grant select on table public.marina_catalog to anon, authenticated;'));
assert(sql.includes('grant select on table public.marina_docks to anon, authenticated;'));
assert(sql.includes('grant select on table public.marina_dock_unlocks to authenticated;'));
assert(sql.includes('grant select, insert, update on table public.me_chat_reports to authenticated;'));
assert(!sql.includes("p_marina_id in ('rose'"));
assert(sql.includes("p_marina_id in ('rimini','ancona','lignano','cervia','bari')"));
assert(sql.includes('revoke execute on function public.me_berth_availability(text,date) from public, anon;'));
assert(sql.includes('grant execute on function public.me_berth_availability(text,date) to authenticated, service_role;'));

console.log('PASS: least-privilege grants and Rose availability guard');
