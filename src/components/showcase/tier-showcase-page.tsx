"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import {
  SHOWCASE_TIERS,
  type ShowcaseTier,
} from "@/lib/showcase-content";

const ease = [0.22, 1, 0.36, 1] as const;

function DeviceCollage() {
  return (
    <div className="relative mx-auto max-w-5xl px-4">
      <div className="grid gap-8 md:grid-cols-3 md:items-end">
        <div className="relative mx-auto w-full max-w-[280px] md:translate-y-8">
          <div className="rounded-[2rem] border border-white/60 bg-white/45 p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            <div className="aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-showcase-mist to-[#c5ddd8]">
              <div className="flex h-full flex-col p-4">
                <p className="text-[10px] font-medium uppercase tracking-widest text-showcase-charcoal/50">
                  Guestbook
                </p>
                <p className="mt-2 font-display text-lg text-showcase-charcoal">
                  Share a memory
                </p>
                <div className="mt-4 flex-1 rounded-lg border border-dashed border-showcase-teal/30 bg-white/60 p-3 text-[11px] leading-relaxed text-showcase-charcoal/60">
                  Your words appear here after the family gently reviews them.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[260px]">
          <div className="rounded-[2.5rem] border-[9px] border-showcase-charcoal/90 bg-showcase-charcoal p-1 shadow-2xl">
            <div className="aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-showcase-ivory">
              <div className="flex h-full flex-col bg-gradient-to-b from-white to-showcase-mist p-3">
                <div className="mx-auto h-1 w-12 rounded-full bg-showcase-charcoal/15" />
                <p className="mt-4 text-center text-[9px] text-showcase-charcoal/50">
                  Scan to remember
                </p>
                <div className="mx-auto mt-3 grid h-24 w-24 place-items-center rounded-xl border border-showcase-divider bg-white text-[10px] font-medium text-showcase-charcoal/40">
                  QR
                </div>
                <p className="mt-4 text-center font-display text-sm text-showcase-charcoal">
                  Memorial home
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[280px] md:-translate-y-4">
          <div className="rounded-[2rem] border border-showcase-gold/25 bg-white/50 p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-[#f0ebe4] to-showcase-mist">
              <div className="grid h-full grid-cols-3 gap-1.5 p-3">
                {["", "", "", "", "", ""].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-white/70 shadow-sm ring-1 ring-showcase-divider/40"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TierShowcasePage({ tier }: { tier: ShowcaseTier }) {
  const c = SHOWCASE_TIERS[tier];
  const reduce = useReducedMotion();
  const dur = (s: number) => (reduce ? 0 : s);
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 56]);

  return (
    <article className="overflow-x-hidden pb-28">
      <section ref={heroRef} className="relative min-h-[min(100dvh,900px)]">
        <motion.div style={{ y: imgY }} className="absolute inset-0">
          <Image
            src={c.heroImageSrc}
            alt={c.heroImageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-showcase-ivory via-showcase-ivory/88 to-showcase-ivory/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-showcase-ivory/95 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col justify-end px-6 pb-20 pt-36 sm:pb-28 sm:pt-40">
          <Link
            href="/experience"
            className="mb-10 inline-flex w-fit text-xs font-medium uppercase tracking-[0.28em] text-showcase-charcoal/50 transition hover:text-showcase-teal"
          >
            ← Memorial plans
          </Link>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur(0.75), ease }}
            className="text-sm font-medium text-showcase-teal"
          >
            {c.priceLine}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur(0.9), delay: reduce ? 0 : 0.06, ease }}
            className="mt-4 max-w-3xl font-display text-balance text-4xl leading-[1.08] text-showcase-charcoal sm:text-6xl sm:leading-[1.05]"
          >
            {c.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur(0.85), delay: reduce ? 0 : 0.12, ease }}
            className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-showcase-charcoal/75"
          >
            {c.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur(0.8), delay: reduce ? 0 : 0.18, ease }}
            className="mt-12 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href={`/api/checkout?plan=${c.checkoutPlan}`}
              className="inline-flex min-h-[54px] min-w-[220px] items-center justify-center rounded-full bg-showcase-charcoal px-10 text-sm font-semibold text-showcase-ivory shadow-lg transition hover:bg-showcase-teal hover:text-white"
            >
              Begin with {c.productName.replace("MemoryMint ", "")}
            </a>
            <Link
              href="/#pricing"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-showcase-charcoal/20 bg-white/60 px-8 text-sm font-semibold text-showcase-charcoal backdrop-blur transition hover:border-showcase-teal/40"
            >
              Compare on homepage
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-28">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: dur(0.8), ease }}
          className="text-center font-display text-3xl text-showcase-charcoal sm:text-4xl"
        >
          {c.storyTitle}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: dur(0.8), delay: reduce ? 0 : 0.06, ease }}
          className="mt-8 text-center text-lg leading-[1.75] text-showcase-charcoal/75"
        >
          {c.storyBody}
        </motion.p>
      </section>

      <section className="border-y border-showcase-divider/60 bg-showcase-mist/50 py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: dur(0.75), ease }}
            className="font-display text-3xl text-showcase-charcoal sm:text-4xl"
          >
            {c.deviceSectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: dur(0.75), delay: reduce ? 0 : 0.05, ease }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-showcase-charcoal/70"
          >
            {c.deviceSectionSubtitle}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: dur(0.95), ease }}
          className="mt-20"
        >
          <DeviceCollage />
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl space-y-28 px-6 py-28">
        {c.features.map((block, idx) => {
          const imageFirst = block.layout === "image-left";
          const imageCol = (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-showcase-divider/80 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.15)]">
              <Image
                src={block.imageSrc}
                alt={block.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          );
          const textCol = (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-showcase-gold">
                {String(idx + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-display text-3xl text-showcase-charcoal sm:text-4xl">
                {block.title}
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-showcase-charcoal/72">
                {block.body}
              </p>
            </div>
          );
          return (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{
                duration: dur(0.85),
                delay: reduce ? 0 : idx * 0.05,
                ease,
              }}
              className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
            >
              {imageFirst ? (
                <>
                  {imageCol}
                  {textCol}
                </>
              ) : (
                <>
                  {textCol}
                  {imageCol}
                </>
              )}
            </motion.div>
          );
        })}
      </section>

      <section className="bg-showcase-charcoal py-28 text-showcase-ivory">
        <div className="mx-auto max-w-3xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: dur(0.75), ease }}
            className="text-center font-display text-3xl sm:text-4xl"
          >
            What your family experiences
          </motion.h2>
          <ol className="mt-16 space-y-12 border-l border-white/15 pl-8">
            {c.timeline.map((step, i) => (
              <motion.li
                key={step.phase}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: dur(0.7),
                  delay: reduce ? 0 : i * 0.06,
                  ease,
                }}
                className="relative"
              >
                <span className="absolute -left-[39px] top-1.5 flex h-3 w-3 rounded-full border-2 border-showcase-gold bg-showcase-charcoal" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-showcase-teal">
                  {step.phase}
                </p>
                <p className="mt-2 font-display text-xl text-white">{step.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 py-32 text-center">
        <div className="absolute inset-x-6 top-1/2 -z-10 h-64 -translate-y-1/2 rounded-[3rem] bg-gradient-to-br from-showcase-teal/15 via-showcase-gold/10 to-transparent blur-3xl" />
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: dur(0.8), ease }}
          className="font-display text-4xl text-showcase-charcoal sm:text-5xl"
        >
          {c.ctaTitle}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: dur(0.75), delay: reduce ? 0 : 0.06, ease }}
          className="mx-auto mt-6 max-w-xl text-base text-showcase-charcoal/70"
        >
          {c.ctaSub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: dur(0.75), delay: reduce ? 0 : 0.12, ease }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href={`/api/checkout?plan=${c.checkoutPlan}`}
            className="inline-flex min-h-[56px] min-w-[260px] items-center justify-center rounded-full bg-showcase-charcoal px-10 text-sm font-semibold text-showcase-ivory shadow-xl transition hover:bg-showcase-teal hover:text-white"
          >
            Continue to checkout
          </a>
          <Link
            href="/experience"
            className="text-sm font-medium text-showcase-charcoal/55 underline-offset-4 transition hover:text-showcase-teal hover:underline"
          >
            View other plans
          </Link>
        </motion.div>
      </section>
    </article>
  );
}
