import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const services = [
  {
    title: "Free car valuation",
    text: "Know what your car is worth before you sell. FastDeal Rwanda gives a realistic price guide based on car details, condition, and market demand."
  },
  {
    title: "Fast Sale Package",
    text: "For sellers who want active marketing and buyer screening. We help prepare your listing, promote your car, screen buyers, and support the sale."
  },
  {
    title: "Verified Fast Sale",
    text: "For sellers who want stronger buyer trust. We help inspect the car, verify important details, create professional content, and promote it as a trusted listing."
  },
  {
    title: "Premium Managed Sale",
    text: "Ideal for busy professionals, high-value cars, diaspora sellers, and people who want FastDeal to manage most of the selling process."
  },
  {
    title: "Find Me a Car",
    text: "For buyers who want help finding the right car. Tell us your budget and preferences, and we help search, inspect, compare, and negotiate."
  }
];

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Services"
        title="Choose the support level that fits your sale."
        text="FastDeal Rwanda helps with valuation, verification, professional photos and video, promotion, buyer screening, negotiation support, and closing assistance."
        action={{ href: "/sell", label: "Sell my car fast" }}
      />
      <section className="service-grid">
        {services.map((service) => (
          <article key={service.title}>
            <h2>{service.title}</h2>
            <p>{service.text}</p>
          </article>
        ))}
      </section>
      <section className="promise-band">
        <div>
          <p className="eyebrow">Ready to sell your car?</p>
          <h2>Start with a free valuation today.</h2>
        </div>
        <p>
          FastDeal Rwanda will help you understand your car value, choose the
          right selling price, market it professionally, and connect with serious buyers.
        </p>
        <Link className="primary-link" href="/sell">
          Start selling
        </Link>
      </section>
    </main>
  );
}
