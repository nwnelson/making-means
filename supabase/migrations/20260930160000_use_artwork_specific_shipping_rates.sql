create table public.artwork_shipping_rates (
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  continent text not null check (continent in ('africa', 'asia', 'europe', 'north_america', 'oceania', 'south_america')),
  amount_cents integer check (amount_cents is null or amount_cents >= 0),
  updated_at timestamptz not null default now(),
  primary key (artwork_id, continent)
);

insert into public.artwork_shipping_rates (artwork_id, continent)
select artworks.id, continents.continent
from public.artworks
cross join unnest(array['africa', 'asia', 'europe', 'north_america', 'oceania', 'south_america']) as continents(continent);

update public.artwork_shipping_rates as artwork_rates
set amount_cents = shared_rates.amount_cents,
    updated_at = now()
from public.artworks as artworks
join public.shipping_rates as shared_rates
  on shared_rates.shipping_type = artworks.shipping_type
where artwork_rates.artwork_id = artworks.id
  and artwork_rates.continent = shared_rates.continent
  and shared_rates.amount_cents is not null;

drop table if exists public.shipping_rates;

alter table public.artworks
  drop constraint if exists artworks_shipping_type_check,
  drop column if exists shipping_type;

alter table public.artwork_shipping_rates enable row level security;
revoke all on table public.artwork_shipping_rates from public, anon, authenticated;
grant select, insert, update, delete on table public.artwork_shipping_rates to service_role;
