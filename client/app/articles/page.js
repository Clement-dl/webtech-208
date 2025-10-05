import Link from "next/link";

const fakeArticles = [
  { id: "a1", title: "Hello Next.js", excerpt: "Démarrer avec Next.js" },
  { id: "a2", title: "Routing", excerpt: "Comprendre le routage" },
];

export default function ArticlesPage() {
  return (
    <section>
      <h2>Articles</h2>
      <ul>
        {fakeArticles.map(a => (
          <li key={a.id} style={{ margin: "8px 0" }}>
            <strong>{a.title}</strong> — {a.excerpt}{" "}
            <Link href={`/articles/${a.id}`}>Lire</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
