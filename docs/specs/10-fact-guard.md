# Spec 10 — Fact Guard (Doğruluk / Olgu Motoru)

> **Faz:** Yeni yön · **Etki:** Çok yüksek · **Maliyet:** Orta
> **Varsayımlar:** Next.js + TS, PostgreSQL + Prisma, mevcut tarama motoru (Spec 01–02) ve tercihen GBP entegrasyonu (Spec 04) var. Fikir ayrı; entegrasyon bağımlı.
> **Mevcut durum:** Henüz yok — Spec 01/02/04 gibi kalıcı veri katmanı gerektiriyor, onlar da
> 0'dan başlıyor. Tek hazır parça: "olgu-çıkaran tarama" adımı (§Uygulama mantığı 2), grounded
> sorgu çalıştırmak için `src/lib/free-scan/provider.ts`'teki `askGrounded()`'ı aynen
> kullanabilir — yeni bir model-sorgulama katmanı kurmaya gerek yok, sadece soru şekli
> ("X'in çalışma saatleri nedir?") ve sonrasındaki parse/karşılaştırma adımı yeni.

## Problem

Rakiplerin tamamı "anılıyor musun / kaçıncısın"a bakıyor ama geliri asıl etkileyen **doğruluk**: AI senin çalışma saatini, adresini, fiyatını, verdiğin hizmeti, kabul ettiğin sigortayı, uzmanlığını yanlış söylüyorsa görünür olsan bile müşteriyi kaybedersin. Bir de bonus: **olgular stabildir**, sıralamalar değil — yani bu modül, kategorinin "her çalıştırmada farklı cevap" (determinizm) sorununu **aşar**. Ölçtüğün şey dalgalanan bir sıra değil, doğru/yanlış bir olgu.

## Kullanıcı hikayesi

> İşletme sahibi olarak, AI'ların (ChatGPT, Gemini, Claude, Perplexity, Google AI) benim hakkımda söylediği bilgilerin doğru olup olmadığını görmek; yanlış/eski bilgiyi yakalayıp, AI'ın güvendiği kaynaklara (GBP, sitem, Wikidata, yorum siteleri) düzeltmeyi tek yerden sürmek istiyorum.

## Kapsam

