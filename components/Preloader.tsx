"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { lockScroll, markIntroDone } from "@/lib/stores";

/**
 * Brand curtain. Server-rendered so it also hides the pre-hydration frame
 * (before GSAP has set initial states). Full sequence on first visit; a quick fade after.
 */
// Read once per page load: React's dev double-invoke would otherwise see the flag it just wrote.
let seenIntro: boolean | null = null;

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  // Navigating away mid-curtain must not leave the next page locked.
  useEffect(() => () => lockScroll("intro", false), []);

  useGSAP(
    () => {
      const el = ref.current!;
      // Coming back to a page Next kept alive: the curtain already lifted.
      if (el.style.display === "none") {
        markIntroDone();
        return;
      }
      if (prefersReducedMotion()) {
        el.style.display = "none";
        markIntroDone();
        return;
      }
      el.style.animation = "none";
      lockScroll("intro", true);

      if (seenIntro === null) {
        seenIntro = false;
        try {
          seenIntro = sessionStorage.getItem("mo-intro") === "1";
          sessionStorage.setItem("mo-intro", "1");
        } catch {}
      }
      const seen = seenIntro;

      const finish = () => {
        el.style.display = "none";
        lockScroll("intro", false);
      };

      if (seen || window.scrollY > 40) {
        gsap
          .timeline({ onComplete: finish })
          .add(markIntroDone, 0.15)
          .to(el, { autoAlpha: 0, duration: 0.7, ease: "mo" }, 0.15);
        return;
      }

      gsap
        .timeline({ onComplete: finish, defaults: { ease: "expo.out" } })
        .from(".preloader__mark", { yPercent: 35, autoAlpha: 0, duration: 1.3 })
        .from(".preloader__meta", { autoAlpha: 0, y: 8, duration: 0.9 }, "-=0.95")
        .to(".preloader__rule span", { scaleX: 1, duration: 1.1, ease: "expo.inOut" }, "-=0.9")
        .add(markIntroDone, "-=0.05")
        .to(".preloader__inner", { yPercent: -60, autoAlpha: 0, duration: 1, ease: "expo.in" }, "<")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.25, ease: "expo.inOut" }, "<0.1");
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="preloader" aria-hidden="true" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
      <div className="preloader__inner" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="preloader__mark" src="/assets/mark-white-t.png" alt="" />
        <div className="preloader__rule">
          <span />
        </div>
        <span className="preloader__meta">Berawa · Bali</span>
      </div>
    </div>
  );
}
