# Spec 12 — Canlı Harita & Navigasyon

> **Faz:** Yeni yön · **Etki:** Yüksek (görsel/demo + yerel moat) · **Maliyet:** Orta
> **Varsayımlar:** Next.js + TS. Harita motoru: **MapLibre GL** (açık kaynak, ücretsiz) veya Mapbox GL. Geo-grid verisi (Spec 05), Fact Guard konum doğruluğu (Spec 10) ve Agent-Ready action'ları (Spec 11) besleme kaynağı.
> **Mevcut durum:** Bu spec'in üç veri kaynağı (05, 10, 11) da henüz yok ve repoda hiçbir harita
> kütüphanesi (MapLibre/Mapbox/Leaflet) kurulu değil — gerçek anlamda son sırada, ısı verisi
> için en azından Spec 05'in geo-grid tarama çıktısı gerekir. `docs/geo-grid-lokasyon-analizi.md`
> harita kütüphanesi seçimini zaten karşılaştırıyor (Leaflet+OSM öneriliyor); burada tekrar
> karşılaştırmaya gerek yok, o dokümana bak.

## Problem / amaç

Gauge'un markası zaten "Sinyal · Live / canlı akış" teması üstüne kurulu ama panoda canlı bir mekânsal katman yok. Yerel işletme için harita, verinin en sezgisel hâli: nerede güçlüsün, rakip nerede önde, hizmet alanının neresinde görünmüyorsun, harita/navigasyonda doğru mu görünüyorsun. Bu modül üç şeyi tek canlı görünümde birleştirir: **görünürlük ısı katmanı + harita-varlığı sağlığı + navigasyon/işlem**.

## Kullanıcı hikayesi

> İşletme sahibi olarak, kendi konumumu, rakipleri ve hizmet alanımı canlı bir harita üzerinde görmek; her noktada AI'ın beni kaçıncı sıraya koyduğunu ısı haritasıyla izlemek; harita/navigasyonda doğru görünüp görünmediğimi kontrol etmek ve haritadan doğrudan "yol tarifi" / "randevu al" akışını test etmek istiyorum.

## Kapsam

1. **Temel harita:** işletme pini + rakip pinleri + hizmet alanı poligonu/dairesi.
2. **Canlı görünürlük ısı katmanı:** geo-grid noktaları (Spec 05) renk kodlu; canlı tarama geldikçe animasyonlu güncelleme ("sinyal" temasıyla uyumlu pulse efekti).
3. **Harita-varlığı sağlığı:** pin doğru konumda mı, GBP koordinatı ile eşleşiyor mu, navigasyon açılıyor mu, AI/harita tabanlı yerel cevaplarda çıkıyor mu (Fact Guard `ADDRESS`/`AREA_SERVED` ile bağlı).
4. **Navigasyon & işlem:** her pinden "yol tarifi" deep-link (Google/Apple Maps) + Agent-Ready action'ı varsa "randevu/rezervasyon" kartı (Spec 11).
5. **Rakip fark modu:** seçilen rakibe göre nerede geride kaldığını gösteren fark katmanı.

## Veri modeli (Prisma)

```prisma
model MapEntity {
  id          String   @id @default(cuid())
  businessId  String
  kind        MapKind            // SELF | COMPETITOR
  name        String
  lat         Float
  lng         Float
  placeId     String?            // GBP/Places referansı
  navUrl      String?            // yol tarifi deep-link
  bookUrl     String?            // Agent-Ready action target (Spec 11)
  @@index([businessId])
}

model MapPresenceCheck {
  id           String   @id @default(cuid())
  businessId   String
  pinAccurate  Boolean            // pin ↔ GBP koordinat eşleşmesi
  navigable    Boolean            // yol tarifi açılıyor mu
  inLocalAnswers Boolean          // harita/yerel AI cevaplarında çıkıyor mu
  driftMeters  Float?             // konum sapması
  checkedAt    DateTime @default(now())
  @@index([businessId, checkedAt])
}
```

> Not: Isı katmanı verisi Spec 05'teki `GeoGridScan`'den okunur — burada tekrar tablo yok, sadece harita render + canlı katman.

## Uygulama mantığı

