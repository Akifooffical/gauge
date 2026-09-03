# Gauge — AI ve Google görünürlük motoru

Gauge; işletmelerin hem yapay zeka asistanlarında (ChatGPT, Gemini, Claude, Perplexity) hem de
Google'da — kendi bölgesinde ve kategorisinde — ne kadar görünür olduğunu ölçen, rakiplerle
karşılaştıran ve eksikleri düzelten bir SaaS ürünüdür (AEO + SEO).

Bu depo şu an bir **frontend MVP**'dir: landing sayfası, pano, onboarding akışı, rakip radarı ve
aksiyon merkezi gerçek tasarımla ama mock veriyle çalışır. Gerçek servisler (Supabase, Stripe,
Inngest, AI sağlayıcıları) henüz bağlanmamıştır — aşağıdaki "Sonraki adımlar" bölümüne bakın.

## Geliştirme

```bash
npm install
npm run dev
```

`http://localhost:3000` adresinde açılır.

## Sayfalar

- `/` — pazarlama / landing sayfası (ücretsiz AI görünürlük taraması dahil, bkz. "Ücretsiz
  tarama" bölümü)
- `/neden-gauge` — Gauge'u elle takip ve geleneksel SEO ajanslarıyla kıyaslayan konumlandırma
  sayfası
- `/onboarding` — işletme, bölge, kategori, rakip tanımlama sihirbazı (mock, kaydetmez)
- `/dashboard` — görünürlük skoru, trend, kanal kırılımı, ısı haritası (mock veri)
- `/competitors` — rakip karşılaştırması ve kaynak haritası (mock veri)
- `/actions` — aksiyon merkezi / fix engine önerileri (mock veri)
- `/contact` — Ajans/kurumsal iletişim formu (`RESEND_API_KEY` + `CONTACT_TO_EMAIL`
  ayarlanana kadar 503 net hata döner, bkz. "Ücretsiz tarama" bölümündeki desenin aynısı)
- `/gizlilik`, `/kullanim-sartlari`, `/kvkk` — yasal sayfalar (**taslak** — gerçek veri
  toplamadan/ödeme almadan önce bir hukuk danışmanına onaylat)

## Ücretsiz tarama

`/api/free-scan`, işletme adı + şehir + kategori girildiğinde web-bağlantılı (grounded) bir
modele (Perplexity Sonar) gerçek sorular sorup 0-100 görünürlük skoru döndüren, gerçekten API
çağıran bir prototiptir — bkz. `src/lib/free-scan/`. Çalıştırmak için `.env.local` içine
`PERPLEXITY_API_KEY` ekleyin (örnek anahtarlar için o dosyadaki yorumlara bakın).

## Yığın

Next.js (App Router) + TypeScript + Tailwind CSS + Recharts + lucide-react.

## Sonraki adımlar (gerçek entegrasyon)

Bu MVP'yi üretime taşımak için:

1. **Veritabanı & Auth** — Supabase (PostgreSQL + Auth), `businesses`, `locations`, `categories`,
   `competitors`, `queries`, `scans`, `scan_results`, `visibility_scores`, `recommendations`
   tabloları ve RLS politikaları.
2. **AI sağlayıcıları** — OpenAI, Gemini, Anthropic, Perplexity için ortak bir `Provider`
   adaptör katmanı (`src/lib/providers/`).
3. **Arama verisi** — SerpAPI ile Google organik/yerel/AI Overview sonuçları.
4. **Arka plan işleri** — Inngest ile zamanlanmış tarama işleri, retry ve hız sınırı.
5. **Ödeme** — Stripe abonelik + webhook + plan bazlı kota.
6. ~~**Ortam değişkenleri** — `.env.local.example` dosyasını oluşturup...~~ — tamam, repo
   kökünde; gerçek anahtarları Vercel proje ayarlarına eklemek kalıyor.

Mock veri `src/lib/mock-data.ts` dosyasında merkezi olarak tutulur; gerçek veri katmanına
geçerken bu dosyanın yerini veritabanı sorguları alacak şekilde tasarlanmıştır.

## Dokümanlar

- [`docs/README.md`](docs/README.md) — tüm `docs/` klasörünün indeksi: eksik özellik
  spec'leri (01–12), site QA raporu + düzeltme spec'leri (F1–F5), rakip kıyası.
- [`docs/QA-REPORT.md`](docs/QA-REPORT.md) — sitenin fonksiyonel tarama raporu, ne çalışıyor
  ne mock.
- [`docs/EKSIK-GIDERME-YOL-HARITASI.md`](docs/EKSIK-GIDERME-YOL-HARITASI.md) — aynı boşlukları
  daha ince taneli görevlere (G1–O1) bölen tamamlayıcı doküman; Faz 0 (G1–G5) bu depoda
  tamamlandı.
- [`docs/geo-grid-lokasyon-analizi.md`](docs/geo-grid-lokasyon-analizi.md) — harita/geo-grid
  lokasyon analizi özelliğinin teknik tasarımı (veri modeli, grid algoritması, sorgu stratejisi,
  rollout fazları).
- [`docs/maliyet-modeli.xlsx`](docs/maliyet-modeli.xlsx) — kendi abonelik/tarama sayılarını
  girip brüt marj, CAC, LTV ve başabaş noktasını gördüğün Excel maliyet modeli (3 sekme:
  Girdiler, Hesaplama, Özet — sarı hücreler düzenlenebilir).
