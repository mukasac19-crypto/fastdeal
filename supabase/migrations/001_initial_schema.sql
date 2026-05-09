create extension if not exists pgcrypto;

create type vehicle_status as enum ('draft', 'review', 'published', 'sold', 'archived');
create type lead_status as enum ('new', 'contacted', 'qualified', 'closed', 'archived');

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  status vehicle_status not null default 'draft',
  make text not null,
  model text not null,
  trim text,
  year integer not null check (year between 1950 and extract(year from now())::integer + 1),
  price integer not null check (price >= 0),
  mileage integer not null check (mileage >= 0),
  transmission text not null check (transmission in ('Automatic', 'Manual')),
  fuel text not null check (fuel in ('Petrol', 'Diesel', 'Hybrid', 'Electric')),
  body text not null check (body in ('SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van')),
  location text not null,
  listed_by text default 'FastDeal Rwanda',
  quality_score numeric(2,1) default 0,
  primary_image_url text,
  tags text[] default '{}',
  inspected boolean default false,
  featured boolean default false,
  price_signal text default 'New arrival' check (price_signal in ('Great price', 'Fair price', 'New arrival')),
  exterior_color text,
  interior_color text,
  engine text,
  drivetrain text default 'FWD' check (drivetrain in ('FWD', 'RWD', 'AWD', '4x4')),
  doors integer default 4 check (doors between 2 and 6),
  seats integer default 5 check (seats between 1 and 20),
  steering text default 'Left-hand drive' check (steering in ('Left-hand drive', 'Right-hand drive')),
  condition text default 'Good' check (condition in ('Excellent', 'Very good', 'Good')),
  availability text default 'Available now' check (availability in ('Available now', 'Inspection complete', 'Viewing by appointment')),
  registration_status text,
  import_status text,
  ownership_history text,
  service_history text,
  documents text[] default '{}',
  equipment text[] default '{}',
  safety text[] default '{}',
  inspection jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.car_makes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 1000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seller_submissions (
  id uuid primary key default gen_random_uuid(),
  status lead_status not null default 'new',
  seller_name text not null,
  phone text not null,
  email text,
  car_location text,
  make text not null,
  model text not null,
  trim text,
  year integer,
  body text,
  asking_price text,
  selling_speed text,
  mileage text,
  fuel text,
  transmission text,
  engine text,
  drivetrain text,
  steering text,
  exterior_color text,
  interior_color text,
  condition text,
  ownership_history text,
  service_history text,
  registration_status text,
  import_status text,
  known_issues text,
  notes text,
  features text,
  safety_features text,
  documents_available text,
  media_link text,
  support_level text,
  preferred_contact_method text,
  preferred_day text,
  preferred_time text,
  inspection_address text,
  source text default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  status lead_status not null default 'new',
  name text not null,
  contact text not null,
  message text not null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  source text default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger vehicles_set_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

create trigger car_makes_set_updated_at
before update on public.car_makes
for each row execute function public.set_updated_at();

create trigger seller_submissions_set_updated_at
before update on public.seller_submissions
for each row execute function public.set_updated_at();

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

alter table public.vehicles enable row level security;
alter table public.car_makes enable row level security;
alter table public.seller_submissions enable row level security;
alter table public.leads enable row level security;

create policy "Published vehicles are public"
on public.vehicles
for select
using (status = 'published');

create policy "Active car makes are public"
on public.car_makes
for select
using (is_active = true);

create policy "Anyone can submit seller details"
on public.seller_submissions
for insert
with check (true);

create policy "Anyone can submit leads"
on public.leads
for insert
with check (true);

create index vehicles_status_created_idx on public.vehicles (status, created_at desc);
create index vehicles_featured_created_idx on public.vehicles (featured desc, created_at desc);
create index car_makes_active_sort_idx on public.car_makes (is_active, sort_order, name);
create index seller_submissions_status_created_idx on public.seller_submissions (status, created_at desc);
create index leads_status_created_idx on public.leads (status, created_at desc);

insert into public.car_makes (name, sort_order) values
  ('Toyota', 10),
  ('Nissan', 20),
  ('Mercedes-Benz', 30),
  ('Volkswagen', 40),
  ('Hyundai', 50),
  ('Suzuki', 60),
  ('Honda', 70),
  ('Mazda', 80),
  ('Subaru', 90),
  ('Mitsubishi', 100),
  ('BMW', 110),
  ('Audi', 120),
  ('Land Rover', 130),
  ('Range Rover', 140),
  ('Lexus', 150),
  ('Ford', 160),
  ('Chevrolet', 170),
  ('Jeep', 180),
  ('Kia', 190),
  ('Isuzu', 200),
  ('Peugeot', 210),
  ('Renault', 220),
  ('Volvo', 230),
  ('Porsche', 240),
  ('Tesla', 250),
  ('BYD', 260),
  ('Changan', 270),
  ('Geely', 280),
  ('Haval', 290)
on conflict (name) do update set
  sort_order = excluded.sort_order,
  is_active = true;
