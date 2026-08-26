import { Radar, ScanSearch, Sparkles, Wrench } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";

const pillars = [
  {
    icon: ScanSearch,
    title: "AEO-native, SEO değil",
    text: "Sıralama değil, cevap ölçülür. Gauge, ChatGPT/Gemini/Claude/Perplexity'e gerçek müşteri sorularını sorar ve senin adının geçip geçmediğini, kaçıncı sırada olduğunu kaydeder.",
  },
  {
    icon: Radar,
    title: "Rakip radarı",
    text: "Sadece kendi skorun değil — bölgende ve kategorinde AI hangi rakipleri önce sayıyor, hangi kaynaklara güveniyor, hepsi tek panoda.",
  },
  {
    icon: Wrench,
    title: "Fix engine",
    text: "Skoru göstermekle yetinmeyiz. Eksik bölge sayfası, yapılandırılmış veri, Google profil boşluğu — neyin eksik olduğunu ve önce neyi düzeltmen gerektiğini söyleriz.",
  },
  {
    icon: Sparkles,
    title: "Dakikalar içinde ilk sonuç",
    text: "Ajans süreci haftalar sürer. Gauge'de işletme adı + şehir + kategori girip birkaç saniyede ilk görünürlük skorunu görürsün — kart bilgisi gerekmeden.",
  },
];

export function WhyPillars() {
  return (
    <section className="border-t border-line py-[78px]">
      <Container>
        <Eyebrow>Fark ne</Eyebrow>
        <h2 className="mt-3.5 max-w-[22ch] font-display text-[clamp(26px,3.4vw,40px)] font-bold">
          Dört şey Gauge&apos;u farklı yapıyor.
        </h2>
        <div className="mt-11 grid gap-5 sm:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-panel border border-line bg-surface p-6"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-line-2 bg-white/[0.04] text-signal">
                <p.icon size={18} />
              </div>
              <h3 className="mt-4 mb-2 text-[19px] font-display font-bold">{p.title}</h3>
              <p className="text-[14.5px] text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
