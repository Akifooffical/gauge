# Gauge — Eksik Giderme Yol Haritası (Claude Code için)

> Bu doküman, Gauge SaaS ürününün mevcut eksiklerini bir kodlama ajanının (Claude Code)
> tek tek uygulayabileceği görevlere böler. Her görev bağımsızdır, sıralıdır ve
> "Bitti sayılır" kriteri içerir.

> **Bu depoya özel not:** Faz 0 (G1–G5) tamamen bu oturumda uygulandı — her görevin altına
> "**Durum:**" satırı eklendi. Faz 1–4 (B1–O1), [`QA-REPORT.md`](./QA-REPORT.md) +
> [`specs/F3-F5-*.md`](./specs/) ile aynı temel blokere (gerçek Supabase/Stripe/Inngest
> hesapları ve anahtarları) çarpıyor — o dosyalardaki "Mevcut durum" notları burada
> tekrarlanmıyor, ilgili görevin altına kısa bir çapraz referans eklendi. **O1 (Sentry/
> gözlemlenebilirlik) istisna** — bu, önceki hiçbir pakette (01–14, F1–F5) yoktu, gerçek yeni
> bir bulgu.

---

## 0. Bu doküman nasıl kullanılır

- Görevleri **sırayla** ver. Her görevi ayrı bir oturumda/PR'da uygula; hepsini tek
  seferde yapma.
- Her göreve başlamadan önce depodaki **`CLAUDE.md`** ve **`AGENTS.md`** dosyalarını oku,
  mevcut konvansiyonlara uy.
- Her görev bittiğinde "Bitti sayılır" maddelerini tek tek doğrula.
- Faz 0 görevleri backend gerektirmez → değişikliği **doğrudan sitede** görebilirsin.
- Faz 1+ görevleri backend kurar → önce `.env.local` anahtarları gerekir.

---

## Proje bağlamı (mevcut durum)

- **Ne:** İşletmelerin ChatGPT, Gemini, Claude, Perplexity ve Google'da kendi bölge/kategorisinde
  ne kadar görünür olduğunu ölçen, rakiplerle kıyaslayan ve eksikleri düzelten SaaS (AEO + SEO).
- **Yığın:** Next.js (App Router) + TypeScript + Tailwind CSS + Recharts + lucide-react. Vercel'de.
- **Durum:** Frontend MVP. `/api/free-scan` (Perplexity Sonar çağıran) **gerçek** çalışıyor.
  Diğer her şey (`/dashboard`, `/onboarding`, `/competitors`, `/actions`) **mock veriyle**
  çalışıyor; hiçbir şey kaydolmuyor.
- **Mock veri merkezi:** `src/lib/mock-data.ts` — gerçek veri katmanına geçerken bunun yerini
  veritabanı sorguları alacak şekilde tasarlanmış.
- **Free-scan kodu:** `src/lib/free-scan/`
- **Planlanan gerçek servisler:** Supabase (Postgres + Auth), Stripe, Inngest, AI provider
  adaptörleri, SerpAPI.

---

## Genel konvansiyonlar (tüm görevler için geçerli)

- TypeScript **strict**; `any` kullanma.
- Provider API anahtarları **asla** client'a sızmasın — tüm AI/SerpAPI çağrıları server-side
  (route handler / server action / Inngest job) içinde.
- Yeni env değişkeni eklersen `.env.local.example` dosyasına da ekle (yoksa oluştur).
- Küçük, odaklı commit'ler. Her görev tek bir konuya dokunsun.
- Mevcut tasarım dilini (numaralı bölümler "Gauge / 0X", "Signal · Live" estetiği) bozma.
- Türkçe UI metni; teknik terimler İngilizce kalabilir.

---

# FAZ 0 — Hızlı düzeltmeler (backend yok, sitede hemen görünür)

## G1 · Free-scan'i hero'ya taşı ve birincil CTA yap
**Neden:** Gerçekten çalışan tek özellik en dipte. Ürünün kancası "AI seni anıyor mu?".
Ziyaretçi işletme adını yazıp gerçek sonucu görünce dönüşür.

**Yapılacaklar:**
- Landing hero bölümüne (`src/app/page.tsx` veya ilgili bileşen) free-scan formunu (işletme adı
  + şehir + kategori) ekle veya buraya çıkar.
- Birincil CTA metnini "Panoyu aç" yerine **"Görünürlüğümü ücretsiz gör"** yap; bu buton
  free-scan'i tetiklesin.
