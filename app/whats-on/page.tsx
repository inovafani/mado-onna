import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import BookButton from "@/components/BookButton";
import { WeekGrid, EventsGrid } from "@/components/pages/WhatsOnView";
import { Button, Media } from "@/components/ds";
import { U } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dinner show & club nights in Canggu, Bali · Madò Onnà",
  description: "Bodrum Nights, our theatrical dinner show Thu–Sat, then DJs, club nights and VIP tables until 03:00 in Berawa, Canggu.",
};

const FACTS = [
  ["Runs", "Nov 05 – Dec 19"],
  ["Nights", "Thu · Fri · Sat"],
  ["From", "IDR 1.250K"],
];

export default function WhatsOn() {
  return (
    <PageShell current="events">
      <PageHero
        size="full"
        xl
        img={U("1722461079337-1775b8f61137", 2000)}
        alt="A dancer in a flowing dress on a dark stage"
        position="center 30%"
        title={
          <>
            Bodrum <em className="accent">Nights</em>
          </>
        }
        below={
          <div className="ph__grid">
            <p className="ph__lede">
              Our autumn show dinner. A story of the Aegean coast told in dance, live vocals and music, served with four courses from the Turkish
              riviera.
            </p>
            <div className="ph__facts">
              {FACTS.map(([k, v]) => (
                <div key={k}>
                  <span className="eyebrow eyebrow--body">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
            <div className="ph__ctas">
              <BookButton exp="show" variant="primary" size="lg">
                Book the show
              </BookButton>
              <Button size="lg" href="/menus#show">
                Show menu
              </Button>
            </div>
          </div>
        }
      />

      <section className="sec section-pad">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-xl" data-split="chars">
              The weekly rhythm
            </h2>
            <p className="body-md" data-fade="">
              Dinner and the street bar are open every day. Here&apos;s what the rest of the house is doing.
            </p>
          </div>
          <WeekGrid />
        </div>
      </section>

      <section className="sec sec--flush-top section-pad">
        <div className="wrap">
          <EventsGrid />
        </div>
      </section>

      <section className="sec sec--flush-top section-pad">
        <div className="wrap promo">
          <Media src={U("1505236858219-8359eb29e329", 1200)} alt="Confetti over a crowd" className="promo__media" />
          <div className="promo__copy">
            <h2 className="h-md" data-split="lines">
              Want the stage for your celebration?
            </h2>
            <p className="body-md" data-fade="">
              We create private show dinners for birthdays, weddings and brand events, each with a story written around you.
            </p>
            <div data-fade="" data-delay="0.1">
              <Button variant="primary" href="/private-hire">
                Plan an event
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
