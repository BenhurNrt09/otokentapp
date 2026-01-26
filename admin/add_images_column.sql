-- Add images column to vehicles table if it doesn't exist
-- This fixes the error: "Could not find the 'images' column of 'vehicles' in the schema cache"

ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Check if it exists and verify structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vehicles' AND column_name = 'images';
