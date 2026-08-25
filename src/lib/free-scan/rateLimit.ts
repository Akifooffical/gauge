import type { GroundedAnswer } from "./provider";

const DAILY_LIMIT = 3;
const DAY_SECONDS = 24 * 60 * 60;
const CACHE_SECONDS = 24 * 60 * 60;

function upstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

async function upstash(command: (string | number)[]): Promise<unknown> {
  const config = upstashConfig();
  if (!config) return null;

  const path = command.map((part) => encodeURIComponent(String(part))).join("/");
  const res = await fetch(`${config.url}/${path}`, {
    headers: { Authorization: `Bearer ${config.token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash isteği başarısız: ${res.status}`);
  const data = await res.json();
  return data?.result ?? null;
}

type MemoryBucket = { count: number; resetAt: number };
type MemoryCacheEntry = { value: GroundedAnswer; expiresAt: number };

// HMR sırasında state'in sıfırlanmaması için globalThis üzerinde tut.
const globalStore = globalThis as unknown as {
  __freeScanLimitStore?: Map<string, MemoryBucket>;
  __freeScanCacheStore?: Map<string, MemoryCacheEntry>;
};

const limitStore = (globalStore.__freeScanLimitStore ??= new Map());
const cacheStore = (globalStore.__freeScanCacheStore ??= new Map());

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
};

/** IP + oturum kimliğine göre günlük tarama limitini kontrol edip tüketir. */
export async function checkAndConsumeRateLimit(identifier: string): Promise<RateLimitResult> {
  const key = `free-scan:limit:${identifier}`;

  try {
    if (upstashConfig()) {
      const count = Number((await upstash(["incr", key])) ?? 0);
      if (count === 1) {
        await upstash(["expire", key, DAY_SECONDS]);
      }
      return {
        allowed: count <= DAILY_LIMIT,
        remaining: Math.max(0, DAILY_LIMIT - count),
        limit: DAILY_LIMIT,
      };
    }
  } catch (err) {
    console.error("[free-scan] Upstash rate limit hatası, bellek-içi fallback kullanılıyor:", err);
  }

  const now = Date.now();
  const bucket = limitStore.get(key);

  if (!bucket || bucket.resetAt <= now) {
    limitStore.set(key, { count: 1, resetAt: now + DAY_SECONDS * 1000 });
    return { allowed: true, remaining: DAILY_LIMIT - 1, limit: DAILY_LIMIT };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - bucket.count),
    limit: DAILY_LIMIT,
  };
}

function cacheKey(city: string, category: string, question: string): string {
  return `free-scan:answer:${city.trim().toLocaleLowerCase("tr")}:${category
    .trim()
    .toLocaleLowerCase("tr")}:${question}`;
}

/** Aynı şehir+kategori için model cevaplarını 24 saat paylaşarak maliyeti düşürür. */
export async function getCachedAnswer(
  city: string,
  category: string,
  question: string
): Promise<GroundedAnswer | null> {
  const key = cacheKey(city, category, question);

  try {
    if (upstashConfig()) {
      const raw = await upstash(["get", key]);
      if (typeof raw === "string") {
        return JSON.parse(raw) as GroundedAnswer;
      }
      return null;
    }
  } catch (err) {
    console.error("[free-scan] Upstash cache okuma hatası:", err);
  }

  const entry = cacheStore.get(key);
  if (!entry || entry.expiresAt <= Date.now()) return null;
  return entry.value;
}

export async function setCachedAnswer(
  city: string,
  category: string,
  question: string,
  value: GroundedAnswer
): Promise<void> {
  const key = cacheKey(city, category, question);

  try {
    if (upstashConfig()) {
      await upstash(["set", key, JSON.stringify(value), "EX", CACHE_SECONDS]);
      return;
    }
  } catch (err) {
    console.error("[free-scan] Upstash cache yazma hatası:", err);
  }

  cacheStore.set(key, { value, expiresAt: Date.now() + CACHE_SECONDS * 1000 });
}
