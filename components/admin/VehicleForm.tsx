"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { BODY_OPTIONS, FUEL_OPTIONS } from "@/lib/car-options";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const STATUSES = ["draft", "review", "published", "sold", "archived"] as const;
const PRICE_SIGNALS = ["Great price", "Fair price", "New arrival"] as const;
const TRANSMISSIONS = ["Automatic", "Manual"] as const;
const DRIVETRAINS = ["FWD", "RWD", "AWD", "4x4"] as const;
const STEERINGS = ["Left-hand drive", "Right-hand drive"] as const;
const CONDITIONS = ["Excellent", "Very good", "Good"] as const;
const AVAILABILITIES = [
  "Available now",
  "Inspection complete",
  "Viewing by appointment"
] as const;

export type VehicleFormState = {
  id: string | null;
  status: (typeof STATUSES)[number];
  make: string;
  model: string;
  trim: string;
  year: string;
  price: string;
  mileage: string;
  transmission: (typeof TRANSMISSIONS)[number];
  fuel: string;
  body: string;
  location: string;
  listed_by: string;
  quality_score: string;
  primary_image_url: string;
  image_urls: string[];
  tags: string;
  inspected: boolean;
  featured: boolean;
  price_signal: (typeof PRICE_SIGNALS)[number];
  exterior_color: string;
  interior_color: string;
  engine: string;
  drivetrain: (typeof DRIVETRAINS)[number];
  doors: string;
  seats: string;
  steering: (typeof STEERINGS)[number];
  condition: (typeof CONDITIONS)[number];
  availability: (typeof AVAILABILITIES)[number];
  registration_status: string;
  import_status: string;
  ownership_history: string;
  service_history: string;
  documents: string;
  equipment: string;
  safety: string;
  inspection_mechanical: string;
  inspection_exterior: string;
  inspection_interior: string;
  inspection_tyres_and_brakes: string;
  inspection_documents: string;
  inspection_notes: string;
};

export const emptyVehicle: VehicleFormState = {
  id: null,
  status: "draft",
  make: "",
  model: "",
  trim: "",
  year: String(new Date().getFullYear()),
  price: "",
  mileage: "",
  transmission: "Automatic",
  fuel: "Petrol",
  body: "SUV",
  location: "Kigali, Rwanda",
  listed_by: "FastDeal Rwanda",
  quality_score: "8.5",
  primary_image_url: "",
  image_urls: [],
  tags: "",
  inspected: false,
  featured: false,
  price_signal: "New arrival",
  exterior_color: "",
  interior_color: "",
  engine: "",
  drivetrain: "FWD",
  doors: "4",
  seats: "5",
  steering: "Left-hand drive",
  condition: "Good",
  availability: "Available now",
  registration_status: "",
  import_status: "",
  ownership_history: "",
  service_history: "",
  documents: "",
  equipment: "",
  safety: "",
  inspection_mechanical: "",
  inspection_exterior: "",
  inspection_interior: "",
  inspection_tyres_and_brakes: "",
  inspection_documents: "",
  inspection_notes: ""
};

