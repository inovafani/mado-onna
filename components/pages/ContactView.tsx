"use client";

import { useEffect, useState } from "react";
import { Button, Icon, Input, Select, Textarea } from "@/components/ds";
import FormDone from "@/components/FormDone";

/** Open/closed pill. Worked out after mount from the visitor's clock (the page itself is static). */
export function OpenStatus() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(h >= 16 || h < 3);
  }, []);

  return (
    <span className={"status" + (open ? " is-open" : "")}>
      <span className="status__dot" />
      <span className="eyebrow eyebrow--ink">{open === null ? "Daily from 16:00" : open ? "Open now · until 03:00" : "Opens today at 16:00"}</span>
    </span>
  );
}

const TOPICS = ["General question", "Membership introduction", "Feedback", "Lost property", "Careers", "Partnerships"];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const errName = tried && name.trim().length < 2 ? "Tell us your name" : undefined;
  const errEmail = tried && !/.+@.+\..+/.test(email) ? "We need an email to reply to" : undefined;

  return (
    <div className="form-card" data-fade="" data-delay="0.1">
      {sent ? (
        <FormDone title="Message received" text={`Thanks, ${name.trim().split(" ")[0]}. We reply to every message within a day.`} />
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
          <div className="form__grid">
            <Input label="Your name" placeholder="First and last" value={name} error={errName} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            <Input label="Email" type="email" placeholder="name@email.com" value={email} error={errEmail} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <Select label="Topic" options={TOPICS} />
          <Textarea label="Message" rows={3} placeholder="How can we help?" />
          <div className="form__foot">
            <span>We reply to every message within a day.</span>
            <Button variant="primary" size="lg" type="submit" iconRight={<Icon name="arrow-right" />}>
              Send message
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
