"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK, PLAY_ONCE } from "@/lib/gsap";

/**
 * Declarative scroll motion. Server-rendered sections opt in with data attributes:
 *
 *   data-fade[="y"]        fade + rise on enter
 *   data-stagger           children marked data-item rise in sequence
 *   data-line              hairline draws from the left
 *   data-split="lines|chars"  masked text reveal (SplitText)
 *   data-scrub-words       words brighten as you scroll through them
 *   data-reveal-media      image frame wipes open, picture settles from a zoom
 *   data-parallax="0.06"   picture drifts inside its frame
 *   data-speed="1"         element drifts against the scroll (depth)
 *   data-count             number counts up
 *   data-magnetic          button leans toward the pointer
 *   data-delay="0.2"       extra delay for any one-shot reveal
 *
 * Mounted last on the page so every section is in the DOM. Queries are scoped to this page's
 * .shell: Next keeps recently visited pages mounted but hidden, and they must not be picked up.
 * Everything lives inside a
 * matchMedia(prefers-reduced-motion: no-preference) context, so reduced-motion users get
 * static, fully visible content.
 */
export default function Motion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const scope = anchor.current!.closest(".shell") ?? document.body;
    const mm = gsap.matchMedia();
    const all = <T extends HTMLElement = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, scope);
    const delayOf = (el: HTMLElement) => Number(el.dataset.delay) || 0;

    mm.add(MOTION_OK, (ctx) => {
      let alive = true;

      all("[data-fade]").forEach((el) => {
        gsap.from(el, {
          y: Number(el.dataset.fade) || 28,
          autoAlpha: 0,
          duration: 1.3,
          delay: delayOf(el),
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: PLAY_ONCE },
        });
      });

      all("[data-stagger]").forEach((group) => {
        const items = group.querySelectorAll(":scope > [data-item]");
        if (!items.length) return;
        gsap.from(items, {
          y: 32,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.09,
          delay: delayOf(group),
          scrollTrigger: { trigger: group, start: "top 86%", toggleActions: PLAY_ONCE },
        });
      });

      all("[data-line]").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          duration: 1.6,
          ease: "expo.inOut",
          delay: delayOf(el),
          scrollTrigger: { trigger: el, start: "top 94%", toggleActions: PLAY_ONCE },
        });
      });

      all("[data-reveal-media]").forEach((el) => {
        const inner = el.querySelector<HTMLElement>(".media__inner");
        const tl = gsap.timeline({
          delay: delayOf(el),
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: PLAY_ONCE },
          onComplete: () => gsap.set(el, { clearProps: "clipPath" }),
        });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
        if (inner) tl.fromTo(inner, { scale: 1.32 }, { scale: 1, duration: 2, ease: "expo.out" }, 0.1);
      });

      all("[data-parallax]").forEach((el) => {
        const amt = (Number(el.dataset.parallax) || 0.06) * 100;
        gsap.fromTo(
          el,
          { yPercent: -amt },
          {
            yPercent: amt,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      all("[data-speed]").forEach((el) => {
        const s = Number(el.dataset.speed) || 0;
        if (!s) return;
        gsap.fromTo(
          el,
          { y: s * 70 },
          { y: s * -70, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      all("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count) || Number(el.textContent) || 0;
        const o = { v: 0 };
        el.textContent = "0";
        gsap.to(o, {
          v: end,
          duration: 2.2,
          ease: "power3.out",
          delay: delayOf(el),
          onUpdate: () => {
            el.textContent = String(Math.round(o.v));
          },
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: PLAY_ONCE },
        });
      });

      // Text splits need final glyph metrics, so wait for webfonts.
      document.fonts.ready.then(() => {
        if (!alive) return;
        ctx.add(() => {
          all("[data-split]").forEach((el) => {
            const chars = el.dataset.split === "chars";
            SplitText.create(el, {
              type: chars ? "lines,words,chars" : "lines",
              mask: "lines",
              linesClass: "split-line",
              autoSplit: true,
              onSplit(self) {
                return gsap.from(chars ? self.chars : self.lines, {
                  yPercent: 118,
                  duration: chars ? 1.25 : 1.35,
                  stagger: chars ? 0.022 : 0.11,
                  delay: delayOf(el),
                  scrollTrigger: { trigger: el, start: "top 88%", toggleActions: PLAY_ONCE },
                });
              },
            });
          });

          all("[data-scrub-words]").forEach((el) => {
            SplitText.create(el, {
              type: "words",
              wordsClass: "word",
              autoSplit: true,
              onSplit(self) {
                return gsap.to(self.words, {
                  color: "#ffffff",
                  stagger: 0.12,
                  ease: "none",
                  scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 42%", scrub: 0.4 },
                });
              },
            });
          });

          ScrollTrigger.refresh();
        });
      });

      return () => {
        alive = false;
      };
    });

    // Magnetic buttons: pointer devices only.
    mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
      const offs: (() => void)[] = [];
      all("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.38);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        offs.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
      return () => offs.forEach((f) => f());
    });

    // Late-loading images or fonts can shift layout; re-measure once everything is in.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  });

  return <span ref={anchor} hidden />;
}
