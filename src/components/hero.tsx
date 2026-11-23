"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { heroFiles, heroOutput, site } from "@/data/site";
import { scrollToId } from "@/lib/utils";
import { CodeWindow } from "./code-window";
import { ArrowUpRight, Sparkles, socialIcons } from "./icons";
import { Magnetic, TextScramble } from "./ui/primitives";
import { EASE_OUT } from "@/lib/motion";

const { line1, accent, line2 } = site.headline;

function Word({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className={`inline-block ${className ?? ""}`}
        initial={reduce ? false : { y: "110%", rotate: 4 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 1, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-svh items-center overflow-hidden pb-20 pt-32"
    >
      {/* Background: aurora + grid */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute left-[10%] top-[15%] size-152 animate-blob rounded-full bg-accent/25 blur-glow" />
        <div className="absolute right-[5%] top-[35%] size-120 animate-blob rounded-full bg-accent-2/20 blur-glow [animation-delay:-6s]" />
        <div className="absolute bottom-0 left-1/3 size-104 animate-blob rounded-full bg-accent/15 blur-glow [animation-delay:-12s]" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {site.available ? "Open to new projects" : "Currently booked"}
            <span className="text-muted">·</span>
            <span className="font-mono text-accent">
              <TextScramble words={site.roles} />
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT }}
            className="mb-5 font-mono text-sm text-muted"
          >
            {site.name} <span className="text-accent">/</span> {site.role}
          </motion.p>

          <h1 className="text-balance text-5xl font-semibold leading-display tracking-display sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            <span className="block">
              {line1.map((w, i) => (
                <Word key={w} delay={0.25 + i * 0.08}>
                  {w}&nbsp;
                </Word>
              ))}
            </span>
            <span className="block">
              <Word
                delay={0.45}
                className="text-gradient pr-2 font-serif font-normal italic tracking-normal"
              >
                {accent}
              </Word>{" "}
              {line2.map((w, i) => (
                <Word key={w} delay={0.55 + i * 0.08}>
                  {w}&nbsp;
                </Word>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: EASE_OUT }}
            className="mt-8 max-w-xl text-pretty text-lg text-muted"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE_OUT }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <button
                onClick={() => scrollToId("work")}
                className="btn btn-md btn-primary group relative overflow-hidden"
              >
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-accent to-accent-2 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative">View projects</span>
                <ArrowUpRight className="relative transition-transform group-hover:rotate-45" />
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="btn btn-md btn-secondary"
              >
                <Sparkles className="text-accent" />
                Email me
              </a>
            </Magnetic>
            <div className="flex items-center gap-1">
              {site.socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="icon-btn size-11 text-muted hover:text-fg"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 18, rotateY: -14 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: EASE_OUT }}
          style={{ transformPerspective: 1200 }}
          className="relative"
        >
          <CodeWindow files={heroFiles} output={heroOutput} draggable />
          <p className="mt-4 text-center font-mono text-2xs text-muted">
            psst — drag the window ↑
          </p>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => scrollToId("work")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 eyebrow text-3xs tracking-eyebrow text-muted md:flex"
        aria-label="Scroll to work"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-border">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>
    </section>
  );
}
