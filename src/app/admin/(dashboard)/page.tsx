import Link from "next/link";

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
