"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ScanBar({ className }: { className?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = name.trim() ? `?business=${encodeURIComponent(name.trim())}` : "";
    router.push(`/onboarding${params}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        "flex max-w-[440px] gap-2.5 rounded-xl border border-line-2 bg-surface p-2 " +
        (className ?? "")
      }
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="İşletmenin adı — örn. Vera Diş Kliniği"
        aria-label="İşletme adı"
        className="flex-1 bg-transparent px-3 text-[15px] text-fg placeholder:text-muted focus:outline-none"
      />
      <Button type="submit" variant="primary">
        Görünürlüğümü gör
      </Button>
    </form>
  );
}
