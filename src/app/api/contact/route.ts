import { NextRequest, NextResponse } from "next/server";

const DAILY_LIMIT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
};

type Bucket = { count: number; resetAt: number };

// Basit IP bazlı istismar koruması — bellek-içi (tek instance için yeterli;
// free-scan'in Upstash tabanlı rate limitine kıyasla bilinçli olarak daha sade,
// çünkü bu formun maliyeti (bir e-posta) free-scan'in API çağrısından çok düşük).
const globalStore = globalThis as unknown as { __contactLimitStore?: Map<string, Bucket> };
const limitStore = (globalStore.__contactLimitStore ??= new Map());

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = limitStore.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    limitStore.set(ip, { count: 1, resetAt: now + DAY_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > DAILY_LIMIT;
}

function cleanString(value: unknown, maxLen: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLen) : "";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    if (!apiKey || !toEmail) {
      console.error("[contact] Yapılandırılmamış: RESEND_API_KEY veya CONTACT_TO_EMAIL eksik.");
      return NextResponse.json(
        {
          error:
            "İletişim formu şu anda yapılandırılmamış. Lütfen doğrudan e-posta ile ulaş (varsa sayfadaki adres) veya daha sonra tekrar dene.",
        },
        { status: 503 }
      );
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Günlük mesaj limitine ulaştın. Yarın tekrar dene." },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as ContactBody | null;
    if (!body) {
      return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
    }

    const name = cleanString(body.name, 100);
    const email = cleanString(body.email, 150);
    const company = cleanString(body.company, 150);
    const message = cleanString(body.message, 4000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Ad, e-posta ve mesaj zorunludur." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi gir." }, { status: 400 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "Gauge İletişim Formu <onboarding@resend.dev>";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Gauge iletişim formu — ${name}${company ? ` (${company})` : ""}`,
        text: `Ad: ${name}\nE-posta: ${email}\nŞirket: ${company || "-"}\n\nMesaj:\n${message}`,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("[contact] Resend isteği başarısız:", res.status, errBody);
      return NextResponse.json(
        { error: "Mesaj gönderilemedi, tekrar dene." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] route hatası:", err);
    return NextResponse.json(
      { error: "Beklenmedik bir hata oluştu, tekrar dene." },
      { status: 500 }
    );
  }
}
