const TIERS = [
  {
    name: "Tribute",
    hint: "30-day · guestbook · moderation",
    href: "/remember/sample-memorymint-tribute",
    ring: "border-amber-900/20 hover:border-amber-700/40 hover:bg-amber-50/50",
  },
  {
    name: "Legacy",
    hint: "Ongoing hosting · video & voice",
    href: "/remember/sample-memorymint-legacy",
    ring: "border-slate-600/25 hover:border-slate-500/45 hover:bg-slate-50/80",
  },
  {
    name: "Heritage",
    hint: "10-year · archive · premium themes",
    href: "/remember/sample-memorymint-heritage",
    ring: "border-[var(--accent)]/35 hover:border-[var(--accent)]/55 hover:bg-[var(--accent-soft)]/60",
  },
] as const;

export function TierPreviewButtons() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TIERS.map((tier) => (
        <a
          key={tier.href}
          href={tier.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex min-h-[132px] flex-col items-center justify-center rounded-2xl border-2 bg-background px-4 py-6 text-center shadow-sm transition ${tier.ring}`}
        >
          <span className="font-display text-2xl text-foreground">{tier.name}</span>
          <span className="mt-2 max-w-[14rem] text-xs leading-snug text-muted">
            {tier.hint}
          </span>
          <span className="mt-4 text-sm font-semibold text-accent">
            Open client preview
          </span>
        </a>
      ))}
    </div>
  );
}
