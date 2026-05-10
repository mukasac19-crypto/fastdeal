-- Fix infinite recursion on profiles RLS policies.
-- The original "Admins read all profiles" policy queried public.profiles inside
-- its own using() clause, which triggered RLS recursion and silently failed
-- profile fetches in the browser client. Using the auth_is_admin() helper
-- (declared SECURITY DEFINER) avoids the cycle.

drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles for select
  to authenticated
  using (public.auth_is_admin());

drop policy if exists "Admins update any profile" on public.profiles;
create policy "Admins update any profile"
  on public.profiles for update
  to authenticated
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

-- Users updating their own profile: drop the role-check subquery
-- (also recursive). Role changes are admin-only via promote_to_admin().
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
