# Spec 01 — Citation & Source Intelligence

> **Faz:** 1 · **Etki:** Çok yüksek · **Maliyet:** Orta
> **Varsayımlar:** Next.js + TS, PostgreSQL + Prisma, mevcut bir tarama motoru (AI modellerine prompt sorup yanıt kaydeden) zaten var.
> **Mevcut durum:** Kalıcı saklama/sınıflandırma yok. Ama `src/lib/free-scan/provider.ts`
> (`askGrounded`) Perplexity Sonar'dan zaten ham `citations` alanını çekip `sources: string[]`
> olarak döndürüyor, `ScanResult.tsx` bunları "Kaynaklardan bazıları" diye gösteriyor. Bu
> spec'in extraction adımı (bkz. "Uygulama mantığı" §1) o ham veriyi Citation modeline
> yazmakla başlayabilir — sıfırdan bir citation-çekme mekanizması kurmaya gerek yok.

## Problem

Gauge şu an "anılıyor musun, kaçıncı sırada" verisini topluyor. Ama işletme sahibinin asıl ihtiyacı: **"AI beni değil rakibimi önerirken hangi kaynaktan besleniyor?"** Yerel sorgularda AI'ın alıntıladığı kaynakların ezici çoğunluğu işletmenin sahip olduğu/etkileyebileceği kaynaklar (kendi sitesi, Google Business Profile, dizin listeleri, yorumlar, Reddit/forum, listicle blogları). Bu kaynakları görünür kılmadan "Düzelt" adımı boşta kalır. Local Falcon ve Peec AI'ın en çok övülen özelliği tam bu.

## Kullanıcı hikayesi

> Bir klinik sahibi olarak, "bölgemde en iyi diş kliniği" sorgusunda rakibimin çıkmasını sağlayan kaynakları (hangi site, hangi sayfa, hangi tür) görmek istiyorum ki hangi kaynağa yatırım yapacağımı bileyim.

## Kapsam

- Her tarama yanıtından **alıntılanan kaynakları (citations)** çıkar ve sakla.
- Kaynakları **domain türü** ve **sayfa türü** olarak sınıflandır.
- "Kaynak haritası" görünümü: bir sorguda seni ve her rakibi hangi kaynakların desteklediği.
- **Boşluk tespiti:** rakibi destekleyip seni desteklemeyen kaynaklar.

## Veri modeli (Prisma)

```prisma
model ScanResult {
  id          String   @id @default(cuid())
  businessId  String
  promptId    String
  model       String            // "chatgpt" | "gemini" | "claude" | "perplexity" | "google"
  region      String
  category    String
  rawAnswer   String   @db.Text
  mentioned   Boolean
  position    Int?              // yanıt içindeki sıra (null = anılmadı)
  scannedAt   DateTime @default(now())
  citations   Citation[]
  mentions    BrandMention[]
  @@index([businessId, promptId, scannedAt])
}

model Citation {
  id            String   @id @default(cuid())
  scanResultId  String
  scanResult    ScanResult @relation(fields: [scanResultId], references: [id], onDelete: Cascade)
  url           String
  domain        String
  domainType    DomainType        // sınıflandırma sonucu
  pageType      PageType?
  supportsBrand String?           // bu kaynağın hangi markayı desteklediği (self | rakip adı)
  title         String?
  createdAt     DateTime @default(now())
  @@index([domain])
  @@index([scanResultId])
}

enum DomainType {
  OWNED           // müşterinin kendi sitesi
  GBP             // Google Business Profile
  DIRECTORY       // dizin/listeleme (yelp benzeri, sektörel dizinler)
  REVIEW          // yorum siteleri
  FORUM           // reddit, ekşi, forumlar
  EDITORIAL       // blog / listicle / haber
  SOCIAL          // sosyal medya
  COMPETITOR      // rakibin kendi sitesi
  OTHER
}

enum PageType {
  HOMEPAGE
  LOCATION_PAGE
  LISTICLE
  REVIEW_PAGE
  QA
  ARTICLE
  PROFILE
  OTHER
}
```

## Uygulama mantığı

