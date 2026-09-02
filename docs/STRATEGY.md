# Gauge — Yeni Yön: "Agent-Readiness" Katmanı

Bu paket, Gauge'u kalabalık ve metalaşan **"AI görünürlük takibi"** kategorisinden çıkarıp yeni bir kategoriye taşıyan üç modülün implementasyon spec'lerini içerir. Önceki `gauge-specs` paketinin (01–09) devamıdır.

## Konumlanma tek cümlede

> **Gauge — yerel işletmeler için AI/agent hazırlık katmanı: AI seni *doğru* tanır, ajanlar seni *bulup işlem yapabilir*. Görünürlük, bu döngünün geri-besleme sinyalidir.**

## Neden bu yön

AI görünürlük *takibi* metalaşıyor ve pazar tutarsız sonuçlar yüzünden bu araçlara şüpheyle bakıyor. Kategorinin yapısal kusurları (hepsi rakiplerde ortak):

- Anılmayı ölçüyorlar, **doğruluğu değil** — oysa geliri asıl etkileyen doğruluk.
- LLM cevapları **her çalıştırmada değişir** (aynı liste 100'de 1'den az) → tek "sıra" sayısı gürültü.
- **Sentetik prompt ≠ gerçek soru**; API sorgusu ≠ gerçek kullanıcı deneyimi.
- **Ölçüp bırakıyorlar**: içerik değişikliğinin görünürlüğü artırdığı kanıtlanamıyor. Kontrol edilebilir tek değişken **grounding** (AI'ın güvendiği kaynak).

Aynı anda büyük kırılma: alışveriş/hizmet **"öneri"den "işlem"e** kayıyor. Ajanlar yapılandırılmış niyeti çözüp katalog/API sorguluyor ve giderek **işlem yapıyor**. Veri yapılandırılmamışsa ajan işletmeyi aday kümesine ekleyemez. Bu, Gauge'un ICP'sinin (klinik, restoran, avukat, kuaför, veteriner, oto servis) tam merkezinde çünkü bunlar **randevu/rezervasyon** işletmeleri.

## Bu paketteki üç modül

| # | Modül | Ne yapar | Kategori kusurundan çıkışı |
|---|-------|----------|-----------------------------|
| 10 | **Fact Guard** (Doğruluk Motoru) | AI'ın işletme hakkında söylediği olguların doğruluğunu izler, halüsinasyonu/eski bilgiyi yakalar, kaynaklara düzeltme sürer | "Anılma değil doğruluk" + determinizmi aşar (olgular stabil) |
| 11 | **Agent-Ready** (Makine-Çağrılabilir Katman) | İşletmeyi ajanlar için keşfedilebilir + **işlem-yapılabilir** kılar: llms.txt, JSON-LD, PotentialAction (Reserve/Schedule), Wikidata entity, feed | "Ölç-bırak"tan → kazandıran altyapıya |
| 12 | **Canlı Harita & Navigasyon** | İşletme + rakipler + hizmet alanı + görünürlük ısı katmanı + navigasyon + harita-varlığı sağlığı | Canlı görsel katman; Fact Guard (konum doğruluğu) ve Agent-Ready (haritadan rezervasyon) ile bağlanır |

## Bağımlılıklar

```
Önceki paket:
  04 GBP entegrasyonu ──► 10 Fact Guard (yer gerçeği kaynağı)
  05 Geo-grid ──────────► 12 Canlı Harita (ısı verisi)
  03 Action Center ─────► 10 & 11 (bulguları aksiyona çevirir)

Bu paket:
  10 Fact Guard ──┐
                  ├──► 12 Canlı Harita (harita-varlığı sağlığı)
  11 Agent-Ready ─┘        + haritadan agent-bookable kart
```

## Uygulama sırası (öneri)

1. **11 Agent-Ready** — en yüksek farklılaşma + somut ROI (haritadan/AI'dan gelen rezervasyon). En büyük "yeni kategori" hamlesi.
2. **10 Fact Guard** — güven + retention; GBP (spec 04) yer gerçeğini besler.
3. **12 Canlı Harita** — 10 ve 11'in çıktısını görselleştiren canlı katman; demoda ve satışta çarpıcı.

## Dürüst riskler

- Yerel saf hizmette agentic işlem henüz e-ticaret kadar olgun değil; erken giriş hem avantaj hem risk.
- Fact Guard güvenilir "yer gerçeği" ister (GBP bağlantısı bunu besler).
- `PotentialAction`'ı gerçek endpoint olmadan beyan etmek ajanı form-scraping'e düşürür → 11'de endpoint zorunlu.
- Standartlar akışkan (llms.txt düz liste, ilişki modeli yok); JSON-LD + entity graph daha sağlam. Esnek kal.
