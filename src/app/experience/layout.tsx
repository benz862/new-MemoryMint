import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memorial plans — MemoryMint",
  description:
    "A modern memorial experience platform—emotionally crafted plans to preserve stories, photos, video, and voice before they disappear.",
};

export default function ExperienceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="showcase-root min-h-screen bg-showcase-ivory text-showcase-charcoal selection:bg-showcase-teal/25">
      {children}
    </div>
  );
}
