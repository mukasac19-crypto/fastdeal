import type { Vehicle, VehicleRow } from "@/lib/listings";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapVehicleRow } from "@/lib/vehicle-mapper";

const LISTINGS_LIMIT = 60;
const RELATED_LIMIT = 6;

export { mapVehicleRow };

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
    .order("created_at", { ascending: false })
    .limit(LISTINGS_LIMIT);

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

export async function getRelatedVehicles(vehicle: Vehicle): Promise<Vehicle[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "published")
    .neq("id", vehicle.id)
    .or(`make.eq.${vehicle.make},body.eq.${vehicle.body}`)
    .order("featured", { ascending: false })
    .order("quality_score", { ascending: false })
    .limit(RELATED_LIMIT * 2);

  if (error) {
    return [];
  }

  const candidates = ((data ?? []) as VehicleRow[]).map(mapVehicleRow);

  return candidates
    .map((candidate) => {
      const score =
        Number(candidate.make === vehicle.make) * 4 +
        Number(candidate.body === vehicle.body) * 3 +
        Number(candidate.fuel === vehicle.fuel) * 2 +
        Number(candidate.transmission === vehicle.transmission);
      return { vehicle: candidate, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score || b.vehicle.qualityScore - a.vehicle.qualityScore
    )
    .slice(0, RELATED_LIMIT)
    .map(({ vehicle: relatedVehicle }) => relatedVehicle);
}
