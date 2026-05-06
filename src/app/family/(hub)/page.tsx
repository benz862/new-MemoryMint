import Link from "next/link";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function FamilyHubPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: links, error: linkErr } = await supabase
    .from("memorial_admins")
    .select("memorial_id, role")
    .eq("user_id", user.id);

  if (linkErr) {
    return (
      <p className="text-sm text-red-800">
        Could not load memorials: {linkErr.message}
      </p>
    );
  }

  const ids = (links ?? []).map((l) => l.memorial_id);
  if (ids.length === 0) {
    return (
      <div className="rounded-2xl border border-foreground/10 bg-accent-soft/30 px-6 py-10 text-center">
        <p className="text-foreground">
          You are signed in, but no memorials are linked to this account yet.
        </p>
        <p className="mt-3 text-sm text-muted">
          After checkout, your memorial is created under the purchase flow. We
          will connect family accounts to memorials in a future update—for now,
          platform admins can manage everything from Admin.
        </p>
        <Link
          href="/#pricing"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          Create a memorial
        </Link>
      </div>
    );
  }

  const { data: memorials, error: memErr } = await supabase
    .from("memorials")
    .select("id, slug, full_name, status")
    .in("id", ids);

  if (memErr) {
    return (
      <p className="text-sm text-red-800">
        Could not load memorial details: {memErr.message}
      </p>
    );
  }

  const roleByMemorial = new Map(
    (links ?? []).map((l) => [l.memorial_id, l.role])
  );

  const list = (memorials ?? []).map((m) => ({
    ...m,
    role: roleByMemorial.get(m.id) ?? "admin",
  }));

  return (
    <ul className="space-y-4">
      {list.map((m) => (
        <li
          key={m.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-background px-5 py-4"
        >
          <div>
            <p className="font-medium text-foreground">{m.full_name}</p>
            <p className="text-xs text-muted">
              {m.role} · {m.status}
            </p>
          </div>
          <Link
            href={`/remember/${m.slug}`}
            className="rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent/40"
          >
            View memorial
          </Link>
        </li>
      ))}
    </ul>
  );
}
