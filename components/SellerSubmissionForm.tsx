"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";
type CarMakeOption = {
  id: string;
  name: string;
};

export function SellerSubmissionForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [makes, setMakes] = useState<CarMakeOption[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const showOtherMake = selectedMake === "__other";

  useEffect(() => {
    let cancelled = false;

    async function loadMakes() {
      try {
        const response = await fetch("/api/car-makes");
        const result = await response.json();

        if (!cancelled && response.ok) {
          setMakes(result.makes ?? []);
        }
      } catch {
        if (!cancelled) {
          setMakes([]);
        }
      }
    }

    loadMakes();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = {};

    formData.forEach((value, key) => {
      const text = String(value).trim();

      if (text) {
        payload[key] = text;
      }
    });

    const customMake = String(payload.make_other ?? "").trim();

    if (payload.make === "__other" && customMake) {
      payload.make = customMake;
    }

    delete payload.make_other;

    try {
      const response = await fetch("/api/seller-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to submit car details.");
      }

      event.currentTarget.reset();
      setSelectedMake("");
      setState("success");
      setMessage("Car details received. FastDeal will contact you for the next steps.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit car details.");
    }
  }

  return (
    <form className="seller-form" onSubmit={handleSubmit}>
      <p className="form-help">
        Only full name, phone number, car make, and model are required. Everything
        else is optional and helps FastDeal prepare a stronger listing.
      </p>
      <FormSection title="Seller contact">
        <label>
          <FieldLabel label="Full name" required />
          <input name="seller_name" placeholder="Your full name" required />
        </label>
        <label>
          <FieldLabel label="Phone number" required />
          <input name="phone" placeholder="+250 7XX XXX XXX" required />
        </label>
        <label>
          <FieldLabel label="Email" />
          <input name="email" placeholder="you@example.com" type="email" />
        </label>
        <label>
          <FieldLabel label="Car location" />
          <input name="car_location" placeholder="Kigali, Remera" />
        </label>
      </FormSection>

      <FormSection title="Car identity">
        <label>
          <FieldLabel label="Make" required />
          <select
            name="make"
            value={selectedMake}
            onChange={(event) => setSelectedMake(event.target.value)}
            required
          >
            <option value="" disabled>
              Select make
            </option>
            {makes.map((make) => (
              <option key={make.id} value={make.name}>
                {make.name}
              </option>
            ))}
            <option value="__other">Other</option>
          </select>
        </label>
        {showOtherMake ? (
          <label>
            <FieldLabel label="Other make" required />
            <input name="make_other" placeholder="Enter car make" required />
          </label>
        ) : null}
        <label>
          <FieldLabel label="Model" required />
          <input name="model" placeholder="RAV4" required />
        </label>
        <label>
          <FieldLabel label="Trim or grade" />
          <input name="trim" placeholder="G Hybrid" />
        </label>
        <label>
          <FieldLabel label="Year" />
          <input name="year" placeholder="2021" />
        </label>
        <label>
          <FieldLabel label="Body style" />
          <select name="body" defaultValue="">
            <option value="" disabled>
              Select body style
            </option>
            <option>SUV</option>
            <option>Sedan</option>
            <option>Hatchback</option>
            <option>Pickup</option>
            <option>Van</option>
          </select>
        </label>
        <label>
          <FieldLabel label="Current asking price" />
          <input name="asking_price" placeholder="38,500,000 RWF" />
        </label>
        <label>
          <FieldLabel label="How quickly do you want to sell?" />
          <select name="selling_speed" defaultValue="">
            <option value="" disabled>
              Select selling speed
            </option>
            <option>As fast as possible</option>
            <option>Balanced speed and price</option>
            <option>I can wait for a higher offer</option>
          </select>
        </label>
      </FormSection>

      <FormSection title="Specifications">
        <label>
          <FieldLabel label="Mileage" />
          <input name="mileage" placeholder="41,000 km" />
        </label>
        <label>
          <FieldLabel label="Fuel type" />
          <select name="fuel" defaultValue="">
            <option value="" disabled>
              Select fuel type
            </option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Hybrid</option>
            <option>Electric</option>
          </select>
        </label>
        <label>
          <FieldLabel label="Transmission" />
          <select name="transmission" defaultValue="">
            <option value="" disabled>
              Select transmission
            </option>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </label>
        <label>
          <FieldLabel label="Engine" />
          <input name="engine" placeholder="2.5L hybrid" />
        </label>
        <label>
          <FieldLabel label="Drivetrain" />
          <select name="drivetrain" defaultValue="">
            <option value="" disabled>
              Select drivetrain
            </option>
            <option>FWD</option>
            <option>RWD</option>
            <option>AWD</option>
            <option>4x4</option>
          </select>
        </label>
        <label>
          <FieldLabel label="Steering" />
          <select name="steering" defaultValue="">
            <option value="" disabled>
              Select steering
            </option>
            <option>Left-hand drive</option>
            <option>Right-hand drive</option>
          </select>
        </label>
        <label>
          <FieldLabel label="Exterior color" />
          <input name="exterior_color" placeholder="Pearl white" />
        </label>
        <label>
          <FieldLabel label="Interior color" />
          <input name="interior_color" placeholder="Black cloth" />
        </label>
      </FormSection>

      <FormSection title="Condition and history">
        <label>
          <FieldLabel label="Overall condition" />
          <select name="condition" defaultValue="">
            <option value="" disabled>
              Select condition
            </option>
            <option>Excellent</option>
            <option>Very good</option>
            <option>Good</option>
            <option>Needs work</option>
          </select>
        </label>
        <label>
          <FieldLabel label="Ownership history" />
          <input name="ownership_history" placeholder="Single local owner after import" />
        </label>
        <label>
          <FieldLabel label="Service history" />
          <input name="service_history" placeholder="Recent service completed" />
        </label>
        <label>
          <FieldLabel label="Registration status" />
          <input name="registration_status" placeholder="Registered in Rwanda" />
        </label>
        <label>
          <FieldLabel label="Import status" />
          <input name="import_status" placeholder="Japan import" />
        </label>
        <label>
          <FieldLabel label="Known issues" />
          <input name="known_issues" placeholder="No known major issues" />
        </label>
        <label className="full-field">
          <FieldLabel label="Extra notes for FastDeal" />
          <textarea
            name="notes"
            placeholder="Tell us anything buyers or inspectors should know before we visit."
          />
        </label>
      </FormSection>

      <FormSection title="Features and documents">
        <label className="full-field">
          <FieldLabel label="Main features" />
          <textarea
            name="features"
            placeholder="Reverse camera, leather seats, sunroof, Bluetooth, adaptive cruise..."
          />
        </label>
        <label className="full-field">
          <FieldLabel label="Safety features" />
          <textarea
            name="safety_features"
            placeholder="Airbags, ABS, lane assist, stability control, ISOFIX..."
          />
        </label>
        <label className="full-field">
          <FieldLabel label="Documents available" />
          <textarea
            name="documents_available"
            placeholder="Registration card, import documents, service records, ownership notes..."
          />
        </label>
        <label className="full-field">
          <FieldLabel label="Existing photo or video link" />
          <input
            name="media_link"
            placeholder="Google Drive, WhatsApp note, or social media link"
          />
        </label>
      </FormSection>

      <FormSection title="Service package interest">
        <label>
          <FieldLabel label="Preferred support level" />
          <select name="support_level" defaultValue="">
            <option value="" disabled>
              Select a package
            </option>
            <option>Basic listing support</option>
            <option>Fast Sale Package</option>
            <option>Verified Fast Sale Package</option>
            <option>Premium Managed Sale</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <label>
          <FieldLabel label="Best contact method" />
          <select name="preferred_contact_method" defaultValue="">
            <option value="" disabled>
              Select contact method
            </option>
            <option>WhatsApp</option>
            <option>Phone call</option>
            <option>Email</option>
          </select>
        </label>
      </FormSection>

      <FormSection title="Inspection and photo scheduling">
        <label>
          <FieldLabel label="Preferred day" />
          <input name="preferred_day" placeholder="Monday, Friday, weekend..." />
        </label>
        <label>
          <FieldLabel label="Preferred time" />
          <input name="preferred_time" placeholder="Morning, afternoon, evening" />
        </label>
        <label className="full-field">
          <FieldLabel label="Inspection address or landmark" />
          <input name="inspection_address" placeholder="Exact location or nearby landmark" />
        </label>
      </FormSection>

      <button type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Submitting..." : "Submit car details"}
      </button>
      {message ? <p className={`form-status ${state}`}>{message}</p> : null}
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="form-section">
      <legend>{title}</legend>
      <div className="field-grid">{children}</div>
    </fieldset>
  );
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <span className="field-label">
      {label}
      <small>{required ? "Required" : "Optional"}</small>
    </span>
  );
}
