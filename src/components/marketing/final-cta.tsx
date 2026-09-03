import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

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
        <p className="mx-auto mt-4 max-w-[46ch] text-[16px] text-muted">
          Kart gerekmez. İşletme adını yaz, gerçek sonucu yukarıda gör.
        </p>
        <ButtonLink href="#tarama" className="mt-8">
          Ücretsiz taramanı yap ↑
        </ButtonLink>
      </Container>
    </section>
  );
}
