-- ============================================================================
-- SQL FIX: REMOVE EMAIL VERIFICATION & CONFIRM EXISTING USERS
-- ============================================================================
-- Run this script in your Supabase SQL Editor to fix the "Email not confirmed" error.
-- ============================================================================

-- 1. Confirm ALL existing users who are currently unconfirmed
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 2. Ensure the Auto-Confirm Trigger exists and is correct
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically verify the email
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger to be sure
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_email();

-- 3. (Optional) Check for invalid emails or clean up
-- If you have "deneme@otokent.com" that is stuck, this will update it above.
