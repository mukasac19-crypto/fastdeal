import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";

const pillars: Array<{ title: string; text: string; icon: ReactNode }> = [
  {
    title: "We sell, not just list",
    text: "Most platforms only post your car. We actively support every step from valuation to closing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    )
  },
  {
    title: "Right pricing",
    text: "Three price tiers tailored to how quickly you want to sell — fast, market, or high.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    title: "Professional marketing",
    text: "Better photos, walkaround video, and clearer descriptions that build buyer confidence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    )
  },
  {
    title: "Buyer screening",
    text: "We filter the messages so only serious, ready-to-buy people reach you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    )
  },
  {
    title: "Negotiation support",
    text: "Guidance on offers, counters, and timing — so you don't leave value on the table.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h4l3-9 4 18 3-9h4" />
      </svg>
    )
  },
  {
    title: "Trust and clarity",
    text: "Verification, transparency, and clear communication build trust on both sides of the deal.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    )
  }
];

const stats = [
  { value: "Faster", label: "Selling timeline" },
  { value: "Serious", label: "Buyers only" },
  { value: "Less", label: "Stress and back-and-forth" }
];

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About FastDeal Rwanda"
        title="Sell your car faster. Safely. Smartly."
        text="A car-selling service that helps owners in Rwanda sell their vehicles faster, more safely, and with less stress."
      />

      <section className="story-split">
        <div className="story-copy">
          <p className="eyebrow">Why we exist</p>
          <h2>Selling a car shouldn&apos;t be stressful.</h2>
          <p>
            Many sellers deal with unserious buyers, fake inquiries, low offers,
            and slow negotiations. Buyers struggle to trust the cars they find
            online.
          </p>
          <p>
            FastDeal Rwanda solves this by acting as a professional car-selling
            partner — bringing structure, trust, and active marketing into a
            process that has been chaotic for too long.
          </p>
        </div>
        <div className="story-stats" aria-label="Outcomes">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pillars-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What makes us different</p>
            <h2>We don&apos;t just list. We sell.</h2>
          </div>
          <Link className="secondary-link" href="/how-it-works">
            See how it works
          </Link>
        </div>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article className="pillar-card" key={pillar.title}>
              <div className="pillar-icon" aria-hidden="true">
                {pillar.icon}
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="promise-band">
        <div>
          <p className="eyebrow">Our vision</p>
          <h2>Rwanda&apos;s most trusted car-selling partner.</h2>
        </div>
        <p>
          We want FastDeal Rwanda to be the first name people think of when
          they say &quot;I want to sell my car fast.&quot;
        </p>
      </section>
    </main>
  );
}