### Harita render
- MapLibre GL + serbest raster/vector tile (ör. MapTiler/OSM). İşletme + rakip pinleri; hizmet alanı katmanı.
- **Isı katmanı:** `GeoGridScan` noktalarını `visibilityScore`'a göre renklendir (yeşil→kırmızı); MapLibre heatmap/`fill` layer.
- **Canlı efekt:** yeni tarama sonucu geldikçe ilgili noktada pulse animasyonu + skorun yumuşak geçişi (marka "sinyal" temasıyla uyumlu). Gerçek-zaman için SSE/WebSocket veya periyodik poll.

### Harita-varlığı sağlığı
- `MapPresenceCheck`: GBP koordinatı (Spec 04) ile pin karşılaştır → `driftMeters`, `pinAccurate`.
- `navigable`: yol tarifi deep-link üret + geçerlilik testi.
- `inLocalAnswers`: "‹bölge›de ‹kategori›" yerel sorgularında harita/AI cevaplarında çıkıyor mu (tarama motoru + Fact Guard).
- Sorun varsa Action Center'a aksiyon (Spec 03): "GBP pinin 180m sapmış, düzelt".

### Navigasyon & işlem
- Her pin popup'ı: skor + yol tarifi butonu (`navUrl`) + varsa "randevu al" (`bookUrl`, Spec 11 action target).
- Böylece harita, ölçümden **işleme** köprü olur (Agent-Ready ile bütünleşik demo).

## API

```
GET  /api/businesses/:id/map               // self + rakip entity'ler + hizmet alanı
GET  /api/businesses/:id/map/heat?promptId= // geo-grid ısı noktaları (Spec 05)
GET  /api/businesses/:id/map/live          // SSE/WebSocket canlı skor akışı
GET  /api/businesses/:id/map/presence      // harita-varlığı sağlığı + drift
POST /api/businesses/:id/map/presence/check // sağlık denetimi çalıştır
```

## UI

- **Canlı Harita paneli** (dashboard'da ana görsel):
  - İşletme + rakip pinleri, hizmet alanı, ısı katmanı toggle'ı.
  - Prompt/model seçici → o sorgu için ısı haritası.
  - Canlı sinyal göstergesi (yeni tarama geldikçe pulse).
  - Rakip seç → fark modu.
- **Harita Sağlığı kartı:** pin doğruluğu, drift metre, navigasyon, yerel-cevap durumu + "Düzelt".
- Pin popup: skor + yol tarifi + randevu al (Agent-Ready).
- Mobil uyumlu; erişilebilir renk paleti (renk körü güvenli, ısı için desen/etiket de).

## Kabul kriterleri

- [ ] Harita işletme + rakip pinleri + hizmet alanını render ediyor.
- [ ] Isı katmanı geo-grid (Spec 05) verisinden renk kodlu çiziliyor, prompt/model seçimine tepki veriyor.
- [ ] Canlı akış yeni tarama sonucunu haritada animasyonla güncelliyor.
- [ ] Harita-varlığı sağlığı GBP koordinatı ile drift/pin doğruluğu/navigasyon ölçüyor.
- [ ] Pin popup'ından yol tarifi ve (varsa) randevu akışı açılıyor.
- [ ] Rakip fark modu nerede geride kalındığını gösteriyor.
- [ ] Sağlık sorunları Action Center'a aksiyon üretiyor.
- [ ] Renk körü güvenli + mobil uyumlu.

## Görevler

1. [ ] `MapEntity` / `MapPresenceCheck` şema + migrate.
2. [ ] MapLibre GL entegrasyonu + tile sağlayıcı kurulum.
3. [ ] Pin + hizmet alanı katmanı.
4. [ ] Isı katmanı (Spec 05 verisinden) + prompt/model seçici.
5. [ ] Canlı akış (SSE/WebSocket) + pulse animasyonu.
6. [ ] Harita-varlığı sağlık denetimi (GBP drift + navigasyon + yerel-cevap).
7. [ ] Pin popup (yol tarifi + Agent-Ready randevu).
8. [ ] Rakip fark modu.
9. [ ] 5 API endpoint'i + Action Center köprüsü.
10. [ ] Erişilebilirlik + mobil.

## Bağlantılar

- **Spec 05 (Geo-grid):** ısı verisinin kaynağı.
- **Spec 10 (Fact Guard):** konum/adres/hizmet-alanı doğruluğu → harita sağlığı.
- **Spec 11 (Agent-Ready):** pinden randevu/rezervasyon = ölçümden işleme köprü.
- **Spec 03 (Action Center):** harita sorunları → düzeltme aksiyonu.
