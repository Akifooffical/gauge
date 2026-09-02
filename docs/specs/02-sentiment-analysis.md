# Spec 02 — Sentiment (Duygu) Analizi

> **Faz:** 1 · **Etki:** Yüksek · **Maliyet:** Düşük
> **Varsayımlar:** Spec 01 uygulandı (aynı `ScanResult.rawAnswer` verisi kullanılır).

## Problem

"Anılıyor musun" yeterli değil; **nasıl** anıldığın önemli. AI seni "pahalı", "sınırlı", "yanlış kitle için" diye tanımlıyorsa, görünür olsan bile satış öncesi konumun zayıflar. Peec AI'ın çekirdek farklılaştırıcısı sentiment; Otterly'de yok — bu, orta segmentte net bir ayrışma noktası.

## Kullanıcı hikayesi

> İşletme sahibi olarak, AI beni anarken olumlu mu nötr mü olumsuz mu konuştuğunu, hangi kelimelerle tanımladığını görmek istiyorum ki algımı düzeltebileyim.

## Kapsam

- Her marka anımı (self + rakipler) için sentiment skoru: `positive | neutral | negative` + sürekli skor (-1..+1).
- Anımdaki **tanımlayıcı ifadeler** (ör. "uygun fiyatlı", "uzun bekleme süresi").
- Zaman içinde sentiment trendi; rakiplerle sentiment karşılaştırması.

## Veri modeli (Prisma)

```prisma
model BrandMention {
  id            String   @id @default(cuid())
  scanResultId  String
  scanResult    ScanResult @relation(fields: [scanResultId], references: [id], onDelete: Cascade)
  brand         String            // self | rakip adı
  isSelf        Boolean
  sentiment     Sentiment
  sentimentScore Float            // -1.0 .. +1.0
  descriptors   String[]          // ["uygun fiyatlı", "merkezi konum"]
  snippet       String   @db.Text // anımın geçtiği cümle(ler)
  createdAt     DateTime @default(now())
  @@index([scanResultId])
  @@index([brand])
}

enum Sentiment { POSITIVE NEUTRAL NEGATIVE }
```

## Uygulama mantığı

Tarama sonrası, `rawAnswer` içinde geçen her marka için tek bir yapısal LLM çağrısı:

```
System: Sen bir sentiment analiz motorusun. Verilen AI yanıtında, listelenen her marka için
o markanın NASIL tanımlandığını değerlendir. SADECE JSON döndür.
Input: { answer, brands: ["self:Klinik X", "Rakip A", ...] }
Output: [{ brand, sentiment, sentimentScore, descriptors: [...], snippet }]
```

- Maliyet düşük: tarama başına 1 batch çağrı.
- Nötr/anılmayan markaları atla.
- Skoru zaman serisine yaz (günlük/haftalık ortalama).

## API

```
GET /api/businesses/:id/sentiment
    ?from=&to=&model=&region=
    → { self: { avg, trend[] }, competitors: { [name]: { avg, trend[] } } }

GET /api/businesses/:id/sentiment/descriptors
    → { positive: [{term,count}], negative: [{term,count}] }  // kelime bulutu için
```

## UI

- Sentiment göstergesi: self skoru + rakip ortalaması yan yana.
- Trend çizgisi (zaman içinde).
- Tanımlayıcı kelime bulutu (olumlu yeşil / olumsuz kırmızı).
- Olumsuz anımlar için "kaynağı gör" bağlantısı (Spec 01 citation'a link).

## Kabul kriterleri

- [ ] Her marka anımı için sentiment + skor + descriptors saklanıyor.
- [ ] Self ve rakipler için sentiment trendi endpoint'ten dönüyor.
- [ ] UI olumlu/olumsuz tanımlayıcıları ayrı gösteriyor.
- [ ] Olumsuz bir anım, onu üreten kaynağa (citation) bağlanabiliyor.
- [ ] Batch çağrı maliyeti tarama başına 1 istekle sınırlı.

## Görevler

1. [ ] `BrandMention` + `Sentiment` enum şemaya ekle, migrate.
2. [ ] Tarama pipeline'ına sentiment batch adımı ekle.
3. [ ] Sentiment JSON şemasını doğrulayan parser + hata toleransı.
4. [ ] Zaman serisi aggregation servisi.
5. [ ] 2 API endpoint'i.
6. [ ] Sentiment göstergesi + trend + kelime bulutu UI.
7. [ ] Descriptor → Action Center önerisi köprüsü (Spec 03).
