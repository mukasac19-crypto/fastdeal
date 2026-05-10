"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, profile, loading, configured } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent("/kigali")}`
      );
    }
  }, [loading, user, router]);

  if (!configured) {
    return (
      <div className="admin-loading">
        <p>Authentication is not configured. Add your Supabase keys to .env.</p>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="admin-loading">
        <p>Checking access…</p>
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return (
      <div className="admin-loading">
        <p>
          You are signed in but your account does not have admin access. Ask
          another admin to promote you, or contact support.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
