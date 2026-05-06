"use client";

import { useRouter } from "next/navigation";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function AdminSignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className="rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground transition hover:border-accent/40"
    >
      Sign out
    </button>
  );
}
