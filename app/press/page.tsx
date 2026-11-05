import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PageHeader } from "@/components/PageHero";
import { Icon, Media } from "@/components/ds";
import { U } from "@/lib/data";

export const metadata: Metadata = {
  title: "Press · Madò Onnà, Berawa",
  description: "News, imagery and facts for journalists, creators and partners.",
};

const RELEASES = [
  { date: "Oct 20, 2026", cat: "Season launch", title: "Bodrum Nights: our autumn show dinner opens November 5", desc: "A new theatrical dinner inspired by the Aegean coast, running Thursday to Saturday until December 19." },
  { date: "Sep 15, 2026", cat: "Membership", title: "Introducing the Onnà Circle, a members club for Berawa night-owls", desc: "Invitation-led membership with priority tables, monthly suppers and first access to guest DJ nights." },
  { date: "Aug 28, 2026", cat: "Opening", title: "Madò Onnà opens in Berawa: one roof, from dusk till dawn", desc: "A Mediterranean restaurant, show dinner, cocktail bars and club inspired by Mykonos, Tulum, Ibiza, Dubai and Bodrum." },
  { date: "Aug 01, 2026", cat: "Kitchen", title: "The menu: four coastlines, one charcoal grill", desc: "An introduction to the opening menu and the producers behind it." },
];

const FACTS = [
  ["Concept", "Mediterranean restaurant, show dinner, cocktail bars and club under one roof"],
  ["Location", "Jl. Pantai Berawa, Canggu, Bali"],
  ["Inspired by", "Mykonos, Tulum, Ibiza, Dubai and Bodrum"],
  ["Cuisine", "Italy, Greece, Morocco, Spain and the wider Mediterranean"],
  ["Spaces", "Restaurant, stage, lounge, club and street bar"],
  ["Capacity", "180 seated · 400 standing"],
  ["Music", "House and afrohouse from Bali residents and international guests"],
];

// No files are hosted yet, so each kit item asks the press office for it.
const ask = (what: string) => `mailto:press@madoonna.com?subject=${encodeURIComponent(`Press kit request: ${what}`)}`;

export default function Press() {
  return (
    <PageShell current="press">
      <PageHeader
        title="Press"
        sub={
          <p className="pt__lede">
            News, imagery and facts for journalists, creators and partners. For interviews, visits and review dinners, contact our press office.
          </p>
        }
        side={<Media ratio="16/10" src={U("1514362453360-8f94243c9996", 1400)} alt="A cocktail on the bar" loading="eager" />}
      />

      <section className="sec sec--flush-top section-pad">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-lg" data-split="lines">
              Announcements
            </h2>
            <span className="eyebrow" data-fade="">
              {RELEASES.length} releases
            </span>
          </div>
          <div className="releases" data-stagger="">
            {RELEASES.map((r) => (
              <div key={r.title} className="release" data-item="">
                <span className="eyebrow">{r.date}</span>
                <div className="release__copy">
                  <span className="eyebrow eyebrow--body">{r.cat}</span>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--rule section-pad">
        <div className="wrap fact-split">
          <div className="fact-split__copy">
            <h2 className="h-lg" data-split="lines">
              Fact sheet
            </h2>
            <p className="body-md" data-fade="">
              The short version of who we are. Feel free to quote it.
            </p>
          </div>
          <div className="facts" data-stagger="">
            {FACTS.map(([k, v]) => (
              <div key={k} className="fact" data-item="">
                <span className="eyebrow">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--flush-top section-pad">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-lg" data-split="lines">
              Press kit
            </h2>
          </div>
          <div className="kit" data-stagger="">
            <a className="kit__item" href={ask("logo pack")} data-item="">
              <span className="kit__visual kit__visual--logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo-white.png" alt="Madò Onnà logo" loading="lazy" />
              </span>
              <span className="kit__foot">
                <span>
                  <strong>Logo pack</strong>
                  <span className="eyebrow">PNG · SVG · 4 MB</span>
                </span>
                <span className="mo-iconbtn" aria-hidden="true">
                  <Icon name="download" />
                </span>
              </span>
            </a>
            <a className="kit__item" href={ask("photography")} data-item="">
              <span className="kit__visual kit__visual--pair">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={U("1722461079337-1775b8f61137", 500, 70)} alt="" loading="lazy" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={U("1534080564583-6be75777b70a", 500, 70)} alt="" loading="lazy" />
              </span>
              <span className="kit__foot">
                <span>
                  <strong>Photography</strong>
                  <span className="eyebrow">40 images · high-res</span>
                </span>
                <span className="mo-iconbtn" aria-hidden="true">
                  <Icon name="download" />
                </span>
              </span>
            </a>
            <a className="kit__item" href={ask("fact sheet")} data-item="">
              <span className="kit__visual kit__visual--doc">
                <span className="eyebrow eyebrow--body">Madò Onnà</span>
                <span>Fact sheet &amp; brand story</span>
              </span>
              <span className="kit__foot">
                <span>
                  <strong>Fact sheet</strong>
                  <span className="eyebrow">PDF · 2 pages</span>
                </span>
                <span className="mo-iconbtn" aria-hidden="true">
                  <Icon name="download" />
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="sec sec--flush-top section-pad">
        <div className="wrap press-office">
          <div className="hairline" data-line="" />
          <div className="press-office__row">
            <div>
              <span className="eyebrow">Press office</span>
              <a href="mailto:press@madoonna.com" className="press-office__mail" data-split="lines">
                press@madoonna.com
              </a>
            </div>
            <p className="body-md" data-fade="">
              We host review dinners Tuesday to Thursday and can arrange show and club access for features.
            </p>
          </div>
          <div className="hairline" data-line="" />
        </div>
      </section>
    </PageShell>
  );
}
