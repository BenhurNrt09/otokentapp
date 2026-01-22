-- OtoKent - Row Level Security (RLS) Policies
-- Bu dosya tüm tablolar için güvenlik politikalarını tanımlar

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
    AND is_active = true
    AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (is_admin());

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Admins can insert users
CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update all users
CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  USING (is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can soft delete users
CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  USING (is_admin());

-- ============================================================================
-- CATEGORIES TABLE POLICIES
-- ============================================================================

-- Everyone can view active categories
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can insert categories
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update categories
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (is_admin());

-- Admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (is_admin());

-- ============================================================================
-- VEHICLES TABLE POLICIES
-- ============================================================================

-- Everyone can view active vehicles
CREATE POLICY "Anyone can view active vehicles"
  ON vehicles FOR SELECT
  USING (status = 'active' OR user_id = auth.uid() OR is_admin());

-- Authenticated users can insert their own vehicles
CREATE POLICY "Users can insert own vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can insert any vehicle
CREATE POLICY "Admins can insert any vehicle"
  ON vehicles FOR INSERT
  WITH CHECK (is_admin());

-- Users can update their own vehicles
CREATE POLICY "Users can update own vehicles"
  ON vehicles FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can update all vehicles
CREATE POLICY "Admins can update all vehicles"
  ON vehicles FOR UPDATE
  USING (is_admin());

-- Users can delete their own vehicles
CREATE POLICY "Users can delete own vehicles"
  ON vehicles FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can delete all vehicles
CREATE POLICY "Admins can delete all vehicles"
  ON vehicles FOR DELETE
  USING (is_admin());

-- ============================================================================
-- VEHICLE IMAGES TABLE POLICIES
-- ============================================================================

-- Everyone can view images of active vehicles
CREATE POLICY "Anyone can view vehicle images"
  ON vehicle_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = vehicle_images.vehicle_id 
      AND (vehicles.status = 'active' OR vehicles.user_id = auth.uid() OR is_admin())
    )
  );

-- Vehicle owners can insert images
CREATE POLICY "Vehicle owners can insert images"
  ON vehicle_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = vehicle_images.vehicle_id 
      AND vehicles.user_id = auth.uid()
    ) OR is_admin()
  );

-- Vehicle owners can update their images
CREATE POLICY "Vehicle owners can update images"
  ON vehicle_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = vehicle_images.vehicle_id 
      AND vehicles.user_id = auth.uid()
    ) OR is_admin()
  );

-- Vehicle owners can delete their images
CREATE POLICY "Vehicle owners can delete images"
  ON vehicle_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = vehicle_images.vehicle_id 
      AND vehicles.user_id = auth.uid()
    ) OR is_admin()
  );

-- ============================================================================
-- MESSAGES TABLE POLICIES
-- ============================================================================

-- Users can view messages where they are sender or receiver
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id 
    OR auth.uid() = receiver_id 
    OR is_admin()
  );

-- Authenticated users can send messages
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update their sent messages (e.g., mark as read)
CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (
    auth.uid() = sender_id 
    OR auth.uid() = receiver_id 
    OR is_admin()
  );

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id OR is_admin());

-- ============================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- System (admins) can insert notifications
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (is_admin());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ============================================================================
-- ADVERTISEMENTS TABLE POLICIES
-- ============================================================================

-- Everyone can view active advertisements
CREATE POLICY "Anyone can view active advertisements"
  ON advertisements FOR SELECT
  USING (
    (is_active = true 
     AND (start_date IS NULL OR start_date <= NOW())
     AND (end_date IS NULL OR end_date >= NOW()))
    OR is_admin()
  );

-- Admins can insert advertisements
CREATE POLICY "Admins can insert advertisements"
  ON advertisements FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update advertisements
CREATE POLICY "Admins can update advertisements"
  ON advertisements FOR UPDATE
  USING (is_admin());

-- Admins can delete advertisements
CREATE POLICY "Admins can delete advertisements"
  ON advertisements FOR DELETE
  USING (is_admin());

-- ============================================================================
-- FAQS TABLE POLICIES
-- ============================================================================

-- Everyone can view active FAQs
CREATE POLICY "Anyone can view active faqs"
  ON faqs FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can insert FAQs
CREATE POLICY "Admins can insert faqs"
  ON faqs FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update FAQs
CREATE POLICY "Admins can update faqs"
  ON faqs FOR UPDATE
  USING (is_admin());

-- Admins can delete FAQs
CREATE POLICY "Admins can delete faqs"
  ON faqs FOR DELETE
  USING (is_admin());

-- ============================================================================
-- POLICIES TABLE POLICIES
-- ============================================================================

-- Everyone can view active policies
CREATE POLICY "Anyone can view active policies"
  ON policies FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can insert policies
CREATE POLICY "Admins can insert policies"
  ON policies FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update policies
CREATE POLICY "Admins can update policies"
  ON policies FOR UPDATE
  USING (is_admin());

-- Admins can delete policies
CREATE POLICY "Admins can delete policies"
  ON policies FOR DELETE
  USING (is_admin());

-- ============================================================================
-- APP SETTINGS TABLE POLICIES
-- ============================================================================

-- Everyone can view app settings
CREATE POLICY "Anyone can view app settings"
  ON app_settings FOR SELECT
  USING (true);

-- Admins can insert app settings
CREATE POLICY "Admins can insert app settings"
  ON app_settings FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update app settings
CREATE POLICY "Admins can update app settings"
  ON app_settings FOR UPDATE
  USING (is_admin());

-- Admins can delete app settings
CREATE POLICY "Admins can delete app settings"
  ON app_settings FOR DELETE
  USING (is_admin());

-- ============================================================================
-- STORAGE POLICIES (for vehicle images bucket)
-- ============================================================================

-- Note: Bu politikalar Supabase Dashboard'dan Storage bölümünde uygulanmalıdır
-- Bu SQL dosyası tablo RLS politikalarını içerir.
-- Storage bucket policies için Supabase Dashboard > Storage > Policies sayfasını kullanın

/*
vehicle-images bucket için önerilen politikalar:

1. SELECT policy: "Anyone can view vehicle images"
   - Allowed operations: SELECT
   - Policy definition: true

2. INSERT policy: "Authenticated users can upload images"
   - Allowed operations: INSERT
   - Policy definition: auth.role() = 'authenticated'

3. UPDATE policy: "Users can update their own uploads"
   - Allowed operations: UPDATE
   - Policy definition: auth.uid() = owner

4. DELETE policy: "Users can delete their own uploads"
   - Allowed operations: DELETE
   - Policy definition: auth.uid() = owner OR is_admin()
*/
