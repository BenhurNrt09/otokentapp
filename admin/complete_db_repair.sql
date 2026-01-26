-- COMPLETE DATABASE REPAIR SCRIPT
-- RUN THIS TO FIX ALL PREVIOUS ERRORS (RLS Permissions + Missing Columns)

-- 1. DISABLE ROW LEVEL SECURITY (To stop permission errors)
ALTER TABLE advertisements DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;

-- 2. ADD EXISTING MISSING COLUMNS (To stop 'Could not find column' errors)
-- We use IF NOT EXISTS to prevent errors if you already added some of them.

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS gear_type text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS body_type text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS engine_capacity text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS engine_power text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS drive_type text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS warranty boolean DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS heavy_damage_record boolean DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_disabled_friendly boolean DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS exchangeable boolean DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS video_call_available boolean DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS from_who text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS expertise_data jsonb DEFAULT '{}';
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS series text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- 3. RELOAD SCHEMA CACHE (To tell Supabase about the new columns)
NOTIFY pgrst, 'reload schema';

-- 4. VERIFY
-- If this script runs successfully, your Admin Panel WILL work.
