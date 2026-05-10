"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "qualified",
  "closed",
  "archived"
] as const;

type Row = {
  id: string;
  status: (typeof STATUS_OPTIONS)[number];
  name: string;
  contact: string;
  message: string;
  vehicle_id: string | null;
  source: string | null;
  created_at: string;
};

type Params = Promise<{ id: string }>;

export default function LeadDetail({ params }: { params: Params }) {
  const { id } = use(params);
  const [row, setRow] = useState<Row | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError || !data) {
          setError(queryError?.message ?? "Lead not found.");
        } else {
          setRow(data as Row);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function setStatus(next: (typeof STATUS_OPTIONS)[number]) {
    if (!row) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setBusy(true);
    const { error: updateError } = await supabase
      .from("leads")
      .update({ status: next })
      .eq("id", row.id);
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setRow({ ...row, status: next });
    }
  }

  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-empty">{error}</p>
      </div>
    );
  }

  if (!row) {
    return (
      <div className="admin-page">
        <p className="admin-empty">Loading…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <p className="admin-breadcrumb">
            <Link href="/kigali/leads">Leads</Link> / detail
          </p>
          <h1>{row.name}</h1>
          <p>
            Submitted{" "}
            {new Date(row.created_at).toLocaleString(undefined, {
              dateStyle: "long",
              timeStyle: "short"
            })}
          </p>
        </div>
        <div className="admin-status-pickers">
          <span>Status</span>
          <div className="admin-chip-row">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                disabled={busy}
                className={`admin-chip ${row.status === option ? "is-active" : ""}`}
                onClick={() => setStatus(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <dl className="admin-detail-grid">
          <div>
            <dt>Contact</dt>
            <dd>{row.contact}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{row.source ?? "—"}</dd>
          </div>
          <div>
            <dt>Linked vehicle</dt>
            <dd>
              {row.vehicle_id ? (
                <Link href={`/kigali/vehicles/${row.vehicle_id}`}>
                  {row.vehicle_id}
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div className="admin-detail-wide">
            <dt>Message</dt>
            <dd className="admin-detail-prewrap">{row.message}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
