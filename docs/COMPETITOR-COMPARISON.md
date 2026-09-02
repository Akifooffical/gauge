# Gauge — Rakip Karşılaştırması (Satış & Yatırımcı)

> Kaynak: Haziran–Ağustos 2026 tarihli kamuya açık rakip incelemeleri ve ürün sayfaları. Fiyatlar zamanla değişebilir; sunum öncesi güncelle.

## 1. Konumlandırma haritası

AEO/GEO (AI görünürlük) alanı iki eksende ayrışıyor: **ölçek** (yerel ↔ global/enterprise) ve **derinlik** (sadece izleme ↔ izleme + düzeltme/aksiyon).

```
                 ENTERPRISE / GLOBAL
                        ▲
             Profound   │
        (derin veri,    │
         pahalı, satış  │
         görüşmesi)     │
                        │   Dageno / BeVisible
                        │   (izleme + execution)
   ── sadece izleme ────┼──────── izleme + aksiyon ──►
    Otterly             │
    (ucuz, sığ)         │   Peec AI (sentiment + actions)
                        │
        Local Falcon /  │   ◄── GAUGE'un hedefi:
        Local Dominator │       yerel + kategori odaklı,
        (yerel, harita) │       ölç→karşılaştır→düzelt,
                        ▼       KOBİ fiyatı, TR pazarı
                   YEREL / KOBİ
```

**Gauge'un boş alanı:** yerel/bölgesel KOBİ + gerçek düzeltme (aksiyon) + uygun fiyat + Türkçe pazar. Enterprise oyuncular buraya inmiyor (pahalı, satış-görüşmesi-gerektiren); saf izleme araçları düzeltmiyor.

## 2. Özellik karşılaştırma matrisi

Lejant: ✅ var · ⚠️ kısmi/eklenmeli · ❌ yok · 🎯 Gauge için önerilen (bu paketteki spec)

| Özellik | Gauge (bugün) | Gauge (spec sonrası) | Profound | Peec AI | Otterly | Local Falcon |
|---|---|---|---|---|---|---|
| AI görünürlük skoru | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Çoklu model (ChatGPT/Gemini/Claude/Perplexity) | ✅ (4+Google) | ✅ | ✅ (8+) | ✅ | ⚠️ (add-on) | ✅ |
| Google AI Overviews / AI Mode ayrımı | ⚠️ (tek "Google") | 🎯 Spec 06 | ✅ | ✅ | ✅ | ✅ |
| Grok / Copilot / Meta AI | ❌ | 🎯 Spec 06 | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Rakip kıyası (share of voice) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Citation / kaynak zekası** | ⚠️ ("kaynak haritası") | 🎯 Spec 01 | ✅ | ✅ | ✅ | ✅ |
| **Sentiment analizi** | ❌ | 🎯 Spec 02 | ✅ | ✅ (çekirdek) | ⚠️ | ⚠️ |
| **Aksiyon merkezi (önceliklendirme)** | ⚠️ (UI kabuğu var, mock veri) | 🎯 Spec 03 | ✅ (Agents) | ✅ (Actions) | ⚠️ | ✅ (Falcon Agent) |
| İçerik/schema çıktı üretimi | ⚠️ | 🎯 Spec 03 | ✅ | ⚠️ | ❌ | ✅ |
| **Google Business Profile entegrasyonu** | ⚠️ ("düzeltmeler") | 🎯 Spec 04 | ❌ | ❌ | ❌ | ✅ |
| **Geo-grid / ilçe kırılımı haritası** | ❌ | 🎯 Spec 05 | ❌ | ⚠️ (bölge filtre) | ⚠️ | ✅ (çekirdek) |
| **AI trafik atıfı (ROI)** | ❌ | 🎯 Spec 07 | ✅ (CDN+GA4) | ⚠️ | ❌ | ⚠️ |
| **Prompt/talep hacmi verisi** | ❌ | 🎯 Spec 08 | ✅ (çekirdek fark) | ⚠️ | ⚠️ | ⚠️ |
| Ücretsiz grader hunisi | ✅ (çekirdek çalışıyor, kart gerekmez) | 🎯 Spec 09 (e-posta duvarı + kalıcılık) | ❌ (satış görüşmesi) | ⚠️ | ⚠️ | ⚠️ |
| Beyaz etiket rapor | ✅ (Ajans) | ✅ | ✅ | ✅ | ✅ | ✅ |
| API erişimi | ✅ (Ajans) | ✅ | ✅ (enterprise) | ⚠️ | ✅ | ✅ |
| Türkçe / yerel pazar odağı | ✅ | ✅ | ❌ | ⚠️ | ⚠️ | ❌ |

