import { PageHeader } from "@/components/PageHeader";

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About FastDeal Rwanda"
        title="Rwanda's trusted car-selling partner."
        text="FastDeal Rwanda was created to make car selling in Rwanda easier, faster, and more trusted."
      />
      <section className="story-section">
        <article>
          <h2>Why we exist</h2>
          <p>
            Many car owners struggle to sell because of poor marketing, unrealistic
            pricing, unserious buyers, and stressful negotiations. At the same time,
            buyers often struggle to trust the cars they find online.
          </p>
          <p>
            FastDeal Rwanda solves this by acting as a professional car-selling
            partner. We help sellers understand car value, prepare strong
            listings, promote cars to serious buyers, screen inquiries, arrange
            viewings, and support negotiations.
          </p>
        </article>
        <article>
          <h2>Our mission</h2>
          <p>
            Our mission is to help car owners sell faster while giving buyers more
            confidence. We believe car selling should not be confusing, stressful,
            or slow.
          </p>
          <p>
            With the right pricing, presentation, marketing, and buyer screening,
            cars can sell faster and more safely. FastDeal Rwanda is here to make
            that happen.
          </p>
        </article>
      </section>
      <section className="promise-band">
        <div>
          <p className="eyebrow">Our vision</p>
          <h2>To become the most trusted car-selling partner in Rwanda.</h2>
        </div>
        <p>
          We want FastDeal Rwanda to be the first name people think of when they
          want to sell a car fast.
        </p>
      </section>
    </main>
  );
}
