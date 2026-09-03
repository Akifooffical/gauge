# F3 — Kalıcılık & Kimlik (Onboarding gerçekten kaydetsin)

> **Öncelik:** P2 · **Neden:** Onboarding veriyi kaydetmiyor; tüm uygulama tek mock işletmeyi (Vera Diş Kliniği) gösteriyor. Ürünü "demo"dan "gerçek"e taşıyan adım.
> **Stack:** README'nin önerdiği gibi Supabase (PostgreSQL + Auth). Next.js App Router.
> **Mevcut durum:** Başlanmadı — bilinçli olarak. Bu spec gerçek bir Supabase projesi
> (URL + anon key + service role key) gerektiriyor; bunları ben (ajan) oluşturamam/
> uyduramam. Yarım bir auth/DB katmanı kurup env değişkenleri olmadan deploy etmek, şu an
> **çalışan** mock deneyimi bozar ("sitenin tamamının çalışır durumda olması" isteğiyle
> çelişir). Sen bir Supabase projesi kurup `.env.local.example`'daki (yorum satırındaki)
> `SUPABASE_*` değişkenlerini doldurduğunda bu spec'i uygulamaya hazırım.

## Kapsam

- Kullanıcı kaydı/oturumu (Supabase Auth).
- İşletme + bölge + kategori + rakip verisini kalıcı yaz.
- Uygulama sayfaları mock yerine oturumdaki işletmeden okusun.

## Veri modeli (README'deki tablolarla uyumlu)

`businesses`, `locations`, `categories`, `competitors`, `queries`, `scans`, `scan_results`, `visibility_scores`, `recommendations` + **RLS** (her kullanıcı yalnız kendi verisini görür).

```sql
-- örnek çekirdek
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) not null,
  name text not null,
  plan text default 'starter',
  created_at timestamptz default now()
);
create table locations ( id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade, label text, lat float8, lng float8 );
create table categories ( id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade, name text );
create table competitors ( id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade, name text, domain text );
-- RLS: owner_id = auth.uid()
```

## Görevler

1. [ ] Supabase projesi + `.env`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
2. [ ] Auth: e-posta/OAuth ile kayıt-giriş; korumalı rotalar (`/dashboard`, `/onboarding`, `/competitors`, `/actions` oturum ister).
3. [ ] Şema + RLS politikaları (yukarıdaki tablolar).
4. [ ] **Onboarding'i gerçek yap:** sihirbaz veriyi `businesses/locations/categories/competitors`'a yazsın; bitince `/dashboard`'a oturumdaki işletmeyle gitsin.
5. [ ] **`mock-data.ts`'i soyutla:** uygulama sayfaları veriyi tek bir `getBusinessData(businessId)` katmanından çeksin; bu katman şimdilik mock, F4'te DB'ye döner. (README zaten bunu öngörüyor.)
6. [ ] Boş durum: henüz taraması olmayan yeni işletme için "ilk taramanı başlat" ekranı.
7. [ ] Plan alanı (starter/pro/agency) kota kontrolü için hazır dursun (F5 ile bağlanır).

## Kabul kriterleri

- [ ] Kullanıcı kayıt olup giriş yapabiliyor; oturum korunuyor.
- [ ] Onboarding'de girilen işletme **kaydediliyor** ve pano onu gösteriyor (artık Vera sabiti değil).
- [ ] RLS ile kullanıcı yalnızca kendi verisini görüyor.
- [ ] Veri erişimi tek katmandan geçiyor (mock→DB geçişi F4'te tek yerden).
- [ ] Yeni işletmede anlamlı boş durum var.
