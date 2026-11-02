import { PLACES } from "@/lib/data";
import { LineLink, Media } from "@/components/ds";

export default function Welcome() {
  return (
    <section className="welcome section-pad" data-screen-label="Home · Welcome">
      <div className="wrap welcome__grid">
        <div className="welcome__copy">
          <h2 className="h-lg" data-scrub-words="">
            A Mediterranean evening that doesn&apos;t stop at dessert
          </h2>
          <p className="body-lg" data-fade="">
            In the heart of Berawa, one address holds a restaurant, a stage, three bars and a club. Come for dinner inspired by Italy, Greece,
            Morocco and Spain. Stay for the show, a signature cocktail, and a dance floor that runs on house and afrohouse until late.
          </p>
          <p className="body-lg" data-fade="" data-delay="0.1">
            No dress-up required to feel welcome. Just arrive hungry and leave the rest of the night open.
          </p>
          <LineLink href="/our-story" data-fade="">
            Read our story
          </LineLink>
        </div>
        <div className="welcome__pics">
          <Media
            ratio="3/4"
            speed={0.9}
            delay={0.15}
            src="https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=900&q=80&auto=format&fit=crop"
            alt="A guest at dinner by candlelight"
          />
          <Media
            ratio="3/4.6"
            arch
            src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1100&q=80&auto=format&fit=crop"
            alt="The backlit cocktail bar"
          />
        </div>
      </div>
      <div className="wrap places" data-stagger="">
        <div className="hairline" data-line="" />
        <div className="hairline" data-line="" data-delay="0.15" />
        <div className="places__cell places__cell--label" data-item="">
          Inspired by
        </div>
        {PLACES.map((p) => (
          <div key={p} className="places__cell" data-item="">
            {p}
          </div>
        ))}
      </div>
    </section>
  );
}
