"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackShell title="Signing you in..." />}>
      <CallbackInner />
    </Suspense>
  );
}

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured.");
      return;
    }

    const code = searchParams?.get("code");
    const redirectTo = searchParams?.get("redirect") ?? "/";

    async function finish() {
      try {
        if (code) {
          const { error: exchangeError } =
            await supabase!.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }
        const { data } = await supabase!.auth.getSession();
        router.replace(data.session ? redirectTo : "/auth/login");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign-in failed.");
      }
    }

    finish();
  }, [router, searchParams]);

  return (
    <CallbackShell
      title={error ? "Sign-in failed" : "Signing you in..."}
      message={
        error ?? "Hold on a moment while we finish setting up your session."
      }
    />
  );
}

function CallbackShell({ title, message }: { title: string; message?: string }) {
  return (
    <main>
      <section className="auth-shell">
        <div className="auth-card">
          <p className="eyebrow">Account</p>
          <h1>{title}</h1>
          {message ? <p>{message}</p> : null}
        </div>
      </section>
    </main>
  );
}
