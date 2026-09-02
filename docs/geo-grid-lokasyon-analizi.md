# Harita / Geo-Grid Lokasyon Analizi — Teknik Tasarım

> Durum: **Tasarım / henüz uygulanmadı.** Bu doküman, Gauge'a "bu bölgenin neresinde daha
> görünürsün, neresinde kayboluyorsun" sorusunu cevaplayan bir grid-tabanlı lokasyon analizi
> özelliği eklemek için teknik plan sunar. [README.md](../README.md)'deki "Sonraki adımlar"
> listesindeki arka plan işleri (Inngest) ve arama verisi (SerpAPI) maddelerine bağlıdır.
> Ürün/API/Prisma spec'i için bkz. [`specs/05-geo-grid.md`](./specs/05-geo-grid.md) — iki
> doküman birbirini tamamlar.

## 1. Problem

Bugünkü Gauge skoru tek bir noktadan bakar: "şehir + kategori" için AI/Google seni anıyor mu.
Ama gerçek müşteri deneyimi coğrafi olarak homojen değil:

- Google'ın yerel paketi (Local Pack), arayan kişinin fiziksel konumuna göre **tamamen farklı**
  sonuçlar döndürür. İşletmenin 500 m yakınından arayan biri seni görür, 4 km uzaktan arayan
  görmeyebilir.
- Çok şubeli işletmeler (zincir klinik, ajans müşterileri) için "hangi şubem hangi mahallede
  zayıf" sorusu tek bir toplam skorla cevaplanamaz.
- Bu, klasik yerel SEO araçlarının ("Local Falcon", "BrightLocal Grid") çözdüğü ama AI
  görünürlüğü tarafında kimsenin çözmediği bir boşluk — Gauge'ın asıl farkı burada.

Hedef: işletme merkezinin etrafına bir **coğrafi ızgara (grid)** serip, her noktadan "buradan
arasam ne görürüm" sorusunu simüle etmek ve sonucu ısı haritası olarak göstermek.

## 2. Kullanıcı hikâyeleri

1. Tek lokasyonlu işletme sahibi: "Kliniğimin 3 km çevresinde hangi mahallelerde görünmüyorum?"
2. Ajans / çok-lokasyon müşterisi ([Pricing](../src/components/marketing/pricing.tsx)'teki
   "Ajans / Çok-lokasyon" planı): "5 şubemi aynı haritada karşılaştır."
3. Aksiyon merkezi kullanıcısı: "Zayıf olduğum noktalar için hangi düzeltmeyi önce yapmalıyım?"
   ([`src/app/(app)/actions/page.tsx`](../src/app/(app)/actions/page.tsx) ile entegre olmalı.)

## 3. Kritik teknik karar: iki kanal, iki farklı yöntem

Grid'in her noktasından **gerçek GPS konumu simüle edilerek** sorgu yapmak, kanala göre mümkün
olup olmamasına bağlı olarak ikiye ayrılır:

| Kanal | Konum simülasyonu mümkün mü? | Yöntem |
| --- | --- | --- |
| Google (yerel paket + organik) | **Evet** — SerpAPI `location` parametresi lat/lng kabul eder | Her grid noktası için gerçek, konum-bazlı SERP çekilir |
| ChatGPT / Gemini / Claude / Perplexity | **Hayır** — bu API'ler GPS almaz, konum enjekte edilemez | Sorgu, grid noktasının **reverse-geocode edilmiş mahalle adıyla** çerçevelenir (ör. "Fenerbahçe'de en yakın diş kliniği") |

Bu ayrım üründe **açıkça belirtilmeli**: AI kanalı sonuçları "gerçek GPS'ten" değil, "mahalle
bazlı sorgu çerçevelemesinden" gelir. Aksi, free-scan prototipindeki (bkz.
[`src/lib/free-scan/provider.ts`](../src/lib/free-scan/provider.ts)) "grounding olmadan sonuç
anlamsızdır" ilkesiyle aynı dürüstlük sorununu taşır — kullanıcıya yanlış kesinlik hissi
verilmemeli.