- İşletmenin **doğrulanmış olgu seti** ("ground truth") tanımlanır (owner + GBP + site).
- Modeller düzenli olarak **olgu çıkaran** sorularla sorgulanır ("X'in çalışma saatleri / adresi / hizmetleri / fiyatı nedir?").
- AI'ın verdiği olgular ground truth ile karşılaştırılır → **doğru / yanlış / eksik / eski** durumu.
- Yanlışın **kaynağı** izlenir (AI hangi kaynaktan yanlış öğrenmiş — Spec 01 citation'a bağlanır).
- Düzeltme aksiyonları üretilir (GBP writeback, schema, Wikidata, yorum sitesi güncellemesi) → Action Center (Spec 03).

## Veri modeli (Prisma)

```prisma
model FactSet {
  id          String   @id @default(cuid())
  businessId  String   @unique
  facts       Fact[]
  updatedAt   DateTime @updatedAt
}

model Fact {
  id          String   @id @default(cuid())
  factSetId   String
  factSet     FactSet  @relation(fields: [factSetId], references: [id], onDelete: Cascade)
  key         FactKey            // HOURS, ADDRESS, PHONE, PRICE, SERVICE, INSURANCE, CERT, SPECIALTY, ...
  label       String             // "Cumartesi çalışma saati"
  truthValue  String             // doğrulanmış değer
  source      String             // "owner" | "gbp" | "site" | "wikidata"
  verifiedAt  DateTime
  checks      FactCheck[]
}

model FactCheck {
  id          String   @id @default(cuid())
  factId      String
  fact        Fact     @relation(fields: [factId], references: [id], onDelete: Cascade)
  model       String
  aiValue     String?  @db.Text    // AI'ın söylediği
  verdict     FactVerdict           // CORRECT | INCORRECT | OUTDATED | MISSING | UNVERIFIABLE
  citationId  String?               // yanlışın olası kaynağı (Spec 01)
  checkedAt   DateTime @default(now())
  @@index([factId, checkedAt])
  @@index([verdict])
}

enum FactKey { HOURS ADDRESS PHONE PRICE SERVICE INSURANCE CERT SPECIALTY PAYMENT AREA_SERVED OTHER }
enum FactVerdict { CORRECT INCORRECT OUTDATED MISSING UNVERIFIABLE }
```

## Uygulama mantığı

### 1. Ground truth toplama
- Onboarding'de owner temel olguları girer; GBP (Spec 04) ve site schema'dan otomatik doldur.
- Her olgu `source` + `verifiedAt` ile damgalanır; owner onayı "doğrulanmış" sayılır.

### 2. Olgu-çıkaran tarama
- Genel görünürlük sorgularından ayrı, **hedefli olgu soruları** çalıştır: "‹İşletme›, ‹bölge› çalışma saatleri nedir?", "‹İşletme› hangi hizmetleri veriyor?".
- Yapısal çıkarım: yanıttan olgu değerini parse et (LLM yardımıyla normalize et — saat formatı, fiyat vb.).

### 3. Karşılaştırma
- `aiValue` vs `truthValue` normalize edilip kıyaslanır → `verdict`.
- Determinizm için: her olguyu N kez çalıştır, **çoğunluk verdict** + tutarlılık yüzdesi göster ("saatler modellerin %70'inde yanlış").

### 4. Kaynak izleme + düzeltme
- Yanlış cevabın geldiği yanıttaki citation'ları (Spec 01) `citationId` ile bağla → "AI bu yanlışı şu kaynaktan öğrenmiş".
- Her yanlış/eksik/eski olgu için Action Center'a düzeltme aksiyonu:
  - GBP alanı yanlışsa → `FIX_GBP_FIELD` (writeback, Spec 04).
  - Site'de eksikse → `ADD_STRUCTURED_DATA` (doğru JSON-LD üret).
  - Otorite eksikse → Wikidata/entity aksiyonu (Spec 11 ile).

## API

```
GET  /api/businesses/:id/facts                 // ground truth seti
PUT  /api/businesses/:id/facts                 // owner düzenlemesi
POST /api/businesses/:id/facts/scan            // olgu-çıkaran tarama çalıştır
GET  /api/businesses/:id/facts/report          // olgu × model doğruluk matrisi + tutarlılık
GET  /api/businesses/:id/facts/errors          // yanlış/eski/eksik + kaynak + önerilen düzeltme
```

## UI

- **Doğruluk Skoru:** kaç olgu × kaç modelde doğru (0–100) + trend.
- **Olgu × Model matrisi:** satır=olgu, sütun=model, hücre renk (yeşil doğru / kırmızı yanlış / sarı eski / gri eksik).
- Bir hücreye tıkla: AI'ın söylediği vs gerçek + "AI bunu şu kaynaktan öğrenmiş" (citation) + "Düzelt" butonu (Action Center).
- **Kritik uyarı bandı:** "AI 3 modelde saatlerini yanlış söylüyor" gibi yüksek-etkili yanlışlar üstte.

## Kabul kriterleri

- [ ] Ground truth seti owner + GBP + site'den kuruluyor, owner onaylayabiliyor.
- [ ] Olgu-çıkaran tarama modellerden olgu değerlerini parse edip normalize ediyor.
- [ ] Her olgu için `verdict` üretiliyor; N-çalıştırma çoğunluk + tutarlılık yüzdesi gösteriliyor.
- [ ] Yanlış cevap, onu üreten kaynağa (citation) bağlanabiliyor.
- [ ] Her yanlış/eksik/eski olgu Action Center'a doğru düzeltme aksiyonu üretiyor.
- [ ] UI olgu × model matrisi + doğruluk skoru + kritik uyarı bandı render ediyor.

## Görevler

1. [ ] `FactSet` / `Fact` / `FactCheck` + enum'lar şema + migrate.
2. [ ] Ground truth toplayıcı (owner form + GBP + site schema import).
3. [ ] Olgu-çıkaran tarama seti + yanıt→olgu parser (LLM normalize).
4. [ ] Karşılaştırma + N-çalıştırma çoğunluk/tutarlılık motoru.
5. [ ] Citation bağlama (Spec 01) — yanlışın kaynağı.
6. [ ] Düzeltme aksiyon köprüsü (Spec 03 / 04 / 11).
7. [ ] 5 API endpoint'i.
8. [ ] Doğruluk skoru + matris + kritik uyarı UI.

## Referans

Kategori giderek "pozisyon tırmanmak yerine yanlışları düzelt" (correction over optimization) ve "anahtar kelime değil varlık izle" yönüne kayıyor; Fact Guard bu tezi ürünleştirir. Anılmayı değil doğruluğu ölçmek, geliri etkileyen ama neredeyse hiç kimsenin çözmediği boşluk.
