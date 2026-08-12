"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { demoBusiness } from "@/lib/mock-data";
import {
  LayoutDashboard,
  ListChecks,
  Radar,
  UserPlus,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Pano", icon: LayoutDashboard },
  { href: "/onboarding", label: "Onboarding", icon: UserPlus },
  { href: "/competitors", label: "Rakip Radarı", icon: Radar },
  { href: "/actions", label: "Aksiyon Merkezi", icon: ListChecks },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-line bg-surface/40 px-4 py-6">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 px-2 font-display text-xl font-extrabold tracking-tight"
      >
        <span className="animate-pulse-dot h-[11px] w-[11px] rounded-full bg-signal" />
        Gauge
      </Link>

      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-signal/12 text-signal"
                  : "text-muted hover:bg-white/5 hover:text-fg"
              )}
            >
              <Icon size={17} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-line bg-surface p-3.5">
        <div className="text-sm font-semibold text-fg">{demoBusiness.name}</div>
        <div className="mt-1 text-xs text-muted">{demoBusiness.location}</div>
        <div className="mt-2.5 inline-flex rounded-full bg-gold/15 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold">
          {demoBusiness.plan} plan
        </div>
      </div>
    </aside>
  );
}
