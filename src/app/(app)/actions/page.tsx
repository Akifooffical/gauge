import { Eyebrow } from "@/components/ui/card";
import { RecommendationCard } from "@/components/actions/recommendation-card";
import { recommendations } from "@/lib/mock-data";

export default function ActionsPage() {
  const sorted = [...recommendations].sort((a, b) => a.priority - b.priority);

  return (
    <div className="flex max-w-[820px] flex-col gap-6">
      <div>
        <Eyebrow>Aksiyon merkezi</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-bold">
          Görünmeme nedenleri, önceliklendirilmiş
        </h1>
        <p className="mt-1 text-sm text-muted">
          Her öneri için neden önemli olduğunu, tahmini etkisini ve tek tıkla kullanılabilir
          çıktıyı görürsün.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {sorted.map((rec) => (
          <RecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}
