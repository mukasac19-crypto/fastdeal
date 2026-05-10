-- ============================================================
-- Admin role + row level security across the platform.
-- Run this in Supabase SQL editor. After it runs:
--   1. Create the storage bucket "vehicle-photos" (public) if missing.
--   2. willymayanja1@gmail.com becomes admin automatically once they sign up
--      (or right now, if they already exist).
--   3. To promote anyone else later:  select promote_to_admin('user@email');
-- ============================================================

-- ---- profiles table ----------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "Admins update any profile" on public.profiles;
create policy "Admins update any profile"
  on public.profiles for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ---- helper: auth_is_admin() -------------------------------
create or replace function public.auth_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function public.auth_is_admin() to anon, authenticated;

-- ---- new-user trigger: create profile + auto-promote -------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    case
      when lower(new.email) = lower('willymayanja1@gmail.com') then 'admin'
      else 'user'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- backfill profiles for existing users ------------------
insert into public.profiles (id, email, full_name, role)
select
  u.id,
  u.email,
  coalesce(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name'
  ),
  case
    when lower(u.email) = lower('willymayanja1@gmail.com') then 'admin'
    else 'user'
  end
from auth.users u
on conflict (id) do nothing;

-- Make sure the seed admin keeps admin even if their profile already existed.
update public.profiles
set role = 'admin'
where lower(email) = lower('willymayanja1@gmail.com');

-- ---- promote helper ----------------------------------------
create or replace function public.promote_to_admin(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid;
begin
  select id into target_id from auth.users where lower(email) = lower(target_email);
  if target_id is null then
    raise exception 'User with email % not found', target_email;
  end if;

  insert into public.profiles (id, email, role)
  values (target_id, target_email, 'admin')
  on conflict (id) do update set role = 'admin';
end;
$$;

create or replace function public.demote_from_admin(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid;
begin
  select id into target_id from auth.users where lower(email) = lower(target_email);
  if target_id is null then
    raise exception 'User with email % not found', target_email;
  end if;

  update public.profiles set role = 'user' where id = target_id;
end;
$$;

-- ============================================================
-- Row level security on data tables
-- ============================================================

-- ---- vehicles ----------------------------------------------
alter table public.vehicles enable row level security;

drop policy if exists "Public reads published vehicles" on public.vehicles;
create policy "Public reads published vehicles"
  on public.vehicles for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Admins read all vehicles" on public.vehicles;
create policy "Admins read all vehicles"
  on public.vehicles for select
  to authenticated
  using (public.auth_is_admin());

drop policy if exists "Admins insert vehicles" on public.vehicles;
create policy "Admins insert vehicles"
  on public.vehicles for insert
  to authenticated
  with check (public.auth_is_admin());

drop policy if exists "Admins update vehicles" on public.vehicles;
create policy "Admins update vehicles"
  on public.vehicles for update
  to authenticated
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

drop policy if exists "Admins delete vehicles" on public.vehicles;
create policy "Admins delete vehicles"
  on public.vehicles for delete
  to authenticated
  using (public.auth_is_admin());

-- ---- car_makes ---------------------------------------------
alter table public.car_makes enable row level security;

drop policy if exists "Public reads active makes" on public.car_makes;
create policy "Public reads active makes"
  on public.car_makes for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Admins read all makes" on public.car_makes;
create policy "Admins read all makes"
  on public.car_makes for select
  to authenticated
  using (public.auth_is_admin());

drop policy if exists "Admins write makes" on public.car_makes;
create policy "Admins write makes"
  on public.car_makes for all
  to authenticated
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

-- ---- seller_submissions ------------------------------------
alter table public.seller_submissions enable row level security;

drop policy if exists "Anyone submits seller form" on public.seller_submissions;
create policy "Anyone submits seller form"
  on public.seller_submissions for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins read seller submissions" on public.seller_submissions;
create policy "Admins read seller submissions"
  on public.seller_submissions for select
  to authenticated
  using (public.auth_is_admin());

drop policy if exists "Admins update seller submissions" on public.seller_submissions;
create policy "Admins update seller submissions"
  on public.seller_submissions for update
  to authenticated
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

drop policy if exists "Admins delete seller submissions" on public.seller_submissions;
create policy "Admins delete seller submissions"
  on public.seller_submissions for delete
  to authenticated
  using (public.auth_is_admin());

-- ---- leads -------------------------------------------------
alter table public.leads enable row level security;

drop policy if exists "Anyone submits lead form" on public.leads;
create policy "Anyone submits lead form"
  on public.leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins read leads" on public.leads;
create policy "Admins read leads"
  on public.leads for select
  to authenticated
  using (public.auth_is_admin());

drop policy if exists "Admins update leads" on public.leads;
create policy "Admins update leads"
  on public.leads for update
  to authenticated
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

drop policy if exists "Admins delete leads" on public.leads;
create policy "Admins delete leads"
  on public.leads for delete
  to authenticated
  using (public.auth_is_admin());

-- ============================================================
-- Storage: vehicle-photos bucket policies
-- ============================================================
-- (The bucket itself is created by you in the Storage dashboard,
--  marked as Public. These policies control which authenticated
--  users can write to it.)

insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public reads vehicle photos" on storage.objects;
create policy "Public reads vehicle photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'vehicle-photos');

drop policy if exists "Admins upload vehicle photos" on storage.objects;
create policy "Admins upload vehicle photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'vehicle-photos' and public.auth_is_admin()
  );

drop policy if exists "Admins update vehicle photos" on storage.objects;
create policy "Admins update vehicle photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vehicle-photos' and public.auth_is_admin())
  with check (bucket_id = 'vehicle-photos' and public.auth_is_admin());

drop policy if exists "Admins delete vehicle photos" on storage.objects;
create policy "Admins delete vehicle photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vehicle-photos' and public.auth_is_admin());
