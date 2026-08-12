import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonBaseProps = {
  variant?: "primary" | "ghost";
  className?: string;
  children: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] px-[22px] py-[13px] text-[15px] font-semibold transition-all duration-150 cursor-pointer border";

const variants = {
  primary: "bg-signal text-[#04121c] border-transparent hover:-translate-y-0.5",
  ghost: "bg-transparent text-fg border-line-2 hover:border-signal hover:text-white",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  children,
  href,
}: ButtonBaseProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
