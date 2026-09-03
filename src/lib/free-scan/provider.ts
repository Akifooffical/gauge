export type GroundedAnswer = {
  text: string;
  sources?: string[];
};

export type GroundedProvider = (question: string) => Promise<GroundedAnswer>;

const TIMEOUT_MS = 20_000;

/**
 * Perplexity Sonar — arama-temelli (grounded) birincil sağlayıcı.
 * Normal bir LLM yerel işletmeleri ezberinden bilmez; bu yüzden burada
 * mutlaka web araması yapan bir model kullanılıyor.
 */
async function askPerplexity(question: string): Promise<GroundedAnswer> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY tanımlı değil");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "Türkiye'deki yerel işletmeler hakkında kısa, güncel ve gerçek web sonuçlarına dayalı öneriler ver. Cevabını numaralı bir liste halinde, işletme adlarını net biçimde belirterek yaz.",
          },
          { role: "user", content: question },
        ],
        temperature: 0.2,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Perplexity isteği başarısız: ${res.status} ${body}`);
    }

    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    const sources: string[] | undefined = Array.isArray(data?.citations)
      ? data.citations.filter((s: unknown): s is string => typeof s === "string")
      : undefined;

    return { text, sources };
  } finally {
    clearTimeout(timeout);
  }
}

const providers: Record<string, GroundedProvider> = {
  perplexity: askPerplexity,
};

// Sağlayıcı başına "API anahtarı tanımlı mı" kontrolü — askGrounded çağrılmadan,
// taramaya hiç başlamadan önce net bir hata dönebilmek için.
const providerConfigured: Record<string, () => boolean> = {
  perplexity: () => Boolean(process.env.PERPLEXITY_API_KEY),
};

function getProviderName(): string {
  return process.env.FREE_SCAN_PROVIDER?.trim() || "perplexity";
}

/**
 * Seçili sağlayıcının anahtarı tanımlı mı — route.ts, taramaya başlamadan önce bunu
 * kontrol edip anahtar yoksa kullanıcıya "0 puan" gibi yanıltıcı bir sonuç yerine
 * net bir yapılandırma hatası döner.
 */
export function isProviderConfigured(): boolean {
  const check = providerConfigured[getProviderName()];
  return check ? check() : false;
}

function getProvider(): GroundedProvider {
  const name = getProviderName();
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Bilinmeyen free-scan sağlayıcısı: ${name}`);
  }
  return provider;
}

/**
 * Web-bağlantılı modele soru sorar. Sağlayıcı env ile değiştirilebilir
 * (varsayılan: Perplexity Sonar). Hata durumunda boş metinle güvenli döner
 * ki tek bir sorunun başarısızlığı tüm taramayı düşürmesin.
 */
export async function askGrounded(question: string): Promise<GroundedAnswer> {
  try {
    const provider = getProvider();
    return await provider(question);
  } catch (err) {
    console.error("[free-scan] askGrounded hata:", err);
    return { text: "" };
  }
}
