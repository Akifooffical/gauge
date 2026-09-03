import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/card";

const stats = [
  {
    big: "~%50",
    color: "text-signal",
    text: "tüketici satın alma kararı için artık kasıtlı olarak AI destekli aramaya başvuruyor.",
    source: "McKinsey, AI Discovery Survey, 2025",
  },
  {
    big: "İlk 5",
    color: "text-gold",
    text: "AI yanıtlarının incelediği yerel işletme sıralaması genelde bu aralıkla sınırlı kalıyor.",
    source: "SOCi, 2026 Local Visibility Index",
  },
  {
    big: "0",
    color: "text-fg",
    text: 'işletme sahibinin elinde "AI beni anıyor mu?" sorusunu ölçecek araç.',
  },
];

export function Problem() {
  return (
    <section id="problem" className="border-t border-line py-[78px]">
      <Container>
        <Eyebrow>Neden şimdi</Eyebrow>
        <h2 className="mt-3.5 max-w-[20ch] font-display text-[clamp(26px,3.4vw,40px)] font-bold">
          Arama alışkanlığı değişti. Görünürlüğün değişmedi.
        </h2>
        <p className="mt-4 max-w-[52ch] text-[17px] text-muted">
          Alıcılar tek bir cevaba, o cevaptaki birkaç isme güveniyor. O listede olmak bedava
          satış; olmamak müşteriyi doğrudan rakibe teslim etmek.
        </p>
        <div className="mt-11 grid gap-7 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.text}>
              <div className={`font-display text-[clamp(34px,4.6vw,52px)] font-extrabold tracking-tight ${s.color}`}>
                {s.big}
              </div>
              <p className="mt-1.5 max-w-[26ch] text-[14.5px] text-muted">{s.text}</p>
              {s.source && (
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted/60">
                  {s.source}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
