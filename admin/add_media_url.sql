-- Add media_url column to messages table if it doesn't exist
ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Update RLS policies to allow insert with new column (if explicit column list was used in policy, though usually it's row-based)
-- Just ensuring the column exists is enough for Supabase 'insert' to work if no strict columns are defined in policy.
