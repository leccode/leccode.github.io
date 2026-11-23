"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/data/site";
import { ArrowUp, Check, Copy, Mail, socialIcons } from "./icons";
import { Magnetic, Reveal } from "./ui/primitives";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-28 md:py-44"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-glow" />
        <div className="bg-grid absolute inset-0" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="eyebrow text-xs tracking-eyebrow text-muted">
            <span className="text-accent">05</span> — Contact
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-balance text-5xl font-semibold leading-display tracking-display md:text-8xl">
            Let&apos;s build <br />
            <span className="font-serif font-normal italic text-gradient">
              something.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-lg text-lg text-muted">
            A project, a role or a research idea. I reply to every email.
          </p>
        </Reveal>

        <Reveal
          delay={0.3}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a
              href={`mailto:${site.email}?subject=Hello%20${encodeURIComponent(site.name.split(" ")[0])}`}
              className="btn btn-lg btn-primary group max-w-full break-all whitespace-normal"
            >
              <Mail />
              {site.email}
            </a>
          </Magnetic>
          <Magnetic>
            <button
              onClick={copy}
              className="btn btn-lg btn-secondary"
              aria-label="Copy email address"
            >
              {copied ? <Check className="text-emerald-500" /> : <Copy />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </Magnetic>
        </Reveal>

        <Reveal delay={0.4} className="mt-10 flex justify-center gap-3">
          {site.socials.map((s) => {
            const Icon = socialIcons[s.icon];
            return (
              <Magnetic key={s.label} strength={0.5}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="social-btn"
                >
                  <Icon />
                </a>
              </Magnetic>
            );
          })}
        </Reveal>
      </div>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-bg/90 px-4 py-2.5 text-sm shadow-xl backdrop-blur-xl"
            role="status"
          >
            <Check className="text-emerald-500" width={16} height={16} /> Email
            copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const FOOTER_LINKS = [
  { label: "Projects", href: "/#work" },
  { label: "Articles", href: "/articles/" },
  { label: "About me", href: "/about/" },
  { label: "Privacy", href: "/privacy/" },
];

export function Footer() {
  // Static export: the year is set at build time. Every deploy refreshes it.
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-1 border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-sm text-muted md:flex-row">
        <p>
          © {year} {site.name}
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
          <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
          {site.socials.map((s) => {
            const Icon = socialIcons[s.icon];
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="transition-colors hover:text-fg"
              >
                <Icon width={16} height={16} />
              </a>
            );
          })}
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "auto"
                  : "smooth",
              })
            }
            className="group inline-flex items-center gap-1.5 transition hover:text-fg"
          >
            Top{" "}
            <ArrowUp
              width={15}
              height={15}
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </button>
        </nav>
      </div>
    </footer>
  );
}
