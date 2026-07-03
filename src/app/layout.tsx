import type { Metadata, Viewport } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PortfolioPage } from "./page";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-display" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Build JSON-LD once with known-safe static data (no user input)
// No need for runtime DOMPurify since all values are hardcoded string literals
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Zayidan Muttaqin",
  "jobTitle": "Sales & Leadership Professional",
  "description": "Sales, Leadership, and Communication Expert",
  "address": { "@type": "PostalAddress", "addressLocality": "Banyuwangi", "addressCountry": "ID" },
  "sameAs": [
    "https://www.linkedin.com/in/zayidan-muttaqin/",
    "https://github.com/Zayidan123",
    "https://t.me/ZayM1122",
    "https://www.instagram.com/zayidan1122"
  ],
  "knowsAbout": ["Sales", "Leadership", "Communication", "Negotiation", "Video Editing", "Graphic Design", "AI Prompting", "Financial Markets"]
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#00F5FF",
};

export const metadata: Metadata = {
  title: "Zayidan Muttaqin — Sales · Leadership · Communication | Portfolio",
  description: "Portfolio profesional Zayidan Muttaqin — Sales, Leadership, dan Communication Expert berbasis di Banyuwangi, Indonesia. Disiplin, teliti, bertanggung jawab, dan adaptif.",
  keywords: ["Zayidan Muttaqin", "portfolio", "sales", "leadership", "communication", "Banyuwangi", "professional", "curriculum vitae", "negotiation"],
  authors: [{ name: "Zayidan Muttaqin", url: "https://github.com/Zayidan123" }],
  creator: "Zayidan Muttaqin",
  publisher: "Zayidan Muttaqin",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "Zayidan Muttaqin — Sales · Leadership · Communication",
    description: "Portfolio profesional Zayidan Muttaqin — Disiplin, teliti, bertanggung jawab, dan adaptif.",
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    siteName: "Zayidan Muttaqin Portfolio",
  },
  twitter: { card: "summary_large_image", title: "Zayidan Muttaqin — Portfolio", description: "Sales · Leadership · Communication Expert" },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`dark ${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00F5FF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </head>
      <body className="antialiased min-h-screen w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <ThemeProvider>
          <PortfolioPage />
        </ThemeProvider>
        {/* Scanline overlay for dark mode */}
        <div className="scanline-overlay" />
      </body>
    </html>
  );
}