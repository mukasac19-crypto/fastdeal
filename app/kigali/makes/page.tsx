"use client";

import { type FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Make = {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
};

export default function MakesAdmin() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setLoading(true);
    const { data, error: queryError } = await supabase
      .from("car_makes")
      .select("id, name, is_active, sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (queryError) {
      setError(queryError.message);
      setMakes([]);
    } else {
      setMakes((data ?? []) as Make[]);
    }
    setLoading(false);
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setBusy(true);
    setError(null);
    const { error: insertError } = await supabase
      .from("car_makes")
      .insert({ name: trimmed });
    setBusy(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setNewName("");
    await load();
  }

  async function toggleActive(make: Make) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error: updateError } = await supabase
      .from("car_makes")
      .update({ is_active: !make.is_active })
      .eq("id", make.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMakes((current) =>
      current.map((item) =>
        item.id === make.id ? { ...item, is_active: !item.is_active } : item
      )
    );
  }

  async function rename(make: Make) {
    const next = prompt("Rename make", make.name);
    if (!next || next.trim() === make.name) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error: updateError } = await supabase
      .from("car_makes")
      .update({ name: next.trim() })
      .eq("id", make.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await load();
  }

  async function changeOrder(make: Make, delta: number) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const next = make.sort_order + delta * 10;
    const { error: updateError } = await supabase
      .from("car_makes")
      .update({ sort_order: next })
      .eq("id", make.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await load();
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Car makes</h1>
          <p>Brands shown in seller form, marketplace filters, and listings.</p>
        </div>
      </div>

      <form className="admin-inline-form" onSubmit={handleAdd}>
        <input
          type="text"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Add a new make (e.g. Subaru)"
        />
        <button className="admin-submit" type="submit" disabled={busy || !newName.trim()}>
          {busy ? "Adding…" : "Add make"}
        </button>
      </form>

      {error ? <p className="admin-message error">{error}</p> : null}

      <div className="admin-table-wrap">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : makes.length === 0 ? (
          <p className="admin-empty">No makes yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sort</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {makes.map((make) => (
                <tr key={make.id}>
                  <td>
                    <strong>{make.name}</strong>
                  </td>
                  <td>{make.sort_order}</td>
                  <td>
                    <span
                      className={`admin-status ${make.is_active ? "published" : "archived"}`}
                    >
                      {make.is_active ? "active" : "hidden"}
                    </span>
                  </td>
                  <td className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-row-action"
                      onClick={() => changeOrder(make, -1)}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-row-action"
                      onClick={() => changeOrder(make, 1)}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-row-action"
                      onClick={() => rename(make)}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="admin-row-action"
                      onClick={() => toggleActive(make)}
                    >
                      {make.is_active ? "Hide" : "Show"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
