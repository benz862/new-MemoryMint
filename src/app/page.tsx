import { LandingHero } from "@/components/landing-hero";
import { PricingSection } from "@/components/pricing-section";

const steps = [
  "Create the memorial",
  "Share the QR code at the funeral",
  "Guests upload stories, photos, and videos",
  "Preserve the memorial permanently",
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingHero />
      <section
        id="how-it-works"
        className="border-t border-foreground/10 bg-background px-6 py-20 sm:px-10"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl text-foreground sm:text-4xl">
            How it works
          </h2>
          <ol className="mt-14 grid list-none gap-10 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((title, i) => (
              <li key={title} className="text-center font-sans">
                <span className="font-display text-3xl tabular-nums text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-base leading-relaxed text-muted">{title}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <PricingSection />
    </div>
  );
}
