-- Enable RLS on tables if not already enabled
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ADVERTISEMENTS POLICIES
DROP POLICY IF EXISTS "Admins can do everything on advertisements" ON advertisements;
DROP POLICY IF EXISTS "Public can view active advertisements" ON advertisements;

CREATE POLICY "Public can view active advertisements"
ON advertisements FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can do everything on advertisements"
ON advertisements FOR ALL
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- USERS POLICIES
DROP POLICY IF EXISTS "Admins can do everything on users" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

CREATE POLICY "Admins can do everything on users"
ON users FOR ALL
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
USING (auth.uid() = id);

-- NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Admins can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON notifications; 

CREATE POLICY "Admins can insert notifications"
ON notifications FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

CREATE POLICY "Admins can delete notifications"
ON notifications FOR DELETE
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Fix for creating new users (Trigger bypass or allow service role if using dashboard)
-- Note: 'users' table usually maps to auth.users. If you are inserting into public.users,
-- ensure the trigger on auth.users handles it, or RLS allows it.
-- For simple admin usage, we allow admins to insert into public.users.

DROP POLICY IF EXISTS "Admins can insert users" ON users;

CREATE POLICY "Admins can insert users"
ON users FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);
