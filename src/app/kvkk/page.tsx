import type { Metadata } from "next";
import { LegalPageShell } from "@/components/marketing/legal-page-shell";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — Gauge",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <LegalPageShell eyebrow="Yasal" title="KVKK Aydınlatma Metni" updated="Eylül 2026">
      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">1. Veri sorumlusu</h2>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, Gauge
          hizmetini işleten taraf, kişisel verilerinin işlenmesi bakımından veri sorumlusu
          sıfatını taşır.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">2. İşlenen kişisel veriler</h2>
        <p>
          Kimlik ve iletişim bilgileri (ad, e-posta), işletme bilgileri (işletme adı, bölge,
          kategori, rakip bilgisi), işlem güvenliği bilgileri (IP adresi, oturum kimliği) ve
          ücretsiz tarama/iletişim formuna girdiğin içerik.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">3. İşlenme amaçları</h2>
        <p>
          Hizmetin sunulması (görünürlük ölçümü, pano, aksiyon önerileri), sözleşmenin
          kurulması/ifası, hız sınırlama yoluyla kötüye kullanımın önlenmesi ve yasal
          yükümlülüklerin yerine getirilmesi.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">4. Aktarım</h2>
        <p>
          Ücretsiz tarama sırasında işletme adı + şehir + kategori bilgisi, sorguyu
          yanıtlaması için bir AI sağlayıcısına (Perplexity) iletilir. Yasal zorunluluk
          hâlleri dışında verilerin yurt dışına aktarımı, KVKK&apos;nın öngördüğü şartlara
          tabidir.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">
          5. Toplama yöntemi ve hukuki sebep
        </h2>
        <p>
          Veriler, web sitesi formları (kayıt, onboarding, ücretsiz tarama, iletişim) üzerinden
          elektronik ortamda toplanır. Hukuki sebep: bir sözleşmenin kurulması/ifası için
          gerekli olması ve meşru menfaat.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">
          6. KVKK madde 11 kapsamındaki haklarınız
        </h2>
        <p>KVKK&apos;nın 11. maddesi uyarınca şu haklara sahipsin:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Kişisel verinin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
          <li>Kanuni şartlar çerçevesinde silinmesini/yok edilmesini isteme,</li>
          <li>Düzeltme/silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
          <li>
            Otomatik sistemlerle analiz edilmesi sonucu aleyhine bir sonuç çıkmasına itiraz
            etme,
          </li>
          <li>Kanuna aykırı işleme nedeniyle zarara uğraması hâlinde zararın giderilmesini isteme.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">7. Başvuru / iletişim</h2>
        <p>
          Haklarını kullanmak için{" "}
          <a href="/contact" className="text-signal hover:underline">
            iletişim formu
          </a>{" "}
          üzerinden başvurabilirsin.
        </p>
      </section>
    </LegalPageShell>
  );
}
