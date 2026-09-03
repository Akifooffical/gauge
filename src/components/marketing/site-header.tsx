"use client";

import Link from "next/link";

const navLinks = [
  { href: "/#nasil", label: "Ürün" },
  { href: "/neden-gauge", label: "Neden Gauge" },
  { href: "/#fiyat", label: "Fiyatlar" },
  { href: "/dashboard", label: "Panoya git" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex justify-center p-5">
      <nav className="flex w-[min(1100px,94%)] items-center justify-between rounded-2xl border border-line-2 bg-surface py-3 pl-[22px] pr-3 backdrop-blur-2xl">
        <Link
          href="/"
          className="flex items-center gap-[11px] font-display text-[19px] font-bold tracking-[-0.01em]"
        >
          <span className="relative inline-block h-4 w-4">
            <span className="gauge-spin absolute inset-0 rounded-full border-2 border-signal border-t-transparent" />
            <span
              className="absolute inset-[5px] rounded-full bg-gold"
              style={{ boxShadow: "0 0 12px var(--gold)" }}
            />
          </span>
          Gauge
        </Link>

        <div className="hidden gap-7 text-sm text-muted md:flex">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-[11px] bg-fg px-[18px] py-2.5 text-sm font-semibold text-[#0a0a12] transition-transform hover:-translate-y-px"
        >
          Ücretsiz başla →
        </Link>
      </nav>
    </header>
  );
}
