import { EVENTS, U } from "@/lib/data";
import { Button, Icon, Media } from "@/components/ds";
import BookButton from "@/components/BookButton";

export default function WhatsOn() {
  return (
    <section id="whats-on" className="whats-on section-pad" data-screen-label="Home · What's on">
      <div className="wrap list-stack">
        <div className="split-head">
          <div>
            <h2 className="h-xl" data-split="chars">
              The next two weeks
            </h2>
          </div>
          <div data-fade="" data-delay="0.2">
            <Button href="/whats-on" iconRight={<Icon name="arrow-right" />}>
              Full calendar
            </Button>
          </div>
        </div>
        <div className="events" data-stagger="">
          <div className="hairline" data-line="" />
          {EVENTS.map((e, i) => (
            <div key={e.day + e.title} className="event" data-item="">
              <div className="event__date">
                <span className="eyebrow">{e.dow}</span>
                <span className="event__day">{e.day}</span>
                <span className="eyebrow">{e.mon}</span>
              </div>
              <Media ratio="1/1" reveal={false} parallax={0} src={U(e.img, 300)} alt="" />
              <div className="event__copy">
                <span className="eyebrow eyebrow--body">
                  {e.kind} · {e.time}
                </span>
                <h3 className="event__title">{e.title}</h3>
                <p className="event__desc">{e.desc}</p>
              </div>
              <BookButton exp={e.exp}>{e.cta}</BookButton>
              <span className="event__rule" data-line="" data-delay={String(0.1 + i * 0.08)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
