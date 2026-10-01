alter table public.artworks
  add column shipping_length numeric,
  add column shipping_width numeric,
  add column shipping_height numeric,
  add column shipping_weight numeric,
  add column shipping_dimension_unit text not null default 'in',
  add column shipping_weight_unit text not null default 'lb';

alter table public.artworks
  add constraint artworks_shipping_dimensions_positive_check
    check (
      (shipping_length is null or shipping_length > 0)
      and (shipping_width is null or shipping_width > 0)
      and (shipping_height is null or shipping_height > 0)
      and (shipping_weight is null or shipping_weight > 0)
    ),
  add constraint artworks_shipping_package_complete_check
    check (
      (shipping_length is null and shipping_width is null and shipping_height is null and shipping_weight is null)
      or
      (shipping_length is not null and shipping_width is not null and shipping_height is not null and shipping_weight is not null)
    ),
  add constraint artworks_shipping_dimension_unit_check
    check (shipping_dimension_unit in ('in', 'cm')),
  add constraint artworks_shipping_weight_unit_check
    check (shipping_weight_unit in ('lb', 'kg'));

drop table if exists public.artwork_shipping_rates;

create table public.artwork_shipping_origins (
  artwork_id uuid primary key references public.artworks(id) on delete cascade,
  name text,
  company text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text,
  postal_code text,
  country text not null,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint artwork_shipping_origins_country_code_check check (country ~ '^[A-Z]{2}$')
);

alter table public.artwork_shipping_origins enable row level security;
revoke all on table public.artwork_shipping_origins from anon;
grant select, insert, update, delete on table public.artwork_shipping_origins to authenticated;
grant all on table public.artwork_shipping_origins to service_role;

create policy "Admins can read artwork shipping origins"
  on public.artwork_shipping_origins for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can insert artwork shipping origins"
  on public.artwork_shipping_origins for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update artwork shipping origins"
  on public.artwork_shipping_origins for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete artwork shipping origins"
  on public.artwork_shipping_origins for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
