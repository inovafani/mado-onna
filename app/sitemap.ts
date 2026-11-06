import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/journal";

const SITE = "https://madoonna.com";
const PAGES = ["", "/menus", "/whats-on", "/private-hire", "/our-story", "/gallery", "/journal", "/press", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    ...PAGES.map((p) => ({ url: SITE + p })),
    ...posts.map((p) => ({ url: `${SITE}/journal/${p.slug}`, lastModified: p.updated_at ?? p.published_at ?? p.created_at })),
  ];
}
