-- FIX ADMIN ROLE SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Update the 'admin@otokent.com' user to have 'admin' role
UPDATE public.users 
SET role = 'admin', is_active = true
WHERE email = 'admin@otokent.com';

-- 2. Also update ANY user that has an 'admin' email to be admin
UPDATE public.users 
SET role = 'admin'
WHERE email LIKE '%@otokent.com';

-- 3. Verify the changes
SELECT id, email, role, is_active FROM public.users WHERE role = 'admin';
