"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { ScanForm } from "@/components/free-scan/ScanForm";

const words = ["Ölç.", "Gör.", "Öne geç."];

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
            İşletme adını, şehrini ve kategorini yaz — ChatGPT, Gemini, Claude, Perplexity ve
            Google&apos;ın seni gerçekten anıp anmadığını birkaç saniyede gör.
          </p>

          <div
            id="tarama"
            className="gauge-fade-in mt-9 max-w-[620px] scroll-mt-28"
            style={{ animationDelay: "0.9s" }}
          >
            <ScanForm />
          </div>

          <div
            className="gauge-fade-in mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
            style={{ animationDelay: "1.0s" }}
          >
            <a href="#nasil" className="font-semibold text-fg transition-colors hover:text-gold">
              ▷ 90 saniyelik tur
            </a>
            <Link href="/dashboard" className="text-muted underline decoration-line-2 underline-offset-4 hover:text-fg">
              Demo panosunu gör
            </Link>
          </div>

          <div
            className="gauge-fade-in mt-[58px] font-mono text-[12.5px] uppercase tracking-[0.1em] text-muted"
            style={{ animationDelay: "1.1s" }}
          >
            ChatGPT · Gemini · Claude · Perplexity · Google — tek panoda.
          </div>
        </div>
      </section>
    </div>
  );
}
