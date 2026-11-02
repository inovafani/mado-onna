"use client";

import { useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * The "pick a row, the picture follows" move used across pages (same feel as the home night timeline):
 * the active image fades in from a slight zoom, the active row's [data-more] panel opens to its
 * natural height, and its [data-bar] underline sweeps in.
 */
export function usePicker(root: RefObject<HTMLElement | null>, active: number, sel = { img: "[data-pick-img]", more: "[data-more]", bar: "[data-bar]" }) {
  const first = useRef(true);
  const refreshT = useRef<number | undefined>(undefined);

  useGSAP(
    () => {
      const q = (s: string) => gsap.utils.toArray<HTMLElement>(s, root.current);
      const instant = first.current || prefersReducedMotion();
      first.current = false;
      // Rapid hovering can switch rows faster than a crossfade lasts. Drop the previous transition
      // first, or its delayed fade-out lands after the new fade-in and blanks the picture.
      const mores = q(sel.more);
      gsap.killTweensOf([...q(sel.img), ...mores, ...mores.map((m) => m.firstElementChild), ...q(sel.bar)]);

      q(sel.img).forEach((img, i) => {
        if (i === active) {
          gsap.set(img, { zIndex: 1 });
          if (instant) gsap.set(img, { autoAlpha: 1, scale: 1 });
          else {
            gsap.fromTo(img, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: "mo" });
            gsap.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: "expo.out" });
          }
        } else {
          gsap.set(img, { zIndex: 0 });
          gsap.to(img, { autoAlpha: 0, duration: instant ? 0 : 0.7, delay: instant ? 0 : 0.2, ease: "mo" });
        }
      });

      q(sel.more).forEach((el, i) => {
        const on = i === active;
        const inner = el.firstElementChild as HTMLElement | null;
        if (instant) {
          gsap.set(el, { height: on ? "auto" : 0 });
          if (inner) gsap.set(inner, { autoAlpha: on ? 1 : 0 });
          return;
        }
        gsap.to(el, { height: on ? "auto" : 0, duration: 0.7, ease: "expo.out" });
        if (inner) gsap.to(inner, on ? { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.12 } : { autoAlpha: 0, y: -6, duration: 0.25 });
      });

      q(sel.bar).forEach((el, i) => {
        const on = i === active;
        if (instant) gsap.set(el, { scaleX: on ? 1 : 0 });
        else if (on) gsap.fromTo(el, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.9, ease: "expo.inOut" });
        else gsap.to(el, { scaleX: 0, transformOrigin: "right", duration: 0.7, ease: "expo.inOut" });
      });

      if (!instant) {
        // Rows changed height: re-measure triggers further down once things settle.
        window.clearTimeout(refreshT.current);
        refreshT.current = window.setTimeout(() => ScrollTrigger.refresh(), 750);
      }
    },
    { scope: root, dependencies: [active] },
  );
}
