import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, publishedArticles } from "@/data/articles";
import { articleContent } from "@/content/articles";
import { siteConfig } from "@/lib/site";
import { ArticleLayout } from "@/components/article/ArticleLayout";

type Params = { slug: string };
type PageProps = { params: Promise<Params> };

// Static export: every article page is generated at build time.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return publishedArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const path = `/blog/${article.slug}/`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      authors: [siteConfig.name],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  const content = articleContent[slug];
  if (!article || !content) notFound();

  const { Body, sources } = content;

  return (
    <ArticleLayout article={article} sources={sources}>
      <Body />
    </ArticleLayout>
  );
}
