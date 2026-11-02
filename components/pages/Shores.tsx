"use client";

import { useRef, useState } from "react";
import { U } from "@/lib/data";
import { usePicker } from "@/lib/usePicker";

const SHORES = [
  { name: "Mykonos", habit: "The long lunch", body: "Lunches that quietly become parties. We borrowed the idea that a table can turn into a dance floor without anyone noticing the moment it happened.", img: "1570077188670-e3a8d69ac5ff" },
  { name: "Tulum", habit: "Barefoot glamour", body: "Candlelight, raw textures and music that sounds like it came from the jungle. Dressed-up, but never buttoned-up.", img: "1552733407-5d5c46c3bb3b" },
  { name: "Ibiza", habit: "The dinner show", body: "The island that taught the world dinner could be theatre. Our stage borrows that ambition and keeps it close to the table.", img: "1505236858219-8359eb29e329" },
  { name: "Dubai", habit: "Hospitality, perfected", body: "Service that anticipates. A host who knows your name, your drink, and when to leave you alone.", img: "1572116469696-31de0f17cc34" },
  { name: "Bodrum", habit: "The Aegean table", body: "Grilled fish, meze in no particular order, rakı and the sea at night. The flavour of our first season.", img: "1533105079780-92b9be482077" },
];

/** Five shores: hover a place, its habit opens and the arch photo follows. */
export default function Shores() {
  const root = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);
  usePicker(root, on);

  return (
    <div ref={root} className="pick">
      <div className="pick__list" data-stagger="">
        {SHORES.map((s, i) => (
          <button
            key={s.name}
            type="button"
            className={"pick-row shore" + (i === on ? " is-on" : "")}
            aria-expanded={i === on}
            onMouseEnter={() => setOn(i)}
            onFocus={() => setOn(i)}
            onClick={() => setOn(i)}
            data-item=""
          >
            <span className="shore__head">
              <span className="shore__name">{s.name}</span>
              <span className="eyebrow">{s.habit}</span>
            </span>
            <span className="pick-row__more" data-more="">
              <span className="pick-row__body">{s.body}</span>
            </span>
            <span className="pick-row__rule">
              <span data-bar="" />
            </span>
          </button>
        ))}
      </div>
      <div className="pick__sticky">
        <div className="media media--arch pick__frame" data-reveal-media="">
          <div className="media__inner">
            {SHORES.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.name} src={U(s.img, 1100)} alt={s.name} data-pick-img="" loading="lazy" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
