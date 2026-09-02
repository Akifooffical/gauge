# Spec 08 — Prompt Hacmi / Talep Zekası

> **Faz:** 3 · **Etki:** Yüksek · **Maliyet:** Yüksek
> **Varsayımlar:** Bir talep-verisi kaynağı stratejisi seçildi (aşağıya bak).

## Problem

Şu an prompt'lar elle/otomatik üretiliyor ama **hangi soruların gerçekten sorulduğu** bilinmiyor. Profound'un en büyük farklılaşması bu: milyarlarca prompt'u ticari açıdan anlamlı konulara kümeleyip gerçek "AI arama talebini" gösteriyor — hangi soruları önceliklendireceğini ve markanın görünmesi gerekirken görünmediği boşlukları buradan çıkarıyorsun. KOBİ için bunun yerel + kategori ölçeğinde bir versiyonu değerli.

## Kullanıcı hikayesi

> İşletme sahibi olarak, kategorimde/bölgemde insanların AI'a neyi ne sıklıkla sorduğunu görmek istiyorum ki en çok sorulan ama benim görünmediğim sorulara öncelik vereyim.

## Veri kaynağı stratejisi (bir veya birkaçını seç)

KOBİ ölçeğinde Profound'un milyarlarca-prompt dataseti yok; pragmatik proxy'ler:

1. **Arama hacmi proxy'si:** Google Keyword Planner / arama trendleri + "people also ask" verisini kategori-bölge sorularına eşle. (En ucuz, hemen başlanır.)
2. **Kendi grader/tarama verisi:** Kullanıcıların Gauge grader'ında (Spec 09) girdiği gerçek sorgular → anonim, agregat talep sinyali. (Ürün büyüdükçe güçlenir — veri uçurumu avantajı.)
3. **Snippet arama verisi:** Attribution snippet'i (Spec 07) üzerinden site içi arama + AI-referred landing sorguları.
4. **Üçüncü parti prompt veri sağlayıcısı** (varsa/bütçe uygunsa).

> Öneri: Faz 3'te (1) ile başla, (2)'yi zamanla biriktir. (2) uzun vadede en savunulabilir moat.

## Veri modeli (Prisma)

```prisma
model PromptDemand {
  id            String   @id @default(cuid())
  category      String
  region        String
  promptText    String
  cluster       String            // konu kümesi
  intent        Intent
  demandScore   Int               // 0-100 tahmini hacim
  source        String            // "keyword_proxy" | "grader" | "snippet" | "provider"
  updatedAt     DateTime @updatedAt
  @@index([category, region])
  @@index([cluster])
}
enum Intent { COMMERCIAL INFORMATIONAL NAVIGATIONAL LOCAL }
```

## Uygulama mantığı

- **Toplama:** seçilen kaynaklardan kategori-bölge sorularını çek.
- **Kümeleme:** benzer soruları konu kümelerine ayır (embedding + kümeleme).
- **Niyet sınıflama:** ticari/bilgi/yerel.
- **Boşluk çapraz-referansı:** yüksek `demandScore` + senin görünmediğin (Spec 01 mentioned=false) sorgular → Action Center'da en üst öncelik.

## API

```
GET /api/demand?category=&region=&sort=demandScore
GET /api/businesses/:id/demand-gaps    // yüksek talep + düşük görünürlük kesişimi
```

## UI

- **Talep Gezgini:** kategori-bölge için konu kümeleri, hacim, niyet.
- Isı tablosu: talep (yüksek→düşük) × senin görünürlüğün → "yüksek talep, sen yoksun" hücreleri kırmızı.
- Bir hücreden tek tıkla Action Center aksiyonu.

## Kabul kriterleri

- [ ] En az bir veri kaynağından kategori-bölge talep sorguları toplanıyor.
- [ ] Sorular konu kümelerine ayrılıp `demandScore` atanıyor.
- [ ] Demand-gaps endpoint'i yüksek-talep/düşük-görünürlük kesişimini veriyor.
- [ ] UI talep gezgini + boşluk ısı tablosu render ediyor.
- [ ] Kaynak (2) için grader/tarama sorguları anonim agregat olarak besleniyor.

## Görevler

1. [ ] `PromptDemand` + `Intent` şema + migrate.
2. [ ] Kaynak (1) toplayıcı (keyword/trends proxy).
3. [ ] Embedding + kümeleme servisi.
4. [ ] Niyet sınıflayıcı.
5. [ ] Demand × görünürlük çapraz-referans servisi.
6. [ ] 2 API endpoint'i + Talep Gezgini UI.
7. [ ] Kaynak (2) besleme hattı (grader/tarama → anonim agregat).
