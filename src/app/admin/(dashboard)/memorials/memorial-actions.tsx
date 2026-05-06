"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { setMemorialPublishedAction } from "@/app/admin/actions";
import type { MemorialStatus } from "@/types/database";

type Row = {
  id: string;
  slug: string;
  full_name: string;
  status: MemorialStatus;
  family_contact_email: string;
  created_at: string;
};

export function MemorialActions({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: MemorialStatus) {
    setBusy(id);
    const r = await setMemorialPublishedAction(id, status);
    setBusy(null);
    if ("error" in r) {
      alert(r.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-foreground/10">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-foreground/10 bg-accent-soft/40 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Memorial</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id} className="border-b border-foreground/5 last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">
                {m.full_name}
              </td>
              <td className="px-4 py-3">
                <a
                  href={`/remember/${m.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline-offset-2 hover:underline"
                >
                  {m.slug}
                </a>
              </td>
              <td className="px-4 py-3 text-muted">{m.status}</td>
              <td className="px-4 py-3 text-muted">{m.family_contact_email}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy === m.id}
                    onClick={() => void setStatus(m.id, "published")}
                    className="rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-50"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    disabled={busy === m.id}
                    onClick={() => void setStatus(m.id, "draft")}
                    className="rounded-full border border-foreground/20 px-3 py-1.5 text-xs text-foreground disabled:opacity-50"
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    disabled={busy === m.id}
                    onClick={() => void setStatus(m.id, "archived")}
                    className="rounded-full border border-foreground/20 px-3 py-1.5 text-xs text-muted disabled:opacity-50"
                  >
                    Archive
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
