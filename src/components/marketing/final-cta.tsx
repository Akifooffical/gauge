import { Container } from "@/components/ui/container";
import { ScanBar } from "@/components/marketing/scan-bar";

export function FinalCta() {
  return (
    <section className="py-24 text-center">
      <Container>
        <div className="font-mono text-xs uppercase tracking-[0.16em] text-signal">
          30 saniye
        </div>
        <h2 className="mx-auto mt-4 max-w-[16ch] font-display text-[clamp(32px,4.6vw,54px)] font-extrabold">
          AI seni anıyor mu, yoksa rakibini mi? Gör.
        </h2>
        <ScanBar className="mx-auto mt-[34px]" />
        <p className="mt-3 text-center text-[12.5px] text-muted">
          Kart gerekmez. Sonucu anında gör.
        </p>
      </Container>
    </section>
  );
}
