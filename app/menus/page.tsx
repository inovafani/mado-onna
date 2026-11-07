import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import MenusView from "@/components/pages/MenusView";
import { U } from "@/lib/data";

export const metadata: Metadata = {
  title: "Menus · Mediterranean restaurant & cocktails in Canggu · Madò Onnà",
  description: "À la carte, the Bodrum Nights show dinner, cocktails and the street bar. Italy, Greece, Morocco and Spain, cooked over charcoal.",
};

export default function Menus() {
  return (
    <PageShell current="menus">
      <PageHero
        size="sm"
        xl
        img={U("1534080564583-6be75777b70a", 2000)}
        alt="Seafood paella on a dark table"
        title="Menus"
        aside={<p>Italy, Greece, Morocco and Spain, cooked over charcoal and made for sharing. Everything changes a little with the season.</p>}
      />
      <MenusView />
    </PageShell>
  );
}
