import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teos-ai-engine.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Teos AI Engine — Egypt's Sovereign AI Content Engine",
    template: "%s | Teos AI Engine",
  },
  description:
    "Generate on-brand social content across X, LinkedIn, Instagram & more with Egypt's first sovereign AI content engine. Built in Alexandria.",
  keywords: [
    "AI content generation",
    "social media AI",
    "Egyptian AI",
    "sovereign AI",
    "content engine",
    "Teos",
    "AI marketing",
    "X posts",
    "LinkedIn content",
    "Instagram AI",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Teos AI Engine",
    title: "Teos AI Engine — Egypt's Sovereign AI Content Engine",
    description:
      "Generate on-brand social content across X, LinkedIn, Instagram & more with Egypt's first sovereign AI content engine.",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Teos AI Engine — Sovereign AI Content Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teos AI Engine — Egypt's Sovereign AI Content Engine",
    description:
      "Generate on-brand social content across X, LinkedIn, Instagram & more with Egypt's first sovereign AI content engine.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@king_teos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Teos AI Engine",
      description:
        "Egypt's first sovereign AI content engine for social media. Generate on-brand posts across X, LinkedIn, Instagram, and more.",
      url: siteUrl,
      applicationCategory: "AI Application",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", name: "Pro", price: "29", priceCurrency: "USD" },
        { "@type": "Offer", name: "Agency", price: "69", priceCurrency: "USD" },
        { "@type": "Offer", name: "Lifetime", price: "149", priceCurrency: "USD" },
      ],
      author: {
        "@type": "Organization",
        name: "Teos Network",
        url: "https://teos-ai-engine.vercel.app",
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