## 4. Veri modeli (Supabase / Postgres)

```
locations
  id                uuid pk
  business_id       uuid fk -> businesses.id
  label             text            -- "Merkez Şube", "Bostancı Şube" ...
  lat               numeric(9,6)
  lng               numeric(9,6)
  address           text
  created_at        timestamptz

geo_grid_configs
  id                uuid pk
  location_id       uuid fk -> locations.id
  radius_km         numeric(4,2)    -- varsayılan 3.0
  grid_size         smallint        -- 3, 5 veya 7 (NxN); plana göre sınırlı
  updated_at        timestamptz

geo_grid_points
  id                uuid pk
  config_id         uuid fk -> geo_grid_configs.id
  row_idx           smallint
  col_idx           smallint
  lat               numeric(9,6)
  lng               numeric(9,6)
  neighborhood_name text            -- reverse-geocode sonucu, AI sorguları için

geo_scan_runs
  id                uuid pk
  config_id         uuid fk -> geo_grid_configs.id
  started_at        timestamptz
  finished_at       timestamptz
  status            text            -- 'running' | 'done' | 'failed'

geo_scan_results
  id                uuid pk
  run_id            uuid fk -> geo_scan_runs.id
  point_id          uuid fk -> geo_grid_points.id
  channel           text            -- 'google_local' | 'google_organic' | 'openai' | 'gemini' | 'claude' | 'perplexity'
  found             boolean
  rank              smallint null
  raw_excerpt       text null
  created_at        timestamptz
```

`geo_scan_results`, mevcut `visibility_scores` / `scan_results` tablolarıyla aynı aileden ama
`point_id` ekleyerek coğrafi boyutu taşır — dashboard tarafında ortak skor mantığı
([`src/lib/free-scan/score.ts`](../src/lib/free-scan/score.ts) ile aynı 0–1 puanlama)
yeniden kullanılabilir.

## 5. Grid üretim algoritması

1. Merkez nokta: `location.lat/lng`.
2. `radius_km` ve `grid_size` (N) girildiğinde, kare bir NxN ızgara üretilir; merkez hücre
   işletmenin kendisidir (N tek sayı olmalı: 3, 5, 7).
3. Enlem/boylam adımı, küçük mesafeler için equirectangular yaklaşıklıkla hesaplanır:

   ```ts
   const KM_PER_DEG_LAT = 110.574;
   function kmPerDegLng(lat: number) {
     return 111.320 * Math.cos((lat * Math.PI) / 180);
   }

   function buildGrid(center: { lat: number; lng: number }, radiusKm: number, n: number) {
     const step = (radiusKm * 2) / (n - 1);
     const points: { lat: number; lng: number; row: number; col: number }[] = [];
     const half = Math.floor(n / 2);
     for (let row = -half; row <= half; row++) {
       for (let col = -half; col <= half; col++) {
         points.push({
           row: row + half,
           col: col + half,
           lat: center.lat + (row * step) / KM_PER_DEG_LAT,
           lng: center.lng + (col * step) / kmPerDegLng(center.lat),
         });
       }
     }
     return points;
   }
   ```

4. Her nokta, oluşturulduktan sonra **tek seferlik** reverse-geocode edilir (Google Geocoding
   API veya ücretsiz Nominatim) ve `neighborhood_name` olarak saklanır — her taramada tekrar
   geocode etmeye gerek yok, config değişmediği sürece nokta seti sabit kalır.

## 6. Sorgu stratejisi

### 6a. Google kanalı (gerçek konum-bazlı)

SerpAPI `google` motoruna her nokta için `location`/`ll` parametresiyle istek atılır; yerel
paket + organik sonuçlardaki sıralama doğrudan okunur. Bu, free-scan'deki grounded-model
yaklaşımına paralel ama SerpAPI zaten konum-native olduğu için ekstra çıkarım adımına gerek
yoktur.

### 6b. AI kanalı (mahalle-çerçeveli)

