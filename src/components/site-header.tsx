"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#examples", label: "Memorial examples" },
  { href: "/#about", label: "About us" },
  { href: "/#faq", label: "FAQ" },
] as const;

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
      className="rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand/40"
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

  const initial =
    userEmail && userEmail.length > 0
      ? userEmail.charAt(0).toUpperCase()
      : null;

  return (
    <header className="border-b border-foreground/10 bg-white/95 px-4 py-3 backdrop-blur sm:px-10">
      <div className="mx-auto grid max-w-6xl w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3 md:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Link
          href="/"
          className="col-start-1 row-start-1 flex shrink-0 items-center gap-3"
        >
          <Image
            src="/MemoryMint_Logo.png"
            alt="MemoryMint"
            width={140}
            height={88}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>

        <nav
          aria-label="Primary"
          className="col-span-2 row-start-2 flex w-full min-w-0 justify-start gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:col-span-1 md:col-start-2 md:row-start-1 md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex gap-3 px-0.5 md:gap-5">
            {navLinks.map(({ href, label }) => (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  className="whitespace-nowrap text-xs font-medium text-muted transition hover:text-brand sm:text-sm"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-2 sm:gap-3 md:col-start-3">
          {userEmail ? (
            <>
              <Link
                href="/family"
                className="rounded-full border border-foreground/15 px-3 py-2 text-xs font-medium text-foreground transition hover:border-brand/40 sm:px-4 sm:text-sm"
              >
                Family hub
              </Link>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
                title={userEmail}
              >
                {initial}
              </span>
              <HeaderSignOut />
            </>
          ) : (
            <>
              <Link
                href="/family/login"
                className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-hover sm:text-sm"
              >
                Family sign in
              </Link>
              <Link
                href="/admin/login"
                className="text-xs text-muted underline-offset-4 hover:text-foreground hover:underline sm:text-sm"
              >
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
