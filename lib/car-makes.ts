import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEFAULT_CAR_MAKES } from "@/lib/car-options";

export type CarMake = {
  id: string;
  name: string;
};

export async function getActiveCarMakes(): Promise<CarMake[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return DEFAULT_CAR_MAKES.map((name) => ({ id: name, name }));
  }

  const { data, error } = await supabase
    .from("car_makes")
    .select("id, name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    if (error.message.includes("car_makes")) {
      return DEFAULT_CAR_MAKES.map((name) => ({ id: name, name }));
    }

    throw new Error(`Unable to load car makes: ${error.message}`);
  }

  return data?.length ? data : DEFAULT_CAR_MAKES.map((name) => ({ id: name, name }));
}