### 1. Alıntı çıkarımı (extraction)
Tarama motoru zaten yanıt alıyor. İki kaynak var:
- **Web-arama destekli modeller** (Perplexity, ChatGPT search, Gemini): API yanıtında yapısal `citations` / `sources` alanı döner → doğrudan al.
- **Alıntı dönmeyen yanıtlar:** yanıt metnindeki URL'leri regex ile çıkar + gerekirse ikinci bir LLM çağrısıyla "bu yanıttaki iddiaları hangi kaynaklar destekliyor" sorusuyla zenginleştir.

### 2. Sınıflandırma (classification)
Her citation için:
1. `domain` = URL'den host çıkar.
2. `domainType`:
   - Müşterinin bilinen domain'iyle eşleşiyorsa → `OWNED`
   - `google.com/maps` / `maps.google` / business profile pattern → `GBP`
   - Bilinen rakip domain listesi → `COMPETITOR`
   - Kalanı için kural tablosu + fallback LLM sınıflandırması (tek batch çağrısı, maliyet düşük).
3. `pageType`: URL yapısı + sayfa başlığından çıkarım (LLM batch).
4. `supportsBrand`: yanıt metninde bu URL hangi markanın yanında geçiyor.

### 3. Boşluk tespiti (gap detection)
```
gaps = rakipleri destekleyen domainler − seni destekleyen domainler
```
Bunu `domainType`'a göre grupla: örn. "3 listicle rakibi anıyor, seni anmıyor" → yüksek öncelikli boşluk.

## API

```
GET  /api/businesses/:id/citations
     ?promptId=&model=&region=&from=&to=
     → { citations: [...], groupedByDomainType: {...} }

GET  /api/businesses/:id/source-map?promptId=
     → { self: [Citation], competitors: { [name]: [Citation] }, gaps: [Citation] }

GET  /api/businesses/:id/source-gaps
     → öncelik sırasına dizilmiş boşluk listesi (Action Center'a beslenir)
```

## UI

- **Kaynak Haritası paneli:** seçilen sorgu için sen vs rakipler; her sütunda o markayı destekleyen kaynaklar, `domainType` renk kodlu.
- **Boşluk tablosu:** "Rakipte var, sende yok" — domain, tür, kaç rakibi destekliyor, aksiyon önerisi.
- Domain türüne göre filtre; zaman içinde kaynak kazanımı trendi.

## Kabul kriterleri

- [ ] Her `ScanResult` için citation'lar çıkarılıp saklanıyor (web-arama modellerinde en az %90 yakalama).
- [ ] Her citation `domainType` ile sınıflandırılıyor; `OWNED`/`GBP`/`COMPETITOR` kural tabanlı %100 doğru.
- [ ] Source-map endpoint'i bir sorgu için sen + her rakip için kaynak listesini döndürüyor.
- [ ] Boşluk tespiti, rakibi destekleyip seni desteklemeyen domainleri öncelik sırasıyla veriyor.
- [ ] UI'da bir sorgu seçince kaynak haritası ve boşluk tablosu render oluyor.
- [ ] LLM sınıflandırma maliyeti tarama başına makul (batch, tekrar-sorgu cache'li).

## Görevler

1. [ ] `Citation` + enum'ları şemaya ekle, migration çalıştır.
2. [ ] Tarama motoruna citation extraction adımı ekle (web-arama modelleri için yapısal alan; diğerleri için regex + opsiyonel LLM zenginleştirme).
3. [ ] `classifyDomain()` yardımcı fonksiyonu: kural tablosu + LLM fallback (batch + cache).
4. [ ] `classifyPageType()` yardımcı fonksiyonu (LLM batch).
5. [ ] `supportsBrand` çözümleyici: yanıt metninde URL–marka eşleştirmesi.
6. [ ] Gap detection servisi (`computeSourceGaps`).
7. [ ] 3 API endpoint'i.
8. [ ] Kaynak Haritası + Boşluk tablosu UI bileşenleri.
9. [ ] Testler: bilinen bir yanıt fixture'ı üzerinden extraction + classification.

## Rakip referansı

Peec AI kaynakları domain türü + sayfa türüne göre sınıflar ve bunu aksiyona çevirir. Local Falcon AI platformlarının gerçekte hangi kaynakları alıntıladığını gösterir, böylece kullanıcı nereye odaklanacağını bilir. Bu spec o standardı yakalar.
