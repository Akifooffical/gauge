# Spec 13 — MCP (Model Context Protocol) Sunucusu

> **Faz:** Yeni yön (rakip paritesi — 2026 rakip araştırmasında bulundu) · **Etki:** Orta-Yüksek · **Maliyet:** Düşük-Orta
> **Varsayımlar:** Next.js API route MCP transport'unu (streamable HTTP) barındırabiliyor. API
> key sahipliği için bir kullanıcı/işletme sistemi gerekir (F3).
> **Not:** Bu spec, Spec 11 (Agent-Ready)'den **farklı bir yön**. Spec 11, müşterinin
> *işletmesini* ajanlara açar (bir müşteri "randevu al" desin diye). Bu spec, Gauge'un
> *kendi verisini* ajanlara açar (bir pazarlamacının kendi AI asistanı panoya girmeden veri
> sorgulasın diye). İkisini karıştırma.

## Problem

Peec AI, Otterly, Local Falcon ve Rankscale — hepsi artık kendi verilerini bir **MCP sunucusu**
üzerinden AI ajanlarına/IDE'lere (Claude Desktop, Cursor, Claude Code vb.) açıyor. Bu, artık
"nice to have" değil, kategori standardı: pazarlamacı panoya girmeden kendi AI asistanına "bu
haftaki görünürlük skorum ne, hangi sorularda rakibim önde" diye sorup cevap alabiliyor.
Gauge, "AI-native" konumlandırmasına rağmen bu olmadan kendi verisine sadece web panosundan
erişilebilen klasik bir SaaS gibi kalıyor — kendi iddiasıyla çelişen bir boşluk.

## Kullanıcı hikayesi

> İşletme sahibi/ajans olarak, Claude Desktop veya Cursor gibi bir AI aracına bağlı bir MCP
> sunucusu üzerinden "bu haftaki görünürlük skorum ne", "hangi sorularda rakibim önde",
> "en son taramada hangi kaynaklar beni destekliyor" gibi soruları panoya girmeden sorup cevap
> almak istiyorum.

## Kapsam

- MCP sunucusu (streamable HTTP transport, resmi `@modelcontextprotocol/sdk` — TypeScript).
- Kimlik doğrulama: kullanıcıya özel, panoda üretilen API key.
- Salt-okunur araçlar (tools) — ilk sürüm:
  - `get_visibility_score` — güncel skor + trend.
  - `get_competitor_comparison` — rakip kıyası (Spec 05'in de girdisi olabilir).
  - `get_citation_gaps` — Spec 01'in boşluk tespiti.
  - `get_recommended_actions` — Spec 03'ün öncelikli aksiyon listesi.
  - `get_geo_grid_summary` — Spec 05 ısı verisi özeti (varsa).
- Yazma/aksiyon tetikleme (ör. "şu aksiyonu tamamlandı işaretle") **ileri faz**, ilk sürüm
  salt-okunur.

## Veri modeli (Prisma)

```prisma
model McpApiKey {
  id          String   @id @default(cuid())
  businessId  String
  keyHash     String   @unique
  label       String            // "Claude Desktop", "Cursor" gibi kullanıcı etiketi
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())
  revokedAt   DateTime?
  @@index([businessId])
}
```

## Uygulama mantığı

1. Kullanıcı panodan bir MCP API key üretir (yalnızca üretim anında tam gösterilir, sonra hash'lenir).
2. `POST /api/mcp`, MCP protokolünü (JSON-RPC üzerinden `tools/list`, `tools/call`) uygular;
   `Authorization` header'daki key'i `keyHash` ile doğrular.
3. Her tool, ilgili spec'in **zaten var olan/planlı servis fonksiyonunu** çağırır — yeni bir
   veri katmanı kurmuyoruz, mevcut servisleri MCP transport'u arkasına koyuyoruz.
4. Rate limit: API key başına dakika/gün limiti, plana göre (free-scan'deki desenin aynısı).
5. `lastUsedAt` her çağrıda güncellenir — panoda "en son ne zaman kullanıldı" gösterilebilir.

## API

```
POST   /api/mcp                              // MCP JSON-RPC endpoint (tools/list, tools/call)
POST   /api/businesses/:id/mcp-keys          // yeni key üret
GET    /api/businesses/:id/mcp-keys          // key listesi (hash'siz, sadece label+lastUsedAt)
DELETE /api/mcp-keys/:id                     // iptal et
```

## UI

- **Ayarlar → "MCP / Ajan Erişimi" paneli:** key üret/iptal et; Claude Desktop/Cursor için
  kopyala-yapıştır kurulum snippet'i (`~/.config/claude/claude_desktop_config.json` benzeri).
- Key listesi: etiket, oluşturulma tarihi, son kullanım, iptal butonu.

## Kabul kriterleri

- [ ] `tools/list` en az 5 aracı doğru JSON şemasıyla listeliyor.
- [ ] Her araç gerçek işletme verisinden doğru sonuç dönüyor (ilgili spec'in gerçek veri
  katmanına bağlı — o spec'ler henüz mock ise bu araç da mock'tan okur, tutarlı kalsın).
- [ ] API key üretimi/iptali çalışıyor; iptal edilen key erişimi anında kesiyor.
- [ ] Claude Desktop veya Cursor ile uçtan uca test edildi — gerçek bir MCP client'tan
  bağlanıp en az bir araç başarıyla çağrılabiliyor.
- [ ] Rate limit plana göre uygulanıyor.

## Görevler

1. [ ] `@modelcontextprotocol/sdk` ile protokol handler'ı (`tools/list`, `tools/call`).
2. [ ] `McpApiKey` şema + migrate; key üretim/hash/doğrulama.
3. [ ] 5 salt-okunur tool implementasyonu (ilgili spec'lerin servislerine bağlan).
4. [ ] Rate limit (plan bazlı).
5. [ ] Ayarlar UI — key yönetimi + kurulum talimatı.
6. [ ] Claude Desktop/Cursor ile uçtan uca manuel test.

## Bağımlılık

Spec 01/03/05'in veri servisleri (araçların çağırdığı gerçek fonksiyonlar) · F3'ün auth
sistemi (key'in bir işletmeye/kullanıcıya ait olması için).

## Rakip referansı

Peec AI, Otterly, Local Falcon ve Rankscale şu an MCP sunucusu sunuyor (2026 rakip
araştırması) — bu artık "farklılaşma" değil, "eksik olursa geri kalma" kategorisi.
