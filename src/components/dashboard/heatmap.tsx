import { cn } from "@/lib/utils";
import { heatmap } from "@/lib/mock-data";

export function Heatmap() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-2 text-left">
        <thead>
          <tr>
            <th className="text-xs font-normal text-muted">Soru</th>
            {heatmap.channels.map((c) => (
              <th key={c} className="px-1 text-center text-xs font-normal text-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heatmap.queries.map((q, qi) => (
            <tr key={q}>
              <td className="max-w-[220px] pr-3 text-[13px] text-fg">{q}</td>
              {heatmap.cells[qi].map((found, ci) => (
                <td key={ci} className="text-center">
                  <span
                    className={cn(
                      "inline-block h-5 w-5 rounded-md",
                      found ? "bg-gold/80" : "bg-white/[0.06]"
                    )}
                    title={found ? "Anılıyor" : "Anılmıyor"}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
