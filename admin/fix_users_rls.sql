-- DATA ACCESS FIX for USERS TABLE
-- This script ensures Admins can view/edit ALL users

-- 1. Enable RLS (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 3. Create ADMIN policies (Full Access)
-- SELECT
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- UPDATE
CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- INSERT
CREATE POLICY "Admins can insert users"
ON users FOR INSERT
WITH CHECK (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- DELETE
CREATE POLICY "Admins can delete users"
ON users FOR DELETE
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- 4. Create USER policies (Self Access)
-- Users can see their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (
  auth.uid() = id
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (
  auth.uid() = id
);

-- 5. Helper function to check admin status (if not exists)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
