# Spec 11 — Agent-Ready (Makine-Çağrılabilir Katman)

> **Faz:** Yeni yön · **Etki:** Çok yüksek · **Maliyet:** Yüksek
> **Varsayımlar:** Next.js + TS, PostgreSQL + Prisma. İşletmenin bir domaini var veya Gauge alt-alan/hosted sayfa sağlayabiliyor. GBP (Spec 04) ve Fact Guard (Spec 10) besleme kaynağı.
> **Mevcut durum:** Gerçek üreteç/endpoint yok. Ama konsept zaten Action Center mock verisinde
> öngörülmüş: `src/lib/mock-data.ts`'teki `rec-1` önerisi ("LocalBusiness yapılandırılmış
> verisi eksik") tam olarak bu spec'in üreteceği türden statik bir örnek JSON-LD payload'ı
> içeriyor. Bu spec, o statik örneği gerçek bir üretece (`generate()` + `PotentialAction` +
> zorunlu endpoint kuralı) çevirir.

## Problem

Alışveriş/hizmet "öneri"den "işlem"e kayıyor: ajanlar yapılandırılmış niyeti çözüp katalog/API sorguluyor ve giderek işlem yapıyor. Kritik mekanik: **veri yapılandırılmamışsa ajan işletmeyi aday kümesine ekleyemez** — mağazan var ama işlem bağlamında makine-okunur değilse, ajan için yoksun. Yerel/KOBİ tarafında bunu kuran neredeyse yok; enterprise araçlar (Profound vb.) buraya inmiyor. Bu, Gauge'u "rapor karnesi"nden **kazandıran altyapıya** çeviren hamle.

## Kullanıcı hikayesi

> İşletme sahibi olarak, AI ajanlarının (ChatGPT, Gemini, Copilot) beni doğru bulup, ne yaptığımı anlayıp, benim adıma **randevu/rezervasyon** alabilmesi için gereken makine-yüzlü katmanı (llms.txt, JSON-LD, PotentialAction, Wikidata) tek tıkla kurmak ve ajanların gerçekten işlem yapabildiğini test etmek istiyorum.

## Kapsam

Üç katman:

1. **Keşif katmanı** — ajanların işletmeyi bulup okuması: `llms.txt` + `/.well-known` manifest + LocalBusiness/Service/Offer JSON-LD.
2. **İşlem katmanı** — ajanların **eylem** yapabilmesi: `PotentialAction` (ReserveAction / ScheduleAction / OrderAction) + **gerçek endpoint** + parametre/auth tanımı.
3. **Otorite katmanı** — belirsizlik giderme: Wikidata/entity bağlama + tutarlı `@id` (global primary key).

Artı: **Agent-Readiness testi** — ajanların gerçekten bulup işlem yapabildiğini simüle eden denetim + skor.

## Kritik kural

> `PotentialAction`'ı **gerçek endpoint olmadan** beyan etme. Endpoint yoksa ajan form-scraping'e düşer ve işlem başarısız olur. Her action bir çalışan `target` URL + parametre şeması + auth tanımı içermeli.

## Veri modeli (Prisma)

```prisma
model AgentProfile {
  id             String   @id @default(cuid())
  businessId     String   @unique
  entityId       String?            // Wikidata QID / stable @id
  llmsTxt        String   @db.Text  // üretilen llms.txt
  jsonLd         Json               // LocalBusiness + Service + Offer + PotentialAction
  manifest       Json               // /.well-known/agent-interface.json benzeri
  hostedPath     String?            // Gauge barındırıyorsa
  deployTarget   DeployTarget       // OWN_DOMAIN | GAUGE_HOSTED
  actions        AgentAction[]
  readinessScore Int      @default(0)  // 0-100
  updatedAt      DateTime @updatedAt
}

model AgentAction {
  id             String   @id @default(cuid())
  agentProfileId String
  agentProfile   AgentProfile @relation(fields: [agentProfileId], references: [id], onDelete: Cascade)
  type           AgentActionType     // RESERVE | SCHEDULE | ORDER | CONTACT
  targetUrl      String              // gerçek endpoint
  params         Json                // {date, partySize, service, ...}
  authType       String              // "none" | "apiKey" | "oauth"
  verified       Boolean  @default(false)  // endpoint canlı mı test edildi
  lastTestedAt   DateTime?
}

model ReadinessCheck {
  id             String   @id @default(cuid())
  businessId     String
  model          String
  discovered     Boolean            // ajan işletmeyi buldu mu
  understood     Boolean            // olguları doğru anladı mı
  actionable     Boolean            // eylemi tetikleyebildi mi
  notes          String?  @db.Text
  checkedAt      DateTime @default(now())
  @@index([businessId, checkedAt])
}

enum DeployTarget { OWN_DOMAIN GAUGE_HOSTED }
enum AgentActionType { RESERVE SCHEDULE ORDER CONTACT }
```

## Uygulama mantığı

### 1. Keşif katmanı üretimi
- İşletme türüne göre **LocalBusiness** (+ Restaurant/Dentist/LegalService/AutoRepair alt tipi) JSON-LD üret; Fact Guard ground truth'undan doldur (isim, adres, saat, hizmet, coğrafi koordinat).
- `llms.txt` üret (temiz, düşük-gürültülü özet + önemli sayfa linkleri). Not: llms.txt düz listedir, ilişki modeli yoktur → asıl olgu katmanı JSON-LD.
- `/.well-known/agent-interface.json` manifest: hangi hizmetler + hangi action'lar mümkün.

### 2. İşlem katmanı
- İşletme türüne göre uygun action:
  - Restoran → `ReserveAction` (date, partySize).
  - Klinik/avukat/kuaför → `ScheduleAction` (service, date, duration).
  - E-ticaret/ürün → `OrderAction` / `BuyAction`.
