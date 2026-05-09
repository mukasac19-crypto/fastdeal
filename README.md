# FastDeal Rwanda

A Next.js site for FastDeal Rwanda, a car-selling service that helps owners sell faster with valuation guidance, verification, professional marketing, buyer screening, negotiation support, and closing assistance.

## Getting Started

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` when you connect Supabase. The site no longer uses bundled mock vehicle data; live listings come from Supabase.

Set `NEXT_PUBLIC_FASTDEAL_WHATSAPP_NUMBER` to the business WhatsApp number in international format without `+`, for example `2507XXXXXXXX`, to activate WhatsApp contact links.

## Supabase Setup

Run the SQL migrations in `supabase/migrations/` inside your Supabase SQL editor or migration workflow. If you already ran `001_initial_schema.sql` before the make selector existed, also run `002_car_makes.sql`.

- `vehicles` for published car listings
- `car_makes` for seller make selection
- `seller_submissions` for the Sell My Car form
- `leads` for contact enquiries

Public users can read only published vehicles and submit forms. Admin reads and edits should use the Supabase dashboard or a future protected admin app.

## Seed Cars

The project includes `supabase/seed.sql` with realistic published FastDeal Rwanda cars. After running the migrations, load the seed data with the Supabase CLI:

```bash
supabase db reset
```

For a hosted Supabase project, open the Supabase SQL editor and run the contents of `supabase/seed.sql`. The seed is safe to run more than once because every car uses a fixed ID and updates on conflict.

## Routes

- `/` - FastDeal Rwanda home
- `/buy` - cars supported by FastDeal
- `/cars/[id]` - vehicle detail pages
- `/sell` - seller listing flow
- `/about` - company story and mission
- `/how-it-works` - selling process
- `/services` - service packages
- `/saved` - saved car shortlist
- `/auth/login` - Supabase Auth entry point
- `/contact` - support and partner contact

## API Routes

- `/api/listings`
- `/api/listings/[id]`
- `/api/car-makes`
- `/api/leads`
- `/api/seller-submissions`
