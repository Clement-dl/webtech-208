import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Alt-Endings</h2>
      <p className="mb-4 text-neutral-300">
        Réécris la fin. Vote pour la meilleure. Choisis une œuvre culte,
        propose ta fin alternative et découvre celles des autres.
      </p>

      <div className="space-x-2">
        <Link
          href="/works"
          className="inline-block bg-white text-black border rounded px-4 py-2 text-sm"
        >
          Voir les œuvres
        </Link>
        <Link
          href="/works"
          className="inline-block border border-white rounded px-4 py-2 text-sm"
        >
          Proposer une fin
        </Link>
      </div>

      <hr className="border-neutral-700 my-6" />

      <p className="text-sm text-neutral-400">
        Merci de marquer clairement vos spoilers et de rester respectueux.
      </p>
    </section>
  );
}
