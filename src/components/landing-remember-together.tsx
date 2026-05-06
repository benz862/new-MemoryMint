const items = [
  {
    title: "Remember together",
    body: "Photos, stories, videos, and messages in one calm, respectful space.",
  },
  {
    title: "Share in seconds",
    body: "QR codes and links guests can use from their phones—no app required.",
  },
  {
    title: "Secure & private",
    body: "Family-controlled visibility and moderation so nothing feels out of place.",
  },
  {
    title: "Preserve for years",
    body: "From a meaningful 30-day tribute to multi-year hosting—choose what fits.",
  },
];

export function LandingRememberTogether() {
  return (
    <section
      id="remember-together"
      className="scroll-mt-24 border-t border-foreground/10 bg-white px-6 py-20 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-center text-3xl text-foreground sm:text-4xl">
          Built for the hardest days
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
          MemoryMint keeps the focus on your loved one—simple for guests,
          thoughtful for family.
        </p>
        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ title, body }) => (
            <li
              key={title}
              className="rounded-2xl border border-foreground/10 bg-accent-soft/40 p-6 shadow-sm"
            >
              <p className="font-display text-lg text-brand">{title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
