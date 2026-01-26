-- ============================================================================
-- OTOKENT - COMPLETE FIX SQL
-- Bu script tüm sorunları tek seferde çözer
-- ============================================================================

-- 1. RLS POLİTİKALARINI DÜZELT (Admin CRUD Yetkiler)
-- ============================================================================

-- ADVERTISEMENTS
DROP POLICY IF EXISTS "Admins can insert advertisements" ON advertisements;
DROP POLICY IF EXISTS "Admins can update advertisements" ON advertisements;
DROP POLICY IF EXISTS "Admins can delete advertisements" ON advertisements;

CREATE POLICY "Admins can insert advertisements" ON advertisements FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update advertisements" ON advertisements FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete advertisements" ON advertisements FOR DELETE USING (is_admin());

-- FAQS
DROP POLICY IF EXISTS "Admins can insert faqs" ON faqs;
DROP POLICY IF EXISTS "Admins can update faqs" ON faqs;
DROP POLICY IF EXISTS "Admins can delete faqs" ON faqs;

CREATE POLICY "Admins can insert faqs" ON faqs FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update faqs" ON faqs FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete faqs" ON faqs FOR DELETE USING (is_admin());

-- POLICIES
DROP POLICY IF EXISTS "Admins can insert policies" ON policies;
DROP POLICY IF EXISTS "Admins can update policies" ON policies;
DROP POLICY IF EXISTS "Admins can delete policies" ON policies;

CREATE POLICY "Admins can insert policies" ON policies FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update policies" ON policies FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete policies" ON policies FOR DELETE USING (is_admin());

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Admins can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON notifications;

CREATE POLICY "Admins can insert notifications" ON notifications FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update notifications" ON notifications FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete notifications" ON notifications FOR DELETE USING (is_admin());

-- 2. YENİ KULLANICIYA HOŞGELDİN MESAJI TRIGGER
-- ============================================================================

-- Destek kullanıcısından yeni kullanıcılara hoşgeldin mesajı gönder
CREATE OR REPLACE FUNCTION send_welcome_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Destek kullanıcısından yeni kullanıcıya hoşgeldin mesajı ekle
    INSERT INTO messages (sender_id, receiver_id, content, message_type, is_read)
    VALUES (
        '00000000-0000-0000-0000-000000000001', -- Destek kullanıcısı ID
        NEW.id,
        'OtoKent''e hoş geldiniz! Araç alım-satım işlemlerinizde size yardımcı olmaktan mutluluk duyarız. Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.',
        'support',
        false
    );
    
    -- Bildirim de ekle
    INSERT INTO notifications (user_id, title, message, type, is_read)
    VALUES (
        NEW.id,
        'Hoş Geldiniz!',
        'OtoKent''e katıldığınız için teşekkürler. Hemen araç aramaya başlayabilirsiniz!',
        'system',
        false
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı kur
DROP TRIGGER IF EXISTS on_user_welcome_message ON users;
CREATE TRIGGER on_user_welcome_message
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION send_welcome_message();

-- 3. EMAİL DOĞRULAMA ZORUNLUĞU (Otomatik Girişi Engelle)
-- ============================================================================

-- Mevcut auto_confirm trigger'ını KALDIR
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
DROP FUNCTION IF EXISTS public.auto_confirm_email();

-- Email doğrulama zorunlu hale geldi!

-- 4. MEVCUT KULLANICILARI ONAR
-- ============================================================================

-- Auth tablosundaki tüm kullanıcıları public.users'a senkronize et
INSERT INTO public.users (id, email, name, surname, role, is_active)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', ''),
    COALESCE(au.raw_user_meta_data->>'surname', ''),
    'user',
    true
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Soft-deleted kullanıcıları aktif et (sadece silinmiş olanlar varsa)
UPDATE public.users 
SET deleted_at = NULL, is_active = true 
WHERE deleted_at IS NOT NULL;

-- ============================================================================
-- 5. DOĞRULAMA SORUGU (Bu script çalıştıktan sonra kontrol et)
-- ============================================================================

-- Kullanıcı sayılarını kontrol et
SELECT 
    (SELECT COUNT(*) FROM auth.users) as auth_users_count,
    (SELECT COUNT(*) FROM public.users) as public_users_count,
    (SELECT COUNT(*) FROM public.users WHERE role = 'admin') as admin_count,
    (SELECT COUNT(*) FROM advertisements WHERE is_active = true) as active_ads_count;
