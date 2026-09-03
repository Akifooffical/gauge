# F5 — Ödeme & Plan Kotası (Stripe)

> **Öncelik:** P4 · **Neden:** Fiyat butonları gerçek bir kayıt/ödeme yapmıyor; plan kotaları uygulanmıyor.
> **Bağımlılık:** F3 (auth + `businesses.plan`).
> **Mevcut durum:** F3'e bağımlı olduğu için başlanmadı; ayrıca gerçek bir Stripe hesabı +
> ürün/fiyat ID'leri gerektiriyor. Bu arada fiyat butonlarının etiketi/hedefi F2'de düzeltildi
> ("Ücretsiz dene" → `/onboarding`, "İletişime geç" → `/contact`) — en azından yanlış vaat
> vermiyorlar.

## Kapsam

- Stripe Checkout (starter $39 / pro $99 / agency $249+) + müşteri portalı.
- Webhook ile abonelik durumunu `businesses.plan`'a yaz.
- Plan bazlı kota (bölge/kategori/rakip sayısı, tarama sıklığı) uygulama katmanında zorunlu.

## Görevler

1. [ ] Stripe hesabı + ürün/fiyatlar; env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_*_PRICE_ID`.
2. [ ] `POST /api/checkout` — seçilen plan için Checkout Session oluştur; fiyat butonları buraya bağlanır (F2/L2).
3. [ ] `POST /api/stripe/webhook` — `checkout.session.completed`, `customer.subscription.updated/deleted` → `businesses.plan` + durum güncelle.
4. [ ] `GET /api/billing/portal` — müşteri portalı linki (plan değiştir/iptal).
5. [ ] **Kota zorlama:** onboarding ve tarama sırasında plan limitlerini kontrol et (starter: 1 bölge/3 kategori/3 rakip/haftalık; pro: 3 bölge/10 kategori/günlük; agency: çoklu). Aşımda upsell.
6. [ ] Fiyat kartlarını gerçekle: "Başla" → Checkout; "İletişime geç" (agency) → iletişim/satış (F2/L3).

## Kabul kriterleri

- [ ] Kullanıcı bir planı Checkout ile satın alabiliyor; dönüşte plan aktif.
- [ ] Webhook aboneliği doğru şekilde `businesses.plan`'a yazıyor.
- [ ] Plan limitleri onboarding + tarama sırasında uygulanıyor.
- [ ] Kullanıcı portaldan planını yönetebiliyor.
