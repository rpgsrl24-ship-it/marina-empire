# Marina Empire — authenticated activity rollout (proposal, NOT deployed)

## Existing state (2026-11-01)
- `me_game_events`: anonymous browser/session analytics; **do not attach account identifiers to this public-write table**.
- `player_profiles` and `player_progress`: authenticated accounts and latest cloud save, respectively. Last-save dates are not DAU/MAU.
- Direzione must not expose other players' identities to ordinary accounts.

## Implementation sequence
1. Review Supabase changelog, Data API exposure, existing RLS policies, and admin membership policy. Verify the actual client auth lifecycle.
2. Create a **separate** `public.me_authenticated_activity` table with `user_id uuid not null references auth.users(id) on delete cascade`, `event_type text not null check (event_type in ('play_start','mission_complete'))`, `occurred_at timestamptz not null default now()`, and `id bigint generated always as identity primary key`. Add indexes on `(occurred_at desc,user_id)` and `(user_id,occurred_at desc)`.
3. Enable RLS before any client grants. Allow authenticated inserts only with `user_id = (select auth.uid())` and restrict event types via CHECK. Never trust user-supplied admin flags, email, or JWT user metadata. Consider a server-owned timestamp and rate limiting; client-generated activity remains an **approximation**, not fraud-proof.
4. Restrict SELECT to the event owner and verified admin accounts; verify that the admin predicate cannot be forged and cannot be self-granted. Do not grant anonymous reads or writes. Review existing `me_admin_users` policies before writing the admin SELECT policy.
5. After a confirmed login, use the authenticated Supabase client to record `play_start` and `mission_complete` at actual game lifecycle boundaries, not on every render or idle heartbeat. Handle network failures without interrupting gameplay. Avoid duplicate mission-start events.
6. In Direzione, count distinct `user_id` over Rome-local calendar day, rolling 7 days, and rolling 30 days; explicitly label the last two as rolling windows. Use an admin-authorized server-side aggregate for scale; never ship all players' event rows to public clients.
7. Verify with two ordinary users and one administrator: no cross-user SELECT, no forged user_id INSERT, no anonymous INSERT, admin sees aggregates, no duplicate event on refresh, game and missions still work.
8. Run database security advisors, smoke tests, mission regression and GitHub Pages deployment; only then label the metrics DAU/WAU/MAU.

## Privacy and analytics
Collect only minimal user ID, event kind and server timestamp. Set a retention policy before activation. Never put service-role secrets in GitHub Pages. Do not join historical anonymous visitor IDs to registered accounts without a separate privacy review.

## Release gate
This document is **planning only**. No schema changes, RLS policies, authenticated event writes, or certified DAU/MAU are activated by this commit.
