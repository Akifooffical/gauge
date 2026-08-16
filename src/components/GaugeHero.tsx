"use client";

import Link from "next/link";
import { GaugeBackground } from "@/components/GaugeBackground";

const navLinks = [
  { href: "#nasil", label: "Ürün" },
  { href: "#rakip", label: "Metrikler" },
  { href: "#fiyat", label: "Fiyatlar" },
  { href: "https://github.com/Akifooffical/gauge", label: "Dokümanlar", external: true },
];

const words = ["Ölç.", "Gör.", "Öne geç."];

const metrics = [
  { value: "4", label: "kanal · canlı akış", color: "text-hero-accent" },
  { value: "‹200ms", label: "yenileme gecikmesi", color: "text-hero-accent-2" },
  { value: "%99.9", label: "çalışma süresi", color: "text-hero-accent-3" },
];

export function GaugeHero() {
  return (
    <div
      className="relative font-[family-name:var(--font-hero-body)] text-hero-text"
      style={{ colorScheme: "dark" }}
    >
      <GaugeBackground />

      {/* okunabilirlik için ek vinyet katmanı */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(7,7,12,.55) 78%, rgba(7,7,12,.9) 100%)",
        }}
        aria-hidden="true"
      />

      <div
        className="gauge-scanline pointer-events-none fixed inset-x-0 top-0 z-[1] h-px opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--hero-accent-2), transparent)",
        }}
        aria-hidden="true"
      />

      <header className="fixed inset-x-0 top-0 z-20 flex justify-center p-5">
        <nav className="flex w-[min(1100px,94%)] items-center justify-between rounded-2xl border border-hero-line-2 bg-hero-surface/55 py-3 pl-[22px] pr-3 backdrop-blur-2xl">
          <Link
            href="/"
            className="flex items-center gap-[11px] font-[family-name:var(--font-hero-display)] text-[19px] font-bold tracking-[-0.01em]"
          >
            <span className="relative inline-block h-4 w-4">
              <span className="gauge-spin absolute inset-0 rounded-full border-2 border-hero-accent border-t-transparent" />
              <span
                className="absolute inset-[5px] rounded-full bg-hero-accent-2"
                style={{ boxShadow: "0 0 12px var(--hero-accent-2)" }}
              />
            </span>
            Gauge
          </Link>

          <div className="hidden gap-7 text-sm text-hero-muted md:flex">
            {navLinks.map((l) =>
              l.external ? (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-hero-text"
                >
                  {l.label}
                </a>
              ) : (
                <a key={l.label} href={l.href} className="transition-colors hover:text-hero-text">
                  {l.label}
                </a>
              )
            )}
          </div>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-[11px] bg-hero-text px-[18px] py-2.5 text-sm font-semibold text-[#0a0a12] transition-transform hover:-translate-y-px"
          >
            Ücretsiz başla →
          </Link>
        </nav>
      </header>

      <section className="relative z-[2] flex min-h-screen flex-col justify-center px-6 pb-20 pt-[120px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <span className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.22em] text-hero-accent-2">
            <span className="gauge-blink-dot h-[7px] w-[7px] rounded-full bg-hero-accent-2 shadow-[0_0_12px_var(--hero-accent-2)]" />
            Gerçek zamanlı görünürlük motoru
          </span>

          <h1 className="mt-[26px] font-[family-name:var(--font-hero-display)] text-[clamp(52px,10vw,140px)] font-bold leading-[0.98] tracking-[-0.03em]">
            {words.map((word, i) => (
              <span key={word} className="gauge-word">
                <span style={{ animationDelay: `${0.15 + i * 0.15}s` }}>
                  {word === "Öne geç." ? (
                    <>
                      Öne geç<span className="text-hero-accent">.</span>
                    </>
                  ) : (
                    word
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="gauge-fade-in mt-7 max-w-[52ch] text-[19px] text-hero-muted"
            style={{ animationDelay: "0.7s" }}
          >
            Gauge, işletmenin tüm performans sinyallerini tek bir canlı panoda toplar — ölçersin,
            rakiplerinle kıyaslarsın, doğru anda öne geçersin.
          </p>

          <div className="gauge-fade-in mt-9 flex flex-wrap gap-3.5" style={{ animationDelay: "0.9s" }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-[13px] px-[26px] py-[15px] text-[15px] font-semibold text-white shadow-[0_14px_44px_-14px_rgba(139,108,255,.8)] transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, var(--hero-accent), #6f4ff0)" }}
            >
              Panoyu aç
            </Link>
            <a
              href="#nasil"
              className="inline-flex items-center gap-2 rounded-[13px] border border-hero-line-2 bg-white/[0.04] px-[26px] py-[15px] text-[15px] font-semibold text-hero-text transition-colors hover:border-hero-accent-2"
            >
              ▷ 90 saniyelik tur
            </a>
          </div>

          <div className="gauge-fade-in mt-[58px] flex flex-wrap gap-10" style={{ animationDelay: "1.1s" }}>
            {metrics.map((m) => (
              <div key={m.label}>
                <div
                  className={`font-[family-name:var(--font-hero-display)] text-3xl font-bold tracking-[-0.02em] ${m.color}`}
                >
                  {m.value}
                </div>
                <div className="mt-1 font-mono text-[12.5px] tracking-[0.05em] text-hero-muted">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pointer-events-none fixed bottom-[22px] left-7 z-[15] font-mono text-[11px] uppercase tracking-[0.16em] text-hero-text/35">
        Signal · Live
      </div>
      <div className="pointer-events-none fixed bottom-[22px] right-7 z-[15] text-right font-mono text-[11px] uppercase tracking-[0.16em] text-hero-text/35">
        Gauge / 01 — Realtime
      </div>
    </div>
  );
}
