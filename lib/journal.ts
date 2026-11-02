export type Post = {
  slug: string;
  cat: string;
  date: string;
  mins: string;
  img: string;
  title: string;
  dek: string;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "a-mediterranean-table-in-bali",
    cat: "Kitchen",
    date: "Oct 24, 2026",
    mins: "5 min",
    img: "1541614101331-1a5a3a194e92",
    title: "What a Mediterranean table looks like in Bali",
    dek: "Our head chef on sourcing olive oil from Puglia, fish from Jimbaran and herbs from a farm twenty minutes up the road.",
    body: [
      "The first question every cook asks when they arrive in Bali is what they will have to give up. The answer turned out to be less than we expected. The island is full of beautiful seafood, citrus, chillies and herbs that feel completely at home on a Mediterranean plate.",
      "We import only what Bali cannot do better: the olive oil, a few cheeses, the bomba rice for our paella. Everything else starts at the market. The red snapper on the grill tonight came off a boat in Jimbaran this morning.",
      "The result is a menu that tastes of four coastlines and still feels rooted here. That balance is the whole point.",
    ],
  },
  {
    slug: "rehearsals-for-bodrum-nights",
    cat: "Behind the show",
    date: "Oct 12, 2026",
    mins: "7 min",
    img: "1495791185843-c73f2269f669",
    title: "Four weeks of rehearsals for Bodrum Nights",
    dek: "Twelve performers, three acts and one rule: the show has to work from every seat in the room.",
    body: [
      "A dinner show is a strange kind of theatre. The audience is eating, talking, turning around to order another bottle. The choreography has to earn attention without demanding it.",
      "Our creative director spent the summer on the Turkish coast collecting music, costumes and stories. In rehearsal, the cast moved through the dining room night after night until every entrance felt natural.",
      "On opening night, the finale lands at 22:15. By 22:30, the tables are clearing and the same performers are on the dance floor with everyone else.",
    ],
  },
  {
    slug: "the-spritz-reconsidered",
    cat: "Bar",
    date: "Sep 30, 2026",
    mins: "4 min",
    img: "1514362453360-8f94243c9996",
    title: "The spritz, reconsidered with island botanicals",
    dek: "How our bar team rebuilt a Venetian classic around Bali lime, lemongrass and a pinch of sea salt.",
    body: [
      "The spritz is a simple drink, which makes it easy to get wrong. Ours took eleven versions before it reached the street bar.",
      "The secret is balance: a little less bitter, a little more citrus, and a pinch of sea salt that makes the whole thing taste like the end of a beach day.",
    ],
  },
  {
    slug: "the-hosts-who-remember-your-name",
    cat: "People",
    date: "Sep 18, 2026",
    mins: "6 min",
    img: "1569924995012-c4c706bfcd51",
    title: "Meet the hosts who remember your name",
    dek: "Hospitality is a skill. Our floor team on how they read a room, and when to leave you alone.",
    body: [
      "Every table at Madò Onnà has a host, and every host has a notebook. Birthdays, favourite drinks, the seat you liked last time.",
      "The best service, they say, is the kind you barely notice until you realise everything you needed was already there.",
    ],
  },
  {
    slug: "afrohouse-at-midnight",
    cat: "Music",
    date: "Sep 02, 2026",
    mins: "5 min",
    img: "1470225620780-dba8ba36b745",
    title: "Why afrohouse sounds right at midnight in Berawa",
    dek: "Our music director on building a night that moves from dinner jazz to a full dance floor without a single hard cut.",
    body: [
      "The night starts at 90 beats per minute and ends somewhere around 124. The trick is getting there so slowly that nobody notices.",
      "Afrohouse has the warmth of the earlier hours and the drive of the later ones. It is the bridge between the restaurant and the club.",
    ],
  },
  {
    slug: "five-shores-a-travel-diary",
    cat: "Places",
    date: "Aug 20, 2026",
    mins: "8 min",
    img: "1570077188670-e3a8d69ac5ff",
    title: "Five shores: a travel diary behind the concept",
    dek: "Mykonos, Tulum, Ibiza, Dubai and Bodrum: what each one taught us about a perfect night out.",
    body: [
      "Before there was a building, there was a list. Five places where the night seemed to know exactly what it was doing.",
      "From each we took one habit. Together, they became a house in Berawa.",
    ],
  },
];

export const JOURNAL_CATS = ["All", "Kitchen", "Behind the show", "Bar", "People", "Music", "Places"];
