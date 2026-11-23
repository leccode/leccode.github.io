"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { site, type Category, type Project } from "@/data/site";
import { cn } from "@/lib/utils";
import { ArrowUpRight, socialIcons } from "./icons";
import { SectionHeading, SpotlightCard } from "./ui/primitives";
import { EASE_OUT, SPRING } from "@/lib/motion";

const FILTERS: Array<"All" | Category> = ["All", "Full-stack", "Frontend"];

export function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const projects = site.projects.filter(
    (p) => filter === "All" || p.category === filter,
  );

  return (
    <section
      id="work"
      className="relative mx-auto max-w-7xl px-6 py-28 md:py-40"
    >
      <SectionHeading
        index="01"
        eyebrow="Selected work"
        title={<>Some things I&apos;ve built.</>}
      >
        Full-stack systems and tools, from bioinformatics dashboards to user
        platforms.
      </SectionHeading>

      <div
        className="mb-10 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter projects"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "relative rounded-full border px-4 py-2 text-sm transition-colors",
              filter === f
                ? "border-transparent text-accent-fg"
                : "border-border text-muted hover:text-fg",
            )}
          >
            {filter === f && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={SPRING}
              />
            )}
            <span className="relative">{f}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE_OUT }}
            >
              <ProjectCard project={p} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function ProjectCard({
  project: p,
  index,
}: {
  project: Project;
  index: number;
}) {
  const primary = p.links[0]?.href;
  return (
    <SpotlightCard tilt className="h-full p-3">
      <article className="flex h-full flex-col">
        <ProjectArt hue={p.hue} variant={index % 3} />
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center justify-between font-mono text-xs text-muted">
            <span>{p.category}</span>
            {p.status && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5",
                  p.status === "Featured"
                    ? "bg-accent/10 text-accent"
                    : "bg-amber-500/10 text-amber-500",
                )}
              >
                {p.status}
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold tracking-tight">
            {primary ? (
              <a
                href={primary}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                {p.title}
                <ArrowUpRight className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            ) : (
              p.title
            )}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
            {p.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          {p.links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
              {p.links.map((l) => {
                const Icon = socialIcons[l.icon ?? "github"];
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip text-xs"
                  >
                    <Icon width={14} height={14} />
                    {l.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </article>
    </SpotlightCard>
  );
}

/** Generated cover art — no images needed. Swap for <Image> when you have screenshots. */
function ProjectArt({ hue, variant }: { hue: number; variant: number }) {
  return (
    <div
      className="relative aspect-2/1 overflow-hidden rounded-2xl"
      style={{
        background: `radial-gradient(120% 90% at 0% 0%, oklch(0.72 0.19 ${hue} / 0.95), transparent 55%),
          radial-gradient(90% 90% at 100% 100%, oklch(0.62 0.2 ${hue + 60} / 0.9), transparent 60%),
          oklch(0.22 0.04 ${hue})`,
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-x-6 bottom-0 top-7 rounded-t-xl border border-white/15 bg-black/35 p-3 shadow-2xl backdrop-blur-md transition-transform duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:scale-103">
        <div className="mb-3 flex gap-1">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-1.5 rounded-full bg-white/30" />
          ))}
        </div>
        {variant === 0 && (
          <div className="flex h-[70%] items-end gap-1.5">
            {[40, 65, 45, 80, 60, 95, 70, 85].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t bg-white/70 transition-all duration-700 group-hover:bg-white"
                style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        )}
        {variant === 1 && (
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 6 }, (_, i) => (
              <span
                key={i}
                className="aspect-4/3 rounded-md bg-white/15 ring-1 ring-white/10"
              />
            ))}
          </div>
        )}
        {variant === 2 && (
          <div className="space-y-2">
            <span className="block h-2.5 w-2/3 rounded bg-white/70" />
            <span className="block h-2 w-5/6 rounded bg-white/25" />
            <span className="block h-2 w-1/2 rounded bg-white/25" />
            <span className="mt-4 block h-6 w-24 rounded-full bg-white/80" />
          </div>
        )}
      </div>
    </div>
  );
}
