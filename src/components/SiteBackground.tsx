"use client";

import { usePathname } from "next/navigation";
import { GaugeBackground } from "@/components/GaugeBackground";
import { GaugeReelBackground } from "@/components/GaugeReelBackground";

// Pazarlama sayfaları (landing, "Neden Gauge") tam boyutta animasyonlu "gauge-reel" arka
// planını kullanır. Uygulama sayfaları (pano, onboarding, rakip radarı, aksiyon merkezi)
// kendi gerçek skor/grafik verisini gösterir — reel'in demo sahneleri (skor sayacı, trend
// çizgisi, kanal çubukları) görsel olarak neredeyse aynı olduğu için burada gerçek veriyle
// çakışıp "hayalet ikinci pano" görünümü yaratıyor. Bu yüzden uygulama tarafı, aynı ailenin
// sade ve nötr üyesi olan WebGL shader'da kalır.
const ROUTE_THEME: Record<string, { paletteShift: number; intensity: number; label: string }> = {
  "/": { paletteShift: 0, intensity: 1, label: "01 — Realtime" },
  "/dashboard": { paletteShift: 0.16, intensity: 0.85, label: "02 — Pano" },
  "/onboarding": { paletteShift: 0.32, intensity: 0.9, label: "03 — Onboarding" },
  "/competitors": { paletteShift: 0.5, intensity: 0.85, label: "04 — Rakip Radarı" },
  "/actions": { paletteShift: 0.68, intensity: 0.85, label: "05 — Aksiyon Merkezi" },
  "/neden-gauge": { paletteShift: 0.84, intensity: 0.9, label: "06 — Neden Gauge" },
};

const REEL_ROUTES = new Set(["/", "/neden-gauge"]);

function themeFor(pathname: string) {
  if (ROUTE_THEME[pathname]) return ROUTE_THEME[pathname];
  const match = Object.keys(ROUTE_THEME)
    .filter((key) => key !== "/")
    .find((key) => pathname.startsWith(key));
  return match ? ROUTE_THEME[match] : ROUTE_THEME["/"];
}

export function SiteBackground() {
  const pathname = usePathname();
  const path = pathname ?? "/";
  const theme = themeFor(path);
  const useReel = REEL_ROUTES.has(path);

  return (
    <>
      {useReel ? (
        <GaugeReelBackground />
      ) : (
        <GaugeBackground paletteShift={theme.paletteShift} intensity={theme.intensity} />
      )}

      {/*
        okunabilirlik için vinyet katmanı — reel'in kendi sahne içeriği (kelimeler, şekiller)
        zaman zaman öne çıktığında gerçek sayfa metniyle çakışmasın diye merkez de dahil
        hiçbir nokta tam saydam bırakılmıyor.
      */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, rgba(7,7,12,.38) 0%, rgba(7,7,12,.6) 55%, rgba(7,7,12,.92) 100%)",
        }}
        aria-hidden="true"
      />

      <div
        className="gauge-scanline pointer-events-none fixed inset-x-0 top-0 z-[1] h-px opacity-50"
        style={{
          background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed bottom-[22px] left-7 z-[15] font-mono text-[11px] uppercase tracking-[0.16em] text-fg/35">
        Signal · Live
      </div>
      <div className="pointer-events-none fixed bottom-[22px] right-7 z-[15] text-right font-mono text-[11px] uppercase tracking-[0.16em] text-fg/35">
        Gauge / {theme.label}
      </div>
    </>
  );
}
