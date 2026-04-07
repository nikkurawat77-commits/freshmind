-- FreshMind production schema
-- Run this in Supabase SQL Editor after enabling Email auth.

create extension if not exists pgcrypto;

create table if not exists public.workspace_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  team_name text not null default 'FreshMind Studio',
  plan text not null default 'Growth',
  seats integer not null default 5 check (seats > 0),
  ai_credits_used integer not null default 1840 check (ai_credits_used >= 0),
  ai_credits_limit integer not null default 5000 check (ai_credits_limit >= 0),
  automation_runs integer not null default 18 check (automation_runs >= 0),
  trial_ends date not null default current_date + interval '30 days',
  monthly_goal integer not null default 250 check (monthly_goal >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_workspace_profiles_updated_at on public.workspace_profiles;

create trigger set_workspace_profiles_updated_at
before update on public.workspace_profiles
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.workspace_profiles enable row level security;

drop policy if exists "workspace_profiles_select_own" on public.workspace_profiles;
create policy "workspace_profiles_select_own"
on public.workspace_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "workspace_profiles_insert_own" on public.workspace_profiles;
create policy "workspace_profiles_insert_own"
on public.workspace_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "workspace_profiles_update_own" on public.workspace_profiles;
create policy "workspace_profiles_update_own"
on public.workspace_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "workspace_profiles_delete_own" on public.workspace_profiles;
create policy "workspace_profiles_delete_own"
on public.workspace_profiles
for delete
to authenticated
using (auth.uid() = user_id);

comment on table public.workspace_profiles is 'FreshMind workspace settings and SaaS account state per user.';
