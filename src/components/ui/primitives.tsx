"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

/* ---------- Reveal: blur + rise on scroll into view ---------- */

export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
} & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ---------- SpotlightCard: pointer-following glow, optional 3D tilt ---------- */

export function SpotlightCard({
  children,
  className,
  tilt = false,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt && e.pointerType === "mouse") {
      rx.set((y / r.height - 0.5) * -7);
      ry.set((x / r.width - 0.5) * 7);
    }
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={
        tilt
          ? { rotateX: rx, rotateY: ry, transformPerspective: 1000 }
          : undefined
      }
      className={cn(
        "spotlight group relative overflow-hidden rounded-3xl border border-border bg-card inset-shadow-2xs inset-shadow-white/5 backdrop-blur-xl",
        className,
      )}
    >
      <div className="relative z-1 h-full">{children}</div>
    </motion.div>
  );
}

/* ---------- Magnetic: element leans towards the cursor ---------- */

export function Magnetic({
  children,
  strength = 0.3,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const x = useSpring(0, { stiffness: 250, damping: 15, mass: 0.4 });
  const y = useSpring(0, { stiffness: 250, damping: 15, mass: 0.4 });
  return (
    <motion.div
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- TextScramble: decodes between words ---------- */

const GLYPHS = "!<>-_\\/[]{}—=+*^?#%&";

export function TextScramble({
  words,
  interval = 2800,
}: {
  words: readonly string[];
  interval?: number;
}) {
  const [text, setText] = useState(words[0]);
  const reduce = useReducedMotion();

  useEffect(() => {
    let i = 0;
    let raf = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % words.length;
      const target = words[i];
      if (reduce) {
        setText(target);
        return;
      }
      let frame = 0;
      const run = () => {
        frame++;
        let out = "";
        let done = true;
        for (let k = 0; k < target.length; k++) {
          if (frame >= k * 1.6 + 6) out += target[k];
          else {
            done = false;
            out +=
              target[k] === " "
                ? " "
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setText(out);
        if (!done) raf = requestAnimationFrame(run);
      };
      run();
    }, interval);
    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [words, interval, reduce]);

  return <span aria-live="polite">{text}</span>;
}

/* ---------- CountUp ---------- */

export function CountUp({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

/* ---------- Marquee ---------- */

export function Marquee({
  children,
  reverse = false,
  duration = 40,
  className,
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={cn("group mask-fade-x flex overflow-hidden", className)}>
      <div
        className="flex w-max shrink-0 animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused]"
        style={
          {
            "--duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {children}
        <div aria-hidden className="flex gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- Scroll progress bar ---------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r from-accent via-accent-2 to-accent"
    />
  );
}

/* ---------- Cursor glow (fine pointers only) ---------- */

export function CursorGlow() {
  const x = useSpring(-500, { stiffness: 120, damping: 25 });
  const y = useSpring(-500, { stiffness: 120, damping: 25 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 300);
      y.set(e.clientY - 300);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-0 size-150 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--accent)_10%,transparent),transparent_65%)]"
    />
  );
}

/* ---------- Section heading ---------- */

export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mb-12 flex flex-col gap-4 md:mb-16">
      <p className="eyebrow text-xs tracking-eyebrow text-muted">
        <span className="text-accent">{index}</span> — {eyebrow}
      </p>
      <h2 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
        {title}
      </h2>
      {children && (
        <p className="max-w-2xl text-pretty text-lg text-muted">{children}</p>
      )}
    </Reveal>
  );
}
