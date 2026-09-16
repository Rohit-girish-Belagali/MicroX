-- ===================== Ocean Guardian — cloud saves =====================
-- Run this once in the Supabase SQL Editor.
--
-- One row per player. Players are identified by an ANONYMOUS auth session,
-- so all they ever type is a display name -- no email, no password.
--
-- REQUIRED: turn anonymous sign-ins on first, or the game stays offline:
--   Dashboard -> Authentication -> Sign In / Providers -> Anonymous sign-ins
--
-- Row-level security limits every player to their own row, which is what
-- makes it safe to ship the publishable key in the browser.

create table if not exists public.player_saves (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  display_name   text,

  -- progress
  best_score     integer not null default 0,
  best_meters    integer not null default 0,
  runs_played    integer not null default 0,
  total_meters   bigint  not null default 0,
  total_score    bigint  not null default 0,
  tokens_total   integer not null default 0,

  -- learning: which modules were completed and which species were rescued
  discoveries    text[]  not null default '{}',
  species        text[]  not null default '{}',
  quiz_correct   integer not null default 0,
  quiz_total     integer not null default 0,

  -- last character used, so the select screen follows the player across devices
  character_id   text,

  updated_at     timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

alter table public.player_saves enable row level security;

-- A player may only touch their own row.
drop policy if exists "read own save"   on public.player_saves;
drop policy if exists "insert own save" on public.player_saves;
drop policy if exists "update own save" on public.player_saves;

create policy "read own save"   on public.player_saves
  for select using (auth.uid() = user_id);

create policy "insert own save" on public.player_saves
  for insert with check (auth.uid() = user_id);

create policy "update own save" on public.player_saves
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Keep updated_at honest.
create or replace function public.touch_player_save()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists player_saves_touch on public.player_saves;
create trigger player_saves_touch
  before update on public.player_saves
  for each row execute function public.touch_player_save();

-- Give every new account an empty save row automatically.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Anonymous users have no email, so display_name starts null and the game
  -- fills it in as soon as the player types one.
  insert into public.player_saves (user_id, display_name)
  values (new.id, nullif(new.raw_user_meta_data->>'display_name', ''))
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Optional leaderboard: display names and scores only.
-- NOTE: security_invoker means RLS still applies, so a player only sees their
-- own row here. To make it a real shared leaderboard, add a read-all policy:
--   create policy "leaderboard is public" on public.player_saves
--     for select using (true);
-- Only do that if you are happy for display names and scores to be readable
-- by anyone holding the publishable key.
create or replace view public.leaderboard
with (security_invoker = on) as
  select display_name, best_score, best_meters, cardinality(species) as species_found
  from public.player_saves
  where best_score > 0 and display_name is not null
  order by best_score desc
  limit 100;
