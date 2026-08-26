import { Container } from "@/components/ui/container";
import { ScanForm } from "@/components/free-scan/ScanForm";

export function FinalCta() {
  return (
    <section id="tarama" className="py-24 text-center">
      <Container>
        <div className="font-mono text-xs uppercase tracking-[0.16em] text-signal">
          30 saniye
        </div>
        <h2 className="mx-auto mt-4 max-w-[16ch] font-display text-[clamp(32px,4.6vw,54px)] font-extrabold">
          AI seni anıyor mu, yoksa rakibini mi? Gör.
        </h2>
        <ScanForm className="mx-auto mt-[34px] max-w-[620px]" />
      </Container>
    </section>
  );
}
