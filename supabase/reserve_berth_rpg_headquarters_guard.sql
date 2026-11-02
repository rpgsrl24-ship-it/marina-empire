-- Marina Empire P0, 2026-11-02. Apply only to the existing player booking RPC.
-- Applied on 2026-11-02 to project zrdetqvnjmqkfyajxjgp through the official
-- migration reserve_berth_rpg_headquarters_guard; READ ONLY regression passed.
-- The function signature, owner, EXECUTE grants, and non-Rose behavior are preserved.
-- No booking, player, wallet, or balance rows are read or changed by this DDL.
-- Live metadata audit: public.berth_bookings grants authenticated SELECT only;
-- its only RLS policy is owner SELECT. There is no direct player INSERT policy,
-- no INSERT grant, and no public.berth_reservations table to patch.
begin;
do $precondition$
begin
 if to_regprocedure('public.reserve_berth(text,integer,date)') is null then
  raise exception 'Expected existing reserve_berth RPC is absent; stop for review';
 end if;
end;
$precondition$;

create or replace function public.reserve_berth(
 p_marina_id text,
 p_berth_number integer,
 p_booking_date date
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare uid uuid := (select auth.uid()); new_id uuid;
begin
 -- This RPC is the player path. Headquarters management remains exclusively RPG Yacht.
 if p_marina_id = 'rose' then
  raise exception using errcode = '42501',
   message = 'Isola delle Rose: base operativa riservata a RPG Yacht';
 end if;
 if uid is null then raise exception 'Login richiesto'; end if;
 if p_marina_id not in ('rimini','ancona','lignano','cervia','bari')
    or p_berth_number not between 1 and 60
    or p_booking_date < current_date or p_booking_date > current_date + 30
 then raise exception 'Prenotazione non valida'; end if;
 insert into public.berth_bookings(user_id,marina_id,berth_number,booking_date)
 values(uid,p_marina_id,p_berth_number,p_booking_date) returning id into new_id;
 return new_id;
exception when unique_violation then raise exception 'Posto o giornata già prenotata';
end;
$function$;
commit;
