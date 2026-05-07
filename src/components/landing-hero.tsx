"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/experience-hero-premium.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#fff7ef]/95 via-[#fff7ef]/88 to-[#fff7ef]/34 lg:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#fff7ef]/86 via-transparent to-[#fff7ef]/15" />
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[120%] w-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,transparent_65%)] opacity-80"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-14 sm:px-10 sm:pb-28 sm:pt-20">
        <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex justify-center lg:justify-start"
            >
              <Image
                src="/MemoryMint_Logo.png"
                alt="MemoryMint"
                width={240}
                height={150}
                priority
                className="h-auto w-[min(200px,70vw)] drop-shadow-sm sm:w-[220px]"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="mt-8 text-balance text-center font-display text-4xl leading-[1.12] text-foreground sm:text-5xl lg:text-left lg:text-[2.75rem] lg:leading-tight"
            >
              Honor their memory.
              <span className="block text-brand sm:mt-1">Preserve their story.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mx-auto mt-6 max-w-xl text-balance text-center text-base leading-relaxed text-muted sm:text-lg lg:mx-0 lg:text-left"
            >
              A gentle digital memorial where family and friends share photos,
              videos, and written memories—beautiful on any device, including
              iPad guestbook mode at the service.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
            >
              <a
                href="/#pricing"
                className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-white shadow-md transition hover:bg-brand-hover"
              >
                Create a memorial
              </a>
              <a
                href="/experience"
                className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-full border-2 border-brand/25 bg-white/70 px-8 text-sm font-semibold text-brand backdrop-blur transition hover:border-brand/50 hover:bg-white"
              >
                Explore memorial plans
              </a>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="mt-6 text-center text-xs text-muted lg:text-left"
            >
              Start with a 30-day memorial experience—no subscription required to
              begin. Upgrade when you&apos;re ready to preserve longer.
            </motion.p>
        </div>
      </div>
    </section>
  );
}
