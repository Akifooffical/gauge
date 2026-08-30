"use client";

import { usePathname } from "next/navigation";
import { GaugeSceneBackground } from "@/components/GaugeSceneBackground";
import type { SceneKey } from "@/components/gauge-scenes";

// Her rota kendi sahnesini çalıştırır. Handoff'taki tasarım 4 nav sekmesi + 4 app rotası
// için 6 sahne öngörüyordu ("Fiyatlar"/"Dokümanlar" burada ayrı rota değil, "/" üzerinde
// hash/dış bağlantı — bkz. site-header.tsx) — bizde 6 gerçek rota var, 6 sahneyle birebir
// eşleşiyor.
const ROUTE_SCENE: Record<string, { scene: SceneKey; label: string }> = {
  "/": { scene: "signalFlow", label: "01 — Sinyal Akışı" },
  "/neden-gauge": { scene: "geoGridRadar", label: "02 — Geo-Grid Radar" },
  "/dashboard": { scene: "prismaticDial", label: "03 — Prizmatik Kadran" },
  "/onboarding": { scene: "onboardingStair", label: "04 — Kurulum Merdiveni" },
  "/competitors": { scene: "competitorRadar", label: "05 — Rakip Radarı" },
  "/actions": { scene: "layeredEngines", label: "06 — Katmanlı Motorlar" },
};

function sceneFor(pathname: string) {
  if (ROUTE_SCENE[pathname]) return ROUTE_SCENE[pathname];
  const match = Object.keys(ROUTE_SCENE)
    .filter((key) => key !== "/")
    .find((key) => pathname.startsWith(key));
  return match ? ROUTE_SCENE[match] : ROUTE_SCENE["/"];
}

export function SiteBackground() {
  const pathname = usePathname() ?? "/";
  const { scene, label } = sceneFor(pathname);

  return (
    <>
      <GaugeSceneBackground scene={scene} />

      {/* okunabilirlik vinyeti — sahne parlak olduğunda metin kontrastını korur */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, rgba(7,7,12,.24) 0%, rgba(7,7,12,.52) 58%, rgba(7,7,12,.9) 100%)",
        }}
        aria-hidden="true"
      />

      <div
        className="gauge-scanline pointer-events-none fixed inset-x-0 top-0 z-[1] h-px opacity-50"
        style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed bottom-[22px] left-7 z-[15] font-mono text-[11px] uppercase tracking-[0.16em] text-fg/35">
        Signal · Live
      </div>
      <div className="pointer-events-none fixed bottom-[22px] right-7 z-[15] text-right font-mono text-[11px] uppercase tracking-[0.16em] text-fg/35">
        Gauge / {label}
      </div>
    </>
  );
}
