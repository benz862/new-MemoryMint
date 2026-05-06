"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

function HeaderSignOut() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createBrowserSupabaseClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent/40"
    >
      Sign out
    </button>
  );
}

type Props = {
  userEmail: string | null;
};

export function SiteHeader({ userEmail }: Props) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="border-b border-foreground/10 bg-background/90 px-6 py-4 backdrop-blur sm:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/MemoryMint_Logo.png"
            alt="MemoryMint"
            width={140}
            height={88}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        <nav
          className="flex flex-wrap items-center justify-end gap-3 text-sm sm:gap-4"
          aria-label="Account"
        >
          {userEmail ? (
            <>
              <Link
                href="/family"
                className="rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent/40"
              >
                Family hub
              </Link>
              <span
                className="hidden max-w-[160px] truncate text-xs text-muted sm:inline"
                title={userEmail}
              >
                {userEmail}
              </span>
              <HeaderSignOut />
            </>
          ) : (
            <>
              <Link
                href="/family/login"
                className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition hover:opacity-90"
              >
                Family sign in
              </Link>
              <Link
                href="/admin/login"
                className="text-muted underline-offset-4 hover:text-foreground hover:underline"
              >
                Admin
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
