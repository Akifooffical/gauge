# Gauge — Fonksiyonel Tarama & QA Raporu

**Test tarihi:** 3 Eylül 2026
**Test edilen adres:** `https://gauge2-self.vercel.app` (public)
**İstenen adres:** `https://gauge2-rma79ck5t-gauge3.vercel.app` → **erişilemedi** (aşağıya bak)
**Kaynak:** `github.com/Akifooffical/gauge` README + canlı rota testi

> **Bu depoya özel not:** Test edilen adresler (`gauge2-*`) **bu depo değil** — aynı hesap
> altında ayrı, muhtemelen kazara oluşmuş ikinci bir Vercel projesi (`gauge2`). Bu deponun
> gerçek prod adresi `https://gauge-seven-tau.vercel.app`, Deployment Protection kapalı ve
> herkese açık (§1'deki erişim sorunu bu depo için geçerli değil). İki proje muhtemelen
> aynı kod tabanının farklı anlarından; bu depo daha güncel (o tarihten sonra `/neden-gauge`,
> `/contact`, çok-sahneli WebGL arka plan gibi ekler yapıldı). §2–6'daki mimari bulgular
> (mock veri, auth/DB/ödeme yok) her iki proje için de doğru — kod tabanı aynı katmanları
> paylaşıyor. Hangi bulgunun bu oturumda düzeltildiği için `specs/F1-F5`'teki "Mevcut durum"
> notlarına bak.

---

## 0. Test yönteminin sınırları (şeffaflık)

- Statik HTML çekilerek test edildi; **JavaScript çalıştırılamadı**. Yani buton tıklama, form gönderme, grafik render ve canlı akış gibi client-side davranışlar **birebir tıklanarak** değil, rota + işaretleme + kaynak koda bakılarak doğrulandı.
- Bazı bulgular "**doğrula**" etiketli — bunlar tarayıcıda elle kontrol edilmeli (aşağıda işaretli).

---

## 1. KRİTİK: İstenen link erişilemez

`gauge2-rma79ck5t-gauge3.vercel.app` açıldığında **Vercel giriş sayfasına** yönleniyor (Deployment Protection / Vercel Authentication açık). Sonuç:

- Sen ve hesabına erişimi olmayan **hiç kimse** (potansiyel müşteri, yatırımcı, ben) bu linki açamaz.
- Bu bir preview deployment; korumalı.

**Yapılacak:** Vercel projesi → Settings → Deployment Protection → Vercel Authentication'ı **kapat** (veya "Only Preview Deployments" bırakıp production alias'ı public yap). Alternatif: zaten public olan `gauge2-self.vercel.app` production alias'ını kullan. Detay: `specs/F1-deployment-access.md`.

---

## 2. Rota / sekme haritası — hepsi açılıyor ✅

İki ayrı navigasyon var:

### Pazarlama navigasyonu (`/`, `/neden-gauge`)
| Sekme | Gittiği yer | Durum | Not |
|-------|-------------|-------|-----|
| Gauge (logo) | `/` | ✅ | Doğru |
| Ürün | `/#nasil` | ✅ | Ana sayfadaki "Nasıl çalışır" bölümüne çapa |
| Neden Gauge | `/neden-gauge` | ✅ | Doğru |
| Fiyatlar | `/#fiyat` | ✅ | Ana sayfa fiyat bölümüne çapa |
| Dokümanlar | `github.com/Akifooffical/gauge` | ⚠️ | **Yanlış hedef** — aşağıya bak |
| Ücretsiz başla → | `/onboarding` | ✅ | Doğru |

### Uygulama navigasyonu (`/dashboard`, `/onboarding`, `/competitors`, `/actions`)
| Sekme | Gittiği yer | Durum |
|-------|-------------|-------|
| Pano | `/dashboard` | ✅ |
| Onboarding | `/onboarding` | ✅ |
| Rakip Radarı | `/competitors` | ✅ |
| Aksiyon Merkezi | `/actions` | ✅ |

Tüm sayfalar HTTP 200 dönüyor, tasarım render oluyor. **Navigasyonun kendisi sağlam.**

---

## 3. Yanlış / eksik giden linkler ve nereye gitmeli

| # | Öğe | Şu an | Sorun | Olması gereken |
|---|-----|-------|-------|----------------|
| L1 | "Dokümanlar" | GitHub kaynak deposu | Son kullanıcı için yanlış; kaynak kodu + mock doğasını ifşa ediyor | Gerçek ürün dokümanı sayfası (`/docs`) veya en azından yardım/rehber. MVP'de gizlenebilir. |
| L2 | Fiyat kartları "Başla" (×2) | `/onboarding` | Ödeme yok; kayıt/checkout değil | Stripe checkout veya kayıt akışı (F5). Şimdilik `/onboarding` kabul edilebilir ama etiket "Ücretsiz dene" olmalı. |
| L3 | "İletişime geç" (Ajans) | `/onboarding` | Kurumsal satış onboarding'e gitmemeli | İletişim formu / `mailto:` / Calendly. |
| L4 | "Ücretsiz taramanı yap" (neden-gauge) | `/#tarama` | Çapa hedefi | **Doğrula:** ana sayfadaki grader bölümünde `id="tarama"` var mı? Yoksa çapa boşa düşer. |
| L5 | Pazarlama ↔ Uygulama geçişi | Yok | Pazarlama nav'ında panoya, uygulama nav'ında ana sayfaya (logo hariç) link yok | İki dünyayı köprüle: pazarlamada "Panoya git", uygulamada breadcrumb/anasayfa. |

