"use client";

import { useEffect, useRef, useState } from "react";
import { openBooking, type Experience } from "@/lib/stores";
import { useFlipFilter } from "@/lib/useFlipFilter";
import { U } from "@/lib/data";
import { Button } from "@/components/ds";
import Tabs from "@/components/Tabs";

const WEEK = [
  ["Mon", "Dinner & lounge", "Restaurant from 18:00, lounge from 21:00"],
  ["Tue", "Chef's table", "Six seats at the pass, by reservation"],
  ["Wed", "Club opens", "Members' supper, then the floor from 23:00"],
  ["Thu", "Show dinner", "Bodrum Nights · seating 19:30"],
  ["Fri", "Show + Afrohouse", "Show dinner, then guest DJs until 03:00"],
  ["Sat", "Show + Club", "The big one. Book early"],
  ["Sun", "Long Sunday", "Golden hour sets from 16:00"],
];
// WEEK index → Date.getDay()
const JS_DAY = [1, 2, 3, 4, 5, 6, 0];

/** The weekly rhythm. Today's column lights up (computed after mount: the page itself is static). */
export function WeekGrid() {
  const [today, setToday] = useState(-1);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setToday(new Date().getDay()), []);

  return (
    <div className="week" data-stagger="">
      {WEEK.map(([day, title, sub], i) => (
        <div key={day} className={"week__day" + (JS_DAY[i] === today ? " is-today" : "")} data-item="">
          <div className="week__top">
            <span className="eyebrow eyebrow--ink">{day}</span>
            {JS_DAY[i] === today && <span className="pill-tag">Today</span>}
          </div>
          <span className="week__title">{title}</span>
          <span className="week__sub">{sub}</span>
        </div>
      ))}
    </div>
  );
}

type Ev = { dow: string; day: string; mon: string; kind: string; time: string; title: string; desc: string; img: string; exp: Experience; cta: string; limited?: boolean };
const E = (dow: string, day: string, mon: string, kind: string, time: string, title: string, desc: string, img: string, exp: Experience, cta: string, limited?: boolean): Ev => ({ dow, day, mon, kind, time, title, desc, img, exp, cta, limited });

const EVENTS: Ev[] = [
  E("Thu", "05", "Nov", "Show dinner", "19:30", "Bodrum Nights · Premiere", "Opening night of the autumn season, with a welcome glass on the terrace.", "1722461079337-1775b8f61137", "show", "Book", true),
  E("Fri", "06", "Nov", "Club", "23:00", "Afrohouse Fridays", "Residents warm up; a guest selector from Tulum closes the night.", "1470225620780-dba8ba36b745", "vip", "VIP table"),
  E("Sat", "07", "Nov", "Show dinner", "19:30", "Bodrum Nights", "Second performance of the season. Late seating flows into the club.", "1495791185843-c73f2269f669", "show", "Book"),
  E("Sun", "08", "Nov", "Day to night", "16:00", "Long Sunday", "Spritz at golden hour, a family-style feast and a sunset set that runs into the evening.", "1555939594-58d7cb561ad1", "dinner", "Book"),
  E("Wed", "11", "Nov", "Members", "20:00", "Circle supper: a Sardinian table", "One long table, one guest chef, one island. For members and their guests.", "1519671482749-fd09be7ccebf", "dinner", "RSVP"),
  E("Fri", "13", "Nov", "Club", "23:00", "Mykonos Sessions", "Deep, melodic house inspired by the island's beach clubs, with live percussion.", "1545128485-c400e7702796", "vip", "VIP table"),
  E("Sat", "14", "Nov", "Show dinner", "19:30", "Bodrum Nights · Live strings", "A special edition with a string quartet joining the second act.", "1415201364774-f6f0bb35f28f", "show", "Book", true),
  E("Thu", "19", "Nov", "Lounge", "21:00", "Negroni Week", "Five bartenders, five takes on the classic, one long night at the lounge bar.", "1514362453360-8f94243c9996", "lounge", "Book"),
  E("Sat", "28", "Nov", "Club", "23:00", "Full Moon at Onnà", "Our monthly full moon party, with fire performers on the terrace.", "1563784462386-044fd95e9852", "vip", "VIP table"),
  E("Thu", "31", "Dec", "Special", "19:00", "New Year's Eve: Dusk till Dawn", "A five-course dinner, the full show, and a countdown on the dance floor.", "1467810563316-b5476525c0f9", "show", "Enquire", true),
];

const FILTERS = [
  { value: "all", label: "All" },
  { value: "Show dinner", label: "Show dinner" },
  { value: "Club", label: "Club" },
  { value: "Members", label: "Members" },
  { value: "Other", label: "Day & lounge" },
];
const matches = (kind: string, f: string) => f === "all" || (f === "Other" ? ["Day to night", "Lounge", "Special"].includes(kind) : kind === f);

/** Filterable calendar; the filter animation is GSAP Flip (see useFlipFilter). */
export function EventsGrid() {
  const root = useRef<HTMLDivElement>(null);
  const [filter, change] = useFlipFilter<string>(root, "all", ".ev", matches);

  return (
    <div ref={root}>
      <div className="sec-head">
        <h2 className="h-xl" data-split="chars">
          Coming up
        </h2>
        <div className="tabs-scroll" data-fade="">
          <Tabs label="Filter events" items={FILTERS} value={filter} onChange={change} />
        </div>
      </div>
      <div className="evs">
        {EVENTS.map((e, i) => (
          <article key={e.day + e.title} className="ev" data-cat={e.kind} style={{ display: matches(e.kind, filter) ? undefined : "none" }}>
            <div className="media ev__media" style={{ aspectRatio: "4/5" }} data-reveal-media="" data-delay={(i % 3) * 0.08}>
              <div className="media__inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={U(e.img, 900)} alt={e.title} loading="lazy" />
              </div>
              <div className="ev__date">
                <span>{e.dow}</span>
                <strong>{e.day}</strong>
                <span>{e.mon}</span>
              </div>
              {e.limited && <span className="pill-tag ev__limited">Few tables left</span>}
            </div>
            <span className="eyebrow">
              {e.kind} · {e.time}
            </span>
            <h3 className="ev__title">{e.title}</h3>
            <p className="ev__desc">{e.desc}</p>
            <div>
              <Button onClick={() => openBooking(e.exp)}>{e.cta}</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
