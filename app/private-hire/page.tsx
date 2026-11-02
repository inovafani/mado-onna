import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { SpacesTable, EnquiryForm } from "@/components/pages/PrivateHireView";
import { Button, Media } from "@/components/ds";
import { U } from "@/lib/data";

export const metadata: Metadata = {
  title: "Private hire & weddings · Madò Onnà, Berawa",
  description: "From a table of twelve to a full buyout for 400. Dinner, a show written for you, and a dance floor to finish.",
};

const OCCASIONS = [
  { t: "Weddings", d: "Ceremony welcome drinks, a long-table dinner, a show and the first dance on our floor.", img: "1520854221256-17451cc331bf", arch: true },
  { t: "Birthdays", d: "Tables with a host, a cake moment the whole room joins, and a playlist that knows your year.", img: "1467810563316-b5476525c0f9" },
  { t: "Corporate", d: "Team dinners, client evenings and offsites that people actually talk about on Monday.", img: "1519671482749-fd09be7ccebf" },
  { t: "Brand launches", d: "Full production support: stage, lighting, sound and a performance cast to fit your story.", img: "1460723237483-7a6dc9d0b212" },
];

const WEDDING = [
  ["17:30", "Welcome spritz and canapés on the terrace"],
  ["19:00", "Long-table Mediterranean dinner, speeches between courses"],
  ["21:30", "A private show, choreographed around your story"],
  ["23:00", "The club opens for your guests only, until 03:00"],
];

export default function PrivateHire() {
  return (
    <PageShell current="private">
      <PageHero
        size="lg"
        img={U("1511795409834-ef04bbd61622", 2000)}
        alt="A long table dressed with flowers and candles"
        title={
          <>
            Your night, <em className="accent">your rules</em>
          </>
        }
        aside={
          <>
            <p>From a table of twelve to a full buyout for 400. Dinner, a show written for you, and a dance floor to finish.</p>
            <div className="ph__ctas">
              <Button variant="primary" size="lg" href="#enquire">
                Make an enquiry
              </Button>
              <Button size="lg" href="#spaces">
                See the spaces
              </Button>
            </div>
          </>
        }
      />

      <section className="sec section-pad">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-xl" data-split="chars">
              What are we celebrating?
            </h2>
          </div>
          <div className="occasions">
            {OCCASIONS.map((o, i) => (
              <div key={o.t} className={"occasion" + (i % 2 ? " occasion--low" : "")}>
                <Media ratio="3/4" arch={o.arch} src={U(o.img, 1000)} alt={o.t} delay={i * 0.08} speed={i % 2 ? 0.4 : 0} />
                <h3 data-fade="16">{o.t}</h3>
                <p data-fade="16" data-delay="0.08">
                  {o.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="spaces" className="sec sec--rule section-pad anchor">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-xl" data-split="lines">
              Pick a room, or take them all
            </h2>
          </div>
          <SpacesTable />
        </div>
      </section>

      <section className="wed">
        <div className="wed__media">
          <div className="wed__img" data-parallax="0.1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={U("1469371670807-013ccf25f16a", 2000)} alt="A wedding aisle lined with flowers" loading="lazy" />
          </div>
        </div>
        <div className="wed__shade" />
        <div className="wed__content section-pad">
          <div className="wrap wed__grid">
            <h2 className="wed__title" data-split="chars">
              Say yes, then dance until three
            </h2>
            <div className="wed__steps" data-stagger="">
              {WEDDING.map(([t, d]) => (
                <div key={t} className="wed__step" data-item="">
                  <span className="eyebrow eyebrow--body">{t}</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="enquire" className="sec section-pad anchor">
        <div className="wrap form-split">
          <div className="form-split__copy">
            <h2 className="h-xl" data-split="chars">
              Tell us about it
            </h2>
            <p className="body-lg" data-fade="">
              Share a few details and our events team will come back within one working day with ideas, menus and a proposal.
            </p>
            <div className="contact-lines" data-fade="" data-delay="0.1">
              <span className="eyebrow">Events team</span>
              <a href="mailto:events@madoonna.com">events@madoonna.com</a>
              <a href="https://wa.me/628113800601" target="_blank" rel="noreferrer">
                WhatsApp +62 811 3800 601
              </a>
            </div>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </PageShell>
  );
}
