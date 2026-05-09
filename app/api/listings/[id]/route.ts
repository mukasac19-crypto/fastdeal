import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getPublishedVehicleById } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured for this environment." },
      { status: 503 }
    );
  }

  try {
    const vehicle = await getPublishedVehicleById(id);

    if (!vehicle) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load listing" },
      { status: 500 }
    );
  }
}
