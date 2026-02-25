"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  // На сервере (во время build / prerender) сразу выходим
  if (typeof window === "undefined") return null;

  // Кэш, чтобы не создавать клиент каждый раз
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ВАЖНО: никаких throw во время build
  if (!url || !key) {
    console.warn("Supabase env not set");
    return null;
  }

  supabase = createClient(url, key);
  return supabase;
}