import Link from "next/link";

import { TierPreviewButtons } from "@/components/admin/tier-preview-buttons";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = createServerSupabaseClient();

  const { count: memorialCount } = await supabase
    .from("memorials")
    .select("*", { count: "exact", head: true });

  const { count: pendingCount } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Overview</h1>
      <p className="mt-2 text-muted">
        Platform-wide control for memorials and guest submissions.
      </p>

      <section className="mt-14 rounded-2xl border border-foreground/10 bg-accent-soft/20 p-8">
        <h2 className="font-display text-xl text-foreground">
          Preview client memorial (by tier)
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          You are already signed in as platform admin. Use the buttons below to
          open the public memorial experience for each plan in a new tab—no
          separate passwords or family accounts required. Apply the sample-data
          migration in Supabase if these links show “not found.”
        </p>
        <div className="mt-8">
          <TierPreviewButtons />
        </div>
      </section>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/memorials"
          className="rounded-2xl border border-foreground/10 bg-accent-soft/30 p-8 transition hover:border-accent/30"
        >
          <p className="font-display text-4xl tabular-nums text-foreground">
            {memorialCount ?? "—"}
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">Memorials</p>
          <p className="mt-1 text-xs text-muted">View, publish, or archive</p>
        </Link>
        <Link
          href="/admin/moderation"
          className="rounded-2xl border border-foreground/10 bg-accent-soft/30 p-8 transition hover:border-accent/30"
        >
          <p className="font-display text-4xl tabular-nums text-foreground">
            {pendingCount ?? "—"}
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            Pending submissions
          </p>
          <p className="mt-1 text-xs text-muted">Approve, reject, or family-only</p>
        </Link>
      </div>
    </div>
  );
}
