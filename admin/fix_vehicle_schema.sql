-- FIX VEHICLE SCHEMA
-- Adds potentially missing columns referenced in the application code.

-- 1. Add columns if they don't exist
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

-- 2. Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';
