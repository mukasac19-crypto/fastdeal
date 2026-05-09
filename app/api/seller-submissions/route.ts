import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const requiredFields = ["seller_name", "phone", "make", "model"];

export async function POST(request: Request) {
  const rawPayload = await request.json();
  const payload = sanitizePayload(rawPayload);
  const customMake = String(payload.make_other ?? "").trim();

  if (payload.make === "__other") {
    payload.make = customMake;
  }

  delete payload.make_other;

  const missing = requiredFields.filter((field) => !String(payload[field] ?? "").trim());

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  if (payload.year !== undefined) {
    const year = Number(payload.year);

    if (!Number.isInteger(year)) {
      return NextResponse.json(
        { error: "Year must be a valid number." },
        { status: 400 }
      );
    }

    payload.year = year;
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured for this environment." },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("seller_submissions")
    .insert(payload)
    .select("id, status, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ submission: data }, { status: 201 });
}

function sanitizePayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).flatMap(([key, value]) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed ? [[key, trimmed]] : [];
      }

      return value === null || value === undefined ? [] : [[key, value]];
    })
  ) as Record<string, string | number | boolean>;
}
