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

type Row = Record<string, unknown> & {
  id: string;
  status: (typeof STATUS_OPTIONS)[number];
};

type Params = Promise<{ id: string }>;

export default function SubmissionDetail({ params }: { params: Params }) {
  const { id } = use(params);
  const [row, setRow] = useState<Row | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    supabase
      .from("seller_submissions")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError || !data) {
          setError(queryError?.message ?? "Submission not found.");
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
      .from("seller_submissions")
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

  const fields: [string, string][] = [
    ["Seller name", strField(row.seller_name)],
    ["Phone", strField(row.phone)],
    ["Email", strField(row.email)],
    ["Car location", strField(row.car_location)],
    ["Make", strField(row.make)],
    ["Model", strField(row.model)],
    ["Trim", strField(row.trim)],
    ["Year", strField(row.year)],
    ["Body", strField(row.body)],
    ["Asking price", strField(row.asking_price)],
    ["Selling speed", strField(row.selling_speed)],
    ["Mileage", strField(row.mileage)],
    ["Fuel", strField(row.fuel)],
    ["Transmission", strField(row.transmission)],
    ["Engine", strField(row.engine)],
    ["Drivetrain", strField(row.drivetrain)],
    ["Steering", strField(row.steering)],
    ["Exterior color", strField(row.exterior_color)],
    ["Interior color", strField(row.interior_color)],
    ["Condition", strField(row.condition)],
    ["Ownership history", strField(row.ownership_history)],
    ["Service history", strField(row.service_history)],
    ["Registration status", strField(row.registration_status)],
    ["Import status", strField(row.import_status)],
    ["Known issues", strField(row.known_issues)],
    ["Features", strField(row.features)],
    ["Safety features", strField(row.safety_features)],
    ["Documents available", strField(row.documents_available)],
    ["Media link", strField(row.media_link)],
    ["Support level", strField(row.support_level)],
    ["Preferred contact", strField(row.preferred_contact_method)],
    ["Preferred day", strField(row.preferred_day)],
    ["Preferred time", strField(row.preferred_time)],
    ["Inspection address", strField(row.inspection_address)],
    ["Notes", strField(row.notes)]
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <p className="admin-breadcrumb">
            <Link href="/kigali/submissions">Submissions</Link> / detail
          </p>
          <h1>
            {strField(row.seller_name)} — {strField(row.make)}{" "}
            {strField(row.model)}
          </h1>
          <p>
            Submitted{" "}
            {new Date(row.created_at as string).toLocaleString(undefined, {
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
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function strField(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}
