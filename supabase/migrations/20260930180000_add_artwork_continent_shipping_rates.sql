DROP TABLE IF EXISTS public.artwork_shipping_rates;
DROP TABLE IF EXISTS public.shipping_rates;
DROP TABLE IF EXISTS public.artwork_shipping_origins;

ALTER TABLE public.artworks
  DROP COLUMN IF EXISTS shipping_length,
  DROP COLUMN IF EXISTS shipping_width,
  DROP COLUMN IF EXISTS shipping_height,
  DROP COLUMN IF EXISTS shipping_weight,
  DROP COLUMN IF EXISTS shipping_dimension_unit,
  DROP COLUMN IF EXISTS shipping_weight_unit;

CREATE TABLE public.shipping_rates (
  artwork_id uuid NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
  continent text NOT NULL CHECK (continent IN (
    'africa', 'asia', 'europe',
    'north_america', 'oceania', 'south_america'
  )),
  amount_cents integer CHECK (amount_cents IS NULL OR amount_cents >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (artwork_id, continent)
);

INSERT INTO public.shipping_rates (artwork_id, continent)
SELECT artworks.id, continents.continent
FROM public.artworks
CROSS JOIN unnest(ARRAY[
  'africa', 'asia', 'europe',
  'north_america', 'oceania', 'south_america'
]) AS continents(continent);

ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.shipping_rates FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shipping_rates TO authenticated;
GRANT ALL ON TABLE public.shipping_rates TO service_role;

CREATE POLICY "Admins can read artwork shipping rates"
  ON public.shipping_rates
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert artwork shipping rates"
  ON public.shipping_rates
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update artwork shipping rates"
  ON public.shipping_rates
  FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete artwork shipping rates"
  ON public.shipping_rates
  FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE FUNCTION public.create_default_artwork_shipping_rates()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.shipping_rates (artwork_id, continent)
  SELECT NEW.id, continents.continent
  FROM unnest(ARRAY[
    'africa', 'asia', 'europe',
    'north_america', 'oceania', 'south_america'
  ]) AS continents(continent)
  ON CONFLICT (artwork_id, continent) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.create_default_artwork_shipping_rates() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER artworks_create_default_shipping_rates
  AFTER INSERT ON public.artworks
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_artwork_shipping_rates();
