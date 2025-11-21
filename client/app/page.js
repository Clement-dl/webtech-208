import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-center">
      <section className="container glass p-10 md:p-8 sm:p-6 rounded-3xl shadow-lg flex flex-col items-start animate-fade-in-up">
        <h1 className="text-5xl font-extrabold gradient-text mb-4 md:text-4xl sm:text-3xl">
          Alt-Endings
        </h1>

        <p className="text-lg text-neutral-300 mb-8 max-w-2xl md:text-base sm:text-sm">
          Réécris la fin. Vote pour la meilleure. Choisis une œuvre culte,
          propose ta fin alternative et découvre celles des autres.
        </p>

        <div className="flex gap-4 flex-wrap mb-10">
          <Link
            href="/works"
            className="btn-primary"
          >
            Voir les œuvres
          </Link>

          <Link
            href="/works/w1/submit"
            className="btn-secondary"
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
