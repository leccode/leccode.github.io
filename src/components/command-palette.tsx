"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Copy,
  Hash,
  Monitor,
  Moon,
  Palette,
  Search,
  Sparkles,
  Sun,
} from "./icons";
import { SECTIONS, useGo, useModKey } from "./nav";
import { ACCENTS, useTheme, type Accent } from "./theme-provider";
import { SPRING } from "@/lib/motion";

type Item = {
  id: string;
  label: string;
  group: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  hint?: string;
  swatch?: number;
  run: () => void;
};

export function CommandPalette({
  articles = [],
}: {
  articles?: { slug: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { setMode, setAccent } = useTheme();
  const go = useGo();
  const mod = useModKey();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  // Focus the input on open; give focus back to whatever had it on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    setQuery("");
    setIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      requestAnimationFrame(() => previous?.focus?.({ preventScroll: true }));
    };
  }, [open]);

  const items = useMemo<Item[]>(
    () => [
      ...SECTIONS.map((s) => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        group: "Navigate",
        icon: Hash,
        run: () => go(s),
      })),
      {
        id: "page-about",
        label: "About me (page)",
        group: "Navigate",
        icon: ArrowUpRight,
        run: () => router.push("/about/"),
      },
      ...articles.map((a) => ({
        id: `article-${a.slug}`,
        label: a.title,
        group: "Articles",
        icon: Sparkles,
        run: () => router.push(`/articles/${a.slug}/`),
      })),
      {
        id: "mode-dark",
        label: "Dark mode",
        group: "Theme",
        icon: Moon,
        run: () => setMode("dark"),
      },
      {
        id: "mode-light",
        label: "Light mode",
        group: "Theme",
        icon: Sun,
        run: () => setMode("light"),
      },
      {
        id: "mode-system",
        label: "System theme",
        group: "Theme",
        icon: Monitor,
        run: () => setMode("system"),
      },
      ...(Object.keys(ACCENTS) as Accent[]).map((a) => ({
        id: `accent-${a}`,
        label: `Accent: ${a[0].toUpperCase()}${a.slice(1)}`,
        group: "Accent color",
        icon: Palette,
        swatch: ACCENTS[a],
        run: () => setAccent(a),
      })),
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Contact",
        icon: Copy,
        hint: site.email,
        run: () => navigator.clipboard?.writeText(site.email),
      },
      ...site.socials.map((s) => ({
        id: `social-${s.icon}`,
        label: `Open ${s.label}`,
        group: "Contact",
        icon: ArrowUpRight,
        run: () => window.open(s.href, "_blank", "noopener,noreferrer"),
      })),
    ],
    [setMode, setAccent, go, router, articles],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.group}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  function select(item: Item | undefined) {
    if (!item) return;
    setOpen(false);
    // let the dialog close before running (smoother scroll / transitions)
    setTimeout(item.run, 120);
  }

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -10, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -10, filter: "blur(8px)" }}
            transition={SPRING}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-bg/90 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIndex((i) => Math.min(i + 1, filtered.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    select(filtered[index]);
                  }
                }}
                placeholder="Type a command or search…"
                className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
              />
              <kbd className="rounded-md border border-border px-1.5 py-0.5 font-mono text-3xs text-muted">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-10 text-center text-sm text-muted">
                  No results for “{query}”
                </p>
              )}
              {filtered.map((item, i) => {
                const showGroup = item.group !== lastGroup;
                lastGroup = item.group;
                const Icon = item.icon;
                return (
                  <div key={item.id}>
                    {showGroup && (
                      <p className="px-3 pb-1 pt-3 eyebrow text-3xs text-muted">
                        {item.group}
                      </p>
                    )}
                    <button
                      data-index={i}
                      onMouseMove={() => setIndex(i)}
                      onClick={() => select(item)}
                      className={cn(
                        "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm",
                        i === index ? "text-fg" : "text-muted",
                      )}
                    >
                      {i === index && (
                        <motion.span
                          layoutId="palette-active"
                          className="absolute inset-0 rounded-xl bg-fg/6"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                      {item.swatch != null ? (
                        <span
                          className="relative size-4 rounded-full"
                          style={{
                            background: `oklch(0.7 0.19 ${item.swatch})`,
                          }}
                        />
                      ) : (
                        <Icon className="relative" width={16} height={16} />
                      )}
                      <span className="relative flex-1">{item.label}</span>
                      {item.hint && (
                        <span className="relative font-mono text-xs text-muted">
                          {item.hint}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-3xs text-muted">
              <span>↑↓ navigate · ↵ select</span>
              <span>{mod}K to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
