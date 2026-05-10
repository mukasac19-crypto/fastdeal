"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useSavedVehicles } from "@/components/useSavedVehicles";
import { VehicleCard } from "@/components/VehicleCard";
import type { Vehicle, VehicleRow } from "@/lib/listings";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { mapVehicleRow } from "@/lib/vehicle-mapper";

type SavedRow = {
  vehicle_id: string;
  vehicles: VehicleRow | null;
};

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const { ids, toggle } = useSavedVehicles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        if (!cancelled) {
          setVehicles([]);
          setLoading(false);
        }
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        if (!cancelled) setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("saved_vehicles")
        .select("vehicle_id, vehicles(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Failed to load saved vehicles", error);
        setVehicles([]);
      } else {
        const rows = (data ?? []) as unknown as SavedRow[];
        setVehicles(
          rows
            .filter((row): row is SavedRow & { vehicles: VehicleRow } =>
              Boolean(row.vehicles)
            )
            .map((row) => mapVehicleRow(row.vehicles))
        );
      }
      setLoading(false);
    }

    if (!authLoading) load();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, ids]);

  if (authLoading || loading) {
    return (
      <main>
        <section className="page-hero">
          <div>
            <p className="eyebrow">Saved cars</p>
            <h1>Loading your shortlist...</h1>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <section className="page-hero">
          <div>
            <p className="eyebrow">Saved cars</p>
            <h1>Sign in to view your saved cars.</h1>
            <p>
              Create a FastDeal account to save vehicles, build a shortlist,
              and pick up where you left off on any device.
            </p>
          </div>
          <Link
            className="primary-link"
            href={`/auth/login?redirect=${encodeURIComponent("/saved")}`}
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  if (vehicles.length === 0) {
    return (
      <main>
        <section className="page-hero">
          <div>
            <p className="eyebrow">Saved cars</p>
            <h1>Your shortlist is empty.</h1>
            <p>Tap the heart on any car to save it here.</p>
          </div>
          <Link className="primary-link" href="/buy">
            Browse cars
          </Link>
        </section>
        <section className="empty-state">
          <h2>No saved cars yet</h2>
          <p>Start with the marketplace search and save the cars worth comparing.</p>
          <Link href="/buy">Find cars</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="page-hero">
        <div>
          <p className="eyebrow">Saved cars</p>
          <h1>
            {vehicles.length === 1
              ? "1 saved car"
              : `${vehicles.length} saved cars`}
          </h1>
          <p>Your shortlist, ready when you are.</p>
        </div>
        <Link className="secondary-link" href="/buy">
          Browse more
        </Link>
      </section>
      <section className="inventory-section">
        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              saved
              onSave={() => toggle(vehicle.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
