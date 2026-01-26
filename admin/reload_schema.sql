-- RELOAD SCHEMA CACHE
-- This forces Supabase/PostgREST to refresh its knowledge of the table structure.
-- Required when columns are added/removed or when "Could not find column" errors appear.

NOTIFY pgrst, 'reload schema';
