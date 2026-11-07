import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * - `output: "export"` writes plain HTML/CSS/JS to `out/`.
 * - `trailingSlash` emits `/about/index.html`, which GitHub Pages serves reliably.
 * - Image optimization needs a server, so images are served as-is
 *   (they are pre-optimized in `public/`).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
