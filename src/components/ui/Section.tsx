import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  id: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
};

/** Standard home-page section: anchor id, accessible heading, consistent rhythm. */
export function Section({
  id,
  title,
  lede,
  children,
  className,
}: SectionProps) {
  const headingId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-16 sm:py-24", className)}
    >
      <Container>
        <header className="mb-10 max-w-2xl sm:mb-14">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h2>
          {lede && (
            <p className="mt-3 text-lg text-pretty text-muted">{lede}</p>
          )}
        </header>
        {children}
      </Container>
    </section>
  );
}
