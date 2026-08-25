export type ScoreInput = {
  brandFound: boolean;
  brandRank: number | null;
};

/**
 * Sıraya göre azalan puan: 1. -> 1.0, 2. -> 0.8, 3. -> 0.6, ... 0'ın altına inmez.
 * Bulunamadıysa 0 puan.
 */
function questionPoint({ brandFound, brandRank }: ScoreInput): number {
  if (!brandFound || !brandRank || brandRank < 1) return 0;
  return Math.max(0, 1 - (brandRank - 1) * 0.2);
}

export function computeScore(results: ScoreInput[]): number {
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + questionPoint(r), 0);
  const avg = total / results.length;
  return Math.round(avg * 100);
}
