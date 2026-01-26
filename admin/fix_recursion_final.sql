-- FINAL FIX FOR RECURSION ISSUES
-- Using a SECURITY DEFINER function to bypass RLS when checking for admin status
-- This prevents the infinite loop of "checking users table to see if I can read users table"

-- 1. Create a secure function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with privileges of the creator (bypasses RLS)
SET search_path = public -- Secure search path
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 2. Reset Policies using the new function

-- USERS TABLE
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can do everything on users" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;

CREATE POLICY "Admins can do everything on users"
ON users FOR ALL
USING (is_admin());

CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
USING (auth.uid() = id);

-- ADVERTISEMENTS TABLE
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can do everything on advertisements" ON advertisements;
DROP POLICY IF EXISTS "Public can view active advertisements" ON advertisements;

CREATE POLICY "Public can view active advertisements"
ON advertisements FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can do everything on advertisements"
ON advertisements FOR ALL
USING (is_admin());

-- NOTIFICATIONS TABLE
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

CREATE POLICY "Admins can insert notifications"
ON notifications FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete notifications"
ON notifications FOR DELETE
USING (is_admin());

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);
