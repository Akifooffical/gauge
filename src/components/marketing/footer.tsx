import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-line py-[34px]">
      <Container className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-muted">
        <div className="flex items-center gap-2.5 text-[17px] font-display font-extrabold text-fg">
          <span className="h-[11px] w-[11px] rounded-full bg-signal" />
          Gauge
        </div>
        <div className="font-mono text-xs">
          Yapay zeka seni önersin. · © 2026
        </div>
      </Container>
    </footer>
  );
}
