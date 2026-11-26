-- Applied constraint expansion, existing RLS unchanged.
alter table public.me_game_events drop constraint me_game_events_event_type_check;
alter table public.me_game_events add constraint me_game_events_event_type_check check(event_type in ('page_view','play_start','mission_complete','heartbeat','mission_selected','mission_started','navigation_reached','docking_reached','mission_start_failed','registration_opened','registration_submitted','account_verified'));
