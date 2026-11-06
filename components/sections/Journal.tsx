import Link from "next/link";
import { getPosts } from "@/lib/journal";
import { Button, Icon, Media } from "@/components/ds";

export default async function Journal() {
  const posts = await getPosts();
  return (
    <section id="journal" className="journal section-pad" data-screen-label="Home · Journal">
      <div className="hairline" data-line="" />
      <div className="wrap list-stack">
        <div className="split-head">
          <div>
            <h2 className="h-lg" data-split="lines">
              Stories from the house
            </h2>
          </div>
          <div data-fade="" data-delay="0.2">
            <Button href="/journal" iconRight={<Icon name="arrow-right" />}>
              All stories
            </Button>
          </div>
        </div>
        <div className="posts">
          {posts.slice(0, 3).map((p, i) => (
            <Link key={p.slug} href={`/journal/${p.slug}`} className="post">
              <Media ratio="4/3" parallax={0.05} delay={i * 0.12} src={p.img} alt={p.image_alt ?? ""} />
              <span className="eyebrow" data-fade="16" data-delay={String(0.2 + i * 0.12)}>
                {p.cat} · {p.date}
              </span>
              <h3 data-fade="16" data-delay={String(0.28 + i * 0.12)}>
                {p.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
