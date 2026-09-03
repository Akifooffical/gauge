# Spec 04 — Google Business Profile (GBP) Entegrasyonu

> **Faz:** 2 · **Etki:** Çok yüksek · **Maliyet:** Yüksek
> **Varsayımlar:** Google Cloud projesi + Business Profile API erişim onayı (başvuru gerektirir, önceden başlat).
> **Rakip araştırması notu (2026):** Local Falcon artık en ucuz katmanında bile **otomatik
> yorum yanıtı** (AI'ın yorum metnini okuyup uygun bir cevap taslağı üretmesi) bundle'lıyor —
> bu spec'teki writeback mekaniği ("yorum yanıtı" alanı, §Uygulama mantığı/Writeback, kabul
> kriteri "en az ... yorum yanıtı için çalışıyor") zaten bunun ALTYAPISINI kapsıyor, ama
> yanıt METNİNİN otomatik/LLM ile üretilmesi ayrıca belirtilmemişti. Görev 7'ye
> ("Writeback servisi + onay + log") bir alt-adım ekle: yorum metni + puanından LLM ile bir
> yanıt taslağı üret, owner onayladıktan sonra yaz — manuel yazma yerine varsayılan akış bu
> olsun.

## Problem

Yerel işletmede GBP belkemiğidir: profil verisi doğrudan Gemini ve Google AI Mode gibi yerel üretken modelleri besler. Landing'de "Google profil düzeltmeleri" var ama gerçek bir GBP bağlantısı yok. Gauge'un yerel konumlandırması, GBP'yi hem *okuyup* (eksik alan tespiti) hem *yazabildiğinde* (Action Center'dan tek tıkla düzeltme) tamamlanır. Local Falcon/Local Dominator burada güçlü; Gauge'un buraya girmesi şart.

## Kullanıcı hikayesi

> İşletme sahibi olarak GBP'mi bağlamak, eksik/zayıf alanları görmek (kategori, foto, SSS, açıklama, saatler) ve Gauge'un önerdiği düzeltmeleri tek tıkla profile yazmasını istiyorum.

## Kapsam

- **OAuth ile GBP bağlama** (Google Business Profile API).
- Profil verisini çek: kategoriler, açıklama, saatler, fotoğraflar, öznitelikler, Q&A, yorumlar.
- **Eksiklik/kalite tespiti:** doldurulmamış alanlar, zayıf kategori seçimi, az foto, yanıtsız Q&A, yanıtsız yorumlar.
- **Writeback:** Action Center'dan onaylanan düzeltmeleri profile yaz.

## Veri modeli (Prisma)

```prisma
model GbpConnection {
  id             String   @id @default(cuid())
  businessId     String   @unique
  accountId      String
  locationId     String
  accessToken    String   @db.Text     // şifreli sakla
  refreshToken   String   @db.Text     // şifreli sakla
  expiresAt      DateTime
  lastSyncedAt   DateTime?
  createdAt      DateTime @default(now())
}

model GbpSnapshot {
  id             String   @id @default(cuid())
  businessId     String
  primaryCategory String?
  extraCategories String[]
  description    String?  @db.Text
  photoCount     Int
  attributes     Json
  hoursComplete  Boolean
  qaCount        Int
  qaUnanswered   Int
  reviewCount    Int
  reviewAvg      Float?
  reviewUnanswered Int
  completeness   Int              // 0-100 kalite skoru
  capturedAt     DateTime @default(now())
  @@index([businessId, capturedAt])
}
```

## Uygulama mantığı

### Bağlama
1. Google OAuth consent (scope: `https://www.googleapis.com/auth/business.manage`).
2. Hesap → lokasyon seçimi; token'ları **şifreli** sakla.
3. İlk sync: `GbpSnapshot` oluştur.

### Kalite skoru (completeness)
```
completeness = ağırlıklı(
  primaryCategory var mı,
  açıklama uzunluk/kalite,
  photoCount >= eşik,
  saatler tam mı,
  qaUnanswered az mı,
  reviewUnanswered az mı,
  öznitelikler dolu mu
)
```
Her eksik → Action Center'a `FIX_GBP_FIELD` aksiyonu (Spec 03).

### Writeback
- `PATCH` ile profil alanı güncelleme (açıklama, öznitelik, Q&A yanıtı, yorum yanıtı).
- Her writeback kullanıcı onayı gerektirir; log tut.

## API

```
GET  /api/businesses/:id/gbp/connect        // OAuth başlat
GET  /api/gbp/callback                        // OAuth dönüşü
POST /api/businesses/:id/gbp/sync             // snapshot yenile
GET  /api/businesses/:id/gbp/health           // completeness + eksik alanlar
POST /api/businesses/:id/gbp/write            // { field, value } onaylı writeback
```

## UI

- "Google Business Profile bağla" akışı.
- **Profil Sağlığı** kartı: completeness skoru + eksik alan checklist'i.
- Her eksik alan → Action Center'da düzeltme önerisi + "Profile yaz" butonu.
- Yorum/Q&A yanıt kuyruğu.

## Kabul kriterleri

- [ ] OAuth ile GBP bağlanıyor, token'lar şifreli saklanıyor, refresh çalışıyor.
- [ ] Snapshot tüm ana alanları çekiyor; completeness skoru hesaplanıyor.
- [ ] Eksik alanlar Action Center'a `FIX_GBP_FIELD` olarak akıyor.
- [ ] Onaylı writeback en az açıklama + Q&A yanıtı + yorum yanıtı için çalışıyor.
- [ ] Tüm writeback'ler loglanıyor ve geri alınabilir kayıt tutuyor.

## Görevler

1. [ ] Google Cloud'da Business Profile API başvurusu (uzun sürebilir — en başta yap).
2. [ ] OAuth akışı + token şifreleme + refresh.
3. [ ] `GbpConnection` / `GbpSnapshot` şema + migrate.
4. [ ] Profil çekme servisi (kategoriler, açıklama, foto, Q&A, yorumlar).
5. [ ] Completeness skoru + eksik alan tespiti.
6. [ ] Action Center köprüsü (Spec 03).
7. [ ] Writeback servisi + onay + log.
8. [ ] 5 API endpoint'i + UI.

## Uyarı

Business Profile API erişimi Google onayı gerektirir ve haftalar sürebilir; başvuruyu Faz 1 sırasında başlat. Onay gelene kadar UI'ı "manuel GBP kontrol listesi" ile stub'la (kullanıcı elle işaretler), API gelince otomatiğe geçir.
