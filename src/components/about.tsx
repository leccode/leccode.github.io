"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { allTech, site, type Tech } from "@/data/site";
import type { TechIcons } from "@/lib/tech-icons";
import { MapPin } from "./icons";
import {
  CountUp,
  Marquee,
  Reveal,
  SectionHeading,
  SpotlightCard,
} from "./ui/primitives";

export function About({ icons = {} }: { icons?: TechIcons }) {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-7xl px-6 py-28 md:py-40"
    >
      <SectionHeading
        index="02"
        eyebrow="About"
        title={
          <>
            Engineer by trade,{" "}
            <span className="font-serif font-normal italic text-gradient">
              scientist
            </span>{" "}
            at heart.
          </>
        }
      />

      <div className="grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 md:grid-cols-6">
        {/* Intro */}
        <Reveal className="md:col-span-4 md:row-span-2">
          <SpotlightCard className="h-full p-8">
            <div className="flex h-full flex-col">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative grid size-16 place-items-center rounded-2xl bg-linear-to-br from-accent to-accent-2 text-xl font-bold text-accent-fg">
                  {site.initials}
                  <span className="absolute -bottom-1 -right-1 size-4 rounded-full border-4 border-bg bg-emerald-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{site.name}</p>
                  <p className="text-sm text-muted">{site.role}</p>
                </div>
              </div>
              <p className="text-pretty text-lg leading-relaxed text-fg/85">
                {site.bio}
              </p>
              <div className="mt-auto pt-8">
                <p className="mb-3 eyebrow text-2xs text-muted">Right now</p>
                <ul className="space-y-2">
                  {site.now.map((n, i) => (
                    <motion.li
                      key={n}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.12 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="size-1.5 rounded-full bg-accent" />
                      {n}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Local time */}
        <Reveal delay={0.1} className="md:col-span-2">
          <SpotlightCard className="h-full p-6">
            <LocalTime />
          </SpotlightCard>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.15} className="md:col-span-2">
          <SpotlightCard className="h-full p-6">
            <div className="grid h-full grid-cols-3 items-end gap-2">
              {site.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-semibold tracking-tight md:text-4xl">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs leading-tight text-muted">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Stack */}
        <Reveal delay={0.1} className="md:col-span-3">
          <SpotlightCard className="h-full py-6">
            <p className="mb-5 px-6 eyebrow text-2xs text-muted">
              Daily drivers
            </p>
            <div className="space-y-3">
              <Marquee duration={40}>
                {allTech.slice(0, Math.ceil(allTech.length / 2)).map((t) => (
                  <Chip key={t.name} tech={t} icons={icons} />
                ))}
              </Marquee>
              <Marquee duration={40} reverse>
                {allTech.slice(Math.ceil(allTech.length / 2)).map((t) => (
                  <Chip key={t.name} tech={t} icons={icons} />
                ))}
              </Marquee>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Experience */}
        <Reveal delay={0.15} className="md:col-span-3">
          <SpotlightCard className="h-full p-6">
            <p className="eyebrow text-2xs text-muted">Experience</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">
              In production
            </p>
            <p className="mt-2 text-pretty text-sm text-muted">
              {site.experience.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {site.experience.domains.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
                >
                  {d}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Tech stack */}
        <Reveal delay={0.1} className="md:col-span-6">
          <SpotlightCard className="p-6 md:p-8">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-2xs text-muted">Tech stack</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  The tools I build with
                </h3>
              </div>
              <p className="font-mono text-xs text-muted">
                {allTech.length + site.alsoStack.length} technologies
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,7fr)_minmax(0,4fr)] lg:gap-6">
              {site.stack.map((group, gi) => (
                <div key={group.title}>
                  <p className="mb-4 flex items-center gap-2 text-sm font-medium">
                    <span className="font-mono text-xs text-accent">
                      0{gi + 1}
                    </span>
                    {group.title}
                  </p>
                  <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.75rem,1fr))] gap-2">
                    {group.items.map((t, i) => (
                      <motion.li
                        key={t.name}
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          delay: gi * 0.12 + i * 0.04,
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <TechTile tech={t} icons={icons} />
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <span className="mr-1 text-sm text-muted">Also:</span>
              {site.alsoStack.map((t) => (
                <span key={t} className="chip bg-bg/40">
                  {t}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}

/** Icon from the build-time download, themed; falls back to initials if it's missing. */
function TechIcon({
  tech,
  icons,
  size,
}: {
  tech: Tech;
  icons: TechIcons;
  size: number;
}) {
  const icon = icons[tech.icon];
  if (!icon?.dark && !icon?.light) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className="grid shrink-0 place-items-center rounded-[22%] bg-fg/10 font-mono text-3xs font-bold text-fg"
      >
        {tech.name
          .replace(/[^A-Za-z#]/g, "")
          .slice(0, 2)
          .toUpperCase()}
      </span>
    );
  }
  const common = {
    width: size,
    height: size,
    alt: "",
    "aria-hidden": true,
    draggable: false,
  } as const;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...common}
        src={icon.dark ?? icon.light!}
        className="hidden shrink-0 dark:block"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...common}
        src={icon.light ?? icon.dark!}
        className="shrink-0 dark:hidden"
      />
    </>
  );
}

function TechTile({ tech, icons }: { tech: Tech; icons: TechIcons }) {
  return (
    <div className="group/tile flex flex-col items-center gap-2 rounded-2xl border border-transparent p-2 text-center transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-fg/3">
      <span className="transition-transform duration-300 group-hover/tile:scale-110 group-hover/tile:drop-shadow-[0_8px_16px_color-mix(in_oklch,var(--accent)_35%,transparent)]">
        <TechIcon tech={tech} icons={icons} size={48} />
      </span>
      <span className="text-2xs leading-tight text-muted transition-colors group-hover/tile:text-fg">
        {tech.name}
      </span>
    </div>
  );
}

function Chip({ tech, icons }: { tech: Tech; icons: TechIcons }) {
  return (
    <span className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-bg/50 py-1.5 pl-1.5 pr-4 text-sm transition-colors hover:border-accent/50 hover:text-accent">
      <TechIcon tech={tech} icons={icons} size={24} />
      {tech.name}
    </span>
  );
}

function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: site.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now)
    : "--:--:--";

  const hour = now
    ? Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: site.timezone,
          hour: "numeric",
        }).format(now),
      )
    : 12;
  const awake = hour >= 8 && hour < 23;

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-2 text-sm text-muted">
        <MapPin width={15} height={15} className="text-accent" />
        {site.location}
      </div>
      <div>
        <p className="font-mono text-4xl font-medium tabular-nums tracking-tight">
          {time}
        </p>
        <p className="mt-1 text-xs text-muted">
          {awake
            ? "☕ Probably at my desk or for a walk"
            : "🌙 Probably asleep or coding!"}{" "}
          · I reply to every email
        </p>
      </div>
    </div>
  );
}
