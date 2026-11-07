import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
};

/** Title block for standalone pages (About, Privacy, Blog). */
export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="mb-10 sm:mb-14">
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      {children && <div className="mt-4 text-lg text-muted">{children}</div>}
    </header>
  );
}
