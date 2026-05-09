import { PageHeader } from "@/components/PageHeader";

const steps = [
  {
    title: "Contact us",
    text: "Reach FastDeal Rwanda through WhatsApp, phone, website, or social media."
  },
  {
    title: "Share your car details",
    text: "Send the make, model, year, mileage, photos, location, asking price, ownership details, known issues, and how quickly you want to sell."
  },
  {
    title: "Get a free valuation",
    text: "We recommend a Fast Sale Price, Market Price, and High Price option so you can choose the right selling strategy."
  },
  {
    title: "Choose your package",
    text: "Select the service level that fits your needs, from basic listing support to full managed selling."
  },
  {
    title: "Inspection and photos",
    text: "For selected packages, we verify the car and create professional photos and video to make the listing stronger."
  },
  {
    title: "Your car goes live",
    text: "We publish and promote your car through FastDeal platforms, WhatsApp buyers, social media, dealer networks, and direct buyer outreach."
  },
  {
    title: "Buyer screening and viewings",
    text: "We filter serious buyers, coordinate viewings, and support buyer communication."
  },
  {
    title: "Negotiation and closing",
    text: "We help with offers, negotiation guidance, payment arrangement clarity, and closing support."
  }
];

export default function HowItWorksPage() {
  return (
    <main>
      <PageHeader
        eyebrow="How it works"
        title="From first message to closing the deal."
        text="FastDeal Rwanda gives sellers a clear, organized selling process instead of random posts, repeated messages, and stressful negotiations."
      />
      <section className="step-grid">
        {steps.map((step, index) => (
          <article key={step.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