`generateQueries`'e benzer bir üretici, ama şehir+kategori yerine **mahalle+kategori** alır:

```ts
function geoQueries(neighborhood: string, category: string) {
  return [
    `${neighborhood} yakınında en iyi ${category} hangisi?`,
    `${neighborhood}'de bana en yakın ${category} önerir misin?`,
  ];
}
```

[`askGrounded`](../src/lib/free-scan/provider.ts) ve
[`extract`](../src/lib/free-scan/extract.ts) **aynen yeniden kullanılır** — provider/extract
katmanı zaten kanal-agnostik tasarlandığı için yeni kod yazmaya gerek yok, sadece soru üretici
değişir.

### Maliyet kısaltması: mahalle bazlı tekilleştirme

Bir 7x7 grid'de 49 nokta olsa da, komşu noktalar çoğu zaman **aynı mahalleye** reverse-geocode
edilir. AI sorguları nokta bazında değil, **tekil `neighborhood_name` başına bir kez** çalıştırılıp
sonucu o mahalleye denk gelen tüm noktalara kopyalanır. Bu, free-scan'deki şehir+kategori
önbellek fikrinin ([`rateLimit.ts`](../src/lib/free-scan/rateLimit.ts)) coğrafi grid'e
genişletilmiş hâlidir ve AI çağrı sayısını tipik olarak %60-80 azaltır.

## 7. Skorlama ve ısı haritası

Her nokta için 0-100 skor, mevcut [`computeScore`](../src/lib/free-scan/score.ts) mantığıyla
aynı formülle (kanal başına sıraya göre azalan puan, ortalama). Nokta skorları arasında Google
ve AI kanalları ağırlıklı ortalanır (varsayılan %50/%50, kullanıcı ayarlayabilir).

Isı haritası render'ı: mevcut [`Heatmap`](../src/components/dashboard/heatmap.tsx) bileşeni
kanal×soru matrisini renkli hücrelerle gösteriyor — aynı renk skalası (gold = güçlü, miss =
zayıf) coğrafi grid için de kullanılacak, ama hücreler artık harita üzerinde konumlandırılmış
dairelerdir.

## 8. Harita bileşeni seçimi

| Seçenek | Maliyet | Artı | Eksi |
| --- | --- | --- | --- |
| **Leaflet + OpenStreetMap** (önerilen, Faz 1) | Ücretsiz | Lisans/kota derdi yok, `react-leaflet` ile hızlı entegrasyon | Görsel olarak Mapbox kadar "premium" değil |
| Mapbox GL JS | Aylık ücretsiz kota var, sonra kullanım-bazlı | Gauge'ın koyu-sinematik temasına özel stil (dark style) uyar | Ek maliyet kalemi, API key yönetimi |
| Google Maps JS API | Kullanım-bazlı, nispeten pahalı | Google Places ile doğal entegrasyon | Maliyet + zaten SerpAPI üzerinden Google verisi çekiliyor, harita için ayrı fatura gereksiz |

**Öneri:** Faz 1'de Leaflet + OSM ile başla (maliyet sıfır); ürün validasyonu sonrası
görsel kaliteyi yükseltmek gerekirse Mapbox'ın koyu temalı stiline geçiş yapılabilir. Bileşen
`GaugeBackground`/`SiteBackground` gibi mevcut görsel katmanlardan bağımsız, `/competitors`
veya yeni bir `/lokasyon` rotasında `"use client"` bir harita bileşeni olarak yaşar.

## 9. Önerilen dosya yapısı

```
src/
  app/api/geo-grid/
    config/route.ts          # grid oluştur/güncelle (radius, grid_size)
    scan/route.ts             # POST — yeni geo_scan_run başlatır
    [locationId]/route.ts     # GET — en son run sonuçlarını döndürür
  lib/geo-grid/
    buildGrid.ts               # §5'teki algoritma
    reverseGeocode.ts          # nokta -> mahalle adı
    geoQueries.ts               # §6b'deki soru üretici
    aggregateHeat.ts            # nokta bazlı skorları ısı haritası verisine indirger
  components/geo-grid/
    GeoGridMap.tsx              # "use client", react-leaflet tabanlı harita
    GeoGridControls.tsx         # radius / grid boyutu / kanal ağırlığı kontrolleri
    GeoGridLegend.tsx           # renk skalası açıklaması
