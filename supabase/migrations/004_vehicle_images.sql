-- Multi-image support for vehicle listings.
-- image_urls is the ordered list shown in the gallery.
-- index 0 is treated as the hero / card thumbnail.

alter table public.vehicles
  add column if not exists image_urls text[] not null default '{}';

-- Backfill: existing rows that already have a primary_image_url get
-- it copied into image_urls so detail pages do not regress.
update public.vehicles
set image_urls = array[primary_image_url]
where coalesce(array_length(image_urls, 1), 0) = 0
  and primary_image_url is not null
  and primary_image_url <> '';

-- Convenience index in case we ever query by image presence.
create index if not exists vehicles_has_images_idx
  on public.vehicles ((coalesce(array_length(image_urls, 1), 0)));
