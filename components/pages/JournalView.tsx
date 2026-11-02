"use client";

import { useRef } from "react";
import Link from "next/link";
import { useFlipFilter } from "@/lib/useFlipFilter";
import { POSTS, JOURNAL_CATS } from "@/lib/journal";
import { U } from "@/lib/data";
import { Media } from "@/components/ds";
import Tabs from "@/components/Tabs";

const matches = (cat: string, f: string) => f === "All" || cat === f;

export default function JournalView() {
  const root = useRef<HTMLDivElement>(null);
  const [filter, change] = useFlipFilter<string>(root, "All", ".jpost", matches);
  const [featured, ...rest] = POSTS;
  // With no filter the lead story sits above the grid; once filtering, every match belongs in it.
  const grid = filter === "All" ? rest : POSTS;
  const count = grid.filter((p) => matches(p.cat, filter)).length;

  return (
    <>
      <section className="section-pad">
        <Link href={`/journal/${featured.slug}`} className="wrap feature">
          <Media ratio="4/3" src={U(featured.img, 1400)} alt="" className="media--hover" loading="eager" />
          <div className="feature__copy">
            <span className="eyebrow" data-fade="16">
              {featured.cat} · {featured.date}
            </span>
            <h2 className="h-lg" data-split="lines">
              {featured.title}
            </h2>
            <p className="body-lg" data-fade="16" data-delay="0.1">
              {featured.dek}
            </p>
            <span className="line-link" data-fade="16" data-delay="0.2">
              <span className="line-link__rule" aria-hidden="true" />
              <span>Read · {featured.mins}</span>
            </span>
          </div>
        </Link>
      </section>

      <section ref={root} className="sec section-pad">
        <div className="wrap">
          <div className="filter-bar filter-bar--rule" data-fade="">
            <div className="tabs-scroll">
              <Tabs label="Filter stories" items={JOURNAL_CATS.map((c) => ({ value: c, label: c }))} value={filter} onChange={change} />
            </div>
            <span className="eyebrow">
              {count} {count === 1 ? "story" : "stories"}
            </span>
          </div>
          <div className="jposts">
            {POSTS.map((p, i) => (
              <Link
                key={p.slug}
                href={`/journal/${p.slug}`}
                className="jpost post"
                data-cat={p.cat}
                style={{ display: grid.includes(p) && matches(p.cat, filter) ? undefined : "none" }}
              >
                <Media ratio="4/3" src={U(p.img, 800)} alt="" className="media--hover" delay={(i % 3) * 0.1} parallax={0.05} />
                <span className="eyebrow">
                  {p.cat} · {p.date}
                </span>
                <h3>{p.title}</h3>
                <p>{p.dek}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
