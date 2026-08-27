import type { Metadata, Viewport } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PortfolioPage } from "./page";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-display" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Canonical site URL — used for SEO, sitemap, structured data
const SITE_URL = "https://zayidan-muttaqin.vercel.app";

// Enhanced JSON-LD: Person schema (rich results for personal portfolio)
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Zayidan Muttaqin",
  "alternateName": ["Zayidan", "Muttaqin", "ZayM1122"],
  "jobTitle": "Sales Promotion Boy Staff & Sales Professional",
  "description": "Zayidan Muttaqin — Sales, Leadership, dan Communication Expert berbasis di Banyuwangi, Indonesia. Berpengalaman di bidang penjualan retail, sales promotion, dan kepemimpinan tim.",
  "url": SITE_URL,
  "image": `${SITE_URL}/zayidan-photo.png`,
  "email": "mailto:zayidan.muttaqin@example.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Banyuwangi",
    "addressRegion": "Jawa Timur",
    "addressCountry": "ID"
  },
  "nationality": "Indonesian",
  "knowsLanguage": ["Indonesian", "English"],
  "sameAs": [
    "https://www.linkedin.com/in/zayidan-muttaqin/",
    "https://github.com/Zayidan123",
    "https://t.me/ZayM1122",
    "https://www.instagram.com/zayidan1122"
  ],
  "knowsAbout": [
    "Sales",
    "Leadership",
    "Communication",
    "Negotiation",
    "Customer Service",
    "Visual Merchandising",
    "Retail Management",
    "Video Editing",
    "Graphic Design",
    "AI Prompting",
    "Financial Markets",
    "Web3 & Crypto",
    "Python Programming"
  ],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "SMK Manbaul Ulum Muncar",
    "department": "Teknik Kendaraan Ringan"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Lapangan / Outdoor"
  },
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Sales Promotion Boy",
    "occupationalCategory": "41-9099.00"
  }
});

// WebSite schema — enables Sitelinks Search Box in Google results
const websiteJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Zayidan Muttaqin — Portfolio",
  "alternateName": "Portfolio Zayidan Muttaqin",
  "url": SITE_URL,
  "description": "Portfolio profesional Zayidan Muttaqin — Sales, Leadership, dan Communication Expert di Banyuwangi, Indonesia.",
  "inLanguage": ["id", "en"],
  "publisher": {
    "@type": "Person",
    "name": "Zayidan Muttaqin"
  }
});

// BreadcrumbList schema — helps Google understand site structure
const breadcrumbJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": SITE_URL
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Pengalaman Kerja",
      "item": `${SITE_URL}/#experience`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Proyek",
      "item": `${SITE_URL}/#projects`
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Kontak",
      "item": `${SITE_URL}/#contact`
    }
  ]
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility (SEO bonus)
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0F4FF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zayidan Muttaqin — Sales & Leadership Professional | Portfolio",
    template: "%s | Zayidan Muttaqin Portfolio"
  },
  description: "Zayidan Muttaqin — portfolio profesional Sales, Leadership, dan Communication Expert di Banyuwangi. Berpengalaman sebagai Sales Promotion Boy, Store Associate, dan Store Manager. Disiplin, teliti, bertanggung jawab, dan adaptif.",
  keywords: [
    // Primary — exact match & variations of name
    "Zayidan Muttaqin",
    "Zayidan Muttaqin portfolio",
    "Zayidan Muttaqin Banyuwangi",
    "Zayidan Muttaqin sales",
    "ZayM1122",
    "Zayidan123",
    // Role-based keywords
    "Sales Promotion Boy",
    "Sales Promotion Boy Indonesia",
    "Store Associate",
    "Sales Clerk",
    "Store Manager",
    "Sales Professional Indonesia",
    "Leadership Banyuwangi",
    // Location-based
    "Banyuwangi profesional",
    "Banyuwangi sales",
    "Banyuwangi portfolio",
    "Jawa Timur sales",
    // Skill-based
    "Customer Service Indonesia",
    "Visual Merchandising",
    "Retail Management",
    "Negosiasi penjualan",
    "Komunikasi profesional",
    // General portfolio keywords
    "portfolio",
    "curriculum vitae",
    "CV online",
    "resume profesional"
  ],
  authors: [{ name: "Zayidan Muttaqin", url: SITE_URL }],
  creator: "Zayidan Muttaqin",
  publisher: "Zayidan Muttaqin",
  applicationName: "Zayidan Muttaqin Portfolio",
  category: "Professional Portfolio",
  classification: "Professional Portfolio — Sales & Leadership",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Zayidan Muttaqin — Sales & Leadership Professional | Portfolio",
    description: "Portfolio profesional Zayidan Muttaqin — Sales Promotion Boy, Store Associate, & Store Manager berbasis di Banyuwangi, Indonesia. Disiplin, teliti, bertanggung jawab, dan adaptif.",
    type: "profile",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: "Zayidan Muttaqin Portfolio",
    images: [
      {
        url: "/zayidan-photo.png",
        width: 1200,
        height: 630,
        alt: "Zayidan Muttaqin — Sales & Leadership Professional",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@zayidan1122",
    creator: "@zayidan1122",
    title: "Zayidan Muttaqin — Sales & Leadership Portfolio",
    description: "Sales Promotion Boy · Store Associate · Store Manager — Banyuwangi, Indonesia. Disiplin, teliti, bertanggung jawab, dan adaptif.",
    images: ["/zayidan-photo.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    // Google Search Console verification token
    google: "1-jUpyPY0B9VHEAHkNYeTlkFhEBfILgxEGfltoFiuIM",
  },
  other: {
    // Additional SEO meta tags
    "author": "Zayidan Muttaqin",
    "language": "Indonesian, English",
    "revisit-after": "7 days",
    "rating": "general",
    "distribution": "global",
    "robots": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "geo.region": "ID-JI",
    "geo.placename": "Banyuwangi",
    "geo.position": "-8.2192;114.3691",
    "ICBM": "-8.2192, 114.3691",
    // Performance hints
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "ZM Portfolio",
    // PWA & theme
    "application-name": "Zayidan Muttaqin Portfolio",
    "theme-color": "#00F5FF",
    "color-scheme": "dark light",
  },
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
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="id-ID" href={SITE_URL} />
        <link rel="alternate" hrefLang="en-US" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" href="/icons/icon-192.png" sizes="192x192" />
        <link rel="icon" type="image/png" href="/icons/icon-512.png" sizes="512x512" />
        {/* Prefetch DNS for external resources (performance + SEO) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* Structured data — JSON-LD for rich results */}
        <script id="structured-data-person" type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
        <script id="structured-data-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
        <script id="structured-data-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
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
