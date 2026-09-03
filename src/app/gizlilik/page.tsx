import type { Metadata } from "next";
import { LegalPageShell } from "@/components/marketing/legal-page-shell";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Gauge",
  description: "Gauge'un kişisel verileri nasıl topladığı, kullandığı ve koruduğuna dair gizlilik politikası.",
};

export default function GizlilikPage() {
  return (
    <LegalPageShell eyebrow="Yasal" title="Gizlilik Politikası" updated="Eylül 2026">
      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">1. Topladığımız bilgiler</h2>
        <p>
          Gauge; hesap oluştururken verdiğin ad, e-posta, işletme adı, bölge ve kategori
          bilgilerini, ücretsiz tarama formuna girdiğin işletme/rakip bilgilerini ve siteyi
          kullanırken oluşan temel kullanım verilerini (IP adresi, tarayıcı bilgisi, ziyaret
          edilen sayfalar) toplar.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">2. Çerezler</h2>
        <p>
          Oturum yönetimi ve hız sınırlama (rate limit) için gerekli, işlevsel çerezler
          kullanılır (ör. ücretsiz tarama için `gauge_fs_sid` oturum çerezi). Şu an reklam veya
          izleme amaçlı üçüncü taraf çerezi kullanılmıyor.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">3. Bilgilerin kullanımı</h2>
        <p>
          Verilerin kullanım amaçları: hizmeti sağlamak (görünürlük taraması, pano, aksiyon
          önerileri), hesabını yönetmek, ücretsiz tarama sonucunu üretmek, kötüye kullanımı
          önlemek (hız sınırlama) ve — izin verirsen — ürün güncellemeleri hakkında seninle
          iletişime geçmek.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">4. Üçüncü taraf paylaşımı</h2>
        <p>
          Ücretsiz tarama, işletme adı + şehir + kategori bilgisini web-bağlantılı bir AI
          sağlayıcısına (Perplexity) gönderir; bu bilgi yalnızca o sorguyu yanıtlamak için
          kullanılır. Verilerini reklam amacıyla üçüncü taraflara satmıyoruz.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">5. Veri güvenliği</h2>
        <p>
          Verilerin makul teknik ve idari önlemlerle korunması hedeflenir. Yine de internet
          üzerinden hiçbir aktarım veya saklama yöntemi %100 güvenli değildir.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">6. Haklarınız</h2>
        <p>
          Verilerinin bir kopyasını isteme, düzeltme veya silinmesini talep etme hakkına
          sahipsin. Türkiye&apos;deki kullanıcılar için ayrıca bkz.{" "}
          <a href="/kvkk" className="text-signal hover:underline">
            KVKK Aydınlatma Metni
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">7. Değişiklikler</h2>
        <p>Bu politika güncellenebilir; önemli değişikliklerde bu sayfadaki tarih güncellenir.</p>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-fg">8. İletişim</h2>
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
