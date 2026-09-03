import type { Metadata } from "next";
import { LegalPageShell } from "@/components/marketing/legal-page-shell";

export const metadata: Metadata = {
  title: "Kullanım Şartları — Gauge",
  description: "Gauge hizmetini kullanırken geçerli olan kullanım şartları.",
};

export default function KullanimSartlariPage() {
  return (
    <LegalPageShell eyebrow="Yasal" title="Kullanım Şartları" updated="Eylül 2026">
      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">1. Hizmet tanımı</h2>
        <p>
          Gauge; işletmelerin AI asistanlarında ve Google&apos;da ne kadar görünür olduğunu
          ölçen, rakiplerle kıyaslayan ve düzeltme önerileri sunan bir SaaS ürünüdür. Bu
          siteyi/hesabını kullanarak aşağıdaki şartları kabul etmiş olursun.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">2. Hesap ve sorumluluklar</h2>
        <p>
          Hesap bilgilerinin doğruluğundan ve gizliliğinden sen sorumlusun. Hesabın altında
          gerçekleşen işlemlerden sen sorumlu tutulursun.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">3. Kabul edilebilir kullanım</h2>
        <p>
          Hizmeti; yasa dışı amaçlarla, başka kullanıcıların verisine izinsiz erişmek için,
          sistemleri aşırı yüklemek (otomatik/toplu istismar) için ya da üçüncü tarafların
          fikri mülkiyet haklarını ihlal edecek şekilde kullanamazsın. Ücretsiz tarama
          özelliğindeki hız sınırları buna karşı bir korumadır.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">4. Fikri mülkiyet</h2>
        <p>
          Gauge markası, arayüzü ve yazılımı Gauge&apos;a aittir. Hesabın üzerinden ürettiğin
          işletme verisi (görünürlük geçmişi, aksiyon listeleri) sana aittir.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">5. Ücretlendirme ve iptal</h2>
        <p>
          Ücretli planlar aylık faturalandırılır. İstediğin zaman iptal edebilirsin; iptal,
          mevcut fatura döneminin sonunda geçerli olur. Ücretsiz tarama özelliği kart bilgisi
          gerektirmez.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">6. Sorumluluk sınırlaması</h2>
        <p>
          Görünürlük skorları ve AI yanıtları, o anki model davranışının bir ölçümüdür;
          gelecekteki AI cevaplarının veya iş sonuçlarının garantisi değildir. Hizmet
          &quot;olduğu gibi&quot; sunulur.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">7. Değişiklikler</h2>
        <p>Bu şartlar güncellenebilir; önemli değişikliklerde bu sayfadaki tarih güncellenir.</p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">8. Uygulanacak hukuk</h2>
        <p>Bu şartlar Türkiye Cumhuriyeti kanunlarına tabidir.</p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">9. İletişim</h2>
        <p>
          Sorular için{" "}
          <a href="/contact" className="text-signal hover:underline">
            iletişim formunu
          </a>{" "}
          kullanabilirsin.
        </p>
      </section>
    </LegalPageShell>
  );
}
