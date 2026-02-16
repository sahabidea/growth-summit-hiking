import type { Metadata } from "next";
import { Vazirmatn, Lalezar } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const lalezar = Lalezar({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-lalezar",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://owj-roshd.ir";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "اوجِ رشد | جامعه کوهنوردی اختصاصی",
    template: "%s | اوجِ رشد",
  },
  description:
    "به جامعه‌ای اختصاصی از افراد رشد‌طلب بپیوندید. کوهنوردی همراه با ذهن‌آگاهی، شبکه‌سازی استراتژیک، و رشد شخصی. بدون سیاست، فقط صعود.",
  keywords: [
    "کوهنوردی",
    "رشد شخصی",
    "ذهن‌آگاهی",
    "شبکه‌سازی",
    "جامعه کوهنوردی",
    "اوجِ رشد",
    "هایکینگ تهران",
    "توچال",
    "درکه",
    "کلک‌چال",
    "ورزش و تفکر",
  ],
  authors: [{ name: "اوجِ رشد" }],
  creator: "اوجِ رشد",
  publisher: "اوجِ رشد",
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
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: "اوجِ رشد",
    title: "اوجِ رشد | جامعه کوهنوردی اختصاصی",
    description:
      "صعود به قله‌های آرامش و رشد. کوهنوردی اختصاصی برای بازیابی انرژی و ذهن‌آگاهی.",
    images: [
      {
        url: "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058072/mountain_hero_background_dark_1771057683768_uzbox7.jpg",
        width: 1200,
        height: 630,
        alt: "اوجِ رشد — جامعه کوهنوردی اختصاصی",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "اوجِ رشد | جامعه کوهنوردی اختصاصی",
    description:
      "صعود به قله‌های آرامش و رشد. بدون سیاست، فقط صعود.",
    images: [
      "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058072/mountain_hero_background_dark_1771057683768_uzbox7.jpg",
    ],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "ورزش و سلامت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "اوجِ رشد",
    url: SITE_URL,
    logo: "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058072/mountain_hero_background_dark_1771057683768_uzbox7.jpg",
    description:
      "جامعه کوهنوردی اختصاصی برای افراد رشد‌طلب. ذهن‌آگاهی، شبکه‌سازی و صعود.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Persian",
    },
  };

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020617" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${vazirmatn.variable} ${lalezar.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
