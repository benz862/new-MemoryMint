export type ShowcaseTier = "tribute" | "legacy" | "heritage";

export type ShowcaseTierContent = {
  slug: ShowcaseTier;
  productName: string;
  priceLine: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageSrc: string;
  heroImageAlt: string;
  storyTitle: string;
  storyBody: string;
  deviceSectionTitle: string;
  deviceSectionSubtitle: string;
  features: {
    title: string;
    body: string;
    imageSrc: string;
    imageAlt: string;
    layout: "image-left" | "image-right";
  }[];
  timeline: { phase: string; title: string; body: string }[];
  ctaTitle: string;
  ctaSub: string;
  checkoutPlan: ShowcaseTier;
};

/** Curated Unsplash imagery: warm light, editorial calm — not clinical or gloomy. */
const img = {
  warmInterior:
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=2000&q=80",
  softFloral:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=2000&q=80",
  goldenHour:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
  handsBook:
    "https://images.unsplash.com/photo-1516979187457-637f4ef62653?auto=format&fit=crop&w=2000&q=80",
  quietWindow:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=80",
  linenTexture:
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=2000&q=80",
};

export const SHOWCASE_TIERS: Record<ShowcaseTier, ShowcaseTierContent> = {
  tribute: {
    slug: "tribute",
    productName: "MemoryMint Tribute",
    priceLine: "$79 one-time",
    heroTitle: "Create a memorial today.",
    heroSubtitle:
      "A beautiful memorial space designed for immediate remembrance and funeral guestbook collection.",
    heroImageSrc: img.softFloral,
    heroImageAlt: "Soft daylight on gentle flowers — warmth and remembrance.",
    storyTitle: "When the days matter most",
    storyBody:
      "When someone passes away, families are overwhelmed. MemoryMint Tribute creates an instant memorial space where stories, condolences, photos, and memories can be gathered beautifully during the days that matter most—without adding complexity.",
    deviceSectionTitle: "Designed for the room, the table, the moment",
    deviceSectionSubtitle:
      "Guests scan a QR code or open a link. No accounts. No friction. Just a calm place to leave a word or a photo.",
    features: [
      {
        title: "Share memories instantly",
        body: "A gentle guestbook flow—written messages and photos flow into one moderated queue the family can review with care.",
        imageSrc: img.warmInterior,
        imageAlt: "Warm interior light suggesting gathering and comfort.",
        layout: "image-left",
      },
      {
        title: "Preserve stories beautifully",
        body: "Typography and layout stay dignified and readable on every screen—from phones in the pew to an iPad at the signing table.",
        imageSrc: img.quietWindow,
        imageAlt: "Soft window light — calm, editorial atmosphere.",
        layout: "image-right",
      },
      {
        title: "A simple path home",
        body: "Thirty days of hosting gives everyone breathing room to return, re-read, and add what they forgot to say the first time.",
        imageSrc: img.handsBook,
        imageAlt: "Hands near an open book — legacy and story.",
        layout: "image-left",
      },
    ],
    timeline: [
      {
        phase: "Day one",
        title: "Create the memorial",
        body: "Name, dates, a portrait, and a few heartfelt lines—you can refine the tone later. The space goes live when you are ready.",
      },
      {
        phase: "Funeral day",
        title: "Guests share in real time",
        body: "QR codes and links invite stories and photos into one place. Moderation keeps the tone respectful.",
      },
      {
        phase: "After the service",
        title: "The family gathers memories",
        body: "Approve messages, download favorites, and revisit the guestbook whenever you need to feel close.",
      },
      {
        phase: "Later",
        title: "Grow when you are ready",
        body: "If you choose to preserve longer, you can move into Legacy or Heritage without losing what was already shared.",
      },
    ],
    ctaTitle: "Begin preserving their story",
    ctaSub: "Start with Tribute—upgrade anytime if you want years of hosting.",
    checkoutPlan: "tribute",
  },
  legacy: {
    slug: "legacy",
    productName: "MemoryMint Legacy",
    priceLine: "$149/year",
    heroTitle: "A lasting digital memorial.",
    heroSubtitle:
      "Preserve stories, photos, videos, and voice memories in a permanent space family and friends can revisit for years.",
    heroImageSrc: img.goldenHour,
    heroImageAlt: "Warm golden light over a peaceful landscape.",
    storyTitle: "For the years after",
    storyBody:
      "Grief unfolds slowly. Legacy gives your memorial a home that stays open—so cousins, neighbors, and grandchildren can add voice notes, clips, and chapters across seasons, not just a single weekend.",
    deviceSectionTitle: "Every device becomes a doorway",
    deviceSectionSubtitle:
      "Video, voice, richer themes, and multiple family admins mean the memorial can evolve as the story does.",
    features: [
      {
        title: "Video and voice, held gently",
        body: "Upload short clips or voice memos with the same moderation and care as written messages.",
        imageSrc: img.goldenHour,
        imageAlt: "Sunset warmth — enduring presence.",
        layout: "image-right",
      },
      {
        title: "A card that travels with you",
        body: "One stainless steel MemoryMint card is included—a tangible link back to the living memorial.",
        imageSrc: img.linenTexture,
        imageAlt: "Soft linen texture suggesting craft and permanence.",
        layout: "image-left",
      },
      {
        title: "Hosting that keeps pace",
        body: "Annual hosting means you are not racing the calendar. The memorial stays available for anniversaries and ordinary Tuesdays alike.",
        imageSrc: img.warmInterior,
        imageAlt: "Warm interior — family and continuity.",
        layout: "image-right",
      },
    ],
    timeline: [
      {
        phase: "Day one",
        title: "Lay the foundation",
        body: "Publish the memorial, invite admins, and set moderation preferences the way your family prefers.",
      },
      {
        phase: "First year",
        title: "Stories keep arriving",
        body: "Birthdays, holidays, and quiet Tuesdays bring new uploads. The space is built to hold them all.",
      },
      {
        phase: "Together",
        title: "Admins share the weight",
        body: "Multiple family admins can tend the guestbook, approve submissions, and update details without bottlenecks.",
      },
      {
        phase: "Always",
        title: "The card remains",
        body: "The MemoryMint card becomes a permanent gateway—scan, remember, add another memory.",
      },
    ],
    ctaTitle: "Create a beautiful memorial today",
    ctaSub: "Legacy renews annually so the archive stays online and cared for.",
    checkoutPlan: "legacy",
  },
  heritage: {
    slug: "heritage",
    productName: "MemoryMint Heritage",
    priceLine: "$349 one-time",
    heroTitle: "Preserve a lifetime for generations.",
    heroSubtitle:
      "A premium long-term memorial experience with AI assistance, downloadable archives, and beautifully preserved memories.",
    heroImageSrc: img.handsBook,
    heroImageAlt: "Elegant still life with book — archival, timeless.",
    storyTitle: "Built for generations",
    storyBody:
      "Heritage is for families who want the highest level of preservation—long hosting horizons, AI-assisted writing when words are hard to find, premium themes, a private family vault, and multiple cards so branches of the family each have a path home.",
    deviceSectionTitle: "A gallery, a vault, an archive",
    deviceSectionSubtitle:
      "Layered compositions of memorial pages, private areas, and exportable archives—luxury without excess.",
    features: [
      {
        title: "Ten years of peace of mind",
        body: "Extended hosting gives the next generation time to discover, contribute, and inherit the story on their own timeline.",
        imageSrc: img.quietWindow,
        imageAlt: "Quiet light — contemplative luxury.",
        layout: "image-left",
      },
      {
        title: "AI that assists, never replaces",
        body: "When sentences won't come, gentle AI suggestions help you draft—every word stays yours to edit or erase.",
        imageSrc: img.softFloral,
        imageAlt: "Soft botanical light.",
        layout: "image-right",
      },
      {
        title: "Download the archive",
        body: "Own a copy of the memorial—media and messages packaged for safekeeping outside the cloud alone.",
        imageSrc: img.linenTexture,
        imageAlt: "Fine materials — heirloom quality.",
        layout: "image-left",
      },
    ],
    timeline: [
      {
        phase: "Day one",
        title: "Compose with care",
        body: "Use premium themes, private vault areas, and AI-assisted drafting to shape a memorial that feels unmistakably theirs.",
      },
      {
        phase: "Gathering",
        title: "Everyone contributes",
        body: "Three included cards mean multiple households can share the same digital home with their own physical touchpoint.",
      },
      {
        phase: "Years on",
        title: "The vault stays yours",
        body: "Private family areas keep sensitive memories visible only to those you trust.",
      },
      {
        phase: "Legacy",
        title: "Pass it forward",
        body: "Archives and long hosting mean grandchildren can hear the voices they never met in person.",
      },
    ],
    ctaTitle: "Begin preserving their story",
    ctaSub: "Heritage is our most complete preservation offering—one thoughtful investment.",
    checkoutPlan: "heritage",
  },
};

