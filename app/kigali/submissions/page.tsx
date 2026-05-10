"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const STATUSES = [
  "all",
  "new",
  "contacted",
  "qualified",
  "closed",
  "archived"
] as const;

type StatusFilter = (typeof STATUSES)[number];

type Row = {
  id: string;
  status: "new" | "contacted" | "qualified" | "closed" | "archived";
  seller_name: string;
  phone: string;
  email: string | null;
  car_location: string | null;
  make: string;
  model: string;
  year: number | null;
  asking_price: string | null;
  selling_speed: string | null;
  preferred_contact_method: string | null;
  created_at: string;
};

export default function SubmissionsAdmin() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;
    setLoading(true);

    let q = supabase
      .from("seller_submissions")
      .select(
        "id, status, seller_name, phone, email, car_location, make, model, year, asking_price, selling_speed, preferred_contact_method, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (status !== "all") q = q.eq("status", status);

    q.then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        console.error(error);
        setRows([]);
      } else {
        setRows((data ?? []) as Row[]);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Seller submissions</h1>
          <p>Leads from the /sell form.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-chip-row">
          {STATUSES.map((option) => (
            <button
              key={option}
              type="button"
              className={`admin-chip ${status === option ? "is-active" : ""}`}
              onClick={() => setStatus(option)}
            >
              {option === "all" ? "All" : option}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="admin-empty">No submissions match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Vehicle</th>
                <th>Asking price</th>
                <th>Speed</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Submitted</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link
                      className="admin-row-title"
                      href={`/kigali/submissions/${row.id}`}
                    >
                      <strong>{row.seller_name}</strong>
                      <small>{row.phone}</small>
                    </Link>
                  </td>
                  <td>
                    {row.make} {row.model} {row.year ? `(${row.year})` : ""}
                  </td>
                  <td>{row.asking_price ?? "—"}</td>
                  <td>{row.selling_speed ?? "—"}</td>
                  <td>{row.preferred_contact_method ?? "—"}</td>
                  <td>
                    <span className={`admin-status ${row.status}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {new Date(row.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric"
                    })}
                  </td>
                  <td>
                    <Link
                      className="admin-row-action"
                      href={`/kigali/submissions/${row.id}`}
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
