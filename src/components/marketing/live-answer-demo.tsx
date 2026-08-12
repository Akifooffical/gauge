"use client";

import { useEffect, useState } from "react";

const QUESTION = "Kadıköy'de en iyi implant kliniği hangisi?";

const BEFORE = [
  { name: "Rakip Klinik A", tag: "önerildi" },
  { name: "Rakip Klinik B", tag: "önerildi" },
  { name: "Rakip Klinik C", tag: null },
];

export function LiveAnswerDemo() {
  const [typed, setTyped] = useState("");
  const [showCaret, setShowCaret] = useState(true);
  const [visibleRanks, setVisibleRanks] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      const timer = setTimeout(() => {
        setTyped(QUESTION);
        setShowCaret(false);
        setVisibleRanks(BEFORE.length);
        setShowAfter(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    let i = 0;
    let typeTimer: ReturnType<typeof setTimeout>;
    const type = () => {
      if (i <= QUESTION.length) {
        setTyped(QUESTION.slice(0, i));
        i += 1;
        typeTimer = setTimeout(type, 42);
      } else {
        setTimeout(() => {
          BEFORE.forEach((_, idx) => {
            setTimeout(() => setVisibleRanks((v) => Math.max(v, idx + 1)), idx * 260);
          });
          setTimeout(() => setShowAfter(true), BEFORE.length * 260 + 260);
        }, 400);
      }
    };
    type();
    return () => clearTimeout(typeTimer);
  }, []);

  return (
    <div className="relative rounded-[18px] border border-line-2 bg-gradient-to-b from-surface to-[#0d1f29] p-[22px] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
      <div className="flex min-h-[24px] items-center gap-2.5 border-b border-line pb-4 text-[13.5px] text-muted">
        🔎{" "}
        <span className="text-fg">{typed}</span>
        {showCaret && <span className="animate-caret inline-block h-[15px] w-0.5 bg-signal" />}
      </div>
      <div className="my-3 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
        AI cevabı
      </div>
      <div>
        {BEFORE.map((rank, idx) => (
          <div
            key={rank.name}
            className={
              "mb-2 flex items-center gap-3.5 rounded-[10px] px-3 py-[11px] transition-all duration-500 " +
              (idx < visibleRanks ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0")
            }
          >
            <span className="w-5 font-mono text-[13px] text-miss">{idx + 1}</span>
            <span className="text-[15px] text-miss">{rank.name}</span>
            {rank.tag && (
              <span className="ml-auto rounded-full bg-miss/25 px-2 py-[3px] font-mono text-[10.5px] uppercase tracking-[0.1em] text-miss">
                {rank.tag}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="my-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
        Gauge devrede →
      </div>
      <div
        className={
          "flex items-center gap-3.5 rounded-[10px] border border-gold/40 bg-gold/10 px-3 py-[11px] transition-all duration-500 " +
          (showAfter ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0")
        }
      >
        <span className="w-5 font-mono text-[13px] font-semibold text-gold">1</span>
        <span className="text-[15px] font-semibold text-gold">Senin İşletmen</span>
        <span className="ml-auto rounded-full bg-gold px-2 py-[3px] font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#2a1d00]">
          önerildi
        </span>
      </div>
    </div>
  );
}
