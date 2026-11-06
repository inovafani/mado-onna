import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PageHeader } from "@/components/PageHero";
import JournalView from "@/components/pages/JournalView";
import { getPosts } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal · Madò Onnà, Berawa",
  description: "Recipes, rehearsals, the people who make the night, and the places that inspired it.",
};

export default async function Journal() {
  return (
    <PageShell current="journal">
      <PageHeader
        title={
          <>
            Notes from <em className="accent">the house</em>
          </>
        }
        side={<p className="pt__lede">Recipes, rehearsals, the people who make the night, and the places that inspired it.</p>}
      />
      <JournalView posts={(await getPosts()).map((p) => ({ ...p, content: null }))} />
    </PageShell>
  );
}
