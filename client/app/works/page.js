import Link from "next/link";
import Poster from "@/components/Poster";
import { WORKS, ENDINGS } from "@/lib/fakeDb";

export default function WorksPage() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Œuvres</h2>

      {/* Grille responsive : 1 / 2 / 3 colonnes */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WORKS.map((w) => {
          const count = ENDINGS.filter((e) => e.workId === w.id).length;

          return (
            <li
              key={w.id}
              className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950"
            >
              {/* affiche l'affiche du film/épisode */}
              <div className="w-full">
                <Poster
                  workId={w.id}
                  alt={w.title}
                  className="w-full h-auto block"
                />
              </div>

              <div className="p-3">
                <div className="font-medium">{w.title}</div>
                <div className="text-sm text-neutral-400 mb-2">
                  {w.year} · {w.type}
                </div>

                <div className="text-xs text-neutral-400 mb-3">
                  {count} fin(s) proposée(s)
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/works/${w.id}`}
                    className="px-3 py-1 text-sm bg-white text-black rounded border"
                  >
                    Voir les fins
                  </Link>
                  <Link
                    href={`/works/${w.id}/submit`}
                    className="px-3 py-1 text-sm rounded border underline"
                  >
                    Proposer une fin
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