export const HUB_TIER_CARDS: {
  tier: ShowcaseTier;
  productName: string;
  href: string;
  heading: string;
  description: string;
  priceLine: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
}[] = [
  {
    tier: "tribute",
    productName: "MemoryMint Tribute",
    href: "/experience/tribute",
    heading: "Create a memorial today.",
    description:
      "A beautiful memorial space designed for immediate remembrance and funeral guestbook collection.",
    priceLine: "$79 one-time",
    features: [
      "Instant memorial creation",
      "iPad guestbook mode",
      "QR sharing",
      "Photo uploads & written memories",
      "Family moderation",
      "30-day memorial hosting",
    ],
    imageSrc: img.softFloral,
    imageAlt: "Warm floral light — tribute tier mood.",
  },
  {
    tier: "legacy",
    productName: "MemoryMint Legacy",
    href: "/experience/legacy",
    heading: "A lasting digital memorial.",
    description:
      "Preserve stories, photos, videos, and voice memories in a permanent space family and friends can revisit for years.",
    priceLine: "$149/year",
    features: [
      "Ongoing memorial hosting",
      "Video uploads",
      "Voice recordings",
      "Enhanced themes",
      "Multiple family admins",
      "1 stainless steel MemoryMint card included",
    ],
    imageSrc: img.goldenHour,
    imageAlt: "Golden hour landscape — legacy tier mood.",
  },
  {
    tier: "heritage",
    productName: "MemoryMint Heritage",
    href: "/experience/heritage",
    heading: "Preserve a lifetime for generations.",
    description:
      "A premium long-term memorial experience with AI assistance, downloadable archives, and beautifully preserved memories.",
    priceLine: "$349 one-time",
    features: [
      "10-year memorial hosting",
      "3 MemoryMint cards included",
      "AI obituary assistance",
      "Downloadable memorial archive",
      "Premium themes",
      "Private family vault",
    ],
    imageSrc: img.handsBook,
    imageAlt: "Editorial still life — heritage tier mood.",
  },
];
