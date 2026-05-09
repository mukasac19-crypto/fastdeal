import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExpandableCarDetails } from "@/components/ExpandableCarDetails";
import { VehicleCard } from "@/components/VehicleCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { currencyFormatter, numberFormatter } from "@/lib/format";
import type { Vehicle } from "@/lib/listings";
import { getPublishedVehicleById, getPublishedVehicles } from "@/lib/vehicles";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type DetailItem = [string, string];

export default async function CarDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [vehicle, allVehicles] = await Promise.all([
    getPublishedVehicleById(id),
    getPublishedVehicles()
  ]);

  if (!vehicle) {
    notFound();
  }

  const overview: DetailItem[] = [
    ["Mileage", `${numberFormatter.format(vehicle.mileage)} km`],
    ["Fuel", vehicle.fuel],
    ["Transmission", vehicle.transmission],
    ["Body", vehicle.body],
    ["Location", vehicle.location],
    ["Condition", vehicle.condition]
  ];

  const specifications: DetailItem[] = [
    ["Trim", vehicle.trim],
    ["Engine", vehicle.engine],
    ["Drivetrain", vehicle.drivetrain],
    ["Doors", String(vehicle.doors)],
    ["Seats", String(vehicle.seats)],
    ["Steering", vehicle.steering],
    ["Exterior color", vehicle.exteriorColor],
    ["Interior color", vehicle.interiorColor]
  ];

  const history: DetailItem[] = [
    ["Registration", vehicle.registrationStatus],
    ["Import status", vehicle.importStatus],
    ["Ownership", vehicle.ownershipHistory],
    ["Service history", vehicle.serviceHistory],
    ["Availability", vehicle.availability],
    ["Listed by", vehicle.listedBy]
  ];

  const inspection: DetailItem[] = [
    ["Mechanical", vehicle.inspection.mechanical],
    ["Exterior", vehicle.inspection.exterior],
    ["Interior", vehicle.inspection.interior],
    ["Tyres and brakes", vehicle.inspection.tyresAndBrakes],
    ["Documents", vehicle.inspection.documents],
    ["Notes", vehicle.inspection.notes]
  ];
  const whatsappHref = getWhatsAppHref(
    `Hello FastDeal Rwanda, I am interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed for ${currencyFormatter.format(vehicle.price)}. Can you share more details?`
  );
  const isExternalWhatsApp = whatsappHref.startsWith("http");
  const relatedVehicles = getRelatedVehicles(vehicle, allVehicles);

  return (
    <main>
      <section className="detail-layout">
        <div className="detail-media">
          <Image
            src={vehicle.image}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 58vw"
          />
        </div>

        <aside className="detail-panel">
          <p className="eyebrow">{vehicle.priceSignal}</p>
          <h1>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <strong className="detail-price">{currencyFormatter.format(vehicle.price)}</strong>
          <p>
            Promoted through FastDeal Rwanda with clearer information, buyer
            screening, viewing support, and sale assistance.
          </p>
          <div className="detail-actions">
            <Link className="primary-link" href="/contact">
              Ask about this car
            </Link>
            <Link
              className="whatsapp-link"
              href={whatsappHref}
              target={isExternalWhatsApp ? "_blank" : undefined}
              rel={isExternalWhatsApp ? "noreferrer" : undefined}
            >
              <WhatsAppIcon className="whatsapp-icon" />
              WhatsApp
            </Link>
          </div>
          <dl className="detail-specs">
            {overview.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <ExpandableCarDetails
        documents={vehicle.documents}
        equipment={vehicle.equipment}
        highlights={vehicle.tags}
        history={history}
        inspection={inspection}
        safety={vehicle.safety}
        specifications={specifications}
      />

      {relatedVehicles.length > 0 ? (
        <section className="detail-section compact-top">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Related cars</p>
              <h2>More cars you may like.</h2>
            </div>
            <Link className="secondary-link" href="/#inventory">
              View all cars
            </Link>
          </div>
          <div className="vehicle-grid related-grid">
            {relatedVehicles.map((relatedVehicle) => (
              <VehicleCard key={relatedVehicle.id} vehicle={relatedVehicle} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="content-grid">
        <article>
          <h2>Supported by FastDeal</h2>
          <p>
            FastDeal helps with buyer enquiries, viewing coordination, negotiation
            support, and closing assistance so the process is more organized.
          </p>
          <Link href="/contact">Contact FastDeal</Link>
        </article>
        <article>
          <h2>Want to sell yours?</h2>
          <p>
            Submit the vehicle details first. FastDeal can guide pricing, schedule
            inspection, create better marketing, and help find serious buyers.
          </p>
          <Link href="/sell">Enter car details</Link>
        </article>
      </section>
    </main>
  );
}

function getRelatedVehicles(vehicle: Vehicle, vehicles: Vehicle[]) {
  return vehicles
    .filter((candidate) => candidate.id !== vehicle.id)
    .map((candidate) => {
      const score =
        Number(candidate.make === vehicle.make) * 4 +
        Number(candidate.body === vehicle.body) * 3 +
        Number(candidate.fuel === vehicle.fuel) * 2 +
        Number(candidate.transmission === vehicle.transmission);

      return { vehicle: candidate, score };
    })
    .sort((a, b) => b.score - a.score || b.vehicle.qualityScore - a.vehicle.qualityScore)
    .slice(0, 4)
    .map(({ vehicle: relatedVehicle }) => relatedVehicle);
}
