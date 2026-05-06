import { notFound } from "next/navigation";

import { GuestMemoryForm } from "@/app/remember/[slug]/guest-memory-form";
import { MemorialPlanRibbon } from "@/components/memorial-plan-ribbon";
import { STORAGE_BUCKETS } from "@/lib/storage-buckets";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "long",
    }).format(new Date(iso + "T12:00:00"));
  } catch {
    return iso;
  }
}

export default async function MemorialPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const supabase = createServerSupabaseClient();

  const { data: memorial, error } = await supabase
    .from("memorials")
    .select(
      "id, full_name, birth_date, passing_date, funeral_date, funeral_location, obituary, main_photo_path, accepts_guest_submissions, hosting_plan"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !memorial) {
    notFound();
  }

  const isSamplePreview = slug.startsWith("sample-memorymint-");

  let heroUrl: string | null = null;
  if (memorial.main_photo_path) {
    const admin = createServiceRoleClient();
    const { data: signed } = await admin.storage
      .from(STORAGE_BUCKETS.memorialImages)
      .createSignedUrl(memorial.main_photo_path, 60 * 60);
    heroUrl = signed?.signedUrl ?? null;
  }

  const { data: memories } = await supabase
    .from("submissions")
    .select("id, guest_display_name, body, created_at")
    .eq("memorial_id", memorial.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <article className="min-h-screen pb-24 pt-12">
      {isSamplePreview ? (
        <div className="px-6 pt-4 sm:px-10">
          <MemorialPlanRibbon
            plan={memorial.hosting_plan}
            preview
          />
        </div>
      ) : null}
      <header className="relative px-6 sm:px-10">
        {heroUrl ? (
          <div className="relative mx-auto aspect-[16/10] max-h-[70vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-foreground/5 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroUrl}
              alt=""
              className="h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>
        ) : null}

        <div className="relative z-[1] mx-auto max-w-3xl pt-10 text-center">
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">
            {memorial.full_name}
          </h1>
          <p className="mt-4 text-lg text-muted">
            {formatDate(memorial.birth_date)}
            {" · "}
            {formatDate(memorial.passing_date)}
          </p>
          {memorial.funeral_date ? (
            <p className="mt-3 text-sm text-muted">
              Service: {formatDate(memorial.funeral_date)}
              {memorial.funeral_location
                ? ` · ${memorial.funeral_location}`
                : null}
            </p>
          ) : memorial.funeral_location ? (
            <p className="mt-3 text-sm text-muted">
              {memorial.funeral_location}
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto mt-14 max-w-2xl px-6 sm:px-10">
        <section className="prose prose-neutral prose-lg max-w-none font-sans text-foreground/95">
          <p className="whitespace-pre-wrap leading-relaxed">
            {memorial.obituary}
          </p>
        </section>

        {memorial.accepts_guest_submissions ? (
          <section className="mt-16 rounded-2xl border border-foreground/10 bg-background/90 px-6 py-10 shadow-sm">
            <h2 className="font-display text-2xl text-foreground">
              Share a memory
            </h2>
            <p className="mt-2 text-sm text-muted">
              Your words go to the family first for kindness and care before
              appearing publicly.
            </p>
            <div className="mt-8">
              <GuestMemoryForm slug={slug} />
            </div>
          </section>
        ) : null}

        <section className="mt-16">
          <h2 className="font-display text-2xl text-foreground">
            Memories shared
          </h2>
          {memories && memories.length > 0 ? (
            <ul className="mt-8 space-y-8">
              {memories.map((m) => (
                <li
                  key={m.id}
                  className="border-b border-foreground/10 pb-8 last:border-0"
                >
                  <p className="text-sm font-medium text-accent">
                    {m.guest_display_name?.trim() || "A guest"}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap leading-relaxed text-muted">
                    {m.body}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">
              When the family approves guest messages, they will appear here.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