- "Panoyu aç" (mock pano) butonunu ikincil/gizli yap — potansiyel müşteriye mock pano gösterme.
- Form altına küçük metin: "Kart gerekmez · birkaç saniye sürer".

**Dosyalar:** `src/app/page.tsx`, free-scan form bileşeni.

> **Durum: ✅ Tamamlandı.** `ScanForm`, `GaugeHero.tsx`'e taşındı (`id="tarama"` artık orada),
> ilk ekranda görünüyor. "Panoyu aç" küçük, altta bir metin linkine ("Demo panosunu gör")
> düşürüldü. `FinalCta`'daki eski form kopyası kaldırıldı, o bölüm artık yukarı (`#tarama`)
> kaydıran bir kapanış CTA'sı.

✅ **Bitti sayılır:**
- Ana sayfada ilk ekranda free-scan formu görünüyor.
- İşletme adı + şehir + kategori girip gerçek 0-100 skor dönüyor.
- Birincil CTA free-scan'i çalıştırıyor, mock panoya değil.

---

## G2 · Yanıltıcı teknik metrikleri kaldır
**Neden:** `%99.9 çalışma süresi`, `‹200ms yenileme gecikmesi`, `4 kanal` gibi ifadeler hem
alıcının umurunda değil hem de backend olmadığı için doğru değil.

**Yapılacaklar:**
- Hero altındaki bu üç metrik bloğunu kaldır veya sonuç/kanıt odaklı ifadelerle değiştir
  (örn. "4 AI modeli + Google'ı tek panoda ölçer").
- Doğruluğunu kanıtlayamadığın hiçbir sayısal iddia bırakma.

**Dosyalar:** `src/app/page.tsx`.

> **Durum: ✅ Tamamlandı.** `GaugeHero.tsx`'teki `metrics` dizisi (4 kanal / ‹200ms / %99.9)
> kaldırıldı; yerine sade, doğrulanamaz sayı içermeyen bir satır kondu: "ChatGPT · Gemini ·
> Claude · Perplexity · Google — tek panoda."

✅ **Bitti sayılır:** Uptime/gecikme gibi doğrulanamaz teknik metrikler sitede yok.

---

## G3 · İstatistiklere kaynak ekle
**Neden:** `%42 alıcı AI kullanıyor`, `2-3 isim` gibi rakamlar kaynaksız; "uydurma" gibi durur.

**Yapılacaklar:**
- Her istatistiğin altına küçük bir kaynak/atıf ekle (yıl + kurum). Kaynak yoksa iddiayı
  yumuşat veya kaldır.

**Dosyalar:** "Neden şimdi" bölümü bileşeni.

> **Durum: ✅ Tamamlandı** (`problem.tsx`) — uydurma bir kaynak eklemek yerine gerçek, canlı
> araştırılmış istatistiklerle değiştirildi: "~%50 tüketici kasıtlı AI destekli arama
> kullanıyor" (McKinsey, AI Discovery Survey, 2025) ve "AI yanıtları genelde ilk 5 işletmeyle
> sınırlı" (SOCi, 2026 Local Visibility Index) — ikisi de canlı web aramasıyla doğrulandı,
> eski `%42`/`2-3` rakamları kaynaksızdı. "0 araç" iddiası bir istatistik değil, kaldırıldı
> denemez ama kaynak da gerektirmiyor (rakip yokluğuna dair mantıksal bir iddia).

✅ **Bitti sayılır:** Her sayısal iddianın görünür bir kaynağı var ya da iddia kaldırılmış.

---

## G4 · "Dokümanlar" linkini düzelt + İletişim sayfası ekle
**Neden:** "Dokümanlar" GitHub deposuna, "İletişime geç" onboarding'e gidiyor — profesyonel değil.

**Yapılacaklar:**
- `/iletisim` sayfası oluştur (e-posta + basit form veya mailto).
- Navbar/footer'daki "İletişime geç" bunu göstersin.
- "Dokümanlar" linkini ya kaldır ya da ileride gerçek bir `/docs` sayfasına bağlanacak şekilde
  şimdilik gizle.

**Dosyalar:** `src/app/iletisim/page.tsx`, navbar/footer bileşenleri.