```

`provider.ts`, `extract.ts`, `score.ts` free-scan'den **değiştirilmeden** import edilir —
kanal-agnostik tasarımın karşılığını burada alıyoruz.

## 10. Plan bazlı sınırlar ve maliyet kontrolü

- **Başlangıç:** geo-grid özelliği kapalı (yalnızca tekil şehir+kategori skoru).
- **Profesyonel:** 1 lokasyon, en fazla 5x5 grid, haftalık otomatik tarama.
- **Ajans / Çok-lokasyon:** çoklu lokasyon, en fazla 7x7 grid, günlük tarama, şube karşılaştırma
  görünümü.
- Her tarama çalıştırması önce **tahmini maliyeti** hesaplar (`unique_neighborhoods × AI kanal
  sayısı × sorgu/mahalle` + `grid_noktası × Google SERP çağrısı`) ve bunu kullanıcıya taramadan
  önce gösterir — free-scan'deki "6 soru limiti" disiplininin büyütülmüş hâli.

## 11. Zamanlama / arka plan işleri

README'deki "Sonraki adımlar" listesindeki Inngest entegrasyonuna bağlıdır: geo-grid taramaları
senkron bir API isteğinde bitecek kadar hızlı değildir (7x7 grid'de onlarca SerpAPI çağrısı +
mahalle başına AI çağrısı olabilir). `POST /api/geo-grid/scan`, bir Inngest event'i tetikler,
iş arka planda `mapWithConcurrency` benzeri sınırlı eşzamanlılıkla ilerler, `geo_scan_runs.status`
güncellenir; istemci tarafı polling veya Supabase realtime ile sonucu bekler.

## 12. Rollout fazları

1. **Faz 1 — Google-only grid:** tek lokasyon, sadece Google yerel paket/organik, Leaflet
   harita, manuel tetiklenen tarama. AI kanalı yok — en düşük maliyetli, en hızlı teslim edilebilir
   dilim.
2. **Faz 2 — AI kanalı eklenir:** §6b'deki mahalle-çerçeveli sorgular, tekilleştirme önbelleği,
   ısı haritasında Google/AI ayrımı gösterilir.
3. **Faz 3 — Çoklu lokasyon:** Ajans planı için şube karşılaştırma görünümü, tek ekranda N
   lokasyonun ortalama skoru.
4. **Faz 4 — Rakip overlay:** aynı grid üzerinde en yakın rakibin skorunu ikinci bir katman
   olarak göster ("bu noktada rakibin senden önde").

## 13. Riskler / açık sorular

- **AI modellerin mahalle çerçevelemesine duyarlılığı belirsiz.** Küçük/az bilinen mahalle
  adlarında model "bilmiyorum" tipi cevaplar verebilir; bu durumda o noktayı "veri yok" olarak
  işaretlemek gerekir (0 puan yerine — aksi halde skor yapay şekilde düşer).
- **SerpAPI maliyeti grid boyutuyla lineer büyür** — plan bazlı grid sınırları (§10) bunu
  kontrol altında tutmak için zorunlu, kullanıcıya "daha büyük grid = daha yüksek plan" olarak
  net anlatılmalı.
- **Küçük şehirlerde grid anlamsızlaşabilir** (3 km yarıçap tüm şehri kapsıyorsa noktalar
  arasında fark çıkmaz) — UI, şehir büyüklüğüne göre önerilen yarıçapı otomatik öneren bir
  varsayılan sunmalı.
- **Kendi SERP scraping'i yapılmamalı** — Google ToS ihlali riski; SerpAPI (veya benzeri
  lisanslı sağlayıcı) üzerinden gidilmesi zorunlu, bu maliyet kalemi olarak kabul edilmeli.
