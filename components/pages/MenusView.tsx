"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getLenis, openBooking, type Experience } from "@/lib/stores";
import { usePicker } from "@/lib/usePicker";
import { U } from "@/lib/data";
import { Button, Icon } from "@/components/ds";
import Tabs from "@/components/Tabs";

type Dish = { n: string; d: string; p: string; tags?: string[] };
type Menu = {
  label: string;
  hours: string;
  img: string;
  title: string;
  intro: string;
  exp: Experience;
  aside: string;
  cta: string;
  setPrices?: { k: string; v: string }[];
  sections: { title: string; note: string; items: Dish[] }[];
};

const I = (n: string, d: string, p: string, tags?: string[]): Dish => ({ n, d, p, tags });

const MENUS = {
  carte: {
    label: "À la carte",
    hours: "Daily · 18:00 – 23:00",
    img: "1414235077428-338989a2e8c0",
    title: "À la carte",
    intro: "A menu that travels the whole Mediterranean in one sitting. Order a few plates to share, then something from the fire.",
    exp: "dinner",
    aside: "Tables from 18:00. Stay on after dinner; the lounge opens at 21:00.",
    cta: "Book dinner",
    sections: [
      { title: "To share", note: "Start here", items: [I("Burrata, heirloom tomato", "Basil oil, aged balsamic, grilled sourdough", "165", ["V"]), I("Mezze for the table", "Hummus, baba ghanoush, muhammara, warm pita", "195", ["V"]), I("Charred octopus", "Fava purée, capers, lemon, smoked paprika", "245", ["GF"]), I("Tuna crudo", "Blood orange, Calabrian chilli, fennel", "215", ["GF"])] },
      { title: "Pasta & rice", note: "Made in house", items: [I("Paccheri, lamb ragù", "Slow-cooked for eight hours, pecorino, mint", "225"), I("Linguine, Bali prawns", "Garlic, chilli, bottarga, parsley", "265"), I("Seafood paella for two", "Bomba rice, saffron, mussels, prawns, squid, alioli", "595", ["GF"]), I("Wild mushroom risotto", "Aged parmesan, thyme, truffle oil", "195", ["V", "GF"])] },
      { title: "From the fire", note: "Charcoal grill", items: [I("Whole sea bass", "Salmoriglio, grilled lemon, wild greens", "395", ["GF"]), I("Lamb kofta", "Tahini, pickled onions, sumac flatbread", "235"), I("Moroccan spiced chicken", "Preserved lemon, green olives, couscous", "245"), I("Wagyu striploin", "Chimichurri, charred leeks, smoked salt", "695", ["GF"])] },
      { title: "Sweet", note: "", items: [I("Pistachio baklava", "Rose ice cream, orange blossom", "125", ["V"]), I("Crema catalana", "Burnt sugar, citrus zest", "115", ["V", "GF"]), I("Tiramisù", "Espresso, mascarpone, cocoa", "125", ["V"])] },
    ],
  },
  show: {
    label: "Show dinner",
    hours: "Thu – Sat · seating 19:30",
    img: "1518834107812-67b0b7c58434",
    title: "Bodrum Nights",
    intro: "Our autumn show dinner: four courses from the Aegean coast, served between acts of dance, live vocals and music. Seating at 19:30, first act at 20:30, finale around 22:15.",
    exp: "show",
    aside: "Thursday to Saturday. Tables keep until midnight, then the club opens.",
    cta: "Book the show",
    setPrices: [
      { k: "Per guest", v: "1.250K" },
      { k: "Wine pairing", v: "+650K" },
      { k: "Courses", v: "4" },
    ],
    sections: [
      { title: "I · Meze", note: "Before the curtain", items: [I("Aegean meze", "Taramasalata, ezme, smoked aubergine, olives, warm pide", "", ["V option"])] },
      { title: "II · The sea", note: "First act", items: [I("Grilled prawns, rakı butter", "Dill, lemon, crispy shallots", "", ["GF"])] },
      { title: "III · The fire", note: "Second act", items: [I("Lamb shoulder, slow-roasted", "Smoked yoghurt, sumac onions, bulgur pilaf", ""), I("or Whole bream", "Herb salad, salt-baked lemon", "", ["GF"])] },
      { title: "IV · Sweet", note: "Finale", items: [I("Kaymak, honey & figs", "Pistachio, sesame tuile", "", ["V"])] },
    ],
  },
  cocktails: {
    label: "Cocktails",
    hours: "Daily · 16:00 – 03:00",
    img: "1587223962930-cb7f31384c19",
    title: "Cocktails",
    intro: "Built around Mediterranean botanicals and Indonesian spirits. If nothing here fits your mood, tell the bartender what you like and let them improvise.",
    exp: "lounge",
    aside: "From 21:00 the lounge takes over. Book a table or walk in to the bar.",
    cta: "Book the lounge",
    sections: [
      { title: "Signatures", note: "House favourites", items: [I("Onnà Negroni", "Gin, Campari, vermouth, olive leaf, orange oil", "195"), I("Aegean Spritz", "Aperol, prosecco, Bali lime, a pinch of sea salt", "175"), I("Marrakech Mule", "Vodka, mint tea, fresh ginger, lime", "185"), I("Berawa Sour", "Arak, passionfruit, lime, egg white", "175"), I("Fig & Smoke", "Mezcal, roasted fig, honey, bitters", "210"), I("Mykonos Martini", "Gin, dry vermouth, mastiha", "205")] },
      { title: "Zero proof", note: "No alcohol, full flavour", items: [I("Citrus garden", "Grapefruit, rosemary, tonic", "95", ["0%"]), I("Rose & cardamom", "Rose water, cardamom, soda, lemon", "95", ["0%"])] },
    ],
  },
  street: {
    label: "Street bar",
    hours: "Daily · 16:00 – 01:00 · walk-in",
    img: "1555939594-58d7cb561ad1",
    title: "The Street Bar",
    intro: "Facing Jl. Pantai Berawa. Casual Mediterranean bites and easy drinks, no reservation needed. Pull up a stool.",
    exp: "dinner",
    aside: "No booking for the street bar. Golden hour is the best seat in Berawa.",
    cta: "Book dinner instead",
    sections: [
      { title: "Bites", note: "", items: [I("Fried calamari", "Lemon, smoked alioli", "95"), I("Saffron arancini", "Mozzarella, romesco", "85", ["V"]), I("Chicken souvlaki pita", "Tzatziki, tomato, red onion, fries", "110"), I("Falafel wrap", "Tahini, pickles, chilli", "95", ["VG"]), I("Patatas bravas", "Spiced tomato, alioli", "75", ["V", "GF"])] },
      { title: "To drink", note: "", items: [I("Classic spritz", "Aperol, Campari or limoncello", "125"), I("Draft beer", "Local and imported", "75"), I("Glass of rosé", "Provence, by the glass", "115")] },
    ],
  },
} satisfies Record<string, Menu>;

