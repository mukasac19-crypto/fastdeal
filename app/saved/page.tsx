"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useSavedVehicles } from "@/components/useSavedVehicles";
import { VehicleCard } from "@/components/VehicleCard";
import type { Vehicle } from "@/lib/listings";

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const { ids, toggle, loading: savesLoading } = useSavedVehicles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/listings", { cache: "no-store" });
        const result = await response.json();
        if (!cancelled && response.ok) {
          setVehicles(result.vehicles ?? []);
        }
      } catch {
        if (!cancelled) setVehicles([]);
      } finally {
        if (!cancelled) setVehiclesLoading(false);
      }
    }

    if (user) {
      load();
    } else {
      setVehiclesLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [user]);

  const savedVehicles = useMemo(
    () => vehicles.filter((vehicle) => ids.has(vehicle.id)),
    [vehicles, ids]
  );

  if (authLoading) {
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

  if (savesLoading || vehiclesLoading) {
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

  if (savedVehicles.length === 0) {
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
            {savedVehicles.length === 1
              ? "1 saved car"
              : `${savedVehicles.length} saved cars`}
          </h1>
          <p>Your shortlist, ready when you are.</p>
        </div>
        <Link className="secondary-link" href="/buy">
          Browse more
        </Link>
      </section>
      <section className="inventory-section">
        <div className="vehicle-grid">
          {savedVehicles.map((vehicle) => (
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
