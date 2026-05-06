import type { Metadata } from "next";

import { TierShowcasePage } from "@/components/showcase/tier-showcase-page";

export const metadata: Metadata = {
  title: "MemoryMint Heritage — Experience",
  description:
    "Preserve a lifetime for generations—10-year hosting, AI assistance, archives, premium themes, and private family vault.",
};

export default function HeritageExperiencePage() {
  return <TierShowcasePage tier="heritage" />;
}
