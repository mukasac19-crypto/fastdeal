import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const missing = ["name", "contact", "message"].filter(
    (field) => !String(payload[field] ?? "").trim()
  );

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured for this environment." },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .insert(payload)
    .select("id, status, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ lead: data }, { status: 201 });
}
