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
| **Beyaz etiket rapor** | ⚠️ (Ajans planında vaat var, uygulama yok) | 🎯 Spec 14 | ✅ | ✅ | ✅ | ✅ |
| **API erişimi** | ⚠️ (Ajans planında vaat var, uygulama yok) | 🎯 Spec 13 (MCP) + 14 (REST) | ✅ (enterprise) | ⚠️ | ✅ | ✅ |
| **MCP sunucusu (AI ajanı/IDE erişimi)** | ❌ | 🎯 Spec 13 | ❌ | ✅ | ✅ | ✅ |
| Türkçe / yerel pazar odağı | ✅ | ✅ | ❌ | ⚠️ | ⚠️ | ❌ |

> Not: yukarıdaki "Beyaz etiket rapor" ve "API erişimi" satırları önceden Gauge için ✅
> işaretliydi — bu yanlıştı, `pricing.tsx`'teki bir plan vaadiyle karıştırılmıştı. Gerçekte
> ikisi de sıfırdan tasarlanmamış (bkz. Spec 14; düzeltme 2026 rakip araştırmasında bulundu).

## 3. Fiyat karşılaştırması

| Ürün | Giriş fiyatı | Notlar |
|---|---|---|
| **Gauge** | **$39/ay** | 1 işletme, 1 bölge + 3 kategori, haftalık tarama, 3 rakip. Pro $99, Ajans $249+. |
| Otterly | $29/ay | Giriş ucuz ama çok sınırlı (Lite); Standard $189, Premium $489, Enterprise $1000+. Temel 4 motor (ChatGPT/AI Overviews/Perplexity/Copilot); Gemini/AI Mode add-on. |
| Ayzeo | $39/ay | Starter $39 / Pro $149; ücretsiz anlık audit; optimizasyon araçları dahil (JSON-LD, LLMs.txt, WP eklentisi); DeepSeek+Grok zaten dahil. **Beyaz etiket ayrı eklenti: $299/ay.** |
| Local Dominator | $39/ay (Lite) | Yerel rank + GBP dahil; **AI Tracker $49/site ayrı eklenti** (bundle değil — önceki notumuz bunu netleştirmiyordu). |
| Local Falcon | $24.99/ay | Kredi bazlı. En ucuz katmanda bile AI Visibility Tracking + "Falcon AI" + citation finder + **otomatik yorum yanıtı** + MCP sunucusu bundle. |
| Peec AI | ~$80–95/ay | Pro ~$205–245, Advanced ~$420–495, Enterprise özel. Sadece 3 model dahil, ekstra model €30–140/model/ay. MCP + Looker Studio bağlantısı var. |
| Profound | **Starter $99/ay** | ~~Halka açık self-servis yok~~ **(düzeltildi, 2026)** — artık self-servis var: Starter $99, Growth $399, Enterprise özel ($2K–5K+/ay). Şub 2026'da $96M Series C, $1B değerleme (Lightspeed). |
| **AthenaHQ** *(yeni bulundu)* | $270/ay (Lite) | Growth $545, Enterprise $2000+. 8 LLM izliyor; GA4/Shopify/Webflow entegrasyonuyla görünürlüğü doğrudan gelire bağlıyor (bkz. Spec 07). YC-destekli, ex-Google/DeepMind kurucular. |
| **Scrunch AI** *(yeni bulundu)* | $250/ay (Core) | Agency Core ~$300, Enterprise özel. Claude/Gemini/Meta AI/Grok sadece Enterprise'da açık. |
| **Semrush AI Visibility Toolkit** *(yeni bulundu)* | $99/ay | Mevcut Semrush aboneliğine domain-başı eklenti. **317M+ sorgu içeren prompt veritabanı** — Spec 08'in (talep hacmi) ölçek argümanını doğruluyor. |
| **Rankscale** *(yeni bulundu)* | ~€20/ay | Bütçe ucu; 17+ AI motoru + 200+ on-page denetim faktörü iddiası. |

**Not:** Dageno ve BeVisible için kamuya açık bir fiyat sayfası bulunamadı (Dageno blog/SEO
içeriğine odaklı; BeVisible 14 günlük deneme sunuyor, fiyat gizli). HubSpot AI Search
Grader ve Goodie AI, ücretsiz-grader / e-ticaret-niş sırasıyla §5a'da ele alınıyor.

**Gauge'un fiyat argümanı:** enterprise araçlar (Profound, AthenaHQ, Scrunch) $250–2000+/ay ve verini kilitliyor; Gauge yerel işletmeye enterprise-sınıfı ölç→düzelt akışını KOBİ fiyatıyla veriyor.

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

## 5a. 2026 rakip araştırmasında bulunan yeni boşluklar ve rakipler

Bir tur daha canlı rakip araştırması yapıldı (web araması + rakip fiyat sayfaları,
kaynaklar altta). İki tür bulgu çıktı:

**Yeni, ilgili rakipler (matriste yer almıyordu):**
- **AthenaHQ** — görünürlüğü doğrudan analytics'e (GA4/Shopify/Webflow) bağlıyor; Spec 07'nin
  (ROI atıfı) rakip karşılığı zaten piyasada.
