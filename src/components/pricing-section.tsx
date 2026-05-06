import { PLAN_LABELS } from "@/lib/plans";
import type { HostingPlan } from "@/types/database";

const tiers: {
  plan: HostingPlan;
  description: string;
  bullets: string[];
}[] = [
  {
    plan: "tribute",
    description:
      "Instant memorial, guestbook mode, photos, written memories, QR, moderation, 30-day hosting.",
    bullets: [
      "Instant memorial",
      "iPad guestbook mode",
      "Photo uploads & written memories",
      "QR sharing & moderation queue",
      "30-day hosting",
    ],
  },
  {
    plan: "legacy",
    description:
      "Ongoing hosting, video & voice, themes, multiple admins, plus one MemoryMint card.",
    bullets: [
      "Ongoing memorial hosting",
      "Video & voice memories",
      "Enhanced themes",
      "Multiple family admins",
      "1 MemoryMint card included",
    ],
  },
  {
    plan: "heritage",
    description:
      "Ten-year hosting, three cards, AI writing help, archive download, premium themes, family vault.",
    bullets: [
      "10-year hosting",
      "3 MemoryMint cards",
      "AI writing assistance",
      "Downloadable archive",
      "Premium themes & private family vault",
    ],
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="border-t border-foreground/10 bg-background px-6 py-24 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-center text-3xl text-foreground sm:text-4xl">
          Choose how you&apos;ll preserve their story
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
          Start with the experience that fits this season of life—you can grow
          into more preservation whenever you&apos;re ready.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map(({ plan, description, bullets }) => {
            const label = PLAN_LABELS[plan];
            return (
              <div
                key={plan}
                className="flex flex-col rounded-2xl border border-foreground/10 bg-accent-soft/30 p-8 shadow-sm"
              >
                <p className="font-display text-xl text-foreground">
                  {label.title}
                </p>
                <p className="mt-4 font-display text-3xl text-foreground">
                  {label.price}
                  <span className="text-lg font-sans font-normal text-muted">
                    {plan === "legacy" ? label.cadence : ` ${label.cadence}`}
                  </span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {description}
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm text-foreground/90">
                  {bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href={`/api/checkout?plan=${plan}`}
                  className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-6 text-center text-sm font-medium text-background transition hover:opacity-90"
                >
                  {plan === "tribute" && "Create Tribute memorial"}
                  {plan === "legacy" && "Create Legacy memorial"}
                  {plan === "heritage" && "Create Heritage memorial"}
                </a>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-xs text-muted">
          Checkout is securely processed by Stripe. After payment you&apos;ll
          land on a short form—no dashboards, no overwhelm.
        </p>
      </div>
    </section>
  );
}
