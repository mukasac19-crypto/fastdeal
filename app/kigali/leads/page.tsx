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
  name: string;
  contact: string;
  message: string;
  vehicle_id: string | null;
  source: string | null;
  created_at: string;
};

export default function LeadsAdmin() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;
    setLoading(true);

    let q = supabase
      .from("leads")
      .select(
        "id, status, name, contact, message, vehicle_id, source, created_at"
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
          <h1>Buyer leads</h1>
          <p>Messages from the /contact form and car detail enquiries.</p>
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
          <p className="admin-empty">No leads match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Message</th>
                <th>Vehicle</th>
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
                      href={`/kigali/leads/${row.id}`}
                    >
                      <strong>{row.name}</strong>
                    </Link>
                  </td>
                  <td>{row.contact}</td>
                  <td className="admin-clip">{row.message}</td>
                  <td>
                    {row.vehicle_id ? (
                      <Link
                        href={`/kigali/vehicles/${row.vehicle_id}`}
                        className="admin-row-action"
                      >
                        Linked
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
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
                      href={`/kigali/leads/${row.id}`}
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
