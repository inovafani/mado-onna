"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK, PLAY_ONCE } from "@/lib/gsap";
import { openBooking, type Experience } from "@/lib/stores";
import { Button } from "@/components/ds";

/** Full-bleed closing banner. Same opening move as the home show section: an inset card widens to the edges. */
export default function CtaBanner({
  img,
  alt,
  title,
  text,
  cta = "Reserve a table",
  exp = null,
  secondary,
}: {
  img: string;
  alt: string;
  title: ReactNode;
  text: string;
  cta?: string;
  exp?: Experience | null;
  secondary?: { label: string; href: string };
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          ".show__frame",
          { clipPath: "inset(12% 9% 12% 9% round 12px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 92%", end: "top 8%", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          ".show__frame img",
          { yPercent: -7, scale: 1.18 },
          { yPercent: 7, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.from(".show__content > :not(.show__title)", {
          y: 30,
          autoAlpha: 0,
          duration: 1.3,
          stagger: 0.12,
          delay: 0.35,
          scrollTrigger: { trigger: root.current, start: "top 45%", toggleActions: PLAY_ONCE },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="show show--cta">
      <div className="show__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} loading="lazy" />
        <div className="show__shade" />
      </div>
      <div className="show__content">
        <h2 className="show__title" data-split="chars">
          {title}
        </h2>
        <p>{text}</p>
        <div className="show__ctas">
          <Button variant="primary" size="lg" magnetic onClick={() => openBooking(exp)}>
            {cta}
          </Button>
          {secondary && (
            <Button size="lg" href={secondary.href} magnetic>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
