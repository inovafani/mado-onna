"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { lockScroll } from "@/lib/stores";
import { useFlipFilter } from "@/lib/useFlipFilter";
import { U } from "@/lib/data";
import { IconButton } from "@/components/ds";
import Tabs from "@/components/Tabs";

type Shot = { id: string; cat: string; ar: string; alt: string };
const S = (id: string, cat: string, ar: string, alt: string): Shot => ({ id, cat, ar, alt });

const SHOTS: Shot[] = [
  S("1600565193348-f74bd3c7ccdf", "Dining", "3/4", "Flames at the open kitchen"),
  S("1569924995012-c4c706bfcd51", "Bar", "4/5", "Late at the cocktail bar"),
  S("1518834107812-67b0b7c58434", "Show", "3/4", "The opening number"),
  S("1534080564583-6be75777b70a", "Dining", "1/1", "Paella for the table"),
  S("1563784462386-044fd95e9852", "Club", "4/3", "Lasers at peak hour"),
  S("1572116469696-31de0f17cc34", "Bar", "3/4", "The backlit bar"),
  S("1559742811-822873691df8", "Dining", "1/1", "Grilled prawns, lemon"),
  S("1495791185843-c73f2269f669", "Show", "4/5", "A solo in the second act"),
  S("1514362545857-3bc16c4c7d1b", "Bar", "4/5", "A signature on the bar"),
  S("1545128485-c400e7702796", "Club", "4/3", "The floor in red"),
  S("1414235077428-338989a2e8c0", "Dining", "4/3", "Dinner service"),
  S("1460723237483-7a6dc9d0b212", "Show", "3/4", "Live vocals"),
  S("1519671482749-fd09be7ccebf", "Events", "4/3", "A toast between courses"),
  S("1470225620780-dba8ba36b745", "Club", "3/4", "Behind the decks"),
  S("1588168333986-5078d3ae3976", "Dining", "4/5", "Striploin from the grill"),
  S("1535525153412-5a42439a210d", "Show", "3/4", "Hoop artist on the terrace"),
  S("1536935338788-846bb9981813", "Bar", "1/1", "Dried orange, smoke"),
  S("1511795409834-ef04bbd61622", "Events", "4/3", "A table for a celebration"),
  S("1574391884720-bbc3740c59d1", "Club", "3/4", "Saturday, 01:30"),
  S("1572715376701-98568319fd0b", "Dining", "4/5", "Plating at the pass"),
  S("1415201364774-f6f0bb35f28f", "Show", "4/3", "Saxophone set"),
  S("1467810563316-b5476525c0f9", "Events", "4/3", "Sparklers for a birthday"),
  S("1587223962930-cb7f31384c19", "Bar", "3/4", "The Mykonos Martini"),
  S("1540039155733-5bb30b53aa14", "Club", "4/3", "Full house"),
];

const CATS = ["All", "Dining", "Show", "Bar", "Club", "Events"];
const matches = (cat: string, f: string) => f === "All" || cat === f;
const ratio = (ar: string) => {
  const [w, h] = ar.split("/").map(Number);
  return w / h;
};

