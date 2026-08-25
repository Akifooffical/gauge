import { NextRequest, NextResponse } from "next/server";
import { generateQueries } from "@/lib/free-scan/generateQueries";
import { askGrounded, type GroundedAnswer } from "@/lib/free-scan/provider";
import { extract } from "@/lib/free-scan/extract";
import { computeScore } from "@/lib/free-scan/score";
import {
  checkAndConsumeRateLimit,
  getCachedAnswer,
  setCachedAnswer,
} from "@/lib/free-scan/rateLimit";

const MAX_COMPETITORS = 2;
const CONCURRENCY = 3;
const SESSION_COOKIE = "gauge_fs_sid";

type FreeScanBody = {
  businessName?: unknown;
  city?: unknown;
  category?: unknown;
  competitors?: unknown;
};

type QuestionResult = {
  question: string;
  brandFound: boolean;
  brandRank: number | null;
  competitors: string[];
};

function cleanString(value: unknown, maxLen = 80): string {
  return typeof value === "string" ? value.trim().slice(0, maxLen) : "";
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(new Array(Math.min(limit, items.length)).fill(0).map(() => worker()));
  return results;
}

async function answerQuestion(city: string, category: string, question: string): Promise<GroundedAnswer> {
  const cached = await getCachedAnswer(city, category, question);
  if (cached) return cached;

  const answer = await askGrounded(question);
  if (answer.text) {
    await setCachedAnswer(city, category, question, answer);
  }
  return answer;
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as FreeScanBody | null;
    if (!body) {
      return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
    }

    const businessName = cleanString(body.businessName, 120);
    const city = cleanString(body.city, 60);
    const category = cleanString(body.category, 60);
    const competitors = Array.isArray(body.competitors)
      ? body.competitors
          .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
          .map((c) => c.trim().slice(0, 80))
          .slice(0, MAX_COMPETITORS)
      : [];

    if (!businessName || !city || !category) {
      return NextResponse.json(
        { error: "İşletme adı, şehir ve kategori zorunludur." },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    let sessionId = req.cookies.get(SESSION_COOKIE)?.value;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const rateLimit = await checkAndConsumeRateLimit(`${ip}:${sessionId}`);
    if (!rateLimit.allowed) {
      const res = NextResponse.json(
        {
          error: "Günlük ücretsiz tarama limitine ulaştın. Yarın tekrar dene.",
          limit: rateLimit.limit,
          remaining: 0,
        },
        { status: 429 }
      );
      res.cookies.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }

    const questions = generateQueries({ city, category });

    const answers = await mapWithConcurrency(questions, CONCURRENCY, (question) =>
      answerQuestion(city, category, question)
    );

    const extractions = await mapWithConcurrency(answers, CONCURRENCY, (answer) =>
      extract({ answerText: answer.text, brandName: businessName, knownCompetitors: competitors })
    );

    const results: QuestionResult[] = questions.map((question, i) => {
      const ext = extractions[i];
      const competitorNames = ext.recommended.filter(
        (name) => name.trim().toLocaleLowerCase("tr") !== businessName.trim().toLocaleLowerCase("tr")
      );
      return {
        question,
        brandFound: ext.brandFound,
        brandRank: ext.brandRank,
        competitors: competitorNames.slice(0, 3),
      };
    });

    const score = computeScore(results);

    // En sık ve en üst sıralarda anılan rakibi ağırlıklı puanla belirle.
    const competitorScores = new Map<string, { display: string; weight: number }>();
    for (const r of results) {
      r.competitors.forEach((name, idx) => {
        const key = name.trim().toLocaleLowerCase("tr");
        if (!key) return;
        const weight = 1 / (idx + 1);
        const existing = competitorScores.get(key);
        if (existing) {
          existing.weight += weight;
        } else {
          competitorScores.set(key, { display: name.trim(), weight });
        }
      });
    }
    const topCompetitor =
      [...competitorScores.values()].sort((a, b) => b.weight - a.weight)[0]?.display ?? null;

    const sampleSources = [...new Set(answers.flatMap((a) => a.sources ?? []))].slice(0, 5);

    const res = NextResponse.json({
      score,
      brandName: businessName,
      results,
      topCompetitor,
      sampleSources,
    });
    res.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("[free-scan] route hatası:", err);
    return NextResponse.json(
      { error: "Tarama sırasında beklenmedik bir hata oluştu." },
      { status: 500 }
    );
  }
}
