-- OtoKent Admin Panel - COMPLETE SETUP SCRIPT
-- This file includes Schema Creation, RLS Policies, and Seed Data.
-- Run this ONCE in Supabase SQL Editor to set up everything correctly.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. DROP EXISTING TABLES (Ensures a fresh start and resolves schema conflicts)
-- ============================================================================
DROP TABLE IF EXISTS app_settings CASCADE;
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS advertisements CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS vehicle_images CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  surname VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  series VARCHAR(100),
  year INTEGER,
  price DECIMAL(12, 2),
  mileage INTEGER,
  fuel_type VARCHAR(50),
  transmission VARCHAR(50),
  body_type VARCHAR(50),
  engine_capacity VARCHAR(50),
  engine_power VARCHAR(50),
  drive_type VARCHAR(50),
  color VARCHAR(50),
  warranty BOOLEAN DEFAULT false,
  heavy_damage_record BOOLEAN DEFAULT false,
  is_disabled_friendly BOOLEAN DEFAULT false,
  exchangeable BOOLEAN DEFAULT false,
  video_call_available BOOLEAN DEFAULT false,
  description TEXT,
  location VARCHAR(255),
  from_who VARCHAR(50) DEFAULT 'owner',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'archived')),
  expertise_data JSONB DEFAULT '{}'::jsonb,
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_category_id ON vehicles(category_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);

-- VEHICLE IMAGES
CREATE TABLE IF NOT EXISTS vehicle_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  message_type VARCHAR(20) DEFAULT 'user' CHECK (message_type IN ('user', 'support', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_vehicle_id ON messages(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) CHECK (type IN ('message', 'vehicle', 'system', 'promotion')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ADVERTISEMENTS
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE NULL,
  end_date TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advertisements_is_active ON advertisements(is_active);
CREATE INDEX IF NOT EXISTS idx_advertisements_display_order ON advertisements(display_order);

-- FAQS
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);

-- POLICIES
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('privacy', 'terms', 'cookie')),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  version VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_policies_type_active ON policies(type, is_active) WHERE is_active = true;

-- APP SETTINGS
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(setting_key);

-- ============================================================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_advertisements_updated_at ON advertisements;
CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON advertisements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_policies_updated_at ON policies;
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
    AND is_active = true
    AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sync auth users to public users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, surname, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for sync
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-confirm email trigger
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_email();

-- ============================================================================
-- 4. ENABLE RLS
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. RLS POLICIES
-- ============================================================================

-- USERS
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can insert users" ON users;
CREATE POLICY "Admins can insert users" ON users FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can update all users" ON users;
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (is_admin());
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can delete users" ON users;
CREATE POLICY "Admins can delete users" ON users FOR DELETE USING (is_admin());

-- CATEGORIES
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
CREATE POLICY "Admins can insert categories" ON categories FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
CREATE POLICY "Admins can update categories" ON categories FOR UPDATE USING (is_admin());
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
CREATE POLICY "Admins can delete categories" ON categories FOR DELETE USING (is_admin());

-- VEHICLES
DROP POLICY IF EXISTS "Anyone can view active vehicles" ON vehicles;
CREATE POLICY "Anyone can view active vehicles" ON vehicles FOR SELECT USING (status = 'active' OR user_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "Users can insert own vehicles" ON vehicles;
CREATE POLICY "Users can insert own vehicles" ON vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can insert any vehicle" ON vehicles;
CREATE POLICY "Admins can insert any vehicle" ON vehicles FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Users can update own vehicles" ON vehicles;
CREATE POLICY "Users can update own vehicles" ON vehicles FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can update all vehicles" ON vehicles;
CREATE POLICY "Admins can update all vehicles" ON vehicles FOR UPDATE USING (is_admin());

-- VEHICLE IMAGES
DROP POLICY IF EXISTS "Anyone can view vehicle images" ON vehicle_images;
CREATE POLICY "Anyone can view vehicle images" ON vehicle_images FOR SELECT USING (true);

-- MESSAGES
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR is_admin());
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- ADVERTISEMENTS
DROP POLICY IF EXISTS "Anyone can view active advertisements" ON advertisements;
CREATE POLICY "Anyone can view active advertisements" ON advertisements FOR SELECT USING (is_active = true OR is_admin());

-- FAQS
DROP POLICY IF EXISTS "Anyone can view active faqs" ON faqs;
CREATE POLICY "Anyone can view active faqs" ON faqs FOR SELECT USING (is_active = true OR is_admin());

-- POLICIES
DROP POLICY IF EXISTS "Anyone can view active policies" ON policies;
CREATE POLICY "Anyone can view active policies" ON policies FOR SELECT USING (is_active = true OR is_admin());

-- APP SETTINGS
DROP POLICY IF EXISTS "Anyone can view app settings" ON app_settings;
CREATE POLICY "Anyone can view app settings" ON app_settings FOR SELECT USING (true);

-- ============================================================================
-- 6. SEED DATA
-- ============================================================================

-- Support User for mobile app messaging
INSERT INTO users (id, email, name, surname, role, is_active, phone, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'destek@otokent.com', 'OtoKent', 'Destek', 'admin', true, '+90 500 000 0000', NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  surname = EXCLUDED.surname,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Categories
INSERT INTO categories (name, slug, icon, display_order, is_active) VALUES
('Sedan', 'sedan', 'car-sport', 1, true),
('SUV', 'suv', 'car-outline', 2, true),
('Hatchback', 'hatchback', 'car', 3, true),
('Pickup', 'pickup', 'car-pickup', 4, true),
('Van', 'van', 'bus', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
('Nasıl araç ilanı verebilirim?', 'Profil sayfanızdan "Yeni İlan Ver" butonuna tıklayarak araç bilgilerinizi doldurup ilan yayınlayabilirsiniz.', 'Genel', 1, true),
('İlanım ne kadar sürede onaylanır?', 'İlanınız sistem tarafından otomatik olarak yayınlanır. Moderatörlerimiz düzenli olarak kontrol eder.', 'Genel', 2, true)
ON CONFLICT DO NOTHING;

-- Policies
INSERT INTO policies (type, title, content, version, is_active) VALUES
('privacy', 'Gizlilik Politikası', 'OtoKent gizlilik politikası içeriği...', '1.0', true),
('terms', 'Kullanım Koşulları', 'OtoKent kullanım koşulları içeriği...', '1.0', true),
('cookie', 'Çerez Politikası', 'OtoKent çerez politikası içeriği...', '1.0', true)
ON CONFLICT DO NOTHING;
