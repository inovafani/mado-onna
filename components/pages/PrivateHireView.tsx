"use client";

import { useRef, useState } from "react";
import { usePicker } from "@/lib/usePicker";
import { U } from "@/lib/data";
import { Button, Icon, Input, Select, Textarea } from "@/components/ds";
import FormDone from "@/components/FormDone";

const SPACES = [
  { name: "Full buyout", best: "Weddings, launches, the whole house", seated: "180", standing: "400", img: "1540039155733-5bb30b53aa14" },
  { name: "The Restaurant", best: "Rehearsal dinners, private show dinners", seated: "180", standing: "250", img: "1590846406792-0adc7f938f1d" },
  { name: "The Lounge", best: "Cocktail parties, birthdays", seated: "60", standing: "120", img: "1514933651103-005eec06c04b" },
  { name: "The Chef's Table", best: "Intimate dinners at the pass", seated: "12", standing: "n/a", img: "1572715376701-98568319fd0b" },
  { name: "The Club", best: "After-parties, DJ takeovers", seated: "40", standing: "300", img: "1545128485-c400e7702796" },
];

/** Capacity table. Hover a space and the photo beside it follows. */
export function SpacesTable() {
  const root = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);
  usePicker(root, on);

  return (
    <div ref={root} className="pick pick--table">
      <div className="pick__list">
        <div className="cap-row cap-row--head" data-fade="12">
          <span>Space</span>
          <span>Seated</span>
          <span>Standing</span>
        </div>
        <div data-stagger="">
          {SPACES.map((s, i) => (
            <button
              key={s.name}
              type="button"
              className={"pick-row cap-row" + (i === on ? " is-on" : "")}
              onMouseEnter={() => setOn(i)}
              onFocus={() => setOn(i)}
              onClick={() => setOn(i)}
              data-item=""
            >
              <span className="cap-row__name">
                <span>{s.name}</span>
                <small>{s.best}</small>
              </span>
              <span className="cap-row__n">{s.seated}</span>
              <span className="cap-row__n">{s.standing}</span>
              <span className="pick-row__rule">
                <span data-bar="" />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="pick__sticky">
        <div className="media pick__frame" data-reveal-media="">
          <div className="media__inner">
            {SPACES.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.name} src={U(s.img, 1100)} alt={s.name} data-pick-img="" loading="lazy" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TYPES = ["Wedding", "Birthday", "Corporate", "Brand launch", "Other"];
const GUESTS = ["10 – 20", "20 – 50", "50 – 100", "100 – 180", "180 – 400"];

/** Enquiry form, front end only. On send the form swaps to a thank-you with the arch drawing itself. */
export function EnquiryForm() {
  const [type, setType] = useState("Wedding");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const errName = tried && name.trim().length < 2 ? "Tell us who's celebrating" : undefined;
  const errEmail = tried && !/.+@.+\..+/.test(email) ? "We need an email to reply to" : undefined;

  return (
    <div className="form-card" data-fade="" data-delay="0.1">
      {sent ? (
        <FormDone
          title={`Thank you, ${name.trim().split(" ")[0]}`}
          text={`Your ${type.toLowerCase()} enquiry is with our events team. Expect a reply within one working day.`}
        />
      ) : (
        <form
          className="form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setTried(true);
            if (name.trim().length > 1 && /.+@.+\..+/.test(email)) setSent(true);
            else e.currentTarget.querySelector<HTMLInputElement>(name.trim().length > 1 ? "input[type=email]" : "input")?.focus();
          }}
        >
          <div className="mo-field">
            <span className="mo-field__label">What are we celebrating?</span>
            <div className="chips" role="radiogroup" aria-label="Type of event">
              {TYPES.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={t === type} className={"chip" + (t === type ? " is-on" : "")} onClick={() => setType(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="form__grid">
            <Input label="Your name" placeholder="First and last" value={name} error={errName} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            <Input label="Email" type="email" placeholder="name@email.com" value={email} error={errEmail} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <Input label="Preferred date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={date ? undefined : "is-empty"} />
            <Select label="Guests" options={GUESTS} />
          </div>
          <Textarea label="Tell us more" rows={3} placeholder="The story, the vibe, the must-haves" />
          <div className="form__foot">
            <span>Our events team replies within one working day.</span>
            <Button variant="primary" size="lg" type="submit" iconRight={<Icon name="arrow-right" />}>
              Send enquiry
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
