import type { Metadata } from "next";

import { TierShowcasePage } from "@/components/showcase/tier-showcase-page";

export const metadata: Metadata = {
  title: "MemoryMint Tribute — Experience",
  description:
    "Create a memorial today. Instant space, iPad guestbook, QR sharing, and 30 days of gentle hosting.",
};

export default function TributeExperiencePage() {
  return <TierShowcasePage tier="tribute" />;
}
