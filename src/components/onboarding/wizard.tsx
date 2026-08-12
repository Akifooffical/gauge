"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/onboarding/tag-input";
import { cn } from "@/lib/utils";

const steps = ["İşletme", "Bölgeler", "Kategoriler", "Rakipler", "Gözden geçir"];

export function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState(searchParams.get("business") ?? "");
  const [website, setWebsite] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const canNext =
    (step === 0 && businessName.trim().length > 0) ||
    (step === 1 && locations.length > 0) ||
    (step === 2 && categories.length > 0) ||
    (step === 3 && competitors.length > 0) ||
    step === 4;

  if (done) {
    return (
      <Card className="flex flex-col items-center gap-4 p-12 text-center">
        <CheckCircle2 className="text-gold" size={40} />
        <h2 className="font-display text-2xl font-bold">Kurulum tamamlandı</h2>
        <p className="max-w-[46ch] text-sm text-muted">
          {businessName || "İşletmen"}, {locations.join(", ")} bölgelerinde ve{" "}
          {categories.join(", ")} kategorilerinde taranmaya hazır. İlk tarama sonuçların pano
          üzerinde görünecek.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Panoya git</Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        {steps.map((s, i) => (
          <div
            key={s}
            className={cn(
              "flex-1 rounded-full py-1.5 text-center font-mono text-[11px] uppercase tracking-[0.08em]",
              i === step
                ? "bg-signal text-[#04121c]"
                : i < step
                  ? "bg-signal/25 text-signal"
                  : "bg-white/[0.06] text-muted"
            )}
          >
            {s}
          </div>
        ))}
      </div>

      <Card className="p-8">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted">İşletme adı</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="örn. Vera Diş Kliniği"
                className="w-full rounded-lg border border-line-2 bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-signal focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">Web sitesi (opsiyonel)</label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-line-2 bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-signal focus:outline-none"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="mb-1.5 block text-sm text-muted">
              Hizmet verdiğin bölgeler
            </label>
            <TagInput
              values={locations}
              onChange={setLocations}
              placeholder="örn. Kadıköy, İstanbul — Enter'a bas"
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="mb-1.5 block text-sm text-muted">Kategorilerin</label>
            <TagInput
              values={categories}
              onChange={setCategories}
              placeholder="örn. implant kliniği — Enter'a bas"
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="mb-1.5 block text-sm text-muted">Takip edeceğin rakipler</label>
            <TagInput
              values={competitors}
              onChange={setCompetitors}
              placeholder="örn. Rakip Klinik A — Enter'a bas"
            />
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-3 text-sm">
            <Row label="İşletme" value={businessName || "—"} />
            <Row label="Web sitesi" value={website || "—"} />
            <Row label="Bölgeler" value={locations.join(", ") || "—"} />
            <Row label="Kategoriler" value={categories.join(", ") || "—"} />
            <Row label="Rakipler" value={competitors.join(", ") || "—"} />
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={step === 0 ? "invisible" : ""}
        >
          Geri
        </Button>
        <Button
          type="button"
          disabled={!canNext}
          onClick={() => {
            if (step === steps.length - 1) {
              setDone(true);
            } else {
              setStep((s) => s + 1);
            }
          }}
          className={!canNext ? "cursor-not-allowed opacity-40" : ""}
        >
          {step === steps.length - 1 ? "Kaydet ve taramayı başlat" : "İleri"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line pb-2.5">
      <span className="text-muted">{label}</span>
      <span className="text-fg">{value}</span>
    </div>
  );
}
