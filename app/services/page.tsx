import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";

type Service = {
  title: string;
  text: string;
  icon: ReactNode;
  features: string[];
  featured?: boolean;
};

const services: Service[] = [
  {
    title: "Free car valuation",
    text: "Know what your car is worth before you sell.",
    features: [
      "Realistic price guide",
      "Three price tiers",
      "Based on real demand",
      "No commitment"
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    title: "Fast Sale Package",
    text: "Active marketing and buyer screening to move your car quickly.",
    features: [
      "Listing preparation",
      "Active promotion",
      "Buyer screening",
      "Sale support"
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    )
  },
  {
    title: "Verified Fast Sale",
    text: "Stronger buyer trust through inspection and verification.",
    features: [
      "Car inspection",
      "Detail verification",
      "Professional photos and video",
      "Trusted listing badge"
    ],
    featured: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    )
  },
  {
    title: "Premium Managed Sale",
    text: "Ideal for busy professionals, high-value cars, and diaspora sellers.",
    features: [
      "Full handling",
      "High-value cars",
      "Diaspora support",
      "End-to-end coordination"
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  {
    title: "Find Me a Car",
    text: "We help buyers find the right car at the right price.",
    features: [
      "Custom search",
      "Independent inspection",
      "Negotiation help",
      "Saves your time"
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    )
  }
];

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Services"
        title="Choose the support level that fits your sale."
        text="Valuation, verification, professional photos and video, promotion, buyer screening, negotiation support, and closing assistance."
        action={{ href: "/sell", label: "Sell my car fast" }}
      />
      <section className="service-cards">
        {services.map((service) => (
          <article
            key={service.title}
            className={`service-card${service.featured ? " featured" : ""}`}
          >
            {service.featured ? (
              <span className="service-ribbon">Most chosen</span>
            ) : null}
            <div className="service-icon" aria-hidden="true">
              {service.icon}
            </div>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <ul className="service-features">
              {service.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="promise-band">
        <div>
          <p className="eyebrow">Ready to sell your car?</p>
          <h2>Start with a free valuation today.</h2>
        </div>
        <p>
          We help you understand your car&apos;s value, choose the right price,
          market it professionally, and connect with serious buyers.
        </p>
        <Link className="primary-link" href="/sell">
          Start selling
        </Link>
      </section>
    </main>
  );
}
