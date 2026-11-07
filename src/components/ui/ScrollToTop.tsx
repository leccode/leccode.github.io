"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ArrowUpIcon } from "./Icons";

const SHOW_AFTER_PX = 600;

/** Floating button that appears after scrolling and returns to the top. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setVisible(window.scrollY > SHOW_AFTER_PX),
      );
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "panel fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 grid size-11 place-items-center rounded-full text-fg shadow-lg",
        "transition-[opacity,transform,border-color] duration-200 hover:border-accent hover:text-accent",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUpIcon />
    </button>
  );
}
