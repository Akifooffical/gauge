import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
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
      <Header />
      <Hero />
      <Problem />
      <HowItWorks />
      <Sectors />
      <CompetitorRadarTeaser />
      <Pricing />
      <FinalCta />
      <Footer />
    </>
  );
}
