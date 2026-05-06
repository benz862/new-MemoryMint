import Link from "next/link";

import { MemorialActions } from "@/app/admin/(dashboard)/memorials/memorial-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminMemorialsPage() {
  const supabase = createServerSupabaseClient();
  const { data: rows, error } = await supabase
    .from("memorials")
    .select(
      "id, slug, full_name, status, family_contact_email, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Memorials</h1>
          <p className="mt-2 text-muted">
            Change visibility or archive. Public site only shows{" "}
            <span className="text-foreground">published</span> memorials.
          </p>
        </div>
        <Link
          href="/admin/memorials/new"
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-accent-soft/40 px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-accent/40"
        >
          Create memorial (no payment)
        </Link>
      </div>

      {error ? (
        <p className="mt-8 text-sm text-red-800">{error.message}</p>
      ) : (
        <div className="mt-8">
          <MemorialActions rows={(rows ?? []) as never} />
        </div>
      )}
    </div>
  );
}
