export const ARTICLES = [
  { id: "a1", title: "Hello Next.js",  excerpt: "Démarrer avec Next.js…",  content: "Contenu de l’article a1." },
  { id: "a2", title: "Routing",        excerpt: "Comprendre le routage…",  content: "Contenu de l’article a2." },
];

export function getArticleById(id) {
  return ARTICLES.find(a => a.id === id);
}
