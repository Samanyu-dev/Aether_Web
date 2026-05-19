-- Aether Beta Core Schema
-- Run in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.traces (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  event_count int not null default 0,
  max_confidence numeric,
  is_public boolean not null default false,
  duration_ms int
);

create table if not exists public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code text not null unique,
  active boolean not null default true,
  max_uses int,
  used_count int not null default 0,
  tier text not null default 'free'
);

create table if not exists public.waitlist_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  source text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.usage_snapshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  traces_synced int not null default 0,
  events_processed int not null default 0,
  storage_mb numeric not null default 0
);

alter table public.traces enable row level security;
alter table public.usage_snapshots enable row level security;
alter table public.waitlist_requests enable row level security;

create policy if not exists "users_can_manage_own_traces"
on public.traces
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy if not exists "public_traces_are_readable"
on public.traces
for select
using (is_public = true);

create policy if not exists "users_can_read_own_usage"
on public.usage_snapshots
for select
using (auth.uid() = user_id);

create policy if not exists "waitlist_insert_open"
on public.waitlist_requests
for insert
to anon, authenticated
with check (true);
