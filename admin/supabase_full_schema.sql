-- OtoKent Admin Panel - Complete Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================================================
-- VEHICLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  price DECIMAL(12, 2),
  mileage INTEGER,
  fuel_type VARCHAR(50),
  transmission VARCHAR(50),
  color VARCHAR(50),
  description TEXT,
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'archived')),
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_vehicles_category_id ON vehicles(category_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);

-- ============================================================================
-- VEHICLE IMAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  message_type VARCHAR(20) DEFAULT 'user' CHECK (message_type IN ('user', 'support', 'system')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_vehicle_id ON messages(vehicle_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) CHECK (type IN ('message', 'vehicle', 'system', 'promotion')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- ADVERTISEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP NULL,
  end_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_advertisements_is_active ON advertisements(is_active);
CREATE INDEX idx_advertisements_display_order ON advertisements(display_order);

-- ============================================================================
-- FAQS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_display_order ON faqs(display_order);

-- ============================================================================
-- POLICIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('privacy', 'terms', 'cookie')),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  version VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_policies_type_active ON policies(type, is_active) WHERE is_active = true;

-- ============================================================================
-- APP SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_app_settings_key ON app_settings(setting_key);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON advertisements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default categories
INSERT INTO categories (name, slug, icon, display_order, is_active) VALUES
('Sedan', 'sedan', 'car-sport', 1, true),
('SUV', 'suv', 'car-outline', 2, true),
('Hatchback', 'hatchback', 'car', 3, true),
('Pickup', 'pickup', 'car-pickup', 4, true),
('Van', 'van', 'bus', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
('Nasıl araç ilanı verebilirim?', 'Profil sayfanızdan "Yeni İlan Ver" butonuna tıklayarak araç bilgilerinizi doldurup ilan yayınlayabilirsiniz.', 'Genel', 1, true),
('İlanım ne kadar sürede onaylanır?', 'İlanınız sistem tarafından otomatik olarak yayınlanır. Moderatörlerimiz düzenli olarak kontrol eder.', 'Genel', 2, true),
('Satıcıyla nasıl iletişime geçebilirim?', 'İlan detay sayfasındaki "Mesaj Gönder" butonunu kullanarak doğrudan satıcıyla iletişime geçebilirsiniz.', 'Mesajlaşma', 3, true),
('Hesabımı nasıl silebilirim?', 'Ayarlar > Giriş ve Güvenlik bölümünden hesabınızı silebilirsiniz. Bu işlem geri alınamaz.', 'Hesap', 4, true)
ON CONFLICT DO NOTHING;

-- Insert default policies
INSERT INTO policies (type, title, content, version, is_active) VALUES
('privacy', 'Gizlilik Politikası', 'OtoKent gizlilik politikası içeriği buraya gelecek...', '1.0', true),
('terms', 'Kullanım Koşulları', 'OtoKent kullanım koşulları içeriği buraya gelecek...', '1.0', true),
('cookie', 'Çerez Politikası', 'OtoKent çerez politikası içeriği buraya gelecek...', '1.0', true)
ON CONFLICT DO NOTHING;

-- Insert default app settings
INSERT INTO app_settings (setting_key, setting_value, setting_type, description) VALUES
('app_version', '1.0.0', 'string', 'Mobile app version'),
('maintenance_mode', 'false', 'boolean', 'Enable/disable maintenance mode'),
('max_upload_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)'),
('ads_rotation_seconds', '5', 'number', 'Advertisement rotation interval in seconds')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Insert sample advertisements
INSERT INTO advertisements (title, image_url, display_order, is_active) VALUES
('Reklam 1', '/reklam1.png', 1, true),
('Reklam 2', '/reklam2.png', 2, true)
ON CONFLICT DO NOTHING;
