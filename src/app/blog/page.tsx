import type { Metadata } from "next";
import { articles } from "@/data/articles";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArticleList } from "@/components/article/ArticleList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on deep learning, quantum computing and software engineering.",
  alternates: { canonical: "/blog/" },
};

export default function BlogPage() {
  return (
    <Container size="narrow" className="py-16 sm:py-24">
      <PageHeader title="Science & tech blog">
        <p>Notes on deep learning, quantum computing and code.</p>
      </PageHeader>
      <ArticleList articles={articles} />
    </Container>
  );
}
