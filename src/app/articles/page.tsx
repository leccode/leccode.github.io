import type { Metadata } from "next";
import { ArticleList } from "@/components/article/article-list";
import { Reveal } from "@/components/ui/primitives";
import { formatDate, getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description: "Notes on deep learning, quantum computing and code.",
  alternates: { types: { "application/rss+xml": "/articles/rss.xml" } },
};

export default function ArticlesPage() {
  const articles = getAllArticles().map((a) => ({
    ...a,
    dateLabel: formatDate(a.date, "short"),
  }));

  return (
    <main
      id="main"
      tabIndex={-1}
      className="relative z-1 isolate overflow-hidden"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-144">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute left-1/4 top-10 size-128 animate-blob rounded-full bg-accent/20 blur-glow" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-28 pt-40">
        <Reveal className="mb-16">
          <p className="eyebrow text-xs tracking-eyebrow text-muted">
            <span className="text-accent">
              {String(articles.length).padStart(2, "0")}
            </span>{" "}
            — Articles
          </p>
          <h1 className="mt-5 text-balance text-5xl font-semibold leading-display tracking-display md:text-7xl">
            Science{" "}
            <span className="text-gradient font-serif font-normal italic">
              &amp;
            </span>{" "}
            tech blog.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted">
            Notes on deep learning, quantum computing and code.{" "}
            <a href="/articles/rss.xml" className="link">
              RSS
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ArticleList articles={articles} />
        </Reveal>
      </div>
    </main>
  );
}
