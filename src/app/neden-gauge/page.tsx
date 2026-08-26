import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { WhyHero } from "@/components/marketing/why-hero";
import { WhyComparison } from "@/components/marketing/why-comparison";
import { WhyPillars } from "@/components/marketing/why-pillars";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Neden Gauge — AI görünürlüğünü ölçen tek araç",
  description:
    "Google sıralaman iyi olabilir ama ChatGPT, Gemini, Claude ve Perplexity seni öneriyor mu? Gauge, elle takipten ve geleneksel SEO ajansından farklı olarak bunu gerçekten ölçer ve düzeltir.",
};

export default function NedenGaugePage() {
  return (
    <div className="relative z-10">
      <SiteHeader />
      <WhyHero />
      <WhyComparison />
      <WhyPillars />
      <FinalCta />
      <Footer />
    </div>
  );
}
