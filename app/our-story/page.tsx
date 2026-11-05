import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import Shores from "@/components/pages/Shores";
import { Media } from "@/components/ds";
import { U } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our story · Madò Onnà, Berawa",
  description: "Mediterranean at heart, Balinese by address: one house in Berawa where the whole evening happens under one roof.",
};

const BELIEFS = [
  { n: "01", t: "Premium, never pretentious", d: "Great produce and careful service, served with warmth rather than ceremony." },
  { n: "02", t: "Every hour has a mood", d: "We programme the night like a story, so arriving at 18:00 or 23:00 both feel right." },
  { n: "03", t: "Real over staged", d: "What you see online is what you get at the door. The photos and the promises have to match the night." },
  { n: "04", t: "Everyone at the table", d: "Locals, travellers, regulars and first-timers. Exclusive should never mean unwelcoming." },
];

const SPACES = [
  { name: "The Restaurant", hours: "From 18:00", d: "An à la carte dining room for 180, built around an open charcoal kitchen.", img: "1600565193348-f74bd3c7ccdf" },
  { name: "The Stage", hours: "Thu – Sat", d: "A performance floor in the centre of the room, so the show happens around you.", img: "1779149759433-3c850dded024" },
  { name: "The Lounge", hours: "From 21:00", d: "Low sofas, a long marble bar and the signature cocktail list.", img: "1514933651103-005eec06c04b" },
  { name: "The Club", hours: "Wed – Sun", d: "House and afrohouse, a serious sound system and VIP tables with bottle service.", img: "1545128485-c400e7702796" },
  { name: "The Street Bar", hours: "From 16:00", d: "Facing Jl. Pantai Berawa: spritz, mezze and casual bites, no booking needed.", img: "1555939594-58d7cb561ad1" },
];

export default function OurStory() {
  return (
    <PageShell current="story">
      <PageHero
        img={U("1578474846511-04ba529f0b88", 2000)}
        alt="The dining room in low evening light"
        title={
          <>
            Mediterranean at heart, <em className="accent">Balinese by address</em>
          </>
        }
      />

      <section className="sec section-pad">
        <div className="wrap story-open">
          <p className="story-open__lead" data-scrub-words="">
            We kept noticing the same thing on every shore we loved. The best nights never had a single venue. Dinner turned into a show, the
            show into drinks, the drinks into dancing, and nobody wanted to change rooms.
          </p>
          <div className="story-open__cols">
            <p className="body-lg" data-fade="">
              Madò Onnà is our answer: one house in Berawa where the whole evening happens under one roof. The kitchen cooks the Mediterranean
              the way families do: generously, seasonally, with the best olive oil we can find. The stage brings performers to your table. The
              bars and the club carry it on until the early hours.
            </p>
            <p className="body-lg" data-fade="" data-delay="0.12">
              We built it to feel glamorous without the stiffness. Sit down in linen, stay for the show, and leave with people you didn&apos;t
              know at 19:00.
            </p>
          </div>
        </div>
      </section>

      <section className="sec sec--rule section-pad">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-xl" data-split="chars">
              Five shores, one house
            </h2>
            <p className="body-md" data-fade="">
              Each of the places that inspired us left a habit behind. Together they shape how a night here feels.
            </p>
          </div>
          <Shores />
        </div>
      </section>

      <section className="sec section-pad">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-lg" data-split="lines">
              A few house rules we hold ourselves to
            </h2>
          </div>
          <div className="beliefs" data-stagger="">
            {BELIEFS.map((b) => (
              <div key={b.n} className="belief" data-item="">
                <span className="eyebrow">{b.n}</span>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--flush-top section-pad">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-xl" data-split="chars">
              Five rooms
            </h2>
          </div>
          <div className="spaces">
            {SPACES.map((s, i) => (
              <div key={s.name} className={"space" + (i % 2 ? " space--low" : "")}>
                <Media ratio="4/5" src={U(s.img, 900)} alt={s.name} speed={i % 2 ? 0.5 : 0} delay={(i % 3) * 0.08} />
                <div className="space__head" data-fade="16">
                  <h3>{s.name}</h3>
                  <span className="eyebrow">{s.hours}</span>
                </div>
                <p className="space__desc" data-fade="16" data-delay="0.08">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        img={U("1467810563316-b5476525c0f9", 2000)}
        alt="Sparklers held up in the dark"
        title="Better in person"
        text="Pictures only get you so far. Book a table and let the night decide the rest."
      />
    </PageShell>
  );
}
