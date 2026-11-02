import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PageHeader } from "@/components/PageHero";
import GalleryView from "@/components/pages/GalleryView";

export const metadata: Metadata = {
  title: "Gallery · Madò Onnà, Berawa",
  description: "The plates, the stage, the bars and the floor, from dusk to dawn.",
};

export default function Gallery() {
  return (
    <PageShell current="gallery">
      <PageHeader
        title={
          <>
            Dusk to <em className="accent">dawn</em>
          </>
        }
        side={<p className="pt__lede">Unposed, mostly. A look at the plates, the stage, the bars and the floor, exactly as the night tends to go.</p>}
      />
      <GalleryView />
    </PageShell>
  );
}
