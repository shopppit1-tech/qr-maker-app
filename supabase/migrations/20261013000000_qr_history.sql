-- Per-account QR history. Every authenticated account can access only its own rows.
create table if not exists public.qr_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  content text not null check (char_length(content) <= 10000),
  type text not null check (type in ('url', 'text', 'wifi', 'email', 'contact', 'other')),
  created_at timestamptz not null default now()
);

create index if not exists qr_history_user_created_at_idx
  on public.qr_history (user_id, created_at desc);

alter table public.qr_history enable row level security;

-- Recreate only this application's named policies so the migration is repeatable.
drop policy if exists qr_history_select_own on public.qr_history;
create policy qr_history_select_own
  on public.qr_history for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists qr_history_insert_own on public.qr_history;
create policy qr_history_insert_own
  on public.qr_history for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists qr_history_delete_own on public.qr_history;
create policy qr_history_delete_own
  on public.qr_history for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.qr_history from anon, public;
grant select, insert, delete on table public.qr_history to authenticated;
