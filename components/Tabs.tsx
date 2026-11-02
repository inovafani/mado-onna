"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Item<T extends string> = { value: T; label: string };

/** Segmented pill control. A white pill slides under the active tab. */
export default function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: Item<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  const place = (animate: boolean) => {
    const i = items.findIndex((it) => it.value === value);
    const btn = root.current?.querySelectorAll<HTMLElement>(".mo-tabs__tab")[i];
    if (!btn || !ind.current) return;
    const to = { x: btn.offsetLeft, width: btn.offsetWidth };
    if (animate && !prefersReducedMotion()) gsap.to(ind.current, { ...to, duration: 0.7, ease: "expo.out" });
    else gsap.set(ind.current, to);
  };

  useGSAP(
    () => {
      place(placed.current);
      placed.current = true;
    },
    { dependencies: [value], scope: root },
  );

  // Labels change width once the webfont lands, and on resize.
  useEffect(() => {
    const again = () => place(false);
    document.fonts.ready.then(again);
    window.addEventListener("resize", again);
    return () => window.removeEventListener("resize", again);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div ref={root} className="mo-tabs" role="tablist" aria-label={label}>
      <span ref={ind} className="mo-tabs__ind" aria-hidden="true" />
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          role="tab"
          aria-selected={it.value === value}
          className={"mo-tabs__tab" + (it.value === value ? " is-on" : "")}
          onClick={() => onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
