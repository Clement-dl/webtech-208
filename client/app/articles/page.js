import Link from "next/link";
import { ARTICLES } from "@/lib/fakeDb";

export default function ArticlesPage() {
  return (
    <section>
      <h2>Articles</h2>
      <ul>
        {ARTICLES.map(a => (
          <li key={a.id} style={{ margin: "8px 0" }}>
            <strong>{a.title}</strong> — {a.excerpt}{" "}
            <Link href={`/articles/${a.id}`}>Lire</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
