"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:px-10 sm:pb-32 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-soft)_0%,_transparent_55%)] opacity-90" />
      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Image
            src="/MemoryMint_Logo.png"
            alt="MemoryMint"
            width={280}
            height={175}
            priority
            className="h-auto w-full max-w-[220px] sm:max-w-[260px]"
            sizes="(max-width: 640px) 220px, 260px"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="font-display mt-6 text-4xl leading-tight text-foreground sm:text-5xl sm:leading-tight"
        >
          Preserve the stories before they disappear.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          Create a beautiful memorial space where family and friends can share
          stories, photos, videos, and memories in minutes.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition hover:opacity-90"
            href="/#pricing"
          >
            Create memorial
          </a>
          <a
            className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-full border border-foreground/15 bg-background/80 px-8 text-sm font-medium text-foreground backdrop-blur transition hover:border-accent/40"
            href="#how-it-works"
          >
            See how it works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
