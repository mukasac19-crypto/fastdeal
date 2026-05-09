import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function LoginPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Account"
        title="Sign in to manage your FastDeal activity."
        text="Supabase Auth can power saved cars, seller submissions, enquiries, and listing drafts."
      />
      <section className="form-page-grid">
        <form className="workflow-form">
          <label>
            Email
            <input placeholder="you@example.com" type="email" />
          </label>
          <label>
            Password
            <input placeholder="Password" type="password" />
          </label>
          <button type="button">Sign in</button>
        </form>
        <div className="estimate-card">
          <span>New to FastDeal?</span>
          <strong>Create buyer or seller access</strong>
          <p>
            The next implementation step is wiring this page to Supabase Auth and role
            based dashboards.
          </p>
          <Link href="/sell">Start as a seller</Link>
        </div>
      </section>
    </main>
  );
}
