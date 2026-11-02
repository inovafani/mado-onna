import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import BookButton from "@/components/BookButton";
import { OpenStatus, ContactForm } from "@/components/pages/ContactView";
import { Button, Icon, type IconName } from "@/components/ds";
import { U } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact & location · Madò Onnà, Berawa",
  description: "Jl. Pantai Berawa, Canggu, Bali. Opening hours, directions and how to reach us.",
};

const HOURS = [
  ["Street bar", "Daily · 16:00 – 01:00"],
  ["Restaurant", "Daily · 18:00 – 23:00"],
  ["Show dinner", "Thu – Sat · 19:30"],
  ["Lounge", "Daily · 21:00 – 01:00"],
  ["Club", "Wed – Sun · 23:00 – 03:00"],
];

const CHANNELS = [
  ["Reservations", "WhatsApp +62 811 3800 600", "https://wa.me/628113800600"],
  ["General", "hello@madoonna.com", "mailto:hello@madoonna.com"],
  ["Events & weddings", "events@madoonna.com", "mailto:events@madoonna.com"],
  ["Press", "press@madoonna.com", "mailto:press@madoonna.com"],
];

const GETTING: [IconName, string][] = [
  ["car", "Valet parking at the entrance on Jl. Pantai Berawa."],
  ["bike", "Secure scooter parking beside the street bar."],
  ["smartphone", 'Grab or Gojek: search "Madò Onnà Berawa". Pick-up point at the arch.'],
];

const MAP = "https://www.openstreetmap.org/export/embed.html?bbox=115.1260%2C-8.6720%2C115.1520%2C-8.6550&layer=mapnik&marker=-8.6634%2C115.1392";

export default function Contact() {
  return (
    <PageShell current="contact">
      <PageHero
        img={U("1590846406792-0adc7f938f1d", 2000)}
        alt="The dining room set for the evening"
        title={
          <>
            Find <em className="accent">the arch</em> on Berawa
          </>
        }
        aside={
          <>
            <OpenStatus />
            <p>Jl. Pantai Berawa, Canggu. Look for the arch: valet at the door, scooters beside the street bar.</p>
          </>
        }
      />

      <section className="sec section-pad">
        <div className="wrap visit">
          <div className="map" data-reveal-media="">
            <iframe title="Map of Madò Onnà, Berawa" src={MAP} loading="lazy" />
            <div className="map__card">
              <div>
                <strong>Madò Onnà</strong>
                <span>Jl. Pantai Berawa, Canggu, Bali 80361</span>
              </div>
              <Button size="sm" href="https://maps.google.com/?q=-8.6634,115.1392" target="_blank" rel="noreferrer" iconRight={<Icon name="arrow-up-right" size={14} />}>
                Open in Maps
              </Button>
            </div>
          </div>

          <div className="visit__info">
            <div className="hours" data-stagger="">
              <span className="eyebrow" data-item="">
                Opening hours
              </span>
              {HOURS.map(([k, v]) => (
                <div key={k} className="hours__row" data-item="">
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>

            <div className="channels" data-stagger="">
              {CHANNELS.map(([k, v, href]) => (
                <div key={k} data-item="">
                  <span className="eyebrow">{k}</span>
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {v}
                  </a>
                </div>
              ))}
            </div>

            <div className="getting" data-stagger="">
              {GETTING.map(([icon, t]) => (
                <div key={icon} className="getting__row" data-item="">
                  <Icon name={icon} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec--rule section-pad">
        <div className="wrap form-split">
          <div className="form-split__copy">
            <h2 className="h-xl" data-split="chars">
              Say hello
            </h2>
            <p className="body-lg" data-fade="">
              Questions, feedback, membership introductions or just a hello. For tonight&apos;s table, booking online is quickest.
            </p>
            <div data-fade="" data-delay="0.1">
              <BookButton variant="primary">Reserve a table</BookButton>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}
