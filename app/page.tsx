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

export default function Home() {
  return (
    <PageShell current="home">
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
