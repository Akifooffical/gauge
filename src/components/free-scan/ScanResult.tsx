import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { ButtonLink, Button } from "@/components/ui/button";
import { ScoreGauge } from "@/components/dashboard/score-gauge";

export type FreeScanQuestionResult = {
  question: string;
  brandFound: boolean;
  brandRank: number | null;
  competitors: string[];
};

export type FreeScanData = {
  score: number;
  brandName: string;
  results: FreeScanQuestionResult[];
  topCompetitor: string | null;
  sampleSources: string[];
};

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ScanResult({ data, onReset }: { data: FreeScanData; onReset: () => void }) {
  const foundCount = data.results.filter((r) => r.brandFound).length;

  return (
    <div className="gauge-fade-in flex flex-col items-center gap-7 rounded-2xl border border-line-2 bg-surface p-7 backdrop-blur-xl">
      <ScoreGauge score={data.score} label={`${data.brandName} — AI görünürlük skoru`} />

      <p className="max-w-[46ch] text-center text-[15px] text-fg">
        {foundCount === 0 ? (
          <>
            AI, sorduğumuz {data.results.length} sorunun hiçbirinde{" "}
            <span className="font-semibold text-accent-3">{data.brandName}</span>&apos;i önermedi.
          </>
        ) : (
          <>
            AI, {data.results.length} sorudan {foundCount} tanesinde{" "}
            <span className="font-semibold text-gold">{data.brandName}</span>&apos;i andı.
          </>
        )}
        {data.topCompetitor && (
          <>
            {" "}
            En sık öne çıkan rakip:{" "}
            <span className="font-semibold text-signal">{data.topCompetitor}</span>.
          </>
        )}
      </p>

      <div className="flex w-full flex-col gap-2.5">
        {data.results.map((r, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-4 rounded-lg border border-line bg-white/[0.02] px-4 py-3 text-left"
          >
            <div className="flex items-start gap-3">
              {r.brandFound ? (
                <CheckCircle2 className="mt-0.5 shrink-0 text-gold" size={18} />
              ) : (
                <XCircle className="mt-0.5 shrink-0 text-miss" size={18} />
              )}
              <div>
                <p className="text-sm text-fg">{r.question}</p>
                {r.brandFound && r.brandRank && (
                  <p className="mt-0.5 font-mono text-xs text-gold">{r.brandRank}. sırada anıldı</p>
                )}
                {!r.brandFound && r.competitors[0] && (
                  <p className="mt-0.5 text-xs text-muted">
                    Öne çıkan: <span className="text-fg">{r.competitors[0]}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href={`/onboarding?business=${encodeURIComponent(data.brandName)}`}>
          Tam raporu ve düzeltme önerilerini al → Kayıt ol
        </ButtonLink>
        <Button type="button" variant="ghost" onClick={onReset}>
          <RotateCcw size={15} />
          Yeni tarama
        </Button>
      </div>

      {data.sampleSources.length > 0 && (
        <p className="max-w-[52ch] text-center text-[11px] text-muted">
          Kaynaklardan bazıları:{" "}
          {data.sampleSources.map((src, i) => (
            <span key={src}>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line-2 underline-offset-2 hover:text-fg"
              >
                {hostnameOf(src)}
              </a>
              {i < data.sampleSources.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
