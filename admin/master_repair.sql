-- MASTER REPAIR SCRIPT v3.0 (HYBRID OFFERS)

-- 1. FIX MESSAGES CONSTRAINT
DO $$ BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_message_type_check') THEN 
        ALTER TABLE messages DROP CONSTRAINT messages_message_type_check; 
    END IF; 
END $$;

-- 2. CREATE/UPDATE OFFERS TABLE
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ADD ALL COLUMNS (SAFE & IDEMPOTENT)
ALTER TABLE offers ADD COLUMN IF NOT EXISTS vehicle_id UUID; -- Made NULLABLE for insurance
ALTER TABLE offers ADD COLUMN IF NOT EXISTS price NUMERIC;    -- Made NULLABLE for insurance
ALTER TABLE offers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Contact Info
ALTER TABLE offers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS surname TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS phone TEXT;

-- Insurance Specific
ALTER TABLE offers ADD COLUMN IF NOT EXISTS offer_type TEXT DEFAULT 'vehicle'; -- 'vehicle' or 'insurance'
ALTER TABLE offers ADD COLUMN IF NOT EXISTS insurance_company TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS tc_number TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS plate_number TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS license_serial TEXT;

-- 4. RELAX CONSTRAINTS (If they exist as NOT NULL)
ALTER TABLE offers ALTER COLUMN vehicle_id DROP NOT NULL;
ALTER TABLE offers ALTER COLUMN price DROP NOT NULL;

-- 5. ADMIN SUPPORT
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_support BOOLEAN DEFAULT FALSE;

-- 6. REFRESH RLS POLICIES
DROP POLICY IF EXISTS "Users can create offers" ON offers;
DROP POLICY IF EXISTS "Users can view their own offers" ON offers;
DROP POLICY IF EXISTS "Admins can view all offers" ON offers;

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create offers" ON offers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own offers" ON offers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all offers" ON offers FOR SELECT TO authenticated USING (
    (SELECT is_support FROM users WHERE id = auth.uid()) = true 
    OR 
    auth.jwt() ->> 'email' = 'admin@otokent.com'
);

NOTIFY pgrst, 'reload schema';
