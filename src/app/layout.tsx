import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "اوجِ رشد | جامعه کوهنوردی اختصاصی",
  description: "به جامعه‌ای از افراد رشد-طلب بپیوندید. بدون سیاست، فقط رشد.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
