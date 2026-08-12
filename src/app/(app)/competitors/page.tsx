import { Card, Eyebrow } from "@/components/ui/card";
import { CompetitorBarChart } from "@/components/dashboard/competitor-bar-chart";
import { competitors, sourceMap } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function CompetitorsPage() {
  return (
    <div className="flex max-w-[1100px] flex-col gap-6">
      <div>
        <Eyebrow>Rakip radarı</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-bold">
          Bölgende ve kategorinde kim önde?
        </h1>
        <p className="mt-1 text-sm text-muted">
          Seçtiğin rakiplerin AI ve Google görünürlüğü, senin yanında.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="mb-1 text-sm font-semibold text-fg">Görünürlük skoru karşılaştırması</h2>
        <p className="mb-2 text-xs text-muted">Genel skor, 0-100</p>
        <CompetitorBarChart />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold text-fg">Sıralama</h2>
        <div className="flex flex-col gap-2">
          {competitors
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((c, i) => (
              <div
                key={c.name}
                className={cn(
                  "flex items-center gap-4 rounded-lg px-4 py-3",
                  c.isYou ? "border border-gold/40 bg-gold/10" : "bg-white/[0.03]"
                )}
              >
                <span className="w-5 font-mono text-sm text-muted">{i + 1}</span>
                <span className={cn("text-sm", c.isYou ? "font-semibold text-gold" : "text-fg")}>
                  {c.isYou ? "Sen" : c.name}
                </span>
                <span className="ml-auto font-mono text-sm text-muted">{c.score}</span>
              </div>
            ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-1 text-sm font-semibold text-fg">Kaynak haritası</h2>
        <p className="mb-4 text-xs text-muted">
          AI modellerinin bu kategoride en çok güvendiği kaynaklar
        </p>
        <div className="flex flex-col gap-3">
          {sourceMap.map((s) => (
            <div key={s.source} className="flex items-center gap-3">
              <span className="w-52 shrink-0 text-sm text-muted">{s.source}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-md bg-white/[0.06]">
                <div
                  className="h-full rounded-md bg-signal"
                  style={{ width: `${s.weight * 2}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-xs text-muted">{s.weight}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
