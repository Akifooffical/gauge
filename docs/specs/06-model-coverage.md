# Spec 06 — Model Kapsamı Genişletme

> **Faz:** 2 (Faz 1 ile paralel gidebilir) · **Etki:** Orta · **Maliyet:** Düşük
> **Varsayımlar:** Mevcut tarama motorunda model başına bir adaptör deseni var.

## Problem

Gauge şu an 4 model + Google izliyor (ChatGPT, Gemini, Claude, Perplexity). Rakiplerde standart kapsam genişledi: Grok, Microsoft Copilot, Meta AI, DeepSeek ve özellikle **Google AI Overviews ile AI Mode ayrımı**. Otterly base planında 4 motor sunuyor; Profound 8+ motor izliyor. "Google" tek kutu olarak yetersiz — AI Overviews, AI Mode ve klasik organik farklı davranır.

## Kullanıcı hikayesi

> İşletme sahibi olarak, müşterilerimin kullandığı tüm AI yüzeylerinde (özellikle Google AI Overviews ve AI Mode ayrı ayrı) görünürlüğümü görmek istiyorum.

## Kapsam

- Yeni model adaptörleri: **Grok, Microsoft Copilot** (öncelik), sonra Meta AI / DeepSeek (opsiyonel).
- **Google'ı üçe ayır:** `google_ai_overviews`, `google_ai_mode`, `google_organic`.
- Model kapsamını **plana bağla** (Başlangıç: temel set, Pro/Ajans: tümü).

## Uygulama mantığı

### Adaptör arayüzü (mevcut deseni koru)
```ts
interface ModelAdapter {
  id: string;                 // "grok" | "copilot" | "google_ai_overviews" | ...
  displayName: string;
  query(prompt: string, opts: { region?: string; location?: LatLng }): Promise<{
    rawAnswer: string;
    citations: RawCitation[];
    mentioned: boolean;
    position: number | null;
  }>;
}
```

### Google ayrıştırma
- `google_ai_overviews`: AI Overview bloğunu yakala (SERP scraping veya sağlayıcı API — ör. SERP API/Bright Data).
- `google_ai_mode`: AI Mode yanıtını yakala.
- `google_organic`: klasik ilk sonuçlar (referans için).

### Plan limiti
```ts
const PLAN_MODELS = {
  starter: ["chatgpt","gemini","google_ai_overviews"],
  pro:     ["chatgpt","gemini","claude","perplexity","grok","copilot","google_ai_overviews","google_ai_mode"],
  agency:  [/* tümü */],
};
```

## API

```
GET /api/models                         // desteklenen modeller + plan erişimi
GET /api/businesses/:id/visibility?groupBy=model   // model kırılımı (yeni modeller dahil)
```

## UI

- Model filtresi/sekmelerine yeni modeller.
- Google'ı 3 alt yüzey olarak göster.
- Plana kapalı modeller "yükselt" rozeti ile görünür (upsell).

## Kabul kriterleri

- [ ] Grok ve Copilot adaptörleri çalışıyor ve tarama pipeline'ına entegre.
- [ ] Google 3 ayrı yüzey olarak taranıp raporlanıyor.
- [ ] Model erişimi plana göre kısıtlanıyor; kapalı modeller upsell olarak gösteriliyor.
- [ ] Yeni modeller citation (Spec 01) ve sentiment (Spec 02) pipeline'larıyla uyumlu.

## Görevler

1. [ ] Grok adaptörü.
2. [ ] Copilot adaptörü.
3. [ ] Google adaptörünü 3'e ayır (overviews / mode / organic) — SERP sağlayıcı entegrasyonu.
4. [ ] Plan-model matrisi + erişim kontrolü.
5. [ ] UI model filtresi + upsell rozetleri.
6. [ ] (Opsiyonel) Meta AI / DeepSeek adaptörleri.
