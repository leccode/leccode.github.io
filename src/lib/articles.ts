import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import {
  headingsOf,
  parseDocument,
  readingTime,
  type Block,
  type Footnote,
  type Heading,
} from "./markdown";

/**
 * Articles live in /content/articles/*.md with a small frontmatter block:
 *
 * ---
 * title: My article
 * description: One-line summary
 * date: 2026-11-01
 * tags: [React, CSS]
 * hue: 285          # optional — cover art color (0–360)
 * featured: true    # optional
 * draft: true       # optional — hidden from the site
 * ---
 *
 * Citations: write text[^1] and define "[^1]: Source text [Link](https://…)" anywhere.
 * They are rendered as a numbered "Sources" list at the end of the article.
 */

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  hue: number;
  readingTime: number;
  featured: boolean;
};

export type Article = ArticleMeta & {
  blocks: Block[];
  headings: Heading[];
  footnotes: Footnote[];
};

const DIR = path.join(process.cwd(), "content", "articles");

function parseFrontmatter(src: string) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const data: Record<string, string | string[]> = {};
  if (!m) return { data, body: src };

  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const raw = line
      .slice(idx + 1)
      .replace(/\s+#.*$/, "")
      .trim();
    const unquote = (s: string) => s.trim().replace(/^["']|["']$/g, "");
    data[key] =
      raw.startsWith("[") && raw.endsWith("]")
        ? raw.slice(1, -1).split(",").map(unquote).filter(Boolean)
        : unquote(raw);
  }
  return { data, body: src.slice(m[0].length) };
}

const str = (v: unknown, fallback = "") =>
  typeof v === "string" ? v : fallback;

function load(slug: string): (Article & { draft: boolean }) | null {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, body } = parseFrontmatter(fs.readFileSync(file, "utf8"));
  const { blocks, footnotes } = parseDocument(body);
  const headings = headingsOf(blocks);
  if (footnotes.length)
    headings.push({ id: "sources", text: "Sources", level: 2 });

  return {
    slug,
    title: str(data.title, slug),
    description: str(data.description),
    date: str(data.date),
    tags: Array.isArray(data.tags) ? data.tags : [],
    hue: Number(str(data.hue, "285")) || 285,
    featured: data.featured === "true",
    draft: data.draft === "true",
    readingTime: readingTime(body),
    blocks,
    footnotes,
    headings,
  };
}

const toMeta = ({
  slug,
  title,
  description,
  date,
  tags,
  hue,
  readingTime,
  featured,
}: Article): ArticleMeta => ({
  slug,
  title,
  description,
  date,
  tags,
  hue,
  readingTime,
  featured,
});

const loadAll = cache(() => {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => load(f.replace(/\.md$/, "")))
    .filter((a): a is NonNullable<typeof a> => !!a && !a.draft);
});

/** Published articles (those with a date), newest first. */
export const getAllArticles = cache((): ArticleMeta[] =>
  loadAll()
    .filter((a) => a.date)
    .map(toMeta)
    .sort((a, b) => b.date.localeCompare(a.date)),
);

export const getArticle = cache((slug: string): Article | null => {
  if (!/^[\w-]+$/.test(slug)) return null;
  const a = load(slug);
  return a && !a.draft && a.date ? a : null;
});

export function getAdjacent(slug: string) {
  const all = getAllArticles();
  const i = all.findIndex((a) => a.slug === slug);
  return {
    newer: i > 0 ? all[i - 1] : null,
    older: i >= 0 && i < all.length - 1 ? all[i + 1] : null,
  };
}

export function formatDate(date: string, style: "long" | "short" = "long") {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
