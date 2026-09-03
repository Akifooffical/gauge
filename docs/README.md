# Gauge — Eksik Özellik Build Paketi

Bu paket, Gauge'u rakiplerinden (Profound, Peec AI, Otterly, Local Falcon, Local Dominator,
Dageno) ayıran/eksik kalan özelliklerin **implementasyon spec'lerini** içerir. Her spec, VS
Code içinde bir kodlama ajanına (Claude Code, Cursor, Copilot) doğrudan verilebilecek şekilde
yazıldı.

> Canlı ürün: https://gauge-seven-tau.vercel.app · Repo: bu depo (`Akifooffical/gauge`).

## 0. Önce: sitenin gerçekten çalışır durumda olması (F1–F5)

Özellik eklemeden önce **temel doğru mu** sorusu var — [`QA-REPORT.md`](./QA-REPORT.md)
sitenin fonksiyonel taramasını, `docs/specs/F1-F5-*.md` de düzeltme adımlarını içeriyor:

| # | Spec | Öncelik | Durum |
|---|------|---------|-------|
| F1 | Deployment erişimi + grader anahtarı | P0 | ✅ Kod tarafı tamam — `PERPLEXITY_API_KEY`'i Vercel'e eklemen kalıyor |
| F2 | Nav/buton düzeltmeleri | P1 | ✅ Tamamlandı (7/8 görev; kalan tek madde F3'e bağlı) |
| F3 | Kalıcılık & kimlik (Supabase) | P2 | ⛔ Gerçek Supabase projesi/anahtarları bekliyor |
| F4 | Gerçek veri pipeline (çok-sağlayıcılı tarama) | P3 | ⛔ F3'e bağımlı |
| F5 | Ödeme (Stripe) | P4 | ⛔ F3'e bağımlı + gerçek Stripe hesabı bekliyor |

F1/F2 bu depoda kod tarafıyla tamamlandı (detay her spec'in "Mevcut durum" notunda). F3–F5,
sahibinin sağlaması gereken gerçek servis hesapları/anahtarları olmadan güvenle
uygulanamaz — yarım bir auth/DB katmanı, şu an çalışan mock deneyimini bozar. Sen bu
hesapları/anahtarları sağladığında sırayla devam edilebilir.

## Nasıl kullanılır (VS Code + Claude Code)

1. Bu paket zaten bu deponun `docs/` klasöründe.
2. Önce yukarıdaki F1–F5 durumuna bak; sonra `ROADMAP.md` ile 01–09 spec sırasını, aşağıdaki
   "İkinci yön" ve "Üçüncü yön" bölümleriyle 10–14'ün sırasını belirle.
3. Bir özelliği hayata geçirmek için ajana şunu ver:

   > `docs/specs/01-citation-source-intelligence.md` dosyasını oku ve "Görevler" bölümündeki checklist'i sırayla uygula. Her adımda mevcut kod tabanına uyum sağla, "Kabul Kriterleri" karşılanana kadar devam et.

4. Ajan bittiğinde `Kabul Kriterleri` listesini test kriteri olarak kullan.
5. Her spec'in üstünde artık bir **"Mevcut durum"** satırı var (bu depoya özel, eklendi) —
   sıfırdan mı başlanıyor yoksa var olan bir parçanın üstüne mi inşa ediliyor, önce onu oku.

## Mevcut kod tabanı durumu (bu depoya özel not)

Bu repo şu an **frontend MVP** — landing, pano, onboarding, rakip radarı ve aksiyon merkezi
gerçek tasarımla ama çoğunlukla mock veriyle çalışıyor (bkz. kök `README.md`). Aşağıdaki
"Varsayılan teknik stack" bölümü, spec'ler yazılırken siteye bakılarak **tahmin edilmiş**;
gerçek plan (kök `README.md` → "Sonraki adımlar") Supabase (Postgres + Auth) + Inngest'i
öngörüyor, Prisma/Neon/Vercel Postgres seçimi henüz kesinleşmedi. Bir spec'e başlamadan önce
o spec'in "Varsayımlar" satırını gerçek seçimle güncelle.

**Zaten var olan, spec'lerle kesişen parçalar** (sıfırdan başlama, üstüne inşa et):

- **Spec 09 (Ücretsiz Grader Hunisi)** — çekirdeği zaten üretimde: `/api/free-scan` gerçek
  zamanlı Perplexity Sonar sorgusu çalıştırıyor, sonuç landing'in final-CTA bölümünde canlı.
  Detay için spec dosyasındaki "Mevcut durum"a bak.
- **Spec 03 (Action Center)** — `/actions` sayfası + `recommendation-card.tsx` ile UI kabuğu
  ve veri şekli zaten var (mock `recommendations` dizisi). Gerçek sinyal motoruna bağlamak
  kalıyor.
- **Spec 01 (Citation Intelligence)** — kalıcı saklama/sınıflandırma yok, ama
  `src/lib/free-scan/provider.ts` zaten Perplexity'den ham `sources` (citation URL) döndürüyor.
- **Spec 05 (Geo-grid)** — bu spec'in ürün/API tasarımına ek olarak, aynı özelliğin daha
  derin teknik tasarımı (grid matematiği, Google-vs-AI sorgu stratejisi, harita kütüphanesi
  kıyası, maliyet fazları) için bkz. [`geo-grid-lokasyon-analizi.md`](./geo-grid-lokasyon-analizi.md).

## Bu klasördeki diğer dosyalar

- [`QA-REPORT.md`](./QA-REPORT.md) — sitenin fonksiyonel tarama raporu (§0'a bak).
- [`STRATEGY.md`](./STRATEGY.md) — Spec 10–12'nin ("Agent-Readiness" yönü) konumlandırması,
  gerekçesi ve dürüst riskleri. Bu üç spec'e başlamadan önce oku.
- [`geo-grid-lokasyon-analizi.md`](./geo-grid-lokasyon-analizi.md) — Spec 05'i tamamlayan,
  daha derin teknik tasarım dokümanı; Spec 12'nin harita kütüphanesi seçimi de burada.
- [`maliyet-modeli.xlsx`](./maliyet-modeli.xlsx) — abonelik/tarama maliyeti girip brüt marj,
  CAC, LTV ve başabaş noktasını gördüğün Excel modeli.

## Varsayılan teknik stack (siteye bakılarak tahmin edildi)

Site Vercel üzerinde olduğu için spec'ler şunu varsayar. Farklıysa spec başındaki "Varsayımlar"
satırını güncelle:

- **Framework:** Next.js (App Router) + TypeScript
- **DB:** PostgreSQL (Supabase / Neon / Vercel Postgres)
- **ORM:** Prisma (veya Drizzle)
- **Background jobs:** Vercel Cron + Queue (Inngest / Trigger.dev önerilir — tarama işleri için)
- **AI sorgu katmanı:** Model API'leri (OpenAI, Google Gemini, Anthropic, Perplexity) + web arama destekli
- **Deploy:** Vercel

## İçindekiler

| # | Spec | Faz | Neyi çözer | Mevcut durum |
|---|------|-----|------------|--------------|
| 01 | Citation & Source Intelligence | 1 | AI *neden* seni değil rakibini anıyor — hangi kaynaktan besleniyor | ❌ Yok — ama ham citation verisi zaten toplanıyor |
| 02 | Sentiment Analizi | 1 | Anılıyorsun ama *nasıl* — olumlu/nötr/olumsuz | ❌ Yok |
| 03 | Action Center (aksiyon motoru) | 1 | Bulguları önceliklendirilmiş yapılacak listesine çevirme | ⚠️ UI kabuğu var (mock veri) |
| 04 | Google Business Profile Entegrasyonu | 2 | Yerel AI görünürlüğün belkemiği | ❌ Yok |
| 05 | Geo-grid Görselleştirme | 2 | Hizmet bölgesi boyunca nerede güçlü/zayıfsın | ❌ Yok — ek teknik tasarım dokümanı mevcut |
| 06 | Model Kapsamı Genişletme | 2 | Grok, Copilot, Google AI Overviews/AI Mode ayrımı | ❌ Yok |
| 07 | AI Trafik Atıfı (Attribution) | 3 | "AI beni anıyor" değil "AI bana X müşteri getirdi" | ❌ Yok |
| 08 | Prompt Hacmi / Talep Zekası | 3 | İnsanlar kategorinde AI'a neyi ne sıklıkla soruyor | ❌ Yok |
| 09 | Ücretsiz Grader Hunisi | 3 | Kartsız tek-seferlik skor → kayıt dönüşümü | ✅ Çekirdek çalışıyor — e-posta duvarı ve kalıcılık eksik |
| 10 | Fact Guard (Doğruluk Motoru) | Yeni yön | AI'ın işletme hakkındaki olguları doğru mu söylüyor — izle, yakala, düzelt | ❌ Yok — grounded sorgu altyapısı (`askGrounded`) yeniden kullanılabilir |
| 11 | Agent-Ready (Makine-Çağrılabilir Katman) | Yeni yön | Ajanlar seni bulup **işlem** yapabilsin — llms.txt, JSON-LD, PotentialAction, Wikidata | ❌ Yok — konsept Action Center mock'unda (`rec-1`) statik örnek olarak var |
| 12 | Canlı Harita & Navigasyon | Yeni yön | Görünürlük ısı katmanı + harita sağlığı + navigasyon/işlem, canlı | ❌ Yok — girdileri (05, 10, 11) de henüz yok |
| 13 | MCP Sunucusu | Rakip paritesi | Gauge'un kendi verisini AI ajanlarına/IDE'lere (Claude Desktop, Cursor) açar | ❌ Yok |
| 14 | Beyaz Etiket & Ajans Katmanı | Rakip paritesi | Ajans planının zaten vaat ettiği beyaz etiket rapor + API erişimini karşılar | ❌ Yok — plan sayfasında satılıyor, uygulaması yok |

Ek: `COMPETITOR-COMPARISON.md` — satış/yatırımcı sunumu için karşılaştırma tablosu (§5a'da
13/14'ü tetikleyen 2026 rakip araştırması var).

## İkinci yön: Agent-Readiness (Spec 10–12)

Spec 01–09 rakiplerle aynı kategoride ("AI görünürlük takibi") boşlukları kapatır. Spec 10–12
farklı bir bahis: Gauge'u o kategoriden tamamen çıkarıp **"AI/agent hazırlık katmanı"**na
taşımak — AI seni *doğru* tanır, ajanlar seni *bulup işlem yapabilir*, görünürlük bu döngünün
geri-besleme sinyali olur. Konumlandırma, riskler ve "neden bu yön" gerekçesi için önce
[`STRATEGY.md`](./STRATEGY.md)'yi oku.

- **Uygulama sırası:** 11 (Agent-Ready, en somut ROI) → 10 (Fact Guard, güven/retention) → 12
  (Canlı Harita, ikisini görselleştiren katman).
- **Önceki paketle bağ:** Spec 04 (GBP) → 10 ve 12'nin yer gerçeği kaynağı · Spec 05 (Geo-grid)
  → 12'nin ısı verisi · Spec 03 (Action Center) → 10 ve 11'in bulgularını aksiyona çevirir.
- **Kritik kural (Spec 11):** `PotentialAction` gerçek bir endpoint olmadan asla beyan
  edilmez — endpoint yoksa ajan form-scraping'e düşer.

## Üçüncü yön: Rakip Paritesi (Spec 13–14)

3 Eylül 2026'da yapılan bir rakip araştırması turu, mevcut 12 spec'in hiçbirinin kapsamadığı
iki somut boşluk buldu — detay ve kaynaklar `COMPETITOR-COMPARISON.md` §5a'da:

- **Spec 13 (MCP Sunucusu):** Peec AI, Otterly, Local Falcon, Rankscale artık kendi verilerini
  AI ajanlarına/IDE'lere MCP üzerinden açıyor; bu kategori standardı haline geldi.
- **Spec 14 (Beyaz Etiket & Ajans Katmanı):** `pricing.tsx`'teki Ajans planı zaten "Beyaz
  etiket raporlar" + "API erişimi" vaat ediyor ama hiç tasarlanmamış — Ayzeo ve Local
  Dominator'ın gerçekten sattığı bir şeyi Gauge sadece fiyat sayfasında listeliyor.

İkisi de F3'ün (auth + çok-kiracılı DB) üzerine oturur, dolayısıyla F3'ten önce
uygulanamaz — sıra: F3 → (11/10/12 veya 01–09, öncelik tercihine göre) → 13/14.

## Öncelik mantığı

- **Faz 1** en ucuz + en yüksek farklılaşma: hepsi mevcut ölçüm motorunun üzerine eklenir, yeni altyapı gerektirmez. Ürünün "ölçüyorum ama kanıtlayamıyorum / düzeltemiyorum" tuzağından çıkmasını sağlar.
- **Faz 2** Gauge'un asıl konumlandırması olan **yerel/bölgesel** moat'ı kurar. Enterprise rakipler burada zayıf.
- **Faz 3** gelir kanıtı ve büyüme hunisi — satın alma gerekçesini ("ROI") ve müşteri kazanımını güçlendirir.
