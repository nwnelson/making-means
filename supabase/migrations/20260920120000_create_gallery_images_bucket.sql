INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery_images', 'gallery_images', true)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  public = EXCLUDED.public;

CREATE POLICY "Public can view gallery images" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery_images');

CREATE POLICY "Admins can insert gallery images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'gallery_images'
    AND (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update gallery images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'gallery_images'
    AND (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'gallery_images'
    AND (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can delete gallery images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'gallery_images'
    AND (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
