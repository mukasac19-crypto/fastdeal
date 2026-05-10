"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const NAV = [
  { href: "/kigali", label: "Dashboard", icon: "grid" },
  { href: "/kigali/vehicles", label: "Vehicles", icon: "car" },
  { href: "/kigali/submissions", label: "Seller submissions", icon: "inbox" },
  { href: "/kigali/leads", label: "Buyer leads", icon: "chat" },
  { href: "/kigali/makes", label: "Car makes", icon: "tag" }
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  function isActive(href: string) {
    if (href === "/kigali") return pathname === "/kigali";
    return pathname?.startsWith(href);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <Link href="/kigali" className="admin-brand">
        <span className="admin-brand-mark">FD</span>
        <span>
          FastDeal
          <small>Admin</small>
        </span>
      </Link>

      <nav className="admin-nav">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link ${isActive(item.href) ? "is-active" : ""}`}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-back">
          ← View site
        </Link>
        <div className="admin-user">
          <div>
            <strong>{profile?.full_name ?? "Admin"}</strong>
            <small>{profile?.email}</small>
          </div>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavIcon({ name }: { name: string }) {
  const common = {
    "aria-hidden": "true" as const,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };
  if (name === "grid") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }
  if (name === "car") {
    return (
      <svg {...common}>
        <path d="M3 13l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5" />
        <path d="M3 13h18v5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
        <circle cx="7" cy="16" r="1" />
        <circle cx="17" cy="16" r="1" />
      </svg>
    );
  }
  if (name === "inbox") {
    return (
      <svg {...common}>
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5 4h14l3 8v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z" />
      </svg>
    );
  }
  if (name === "chat") {
    return (
      <svg {...common}>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
      </svg>
    );
  }
  if (name === "tag") {
    return (
      <svg {...common}>
        <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.6-1.4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8Z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </svg>
    );
  }
  return null;
}
