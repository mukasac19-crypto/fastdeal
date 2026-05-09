"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { VehicleCard } from "@/components/VehicleCard";
import { BODY_OPTIONS, FUEL_OPTIONS } from "@/lib/car-options";
import { currencyFormatter } from "@/lib/format";
import type { Vehicle } from "@/lib/listings";

const sortOptions = [
  "Recommended",
  "Lowest price",
  "Newest year",
  "Lowest mileage"
] as const;

type SortOption = (typeof sortOptions)[number];

export function Marketplace({
  vehicles,
  makeOptions
}: {
  vehicles: Vehicle[];
  makeOptions: string[];
}) {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("Any make");
  const [body, setBody] = useState("Any body");
  const [fuel, setFuel] = useState("Any fuel");
  const [budget, setBudget] = useState(60000000);
  const [sort, setSort] = useState<SortOption>("Recommended");
  const [saved, setSaved] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const makes = useMemo(
    () => ["Any make", ...Array.from(new Set(makeOptions))],
    [makeOptions]
  );
  const bodies = ["Any body", ...BODY_OPTIONS];
  const fuels = ["Any fuel", ...FUEL_OPTIONS];

  const filteredVehicles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return vehicles
      .filter((vehicle) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          `${vehicle.make} ${vehicle.model} ${vehicle.location} ${vehicle.body} ${vehicle.fuel}`
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesMake = make === "Any make" || vehicle.make === make;
        const matchesBody = body === "Any body" || vehicle.body === body;
        const matchesFuel = fuel === "Any fuel" || vehicle.fuel === fuel;
        const matchesBudget = vehicle.price <= budget;

        return matchesQuery && matchesMake && matchesBody && matchesFuel && matchesBudget;
      })
      .sort((a, b) => {
        if (sort === "Lowest price") return a.price - b.price;
        if (sort === "Newest year") return b.year - a.year;
        if (sort === "Lowest mileage") return a.mileage - b.mileage;
        return Number(b.featured) - Number(a.featured) || b.qualityScore - a.qualityScore;
      });
  }, [vehicles, query, make, body, fuel, budget, sort]);

  function toggleSaved(id: string) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    );
  }

  function resetFilters() {
    setQuery("");
    setMake("Any make");
    setBody("Any body");
    setFuel("Any fuel");
    setBudget(60000000);
    setSort("Recommended");
  }

  return (
    <main>
      <section className="inventory-top" id="top">
        <div>
          <h1>Find your next car in Rwanda.</h1>
        </div>
        <Link className="primary-link" href="/sell">
          Sell your car
        </Link>
      </section>

      <section className="search-band home-search mobile-search-band" aria-label="Vehicle search">
        <div className="search-shell">
          <label className="search-input">
            <span>Search by make, model, city, or style</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Toyota RAV4 in Kigali"
            />
          </label>
          <button
            className="filter-toggle"
            type="button"
            onClick={() => setMobileFiltersOpen((open) => !open)}
          >
            Filters
          </button>
          <div className={`filters ${mobileFiltersOpen ? "is-open" : ""}`}>
            <VehicleFilters
              budget={budget}
              bodies={bodies}
              body={body}
              fuel={fuel}
              fuels={fuels}
              make={make}
              makes={makes}
              setBody={setBody}
              setBudget={setBudget}
              setFuel={setFuel}
              setMake={setMake}
            />
          </div>
        </div>
      </section>

      <section className="quick-links" aria-label="Popular searches">
        {["EVs", "Family SUVs", "Under RWF 25M", "Hybrid", "Business pickups"].map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => {
              if (item === "Under RWF 25M") setBudget(25000000);
              else if (item === "EVs") setFuel("Electric");
              else if (item === "Hybrid") setFuel("Hybrid");
              else if (item === "Family SUVs") setBody("SUV");
              else setBody("Pickup");
            }}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="inventory-section" id="inventory">
        <div className="section-heading">
          <div>
            <h2>{filteredVehicles.length} inspected cars</h2>
          </div>
          <div className="sort-row">
            <Select label="Sort" value={sort} onChange={setSort} options={[...sortOptions]} />
            <button className="ghost-button" type="button" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>

        <div className="inventory-layout">
          <aside className="desktop-filter-sidebar" aria-label="Vehicle filters">
            <h3>Filter cars</h3>
            <label className="search-input sidebar-search">
              <span>Search by make, model, city, or style</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Toyota RAV4 in Kigali"
              />
            </label>
            <VehicleFilters
              budget={budget}
              bodies={bodies}
              body={body}
              fuel={fuel}
              fuels={fuels}
              make={make}
              makes={makes}
              setBody={setBody}
              setBudget={setBudget}
              setFuel={setFuel}
              setMake={setMake}
            />
            <button className="ghost-button" type="button" onClick={resetFilters}>
              Reset filters
            </button>
          </aside>

          <div className="vehicle-grid">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  saved={saved.includes(vehicle.id)}
                  onSave={() => toggleSaved(vehicle.id)}
                />
              ))
            ) : (
              <div className="inline-empty">
                <h3>No published cars yet</h3>
                <p>
                  Add published vehicles in Supabase and they will appear here
                  automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="sell-section" id="sell">
        <div>
          <p className="eyebrow">Ready to sell?</p>
          <h2>Start with your car details today.</h2>
          <p>
            FastDeal Rwanda will help you understand your car value, choose the
            right selling price, market it professionally, and connect with serious buyers.
          </p>
        </div>
        <form className="sell-form">
          <label>
            Registration or model
            <input placeholder="RAV4 2021" />
          </label>
          <label>
            Phone number
            <input placeholder="+250 7XX XXX XXX" />
          </label>
          <Link className="form-link-button" href="/sell">
            Start selling
          </Link>
        </form>
      </section>
    </main>
  );
}

function VehicleFilters({
  budget,
  bodies,
  body,
  fuel,
  fuels,
  make,
  makes,
  setBody,
  setBudget,
  setFuel,
  setMake
}: {
  budget: number;
  bodies: string[];
  body: string;
  fuel: string;
  fuels: string[];
  make: string;
  makes: string[];
  setBody: (value: string) => void;
  setBudget: (value: number) => void;
  setFuel: (value: string) => void;
  setMake: (value: string) => void;
}) {
  return (
    <>
      <Select label="Make" value={make} onChange={setMake} options={makes} />
      <Select label="Body" value={body} onChange={setBody} options={bodies} />
      <Select label="Fuel" value={fuel} onChange={setFuel} options={fuels} />
      <label className="range-control">
        <span>Max budget</span>
        <strong>{currencyFormatter.format(budget)}</strong>
        <input
          min="12000000"
          max="65000000"
          step="1000000"
          type="range"
          value={budget}
          onChange={(event) => setBudget(Number(event.target.value))}
        />
      </label>
    </>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="select-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