type Key = keyof typeof MENUS;
const KEYS = Object.keys(MENUS) as Key[];

export default function MenusView() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<Key>("carte");
  const changed = useRef(false);
  const m: Menu = MENUS[tab];

  // /menus#show opens the show menu (links from the home timeline and What's on).
  useEffect(() => {
    const h = window.location.hash.slice(1) as Key;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (KEYS.includes(h)) setTab(h);
  }, []);

  usePicker(root, KEYS.indexOf(tab));

  // The new menu rises in line by line; the first paint is left to the page's scroll reveals.
  useGSAP(
    () => {
      if (!changed.current || prefersReducedMotion()) return;
      gsap.from("[data-mi]", { y: 26, autoAlpha: 0, duration: 1, stagger: 0.035, ease: "expo.out" });
    },
    { scope: root, dependencies: [tab] },
  );

  const pick = (k: Key) => {
    if (k === tab) return;
    changed.current = true;
    setTab(k);
    history.replaceState(null, "", "#" + k);
    // If the list has scrolled under the sticky bar, bring its top back into view.
    const top = root.current!.getBoundingClientRect().top;
    if (top < 0) getLenis()?.scrollTo(root.current!, { offset: -150, duration: 1.2 });
  };

  return (
    <>
      <div className="menus-bar section-pad">
        <div className="wrap menus-bar__inner">
          <div className="tabs-scroll">
            <Tabs label="Menus" items={KEYS.map((k) => ({ value: k, label: MENUS[k].label }))} value={tab} onChange={pick} />
          </div>
          <span className="eyebrow">{m.hours}</span>
        </div>
      </div>

      <section ref={root} className="sec section-pad menus">
        <div className="wrap menus__grid">
          <div key={tab} className="menus__main">
            <div className="menus__intro">
              <h2 className="h-xl" data-fade="" data-mi="">
                {m.title}
              </h2>
              <p className="body-lg" data-fade="" data-delay="0.08" data-mi="">
                {m.intro}
              </p>
              {m.setPrices && (
                <div className="menus__prices" data-mi="">
                  {m.setPrices.map((p) => (
                    <div key={p.k}>
                      <strong>{p.v}</strong>
                      <span className="eyebrow">{p.k}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {m.sections.map((sec) => (
              <div key={sec.title} className="menu-sec">
                <div className="menu-sec__head" data-fade="12" data-mi="">
                  <h3>{sec.title}</h3>
                  {sec.note && <span className="eyebrow">{sec.note}</span>}
                </div>
                {sec.items.map((it) => (
                  <div key={it.n} className="dish" data-fade="12" data-mi="">
                    <div className="dish__name">
                      <span>{it.n}</span>
                      {it.tags?.map((t) => (
                        <span key={t} className="dish__tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    {it.p && <span className="dish__price">{it.p}K</span>}
                    <p className="dish__desc">{it.d}</p>
                  </div>
                ))}
              </div>
            ))}

            <p className="menus__note" data-mi="">
              Prices in thousands of Indonesian rupiah and subject to 10% service and 11% tax. V vegetarian · VG vegan · GF gluten-free. Please tell
              your server about any allergies.
            </p>
          </div>

          <aside className="menus__aside">
            <div className="media media--arch menus__frame" data-reveal-media="">
              <div className="media__inner">
                {KEYS.map((k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={k} src={U(MENUS[k].img, 1100)} alt="" data-pick-img="" />
                ))}
              </div>
            </div>
            <div className="menus__card" data-fade="" data-delay="0.2">
              <p>{m.aside}</p>
              <Button variant="primary" onClick={() => openBooking(m.exp)} iconRight={<Icon name="arrow-right" />}>
                {m.cta}
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
