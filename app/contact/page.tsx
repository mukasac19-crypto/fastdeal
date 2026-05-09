import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the FastDeal Rwanda team."
        text="Contact us to sell your car, ask about a listed car, or get help finding the right vehicle."
      />
      <section className="form-page-grid">
        <ContactForm />
        <div className="process-list">
          <h2>Support areas</h2>
          <ol>
            <li>Seller valuation, package guidance, and listing support.</li>
            <li>Inspection, verification, photos, and video scheduling.</li>
            <li>Buyer screening, viewing coordination, and negotiation support.</li>
            <li>Find Me a Car requests for buyers.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
