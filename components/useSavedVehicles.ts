"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type SavedRow = { vehicle_id: string };

export function useSavedVehicles() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (authLoading) return;

      if (!user) {
        if (!cancelled) {
          setIds(new Set());
          setLoading(false);
        }
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        if (!cancelled) setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("saved_vehicles")
        .select("vehicle_id")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (error) {
        console.error("Failed to load saved vehicles", error);
        setIds(new Set());
      } else {
        setIds(new Set((data ?? []).map((row: SavedRow) => row.vehicle_id)));
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const toggle = useCallback(
    async (vehicleId: string) => {
      if (!user) {
        router.push(
          `/auth/login?redirect=${encodeURIComponent(
            typeof window !== "undefined"
              ? window.location.pathname + window.location.search
              : "/"
          )}`
        );
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const wasSaved = ids.has(vehicleId);

      setIds((current) => {
        const next = new Set(current);
        if (wasSaved) next.delete(vehicleId);
        else next.add(vehicleId);
        return next;
      });

      const { error } = wasSaved
        ? await supabase
            .from("saved_vehicles")
            .delete()
            .eq("user_id", user.id)
            .eq("vehicle_id", vehicleId)
        : await supabase.from("saved_vehicles").upsert(
            { user_id: user.id, vehicle_id: vehicleId },
            { onConflict: "user_id,vehicle_id" }
          );

      if (error) {
        console.error("Failed to update saved vehicle", error);
        setIds((current) => {
          const next = new Set(current);
          if (wasSaved) next.add(vehicleId);
          else next.delete(vehicleId);
          return next;
        });
      }
    },
    [ids, user, router]
  );

  return { ids, toggle, loading, signedIn: Boolean(user) };
}
