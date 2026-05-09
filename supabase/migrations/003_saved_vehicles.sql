-- Saved vehicles per user (favourites / shortlist)
create table if not exists public.saved_vehicles (
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, vehicle_id)
);

create index if not exists saved_vehicles_user_id_idx
  on public.saved_vehicles (user_id, created_at desc);

alter table public.saved_vehicles enable row level security;

drop policy if exists "Users read their own saves" on public.saved_vehicles;
create policy "Users read their own saves"
  on public.saved_vehicles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users insert their own saves" on public.saved_vehicles;
create policy "Users insert their own saves"
  on public.saved_vehicles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users delete their own saves" on public.saved_vehicles;
create policy "Users delete their own saves"
  on public.saved_vehicles
  for delete
  to authenticated
  using (auth.uid() = user_id);
