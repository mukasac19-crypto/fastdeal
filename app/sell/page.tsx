import { SellerSubmissionForm } from "@/components/SellerSubmissionForm";

export default function SellPage() {
  return (
    <main>
      <section className="sell-page-hero">
        <p className="eyebrow">Sell your car</p>
        <h1>Sell your car faster with FastDeal Rwanda.</h1>
        <p>
          Share your car details below. We review the information, guide
          pricing, handle inspection and photos, then market your car and
          screen serious buyers — so you don&apos;t have to.
        </p>
        <div className="sell-trust-row">
          <span>Free valuation</span>
          <span>No upfront fees</span>
          <span>Verified buyers</span>
          <span>We handle photos</span>
        </div>
      </section>

      <section className="seller-layout">
        <SellerSubmissionForm />

        <aside className="seller-aside">
          <div className="process-list">
            <h2>How selling works</h2>
            <ol>
              <li>Submit your car details — takes about 3 minutes.</li>
              <li>
                We send free price guidance for fast, market, and premium
                strategies.
              </li>
              <li>FastDeal schedules an inspection and photoshoot at your spot.</li>
              <li>Our team prepares a clean, trustworthy listing for buyers.</li>
              <li>We promote the car and screen every enquiry on your behalf.</li>
              <li>You approve the offer — we coordinate the closing.</li>
            </ol>
          </div>

          <div className="seller-note">
            <span>Don&apos;t worry about photos</span>
            <h3>FastDeal handles the photoshoot.</h3>
            <p>
              Sellers only enter details. Our team visits, inspects, and
              captures the photos — so every listing looks consistent and
              builds buyer trust.
            </p>
          </div>

          <div className="seller-help-card">
            <span>Need a hand?</span>
            <strong>Talk to a FastDeal advisor.</strong>
            <p>
              Prefer to start over WhatsApp or a phone call?{" "}
              <a href="/contact">Contact our team</a> and we&apos;ll guide you
              through the details.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
