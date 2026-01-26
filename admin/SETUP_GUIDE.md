# Supabase Setup ve Test Rehberi

## 1️⃣ RLS Politikalarını Güncelle

### Adım 1: Supabase Dashboard'a Git
1. https://supabase.com adresine git
2. Projenize giriş yapın
3. Sol menüden **SQL Editor**'ı seçin

### Adım 2: SQL Script'i Çalıştır
1. "New Query" butonuna tıklayın
2. `d:\Webisse\otokentapp\admin\fix_rls_policies.sql` dosyasının içeriğini kopyalayıp yapıştırın
3. **RUN** butonuna tıklayın (veya Ctrl+Enter)
4. ✅ "Success. No rows returned" mesajını görmelisiniz

Bu script şunları ekler:
- ✅ Admin'lerin reklam ekleyebilmesi için INSERT policy
- ✅ Admin'lerin reklam güncelleyebilmesi için UPDATE policy  
- ✅ Admin'lerin reklam silebilmesi için DELETE policy
- ✅ FAQ, Policy ve Notification tabloları için de aynı yetkiler

---

## 2️⃣ Kullanıcı Profil Sorununu Çöz

### Seçenek A: Mevcut Kullanıcıyı Kontrol Et

SQL Editor'da şunu çalıştırın:
```sql
-- Auth tablosundaki kullanıcıları göster
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Public users tablosundaki kullanıcıları göster
SELECT id, email, name, surname, role, is_active, deleted_at
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;
```

**Durum 1:** Kullanıcı `auth.users`'da var ama `public.users`'da yok
→ Trigger çalışmamış, manuel ekle:
```sql
-- Kendi email'inizi buraya yazın
INSERT INTO public.users (id, email, name, surname, role, is_active)
SELECT id, email, 
       COALESCE(raw_user_meta_data->>'name', 'Kullanıcı'), 
       COALESCE(raw_user_meta_data->>'surname', ''),
       'user',
       true
FROM auth.users 
WHERE email = 'YOUR_EMAIL@example.com' -- Buraya kendi emailinizi yazın
ON CONFLICT (id) DO NOTHING;
```

**Durum 2:** Kullanıcı her iki tabloda da var ama `deleted_at` dolu
→ Kullanıcıyı restore et:
```sql
UPDATE public.users 
SET deleted_at = NULL, is_active = true 
WHERE email = 'YOUR_EMAIL@example.com'; -- Buraya kendi emailinizi yazın
```

### Seçenek B: Admin Hesabını Manuel Oluştur

Kendi hesabınıza admin yetkisi vermek için:
```sql
-- Önce kullanıcınızın ID'sini bulun
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';

-- Sonra role'ü admin yapın
UPDATE public.users 
SET role = 'admin', is_active = true, deleted_at = NULL
WHERE email = 'YOUR_EMAIL@example.com';
```

---

## 3️⃣ Test Et

### A) Araç Listesini Test Et
1. **Admin Panel** (http://localhost:3002) - Araçlar bölümünden yeni araç ekle
   - Status: "Yayında" (Active) seçili olmalı
2. **Mobil App** - Ana ekranda yeni eklediğiniz aracı görebilmelisiniz
   - ✅ HomeScreen artık `status='active'` sorgusu yapıyor

### B) Reklam Bannerlarını Test Et
1. **Admin Panel** → İçerik Yönetimi → Reklam Görselleri
2. "Yeni Reklam Ekle" butonuna tıklayın
3. Örnek:
   - Başlık: "Test Reklamı"
   - Görsel URL: `https://picsum.photos/800/400`
   - Sıra: 0
   - Aktif: ✅ İşaretli
4. Kaydet
5. **Mobil App** - Ana ekran headerında reklam görünmeli

### C) Kullanıcı Yönetimini Test Et
1. **Admin Panel** → Kullanıcılar
2. Giriş yaptığınız hesabı görmelisiniz
3. Eğer görmüyorsanız yukarıdaki SQL komutlarını çalıştırın

---

## 🐛 Sorun Giderme

### "Error fetching user" hatası alıyorum
- RLS politikalarını kontrol edin: Admin olarak işaretli misiniz?
```sql
SELECT id, email, role, is_active FROM public.users WHERE email = 'YOUR_EMAIL';
```

### Mobil app'de araçlar görünmüyor
- Araçların status'ünü kontrol edin:
```sql
SELECT id, title, status FROM vehicles ORDER BY created_at DESC LIMIT 5;
-- Status 'active' olmalı
```

### Reklam banner'ları görünmüyor
1. SQL Editor'da kontrol edin:
```sql
SELECT * FROM advertisements WHERE is_active = true;
```
2. Eğer boşsa, RLS politikalarını çalıştırdınız mı?
3. Admin panel'den reklam eklemeyi deneyin

---

## ✅ Başarı Kontrol Listesi

- [ ] `fix_rls_policies.sql` script'i Supabase'de çalıştırıldı
- [ ] Admin panel'de kullanıcı profili görünüyor
- [ ] Admin panel'den reklam eklenebiliyor
- [ ] Mobil app'de araçlar görünüyor
- [ ] Mobil app header'ında reklam banner'ları dönüyor
