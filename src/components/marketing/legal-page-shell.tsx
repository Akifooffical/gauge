import { SiteHeader } from "@/components/marketing/site-header";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";

export function LegalPageShell({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10">
      <SiteHeader />
      <section className="px-6 pb-20 pt-[150px]">
        <Container className="max-w-[720px] px-0">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3.5 font-display text-[clamp(28px,4vw,40px)] font-bold">{title}</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">
            Son güncelleme: {updated}
          </p>

          <div className="mt-6 rounded-xl border border-line-2 bg-surface p-4 text-[13.5px] text-muted">
            <strong className="text-fg">Taslak metin.</strong> Bu sayfa, yapı kurmak amacıyla
            hazırlanmış bir başlangıç metnidir — bir hukuk danışmanının onayından geçmeden
            gerçek işletme verisi toplamak veya ödeme almak için kullanılmamalıdır.
          </div>

          <div className="prose-legal mt-9 flex flex-col gap-7 text-[15px] leading-[1.7] text-muted">
            {children}
          </div>
        </Container>
      </section>
      <Footer />
    </div>
  );
}
