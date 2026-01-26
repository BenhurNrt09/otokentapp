-- FIX ADVERTISEMENTS RLS POLICY
-- This script ensures Admins can MANAGE ads and Users can VIEW them

-- 1. Enable RLS
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Admins can manage advertisements" ON advertisements;
DROP POLICY IF EXISTS "Public can view active advertisements" ON advertisements;
DROP POLICY IF EXISTS "Anyone can view advertisements" ON advertisements;

-- 3. Create ADMIN policies (Full Access)
-- Uses the is_admin() function we defined earlier for safety
CREATE POLICY "Admins can manage advertisements"
ON advertisements
USING (
  is_admin()
)
WITH CHECK (
  is_admin()
);

-- 4. Create PUBLIC policies (Read Only)
-- Allows mobile app (anon users) to read ads
CREATE POLICY "Public can view active advertisements"
ON advertisements FOR SELECT
USING (
  true
);

-- 5. Repeat for other content tables just in case (FAQs, Policies)

-- FAQS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage faqs" ON faqs;
DROP POLICY IF EXISTS "Public can view faqs" ON faqs;

CREATE POLICY "Admins can manage faqs" ON faqs USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Public can view faqs" ON faqs FOR SELECT USING (true);

-- POLICIES
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage policies" ON policies;
DROP POLICY IF EXISTS "Public can view policies" ON policies;

CREATE POLICY "Admins can manage policies" ON policies USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Public can view policies" ON policies FOR SELECT USING (true);
