"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ds";
import { createClient } from "@/lib/supabase/client";
import { AdminBar, fmtDate } from "./shared";

type Visit = { id: string; country: string | null; region: string | null; city: string | null; viewed_at: string };

const WEEK = 7 * 24 * 60 * 60 * 1000;
const regions = new Intl.DisplayNames(["en"], { type: "region" });
const country = (code: string | null) => {
  if (!code) return "Unknown";
  try {
    return regions.of(code) ?? code;
  } catch {
    return code;
  }
};

/** The most common value, or a dash. */
function top(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
}

export default function AdminPostViews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [error, setError] = useState("");
  const [lastWeek, setLastWeek] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("posts")
      .select("title, slug")
      .eq("id", id)
      .single()
      .then(async ({ data: post }) => {
        if (!post) return setError("This story couldn't be found.");
        setTitle(post.title);
        // shortcut: loads every visit for the story; page it once a story passes ~10k views.
        const { data, error } = await supabase
          .from("post_views")
          .select("id, country, region, city, viewed_at")
          .eq("post_slug", post.slug)
          .order("viewed_at", { ascending: false });
        if (error) setError(`Couldn't load visits: ${error.message}`);
        const since = Date.now() - WEEK;
        setLastWeek((data ?? []).filter((v) => Date.parse(v.viewed_at) > since).length);
        setVisits(data ?? []);
      });
  }, [id]);

  const topCity = top((visits ?? []).flatMap((v) => (v.city ? [v.city] : [])));
  const topCountry = top((visits ?? []).flatMap((v) => (v.country ? [v.country] : [])));

  return (
    <>
      <AdminBar />
      <main className="adm-main">
        <div className="wrap">
          <div className="adm-head">
            <div>
              <h1 className="h-md">{title || "Readers"}</h1>
              <p className="body-lg">Who read it, and from where. Locations are approximate and no addresses are kept.</p>
            </div>
            <Link href="/admin/journal" className="adm-bar__link">
              <Icon name="arrow-left" size={14} /> All stories
            </Link>
          </div>

          {error ? (
            <p className="adm-note adm-note--error">{error}</p>
          ) : visits === null ? (
            <p className="adm-note">Loading readers…</p>
          ) : (
            <>
              <div className="adm-figures">
                <div>
                  <span className="eyebrow">All time</span>
                  <strong>{visits.length.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="eyebrow">Last 7 days</span>
                  <strong>{lastWeek.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="eyebrow">Top city</span>
                  <strong>{topCity}</strong>
                </div>
                <div>
                  <span className="eyebrow">Top country</span>
                  <strong>{topCountry === "—" ? topCountry : country(topCountry)}</strong>
                </div>
              </div>

              {visits.length === 0 ? (
                <p className="adm-note">No readers yet. Visits are counted on the live site; local previews show up without a location.</p>
              ) : (
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>When (Bali time)</th>
                      <th>City</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((v) => (
                      <tr key={v.id}>
                        <td>{fmtDate(v.viewed_at, true)}</td>
                        <td>{[v.city, v.region].filter(Boolean).join(", ") || "Unknown"}</td>
                        <td>{country(v.country)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
