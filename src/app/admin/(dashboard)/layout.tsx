import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminSignOutButton } from "@/app/admin/sign-out-button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error } = await supabase.rpc("is_platform_admin");
  if (error || !isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/10 px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/MemoryMint_Logo.png"
                alt="MemoryMint"
                width={120}
                height={75}
                className="h-10 w-auto"
              />
              <span className="font-display text-lg text-foreground">Admin</span>
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm text-muted">
              <Link
                href="/admin"
                className="hover:text-foreground hover:underline hover:underline-offset-4"
              >
                Overview
              </Link>
              <Link
                href="/admin/moderation"
                className="hover:text-foreground hover:underline hover:underline-offset-4"
              >
                Moderation
              </Link>
              <Link
                href="/admin/memorials"
                className="hover:text-foreground hover:underline hover:underline-offset-4"
              >
                Memorials
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="max-w-[220px] truncate" title={user.email ?? ""}>
              {user.email}
            </span>
            <AdminSignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">{children}</main>
    </div>
  );
}
