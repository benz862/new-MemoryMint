import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/app/admin/login/login-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.email) {
    const { data: isAdmin } = await supabase.rpc("is_platform_admin");
    if (isAdmin) redirect("/admin");
  }

  const gateError =
    searchParams.error === "forbidden"
      ? "You do not have platform administrator access."
      : null;

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        <Link href="/" className="inline-block">
          <Image
            src="/MemoryMint_Logo.png"
            alt="MemoryMint"
            width={180}
            height={112}
            className="mx-auto h-auto w-full max-w-[180px]"
            priority
          />
        </Link>
        <p className="mt-10 font-display text-sm uppercase tracking-[0.2em] text-muted">
          Platform admin
        </p>
        <h1 className="font-display mt-3 text-3xl text-foreground">Sign in</h1>
        <p className="mt-3 text-sm text-muted">
          Authorized SkillBinder operators only.
        </p>
        {gateError ? (
          <p
            className="mx-auto mt-6 max-w-sm rounded-lg border border-red-900/15 bg-red-50 px-4 py-3 text-sm text-red-950"
            role="alert"
          >
            {gateError}
          </p>
        ) : null}
        <AdminLoginForm />
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-muted underline-offset-4 hover:underline"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
