"use server";

import { z } from "zod";

import { loadPaidCheckoutContext } from "@/lib/checkout-session";
import { MEMORIAL_STYLE_OPTIONS } from "@/lib/memorial-styles";
import { computeHostingExpires } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { slugifyName } from "@/lib/slug";
import { STORAGE_BUCKETS } from "@/lib/storage-buckets";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { MemorialStyle } from "@/types/database";

const styleValues = MEMORIAL_STYLE_OPTIONS.map((o) => o.value) as [
  MemorialStyle,
  ...MemorialStyle[],
];

const formSchema = z.object({
  full_name: z.string().min(2).max(200),
  birth_date: z.string(),
  passing_date: z.string(),
  funeral_date: z.string().optional(),
  funeral_location: z.string().optional(),
  family_contact_email: z.string().email(),
  style: z.enum(styleValues),
  obituary: z.string().min(10).max(20000),
  stripe_session_id: z.string().min(10),
});

export async function createMemorialAction(
  formData: FormData
): Promise<{ ok: true; slug: string } | { error: string }> {
  const parsed = formSchema.safeParse({
    full_name: formData.get("full_name"),
    birth_date: formData.get("birth_date"),
    passing_date: formData.get("passing_date"),
    funeral_date: formData.get("funeral_date") || undefined,
    funeral_location: formData.get("funeral_location") || undefined,
    family_contact_email: formData.get("family_contact_email"),
    style: formData.get("style"),
    obituary: formData.get("obituary"),
    stripe_session_id: formData.get("stripe_session_id"),
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

  const checkout = await loadPaidCheckoutContext(parsed.data.stripe_session_id);
  if (!checkout.ok) {
    return { error: "This checkout link is no longer valid." };
  }

  const admin = createServiceRoleClient();

  const { data: existing } = await admin
    .from("memorials")
    .select("slug")
    .eq("stripe_checkout_session_id", checkout.sessionId)
    .maybeSingle();

  if (existing?.slug) {
    return { ok: true, slug: existing.slug };
  }

  const stripe = getStripe();
  const stripeSession = await stripe.checkout.sessions.retrieve(
    checkout.sessionId,
    { expand: ["subscription", "customer"] }
  );

  if (stripeSession.status !== "complete") {
    return { error: "We could not confirm your payment. Please try again or contact support." };
  }

  const plan = checkout.plan;
  const publishedAt = new Date();

  const subscriptionId =
    stripeSession.mode === "subscription"
      ? typeof stripeSession.subscription === "string"
        ? stripeSession.subscription
        : stripeSession.subscription && typeof stripeSession.subscription === "object" && "id" in stripeSession.subscription
          ? (stripeSession.subscription as { id: string }).id
          : null
      : null;

  const customerRaw = stripeSession.customer;
  const customerId =
    typeof customerRaw === "string"
      ? customerRaw
      : customerRaw &&
          typeof customerRaw === "object" &&
          "id" in customerRaw
        ? (customerRaw as { id: string }).id
        : null;

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
  const slug = await allocateSlug(admin, baseSlug);

  const hostingExpires = computeHostingExpires(plan, publishedAt);

  const { error: insErr } = await admin.from("memorials").insert({
    id: memorialId,
    slug,
    status: "published",
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
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_checkout_session_id: checkout.sessionId,
    accepts_guest_submissions: true,
    published_at: publishedAt.toISOString(),
  });

  if (insErr) {
    await admin.storage.from(STORAGE_BUCKETS.memorialImages).remove([objectPath]);
    return { error: insErr.message };
  }

  return { ok: true, slug };
}

async function allocateSlug(
  admin: ReturnType<typeof createServiceRoleClient>,
  base: string
) {
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
