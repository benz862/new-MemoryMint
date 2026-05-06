const faqs = [
  {
    q: "Do guests need an account?",
    a: "No. They follow your link or scan the QR code and can leave a message or upload from their browser.",
  },
  {
    q: "Can we moderate what appears?",
    a: "Yes. Family admins can review guestbook submissions before anything appears publicly.",
  },
  {
    q: "What happens after the first 30 days?",
    a: "Tribute includes 30-day hosting; Legacy and Heritage offer longer preservation. You can upgrade when the time is right.",
  },
];

export function LandingAboutFaq() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-t border-foreground/10 bg-brand px-6 py-20 text-white sm:px-10"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl sm:text-4xl">About MemoryMint</h2>
        <p className="mt-6 text-base leading-relaxed text-white/85">
          MemoryMint exists so no story is lost in a group chat thread or a
          forgotten camera roll. We combine a dignified public memorial with
          tools families actually use during services and in the months that
          follow—QR sharing, moderation, and optional long-term hosting.
        </p>
      </div>

      <div id="faq" className="mx-auto mt-20 max-w-3xl scroll-mt-24">
        <h2 className="font-display text-center text-3xl sm:text-4xl">
          Frequently asked questions
        </h2>
        <dl className="mt-12 space-y-8">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border-b border-white/15 pb-8 last:border-0">
              <dt className="font-display text-lg text-white">{q}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-white/80">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
