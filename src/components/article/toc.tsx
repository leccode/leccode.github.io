"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Heading } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";

export function TableOfContents({
  headings,
  minutes,
}: {
  headings: Heading[];
  minutes: number;
}) {
  const [active, setActive] = useState(headings[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));

    const body = document.getElementById("article-body");
    const onScroll = () => {
      if (!body) return;
      const r = body.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setProgress(
        Math.min(1, Math.max(0, (window.innerHeight * 0.4 - r.top) / total)),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [headings]);

  const left = Math.max(0, Math.ceil(minutes * (1 - progress)));

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <div className="mb-5 flex items-center gap-3">
        <svg viewBox="0 0 36 36" className="size-9 -rotate-90" aria-hidden>
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="var(--border)"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
            opacity={progress > 0 ? 1 : 0}
            className="transition-[stroke-dashoffset] duration-150"
          />
        </svg>
        <div className="leading-tight">
          <p className="font-medium tabular-nums">
            {Math.round(progress * 100)}% read
          </p>
          <p className="text-xs text-muted">
            {progress >= 1 ? "Finished — nice!" : `${left} min left`}
          </p>
        </div>
      </div>

      {headings.length > 0 && (
        <>
          <p className="mb-3 eyebrow text-2xs text-muted">On this page</p>
          <ul className="relative space-y-1 border-l border-border">
            {headings.map((h) => (
              <li key={h.id} className="relative">
                {active === h.id && (
                  <motion.span
                    layoutId="toc-active"
                    className="absolute -left-px top-0 h-full w-0.5 rounded-full bg-accent"
                    transition={SPRING}
                  />
                )}
                <a
                  href={`#${h.id}`}
                  className={cn(
                    "block py-1 pr-2 leading-snug transition-colors",
                    h.level === 3 ? "pl-7" : "pl-4",
                    active === h.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  );
}
