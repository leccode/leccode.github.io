"use client";

import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "@/components/ui/Icons";

/**
 * The icon is chosen by CSS (`dark:` variant), not React state,
 * so server HTML and client always match and nothing flickers.
 */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-fg"
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="block dark:hidden" />
    </button>
  );
}
