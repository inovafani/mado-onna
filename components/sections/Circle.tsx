import { PERKS } from "@/lib/data";
import { Button, Media } from "@/components/ds";

export default function Circle() {
  return (
    <section className="circle section-pad" data-screen-label="Home · The Circle">
      <div className="wrap circle__grid">
        <div className="circle__copy">
          <h2 className="h-xl" data-split="chars">
            The Onnà Circle
          </h2>
          <p className="body-lg" data-fade="">
            A small community of regulars, creatives and night-owls who treat Madò Onnà as their living room. Membership is by invitation or
            introduction, and it&apos;s more about who you&apos;d bring than what you&apos;d spend.
          </p>
          <div className="perks" data-stagger="">
            <div className="hairline" data-line="" />
            {PERKS.map((p, i) => (
              <div key={p.n} className="perk" data-item="">
                <span className="perk__n">{p.n}</span>
                <span className="perk__t">{p.t}</span>
                <span className="event__rule" data-line="" data-delay={String(0.1 + i * 0.08)} />
              </div>
            ))}
          </div>
          <div data-fade="">
            <Button variant="primary" href="/contact" magnetic>
              Request an introduction
            </Button>
          </div>
        </div>
        <div className="circle__pics">
          <Media
            ratio="3/4.6"
            arch
            parallax={0.07}
            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1000&q=80&auto=format&fit=crop"
            alt="Friends raising glasses at the bar"
          />
          <Media
            ratio="3/4"
            speed={-0.9}
            delay={0.15}
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=700&q=80&auto=format&fit=crop"
            alt="A cocktail on the bar"
          />
        </div>
      </div>
    </section>
  );
}
