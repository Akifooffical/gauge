# F1 — Deployment Erişimi & Grader'ı Canlı Yapma

> **Öncelik:** P0 · **Neden:** Paylaşılan link giriş duvarında; grader gerçek anahtar olmadan çalışmaz.
> **Mevcut durum:** Bu QA taraması **bu depoyu değil**, `gauge2-self.vercel.app` adlı ayrı
> (aynı hesap altında, muhtemelen kazara oluşmuş ikinci) bir Vercel projesini test etmiş. Bu
> deponun gerçek prod adresi `https://gauge-seven-tau.vercel.app` — Deployment Protection
> **kapalı**, giriş istemeden herkese açık (doğrulandı). Aşağıdaki 1–2 numaralı görevler bu
> depo için geçersiz; `gauge2` projesini kapatmak/birleştirmek ayrı bir karar, bu oturumda
> dokunulmadı. 4 ve 5 numaralı görevler tamamlandı, detay altta.

## Sorun

1. ~~`gauge2-rma79ck5t-gauge3.vercel.app` Vercel Deployment Protection arkasında → herkese kapalı.~~ (bu depoyla ilgisiz — yukarıya bak)
2. `/api/free-scan` gerçek bir Perplexity Sonar çağrısı yapıyor ama `PERPLEXITY_API_KEY` deployment'ta yoksa hata verir.

## Görevler

1. [ ] ~~Deployment Protection'ı kapat/ayarla~~ — bu depo zaten public, ilgisiz.
2. [ ] ~~Tek public URL belirle~~ — `gauge-seven-tau.vercel.app` zaten kanonik prod adresi.
3. [ ] **Env değişkenleri:** Vercel → Settings → Environment Variables → `PERPLEXITY_API_KEY`
   ekle (Production + Preview). **Bu adım hâlâ senin yapman gerekiyor** — gerçek bir API
   anahtarı, ben (ajan) üretemem/giremem.
4. [x] **`.env.local.example` oluşturuldu** — repo kökünde, `PERPLEXITY_API_KEY` dahil kodun
   okuduğu her değişken belgelenmiş durumda (bkz. `.env.local.example`).
5. [x] **Grader hata durumu düzeltildi** — `src/lib/free-scan/provider.ts`'e `isProviderConfigured()`
   eklendi; `/api/free-scan`, anahtar yoksa taramaya hiç başlamadan net bir `503` + Türkçe
   hata mesajı döner (önceden: sessizce "0 puan" gibi yanıltıcı bir sonuç dönüyordu — bu daha
   kötüydü, çünkü hata gibi görünmüyordu). `curl` ile doğrulandı.

## Kabul kriterleri

- [x] Link, giriş istemeden herkeste açılıyor (bu depo için zaten doğruydu).
- [ ] Grader gerçek işletme adıyla çalışıp 0–100 skor döndürüyor — **`PERPLEXITY_API_KEY`
  Vercel'e eklenene kadar test edilemez**, kod tarafı hazır.
- [x] Anahtar yoksa uygulama çökmüyor, anlaşılır hata gösteriyor.
