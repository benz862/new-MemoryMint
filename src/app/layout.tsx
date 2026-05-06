import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MemoryMint — Preserve the stories before they disappear",
  description:
    "Create a beautiful memorial space where family and friends can share stories, photos, videos, and memories in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${sans.className} flex min-h-screen flex-col antialiased`}
      >
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
