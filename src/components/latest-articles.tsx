import Link from "next/link";
import { formatDate, getAllArticles, type ArticleMeta } from "@/lib/articles";
import { cn } from "@/lib/utils";
import { ArticleCover } from "./article/cover";
import { ArrowUpRight } from "./icons";
import { Reveal, SectionHeading, SpotlightCard } from "./ui/primitives";

/** Home-page "Blog" section: the newest articles. A single article gets a wide card. */
export function LatestArticles() {
  const items = getAllArticles().slice(0, 3);
  if (items.length === 0) return null;
  const wide = items.length === 1;

  return (
    <section
      id="articles"
      className="relative mx-auto max-w-7xl px-6 py-28 md:py-40"
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          index="04"
          eyebrow="Blog"
          title={
            <>
              Science{" "}
              <span className="text-gradient font-serif font-normal italic">
                &amp;
              </span>{" "}
              tech, written down.
            </>
          }
        >
          Notes on deep learning, quantum computing and code.
        </SectionHeading>
        <Reveal className="mb-12 md:mb-16">
          <Link href="/articles/" className="btn btn-md btn-secondary group">
            All articles
            <ArrowUpRight
              width={16}
              height={16}
              className="transition-transform group-hover:rotate-45"
            />
          </Link>
        </Reveal>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          !wide && "md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {items.map((a, i) => (
          <Reveal key={a.slug} delay={i * 0.08} className="h-full">
            <Link href={`/articles/${a.slug}/`} className="block h-full">
              <Card article={a} wide={wide} />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Card({ article: a, wide }: { article: ArticleMeta; wide: boolean }) {
  return (
    <SpotlightCard tilt={!wide} className="h-full p-3">
      <div
        className={cn(
          "grid h-full grid-cols-1",
          wide &&
            "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center",
        )}
      >
        <ArticleCover
          hue={a.hue}
          title={a.title}
          className={cn("rounded-2xl", wide ? "aspect-16/9" : "aspect-16/10")}
        />
        <div className={cn("flex flex-col p-4", wide && "md:p-8")}>
          <p className="font-mono text-xs text-muted">
            {formatDate(a.date, "short")} · {a.readingTime} min read
          </p>
          <h3
            className={cn(
              "mt-2 font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent",
              wide ? "text-2xl md:text-3xl" : "text-lg",
            )}
          >
            {a.title}
          </h3>
          <p
            className={cn(
              "mt-2 text-muted",
              wide ? "text-pretty" : "line-clamp-3 text-sm leading-relaxed",
            )}
          >
            {a.description}
          </p>
          {wide && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {a.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          )}
          {wide && (
            <span className="mt-8 inline-flex items-center gap-1 text-sm font-medium">
              Read article{" "}
              <ArrowUpRight
                width={15}
                height={15}
                className="transition-transform group-hover:rotate-45"
              />
            </span>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
