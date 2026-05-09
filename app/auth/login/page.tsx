"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, configured, loading } = useAuth();
  const redirectTo = searchParams?.get("redirect") ?? "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<
    { kind: "success" | "error"; text: string } | null
  >(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage({ kind: "error", text: "Authentication is not configured." });
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name || undefined },
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/auth/callback`
                : undefined
          }
        });

        if (error) throw error;

        setMessage({
          kind: "success",
          text: "Check your email to confirm your account."
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
      }
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "Something went wrong."
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage({ kind: "error", text: "Authentication is not configured." });
      return;
    }

    setBusy(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
            : undefined
      }
    });

    if (error) {
      setBusy(false);
      setMessage({ kind: "error", text: error.message });
    }
  }

  if (!configured && !loading) {
    return (
      <main>
        <section className="auth-shell">
          <div className="auth-card">
            <p className="eyebrow">Account</p>
            <h1>Authentication is not configured.</h1>
            <p>
              Add your Supabase URL and anon key to <code>.env</code> and
              restart the dev server to enable sign-in.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="auth-shell">
        <div className="auth-card">
          <p className="eyebrow">FastDeal Rwanda</p>
          <h1>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
          <p className="auth-sub">
            {mode === "signup"
              ? "Save cars, get price alerts, and manage your enquiries from one place."
              : "Sign in to save cars, view your shortlist, and manage your seller submissions."}
          </p>

          <button
            type="button"
            className="auth-google"
            onClick={handleGoogle}
            disabled={busy}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or with email</span>
          </div>

          <form className="auth-form" onSubmit={handleEmailSubmit}>
            {mode === "signup" ? (
              <label>
                <span>Full name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </label>
            ) : null}
            <label>
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
              />
            </label>
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy
                ? "Please wait..."
                : mode === "signup"
                ? "Create account"
                : "Sign in"}
            </button>
          </form>

          {message ? (
            <p className={`auth-message ${message.kind}`}>{message.text}</p>
          ) : null}

          <p className="auth-toggle">
            {mode === "signup" ? "Already have an account?" : "New to FastDeal?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode((current) => (current === "signup" ? "signin" : "signup"));
                setMessage(null);
              }}
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </p>

          <p className="auth-fineprint">
            By continuing, you agree to FastDeal Rwanda&apos;s terms of service.{" "}
            <Link href="/contact">Need help?</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.6 12.227c0-.709-.064-1.391-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.227c1.886-1.737 2.986-4.296 2.986-7.351Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.964-.895 6.614-2.422l-3.227-2.51c-.895.6-2.04.955-3.387.955-2.605 0-4.81-1.759-5.595-4.122H2.064v2.59A9.997 9.997 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.405 13.901a5.987 5.987 0 0 1 0-3.802V7.51H2.064a9.997 9.997 0 0 0 0 8.982l4.341-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.977c1.469 0 2.787.505 3.823 1.498l2.866-2.866C16.96 3.045 14.696 2 12 2 8.131 2 4.79 4.225 3.064 7.51l4.341 2.59C8.19 7.736 10.395 5.977 12 5.977Z"
      />
    </svg>
  );
}