---

## 4. Ne gerçekten çalışıyor, ne mock

README net söylüyor: bu bir **frontend MVP**; gerçek servisler (Supabase, Stripe, Inngest, AI sağlayıcıları) **henüz bağlı değil**. Detay:

### Gerçekten çalışan ✅
- Tüm sayfaların tasarımı ve statik içeriği.
- Sayfalar arası yönlendirme.
- **`/api/free-scan`** — işletme adı + şehir + kategori ile **gerçek** bir web-bağlantılı modele (Perplexity Sonar) soru sorup 0–100 skor döndüren **çalışan prototip**. (Akıllı ve doğru bir MVP tercihi.) **KOŞUL:** deployment'ta `PERPLEXITY_API_KEY` tanımlı olmalı — yoksa grader hata verir. **Doğrula:** canlı grader'ı çalıştırıp gerçek skor dönüyor mu.

### Mock / çalışmıyor ⚠️
| Alan | Durum |
|------|-------|
| Onboarding formu | Girdiği veriyi **kaydetmiyor** (mock). Ne girersen gir, pano hep "Vera Diş Kliniği" gösteriyor. |
| Pano (skor, trend, kanal kırılımı, ısı) | `src/lib/mock-data.ts`'ten sabit demo veri. |
| Rakip Radarı | Mock (Rakip Klinik A/B/C, kaynak haritası sabit). |
| Aksiyon Merkezi | Mock öneriler; "Kopyala / Tamamlandı / Yoksay" butonları **doğrula** (durum kalıcı mı, yoksa sadece görsel mi). |
| Auth / kullanıcı | Yok. Çok kiracılı (multi-tenant) değil. |
| Ödeme | Yok (Stripe bağlı değil). |
| Arka plan tarama işleri | Yok (Inngest bağlı değil). |
| Google/SerpAPI verisi | Yok. |

### Statik çekimde boş görünen ve **doğrulanması gereken** yerler
- Pano: "Hangi sorularda görünüyorsun" tablosunun kanal hücreleri (ChatGPT/Gemini/Claude/Perplexity/Google) boş görünüyor. Client-side render olabilir; **tarayıcıda dolu mu kontrol et**.
- Pano: "Zaman içinde trend" ve "Kanal kırılımı" grafikleri (Recharts) — statikte veri yok; **render doğrula**.
- `/neden-gauge`: karşılaştırma tablosu hücreleri (Kendin takip et / Ajans / Gauge) boş görünüyor — **işaret/✓ render'ı doğrula**; boşsa içerik eksiği.

---

## 5. Rakip kıyası — çalışır bir üründe olması gerekenler

Global oyuncuların (Profound, Peec AI, Otterly, Local Falcon) standart hâle getirdiği ve bu MVP'de **henüz olmayan** çekirdek yetenekler (öncelik sırasıyla):

1. **Gerçek veri katmanı** — mock yerine kalıcı DB + kullanıcı başına gerçek tarama. (Rakiplerin hepsinde var; olmadan ürün "demo".)
2. **Kimlik & çok-kiracılık** — hesap, oturum, işletme başına izole veri.
3. **Zamanlanmış tarama** — haftalık/günlük otomatik tarama (fiyat sayfası bunu vaat ediyor ama arka plan işi yok).
4. **Citation/kaynak zekası + sentiment** — anılmanın ötesinde *neden* ve *nasıl* (önceki `gauge-specs/01, 02`).
5. **GBP entegrasyonu + geo-grid harita** (önceki `gauge-specs/04, 05`).
6. **Gelir atıfı (ROI)** ve **prompt/talep hacmi** (önceki `gauge-specs/07, 08`).
7. **Fact Guard + Agent-Ready** — kategoriden ayrışma (önceki `gauge-agent-ready/10, 11, 12`).

> Not: 4–7 için detaylı, VS Code-hazır spec'ler önceki iki pakette zaten mevcut. Bu rapordaki öncelik **1–3**: çünkü "sistemin çalıştığından emin ol" demek, önce mock'u gerçek veri/auth/tarama ile değiştirmek demek. Özellik eklemek ondan sonra gelir.

---

## 6. Özet öncelik sırası

| Öncelik | Ne | Neden | Spec |
|---------|-----|------|------|
| **P0** | Deployment erişimi + `PERPLEXITY_API_KEY` | Link açılmıyor; grader çalışmıyor olabilir | F1 |
| **P1** | Nav/buton düzeltmeleri | Yanlış hedefler, kopuk geçişler | F2 |
| **P2** | Auth + DB (Supabase) — onboarding kaydetsin | Ürünü "demo"dan "gerçek"e taşır | F3 |
| **P3** | Gerçek veri pipeline (provider adaptörleri + tarama → pano/rakip/aksiyon) | Mock'u gerçek veriyle değiştirir | F4 |
| **P4** | Ödeme (Stripe) | Fiyat butonlarını gerçek yapar | F5 |
| **P5+** | Citation/sentiment/GBP/geo-grid/ROI/Fact Guard/Agent-Ready | Rakip paritesi + ayrışma | önceki paketler |

Detaylı, uygulanabilir düzeltme adımları `specs/F1–F5` dosyalarında.
