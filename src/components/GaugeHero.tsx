"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";

const words = ["Ölç.", "Gör.", "Öne geç."];

const metrics = [
  { value: "4", label: "kanal · canlı akış", color: "text-signal" },
  { value: "‹200ms", label: "yenileme gecikmesi", color: "text-gold" },
  { value: "%99.9", label: "çalışma süresi", color: "text-accent-3" },
];

export function GaugeHero() {
  return (
    <div className="relative z-10">
      <SiteHeader />

      <section className="relative flex min-h-screen flex-col justify-center px-6 pb-20 pt-[120px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <span className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.22em] text-gold">
            <span className="gauge-blink-dot h-[7px] w-[7px] rounded-full bg-gold shadow-[0_0_12px_var(--gold)]" />
            Gerçek zamanlı görünürlük motoru
          </span>

          <h1 className="mt-[26px] font-display text-[clamp(52px,10vw,140px)] font-bold leading-[0.98] tracking-[-0.03em]">
            {words.map((word, i) => (
              <span key={word} className="gauge-word">
                <span style={{ animationDelay: `${0.15 + i * 0.15}s` }}>
                  {word === "Öne geç." ? (
                    <>
                      Öne geç<span className="text-signal">.</span>
                    </>
                  ) : (
                    word
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="gauge-fade-in mt-7 max-w-[52ch] text-[19px] text-muted"
            style={{ animationDelay: "0.7s" }}
          >
            Gauge, işletmenin tüm performans sinyallerini tek bir canlı panoda toplar — ölçersin,
            rakiplerinle kıyaslarsın, doğru anda öne geçersin.
          </p>

          <div className="gauge-fade-in mt-9 flex flex-wrap gap-3.5" style={{ animationDelay: "0.9s" }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-[13px] px-[26px] py-[15px] text-[15px] font-semibold text-white shadow-[0_14px_44px_-14px_rgba(139,108,255,.8)] transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, var(--signal), #6f4ff0)" }}
            >
              Panoyu aç
            </Link>
            <a
              href="#nasil"
              className="inline-flex items-center gap-2 rounded-[13px] border border-line-2 bg-white/[0.04] px-[26px] py-[15px] text-[15px] font-semibold text-fg transition-colors hover:border-gold"
            >
              ▷ 90 saniyelik tur
            </a>
          </div>

          <div className="gauge-fade-in mt-[58px] flex flex-wrap gap-10" style={{ animationDelay: "1.1s" }}>
            {metrics.map((m) => (
              <div key={m.label}>
                <div className={`font-display text-3xl font-bold tracking-[-0.02em] ${m.color}`}>
                  {m.value}
                </div>
                <div className="mt-1 font-mono text-[12.5px] tracking-[0.05em] text-muted">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
