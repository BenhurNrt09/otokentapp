-- Ensure is_support column exists in users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_support BOOLEAN DEFAULT FALSE;

-- Create offers table if it doesn't exist
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add new columns if they don't exist (useful if table was created in previous failed runs without these)
ALTER TABLE offers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS surname TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS phone TEXT;

-- Enable RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create offers" ON offers;
DROP POLICY IF EXISTS "Users can view their own offers" ON offers;
DROP POLICY IF EXISTS "Admins can view all offers" ON offers;

-- Re-create Policies
CREATE POLICY "Users can create offers" 
ON offers FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own offers" 
ON offers FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all offers" 
ON offers FOR SELECT 
TO authenticated 
USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_support = true) 
    OR 
    auth.jwt() ->> 'email' = 'admin@otokent.com'
);
