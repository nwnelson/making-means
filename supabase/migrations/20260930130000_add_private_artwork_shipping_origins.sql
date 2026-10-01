CREATE TABLE public.artwork_shipping_origins (
  artwork_id uuid PRIMARY KEY REFERENCES public.artworks(id) ON DELETE CASCADE,
  name text,
  company text,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text,
  postal_code text,
  country text NOT NULL,
  phone text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT artwork_shipping_origins_country_code_check
    CHECK (country ~ '^[A-Z]{2}$')
);

ALTER TABLE public.artwork_shipping_origins ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.artwork_shipping_origins FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.artwork_shipping_origins TO authenticated;
GRANT ALL ON TABLE public.artwork_shipping_origins TO service_role;

CREATE POLICY "Admins can read artwork shipping origins"
  ON public.artwork_shipping_origins
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert artwork shipping origins"
  ON public.artwork_shipping_origins
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update artwork shipping origins"
  ON public.artwork_shipping_origins
  FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete artwork shipping origins"
  ON public.artwork_shipping_origins
  FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
