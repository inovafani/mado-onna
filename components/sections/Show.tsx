"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, PLAY_ONCE } from "@/lib/gsap";
import { openBooking } from "@/lib/stores";
import { Button } from "@/components/ds";

export default function Show() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // The frame opens from an inset card to full-bleed as it rises into view.
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
          {
            yPercent: 7,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.fromTo(
          ".show__shade",
          { opacity: 0.4 },
          { opacity: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "top 10%", scrub: true } },
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
    <section ref={root} className="show" data-screen-label="Home · The show">
      <div className="show__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2000&q=80&auto=format&fit=crop"
          alt="A performer on stage through smoke and light"
          loading="lazy"
        />
        <div className="show__shade" />
      </div>
      <div className="show__content">
        <h2 className="show__title" data-split="chars">
          Dinner, with a second act
        </h2>
        <p>
          Dancers, live vocals and musicians move through the room between courses. Three seasons a year, each with a new story from a
          different Mediterranean shore.
        </p>
        <div className="show__ctas">
          <Button variant="primary" size="lg" magnetic onClick={() => openBooking("show")}>
            Book the show dinner
          </Button>
          <Button size="lg" href="/whats-on" magnetic>
            This season
          </Button>
        </div>
      </div>
    </section>
  );
}
