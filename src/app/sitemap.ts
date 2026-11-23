import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllArticles } from "@/lib/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about/", "/articles/", "/privacy/"].map((path) => ({
    url: `${site.url}${path}`,
  }));
  const posts = getAllArticles().map((a) => ({
    url: `${site.url}/articles/${a.slug}/`,
    lastModified: a.date,
  }));
  return [...pages, ...posts];
}
