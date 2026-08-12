import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Gauge — AI ve Google görünürlük motoru",
  description:
    "Gauge; işletmelerin ChatGPT, Gemini, Claude, Perplexity ve Google'da kendi bölgesinde ve kategorisinde ne kadar görünür olduğunu ölçer, rakiplerle karşılaştırır ve eksikleri düzeltir.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen bg-ink font-sans text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
