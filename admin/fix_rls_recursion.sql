-- FIX RECURSION ERROR IN USERS POLICY
-- The previous policies caused an infinite loop (recursion) because checking if a user is admin
-- required reading the users table, which required checking if user is admin, etc.

-- We fix this by using a SECURITY DEFINER function that bypasses RLS.

-- 1. Create a secure function to check admin status
-- SECURITY DEFINER means this runs with the privileges of the creator (you), bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Admins can select users" ON users; 

-- 3. Re-create policies using the safe function
-- SELECT
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  is_admin() OR auth.uid() = id
);

-- UPDATE
CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
USING (
  is_admin() OR auth.uid() = id
);

-- INSERT
CREATE POLICY "Admins can insert users"
ON users FOR INSERT
WITH CHECK (
  is_admin()
);

-- DELETE
CREATE POLICY "Admins can delete users"
ON users FOR DELETE
USING (
  is_admin()
);

-- 4. Double check other tables just in case (optional, but good practice)
-- Ensure other admin policies use the function too if they check users table
-- (Previously created policies mainly checked IS_ADMIN() which if not defined properly could be an issue, 
-- but we just redefined IS_ADMIN globally above so they should be fine now)
