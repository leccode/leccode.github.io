import Link from "next/link";
import type { Article } from "@/data/articles";
import { formatDate } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";

function ArticleRow({ article }: { article: Article }) {
  const body = (
    <>
      <div className="text-sm text-muted sm:w-40 sm:shrink-0 sm:pt-1">
        {article.publishedAt ? (
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        ) : (
          <Tag>Coming soon</Tag>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="text-xl font-medium tracking-tight transition-colors group-hover:text-accent">
          {article.title}
        </h3>
        <p className="mt-1 text-pretty text-muted">{article.description}</p>
      </div>
    </>
  );

  const rowClass = "flex flex-col gap-3 py-7 sm:flex-row sm:gap-8";

  return (
    <li>
      {article.publishedAt ? (
        <Link href={`/blog/${article.slug}/`} className={`group ${rowClass}`}>
          {body}
        </Link>
      ) : (
        <div className={`${rowClass} opacity-70`}>{body}</div>
      )}
    </li>
  );
}

export function ArticleList({ articles }: { articles: readonly Article[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {articles.map((article) => (
        <ArticleRow key={article.slug} article={article} />
      ))}
    </ul>
  );
}
