"use client";

import { useEffect } from "react";

type Instgrm = { instgrm?: { Embeds: { process: () => void } } };

// Logs one view per article load, and wakes up Instagram embeds written in the editor.
export default function ArticleExtras({ slug, embeds }: { slug: string; embeds: boolean }) {
  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!embeds) return;
    const w = window as Window & Instgrm;
    if (w.instgrm) return w.instgrm.Embeds.process();
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, [embeds, slug]);

  return null;
}
