"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { SubmissionStatus } from "@/types/database";

export async function assertPlatformAdmin(): Promise<{
  supabase: ReturnType<typeof createServerSupabaseClient>;
  userId: string;
}> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !user.id) {
    throw new Error("Unauthorized");
  }
  const { data, error } = await supabase.rpc("is_platform_admin");
  if (error || !data) {
    throw new Error("Forbidden");
  }
  return { supabase, userId: user.id };
}

export async function setSubmissionStatusAction(
  submissionId: string,
  status: SubmissionStatus
): Promise<{ ok: true } | { error: string }> {
  if (!["approved", "rejected", "family_only", "pending"].includes(status)) {
    return { error: "Invalid status" };
  }
  try {
    const { supabase, userId } = await assertPlatformAdmin();
    const { error } = await supabase
      .from("submissions")
      .update({
        status,
        moderated_at: new Date().toISOString(),
        moderated_by: userId,
      })
      .eq("id", submissionId);

    if (error) return { error: error.message };
    revalidatePath("/admin/moderation");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteSubmissionAction(
  submissionId: string
): Promise<{ ok: true } | { error: string }> {
  try {
    const { supabase } = await assertPlatformAdmin();
    const { error } = await supabase
      .from("submissions")
      .delete()
      .eq("id", submissionId);
    if (error) return { error: error.message };
    revalidatePath("/admin/moderation");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function setMemorialPublishedAction(
  memorialId: string,
  status: "draft" | "published" | "archived"
): Promise<{ ok: true } | { error: string }> {
  try {
    const { supabase } = await assertPlatformAdmin();
    const payload =
      status === "published"
        ? { status, published_at: new Date().toISOString() as string }
        : { status };
    const { error } = await supabase
      .from("memorials")
      .update(payload)
      .eq("id", memorialId);
    if (error) return { error: error.message };
    revalidatePath("/admin/memorials");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed" };
  }
}