export default function GalleryView() {
  const root = useRef<HTMLDivElement>(null);
  const [filter, change] = useFlipFilter<string>(root, "All", ".shot", matches);
  const [open, setOpen] = useState(-1);
  const list = SHOTS.filter((s) => matches(s.cat, filter));

  return (
    <div ref={root}>
      <div className="section-pad">
        <div className="wrap wrap--wide filter-bar" data-fade="">
          <div className="tabs-scroll">
            <Tabs
              label="Filter photos"
              items={CATS.map((c) => ({ value: c, label: c }))}
              value={filter}
              onChange={(f) => {
                setOpen(-1);
                change(f);
              }}
            />
          </div>
          <span className="eyebrow">{list.length} photos · tap to enlarge</span>
        </div>
      </div>

      <section className="section-pad gallery-page">
        <div className="wrap wrap--wide masonry">
          {SHOTS.map((s) => {
            const idx = list.indexOf(s);
            return (
              <button
                key={s.id}
                type="button"
                className="shot"
                data-cat={s.cat}
                data-shot={s.id}
                aria-label={s.alt}
                style={{ display: idx < 0 ? "none" : undefined }}
                onClick={() => setOpen(idx)}
              >
                <span className="media shot__media" style={{ aspectRatio: s.ar }} data-reveal-media="">
                  <span className="media__inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={U(s.id, 700)} alt="" loading="lazy" />
                  </span>
                </span>
                <span className="pill-tag pill-tag--dark shot__cat">{s.cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {open >= 0 && list[open] && <Lightbox list={list} index={open} onIndex={setOpen} onClose={() => setOpen(-1)} />}
    </div>
  );
}

/** Opens by growing the photo out of its thumbnail and closes back into it. Arrow keys and Esc work. */
function Lightbox({ list, index, onIndex, onClose }: { list: Shot[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const dir = useRef(0);
  const opened = useRef(false);
  const closing = useRef(false);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const cur = list[index];

  // Look inside this gallery only: Next may keep an earlier visit of the page mounted but hidden.
  const thumbOf = (s: Shot) => box.current?.parentElement?.querySelector<HTMLElement>(`[data-shot="${s.id}"] .shot__media`) ?? null;

  // Fit the photo inside the stage, keeping its ratio.
  const ar = ratio(cur.ar);
  const availW = Math.max(200, Math.min(1400, vp.w - (vp.w < 700 ? 32 : 200)));
  const availH = Math.max(200, vp.h - 190);
  const fw = Math.min(availW, availH * ar);
  const size = { width: Math.round(fw), height: Math.round(fw / ar) };

  useLayoutEffect(() => {
    const measure = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    lockScroll("lightbox", true);
    return () => {
      window.removeEventListener("resize", measure);
      lockScroll("lightbox", false);
    };
  }, []);

  /** Transform that maps the frame onto the thumbnail's box. */
  const toThumb = useCallback((s: Shot) => {
    const t = thumbOf(s)?.getBoundingClientRect();
    const f = frame.current!.getBoundingClientRect();
    if (!t || !t.width || t.bottom < 0 || t.top > window.innerHeight) return null;
    return { x: t.left - f.left, y: t.top - f.top, scale: t.width / f.width };
  }, []);

  // Opening: grow out of the thumbnail. Later index changes slide the next photo in.
  useLayoutEffect(() => {
    if (!vp.w) return;
    const reduced = prefersReducedMotion();
    if (!opened.current) {
      opened.current = true;
      const from = toThumb(cur);
      const chrome = box.current!.querySelectorAll("[data-lb-chrome]");
      if (reduced || !from) {
        gsap.fromTo(box.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
        return;
      }
      const thumb = thumbOf(cur);
      gsap.set(thumb, { autoAlpha: 0 });
      gsap
        .timeline({ onComplete: () => gsap.set(thumb, { autoAlpha: 1 }) })
        .fromTo(box.current, { backgroundColor: "rgba(10,10,10,0)" }, { backgroundColor: "rgba(10,10,10,0.97)", duration: 0.7, ease: "mo" }, 0)
        .fromTo(frame.current, { ...from, transformOrigin: "0 0", borderRadius: 4 }, { x: 0, y: 0, scale: 1, duration: 1.05, ease: "expo.inOut" }, 0)
        .fromTo(chrome, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.55);
      return;
    }
    if (reduced) return;
    gsap.fromTo(frame.current, { autoAlpha: 0, x: 70 * dir.current }, { autoAlpha: 1, x: 0, duration: 0.9, ease: "expo.out" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, vp.w > 0]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const to = prefersReducedMotion() ? null : toThumb(cur);
    if (!to) {
      gsap.to(box.current, { autoAlpha: 0, duration: 0.3, onComplete: onClose });
      return;
    }
    const thumb = thumbOf(cur);
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(thumb, { autoAlpha: 1 });
          onClose();
        },
      })
      .to(box.current!.querySelectorAll("[data-lb-chrome]"), { autoAlpha: 0, duration: 0.25 }, 0)
      .to(box.current, { backgroundColor: "rgba(10,10,10,0)", duration: 0.7, ease: "mo" }, 0.1)
      .to(frame.current, { ...to, transformOrigin: "0 0", duration: 0.85, ease: "expo.inOut" }, 0)
      .add(() => gsap.set(thumb, { autoAlpha: 0 }), 0);
  }, [cur, onClose, toThumb]);

  const step = useCallback(
    (d: number) => {
      dir.current = d;
      onIndex((index + d + list.length) % list.length);
    },
    [index, list.length, onIndex],
  );

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [close, step]);

  return (
    <div ref={box} className="lb" role="dialog" aria-modal="true" aria-label={cur.alt} data-lenis-prevent="">
      <div className="lb__top" data-lb-chrome="">
        <span className="eyebrow">
          {String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")} · {cur.cat}
        </span>
        <IconButton icon="x" label="Close" onClick={close} />
      </div>
      <div className="lb__stage">
        <span data-lb-chrome="">
          <IconButton icon="arrow-left" label="Previous photo" onClick={() => step(-1)} />
        </span>
        <div ref={frame} className="lb__frame" style={size}>
          {/* The thumbnail is already cached, so it shows instantly; the large file fades in over it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={"t" + cur.id} src={U(cur.id, 700)} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={"f" + cur.id}
            src={U(cur.id, 1800)}
            alt={cur.alt}
            className="lb__full"
            onLoad={(e) => gsap.to(e.currentTarget, { opacity: 1, duration: 0.5 })}
          />
        </div>
        <span data-lb-chrome="">
          <IconButton icon="arrow-right" label="Next photo" onClick={() => step(1)} />
        </span>
      </div>
      <p className="lb__cap" data-lb-chrome="">
        {cur.alt}
      </p>
    </div>
  );
}
