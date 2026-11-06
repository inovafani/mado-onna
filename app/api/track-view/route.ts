import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

// Records one article view with Vercel's approximate geo headers (empty in local dev). No IP is stored.
export async function POST(req: Request) {
  const slug = await req
    .json()
    .then((b) => (typeof b?.slug === "string" ? b.slug.slice(0, 200) : null))
    .catch(() => null);
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const h = req.headers;
  const geo = (k: string) => {
    const v = h.get(k);
    return v ? decodeURIComponent(v) : null;
  };
  const { error } = await createPublicClient().rpc("record_post_view", {
    p_slug: slug,
    p_country: geo("x-vercel-ip-country"),
    p_region: geo("x-vercel-ip-country-region"),
    p_city: geo("x-vercel-ip-city"),
  });
  if (error) return NextResponse.json({ error: "failed to record view" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
