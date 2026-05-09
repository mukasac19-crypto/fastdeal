import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="empty-state">
        <h1>Page not found</h1>
        <p>The FastDeal page you are looking for is not available.</p>
        <Link href="/buy">Browse cars</Link>
      </section>
    </main>
  );
}