- Her action için **gerçek endpoint** bağla:
  - İşletmenin mevcut rezervasyon sistemi varsa (ör. bir booking sağlayıcı) ona target ver.
  - Yoksa **Gauge-hosted hafif rezervasyon endpoint'i** sun (form + takvim + owner'a bildirim) — böylece endpoint her zaman gerçek olur.
- Parametre şeması + auth tanımı zorunlu.

**Örnek JSON-LD (klinik → ScheduleAction):**
```json
{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": "https://klinikx.com/#business",
  "name": "Klinik X",
  "address": { "@type": "PostalAddress", "streetAddress": "...", "addressLocality": "Kadıköy" },
  "geo": { "@type": "GeoCoordinates", "latitude": 40.99, "longitude": 29.03 },
  "sameAs": ["https://www.wikidata.org/wiki/Q..."],
  "potentialAction": {
    "@type": "ScheduleAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://klinikx.com/book?service={service}&date={date}",
      "httpMethod": "GET",
      "contentType": "text/html"
    },
    "object": { "@type": "Service", "name": "Diş kontrolü" }
  }
}
```

### 3. Otorite katmanı
- Wikidata varlığı yoksa oluşturma rehberi/aksiyonu; varsa `sameAs` + `@id` ile bağla.
- Tüm JSON-LD parçalarını tutarlı `@id` (global primary key) etrafında birleştir.

### 4. Deploy
- **OWN_DOMAIN:** üretilen dosyalar için kopyala-yapıştır + snippet, veya (site erişimi varsa) otomatik enjeksiyon.
- **GAUGE_HOSTED:** Gauge alt-alanında (`isletme.gauge.app`) barındır — sitesi zayıf KOBİ için sıfır-friction yol.

### 5. Agent-Readiness testi
- Gerçek modellerde simüle et: "‹bölge›de ‹hizmet› için randevu al" → ajan işletmeyi buldu mu (discovered), doğru anladı mı (understood), action'ı tetikleyebildi mi (actionable).
- `readinessScore` = discovery + understanding + actionability ağırlıklı.

## API

```
POST /api/businesses/:id/agent-profile/generate   // JSON-LD + llms.txt + manifest üret
GET  /api/businesses/:id/agent-profile            // profil + readinessScore
POST /api/businesses/:id/agent-actions            // action tanımla (endpoint zorunlu)
POST /api/agent-actions/:id/verify                // endpoint canlı mı test et
POST /api/businesses/:id/readiness/test           // agent-readiness denetimi çalıştır
# Gauge-hosted rezervasyon (opsiyonel):
GET  /api/book/:businessId                         // hosted booking endpoint (action target)
POST /api/book/:businessId                         // rezervasyon oluştur + owner bildirimi
# Public discovery (hosted ise):
GET  /.well-known/agent-interface.json
GET  /llms.txt
```

## UI

- **Agent-Readiness paneli:** 0–100 skor + üç halka (Bulundu / Anlaşıldı / İşlem-yapılabilir).
- **Kurulum sihirbazı:** işletme türü → önerilen action → endpoint bağla (kendi sistemi veya Gauge-hosted) → deploy.
- Üretilen JSON-LD / llms.txt için kopyala-indir + "canlı mı" doğrulama rozeti.
- **Test sonuçları:** hangi modelde bulundu/işlem yapılabildi; başarısızsa neden + düzeltme (Action Center).

## Kabul kriterleri

- [ ] İşletme türüne göre geçerli LocalBusiness alt tipi + Service + Offer JSON-LD üretiliyor, ground truth'tan doluyor.
- [ ] `llms.txt` + `/.well-known` manifest üretiliyor.
- [ ] En az `ReserveAction` ve `ScheduleAction` için **gerçek endpoint'li** PotentialAction üretiliyor.
- [ ] Endpoint'i olmayan action **kaydedilemiyor** (kural zorunlu); Gauge-hosted booking fallback çalışıyor.
- [ ] Wikidata/`@id` ile entity bağlama destekleniyor.
- [ ] Agent-readiness testi discovered/understood/actionable ölçüp skor üretiyor.
- [ ] Deploy iki yolla (own domain / Gauge-hosted) çalışıyor.
- [ ] Başarısız testler Action Center'a düzeltme aksiyonu üretiyor.

## Görevler

1. [ ] `AgentProfile` / `AgentAction` / `ReadinessCheck` + enum'lar şema + migrate.
2. [ ] JSON-LD üreteç (işletme türü → doğru schema.org tipi + Service/Offer).
3. [ ] llms.txt + `/.well-known/agent-interface.json` üreteç.
4. [ ] PotentialAction üreteç + **endpoint zorunluluğu** validasyonu.
5. [ ] Gauge-hosted booking endpoint (form + takvim + owner bildirimi).
6. [ ] Wikidata/entity bağlama + tutarlı `@id`.
7. [ ] Deploy (own domain snippet + Gauge-hosted).
8. [ ] Agent-readiness test motoru (discovered/understood/actionable).
9. [ ] 6+ API endpoint + public discovery route'ları.
10. [ ] Agent-Readiness paneli + kurulum sihirbazı UI.

## Referans

Action Schema, klasik siteyi agentic ticaret katmanına bağlayan köprü ve tam API stratejisi gerektirmiyor. Gerçek saha örneği: bir restoran `ReserveAction` ekleyince 4 hafta içinde rezervasyonlarının %7'si ChatGPT/AI Overviews üzerinden, %81 dönüşümle geldi. En kritik hata gerçek endpoint olmadan yalnızca `PotentialAction` beyan etmek — bu spec o hatayı kural düzeyinde engeller.
