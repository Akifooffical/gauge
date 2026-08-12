import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";

const steps = [
  {
    idx: "01 · ÖLÇ",
    title: "Ölç",
    text: "Bölgen ve kategorin için gerçek müşteri sorularını hem AI modellerine (ChatGPT, Gemini, Claude, Perplexity) hem Google'a düzenli sorarız. Anılıyor musun, kaçıncı sırada — kaydederiz.",
  },
  {
    idx: "02 · KARŞILAŞTIR",
    title: "Karşılaştır",
    text: "Görünürlük skorunu rakiplerinle yan yana koyarız. Kendi mahallende, kendi kategorinde kaçıncı sıradasın — tek panoda, zaman içindeki trendiyle.",
  },
  {
    idx: "03 · DÜZELT",
    title: "Düzelt",
    text: "Neden görünmediğini söyler, işi yaparız: eksik bölge sayfaları, yapılandırılmış veri, Google profil düzeltmeleri, AI'ın güvendiği kaynaklardaki boşluklar — önceliğe göre, tek tıkla çıktı.",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil" className="border-t border-line py-[78px]">
      <Container>
        <Eyebrow>Nasıl çalışır</Eyebrow>
        <h2 className="mt-3.5 max-w-[20ch] font-display text-[clamp(26px,3.4vw,40px)] font-bold">
          Üç adımda, otomatik.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.idx}
              className="relative overflow-hidden rounded-panel border border-line bg-surface p-6"
            >
              <span className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-signal to-transparent" />
              <div className="font-mono text-xs tracking-[0.14em] text-signal">{step.idx}</div>
              <h3 className="mt-3.5 mb-2.5 text-[22px] font-display font-bold">{step.title}</h3>
              <p className="text-[14.5px] text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
