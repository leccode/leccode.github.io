/**
 * Minimal, dependency-free Markdown → block AST.
 * Supports: ## headings, paragraphs, ordered/unordered lists, fenced code (with title="…"),
 * blockquotes, GitHub-style callouts (> [!NOTE] / [!TIP] / [!WARNING]), images and ---.
 * Also: $$ equation $$ blocks, ![alt](src "caption") images, and footnote-style citations:
 *   text with a citation[^1]   …   [^1]: Author, “Title,” *Journal*, 2024. [PDF](https://…)
 * Inline: `code`, **bold**, *italic*, ~subscript~, [links](url), [^n] — rendered by <Markdown />.
 */

export type Block =
  | { type: "heading"; level: 2 | 3 | 4; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; title?: string; code: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; kind: "note" | "tip" | "warning"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "math"; text: string }
  | { type: "hr" };

export type Heading = { id: string; text: string; level: 2 | 3 | 4 };
export type Footnote = { n: number; text: string };

const FENCE = /^```([\w+-]+)?(?:\s+title="([^"]+)")?\s*$/;
const HEADING = /^(#{2,4})\s+(.+?)\s*#*\s*$/;
const HR = /^(-{3,}|\*{3,}|_{3,})\s*$/;
const IMAGE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/;
const MATH_OPEN = /^\$\$/;
const FOOTNOTE = /^\[\^(\d+)\]:\s+(.+)$/;
const LIST_ITEM = /^\s*([-*+]|\d+\.)\s+/;

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Strips inline markdown so headings/TOC show plain text. */
export function plain(s: string) {
  return s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[\^\d+\]/g, "")
    .replace(/[`*~]/g, "")
    .replace(/(^|\W)_([^_]+)_(?=\W|$)/g, "$1$2");
}

const isBlockStart = (l: string) =>
  FENCE.test(l) ||
  HEADING.test(l) ||
  HR.test(l) ||
  IMAGE.test(l) ||
  MATH_OPEN.test(l) ||
  FOOTNOTE.test(l) ||
  l.startsWith(">") ||
  LIST_ITEM.test(l);

/** Parses a document into blocks plus its footnote definitions (used as "Sources"). */
export function parseDocument(src: string): {
  blocks: Block[];
  footnotes: Footnote[];
} {
  const footnotes: Footnote[] = [];
  const body = src
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .filter((line) => {
      const m = line.match(FOOTNOTE);
      if (m) footnotes.push({ n: Number(m[1]), text: m[2].trim() });
      return !m;
    })
    .join("\n");
  return {
    blocks: parseMarkdown(body),
    footnotes: footnotes.sort((a, b) => a.n - b.n),
  };
}

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  const ids = new Map<string, number>();
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = line.match(FENCE);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```"))
        buf.push(lines[i++]);
      i++; // closing fence
      blocks.push({
        type: "code",
        lang: fence[1] ?? "txt",
        title: fence[2],
        code: buf.join("\n"),
      });
      continue;
    }

    const h = line.match(HEADING);
    if (h) {
      const text = h[2];
      const base = slugify(plain(text)) || "section";
      const n = ids.get(base) ?? 0;
      ids.set(base, n + 1);
      blocks.push({
        type: "heading",
        level: h[1].length as 2 | 3 | 4,
        text,
        id: n ? `${base}-${n}` : base,
      });
      i++;
      continue;
    }

    if (MATH_OPEN.test(line)) {
      // single line: $$ … $$   or multi-line block between $$ fences
      const single = line.trim().match(/^\$\$(.+)\$\$$/);
      if (single) {
        blocks.push({ type: "math", text: single[1].trim() });
        i++;
        continue;
      }
      const buf: string[] = [line.replace(/^\$\$/, "")];
      i++;
      while (i < lines.length && !lines[i].trim().endsWith("$$"))
        buf.push(lines[i++]);
      if (i < lines.length) buf.push(lines[i++].replace(/\$\$\s*$/, ""));
      blocks.push({ type: "math", text: buf.join(" ").trim() });
      continue;
    }

    if (HR.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    const img = line.match(IMAGE);
    if (img) {
      blocks.push({ type: "image", alt: img[1], src: img[2], caption: img[3] });
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">"))
        buf.push(lines[i++].replace(/^>\s?/, ""));
      const alert = buf[0]?.match(/^\[!(NOTE|TIP|WARNING)\]\s*$/i);
      if (alert) {
        blocks.push({
          type: "callout",
          kind: alert[1].toLowerCase() as "note" | "tip" | "warning",
          text: buf.slice(1).join(" ").trim(),
        });
      } else {
        blocks.push({ type: "quote", text: buf.join(" ").trim() });
      }
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && LIST_ITEM.test(lines[i])) {
        items.push(lines[i].replace(LIST_ITEM, ""));
        i++;
        // continuation lines (indented, not a new item)
        while (
          i < lines.length &&
          /^\s{2,}\S/.test(lines[i]) &&
          !LIST_ITEM.test(lines[i])
        ) {
          items[items.length - 1] += ` ${lines[i].trim()}`;
          i++;
        }
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const buf: string[] = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i]))
      buf.push(lines[i++].trim());
    blocks.push({ type: "paragraph", text: buf.join(" ") });
  }

  return blocks;
}

export function headingsOf(blocks: Block[]): Heading[] {
  return blocks
    .filter(
      (b): b is Extract<Block, { type: "heading" }> =>
        b.type === "heading" && b.level <= 3,
    )
    .map((b) => ({ id: b.id, text: plain(b.text), level: b.level }));
}

export function readingTime(src: string) {
  const words = src
    .replace(/```[\s\S]*?```/g, (code) =>
      "w ".repeat(Math.ceil(code.length / 25)),
    )
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
