-- Marina Empire: prenotazioni ormeggi, da applicare in Supabase SQL Editor.
-- PostgreSQL exclusion constraint prevents overlapping confirmed reservations.
create extension if not exists btree_gist;
create table if not exists public.marinas (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 created_at timestamptz not null default now()
);
create table if not exists public.berths (
 id uuid primary key default gen_random_uuid(),
 marina_id uuid not null references public.marinas(id) on delete cascade,
 berth_code text not null,
 max_length_m numeric(6,2) not null check (max_length_m > 0),
 unique (marina_id, berth_code)
);
create table if not exists public.berth_reservations (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 berth_id uuid not null references public.berths(id),
 arrival_date date not null,
 departure_date date not null,
 status text not null default 'confirmed' check (status in ('confirmed','cancelled','completed')),
 created_at timestamptz not null default now(),
 constraint valid_stay check (departure_date > arrival_date and departure_date <= arrival_date + 90)
);
alter table public.berth_reservations
 add constraint no_overlapping_confirmed_bookings
 exclude using gist (
   berth_id with =,
   daterange(arrival_date, departure_date, '[)') with &&
 ) where (status = 'confirmed');
create index if not exists berth_reservations_user_idx on public.berth_reservations(user_id);
alter table public.marinas enable row level security;
alter table public.berths enable row level security;
alter table public.berth_reservations enable row level security;
create policy "Authenticated users view marinas" on public.marinas for select to authenticated using (true);
create policy "Authenticated users view berths" on public.berths for select to authenticated using (true);
create policy "Players view own reservations" on public.berth_reservations for select to authenticated using ((select auth.uid()) = user_id);
-- No client INSERT/UPDATE/DELETE policies: reservations must be created and charged
-- atomically by a trusted server-side function after ownership, pricing and balance checks.
