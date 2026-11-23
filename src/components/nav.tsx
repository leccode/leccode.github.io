"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { cn, scrollToId } from "@/lib/utils";
import { Mail, Monitor, Moon, Search, Sun, socialIcons } from "./icons";
import { ACCENTS, useTheme, type Accent } from "./theme-provider";
import { EASE_OUT, SPRING } from "@/lib/motion";

/** `header: false` keeps a section out of the top menu (it stays in the ⌘K palette). */
export type Section = {
  id: string;
  label: string;
  href?: string;
  header?: boolean;
};

/** In page order, so the active highlight moves left → right as you scroll. */
export const SECTIONS: readonly Section[] = [
  { id: "work", label: "Projects" },
  { id: "about", label: "About" },
  { id: "profile", label: "Education" },
  { id: "articles", label: "Articles", href: "/articles/" },
  { id: "contact", label: "Contact" },
];

export function openPalette() {
  window.dispatchEvent(new Event("open-palette"));
}

/** Navigate to a section: smooth-scroll on the home page, route elsewhere. */
export function useGo() {
  const pathname = usePathname();
  const router = useRouter();
  return useCallback(
    (target: Section | "top") => {
      if (target !== "top" && target.href) return router.push(target.href);
      const id = target === "top" ? "top" : target.id;
      if (pathname === "/") scrollToId(id);
      else router.push(id === "top" ? "/" : `/#${id}`);
    },
    [pathname, router],
  );
}

/** "⌘" on Apple devices, "Ctrl" elsewhere (rendered as ⌘ on the server, corrected after mount). */
export function useModKey() {
  const [key, setKey] = useState("⌘");
  useEffect(() => {
    const platform =
      (navigator as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData?.platform ?? navigator.userAgent;
    if (!/mac|iphone|ipad|ipod/i.test(platform)) setKey("Ctrl ");
  }, []);
  return key;
}

const HEADER_LINKS = SECTIONS.filter((s) => s.header !== false);
const hrefOf = (s: Section) => s.href ?? `/#${s.id}`;

/** Real links (crawlable, open-in-new-tab works); smooth-scroll when already on the home page. */
function useSectionClick() {
  const pathname = usePathname();
  return (s: Section | "top") => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let the browser handle new tabs
    if (pathname !== "/" || (s !== "top" && s.href)) return; // normal navigation
    e.preventDefault();
    scrollToId(s === "top" ? "top" : s.id);
  };
}

