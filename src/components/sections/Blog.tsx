import Link from "next/link";
import { articles } from "@/data/articles";
import { Section } from "@/components/ui/Section";
import { ArticleList } from "@/components/article/ArticleList";

export function Blog() {
  return (
    <Section
      id="blog"
      title="Science & tech blog"
      lede="Notes on deep learning, quantum computing and code."
    >
      <ArticleList articles={articles} />
      <Link
        href="/blog/"
        className="text-link mt-8 inline-block text-sm font-medium"
      >
        All articles
      </Link>
    </Section>
  );
}
