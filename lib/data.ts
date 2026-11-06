import type { Experience } from "./stores";

export const U = (id: string, w = 1200, q = 80) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&auto=format&fit=crop`;

export const SLIDES = [
  { time: "18:00", label: "Dine", img: "1600565193348-f74bd3c7ccdf", alt: "The open kitchen in full flame" },
  { time: "20:30", label: "Show", img: "1722461079337-1775b8f61137", alt: "Flamenco dancers performing between the tables" },
  { time: "22:30", label: "Sip", img: "1569924995012-c4c706bfcd51", alt: "Guests at the cocktail bar" },
  { time: "00:00", label: "Dance", img: "1540039155733-5bb30b53aa14", alt: "The club at its peak" },
];

export const PLACES = ["Mykonos", "Tulum", "Ibiza", "Dubai", "Bodrum"];

export const ACTS = [
  {
    time: "16:00",
    id: "aperitivo",
    title: "Aperitivo at the street bar",
    body: "Spritz, mezze and Mediterranean snacks at our street-facing bar. No booking, just walk up and watch Berawa slow down.",
    img: "1555939594-58d7cb561ad1",
    cta: "Street bar menu",
    href: "/menus#street",
  },
  {
    time: "18:00",
    id: "dinner",
    title: "Dinner",
    body: "Refined Mediterranean à la carte, from Puglia to Marrakech by way of the Aegean. Charcoal, citrus, olive oil and plenty to share.",
    img: "1534080564583-6be75777b70a",
    cta: "See the menus",
    href: "/menus#carte",
  },
  {
    time: "20:30",
    id: "show",
    title: "The show",
    body: "Thursday to Saturday, dinner gets a second act: dancers, live vocals and musicians woven through the room between courses.",
    img: "1682839520077-686e4902d19e",
    cta: "Show dinner",
    href: "/menus#show",
  },
  {
    time: "22:30",
    id: "lounge",
    title: "The lounge",
    body: "Lights drop, the cocktail list takes over and the room starts to move. A good moment to order the Onnà Negroni.",
    img: "1434569842867-4d6d1d4d1ef0",
    cta: "Cocktail list",
    href: "/menus#cocktails",
  },
  {
    time: "00:00",
    id: "club",
    title: "The club",
    body: "House and afrohouse from Bali residents and guests from Mykonos, Tulum and Ibiza. Doors close at 03:00, the stories last longer.",
    img: "1563784462386-044fd95e9852",
    cta: "Club nights",
    href: "/whats-on",
  },
];

export const EVENTS: {
  dow: string;
  day: string;
  mon: string;
  kind: string;
  time: string;
  title: string;
  desc: string;
  img: string;
  exp: Experience;
  cta: string;
}[] = [
  { dow: "Thu", day: "05", mon: "Nov", kind: "Show dinner", time: "19:30", title: "Bodrum Nights", desc: "Our autumn show opens: a four-course Aegean menu and a story told in dance and song.", img: "1722461079337-1775b8f61137", exp: "show", cta: "Book" },
  { dow: "Fri", day: "06", mon: "Nov", kind: "Club", time: "23:00", title: "Afrohouse Fridays", desc: "Residents warm up, a guest from Tulum takes it to close.", img: "1470225620780-dba8ba36b745", exp: "vip", cta: "Table" },
  { dow: "Sat", day: "07", mon: "Nov", kind: "Show dinner", time: "19:30", title: "Bodrum Nights", desc: "Second weekend of the season. Late seating flows straight into the club.", img: "1495791185843-c73f2269f669", exp: "show", cta: "Book" },
  { dow: "Wed", day: "11", mon: "Nov", kind: "Members", time: "20:00", title: "Circle supper: a Sardinian table", desc: "One long table, one chef, one island. For Onnà Circle members and their guests.", img: "1519671482749-fd09be7ccebf", exp: "dinner", cta: "RSVP" },
  { dow: "Sun", day: "15", mon: "Nov", kind: "Day to night", time: "16:00", title: "Long Sunday", desc: "Spritz at golden hour, a family-style feast, and a sunset set that runs into the evening.", img: "1555939594-58d7cb561ad1", exp: "dinner", cta: "Book" },
];

export const PERKS = [
  { n: "01", t: "Priority tables for dinner and the show, even on sold-out nights" },
  { n: "02", t: "Monthly Circle suppers with guest chefs from around the Mediterranean" },
  { n: "03", t: "First access to guest DJ nights and private after-parties" },
  { n: "04", t: "A host who remembers your table, your drink and your birthday" },
];

export const STRIP: [string, string, string][] = [
  ["1572116469696-31de0f17cc34", "320px", "3/4"],
  ["1534080564583-6be75777b70a", "420px", "4/3"],
  ["https://images.pexels.com/photos/37307312/pexels-photo-37307312.jpeg?auto=compress&w=900", "440px", "4/3"],
  ["1621873495884-845a939892d1", "360px", "1/1"],
  ["1545128485-c400e7702796", "440px", "4/3"],
  ["1600565193348-f74bd3c7ccdf", "300px", "3/4"],
  ["1505236858219-8359eb29e329", "420px", "4/3"],
  ["1559742811-822873691df8", "320px", "1/1"],
  ["1460723237483-7a6dc9d0b212", "300px", "3/4.2"],
];

export const FAQS = [
  { q: "Is there a dress code?", a: "Smart-casual and Mediterranean-relaxed. Linen is perfect; beachwear and sportswear are not, especially after 20:00." },
  { q: "Do I need to book?", a: "For dinner and the show dinner, yes. Weekends fill up early. The street bar is walk-in only, and the club welcomes walk-ins subject to capacity." },
  { q: "What happens after the show?", a: "The room transforms. Tables clear from 22:30, the lounge takes over and the club opens at 23:00. Show dinner guests keep their table until midnight." },
  { q: "Can you cater to dietary requirements?", a: "Of course. Our menus mark vegetarian, vegan and gluten-free dishes, and the kitchen adapts most plates. Tell us when you book." },
  { q: "Is there an age limit?", a: "Everyone is welcome at dinner. From 23:00 the venue is 21+ and we ask for ID at the door." },
  { q: "Where do I park?", a: "Valet parking for cars and a secure scooter area right at the entrance. Most guests arrive by Grab or Gojek, with drop-off on Jl. Pantai Berawa." },
];

/* Site navigation. Other pages aren't built yet, so links point at home sections or "#". */
export const PAGES = [
  { key: "home", label: "Home", href: "/", img: "1569924995012-c4c706bfcd51" },
  { key: "story", label: "Our story", href: "/our-story", img: "1570077188670-e3a8d69ac5ff" },
  { key: "menus", label: "Menus", href: "/menus", img: "1534080564583-6be75777b70a" },
  { key: "events", label: "What's on", href: "/whats-on", img: "1722461079337-1775b8f61137" },
  { key: "private", label: "Private hire & weddings", href: "/private-hire", img: "1511795409834-ef04bbd61622" },
  { key: "gallery", label: "Gallery", href: "/gallery", img: "1563784462386-044fd95e9852" },
  { key: "journal", label: "Journal", href: "/journal", img: "1541614101331-1a5a3a194e92" },
  { key: "press", label: "Press", href: "/press", img: "1514362453360-8f94243c9996" },
  { key: "contact", label: "Contact & location", href: "/contact", img: "1518548419970-58e3b4079ab2" },
];

export const EXPS: Record<
  Experience,
  { title: string; desc: string; meta: string; img: string; days: number[]; times: string[] }
> = {
  dinner: { title: "À la carte dinner", desc: "The restaurant, the full Mediterranean menu.", meta: "Daily · 18:00 – 23:00", img: "1414235077428-338989a2e8c0", days: [0, 1, 2, 3, 4, 5, 6], times: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"] },
  show: { title: "Show dinner", desc: "Set menu with the theatrical live show.", meta: "Thu – Sat · seating 19:30", img: "1722461079337-1775b8f61137", days: [4, 5, 6], times: ["19:30", "20:00"] },
  lounge: { title: "Lounge table", desc: "Cocktails and small plates as the music builds.", meta: "Daily · from 21:00", img: "1434569842867-4d6d1d4d1ef0", days: [0, 1, 2, 3, 4, 5, 6], times: ["21:00", "21:30", "22:00", "22:30", "23:00", "23:30"] },
  vip: { title: "Club VIP table", desc: "Bottle service and a host for the night.", meta: "Wed – Sun · 23:00 – 03:00", img: "1563784462386-044fd95e9852", days: [0, 3, 4, 5, 6], times: ["23:00", "23:30", "00:00", "00:30", "01:00"] },
};

export const JOURNAL_CATS = ["All", "Kitchen", "Behind the show", "Bar", "People", "Music", "Places"];
