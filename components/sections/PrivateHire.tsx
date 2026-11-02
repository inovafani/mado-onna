import { LineLink, Media } from "@/components/ds";

const STATS = [
  { n: 180, l: "Seated" },
  { n: 400, l: "Standing" },
  { n: 5, l: "Spaces" },
];

export default function PrivateHire() {
  return (
    <section id="private-hire" className="private section-pad" data-screen-label="Home · Private hire">
      <div className="wrap private__grid">
        <Media
          ratio="5/4"
          parallax={0.07}
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=80&auto=format&fit=crop"
          alt="A long table dressed for a celebration"
        />
        <div className="private__side">
          <Media
            ratio="4/3"
            speed={0.8}
            delay={0.15}
            style={{ width: "44%" }}
            src="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&q=80&auto=format&fit=crop"
            alt="Sparklers at a celebration"
          />
          <h2 className="h-lg" data-split="lines">
            Make the whole night yours
          </h2>
          <p className="body-md" data-fade="">
            Birthdays at the chef&apos;s table, a rehearsal dinner with its own show, or a full buyout for a wedding that ends on the dance floor.
            Our events team shapes the evening around you.
          </p>
          <div className="stats">
            <div className="hairline" data-line="" />
            <div className="hairline" data-line="" data-delay="0.2" />
            {STATS.map((s, i) => (
              <div key={s.l} className="stat">
                <span className="stat__n" data-count={s.n} data-delay={String(i * 0.12)}>
                  {s.n}
                </span>
                <span className="stat__l">{s.l}</span>
              </div>
            ))}
          </div>
          <LineLink href="/private-hire" data-fade="">
            Make an enquiry
          </LineLink>
        </div>
      </div>
    </section>
  );
}
