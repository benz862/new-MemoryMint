"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function submitGuestMemory(
  slug: string,
  guestName: string,
  message: string
): Promise<{ ok: true } | { error: string }> {
  const messageTrim = message.trim();
  if (messageTrim.length < 3) {
    return { error: "Please share a few more words." };
  }
  if (messageTrim.length > 8000) {
    return { error: "That message is a little too long." };
  }

  const supabase = createServerSupabaseClient();
  const { data: mem, error: memErr } = await supabase
    .from("memorials")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (memErr || !mem) {
    return { error: "This memorial could not be found." };
  }

  const { error } = await supabase.from("submissions").insert({
    memorial_id: mem.id,
    kind: "message",
    guest_display_name: guestName.trim() || null,
    body: messageTrim,
  });

  if (error) {
    return { error: "We couldn’t save your memory. Please try again." };
  }

  return { ok: true };
}
