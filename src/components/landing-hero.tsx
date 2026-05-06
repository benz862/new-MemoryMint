"use client";

import { motion } from "framer-motion";
import Image from "next/image";

function MemorialPhoneMockup() {
  return (
    <div className="relative mx-auto w-[min(100%,280px)] sm:w-[300px]">
      <div className="rounded-[2.35rem] border-[10px] border-[#1a1a1a] bg-[#1a1a1a] p-1.5 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col overflow-hidden rounded-[1.85rem] bg-[#f4f0ea] aspect-[9/18]">
          <div className="shrink-0 bg-white/90 px-3 pb-2 pt-3 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              In loving memory
            </p>
            <p className="mt-1 font-display text-lg leading-tight text-foreground">
              James William Carter
            </p>
            <p className="mt-0.5 text-[11px] text-muted">1943 — 2024</p>
          </div>
          <div className="flex shrink-0 gap-0.5 border-b border-foreground/10 bg-white/70 px-2 py-1.5 text-[9px] font-medium text-muted">
            {["Memories", "Photos", "Videos", "Messages"].map((t) => (
              <span
                key={t}
                className={`flex-1 rounded-md py-1 text-center ${
                  t === "Memories"
                    ? "bg-brand/10 text-brand"
                    : "text-muted"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="min-h-0 flex-1 space-y-2 p-2.5">
            <div className="rounded-lg border border-foreground/10 bg-white/90 p-2 text-[10px] leading-snug text-muted">
              <span className="font-medium text-foreground">Sarah M.</span>{" "}
              Dad taught us all to fish at the lake every summer…
            </div>
            <div className="rounded-lg border border-dashed border-foreground/15 bg-white/50 p-2 text-center text-[10px] text-muted">
              Guests add stories here after you share the link or QR.
            </div>
          </div>
          <div className="shrink-0 border-t border-foreground/10 bg-white/95 p-2">
            <div className="rounded-lg bg-background px-2 py-1.5 text-left text-[10px] text-muted">
              Share a memory…
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#fff9f3] via-[var(--sunset-mid)] to-[var(--hero-deep)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[120%] w-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,transparent_65%)] opacity-80"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-14 sm:px-10 sm:pb-28 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div>
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
                href="/#examples"
                className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-full border-2 border-brand/25 bg-white/70 px-8 text-sm font-semibold text-brand backdrop-blur transition hover:border-brand/50 hover:bg-white"
              >
                View examples
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex justify-center lg:justify-end"
          >
            <MemorialPhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
