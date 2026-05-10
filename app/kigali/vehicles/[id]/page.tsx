"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  emptyVehicle,
  VehicleForm,
  type VehicleFormState
} from "@/components/admin/VehicleForm";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Params = Promise<{ id: string }>;

export default function EditVehiclePage({ params }: { params: Params }) {
  const { id } = use(params);
  const [initial, setInitial] = useState<VehicleFormState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError || !data) {
          setError(queryError?.message ?? "Vehicle not found.");
          return;
        }
        setInitial(rowToFormState(data));
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-empty">{error}</p>
      </div>
    );
  }

  if (!initial) {
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
            <Link href="/kigali/vehicles">Vehicles</Link> / edit
          </p>
          <h1>
            {initial.year} {initial.make} {initial.model}
          </h1>
        </div>
        <Link className="secondary-link" href={`/cars/${id}`} target="_blank">
          View on site ↗
        </Link>
      </div>
      <VehicleForm initial={initial} />
    </div>
  );
}

function rowToFormState(row: Record<string, unknown>): VehicleFormState {
  const inspection =
    (row.inspection as Record<string, string> | null) ?? {};
  const toString = (value: unknown) =>
    value === null || value === undefined ? "" : String(value);
  const toList = (value: unknown) =>
    Array.isArray(value) ? value.join(", ") : "";

  return {
    ...emptyVehicle,
    id: String(row.id ?? null),
    status: (row.status as VehicleFormState["status"]) ?? "draft",
    make: toString(row.make),
    model: toString(row.model),
    trim: toString(row.trim),
    year: toString(row.year),
    price: toString(row.price),
    mileage: toString(row.mileage),
    transmission:
      (row.transmission as VehicleFormState["transmission"]) ?? "Automatic",
    fuel: toString(row.fuel) || "Petrol",
    body: toString(row.body) || "SUV",
    location: toString(row.location),
    listed_by: toString(row.listed_by),
    quality_score: toString(row.quality_score),
    primary_image_url: toString(row.primary_image_url),
    image_urls: Array.isArray(row.image_urls)
      ? (row.image_urls as string[])
      : [],
    tags: toList(row.tags),
    inspected: Boolean(row.inspected),
    featured: Boolean(row.featured),
    price_signal:
      (row.price_signal as VehicleFormState["price_signal"]) ?? "New arrival",
    exterior_color: toString(row.exterior_color),
    interior_color: toString(row.interior_color),
    engine: toString(row.engine),
    drivetrain:
      (row.drivetrain as VehicleFormState["drivetrain"]) ?? "FWD",
    doors: toString(row.doors),
    seats: toString(row.seats),
    steering: (row.steering as VehicleFormState["steering"]) ?? "Left-hand drive",
    condition: (row.condition as VehicleFormState["condition"]) ?? "Good",
    availability:
      (row.availability as VehicleFormState["availability"]) ?? "Available now",
    registration_status: toString(row.registration_status),
    import_status: toString(row.import_status),
    ownership_history: toString(row.ownership_history),
    service_history: toString(row.service_history),
    documents: toList(row.documents),
    equipment: toList(row.equipment),
    safety: toList(row.safety),
    inspection_mechanical: inspection.mechanical ?? "",
    inspection_exterior: inspection.exterior ?? "",
    inspection_interior: inspection.interior ?? "",
    inspection_tyres_and_brakes: inspection.tyresAndBrakes ?? "",
    inspection_documents: inspection.documents ?? "",
    inspection_notes: inspection.notes ?? ""
  };
}
