"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  deleteSubmissionAction,
  setSubmissionStatusAction,
} from "@/app/admin/actions";
import type { SubmissionStatus } from "@/types/database";

type Row = {
  id: string;
  kind: string;
  status: string;
  guest_display_name: string | null;
  body: string | null;
  created_at: string;
  memorials: { slug: string; full_name: string } | null;
};

export function ModerationActions({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: SubmissionStatus) {
    setBusy(id);
    const r = await setSubmissionStatusAction(id, status);
    setBusy(null);
    if ("error" in r) {
      alert(r.error);
      return;
    }
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Permanently delete this submission?")) return;
    setBusy(id);
    const r = await deleteSubmissionAction(id);
    setBusy(null);
    if ("error" in r) {
      alert(r.error);
      return;
    }
    router.refresh();
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-foreground/10 bg-accent-soft/20 px-6 py-8 text-center text-muted">
        No submissions in this filter.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {rows.map((s) => (
        <li
          key={s.id}
          className="rounded-2xl border border-foreground/10 bg-background px-6 py-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                {s.memorials?.full_name ?? "Memorial"} · /remember/
                {s.memorials?.slug ?? "—"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {s.kind} · {new Date(s.created_at).toLocaleString()} ·{" "}
                <span className="font-medium text-foreground">{s.status}</span>
              </p>
              <p className="mt-2 text-sm font-medium text-accent">
                {s.guest_display_name?.trim() || "Anonymous"}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {s.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy === s.id}
                onClick={() => void setStatus(s.id, "approved")}
                className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-50"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={busy === s.id}
                onClick={() => void setStatus(s.id, "family_only")}
                className="rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium text-foreground disabled:opacity-50"
              >
                Family only
              </button>
              <button
                type="button"
                disabled={busy === s.id}
                onClick={() => void setStatus(s.id, "rejected")}
                className="rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium text-muted disabled:opacity-50"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={busy === s.id}
                onClick={() => void remove(s.id)}
                className="rounded-full border border-red-900/25 px-4 py-2 text-xs font-medium text-red-900 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
