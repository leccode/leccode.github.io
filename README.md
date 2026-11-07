# ecco.dev

Personal site of Constantine Lekkos. Next.js (App Router) + TypeScript + Tailwind CSS v4,
exported as a static site and hosted on GitHub Pages.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm run preview    # serve ./out locally
```

## Deploy

1. Commit `package-lock.json` (created by `npm install`); CI uses `npm ci`.
2. In the repository: **Settings → Pages → Source → GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds and publishes `out/`.

## Structure

```
src/
  app/                  Routes, metadata, sitemap, robots, icons
    blog/[slug]/        Article pages (generated at build time)
  components/
    layout/             Header, Footer, ThemeToggle, NeuralBackground
    sections/           One component per home-page section
    hero/               Code window (CSS module + Rust sample)
    article/            Article layout, prose styles, list
    ui/                 Small reusable building blocks
  content/articles/     Article bodies (TSX) and their images
  data/                 Editable content: profile, skills, projects, articles
  lib/                  Site config, theme script, canvas engine, helpers
public/                 Redirects from the old .html URLs
```

## Styling

- Design tokens (colours for both themes) live in `src/app/globals.css` and are exposed
  to Tailwind as `bg-bg`, `text-fg`, `text-muted`, `border-line`, `text-accent`, `text-signal`.
- Layout and spacing use Tailwind utilities in components.
- Complex, self-contained styling uses CSS Modules next to the component
  (`CodeWindow.module.css`, `Prose.module.css`).

## Editing content

- **Project, skill, education:** edit the matching file in `src/data/`.
- **New article:** add an entry with `publishedAt` to `src/data/articles.ts`, create
  `src/content/articles/<slug>.tsx` exporting `Body` (and optional `sources`), and register
  it in `src/content/articles/index.ts`. Entries without `publishedAt` show as "Coming soon".
