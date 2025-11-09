import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Alt-Endings</h1>
        <p className="text-sm text-neutral-300 mb-8 max-w-xl">
          Réécris la fin. Vote pour la meilleure. Choisis une œuvre culte,
          propose ta fin alternative et découvre celles des autres.
        </p>

        <div className="flex gap-4 mb-10">
          <Link
            href="/works"
            className="px-4 py-2 rounded-md bg-white text-black text-sm font-semibold"
          >
            Voir les œuvres
          </Link>
          <Link
            href="/works/w1/submit"
            className="px-4 py-2 rounded-md border border-white text-sm font-semibold"
          >
            Proposer une fin
          </Link>
        </div>

        <p className="text-xs text-neutral-400">
          Merci de marquer clairement vos spoilers et de rester respectueux.
        </p>
      </section>
    </main>
  );
}
