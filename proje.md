Sen deneyimli bir Full Stack Yazılım Mimarı ve Kıdemli Geliştiricisin. Senden aşağıda belirteceğim teknoloji yığını ve proje mimarisine uygun olarak, projeyi sıfırdan kurmam için gerekli tüm komutları, klasör yapısını ve temel konfigürasyon kodlarını adım adım oluşturmanı istiyorum.

**PROJE TEKNİK DETAYLARI:**

1.  **Ana Teknoloji Yığını:**
    * **Backend & Auth:** Supabase (PostgreSQL, Auth).
    * **Mobile App:** Expo (React Native).
    * **Admin Panel:** Next.js (App Router kullanılarak).
    * **Frontend Web:** Next.js (App Router kullanılarak).
    * **UI Kütüphanesi:** Web tarafları (Admin ve Frontend) için kesinlikle **shadcn/ui** kullanılacak. Mobile tarafında ise NativeWind veya shadcn uyumlu bir stil yapısı kurgulanacak.
    * **Dil:** Tüm projeler **TypeScript** ile oluşturulacak.

2.  **Klasör ve Repo Yapısı (Çok Önemli):**
    * Proje fiziksel olarak tek bir ana klasör altında toplanacak ancak "Monorepo" araçları (Turborepo vb.) *kullanılmayacak*.
    * Ana klasör içinde 3 bağımsız alt klasör olacak:
        1.  `mobileapp` (Expo projesi)
        2.  `admin` (Next.js projesi)
        3.  `frontend` (Next.js projesi)
    * *Kritik Not:* Bu 3 klasörün her biri kendi bağımsız `.git` geçmişine sahip olacak (ayrı ayrı github repoları olacak).

**ADIM ADIM İSTENİLEN ÇIKTI:**

**Aşama 1: Altyapı ve Klasörleme**
* Ana proje klasörünü oluşturma ve içine girme komutları.
* `mobileapp`, `admin` ve `frontend` klasörlerini oluşturup, her biri için ayrı ayrı git init yapma komutları.

**Aşama 2: Mobile App Kurulumu (`mobileapp`)**
* Boş, TypeScript destekli güncel bir Expo projesi kurma komutları.
* Supabase istemci (client) kütüphanesinin kurulumu (`@supabase/supabase-js`).
* Basit bir `lib/supabase.ts` dosya örneği (Environment variable'ları kullanarak).

**Aşama 3: Admin Paneli Kurulumu (`admin`)**
* Next.js (App Router) projesi kurma komutları.
* **shadcn/ui** kurulumu ve init işlemleri.
* Supabase Auth entegrasyonu (SSR desteği ile `@supabase/ssr` kütüphanesi kullanılarak).
* Middleware.ts dosyası oluşturarak sadece giriş yapmış kullanıcıların `/dashboard` gibi korumalı rotalara erişebileceği bir yapı örneği.
* Basit bir Login sayfası ve korumalı Dashboard sayfası kod örneği.

**Aşama 4: Frontend Web Sitesi Kurulumu (`frontend`)**
* Admin panelinden bağımsız, son kullanıcıya hitap edecek boş bir Next.js projesi kurulumu.
* **shadcn/ui** kurulumu.
* Temel proje iskeleti.

**GENEL KURALLAR:**
* Kod bloklarını terminal komutları ve dosya içerikleri olarak ayır.
* Environment variable (.env) dosyalarının nasıl olması gerektiğini (`.env.local` örnekleri) her proje için ayrı ayrı belirt.
* Supabase URL ve ANON KEY'lerin nereye yerleştirileceğini açıkça göster.
* Cevabın uygulanabilir, hatasız ve güncel best-practice'lere uygun olsun.

Lütfen bu yönergeler doğrultusunda kurulum rehberini oluştur.

**PROJE URL BİLGİLERİ (GÜNCEL):**
*   **Web Frontend:** `http://localhost:3000`
*   **Admin Panel:** `http://localhost:3001`
*   **Mobile App:** `http://localhost:3002` (Expo Dev Server)
