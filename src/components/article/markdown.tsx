import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { highlight } from "@/lib/highlight";
import type { Block, Footnote } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

/* ---------- Inline: `code`, **bold**, *italic*, ~sub~, [link](url), [^n] citations ---------- */

const INLINE =
  /(`[^`]+`)|(\*\*(?:[^*]|\*(?!\*))+\*\*)|(\*[^*\s][^*]*\*|(?<![\w])_[^_]+_(?![\w]))|(\[\^\d+\])|(\[[^\]]+\]\([^)\s]+\))|(~[^~\s][^~]*~)/g;

export function Inline({ text }: { text: string }): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const [tok, code, bold, italic, cite, link, sub] = m;
    if (code) {
      out.push(
        <code
          key={k++}
          className="rounded-md border border-border bg-fg/5 px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
        >
          {code.slice(1, -1)}
        </code>,
      );
    } else if (bold) {
      out.push(
        <strong key={k++} className="font-semibold text-fg">
          <Inline text={bold.slice(2, -2)} />
        </strong>,
      );
    } else if (italic) {
      out.push(
        <em key={k++}>
          <Inline text={italic.slice(1, -1)} />
        </em>,
      );
    } else if (cite) {
      const n = cite.slice(2, -1);
      out.push(
        <sup key={k++} className="ml-0.5">
          <a
            href={`#source-${n}`}
            aria-label={`Source ${n}`}
            className="rounded px-0.5 font-mono text-[0.7em] text-accent no-underline transition-colors hover:bg-accent/10"
          >
            [{n}]
          </a>
        </sup>,
      );
    } else if (sub) {
      out.push(<sub key={k++}>{sub.slice(1, -1)}</sub>);
    } else if (link) {
      const [, label, href] = link.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/) ?? [];
      const external = /^https?:\/\//.test(href);
      const cls = "link";
      out.push(
        external ? (
          <a
            key={k++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
          >
            <Inline text={label} />
          </a>
        ) : (
          <Link key={k++} href={href} className={cls}>
            <Inline text={label} />
          </Link>
        ),
      );
    }
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/* ---------- Code block (server-highlighted) ---------- */

const LANG_MAP: Record<string, string> = {
  ts: "ts",
  tsx: "tsx",
  js: "ts",
  jsx: "tsx",
  mjs: "ts",
  json: "ts",
  css: "ts",
  py: "py",
  python: "py",
  cs: "cs",
  csharp: "cs",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
};

