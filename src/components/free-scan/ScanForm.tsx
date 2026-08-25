"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/onboarding/tag-input";
import { ScanResult, type FreeScanData } from "@/components/free-scan/ScanResult";

const LOADING_MESSAGES = [
  "Soru evreni oluşturuluyor...",
  "AI'ya soruluyor...",
  "Cevaplar taranıyor...",
  "Rakipler tespit ediliyor...",
  "Skor hesaplanıyor...",
];

type Status = "idle" | "loading" | "done" | "error";

export function ScanForm({ className }: { className?: string }) {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [showCompetitors, setShowCompetitors] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FreeScanData | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    if (status !== "loading") return;
    const interval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_MESSAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim() || !city.trim() || !category.trim()) return;

    const currentRequest = ++requestId.current;
    setStatus("loading");
    setError(null);
    setLoadingStep(0);

    try {
      const res = await fetch("/api/free-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          city: city.trim(),
          category: category.trim(),
          competitors,
        }),
      });

      const data = await res.json().catch(() => null);
      if (currentRequest !== requestId.current) return;

      if (!res.ok) {
        setError(data?.error || "Tarama başarısız oldu, tekrar dene.");
        setStatus("error");
        return;
      }

      setResult(data as FreeScanData);
      setStatus("done");
    } catch {
      if (currentRequest !== requestId.current) return;
      setError("Bağlantı hatası. Tekrar dene.");
      setStatus("error");
    }
  }

  function reset() {
    requestId.current++;
    setStatus("idle");
    setResult(null);
    setError(null);
  }

  if (status === "done" && result) {
    return <ScanResult data={result} onReset={reset} />;
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 rounded-2xl border border-line-2 bg-surface p-5 backdrop-blur-xl"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="İşletme adı — örn. Vera Diş Kliniği"
            aria-label="İşletme adı"
            required
            className="rounded-lg border border-line-2 bg-white/[0.02] px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-signal focus:outline-none"
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Şehir — örn. Kadıköy"
            aria-label="Şehir"
            required
            className="rounded-lg border border-line-2 bg-white/[0.02] px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-signal focus:outline-none"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Kategori — örn. diş kliniği"
            aria-label="Kategori"
            required
            className="rounded-lg border border-line-2 bg-white/[0.02] px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-signal focus:outline-none"
          />
        </div>

        {showCompetitors ? (
          <TagInput
            values={competitors}
            onChange={(vals) => setCompetitors(vals.slice(0, 2))}
            placeholder="Bilinen rakip (opsiyonel, en fazla 2) — Enter'a bas"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowCompetitors(true)}
            className="self-start text-xs text-muted underline decoration-line-2 underline-offset-4 hover:text-fg"
          >
            + Bilinen rakip ekle (opsiyonel)
          </button>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={status === "loading"}
          className={status === "loading" ? "cursor-not-allowed opacity-70" : "self-center px-10"}
        >
          {status === "loading" ? (
            <>
              <span className="gauge-blink-dot h-2 w-2 rounded-full bg-white" />
              {LOADING_MESSAGES[loadingStep]}
            </>
          ) : (
            "Görünürlüğümü gör"
          )}
        </Button>

        {status === "error" && error && (
          <p className="text-center text-sm text-accent-3">{error}</p>
        )}
      </form>
      <p className="mt-3 text-center text-[12.5px] text-muted">
        Kart gerekmez. AI web araması yaparak gerçek sonucu getirir, birkaç saniye sürer.
      </p>
    </div>
  );
}
