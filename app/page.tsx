import PageShell from "@/components/PageShell";
import Hero from "@/components/sections/Hero";
import Welcome from "@/components/sections/Welcome";
import Night from "@/components/sections/Night";
import Show from "@/components/sections/Show";
import Rooms from "@/components/sections/Rooms";
import WhatsOn from "@/components/sections/WhatsOn";
import PrivateHire from "@/components/sections/PrivateHire";
import Circle from "@/components/sections/Circle";
import GalleryStrip from "@/components/sections/GalleryStrip";
import Journal from "@/components/sections/Journal";
import Faq from "@/components/sections/Faq";
import { FAQS } from "@/lib/data";

// Restaurant rich result / Google local pack. Keep in sync with the footer and contact page.
const RESTAURANT = JSON.stringify({
  "@context": "https://schema.org",
  "@type": ["Restaurant", "NightClub"],
  name: "Madò Onnà",
  url: "https://madoonna.com",
  image: "https://madoonna.com/opengraph-image.png",
  logo: "https://madoonna.com/assets/logo-white.png",
  description:
    "Mediterranean restaurant, dinner show, three bars, VIP tables and a club under one roof in Berawa, Canggu, Bali.",
  servesCuisine: "Mediterranean",
  hasMenu: "https://madoonna.com/menus",
  telephone: "+628113800600",
  email: "hello@madoonna.com",
  acceptsReservations: true,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Pantai Berawa",
    addressLocality: "Canggu",
    addressRegion: "Bali",
    postalCode: "80361",
    addressCountry: "ID",
  },
  geo: { "@type": "GeoCoordinates", latitude: -8.6634, longitude: 115.1392 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "18:00",
      closes: "23:00",
    },
    // Club
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "23:00",
      closes: "03:00",
    },
  ],
});

// Same questions as the FAQ section, so Google and AI answers can quote them.
const FAQ_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export default function Home() {
  return (
    <PageShell current="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: RESTAURANT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_LD }} />
      <Hero />
      <Welcome />
      <Night />
      <Show />
      <Rooms />
      <WhatsOn />
      <PrivateHire />
      <Circle />
      <GalleryStrip />
      <Journal />
      <Faq />
    </PageShell>
  );
}
