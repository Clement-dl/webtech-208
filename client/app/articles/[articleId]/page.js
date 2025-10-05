import { notFound } from "next/navigation";
import { ARTICLES, getArticleById } from "@/lib/fakeDb";

export default function ArticlePage({ params }) {
  const { articleId } = params;
  const article = getArticleById(articleId);
  if (!article) return notFound();

  return (
    <article>
      <h2>{article.title}</h2>
      <p><em>ID :</em> {article.id}</p>
      <p>{article.content}</p>
    </article>
  );
}
