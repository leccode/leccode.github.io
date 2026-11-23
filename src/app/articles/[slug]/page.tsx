import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/article/copy-button";
import { ArticleCover } from "@/components/article/cover";
import { Markdown, Sources } from "@/components/article/markdown";
import { TableOfContents } from "@/components/article/toc";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/ui/primitives";
import { site } from "@/data/site";
import {
  formatDate,
  getAdjacent,
  getAllArticles,
  getArticle,
} from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${slug}/` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      authors: [site.name],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { newer, older } = getAdjacent(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Person", name: site.name, url: site.url },
    url: `${site.url}/articles/${slug}/`,
    keywords: article.tags.join(", "),
  };

  return (
    <main id="main" tabIndex={-1} className="relative z-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Header */}
      <header className="relative isolate overflow-hidden pb-16 pt-36">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0" />
          <div
            className="absolute left-1/2 top-0 size-160 -translate-x-1/2 rounded-full blur-glow"
            style={{ background: `oklch(0.65 0.2 ${article.hue} / 0.22)` }}
          />
        </div>

        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <Link
              href="/articles/"
              className="btn btn-sm btn-secondary group mb-10 text-muted hover:text-fg"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">
                ←
              </span>{" "}
              All articles
            </Link>
          </Reveal>
          <Reveal delay={0.05} className="flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-accent/10 px-3 py-1 font-mono text-2xs text-accent"
              >
                {t}
              </span>
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-display md:text-6xl">
              {article.title}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-muted">
              {article.description}
            </p>
          </Reveal>
          <Reveal
            delay={0.2}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
          >
            <span className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-linear-to-br from-accent to-accent-2 text-xs font-bold text-accent-fg">
                {site.initials}
              </span>
              <span className="font-medium">{site.name}</span>
            </span>
            <span className="font-mono text-xs text-muted">
              <time dateTime={article.date}>{formatDate(article.date)}</time> ·{" "}
              {article.readingTime} min read
            </span>
          </Reveal>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 xl:grid-cols-[minmax(0,1fr)_15rem]">
        <article
          id="article-body"
          className="mx-auto w-full max-w-176 xl:mx-0 xl:ml-auto xl:mr-0"
        >
          <Reveal delay={0.25}>
            <Markdown blocks={article.blocks} />
          </Reveal>
          <Sources footnotes={article.footnotes} />

          <div className="mt-16 flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted">Enjoyed this? Pass it on.</p>
            <ShareButtons />
          </div>
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-28">
            <TableOfContents
              headings={article.headings}
              minutes={article.readingTime}
            />
          </div>
        </aside>
      </div>

      {/* Prev / next */}
      {(newer || older) && (
        <nav
          aria-label="More articles"
          className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 pb-28 md:grid-cols-2"
        >
          {[
            { a: older, label: "Previous" },
            { a: newer, label: "Next" },
          ].map(({ a, label }) =>
            a ? (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}/`}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card backdrop-blur-xl transition hover:border-accent/40"
              >
                <ArticleCover
                  hue={a.hue}
                  className="h-28 opacity-80 transition-opacity group-hover:opacity-100"
                />
                <div className="p-6">
                  <p className="eyebrow text-2xs text-muted">{label}</p>
                  <p className="mt-2 flex items-start justify-between gap-4 text-lg font-semibold tracking-tight">
                    {a.title}
                    <ArrowUpRight className="mt-1 shrink-0 text-muted transition-all group-hover:rotate-45 group-hover:text-accent" />
                  </p>
                </div>
              </Link>
            ) : (
              <div key={label} className="hidden md:block" />
            ),
          )}
        </nav>
      )}
    </main>
  );
}