export function Nav() {
  const pathname = usePathname();
  const onSection = useSectionClick();
  const mod = useModKey();
  const [spy, setSpy] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = pathname.startsWith("/articles") ? "articles" : spy;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (pathname !== "/") {
      setSpy("");
      return () => window.removeEventListener("scroll", onScroll);
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setSpy(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    [...SECTIONS.map((s) => s.id), "top"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [pathname]);

  // Close the mobile menu on navigation
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav
          aria-label="Main"
          className={cn(
            "flex w-full max-w-4xl items-center gap-2 rounded-full border px-2 py-2 transition-all duration-500",
            scrolled || menuOpen
              ? "border-border bg-bg/70 shadow-lg shadow-black/5 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <Link
            href="/"
            onClick={onSection("top")}
            className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-3"
            aria-label={`${site.brand.name}${site.brand.tld} home`}
          >
            <span className="grid size-8 place-items-center rounded-full bg-linear-to-br from-accent to-accent-2 text-xs font-bold text-accent-fg transition-transform duration-500 group-hover:rotate-360">
              {site.initials}
            </span>
            <span className="text-sm font-medium">
              {site.brand.name}
              <span className="text-accent">{site.brand.tld}</span>
            </span>
          </Link>

          <ul className="mx-auto hidden items-center md:flex">
            {HEADER_LINKS.map((s) => (
              <li key={s.id}>
                <Link
                  href={hrefOf(s)}
                  onClick={onSection(s)}
                  aria-current={
                    active === s.id ? (s.href ? "page" : "location") : undefined
                  }
                  className={cn(
                    "relative block rounded-full px-3.5 py-2 text-sm transition-colors",
                    active === s.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {active === s.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-fg/7"
                      transition={SPRING}
                    />
                  )}
                  <span className="relative">{s.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button
              onClick={openPalette}
              className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition hover:border-accent/40 hover:text-fg"
              aria-label="Search and quick actions"
              aria-keyshortcuts="Meta+K Control+K"
            >
              <Search width={14} height={14} />
              <kbd className="hidden font-mono sm:inline">{mod}K</kbd>
            </button>
            <AccentPicker />
            <ModeToggle />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="icon-btn size-9 md:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-0.5 w-4 rounded-full bg-fg transition-transform duration-300",
                    menuOpen && "translate-y-[5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 w-4 rounded-full bg-fg transition-transform duration-300",
                    menuOpen && "-translate-y-[5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        active={active}
        onSection={onSection}
      />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  active,
  onSection,
}: {
  open: boolean;
  onClose: () => void;
  active: string;
  onSection: ReturnType<typeof useSectionClick>;
}) {
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onResize = () => window.innerWidth >= 768 && onClose();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 flex flex-col bg-bg/95 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {HEADER_LINKS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.05,
                    ease: EASE_OUT,
                    duration: 0.5,
                  }}
                >
                  <Link
                    href={hrefOf(s)}
                    onClick={(e) => {
                      onSection(s)(e);
                      onClose();
                    }}
                    aria-current={
                      active === s.id
                        ? s.href
                          ? "page"
                          : "location"
                        : undefined
                    }
                    className={cn(
                      "flex items-baseline gap-4 border-b border-border py-4 text-4xl font-semibold tracking-tight transition-colors",
                      active === s.id ? "text-fg" : "text-fg/60 hover:text-fg",
                    )}
                  >
                    <span className="font-mono text-xs text-accent">
                      0{i + 1}
                    </span>
                    {s.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-auto space-y-5"
          >
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 text-sm text-muted hover:text-fg"
            >
              <Mail width={16} height={16} className="text-accent" />
              {site.email}
            </a>
            <div className="flex gap-2">
              {site.socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="social-btn"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AccentPicker() {
  const { accent, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) =>
      !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change accent color"
        aria-expanded={open}
        className="icon-btn size-9"
      >
        <span className="size-4 rounded-full bg-linear-to-br from-accent to-accent-2 ring-2 ring-accent/30 ring-offset-2 ring-offset-bg" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, scale: 0.95, filter: "blur(6px)" }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-56 origin-top-right rounded-2xl border border-border bg-bg/90 p-3 shadow-2xl backdrop-blur-xl"
          >
            <p className="mb-2 px-1 eyebrow text-3xs text-muted">Accent</p>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(ACCENTS) as Accent[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAccent(a)}
                  aria-label={a}
                  title={a}
                  className="group relative grid aspect-square place-items-center rounded-xl transition hover:bg-fg/5"
                >
                  <span
                    className="size-6 rounded-full transition-transform group-hover:scale-110"
                    style={{ background: `oklch(0.7 0.19 ${ACCENTS[a]})` }}
                  />
                  {accent === a && (
                    <motion.span
                      layoutId="accent-ring"
                      className="absolute inset-1 rounded-full border-2"
                      style={{ borderColor: `oklch(0.7 0.19 ${ACCENTS[a]})` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModeToggle() {
  const { mode, cycleMode, mounted } = useTheme();
  const Icon = mode === "dark" ? Moon : mode === "light" ? Sun : Monitor;

  return (
    <button
      onClick={(e) => cycleMode({ x: e.clientX, y: e.clientY })}
      aria-label={`Theme: ${mode}. Click to change`}
      title={`Theme: ${mode}`}
      className="icon-btn relative size-9 overflow-hidden"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {mounted && (
          <motion.span
            key={mode}
            initial={{ y: 20, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -20, rotate: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Icon />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
