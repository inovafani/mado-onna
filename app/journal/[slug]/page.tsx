import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import BookButton from "@/components/BookButton";
import { Button, Icon, Media } from "@/components/ds";
import { POSTS } from "@/lib/journal";
import { U } from "@/lib/data";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: `${post.title} · Madò Onnà Journal`, description: post.dek };
}

// Every article is prerendered; the boundary only covers the moment a client navigation resolves the slug.
export default function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<div className="page-fallback" />}>
      <Article params={params} />
    </Suspense>
  );
}

async function Article({ params }: { params: PageProps<"/journal/[slug]">["params"] }) {
  const { slug } = await params;
  const i = POSTS.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const post = POSTS[i];
  const next = POSTS[(i + 1) % POSTS.length];

  return (
    // Keyed by slug: moving between articles must remount, since the scroll reveals split and rewrite the DOM.
    <PageShell key={slug} current="journal">
      <PageHero
        size="md"
        img={U(post.img, 2000)}
        alt=""
        title={post.title}
        below={
          <div className="article__meta">
            <Link href="/journal" className="article__back">
              <Icon name="arrow-left" size={14} /> All stories
            </Link>
            <span className="eyebrow eyebrow--body">
              {post.cat} · {post.date} · {post.mins}
            </span>
          </div>
        }
      />

      <article className="sec section-pad">
        <div className="article">
          <p className="article__dek" data-scrub-words="">
            {post.dek}
          </p>
          {post.body.map((para, n) => (
            <p key={n} className="article__p" data-fade="">
              {para}
            </p>
          ))}
          <div className="article__end" data-fade="">
            <span>Hungry for it?</span>
            <div>
              <Button href="/journal">More stories</Button>
              <BookButton variant="primary">Reserve a table</BookButton>
            </div>
          </div>
        </div>
      </article>

      <section className="section-pad next-story">
        <Link href={`/journal/${next.slug}`} className="wrap next-story__link">
          <div className="next-story__copy">
            <span className="eyebrow">Next story · {next.cat}</span>
            <h2 className="h-lg" data-split="lines">
              {next.title}
            </h2>
            <span className="line-link" data-fade="16">
              <span className="line-link__rule" aria-hidden="true" />
              <span>Read · {next.mins}</span>
            </span>
          </div>
          <Media ratio="16/10" src={U(next.img, 1200)} alt="" className="media--hover" />
        </Link>
      </section>
    </PageShell>
  );
}
