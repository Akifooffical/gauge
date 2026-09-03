"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "done" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    const currentRequest = ++requestId.current;
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => null);
      if (currentRequest !== requestId.current) return;

      if (!res.ok) {
        setError(data?.error || "Mesaj gönderilemedi, tekrar dene.");
        setStatus("error");
        return;
      }

      setStatus("done");
    } catch {
      if (currentRequest !== requestId.current) return;
      setError("Bağlantı hatası. Tekrar dene.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line-2 bg-surface p-7 text-center">
        <p className="font-display text-lg font-bold text-fg">Mesajın ulaştı.</p>
        <p className="mt-1.5 text-sm text-muted">En kısa sürede dönüş yapacağız.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-line-2 bg-surface p-6 backdrop-blur-xl"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ad Soyad"
          aria-label="Ad Soyad"
          required
          className="rounded-lg border border-line-2 bg-white/[0.02] px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-signal focus:outline-none"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          aria-label="E-posta"
          required
          className="rounded-lg border border-line-2 bg-white/[0.02] px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-signal focus:outline-none"
        />
      </div>
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Şirket / işletme (opsiyonel)"
        aria-label="Şirket"
        className="rounded-lg border border-line-2 bg-white/[0.02] px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-signal focus:outline-none"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nasıl yardımcı olabiliriz? (bölge sayısı, lokasyon sayısı, zaman çizelgesi vb.)"
        aria-label="Mesaj"
        required
        rows={5}
        className="resize-none rounded-lg border border-line-2 bg-white/[0.02] px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-signal focus:outline-none"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={status === "loading"}
        className={status === "loading" ? "cursor-not-allowed self-start opacity-70" : "self-start px-8"}
      >
        {status === "loading" ? "Gönderiliyor..." : "Mesajı gönder"}
      </Button>

      {status === "error" && error && <p className="text-sm text-accent-3">{error}</p>}
    </form>
  );
}
