"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertPlatformAdmin } from "@/app/admin/actions";
import { allocateMemorialSlug } from "@/lib/allocate-memorial-slug";
import { MEMORIAL_STYLE_OPTIONS } from "@/lib/memorial-styles";
import { computeHostingExpires, HOSTING_PLANS } from "@/lib/plans";
import { slugifyName } from "@/lib/slug";
import { STORAGE_BUCKETS } from "@/lib/storage-buckets";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { HostingPlan, MemorialStyle } from "@/types/database";

const styleValues = MEMORIAL_STYLE_OPTIONS.map((o) => o.value) as [
  MemorialStyle,
  ...MemorialStyle[],
];

const hostingPlanValues = HOSTING_PLANS as [HostingPlan, ...HostingPlan[]];

const formSchema = z.object({
  full_name: z.string().min(2).max(200),
  birth_date: z.string(),
  passing_date: z.string(),
  funeral_date: z.string().optional(),
  funeral_location: z.string().optional(),
  family_contact_email: z.string().email(),
  style: z.enum(styleValues),
  obituary: z.string().min(10).max(20000),
  hosting_plan: z.enum(hostingPlanValues),
  initial_status: z.enum(["draft", "published"]),
});

export async function createMemorialAsAdminAction(
  formData: FormData
): Promise<{ ok: true; slug: string } | { error: string }> {
  let userId: string;
  try {
    ({ userId } = await assertPlatformAdmin());
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Forbidden" };
  }

  const parsed = formSchema.safeParse({
    full_name: formData.get("full_name"),
    birth_date: formData.get("birth_date"),
    passing_date: formData.get("passing_date"),
    funeral_date: formData.get("funeral_date") || undefined,
    funeral_location: formData.get("funeral_location") || undefined,
    family_contact_email: formData.get("family_contact_email"),
    style: formData.get("style"),
    obituary: formData.get("obituary"),
    hosting_plan: formData.get("hosting_plan"),
    initial_status: formData.get("initial_status"),
  });

  if (!parsed.success) {
    return { error: "Please review the highlighted fields and try again." };
  }

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return { error: "Please upload a main photo." };
  }
  if (photo.size > 10 * 1024 * 1024) {
    return { error: "Photo must be 10MB or smaller." };
  }
  if (!/^image\/(jpeg|png|webp)$/.test(photo.type)) {
    return { error: "Photo must be JPG, PNG, or WebP." };
  }

  const admin = createServiceRoleClient();
  const plan = parsed.data.hosting_plan;
  const isPublished = parsed.data.initial_status === "published";
  const publishedAt = isPublished ? new Date() : null;

  const memorialId = crypto.randomUUID();
  const ext =
    photo.type === "image/png"
      ? "png"
      : photo.type === "image/webp"
        ? "webp"
        : "jpg";
  const objectPath = `${memorialId}/hero.${ext}`;

  const bytes = await photo.arrayBuffer();
  const { error: upErr } = await admin.storage
    .from(STORAGE_BUCKETS.memorialImages)
    .upload(objectPath, bytes, {
      contentType: photo.type,
      upsert: false,
    });

  if (upErr) {
    return { error: "We could not upload the photo. Please try again." };
  }

  const baseSlug = slugifyName(parsed.data.full_name);
  const slug = await allocateMemorialSlug(baseSlug);

  const hostingExpires = publishedAt
    ? computeHostingExpires(plan, publishedAt)
    : null;

  const { error: insErr } = await admin.from("memorials").insert({
    id: memorialId,
    slug,
    status: isPublished ? "published" : "draft",
    full_name: parsed.data.full_name,
    birth_date: parsed.data.birth_date,
    passing_date: parsed.data.passing_date,
    funeral_date: parsed.data.funeral_date || null,
    funeral_location: parsed.data.funeral_location || null,
    family_contact_email: parsed.data.family_contact_email,
    style: parsed.data.style,
    main_photo_path: objectPath,
    obituary: parsed.data.obituary,
    hosting_plan: plan,
    hosting_expires_at: hostingExpires?.toISOString() ?? null,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    stripe_checkout_session_id: null,
    accepts_guest_submissions: true,
    created_by: userId,
    published_at: publishedAt?.toISOString() ?? null,
  });

  if (insErr) {
    await admin.storage.from(STORAGE_BUCKETS.memorialImages).remove([objectPath]);
    return { error: insErr.message };
  }

  revalidatePath("/admin/memorials");
  revalidatePath("/admin");

  return { ok: true, slug };
}
