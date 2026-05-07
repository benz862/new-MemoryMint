"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { HUB_TIER_CARDS } from "@/lib/showcase-content";

const ease = [0.22, 1, 0.36, 1] as const;

export function ExperienceHub() {
  const reduce = useReducedMotion();
  const dur = (s: number) => (reduce ? 0 : s);

  return (
    <main className="overflow-x-hidden pb-32">
      <section className="relative min-h-[min(100dvh,920px)]">
        <div className="absolute inset-0 bg-gradient-to-br from-showcase-ivory via-showcase-mist to-[#dfece9]" />
        <div className="absolute right-0 top-0 h-[70%] w-[55%] max-w-3xl opacity-[0.35]">
          <Image
            src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80"
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width:1024px) 0px, 50vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-showcase-ivory via-showcase-ivory/95 to-showcase-ivory/40 lg:to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-28 lg:grid-cols-2 lg:items-center lg:pt-32">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur(0.7), ease }}
              className="text-xs font-medium uppercase tracking-[0.35em] text-showcase-teal"
            >
              Memorial plans
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur(0.85), delay: reduce ? 0 : 0.06, ease }}
              className="mt-6 font-display text-balance text-4xl leading-[1.12] text-showcase-charcoal sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
            >
              Preserve the stories before they disappear.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur(0.85), delay: reduce ? 0 : 0.12, ease }}
              className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-showcase-charcoal/75"
            >
              Create a beautiful memorial space where family and friends can
              share stories, photos, videos, and memories in minutes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur(0.8), delay: reduce ? 0 : 0.2, ease }}
              className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link
                href="/experience/tribute"
                className="inline-flex min-h-[52px] min-w-[160px] items-center justify-center rounded-full border border-showcase-divider bg-white/80 px-8 text-sm font-semibold text-showcase-charcoal shadow-sm backdrop-blur transition hover:border-showcase-teal/50 hover:shadow-md"
              >
                View Tribute
              </Link>
              <Link
                href="/experience/legacy"
                className="inline-flex min-h-[52px] min-w-[160px] items-center justify-center rounded-full border border-showcase-divider bg-white/80 px-8 text-sm font-semibold text-showcase-charcoal shadow-sm backdrop-blur transition hover:border-showcase-teal/50 hover:shadow-md"
              >
                View Legacy
              </Link>
              <Link
                href="/experience/heritage"
                className="inline-flex min-h-[52px] min-w-[160px] items-center justify-center rounded-full bg-showcase-charcoal px-8 text-sm font-semibold text-showcase-ivory shadow-md transition hover:bg-showcase-charcoal/90"
              >
                View Heritage
              </Link>
            </motion.div>
            <p className="mt-10 text-sm leading-relaxed text-showcase-charcoal/55">
              A modern memorial experience platform—stories, photos, video, and
              voice, preserved with care.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: dur(1), delay: reduce ? 0 : 0.15, ease }}
            className="relative hidden min-h-[420px] lg:block"
            aria-hidden
          >
            <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-[2rem] border border-white/50 bg-white/25 shadow-2xl backdrop-blur-xl" />
            <div className="absolute left-8 top-12 h-64 w-48 rotate-[-6deg] overflow-hidden rounded-2xl border border-white/60 bg-white/40 shadow-xl backdrop-blur-md">
              <Image
                src="https://images.unsplash.com/photo-1529333166437-7750a6dd463a?auto=format&fit=crop&w=600&q=80"
                alt=""
                width={400}
                height={560}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-8 right-4 h-56 w-72 rotate-[4deg] overflow-hidden rounded-2xl border border-showcase-gold/30 bg-white/50 shadow-2xl backdrop-blur-md">
              <Image
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80"
                alt=""
                width={720}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: dur(0.75), ease }}
          className="text-center font-display text-3xl text-showcase-charcoal sm:text-4xl"
        >
          Choose how you&apos;ll preserve their story
        </motion.h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-showcase-charcoal/65">
          Each plan is crafted as an experience—not a list of features. Open a
          room to feel which one fits this chapter of your family&apos;s life.
        </p>

        <ul className="mt-20 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {HUB_TIER_CARDS.map((card, i) => (
            <li key={card.tier}>
              <motion.article
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: dur(0.75),
                  delay: reduce ? 0 : i * 0.08,
                  ease,
                }}
                whileHover={
                  reduce
                    ? undefined
                    : { y: -10, transition: { duration: 0.45, ease } }
                }
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-showcase-divider/80 bg-white/70 shadow-[0_20px_50px_-20px_rgba(30,30,30,0.12)] backdrop-blur-md transition-shadow hover:border-showcase-teal/35 hover:shadow-[0_28px_60px_-24px_rgba(30,30,30,0.18)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    fill
                    className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.04]"
                    sizes="(max-width:1024px) 100vw, 33vw"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-showcase-charcoal/50 via-transparent to-transparent opacity-80" />
                  <p className="absolute bottom-4 left-5 font-display text-2xl text-white drop-shadow-sm">
                    {card.productName.replace("MemoryMint ", "")}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <p className="text-sm font-medium text-showcase-teal">
                    {card.priceLine}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-snug text-showcase-charcoal">
                    {card.heading}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-showcase-charcoal/70">
                    {card.description}
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm text-showcase-charcoal/75">
                    {card.features.slice(0, 5).map((f) => (
                      <li key={f} className="flex gap-2">
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-showcase-gold"
                          aria-hidden
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.href}
                    className="mt-10 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-showcase-charcoal text-sm font-semibold text-showcase-ivory transition group-hover:bg-showcase-teal group-hover:text-white"
                  >
                    Experience{" "}
                    {card.tier.charAt(0).toUpperCase() + card.tier.slice(1)}
                  </Link>
                </div>
              </motion.article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
