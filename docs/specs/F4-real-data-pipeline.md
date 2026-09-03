# F4 — Gerçek Veri Pipeline (mock'u gerçek taramayla değiştir)

> **Öncelik:** P3 · **Neden:** Pano/rakip/aksiyon hâlâ `mock-data.ts`. Fiyat sayfası "haftalık/günlük tarama" vaat ediyor ama arka plan işi yok.
> **Bağımlılık:** F3 (DB + işletme). Mevcut `/api/free-scan` (Perplexity Sonar) genişletilecek çekirdek.
> **Mevcut durum:** F3'e bağımlı olduğu için başlanmadı. Provider adaptör deseni zaten
> `src/lib/free-scan/provider.ts`'te tek sağlayıcı (Perplexity) için kurulu — bu spec'in
> "provider adaptör katmanı" görevi onu genellemek, sıfırdan tasarlamak değil. Ek sağlayıcılar
> (OpenAI/Gemini/Anthropic) ve SerpAPI için de gerçek API anahtarları gerekecek.

## Kapsam

- Çok-sağlayıcılı tarama (ChatGPT/Gemini/Claude/Perplexity + Google).
- Zamanlanmış otomatik tarama (Inngest).
- Tarama sonuçları → skor/trend/kanal kırılımı → pano/rakip/aksiyon (mock yerine).

## Görevler

1. [ ] **Provider adaptör katmanı** (`src/lib/providers/`): ortak arayüz `query(prompt, {region, location}) → {rawAnswer, mentioned, position, citations}`. Sağlayıcılar: OpenAI, Gemini, Anthropic, Perplexity. `free-scan` mantığını buraya genelle.
2. [ ] **Soru evreni üreteci:** işletme bölge+kategoriden gerçek müşteri sorularını üret (onboarding'de gösterilen "soru evreni").
3. [ ] **Google/SerpAPI:** organik + yerel + AI Overview sonuçları (README adım 3).
4. [ ] **Tarama işi (Inngest):** plana göre haftalık/günlük zamanlanmış tarama; retry + rate limit; sonuçları `scans/scan_results/visibility_scores`'a yaz.
5. [ ] **Skorlama:** anılma + pozisyon + kanal → 0–100 skor + zaman serisi (pano trendini besler).
6. [ ] **`getBusinessData` → DB:** F3'teki veri katmanı artık gerçek tablolardan okusun; `mock-data.ts` kaldırılır/testine indirgenir.
7. [ ] **Aksiyon üretimi:** `recommendations` tablosu; gerçek boşluklardan öneri (schema eksik, bölge sayfası yok, GBP boşluğu, dizin kaydı) — Aksiyon Merkezi'ni gerçek yap.
8. [ ] **Pano tablosu/grafikleri:** "Hangi sorularda görünüyorsun" matrisi ve Recharts grafiklerini gerçek `scan_results` ile doldur (QA'da boş görünen hücreler).

## Kabul kriterleri

- [ ] En az 3 AI sağlayıcısı + Google için gerçek tarama çalışıyor.
- [ ] Zamanlanmış tarama planı kadar otomatik dönüyor (retry/limit ile).
- [ ] Pano/rakip/aksiyon **gerçek** tarama verisinden doluyor; `mock-data.ts` üretimde kullanılmıyor.
- [ ] "Hangi sorularda görünüyorsun" matrisi ve grafikler dolu.
- [ ] Aksiyon önerileri gerçek boşluklardan üretiliyor.

## Sonraki adım

Bu pipeline oturunca, önceki paketlerdeki ileri özellikler bunun üstüne oturur: citation/sentiment (`gauge-specs/01,02`), GBP/geo-grid (`04,05`), ROI/talep (`07,08`), Fact Guard/Agent-Ready (`gauge-agent-ready/10,11,12`).
