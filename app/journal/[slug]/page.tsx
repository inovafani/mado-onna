import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import BookButton from "@/components/BookButton";
import { Button, Icon, Media } from "@/components/ds";
import ArticleExtras from "@/components/ArticleExtras";
import { getPosts, type Post } from "@/lib/journal";
import { ACTS, U } from "@/lib/data";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPosts()).find((p) => p.slug === slug);
  if (!post) return {};
  const title = post.meta_title || `${post.title} · Madò Onnà Journal`;
  const description = post.meta_description || post.dek;
  const ogTitle = post.og_title || title;
  const ogDescription = post.og_description || description;
  const images = post.img ? [{ url: post.img, alt: post.image_alt || post.title }] : undefined;
  return {
    title,
    description,
    keywords: post.tags.length ? post.tags : undefined,
    alternates: post.canonical_url ? { canonical: post.canonical_url } : undefined,
    openGraph: {
      type: "article",
      title: ogTitle,
      description: ogDescription,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: [post.author],
      images,
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription, images },
  };
}

// FAQ rich results: each H2/H3 is a question, the paragraph straight after it the answer.
function faq(html: string) {
  const text = (h: string) => h.replace(/<[^>]+>/g, "").trim();
  return [...html.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>\s*<p[^>]*>(.*?)<\/p>/gi)]
    .map((m) => ({ "@type": "Question", name: text(m[1]), acceptedAnswer: { "@type": "Answer", text: text(m[2]) } }))
    .filter((q) => q.name && q.acceptedAnswer.text)
    .slice(0, 10);
}

function jsonLd(post: Post) {
  const out: object[] = [];
  if (post.schema_types.includes("Article"))
    out.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.meta_description || post.dek,
      image: post.img || undefined,
      datePublished: post.published_at ?? post.created_at,
      dateModified: post.updated_at ?? post.published_at ?? post.created_at,
      author: { "@type": post.author === "Madò Onnà" ? "Organization" : "Person", name: post.author },
      publisher: { "@type": "Organization", name: "Madò Onnà" },
      keywords: post.tags.join(", ") || undefined,
    });
  const questions = post.schema_types.includes("FAQPage") ? faq(post.content ?? "") : [];
  if (questions.length) out.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions });
  return out.map((o) => JSON.stringify(o).replace(/</g, "\\u003c"));
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
  const posts = await getPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const post = posts[i];
  const next = posts[(i + 1) % posts.length];
  const acts = ACTS.filter((a) => post.related_acts.includes(a.id));

  return (
    // Keyed by slug: moving between articles must remount, since the scroll reveals split and rewrite the DOM.
    <PageShell key={slug} current="journal">
      <PageHero
        size="md"
        img={post.img}
        alt={post.image_alt ?? ""}
        title={post.title}
        below={
          <div className="article__meta">
            <Link href="/journal" className="article__back">
              <Icon name="arrow-left" size={14} /> All stories
            </Link>
            <span className="eyebrow eyebrow--body">
              {post.cat} · {post.date} · {post.mins}
              {post.author !== "Madò Onnà" && ` · By ${post.author}`}
            </span>
          </div>
        }
      />

      {jsonLd(post).map((json, n) => (
        <script key={n} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      ))}
      <ArticleExtras slug={post.slug} embeds={!!post.content?.includes("instagram-media")} />
      <article className="sec section-pad">
        <div className="article">
          <p className="article__dek" data-scrub-words="">
            {post.dek}
          </p>
          {/* Content is authored only by signed-in admins (RLS), so it is trusted HTML. */}
          <div className="article__body" data-fade="" dangerouslySetInnerHTML={{ __html: post.content ?? "" }} />
          <div className="article__end" data-fade="">
            <span>Hungry for it?</span>
            <div>
              <Button href="/journal">More stories</Button>
              <BookButton variant="primary">Reserve a table</BookButton>
            </div>
          </div>
        </div>
      </article>

      {acts.length > 0 && (
        <section className="sec sec--flush-top section-pad">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h-md" data-split="lines">
                Make a night <em className="accent">of it</em>
              </h2>
            </div>
            <div className="jposts">
              {acts.map((a, n) => (
                <Link key={a.id} href={a.href} className="jpost post">
                  <Media ratio="4/3" src={U(a.img, 800)} alt="" className="media--hover" delay={n * 0.1} parallax={0.05} />
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                  <span className="line-link">
                    <span className="line-link__rule" aria-hidden="true" />
                    <span>{a.cta}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
          <Media ratio="16/10" src={next.img} alt={next.image_alt ?? ""} className="media--hover" />
        </Link>
      </section>
    </PageShell>
  );
}
