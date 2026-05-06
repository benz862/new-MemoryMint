import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { MemorialForm } from "@/app/create-memorial/memorial-form";
import { loadPaidCheckoutContext } from "@/lib/checkout-session";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

function GateMessage({ reason }: { reason: string }) {
  const copy: Record<string, string> = {
    missing_session:
      "Start from the pricing section so we can confirm your MemoryMint plan.",
    not_complete: "Checkout isn’t complete yet. Try again from pricing.",
    invalid_plan: "We couldn’t read your plan from checkout.",
    retrieve_failed:
      "We couldn’t verify payment. Use the link from your receipt or start checkout again.",
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-20">
      <div className="mb-10 flex justify-center">
        <Image
          src="/MemoryMint_Logo.png"
          alt="MemoryMint"
          width={200}
          height={125}
          className="h-auto w-full max-w-[200px]"
          priority
        />
      </div>
      <p className="font-display text-sm uppercase tracking-[0.2em] text-muted">
        Almost there
      </p>
      <h1 className="font-display mt-4 text-3xl text-foreground sm:text-4xl">
        Complete checkout first
      </h1>
      <p className="mt-4 leading-relaxed text-muted">
        {copy[reason] ?? copy.missing_session}
      </p>
      <Link
        href="/#pricing"
        className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition hover:opacity-90"
      >
        View plans
      </Link>
      <Link
        href="/"
        className="mt-4 text-center text-sm text-muted underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}

export default async function CreateMemorialPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const ctx = await loadPaidCheckoutContext(searchParams.session_id);

  if (!ctx.ok) {
    return <GateMessage reason={ctx.reason} />;
  }

  const admin = createServiceRoleClient();
  const { data: existing } = await admin
    .from("memorials")
    .select("slug")
    .eq("stripe_checkout_session_id", ctx.sessionId)
    .maybeSingle();

  if (existing?.slug) {
    redirect(`/remember/${existing.slug}`);
  }

  return (
    <div className="min-h-screen px-6 pb-12 pt-12 sm:px-10">
      <div className="mx-auto mb-12 flex max-w-lg flex-col items-center text-center">
        <Image
          src="/MemoryMint_Logo.png"
          alt="MemoryMint"
          width={220}
          height={138}
          className="mb-10 h-auto w-full max-w-[220px]"
          priority
        />
        <p className="font-display text-sm uppercase tracking-[0.2em] text-muted">
          Create memorial
        </p>
        <h1 className="font-display mt-4 text-3xl text-foreground sm:text-4xl">
          Tell us about them
        </h1>
        <p className="mt-4 max-w-md text-muted">
          Take your time. There’s no dashboard—just this gentle form. Your
          memorial will be ready to share when you finish.
        </p>
      </div>

      <MemorialForm
        sessionId={ctx.sessionId}
        plan={ctx.plan}
        defaultEmail={ctx.customerEmail}
      />
    </div>
  );
}