> **Durum: ✅ Zaten tamamlanmıştı** (önceki bir oturumda, F2 spec'i kapsamında) —
> `/iletisim` değil **`/contact`** adıyla (İngilizce path, mevcut route adlandırma deseniyle
> tutarlı — `/onboarding`, `/dashboard` vb. de İngilizce). Form gerçek: `RESEND_API_KEY` +
> `CONTACT_TO_EMAIL` ayarlanınca e-posta gönderiyor, yoksa net bir 503 hatası veriyor (uydurma
> bir e-posta adresi eklenmedi). "Dokümanlar" linki kaldırıldı, yerine "Panoya git" kondu.

✅ **Bitti sayılır:** İletişim sayfası çalışıyor; müşteriye GitHub'a giden link kalmadı.

---

## G5 · Yasal sayfalar: KVKK / Gizlilik / Kullanım Şartları
**Neden:** Türkiye'de zorunlu; ödeme almadan önce **mutlaka** olmalı.

**Yapılacaklar:**
- `/gizlilik`, `/kullanim-sartlari`, `/kvkk` sayfalarını oluştur (statik içerik, placeholder
  metinle başlanabilir ama yapı kurulsun).
- Footer'a bu linkleri ekle.

**Dosyalar:** `src/app/gizlilik/page.tsx`, `src/app/kullanim-sartlari/page.tsx`,
`src/app/kvkk/page.tsx`, footer bileşeni.

> **Durum: ✅ Yapı kuruldu, içerik taslak.** Üç sayfa da yazıldı (KVKK madde 11 hakları dahil
> standart bölümlerle) ve footer'dan bağlandı. Her sayfanın üstünde **"Taslak metin"** uyarısı
> var — ben avukat değilim, bu metinler gerçek veri toplamadan/ödeme almadan önce bir hukuk
> danışmanına onaylatılmalı. Bu, spec'in kendi talimatıyla tutarlı ("placeholder metinle
> başlanabilir ama yapı kurulsun").

✅ **Bitti sayılır:** Üç yasal sayfa da footer'dan erişilebiliyor.

---

# FAZ 1 — Backend temeli (Supabase + Auth + Kalıcılık)

> **Durum: ⛔ B1–B4 başlanmadı** — gerçek bir Supabase projesi (URL + anon key + service role
> key) gerektiriyor, bunları ajan üretemez/uyduramaz. Bu tam olarak
> [`specs/F3-persistence-auth.md`](./specs/F3-persistence-auth.md)'ün kapsadığı iş — iki
> doküman aynı gerçek işi farklı ayrıntı seviyesinde tarif ediyor. Sen Supabase hesabını/
> anahtarlarını sağladığında hangi dokümanı (bu mu, F3 mü) referans alacağını seç, ikisini
> paralel uygulamaya çalışma.

## B1 · Supabase kurulumu + kimlik doğrulama
**Neden:** Kullanıcı hesabı, oturum ve kalıcılık olmadan ürün mock kalır.

**Yapılacaklar:**
- Supabase client'ı ekle (`@supabase/supabase-js`, gerekiyorsa `@supabase/ssr`).
- E-posta ile giriş/kayıt akışı (`/login`, `/signup`) ve oturum yönetimi.
- Korumalı rotalar: `/dashboard`, `/onboarding`, `/competitors`, `/actions` giriş ister.
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

✅ **Bitti sayılır:**
- Kayıt olup giriş yapılabiliyor, oturum kalıcı.
- Giriş yapmadan korumalı sayfalar açılmıyor.

---

## B2 · Veritabanı şeması + RLS
**Neden:** Tüm ürün verisi burada duracak; çok-kiracılık gün 1'den izole olmalı.

**Yapılacaklar:**
- Tablolar (README'deki plan): `businesses`, `locations`, `categories`, `competitors`,
  `queries`, `scans`, `scan_results`, `visibility_scores`, `recommendations`.
- Her tabloya `user_id`/`org_id` ekle ve **RLS politikaları** yaz: kullanıcı yalnızca kendi
  verisini görsün/yazsın.
- Migration dosyaları olarak sakla (`supabase/migrations/`).

✅ **Bitti sayılır:**
- Şema migration ile kurulabiliyor.
- Başka kullanıcının verisi RLS nedeniyle okunamıyor (test et).

---

## B3 · Veri katmanı arayüzü (mock → gerçek geçiş noktası)
**Neden:** `mock-data.ts` bağımlılığını tek noktadan gerçek sorgularla değiştirebilmek için.

**Yapılacaklar:**
- `src/lib/data/` altında tipli veri erişim fonksiyonları oluştur
  (`getBusiness`, `getVisibilityScore`, `getCompetitors`, `getRecommendations`, ...).
- Bu fonksiyonlar başta `mock-data.ts`'i döndürebilir; ama sayfalar artık **doğrudan**
  `mock-data.ts` yerine bu katmanı çağırsın.
- Böylece sonraki görevlerde sadece bu katmanın içi Supabase sorgularıyla değişir.

✅ **Bitti sayılır:** `/dashboard`, `/competitors`, `/actions` verisini `src/lib/data/`
üzerinden alıyor; sayfalarda doğrudan `mock-data.ts` importu kalmadı.

---

## B4 · Onboarding'i gerçekten kaydet
**Neden:** Şu an onboarding mock, kaydetmiyor.

**Yapılacaklar:**
- Onboarding sihirbazının çıktısını (işletme, bölge/lokasyon, kategoriler, rakipler)
  Supabase'e yaz.
- Kayıt sonrası kullanıcı gerçek verisiyle `/dashboard`'a düşsün.

✅ **Bitti sayılır:** Onboarding tamamlanınca veriler DB'ye yazılıyor ve panoda görünüyor.

---

> **Durum: ⛔ M1–M6 başlanmadı** — B1–B4'e bağımlı, ayrıca ek AI provider anahtarları
> (OpenAI/Gemini/Anthropic) ve `SERPAPI_KEY` gerektiriyor. Kapsam
> [`specs/F4-real-data-pipeline.md`](./specs/F4-real-data-pipeline.md) ile örtüşüyor.

# FAZ 2 — Ölçüm motoru (ÇEKİRDEK — en kritik kısım)

> Ürünün gerçek değeri ve en zor kısmı burası. Skorlar güvenilir değilse ürünün itibarı biter.

## M1 · Provider adaptör katmanı
**Neden:** 4 AI modelini tek arayüzden çağırmak, hataları/limitleri merkezî yönetmek için.

**Yapılacaklar:**
- `src/lib/providers/` altında ortak bir `Provider` arayüzü: `ask(query, options)` → normalize
  edilmiş cevap.
- Adaptörler: OpenAI, Gemini, Anthropic, Perplexity (Sonar zaten var, ona uydur).
- Hata yönetimi, timeout, retry ve provider bazlı rate limit.
- Tüm çağrılar server-side; anahtarlar env'den.

✅ **Bitti sayılır:** Tek bir fonksiyonla 4 sağlayıcıya aynı soru sorulup normalize cevap alınıyor.

---

## M2 · Soru evreni (query universe) üretimi
**Neden:** "Bölgede en iyi ___" gibi gerçek müşteri sorularını üretmeden ölçüm yapılamaz.

**Yapılacaklar:**
- İşletmenin bölge + kategorilerinden şablonlu sorular üret
  (örn. "Kadıköy'de en iyi diş kliniği", "İstanbul Anadolu yakası estetik diş önerisi").
- Üretilen soruları `queries` tablosuna yaz.

✅ **Bitti sayılır:** Bir işletme için otomatik, saklanan bir soru listesi oluşuyor.

---

## M3 · Tarama çalıştırıcı + anılma/sıra çıkarımı
**Neden:** Serbest metin AI cevabından "anıldım mı, kaçıncı sırada" bilgisini çıkarmak asıl iştir.

**Yapılacaklar:**
- Bir `scan` başlat: her soruyu her sağlayıcıya sor.
- Her cevaptan yapısal çıkarım yap: işletme anıldı mı (bool), sıra/pozisyon, birlikte anılan
  rakipler. (Çıkarım için ikinci bir LLM çağrısı veya yapılandırılmış prompt kullanılabilir.)
- Sonuçları `scan_results`'a yaz.

✅ **Bitti sayılır:** Bir tarama sonunda her (soru × sağlayıcı) için anılma + sıra kaydı var.

---

## M4 · Skor algoritması + varyans düşürme
**Neden:** LLM çıktısı her seferinde değişir; tek seferlik skora güvenilmez.

**Yapılacaklar:**
- Her soruyu **N kez** çalıştırıp topluluğun ortalamasını al.
- Anılma oranı + ortalama sıra + kanal ağırlığından savunulabilir bir **0-100** skor üret.
- Skoru `visibility_scores`'a zaman damgasıyla yaz (trend için).

✅ **Bitti sayılır:** Aynı işletme için tekrar tarandığında skor makul aralıkta stabil;
panodaki trend gerçek veriden besleniyor.

---

## M5 · Ham cevapları sakla (güven özelliği)
**Neden:** Müşteriye "işte seni anmayan gerçek ChatGPT cevabı" göstermek en güçlü güven kanıtı.

**Yapılacaklar:**
- Her sağlayıcının ham metin cevabını (ve modeli/tarihi) sakla.
- Panoda/rakip radarında "kanıtı gör" ile ham cevabı gösterebilecek altyapıyı hazırla.

✅ **Bitti sayılır:** Her skorun arkasındaki ham AI cevapları DB'de erişilebilir.

---

## M6 · Google entegrasyonu (SerpAPI)
**Neden:** Ürün AI + **Google** diyor; Google tarafı eksik.

**Yapılacaklar:**
- SerpAPI ile organik + yerel (local pack) + varsa AI Overview sonuçlarını çek.
- İşletmenin Google sıralamasını ölçüme dahil et; skora "Google kanalı" olarak kat.
- Env: `SERPAPI_KEY`.

✅ **Bitti sayılır:** Skorda AI kanallarının yanında gerçek Google sonucu da var.

---

> **Durum: ⛔ A1–A2, P1 başlanmadı** — B1–B4'e bağımlı; A1 gerçek bir Inngest hesabı, A2
> gerçek bir Stripe hesabı gerektiriyor. A2 kapsamı
> [`specs/F5-payments.md`](./specs/F5-payments.md) ile örtüşüyor.

# FAZ 3 — Otomasyon, para ve maliyet koruması

## A1 · Zamanlanmış taramalar (Inngest) + kota
**Neden:** Plan bazlı otomatik tarama (haftalık/günlük) ürünün sürekli değeri.

**Yapılacaklar:**
- Inngest ile zamanlı tarama işleri (Başlangıç: haftalık, Pro: günlük).
- İşler **idempotent**, retry'lı; her iş öncesi plan kotasını kontrol etsin.

✅ **Bitti sayılır:** Bir işletme plan sıklığında otomatik taranıyor; kota aşımında iş durdurulur.

---

## A2 · Stripe abonelik + webhook + plan kotası
**Neden:** Ödeme yoksa gelir yok.

**Yapılacaklar:**
- 3 plan (Başlangıç $39, Pro $99, Ajans $249+) için Stripe fiyatları.
- Checkout + webhook (abonelik durumu → DB); plan → izinli bölge/kategori/rakip/tarama sıklığı
  limiti kodda **zorlansın**.
- Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

✅ **Bitti sayılır:** Abonelik alınabiliyor; plan limitleri gerçekten uygulanıyor.

---

## P1 · Maliyet tavanı + önbellek + rate limit
**Neden:** Ürün müşteri başına çok LLM çağrısı yapıyor; marj riski buradan gelir.

**Yapılacaklar:**
- Aynı soru-bölge için sonuç önbelleği (belirli bir tazelik penceresinde paylaş).
- Tarama başına/gün başına maliyet tavanı; aşımda dur ve logla.
- Sağlayıcı bazlı rate limit.

✅ **Bitti sayılır:** Tekrarlı taramalar önbellekten dönüyor; maliyet tavanı aşımında iş güvenle
durup loglanıyor.

---

# FAZ 4 — Gözlemlenebilirlik

> **Durum: ⛔ Başlanmadı — ve önceki hiçbir pakette (01–14, F1–F5) yoktu.** Gerçek bir yeni
> bulgu: bu repo hiçbir hata izleme/loglama katmanı içermiyor. Gerçek bir Sentry hesabı/DSN
> gerektiriyor; onu sağladığında küçük, tek oturumluk bir görev.

## O1 · Hata takibi + loglama
**Neden:** Para alan bir üründe tarama işlerinin sessizce patlaması kabul edilemez.

**Yapılacaklar:**
- Sentry (veya benzeri) ekle.
- Tarama işleri için yapılandırılmış log + başarısızlık alarmı.

✅ **Bitti sayılır:** Bir tarama işi patlarsa hata paneline düşüyor.

---

## Öncelik özeti (tek bakışta)

| Sıra | Görev | Neden önce | Durum |
|------|-------|-----------|-------|
| 1 | G1–G5 | Backend'siz, sitede hemen görünür, güven + yasal | ✅ Tamamlandı (bu oturumda) |
| 2 | B1–B4 | Hesap + kalıcılık olmadan ürün yok | ⛔ Supabase hesabı/anahtarları bekliyor |
| 3 | M1–M6 | Çekirdek IP: ölçüm motoru | ⛔ B1–B4'e + ek API anahtarlarına bağımlı |
| 4 | A1–A2, P1 | Otomasyon + gelir + marj koruması | ⛔ B1–B4 + Inngest/Stripe hesabı bekliyor |
| 5 | O1 | Üretim güvenliği | ⛔ Sentry hesabı/DSN bekliyor |

> Tavsiye: Faz 0'ı bir oturumda bitir ve sitede test et. Sonra Faz 1'i tek tek uygula.
> Motor (Faz 2) doğru çalışmadan Faz 3'e (para) geçme.
