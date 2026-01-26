-- VERIFY AND DISABLE RLS STATUS
-- Run this to check if RLS is actually disabled.

-- 1. Check current status (for your information)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('advertisements', 'users', 'notifications');

-- 2. Force Disable AGAIN
ALTER TABLE advertisements DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- 3. Verify again (should all be false)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('advertisements', 'users', 'notifications');
