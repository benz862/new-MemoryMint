import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
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
  title: "MemoryMint — Honor their memory, preserve their story",
  description:
    "A gentle digital memorial for photos, videos, and written memories—QR sharing, guestbook, and family moderation.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${sans.className} flex min-h-screen flex-col antialiased`}
      >
        <SiteHeader userEmail={user?.email ?? null} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
