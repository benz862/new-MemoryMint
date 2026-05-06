import Link from "next/link";

const examples = [
  {
    label: "Tribute tier",
    slug: "sample-memorymint-tribute",
    blurb: "Guestbook, photos, and written memories.",
  },
  {
    label: "Legacy tier",
    slug: "sample-memorymint-legacy",
    blurb: "Richer media and ongoing hosting preview.",
  },
  {
    label: "Heritage tier",
    slug: "sample-memorymint-heritage",
    blurb: "Premium layout and long-preservation story.",
  },
] as const;

export function LandingExamples() {
  return (
    <section
      id="examples"
      className="scroll-mt-24 border-t border-foreground/10 bg-background px-6 py-20 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-center text-3xl text-foreground sm:text-4xl">
          Memorial examples
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted">
          Sample pages for each plan (visible after the sample-data migration is
          applied in Supabase).
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {examples.map(({ label, slug, blurb }) => (
            <li key={slug}>
              <Link
                href={`/remember/${slug}`}
                className="flex h-full flex-col rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm transition hover:border-brand/30 hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {label}
                </span>
                <span className="mt-2 font-display text-xl text-foreground">
                  Open sample
                </span>
                <span className="mt-2 flex-1 text-sm text-muted">{blurb}</span>
                <span className="mt-4 text-sm font-medium text-brand">
                  View memorial →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
