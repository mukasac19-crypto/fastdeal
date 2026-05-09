create table if not exists public.car_makes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 1000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'car_makes_set_updated_at'
  ) then
    create trigger car_makes_set_updated_at
    before update on public.car_makes
    for each row execute function public.set_updated_at();
  end if;
end;
$$;

alter table public.car_makes enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'car_makes'
      and policyname = 'Active car makes are public'
  ) then
    create policy "Active car makes are public"
    on public.car_makes
    for select
    using (is_active = true);
  end if;
end;
$$;

create index if not exists car_makes_active_sort_idx
on public.car_makes (is_active, sort_order, name);

insert into public.car_makes (name, sort_order) values
  -- Japanese (10-90)
  ('Toyota', 10),
  ('Nissan', 20),
  ('Honda', 30),
  ('Mazda', 40),
  ('Subaru', 50),
  ('Mitsubishi', 60),
  ('Suzuki', 70),
  ('Daihatsu', 80),
  ('Lexus', 90),
  ('Infiniti', 100),
  ('Acura', 110),

  -- Korean (200-220)
  ('Hyundai', 200),
  ('Kia', 210),
  ('Genesis', 220),
  ('SsangYong', 230),

  -- German (300-380)
  ('Mercedes-Benz', 300),
  ('BMW', 310),
  ('Audi', 320),
  ('Volkswagen', 330),
  ('Porsche', 340),
  ('Opel', 350),
  ('Mini', 360),
  ('Smart', 370),
  ('Maybach', 380),

  -- British (400-470)
  ('Land Rover', 400),
  ('Range Rover', 410),
  ('Jaguar', 420),
  ('Bentley', 430),
  ('Rolls-Royce', 440),
  ('Aston Martin', 450),
  ('McLaren', 460),
  ('Lotus', 470),

  -- Other European (500-590)
  ('Volvo', 500),
  ('Peugeot', 510),
  ('Renault', 520),
  ('Citroen', 530),
  ('Fiat', 540),
  ('Alfa Romeo', 550),
  ('Ferrari', 560),
  ('Lamborghini', 570),
  ('Maserati', 580),
  ('Skoda', 590),
  ('Seat', 600),
  ('Dacia', 610),
  ('Cupra', 620),

  -- American (700-790)
  ('Ford', 700),
  ('Chevrolet', 710),
  ('Jeep', 720),
  ('Tesla', 730),
  ('Cadillac', 740),
  ('GMC', 750),
  ('Dodge', 760),
  ('Chrysler', 770),
  ('Ram', 780),
  ('Lincoln', 790),
  ('Buick', 800),
  ('Rivian', 810),
  ('Lucid', 820),

  -- Chinese (900-1090)
  ('BYD', 900),
  ('Changan', 910),
  ('Geely', 920),
  ('Haval', 930),
  ('Great Wall', 940),
  ('Chery', 950),
  ('GAC', 960),
  ('MG', 970),
  ('Dongfeng', 980),
  ('FAW', 990),
  ('JAC', 1000),
  ('Lifan', 1010),
  ('BAIC', 1020),
  ('Foton', 1030),
  ('Zotye', 1040),
  ('Brilliance', 1050),
  ('Hongqi', 1060),
  ('Nio', 1070),
  ('Xpeng', 1080),
  ('Li Auto', 1090),
  ('Wuling', 1100),
  ('Maxus', 1110),
  ('Roewe', 1120),

  -- Other Asian (1200+)
  ('Proton', 1200),
  ('Perodua', 1210),
  ('Tata', 1220),
  ('Mahindra', 1230),

  -- Truck/Commercial (1300+)
  ('Isuzu', 1300),
  ('Hino', 1310),
  ('Tata Motors', 1320),
  ('UD Trucks', 1330),
  ('Scania', 1340),
  ('MAN', 1350),
  ('Iveco', 1360)
on conflict (name) do update set
  sort_order = excluded.sort_order,
  is_active = true;