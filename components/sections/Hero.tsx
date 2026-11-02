"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone, openBooking } from "@/lib/stores";
import { SLIDES, U } from "@/lib/data";
import { Button, Icon } from "@/components/ds";

const SLIDE_MS = 6.5;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);
  const [ready, setReady] = useState(false);
  const prev = useRef(0);
  const fill = useRef<gsap.core.Tween | null>(null);
  const visible = useRef(true);

  const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, root.current!);

  /* With cacheComponents the page is hidden by <Activity> on navigation, not unmounted: state and DOM
     survive while every GSAP context is reverted mid-flight, which can strand a slide off-centre.
     Start over on each return. Declared first so it runs before the GSAP effects below. */
  useLayoutEffect(() => {
    prev.current = 0;
    const els = q(".hero__slide, .hero__slide img");
    gsap.killTweensOf(els);
    gsap.set(els, { clearProps: "all" });
    return () => {
      setSlide(0);
      setReady(false);
    };
  }, []);

  /* Intro after the preloader lifts, plus the scroll-away. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, (ctx) => {
        let alive = true;
        const title = root.current!.querySelector<HTMLElement>(".hero__title")!;
        const firstImg = q(".hero__slide img")[0];
        gsap.set(".hero__bar > *", { autoAlpha: 0, y: 28 });
        gsap.set(title, { autoAlpha: 0 });
        gsap.set(firstImg, { scale: 1.3 });

        const off = onIntroDone(() => {
          document.fonts.ready.then(() => {
            if (!alive) return;
            ctx.add(() => {
              const split = SplitText.create(title, { type: "lines,words,chars", mask: "lines", linesClass: "split-line" });
              const accent = split.chars.filter((c) => (c as Element).closest(".hero__accent"));
              const plain = split.chars.filter((c) => !accent.includes(c));
              gsap.set(title, { autoAlpha: 1 });
              gsap
                .timeline({ delay: 0.2 })
                .to(firstImg, { scale: 1, duration: 3.2, ease: "expo.out" }, 0)
                .from(plain, { yPercent: 120, duration: 1.5, stagger: 0.026, ease: "expo.out" }, 0.1)
                // The serif words arrive last, leaning upright as they rise.
                .from(accent, { yPercent: 115, rotate: 7, autoAlpha: 0, duration: 1.8, stagger: 0.04, ease: "expo.out" }, 0.45)
                .to(".hero__bar > *", { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.12 }, 0.65)
                .add(() => setReady(true), 0.9);
            });
          });
        });

        // Scroll away: the picture sinks slower than the page, the copy lifts and fades.
        // Touch-only devices (iOS especially) scroll natively on the compositor while scrubbed
        // transforms trail a frame behind, so the picture judders. There, only fade.
        const touch = ScrollTrigger.isTouch === 1;
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        if (!touch) gsap.to(".hero__media", { yPercent: 24, ease: "none", scrollTrigger: st });
        gsap.to(".hero__content", { y: touch ? 0 : -90, autoAlpha: 0, ease: "none", scrollTrigger: { ...st, end: "60% top" } });
        gsap.to(".hero__shade", { opacity: 1.0, backgroundColor: "rgba(10,10,10,.35)", ease: "none", scrollTrigger: st });

        return () => {
          alive = false;
          off();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setReady(true);
      });

      // Pause the slideshow while the hero is offscreen.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          visible.current = self.isActive;
          if (self.isActive) fill.current?.resume();
          else fill.current?.pause();
        },
      });
    },
    { scope: root },
  );

  /* Slide change: a wipe from the right while the outgoing frame drifts left. */
  useGSAP(
    () => {
      const from = prev.current;
      prev.current = slide;
      if (from === slide) return;
      const slides = q(".hero__slide");
      const inEl = slides[slide];
      const outEl = slides[from];
      const inImg = inEl.querySelector("img")!;
      if (prefersReducedMotion()) {
        gsap.set(slides, { autoAlpha: 0, zIndex: 0 });
        gsap.set(inEl, { autoAlpha: 1 });
        return;
      }
      gsap.killTweensOf([inEl, outEl, inImg]);
      gsap.set(slides, { zIndex: 0 });
      gsap.set(outEl, { zIndex: 1 });
      gsap.set(inEl, { zIndex: 2, autoAlpha: 1, xPercent: 0 });
      gsap.fromTo(inEl, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" });
      gsap.fromTo(inImg, { scale: 1.18, xPercent: 8 }, { scale: 1, xPercent: 0, duration: 2.2, ease: "expo.out" });
      gsap.to(inImg, { scale: 1.06, duration: SLIDE_MS + 2, ease: "none", delay: 2.2 });
      gsap.to(outEl, {
        xPercent: -12,
        duration: 1.6,
        ease: "expo.inOut",
        onComplete: () => gsap.set(outEl, { autoAlpha: 0, xPercent: 0, clipPath: "none" }),
      });
    },
    { scope: root, dependencies: [slide] },
  );

  /* Progress bars double as the autoplay clock. */
  useEffect(() => {
    if (!ready) return;
    const fills = q(".hero__fill");
    gsap.set(fills, { scaleX: 0 });
    if (prefersReducedMotion()) {
      gsap.set(fills[slide], { scaleX: 1 });
      return;
    }
    fill.current = gsap.fromTo(
      fills[slide],
      { scaleX: 0 },
      { scaleX: 1, duration: SLIDE_MS, ease: "none", onComplete: () => setSlide((s) => (s + 1) % SLIDES.length) },
    );
    if (!visible.current || document.hidden) fill.current.pause();
    const onVis = () => (document.hidden || !visible.current ? fill.current?.pause() : fill.current?.resume());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      fill.current?.kill();
      fill.current = null;
    };
  }, [slide, ready]);

  return (
    <section ref={root} id="top" className="hero" data-screen-label="Home · Hero">
      <div className="hero__media">
        {SLIDES.map((s, i) => (
          <div key={s.label} className="hero__slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={U(s.img, 2000)} alt={s.alt} fetchPriority={i === 0 ? "high" : "auto"} decoding="async" />
          </div>
        ))}
      </div>
      <div className="hero__shade" />
      <div className="hero__content">
        <div className="hero__head">
          <h1 className="hero__title">
            One address,
            <br />
            <em className="hero__accent">one long night</em>
          </h1>
        </div>
        <div className="hero__bar">
          <div className="hero__where">
            <span>Berawa, Bali</span>
            <span>From dusk till dawn, under one roof</span>
          </div>
          <div className="hero__ctas">
            <Button variant="primary" size="lg" magnetic onClick={() => openBooking(null)} iconRight={<Icon name="arrow-right" />}>
              Reserve a table
            </Button>
            <Button size="lg" href="#night" magnetic>
              Explore the night
            </Button>
          </div>
          <div className="hero__dots">
            {SLIDES.map((s, i) => (
              <button
                key={s.label}
                className={"hero__dot" + (i === slide ? " is-on" : "")}
                aria-label={s.label}
                aria-current={i === slide}
                onClick={() => setSlide(i)}
              >
                <span className="hero__track">
                  <span className="hero__fill" />
                </span>
                <span className="hero__dot-label">
                  {s.time}
                  <br />
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
