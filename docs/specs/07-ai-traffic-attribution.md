# Spec 07 — AI Trafik Atıfı (Attribution)

> **Faz:** 3 · **Etki:** Çok yüksek · **Maliyet:** Yüksek
> **Varsayımlar:** Müşteri kendi sitesine küçük bir snippet/tag ekleyebilir; opsiyonel CDN/edge log erişimi.

## Problem

Bu, tüm alanın en büyük zayıf noktası ve en güçlü satış argümanı. Bir karar verici için "ilgili sorguların %31'inde alıntılanıyoruz" ile **"AI aramaları bu çeyrek 43.000 TL pipeline getirdi"** tamamen farklı iki konuşma. Görünürlük skoru soyut; onu **gerçek ziyaret ve dönüşüme** bağlayınca satın alma gerekçesi netleşir. Profound bunu CDN log entegrasyonu + GA4 ile yapıyor; KOBİ için daha hafif bir versiyonu gerekli.

## Kullanıcı hikayesi

> İşletme sahibi olarak, siteme AI asistanlarından (ChatGPT, Perplexity, Gemini, Claude) gelen ziyaretçileri ve bunların dönüşümlerini (form, arama, randevu) görmek istiyorum ki Gauge'a ödediğimin karşılığını görebileyim.

## Kapsam

- **Referrer/UTM tespiti:** AI kaynaklı trafiği tanı (referrer domain + bilinen AI bot/referrer paternleri).
- **Hafif snippet:** müşteri sitesine eklenen JS tag → AI-referred ziyaret + dönüşüm olayları.
- **Opsiyonel edge/CDN log:** daha yüksek doğruluk için (Vercel/Cloudflare log drain).
- Görünürlük ↔ trafik ↔ dönüşüm ilişkisini panoda göster.

## Veri modeli (Prisma)

```prisma
model AiReferral {
  id           String   @id @default(cuid())
  businessId   String
  source       String            // "chatgpt" | "perplexity" | "gemini" | "claude" | "google_ai" | "unknown_ai"
  landingUrl   String
  referrerRaw  String?
  sessionId    String
  converted    Boolean  @default(false)
  conversionType String?         // "form" | "call" | "booking" | "purchase"
  conversionValue Float?
  occurredAt   DateTime @default(now())
  @@index([businessId, occurredAt])
  @@index([businessId, source])
}
```

## Uygulama mantığı

### Tespit (attribution)
AI trafiği üç sinyalden tespit edilir:
1. **Referrer domain**: `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai` vb.
2. **UTM/param**: bazı asistanlar dış linke param ekler.
3. **Edge/CDN log** (opsiyonel): AI bot user-agent'ları (GPTBot, ClaudeBot, PerplexityBot) ve referred ziyaret ayrımı.

### Snippet
```html
<script async src="https://gauge.app/t.js" data-gauge-id="BUSINESS_ID"></script>
```
- Sayfa yüklemesinde referrer'ı sınıfla, `AiReferral` oluştur.
- Dönüşüm olayları: `gauge('conversion', {type:'booking', value: 500})`.

### Doğruluk notu
Referrer bazlı tespit eksik olabilir (asistanlar referrer'ı gizleyebilir). Edge log + referrer birleşimi doğruluğu artırır. Doğruluğu kullanıcıya şeffaf göster ("tahmini alt sınır").

## API

```
POST /api/track                              // snippet → olay yutucu (public, rate-limited)
GET  /api/businesses/:id/attribution         // AI trafik + dönüşüm özeti, kaynak kırılımı
GET  /api/businesses/:id/attribution/roi     // görünürlük → trafik → gelir zinciri
```

## UI

- **ROI paneli:** AI kaynaklı ziyaret sayısı, dönüşüm, tahmini değer; kaynağa (model) göre kırılım.
- Görünürlük skoru ↔ trafik korelasyon grafiği.
- Snippet kurulum sihirbazı (kopyala-yapıştır + doğrulama).

## Kabul kriterleri

- [ ] Snippet AI-referred ziyaretleri kaydediyor, kaynağa göre sınıflıyor.
- [ ] Dönüşüm olayları (form/call/booking) yakalanıyor, değer atanabiliyor.
- [ ] Attribution paneli kaynak kırılımı + tahmini değeri gösteriyor.
- [ ] Doğruluk sınırı kullanıcıya şeffaf ("tahmini alt sınır").
- [ ] `/api/track` rate-limited ve kötüye kullanıma dayanıklı.
- [ ] (Opsiyonel) Edge log drain entegrasyonu doğruluğu artırıyor.

## Görevler

1. [ ] `AiReferral` şema + migrate.
2. [ ] AI referrer sınıflandırma tablosu (domain + UA paternleri).
3. [ ] `t.js` hafif snippet (ziyaret + dönüşüm API'si).
4. [ ] `/api/track` yutucu + rate limit + bot filtreleme.
5. [ ] Attribution aggregation + ROI zinciri servisi.
6. [ ] ROI paneli + korelasyon grafiği + kurulum sihirbazı.
7. [ ] (Opsiyonel) Vercel/Cloudflare log drain adaptörü.
