import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getPublishedVehicles } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured for this environment." },
      { status: 503 }
    );
  }

  try {
    const vehicles = await getPublishedVehicles();
    return NextResponse.json({ vehicles });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load listings" },
      { status: 500 }
    );
  }
}
