"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import type { ArticleMeta } from "@/lib/articles";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Search } from "../icons";
import { SpotlightCard } from "../ui/primitives";
import { ArticleCover } from "./cover";
import { EASE_OUT, SPRING } from "@/lib/motion";

type Item = ArticleMeta & { dateLabel: string };
/** Search and tag filters only appear once there are enough articles to need them. */
const FILTERS_FROM = 4;

export function ArticleList({ articles }: { articles: Item[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const q = useDeferredValue(query.trim().toLowerCase());

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    articles.forEach((a) =>
      a.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)),
    );
    return [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [articles]);

  const filtered = articles.filter(
    (a) =>
      (!tag || a.tags.includes(tag)) &&
      (!q ||
        `${a.title} ${a.description} ${a.tags.join(" ")}`
          .toLowerCase()
          .includes(q)),
  );

  const showFeatured = !q && !tag;
  const featured = showFeatured
    ? (articles.find((a) => a.featured) ?? articles[0])
    : undefined;
  const rest = featured
    ? filtered.filter((a) => a.slug !== featured.slug)
    : filtered;

  return (
    <div>
      {/* Controls */}
      {articles.length >= FILTERS_FROM && (
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="group relative flex w-full items-center md:max-w-sm">
            <Search className="pointer-events-none absolute left-4 text-muted transition-colors group-focus-within:text-accent" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              aria-label="Search articles"
              className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none backdrop-blur transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
            />
          </label>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by tag"
          >
            {[["All", articles.length] as const, ...tags].map(([t, n]) => {
              const value = t === "All" ? null : t;
              const on = tag === value;
              return (
                <button
                  key={t}
                  onClick={() => setTag(value)}
                  aria-pressed={on}
                  className={cn(
                    "relative rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    on
                      ? "border-transparent text-accent-fg"
                      : "border-border text-muted hover:text-fg",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="tag-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={SPRING}
                    />
                  )}
                  <span className="relative">
                    {t} <span className="opacity-60">{n}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured */}
      <AnimatePresence initial={false}>
        {featured && (
          <motion.div
            key="featured"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <Link href={`/articles/${featured.slug}/`} className="block">
              <SpotlightCard>
                <div className="grid h-full grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                  <ArticleCover
                    hue={featured.hue}
                    title={featured.title}
                    className="min-h-56 md:min-h-80"
                  />
                  <div className="flex flex-col p-8">
                    <span className="badge mb-4 bg-accent/10 uppercase tracking-widest text-accent">
                      Latest
                    </span>
                    <h2 className="text-balance text-3xl font-semibold tracking-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-pretty text-muted">
                      {featured.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {featured.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-8 font-mono text-xs text-muted">
                      <span>
                        {featured.dateLabel} · {featured.readingTime} min read
                      </span>
                      <span className="inline-flex items-center gap-1 text-fg">
                        Read{" "}
                        <ArrowUpRight
                          width={15}
                          height={15}
                          className="transition-transform group-hover:rotate-45"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {rest.length > 0 && (
        <motion.ul
          layout
          className="mt-6 divide-y divide-border border-y border-border"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {rest.map((a, i) => (
              <motion.li
                key={a.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16, filter: "blur(4px)" }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: EASE_OUT }}
              >
                <Row article={a} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-serif text-3xl italic">Nothing here… yet.</p>
          <p className="mt-2 text-muted">Try another search or tag.</p>
          <button
            onClick={() => {
              setQuery("");
              setTag(null);
            }}
            className="btn btn-sm btn-secondary mt-6"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ article: a }: { article: Item }) {
  return (
    <Link
      href={`/articles/${a.slug}/`}
      className="group relative grid items-center gap-x-8 gap-y-2 py-8 md:grid-cols-[9rem_minmax(0,1fr)_auto]"
    >
      <span className="absolute inset-0 -mx-4 scale-y-90 rounded-2xl bg-fg/3 opacity-0 transition-all duration-300 group-hover:scale-y-100 group-hover:opacity-100" />
      <time dateTime={a.date} className="relative font-mono text-xs text-muted">
        {a.dateLabel}
      </time>
      <div className="relative">
        <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-accent md:text-2xl">
          {a.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-pretty text-muted">
          {a.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      <span className="relative hidden items-center gap-3 font-mono text-xs text-muted md:flex">
        {a.readingTime} min
        <span className="grid size-10 place-items-center rounded-full border border-border transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg">
          <ArrowUpRight
            width={16}
            height={16}
            className="transition-transform duration-300 group-hover:rotate-45"
          />
        </span>
      </span>
    </Link>
  );
}
