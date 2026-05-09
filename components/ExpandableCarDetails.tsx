"use client";

import { useState } from "react";

type DetailItem = [string, string];

export function ExpandableCarDetails({
  documents,
  equipment,
  highlights,
  history,
  inspection,
  safety,
  specifications
}: {
  documents: string[];
  equipment: string[];
  highlights: string[];
  history: DetailItem[];
  inspection: DetailItem[];
  safety: string[];
  specifications: DetailItem[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="detail-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Car details</p>
          <h2>Key details first. More when you need them.</h2>
        </div>
        <button
          className="ghost-button view-more-button"
          type="button"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Show less" : "View more"}
        </button>
      </div>

      <div className="detail-card-grid compact-details">
        <DetailList
          title="Specifications"
          items={expanded ? specifications : specifications.slice(0, 4)}
        />
        <DetailList title="History" items={expanded ? history : history.slice(0, 3)} />
        <InspectionList items={expanded ? inspection : inspection.slice(0, 3)} />
        {expanded ? (
          <>
            <FeatureList title="Comfort and equipment" items={equipment} />
            <FeatureList title="Safety" items={safety} />
            <FeatureList title="Documents captured" items={documents} />
            <FeatureList title="Listing highlights" items={highlights} />
          </>
        ) : null}
      </div>
    </section>
  );
}

function DetailList({ title, items }: { title: string; items: DetailItem[] }) {
  return (
    <article className="detail-card">
      <h3>{title}</h3>
      <dl>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function InspectionList({ items }: { items: DetailItem[] }) {
  return (
    <article className="detail-card">
      <h3>Inspection summary</h3>
      <dl>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="detail-card">
      <h3>{title}</h3>
      <ul className="clean-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
