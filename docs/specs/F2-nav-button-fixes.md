# F2 — Navigasyon & Buton Düzeltmeleri

> **Öncelik:** P1 · **Neden:** Yanlış hedefler, kopuk pazarlama↔uygulama geçişi, doğrulanmamış çapalar.
> **Mevcut durum:** Bu dosyadaki 8 görevin 7'si bu oturumda tamamlandı. Kalan tek madde
> (#6, aksiyon durumunun DB'ye yazılması) F3'e (auth+DB) bağlı — o gelene kadar local state
> zaten çalışıyor, aşağıya bak.

## Görevler

1. [x] **"Dokümanlar" hedefi (L1):** menüden kaldırıldı (`src/components/marketing/site-header.tsx`)
   — GitHub kaynak deposu artık son kullanıcıya gösterilmiyor.
2. [x] **Fiyat butonları (L2):** Başlangıç/Profesyonel "Başla" → **"Ücretsiz dene"** oldu,
   `/onboarding`'e gidiyor (`pricing.tsx`). Stripe (F5) gelince checkout'a bağlanacak.
3. [x] **"İletişime geç" (L3):** Ajans butonu artık yeni bir **`/contact`** sayfasına gidiyor —
   `/onboarding`'e değil. `/contact`, `POST /api/contact` üzerinden gerçek bir formu
   `RESEND_API_KEY` + `CONTACT_TO_EMAIL` ayarlandığında gönderir (aynı free-scan'deki gibi
   "anahtar yoksa net 503 hatası" deseni — uydurma bir mailto adresi eklemedik, bkz.
   `.env.local.example`). `mailto:` de istersen `NEXT_PUBLIC_CONTACT_EMAIL` ayarlayınca
   sayfada otomatik görünür.
4. [x] **`#tarama` çapası (L4):** `id="tarama"` zaten `final-cta.tsx`'te vardı (önceki bir
   oturumda eklenmişti); `curl` ile doğrulandı, boşa düşmüyor. `nasil`/`fiyat`/`tarama` üçü de
   doğru.
5. [x] **Pazarlama ↔ uygulama köprüsü (L5):** pazarlama nav'ına **"Panoya git"** (`/dashboard`)
   eklendi (`site-header.tsx`, "Dokümanlar"ın yerine). Uygulama tarafında sidebar'a **"Siteye
   dön"** linki eklendi (`app-shell/sidebar.tsx`) — logo zaten `/`'e gidiyordu, bu daha açık bir
   ikinci yol.
6. [ ] **Aksiyon Merkezi butonları:** kod incelendi — bu QA raporunun düşündüğünden daha
   ileride: "Kopyala" gerçekten panoya kopyalıyor (`navigator.clipboard`), "Tamamlandı
   işaretle"/"Yoksay" gerçek React state ile çalışıyor, görsel geri bildirim var
   (`recommendation-card.tsx`). Eksik olan tek şey **kalıcılık** (sayfa yenilenince state
   sıfırlanır) — bu F3 (DB) bağımlı, DB gelmeden "gerçek" kalıcılık yapılamaz.
7. [x] **Tüm butonların tıklanabilirliği:** site genelinde tarandı; hover/disabled durumları
   mevcut bileşenlerde zaten vardı (`Button`/`ButtonLink`), yeni eklenen `/contact` formu da
   loading/disabled durumunu `ScanForm` ile aynı desenle uyguluyor.
8. [x] **404 & yükleme:** markalı bir `not-found.tsx` eklendi (`src/app/not-found.tsx`) —
   önceden Next.js'in çıplak varsayılan 404'ü kullanılıyordu.

## Kabul kriterleri

- [x] Menüdeki hiçbir link yanlış/ölü hedefe gitmiyor.
- [x] Çapalar (`#nasil`, `#fiyat`, `#tarama`) doğru bölüme kayıyor.
- [x] Pazarlama ve uygulama arasında iki yönlü geçiş var.
- [x] Aksiyon butonları görünür sonuç üretiyor (kopya/durum) — kalıcılık hariç (F3 bekliyor).
- [x] Bilinmeyen rota düzgün 404 gösteriyor.
