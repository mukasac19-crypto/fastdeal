"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export function SiteHeader() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!menuOpen) return;

    function onClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/buy?q=${encodeURIComponent(trimmed)}` : "/buy");
    setOpen(false);
  }

  async function handleSignOut() {
    setMenuOpen(false);
    await signOut();
    router.push("/");
  }

  const userInitial = getUserInitial(user);
  const userLabel =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ??
    user?.email ??
    "Account";

  return (
    <header className={`site-header ${open ? "is-search-open" : ""}`}>
      <div className="header-row">
        {open ? (
          <form className="header-search-inline" role="search" onSubmit={handleSubmit}>
            <button
              type="button"
              className="icon-button"
              aria-label="Close search"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
            <span className="header-search-icon" aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search make, model, city, body, fuel..."
              aria-label="Search cars"
            />
            <button type="submit" className="header-search-submit">
              Search
            </button>
          </form>
        ) : (
          <>
            <Link className="brand" href="/" aria-label="FastDeal Rwanda home">
              <Image
                src="/fastdeal-logo.png"
                alt="FastDeal Rwanda"
                className="brand-logo"
                width={200}
                height={48}
                priority
              />
            </Link>
            <nav className="desktop-nav" aria-label="Primary navigation">
              <Link href="/#inventory">Buy</Link>
              <Link href="/sell">Sell</Link>
              <Link href="/how-it-works">How it works</Link>
            </nav>
            <div className="header-actions">
              <button
                type="button"
                className="icon-button"
                aria-label="Search cars"
                onClick={() => setOpen(true)}
              >
                <SearchIcon />
              </button>
              {user ? (
                <div className="user-menu" ref={menuRef}>
                  <button
                    type="button"
                    className="user-avatar"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    aria-label={`Open account menu (${userLabel})`}
                    onClick={() => setMenuOpen((value) => !value)}
                  >
                    {userInitial}
                  </button>
                  {menuOpen ? (
                    <div className="user-dropdown" role="menu">
                      <div className="user-dropdown-head">
                        <strong>
                          {(user.user_metadata as { full_name?: string } | undefined)
                            ?.full_name ?? "Signed in"}
                        </strong>
                        <span>{user.email}</span>
                      </div>
                      <Link
                        href="/saved"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        Saved cars
                      </Link>
                      <Link
                        href="/sell"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        Sell my car
                      </Link>
                      <Link
                        href="/contact"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        Contact support
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  className="icon-button"
                  href="/auth/login"
                  aria-label="Sign in"
                >
                  <UserIcon />
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function getUserInitial(user: ReturnType<typeof useAuth>["user"]) {
  if (!user) return "?";
  const meta = user.user_metadata as
    | { full_name?: string; name?: string }
    | undefined;
  const name = meta?.full_name ?? meta?.name ?? user.email ?? "";
  const trimmed = name.trim();
  if (!trimmed) return "U";
  return trimmed[0]!.toUpperCase();
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
