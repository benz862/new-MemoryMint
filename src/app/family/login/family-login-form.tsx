"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function FamilyLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const supabase = createBrowserSupabaseClient();
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);
    if (signErr) {
      setError(signErr.message);
      return;
    }
    router.push("/family");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-10 max-w-sm space-y-6 rounded-2xl border border-foreground/10 bg-background px-8 py-10 shadow-sm"
    >
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
          Email
        </span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-foreground/15 px-4 py-3 text-foreground outline-none ring-accent/30 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-foreground/15 px-4 py-3 text-foreground outline-none ring-accent/30 focus:ring-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
