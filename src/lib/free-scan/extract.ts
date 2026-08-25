export type ExtractInput = {
  answerText: string;
  brandName: string;
  knownCompetitors?: string[];
};

export type ExtractResult = {
  brandFound: boolean;
  brandRank: number | null;
  recommended: string[];
};

const EMPTY_RESULT: ExtractResult = {
  brandFound: false,
  brandRank: null,
  recommended: [],
};

/** Türkçe'ye duyarlı normalize: küçük harf, aksan/işaret temizliği, boşluk sadeleştirme. */
function normalize(input: string): string {
  return input
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function namesMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

/** Cevap metnindeki numaralı/madde işaretli listeyi işletme adı adaylarına ayrıştırır. */
function parseRecommendedList(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const items: string[] = [];

  const listLine = /^\s*(?:\d+[.)]|[-*•])\s*(.+)$/;

  for (const rawLine of lines) {
    const match = rawLine.match(listLine);
    if (!match) continue;

    let candidate = match[1].trim();
    candidate = candidate.replace(/\*\*/g, "").replace(/^["'“]|["'”]$/g, "");

    const cut = candidate.search(/(\s[-–—]\s|:\s|\s\()/);
    if (cut > 0) {
      candidate = candidate.slice(0, cut);
    }

    candidate = candidate.replace(/[.,;]+$/, "").trim();

    if (candidate.length >= 2 && candidate.length <= 70) {
      items.push(candidate);
    }
  }

  return items.slice(0, 10);
}

function heuristicExtract(input: ExtractInput): ExtractResult {
  const { answerText, brandName } = input;
  if (!answerText.trim()) return EMPTY_RESULT;

  const recommended = parseRecommendedList(answerText);

  const rankIndex = recommended.findIndex((item) => namesMatch(item, brandName));
  if (rankIndex >= 0) {
    return { brandFound: true, brandRank: rankIndex + 1, recommended };
  }

  const mentionedInText = normalize(answerText).includes(normalize(brandName));
  if (mentionedInText) {
    return { brandFound: true, brandRank: null, recommended };
  }

  return { brandFound: false, brandRank: null, recommended };
}

type LlmShape = {
  recommended?: unknown;
  brandFound?: unknown;
  brandRank?: unknown;
};

/**
 * Ucuz bir modelle yapılandırılmış JSON çıkarımı (opsiyonel iyileştirme).
 * OPENAI_API_KEY yoksa ya da çağrı/parse başarısız olursa heuristik sonuca döner.
 */
async function llmExtract(input: ExtractInput): Promise<ExtractResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !input.answerText.trim()) return null;

  const model = process.env.FREE_SCAN_EXTRACT_MODEL || "gpt-5.4-nano";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'Verilen metinden önerilen işletmelerin sıralı listesini ve hedef markanın bulunup bulunmadığını çıkar. SADECE şu JSON formatında yanıt ver: {"recommended":["...","..."],"brandFound":false,"brandRank":null}. brandRank, hedef marka listede kaçıncı sıradaysa o sayı (1 tabanlı), değilse null olmalı.',
          },
          {
            role: "user",
            content: `Hedef marka: ${input.brandName}${
              input.knownCompetitors?.length
                ? `\nBilinen rakipler: ${input.knownCompetitors.join(", ")}`
                : ""
            }\n\nMetin:\n${input.answerText}`,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content) as LlmShape;

    const recommended = Array.isArray(parsed.recommended)
      ? parsed.recommended.filter((x): x is string => typeof x === "string").slice(0, 10)
      : [];
    const brandFound = typeof parsed.brandFound === "boolean" ? parsed.brandFound : false;
    const brandRank =
      typeof parsed.brandRank === "number" && Number.isFinite(parsed.brandRank)
        ? parsed.brandRank
        : null;

    return { brandFound, brandRank, recommended };
  } catch (err) {
    console.error("[free-scan] llmExtract hata:", err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Cevap metninden işletmenin ve rakiplerin anılıp anılmadığını çıkarır.
 * Önce ucuz bir model ile yapılandırılmış çıkarım dener (varsa API anahtarı),
 * başarısız olursa isim eşleştirmeli heuristiğe güvenli biçimde düşer.
 */
export async function extract(input: ExtractInput): Promise<ExtractResult> {
  const llmResult = await llmExtract(input);
  if (llmResult) return llmResult;
  return heuristicExtract(input);
}
