-- Marina Empire: schema di preparazione. Non ancora connesso al gioco.
create table if not exists public.player_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 captain_name text not null check (char_length(captain_name) between 1 and 32),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.player_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 game_state jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.player_profiles enable row level security;
alter table public.player_progress enable row level security;
create policy "Players view own profile" on public.player_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "Players insert own profile" on public.player_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Players update own profile" on public.player_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Players read own progress" on public.player_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Players insert own progress" on public.player_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Players update own progress" on public.player_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- IMPORTANTE: per acquisti, valuta e multiplayer serve validazione server-side,
-- non consentire al client di modificare direttamente saldi autorevoli.
