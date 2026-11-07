export type Article = {
  slug: string;
  title: string;
  description: string;
  tags: readonly string[];
  /** ISO date (YYYY-MM-DD). Omit for upcoming articles. */
  publishedAt?: string;
};

export const articles: readonly Article[] = [
  {
    slug: "physics-informed-neural-networks",
    title: "Physics-Informed Neural Networks",
    description:
      "How PINNs embed physical laws into training when data is scarce.",
    tags: ["Deep learning", "Science"],
    publishedAt: "2026-10-31",
  },
  {
    slug: "quantum-computing-foundations",
    title: "Quantum Computing",
    description: "Foundations, limits, and how much of it is hype.",
    tags: ["Quantum", "Science"],
  },
  {
    slug: "your-first-rust-program",
    title: "Your First Rust Program",
    description: "A step-by-step console application in Rust.",
    tags: ["Rust", "Tech"],
  },
];

export const publishedArticles = articles.filter(
  (article): article is Article & { publishedAt: string } =>
    Boolean(article.publishedAt),
);

export function getArticle(slug: string) {
  return publishedArticles.find((article) => article.slug === slug);
}
