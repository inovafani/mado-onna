"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip, useGSAP);
  // The design system's standard curve, cubic-bezier(.2,0,0,1).
  CustomEase.create("mo", "0.2,0,0,1");
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

/**
 * One-shot reveals. Deliberately not `once: true`: a once-trigger kills itself the moment it fires,
 * and when a page mounts already scrolled (client navigation, restored scroll) that happens inside
 * ScrollTrigger's refresh loop, shrinking its trigger list mid-iteration and crashing ("reading 'end'").
 */
export const PLAY_ONCE = "play none none none";

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