function CodeBlock({
  code,
  lang,
  title,
}: {
  code: string;
  lang: string;
  title?: string;
}) {
  const mapped = LANG_MAP[lang];
  const tokens = mapped
    ? highlight(code, mapped)
    : [{ type: "plain" as const, text: code }];
  const lines: Array<typeof tokens> = [[]];
  for (const t of tokens) {
    t.text.split("\n").forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ type: t.type, text: part });
    });
  }

  return (
    <figure className="code-window group/code relative my-8 overflow-hidden rounded-2xl border border-white/10 font-mono text-code shadow-xl shadow-black/20">
      <figcaption className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5 text-xs text-white/50">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="truncate">{title ?? lang}</span>
        <span className="ml-auto flex items-center gap-2">
          {title && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-3xs uppercase tracking-wider">
              {lang}
            </span>
          )}
          <CopyButton text={code} />
        </span>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4">
        <code className="block min-w-max">
          {lines.map((line, i) => (
            <span key={i} className="flex">
              <span className="mr-5 w-6 shrink-0 select-none text-right text-white/20">
                {i + 1}
              </span>
              <span className="whitespace-pre">
                {line.length === 0
                  ? " "
                  : line.map((t, j) => (
                      <span key={j} className={`tok-${t.type}`}>
                        {t.text}
                      </span>
                    ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

/* ---------- Callouts ---------- */

const CALLOUT = {
  note: { label: "Note", icon: "ℹ", cls: "border-sky-500/30 bg-sky-500/6" },
  tip: { label: "Tip", icon: "✦", cls: "border-accent/30 bg-accent/7" },
  warning: {
    label: "Heads up",
    icon: "!",
    cls: "border-amber-500/30 bg-amber-500/7",
  },
} as const;

/* ---------- Blocks ---------- */

export function Markdown({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[1.0625rem] leading-[1.8] text-fg/80">
      {blocks.map((b, i) => (
        <Fragment key={i}>{renderBlock(b)}</Fragment>
      ))}
    </div>
  );
}

function renderBlock(b: Block): ReactNode {
  switch (b.type) {
    case "heading": {
      const Tag = `h${b.level}` as "h2" | "h3" | "h4";
      return (
        <Tag
          id={b.id}
          className={cn(
            "group/h relative scroll-mt-28 font-semibold tracking-tight text-fg",
            b.level === 2 && "mb-4 mt-16 text-3xl",
            b.level === 3 && "mb-3 mt-10 text-xl",
            b.level === 4 && "mb-2 mt-8 text-lg",
          )}
        >
          <a
            href={`#${b.id}`}
            aria-label="Link to this section"
            className="absolute -left-7 top-0 hidden pr-2 text-accent opacity-0 transition-opacity group-hover/h:opacity-100 md:block"
          >
            #
          </a>
          <Inline text={b.text} />
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p className="my-6 text-pretty">
          <Inline text={b.text} />
        </p>
      );
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "my-6 space-y-2 pl-6",
            b.ordered
              ? "list-decimal marker:font-mono marker:text-accent"
              : "list-disc marker:text-accent",
          )}
        >
          {b.items.map((item, i) => (
            <li key={i} className="pl-1.5">
              <Inline text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "code":
      return <CodeBlock code={b.code} lang={b.lang} title={b.title} />;
    case "quote":
      return (
        <blockquote className="my-8 border-l-2 border-accent pl-6 font-serif text-2xl italic leading-snug text-fg">
          <Inline text={b.text} />
        </blockquote>
      );
    case "callout": {
      const c = CALLOUT[b.kind];
      return (
        <aside
          className={cn(
            "my-8 flex gap-4 rounded-2xl border p-5 text-[0.95rem]",
            c.cls,
          )}
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-fg/10 font-mono text-xs font-bold text-fg">
            {c.icon}
          </span>
          <div>
            <p className="mb-1 eyebrow text-2xs text-fg">{c.label}</p>
            <p>
              <Inline text={b.text} />
            </p>
          </div>
        </aside>
      );
    }
    case "image":
      return (
        <figure className="my-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={b.src}
            alt={b.alt}
            loading="lazy"
            className="w-full rounded-2xl border border-border bg-card"
          />
          {b.caption && (
            <figcaption className="mt-3 text-center text-sm text-muted">
              <Inline text={b.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "math":
      return (
        <div
          role="math"
          className="my-8 overflow-x-auto rounded-2xl border border-border bg-card px-6 py-5 text-center font-serif text-[1.35rem] italic text-fg backdrop-blur"
        >
          <Inline text={b.text} />
        </div>
      );
    case "hr":
      return (
        <div
          aria-hidden
          className="my-14 flex justify-center gap-3 text-accent"
        >
          ✦ <span className="text-muted">✦</span> ✦
        </div>
      );
  }
}

/* ---------- Sources (from footnote definitions) ---------- */

export function Sources({ footnotes }: { footnotes: Footnote[] }) {
  if (footnotes.length === 0) return null;
  return (
    <section
      aria-labelledby="sources"
      className="mt-16 border-t border-border pt-10"
    >
      <h2
        id="sources"
        className="scroll-mt-28 text-xl font-semibold tracking-tight"
      >
        Sources
      </h2>
      <ol className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        {footnotes.map((f) => (
          <li
            key={f.n}
            id={`source-${f.n}`}
            className="flex scroll-mt-28 gap-3 rounded-xl p-2 -mx-2 transition-colors target:bg-accent/10"
          >
            <span className="shrink-0 font-mono text-accent">[{f.n}]</span>
            <span>
              <Inline text={f.text} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
