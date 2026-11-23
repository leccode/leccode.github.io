import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="grid min-h-dvh place-items-center px-6 text-center"
    >
      <div>
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          Lost in the{" "}
          <span className="font-serif font-normal italic text-gradient">
            void
          </span>
          .
        </h1>
        <p className="mt-4 text-muted">
          This page wandered off. Let&apos;s get you back.
        </p>
        <Link href="/" className="btn btn-md btn-primary mt-8">
          Take me home
        </Link>
      </div>
    </main>
  );
}
