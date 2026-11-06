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

// Restaurant rich result / Google local pack. Keep in sync with the footer and contact page.
const RESTAURANT = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Madò Onnà",
  url: "https://madoonna.com",
  image: "https://madoonna.com/opengraph-image.png",
  logo: "https://madoonna.com/assets/logo-white.png",
  description:
    "Mediterranean restaurant, show dinner, three bars and a club under one roof in Berawa, Bali.",
  servesCuisine: "Mediterranean",
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
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "18:00",
    closes: "23:00",
  },
});

export default function Home() {
  return (
    <PageShell current="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: RESTAURANT }} />
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
