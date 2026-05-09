import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function SavedPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Saved cars"
        title="Your shortlist will live here."
        text="When authentication and browser storage are connected, buyers can save vehicles, compare them, and receive price-drop alerts."
        action={{ href: "/buy", label: "Browse cars" }}
      />
      <section className="empty-state">
        <h2>No saved cars yet</h2>
        <p>Start with the marketplace search and save the cars worth comparing.</p>
        <Link href="/buy">Find cars</Link>
      </section>
    </main>
  );
}
