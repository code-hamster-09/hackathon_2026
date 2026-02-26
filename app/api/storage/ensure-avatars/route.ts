import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

/**
 * POST /api/storage/ensure-avatars
 * Создаёт бакет avatars в Supabase Storage, если его ещё нет.
 * Требуется SUPABASE_SERVICE_ROLE_KEY в .env.local.
 */
export async function POST() {
  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "missing_service_role",
        message:
          "Добавьте SUPABASE_SERVICE_ROLE_KEY в .env.local (Supabase Dashboard → Settings → API → service_role). Либо создайте бакет вручную: Storage → New bucket → id: avatars, Public: on.",
      },
      { status: 501 }
    );
  }

  const { error } = await supabase.storage.createBucket("avatars", {
    public: true,
    fileSizeLimit: 2 * 1024 * 1024, // 2 MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("already exists") || msg.includes("duplicate") || (error as any).statusCode === 409) {
      return NextResponse.json({ ok: true, created: false });
    }
    return NextResponse.json(
      { error: error.message, code: (error as any).name },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, created: true });
}
