"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Recommendation = {
  id: string;
  type: string;
  priority: number;
  title: string;
  reason: string;
  impact: string;
  status: "open" | "done" | "dismissed";
  payload: string;
};

const typeLabels: Record<string, string> = {
  schema: "Yapılandırılmış veri",
  missing_page: "Eksik sayfa",
  gbp: "Google profili",
  directory: "Dizin kaydı",
  content: "İçerik",
};

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [status, setStatus] = useState(rec.status);
  const [copied, setCopied] = useState(false);

  async function copyPayload() {
    try {
      await navigator.clipboard.writeText(rec.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard erişimi yoksa sessizce geç
    }
  }

  return (
    <div
      className={cn(
        "rounded-panel border border-line bg-surface p-5 transition-opacity",
        status === "dismissed" && "opacity-50"
      )}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-full bg-signal/12 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-signal">
          {typeLabels[rec.type] ?? rec.type}
        </span>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
          Öncelik {rec.priority}
        </span>
        <span className="rounded-full bg-gold/12 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold">
          Etki: {rec.impact}
        </span>
        {status === "done" && (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-emerald-400">
            Tamamlandı
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-semibold text-fg">{rec.title}</h3>
      <p className="mt-1.5 text-sm text-muted">{rec.reason}</p>

      <pre className="mt-3 max-h-40 overflow-auto rounded-lg border border-line bg-ink/60 p-3 text-xs text-muted">
        {rec.payload}
      </pre>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={copyPayload}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-2 px-3 py-1.5 text-xs text-fg transition-colors hover:border-signal"
        >
          <Copy size={13} />
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
        <button
          onClick={() => setStatus(status === "done" ? "open" : "done")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-2 px-3 py-1.5 text-xs text-fg transition-colors hover:border-signal"
        >
          <Check size={13} />
          {status === "done" ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle"}
        </button>
        <button
          onClick={() => setStatus(status === "dismissed" ? "open" : "dismissed")}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted transition-colors hover:text-fg"
        >
          <X size={13} />
          {status === "dismissed" ? "Geri al" : "Yoksay"}
        </button>
      </div>
    </div>
  );
}
