# Spec 05 — Geo-grid Görselleştirme

> **Faz:** 2 · **Etki:** Yüksek · **Maliyet:** Orta
> **Varsayımlar:** Tarama motoruna konum/koordinat parametresi eklenebiliyor.
> **Mevcut durum:** Henüz uygulanmadı. Bu spec'in ürün/API/Prisma tasarımına ek olarak, aynı
> özelliğin daha derin bir teknik tasarımı ([`../geo-grid-lokasyon-analizi.md`](../geo-grid-lokasyon-analizi.md))
> zaten var — grid üretim matematiği, Google-vs-AI sorgu stratejisi ayrımı (gerçek GPS
> simülasyonu Google'da mümkün, AI kanalında mahalle-çerçeveli sorguyla yapılıyor), harita
> kütüphanesi kıyası (Leaflet/Mapbox/Google Maps) ve maliyet/rollout fazlarını kapsıyor. İki
> doküman birbirini tamamlar; önce o dosyayı, sonra bu spec'in API/veri modelini oku.

## Problem

Hizmet bölgesi olan işletme için "ortalama görünürlük skoru" yetersiz. Geo-grid haritalar, bir işletmenin hizmet alanı boyunca **nerede güçlü, nerede zayıf** olduğunu tam olarak gösterir — bu, Local Falcon'un en çok kullanılan özelliği. Gauge "bölge" diyor ama tek bir bölge skoru veriyor; ilçe/mahalle kırılımı yerel farklılaşmayı görünür kılar ("Kadıköy'de birincisin, Ataşehir'de rakip önde").

## Kullanıcı hikayesi

> İşletme sahibi olarak, hizmet verdiğim şehrin farklı noktalarında AI'ın beni kaçıncı sırada saydığını harita üstünde ısı haritası olarak görmek istiyorum ki hangi bölgeye içerik/çaba yönlendireceğimi bileyim.

## Kapsam

- Hizmet alanını **grid noktalarına** böl (ör. şehir merkezi etrafında NxN ızgara veya ilçe merkezleri).
- Her grid noktası için tarama sorgusunu **o konum bağlamıyla** çalıştır.
- Her nokta için görünürlük/pozisyon → **ısı haritası**.
- Zaman içinde grid trendi; rakip karşılaştırması nokta bazında.

## Veri modeli (Prisma)

```prisma
model GeoGridScan {
  id          String   @id @default(cuid())
  businessId  String
  promptId    String
  gridLat     Float
  gridLng     Float
  gridLabel   String            // "Kadıköy", "Ataşehir" vb.
  model       String
  mentioned   Boolean
  position    Int?
  visibilityScore Int           // 0-100 (nokta bazında)
  scannedAt   DateTime @default(now())
  @@index([businessId, promptId, scannedAt])
  @@index([gridLat, gridLng])
}

model ServiceArea {
  id          String   @id @default(cuid())
  businessId  String
  centerLat   Float
  centerLng   Float
  radiusKm    Float
  gridSize    Int               // NxN
  points      Json              // hesaplanmış grid noktaları
}
```

## Uygulama mantığı

### Grid üretimi
- `ServiceArea` merkez + yarıçap + gridSize'dan NxN nokta üret, ya da ilçe merkezlerini kullan.
- Her nokta için ters-geocode ile `gridLabel`.

### Konum-bağlamlı tarama
- Tarama sorgusunu her grid noktası için o konumu ima ederek çalıştır:
  - Web-arama modellerinde konum ipucu / "near {gridLabel}" prompt varyantı.
  - Mümkünse arama tarafında konum parametresi.
- `visibilityScore` = pozisyon + anılma + citation kalitesinden türet.

> **Maliyet uyarısı:** grid × prompt × model tarama sayısını çarpar. Grid taramasını daha seyrek cadence'te (haftalık) ve sadece öncelikli promptlar için çalıştır. gridSize'ı plana bağla (Başlangıç: 3×3, Pro: 5×5, Ajans: 7×7).

## API

```
GET  /api/businesses/:id/geo-grid?promptId=&model=&date=
     → { points: [{lat,lng,label,visibilityScore,position}], center, bounds }
GET  /api/businesses/:id/geo-grid/compare?promptId=&competitor=
     → nokta bazında self vs rakip
POST /api/businesses/:id/service-area   // hizmet alanı tanımla
```

## UI

- **Isı haritası** (Leaflet / Mapbox GL): grid noktaları renk kodlu (yeşil=güçlü, kırmızı=zayıf).
- Nokta tıklayınca: o noktadaki sıra, rakipler, kaynaklar.
- Rakip seçince fark haritası (nerede geride kaldığın).
- Zaman kaydırıcısı (trend).

## Kabul kriterleri

- [ ] Hizmet alanı tanımlanıp grid noktalarına bölünüyor.
- [ ] Her nokta için konum-bağlamlı tarama çalışıyor, `visibilityScore` üretiliyor.
- [ ] Isı haritası noktaları doğru renk/konumda render oluyor.
- [ ] Nokta tıklama detay paneli çalışıyor.
- [ ] Rakip fark haritası çalışıyor.
- [ ] Grid cadence + boyut plana göre sınırlanıyor (maliyet kontrolü).

## Görevler

1. [ ] `ServiceArea` / `GeoGridScan` şema + migrate.
2. [ ] Grid üretim + ters-geocode servisi.
3. [ ] Konum-bağlamlı tarama varyantı (mevcut motora parametre).
4. [ ] `visibilityScore` hesaplayıcı.
5. [ ] Cadence + boyut plan limiti.
6. [ ] 3 API endpoint'i.
7. [ ] Harita bileşeni (ısı haritası + detay + karşılaştırma + zaman).
