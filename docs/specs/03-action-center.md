# Spec 03 — Action Center (Aksiyon Motoru)

> **Faz:** 1 · **Etki:** Çok yüksek · **Maliyet:** Orta
> **Varsayımlar:** Spec 01 (citations/gaps) ve Spec 02 (sentiment) uygulandı.
> **Mevcut durum:** UI kabuğu ve veri şekli zaten var — `src/app/(app)/actions/page.tsx` +
> `src/components/actions/recommendation-card.tsx`, `src/lib/mock-data.ts`'teki
> `recommendations` dizisinden (mock) besleniyor. Bu spec, mock'un yerini gerçek
> `impactScore` motoruna ve gerçek sinyallere (Spec 01/02) bırakır — kart/durum/liste UI'ını
> yeniden kurmaya gerek yok, sadece veri kaynağını değiştir.

## Problem

Gauge landing'i "Düzelt: neden görünmediğini söyler, işi yaparız" vaat ediyor. Bu vaadin arkasını doldurmak gerekiyor: bulguları (kaynak boşlukları, olumsuz sentiment, eksik GBP alanları, düşük pozisyon) **önceliklendirilmiş, tek-tıkla çıktı üreten** bir yapılacaklar listesine çevirmek. Peec'in "Actions" modülü, kendisini düz bir dashboard'dan tam burada ayırıyor: kaynak verisini önceliklendirilmiş bir görev listesine dönüştürüyor. Otterly/BeVisible eleştirisi de aynı: "görünürlük verisi, kaynağa dayalı içerik ve site güncellemesine dönüşmedikçe işe yaramaz."

## Kullanıcı hikayesi

> İşletme sahibi olarak, tüm bulgulardan bana "bu hafta şu 5 işi bu sırayla yap, en yüksek etkisi olan üstte" diyen tek bir liste istiyorum — ve mümkünse çıktısını (içerik, schema, GBP metni) üretmeni istiyorum.

## Kapsam

- Tüm sinyalleri (source gap, sentiment, position, GBP eksikleri, schema eksikleri) tek bir **öncelik motorunda** birleştir.
- Her aksiyon: başlık, gerekçe, tahmini etki, efor, ilgili sorgu/kaynak, durum.
- **Tek-tıkla çıktı üreteci:** aksiyon türüne göre (bölge sayfası taslağı, JSON-LD schema, GBP açıklama metni, yorum toplama e-postası, listicle outreach taslağı).

## Veri modeli (Prisma)

```prisma
model Action {
  id           String   @id @default(cuid())
  businessId   String
  type         ActionType
  title        String
  rationale    String   @db.Text
  impactScore  Int              // 0-100 öncelik skoru
  effort       Effort
  status       ActionStatus @default(TODO)
  sourceRef    Json?            // {promptId?, citationId?, mentionId?, gbpField?}
  generatedOutput String? @db.Text  // üretilen çıktı (varsa)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  @@index([businessId, status])
  @@index([businessId, impactScore])
}

enum ActionType {
  CREATE_LOCATION_PAGE
  ADD_STRUCTURED_DATA      // JSON-LD schema
  FIX_GBP_FIELD
  BUILD_CITATION           // dizin/listeleme kaydı
  EARN_EDITORIAL           // listicle/blog outreach
  COLLECT_REVIEWS
  IMPROVE_SENTIMENT
  ANSWER_QA
}
enum Effort { LOW MEDIUM HIGH }
enum ActionStatus { TODO IN_PROGRESS DONE DISMISSED }
```

## Öncelik motoru

`impactScore` = ağırlıklı toplam:

```
impactScore =
   w1 * (kaç rakibin önde olduğu / boşluğun büyüklüğü)
 + w2 * (sorgunun tahmini talep hacmi — Spec 08 gelene kadar kategori popülerliği proxy'si)
 + w3 * (sentiment olumsuzsa ek ağırlık)
 + w4 * (owned/GBP kaynağıysa — düzeltmesi kolay + yüksek getirili, çünkü yerelde citation'ların ~%86'sı owned)
 − w5 * (effort)
```

Owned/GBP tipindeki boşluklar en yüksek önceliğe çıkar (ucuz + kontrol sende).

## Çıktı üreteci (generator)

Her `ActionType` için bir generator fonksiyonu (LLM destekli):

| Type | Üretilen çıktı |
|------|----------------|
| CREATE_LOCATION_PAGE | Bölge + kategori odaklı sayfa taslağı (H1/H2, SSS, yerel sinyaller) |
| ADD_STRUCTURED_DATA | Kopyala-yapıştır JSON-LD (LocalBusiness / FAQPage) |
| FIX_GBP_FIELD | GBP alanı için önerilen metin (Spec 04 ile yazılabilir) |
| EARN_EDITORIAL | AI'ın alıntıladığı yayına outreach e-posta taslağı |
| COLLECT_REVIEWS | Yorum isteme mesajı + hangi platform |
| ANSWER_QA | GBP Q&A / site SSS için soru-cevap çiftleri |

## API

```
GET   /api/businesses/:id/actions?status=&sort=impact
POST  /api/businesses/:id/actions/refresh      // sinyalleri yeniden hesapla, aksiyon üret
POST  /api/actions/:id/generate                // çıktı üret
PATCH /api/actions/:id                          // status güncelle
```

## UI

- **Aksiyon Merkezi:** öncelik sırasıyla kart listesi; her kartta etki/efor rozeti, gerekçe, "Çıktı üret" butonu.
- Durum sütunları (Yapılacak / Yapılıyor / Bitti).
- Üretilen çıktı için kopyala / indir; GBP'ye doğrudan yaz (Spec 04 bağlıysa).

## Kabul kriterleri

- [ ] Tüm sinyal kaynakları (gap, sentiment, position) aksiyona dönüşüyor.
- [ ] `impactScore` deterministik ve açıklanabilir (gerekçe gösteriliyor).
- [ ] Owned/GBP boşlukları üst sıralarda çıkıyor.
- [ ] En az 4 `ActionType` için çalışan çıktı üreteci var.
- [ ] Aksiyon durumu güncellenebiliyor; "refresh" mükerrer aksiyon üretmiyor (dedup).
- [ ] UI önceliğe göre sıralı, çıktı üret + kopyala çalışıyor.

## Görevler

1. [ ] `Action` + enum'lar şema + migrate.
2. [ ] Öncelik motoru servisi (`scoreActions`) + açıklanabilir gerekçe.
3. [ ] Sinyal → aksiyon dönüştürücü (`buildActionsFromSignals`) + dedup.
4. [ ] Generator registry (ActionType başına fonksiyon), en az 4 tür.
5. [ ] 4 API endpoint'i.
6. [ ] Aksiyon Merkezi UI (kart + durum + üret/kopyala).
7. [ ] GBP writeback köprüsü (Spec 04 varsa aktifleşir).
