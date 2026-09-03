import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { Footer } from "@/components/marketing/footer";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "İletişime geç — Gauge",
  description: "Ajans / çok-lokasyon planı veya kurumsal ihtiyaçların için Gauge ekibine ulaş.",
};

const mailtoEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function ContactPage() {
  return (
    <div className="relative z-10">
      <SiteHeader />
      <section className="px-6 pb-20 pt-[150px]">
        <Container className="max-w-[620px] px-0">
          <Eyebrow>İletişim</Eyebrow>
          <h1 className="mt-3.5 font-display text-[clamp(28px,4.4vw,44px)] font-bold leading-[1.05]">
            Ajans veya çok-lokasyon planı mı istiyorsun?
          </h1>
          <p className="mt-5 max-w-[52ch] text-[16px] text-muted">
            Bölge/lokasyon sayısı, beyaz etiket rapor ve API erişimi ihtiyacını yaz, doğru
            kurulumu birlikte belirleyelim.
            {mailtoEmail && (
              <>
                {" "}
                İstersen doğrudan{" "}
                <a href={`mailto:${mailtoEmail}`} className="text-signal hover:underline">
                  {mailtoEmail}
                </a>{" "}
                adresine de yazabilirsin.
              </>
            )}
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </Container>
      </section>
      <Footer />
    </div>
  );
}
