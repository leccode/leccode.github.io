import type { MetadataRoute } from "next";
import { publishedArticles } from "@/data/articles";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about/", "/blog/", "/privacy/"].map((path) => ({
    url: `${siteConfig.url}${path}`,
  }));

  const posts = publishedArticles.map((article) => ({
    url: `${siteConfig.url}/blog/${article.slug}/`,
    lastModified: article.publishedAt,
  }));

  return [...pages, ...posts];
}
