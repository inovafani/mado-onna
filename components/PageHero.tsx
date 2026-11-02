"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { onIntroDone } from "@/lib/stores";

/**
 * Title intro shared by every page header: waits for the curtain to lift, then the title rises
 * letter by letter, any Bodoni accent words arrive last, and [data-hero-item] blocks follow.
 */
function useTitleIntro(root: RefObject<HTMLElement | null>, extra?: (tl: gsap.core.Timeline) => void) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, (ctx) => {
        let alive = true;
        const el = root.current!;
        const title = el.querySelector<HTMLElement>("h1")!;
        const items = gsap.utils.toArray<HTMLElement>("[data-hero-item]", el);
        gsap.set(title, { autoAlpha: 0 });
        if (items.length) gsap.set(items, { autoAlpha: 0, y: 24 });

        const off = onIntroDone(() => {
          document.fonts.ready.then(() => {
            if (!alive) return;
            ctx.add(() => {
              const split = SplitText.create(title, { type: "lines,words,chars", mask: "lines", linesClass: "split-line" });
              const accent = split.chars.filter((c) => (c as Element).closest(".accent"));
              const plain = split.chars.filter((c) => !accent.includes(c));
              gsap.set(title, { autoAlpha: 1 });
              const tl = gsap.timeline({ delay: 0.3 }).from(plain, { yPercent: 120, duration: 1.4, stagger: 0.022, ease: "expo.out" }, 0);
              if (items.length) tl.to(items, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.5);
              if (accent.length)
                tl.from(accent, { yPercent: 115, rotate: 7, autoAlpha: 0, duration: 1.7, stagger: 0.04, ease: "expo.out" }, 0.35);
              extra?.(tl);
            });
          });
        });
        return () => {
          alive = false;
          off();
        };
      });
    },
    { scope: root },
  );
}

/** Full-bleed photo header: the picture settles from a zoom, then sinks slower than the page. */
export function PageHero({
  img,
  alt,
  title,
  size = "md",
  xl,
  position,
  aside,
  below,
}: {
  img: string;
  alt: string;
  title: ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  xl?: boolean;
  position?: string;
  aside?: ReactNode;
  below?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useTitleIntro(root, (tl) => tl.fromTo(".ph__media img", { scale: 1.22 }, { scale: 1, duration: 2.8, ease: "expo.out" }, 0));

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.set(".ph__media img", { scale: 1.22 });
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".ph__media", { yPercent: 22, ease: "none", scrollTrigger: st });
        gsap.to(".ph__content", { y: -80, autoAlpha: 0, ease: "none", scrollTrigger: { ...st, end: "75% top" } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={"ph ph--" + size}>
      <div className="ph__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} fetchPriority="high" style={{ objectPosition: position }} />
      </div>
      <div className="ph__shade" />
      <div className="ph__content">
        <div className="ph__inner">
          <h1 className={"ph__title" + (xl ? " ph__title--xl" : "")}>{title}</h1>
          {aside && (
            <div className="ph__aside" data-hero-item="">
              {aside}
            </div>
          )}
        </div>
        {below && (
          <div className="ph__below" data-hero-item="">
            {below}
          </div>
        )}
      </div>
    </section>
  );
}

/** Text-only header for the editorial pages. */
export function PageHeader({ title, sub, side }: { title: ReactNode; sub?: ReactNode; side?: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useTitleIntro(root);

  return (
    <section ref={root} className="pt">
      <div className="pt__inner">
        <div className="pt__main">
          <h1 className="pt__title">{title}</h1>
          {sub && (
            <div className="pt__sub" data-hero-item="">
              {sub}
            </div>
          )}
        </div>
        {side && (
          <div className="pt__side" data-hero-item="">
            {side}
          </div>
        )}
      </div>
    </section>
  );
}
