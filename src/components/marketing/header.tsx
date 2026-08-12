import Link from "next/link";
import { Container } from "@/components/ui/container";

const links = [
  { href: "#nasil", label: "Nasıl çalışır" },
  { href: "#sektorler", label: "Sektörler" },
  { href: "#rakip", label: "Rakip radarı" },
  { href: "#fiyat", label: "Fiyatlar" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/82 backdrop-blur-md">
      <Container className="flex h-[66px] items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight"
        >
          <span className="animate-pulse-dot h-[11px] w-[11px] rounded-full bg-signal" />
          Gauge
        </Link>
        <nav className="hidden gap-[30px] text-sm text-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#tara"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-transparent bg-signal px-[22px] py-[13px] text-[15px] font-semibold text-[#04121c] transition-transform hover:-translate-y-0.5"
        >
          Ücretsiz tarat
        </a>
      </Container>
    </header>
  );
}
