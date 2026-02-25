"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (typeof window === "undefined") return null;

  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  cached = createClient(url, key);
  return cached;
}

// ✅ Совместимость со старым кодом: можно продолжать импортировать supabaseBrowser
export const supabaseBrowser: SupabaseClient | null =
  typeof window === "undefined" ? null : getSupabaseBrowser();