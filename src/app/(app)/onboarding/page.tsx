import { Suspense } from "react";
import { Eyebrow } from "@/components/ui/card";
import { OnboardingWizard } from "@/components/onboarding/wizard";

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-6">
      <div>
        <Eyebrow>Onboarding</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-bold">İşletmeni kur</h1>
        <p className="mt-1 text-sm text-muted">
          Bölgeni, kategorini ve rakiplerini tanımla — Gauge senin için soru evrenini oluşturup
          taramaya başlasın.
        </p>
      </div>
      <Suspense fallback={null}>
        <OnboardingWizard />
      </Suspense>
    </div>
  );
}
