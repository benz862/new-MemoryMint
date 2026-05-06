"use client";

import { useState } from "react";

import { submitGuestMemory } from "@/app/remember/[slug]/actions";

type Props = { slug: string };

export function GuestMemoryForm({ slug }: Props) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("guest_name") ?? "");
    const message = String(fd.get("message") ?? "");
    setPending(true);
    const res = await submitGuestMemory(slug, name, message);
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setSent(true);
    e.currentTarget.reset();
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-foreground/10 bg-accent-soft/40 px-6 py-8 text-center">
        <p className="font-display text-2xl text-foreground">
          Thank you for sharing your memory.
        </p>
        <p className="mt-3 text-sm text-muted">
          The family will review your message before it appears here.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          Leave another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? (
        <p
          className="rounded-lg border border-red-900/15 bg-red-50 px-3 py-2 text-sm text-red-950"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          Your name{" "}
          <span className="font-normal text-muted">(optional)</span>
        </span>
        <input
          name="guest_name"
          className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 focus:border-accent/50 focus:ring-2"
          placeholder="e.g. Jane"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          Memory / message
        </span>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none ring-accent/30 focus:border-accent/50 focus:ring-2"
          placeholder="A story, a detail, a thank you…"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Share a memory"}
      </button>
    </form>
  );
}
