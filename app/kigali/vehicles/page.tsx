"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { currencyFormatter, numberFormatter } from "@/lib/format";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const STATUSES = [
  "all",
  "published",
  "draft",
  "review",
  "sold",
  "archived"
] as const;

type StatusFilter = (typeof STATUSES)[number];

type VehicleRow = {
  id: string;
  make: string;
  model: string;
  trim: string | null;
  year: number;
  price: number;
  mileage: number;
  status: "draft" | "review" | "published" | "sold" | "archived";
  primary_image_url: string | null;
  image_urls: string[] | null;
  featured: boolean | null;
  created_at: string;
  updated_at: string;
};

export default function VehiclesAdmin() {
  return (
    <Suspense fallback={null}>
      <VehiclesInner />
    </Suspense>
  );
}

function VehiclesInner() {
  const searchParams = useSearchParams();
  const statusParam = searchParams?.get("status") ?? "all";
  const initialStatus: StatusFilter = (STATUSES as readonly string[]).includes(
    statusParam
  )
    ? (statusParam as StatusFilter)
    : "all";

  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;
    setLoading(true);

    let q = supabase
      .from("vehicles")
      .select(
        "id, make, model, trim, year, price, mileage, status, primary_image_url, image_urls, featured, created_at, updated_at"
      )
      .order("updated_at", { ascending: false })
      .limit(200);

    if (status !== "all") q = q.eq("status", status);

    q.then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        console.error(error);
        setRows([]);
      } else {
        setRows((data ?? []) as VehicleRow[]);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) =>
      `${row.make} ${row.model} ${row.trim ?? ""} ${row.year}`
        .toLowerCase()
        .includes(needle)
    );
  }, [rows, query]);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Vehicles</h1>
          <p>{filtered.length} listings</p>
        </div>
        <Link className="primary-link" href="/kigali/vehicles/new">
          + New vehicle
        </Link>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search by make, model, trim, year…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
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
        ) : filtered.length === 0 ? (
          <p className="admin-empty">No vehicles match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Price</th>
                <th>Mileage</th>
                <th>Photos</th>
                <th>Updated</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const photos = row.image_urls?.length ?? 0;
                return (
                  <tr key={row.id}>
                    <td>
                      <Link
                        className="admin-row-title"
                        href={`/kigali/vehicles/${row.id}`}
                      >
                        <strong>
                          {row.year} {row.make} {row.model}
                        </strong>
                        {row.trim ? <small>{row.trim}</small> : null}
                      </Link>
                    </td>
                    <td>
                      <span className={`admin-status ${row.status}`}>
                        {row.status}
                      </span>
                      {row.featured ? (
                        <span className="admin-status featured">featured</span>
                      ) : null}
                    </td>
                    <td>{currencyFormatter.format(row.price)}</td>
                    <td>{numberFormatter.format(row.mileage)} km</td>
                    <td>{photos === 0 ? "—" : photos}</td>
                    <td>
                      {new Date(row.updated_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td>
                      <Link
                        className="admin-row-action"
                        href={`/kigali/vehicles/${row.id}`}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
