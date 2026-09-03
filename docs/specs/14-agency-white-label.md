# Spec 14 — Beyaz Etiket & Ajans Reseller Katmanı

> **Faz:** Yeni yön (zaten satılan bir vaadin karşılığı — 2026 rakip araştırmasında bulundu) · **Etki:** Yüksek (Ajans planının satılabilirliği buna bağlı) · **Maliyet:** Orta
> **Varsayımlar:** F3 (auth + DB, çok-kiracılı veri modeli) tamamlanmış olmalı — bu katman
> doğası gereği "bir hesap, birden fazla müşteri işletme" ilişkisi üzerine kurulu.

## Problem

`src/components/marketing/pricing.tsx`'teki Ajans/Çok-lokasyon planı ($249+/ay) zaten **"Beyaz
etiket raporlar"** ve **"API erişimi"** vaat ediyor — ama bunun için repoda hiçbir tasarım ya
da kod yok. Bu, doldurulmamış bir pazarlama vaadi; ajans müşterisi bu satırı görüp kaydolursa
ürün onu karşılayamaz. Rakip araştırması bunun gerçek bir satın alma motivasyonu olduğunu
doğruluyor: Ayzeo beyaz etiketi ayrı bir ücretli eklenti olarak ($299/ay) satıyor, Local
Dominator planına gömülü sunuyor — ikisi de ajansların bu tür araçları seçme nedeninin tam
merkezinde.

## Kullanıcı hikayesi

> Bir dijital pazarlama ajansı olarak, birden fazla müşterimi tek panodan yönetmek,
> raporları kendi markamla (logo, alan adı, renk) müşteriye sunmak ve gerekirse kendi
> sistemime entegre etmek için salt-okunur bir API istiyorum.

## Kapsam

- **Çok-müşterili ajans hesabı:** bir ajans kullanıcısı, N adet alt-işletme/müşteri yönetir.
- **Beyaz etiket:** Gauge markası kaldırılmış, ajansın logosu/renk paletiyle PDF veya
  paylaşılabilir link rapor.
- **Opsiyonel özel alt-alan** (`rapor.ajansadi.com` → Gauge-hosted) — ileri faz.
- **Salt-okunur REST API** (`/api/v1/...`), ajansın kendi araçlarına veri çekmesi için —
  Spec 13'ün (MCP) ajan-protokolünden farklı, klasik JSON/REST.

## Veri modeli (Prisma)

```prisma
model AgencyAccount {
  id            String   @id @default(cuid())
  ownerId       String   // auth.users referansı (F3)
  name          String
  logoUrl       String?
  brandColor    String?           // hex
  customDomain  String?
  plan          String   @default("agency")
  createdAt     DateTime @default(now())
}

model AgencyClient {
  id              String   @id @default(cuid())
  agencyAccountId String
  agencyAccount   AgencyAccount @relation(fields: [agencyAccountId], references: [id], onDelete: Cascade)
  businessId      String            // F3'teki businesses.id
  addedAt         DateTime @default(now())
  @@unique([agencyAccountId, businessId])
}

model AgencyApiKey {
  id              String   @id @default(cuid())
  agencyAccountId String
  keyHash         String   @unique
  scopes          String[]          // ["visibility:read", "reports:read", ...]
  createdAt       DateTime @default(now())
  revokedAt       DateTime?
}
```

## Uygulama mantığı

1. **Ajans hesabı:** oluşturma + branding ayarları (logo yükle, renk seç).
2. **Müşteri ekleme:** mevcut bir `businesses` kaydını `AgencyClient` olarak bağla ya da
   ajans adına yeni işletme oluştur.
3. **Rapor üretimi:** PDF veya paylaşılabilir link, ajans branding'iyle — Gauge logosu yerine
   ajans logosu; "Gauge ile güçlendirilmiştir" küçük, opsiyonel/kaldırılabilir dipnot.
4. **API:** `Authorization: Bearer <apiKey>`, scope bazlı erişim, plan bazlı rate limit.
5. *(İleri faz)* Özel alt-alan: Vercel Domains API ile otomatik CNAME/alan adı bağlama.

## API

```
POST   /api/agency/clients              // müşteri ekle
GET    /api/agency/clients              // müşteri listesi + hızlı skor özeti
POST   /api/agency/reports/:businessId  // beyaz etiket rapor üret (PDF/link)
GET    /api/agency/api-keys             // key listesi
POST   /api/agency/api-keys             // yeni key (scope seçimli)
DELETE /api/agency/api-keys/:id         // iptal
# Public, key ile:
GET    /api/v1/businesses/:id/visibility
GET    /api/v1/businesses/:id/actions
```

## UI

- **Ajans paneli:** müşteri listesi (her biri için hızlı skor özeti), "Rapor oluştur" butonu.
- **Branding ayarları:** logo yükle, renk seç, (opsiyonel) alan adı.
- **API anahtarları:** key üret/iptal + scope seçimi + dokümantasyon linki.

## Kabul kriterleri

- [ ] Bir ajans hesabı birden fazla müşteri işletmeyi yönetebiliyor.
- [ ] Rapor, Gauge markası yerine ajans branding'iyle üretiliyor.
- [ ] Public API, key ile ve scope/rate limit uygulanarak erişilebiliyor.
- [ ] İptal edilen key erişimi anında kesiyor.
- [ ] *(Opsiyonel)* özel alt-alan çalışıyor.

## Görevler

1. [ ] `AgencyAccount` / `AgencyClient` / `AgencyApiKey` şema + migrate.
2. [ ] Ajans paneli UI (müşteri listesi + ekleme akışı).
3. [ ] Branding ayarları (logo/renk) + rapor şablonuna enjeksiyon.
4. [ ] PDF/paylaşılabilir link rapor üreteci.
5. [ ] Public read-only API (v1) + key yönetimi + scope/rate limit.
6. [ ] *(Opsiyonel)* özel alt-alan bağlama (Vercel Domains API).

## Bağlantılar

- **F3 (auth + DB):** zorunlu ön koşul — bu katman çok-kiracılılık üzerine kurulu.
- **Spec 13 (MCP):** veri servisleri paylaşılabilir (ayrı transport — REST burada, MCP orada
  — ama ikisi de aynı alttaki `getBusinessData`/skor/aksiyon servislerini çağırmalı).

## Rakip referansı

Ayzeo beyaz etiketi $299/ay ayrı eklenti olarak satıyor; Local Dominator planına gömülü
sunuyor (2026 rakip araştırması). Gauge'un kendi pricing sayfası bunu **zaten** Ajans
planının içine dahil ediyor — bu spec o vaadi karşılıyor, fiyatlandırma stratejisini
değiştirmiyor.
