"use client";

import { useRef, useState, type RefObject } from "react";
import { gsap, Flip, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Filtering with GSAP Flip. Every item stays mounted and filtering only toggles `display`, so:
 * the items that are leaving fold away first, then the survivors glide into their new slots and
 * newcomers rise in. Items carry data-cat; `matches` decides visibility for a filter value.
 */
export function useFlipFilter<T extends string>(
  root: RefObject<HTMLElement | null>,
  initial: T,
  itemSel: string,
  matches: (cat: string, f: T) => boolean,
) {
  const [filter, setFilter] = useState<T>(initial);
  const pending = useRef<Flip.FlipState | null>(null);

  const change = (f: T) => {
    if (f === filter) return;
    if (prefersReducedMotion()) return setFilter(f);
    const els = gsap.utils.toArray<HTMLElement>(itemSel, root.current);
    const leaving = els.filter((el) => el.offsetParent !== null && !matches(el.dataset.cat ?? "", f));
    gsap.killTweensOf(els);
    const go = () => {
      pending.current = Flip.getState(els);
      setFilter(f);
    };
    if (!leaving.length) return go();
    gsap.to(leaving, { autoAlpha: 0, scale: 0.96, duration: 0.32, ease: "power2.in", stagger: 0.012, onComplete: go });
  };

  useGSAP(
    () => {
      const state = pending.current;
      pending.current = null;
      if (!state) return;
      const els = gsap.utils.toArray<HTMLElement>(itemSel, root.current);
      // Folded-away items are display:none now; reset them so they can come back cleanly later.
      gsap.set(
        els.filter((el) => el.offsetParent === null),
        { clearProps: "opacity,visibility,transform" },
      );
      Flip.from(state, {
        targets: els,
        duration: 0.95,
        ease: "expo.inOut",
        stagger: 0.015,
        onEnter: (entering) =>
          gsap.fromTo(entering, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.3, stagger: 0.04, ease: "expo.out" }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { scope: root, dependencies: [filter] },
  );

  return [filter, change] as const;
}
