import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client с service role (только на сервере).
 * Нужен для создания бакетов и других админ-операций.
 * Добавьте SUPABASE_SERVICE_ROLE_KEY в .env.local (из Dashboard → Settings → API).
 */
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
