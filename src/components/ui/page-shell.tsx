import type { ReactNode } from "react";
import { Reveal } from "./primitives";

/** Shared layout for simple content pages (About, Privacy). */
export function PageShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="relative z-1 isolate overflow-hidden"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-128">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute left-1/3 top-10 size-120 animate-blob rounded-full bg-accent/20 blur-glow" />
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-28 pt-40">
        <Reveal>
          <p className="eyebrow text-xs tracking-eyebrow text-muted">
            <span className="text-accent">✦</span> {eyebrow}
          </p>
          <h1 className="mt-5 text-balance text-5xl font-semibold leading-display tracking-display md:text-7xl">
            {title}
          </h1>
          {lede && <p className="mt-6 text-muted">{lede}</p>}
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          {children}
        </Reveal>
      </div>
    </main>
  );
}
