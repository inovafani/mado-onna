"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Icon, IconButton } from "@/components/ds";
import Tabs from "@/components/Tabs";
import { createClient } from "@/lib/supabase/client";
import { refreshJournal } from "@/app/admin/actions";
import { AdminBar, fmtDate } from "./shared";

type Row = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  reading_time: number;
  views: number;
};

type View = "all" | "live" | "draft";

export default function AdminPostList() {
  const [posts, setPosts] = useState<Row[] | null>(null);
  const [view, setView] = useState<View>("all");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [note, setNote] = useState("");

  function load() {
    return createClient()
      .from("posts")
      .select("id, title, slug, category, excerpt, image_url, published, published_at, created_at, reading_time, views")
      .order("published_at", { ascending: false, nullsFirst: true })
      .then(({ data, error }) => {
        if (error) setNote(`Couldn't load stories: ${error.message}`);
        setPosts((data as Row[]) ?? []);
      });
  }

  useEffect(() => {
    load();
    // Views tick up while the tab sits in the background.
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  async function togglePublished(p: Row) {
    if (!p.published && (!p.image_url || !p.excerpt)) {
      setNote(`“${p.title}” needs a cover photo and a standfirst before it can go live.`);
      return;
    }
    setNote("");
    const { error } = await createClient()
      .from("posts")
      .update({ published: !p.published, published_at: p.published_at ?? new Date().toISOString() })
      .eq("id", p.id);
    if (error) return setNote(error.message);
    await refreshJournal();
    load();
  }

  async function remove(id: string) {
    const { error } = await createClient().from("posts").delete().eq("id", id);
    setConfirming(null);
    if (error) return setNote(error.message);
    await refreshJournal();
    load();
  }

  const live = posts?.filter((p) => p.published).length ?? 0;
  const shown = (posts ?? []).filter((p) => view === "all" || p.published === (view === "live"));

  return (
    <>
      <AdminBar />
      <main className="adm-main">
        <div className="wrap">
          <div className="adm-head">
            <div>
              <h1 className="h-lg">
                The <em className="accent">journal</em>
              </h1>
              <p className="body-lg">Recipes, rehearsals and the people behind the night. Live stories appear on the site the moment you save.</p>
            </div>
            <Button href="/admin/journal/new" variant="primary" size="lg" icon={<Icon name="plus" />}>
              New story
            </Button>
          </div>

          <div className="filter-bar">
            <Tabs<View>
              label="Filter stories"
              value={view}
              onChange={setView}
              items={[
                { value: "all", label: `All ${posts?.length ?? ""}` },
                { value: "live", label: `Live ${live}` },
                { value: "draft", label: `Drafts ${(posts?.length ?? 0) - live}` },
              ]}
            />
            {note && <p className="adm-note adm-note--error">{note}</p>}
          </div>

          {posts === null ? (
            <p className="adm-note">Loading stories…</p>
          ) : shown.length === 0 ? (
            <div className="adm-empty">
              <p className="body-lg">{view === "draft" ? "No drafts. Everything is live." : "No stories here yet."}</p>
              <Button href="/admin/journal/new" icon={<Icon name="plus" />}>
                Write the first one
              </Button>
            </div>
          ) : (
            <ul className="adm-rows" role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {shown.map((p) => (
                <li key={p.id} className="adm-row">
                  <Link href={`/admin/journal/${p.id}`} className="adm-row__thumb" tabIndex={-1} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.image_url && <img src={p.image_url} alt="" loading="lazy" />}
                  </Link>
                  <div>
                    <Link href={`/admin/journal/${p.id}`} className="adm-row__title">
                      {p.title || "Untitled story"}
                    </Link>
                    <span className="eyebrow adm-row__meta">
                      {p.category} · {p.published_at ? fmtDate(p.published_at) : `Started ${fmtDate(p.created_at)}`} · {p.reading_time} min
                    </span>
                  </div>
                  <Link href={`/admin/journal/${p.id}/views`} className="adm-stat" title="Who read it, and from where">
                    <strong>{p.views.toLocaleString()}</strong>
                    <span className="eyebrow">{p.views === 1 ? "View" : "Views"}</span>
                  </Link>
                  <div>
                    <button
                      type="button"
                      className={"adm-status status" + (p.published ? " is-open" : "")}
                      onClick={() => togglePublished(p)}
                      title={p.published ? "Take it off the site" : "Publish it"}
                    >
                      <span className="status__dot" />
                      <span className="eyebrow eyebrow--ink">{p.published ? "Live" : "Draft"}</span>
                    </button>
                  </div>
                  <div className="adm-row__actions">
                    {confirming === p.id ? (
                      <>
                        <Button size="sm" onClick={() => setConfirming(null)}>
                          Keep
                        </Button>
                        <Button size="sm" variant="primary" onClick={() => remove(p.id)}>
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        {p.published && (
                          <a href={`/journal/${p.slug}`} target="_blank" className="mo-iconbtn mo-iconbtn--ghost" aria-label="Open on the site" title="Open on the site">
                            <Icon name="arrow-up-right" />
                          </a>
                        )}
                        <Link href={`/admin/journal/${p.id}`} className="mo-iconbtn mo-iconbtn--ghost" aria-label="Edit" title="Edit">
                          <Icon name="pencil" />
                        </Link>
                        <IconButton icon="trash" label="Delete" variant="ghost" onClick={() => setConfirming(p.id)} />
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
