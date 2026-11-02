"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, PLAY_ONCE } from "@/lib/gsap";
import { STRIP, U } from "@/lib/data";
import { LineLink } from "@/components/ds";

export default function GalleryStrip() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const items = gsap.utils.toArray<HTMLElement>(".gallery__item", root.current);

      mm.add(MOTION_OK, () => {
        gsap.from(items, {
          yPercent: 18,
          autoAlpha: 0,
          duration: 1.4,
          stagger: 0.07,
          scrollTrigger: { trigger: track.current, start: "top 90%", toggleActions: PLAY_ONCE },
        });
      });

      // Desktop: vertical scroll drives the strip sideways, with a little depth per frame.
      mm.add(`(min-width: 900px) and ${MOTION_OK}`, () => {
        const el = track.current!;
        el.classList.add("is-driven");
        gsap.fromTo(
          el,
          { x: () => window.innerWidth * 0.12 },
          {
            x: () => -(el.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true },
          },
        );
        items.forEach((it, i) => {
          const d = i % 2 ? 1 : -1;
          gsap.fromTo(
            it.firstElementChild,
            { y: 36 * d },
            { y: -36 * d, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
        return () => el.classList.remove("is-driven");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="gallery" className="gallery" data-screen-label="Home · Gallery strip">
      <div className="wrap gallery__head section-pad">
        <div>
          <h2 className="h-sm" data-split="lines">
            Last weekend, roughly
          </h2>
        </div>
        <LineLink href="/gallery" data-fade="">
          Open the gallery
        </LineLink>
      </div>
      <div ref={track} className="gallery__track">
        {STRIP.map(([id, w, ar]) => (
          <div key={id} className="gallery__item" style={{ width: w }}>
            <div className="media" style={{ aspectRatio: ar }}>
              <div className="media__inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={U(id, 800)} alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
