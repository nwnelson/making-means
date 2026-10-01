ALTER TABLE public.artworks
  ADD COLUMN shipping_length numeric,
  ADD COLUMN shipping_width numeric,
  ADD COLUMN shipping_height numeric,
  ADD COLUMN shipping_weight numeric,
  ADD COLUMN shipping_dimension_unit text NOT NULL DEFAULT 'in',
  ADD COLUMN shipping_weight_unit text NOT NULL DEFAULT 'lb';

ALTER TABLE public.artworks
  ADD CONSTRAINT artworks_shipping_dimensions_positive_check
    CHECK (
      (shipping_length IS NULL OR shipping_length > 0)
      AND (shipping_width IS NULL OR shipping_width > 0)
      AND (shipping_height IS NULL OR shipping_height > 0)
      AND (shipping_weight IS NULL OR shipping_weight > 0)
    ),
  ADD CONSTRAINT artworks_shipping_package_complete_check
    CHECK (
      (shipping_length IS NULL AND shipping_width IS NULL AND shipping_height IS NULL AND shipping_weight IS NULL)
      OR
      (shipping_length IS NOT NULL AND shipping_width IS NOT NULL AND shipping_height IS NOT NULL AND shipping_weight IS NOT NULL)
    ),
  ADD CONSTRAINT artworks_shipping_dimension_unit_check
    CHECK (shipping_dimension_unit IN ('in', 'cm')),
  ADD CONSTRAINT artworks_shipping_weight_unit_check
    CHECK (shipping_weight_unit IN ('lb', 'kg'));
