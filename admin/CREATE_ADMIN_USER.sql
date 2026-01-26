-- ADMİN KULLANICI OLUŞTURMA ve GİRİŞ SCRIPT
-- Önce Supabase Dashboard'da kullanıcı oluşturun, sonra admin yapın

-- ============================================================================
-- ADIM 1: Supabase Dashboard'da Kullanıcı Oluştur
-- ============================================================================
-- 1. Supabase Dashboard → Authentication → Users
-- 2. "Add User" → "Create new user" butonuna tıklayın
-- 3. Bilgileri doldurun:
--    Email: YOUR_EMAIL@example.com
--    Password: GÜÇLÜ_BİR_ŞİFRE (en az 8 karakter)
--    Email Confirm: ✅ İŞARETLEYİN (otomatik onay için)
-- 4. "Create user" butonuna tıklayın

-- ============================================================================
-- ADIM 2: SQL Editor'da Admin Yetkisi Ver
-- ============================================================================
-- Kullanıcı oluşturulduktan sonra bu SQL'i çalıştırın:

-- ÖNCE: Auth kullanıcısının ID'sini kontrol edin
SELECT id, email FROM auth.users 
WHERE email = 'YOUR_EMAIL@example.com';
-- Bu ID'yi kopyalayın

-- public.users tablosuna ekle VE admin yap
INSERT INTO public.users (id, email, name, surname, role, is_active)
SELECT 
    id,
    email,
    'Admin',
    'User',
    'admin',
    true
FROM auth.users 
WHERE email = 'YOUR_EMAIL@example.com'
ON CONFLICT (id) DO UPDATE 
SET 
    role = 'admin', 
    is_active = true, 
    deleted_at = NULL;

-- Kontrol et
SELECT * FROM public.users WHERE email = 'YOUR_EMAIL@example.com';
-- role = 'admin' olmalı!

-- ============================================================================
-- ADIM 3: Admin Panelde Giriş Yap
-- ============================================================================
-- 1. http://localhost:3002/login adresine git
-- 2. Email: YOUR_EMAIL@example.com
-- 3. Password: ADIM 1'de oluşturduğunuz şifre
-- 4. "Giriş Yap" butonuna tıklayın
-- 5. Dashboard'a yönlendirilmelisiniz!

-- ============================================================================
-- ADIM 4: Kontrol Et
-- ============================================================================
-- Giriş yaptıktan sonra, admin panelde F12 → Console:
-- Sonra Supabase SQL Editor'da bu sorguyu çalıştırın:

SELECT 
    auth.uid() as user_id,
    is_admin() as admin_mi,
    u.email,
    u.role
FROM users u
WHERE u.id = auth.uid();

-- Artık:
-- - user_id: UUID görmeli (NULL değil!)
-- - admin_mi: true olmalı
-- - role: admin olmalı

-- ✅ Eğer hepsi OK ise, artık araç/reklam ekleyebilirsiniz!
