"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, prefersReducedMotion } from "@/lib/gsap";
import { lockScroll, onIntroDone, type Experience } from "@/lib/stores";
import { EXPS, PAGES, U } from "@/lib/data";
import { Button, Checkbox, Icon, IconButton, Input, Select } from "@/components/ds";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const OCCASIONS = ["Just because", "Birthday", "Anniversary", "Date night", "Business dinner", "Celebration with friends"];
const EXP_KEYS = Object.keys(EXPS) as Experience[];

function nextDays(n = 14) {
  const out: Date[] = [];
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(t);
    d.setDate(t.getDate() + i);
    out.push(d);
  }
  return out;
}

export default function SiteNav({ current = "home" }: { current?: string }) {
  const header = useRef<HTMLElement>(null);
  const menuEl = useRef<HTMLDivElement>(null);
  const bookEl = useRef<HTMLElement>(null);
  const scrimEl = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const overlayOpen = useRef(false);

  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hover, setHover] = useState(() => Math.max(0, PAGES.findIndex((p) => p.key === current)));

  const [book, setBook] = useState(false);
  const [step, setStep] = useState(0);
  const [exp, setExp] = useState<Experience | null>(null);
  const [days, setDays] = useState<Date[]>([]);
  const [date, setDate] = useState<number | null>(null);
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [insider, setInsider] = useState(false);
  const [done, setDone] = useState(false);
  const [ref, setRef] = useState("");
  const guestDir = useRef(1);

  const openBook = useCallback((e: Experience | null) => {
    const ok = e && EXPS[e] ? e : null;
    setDays(nextDays());
    setMenu(false);
    setBook(true);
    setStep(ok ? 1 : 0);
    setExp(ok);
    setDate(null);
    setTime(null);
    setDone(false);
  }, []);

  /* window-level listeners */
  useEffect(() => {
    const onBook = (e: Event) => openBook((e as CustomEvent<{ exp: Experience | null }>).detail?.exp ?? null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setBook(false);
      }
    };
    window.addEventListener("mo:book", onBook);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mo:book", onBook);
      window.removeEventListener("keydown", onKey);
    };
  }, [openBook]);

  useEffect(() => {
    overlayOpen.current = menu || book;
    lockScroll("menu", menu);
    lockScroll("book", book);
    if (menu || book) gsap.to(header.current, { yPercent: 0, duration: 0.6, ease: "expo.out" });
  }, [menu, book]);

  // Leaving the page (a menu link) unmounts this nav while the menu is open: release its locks.
  useEffect(
    () => () => {
      lockScroll("menu", false);
      lockScroll("book", false);
      document.documentElement.removeAttribute("data-nav-hidden");
    },
    [],
  );

  /* header: intro, solid background, hide on scroll down / show on scroll up */
  useGSAP(
    () => {
      let isSolid = false;
      let hidden = false;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          const s = y > 40;
          if (s !== isSolid) {
            isSolid = s;
            setSolid(s);
          }
          if (prefersReducedMotion()) return;
          const hide = self.direction === 1 && y > 320 && !overlayOpen.current;
          if (hide !== hidden) {
            hidden = hide;
            // Sticky page bars (menus, filters) slide up into the space the header leaves.
            document.documentElement.toggleAttribute("data-nav-hidden", hide);
            gsap.to(header.current, { yPercent: hide ? -100 : 0, duration: hide ? 0.5 : 0.8, ease: hide ? "power3.in" : "expo.out" });
          }
        },
      });

      gsap.matchMedia().add(MOTION_OK, () => {
        const parts = [".nav__side--start > *", ".nav__brand", ".nav__side--end > *"];
        const intro = gsap.fromTo(
          parts,
          { autoAlpha: 0, y: -16 },
          { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, delay: 0.55, paused: true },
        );
        const off = onIntroDone(() => intro.play());
        return () => off();
      });
    },
    { scope: header },
  );

  /* menu overlay timeline */
  useGSAP(
    () => {
      const el = menuEl.current!;
      const tl = gsap.timeline({ paused: true });
      if (prefersReducedMotion()) {
        tl.set(el, { visibility: "visible", clipPath: "none" }).fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      } else {
        tl.set(el, { visibility: "visible" })
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "expo.inOut" })
          .fromTo(".menu__label > span", { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.045, ease: "expo.out" }, 0.4)
          .fromTo(".menu__item", { "--rule": 0 }, { "--rule": 1, duration: 1.2, stagger: 0.045, ease: "expo.inOut" }, 0.35)
          .fromTo(".menu__num, .menu__here", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.03 }, 0.6)
          .fromTo(".menu__arch", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" }, 0.4)
          .fromTo(".menu__arch-inner", { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.5)
          .fromTo(".menu__info > div", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.8);
      }
      menuTl.current = tl;
    },
    { scope: menuEl },
  );

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (menu) tl.timeScale(1).play();
    else if (tl.progress() > 0) tl.timeScale(2.2).reverse();
  }, [menu]);

  /* menu image follows the hovered link */
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".menu__arch img", menuEl.current).forEach((img, i) => {
        if (i === hover) {
          gsap.fromTo(img, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.9, ease: "expo.out", overwrite: true });
        } else gsap.to(img, { opacity: 0, duration: 0.5, ease: "mo", overwrite: true });
      });
    },
    { scope: menuEl, dependencies: [hover] },
  );

  /* booking drawer open / close */
  useGSAP(
    () => {
      const aside = bookEl.current!;
      const scrim = scrimEl.current!;
      const fast = prefersReducedMotion();
      if (book) {
        gsap.set(aside, { visibility: "visible" });
        gsap.to(scrim, { opacity: 1, pointerEvents: "auto", duration: fast ? 0 : 0.5, ease: "mo" });
        gsap.fromTo(aside, { xPercent: 102, x: 0 }, { xPercent: 0, x: 0, duration: fast ? 0 : 1, ease: "expo.out" });
      } else {
        gsap.to(scrim, { opacity: 0, pointerEvents: "none", duration: fast ? 0 : 0.35, ease: "mo" });
        gsap.to(aside, {
          xPercent: 102,
          duration: fast ? 0 : 0.6,
          ease: "expo.inOut",
          onComplete: () => gsap.set(aside, { visibility: "hidden" }),
        });
      }
    },
    { dependencies: [book] },
  );

  const shownStep = done ? 3 : step;

  /* step transitions inside the drawer */
  useGSAP(
    () => {
      if (!book) return;
      const fast = prefersReducedMotion();
      gsap.to(".book__progress span", { scaleX: Math.min(1, (shownStep + 1) / 3), duration: fast ? 0 : 0.8, ease: "expo.out" });
      if (fast) return;
      gsap.fromTo(
        ".book__step > *",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, delay: 0.15, ease: "expo.out" },
      );
      if (shownStep === 3) {
        gsap.fromTo(".book__done-arch", { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: "expo.out", delay: 0.1 });
        gsap.fromTo(".book__done-arch .mo-icon", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(2)", delay: 0.6 });
      }
    },
    { scope: bookEl, dependencies: [shownStep, book, exp] },
  );

  /* guest counter ticks up or down */
  useGSAP(
    () => {
      if (!book || prefersReducedMotion()) return;
      gsap.fromTo(".book__guest-count", { yPercent: 60 * guestDir.current, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "expo.out" });
    },
    { scope: bookEl, dependencies: [guests] },
  );

  /* ---------- derived booking state ---------- */
  const ex = exp ? EXPS[exp] : null;
  const dsel = date != null ? days[date] : null;
  const dateStr = dsel ? `${DOW[dsel.getDay()]}, ${MON[dsel.getMonth()]} ${String(dsel.getDate()).padStart(2, "0")}` : "";
  const canNext =
    shownStep === 0 ? !!ex : shownStep === 1 ? date != null && !!time : shownStep === 2 ? name.trim().length > 1 && phone.trim().length > 5 : false;
  const next = () => {
    if (!canNext) return;
    if (shownStep === 2) {
      setDone(true);
      setRef("MO-" + Math.floor(1000 + Math.random() * 9000));
    } else setStep(shownStep + 1);
  };
  const footNote =
    shownStep === 0
      ? "No deposit for dinner"
      : shownStep === 1
        ? exp === "vip"
          ? "Minimum spend applies"
          : "Free cancellation up to 24h"
        : shownStep === 2
          ? "Takes under a minute"
          : "Confirmation on WhatsApp";
  const firstName = name.trim().split(" ")[0] || "friend";

  return (
    <>
      <header ref={header} className={"nav" + (solid || menu ? " is-solid" : "") + (menu ? " menu-open" : "")}>
        <div className="nav__side nav__side--start">
          <button className="nav__menu-btn" onClick={() => setMenu((m) => !m)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}>
            <span className="nav__burger">
              <span />
              <span />
            </span>
            <span className="nav__label">
              <span>Menu</span>
              <span>Close</span>
            </span>
          </button>
          <Link href="/whats-on" className="nav__link" style={{ padding: 0 }} onClick={() => setMenu(false)}>
            What&apos;s on
          </Link>
        </div>
        <Link href="/" className="nav__brand" aria-label="Madò Onnà home" onClick={() => setMenu(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/mark-white-t.png" alt="Madò Onnà" width={474} height={622} />
        </Link>
        <div className="nav__side nav__side--end">
          <Link href="/menus" className="nav__link">
            Menus
          </Link>
          <Button variant="primary" size="sm" onClick={() => openBook(null)}>
            Reserve
          </Button>
        </div>
      </header>

      {/* full-screen menu */}
      <div ref={menuEl} className="menu" aria-hidden={!menu} data-lenis-prevent="">
        <div className="menu__inner">
          <nav className="menu__nav">
            {PAGES.map((p, i) => (
              <Link
                key={p.key}
                href={p.href}
                tabIndex={menu ? 0 : -1}
                className={"menu__item" + (hover === i ? " is-hover" : "")}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onClick={() => setMenu(false)}
              >
                <span className="menu__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="menu__label">
                  <span>
                    <span className="menu__label-text">{p.label}</span>
                  </span>
                </span>
                {p.key === current && <span className="menu__here">You are here</span>}
              </Link>
            ))}
          </nav>
          <div className="menu__aside">
            <div className="menu__arch">
              <div className="menu__arch-inner" style={{ position: "absolute", inset: 0 }}>
                {PAGES.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.key} src={U(p.img, 900, 75)} alt="" loading="lazy" />
                ))}
              </div>
            </div>
            <div className="menu__info">
              <div>
                <span className="eyebrow">Find us</span>
                <p>
                  Jl. Pantai Berawa, Canggu
                  <br />
                  Bali 80361, Indonesia
                </p>
              </div>
              <div>
                <span className="eyebrow">Tonight</span>
                <p>
                  Dinner from 18:00
                  <br />
                  Club until 03:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* booking drawer */}
      <div ref={scrimEl} className="book-scrim" onClick={() => setBook(false)} />
      <aside ref={bookEl} className="book" aria-label="Reserve" aria-hidden={!book} role="dialog" aria-modal="true">
        <div className="book__head">
          <div>
            {shownStep > 0 && shownStep < 3 && (
              <IconButton variant="ghost" size="sm" icon="arrow-left" label="Back" onClick={() => setStep(Math.max(0, step - 1))} />
            )}
            <span className="eyebrow eyebrow--ink">{shownStep === 3 ? "Reservation requested" : `Reserve · Step ${shownStep + 1} of 3`}</span>
          </div>
          <IconButton size="sm" icon="x" label="Close" onClick={() => setBook(false)} />
        </div>
        <div className="book__progress">
          <span />
        </div>

        <div className="book__body" data-lenis-prevent="">
          {shownStep === 0 && (
            <div className="book__step" key="s0">
              <div className="book__stack">
                <h2 className="book__title">How would you like to spend the night?</h2>
                <p className="body-md">Start with dinner and stay for the show, or arrive late and head straight to the club.</p>
              </div>
              <div className="book__stack">
                {EXP_KEYS.map((k) => {
                  const e = EXPS[k];
                  return (
                    <button
                      key={k}
                      className="book__exp"
                      onClick={() => {
                        setExp(k);
                        setStep(1);
                        setDate(null);
                        setTime(null);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={U(e.img, 200)} alt="" />
                      <span className="book__exp-text">
                        <span className="book__exp-title">{e.title}</span>
                        <span className="book__exp-desc">{e.desc}</span>
                        <span className="eyebrow eyebrow--body">{e.meta}</span>
                      </span>
                      <Icon name="arrow-right" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {shownStep === 1 && ex && (
            <div className="book__step" key={"s1" + exp}>
              <div className="book__stack">
                <span className="eyebrow">{ex.title}</span>
                <h2 className="book__title">Pick a night</h2>
              </div>
              <div className="book__stack book__stack--lg" style={{ gap: 12 }}>
                <div className="book__row">
                  <span className="eyebrow eyebrow--body">Date</span>
                  <span className="book__note">{ex.meta}</span>
                </div>
                <div className="book__dates">
                  {days.map((d, i) => {
                    const ok = ex.days.includes(d.getDay());
                    return (
                      <button
                        key={i}
                        className={"book__date" + (date === i ? " is-on" : "")}
                        disabled={!ok}
                        onClick={() => ok && setDate(i)}
                      >
                        <small>{i === 0 ? "Today" : DOW[d.getDay()]}</small>
                        <strong>{d.getDate()}</strong>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="book__guests">
                <span className="eyebrow eyebrow--body">Guests</span>
                <div>
                  <IconButton
                    size="sm"
                    icon="minus"
                    label="Fewer guests"
                    onClick={() => {
                      guestDir.current = -1;
                      setGuests((g) => Math.max(1, g - 1));
                    }}
                  />
                  <span style={{ overflow: "hidden", display: "inline-block" }}>
                    <span className="book__guest-count">{guests}</span>
                  </span>
                  <IconButton
                    size="sm"
                    icon="plus"
                    label="More guests"
                    onClick={() => {
                      guestDir.current = 1;
                      setGuests((g) => Math.min(20, g + 1));
                    }}
                  />
                </div>
              </div>
              <div className="book__stack" style={{ gap: 12 }}>
                <span className="eyebrow eyebrow--body">Arrival time</span>
                <div className="book__times">
                  {ex.times.map((t) => (
                    <button key={t} className={"book__time" + (time === t ? " is-on" : "")} onClick={() => setTime(t)}>
                      {t}
                    </button>
                  ))}
                </div>
                {guests >= 10 && (
                  <p className="book__note">
                    Ten or more? Our events team can hold a section for you.{" "}
                    <Link href="/private-hire#enquire" onClick={() => setBook(false)}>
                      Plan a private event
                    </Link>
                  </p>
                )}
              </div>
            </div>
          )}

          {shownStep === 2 && ex && (
            <div className="book__step" key="s2">
              <div className="book__stack">
                <span className="eyebrow">
                  {ex.title} · {dateStr} · {time} · {guests} guests
                </span>
                <h2 className="book__title">Who are we expecting?</h2>
              </div>
              <div className="book__stack book__stack--lg">
                <Input label="Full name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                <Input
                  label="WhatsApp"
                  placeholder="+62"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  hint="We confirm every booking on WhatsApp"
                  autoComplete="tel"
                  inputMode="tel"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Select label="Occasion" options={OCCASIONS} value={occasion} onChange={(e) => setOccasion(e.target.value)} />
                <Checkbox
                  label="Keep me on the insider list for shows and guest DJs"
                  checked={insider}
                  onChange={(e) => setInsider(e.target.checked)}
                />
              </div>
            </div>
          )}

          {shownStep === 3 && ex && (
            <div className="book__step" key="s3" style={{ paddingTop: 24 }}>
              <div className="book__done-arch">
                <Icon name="check" size={20} />
              </div>
              <div className="book__stack">
                <span className="eyebrow">Request {ref}</span>
                <h2 className="book__title">See you at the arch, {firstName}</h2>
                <p className="body-md">
                  We&apos;ve received your request and will confirm on WhatsApp shortly. Smart-casual, and leave room for dessert.
                </p>
              </div>
              <div style={{ borderTop: "1px solid var(--color-hairline)" }}>
                {[
                  ["Experience", ex.title],
                  ["Date", dateStr],
                  ["Arrival", time ?? ""],
                  ["Guests", String(guests)],
                ].map(([k, v]) => (
                  <div key={k} className="book__recap">
                    <span className="eyebrow" style={{ lineHeight: "20px" }}>
                      {k}
                    </span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="book__foot">
          <span className="book__note">{footNote}</span>
          {shownStep < 3 ? (
            <Button variant="primary" disabled={!canNext} onClick={next}>
              {shownStep === 2 ? "Request booking" : "Continue"}
            </Button>
          ) : (
            <Button onClick={() => setBook(false)}>Done</Button>
          )}
        </div>
      </aside>
    </>
  );
}
