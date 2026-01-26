-- ACIL DEBUG SCRIPT - Supabase SQL Editor'da çalıştırın
-- Bu script her şeyi kontrol eder ve sorunları bulur

-- ============================================================================
-- 1. KULLANICI KONTROLÜ
-- ============================================================================
SELECT 
    '=== KULLANICI DURUMU ===' as check_type,
    au.id,
    au.email,
    au.email_confirmed_at,
    pu.role,
    pu.is_active,
    pu.deleted_at,
    CASE 
        WHEN pu.id IS NULL THEN '❌ public.users tablosunda YOK!'
        WHEN pu.role != 'admin' THEN '❌ Admin değil! Role: ' || pu.role
        WHEN pu.is_active = false THEN '❌ Aktif değil!'
        WHEN pu.deleted_at IS NOT NULL THEN '❌ Silinmiş!'
        ELSE '✅ Kullanıcı düzgün'
    END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 5;

-- ============================================================================
-- 2. is_admin() FONKSİYONU TEST
-- ============================================================================
SELECT 
    '=== is_admin() FONKSİYON TEST ===' as check_type,
    auth.uid() as current_user_id,
    is_admin() as is_admin_result,
    CASE 
        WHEN auth.uid() IS NULL THEN '❌ GİRİŞ YAPMADINIZ!'
        WHEN is_admin() = false THEN '❌ Admin yetkisi YOK!'
        ELSE '✅ Admin yetkisi var'
    END as status;

-- ============================================================================
-- 3. RLS POLİTİKA KONTROLÜ
-- ============================================================================
SELECT 
    '=== RLS POLİTİKA KONTROLÜ ===' as check_type,
    schemaname,
    tablename,
    policyname,
    CASE 
        WHEN cmd = 'INSERT' THEN '✅ INSERT var'
        WHEN cmd = 'UPDATE' THEN '✅ UPDATE var'
        WHEN cmd = 'DELETE' THEN '✅ DELETE var'
        ELSE cmd
    END as command,
    qual as policy_condition
FROM pg_policies 
WHERE tablename IN ('vehicles', 'advertisements', 'users')
ORDER BY tablename, cmd;

-- ============================================================================
-- 4. VERITABANI İÇERİK KONTROLÜ
-- ============================================================================
SELECT 
    '=== VERİTABANI İÇERİK ===' as check_type,
    (SELECT COUNT(*) FROM vehicles) as vehicle_count,
    (SELECT COUNT(*) FROM advertisements WHERE is_active = true) as active_ads,
    (SELECT COUNT(*) FROM public.users WHERE role = 'admin') as admin_count,
    (SELECT COUNT(*) FROM messages WHERE message_type = 'support') as welcome_messages;

-- ============================================================================
-- 5. MANUEL ARAÇ EKLEME TESTİ (RLS BYPASS)
-- ============================================================================
-- Eğer yukarıdaki kontroller OK ise, bu manuel test yapın:
-- ÖNEMLI: Aşağıdaki INSERT'i SİZ YAPMAYACAKSINIZ, sadece kontrol amaçlı

/*
-- SADECE TEST AMAÇLI - RLS ile ilgili sorun varsa bu çalışır mı görelim
INSERT INTO vehicles (
    brand, model, year, price, mileage, 
    fuel_type, gear_type, from_who, status,
    title, images
) VALUES (
    'Test', 'Manual Insert', 2024, 100000, 0,
    'benzin', 'manuel', 'sahibinden_ilk', 'active',
    'Test Aracı - Manuel Eklendi',
    ARRAY['https://picsum.photos/800/600']::text[]
);
*/

-- ============================================================================
-- 6. ACIL DÜZELTİCİ KOMUTLAR (Sorun varsa)
-- ============================================================================

-- Eğer kullanıcı yoksa ekle:
/*
INSERT INTO public.users (id, email, name, surname, role, is_active)
SELECT au.id, au.email, 'Admin', 'User', 'admin', true
FROM auth.users au
WHERE au.email = 'YOUR_EMAIL_HERE' -- KENDİ EMAİLİNİZİ YAZIN
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', is_active = true, deleted_at = NULL;
*/

-- Eğer RLS çok katıysa, GEÇİCİ OLARAK devre dışı bırak (TEHLİKELİ!):
/*
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements DISABLE ROW LEVEL SECURITY;
*/

-- Test sonrası tekrar aktif et:
/*
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
*/
