import { Card, Eyebrow } from "@/components/ui/card";
import { ScoreGauge } from "@/components/dashboard/score-gauge";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { ChannelBarChart } from "@/components/dashboard/channel-bar-chart";
import { Heatmap } from "@/components/dashboard/heatmap";
import { demoBusiness, overallScore } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="flex max-w-[1100px] flex-col gap-6">
      <div>
        <Eyebrow>Görünürlük panosu</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-bold">
          {demoBusiness.name} · {demoBusiness.location}
        </h1>
        <p className="mt-1 text-sm text-muted">{demoBusiness.category}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center justify-center p-8">
          <ScoreGauge score={overallScore} label="Genel görünürlük skoru" />
          <p className="mt-4 text-center text-xs text-muted">
            Son 8 haftada +26 puan. Trend yukarı yönlü.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="mb-1 text-sm font-semibold text-fg">Zaman içinde trend</h2>
          <p className="mb-2 text-xs text-muted">Haftalık genel görünürlük skoru</p>
          <TrendChart />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-1 text-sm font-semibold text-fg">Kanal kırılımı</h2>
        <p className="mb-2 text-xs text-muted">AI sağlayıcıları ve Google kanallarında skor</p>
        <ChannelBarChart />
      </Card>

      <Card className="p-6">
        <h2 className="mb-1 text-sm font-semibold text-fg">
          Hangi sorularda görünüyorsun / görünmüyorsun
        </h2>
        <p className="mb-4 text-xs text-muted">
          Bölge × kategori soru evreninden örnekler, kanal bazında
        </p>
        <Heatmap />
      </Card>
    </div>
  );
}
