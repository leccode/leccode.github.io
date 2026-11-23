"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

export const ACCENTS = {
  violet: 285,
  indigo: 262,
  blue: 238,
  cyan: 200,
  emerald: 158,
  lime: 128,
  amber: 70,
  rose: 12,
} as const;

export type Accent = keyof typeof ACCENTS;
export type Mode = "dark" | "light" | "system";
type Origin = { x: number; y: number };

export const DEFAULT_MODE: Mode = "dark";
export const DEFAULT_ACCENT: Accent = "violet";

type ThemeCtx = {
  mode: Mode;
  resolved: "dark" | "light";
  accent: Accent;
  mounted: boolean;
  setMode: (mode: Mode, origin?: Origin) => void;
  cycleMode: (origin?: Origin) => void;
  setAccent: (accent: Accent) => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

const prefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyMode(mode: Mode): "dark" | "light" {
  const dark = mode === "dark" || (mode === "system" && prefersDark());
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  return dark ? "dark" : "light";
}

/** Runs `update` inside a View Transition with a circular reveal from `origin`. */
function withReveal(update: () => void, origin?: Origin) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("startViewTransition" in document) || reduce) {
    update();
    return;
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => flushSync(update));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${r}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.7, 0, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(DEFAULT_MODE);
  const [resolved, setResolved] = useState<"dark" | "light">("dark");
  const [accent, setAccentState] = useState<Accent>(DEFAULT_ACCENT);
  const [mounted, setMounted] = useState(false);

  // Sync with what the inline <ThemeScript> already applied before paint.
  useEffect(() => {
    const storedMode =
      (localStorage.getItem("theme") as Mode | null) ?? DEFAULT_MODE;
    const storedAccent = localStorage.getItem("accent") as Accent | null;
    setModeState(storedMode);
    setResolved(applyMode(storedMode));
    if (storedAccent && storedAccent in ACCENTS) setAccentState(storedAccent);
    setMounted(true);
  }, []);

  // Follow the OS when in "system" mode.
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => withReveal(() => setResolved(applyMode("system")));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = useCallback((next: Mode, origin?: Origin) => {
    localStorage.setItem("theme", next);
    withReveal(() => {
      setModeState(next);
      setResolved(applyMode(next));
    }, origin);
  }, []);

  const cycleMode = useCallback(
    (origin?: Origin) => {
      const order: Mode[] = ["dark", "light", "system"];
      setMode(order[(order.indexOf(mode) + 1) % order.length], origin);
    },
    [mode, setMode],
  );

  const setAccent = useCallback((next: Accent) => {
    localStorage.setItem("accent", next);
    document.documentElement.style.setProperty("--hue", String(ACCENTS[next]));
    setAccentState(next);
  }, []);

  const value = useMemo(
    () => ({ mode, resolved, accent, mounted, setMode, cycleMode, setAccent }),
    [mode, resolved, accent, mounted, setMode, cycleMode, setAccent],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/** Inline script: applies theme + accent before first paint (no flash). */
export function ThemeScript() {
  const code = `(function(){try{var H=${JSON.stringify(ACCENTS)};var m=localStorage.getItem('theme')||'${DEFAULT_MODE}';var a=localStorage.getItem('accent');var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';if(a&&H[a]!=null)r.style.setProperty('--hue',H[a]);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
