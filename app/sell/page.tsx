import { PageHeader } from "@/components/PageHeader";
import { SellerSubmissionForm } from "@/components/SellerSubmissionForm";

export default function SellPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Sell your car"
        title="Sell your car faster with FastDeal Rwanda."
        text="Start by sharing your car details. We review the information, guide pricing, help you choose a selling package, then support marketing, buyer screening, negotiation, and closing."
      />
      <section className="seller-layout">
        <SellerSubmissionForm />

        <aside className="seller-aside">
          <div className="process-list">
            <h2>What happens next</h2>
            <ol>
              <li>FastDeal reviews the submitted details.</li>
              <li>
                We provide price guidance for fast sale, market price, and high
                price strategies.
              </li>
              <li>We contact the seller to schedule inspection and photos.</li>
              <li>Our team checks the car and captures clean listing photos.</li>
              <li>FastDeal promotes the car and screens buyer enquiries.</li>
              <li>We coordinate the sale through FastDeal.</li>
            </ol>
          </div>
          <div className="seller-note">
            <span>No photo upload required</span>
            <p>
              Sellers only need to enter details. FastDeal takes the listing photos
              after inspection so every car page looks consistent and trustworthy.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
