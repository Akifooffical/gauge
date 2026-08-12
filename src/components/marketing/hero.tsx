import { Container } from "@/components/ui/container";
import { LiveAnswerDemo } from "@/components/marketing/live-answer-demo";
import { ScanBar } from "@/components/marketing/scan-bar";

export function Hero() {
  return (
    <section className="pb-12 pt-[72px]">
      <Container className="grid items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.16em] text-signal">
            AI + Google görünürlük motoru
          </div>
          <h1 className="mt-4 font-display text-[clamp(38px,5.4vw,66px)] font-extrabold leading-[1.02] tracking-tight">
            Müşteri yapay zekaya sorunca, <span className="text-gold">senin adın</span> çıksın.
          </h1>
          <p className="mt-[22px] max-w-[33ch] text-[19px] text-muted">
            İnsanlar artık &ldquo;bölgemdeki en iyisi kim?&rdquo; diye Google yerine ChatGPT&rsquo;ye
            soruyor. Gauge, o cevapta rakibin değil senin görünmeni sağlar — hem bölgende hem
            kategorinde.
          </p>
          <div id="tara">
            <ScanBar className="mt-[34px]" />
          </div>
          <p className="mt-3 text-[12.5px] text-muted">
            Ücretsiz. Kart gerekmez. 30 saniyede AI&rsquo;ların seni ne kadar andığını gör.
          </p>
        </div>
        <LiveAnswerDemo />
      </Container>
    </section>
  );
}
