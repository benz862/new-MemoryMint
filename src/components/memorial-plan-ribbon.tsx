import type { HostingPlan } from "@/types/database";

const PLAN_COPY: Record<
  HostingPlan,
  { title: string; blurb: string; className: string }
> = {
  tribute: {
    title: "MemoryMint Tribute",
    blurb: "30-day memorial · guestbook · photos & stories · moderation",
    className:
      "border-amber-900/15 bg-gradient-to-r from-amber-50/90 to-[var(--accent-soft)]/80 text-amber-950",
  },
  legacy: {
    title: "MemoryMint Legacy",
    blurb: "Ongoing hosting · video & voice · themes · multiple admins · card included",
    className:
      "border-slate-700/15 bg-gradient-to-r from-slate-100/95 to-slate-50/90 text-slate-900",
  },
  heritage: {
    title: "MemoryMint Heritage",
    blurb: "10-year hosting · archive · AI writing help · premium themes · family vault",
    className:
      "border-[var(--accent)]/25 bg-gradient-to-r from-[var(--accent-soft)] to-background text-foreground",
  },
};

type Props = { plan: HostingPlan; preview?: boolean };

export function MemorialPlanRibbon({ plan, preview }: Props) {
  const cfg = PLAN_COPY[plan];
  return (
    <div
      className={`mx-auto mb-10 max-w-3xl rounded-2xl border px-5 py-4 text-center sm:px-8 ${cfg.className}`}
    >
      <p className="font-display text-lg text-current sm:text-xl">{cfg.title}</p>
      <p className="mt-1 text-xs text-current/80 sm:text-sm">{cfg.blurb}</p>
      {preview ? (
        <p className="mt-2 text-[11px] uppercase tracking-wider text-current/60">
          Sample page for preview
        </p>
      ) : null}
    </div>
  );
}
