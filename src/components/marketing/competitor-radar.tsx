"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";
import { competitors } from "@/lib/mock-data";

export function CompetitorRadarTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="rakip" className="border-t border-line py-[78px]">
      <Container>
        <Eyebrow>Rakip radarı</Eyebrow>
        <h2 className="mt-3.5 max-w-[20ch] font-display text-[clamp(26px,3.4vw,40px)] font-bold">
          Asıl soru: rakibin senden önde mi?
        </h2>
        <div className="mt-2 grid items-center gap-12 md:grid-cols-2">
          <p className="max-w-[52ch] text-[17px] text-muted">
            Gauge, bölgende ve kategorinde AI&rsquo;ların önce hangi rakipleri saydığını gösterir.
            Kaybı görünce ne yapman gerektiği netleşir — biz de tam o eksiği kapatırız.
          </p>
          <div ref={ref} className="rounded-panel border border-line-2 bg-surface p-[22px]">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              &ldquo;Bölgede en iyi ___&rdquo; — anılma oranı
            </div>
            <div className="mt-3.5 flex flex-col gap-3.5">
              {competitors.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span
                    className={
                      "w-24 shrink-0 text-[13px] " +
                      (c.isYou ? "font-semibold text-gold" : "text-muted")
                    }
                  >
                    {c.isYou ? "Sen" : c.name}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-md bg-white/[0.06]">
                    <div
                      className={
                        "h-full rounded-md transition-[width] duration-[1100ms] ease-out " +
                        (c.isYou ? "bg-gradient-to-r from-gold to-[#ffd97a]" : "bg-miss")
                      }
                      style={{ width: animate ? `${c.score}%` : "0%" }}
                    />
                  </div>
                  <span
                    className={
                      "w-9 text-right font-mono text-[13px] " +
                      (c.isYou ? "text-gold" : "text-muted")
                    }
                  >
                    {c.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
