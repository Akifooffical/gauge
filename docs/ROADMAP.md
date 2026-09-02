# Gauge — Öncelikli Ürün Yol Haritası

Bu yol haritası, 9 eksik özelliği **build sırasına** göre 3 faza böler. Sıra; etki × maliyet × bağımlılık üçgenine göre kurgulandı. Her özelliğin detay spec'i `specs/` altında.

> **Not:** "Etki" = farklılaşma + satın alma gerekçesi. "Maliyet" = mühendislik eforu. Efor tahminleri 1 orta seviye full-stack geliştirici içindir.

---

## FAZ 1 — "Ölçmekten kanıtlamaya" (0–6 hafta)

Amaç: Mevcut ölçüm motorunun ürettiği "anılıyor musun / kaçıncısın" verisini **eyleme ve açıklamaya** çevirmek. Hepsi aynı tarama pipeline'ının üstüne oturur, yeni altyapı istemez. En yüksek farklılaşma / en düşük maliyet burada.

| # | Özellik | Etki | Maliyet | Bağımlılık |
|---|---------|------|---------|------------|
| 01 | Citation & Source Intelligence | Çok yüksek | Orta | Mevcut tarama motoru |
| 02 | Sentiment Analizi | Yüksek | Düşük | 01 (aynı yanıt verisi) |
| 03 | Action Center | Çok yüksek | Orta | 01, 02 |

**Faz 1 çıktısı:** Gauge artık "rakibin senden önde çünkü AI şu 3 kaynaktan besleniyor, sende bu kaynaklar eksik → şu 5 işi bu sırayla yap" diyebiliyor. Bu, Peec'in "Actions" ve Local Falcon'un "kaynak analizi" ile aynı sınıfa çıkarır.

---

## FAZ 2 — "Yerel moat" (6–14 hafta)

Amaç: Gauge'un asıl konumlandırması olan **bölge + kategori** avantajını, enterprise rakiplerin (Profound vb.) giremediği yerel katmanla derinleştirmek. Yerel sorgularda AI'ın alıntıladığı kaynakların ~%86'sı işletmenin *sahip olduğu* kaynaklar (site, GBP, listeler) — bu fazın tamamı oraya oynar.

| # | Özellik | Etki | Maliyet | Bağımlılık |
|---|---------|------|---------|------------|
| 04 | Google Business Profile Entegrasyonu | Çok yüksek | Yüksek | Google API onayı |
| 05 | Geo-grid Görselleştirme | Yüksek | Orta | Tarama motoruna konum parametresi |
| 06 | Model Kapsamı Genişletme | Orta | Düşük | Mevcut model adaptör katmanı |

**Faz 2 çıktısı:** "Kadıköy'de güçlüsün, Ataşehir'de rakip önde" gibi ilçe kırılımı + GBP eksik alan tespiti + otomatik düzeltme. Local Falcon / Local Dominator ile rekabet, ama daha ucuz ve Türkçe pazara oturmuş.

---

## FAZ 3 — "Gelir kanıtı ve büyüme" (14–24 hafta)

Amaç: Satın alma gerekçesini soyut skordan somut gelire taşımak ve kendi kendine büyüyen bir huni kurmak.

| # | Özellik | Etki | Maliyet | Bağımlılık |
|---|---------|------|---------|------------|
| 07 | AI Trafik Atıfı (Attribution) | Çok yüksek | Yüksek | Müşteri sitesine snippet/edge |
| 08 | Prompt Hacmi / Talep Zekası | Yüksek | Yüksek | Veri kaynağı stratejisi |
| 09 | Ücretsiz Grader Hunisi | Orta | Düşük | Landing'deki mevcut "30 saniye" bölümü |

**Faz 3 çıktısı:** "AI aramaları bu ay sana 12 randevu getirdi" diyebilmek — tüm alanın en büyük zayıf noktası ve en güçlü satış argümanı. 09 ise CAC'ı düşüren self-servis huni.

---

## Hızlı kazanımlar (sıra beklemeden yapılabilir)

- **09 (Grader hunisi)** teknik olarak küçük — ve çekirdeği zaten üretimde (`/api/free-scan`, bkz. `docs/specs/09-free-grader-funnel.md` → "Mevcut durum"); kalan iş e-posta duvarı + kalıcılık + Spec 08'e besleme, Faz 1 ile paralel yürüyebilir.
- **06 (Model kapsamı)** yeni model adaptörü eklemek düşük efor; Faz 1 ile paralel gidebilir.

## Bağımlılık grafiği (özet)

```
Tarama Motoru (mevcut)
   ├── 01 Citation Intelligence
   │      ├── 02 Sentiment
   │      └── 03 Action Center ──────────────┐
   ├── 05 Geo-grid (konum parametresi)       │
   └── 06 Model kapsamı                       │
                                              │
Google API ── 04 GBP Entegrasyonu ───────────┤ (Action Center'a besleme)
Edge/Snippet ─ 07 Attribution                 │
Veri kaynağı ─ 08 Prompt Hacmi ───────────────┘
Landing ────── 09 Grader Hunisi
```
