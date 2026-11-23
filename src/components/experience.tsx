"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { site, type Education } from "@/data/site";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./icons";
import { Reveal, SectionHeading } from "./ui/primitives";

const STATUS: Record<Education["status"], string> = {
  "In progress": "bg-emerald-500/10 text-emerald-500",
  Paused: "bg-fg/6 text-muted",
  Completed: "bg-accent/10 text-accent",
};

/** Education timeline (section id "profile"). */
export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section
      id="profile"
      className="relative mx-auto max-w-5xl px-6 py-28 md:py-40"
    >
      <SectionHeading
        index="03"
        eyebrow="Education"
        title="Research and engineering, side by side."
      >
        {site.experience.current}
      </SectionHeading>

      <ol ref={ref} className="relative ml-3 md:ml-0">
        {/* track + scroll-linked fill */}
        <span
          aria-hidden
          className="absolute left-0 top-2 h-full w-px bg-border md:left-44"
        />
        <motion.span
          aria-hidden
          style={{ scaleY }}
          className="absolute left-0 top-2 h-full w-px origin-top bg-linear-to-b from-accent to-accent-2 md:left-44"
        />

        {site.education.map((item, i) => (
          <li
            key={item.degree}
            className="relative pb-16 pl-10 last:pb-0 md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:pl-0"
          >
            <motion.span
              aria-hidden
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="absolute left-0 top-2 size-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_0_6px_color-mix(in_oklch,var(--accent)_20%,transparent)] md:left-44"
            />
            <Reveal
              delay={0.05}
              className="mb-3 md:mb-0 md:pr-10 md:text-right"
            >
              <span
                className={cn(
                  "inline-block rounded-full px-3 py-1 font-mono text-xs",
                  STATUS[item.status],
                )}
              >
                {item.status}
              </span>
            </Reveal>
            <Reveal delay={0.1 + i * 0.02} className="md:pl-10">
              <h3 className="text-2xl font-semibold tracking-tight">
                {item.degree}
              </h3>
              <p className="mt-1 text-muted">{item.institution}</p>
              <p className="mt-3 max-w-xl leading-relaxed text-fg/80">
                {item.summary}
              </p>
              {item.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {item.link && (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent"
                >
                  {item.link.label}
                  <ArrowUpRight
                    width={14}
                    height={14}
                    className="transition-transform group-hover:rotate-45"
                  />
                </a>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
