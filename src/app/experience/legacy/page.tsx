import type { Metadata } from "next";

import { TierShowcasePage } from "@/components/showcase/tier-showcase-page";

export const metadata: Metadata = {
  title: "MemoryMint Legacy — Experience",
  description:
    "A lasting digital memorial—video, voice, enhanced themes, multiple admins, and a stainless steel MemoryMint card.",
};

export default function LegacyExperiencePage() {
  return <TierShowcasePage tier="legacy" />;
}
