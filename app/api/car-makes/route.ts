import { NextResponse } from "next/server";
import { getActiveCarMakes } from "@/lib/car-makes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const makes = await getActiveCarMakes();
    return NextResponse.json({ makes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load car makes";

    if (message.includes("car_makes")) {
      return NextResponse.json({ makes: [], warning: message });
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
