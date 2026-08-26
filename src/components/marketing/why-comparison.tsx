import { Check, Minus, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Cell = true | false | "partial";

type Row = {
  label: string;
  manual: Cell;
  agency: Cell;
  gauge: Cell;
};

const rows: Row[] = [
  { label: "AI'da (ChatGPT, Gemini, Claude, Perplexity) anılıyor musun?", manual: false, agency: false, gauge: true },
  { label: "Google'da görünürlük", manual: "partial", agency: true, gauge: true },
  { label: "Rakiplerle yan yana karşılaştırma", manual: false, agency: "partial", gauge: true },
  { label: "Güncelleme sıklığı", manual: "partial", agency: false, gauge: true },
  { label: "Somut düzeltme önerisi (ne yapmalıyım?)", manual: false, agency: "partial", gauge: true },
  { label: "Kurulum süresi", manual: true, agency: false, gauge: true },
  { label: "Aylık maliyet", manual: true, agency: false, gauge: true },
];

function CellIcon({ value }: { value: Cell }) {
  if (value === true) return <Check size={17} className="text-gold" />;
  if (value === false) return <X size={17} className="text-miss" />;
  return <Minus size={17} className="text-muted" />;
}

export function WhyComparison() {
  return (
    <section className="border-t border-line py-[78px]">
      <Container>
        <Eyebrow>Alternatiflerle kıyas</Eyebrow>
        <h2 className="mt-3.5 max-w-[24ch] font-display text-[clamp(26px,3.4vw,40px)] font-bold">
          Elle takip yavaş. Ajans pahalı ve AI&apos;ı görmüyor.
        </h2>
        <p className="mt-4 max-w-[56ch] text-[17px] text-muted">
          Üçü de &ldquo;görünürlük&rdquo; kelimesini kullanır. Sadece biri AI asistanlarına
          gerçekten soru sorup cevabı ölçer.
        </p>

        <div className="mt-11 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line-2">
                <th className="py-3.5 pr-4 font-mono text-xs uppercase tracking-[0.1em] text-muted">
                  Kriter
                </th>
                <th className="px-4 py-3.5 text-center font-mono text-xs uppercase tracking-[0.1em] text-muted">
                  Kendin takip et
                </th>
                <th className="px-4 py-3.5 text-center font-mono text-xs uppercase tracking-[0.1em] text-muted">
                  Geleneksel SEO ajansı
                </th>
                <th className="px-4 py-3.5 text-center font-mono text-xs uppercase tracking-[0.1em] text-signal">
                  Gauge
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={cn("border-b border-line", i === rows.length - 1 && "border-none")}
                >
                  <td className="py-4 pr-4 text-[14.5px] text-fg">{row.label}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center">
                      <CellIcon value={row.manual} />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center">
                      <CellIcon value={row.agency} />
                    </div>
                  </td>
                  <td className="rounded-t-md bg-signal/[0.06] px-4 py-4 text-center">
                    <div className="flex justify-center">
                      <CellIcon value={row.gauge} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
