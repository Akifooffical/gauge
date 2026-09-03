import Link from "next/link";
import { Container } from "@/components/ui/container";

const legalLinks = [
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
  { href: "/kvkk", label: "KVKK" },
];

export function Footer() {
  return (
    <footer className="border-t border-line py-[34px]">
      <Container className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-muted">
        <div className="flex items-center gap-2.5 text-[17px] font-display font-extrabold text-fg">
          <span className="h-[11px] w-[11px] rounded-full bg-signal" />
          Gauge
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {legalLinks.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="font-mono text-xs">
          Yapay zeka seni önersin. · © 2026
        </div>
      </Container>
    </footer>
  );
}
