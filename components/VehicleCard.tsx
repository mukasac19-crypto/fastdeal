"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, MouseEvent } from "react";
import { currencyFormatter, numberFormatter } from "@/lib/format";
import type { Vehicle } from "@/lib/listings";

export function VehicleCard({
  vehicle,
  saved = false,
  onSave
}: {
  vehicle: Vehicle;
  saved?: boolean;
  onSave?: () => void;
}) {
  const router = useRouter();
  const vehicleUrl = `/cars/${vehicle.id}`;

  function openVehicle() {
    router.push(vehicleUrl);
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openVehicle();
    }
  }

  function handleSaveClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onSave?.();
  }

  return (
    <article
      className="vehicle-card"
      onClick={openVehicle}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
    >
      <div className="vehicle-media">
        <Image
          src={vehicle.image}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          sizes="(max-width: 860px) 100vw, (max-width: 1100px) 50vw, 40vw"
        />
        {onSave ? (
          <button
            className={`save-button ${saved ? "is-saved" : ""}`}
            type="button"
            onClick={handleSaveClick}
            aria-label={saved ? "Remove saved vehicle" : "Save vehicle"}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 8-2.85A4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10Z" />
            </svg>
          </button>
        ) : null}
        <span className="price-signal">{vehicle.priceSignal}</span>
        <span className="inspection-badge">Inspected</span>
      </div>
      <div className="vehicle-content">
        <div className="vehicle-title">
          <h3>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <strong>{currencyFormatter.format(vehicle.price)}</strong>
        </div>

        <dl className="vehicle-specs">
          <div>
            <dt>Mileage</dt>
            <dd>{numberFormatter.format(vehicle.mileage)} km</dd>
          </div>
          <div>
            <dt>Fuel</dt>
            <dd>{vehicle.fuel}</dd>
          </div>
          <div>
            <dt>Gearbox</dt>
            <dd>{vehicle.transmission}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
