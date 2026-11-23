"use client";

import {
  AnimatePresence,
  motion,
  useDragControls,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CodeFile } from "@/data/site";
import { highlight, sliceLines } from "@/lib/highlight";
import { cn } from "@/lib/utils";
import { Check, Copy, Grip, Replay, Terminal } from "./icons";
import { SPRING } from "@/lib/motion";

type Props = {
  files: CodeFile[];
  output?: string[];
  /** characters typed per millisecond */
  speed?: number;
  draggable?: boolean;
  className?: string;
};

export function CodeWindow({
  files,
  output,
  speed = 0.045,
  draggable = false,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const controls = useDragControls();

  const [active, setActive] = useState(0);
  const [count, setCount] = useState(0);
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);

  const file = files[active];
  const tokens = useMemo(() => highlight(file.code, file.lang), [file]);
  const total = file.code.length;
  const lineCount = file.code.split("\n").length;
  const done = count >= total;

  // Typewriter
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setCount(total);
      return;
    }
    setCount(0);
    let raf = 0;
    let typed = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // tiny jitter makes it feel human
      typed = Math.min(
        total,
        typed + (now - last) * speed * (0.6 + Math.random() * 0.8),
      );
      last = now;
      setCount(Math.floor(typed));
      if (typed < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, active, run, total, speed, reduce]);

  const lines = sliceLines(tokens, count);

  async function copy() {
    try {
      await navigator.clipboard.writeText(file.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <motion.div
      ref={ref}
      drag={draggable}
      dragListener={false}
      dragControls={controls}
      dragSnapToOrigin
      dragElastic={0.6}
      whileDrag={{ scale: 1.02, rotate: -1 }}
      className={cn(
        "code-window relative w-full overflow-hidden rounded-2xl border border-white/10 font-mono text-code shadow-2xl shadow-black/40 ring-1 ring-black/5 backdrop-blur-2xl",
        className,
      )}
    >
      {/* soft accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
      />

      {/* Title bar */}
      <div
        onPointerDown={(e) => draggable && controls.start(e)}
        className={cn(
          "relative flex items-center gap-3 border-b border-white/10 px-4 py-3",
          draggable && "cursor-grab touch-none active:cursor-grabbing",
        )}
      >
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>

        {files.length === 1 ? (
          <span className="ml-2 truncate text-xs text-white/60">
            {file.name}
          </span>
        ) : (
          <div
            role="tablist"
            className="scrollbar-none ml-2 flex min-w-0 gap-1 overflow-x-auto"
          >
            {files.map((f, i) => (
              <button
                key={f.name}
                role="tab"
                aria-selected={i === active}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setActive(i);
                  setRun((r) => r + 1);
                }}
                className={cn(
                  "relative shrink-0 rounded-md px-2.5 py-1 text-xs transition-colors",
                  i === active
                    ? "text-white"
                    : "text-white/45 hover:text-white/80",
                )}
              >
                {i === active && (
                  <motion.span
                    layoutId={`tab-${files[0].name}`}
                    className="absolute inset-0 rounded-md bg-white/10"
                    transition={SPRING}
                  />
                )}
                <span className="relative">{f.name}</span>
              </button>
            ))}
          </div>
        )}

        <div
          className="ml-auto flex items-center gap-1 text-white/50"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setRun((r) => r + 1)}
            className="rounded-md p-1.5 transition hover:bg-white/10 hover:text-white"
            aria-label="Replay typing"
          >
            <Replay width={14} height={14} />
          </button>
          <button
            onClick={copy}
            className="rounded-md p-1.5 transition hover:bg-white/10 hover:text-white"
            aria-label="Copy code"
          >
            {copied ? (
              <Check width={14} height={14} className="text-emerald-400" />
            ) : (
              <Copy width={14} height={14} />
            )}
          </button>
          {draggable && (
            <Grip width={14} height={14} className="ml-1 hidden sm:block" />
          )}
        </div>
      </div>

      {/* Code */}
      <div className="relative overflow-x-auto px-4 py-4">
        <pre className="min-w-max" aria-label={file.name}>
          <code>
            {Array.from({ length: lineCount }, (_, i) => {
              const line = lines[i];
              const isCaretLine = !done && i === lines.length - 1;
              return (
                <div key={i} className="flex">
                  <span className="mr-5 w-6 shrink-0 select-none text-right text-white/20">
                    {i + 1}
                  </span>
                  <span className="whitespace-pre">
                    {line?.map((t, j) => (
                      <span key={j} className={`tok-${t.type}`}>
                        {t.text}
                      </span>
                    ))}
                    {(isCaretLine || (done && i === lineCount - 1)) && (
                      <span className="ml-px inline-block h-[1.1em] w-0.5 translate-y-[3px] animate-blink bg-accent" />
                    )}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Terminal output */}
      {output && (
        <div className="relative border-t border-white/10 bg-black/30 px-4 py-3 text-xs">
          <div className="mb-2 flex items-center gap-2 text-white/40">
            <Terminal width={13} height={13} /> terminal
          </div>
          <div className="min-h-22 space-y-1">
            <AnimatePresence>
              {done &&
                output.map((l, i) => (
                  <motion.p
                    key={`${run}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : 0.25 + i * 0.35 }}
                    className={cn(
                      i === 0 ? "text-white/70" : "text-white/50",
                      l.startsWith("✓") && "text-emerald-400",
                      l.startsWith("→") && "text-accent",
                    )}
                  >
                    {l}
                  </motion.p>
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
