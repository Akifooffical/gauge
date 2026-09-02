# Spec 09 — Ücretsiz Grader Hunisi

> **Faz:** 3 (Faz 1 ile paralel yapılabilir — hızlı kazanım) · **Etki:** Orta · **Maliyet:** Düşük
> **Varsayımlar:** Landing'de zaten "30 saniye / kart gerekmez / AI web araması yapıp gerçek sonucu getirir" bölümü var — bunu tam çalışan bir grader'a çevir.
>
> **Mevcut durum: bu spec'in çekirdeği zaten üretimde**, farklı bir uçtan:
> - `POST /api/free-scan` ([`route.ts`](../../src/app/api/free-scan/route.ts)) çalışıyor —
>   ama bu spec'in tasarımından farklı olarak **tek grounded sağlayıcıya (Perplexity Sonar)
>   6 farklı soru varyasyonu** sorar, "2-3 model × 1 sorgu" değil. Sonuç aynı işi görüyor
>   (gerçek web-arama tabanlı skor) ama mimarisi farklı — spec'i buna göre oku, `/api/grader/run`'ı
>   sıfırdan yazmak yerine bu endpoint'i temel al ya da bilinçli olarak ayrı tut.
> - `src/components/free-scan/{ScanForm,ScanResult}.tsx` landing'in final-CTA bölümünde canlı;
>   "Landing'i canlı akışa bağla" görevi tamamlandı.
> - `src/lib/free-scan/rateLimit.ts` IP+oturum rate limiti ve 24s şehir+kategori cache'i zaten
>   yapıyor; "sonuç cache + maliyet koruması" kabul kriteri karşılanıyor.
> - `ScanResult.tsx`, sonucu `/onboarding?business=...` ile taşıyor — ama sadece işletme adı;
>   bölge/kategori/skor önceden doldurulmuyor (kabul kriteri kısmen karşılanıyor).
>
> **Hâlâ eksik:** e-posta duvarı (`/api/grader/unlock` benzeri soft-gate — şu an sonuç
> tamamen ücretsiz/kayıtsız gösteriliyor), `GraderRun` kalıcılığı (şu an sonuçlar DB'ye
> yazılmıyor, sadece rate-limit/cache anahtarı olarak bellek/Upstash'te kısa ömürlü tutuluyor),
> ve Spec 08'e anonim talep-verisi besleme köprüsü.

## Problem

Rakiplerin çoğu ücretsiz tek-seferlik bir "skor" ile huni başı yapıyor (HubSpot AI Search Grader, Semrush AI Search Visibility Checker, Ayzeo/Cheers "free instant audit, no credit card"). Bu, CAC'ı düşüren en ucuz büyüme kaldıracı. Gauge'un landing'inde vaat var ama tam bir grader akışı + e-posta yakalama + kayda dönüşüm kurgusu netleştirilmeli.

## Kullanıcı hikayesi

> Potansiyel müşteri olarak, işletme adımı + bölge + kategori girip 30 saniyede "AI seni anıyor mu, rakibini mi" sonucunu kartsız görmek; sonucu detaylandırmak için e-posta bırakıp ücretsiz hesaba geçmek istiyorum.

## Kapsam

- **Anlık grader:** işletme + bölge + kategori (+ opsiyonel bilinen rakip) → birkaç AI modelinde canlı sorgu → skor + "seni anan/anmayan modeller" + rakip kıyası.
- **E-posta duvarı (soft):** özet ücretsiz; detay (kaynaklar, tam rakip listesi, aksiyonlar) için e-posta/kayıt.
- **Onboarding'e köprü:** grader sonucu yeni hesaba önceden doldurularak taşınır.
- **Talep verisine besleme:** girilen sorgular anonim agregat olarak Spec 08'e akar.

## Veri modeli (Prisma)

```prisma
model GraderRun {
  id          String   @id @default(cuid())
  businessName String
  region      String
  category    String
  competitor  String?
  score       Int               // 0-100
  modelResults Json             // [{model, mentioned, position}]
  email       String?           // bırakıldıysa
  convertedToAccount Boolean @default(false)
  ipHash      String            // rate-limit / abuse
  createdAt   DateTime @default(now())
  @@index([category, region])
  @@index([createdAt])
}
```

## Uygulama mantığı

1. Form: işletme adı, bölge, kategori, opsiyonel rakip.
2. Canlı sorgu: 2–3 model (maliyet için sınırlı) + web arama → anılma/pozisyon.
3. Skor: basit görünürlük skoru + "şu modelde görünmüyorsun" mesajı.
4. Ücretsiz özet göster; detay için e-posta/kayıt (soft gate).
5. Rate limit: `ipHash` başına gün limiti (abuse önleme).
6. Kayda dönüşürse `GraderRun` → onboarding'e taşınır.

## API

```
POST /api/grader/run        // { businessName, region, category, competitor? } → özet skor
POST /api/grader/unlock     // { runId, email } → detaylı sonuç + hesap daveti
```

## UI

- Landing'deki mevcut "30 saniye" bölümünü canlı akışa bağla.
- Sonuç kartı: skor halkası + model rozetleri (yeşil anıyor / gri anmıyor) + rakip kıyas çubuğu.
- "Detayı gör → e-posta" soft gate.
- "Ücretsiz hesabına taşı" CTA → onboarding (sonuç önden dolu).

## Kabul kriterleri

- [ ] Form girdisiyle 2–3 modelde canlı sorgu çalışıp skor üretiliyor (~30 sn).
- [ ] Ücretsiz özet kartsız gösteriliyor; detay için soft e-posta gate çalışıyor.
- [ ] `ipHash` rate limit abuse'u sınırlıyor.
- [ ] Grader sonucu onboarding'e taşınıyor (önceden dolu).
- [ ] Girilen sorgular anonim agregat olarak talep verisine (Spec 08) akıyor.
- [ ] Maliyet: çalışma başına model sayısı sınırlı + sonuç cache (aynı sorgu tekrarında).

## Görevler

1. [ ] `GraderRun` şema + migrate.
2. [ ] `/api/grader/run` (sınırlı model + web arama + skor + rate limit).
3. [ ] `/api/grader/unlock` (e-posta + hesap daveti).
4. [ ] Landing'deki bölümü canlı grader'a bağla (sonuç kartı UI).
5. [ ] Onboarding'e sonuç taşıma.
6. [ ] Talep verisi besleme köprüsü (Spec 08).
7. [ ] Sonuç cache + maliyet koruması.
