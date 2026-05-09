import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";

const steps: Array<{ title: string; text: string; icon: ReactNode }> = [
  {
    title: "Contact us",
    text: "Reach FastDeal Rwanda through WhatsApp, phone, our website, or social media. We make it simple and fast.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    )
  },
  {
    title: "Share your car details",
    text: "Send make, model, year, mileage, location, photos, asking price, ownership status, and how quickly you want to sell.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  },
  {
    title: "Get a free valuation",
    text: "We recommend a Fast Sale price, a Market price, and a High price option so you can pick a strategy that matches your urgency.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    title: "Choose your package",
    text: "Pick the level that fits — basic listing support, full marketing, verified inspection, or fully managed selling.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  },
  {
    title: "Inspection and photos",
    text: "We verify the car and capture professional photos and a walkaround video so the listing looks credible from the first click.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    )
  },
  {
    title: "Your car goes live",
    text: "We promote across FastDeal platforms, WhatsApp buyer lists, social media, dealer networks, and direct buyer outreach.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  },
  {
    title: "Buyer screening",
    text: "We filter serious buyers from time-wasters and bring you only the people who are actually ready to buy.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    )
  },
  {
    title: "Negotiation and closing",
    text: "We guide offer responses, support payment clarity, and help you close the sale with confidence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    )
  }
];

export default function HowItWorksPage() {
  return (
    <main>
      <PageHeader
        eyebrow="How it works"
        title="From first message to closing the deal."
        text="A clear, organized selling process — instead of random posts, repeated messages, and stressful negotiations."
      />
      <section className="process-timeline">
        {steps.map((step, index) => (
          <article className="timeline-card" key={step.title}>
            <div className="timeline-marker">
              <div className="timeline-icon" aria-hidden="true">
                {step.icon}
              </div>
              <span className="timeline-number">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="timeline-content">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="promise-band">
        <div>
          <p className="eyebrow">Ready to sell?</p>
          <h2>Start with a free valuation today.</h2>
        </div>
        <p>
          We will help you understand your car&apos;s value, choose the right
          selling price, and connect you with serious buyers.
        </p>
        <Link className="primary-link" href="/sell">
          Sell my car fast
        </Link>
      </section>
    </main>
  );
}
