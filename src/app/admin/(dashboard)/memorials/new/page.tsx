import Link from "next/link";

import { AdminMemorialForm } from "@/app/admin/(dashboard)/memorials/new/admin-memorial-form";

export default function AdminNewMemorialPage() {
  return (
    <div>
      <nav className="mb-8 text-sm text-muted">
        <Link href="/admin/memorials" className="hover:text-foreground">
          ← Memorials
        </Link>
      </nav>
      <h1 className="font-display text-3xl text-foreground">
        Create memorial (no payment)
      </h1>
      <p className="mt-2 text-muted">
        For demos, support, or internal pages. Stripe is skipped; choose plan and
        visibility below.
      </p>
      <AdminMemorialForm />
    </div>
  );
}
