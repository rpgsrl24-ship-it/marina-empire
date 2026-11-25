
-- Opt-in, non-authoritative beta docking leaderboard. No economy writes.
create schema if not exists marina_docking_private;
revoke all on schema marina_docking_private from public, anon, authenticated;
grant usage on schema marina_docking_private to authenticated;
create table if not exists marina_docking_private.weekly_scores (
  user_id uuid not null references auth.users(id) on delete cascade,
  week_no bigint not null,
  alias text not null default ('Comandante-' || substr(replace(gen_random_uuid()::text,'-',''),1,12)),
  best_ms integer not null check (best_ms between 5000 and 3600000),
  clean_count integer not null check (clean_count between 1 and 3),
  perfect_count integer not null check (perfect_count between 0 and clean_count),
  updated_at timestamptz not null default now(),
  primary key(user_id,week_no)
);
alter table marina_docking_private.weekly_scores enable row level security;
revoke all on marina_docking_private.weekly_scores from public, anon, authenticated;
create index if not exists docking_beta_week_score_idx on marina_docking_private.weekly_scores(week_no,best_ms,perfect_count desc,clean_count desc);
create or replace function marina_docking_private.current_week() returns bigint
language sql stable security invoker set search_path='' as $$
 select floor((extract(epoch from now())+259200)/604800)::bigint
$$;
revoke all on function marina_docking_private.current_week() from public,anon,authenticated;
create or replace function marina_docking_private.submit_score(p_week bigint,p_best_ms integer,p_count integer,p_perfect integer)
returns void language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();
begin
 if uid is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then raise exception 'Authentication required' using errcode='42501'; end if;
 if p_week is distinct from marina_docking_private.current_week() or p_best_ms is null or p_best_ms not between 5000 and 3600000 or p_count is null or p_count not between 1 and 3 or p_perfect is null or p_perfect not between 0 and p_count then raise exception 'Invalid weekly score' using errcode='22023';end if;
 insert into marina_docking_private.weekly_scores as s(user_id,week_no,best_ms,clean_count,perfect_count)
 values(uid,p_week,p_best_ms,p_count,p_perfect)
 on conflict(user_id,week_no) do update set best_ms=least(s.best_ms,excluded.best_ms),clean_count=greatest(s.clean_count,excluded.clean_count),perfect_count=greatest(s.perfect_count,excluded.perfect_count),updated_at=now();
end
$$;
create or replace function marina_docking_private.top_scores()
returns table(rank_position bigint,alias text,best_ms integer,clean_count integer,perfect_count integer,is_me boolean)
language plpgsql stable security definer set search_path='' as $$
declare uid uuid:=auth.uid();
begin
 if uid is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then raise exception 'Authentication required' using errcode='42501'; end if;
 return query select row_number() over(order by s.best_ms,s.perfect_count desc,s.clean_count desc,s.alias),s.alias,s.best_ms,s.clean_count,s.perfect_count,s.user_id=uid
 from marina_docking_private.weekly_scores s where s.week_no=marina_docking_private.current_week()
 order by s.best_ms,s.perfect_count desc,s.clean_count desc,s.alias limit 25;
end
$$;
create or replace function marina_docking_private.remove_score()
returns void language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();
begin
 if uid is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then raise exception 'Authentication required' using errcode='42501';end if;
 delete from marina_docking_private.weekly_scores where user_id=uid;
end
$$;
revoke all on function marina_docking_private.submit_score(bigint,integer,integer,integer),marina_docking_private.top_scores(),marina_docking_private.remove_score() from public,anon,authenticated;
grant execute on function marina_docking_private.submit_score(bigint,integer,integer,integer),marina_docking_private.top_scores(),marina_docking_private.remove_score() to authenticated;
create or replace function public.me_docking_beta_submit(p_week bigint,p_best_ms integer,p_count integer,p_perfect integer)
returns void language sql security invoker set search_path='' as $$select marina_docking_private.submit_score(p_week,p_best_ms,p_count,p_perfect)$$;
create or replace function public.me_docking_beta_top()
returns table(rank_position bigint,alias text,best_ms integer,clean_count integer,perfect_count integer,is_me boolean)
language sql stable security invoker set search_path='' as $$select * from marina_docking_private.top_scores()$$;
create or replace function public.me_docking_beta_remove()
returns void language sql security invoker set search_path='' as $$select marina_docking_private.remove_score()$$;
revoke all on function public.me_docking_beta_submit(bigint,integer,integer,integer),public.me_docking_beta_top(),public.me_docking_beta_remove() from public,anon,authenticated;
grant execute on function public.me_docking_beta_submit(bigint,integer,integer,integer),public.me_docking_beta_top(),public.me_docking_beta_remove() to authenticated;
