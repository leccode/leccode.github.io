# ecco.dev

Personal site of Constantine Lekkos, built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Motion and TypeScript.
It's exported as a static site and hosted on GitHub Pages at https://leccode.github.io.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm run preview    # serve ./out locally
```

## Deploy (GitHub Pages)

1. Run `npm install` once and **commit the new `package-lock.json`**. CI uses `npm ci`, which needs a lockfile that matches `package.json`.
2. In the repository, go to **Settings → Pages → Source → GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds the site and publishes `out/`.

`next.config.ts` uses `output: "export"` and `trailingSlash: true`, so every page is a plain `index.html`.

## Editing content

| What                                                            | Where                                                      |
| --------------------------------------------------------------- | ---------------------------------------------------------- |
| Name, bio, headline, socials, projects, education, code windows | `src/data/site.ts`                                         |
| Tech stack (icons + "Also" list)                                | `stack` and `alsoStack` in `src/data/site.ts`              |
| Articles                                                        | `content/articles/*.md`                                    |
| About / Privacy pages                                           | `src/app/about/page.tsx`, `src/app/privacy/page.tsx`       |
| Colors, accent palette, default theme                           | `src/app/globals.css`, `src/components/theme-provider.tsx` |
| Icons                                                           | `src/app/icon.png`, `apple-icon.png`, `favicon.ico`        |

### Tech stack icons

Each `icon` in `stack` is a [skillicons.dev](https://skillicons.dev) id (e.g. `react`, `dotnet`, `postgres`).
They're downloaded **at build time** and baked into the HTML, so visitors never load anything from a third party.
If an icon can't be downloaded, a lettered tile is shown instead.

### Writing an article

Add `content/articles/<slug>.md`. The filename becomes the URL: `/articles/<slug>/`.

````md
---
title: My new article
description: One-line summary shown in lists and meta tags.
date: 2026-11-22 # required; articles without a date aren't published
tags: [Deep learning, Science]
hue: 200 # optional cover color (0–360)
featured: true # optional
---

Text with **bold**, _italic_, `code`, subscripts like L~PDE~ and a citation.[^1]

## A section (appears in the table of contents)

$$ L = L~PDE~ + L~IC~ + L~BC~ [^1] $$

![Alt text](/images/articles/figure.webp "Caption shown under the image")

```py title="example.py"
print("hello")
```

> [!NOTE]
> Callouts: NOTE, TIP and WARNING.

[^1]: Author, “Title,” _Journal_, 2024. [DOI](https://doi.org/…)
````

Put images in `public/images/articles/`. Footnote definitions become a numbered **Sources** list at the end of the article.
Code blocks are highlighted for `ts`, `tsx`, `js`, `py`, `cs` and `bash`.

## Styling conventions

- **Tokens** live in `src/app/globals.css`. Colors come from one `--hue`, exposed as `bg-bg`, `text-fg`, `text-muted`, `border-border`, `bg-card` and `text-accent`. There are also type steps (`text-2xs`, `text-3xs`, `text-code`), `tracking-display`, `leading-display`, `ease-out-expo` and `blur-glow`.
- **Reusable utilities** cover patterns that would otherwise repeat, and work on any element:
  - Buttons combine a size and a variant: `btn btn-md btn-primary` or `btn btn-sm btn-secondary`.
  - Icons and socials: `icon-btn size-9` and `social-btn`.
  - Labels: `tag` for tech labels, `chip` for pills, `badge` for status, `eyebrow` for uppercase mono labels.
  - Text and panels: `link`, `glass`, `text-gradient`.
- **Layers:** element defaults sit in `@layer base`, so utility classes always win. Multi-part styles (spotlight cards, code tokens) sit in `@layer components`.
- **Motion:** JS animations use `EASE_OUT` and `SPRING` from `src/lib/motion.ts`, which match the CSS `ease-out-expo` token. Everything respects `prefers-reduced-motion`.

## Features

- Animated hero with a draggable, self-typing code window (`about.ts`) and a terminal output.
- Dark / light / system theme with a circular reveal transition, plus 8 accent colors.
- Simple navigation: crawlable header links, a full-screen mobile menu, a skip-to-content link, and a ⌘K / Ctrl K command palette.
- Projects with filters and spotlight/tilt cards, an About grid with a live clock, and an education timeline.
- Articles with search and tag filters, a table of contents with reading progress, citations and sources, and an RSS feed (`/articles/rss.xml`).
- Sitemap and robots files, Open Graph data and JSON-LD for search engines and link previews.
- Respects reduced-motion settings. Uses no tracking.

## Structure

```
content/articles/     Articles (.md)
public/               Images, .nojekyll
src/
  app/                Home, about, privacy, articles/[slug], rss.xml, sitemap, robots, icons
  components/         Sections (hero, projects, about, experience, latest-articles, contact),
                      nav, command palette, code window, theme provider
    article/          Markdown renderer, table of contents, list, cover, share
    ui/               Primitives (Reveal, SpotlightCard, Magnetic, …) and page shell
  data/site.ts        ← all home-page content
  lib/                highlight.ts, markdown.ts, articles.ts, utils.ts
```
