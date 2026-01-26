-- FIX ADMIN ROLE - BROAD ATTEMPT
-- This ensures ANY user with email starting with 'admin' becomes an admin
-- regardless of the domain (otokent.com, otokentapp.com, etc.)

UPDATE public.users 
SET role = 'admin', is_active = true
WHERE email LIKE 'admin%';

-- Also make sure the specific user you are logged in as is admin
-- (If you are using a different email, replace it below)
-- UPDATE public.users SET role = 'admin' WHERE email = 'YOUR_EMAIL@example.com';

-- Check the result
SELECT id, email, role, is_active FROM public.users WHERE role = 'admin';
