import { GaugeHero } from "@/components/GaugeHero";
import { Problem } from "@/components/marketing/problem";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Sectors } from "@/components/marketing/sectors";
import { CompetitorRadarTeaser } from "@/components/marketing/competitor-radar";
import { Pricing } from "@/components/marketing/pricing";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <GaugeHero />
      {/* GaugeHero'nun sabit (fixed) 3D arka planının üzerinde opak şekilde durması için */}
      <div className="relative z-10 bg-ink">
        <Problem />
        <HowItWorks />
        <Sectors />
        <CompetitorRadarTeaser />
        <Pricing />
        <FinalCta />
        <Footer />
      </div>
    </>
  );
}
