"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { FAQS } from "@/lib/data";
import { Icon } from "@/components/ds";

export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const first = useRef(true);

  useGSAP(
    () => {
      const instant = first.current || prefersReducedMotion();
      first.current = false;
      gsap.utils.toArray<HTMLElement>(".faq__item", root.current).forEach((item, i) => {
        const on = i === open;
        const a = item.querySelector(".faq__a")!;
        const p = a.firstElementChild!;
        const icon = item.querySelector(".faq__icon")!;
        if (instant) {
          gsap.set(a, { height: on ? "auto" : 0 });
          gsap.set(icon, { rotation: on ? 45 : 0 });
          return;
        }
        gsap.to(a, { height: on ? "auto" : 0, duration: on ? 0.8 : 0.55, ease: "expo.out" });
        gsap.to(icon, { rotation: on ? 45 : 0, duration: 0.6, ease: "expo.out" });
        if (on) gsap.fromTo(p, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, delay: 0.1 });
      });
      if (!instant) gsap.delayedCall(0.85, () => ScrollTrigger.refresh());
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <section ref={root} className="faq section-pad" data-screen-label="Home · FAQ">
      <div className="wrap faq__grid">
        <div className="faq__intro">
          <h2 className="h-lg" data-split="lines">
            Good to know
          </h2>
          <p className="body-md" data-fade="">
            Anything else, message us on WhatsApp. A real person answers, usually within the hour.
          </p>
        </div>
        <div className="faq__list" data-stagger="">
          <div className="hairline" data-line="" />
          {FAQS.map((f, i) => (
            <div key={f.q} className="faq__item" data-item="">
              <button
                className="faq__q"
                aria-expanded={i === open}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span>{f.q}</span>
                <span className="faq__icon">
                  <Icon name="plus" />
                </span>
              </button>
              <div className="faq__a" id={`faq-${i}`} role="region">
                <p>{f.a}</p>
              </div>
              <span className="event__rule" data-line="" data-delay={String(0.1 + i * 0.07)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
