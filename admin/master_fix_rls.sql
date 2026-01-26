-- MASTER FIX FOR ALL PERMISSIONS
-- This script resets policies to ensure Admin has FULL access and Users have OWNER access

-- 1. Enable RLS ensuring tables existence
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Admins can do everything on advertisements" ON advertisements;
DROP POLICY IF EXISTS "Public can view active advertisements" ON advertisements;
DROP POLICY IF EXISTS "Admins can do everything on users" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

---------------------------------------------------------
-- ADVERTISEMENTS
---------------------------------------------------------
-- Public: Read only active
CREATE POLICY "Public can view active advertisements"
ON advertisements FOR SELECT
USING (is_active = true);

-- Admin: Full Access
CREATE POLICY "Admins can do everything on advertisements"
ON advertisements FOR ALL
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

---------------------------------------------------------
-- USERS
---------------------------------------------------------
-- Admin: Full Access (Select, Insert, Update, Delete)
CREATE POLICY "Admins can do everything on users"
ON users FOR ALL
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- User: View/Update Own Profile
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
USING (auth.uid() = id);

---------------------------------------------------------
-- NOTIFICATIONS
---------------------------------------------------------
-- Admin: Insert & Delete
CREATE POLICY "Admins can insert notifications"
ON notifications FOR INSERT
WITH CHECK (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can delete notifications"
ON notifications FOR DELETE
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- User: View Own
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- User: Update Own (e.g. mark as read)
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);
