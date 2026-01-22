Harika, altyapı kurulumlarını tamamladık. Şimdi "admin" klasörü içindeki Next.js projesi üzerinde geliştirmelere başlıyoruz.

Şu anki görevimiz: **Araç Yönetim Modülü (Vehicle Management) ve QR Kod Entegrasyonu.**
Bu aşamada sadece `admin` projesi üzerinde çalışacağız. `frontend` veya `mobileapp` tarafında işlem yapma.

**TEKNİK GEREKSİNİMLER:**

1.  **Veritabanı (Supabase) Tasarımı:**
    * Supabase üzerinde `vehicles` (araçlar) isminde bir tablo oluşturulması için SQL kodu ver.
    * **Alanlar (Sahibinden.com benzeri detayda):**
        * `id` (uuid, primary key)
        * `brand` (Marka - örn: BMW)
        * `model` (Model - örn: 3.20i)
        * `year` (Yıl - number)
        * `price` (Fiyat - number)
        * `mileage` (KM - number)
        * `fuel_type` (Yakıt Tipi - Enum: Benzin, Dizel, Hibrit, Elektrik)
        * `gear_type` (Vites Tipi - Enum: Manuel, Otomatik)
        * `description` (Açıklama - text)
        * `images` (Resim URL'lerini tutacak Array veya JSONB yapısı)
        * `status` (Durum - Enum: Yayında, Satıldı, Pasif)
        * `created_at` (timestamp)
    * Ayrıca araç resimlerinin yükleneceği `vehicle-images` adında bir **Supabase Storage Bucket** oluşturma ve politika (policy) ayarlarını (public read, auth insert) içeren SQL komutları.

2.  **Admin Paneli Arayüzü (Next.js + shadcn/ui):**
    * `/dashboard/vehicles` rotasında araçların listelendiği bir **Data Table** (shadcn table component).
    * Tabloda resim, marka, model, fiyat, yıl ve işlem butonları (Düzenle, Sil, QR Kod) olacak.
    * `/dashboard/vehicles/new` rotasında araç ekleme formu.
    * Form validasyonu için **Zod** ve **React Hook Form** kullanılacak.
    * Resim yükleme alanı: Kullanıcı birden fazla resim seçebilmeli ve bu resimler Supabase Storage'a yüklenip dönen URL'ler veritabanına kaydedilmeli.

3.  **QR Kod ve Çıktı Modülü:**
    * Araç listesinde veya detayında "QR Kod Oluştur" butonu olacak.
    * Tıklandığında bir Modal (Dialog) açılacak.
    * **QR Mantığı:** QR kodun içeriği şu formatta bir URL olacak: `https://[FRONTEND_URL]/arac/[VEHICLE_ID]` (Frontend URL şimdilik `localhost:3000` veya `.env` dosyasından okunabilir varsayılacak).
    * Kütüphane olarak `react-qr-code` veya benzeri hafif bir paket kullan.
    * Modal içerisinde "Yazdır" butonu olacak. Bu butona basıldığında sadece QR kodun ve araç başlığının/fiyatının olduğu temiz bir alan yazdırılacak (`window.print` ve CSS `@media print` kullanılarak).

**İSTENİLEN ÇIKTI:**
1.  Supabase SQL komutları (Tablo ve Storage için).
2.  `types/index.ts` için TypeScript interface tanımları.
3.  Next.js Server Action dosyası (`actions/vehicle-actions.ts` - ekleme, silme, güncelleme işlemleri için).
4.  Resim yükleme bileşeni kodu.
5.  Araç ekleme formu (`page.tsx` ve form bileşeni).
6.  QR Kod Modal bileşeni ve yazdırma CSS mantığı.

Lütfen kodları modüler, TypeScript kurallarına uygun ve shadcn/ui bileşenlerini kullanarak oluştur.