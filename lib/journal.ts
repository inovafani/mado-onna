import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export type Row = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  author: string;
  reading_time: number;
  published_at: string | null;
  updated_at: string | null;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  tags: string[];
  schema_types: string[];
  related_acts: string[];
};

export type Post = Row & { cat: string; date: string; mins: string; img: string; dek: string };

const toPost = (r: Row): Post => ({
  ...r,
  cat: r.category,
  date: new Date(r.published_at ?? r.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "Asia/Makassar",
  }),
  mins: `${r.reading_time} min`,
  img: r.image_url ?? "",
  dek: r.excerpt ?? "",
});

// shortcut: one query for every published post, filtered in JS; fine for a few hundred stories.
export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag("posts");
  cacheLife("max");
  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw new Error(`[journal] ${error.message}`);
  return (data as Row[]).map(toPost);
}
