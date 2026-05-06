import { createServiceRoleClient } from "@/lib/supabase/service-role";

/** Returns a unique slug from a base string (e.g. slugified full name). */
export async function allocateMemorialSlug(base: string): Promise<string> {
  const admin = createServiceRoleClient();
  let candidate = base;
  let n = 2;
  for (;;) {
    const { data } = await admin
      .from("memorials")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}
