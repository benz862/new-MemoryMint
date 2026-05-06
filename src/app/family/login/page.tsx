import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { FamilyLoginForm } from "@/app/family/login/family-login-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function FamilyLoginPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/family");
  }

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
          Family account
        </p>
        <h1 className="font-display mt-3 text-3xl text-foreground">
          Sign in to your memorials
        </h1>
        <p className="mt-3 text-sm text-muted">
          Use the email and password you set in Supabase (or the one your family
          was invited with). Moderation and memorial settings will live here as
          we expand this hub.
        </p>
        <FamilyLoginForm />
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-muted underline-offset-4 hover:underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
