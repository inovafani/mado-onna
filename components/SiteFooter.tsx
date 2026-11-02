"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { PAGES } from "@/lib/data";
import { Icon, IconButton } from "@/components/ds";

export default function SiteFooter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // The wordmark rises out of the floor as the page runs out.
        gsap.fromTo(
          ".footer__logo img",
          { yPercent: 55, autoAlpha: 0.15, scale: 0.94 },
          {
            yPercent: 0,
            autoAlpha: 0.95,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: ".footer__logo", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="footer">
      <div className="hairline" data-line="" />
      <div className="wrap footer__cols" data-stagger="">
        <div className="footer__col" data-item="">
          <span className="eyebrow">Visit</span>
          <span>
            Jl. Pantai Berawa
            <br />
            Canggu, Bali 80361
            <br />
            Indonesia
          </span>
          <a href="https://maps.google.com/?q=-8.6634,115.1392" target="_blank" rel="noreferrer" className="footer__strong">
            Get directions <Icon name="arrow-up-right" size={14} />
          </a>
        </div>
        <div className="footer__col" data-item="">
          <span className="eyebrow">Hours</span>
          <span>
            Street bar · daily 16:00
            <br />
            Restaurant · daily 18:00
            <br />
            Show dinner · Thu–Sat 19:30
            <br />
            Club · Wed–Sun until 03:00
          </span>
        </div>
        <div className="footer__col" data-item="">
          <span className="eyebrow">Explore</span>
          {PAGES.map((p) => (
            <Link key={p.key} href={p.href}>
              {p.label}
            </Link>
          ))}
        </div>
        <div className="footer__col" data-item="">
          <span className="eyebrow">Talk to us</span>
          <a href="https://wa.me/628113800600" target="_blank" rel="noreferrer">
            WhatsApp +62 811 3800 600
          </a>
          <a href="mailto:hello@madoonna.com">hello@madoonna.com</a>
          <a href="mailto:events@madoonna.com">events@madoonna.com</a>
          <div className="footer__socials">
            <IconButton icon="instagram" label="Instagram" />
            <IconButton icon="facebook" label="Facebook" />
            <IconButton icon="youtube" label="YouTube" />
          </div>
        </div>
      </div>
      <div className="footer__logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-gold.webp" alt="Madò Onnà, Restaurant & Show Dinner, Mediterranean Soul" width={1440} height={916} loading="lazy" />
      </div>
      <div className="wrap footer__base">
        <span>© 2026 Madò Onnà · Berawa, Bali</span>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">House rules</a>
          <a href="#">Careers</a>
        </div>
      </div>
    </footer>
  );
}
