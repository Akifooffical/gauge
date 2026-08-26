import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export function WhyHero() {
  return (
    <section className="px-6 pb-16 pt-[150px]">
      <Container className="px-0">
        <Eyebrow>Neden Gauge</Eyebrow>
        <h1 className="mt-3.5 max-w-[18ch] font-display text-[clamp(34px,5.4vw,64px)] font-bold leading-[1.04] tracking-[-0.02em]">
          SEO görünürlüğünü ölçtü. AI görünürlüğünü kimse ölçmüyordu.
        </h1>
        <p className="mt-6 max-w-[58ch] text-[17px] text-muted">
          Google sıralaman iyi olabilir, ajansın raporu tertemiz olabilir — ama biri ChatGPT&apos;ye
          &ldquo;Kadıköy&rsquo;de en iyi diş kliniği hangisi?&rdquo; diye sorduğunda hâlâ listede olmayabilirsin.
          Gauge, o soruyu gerçekten sorup cevabı ölçen tek araç.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <ButtonLink href="/#tarama">Ücretsiz taramanı yap</ButtonLink>
          <ButtonLink href="/onboarding" variant="ghost">
            İşletmeni kur
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
