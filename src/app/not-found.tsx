import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative z-10">
      <SiteHeader />
      <section className="flex min-h-screen flex-col justify-center px-6 pt-[120px] pb-20">
        <Container className="px-0 text-center">
          <Eyebrow>404</Eyebrow>
          <h1 className="mt-3.5 font-display text-[clamp(32px,5vw,56px)] font-bold">
            Bu sayfa görünmüyor.
          </h1>
          <p className="mx-auto mt-4 max-w-[46ch] text-[16px] text-muted">
            Aradığın sayfa taşınmış ya da hiç var olmamış olabilir — tam da Gauge&apos;un
            çözdüğü görünürlük sorununun küçük bir örneği.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <ButtonLink href="/">Ana sayfaya dön</ButtonLink>
            <ButtonLink href="/dashboard" variant="ghost">
              Panoyu aç
            </ButtonLink>
          </div>
          <Link
            href="/contact"
            className="mt-6 inline-block text-sm text-muted underline decoration-line-2 underline-offset-4 hover:text-fg"
          >
            Yoksa bir link mi kırık? Bize bildir
          </Link>
        </Container>
      </section>
    </div>
  );
}
