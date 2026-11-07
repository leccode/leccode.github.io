import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SmartLink } from "./SmartLink";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const variants = {
  primary: "bg-accent text-accent-fg hover:brightness-110",
  secondary: "panel text-fg hover:border-accent",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <SmartLink
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium",
        "transition-[filter,border-color,transform] duration-150 active:scale-[0.98]",
        variants[variant],
        className,
      )}
    >
      {children}
    </SmartLink>
  );
}
