import type { ComponentType } from "react";
import type { Source } from "@/components/article/ArticleLayout";
import * as pinns from "./physics-informed-neural-networks";

export type ArticleContent = {
  Body: ComponentType;
  sources?: readonly Source[];
};

/** Maps an article slug (see data/articles.ts) to its content. */
export const articleContent: Record<string, ArticleContent> = {
  "physics-informed-neural-networks": pinns,
};
