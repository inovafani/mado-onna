"use client";

import { useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { getLenis, onIntroDone, setLenis } from "@/lib/stores";

const NAV_OFFSET = -76;

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in lockstep. */
export default function SmoothScroll() {
  // Every load starts at the top, under the preloader. Scroll triggers are created on mount and
  // ScrollTrigger mis-measures when the browser has already jumped to a hash or restored a scroll
  // position. Mounted before every other client component so this runs first.
  useLayoutEffect(() => {
    const hash = window.location.hash;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (!hash || hash === "#" || hash === "#top") return;
    // Then glide to the requested section once the intro has played.
    return onIntroDone(() => {
      window.setTimeout(() => {
        const el = document.querySelector<HTMLElement>(hash);
        if (!el) return;
        const l = getLenis();
        if (l) l.scrollTo(el, { offset: NAV_OFFSET, duration: 1.8, force: true });
        else el.scrollIntoView();
      }, 1400);
    });
  }, []);

  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // In-page anchors: glide instead of jump; swallow placeholder "#" links.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='#']");
      if (!a) return;
      const href = a.getAttribute("href")!;
      e.preventDefault();
      if (href === "#") return;
      const target = href === "#top" ? 0 : document.querySelector<HTMLElement>(href);
      if (target === null) return;
      // Let any open overlay start closing (and release the scroll lock) first.
      window.setTimeout(() => {
        const l = getLenis();
        if (l) l.scrollTo(target, { offset: NAV_OFFSET, duration: 1.8, force: true });
        else if (typeof target === "number") window.scrollTo({ top: 0 });
        else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET });
      }, 60);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
