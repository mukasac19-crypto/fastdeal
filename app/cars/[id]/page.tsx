import Link from "next/link";
import { notFound } from "next/navigation";
import { ExpandableCarDetails } from "@/components/ExpandableCarDetails";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleGallery } from "@/components/VehicleGallery";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { currencyFormatter, numberFormatter } from "@/lib/format";
import {
  getPublishedVehicleById,
  getRelatedVehicles
} from "@/lib/vehicles";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const revalidate = 60;

type DetailItem = [string, string];

export default async function CarDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getPublishedVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = await getRelatedVehicles(vehicle);

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

  return (
    <main>
      <section className="detail-layout">
        <div className="detail-media">
          <VehicleGallery
            images={vehicle.images}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
        </div>

        <aside className="detail-panel">
          <div className="detail-pills">
            <span className="inspection-badge">Inspected</span>
            <span className="price-tag">{vehicle.priceSignal}</span>
          </div>
          <h1>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <strong className="detail-price">{currencyFormatter.format(vehicle.price)}</strong>
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

      <section className="detail-cta-banner">
        <div className="detail-cta-copy">
          <p className="eyebrow">Want to sell your car too?</p>
          <h2>List your car with FastDeal Rwanda.</h2>
          <p>
            Free valuation, professional photos, active marketing, and buyer
            screening — we handle the heavy lifting.
          </p>
        </div>
        <Link className="primary-link" href="/sell">
          Sell my car
        </Link>
      </section>
    </main>
  );
}

