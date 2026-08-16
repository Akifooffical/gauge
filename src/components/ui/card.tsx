import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-panel border border-line bg-surface backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "font-mono text-xs uppercase tracking-[0.16em] text-signal",
        className
      )}
    >
      {children}
    </div>
  );
}
