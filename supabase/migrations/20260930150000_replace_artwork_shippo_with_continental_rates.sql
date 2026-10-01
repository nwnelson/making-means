alter table public.artworks
  add column shipping_type text;

alter table public.artworks
  add constraint artworks_shipping_type_check
  check (shipping_type is null or shipping_type in ('small', 'large'));

alter table public.artworks
  drop column if exists shipping_length,
  drop column if exists shipping_width,
  drop column if exists shipping_height,
  drop column if exists shipping_weight,
  drop column if exists shipping_dimension_unit,
  drop column if exists shipping_weight_unit;

drop table if exists public.artwork_shipping_origins;

create table public.shipping_rates (
  shipping_type text not null check (shipping_type in ('small', 'large')),
  continent text not null check (continent in ('africa', 'asia', 'europe', 'north_america', 'oceania', 'south_america')),
  amount_cents integer check (amount_cents is null or amount_cents >= 0),
  updated_at timestamptz not null default now(),
  primary key (shipping_type, continent)
);

insert into public.shipping_rates (shipping_type, continent)
select artwork_type, destination_continent
from unnest(array['small', 'large']) as types(artwork_type)
cross join unnest(array['africa', 'asia', 'europe', 'north_america', 'oceania', 'south_america']) as continents(destination_continent);

alter table public.shipping_rates enable row level security;
revoke all on table public.shipping_rates from public, anon, authenticated;
grant select, insert, update, delete on table public.shipping_rates to service_role;
