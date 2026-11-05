import { LineLink, Media } from "@/components/ds";

const img = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

function Copy({ title, body, link, href }: { title: string; body: string; link: string; href: string }) {
  return (
    <>
      <h3 className="h-md" data-split="lines">
        {title}
      </h3>
      <p className="body-md" data-item="">
        {body}
      </p>
      <LineLink href={href} data-item="">
        {link}
      </LineLink>
    </>
  );
}

export default function Rooms() {
  return (
    <section className="rooms section-pad" data-screen-label="Home · The rooms">
      <div className="wrap rooms__stack">
        <div className="room-a">
          <div className="room-copy" data-stagger="">
            <Copy
              title="Four coastlines at one long table"
              body="Hand-rolled pasta from Puglia, Aegean seafood over charcoal, Moroccan spice and Spanish rice cooked for the table. Generous plates, made to be passed around."
              link="See the menus"
              href="/menus"
            />
          </div>
          <Media ratio="4/3.4" src={img("1534080564583-6be75777b70a", 1000)} alt="Seafood paella for the table" style={{ alignSelf: "end" }} />
          <Media ratio="3/4.4" speed={-0.7} delay={0.12} src={img("1414235077428-338989a2e8c0", 1000)} alt="A plated main course in the dining room" />
        </div>

        <div className="room-b">
          <Media ratio="1/1" parallax={0.07} src={img("1470337458703-46ad1756a187", 1400)} alt="A bartender pouring a signature cocktail" />
          <div className="room-b__side">
            <Media
              ratio="4/3"
              speed={1}
              style={{ width: "58%" }}
              src={img("1621873495884-845a939892d1", 700)}
              alt="A Negroni on the bar"
            />
            <div className="room-copy" data-stagger="">
              <Copy
                title="Three bars, each with its own mood"
                body="A street-facing spritz bar for golden hour, a cocktail lounge built around Mediterranean botanicals, and the club bar for when the night picks up. Ask the bartenders to improvise."
                link="Cocktail list"
                href="/menus#cocktails"
              />
            </div>
          </div>
        </div>

        <div className="room-c">
          <div className="room-c__side">
            <Media ratio="3/4" speed={0.8} style={{ width: "64%" }} src={img("1470225620780-dba8ba36b745", 700)} alt="DJ decks under purple light" />
            <div className="room-copy" data-stagger="">
              <Copy
                title="When the tables clear, the floor opens"
                body="House and afrohouse from our residents and guests from Mykonos, Tulum and Ibiza. VIP tables come with a host who knows your name by midnight."
                link="Club nights"
                href="/whats-on"
              />
            </div>
          </div>
          <Media ratio="3/4.2" arch parallax={0.07} src={img("1574391884720-bbc3740c59d1", 1100)} alt="The dance floor late at night" />
        </div>
      </div>
    </section>
  );
}
