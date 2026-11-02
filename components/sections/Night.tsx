"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { ACTS, U } from "@/lib/data";
import { Icon } from "@/components/ds";

export default function Night() {
  const root = useRef<HTMLElement>(null);
  const [act, setAct] = useState(1);
  const first = useRef(true);
  const refreshT = useRef<number | undefined>(undefined);

  useGSAP(
    () => {
      const imgs = gsap.utils.toArray<HTMLElement>(
        ".night__frame img",
        root.current,
      );
      const mores = gsap.utils.toArray<HTMLElement>(".act__more", root.current);
      const bars = gsap.utils.toArray<HTMLElement>(".act__bar", root.current);
      const instant = first.current || prefersReducedMotion();
      first.current = false;
      // Hovering rows while scrolling can flip acts faster than a crossfade lasts. Drop the previous
      // transition first, or its delayed fade-out lands after the new fade-in and blanks the picture.
      gsap.killTweensOf([
        ...imgs,
        ...mores,
        ...mores.map((m) => m.firstElementChild),
        ...bars,
      ]);

      imgs.forEach((img, i) => {
        if (i === act) {
          gsap.set(img, { zIndex: 1 });
          if (instant) gsap.set(img, { autoAlpha: 1, scale: 1 });
          else {
            gsap.fromTo(
              img,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.7, ease: "mo" },
            );
            gsap.fromTo(
              img,
              { scale: 1.14 },
              { scale: 1, duration: 1.6, ease: "expo.out" },
            );
          }
        } else {
          gsap.set(img, { zIndex: 0 });
          gsap.to(img, {
            autoAlpha: 0,
            duration: instant ? 0 : 0.7,
            delay: instant ? 0 : 0.2,
            ease: "mo",
          });
        }
      });

      mores.forEach((el, i) => {
        const on = i === act;
        const inner = el.firstElementChild as HTMLElement;
        if (instant) {
          gsap.set(el, { height: on ? "auto" : 0 });
          gsap.set(inner, { autoAlpha: on ? 1 : 0 });
          return;
        }
        gsap.to(el, {
          height: on ? "auto" : 0,
          duration: 0.7,
          ease: "expo.out",
        });
        gsap.to(
          inner,
          on
            ? { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.12 }
            : { autoAlpha: 0, y: -6, duration: 0.25 },
        );
      });

      bars.forEach((el, i) => {
        const on = i === act;
        if (instant) gsap.set(el, { scaleX: on ? 1 : 0 });
        else if (on)
          gsap.fromTo(
            el,
            { scaleX: 0, transformOrigin: "left" },
            { scaleX: 1, duration: 0.9, ease: "expo.inOut" },
          );
        else
          gsap.to(el, {
            scaleX: 0,
            transformOrigin: "right",
            duration: 0.7,
            ease: "expo.inOut",
          });
      });

      if (!instant) {
        gsap.fromTo(
          ".night__caption-text > span",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.06 },
        );
        // Rows changed height: re-measure triggers further down once things settle.
        window.clearTimeout(refreshT.current);
        refreshT.current = window.setTimeout(
          () => ScrollTrigger.refresh(),
          750,
        );
      }
    },
    { scope: root, dependencies: [act] },
  );

  const cur = ACTS[act];

  return (
    <section
      ref={root}
      id="night"
      className="night section-pad"
      data-screen-label="Home · The night"
    >
      <div className="wrap">
        <div className="night__grid">
          <div className="night__head">
            <h2 className="h-xl" data-split="chars">
              One night, five acts
            </h2>
            <p className="body-md" data-fade="" data-delay="0.15">
              Arrive at any hour and the house will be doing something
              different. Hover the timeline to see how the night unfolds.
            </p>
          </div>
          <div className="night__frame" data-reveal-media="">
            <div className="media__inner">
              {ACTS.map((a, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={a.title}
                  src={U(a.img, 1200)}
                  alt={a.title}
                  loading={i === 1 ? "eager" : "lazy"}
                />
              ))}
            </div>
            <div className="night__caption">
              <span className="eyebrow eyebrow--ink night__caption-text">
                <span key={"t" + act}>
                  {cur.time} · {cur.title}
                </span>
              </span>
              <span className="eyebrow eyebrow--body night__caption-text">
                <span key={"c" + act}>
                  Act {act + 1} of {ACTS.length}
                </span>
              </span>
            </div>
          </div>
          <div className="night__list" data-stagger="">
            <div className="hairline" data-line="" />
            {ACTS.map((a, i) => (
              <div
                key={a.title}
                className={"act" + (i === act ? " is-on" : "")}
                data-item=""
                onMouseEnter={() => setAct(i)}
                onClick={() => setAct(i)}
                onFocus={() => setAct(i)}
                tabIndex={0}
                role="button"
                aria-expanded={i === act}
              >
                <span className="act__time">{a.time}</span>
                <div className="act__main">
                  <h3 className="act__title">{a.title}</h3>
                  <div className="act__more">
                    <div className="act__more-inner">
                      <p className="body-md">{a.body}</p>
                      <Link
                        href={a.href}
                        className="act__cta"
                        tabIndex={i === act ? 0 : -1}
                      >
                        {a.cta} <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
                <span className="act__rule" />
                <span className="act__bar" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
