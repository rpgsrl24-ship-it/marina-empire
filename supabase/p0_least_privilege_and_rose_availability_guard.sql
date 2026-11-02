-- Marina Empire P0 hardening, applied to Supabase on 2026-11-02.
-- Migration: 20261102110124_p0_least_privilege_and_rose_availability_guard
-- Goal: least privilege for Data API grants and no player-facing Rose availability.

revoke all on table public.player_profiles from anon;
revoke all on table public.player_progress from anon;

revoke all on table public.player_profiles from authenticated;
revoke all on table public.player_progress from authenticated;
grant select, insert, update on table public.player_profiles to authenticated;
grant select, insert, update on table public.player_progress to authenticated;

revoke all on table public.marina_catalog from anon, authenticated;
grant select on table public.marina_catalog to anon, authenticated;

revoke all on table public.marina_docks from anon, authenticated;
grant select on table public.marina_docks to anon, authenticated;

revoke all on table public.marina_dock_unlocks from anon, authenticated;
grant select on table public.marina_dock_unlocks to authenticated;

revoke all on table public.me_chat_reports from authenticated;
grant select, insert, update on table public.me_chat_reports to authenticated;

create or replace function public.me_berth_availability(
 p_marina_id text,
 p_booking_date date
)
returns table(berth_number integer)
language sql
security definer
set search_path = ''
as $function$
 select b.berth_number
 from public.berth_bookings b
 where b.marina_id=p_marina_id
   and b.booking_date=p_booking_date
   and b.status='confirmed'
   and (select auth.uid()) is not null
   and p_booking_date between current_date and current_date+30
   and p_marina_id in ('rimini','ancona','lignano','cervia','bari')
 order by b.berth_number
$function$;

revoke execute on function public.me_berth_availability(text,date) from public, anon;
grant execute on function public.me_berth_availability(text,date) to authenticated, service_role;
