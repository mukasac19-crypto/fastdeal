"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "user" | "admin";
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  configured: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  configured: false,
  isAdmin: false,
  signOut: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    setConfigured(true);

    let active = true;

    async function applySession(nextSession: Session | null) {
      if (!active) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase!
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", nextSession.user.id)
        .maybeSingle();

      if (!active) return;

      if (error || !data) {
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const isAdmin = profile?.role === "admin";

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      configured,
      isAdmin,
      signOut
    }),
    [user, session, profile, loading, configured, isAdmin, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
