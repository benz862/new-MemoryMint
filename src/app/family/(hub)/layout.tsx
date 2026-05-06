import Link from "next/link";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function FamilyHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/family/login");
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-foreground">Your memorials</h1>
          <Link
            href="/"
            className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
          >
            ← Home
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
