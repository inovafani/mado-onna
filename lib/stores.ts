"use client";

import type Lenis from "lenis";

/* ---------- intro (preloader → hero handoff) ---------- */
let introDone = false;
const introSubs = new Set<() => void>();

export function onIntroDone(cb: () => void) {
  if (introDone) {
    cb();
    return () => {};
  }
  introSubs.add(cb);
  return () => {
    introSubs.delete(cb);
  };
}

export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  introSubs.forEach((f) => f());
  introSubs.clear();
}

/* ---------- smooth scroll ---------- */
let lenis: Lenis | null = null;
const locks = new Set<string>();

export function setLenis(l: Lenis | null) {
  lenis = l;
}

export function getLenis() {
  return lenis;
}

/** Lock page scroll for overlays. Keyed so several overlays can hold a lock. */
export function lockScroll(key: string, on: boolean) {
  if (on) locks.add(key);
  else locks.delete(key);
  const locked = locks.size > 0;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.6 });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (typeof el === "number") window.scrollTo({ top: el, behavior: "smooth" });
  else el?.scrollIntoView({ behavior: "smooth" });
}

/* ---------- booking ---------- */
export type Experience = "dinner" | "show" | "lounge" | "vip";

export function openBooking(exp: Experience | null = null) {
  window.dispatchEvent(new CustomEvent("mo:book", { detail: { exp } }));
}