export function VehicleForm({ initial }: { initial: VehicleFormState }) {
  const router = useRouter();
  const [state, setState] = useState<VehicleFormState>(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<
    { kind: "success" | "error"; text: string } | null
  >(null);

  const isNew = !state.id;

  function update<K extends keyof VehicleFormState>(
    key: K,
    value: VehicleFormState[K]
  ) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function buildPayload() {
    const tags = parseList(state.tags);
    const documents = parseList(state.documents);
    const equipment = parseList(state.equipment);
    const safety = parseList(state.safety);

    return {
      status: state.status,
      make: state.make.trim(),
      model: state.model.trim(),
      trim: emptyToNull(state.trim),
      year: parseInt(state.year, 10),
      price: parseInt(state.price, 10) || 0,
      mileage: parseInt(state.mileage, 10) || 0,
      transmission: state.transmission,
      fuel: state.fuel,
      body: state.body,
      location: state.location.trim(),
      listed_by: emptyToNull(state.listed_by),
      quality_score: parseFloat(state.quality_score) || 0,
      primary_image_url:
        state.image_urls[0] ?? emptyToNull(state.primary_image_url),
      image_urls: state.image_urls,
      tags,
      inspected: state.inspected,
      featured: state.featured,
      price_signal: state.price_signal,
      exterior_color: emptyToNull(state.exterior_color),
      interior_color: emptyToNull(state.interior_color),
      engine: emptyToNull(state.engine),
      drivetrain: state.drivetrain,
      doors: parseInt(state.doors, 10) || 4,
      seats: parseInt(state.seats, 10) || 5,
      steering: state.steering,
      condition: state.condition,
      availability: state.availability,
      registration_status: emptyToNull(state.registration_status),
      import_status: emptyToNull(state.import_status),
      ownership_history: emptyToNull(state.ownership_history),
      service_history: emptyToNull(state.service_history),
      documents,
      equipment,
      safety,
      inspection: {
        mechanical: state.inspection_mechanical,
        exterior: state.inspection_exterior,
        interior: state.inspection_interior,
        tyresAndBrakes: state.inspection_tyres_and_brakes,
        documents: state.inspection_documents,
        notes: state.inspection_notes
      }
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    if (!state.make || !state.model) {
      setMessage({ kind: "error", text: "Make and model are required." });
      return;
    }

    setBusy(true);
    setMessage(null);

    const payload = buildPayload();

    if (isNew) {
      const { data, error } = await supabase
        .from("vehicles")
        .insert(payload)
        .select("id")
        .single();

      setBusy(false);

      if (error) {
        setMessage({ kind: "error", text: error.message });
        return;
      }

      router.push(`/kigali/vehicles/${data.id}`);
    } else {
      const { error } = await supabase
        .from("vehicles")
        .update(payload)
        .eq("id", state.id!);

      setBusy(false);

      if (error) {
        setMessage({ kind: "error", text: error.message });
        return;
      }

      setMessage({ kind: "success", text: "Saved." });
      router.refresh();
    }
  }

  async function handleArchive() {
    if (!state.id) return;
    if (!confirm("Archive this vehicle? It will be hidden from the public site.")) {
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("vehicles")
      .update({ status: "archived" })
      .eq("id", state.id);

    if (error) {
      setMessage({ kind: "error", text: error.message });
      return;
    }
    router.push("/kigali/vehicles");
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <div className="admin-form-main">
          <Section title="Basics">
            <Field label="Make" required>
              <input
                value={state.make}
                onChange={(event) => update("make", event.target.value)}
                required
              />
            </Field>
            <Field label="Model" required>
              <input
                value={state.model}
                onChange={(event) => update("model", event.target.value)}
                required
              />
            </Field>
            <Field label="Trim">
              <input
                value={state.trim}
                onChange={(event) => update("trim", event.target.value)}
              />
            </Field>
            <Field label="Year">
              <input
                type="number"
                value={state.year}
                onChange={(event) => update("year", event.target.value)}
              />
            </Field>
            <Field label="Price (RWF)">
              <input
                type="number"
                value={state.price}
                onChange={(event) => update("price", event.target.value)}
              />
            </Field>
            <Field label="Mileage (km)">
              <input
                type="number"
                value={state.mileage}
                onChange={(event) => update("mileage", event.target.value)}
              />
            </Field>
            <Field label="Body">
              <select
                value={state.body}
                onChange={(event) => update("body", event.target.value)}
              >
                {BODY_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Fuel">
              <select
                value={state.fuel}
                onChange={(event) => update("fuel", event.target.value)}
              >
                {FUEL_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Transmission">
              <select
                value={state.transmission}
                onChange={(event) =>
                  update(
                    "transmission",
                    event.target.value as VehicleFormState["transmission"]
                  )
                }
              >
                {TRANSMISSIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Drivetrain">
              <select
                value={state.drivetrain}
                onChange={(event) =>
                  update(
                    "drivetrain",
                    event.target.value as VehicleFormState["drivetrain"]
                  )
                }
              >
                {DRIVETRAINS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Doors">
              <input
                type="number"
                value={state.doors}
                onChange={(event) => update("doors", event.target.value)}
              />
            </Field>
            <Field label="Seats">
              <input
                type="number"
                value={state.seats}
                onChange={(event) => update("seats", event.target.value)}
              />
            </Field>
            <Field label="Steering">
              <select
                value={state.steering}
                onChange={(event) =>
                  update(
                    "steering",
                    event.target.value as VehicleFormState["steering"]
                  )
                }
              >
                {STEERINGS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Engine">
              <input
                value={state.engine}
                onChange={(event) => update("engine", event.target.value)}
              />
            </Field>
            <Field label="Exterior color">
              <input
                value={state.exterior_color}
                onChange={(event) => update("exterior_color", event.target.value)}
              />
            </Field>
            <Field label="Interior color">
              <input
                value={state.interior_color}
                onChange={(event) => update("interior_color", event.target.value)}
              />
            </Field>
            <Field label="Location">
              <input
                value={state.location}
                onChange={(event) => update("location", event.target.value)}
              />
            </Field>
            <Field label="Listed by">
              <input
                value={state.listed_by}
                onChange={(event) => update("listed_by", event.target.value)}
              />
            </Field>
            <Field label="Condition">
              <select
                value={state.condition}
                onChange={(event) =>
                  update(
                    "condition",
                    event.target.value as VehicleFormState["condition"]
                  )
                }
              >
                {CONDITIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Availability">
              <select
                value={state.availability}
                onChange={(event) =>
                  update(
                    "availability",
                    event.target.value as VehicleFormState["availability"]
                  )
                }
              >
                {AVAILABILITIES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Quality score (0–10)">
              <input
                type="number"
                step="0.1"
                value={state.quality_score}
                onChange={(event) => update("quality_score", event.target.value)}
              />
            </Field>
          </Section>

          <Section title="Photos">
            <ImageUploader
              vehicleId={state.id}
              images={state.image_urls}
              onChange={(next) => update("image_urls", next)}
            />
          </Section>

          <Section title="History & paperwork">
            <Field label="Registration status">
              <input
                value={state.registration_status}
                onChange={(event) =>
                  update("registration_status", event.target.value)
                }
              />
            </Field>
            <Field label="Import status">
              <input
                value={state.import_status}
                onChange={(event) => update("import_status", event.target.value)}
              />
            </Field>
            <Field label="Ownership history">
              <input
                value={state.ownership_history}
                onChange={(event) =>
                  update("ownership_history", event.target.value)
                }
              />
            </Field>
            <Field label="Service history">
              <input
                value={state.service_history}
                onChange={(event) =>
                  update("service_history", event.target.value)
                }
              />
            </Field>
            <Field
              label="Tags (comma separated)"
              hint="Shown as small chips on the card"
              wide
            >
              <input
                value={state.tags}
                onChange={(event) => update("tags", event.target.value)}
                placeholder="Verified details, Fresh inspection, Popular SUV"
              />
            </Field>
            <Field label="Documents (comma separated)" wide>
              <input
                value={state.documents}
                onChange={(event) => update("documents", event.target.value)}
              />
            </Field>
            <Field label="Equipment (comma separated)" wide>
              <input
                value={state.equipment}
                onChange={(event) => update("equipment", event.target.value)}
              />
            </Field>
            <Field label="Safety (comma separated)" wide>
              <input
                value={state.safety}
                onChange={(event) => update("safety", event.target.value)}
              />
            </Field>
          </Section>

          <Section title="Inspection notes">
            <Field label="Mechanical" wide>
              <textarea
                value={state.inspection_mechanical}
                onChange={(event) =>
                  update("inspection_mechanical", event.target.value)
                }
                rows={2}
              />
            </Field>
            <Field label="Exterior" wide>
              <textarea
                value={state.inspection_exterior}
                onChange={(event) =>
                  update("inspection_exterior", event.target.value)
                }
                rows={2}
              />
            </Field>
            <Field label="Interior" wide>
              <textarea
                value={state.inspection_interior}
                onChange={(event) =>
                  update("inspection_interior", event.target.value)
                }
                rows={2}
              />
            </Field>
            <Field label="Tyres and brakes" wide>
              <textarea
                value={state.inspection_tyres_and_brakes}
                onChange={(event) =>
                  update("inspection_tyres_and_brakes", event.target.value)
                }
                rows={2}
              />
            </Field>
            <Field label="Documents review" wide>
              <textarea
                value={state.inspection_documents}
                onChange={(event) =>
                  update("inspection_documents", event.target.value)
                }
                rows={2}
              />
            </Field>
            <Field label="Notes" wide>
              <textarea
                value={state.inspection_notes}
                onChange={(event) =>
                  update("inspection_notes", event.target.value)
                }
                rows={2}
              />
            </Field>
          </Section>
        </div>

        <aside className="admin-form-aside">
          <Section title="Publishing">
            <Field label="Status">
              <select
                value={state.status}
                onChange={(event) =>
                  update("status", event.target.value as VehicleFormState["status"])
                }
              >
                {STATUSES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Price signal">
              <select
                value={state.price_signal}
                onChange={(event) =>
                  update(
                    "price_signal",
                    event.target.value as VehicleFormState["price_signal"]
                  )
                }
              >
                {PRICE_SIGNALS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={state.inspected}
                onChange={(event) => update("inspected", event.target.checked)}
              />
              Inspected
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={state.featured}
                onChange={(event) => update("featured", event.target.checked)}
              />
              Featured
            </label>
          </Section>

          <div className="admin-form-actions">
            <button type="submit" className="admin-submit" disabled={busy}>
              {busy ? "Saving…" : isNew ? "Create vehicle" : "Save changes"}
            </button>
            {!isNew ? (
              <button
                type="button"
                className="admin-danger"
                onClick={handleArchive}
              >
                Archive
              </button>
            ) : null}
            {message ? (
              <p className={`admin-message ${message.kind}`}>{message.text}</p>
            ) : null}
          </div>
        </aside>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="admin-section">
      <legend>{title}</legend>
      <div className="admin-section-grid">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  required,
  hint,
  wide,
  children
}: {
  label: string;
  required?: boolean;
  hint?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`admin-field ${wide ? "wide" : ""}`}>
      <span>
        {label}
        {required ? <em>required</em> : null}
      </span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function parseList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}
