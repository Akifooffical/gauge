import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";

const sectors = [
  "Diş & estetik klinikleri",
  "Avukatlar",
  "Mali müşavirler",
  "Emlak ofisleri",
  "Restoran & otel",
  "Müteahhit & tadilat",
  "Oto servis",
  "Fizyoterapi",
  "Veteriner",
  "Kuaför & güzellik",
  "Özel okul & kurs",
  "B2B SaaS",
  "Ajanslar",
  "E-ticaret markaları",
  "Üretici & ihracatçı",
  "Sigorta acenteleri",
];

export function Sectors() {
  return (
    <section id="sektorler" className="border-t border-line py-[78px]">
      <Container>
        <Eyebrow>Kimin için</Eyebrow>
        <h2 className="mt-3.5 max-w-[20ch] font-display text-[clamp(26px,3.4vw,40px)] font-bold">
          Bölgede ve kategoride aranan herkes için.
        </h2>
        <p className="mt-4 max-w-[52ch] text-[17px] text-muted">
          Bir yerde, bir işte aranıyorsan Gauge senin için çalışır. Orta ölçekli şirketler için
          kurgulandı — ödeme gücü var, kendi AEO ekibi yok.
        </p>
        <div className="mt-10 flex flex-wrap gap-2.5">
          {sectors.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line-2 px-[15px] py-2 font-mono text-[13px] text-muted transition-colors hover:border-signal hover:text-fg"
            >
              {s}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
