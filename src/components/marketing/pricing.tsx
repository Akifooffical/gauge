import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Başlangıç",
    price: "$39",
    period: "/ay",
    popular: false,
    features: [
      "1 işletme, 1 bölge + 3 kategori",
      "Haftalık AI + Google taraması",
      "Temel görünürlük skoru",
      "3 rakip takibi",
    ],
    cta: "Başla",
  },
  {
    name: "Profesyonel · popüler",
    price: "$99",
    period: "/ay",
    popular: true,
    features: [
      "3 bölge + 10 kategori",
      "Günlük tarama",
      "Rakip radarı + kaynak haritası",
      "Aksiyon merkezi & içerik üretici",
    ],
    cta: "Başla",
  },
  {
    name: "Ajans / Çok-lokasyon",
    price: "$249",
    period: "+/ay",
    popular: false,
    features: [
      "Çoklu müşteri & lokasyon",
      "Beyaz etiket raporlar",
      "API erişimi",
      "Öncelikli destek",
    ],
    cta: "İletişime geç",
  },
];

export function Pricing() {
  return (
    <section id="fiyat" className="border-t border-line py-[78px]">
      <Container>
        <Eyebrow>Fiyatlar</Eyebrow>
        <h2 className="mt-3.5 max-w-[20ch] font-display text-[clamp(26px,3.4vw,40px)] font-bold">
          Ajans fiyatı yok. Ölçen, düzelten motor var.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-panel border border-line bg-surface p-7",
                plan.popular &&
                  "border-signal bg-gradient-to-b from-surface-2 to-surface"
              )}
            >
              <div
                className={cn(
                  "font-mono text-xs uppercase tracking-[0.14em] text-muted",
                  plan.popular && "text-signal"
                )}
              >
                {plan.name}
              </div>
              <div className="mt-3.5 font-display text-[40px] font-extrabold tracking-tight">
                {plan.price}
                <span className="ml-1 font-sans text-base font-medium text-muted">
                  {plan.period}
                </span>
              </div>
              <ul className="my-5 flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="relative pl-6 text-sm text-muted">
                    <span className="absolute left-0 text-signal">→</span>
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/onboarding"
                variant={plan.popular ? "primary" : "ghost"}
                className="mt-auto justify-center"
              >
                {plan.cta}
              </ButtonLink>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
