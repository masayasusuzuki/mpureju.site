import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ChatBot } from "@/components/chat/ChatBot";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif_JP({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison PUREJU｜銀座の美容外科・美容皮膚科",
    template: "%s｜Maison PUREJU",
  },
  description:
    "銀座の美容外科・美容皮膚科クリニック。形成外科専門医が担当する目元・鼻・口元・リフトアップ・美容皮膚科の施術。完全個室でプライバシーに配慮した環境をご提供。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Maison PUREJU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${cormorant.variable} antialiased`}
        suppressHydrationWarning
      >
        <Header />
        <main className="pt-16 md:pt-20 pb-16 lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        <ChatBot />
      </body>
    </html>
  );
}
