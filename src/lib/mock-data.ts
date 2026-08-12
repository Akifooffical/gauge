export const demoBusiness = {
  name: "Vera Diş Kliniği",
  location: "Kadıköy, İstanbul",
  category: "İmplant Kliniği",
  plan: "Profesyonel",
};

export const overallScore = 78;

export const channelScores = [
  { channel: "ChatGPT", key: "openai", score: 82 },
  { channel: "Gemini", key: "gemini", score: 74 },
  { channel: "Claude", key: "claude", score: 69 },
  { channel: "Perplexity", key: "perplexity", score: 88 },
  { channel: "Google Organik", key: "google_organic", score: 91 },
  { channel: "Google Yerel Paket", key: "google_local", score: 65 },
];

export const trend = [
  { week: "1. hafta", score: 52 },
  { week: "2. hafta", score: 55 },
  { week: "3. hafta", score: 58 },
  { week: "4. hafta", score: 63 },
  { week: "5. hafta", score: 67 },
  { week: "6. hafta", score: 70 },
  { week: "7. hafta", score: 74 },
  { week: "8. hafta", score: 78 },
];

export const competitors = [
  { name: "Vera Diş Kliniği", score: 78, isYou: true },
  { name: "Rakip Klinik A", score: 71, isYou: false },
  { name: "Rakip Klinik B", score: 54, isYou: false },
  { name: "Rakip Klinik C", score: 38, isYou: false },
];

export const heatmap = {
  channels: ["ChatGPT", "Gemini", "Claude", "Perplexity", "Google"],
  queries: [
    "Kadıköy'de en iyi implant kliniği",
    "Anadolu yakasında diş beyazlatma",
    "İstanbul'da güvenilir ortodontist",
    "Kadıköy acil diş hekimi",
    "Kadıköy uzman ağız ve diş sağlığı",
  ],
  cells: [
    [true, true, false, true, true],
    [true, false, false, true, true],
    [false, true, true, false, true],
    [true, true, true, true, true],
    [false, false, false, true, true],
  ],
};

export const recommendations = [
  {
    id: "rec-1",
    type: "schema",
    priority: 1,
    title: "LocalBusiness yapılandırılmış verisi eksik",
    reason:
      "Sitende LocalBusiness schema kodu yok; AI ve Google seni bir işletme olarak net tanıyamıyor.",
    impact: "Yüksek",
    status: "open" as const,
    payload: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Vera Diş Kliniği",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kadıköy",
    "addressRegion": "İstanbul"
  },
  "areaServed": "Kadıköy, İstanbul"
}
</script>`,
  },
  {
    id: "rec-2",
    type: "missing_page",
    priority: 2,
    title: '"Anadolu Yakası" için hizmet sayfası yok',
    reason:
      "Bu bölge adıyla aranan sorularda görünmüyorsun çünkü sitede özel bir hizmet sayfan yok.",
    impact: "Orta-Yüksek",
    status: "open" as const,
    payload:
      "Taslak başlık: \"Anadolu Yakası İmplant ve Diş Tedavisi\" — 600 kelimelik SEO uyumlu taslak hazır, düzenleyip yayınlayabilirsin.",
  },
  {
    id: "rec-3",
    type: "gbp",
    priority: 2,
    title: "Google İşletme Profilinde eksik alanlar",
    reason: "Kategori, çalışma saatleri ve hizmet listesi eksik görünüyor.",
    impact: "Orta",
    status: "open" as const,
    payload: "Kontrol listesi: kategori ekle, çalışma saatlerini gir, 5 hizmet ekle, 3 fotoğraf yükle.",
  },
  {
    id: "rec-4",
    type: "directory",
    priority: 3,
    title: "AI'ın güvendiği bir dizinde kaydın yok",
    reason:
      "Perplexity ve Gemini bu kategoride sık sık belirli sağlık dizinlerine referans veriyor; sende kayıt yok.",
    impact: "Orta",
    status: "done" as const,
    payload: "Önerilen dizinler: DoktorTakvimi, Vitrinim, Google Sağlık Rehberi.",
  },
];

export const sourceMap = [
  { source: "DoktorTakvimi", weight: 34 },
  { source: "Google İşletme Profili", weight: 28 },
  { source: "Vitrinim", weight: 16 },
  { source: "Sektörel haber siteleri", weight: 12 },
  { source: "Diğer dizinler", weight: 10 },
];
