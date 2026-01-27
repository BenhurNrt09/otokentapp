-- 1. Relax Message Type Constraint
-- First, drop the existing constraint if it exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_message_type_check') THEN 
        ALTER TABLE messages DROP CONSTRAINT messages_message_type_check; 
    END IF; 
END $$;

-- Add a new, more inclusive constraint (or just remove the check entirely if you prefer maximum flexibility)
-- Allowing both "role-based" types (user, support) and "content-based" types (text, image, etc.) ensures compatibility.
ALTER TABLE messages ADD CONSTRAINT messages_message_type_check 
CHECK (message_type IN ('user', 'support', 'system', 'text', 'image', 'video', 'location', 'document', 'audio'));

-- 2. Ensure Offers Table Columns Exist (Just in case)
ALTER TABLE offers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS surname TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
