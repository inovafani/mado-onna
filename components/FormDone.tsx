"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Icon } from "@/components/ds";

/** Thank-you state for the enquiry and contact forms: the arch draws itself, the tick pops in. */
export default function FormDone({ title, text }: { title: string; text: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline()
          .fromTo(".done__arch path", { strokeDashoffset: 260 }, { strokeDashoffset: 0, duration: 1.4, ease: "expo.inOut" })
          .from(".done__check", { scale: 0, autoAlpha: 0, duration: 0.7, ease: "back.out(2)" }, 0.9)
          .from(".done > :not(.done__mark)", { y: 20, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.5);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="done" role="status">
      <span className="done__mark">
        <svg className="done__arch" viewBox="0 0 72 90" fill="none" aria-hidden="true">
          <path d="M1 90V36a35 35 0 0 1 70 0v54" stroke="currentColor" strokeWidth="1" strokeDasharray="260" />
        </svg>
        <span className="done__check">
          <Icon name="check" size={20} />
        </span>
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
