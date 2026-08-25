const MAX_QUERIES = 6;

export type QueryInput = {
  city: string;
  category: string;
};

/**
 * Şehir + kategoriden, farklı arama niyetlerini temsil eden Türkçe sorular üretir.
 * Kullanıcının bir AI'ya gerçekten sorabileceği ifadelere yakın durur ki grounded
 * cevaplar gerçek öneri listelerine benzesin.
 */
export function generateQueries({ city, category }: QueryInput): string[] {
  const c = city.trim();
  const k = category.trim();

  const templates = [
    `${c}'de en iyi ${k} hangisi?`,
    `${c}'de güvenilir bir ${k} önerir misin?`,
    `${c}'de en iyi 3 ${k} sırala.`,
    `${c}'de uygun fiyatlı ${k} önerileri neler?`,
    `${c}'de tavsiye edilen ${k} hangileri?`,
    `${c}'de yüksek puanlı bir ${k} arıyorum, hangisini önerirsin?`,
  ];

  return templates.slice(0, MAX_QUERIES);
}