## 3. Fiyat karşılaştırması

| Ürün | Giriş fiyatı | Notlar |
|---|---|---|
| **Gauge** | **$39/ay** | 1 işletme, 1 bölge + 3 kategori, haftalık tarama, 3 rakip. Pro $99, Ajans $249+. |
| Otterly | $29/ay | Giriş ucuz ama çok sınırlı; Standart'a $189 sıçrama. Bazı modeller add-on. |
| Ayzeo | $39/ay | Ücretsiz anlık audit; optimizasyon araçları dahil (JSON-LD, LLMs.txt, WP eklentisi). |
| Local Dominator | $39/ay | Yerel rank + GBP + AI Tracker. |
| Peec AI | ~€75–99/ay | Sentiment çekirdek; Pro ~€169–212, Enterprise €424–530+. Claude/Gemini add-on. |
| Profound | Halka açık self-servis yok | Her şey satış görüşmesiyle başlar; giriş ~$82–99 ama gerçek özellikler enterprise'da. |

**Gauge'un fiyat argümanı:** enterprise araçlar (Profound) $200–600/ay ve verini kilitliyor; Gauge yerel işletmeye enterprise-sınıfı ölç→düzelt akışını KOBİ fiyatıyla veriyor.

## 4. Gauge'un savunulabilir farkları (moat)

1. **Yerel + kategori + gerçek düzeltme birleşimi.** Enterprise oyuncular yerele inmiyor; yerel oyuncular (Local Falcon) güçlü ama Türkçe/yerel pazarda değil ve AI-model kapsamı Gauge kadar geniş değil.
2. **Türkçe/yerel pazar.** Global araçların hiçbiri bu pazara oturmuş değil.
3. **Sahip-olunan-kaynak avantajı.** Yerel sorgularda AI'ın alıntıladığı kaynakların ~%86'sı işletmenin sahip olduğu kaynaklar (site, GBP, listeler) — Gauge'un GBP entegrasyonu (Spec 04) + citation zekası (Spec 01) tam buraya oynuyor; bu, en kontrol edilebilir ve en yüksek getirili alan.
4. **Kendi talep verisi birikimi.** Grader (Spec 09) + tarama verisi zamanla Gauge'a özel bir yerel-kategori talep dataseti (Spec 08) biriktirir — geç gelenlerin kopyalayamayacağı veri moat'ı.

## 5. En kritik 3 boşluk (öncelik)

Rakiplerin standartlaştırdığı ama Gauge'da eksik/kısmi olan, satın alma kararını en çok etkileyen üç şey:

1. **Citation zekası + aksiyon** (Spec 01+03) — "neden görünmüyorum + ne yapmalıyım" cevabı. Bu olmadan ürün "ölçüyorum ama düzeltemiyorum" tuzağında.
2. **Gelir atıfı** (Spec 07) — "AI bana X müşteri getirdi." Tüm alanın en zayıf noktası = en güçlü ayrışma fırsatı.
3. **GBP + geo-grid** (Spec 04+05) — yerel moat'ı gerçek yapan çift; enterprise rakiplerin giremediği alan.

## 6. Bu matrisin kapsamadığı bir bahis: Agent-Readiness (Spec 10–12)

Yukarıdaki matris hepsinin aynı kategoride ("AI görünürlük takibi") rekabet ettiğini varsayar.
Spec 10 (Fact Guard), 11 (Agent-Ready) ve 12 (Canlı Harita) farklı bir iddia taşıyor: Gauge'u
o kategoriden çıkarıp bir **"AI/agent hazırlık katmanı"**na taşımak — rakiplerin hiçbiri
(Profound dahil) bunu bu şekilde konumlandırmıyor, dolayısıyla yukarıdaki satır bazlı kıyas
onlar için anlamlı değil. Gerekçe, riskler ve konumlandırma için bkz.
[`STRATEGY.md`](./STRATEGY.md).

---

### Kaynak notu
Karşılaştırma; Profound, Peec AI, Otterly, Local Falcon, Local Dominator, Ayzeo, Dageno ve BeVisible'ın 2026 ürün sayfaları ve bağımsız incelemelerinden derlendi. Rakip özellik/fiyatları hızla değişiyor — yatırımcı/satış sunumundan önce doğrula.
