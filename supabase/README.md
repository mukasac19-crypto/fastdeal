# Supabase SQL Run Order

Run these files in this order when setting up a hosted Supabase project from the SQL editor:

1. `migrations/001_initial_schema.sql`
2. `migrations/002_car_makes.sql`
3. `seed.sql`

The seed file inserts cars into `public.vehicles`, so it will fail with `relation "public.vehicles" does not exist` if the first migration has not been run in that Supabase project.

After the schema exists, `seed.sql` is safe to run more than once. It uses fixed vehicle IDs and updates existing rows instead of creating duplicates.
