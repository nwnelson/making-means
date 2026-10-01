ALTER TABLE public.orders
  ADD COLUMN shipping_address_mismatch boolean NOT NULL DEFAULT false;
