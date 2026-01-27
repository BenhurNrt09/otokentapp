-- Create advertisements table
CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Anyone can view active advertisements" ON public.advertisements;
CREATE POLICY "Anyone can view active advertisements" 
ON public.advertisements FOR SELECT 
USING (is_active = true OR (auth.uid() IN (SELECT id FROM users WHERE role = 'admin')));

DROP POLICY IF EXISTS "Admins can manage advertisements" ON public.advertisements;
CREATE POLICY "Admins can manage advertisements" 
ON public.advertisements FOR ALL 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_advertisements_updated_at ON public.advertisements;
CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
