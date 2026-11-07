import Link from "next/link";
import type { ReactNode } from "react";
import type { Article } from "@/data/articles";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { ArrowLeftIcon } from "@/components/ui/Icons";

export type Source = {
  text: ReactNode;
  href: string;
  label: string;
};

type ArticleLayoutProps = {
  article: Article & { publishedAt: string };
  sources?: readonly Source[];
  children: ReactNode;
};

export function ArticleLayout({
  article,
  sources = [],
  children,
}: ArticleLayoutProps) {
  return (
    <Container size="narrow" className="py-14 sm:py-20">
      <Link
        href="/blog/"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeftIcon width={16} height={16} />
        All articles
      </Link>

      <article className="mt-8">
        <header className="mb-10">
          <ul className="flex flex-wrap gap-2" aria-label="Topics">
            {article.tags.map((tag) => (
              <li key={tag}>
                <Tag tone="accent">{tag}</Tag>
              </li>
            ))}
          </ul>
          <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-muted">
            {siteConfig.name},{" "}
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          </p>
        </header>

        <div className="panel rounded-2xl p-6 sm:p-10">{children}</div>

        {sources.length > 0 && (
          <section aria-labelledby="sources-title" className="mt-12">
            <h2 id="sources-title" className="text-lg font-semibold">
              Sources
            </h2>
            <ol className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
              {sources.map((source, index) => (
                <li
                  key={source.href}
                  id={`source-${index + 1}`}
                  className="flex gap-3"
                >
                  <span className="shrink-0 text-accent">[{index + 1}]</span>
                  <span>
                    {source.text}{" "}
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      {source.label}
                    </a>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>
    </Container>
  );
}
