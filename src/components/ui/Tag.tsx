import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TagProps = {
  children: ReactNode;
  tone?: "default" | "accent" | "signal";
};

const tones = {
  default: "border-line text-muted",
  accent: "border-accent/40 text-accent",
  signal: "border-signal/40 text-signal",
} as const;

export function Tag({ children, tone = "default" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[0.8125rem] leading-6",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
