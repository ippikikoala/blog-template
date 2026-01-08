import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Lightbox from "@/components/Lightbox";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "いっぴきこあらの大冒険",
    template: "%s | いっぴきこあらの大冒険",
  },
  description: "鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ",
  openGraph: {
    title: "いっぴきこあらの大冒険",
    description: "鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ",
    type: "website",
    locale: "ja_JP",
    siteName: "いっぴきこあらの大冒険",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <ScrollToTop />
        <Lightbox />
      </body>
    </html>
  );
}
