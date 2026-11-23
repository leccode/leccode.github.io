import { site } from "@/data/site";
import { getAllArticles } from "@/lib/articles";

export const dynamic = "force-static";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function GET() {
  const items = getAllArticles()
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${site.url}/articles/${a.slug}/</link>
      <guid>${site.url}/articles/${a.slug}/</guid>
      <pubDate>${new Date(`${a.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
${a.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.name)} — Articles</title>
    <link>${site.url}/articles/</link>
    <description>${esc(site.tagline)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
