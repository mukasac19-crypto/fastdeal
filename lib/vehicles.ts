import type { Vehicle, VehicleRow } from "@/lib/listings";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const emptyInspection: Vehicle["inspection"] = {
  mechanical: "Pending FastDeal review.",
  exterior: "Pending FastDeal review.",
  interior: "Pending FastDeal review.",
  tyresAndBrakes: "Pending FastDeal review.",
  documents: "Pending FastDeal review.",
  notes: "FastDeal will update this section after verification."
};

export function mapVehicleRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    trim: row.trim ?? "Not specified",
    year: row.year,
    price: row.price,
    mileage: row.mileage,
    transmission: row.transmission,
    fuel: row.fuel,
    body: row.body,
    location: row.location,
    listedBy: row.listed_by ?? "FastDeal Rwanda",
    qualityScore: row.quality_score ?? 0,
    image: row.primary_image_url ?? "/placeholder-car.svg",
    tags: row.tags ?? [],
    inspected: row.inspected ?? false,
    featured: row.featured ?? false,
    priceSignal: row.price_signal ?? "New arrival",
    exteriorColor: row.exterior_color ?? "Not specified",
    interiorColor: row.interior_color ?? "Not specified",
    engine: row.engine ?? "Not specified",
    drivetrain: row.drivetrain ?? "FWD",
    doors: row.doors ?? 4,
    seats: row.seats ?? 5,
    steering: row.steering ?? "Left-hand drive",
    condition: row.condition ?? "Good",
    availability: row.availability ?? "Available now",
    registrationStatus: row.registration_status ?? "Not specified",
    importStatus: row.import_status ?? "Not specified",
    ownershipHistory: row.ownership_history ?? "Not specified",
    serviceHistory: row.service_history ?? "Not specified",
    documents: row.documents ?? [],
    equipment: row.equipment ?? [],
    safety: row.safety ?? [],
    inspection: {
      ...emptyInspection,
      ...(row.inspection ?? {})
    }
  };
}

export async function getPublishedVehicles() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load vehicles: ${error.message}`);
  }

  return ((data ?? []) as VehicleRow[]).map(mapVehicleRow);
}

export async function getPublishedVehicleById(id: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load vehicle: ${error.message}`);
  }

  return data ? mapVehicleRow(data as VehicleRow) : null;
}
