"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Counts = {
  vehiclesPublished: number;
  vehiclesDraft: number;
  vehiclesSold: number;
  submissionsNew: number;
  submissionsTotal: number;
  leadsNew: number;
  leadsTotal: number;
  makesActive: number;
};

type RecentActivity = {
  id: string;
  kind: "submission" | "lead";
  title: string;
  subtitle: string;
  createdAt: string;
  href: string;
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    async function load() {
      const head = { count: "exact" as const, head: true };

      const [vPublished, vDraft, vSold, sNew, sTotal, lNew, lTotal, makesActive] =
        await Promise.all([
          supabase!.from("vehicles").select("*", head).eq("status", "published"),
          supabase!.from("vehicles").select("*", head).eq("status", "draft"),
          supabase!.from("vehicles").select("*", head).eq("status", "sold"),
          supabase!.from("seller_submissions").select("*", head).eq("status", "new"),
          supabase!.from("seller_submissions").select("*", head),
          supabase!.from("leads").select("*", head).eq("status", "new"),
          supabase!.from("leads").select("*", head),
          supabase!.from("car_makes").select("*", head).eq("is_active", true)
        ]);

      if (cancelled) return;

      setCounts({
        vehiclesPublished: vPublished.count ?? 0,
        vehiclesDraft: vDraft.count ?? 0,
        vehiclesSold: vSold.count ?? 0,
        submissionsNew: sNew.count ?? 0,
        submissionsTotal: sTotal.count ?? 0,
        leadsNew: lNew.count ?? 0,
        leadsTotal: lTotal.count ?? 0,
        makesActive: makesActive.count ?? 0
      });

      const [submissions, leads] = await Promise.all([
        supabase!
          .from("seller_submissions")
          .select("id, seller_name, make, model, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase!
          .from("leads")
          .select("id, name, message, created_at")
          .order("created_at", { ascending: false })
          .limit(5)
      ]);

      if (cancelled) return;

      const items: RecentActivity[] = [];

      for (const row of submissions.data ?? []) {
        items.push({
          id: row.id,
          kind: "submission",
          title: `${row.seller_name} — ${row.make} ${row.model}`,
          subtitle: "Seller submission",
          createdAt: row.created_at,
          href: `/kigali/submissions/${row.id}`
        });
      }

      for (const row of leads.data ?? []) {
        items.push({
          id: row.id,
          kind: "lead",
          title: row.name,
          subtitle:
            (row.message ?? "").slice(0, 80) +
            ((row.message ?? "").length > 80 ? "…" : ""),
          createdAt: row.created_at,
          href: `/kigali/leads/${row.id}`
        });
      }

      items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setActivity(items.slice(0, 8));
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>An overview of inventory, leads, and operations.</p>
        </div>
        <Link className="primary-link" href="/kigali/vehicles/new">
          + New vehicle
        </Link>
      </div>

      <div className="admin-stats">
        <StatCard
          label="Published vehicles"
          value={counts?.vehiclesPublished}
          accent="brand"
          href="/kigali/vehicles?status=published"
          loading={loading}
        />
        <StatCard
          label="Drafts"
          value={counts?.vehiclesDraft}
          accent="muted"
          href="/kigali/vehicles?status=draft"
          loading={loading}
        />
        <StatCard
          label="Sold"
          value={counts?.vehiclesSold}
          accent="muted"
          href="/kigali/vehicles?status=sold"
          loading={loading}
        />
        <StatCard
          label="New seller leads"
          value={counts?.submissionsNew}
          subValue={`${counts?.submissionsTotal ?? 0} total`}
          accent="yellow"
          href="/kigali/submissions"
          loading={loading}
        />
        <StatCard
          label="New buyer leads"
          value={counts?.leadsNew}
          subValue={`${counts?.leadsTotal ?? 0} total`}
          accent="yellow"
          href="/kigali/leads"
          loading={loading}
        />
        <StatCard
          label="Active makes"
          value={counts?.makesActive}
          accent="muted"
          href="/kigali/makes"
          loading={loading}
        />
      </div>

      <section className="admin-card">
        <header className="admin-card-head">
          <h2>Recent activity</h2>
          <small>Latest seller submissions and buyer leads</small>
        </header>
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : activity.length === 0 ? (
          <p className="admin-empty">Nothing new yet.</p>
        ) : (
          <ul className="admin-activity">
            {activity.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <Link href={item.href}>
                  <span className={`admin-pill ${item.kind}`}>
                    {item.kind === "submission" ? "Seller" : "Buyer"}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </div>
                  <time>
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric"
                    })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  subValue,
  accent,
  href,
  loading
}: {
  label: string;
  value: number | undefined;
  subValue?: string;
  accent: "brand" | "yellow" | "muted";
  href: string;
  loading: boolean;
}) {
  return (
    <Link className={`admin-stat ${accent}`} href={href}>
      <span>{label}</span>
      <strong>{loading ? "…" : (value ?? 0)}</strong>
      {subValue ? <small>{subValue}</small> : null}
    </Link>
  );
}
