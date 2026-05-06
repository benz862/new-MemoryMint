import Link from "next/link";

import { ModerationActions } from "@/app/admin/(dashboard)/moderation/moderation-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Tab = "pending" | "all";

export default async function AdminModerationPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = (searchParams.tab === "all" ? "all" : "pending") as Tab;
  const supabase = createServerSupabaseClient();

  let q = supabase
    .from("submissions")
    .select(
      "id, kind, status, guest_display_name, body, created_at, memorials ( slug, full_name )"
    )
    .order("created_at", { ascending: false });

  if (tab === "pending") {
    q = q.eq("status", "pending");
  }

  const { data: rows, error } = await q;

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Moderation</h1>
      <p className="mt-2 text-muted">
        Guest submissions stay hidden on the public memorial until approved.
      </p>

      <div className="mt-8 flex gap-4 text-sm">
        <Link
          href="/admin/moderation"
          className={
            tab === "pending"
              ? "font-medium text-foreground underline underline-offset-4"
              : "text-muted hover:text-foreground"
          }
        >
          Pending
        </Link>
        <Link
          href="/admin/moderation?tab=all"
          className={
            tab === "all"
              ? "font-medium text-foreground underline underline-offset-4"
              : "text-muted hover:text-foreground"
          }
        >
          All
        </Link>
      </div>

      {error ? (
        <p className="mt-8 text-sm text-red-800">{error.message}</p>
      ) : (
        <div className="mt-8">
          <ModerationActions rows={(rows ?? []) as never} />
        </div>
      )}
    </div>
  );
}
