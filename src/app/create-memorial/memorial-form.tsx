"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createMemorialAction } from "@/app/create-memorial/actions";
import { MEMORIAL_STYLE_OPTIONS } from "@/lib/memorial-styles";
import type { HostingPlan } from "@/types/database";

type Props = {
  sessionId: string;
  plan: HostingPlan;
  defaultEmail: string;
};

export function MemorialForm({ sessionId, plan, defaultEmail }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      const result = await createMemorialAction(fd);
      if ("error" in result) {
        setError(result.error);
        setPending(false);
        return;
      }
      router.push(`/remember/${result.slug}`);
    } catch {
      setPending(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-lg space-y-8 pb-24 pt-8"
      encType="multipart/form-data"
    >
      <input type="hidden" name="stripe_session_id" value={sessionId} />

      <div className="rounded-2xl border border-foreground/10 bg-background/80 px-6 py-5 shadow-sm">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-muted">
          Plan
        </p>
        <p className="mt-2 capitalize text-foreground">{plan}</p>
      </div>

      {error ? (
        <p
          className="rounded-xl border border-red-900/20 bg-red-50 px-4 py-3 text-sm text-red-950"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="space-y-6">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Full name
          </span>
          <input
            name="full_name"
            required
            className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
            placeholder="Their full name"
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Birth date
            </span>
            <input
              name="birth_date"
              type="date"
              required
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Passing date
            </span>
            <input
              name="passing_date"
              type="date"
              required
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Main photo
          </span>
          <input
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-medium file:text-background"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Short obituary / tribute
          </span>
          <textarea
            name="obituary"
            required
            rows={6}
            minLength={10}
            className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
            placeholder="A few heartfelt sentences are enough—we&apos;ll help refine the tone later."
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Funeral date{" "}
              <span className="font-normal text-muted">(optional)</span>
            </span>
            <input
              name="funeral_date"
              type="date"
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Funeral location{" "}
              <span className="font-normal text-muted">(optional)</span>
            </span>
            <input
              name="funeral_location"
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
              placeholder="Venue or city"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Family contact email
          </span>
          <input
            name="family_contact_email"
            type="email"
            required
            defaultValue={defaultEmail}
            className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Memorial style
          </span>
          <select
            name="style"
            required
            className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 transition focus:border-accent/50 focus:ring-2"
            defaultValue="warm_family"
          >
            {MEMORIAL_STYLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create memorial"}
      </button>
    </form>
  );
}
