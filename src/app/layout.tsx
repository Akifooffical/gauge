import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteBackground } from "@/components/SiteBackground";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${plexMono.variable} ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-ink font-sans text-fg antialiased">
        <SiteBackground />
        {children}
      </body>
    </html>
  );
}
