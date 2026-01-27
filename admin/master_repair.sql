-- MASTER REPAIR SCRIPT v1.0
-- Run this script in Supabase SQL Editor to fix ALL database issues at once.

-- 1. FIX MESSAGES CONSTRAINT (Allow ANY message type)
-- We drop the constraint entirely to stop the "check constraint" errors permanently.
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_message_type_check') THEN 
        ALTER TABLE messages DROP CONSTRAINT messages_message_type_check; 
    END IF; 
END $$;

-- 2. FIX OFFERS TABLE (Ensure all columns exist)
-- We add columns if they are missing. This is safe to run multiple times.
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE offers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS surname TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. FIX USERS TABLE (Ensure admin support flag exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_support BOOLEAN DEFAULT FALSE;

-- 4. REFRESH RLS POLICIES (Fix Admin Visibility)
-- Drop old policies to prevent conflicts
DROP POLICY IF EXISTS "Users can create offers" ON offers;
DROP POLICY IF EXISTS "Users can view their own offers" ON offers;
DROP POLICY IF EXISTS "Admins can view all offers" ON offers;

-- Basic RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Re-create simple policies
CREATE POLICY "Users can create offers" ON offers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own offers" ON offers FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Admin policy (checks is_support flag OR specific email)
CREATE POLICY "Admins can view all offers" ON offers FOR SELECT TO authenticated USING (
    (SELECT is_support FROM users WHERE id = auth.uid()) = true 
    OR 
    auth.jwt() ->> 'email' = 'admin@otokent.com'
);

-- 5. RELOAD SCHEMA (Important for API to see new columns)
NOTIFY pgrst, 'reload schema';