- **Scrunch AI** — enterprise'a kayan model kapsamı (Claude/Gemini/Meta AI/Grok sadece üst
  planda) — Gauge'un "tüm modeller her planda" argümanını güçlendiriyor.
- **Semrush AI Visibility Toolkit** — mevcut bir dev SEO aracına eklenti olarak giriyor;
  317M+ sorguluk prompt veritabanı, Spec 08'in neden değerli olduğunun kanıtı.
- **HubSpot AI Search Grader** — ücretsiz, kayıtsız, **5 alt-skorlu** (sentiment, varlık
  kalitesi, marka tanınırlığı, share of voice, pazar konumu) grader. Spec 09/`free-scan`'in
  doğrudan kıyaslanacağı rakip — bizimki tek skor, İngilizce'ye özel değil (bu son kısım bizim
  avantajımız).
- **Rankscale** — bütçe ucu (~€20/ay), MCP zaten dahil.
- **Goodie AI** — niş: Amazon Rufus (AI alışveriş asistanı) kapsamı; e-ticaret dışı Gauge için
  düşük öncelik, sadece farkındalık amaçlı not edildi.

**Mevcut 14 spec'in (01–12, F1–F5) hiçbirinin kapsamadığı gerçek boşluklar:**

1. **MCP (Model Context Protocol) sunucusu** — Peec AI, Otterly, Local Falcon, Rankscale
   şu an sunuyor. Gauge'un kendi verisini AI ajanlarına/IDE'lere açması — bkz.
   [`specs/13-mcp-server.md`](./specs/13-mcp-server.md) (yeni eklendi).
2. **Beyaz etiket & ajans reseller mekaniği** — Ayzeo ($299/ay eklenti) ve Local Dominator
   (plana gömülü) bunu satıyor; Gauge'un kendi pricing sayfası bunu **zaten vaat ediyor** ama
   hiç tasarlanmamış — bkz. [`specs/14-agency-white-label.md`](./specs/14-agency-white-label.md)
   (yeni eklendi).
3. **Otomatik yorum yanıtı (review response)** — Local Falcon en ucuz katmanında bile
   bundle'lıyor. Spec 04'ün GBP writeback'i bunun altyapısını zaten kapsıyor, sadece yanıt
   metninin LLM ile otomatik üretilmesi eksikti — Spec 04'e not eklendi (yeni spec açılmadı).
4. **Çok-boyutlu grader skoru** — HubSpot'un 5 alt-skor modeli, bizim tek-skor grader'ımızdan
   (Spec 09) daha zengin — Spec 09'a upgrade notu eklendi.

**Bilinçli olarak "boşluk değil" sayılanlar:** sesli asistan görünürlüğü (Alexa/Siri/Google
Assistant zaten GBP/Yelp/Apple Maps Connect'ten besleniyor — Spec 04+10 zaten o kaynakları
hedefliyor); Grok/DeepSeek/Meta AI kapsamı (zaten Spec 06'da planlı); çoklu-dil/Türkçe pazar
odağı (hâlâ eşleşmeyen bir fark — HubSpot'un grader'ı yalnızca İngilizce).

## 6. Bu matrisin kapsamadığı bir bahis: Agent-Readiness (Spec 10–12)

Yukarıdaki matris hepsinin aynı kategoride ("AI görünürlük takibi") rekabet ettiğini varsayar.
Spec 10 (Fact Guard), 11 (Agent-Ready) ve 12 (Canlı Harita) farklı bir iddia taşıyor: Gauge'u
o kategoriden çıkarıp bir **"AI/agent hazırlık katmanı"**na taşımak — rakiplerin hiçbiri
(Profound dahil) bunu bu şekilde konumlandırmıyor, dolayısıyla yukarıdaki satır bazlı kıyas
onlar için anlamlı değil. Gerekçe, riskler ve konumlandırma için bkz.
[`STRATEGY.md`](./STRATEGY.md).

---

### Kaynak notu
Karşılaştırma; Profound, Peec AI, Otterly, Local Falcon, Local Dominator, Ayzeo, Dageno ve
BeVisible'ın 2026 ürün sayfaları ve bağımsız incelemelerinden derlendi. **3 Eylül 2026'da**
canlı bir araştırma turuyla güncellendi (Profound fiyat değişikliği, Local Falcon/Local
Dominator/Ayzeo düzeltmeleri, AthenaHQ/Scrunch AI/Semrush AI Visibility Toolkit/HubSpot AI
Search Grader/Rankscale/Goodie AI eklendi) — kaynaklar: tryprofound.com, workduo.ai,
capterra.com (Peec AI, Local Dominator, AthenaHQ ürün sayfaları), checkthat.ai,
thatmarketingbuddy.com, ayzeo.com/pricing, scrunch.com/pricing, semrush.com/kb/1493,
hubspot.com/ai-search-grader. Rakip özellik/fiyatları hızla değişiyor — yatırımcı/satış
sunumundan önce yeniden doğrula.
