"use client";

import { useEffect, useState } from "react";

/**
 * Tam ekran arka plan olarak "gauge-reel.html" — bağımsız, kendi kendine yeten bir
 * animasyon bundle'ı (public/ altında statik dosya olarak servis edilir). Kendi React/Babel
 * çalışma zamanını taşıdığı için iframe içinde izole çalıştırılır.
 */
export function GaugeReelBackground() {
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (reduceMotion) {
    return <div className="fixed inset-0 z-0 bg-ink" aria-hidden="true" />;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink" aria-hidden="true">
      {/*
        Reel bundle'ı kendi oynatma/tweak HUD'unu (scrubber, oynat/durdur, indir) iframe'in
        kendi viewport'una position:fixed ile bağlıyor. Bunu gizlemenin dışarıdan güvenilir
        tek yolu, iframe'i görünür alandan taşacak kadar uzatıp fazlasını kırpmak: HUD, taşan
        kısımda kalır ve overflow-hidden onu görünmez yapar.
      */}
      <iframe
        src="/gauge-reel.html"
        title="Gauge arka plan animasyonu"
        className="w-full border-0"
        style={{ height: "calc(100% + 90px)" }}
      />
    </div>
  );
}
